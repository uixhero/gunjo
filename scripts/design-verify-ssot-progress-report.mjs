#!/usr/bin/env node

import { verifyGeneratedStubCoverage } from "./design-verify-generated-stub-coverage.mjs";
import { verifyGeneratedDocsPageCoverage } from "./design-verify-generated-docs-page-coverage.mjs";
import { verifyComponentStyleDriftReport } from "./design-verify-component-style-drift-report.mjs";

const SSOT_PROGRESS_REPORT_SCHEMA_VERSION = 1;

function parseCategoryArgs(rawArgs) {
  const categories = [];

  const pushCategories = (value) => {
    for (const category of String(value).split(",")) {
      const trimmed = category.trim();
      if (trimmed.length > 0) categories.push(trimmed);
    }
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg.startsWith("--category=")) {
      pushCategories(arg.slice("--category=".length));
      continue;
    }
    if (arg.startsWith("--categories=")) {
      pushCategories(arg.slice("--categories=".length));
      continue;
    }
    if (arg === "--category" || arg === "--categories") {
      const value = rawArgs[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        pushCategories(value);
        index += 1;
      }
    }
  }

  if (categories.length === 0) return null;
  return [...new Set(categories)];
}

function parseRootArg(rawArgs) {
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg.startsWith("--root=")) return arg.slice("--root=".length);
    if (arg === "--root") {
      const value = rawArgs[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        return value;
      }
    }
  }
  return null;
}

function hasFlag(rawArgs, flag) {
  return rawArgs.includes(flag);
}

function buildScopedArgv(categories) {
  if (!categories || categories.length === 0) return [];
  return [`--categories=${categories.join(",")}`];
}

function summarizeByCategory(items, keySelector) {
  const counts = new Map();
  for (const item of items) {
    const key = keySelector(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

function toDocsCategory(relativePath) {
  const parts = String(relativePath).replaceAll("\\", "/").split("/");
  return parts[3] ?? "unknown";
}

function toCompletionRate(resolvedCount, scannedCount) {
  if (scannedCount <= 0) return null;
  return Number((resolvedCount / scannedCount).toFixed(4));
}

function buildCategoryProgress(scannedByCategory, unresolvedByCategory) {
  const categoryKeys = new Set([
    ...Object.keys(scannedByCategory ?? {}),
    ...Object.keys(unresolvedByCategory ?? {}),
  ]);
  const progressEntries = [...categoryKeys]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => {
      const scannedCount = scannedByCategory?.[category] ?? 0;
      const unresolvedCount = unresolvedByCategory?.[category] ?? 0;
      const resolvedCount = Math.max(scannedCount - unresolvedCount, 0);
      return [
        category,
        {
          scannedCount,
          unresolvedCount,
          resolvedCount,
          completionRate: toCompletionRate(resolvedCount, scannedCount),
        },
      ];
    });
  return Object.fromEntries(progressEntries);
}

function summarizeProgress({
  scannedItems,
  unresolvedItems,
  scannedKeySelector,
  unresolvedKeySelector,
}) {
  const scannedCount = scannedItems.length;
  const unresolvedCount = unresolvedItems.length;
  const resolvedCount = Math.max(scannedCount - unresolvedCount, 0);
  const scannedByCategory = summarizeByCategory(scannedItems, scannedKeySelector);
  const unresolvedByCategory = summarizeByCategory(unresolvedItems, unresolvedKeySelector);

  return {
    scannedCount,
    unresolvedCount,
    resolvedCount,
    completionRate: toCompletionRate(resolvedCount, scannedCount),
    byCategory: unresolvedByCategory,
    progressByCategory: buildCategoryProgress(scannedByCategory, unresolvedByCategory),
  };
}

function main() {
  const rawArgs = process.argv.slice(2);
  const categories = parseCategoryArgs(rawArgs);
  const jsonMode = hasFlag(rawArgs, "--json");
  const root = parseRootArg(rawArgs) ?? undefined;
  const scopeLabel = categories ? categories.join(", ") : "all categories";
  const scopedArgv = buildScopedArgv(categories);

  if (jsonMode) {
    const stubResult =
      verifyGeneratedStubCoverage({ root, categories, report: false }) ?? { unresolvedStubs: [] };
    const docsResult =
      verifyGeneratedDocsPageCoverage({ root, categories, report: false }) ?? {
        unresolvedPlaceholderPages: [],
      };
    const driftResult =
      verifyComponentStyleDriftReport({
        root,
        argv: scopedArgv,
        strict: false,
        silent: true,
      }) ?? {};

    const scannedStubs = stubResult.scannedStubs ?? [];
    const unresolvedStubs = stubResult.unresolvedStubs ?? [];
    const scannedDocsPages = docsResult.scannedPages ?? [];
    const unresolvedDocsPages = docsResult.unresolvedPlaceholderPages ?? [];
    const payload = {
      schemaVersion: SSOT_PROGRESS_REPORT_SCHEMA_VERSION,
      scope: categories ?? "all",
      stubs: summarizeProgress({
        scannedItems: scannedStubs,
        unresolvedItems: unresolvedStubs,
        scannedKeySelector: (item) => item.category,
        unresolvedKeySelector: (item) => item.category,
      }),
      docsPages: summarizeProgress({
        scannedItems: scannedDocsPages,
        unresolvedItems: unresolvedDocsPages,
        scannedKeySelector: (path) => toDocsCategory(path),
        unresolvedKeySelector: (path) => toDocsCategory(path),
      }),
      componentStyleDrift: driftResult,
    };

    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(`design:verify: ssot progress report (${scopeLabel})`);
  console.log("");
  console.log("[generated stubs]");
  verifyGeneratedStubCoverage({ root, categories, report: true });
  console.log("");
  console.log("[generated docs pages]");
  verifyGeneratedDocsPageCoverage({ root, categories, report: true });
  console.log("");
  console.log("[component style drift]");
  verifyComponentStyleDriftReport({ root, argv: scopedArgv, strict: false });
  console.log("");
  console.log("design:verify: ssot progress report completed");
}

try {
  main();
} catch (error) {
  const message =
    error?.code === "ENOENT" && typeof error?.path === "string"
      ? `design:verify: ssot progress report failed: missing required file (${error.path})`
      : error?.message ?? String(error);
  console.error(message);
  process.exit(1);
}
