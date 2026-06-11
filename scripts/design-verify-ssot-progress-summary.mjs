#!/usr/bin/env node

import fs from "node:fs";

const SUPPORTED_SCHEMA_VERSION = 1;

function parseCliArgs(rawArgs) {
  let inputPath = null;

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg.startsWith("--input=")) {
      inputPath = arg.slice("--input=".length);
      continue;
    }
    if (arg === "--input") {
      const value = rawArgs[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        inputPath = value;
        index += 1;
      }
    }
  }

  if (!inputPath) {
    throw new Error("design:verify: ssot progress summary requires --input=<json-path>");
  }

  return { inputPath };
}

function normalizeScope(scope) {
  if (Array.isArray(scope)) return scope.join(", ");
  if (typeof scope === "string" && scope.length > 0) return scope;
  return "unknown";
}

function formatCountsByCategory(countsByCategory) {
  const entries = Object.entries(countsByCategory ?? {}).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return "-";
  return entries.map(([category, count]) => `${category}:${count}`).join(", ");
}

function formatRate(rate) {
  if (typeof rate !== "number" || Number.isNaN(rate)) return "n/a";
  return `${(rate * 100).toFixed(1)}%`;
}

function resolveSchemaVersion(report) {
  const value = report?.schemaVersion;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function assertSupportedSchemaVersion(report) {
  const schemaVersion = resolveSchemaVersion(report);
  if (schemaVersion === null) return null;
  if (schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `design:verify: unsupported ssot progress schema version: ${schemaVersion} (supported: ${SUPPORTED_SCHEMA_VERSION})`
    );
  }
  return schemaVersion;
}

function formatSummaryMarkdown(report) {
  const schemaVersion = assertSupportedSchemaVersion(report);
  const driftCounts = report.componentStyleDrift?.counts ?? {};
  const lines = [
    "## SSOT Progress",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    `| Schema version | ${schemaVersion ?? "legacy"} |`,
    `| Scope | ${normalizeScope(report.scope)} |`,
    `| Scanned generated stubs | ${report.stubs?.scannedCount ?? "n/a"} |`,
    `| Resolved generated stubs | ${report.stubs?.resolvedCount ?? "n/a"} |`,
    `| Unresolved generated stubs | ${report.stubs?.unresolvedCount ?? "n/a"} |`,
    `| Generated stubs completion rate | ${formatRate(report.stubs?.completionRate)} |`,
    `| Scanned generated docs pages | ${report.docsPages?.scannedCount ?? "n/a"} |`,
    `| Resolved generated docs pages | ${report.docsPages?.resolvedCount ?? "n/a"} |`,
    `| Unresolved generated docs pages | ${report.docsPages?.unresolvedCount ?? "n/a"} |`,
    `| Generated docs pages completion rate | ${formatRate(report.docsPages?.completionRate)} |`,
    `| Components with style drift | ${driftCounts.componentsWithDrift ?? "n/a"} |`,
    `| Missing manifest entries | ${driftCounts.missingManifestEntries ?? "n/a"} |`,
    `| Missing source files | ${driftCounts.missingSourceFiles ?? "n/a"} |`,
    `| Excluded components | ${driftCounts.excludedComponents ?? "n/a"} |`,
    `| Unused exclusions | ${driftCounts.unusedExclusions ?? "n/a"} |`,
    `| Stubs by category | ${formatCountsByCategory(report.stubs?.byCategory)} |`,
    `| Docs pages by category | ${formatCountsByCategory(report.docsPages?.byCategory)} |`,
    `| Style drift by category | ${formatCountsByCategory(report.componentStyleDrift?.driftByCategory)} |`,
  ];

  return lines.join("\n");
}

function main() {
  const { inputPath } = parseCliArgs(process.argv.slice(2));
  const report = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  console.log(formatSummaryMarkdown(report));
}

main();
