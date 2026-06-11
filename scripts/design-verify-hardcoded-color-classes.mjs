import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

const TARGET_PATHS = [
  "src/components/inputs",
  "src/components/display",
  "src/components/feedback",
  "src/components/navigation",
  "src/components/overlay",
  "src/components/layout",
  "src/components/patterns",
  "app",
]

const EXCEPTION_POLICY_PATH = "design/policy/hardcoded-color-class-exceptions.json"

const COLOR_SCALE_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|from|to|via|shadow|drop-shadow|stroke|fill)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-[0-9]{2,3})?(?:\/[0-9]{1,3})?\b/g
const ARBITRARY_COLOR_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|from|to|via|shadow|drop-shadow|stroke|fill)-\[[^\]]*(?:#|rgb|hsl|oklch|oklab|lab|lch)[^\]]*\]\b/g
const ARBITRARY_SHADOW_CLASS_PATTERN = /\b(?:shadow|drop-shadow)-\[[^\]]+\]\b/g
const INLINE_STYLE_COLOR_LITERAL_PATTERN =
  /\b(?:background(?:Color|Image)?|color|fill|stroke|boxShadow|filter)\s*:\s*["'`][^"'`]*(?:#(?:[0-9a-fA-F]{3,8})\b|rgba?\(|hsla?\()[^"'`]*["'`]/g

function listSourceFiles(rootDir) {
  const files = []
  const stack = [rootDir]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name === "generated") continue
      const absolutePath = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }
      if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        files.push(absolutePath)
      }
    }
  }

  return files
}

function listTargetFiles(root, relativePath) {
  const absolutePath = join(root, relativePath)
  if (/\.(ts|tsx)$/.test(relativePath)) {
    return [absolutePath]
  }

  return listSourceFiles(absolutePath)
}

function loadExceptionEntries(root) {
  const absolutePath = join(root, EXCEPTION_POLICY_PATH)
  const policy = JSON.parse(readFileSync(absolutePath, "utf-8"))
  const entries = Array.isArray(policy?.exceptions) ? policy.exceptions : []

  return entries
    .filter(
      (entry) =>
        typeof entry?.file === "string" &&
        entry.file.length > 0 &&
        typeof entry?.className === "string" &&
        entry.className.length > 0
    )
    .map((entry) => ({ file: entry.file, className: entry.className }))
}

function collectHardcodedColorClassIssues(root) {
  const files = TARGET_PATHS.flatMap((relativePath) =>
    listTargetFiles(root, relativePath)
  )
  const exceptionEntries = loadExceptionEntries(root)
  const exceptionKeySet = new Set(
    exceptionEntries.map(({ file, className }) => `${file}::${className}`)
  )
  const usedExceptionKeySet = new Set()

  const issues = []
  for (const filePath of files) {
    const relativeFilePath = relative(root, filePath)
    const content = readFileSync(filePath, "utf-8")
    const lines = content.split(/\r?\n/)
    const inlineStyleMatches = [...content.matchAll(INLINE_STYLE_COLOR_LITERAL_PATTERN)]

    for (const inlineStyleMatch of inlineStyleMatches) {
      const matchedFragment = inlineStyleMatch[0]
      if (matchedFragment.includes("var(--") || matchedFragment.includes("var(${")) continue

      const matchIndex = inlineStyleMatch.index ?? 0
      const lineNumber = content.slice(0, matchIndex).split(/\r?\n/).length
      issues.push(
        `${relativeFilePath}:${lineNumber} includes inline style color literal "${matchedFragment.trim()}"`
      )
    }

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
      const matches = line.match(COLOR_SCALE_CLASS_PATTERN)
      const arbitraryColorMatches = line.match(ARBITRARY_COLOR_CLASS_PATTERN)
      const arbitraryShadowMatches = line.match(ARBITRARY_SHADOW_CLASS_PATTERN)
      const allMatches = [
        ...new Set([
          ...(matches ?? []),
          ...(arbitraryColorMatches ?? []),
          ...(arbitraryShadowMatches ?? []),
        ]),
      ]
      if (allMatches.length === 0) continue

      for (const matchedClass of allMatches) {
        const isArbitraryShadowClass =
          matchedClass.startsWith("shadow-[") ||
          matchedClass.startsWith("drop-shadow-[")
        if (
          matchedClass.includes("var(--") &&
          !isArbitraryShadowClass
        ) {
          continue
        }

        const exceptionKey = `${relativeFilePath}::${matchedClass}`
        if (exceptionKeySet.has(exceptionKey)) {
          usedExceptionKeySet.add(exceptionKey)
          continue
        }

        issues.push(`${relativeFilePath}:${index + 1} includes "${matchedClass}"`)
      }
    }
  }

  const unusedExceptions = [...exceptionKeySet]
    .filter((exceptionKey) => !usedExceptionKeySet.has(exceptionKey))
    .sort((a, b) => a.localeCompare(b))

  return {
    issues: issues.sort((a, b) => a.localeCompare(b)),
    unusedExceptions,
  }
}

export function verifyNoHardcodedColorClasses({ root = ROOT } = {}) {
  const { issues, unusedExceptions } = collectHardcodedColorClassIssues(root)
  if (issues.length === 0 && unusedExceptions.length === 0) return

  const lines = []
  if (issues.length > 0) {
    lines.push("design:verify: hardcoded style classes detected in guarded UI sources.")
    lines.push(
      "Replace class names with design tokens (for example `bg-primary`, `text-muted-foreground`) and avoid arbitrary shadow utilities."
    )
    lines.push(...issues.map((issue) => `- ${issue}`))
  }

  if (unusedExceptions.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push(
      `design:verify: remove unused exceptions from ${EXCEPTION_POLICY_PATH}.`
    )
    lines.push(...unusedExceptions.map((entry) => `- ${entry}`))
  }

  throwLinesError(lines)
}

runVerificationCli({
  scriptName: "design-verify-hardcoded-color-classes.mjs",
  verify: verifyNoHardcodedColorClasses,
  successMessage: "design:verify: hardcoded color class check passed",
})
