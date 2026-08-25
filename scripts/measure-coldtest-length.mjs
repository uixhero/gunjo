#!/usr/bin/env node

import { readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT, readJson } from "./design-sync/shared.mjs"
import { countCharacters, countWords, stripCode } from "./japanese-length.mjs"

// コールドテストの回（app/data/cold-test-rounds/*.json）の分量を実測する。
//
// なぜここに japanese-length を置くか＝GUNJO は wordCount を出していない
// （2026-08-25 時点の構造化データは CollectionPage / ItemList / Organization / Article のみ）。
// 使い道の無い共通コードは腐るので、実際に回す用を1つ付けてある。
//
// ⛔ 本番の表示は一切変えない。出力は記録だけ（stdout、または --out でJSON）。
// 数え方の使い分けは ~/dev/new-4px/skills/japanese-length/ の「決まり」節が正:
//   - 原稿の分量管理は文字数で見る（日本語は文字が単位）
//   - 語数は schema.org の wordCount 用。ここでは参考として併記する
//   - コード込み / コード抜きの両方を出す（技術記事はコードの比率が回ごとに大きく違う）

const ROUNDS_DIR = "app/data/cold-test-rounds"
const DRAFT_ROUNDS = "app/data/cold-test-draft-rounds.json"

/** 全角を2桁として数える表示幅。等幅の端末で表がそろうようにする。 */
function displayWidth(text) {
  let width = 0
  for (const char of text) {
    width += /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe6f\uff00-\uff60\uffe0-\uffe6]/.test(char) ? 2 : 1
  }
  return width
}

function padStartWide(text, width) {
  return " ".repeat(Math.max(0, width - displayWidth(text))) + text
}

function padEndWide(text, width) {
  return text + " ".repeat(Math.max(0, width - displayWidth(text)))
}

function median(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? Math.round((sorted[middle - 1] + sorted[middle]) / 2) : sorted[middle]
}

export function measureColdTestLength({ root = ROOT } = {}) {
  const draftRounds = new Set(readJson(join(root, DRAFT_ROUNDS)).draft ?? [])
  const files = readdirSync(join(root, ROUNDS_DIR))
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))

  const rounds = []
  for (const file of files) {
    const data = readJson(join(root, ROUNDS_DIR, file))
    const markdown = data.article?.markdown ?? ""
    const prose = stripCode(markdown)
    rounds.push({
      round: data.round,
      slug: data.slug,
      category: data.category ?? null,
      status: draftRounds.has(data.round) ? "draft" : "published",
      characters: countCharacters(markdown),
      charactersWithoutCode: countCharacters(prose),
      words: countWords(markdown),
      wordsWithoutCode: countWords(prose),
    })
  }

  const summarize = (subset) => ({
    rounds: subset.length,
    charactersTotal: subset.reduce((sum, entry) => sum + entry.characters, 0),
    charactersMedian: median(subset.map((entry) => entry.characters)),
    charactersMin: subset.length ? Math.min(...subset.map((entry) => entry.characters)) : 0,
    charactersMax: subset.length ? Math.max(...subset.map((entry) => entry.characters)) : 0,
    charactersWithoutCodeTotal: subset.reduce((sum, entry) => sum + entry.charactersWithoutCode, 0),
    charactersWithoutCodeMedian: median(subset.map((entry) => entry.charactersWithoutCode)),
    wordsTotal: subset.reduce((sum, entry) => sum + entry.words, 0),
    wordsMedian: median(subset.map((entry) => entry.words)),
  })

  return {
    source: ROUNDS_DIR,
    specNote: "数え方の正 = ~/dev/new-4px/skills/japanese-length/",
    icu: process.versions.icu,
    all: summarize(rounds),
    published: summarize(rounds.filter((entry) => entry.status === "published")),
    draft: summarize(rounds.filter((entry) => entry.status === "draft")),
    rounds,
  }
}

function formatTable(report) {
  const lines = []
  lines.push(`コールドテストの分量（${report.source}・ICU ${report.icu}）`)
  lines.push("")
  lines.push(
    ["区分", "本数", "文字数計", "文字数中央値", "コード抜き中央値", "語数中央値"]
      .map((header, index) => (index === 0 ? padEndWide(header, 8) : padStartWide(header, 18)))
      .join("")
  )
  for (const [label, key] of [
    ["全体", "all"],
    ["公開", "published"],
    ["下書き", "draft"],
  ]) {
    const summary = report[key]
    lines.push(
      [
        padEndWide(label, 8),
        padStartWide(String(summary.rounds), 18),
        padStartWide(String(summary.charactersTotal), 18),
        padStartWide(String(summary.charactersMedian), 18),
        padStartWide(String(summary.charactersWithoutCodeMedian), 18),
        padStartWide(String(summary.wordsMedian), 18),
      ].join("")
    )
  }
  lines.push("")
  const longest = [...report.rounds].sort((a, b) => b.characters - a.characters).slice(0, 5)
  const shortest = [...report.rounds].sort((a, b) => a.characters - b.characters).slice(0, 5)
  lines.push("長い回 5本:")
  for (const entry of longest) lines.push(`  #${entry.round} ${entry.slug} — ${entry.characters}字`)
  lines.push("短い回 5本:")
  for (const entry of shortest) lines.push(`  #${entry.round} ${entry.slug} — ${entry.characters}字`)
  return lines.join("\n")
}

const isCli = process.argv[1] && process.argv[1].endsWith("measure-coldtest-length.mjs")

if (isCli) {
  const report = measureColdTestLength()
  const outIndex = process.argv.indexOf("--out")
  if (outIndex !== -1 && process.argv[outIndex + 1]) {
    writeFileSync(process.argv[outIndex + 1], `${JSON.stringify(report, null, 2)}\n`)
    console.log(`coldtest-length: ${process.argv[outIndex + 1]} に書きました（${report.all.rounds}本）`)
  } else if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(formatTable(report))
  }
}
