#!/usr/bin/env node

import fs from "node:fs";

const SUPPORTED_SCHEMA_VERSION = 1;

function parseCliArgs(rawArgs) {
  let basePath = null;
  let headPath = null;
  let jsonMode = false;
  let changedOnly = false;

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--json") {
      jsonMode = true;
      continue;
    }
    if (arg === "--changed-only") {
      changedOnly = true;
      continue;
    }
    if (arg.startsWith("--base=")) {
      basePath = arg.slice("--base=".length);
      continue;
    }
    if (arg.startsWith("--head=")) {
      headPath = arg.slice("--head=".length);
      continue;
    }
    if (arg === "--base" || arg === "--head") {
      const value = rawArgs[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        if (arg === "--base") {
          basePath = value;
        } else {
          headPath = value;
        }
        index += 1;
      }
    }
  }

  if (!basePath || !headPath) {
    throw new Error(
      "design:verify: ssot progress diff requires --base=<json-path> and --head=<json-path>"
    );
  }

  return { basePath, headPath, jsonMode, changedOnly };
}

function readReport(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function toNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return fallback;
}

function toRate(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function normalizeScope(scope) {
  if (Array.isArray(scope)) return scope.join(", ");
  if (typeof scope === "string" && scope.length > 0) return scope;
  return "unknown";
}

function resolveSchemaVersion(report) {
  const value = report?.schemaVersion;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function assertSupportedSchemaVersion(report, label) {
  const schemaVersion = resolveSchemaVersion(report);
  if (schemaVersion === null) return null;
  if (schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `design:verify: unsupported ssot progress schema version in ${label}: ${schemaVersion} (supported: ${SUPPORTED_SCHEMA_VERSION})`
    );
  }
  return schemaVersion;
}

function buildMetricDelta({
  key,
  label,
  baseValue,
  headValue,
  betterDirection,
  type = "count",
}) {
  const base = type === "rate" ? toRate(baseValue) : toNumber(baseValue);
  const head = type === "rate" ? toRate(headValue) : toNumber(headValue);
  const delta =
    typeof base === "number" && typeof head === "number" ? Number((head - base).toFixed(4)) : null;

  let trend = "unchanged";
  if (delta !== null && delta !== 0) {
    if (betterDirection === "lower") {
      trend = delta < 0 ? "improved" : "regressed";
    } else {
      trend = delta > 0 ? "improved" : "regressed";
    }
  }

  return {
    key,
    label,
    type,
    betterDirection,
    base,
    head,
    delta,
    trend,
  };
}

function compareCategoryCounts(baseMap, headMap, changedOnly = false) {
  const baseEntries = baseMap ?? {};
  const headEntries = headMap ?? {};
  const allCategories = new Set([...Object.keys(baseEntries), ...Object.keys(headEntries)]);

  const entries = [...allCategories]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => {
      const base = toNumber(baseEntries[category]);
      const head = toNumber(headEntries[category]);
      const delta = head - base;
      return [category, { base, head, delta }];
    });

  if (!changedOnly) return Object.fromEntries(entries);
  return Object.fromEntries(entries.filter(([, value]) => value.delta !== 0));
}

function formatCount(value) {
  return typeof value === "number" ? String(value) : "n/a";
}

function formatRate(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  return `${(value * 100).toFixed(1)}%`;
}

function formatDelta(value, type) {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  if (value === 0) return "0";
  if (type === "rate") return `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}pt`;
  return `${value > 0 ? "+" : ""}${value}`;
}

function formatTrend(trend) {
  if (trend === "improved") return "improved";
  if (trend === "regressed") return "regressed";
  return "unchanged";
}

function formatMetricValue(metric, field) {
  if (metric.type === "rate") return formatRate(metric[field]);
  return formatCount(metric[field]);
}

function formatCategoryDeltaMarkdown(title, categoryDiff) {
  const entries = Object.entries(categoryDiff);
  if (entries.length === 0) {
    return [`### ${title}`, "", "- no category changes"];
  }

  const lines = [
    `### ${title}`,
    "",
    "| Category | Base | Head | Delta |",
    "| --- | ---: | ---: | ---: |",
  ];
  for (const [category, value] of entries) {
    const deltaLabel = value.delta > 0 ? `+${value.delta}` : String(value.delta);
    lines.push(`| ${category} | ${value.base} | ${value.head} | ${deltaLabel} |`);
  }
  return lines;
}

function buildDiffReport({ baseReport, headReport, changedOnly = false }) {
  const baseSchemaVersion = assertSupportedSchemaVersion(baseReport, "base");
  const headSchemaVersion = assertSupportedSchemaVersion(headReport, "head");
  const metrics = [
    buildMetricDelta({
      key: "stubs_unresolved",
      label: "Unresolved generated stubs",
      baseValue: baseReport.stubs?.unresolvedCount,
      headValue: headReport.stubs?.unresolvedCount,
      betterDirection: "lower",
    }),
    buildMetricDelta({
      key: "stubs_completion_rate",
      label: "Generated stubs completion rate",
      baseValue: baseReport.stubs?.completionRate,
      headValue: headReport.stubs?.completionRate,
      betterDirection: "higher",
      type: "rate",
    }),
    buildMetricDelta({
      key: "docs_unresolved",
      label: "Unresolved generated docs pages",
      baseValue: baseReport.docsPages?.unresolvedCount,
      headValue: headReport.docsPages?.unresolvedCount,
      betterDirection: "lower",
    }),
    buildMetricDelta({
      key: "docs_completion_rate",
      label: "Generated docs pages completion rate",
      baseValue: baseReport.docsPages?.completionRate,
      headValue: headReport.docsPages?.completionRate,
      betterDirection: "higher",
      type: "rate",
    }),
    buildMetricDelta({
      key: "style_drift_components",
      label: "Components with style drift",
      baseValue: baseReport.componentStyleDrift?.counts?.componentsWithDrift,
      headValue: headReport.componentStyleDrift?.counts?.componentsWithDrift,
      betterDirection: "lower",
    }),
    buildMetricDelta({
      key: "style_drift_missing_manifest_entries",
      label: "Missing manifest entries",
      baseValue: baseReport.componentStyleDrift?.counts?.missingManifestEntries,
      headValue: headReport.componentStyleDrift?.counts?.missingManifestEntries,
      betterDirection: "lower",
    }),
    buildMetricDelta({
      key: "style_drift_missing_source_files",
      label: "Missing source files",
      baseValue: baseReport.componentStyleDrift?.counts?.missingSourceFiles,
      headValue: headReport.componentStyleDrift?.counts?.missingSourceFiles,
      betterDirection: "lower",
    }),
    buildMetricDelta({
      key: "style_drift_unused_exclusions",
      label: "Unused exclusions",
      baseValue: baseReport.componentStyleDrift?.counts?.unusedExclusions,
      headValue: headReport.componentStyleDrift?.counts?.unusedExclusions,
      betterDirection: "lower",
    }),
  ];

  const filteredMetrics = changedOnly ? metrics.filter((metric) => metric.delta !== 0) : metrics;

  const byCategory = {
    stubsUnresolved: compareCategoryCounts(
      baseReport.stubs?.byCategory,
      headReport.stubs?.byCategory,
      changedOnly
    ),
    docsUnresolved: compareCategoryCounts(
      baseReport.docsPages?.byCategory,
      headReport.docsPages?.byCategory,
      changedOnly
    ),
    styleDrift: compareCategoryCounts(
      baseReport.componentStyleDrift?.driftByCategory,
      headReport.componentStyleDrift?.driftByCategory,
      changedOnly
    ),
  };

  return {
    schemaVersions: {
      supported: SUPPORTED_SCHEMA_VERSION,
      base: baseSchemaVersion,
      head: headSchemaVersion,
    },
    scopes: {
      base: normalizeScope(baseReport.scope),
      head: normalizeScope(headReport.scope),
    },
    metrics: filteredMetrics,
    byCategory,
  };
}

function formatMarkdown(diff) {
  const lines = [
    "## SSOT Progress Diff",
    "",
    `- Schema version (base/head): ${diff.schemaVersions.base ?? "legacy"} / ${diff.schemaVersions.head ?? "legacy"} (supported: ${diff.schemaVersions.supported})`,
    `- Base scope: ${diff.scopes.base}`,
    `- Head scope: ${diff.scopes.head}`,
    "",
    "| Metric | Base | Head | Delta | Trend |",
    "| --- | ---: | ---: | ---: | --- |",
  ];

  if (diff.metrics.length === 0) {
    lines.push("| (no changed metrics) | - | - | - | unchanged |");
  } else {
    for (const metric of diff.metrics) {
      lines.push(
        `| ${metric.label} | ${formatMetricValue(metric, "base")} | ${formatMetricValue(metric, "head")} | ${formatDelta(metric.delta, metric.type)} | ${formatTrend(metric.trend)} |`
      );
    }
  }

  lines.push("");
  lines.push(...formatCategoryDeltaMarkdown("Stubs Unresolved by Category", diff.byCategory.stubsUnresolved));
  lines.push("");
  lines.push(...formatCategoryDeltaMarkdown("Docs Unresolved by Category", diff.byCategory.docsUnresolved));
  lines.push("");
  lines.push(...formatCategoryDeltaMarkdown("Style Drift by Category", diff.byCategory.styleDrift));
  return lines.join("\n");
}

function main() {
  const { basePath, headPath, jsonMode, changedOnly } = parseCliArgs(process.argv.slice(2));
  const baseReport = readReport(basePath);
  const headReport = readReport(headPath);
  const diff = buildDiffReport({ baseReport, headReport, changedOnly });

  if (jsonMode) {
    console.log(JSON.stringify(diff, null, 2));
    return;
  }
  console.log(formatMarkdown(diff));
}

main();
