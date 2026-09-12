import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

// KeEem決定（2026-09-11, PR #882）: /how-to-read の「見つかったものに付く、3つの状態」は
// 「足りないものは、コンポーネントができた時点で回のページに載るので、いまはすべて対応済み」
// という意味の1文を置いている。ところが型（app/lib/cold-test-findings.ts の FindingStatus）は
// kind: "requirement" にも3つの状態のどれでも入れられる。いまその1文が本当なのは、データが
// たまたまそうなっているからにすぎない。文書に書いただけでは守られないので、ここで止める:
//   (1) kind: "requirement" の status は "resolved" だけ
//   (2) kind: "requirement" の links に kind: "component" が1本以上ある
//       （「コンポーネントができた時点で載る」の裏付け）
// 落ちたら、データを直す。データのほうが正しいなら、先に /how-to-read の1文を書き直してから
// この検査を変える。

const FINDINGS_DIR = "app/data/cold-test-findings"
const PAGE_PATH = "app/how-to-read/page.tsx"
const REQUIRED_STATUS = "resolved"

/** 1ファイル分の違反を返す。self-test でも同じ関数を使う。 */
export function collectRequirementIssues(file, data) {
  if (!Array.isArray(data?.findings)) {
    return { requirementCount: 0, issues: [{ file, id: null, problem: "shape" }] }
  }

  const issues = []
  let requirementCount = 0
  for (const finding of data.findings) {
    if (finding?.kind !== "requirement") continue
    requirementCount += 1
    const id = finding.id ?? "(id なし)"
    if (finding.status !== REQUIRED_STATUS) {
      issues.push({ file, id, problem: "status", status: finding.status })
    }
    const links = Array.isArray(finding.links) ? finding.links : []
    if (!links.some((link) => link?.kind === "component")) {
      issues.push({ file, id, problem: "component" })
    }
  }
  return { requirementCount, issues }
}

function formatIssue(issue) {
  switch (issue.problem) {
    case "status":
      return `${issue.file} ${issue.id}: status が "${issue.status}" です（足りないものは "${REQUIRED_STATUS}" だけ）`
    case "component":
      return `${issue.file} ${issue.id}: links に kind: "component" のリンクがありません`
    default:
      return `${issue.file}: findings[] がありません`
  }
}

function collectReport(root) {
  const files = readdirSync(join(root, FINDINGS_DIR))
    .filter((name) => name.endsWith(".json"))
    .sort()
  const issues = []
  const policyIssues = []
  let requirementCount = 0

  for (const name of files) {
    const file = `${FINDINGS_DIR}/${name}`
    let data
    try {
      data = JSON.parse(readFileSync(join(root, file), "utf-8"))
    } catch (error) {
      policyIssues.push(`${file}: JSON として読めません（${error.message}）`)
      continue
    }
    const result = collectRequirementIssues(file, data)
    requirementCount += result.requirementCount
    issues.push(...result.issues)
  }

  // 何も見ていない検査は合格を出し続ける。置き場所や kind の名前が変わったら、ここで気づく。
  if (requirementCount === 0) {
    policyIssues.push(
      `${FINDINGS_DIR}/*.json に kind: "requirement" が1件もありません（${files.length} ファイルを読みました）。置き場所か kind の名前が変わっていないか確かめてください`
    )
  }

  return { issues, policyIssues }
}

// 検出器はフィクスチャで毎回自己検査する。壊れた検査は「合格」を出し続ける。
const SELF_TEST_FIXTURES = [
  {
    name: "対応済みでコンポーネントへのリンクがあれば何も報告しない",
    data: {
      findings: [
        { id: "ok", kind: "requirement", status: "resolved", links: [{ kind: "component", slug: "x", label: "X" }] },
      ],
    },
    expect: [],
  },
  {
    name: "足りないものが追跡中なら報告する",
    data: {
      findings: [
        { id: "ng", kind: "requirement", status: "tracking", links: [{ kind: "component", slug: "x", label: "X" }] },
      ],
    },
    expect: ["ng:status"],
  },
  {
    name: "足りないものにコンポーネントへのリンクが無ければ報告する",
    data: {
      findings: [{ id: "ng", kind: "requirement", status: "resolved", links: [{ kind: "issue", id: 1 }] }],
    },
    expect: ["ng:component"],
  },
  {
    name: "不具合は追跡中でもリンクが無くても報告しない",
    data: { findings: [{ id: "bug", kind: "pitfall", status: "tracking", links: [] }] },
    expect: [],
  },
  {
    name: "findings[] が無いファイルは報告する",
    data: { round: 1 },
    expect: ["null:shape"],
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const found = collectRequirementIssues("fixture.json", fixture.data)
      .issues.map((issue) => `${issue.id}:${issue.problem}`)
      .sort()
    const expected = [...fixture.expect].sort()
    const ok = JSON.stringify(found) === JSON.stringify(expected)
    if (!ok) {
      failures.push(`${fixture.name}: expected [${expected.join(", ")}] but found [${found.join(", ")}]`)
    }
    if (verbose) {
      console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
    }
  }
  return failures
}

export function verifyRequirementFindings({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "check-requirement-findings: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const { issues, policyIssues } = collectReport(root)
  if (issues.length === 0 && policyIssues.length === 0) return

  const lines = []
  if (issues.length > 0) {
    lines.push(
      `design:verify: 足りないもの（kind: "requirement"）に、対応済み以外の状態か、コンポーネントへのリンクが無いものがあります。`
    )
    lines.push(
      `${PAGE_PATH}（/how-to-read）は「足りないものは、コンポーネントができた時点で回のページに載るので、いまはすべて対応済み」と書いています。この1文が嘘になります。`
    )
    lines.push(
      "直し方: データを直す。データのほうが正しいなら、先に /how-to-read の1文を書き直してから、この検査を変える。"
    )
    lines.push(...issues.map((issue) => `- ${formatIssue(issue)}`))
  }

  if (policyIssues.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(`design:verify: ${FINDINGS_DIR} を読めませんでした（検査が何も見ていません）。`)
    lines.push(...policyIssues.map((issue) => `- ${issue}`))
  }

  throwLinesError(lines)
}

const isCli = process.argv[1] && process.argv[1].endsWith("check-requirement-findings.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("check-requirement-findings: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("check-requirement-findings: self-test passed")
} else {
  runVerificationCli({
    scriptName: "check-requirement-findings.mjs",
    verify: verifyRequirementFindings,
    successMessage: "design:verify: requirement findings check passed",
  })
}
