#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { ROOT } from "./design-sync/shared.mjs";
import { DOCS_COMPONENT_CATEGORY_CONFIGS } from "./design-sync/docs-component-config.mjs";
import { DOCS_PAGE_PLACEHOLDER_PATTERNS } from "./design-sync/docs-page-scaffold-rules.mjs";
import { listDocsComponentPages, toRelativePath } from "./design-verify-path-utils.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

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

function resolveTargetConfigs(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return DOCS_COMPONENT_CATEGORY_CONFIGS;
  }

  const configByCategory = new Map(
    DOCS_COMPONENT_CATEGORY_CONFIGS.map((config) => [config.category, config])
  );
  const unknownCategories = categories.filter((category) => !configByCategory.has(category));
  if (unknownCategories.length > 0) {
    const knownCategories = DOCS_COMPONENT_CATEGORY_CONFIGS.map((config) => config.category).join(", ");
    throw new Error(
      `design:verify:generated-docs-pages: unknown category: ${unknownCategories.join(", ")} (known: ${knownCategories})`
    );
  }

  return categories.map((category) => configByCategory.get(category));
}

function toPosixPath(path) {
  return path.replaceAll("\\", "/");
}

function isInTargetDocsDir(relativePath, targetConfigs) {
  const normalizedPath = toPosixPath(relativePath);
  return targetConfigs.some((config) => normalizedPath.startsWith(`${config.docsDir}/`));
}

function summarizeByCategory(unresolvedPlaceholderPages) {
  const countsByCategory = new Map();
  for (const page of unresolvedPlaceholderPages) {
    const parts = toPosixPath(page).split("/");
    const category = parts[3] ?? "unknown";
    countsByCategory.set(category, (countsByCategory.get(category) ?? 0) + 1);
  }
  return countsByCategory;
}

function printReport({ unresolvedPlaceholderPages, targetConfigs }) {
  const categoryLabel = targetConfigs.map((config) => config.category).join(", ");
  if (unresolvedPlaceholderPages.length === 0) {
    console.log(
      `design:verify: generated docs page report: no unresolved placeholder pages (${categoryLabel})`
    );
    return;
  }

  console.log(`design:verify: generated docs page report (${categoryLabel})`);
  const countsByCategory = summarizeByCategory(unresolvedPlaceholderPages);
  for (const [category, count] of countsByCategory.entries()) {
    console.log(`- ${category}: ${count}`);
  }
  for (const page of unresolvedPlaceholderPages) {
    console.log(`  - ${page}`);
  }
}

export function verifyGeneratedDocsPageCoverage({
  root = ROOT,
  categories = null,
  report = false,
} = {}) {
  const unresolvedPlaceholderPages = [];
  const scannedPages = [];
  const targetConfigs = resolveTargetConfigs(categories);

  for (const filePath of listDocsComponentPages(root)) {
    let source = "";
    try {
      source = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const relativePath = toRelativePath(root, filePath);
    if (!isInTargetDocsDir(relativePath, targetConfigs)) continue;
    scannedPages.push(relativePath);

    const hasPlaceholderContent = DOCS_PAGE_PLACEHOLDER_PATTERNS.some((pattern) =>
      source.includes(pattern)
    );
    if (hasPlaceholderContent) {
      unresolvedPlaceholderPages.push(relativePath);
    }
  }

  unresolvedPlaceholderPages.sort((a, b) => a.localeCompare(b));

  if (report) {
    printReport({ unresolvedPlaceholderPages, targetConfigs });
    return { unresolvedPlaceholderPages, scannedPages, targetConfigs };
  }

  if (unresolvedPlaceholderPages.length === 0) {
    return { unresolvedPlaceholderPages, scannedPages, targetConfigs };
  }

  const countsByCategory = summarizeByCategory(unresolvedPlaceholderPages);
  const lines = [
    "design:verify: unresolved docs page scaffold placeholders remain.",
    "Category summary:",
  ];

  for (const [category, count] of countsByCategory.entries()) {
    lines.push(`- ${category}: ${count}`);
  }

  if (unresolvedPlaceholderPages.length > 0) {
    lines.push("Scaffold placeholder content still remains in docs page source:");
    for (const page of unresolvedPlaceholderPages) {
      lines.push(`- ${page}`);
    }
  }

  lines.push(
    "Regenerate with `npm run design:sync:docs-pages:refresh` and replace unresolved scaffold placeholders."
  );
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-generated-docs-page-coverage.mjs",
  verify: () =>
    verifyGeneratedDocsPageCoverage({
      categories: parseCategoryArgs(process.argv.slice(2)),
      report: process.argv.includes("--report"),
    }),
  successMessage: "design:verify: generated docs page coverage check completed",
});
