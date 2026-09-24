#!/usr/bin/env node

// ハイコントラスト（prefers-contrast: more）の --border が、**すべての面トークンの
// 上で** 3:1 以上あることを見張る。
//
// ⚠️ なぜ「全面」なのか（2026-09-22 の見落とし）:
// #1020 で dark の値を 215 20% 45% に決めたとき、見たのは地（--background）との
// 比 3.90:1 だけだった。ところが枠が引かれるのは地の上とは限らない。カードの上
// （3.234）、muted の上（2.853）、success-subtle の上（2.594）…と、10面のうち
// 5面で 3:1 を割っていた。215 20% 55% にして全面の最小が 3.678 になった。
// 地だけを見る検査では同じ見落としが必ず再発するので、ここは全面を回す。
//
// WCAG 2.1 の 1.4.11 Non-text Contrast は UI 部品の境界に 3:1 を求めている。
// 面の濃淡で区切る方針（DECISIONS.md 2026-09-22）では、ハイコントラストで戻る
// この枠線が唯一の担保なので、ここが緑であることが方針の前提になる。
//
// 検査する場所は2つ。値が2か所に書かれていて、ずれると standalone 版の採用先
// だけが古い枠線になるため:
//   - src/globals.css の @media (prefers-contrast: more)
//   - public/tokens.css（scripts/design-sync/sync-standalone-tokens.mjs が
//     ハードコードした文字列から生成される）

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

const MIN_NON_TEXT_CONTRAST = 3

const CHECKED_FILES = ["src/globals.css", "public/tokens.css"]

// 枠線が実際に引かれうる面。塗りに使われるトークンを全部入れる。
// ⛔ ここから減らさないこと（減らした面が次の見落としになる）。
const SURFACE_VARS = [
  "--background",
  "--card",
  "--popover",
  "--muted",
  "--secondary",
  "--accent",
  "--primary-subtle",
  "--info-subtle",
  "--success-subtle",
  "--warning-subtle",
  "--destructive-subtle",
]

// 明暗それぞれで、素の値を読むセレクタと、ハイコントラストの上書きを読むセレクタ。
const THEMES = [
  { name: "light", baseSelector: ":root", highContrastSelector: ":root" },
  { name: "dark", baseSelector: ".dark", highContrastSelector: ".dark" },
]

function parseHsl(value) {
  const parts = value.match(/-?\d+(?:\.\d+)?/g)?.map(Number)
  if (!parts || parts.length < 3) throw new Error(`Expected HSL triplet, got "${value}".`)
  return { h: parts[0], s: parts[1] / 100, l: parts[2] / 100 }
}

function hslToRgb({ h, s, l }) {
  const hue = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = l - c / 2
  let rgb
  if (hue < 60) rgb = [c, x, 0]
  else if (hue < 120) rgb = [x, c, 0]
  else if (hue < 180) rgb = [0, c, x]
  else if (hue < 240) rgb = [0, x, c]
  else if (hue < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  return rgb.map((channel) => channel + m)
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a, b) {
  const la = relativeLuminance(hslToRgb(parseHsl(a)))
  const lb = relativeLuminance(hslToRgb(parseHsl(b)))
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * `@media (prefers-contrast: more)` の中身だけを切り出す。中に入れ子の `{}` が
 * あるので、正規表現ではなく括弧を数えて取る。
 */
export function extractHighContrastBlock(css) {
  const marker = css.indexOf("@media (prefers-contrast: more)")
  if (marker === -1) return null
  const open = css.indexOf("{", marker)
  if (open === -1) return null
  let depth = 0
  for (let index = open; index < css.length; index += 1) {
    const char = css[index]
    if (char === "{") depth += 1
    else if (char === "}") {
      depth -= 1
      if (depth === 0) return css.slice(open + 1, index)
    }
  }
  return null
}

/**
 * `selector` のブロックから宣言を読む。`.dark, [data-theme="dark"] {` のような
 * 複数セレクタにも当たるよう、セレクタ列のどこかに現れれば拾う。
 */
export function extractVarsForSelector(css, selector) {
  const pattern = new RegExp(
    `(^|[},])([^{}]*${escapeRegExp(selector)}[^{}]*)\\{([^{}]*)\\}`,
    "m"
  )
  const match = pattern.exec(css)
  if (!match) return null
  return Object.fromEntries(
    [...match[3].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
  )
}

export function collectFindings(css, filePath) {
  const findings = []
  const highContrastCss = extractHighContrastBlock(css)
  if (highContrastCss === null) {
    findings.push({
      fatal: true,
      message: `${filePath}: @media (prefers-contrast: more) のブロックが見つかりません（ハイコントラストで枠線に戻す担保が消えています）。`,
    })
    return findings
  }

  for (const theme of THEMES) {
    const baseVars = extractVarsForSelector(css, theme.baseSelector)
    const highContrastVars = extractVarsForSelector(highContrastCss, theme.highContrastSelector)

    if (!baseVars) {
      findings.push({ fatal: true, message: `${filePath}: ${theme.baseSelector} のブロックが読めません。` })
      continue
    }
    if (!highContrastVars || !highContrastVars["--border"]) {
      findings.push({
        fatal: true,
        message: `${filePath}: prefers-contrast: more の中に ${theme.highContrastSelector} の --border がありません（${theme.name}）。`,
      })
      continue
    }

    const border = highContrastVars["--border"]
    for (const surfaceVar of SURFACE_VARS) {
      const surface = baseVars[surfaceVar]
      if (!surface) {
        findings.push({
          message: `${filePath}: ${theme.name} に ${surfaceVar} がありません（面の一覧と実体がずれています）。`,
        })
        continue
      }
      const ratio = contrastRatio(surface, border)
      if (ratio < MIN_NON_TEXT_CONTRAST) {
        findings.push({
          message:
            `${filePath}: ${theme.name} のハイコントラスト --border (${border}) は ` +
            `${surfaceVar} (${surface}) の上で ${ratio.toFixed(3)}:1 しかありません` +
            `（WCAG 1.4.11 は ${MIN_NON_TEXT_CONTRAST}:1）。`,
        })
      }
    }
  }

  return findings
}

export function verifyHighContrastBorder({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "design-verify-high-contrast-border: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const findings = []
  for (const filePath of CHECKED_FILES) {
    const css = readFileSync(join(root, filePath), "utf-8")
    findings.push(...collectFindings(css, filePath))
  }

  if (findings.length === 0) return

  throwLinesError([
    "design:verify: ハイコントラストの --border が面の上で 3:1 に届いていません。",
    "⚠️ 地（--background）だけでなく、枠線が引かれうる全部の面で 3:1 が要ります。",
    "面の濃淡で区切る方針（DECISIONS.md 2026-09-22）では、この枠線が唯一の担保です。",
    ...findings.map((finding) => `- ${finding.message}`),
  ])
}

// ---------------------------------------------------------------------------
// 自己検査
// ---------------------------------------------------------------------------

// ⭐ 1本目は「2026-09-22 に実際に見落とした値」そのもの。この検査を入れた意味は、
//    この固定文が落ちることで示される。
const SELF_TEST_FIXTURES = [
  {
    name: "見落とした値（dark 215 20% 45%）を落とす",
    css: `
:root { --background: 210 40% 96%; --card: 0 0% 100%; --popover: 0 0% 100%; --muted: 213 32% 89%; --secondary: 212 32% 92%; --accent: 29 31% 87%; --primary-subtle: 220 70% 90%; --info-subtle: 214 95% 90%; --success-subtle: 141 60% 86%; --warning-subtle: 45 95% 80%; --destructive-subtle: 0 90% 92%; --border: 214 32% 91%; }
.dark { --background: 222.2 84% 4.9%; --card: 217 33% 13%; --popover: 222.2 84% 4.9%; --muted: 217.2 32.6% 17.5%; --secondary: 217.2 32.6% 17.5%; --accent: 14 22% 19%; --primary-subtle: 218 50% 18%; --info-subtle: 220 47% 16%; --success-subtle: 150 50% 14%; --warning-subtle: 38 60% 15%; --destructive-subtle: 0 50% 16%; --border: 217.2 32.6% 17.5%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; } .dark { --border: 215 20% 45%; } }
`,
    expectMin: 1,
    expectMentions: "--success-subtle",
  },
  {
    name: "採用した値（dark 215 20% 55%）は通す",
    css: `
:root { --background: 210 40% 96%; --card: 0 0% 100%; --popover: 0 0% 100%; --muted: 213 32% 89%; --secondary: 212 32% 92%; --accent: 29 31% 87%; --primary-subtle: 220 70% 90%; --info-subtle: 214 95% 90%; --success-subtle: 141 60% 86%; --warning-subtle: 45 95% 80%; --destructive-subtle: 0 90% 92%; --border: 214 32% 91%; }
.dark { --background: 222.2 84% 4.9%; --card: 217 33% 13%; --popover: 222.2 84% 4.9%; --muted: 217.2 32.6% 17.5%; --secondary: 217.2 32.6% 17.5%; --accent: 14 22% 19%; --primary-subtle: 218 50% 18%; --info-subtle: 220 47% 16%; --success-subtle: 150 50% 14%; --warning-subtle: 38 60% 15%; --destructive-subtle: 0 50% 16%; --border: 217.2 32.6% 17.5%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; } .dark { --border: 215 20% 55%; } }
`,
    expectMin: 0,
  },
  {
    name: "ハイコントラストのブロックごと消えたら落とす",
    css: `:root { --background: 0 0% 100%; --border: 214 32% 91%; }`,
    expectMin: 1,
    expectMentions: "prefers-contrast",
  },
  {
    name: "light を弱い値（215 20% 70%）にしたら落とす",
    css: `
:root { --background: 210 40% 96%; --card: 0 0% 100%; --popover: 0 0% 100%; --muted: 213 32% 89%; --secondary: 212 32% 92%; --accent: 29 31% 87%; --primary-subtle: 220 70% 90%; --info-subtle: 214 95% 90%; --success-subtle: 141 60% 86%; --warning-subtle: 45 95% 80%; --destructive-subtle: 0 90% 92%; --border: 214 32% 91%; }
.dark { --background: 222.2 84% 4.9%; --card: 217 33% 13%; --popover: 222.2 84% 4.9%; --muted: 217.2 32.6% 17.5%; --secondary: 217.2 32.6% 17.5%; --accent: 14 22% 19%; --primary-subtle: 218 50% 18%; --info-subtle: 220 47% 16%; --success-subtle: 150 50% 14%; --warning-subtle: 38 60% 15%; --destructive-subtle: 0 50% 16%; --border: 217.2 32.6% 17.5%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 70%; } .dark { --border: 215 20% 55%; } }
`,
    expectMin: 1,
    expectMentions: "light",
  },
  {
    name: "standalone 版の複数セレクタ（.dark, [data-theme=\"dark\"]）も読める",
    css: `
:root { --background: 210 40% 96%; --card: 0 0% 100%; --popover: 0 0% 100%; --muted: 213 32% 89%; --secondary: 212 32% 92%; --accent: 29 31% 87%; --primary-subtle: 220 70% 90%; --info-subtle: 214 95% 90%; --success-subtle: 141 60% 86%; --warning-subtle: 45 95% 80%; --destructive-subtle: 0 90% 92%; --border: 214 32% 91%; }
.dark, [data-theme="dark"] { --background: 222.2 84% 4.9%; --card: 217 33% 13%; --popover: 222.2 84% 4.9%; --muted: 217.2 32.6% 17.5%; --secondary: 217.2 32.6% 17.5%; --accent: 14 22% 19%; --primary-subtle: 218 50% 18%; --info-subtle: 220 47% 16%; --success-subtle: 150 50% 14%; --warning-subtle: 38 60% 15%; --destructive-subtle: 0 50% 16%; --border: 217.2 32.6% 17.5%; }
@media (prefers-contrast: more) { :root { --border: 215 20% 40%; } .dark, [data-theme="dark"] { --border: 215 20% 45%; } }
`,
    expectMin: 1,
    expectMentions: "dark",
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const findings = collectFindings(fixture.css, "fixture.css")
    const text = findings.map((finding) => finding.message).join("\n")
    let ok = fixture.expectMin === 0 ? findings.length === 0 : findings.length >= fixture.expectMin
    if (ok && fixture.expectMentions) ok = text.includes(fixture.expectMentions)
    if (!ok) {
      failures.push(
        `${fixture.name}: expected ${fixture.expectMin === 0 ? "no findings" : `>= ${fixture.expectMin} findings mentioning ${fixture.expectMentions}`}, got ${findings.length}: ${text.slice(0, 200)}`
      )
    }
    if (verbose) console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
  }
  return failures
}

const isCli = process.argv[1] && process.argv[1].endsWith("design-verify-high-contrast-border.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("design-verify-high-contrast-border: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("design-verify-high-contrast-border: self-test passed")
} else {
  runVerificationCli({
    scriptName: "design-verify-high-contrast-border.mjs",
    verify: verifyHighContrastBorder,
    successMessage: "design:verify: high contrast border passed",
  })
}
