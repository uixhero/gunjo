import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { throwLinesError } from "./design-verify-assertions.mjs"

// KeEem decision (new-4px DECISIONS.md 2026-10-11, issue #1057): GunjoUI sits on
// a 4px grid. Spacing between items, the padding/inset an element is pushed in
// by, and the size of controls, chips and icons are multiples of 4px.
//
// What is exempt (the "細部"), automatically:
//   - a SIZE below 12px — hairlines, dots, ticks (`w-0.5`, `h-1.5 w-1.5`,
//     `w-[3px]`). 12px is the smallest icon, so nothing under it is an icon,
//     a control or a chip.
//   - a POSITION offset below 4px — centring nudges (`-top-0.5`,
//     `translate-y-[0.5px]`, `-ml-[1.5px]`). A value under one grid unit cannot
//     sit on the grid; it is by nature a fine adjustment, not a layout decision.
// Icons are NOT exempt: 14px (`size-3.5`) goes to 16 or 12. Anything else that
// must stay off-grid is listed with a reason in EXCEPTION_POLICY_PATH.
//
// Scope: `src/components/**` (the published @gunjo/ui parts) and `app/**` (the
// gunjo.jp site, which dogfoods them) are both held strictly. The site first
// shipped with a per-file baseline (#1057); it was cleared to zero in #1058.
//
// What this reads: Tailwind class tokens in source text (comments stripped).
// Not read: inline `style={{ … }}` numbers and values computed in JS — those
// are charts' coordinate maths or real-world sizes (a 375×667 device frame),
// and a regex cannot tell them apart from layout.

const TARGETS = [
  { dir: "src/components", label: "部品" },
  { dir: "app", label: "サイト" },
]
const EXCEPTION_POLICY_PATH = "design/policy/grid4-exceptions.json"

const SPACING_UTILITIES = [
  "p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe",
  "m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
  "gap", "gap-x", "gap-y", "space-x", "space-y",
  "scroll-m", "scroll-mx", "scroll-my", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml",
  "scroll-p", "scroll-px", "scroll-py", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl",
]
const POSITION_UTILITIES = [
  "inset", "inset-x", "inset-y", "top", "right", "bottom", "left", "start", "end",
  "translate-x", "translate-y",
]
const SIZE_UTILITIES = ["w", "h", "size", "min-w", "min-h", "max-w", "max-h", "basis"]

const UTILITY_KIND = new Map([
  ...SPACING_UTILITIES.map((name) => [name, "spacing"]),
  ...POSITION_UTILITIES.map((name) => [name, "position"]),
  ...SIZE_UTILITIES.map((name) => [name, "size"]),
])

// Longest first so `gap-x` wins over `gap`, `min-w` over `w`, `scroll-mt` over `scroll-m`.
const UTILITY_ALTERNATION = [...UTILITY_KIND.keys()]
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/-/g, "\\-"))
  .join("|")

// variant chain (`sm:`, `hover:`, `[&_svg]:`, `data-[state=open]:`, `group-hover/x:`)
// · optional negative sign · utility · `-` · a numeric step or an arbitrary px/rem.
// A step is Tailwind's spacing multiplier (4px each): integer steps are always on
// the grid, so only a fractional step (`1.5`, `4.5`, `0.25`) can be off it.
const CLASS_TOKEN_PATTERN = new RegExp(
  String.raw`(?<![\w\-./\[])((?:(?:[\w\-/]+-)?\[[^\]\s]*\]:|[\w\-/]+:)*)(-?)(${UTILITY_ALTERNATION})-(?:(\d+\.\d+)|\[(-?\d*\.?\d+)(px|rem)\])(?![\w\-.\]/%])`,
  "g"
)

// An icon sized by prop (`<IconX size={14} />`) never reaches a class, so it is
// read separately. Same rule as `size-*`: under 12px is a detail.
const SIZE_PROP_PATTERN = /(?<![\w-])size=\{(\d+(?:\.\d+)?)\}/g

const SIZE_DETAIL_BELOW_PX = 12
const POSITION_DETAIL_BELOW_PX = 4

function listSourceFiles(rootDir) {
  const files = []
  if (!existsSync(rootDir)) return files
  const stack = [rootDir]
  while (stack.length > 0) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === "generated" || entry.name === "node_modules") continue
      const absolutePath = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }
      if (entry.isFile() && /\.(tsx|ts|jsx|js|mjs)$/.test(entry.name)) files.push(absolutePath)
    }
  }
  return files.sort()
}

// Blank out comments (keeping newlines so line numbers survive). A note like
// `// was gap-1.5` is not a class. `//` right after `:` is a URL, not a comment.
function stripComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (line, lead) => lead + " ".repeat(line.length - lead.length))
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length
}

function toPx(match) {
  const [, , , , step, arbitrary, unit] = match
  if (step !== undefined) return Number(step) * 4
  return Number(arbitrary) * (unit === "rem" ? 16 : 1)
}

// Returns null when the token is on the grid or an exempt detail; otherwise the
// reason it is off the grid.
function classifyToken(match) {
  const [, , negative, utility] = match
  const px = Math.abs(toPx(match))
  if (Number.isInteger(px) && px % 4 === 0) return null

  let kind = UTILITY_KIND.get(utility)
  // A negative margin pulls an element back over its neighbour — a placement
  // nudge, not a gap between two things.
  if (kind === "spacing" && negative === "-" && /^m/.test(utility)) kind = "position"

  if (kind === "size" && px < SIZE_DETAIL_BELOW_PX) return null
  if (kind === "position" && px < POSITION_DETAIL_BELOW_PX) return null
  return { kind, px }
}

export function collectGrid4Issues(relativeFilePath, content) {
  const issues = []
  const stripped = stripComments(content)
  for (const match of stripped.matchAll(CLASS_TOKEN_PATTERN)) {
    const verdict = classifyToken(match)
    if (!verdict) continue
    issues.push({
      file: relativeFilePath,
      className: match[0],
      kind: verdict.kind,
      px: verdict.px,
      line: lineNumberAt(stripped, match.index ?? 0),
    })
  }
  for (const match of stripped.matchAll(SIZE_PROP_PATTERN)) {
    const px = Number(match[1])
    if ((Number.isInteger(px) && px % 4 === 0) || px < SIZE_DETAIL_BELOW_PX) continue
    issues.push({
      file: relativeFilePath,
      className: match[0],
      kind: "size",
      px,
      line: lineNumberAt(stripped, match.index ?? 0),
    })
  }
  return issues
}

const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0
}

// Same contract as left-emphasis-exceptions.json: reason / addedOn / expiresOn
// mandatory, expiry enforced, and an exact `count` so the list never goes stale.
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

function collectIssuesByFile(root, target) {
  const byFile = new Map()
  for (const filePath of listSourceFiles(join(root, target))) {
    const relativeFilePath = relative(root, filePath)
    const issues = collectGrid4Issues(relativeFilePath, readFileSync(filePath, "utf-8"))
    if (issues.length > 0) byFile.set(relativeFilePath, issues)
  }
  return byFile
}

function formatIssue(issue) {
  return `${issue.file}:${issue.line} "${issue.className}"（${issue.px}px・${KIND_LABEL[issue.kind]}）`
}

const KIND_LABEL = { spacing: "余白", position: "位置", size: "大きさ" }

export function collectGrid4Report(root) {
  const { entries: exceptionEntries, policyIssues } = loadExceptionPolicy(root)
  const allowedCountByKey = new Map(
    exceptionEntries.map((entry) => [`${entry.file}::${entry.className}`, entry.count])
  )

  const violations = []
  let violationCount = 0
  const exceptionDrift = []
  const seenExceptionKeys = new Set()

  const issuesByTarget = TARGETS.map((target) => ({ ...target, byFile: collectIssuesByFile(root, target.dir) }))
  const allFiles = issuesByTarget.flatMap((target) => [...target.byFile])

  for (const [, issues] of allFiles.sort((a, b) => a[0].localeCompare(b[0]))) {
    // Reasoned exceptions are taken out first.
    const remaining = []
    const byKey = new Map()
    for (const issue of issues) {
      const key = `${issue.file}::${issue.className}`
      if (!byKey.has(key)) byKey.set(key, [])
      byKey.get(key).push(issue)
    }
    for (const [key, keyed] of byKey) {
      const allowed = allowedCountByKey.get(key)
      if (allowed === undefined) {
        remaining.push(...keyed)
        continue
      }
      seenExceptionKeys.add(key)
      if (keyed.length > allowed) {
        exceptionDrift.push(`${key} が例外 ${allowed} 件を超えて ${keyed.length} 件あります`)
        remaining.push(...keyed.slice(allowed))
      } else if (keyed.length < allowed) {
        exceptionDrift.push(
          `${key} は例外 ${allowed} 件に対し実測 ${keyed.length} 件です（count を ${keyed.length} に更新してください）`
        )
      }
    }
    violationCount += remaining.length
    violations.push(remaining.map(formatIssue))
  }

  for (const [key, allowed] of allowedCountByKey) {
    if (!seenExceptionKeys.has(key)) {
      exceptionDrift.push(`${key} は実測 0 件です（例外 ${allowed} 件のエントリを削除してください）`)
    }
  }

  return { violations: violations.flat(), violationCount, exceptionDrift, policyIssues, issuesByTarget }
}

// The detector proves itself on every run. The first fixtures are the values
// that actually reached @gunjo/ui unchecked (issue #1057), so a regex refactor
// that stops catching them fails CI instead of passing silently.
const SELF_TEST_FIXTURES = [
  {
    name: "MapControlButton の 34px・印 17px を検出する（#1057 で実際に見落とした値）",
    content: `sm: "h-[34px] w-[34px] [&_svg]:h-[17px] [&_svg]:w-[17px]",`,
    expect: ["h-[34px]", "w-[34px]", "[&_svg]:h-[17px]", "[&_svg]:w-[17px]"],
  },
  {
    name: "MapStatusCorner の px-3.5 pt-2.5 と LayerMenu の gap-2.5 を検出する",
    content: `<div className="px-3.5 pt-2.5" /><ul className="flex flex-col gap-2.5 p-1.5" />`,
    expect: ["px-3.5", "pt-2.5", "gap-2.5", "p-1.5"],
  },
  {
    name: "14px の印（size-3.5・h-3.5 w-3.5）は細部ではない",
    content: `<X className="h-3.5 w-3.5" /><svg className="size-3.5" />`,
    expect: ["h-3.5", "w-3.5", "size-3.5"],
  },
  {
    name: "props で渡す印の大きさも検出する（Toast の size={14}）・12 未満と 4 の倍数は通す",
    content: `<IconX size={14} stroke={2} /><X size={18} /><Icon size={16} /><Dot size={8} />`,
    expect: ["size={14}", "size={18}"],
  },
  {
    name: "並びの間は 2px でも検出する（gap-0.5・space-y-0.5）",
    content: `<div className="flex gap-0.5"><ul className="space-y-0.5" /></div>`,
    expect: ["gap-0.5", "space-y-0.5"],
  },
  {
    name: "変種の接頭辞つき・Tailwind v4 の小数段・rem の任意値も検出する",
    content: `<div className="sm:px-2.5 hover:mt-4.5 data-[state=open]:py-1.5 py-[0.15rem]" />`,
    expect: ["sm:px-2.5", "hover:mt-4.5", "data-[state=open]:py-1.5", "py-[0.15rem]"],
  },
  {
    name: "4px 以上の位置ずらしは配置として検出する",
    content: `<span className="absolute inset-[14px] top-[18px] -ml-[10px]" />`,
    expect: ["inset-[14px]", "top-[18px]", "-ml-[10px]"],
  },
  {
    name: "細部：12px 未満の線・点・目盛りは通す",
    content: `<span className="h-1.5 w-1.5 w-0.5 h-2.5 w-[3px] h-[5px] h-[11px] h-px w-px" />`,
    expect: [],
  },
  {
    name: "細部：4px 未満の中心合わせは通す",
    content: `<span className="-right-0.5 -top-0.5 translate-y-[0.5px] -ml-[1.5px] inset-y-[-3px] -mb-0.5" />`,
    expect: [],
  },
  {
    name: "4 の倍数・分数・対象外の札は通す",
    content: `<div className="p-4 gap-2 h-9 w-[320px] top-1/2 -translate-y-1/2 rounded-[10px] text-[13px] leading-[1.4] border-[1.5px] ring-offset-2" />`,
    expect: [],
  },
  {
    name: "注釈の中の札は数えない（URL の // は注釈ではない）",
    content: `// was gap-1.5\n/* py-2.5 */\nconst url = "https://x.test/p-1.5"; const c = "gap-1.5"`,
    expect: ["gap-1.5"],
  },
]

function runSelfTest({ verbose } = {}) {
  const failures = []
  for (const fixture of SELF_TEST_FIXTURES) {
    const found = collectGrid4Issues("fixture.tsx", fixture.content)
      .map((issue) => issue.className)
      .sort((a, b) => a.localeCompare(b))
    const expected = [...fixture.expect].sort((a, b) => a.localeCompare(b))
    const ok = JSON.stringify(found) === JSON.stringify(expected)
    if (!ok) failures.push(`${fixture.name}: expected [${expected.join(", ")}] but found [${found.join(", ")}]`)
    if (verbose) console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
  }
  return failures
}

export function verifyGrid4({ root = ROOT } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "check-grid4: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const { violations, violationCount, exceptionDrift, policyIssues } = collectGrid4Report(root)
  if (violations.length === 0 && exceptionDrift.length === 0 && policyIssues.length === 0) return

  const lines = []
  if (violations.length > 0) {
    lines.push(`design:verify: 4px グリッドから外れた余白・位置・大きさを ${violationCount} 件検出しました。`)
    lines.push(
      "KeEem 決定（new-4px DECISIONS.md 2026-10-11・#1057）: 並びの間・寄せの余白・操作部品と札と印の大きさは 4 の倍数。"
    )
    lines.push(
      "細部（12px 未満の線・点・目盛り／4px 未満の中心合わせ）は自動で通る。それ以外で外す必要があるものは理由つきで " +
        `${EXCEPTION_POLICY_PATH} へ（追加の前に KeEem に確認）。`
    )
    lines.push(...violations.map((violation) => `- ${violation}`))
  }
  if (policyIssues.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(`design:verify: ${EXCEPTION_POLICY_PATH} のエントリが不正です。`)
    lines.push(...policyIssues.map((entry) => `- ${entry}`))
  }
  if (exceptionDrift.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(`design:verify: ${EXCEPTION_POLICY_PATH} が実測とずれています。`)
    lines.push(...exceptionDrift.map((entry) => `- ${entry}`))
  }
  throwLinesError(lines)
}

const isCli = process.argv[1] && process.argv[1].endsWith("check-grid4.mjs")

if (isCli && process.argv.includes("--self-test")) {
  const failures = runSelfTest({ verbose: true })
  if (failures.length > 0) {
    console.error("check-grid4: self-test failed")
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log("check-grid4: self-test passed")
} else if (isCli && process.argv.includes("--report")) {
  const { issuesByTarget } = collectGrid4Report(ROOT)
  for (const { label, byFile } of issuesByTarget) {
    const total = [...byFile.values()].reduce((sum, issues) => sum + issues.length, 0)
    console.log(`${label}: ${byFile.size} ファイル・${total} 件`)
  }
} else if (isCli) {
  // Not runVerificationCli: its process.exit() cuts a long report off mid-write
  // when stdout/stderr is a pipe (`… | grep` saw ~870 of ~2,350 lines and read
  // "0 left"). exitCode lets the stream drain first.
  try {
    verifyGrid4()
    console.log("design:verify: 4px grid check passed")
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
