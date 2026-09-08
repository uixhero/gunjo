#!/usr/bin/env node

import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"
import { SPEC_VERSION, countCharacters, countWords } from "./japanese-length.mjs"

// 日本語の分量の数え方（語数・文字数）は 4px 共通で、正は
// ~/dev/new-4px/skills/japanese-length/reference/ にある。
// GUNJO（scripts/）と UIXHERO（src/lib/）は、その写しをバイト単位で同じものとして持つ。
//
// 写しが2つある以上「どちらが正か」が生まれる。ずれたら気づけるように検査を3段に分ける:
//   1. 同じ入力に同じ数を返すか（japanese-length.parity.json の期待値と突き合わせる）
//   2. 実装ファイルが parity.json の記録どおりか（implSha256）
//      → 実装だけ書き換えて期待値を直さなかった場合に、このリポ単体で落ちる
//   3. 正（skill）とバイト単位で同じか
//      → 正がある機械でだけ走る。⚠️ CI には正が無いので落とせない。
//        「両リポが同じ版か」の最終判定は skills/japanese-length/scripts/check-parity.mjs。

const IMPL_PATH = "scripts/japanese-length.mjs"
const PARITY_PATH = "scripts/japanese-length.parity.json"

const CANONICAL_DIRS = [
  join(homedir(), "dev/new-4px/skills/japanese-length/reference"),
  join(homedir(), ".claude/skills/japanese-length/reference"),
]

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

/** 期待値と実測がずれたケースを返す。self-test でも同じ関数を使う。 */
export function collectCaseMismatches(cases) {
  const mismatches = []
  for (const testCase of cases) {
    const words = countWords(testCase.source)
    const characters = countCharacters(testCase.source)
    if (words !== testCase.words) {
      mismatches.push(`${testCase.id}: words 期待 ${testCase.words} / 実測 ${words}`)
    }
    if (characters !== testCase.characters) {
      mismatches.push(`${testCase.id}: characters 期待 ${testCase.characters} / 実測 ${characters}`)
    }
  }
  return mismatches
}

function findCanonicalDir() {
  return CANONICAL_DIRS.find((dir) => existsSync(join(dir, "japanese-length.mjs"))) ?? null
}

function collectProblems(root) {
  const problems = []
  const implBytes = readFileSync(join(root, IMPL_PATH))
  const parityBytes = readFileSync(join(root, PARITY_PATH))
  const parity = JSON.parse(parityBytes.toString("utf8"))

  if (parity.specVersion !== SPEC_VERSION) {
    problems.push(
      `版が食い違っています: ${PARITY_PATH} は ${parity.specVersion} / 実装は ${SPEC_VERSION}`
    )
  }

  const actualSha = sha256(implBytes)
  if (parity.implSha256 !== actualSha) {
    problems.push(
      `${IMPL_PATH} が ${PARITY_PATH} の implSha256 と一致しません（記録 ${parity.implSha256.slice(0, 12)}… / 実測 ${actualSha.slice(0, 12)}…）`
    )
  }

  // ⚠️ ここが落ちたときに疑う順番: ①実装を変えた ②Intl.Segmenter（ICU）の版が変わった。
  // ICU 76.1（Node 22.14）と 78.3（Node 26）では全件一致を実測済み（2026-08-25）。
  const mismatches = collectCaseMismatches(parity.cases)
  if (mismatches.length > 0) {
    problems.push(`同じ入力に同じ数を返していません（ICU ${process.versions.icu}）:`)
    problems.push(...mismatches.map((mismatch) => `  ${mismatch}`))
  }

  const canonicalDir = findCanonicalDir()
  if (canonicalDir) {
    for (const [relative, localBytes] of [
      [IMPL_PATH, implBytes],
      [PARITY_PATH, parityBytes],
    ]) {
      const canonicalPath = join(canonicalDir, relative.split("/").pop())
      if (readFileSync(canonicalPath).toString("utf8") !== localBytes.toString("utf8")) {
        problems.push(`${relative} が正（${canonicalPath}）と違います`)
      }
    }
  } else {
    console.log(
      "check-japanese-length: 正（skills/japanese-length）が無いためバイト照合は飛ばしました"
    )
  }

  return problems
}

/** 検出器そのものが生きているかを確かめる。壊れた検査は「合格」を出し続ける。 */
export function runSelfTest({ verbose } = {}) {
  const failures = []

  const good = [{ id: "self-ok", source: "Hello world.", words: 2, characters: 11 }]
  if (collectCaseMismatches(good).length !== 0) {
    failures.push("正しい期待値でずれを報告してしまう")
  } else if (verbose) {
    console.log("ok - 正しい期待値では何も報告しない")
  }

  const drifted = [{ id: "self-ng", source: "Hello world.", words: 999, characters: 999 }]
  if (collectCaseMismatches(drifted).length !== 2) {
    failures.push("ずれた期待値を報告できない（検査が死んでいる）")
  } else if (verbose) {
    console.log("ok - ずれた期待値は報告する")
  }

  return failures
}

export function verifyJapaneseLength({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "check-japanese-length: 自己検査に失敗しました。",
      "検査そのものが壊れているか、japanese-length.mjs の数え方が変わっています。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const problems = collectProblems(root)
  if (problems.length === 0) return

  throwLinesError([
    "design:verify: 日本語の分量の数え方（japanese-length）の写しがずれています。",
    `正 = ~/dev/new-4px/skills/japanese-length/reference/（UIXHERO の写し = src/lib/）`,
    "直し方: 正を直してから両リポへ配り直し、skills/japanese-length/scripts/check-parity.mjs を通す。",
    ...problems.map((problem) => `- ${problem}`),
  ])
}

const isCli = process.argv[1] && process.argv[1].endsWith("check-japanese-length.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("check-japanese-length: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("check-japanese-length: self-test passed")
} else {
  runVerificationCli({
    scriptName: "check-japanese-length.mjs",
    verify: verifyJapaneseLength,
    successMessage: "design:verify: japanese-length parity check passed",
  })
}
