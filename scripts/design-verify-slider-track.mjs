#!/usr/bin/env node

// Slider と RangeSlider の「埋まった部分」と「空の溝」が、両モードで 3:1 以上
// 見分けられるかを見張る。
//
// ⚠️ なぜ要るのか（#1034・2026-09-25）:
// 溝の塗りに --input（入力欄の縁の色）を流用していた。--input を 3:1 まで濃く
// したら、埋まった部分（--primary）と空の溝の比が light 1.39／dark 1.30 まで落ち、
// 値の位置が色相でしか読めなくなった（前は 4.48／4.58）。塗りは面のトークン
// （--muted）に移した。部品のソースで溝のトークンを差し替えると、この検査が
// トークンの値で比を計算し直す。
//
// WCAG 2.1 の 1.4.11 Non-text Contrast は、部品の状態を示す図形に 3:1 を求める。

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"
import { contrastRatio, extractVarsForSelector } from "./design-verify-high-contrast-border.mjs"

const MIN_NON_TEXT_CONTRAST = 3

const GLOBALS_PATH = "src/globals.css"
const SLIDER_PATH = "src/components/inputs/Slider.tsx"
const RANGE_SLIDER_PATH = "src/components/inputs/RangeSlider.tsx"

const THEMES = [
  { name: "light", selector: ":root" },
  { name: "dark", selector: ".dark" },
]

/**
 * Slider は `linear-gradient(... hsl(var(--fill)) ${pct}%, hsl(var(--track)) ${pct}% ...)`
 * と、`appearance-none` と同じ class 列の `bg-<track>` の2か所で溝を塗る。
 */
export function extractSliderTokens(source) {
  const gradient = source.match(
    /hsl\(var\((--[a-z0-9-]+)\)\)\s*\$\{pct\}%\s*,\s*hsl\(var\((--[a-z0-9-]+)\)\)\s*\$\{pct\}%/
  )
  const trackClass = source.match(/"[^"]*appearance-none[^"]*\bbg-([a-z0-9-]+)\b/)
  return {
    fill: gradient?.[1] ?? null,
    tracks: [gradient?.[2], trackClass ? `--${trackClass[1]}` : null].filter(Boolean),
  }
}

/**
 * RangeSlider は `absolute left-0 right-0 h-2 rounded-full bg-<track>`（溝）と、
 * `rangeClassName` を受ける `absolute h-2 rounded-full bg-<fill>`（埋まった部分）。
 */
export function extractRangeSliderTokens(source) {
  const track = source.match(/"absolute left-0 right-0 h-2 rounded-full bg-([a-z0-9-]+)"/)
  const fill = source.match(/"absolute h-2 rounded-full bg-([a-z0-9-]+)",\s*rangeClassName/)
  return {
    fill: fill ? `--${fill[1]}` : null,
    tracks: track ? [`--${track[1]}`] : [],
  }
}

export function collectSliderTrackFindings({ css, sources }) {
  const findings = []
  const parts = [
    { name: "Slider", file: SLIDER_PATH, tokens: extractSliderTokens(sources.slider) },
    { name: "RangeSlider", file: RANGE_SLIDER_PATH, tokens: extractRangeSliderTokens(sources.rangeSlider) },
  ]

  for (const part of parts) {
    if (!part.tokens.fill || part.tokens.tracks.length === 0) {
      findings.push({
        message: `${part.file}: 埋まった部分と溝の塗りのトークンが読めません（書き方が変わったらこの検査の読み取りも直すこと）。`,
      })
      continue
    }
    for (const theme of THEMES) {
      const vars = extractVarsForSelector(css, theme.selector)
      if (!vars) {
        findings.push({ message: `${GLOBALS_PATH}: ${theme.selector} のブロックが読めません。` })
        continue
      }
      const fill = vars[part.tokens.fill]
      for (const trackVar of new Set(part.tokens.tracks)) {
        const track = vars[trackVar]
        if (!fill || !track) {
          findings.push({
            message: `${part.name}: ${theme.name} に ${!fill ? part.tokens.fill : trackVar} がありません。`,
          })
          continue
        }
        const ratio = contrastRatio(fill, track)
        if (ratio < MIN_NON_TEXT_CONTRAST) {
          findings.push({
            message:
              `${part.name}: ${theme.name} の埋まった部分 ${part.tokens.fill} (${fill}) と空の溝 ` +
              `${trackVar} (${track}) の比が ${ratio.toFixed(3)}:1 しかありません（WCAG 1.4.11 は ${MIN_NON_TEXT_CONTRAST}:1）。`,
          })
        }
      }
    }
  }

  return findings
}

export function verifySliderTrack({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "design-verify-slider-track: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const findings = collectSliderTrackFindings({
    css: readFileSync(join(root, GLOBALS_PATH), "utf-8"),
    sources: {
      slider: readFileSync(join(root, SLIDER_PATH), "utf-8"),
      rangeSlider: readFileSync(join(root, RANGE_SLIDER_PATH), "utf-8"),
    },
  })
  if (findings.length === 0) return

  throwLinesError([
    "design:verify: スライダーの埋まった部分と空の溝が 3:1 で見分けられません。",
    "⚠️ 溝は面のトークン（--muted など）で塗ること。--input は入力欄の縁の色です。",
    ...findings.map((finding) => `- ${finding.message}`),
  ])
}

// ---------------------------------------------------------------------------
// 自己検査
// ---------------------------------------------------------------------------

const FIXTURE_CSS = `
:root { --primary: 220 62% 49%; --muted: 213 32% 89%; --input: 215 20% 52%; }
.dark { --primary: 218 68% 63%; --muted: 217.2 32.6% 17.5%; --input: 215 20% 51%; }
`

const sliderSource = (track, bg = track) =>
  "background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--" +
  track +
  ")) ${pct}%, hsl(var(--" +
  track +
  ")) 100%)`,\n" +
  `className={cn("h-5 w-full cursor-pointer appearance-none rounded-[10px] bg-${bg} disabled:opacity-50")}`

const rangeSource = (track) =>
  `className={cn("absolute left-0 right-0 h-2 rounded-full bg-${track}", trackClassName)}\n` +
  `className={cn("absolute h-2 rounded-full bg-primary", rangeClassName)}`

// ⭐ 1本目は「--input を濃くしたときに実際に起きた値」＝bg-input の溝（light 1.39）。
const SELF_TEST_FIXTURES = [
  {
    name: "bg-input の溝（light 1.39:1）を落とす",
    sources: { slider: sliderSource("input"), rangeSlider: rangeSource("muted") },
    expectMin: 2,
    expectMentions: "Slider: light の埋まった部分 --primary (220 62% 49%) と空の溝 --input",
  },
  {
    name: "採用した bg-muted の溝は通す",
    sources: { slider: sliderSource("muted"), rangeSlider: rangeSource("muted") },
    expectMin: 0,
  },
  {
    name: "RangeSlider だけ bg-input に戻したら落とす",
    sources: { slider: sliderSource("muted"), rangeSlider: rangeSource("input") },
    expectMin: 2,
    expectMentions: "RangeSlider: dark",
  },
  {
    name: "グラデーションは muted でも class だけ bg-input なら落とす",
    sources: { slider: sliderSource("muted", "input"), rangeSlider: rangeSource("muted") },
    expectMin: 2,
    expectMentions: "空の溝 --input",
  },
  {
    name: "書き方が変わって読めなくなったら落とす",
    sources: { slider: "background: hsl(var(--primary))", rangeSlider: rangeSource("muted") },
    expectMin: 1,
    expectMentions: "読めません",
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const findings = collectSliderTrackFindings({ css: FIXTURE_CSS, sources: fixture.sources })
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

const isCli = process.argv[1] && process.argv[1].endsWith("design-verify-slider-track.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("design-verify-slider-track: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("design-verify-slider-track: self-test passed")
} else {
  runVerificationCli({
    scriptName: "design-verify-slider-track.mjs",
    verify: verifySliderTrack,
    successMessage: "design:verify: slider track passed",
  })
}
