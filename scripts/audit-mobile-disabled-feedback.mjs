#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_DIRS = ["app/docs/components", "app/components/demos", "app/patterns", "src/components"];
const OUTPUT_JSON = join(ROOT, "docs/mobile-feedback-disabled-audit.generated.json");
const OUTPUT_MD = join(ROOT, "docs/mobile-feedback-disabled-audit.generated.md");

const EXCLUDED_DIR_PARTS = [
  `${join("src", "components", "inputs", "generated")}`,
  `${join("src", "components", "display", "generated")}`,
  `${join("src", "components", "feedback", "generated")}`,
  `${join("src", "components", "layout", "generated")}`,
  `${join("src", "components", "navigation", "generated")}`,
  `${join("src", "components", "overlay", "generated")}`,
];

const JSX_DISABLED_RE = /<([A-Z][A-Za-z0-9.]*)\b[^>]*\b(?:disabled|aria-disabled)\b(?:\s*=\s*(?:\{[^}]*\}|"[^"]*"|'[^']*'))?[^>]*>/gs;
const COVERAGE_RE = /DisabledReasonTooltip|disabledReason|disabledReasonLabel|confirmDisabledReason|Tooltip(Content|Trigger|Button)?|tooltip=|tooltipOpenOnClick|labels\?\.disabled|labels\s*=\s*\{[\s\S]{0,700}\bdisabled\s*:|aria-label=\{typeof reason|title=/;
const HELPER_RE = /FormDescription|FormMessage|description|helper|reason|理由|できません|cannot|unavailable|locked|required|Select at least|入力|選択|処理中|保存中|送信中|Saving|Submitting|Loading/;
const NON_INTERACTIVE_COMPONENTS = new Set([
  "ComponentDemoStates",
  "FormLabel",
  "Label",
  "PropsTable",
]);
const COMPONENT_REASON_COVERAGE = new Map([
  [
    "ChatInputExample",
    "Local ChatInput docs example injects labels.disabled into ChatInput; the callsite only toggles the disabled scenario.",
  ],
]);

function readText(filePath) {
  return readFileSync(filePath, "utf-8");
}

function walk(dir) {
  const absolute = join(ROOT, dir);
  const entries = readdirSync(absolute, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(dir, entry.name);
    const absoluteEntryPath = join(ROOT, entryPath);
    if (EXCLUDED_DIR_PARTS.some((part) => entryPath.includes(part))) continue;
    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(absoluteEntryPath);
    }
  }

  return files;
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function excerpt(source, index, radius = 1200) {
  const start = Math.max(0, index - radius);
  const end = Math.min(source.length, index + radius);
  return source.slice(start, end);
}

function classify({ file, component, context, matchText }) {
  const relativeFile = relative(ROOT, file);
  const componentReasonCoverage = COMPONENT_REASON_COVERAGE.get(component);
  if (componentReasonCoverage) {
    return {
      status: "covered",
      reason: componentReasonCoverage,
    };
  }
  const hasCoverage = COVERAGE_RE.test(context);
  const hasHelper = HELPER_RE.test(context);
  const isPrimitive = relativeFile.startsWith("src/components/");
  const isStructuralPrimitive =
    isPrimitive &&
    (/interface\s+\w+Props|type\s+\w+Props|disabled\?:|disabled:/.test(context) || !relativeFile.includes("/docs/"));

  if (hasCoverage) {
    return {
      status: "covered",
      reason: "Tooltip / disabledReason / related explanation is present near the disabled control.",
    };
  }

  if (isStructuralPrimitive) {
    return {
      status: "primitive-contract",
      reason: "Primitive exposes disabled behavior; consuming docs or composition should provide the user-facing reason.",
    };
  }

  if (hasHelper) {
    return {
      status: "helper-only",
      reason: "Nearby helper text appears to explain the state, but no tooltip wrapper was detected.",
    };
  }

  if (/aria-disabled/.test(matchText)) {
    return {
      status: "aria-only",
      reason: "aria-disabled styling is present, but no tooltip or explicit reason was detected nearby.",
    };
  }

  return {
    status: "needs-review",
    reason: "Disabled control detected without nearby Tooltip, disabledReason, or explanatory helper text.",
  };
}

function collectFindings() {
  const files = TARGET_DIRS.flatMap(walk).sort((a, b) => a.localeCompare(b));
  const findings = [];

  for (const file of files) {
    const source = readText(file);
    let match;
    while ((match = JSX_DISABLED_RE.exec(source))) {
      const [matchText, component] = match;
      if (NON_INTERACTIVE_COMPONENTS.has(component)) continue;
      const context = excerpt(source, match.index);
      const classification = classify({ file, component, context, matchText });
      findings.push({
        file: relative(ROOT, file),
        line: lineNumberAt(source, match.index),
        component,
        status: classification.status,
        reason: classification.reason,
        snippet: matchText.replace(/\s+/g, " ").slice(0, 180),
      });
    }
  }

  return findings;
}

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function buildMarkdown(findings) {
  const byStatus = new Map();
  for (const finding of findings) {
    const bucket = byStatus.get(finding.status) ?? [];
    bucket.push(finding);
    byStatus.set(finding.status, bucket);
  }

  const order = ["covered", "primitive-contract", "helper-only", "aria-only", "needs-review"];
  const lines = [
    "# Mobile Disabled Feedback Static Audit",
    "",
    `Generated: ${today()}`,
    "",
    "Parent issue: #302",
    "",
    "This report is generated by `npm run docs:audit:mobile-disabled-feedback`.",
    "",
    "## Summary",
    "",
    `- Disabled JSX candidates scanned: ${findings.length}`,
    `- Covered by tooltip/reason pattern: ${byStatus.get("covered")?.length ?? 0}`,
    `- Primitive disabled contracts: ${byStatus.get("primitive-contract")?.length ?? 0}`,
    `- Helper-only candidates: ${byStatus.get("helper-only")?.length ?? 0}`,
    `- aria-only candidates: ${byStatus.get("aria-only")?.length ?? 0}`,
    `- Needs review: ${byStatus.get("needs-review")?.length ?? 0}`,
    "",
    "## Status Matrix",
    "",
    "| Status | Meaning |",
    "| --- | --- |",
    "| `covered` | Tooltip, `DisabledReasonTooltip`, `disabledReason`, or equivalent nearby explanation was detected. |",
    "| `primitive-contract` | A source component exposes disabled behavior; the consuming composition is responsible for the reason. |",
    "| `helper-only` | Nearby helper copy exists, but no tooltip wrapper was detected. Review if the disabled target itself needs a tooltip. |",
    "| `aria-only` | `aria-disabled` is present without a detected reason. |",
    "| `needs-review` | No nearby explanation was detected by the static scanner. |",
    "",
  ];

  for (const status of order) {
    const bucket = byStatus.get(status) ?? [];
    lines.push(`## ${status}`, "");
    if (bucket.length === 0) {
      lines.push("_No findings._", "");
      continue;
    }
    lines.push("| File | Line | Component | Reason | Snippet |");
    lines.push("| --- | ---: | --- | --- | --- |");
    for (const finding of bucket) {
      lines.push(
        `| \`${finding.file}\` | ${finding.line} | \`${finding.component}\` | ${finding.reason} | \`${finding.snippet.replaceAll("|", "\\|")}\` |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

const findings = collectFindings();
writeFileSync(
  OUTPUT_JSON,
  `${JSON.stringify({ generated: today(), parentIssue: 302, findings }, null, 2)}\n`
);
writeFileSync(OUTPUT_MD, `${buildMarkdown(findings)}\n`);

const needsReview = findings.filter((finding) => finding.status === "needs-review").length;
const helperOnly = findings.filter((finding) => finding.status === "helper-only").length;
const ariaOnly = findings.filter((finding) => finding.status === "aria-only").length;

console.log(`Scanned ${findings.length} disabled JSX candidates.`);
console.log(`needs-review=${needsReview} helper-only=${helperOnly} aria-only=${ariaOnly}`);
console.log(`Wrote ${relative(ROOT, OUTPUT_MD)} and ${relative(ROOT, OUTPUT_JSON)}.`);
