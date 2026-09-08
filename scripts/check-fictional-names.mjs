import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

// KeEem決定（2026-08-23）: 業界ページの「動く見本」は架空の会社のデモとして公開する。
// その前提を機械で守るガード:
//   (1) デモ配下のテキストに実在の保険ブランド名（日本の主要生保・損保・共済＋
//       英語圏の主要ブランド）が混入したら exit 1。
//   (2) デモの各 scan ルートに「架空の宣言」（架空の会社である・実在と無関係・
//       勧誘ではない）を含むファイルが1つも無ければ exit 1。
// NGリストと宣言の必須文言は design/policy/fictional-names.json（別ファイル・
// 拡張可能）。判定の書式は同ファイルの _comment を参照。

const POLICY_PATH = "design/policy/fictional-names.json"
const SCAN_EXTENSIONS = [".ts", ".tsx", ".json", ".md"]

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ASCII のみの名前は「大文字小文字を区別する単語一致」、それ以外（日本語など）は
// 部分一致。Progressive / Travelers のような一般語ブランドを、英文コメントの
// 普通の単語（progressive など）と誤検出しないための線引き。
function compileName(name) {
  const escaped = escapeRegExp(name)
  if (/^[\x20-\x7e]+$/.test(name)) {
    return { label: name, pattern: new RegExp(`\\b${escaped}\\b`, "g") }
  }
  return { label: name, pattern: new RegExp(escaped, "g") }
}

function loadPolicy(root) {
  const policy = JSON.parse(readFileSync(join(root, POLICY_PATH), "utf-8"))
  const policyIssues = []

  const scanRoots = Array.isArray(policy?.scan) ? policy.scan.filter(isNonEmptyString) : []
  if (scanRoots.length === 0) {
    policyIssues.push("scan[] にデモのディレクトリを1つ以上登録してください")
  }

  const rawNames = Array.isArray(policy?.names) ? policy.names.filter(isNonEmptyString) : []
  if (rawNames.length === 0) {
    policyIssues.push("names[] に実在ブランド名を1つ以上登録してください")
  }

  const requiredSnippets = Array.isArray(policy?.declaration?.requiredSnippets)
    ? policy.declaration.requiredSnippets.filter(isNonEmptyString)
    : []
  if (requiredSnippets.length === 0) {
    policyIssues.push("declaration.requiredSnippets に架空の宣言の必須文言を登録してください")
  }

  return { scanRoots, names: rawNames.map(compileName), requiredSnippets, policyIssues }
}

function listScanFiles(rootDir) {
  const files = []
  const stack = [rootDir]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === "generated") continue
      const absolutePath = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }
      if (entry.isFile() && SCAN_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        files.push(absolutePath)
      }
    }
  }

  return files
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length
}

export function collectNameIssuesFromContent(relativeFilePath, content, names) {
  const issues = []
  for (const { label, pattern } of names) {
    pattern.lastIndex = 0
    for (const match of content.matchAll(pattern)) {
      issues.push({
        file: relativeFilePath,
        name: label,
        line: lineNumberAt(content, match.index ?? 0),
      })
    }
  }
  return issues
}

export function findMissingSnippets(contents, requiredSnippets) {
  // 宣言はどれか1ファイルに全文言がそろっていれば成立（シェアードシェルの
  // 定義ファイルに置く想定）。
  const complete = contents.some((content) =>
    requiredSnippets.every((snippet) => content.includes(snippet))
  )
  if (complete) return []
  return requiredSnippets.filter(
    (snippet) => !contents.some((content) => content.includes(snippet))
  )
}

function collectReport(root) {
  const { scanRoots, names, requiredSnippets, policyIssues } = loadPolicy(root)
  const nameIssues = []
  const declarationIssues = []

  for (const scanRoot of scanRoots) {
    const absoluteRoot = join(root, scanRoot)
    if (!existsSync(absoluteRoot) || !statSync(absoluteRoot).isDirectory()) {
      policyIssues.push(`scan ルート ${scanRoot} が存在しません（ディレクトリを確認してください）`)
      continue
    }
    const files = listScanFiles(absoluteRoot)
    const contents = []
    for (const filePath of files) {
      const content = readFileSync(filePath, "utf-8")
      contents.push(content)
      nameIssues.push(...collectNameIssuesFromContent(relative(root, filePath), content, names))
    }

    const missing = findMissingSnippets(contents, requiredSnippets)
    if (missing.length > 0) {
      declarationIssues.push(
        `${scanRoot} に架空の宣言がそろったファイルがありません。` +
          `全文言がそろうファイルを1つ置いてください（不足の文言: ${missing.map((s) => `「${s}」`).join(" ")}）`
      )
    } else if (
      !contents.some((content) => requiredSnippets.every((snippet) => content.includes(snippet)))
    ) {
      declarationIssues.push(
        `${scanRoot} は宣言の文言が複数ファイルに分散しています。1ファイルに全文言をまとめてください`
      )
    }
  }

  return { nameIssues, declarationIssues, policyIssues }
}

// 検出器はフィクスチャで毎回自己検査する。正規表現の壊れは CI を通らず落ちる。
const SELF_TEST_NAMES = ["東京海上", "GEICO", "Progressive", "State Farm"].map(compileName)
const SELF_TEST_SNIPPETS = ["架空の保険会社", "勧誘ではありません"]

const SELF_TEST_FIXTURES = [
  {
    name: "日本語ブランドは部分一致で検出する",
    run: () =>
      collectNameIssuesFromContent(
        "app/fixtures/ja.tsx",
        `const insurer = "東京海上日動火災保険"`,
        SELF_TEST_NAMES
      ).map((i) => i.name),
    expect: ["東京海上"],
  },
  {
    name: "ASCII ブランドは単語一致で検出する",
    run: () =>
      collectNameIssuesFromContent(
        "app/fixtures/en.tsx",
        `// compare with GEICO and State Farm quotes`,
        SELF_TEST_NAMES
      ).map((i) => i.name),
    expect: ["GEICO", "State Farm"],
  },
  {
    name: "一般語ブランドの小文字（progressive disclosure など）は検出しない",
    run: () =>
      collectNameIssuesFromContent(
        "app/fixtures/lowercase.tsx",
        `// progressive disclosure keeps the drawer simple`,
        SELF_TEST_NAMES
      ).map((i) => i.name),
    expect: [],
  },
  {
    name: "架空社名（群青損害保険）は検出しない",
    run: () =>
      collectNameIssuesFromContent(
        "app/fixtures/fictional.tsx",
        `export const insurerName = "群青損害保険株式会社"`,
        SELF_TEST_NAMES
      ).map((i) => i.name),
    expect: [],
  },
  {
    name: "宣言の全文言がそろったファイルがあれば成立",
    run: () =>
      findMissingSnippets(
        ["const a = 1", "これは架空の保険会社のデモです。保険の勧誘ではありません。"],
        SELF_TEST_SNIPPETS
      ),
    expect: [],
  },
  {
    name: "宣言が無ければ不足文言を報告する",
    run: () => findMissingSnippets(["const a = 1"], SELF_TEST_SNIPPETS),
    expect: SELF_TEST_SNIPPETS,
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const found = [...fixture.run()].sort((a, b) => a.localeCompare(b))
    const expected = [...fixture.expect].sort((a, b) => a.localeCompare(b))
    const ok = JSON.stringify(found) === JSON.stringify(expected)
    if (!ok) {
      failures.push(
        `${fixture.name}: expected [${expected.join(", ")}] but found [${found.join(", ")}]`
      )
    }
    if (verbose) {
      console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
    }
  }
  return failures
}

export function verifyFictionalNames({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "check-fictional-names: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const { nameIssues, declarationIssues, policyIssues } = collectReport(root)
  if (nameIssues.length === 0 && declarationIssues.length === 0 && policyIssues.length === 0) {
    return
  }

  const lines = []
  if (nameIssues.length > 0) {
    lines.push("design:verify: 架空アプリのデモに実在の保険ブランド名が混入しています。")
    lines.push(
      "KeEemルール（2026-08-23）: 業界の見本は架空の会社として公開する。実在の会社名・ブランド名は使わない（似せる・音写もしない）。"
    )
    lines.push(
      ...nameIssues
        .sort((a, b) => `${a.file}:${a.line}`.localeCompare(`${b.file}:${b.line}`))
        .map((issue) => `- ${issue.file}:${issue.line} 「${issue.name}」`)
    )
  }

  if (declarationIssues.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push("design:verify: 架空の宣言が見つかりません。")
    lines.push(...declarationIssues.map((issue) => `- ${issue}`))
  }

  if (policyIssues.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(`design:verify: ${POLICY_PATH} の内容が不正です。`)
    lines.push(...policyIssues.map((issue) => `- ${issue}`))
  }

  throwLinesError(lines)
}

const isCli = process.argv[1] && process.argv[1].endsWith("check-fictional-names.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("check-fictional-names: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("check-fictional-names: self-test passed")
} else {
  runVerificationCli({
    scriptName: "check-fictional-names.mjs",
    verify: verifyFictionalNames,
    successMessage: "design:verify: fictional names check passed",
  })
}
