#!/usr/bin/env node

// 数字を並べて見せる部品が、等幅の数字（font-variant-numeric: tabular-nums）を
// 持っているかを見張る。
//
// ⚠️ なぜ要るのか（#1040・2026-10-07）:
// 表の数値・日付・件数・バッジの数は、上下や前後で桁がそろっていないと読み比べ
// にくい。2026-10-07 に5画面を測ったら、数字だけの文字列のうち等幅になっていた
// のは 145 のうち 61（42%）だった。Table・DataTable・Badge とグラフのカードが
// 比例数字のまま数字を出していた。
//
// font-variant-numeric は子に継承されるので、部品の「根の要素」に1つ付ければ
// 中の数字はすべて等幅になる（文字には効かない）。この検査は、下の表の部品の
// 根の class にそれが残っているかを見る。部品を書き換えて外したら落ちる。
//
// ⭐ 部品を足すとき：数字を並べて見せる部品（表・グラフ・数のバッジ）なら、
// 根に tabular-nums を付けて、下の CONTRACT に1行足す。

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

const DIR = "src/components/display"

/**
 * 部品ごとに「根の class の文字列」を1つ拾う正規表現（捕獲群1が class の文字列）。
 * 根の書き方が変わって拾えなくなったら、それ自体を落とす（黙って通さない）。
 */
const variantRoot = (name) => new RegExp(`${name}VariantClasses\\[variant\\],\\s*"([^"]*)"`)
const cardRoot = /<Card[\s\S]{0,80}?className=\{cn\("([^"]*)",\s*styles\.card/

export const CONTRACT = [
  { name: "Table", file: `${DIR}/Table.tsx`, root: /<table[\s\S]{0,80}?className=\{cn\(\s*"([^"]*)"/ },
  { name: "DataTable", file: `${DIR}/DataTable.tsx`, root: /return \(\s*<div className=\{cn\("([^"]*)",\s*className\)\}>/ },
  { name: "Badge", file: `${DIR}/Badge.tsx`, root: /<Comp\s+className=\{cn\(\s*"([^"]*)"/ },
  { name: "AnalyticsCard", file: `${DIR}/AnalyticsCard.tsx`, root: cardRoot },
  { name: "HeatmapChart", file: `${DIR}/HeatmapChart.tsx`, root: variantRoot("heatmapChart") },
  { name: "DonutChart", file: `${DIR}/DonutChart.tsx`, root: variantRoot("donutChart") },
  { name: "GaugeChart", file: `${DIR}/GaugeChart.tsx`, root: variantRoot("gaugeChart") },
  { name: "RadialBarChart", file: `${DIR}/RadialBarChart.tsx`, root: variantRoot("radialBarChart") },
  { name: "MiniDistributionBarCard", file: `${DIR}/MiniDistributionBarCard.tsx`, root: cardRoot },
  { name: "LabeledDonutCard", file: `${DIR}/LabeledDonutCard.tsx`, root: cardRoot },
  { name: "ConcentricProgressCard", file: `${DIR}/ConcentricProgressCard.tsx`, root: cardRoot },
  { name: "SegmentedGaugeCard", file: `${DIR}/SegmentedGaugeCard.tsx`, root: cardRoot },
  { name: "SegmentTimelineCard", file: `${DIR}/SegmentTimelineCard.tsx`, root: cardRoot },
]

export function collectTabularNumsFindings({ contract = CONTRACT, readSource }) {
  const findings = []
  for (const part of contract) {
    const source = readSource(part.file)
    const match = source.match(part.root)
    if (!match) {
      findings.push({
        message: `${part.file}: ${part.name} の根の class が読めません（書き方が変わったら、この検査の CONTRACT の正規表現も直すこと）。`,
      })
      continue
    }
    if (!/(^|\s)tabular-nums(\s|$)/.test(match[1])) {
      findings.push({
        message: `${part.file}: ${part.name} の根の class に tabular-nums がありません（"${match[1]}"）。`,
      })
    }
  }
  return findings
}

export function verifyTabularNums({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "design-verify-tabular-nums: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const findings = collectTabularNumsFindings({
    readSource: (file) => readFileSync(join(root, file), "utf-8"),
  })
  if (findings.length === 0) return

  throwLinesError([
    "design:verify: 数字を並べて見せる部品から、等幅の数字（tabular-nums）が外れています。",
    "⚠️ 表の数値・日付・件数・バッジの数は桁がそろっていないと読み比べにくい。根の要素に tabular-nums を戻すこと。",
    ...findings.map((finding) => `- ${finding.message}`),
  ])
}

// ---------------------------------------------------------------------------
// 自己検査
// ---------------------------------------------------------------------------

const TABLE = { name: "Table", file: "Table.tsx", root: CONTRACT[0].root }
const BADGE = { name: "Badge", file: "Badge.tsx", root: CONTRACT[2].root }
const CARD = { name: "LabeledDonutCard", file: "LabeledDonutCard.tsx", root: cardRoot }

const tableSource = (cls) =>
  `<table\n            ref={ref}\n            className={cn(\n                "${cls}",\n                striped && "x",\n                className\n            )}`
const badgeSource = (cls) => `<Comp\n            className={cn(\n                "${cls}",\n                badgeSizeClasses[size],`
const cardSource = (cls) => `<Card\n                ref={ref}\n                className={cn("${cls}", styles.card, className)}`

// ⭐ 1本目は「実際に見落としていた値」＝2026-10-07 までの Table の根（比例数字のまま）。
const SELF_TEST_FIXTURES = [
  {
    name: "2026-10-07 までの Table の根（tabular-nums なし）を落とす",
    contract: [TABLE],
    sources: { "Table.tsx": tableSource("w-full caption-bottom text-sm") },
    expectMin: 1,
    expectMentions: "Table の根の class に tabular-nums がありません",
  },
  {
    name: "tabular-nums を付けた Table は通す",
    contract: [TABLE, BADGE, CARD],
    sources: {
      "Table.tsx": tableSource("w-full caption-bottom text-sm tabular-nums"),
      "Badge.tsx": badgeSource("inline-flex items-center font-semibold tabular-nums"),
      "LabeledDonutCard.tsx": cardSource("w-full min-w-0 overflow-hidden p-0 tabular-nums"),
    },
    expectMin: 0,
  },
  {
    name: "似た名前のクラス（tabular-nums-x）では通さない",
    contract: [BADGE],
    sources: { "Badge.tsx": badgeSource("inline-flex items-center tabular-nums-x") },
    expectMin: 1,
    expectMentions: "Badge の根の class に tabular-nums がありません",
  },
  {
    name: "根が読めなくなったら落とす",
    contract: [CARD],
    sources: { "LabeledDonutCard.tsx": "<section className=\"w-full tabular-nums\">" },
    expectMin: 1,
    expectMentions: "読めません",
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const findings = collectTabularNumsFindings({
      contract: fixture.contract,
      readSource: (file) => fixture.sources[file] ?? "",
    })
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

const isCli = process.argv[1] && process.argv[1].endsWith("design-verify-tabular-nums.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("design-verify-tabular-nums: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("design-verify-tabular-nums: self-test passed")
} else {
  runVerificationCli({
    scriptName: "design-verify-tabular-nums.mjs",
    verify: verifyTabularNums,
    successMessage: "design:verify: tabular nums passed",
  })
}
