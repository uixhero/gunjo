#!/usr/bin/env node

import fs from "node:fs";

const DEFAULT_MAX_ITEMS = 6;
const DEFAULT_COMMENT_MODE = "concise";
const COMMENT_MODES = new Set(["concise", "detailed"]);

function parseNumber(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return numeric;
}

function parseCliArgs(rawArgs) {
  let diffPath = null;
  let regressionReportPath = null;
  let regressionOutcome = null;
  let skippedReason = null;
  let maxItems = DEFAULT_MAX_ITEMS;
  let mode = DEFAULT_COMMENT_MODE;

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    const consumeValue = () => {
      const value = rawArgs[index + 1];
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new Error(`design:verify: ${arg} requires a value`);
      }
      index += 1;
      return value;
    };

    if (arg.startsWith("--diff=")) {
      diffPath = arg.slice("--diff=".length);
      continue;
    }
    if (arg === "--diff") {
      diffPath = consumeValue();
      continue;
    }

    if (arg.startsWith("--regression-report=")) {
      regressionReportPath = arg.slice("--regression-report=".length);
      continue;
    }
    if (arg === "--regression-report") {
      regressionReportPath = consumeValue();
      continue;
    }

    if (arg.startsWith("--regression-outcome=")) {
      regressionOutcome = arg.slice("--regression-outcome=".length);
      continue;
    }
    if (arg === "--regression-outcome") {
      regressionOutcome = consumeValue();
      continue;
    }

    if (arg.startsWith("--skipped-reason=")) {
      skippedReason = arg.slice("--skipped-reason=".length);
      continue;
    }
    if (arg === "--skipped-reason") {
      skippedReason = consumeValue();
      continue;
    }

    if (arg.startsWith("--max-items=")) {
      maxItems = parseNumber(arg.slice("--max-items=".length), DEFAULT_MAX_ITEMS);
      continue;
    }
    if (arg === "--max-items") {
      maxItems = parseNumber(consumeValue(), DEFAULT_MAX_ITEMS);
      continue;
    }

    if (arg.startsWith("--mode=")) {
      mode = arg.slice("--mode=".length);
      continue;
    }
    if (arg === "--mode") {
      mode = consumeValue();
      continue;
    }
  }

  if (!skippedReason && !diffPath) {
    throw new Error(
      "design:verify: ssot pr comment requires --diff=<diff-json-path> or --skipped-reason"
    );
  }
  if (!COMMENT_MODES.has(mode)) {
    throw new Error(
      `design:verify: unsupported comment mode "${mode}" (supported: ${[...COMMENT_MODES].join(", ")})`
    );
  }

  return {
    diffPath,
    regressionReportPath,
    regressionOutcome,
    skippedReason,
    maxItems,
    mode,
  };
}

function toSign(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : String(value);
}

function formatMetricDelta(metric) {
  if (metric.type === "rate") {
    const deltaPoint = Number(((metric.delta ?? 0) * 100).toFixed(1));
    return `${toSign(deltaPoint)}pt`;
  }
  return toSign(metric.delta);
}

function summarizeMetrics(metrics, trend, maxItems) {
  return metrics
    .filter((metric) => metric?.trend === trend)
    .slice(0, maxItems)
    .map(
      (metric) =>
        `- ${metric.label}: ${metric.base} -> ${metric.head} (${formatMetricDelta(metric)})`
    );
}

function summarizeCategoryRegressions(regressionReport, maxItems) {
  const categoryRegressions = Array.isArray(regressionReport?.categoryRegressions)
    ? regressionReport.categoryRegressions
    : [];
  return categoryRegressions
    .slice(0, maxItems)
    .map(
      (regression) =>
        `- ${regression.section}/${regression.category}: +${regression.delta} (allowed: +${regression.allowedDelta})`
    );
}

function summarizeMetricsByTrend(metrics, trend, maxItems) {
  return summarizeMetrics(metrics, trend, maxItems);
}

function renderSkippedComment(reason, mode) {
  return [
    "## SSOT PR Comment",
    "",
    `- mode: ${mode}`,
    "- status: skipped",
    `- reason: ${reason}`,
    "",
  ].join("\n");
}

function renderComment({ diffReport, regressionReport, regressionOutcome, maxItems, mode }) {
  const metrics = Array.isArray(diffReport?.metrics) ? diffReport.metrics : [];
  const improvedCount = metrics.filter((metric) => metric?.trend === "improved").length;
  const regressedCount = metrics.filter((metric) => metric?.trend === "regressed").length;
  const unchangedCount = metrics.filter((metric) => metric?.trend === "unchanged").length;
  const improvedLines = summarizeMetricsByTrend(metrics, "improved", maxItems);
  const regressedLines = summarizeMetricsByTrend(metrics, "regressed", maxItems);
  const unchangedLines = summarizeMetricsByTrend(metrics, "unchanged", maxItems);
  const categoryRegressionLines = summarizeCategoryRegressions(regressionReport, maxItems);
  const lines = [
    "## SSOT PR Comment",
    "",
    `- mode: ${mode}`,
    `- scope: ${diffReport?.scopes?.base ?? "unknown"} -> ${diffReport?.scopes?.head ?? "unknown"}`,
    `- regression gate: ${regressionOutcome ?? (regressionReport?.passed ? "success" : "unknown")}`,
    `- metric changes: improved=${improvedCount}, regressed=${regressedCount}, unchanged=${unchangedCount}`,
  ];

  if (regressedLines.length > 0) {
    lines.push("");
    lines.push("### Regressed");
    lines.push(...regressedLines);
  }

  if (improvedLines.length > 0) {
    lines.push("");
    lines.push("### Improved");
    lines.push(...improvedLines);
  }

  if (categoryRegressionLines.length > 0) {
    lines.push("");
    lines.push("### Category Regressions");
    lines.push(...categoryRegressionLines);
  }

  if (mode === "detailed") {
    lines.push("");
    lines.push("### Detailed");
    lines.push(
      `- schema version: ${diffReport?.schemaVersions?.base ?? "legacy"} -> ${diffReport?.schemaVersions?.head ?? "legacy"}`
    );
    lines.push(`- metric sample limit: ${maxItems}`);
    if (unchangedLines.length > 0) {
      lines.push("");
      lines.push("#### Unchanged (sample)");
      lines.push(...unchangedLines);
    } else {
      lines.push("- no unchanged metrics");
    }
  }

  if (
    mode === "concise" &&
    regressedLines.length === 0 &&
    improvedLines.length === 0 &&
    categoryRegressionLines.length === 0
  ) {
    lines.push("");
    lines.push("- no metric or category deltas");
  }

  lines.push("");
  return lines.join("\n");
}

function main() {
  const { diffPath, regressionReportPath, regressionOutcome, skippedReason, maxItems, mode } =
    parseCliArgs(process.argv.slice(2));

  if (skippedReason) {
    process.stdout.write(renderSkippedComment(skippedReason, mode));
    return;
  }

  const diffReport = JSON.parse(fs.readFileSync(diffPath, "utf8"));
  const regressionReport = regressionReportPath
    ? JSON.parse(fs.readFileSync(regressionReportPath, "utf8"))
    : null;
  process.stdout.write(
    renderComment({
      diffReport,
      regressionReport,
      regressionOutcome,
      maxItems,
      mode,
    })
  );
}

main();
