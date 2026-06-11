#!/usr/bin/env node

import fs from "node:fs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const SUPPORTED_SCHEMA_VERSION = 1;
const DEFAULT_THRESHOLDS = {
  maxUnresolvedStubs: 0,
  maxUnresolvedDocsPages: 0,
  maxStyleDriftComponents: 0,
  maxMissingManifestEntries: 0,
  maxMissingSourceFiles: 0,
  maxUnusedExclusions: 0,
  minStubsCompletionRate: 1,
  minDocsPagesCompletionRate: 1,
};

function parseNumber(rawValue, flagName) {
  const numeric = Number(rawValue);
  if (!Number.isFinite(numeric)) {
    throw new Error(`design:verify: invalid numeric value for ${flagName}: ${rawValue}`);
  }
  return numeric;
}

function parseThresholdArgs(rawArgs) {
  let inputPath = null;
  const thresholds = { ...DEFAULT_THRESHOLDS };
  const flagMap = {
    "--max-unresolved-stubs": "maxUnresolvedStubs",
    "--max-unresolved-docs-pages": "maxUnresolvedDocsPages",
    "--max-style-drift-components": "maxStyleDriftComponents",
    "--max-missing-manifest-entries": "maxMissingManifestEntries",
    "--max-missing-source-files": "maxMissingSourceFiles",
    "--max-unused-exclusions": "maxUnusedExclusions",
    "--min-stubs-completion-rate": "minStubsCompletionRate",
    "--min-docs-pages-completion-rate": "minDocsPagesCompletionRate",
  };

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
      continue;
    }

    const [flagName, inlineValue] = arg.includes("=") ? arg.split("=", 2) : [arg, null];
    const thresholdKey = flagMap[flagName];
    if (!thresholdKey) continue;

    const value = inlineValue ?? rawArgs[index + 1];
    if (inlineValue === null) {
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new Error(`design:verify: ${flagName} requires a numeric value`);
      }
      index += 1;
    }
    thresholds[thresholdKey] = parseNumber(value, flagName);
  }

  if (!inputPath) {
    throw new Error("design:verify: ssot progress thresholds requires --input=<json-path>");
  }
  return { inputPath, thresholds };
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

function toNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return fallback;
}

function toRate(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return fallback;
}

function verifyThresholds({ report, thresholds }) {
  const schemaVersion = assertSupportedSchemaVersion(report);
  const stubsUnresolved = toNumber(report.stubs?.unresolvedCount);
  const docsUnresolved = toNumber(report.docsPages?.unresolvedCount);
  const stubsCompletionRate = toRate(report.stubs?.completionRate);
  const docsCompletionRate = toRate(report.docsPages?.completionRate);
  const driftCounts = report.componentStyleDrift?.counts ?? {};

  const checks = [
    {
      ok: stubsUnresolved <= thresholds.maxUnresolvedStubs,
      message: `- unresolved generated stubs: ${stubsUnresolved} (max: ${thresholds.maxUnresolvedStubs})`,
    },
    {
      ok: docsUnresolved <= thresholds.maxUnresolvedDocsPages,
      message: `- unresolved generated docs pages: ${docsUnresolved} (max: ${thresholds.maxUnresolvedDocsPages})`,
    },
    {
      ok: toNumber(driftCounts.componentsWithDrift) <= thresholds.maxStyleDriftComponents,
      message: `- components with style drift: ${toNumber(driftCounts.componentsWithDrift)} (max: ${thresholds.maxStyleDriftComponents})`,
    },
    {
      ok: toNumber(driftCounts.missingManifestEntries) <= thresholds.maxMissingManifestEntries,
      message: `- missing manifest entries: ${toNumber(driftCounts.missingManifestEntries)} (max: ${thresholds.maxMissingManifestEntries})`,
    },
    {
      ok: toNumber(driftCounts.missingSourceFiles) <= thresholds.maxMissingSourceFiles,
      message: `- missing source files: ${toNumber(driftCounts.missingSourceFiles)} (max: ${thresholds.maxMissingSourceFiles})`,
    },
    {
      ok: toNumber(driftCounts.unusedExclusions) <= thresholds.maxUnusedExclusions,
      message: `- unused exclusions: ${toNumber(driftCounts.unusedExclusions)} (max: ${thresholds.maxUnusedExclusions})`,
    },
    {
      ok: stubsCompletionRate >= thresholds.minStubsCompletionRate,
      message: `- generated stubs completion rate: ${stubsCompletionRate} (min: ${thresholds.minStubsCompletionRate})`,
    },
    {
      ok: docsCompletionRate >= thresholds.minDocsPagesCompletionRate,
      message: `- generated docs pages completion rate: ${docsCompletionRate} (min: ${thresholds.minDocsPagesCompletionRate})`,
    },
  ];

  const failingChecks = checks.filter((check) => !check.ok).map((check) => check.message);
  if (failingChecks.length > 0) {
    throwLinesError([
      "design:verify: ssot progress threshold check failed.",
      `schemaVersion: ${schemaVersion ?? "legacy"}`,
      "Violations:",
      ...failingChecks,
    ]);
  }

  console.log(
    `design:verify: ssot progress threshold check passed (schemaVersion: ${schemaVersion ?? "legacy"})`
  );
}

function runThresholdCli() {
  const { inputPath, thresholds } = parseThresholdArgs(process.argv.slice(2));
  const report = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  verifyThresholds({ report, thresholds });
}

runVerificationCli({
  scriptName: "design-verify-ssot-progress-thresholds.mjs",
  verify: runThresholdCli,
  successMessage: "design:verify: ssot progress threshold check completed",
});
