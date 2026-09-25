#!/usr/bin/env node

// 入力欄の縁（--input）が、入力欄を置きうる入れ物の面すべての上で 3:1 以上あるかを
// 見張る。通常時とハイコントラスト時（prefers-contrast: more）の両方を見る。
//
// ⚠️ なぜ要るのか（#1023・2026-09-25）:
// --input は長く --border と同じ値（light 214 32% 91%／dark 217.2 32.6% 17.5%）で、
// 地の上で light 1.14:1・dark 1.37:1 しかなかった。WCAG 2.1 の 1.4.11 Non-text
// Contrast は部品の境界に 3:1 を求めるので、枠線をやめる作業より前から不適合だった。
// さらにハイコントラストで上がるのは --border だけで、入力欄は --input を使うため
// 「ハイコントラストにしても入力欄だけ薄い」状態だった。
//
// 面を「入れ物」に絞っている理由: --secondary（ボタン・ピル・Kbd の塗り）や
// *-subtle（状態の塗り）は入力欄を置く入れ物ではない。ここに入れると、入れ物の上で
// 必要な値より濃い縁を強いることになる。⛔ 入力欄を secondary などの塗りの上に置く
// 部品を作ったら、この一覧に足す前に値を HQ に相談すること（DECISIONS.md 2026-09-25）。
//
// 検査する場所は design-verify-high-contrast-border.mjs と同じ2つ:
//   - src/globals.css
//   - public/tokens.css（ハイコントラストのブロックは
//     scripts/design-sync/sync-standalone-tokens.mjs がハードコードしている）

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"
import {
  contrastRatio,
  extractHighContrastBlock,
  extractVarsForSelector,
} from "./design-verify-high-contrast-border.mjs"

const MIN_NON_TEXT_CONTRAST = 3

const CHECKED_FILES = ["src/globals.css", "public/tokens.css"]

// 入力欄が置かれうる入れ物の面。⛔ ここから減らさないこと。
const CONTAINER_SURFACE_VARS = ["--background", "--card", "--popover", "--muted"]

const THEMES = [
  { name: "light", selector: ":root" },
  { name: "dark", selector: ".dark" },
]

export function collectInputBorderFindings(css, filePath) {
  const findings = []
  const highContrastCss = extractHighContrastBlock(css)

  for (const theme of THEMES) {
    const baseVars = extractVarsForSelector(css, theme.selector)
    if (!baseVars) {
      findings.push({ message: `${filePath}: ${theme.selector} のブロックが読めません。` })
      continue
    }
    const baseInput = baseVars["--input"]
    if (!baseInput) {
      findings.push({ message: `${filePath}: ${theme.name} に --input がありません。` })
      continue
    }

    const highContrastVars = highContrastCss
      ? extractVarsForSelector(highContrastCss, theme.selector)
      : null
    const highContrastInput = highContrastVars?.["--input"]
    const highContrastBorder = highContrastVars?.["--border"]

    if (!highContrastInput) {
      findings.push({
        message:
          `${filePath}: prefers-contrast: more の中に ${theme.name} の --input がありません` +
          `（ハイコントラストで --border だけが上がり、入力欄の縁が薄いまま残ります）。`,
      })
    } else if (highContrastBorder && highContrastInput !== highContrastBorder) {
      findings.push({
        message:
          `${filePath}: ${theme.name} のハイコントラスト --input (${highContrastInput}) が ` +
          `--border (${highContrastBorder}) と違います（同じ値にそろえる決まり・DECISIONS.md 2026-09-25）。`,
      })
    }

    const modes = [{ label: "通常時", input: baseInput }]
    if (highContrastInput) modes.push({ label: "ハイコントラスト時", input: highContrastInput })

    for (const mode of modes) {
      for (const surfaceVar of CONTAINER_SURFACE_VARS) {
        const surface = baseVars[surfaceVar]
        if (!surface) {
          findings.push({
            message: `${filePath}: ${theme.name} に ${surfaceVar} がありません（面の一覧と実体がずれています）。`,
          })
          continue
        }
        const ratio = contrastRatio(surface, mode.input)
        if (ratio < MIN_NON_TEXT_CONTRAST) {
          findings.push({
            message:
              `${filePath}: ${theme.name} ${mode.label}の --input (${mode.input}) は ` +
              `${surfaceVar} (${surface}) の上で ${ratio.toFixed(3)}:1 しかありません` +
              `（WCAG 1.4.11 は ${MIN_NON_TEXT_CONTRAST}:1）。`,
          })
        }
      }
    }
  }

  return findings
}

export function verifyInputBorder({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "design-verify-input-border: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const findings = []
  for (const filePath of CHECKED_FILES) {
    const css = readFileSync(join(root, filePath), "utf-8")
    findings.push(...collectInputBorderFindings(css, filePath))
  }

  if (findings.length === 0) return

  throwLinesError([
    "design:verify: 入力欄の縁（--input）が入れ物の面の上で 3:1 に届いていません。",
    "⚠️ 地だけでなく card・popover・muted の上でも、通常時とハイコントラスト時の両方で 3:1 が要ります。",
    ...findings.map((finding) => `- ${finding.message}`),
  ])
}

// ---------------------------------------------------------------------------
// 自己検査
// ---------------------------------------------------------------------------

const LIGHT_SURFACES =
  "--background: 210 40% 96%; --card: 0 0% 100%; --popover: 0 0% 100%; --muted: 213 32% 89%;"
const DARK_SURFACES =
  "--background: 222.2 84% 4.9%; --card: 217 33% 13%; --popover: 217 33% 22%; --muted: 217.2 32.6% 17.5%;"

// ⭐ 1本目は「2026-09-25 まで出荷していた値」そのもの。この検査を入れた意味は、
//    この固定文が落ちることで示される。
const SELF_TEST_FIXTURES = [
  {
    name: "出荷していた値（light 214 32% 91%）を落とす",
    css: `
:root { ${LIGHT_SURFACES} --border: 214 32% 91%; --input: 214 32% 91%; }
.dark { ${DARK_SURFACES} --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; } .dark { --border: 215 20% 55%; } }
`,
    expectMin: 1,
    expectMentions: "light 通常時の --input (214 32% 91%)",
  },
  {
    name: "採用した値（light 215 20% 52%／dark 215 20% 51%・ハイコントラストは --border と同じ）は通す",
    css: `
:root { ${LIGHT_SURFACES} --border: 214 32% 91%; --input: 215 20% 52%; }
.dark { ${DARK_SURFACES} --border: 217.2 32.6% 17.5%; --input: 215 20% 51%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; --input: 215 20% 40%; } .dark { --border: 215 20% 55%; --input: 215 20% 55%; } }
`,
    expectMin: 0,
  },
  {
    name: "ハイコントラストで --input を上げ忘れたら落とす",
    css: `
:root { ${LIGHT_SURFACES} --border: 214 32% 91%; --input: 215 20% 52%; }
.dark { ${DARK_SURFACES} --border: 217.2 32.6% 17.5%; --input: 215 20% 51%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; } .dark { --border: 215 20% 55%; } }
`,
    expectMin: 2,
    expectMentions: "prefers-contrast: more の中に light の --input がありません",
  },
  {
    name: "muted の上だけ割る値（light 215 20% 55%）を落とす＝地だけ見る検査にしない",
    css: `
:root { ${LIGHT_SURFACES} --border: 214 32% 91%; --input: 215 20% 55%; }
.dark { ${DARK_SURFACES} --border: 217.2 32.6% 17.5%; --input: 215 20% 51%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; --input: 215 20% 40%; } .dark { --border: 215 20% 55%; --input: 215 20% 55%; } }
`,
    expectMin: 1,
    expectMentions: "--muted (213 32% 89%)",
  },
  {
    name: "popover の古い値で決めかけた値（dark 215 20% 50%）を popover の上で落とす",
    css: `
:root { ${LIGHT_SURFACES} --border: 214 32% 91%; --input: 215 20% 52%; }
.dark { ${DARK_SURFACES} --border: 217.2 32.6% 17.5%; --input: 215 20% 50%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; --input: 215 20% 40%; } .dark { --border: 215 20% 55%; --input: 215 20% 55%; } }
`,
    expectMin: 1,
    expectMentions: "--popover (217 33% 22%)",
  },
  {
    name: "standalone 版の複数セレクタ（.dark, [data-theme=\"dark\"]）も読む",
    css: `
:root { ${LIGHT_SURFACES} --border: 214 32% 91%; --input: 215 20% 52%; }
.dark, [data-theme="dark"] { ${DARK_SURFACES} --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; --input: 215 20% 40%; } .dark, [data-theme="dark"] { --border: 215 20% 55%; --input: 215 20% 55%; } }
`,
    expectMin: 1,
    expectMentions: "dark 通常時",
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const findings = collectInputBorderFindings(fixture.css, "fixture.css")
    const text = findings.map((finding) => finding.message).join("\n")
    let ok = fixture.expectMin === 0 ? findings.length === 0 : findings.length >= fixture.expectMin
    if (ok && fixture.expectMentions) ok = text.includes(fixture.expectMentions)
    if (!ok) {
      failures.push(
        `${fixture.name}: expected ${fixture.expectMin === 0 ? "no findings" : `>= ${fixture.expectMin} findings mentioning ${fixture.expectMentions}`}, got ${findings.length}: ${text.slice(0, 300)}`
      )
    }
    if (verbose) console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
  }
  return failures
}

const isCli = process.argv[1] && process.argv[1].endsWith("design-verify-input-border.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("design-verify-input-border: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("design-verify-input-border: self-test passed")
} else {
  runVerificationCli({
    scriptName: "design-verify-input-border.mjs",
    verify: verifyInputBorder,
    successMessage: "design:verify: input border passed",
  })
}
