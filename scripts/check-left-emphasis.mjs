import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

// KeEem rule (new-4px DECISIONS.md 2026-08-16): the site UI never emphasises an
// item with a vertical colour rail on its left edge — border-left, inset
// box-shadow, or an absolute left-0 bar, decorative included. Alternatives:
// background tint, font weight, border-top, spacing. A blockquote's border-left
// is exempt. Scope: app/**/*.tsx (the gunjo.jp site UI). `src/` components are
// out of scope here — what ListCard itself does with `severity` is a separate
// design decision.

const TARGET_PATH = "app"
const EXCEPTION_POLICY_PATH = "design/policy/left-emphasis-exceptions.json"

// (a) coloured/thick left border classes. `border-l-0` (removing a border) and
// `border-l-transparent` are not rails; the bare 1px `border-l` divider between
// panels is structural, not emphasis, and stays legal.
const LEFT_BORDER_CLASS_PATTERN = /\bborder-l-(?!0(?![\w.])|transparent\b)[A-Za-z0-9[\]./%-]+/g
// (b) the logical-property twin (border-inline-start).
const START_BORDER_CLASS_PATTERN = /\bborder-s-(?!0(?![\w.])|transparent\b)[A-Za-z0-9[\]./%-]+/g
// (c) an absolutely positioned thin bar pinned to the left edge. Wide drawers
// (w-72 etc.) do not match — only rail-thin widths.
const THIN_WIDTH_PATTERN = /\bw-(?:0\.5|1\.5|1|2)(?![\w.])|\bw-\[[1-8]px\]/

const LIST_CARD_SEVERITY_KEY = "listcard-severity"
const ABSOLUTE_LEFT_BAR_KEY = "absolute-left-bar"

// (d) exception: these two surfaces document the ListCard component itself, so
// they may demonstrate `severity`. Everywhere else in app/ it is banned.
const LIST_CARD_ALLOWED_PATHS = [
  "app/docs/components/list-card/",
  "app/components/demos/ListCardDemo.tsx",
]

function listTsxFiles(rootDir) {
  const files = []
  const stack = [rootDir]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name === "generated" || entry.name === "node_modules") continue
      const absolutePath = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }
      if (entry.isFile() && entry.name.endsWith(".tsx")) {
        files.push(absolutePath)
      }
    }
  }

  return files
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length
}

// The blockquote exemption: a border-l-* class sitting inside a `<blockquote`
// opening tag is the one legal left border.
function isInsideBlockquoteTag(content, matchIndex) {
  const lastOpen = content.lastIndexOf("<", matchIndex)
  if (lastOpen === -1) return false
  return /^<blockquote\b/.test(content.slice(lastOpen, lastOpen + 12))
}

function collectBorderClassIssues(relativeFilePath, content, pattern) {
  const issues = []
  for (const match of content.matchAll(pattern)) {
    const matchIndex = match.index ?? 0
    if (isInsideBlockquoteTag(content, matchIndex)) continue
    issues.push({
      file: relativeFilePath,
      className: match[0],
      line: lineNumberAt(content, matchIndex),
    })
  }
  return issues
}

function collectAbsoluteLeftBarIssues(relativeFilePath, content) {
  const issues = []
  const lines = content.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!/\babsolute\b/.test(line)) continue
    if (!/\bleft-0\b/.test(line)) continue
    const pinnedVertically =
      /\binset-y-0\b/.test(line) || (/\btop-0\b/.test(line) && /\bbottom-0\b/.test(line))
    if (!pinnedVertically) continue
    if (!THIN_WIDTH_PATTERN.test(line)) continue
    issues.push({
      file: relativeFilePath,
      className: ABSOLUTE_LEFT_BAR_KEY,
      line: index + 1,
    })
  }
  return issues
}

// Walks one `<ListCard ...>` opening tag. `>` inside {…} expressions (arrow
// functions, JSX children passed as props) must not end the tag, so braces and
// string literals are tracked and only a depth-0 `>` closes it.
function scanListCardOpeningTag(content, start) {
  let depth = 0
  let inString = null
  let severityIndex = -1

  for (let i = start; i < content.length; i += 1) {
    const ch = content[i]
    if (inString) {
      if (ch === inString && content[i - 1] !== "\\") inString = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch
      continue
    }
    if (ch === "{") {
      depth += 1
      continue
    }
    if (ch === "}") {
      depth = Math.max(0, depth - 1)
      continue
    }
    if (depth > 0) continue
    if (ch === ">") return { tagEnd: i + 1, severityIndex }
    if (
      severityIndex === -1 &&
      /\s/.test(content[i - 1] ?? "") &&
      content.startsWith("severity", i) &&
      /^\s*=/.test(content.slice(i + "severity".length, i + "severity".length + 4))
    ) {
      severityIndex = i
    }
  }

  return { tagEnd: content.length, severityIndex }
}

function collectListCardSeverityIssues(relativeFilePath, content) {
  if (
    LIST_CARD_ALLOWED_PATHS.some(
      (allowed) => relativeFilePath === allowed || relativeFilePath.startsWith(allowed)
    )
  ) {
    return []
  }

  const issues = []
  let searchFrom = 0
  for (;;) {
    const tagStart = content.indexOf("<ListCard", searchFrom)
    if (tagStart === -1) break
    const nextChar = content[tagStart + "<ListCard".length]
    if (nextChar && /[A-Za-z0-9]/.test(nextChar)) {
      searchFrom = tagStart + 1
      continue
    }
    const { tagEnd, severityIndex } = scanListCardOpeningTag(content, tagStart)
    if (severityIndex !== -1) {
      issues.push({
        file: relativeFilePath,
        className: LIST_CARD_SEVERITY_KEY,
        line: lineNumberAt(content, severityIndex),
      })
    }
    searchFrom = tagEnd
  }
  return issues
}

function collectIssuesFromContent(relativeFilePath, content) {
  return [
    ...collectBorderClassIssues(relativeFilePath, content, LEFT_BORDER_CLASS_PATTERN),
    ...collectBorderClassIssues(relativeFilePath, content, START_BORDER_CLASS_PATTERN),
    ...collectAbsoluteLeftBarIssues(relativeFilePath, content),
    ...collectListCardSeverityIssues(relativeFilePath, content),
  ]
}

const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0
}

// Same contract as hardcoded-color-class-exceptions.json (reason / addedOn /
// expiresOn mandatory, expiry enforced), plus an exact `count`: the baseline
// fails both when a file gains a new occurrence and when it loses one without
// the count being updated, so the list never goes stale in either direction.
function loadExceptionPolicy(root) {
  const absolutePath = join(root, EXCEPTION_POLICY_PATH)
  const policy = JSON.parse(readFileSync(absolutePath, "utf-8"))
  const rawEntries = Array.isArray(policy?.exceptions) ? policy.exceptions : []

  const entries = []
  const policyIssues = []
  const today = new Date().toISOString().slice(0, 10)

  for (const [index, entry] of rawEntries.entries()) {
    const label = isNonEmptyString(entry?.file)
      ? `${entry.file}::${entry?.className ?? "(className 未設定)"}`
      : `exceptions[${index}]`

    if (!isNonEmptyString(entry?.file) || !isNonEmptyString(entry?.className)) {
      policyIssues.push(`${label} は file / className が必要です`)
      continue
    }
    if (!Number.isInteger(entry?.count) || entry.count < 1) {
      policyIssues.push(`${label} は count を 1 以上の整数で記録してください`)
      continue
    }
    if (!isNonEmptyString(entry?.reason)) {
      policyIssues.push(`${label} は reason が必要です`)
      continue
    }
    if (!DATE_PATTERN.test(entry?.addedOn ?? "")) {
      policyIssues.push(`${label} は addedOn を YYYY-MM-DD で記録してください`)
      continue
    }
    const expiresOn = entry?.expiresOn
    if (expiresOn !== "permanent" && !DATE_PATTERN.test(expiresOn ?? "")) {
      policyIssues.push(`${label} は expiresOn を YYYY-MM-DD または "permanent" で記録してください`)
      continue
    }
    if (expiresOn !== "permanent" && expiresOn < today) {
      policyIssues.push(`${label} は ${expiresOn} に期限切れです（再判断が必要）`)
      continue
    }

    entries.push({ file: entry.file, className: entry.className, count: entry.count })
  }

  return { entries, policyIssues }
}

function collectLeftEmphasisReport(root) {
  const files = listTsxFiles(join(root, TARGET_PATH))
  const { entries: exceptionEntries, policyIssues } = loadExceptionPolicy(root)
  const allowedCountByKey = new Map(
    exceptionEntries.map((entry) => [`${entry.file}::${entry.className}`, entry.count])
  )

  const issuesByKey = new Map()
  for (const filePath of files) {
    const relativeFilePath = relative(root, filePath)
    const content = readFileSync(filePath, "utf-8")
    for (const issue of collectIssuesFromContent(relativeFilePath, content)) {
      const key = `${issue.file}::${issue.className}`
      if (!issuesByKey.has(key)) issuesByKey.set(key, [])
      issuesByKey.get(key).push(issue)
    }
  }

  const violations = []
  const baselineDrift = []

  for (const [key, issues] of [...issuesByKey.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    const allowed = allowedCountByKey.get(key) ?? 0
    if (issues.length > allowed) {
      const lines = issues.map((issue) => `${issue.file}:${issue.line} "${issue.className}"`)
      violations.push(
        allowed === 0
          ? lines
          : [`${key} が許可 ${allowed} 件を超えて ${issues.length} 件あります:`, ...lines]
      )
    } else if (issues.length < allowed) {
      baselineDrift.push(
        `${key} は許可 ${allowed} 件に対し実測 ${issues.length} 件です（count を ${issues.length} に更新してください）`
      )
    }
  }

  for (const [key, allowed] of [...allowedCountByKey.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    if (!issuesByKey.has(key)) {
      baselineDrift.push(`${key} は実測 0 件です（許可 ${allowed} 件のエントリを削除してください）`)
    }
  }

  return { violations: violations.flat(), baselineDrift, policyIssues }
}

// The detectors verify themselves against fixtures on every run, so a regex
// refactor that silently stops matching fails CI instead of passing it.
const SELF_TEST_FIXTURES = [
  {
    name: "border-l-4 の色つき左罫を検出する",
    file: "app/fixtures/violation.tsx",
    content: `<div className="rounded-lg border-l-4 border-l-destructive-border p-3" />`,
    expect: ["border-l-4", "border-l-destructive-border"],
  },
  {
    name: "border-s-4 (logical property) を検出する",
    file: "app/fixtures/violation-s.tsx",
    content: `<div className="border-s-4 border-s-warning-border" />`,
    expect: ["border-s-4", "border-s-warning-border"],
  },
  {
    name: "blockquote の border-left は対象外",
    file: "app/fixtures/blockquote.tsx",
    content: `<blockquote className="mt-5 border-l-2 border-border pl-4 italic" />`,
    expect: [],
  },
  {
    name: "border-l-0 / border-l-transparent / 素の border-l 仕切りは適法",
    file: "app/fixtures/legal-borders.tsx",
    content: `<div className="border-l-0" /><div className="border-l-transparent" /><aside className="h-full border-l bg-card" />`,
    expect: [],
  },
  {
    name: "absolute left-0 の細い色帯を検出する",
    file: "app/fixtures/absolute-bar.tsx",
    content: `<span className="absolute inset-y-0 left-0 w-1 bg-destructive" aria-hidden="true" />`,
    expect: [ABSOLUTE_LEFT_BAR_KEY],
  },
  {
    name: "top-0 bottom-0 + w-[2px] の色帯も検出する",
    file: "app/fixtures/absolute-bar-px.tsx",
    content: `<span className="absolute top-0 bottom-0 left-0 w-[2px] bg-primary" />`,
    expect: [ABSOLUTE_LEFT_BAR_KEY],
  },
  {
    name: "absolute left-0 でも幅広の drawer は適法",
    file: "app/fixtures/drawer.tsx",
    content: `<div className="absolute inset-y-0 left-0 z-50 w-72 max-w-[86%] border-r bg-background" />`,
    expect: [],
  },
  {
    name: "ListCard の severity をサイトUIで検出する（複数行タグ）",
    file: "app/fixtures/listcard.tsx",
    content: `<ListCard\n    severity={STATUS_SEVERITY[item.status]}\n    title={item.phenomenon}\n    status={<Badge onClick={() => setOpen((v) => !v)} />}\n/>`,
    expect: [LIST_CARD_SEVERITY_KEY],
  },
  {
    name: "severity 無しの ListCard は適法（=> を含む props でも誤検出しない）",
    file: "app/fixtures/listcard-legal.tsx",
    content: `<ListCard title="x" status={<Badge onClick={() => setSeverity("severity=high")} />} />`,
    expect: [],
  },
  {
    name: "部品の docs ページ・デモでは severity のデモを許可する",
    file: "app/docs/components/list-card/page.tsx",
    content: `<ListCard severity="warning" title="demo" />`,
    expect: [],
  },
  {
    name: "文章中の ListCard / severity という語は誤検出しない",
    file: "app/fixtures/prose.tsx",
    content: `<p>{'ListCard supports a severity accent. severity= is written as text.'}</p>`,
    expect: [],
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const found = collectIssuesFromContent(fixture.file, fixture.content)
      .map((issue) => issue.className)
      .sort((a, b) => a.localeCompare(b))
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

export function verifyNoLeftEmphasis({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "check-left-emphasis: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const { violations, baselineDrift, policyIssues } = collectLeftEmphasisReport(root)
  if (violations.length === 0 && baselineDrift.length === 0 && policyIssues.length === 0) return

  const lines = []
  if (violations.length > 0) {
    lines.push("design:verify: 左端の縦色帯（左端強調）を app のサイトUIで検出しました。")
    lines.push(
      "KeEemルール（new-4px DECISIONS.md 2026-08-16）: 左端の縦色帯で強調しない — border-left / inset box-shadow / absolute left-0 のいずれも・飾りも含む。"
    )
    lines.push(
      "代替: 背景の淡い色・字の強さ・上罫（border-top）・余白。blockquote の border-left は対象外（自動適法）。ListCard の severity は app のサイトUIで使わない。"
    )
    lines.push(...violations.map((violation) => `- ${violation}`))
  }

  if (policyIssues.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(
      `design:verify: ${EXCEPTION_POLICY_PATH} のエントリが不正です（count / reason / addedOn / expiresOn は必須）。`
    )
    lines.push(...policyIssues.map((entry) => `- ${entry}`))
  }

  if (baselineDrift.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(`design:verify: ${EXCEPTION_POLICY_PATH} の基線が実測とずれています。`)
    lines.push(...baselineDrift.map((entry) => `- ${entry}`))
  }

  throwLinesError(lines)
}

const isCli = process.argv[1] && process.argv[1].endsWith("check-left-emphasis.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("check-left-emphasis: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("check-left-emphasis: self-test passed")
} else {
  runVerificationCli({
    scriptName: "check-left-emphasis.mjs",
    verify: verifyNoLeftEmphasis,
    successMessage: "design:verify: left emphasis check passed",
  })
}
