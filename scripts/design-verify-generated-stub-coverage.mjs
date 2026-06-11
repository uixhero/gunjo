#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPONENT_SOURCE_CATEGORY_CONFIGS,
  getComponentFileName,
} from "./design-sync/component-source-map.mjs";
import {
  GENERATED_STUB_MARKER,
  PRODUCTION_STUB_MARKER,
} from "./design-sync/component-stub-markers.mjs";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { toRelativePath } from "./design-verify-path-utils.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";
const GENERATED_STUB_PLACEHOLDERS = [
  "Flesh out this component.",
  "Edit classes as needed.",
  "Generated slot placeholder. Replace with concrete UI/content.",
  "data-slot-placeholder",
];

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
    return COMPONENT_SOURCE_CATEGORY_CONFIGS;
  }

  const configByCategory = new Map(
    COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => [config.category, config])
  );
  const unknownCategories = categories.filter((category) => !configByCategory.has(category));
  if (unknownCategories.length > 0) {
    const knownCategories = COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => config.category).join(", ");
    throw new Error(
      `design:verify:generated-stubs: unknown category: ${unknownCategories.join(", ")} (known: ${knownCategories})`
    );
  }

  return categories.map((category) => configByCategory.get(category));
}

function printStubCoverageReport({ unresolvedStubs, targetConfigs }) {
  const categoryLabel = targetConfigs.map((config) => config.category).join(", ");
  if (unresolvedStubs.length === 0) {
    console.log(`design:verify: generated stub report: no unresolved stubs (${categoryLabel})`);
    return;
  }

  console.log(`design:verify: generated stub report (${categoryLabel})`);
  const countsByCategory = new Map();
  for (const stub of unresolvedStubs) {
    countsByCategory.set(stub.category, (countsByCategory.get(stub.category) ?? 0) + 1);
  }

  for (const [category, count] of countsByCategory.entries()) {
    console.log(`- ${category}: ${count}`);
  }

  for (const stub of unresolvedStubs) {
    console.log(
      `  - [${stub.category}] ${stub.componentKey}: ${stub.filePath} (${stub.reasons.join(", ")})`
    );
  }
}

export function verifyGeneratedStubCoverage({
  root = ROOT,
  categories = null,
  report = false,
} = {}) {
  const unresolvedStubs = [];
  const scannedStubs = [];
  const targetConfigs = resolveTargetConfigs(categories);

  for (const config of targetConfigs) {
    const spec = readJson(join(root, config.specPath));
    const components = spec?.components ?? {};

    for (const componentKey of Object.keys(components)) {
      const fileName = getComponentFileName(componentKey, config.fileNameOverrides);
      const absolutePath = join(root, config.sourceDir, fileName);
      if (!existsSync(absolutePath)) continue;
      const relativePath = toRelativePath(root, absolutePath);
      scannedStubs.push({
        category: config.category,
        componentKey,
        filePath: relativePath,
      });

      const source = readFileSync(absolutePath, "utf-8");
      const hasGeneratedMarker = source.includes(GENERATED_STUB_MARKER);
      const hasProductionMarker = source.includes(PRODUCTION_STUB_MARKER);
      const hasPlaceholderText = GENERATED_STUB_PLACEHOLDERS.some((placeholder) =>
        source.includes(placeholder)
      );
      if (!hasGeneratedMarker && !hasProductionMarker && !hasPlaceholderText) continue;

      unresolvedStubs.push({
        category: config.category,
        componentKey,
        filePath: relativePath,
        reasons: [
          ...(hasGeneratedMarker ? ["generated marker"] : []),
          ...(hasProductionMarker ? ["production marker"] : []),
          ...(hasPlaceholderText ? ["placeholder text"] : []),
        ],
      });
    }
  }

  if (report) {
    printStubCoverageReport({ unresolvedStubs, targetConfigs });
    return { unresolvedStubs, scannedStubs, targetConfigs };
  }

  if (unresolvedStubs.length === 0) {
    return { unresolvedStubs, scannedStubs, targetConfigs };
  }

  const countsByCategory = new Map();
  for (const stub of unresolvedStubs) {
    countsByCategory.set(stub.category, (countsByCategory.get(stub.category) ?? 0) + 1);
  }

  const lines = [
    "design:verify: generated component stubs are still present.",
    "Replace generated placeholder implementations before commit:",
    "Category summary:",
  ];

  for (const [category, count] of countsByCategory.entries()) {
    lines.push(`- ${category}: ${count}`);
  }

  lines.push("Unresolved files:");
  for (const stub of unresolvedStubs) {
    lines.push(`- [${stub.category}] ${stub.componentKey}: ${stub.filePath} (${stub.reasons.join(", ")})`);
  }

  lines.push(
    "If a component is newly added, use the generated stub only as a starting point (or generate production-ready scaffolds via `npm run design:sync:stubs:production`)."
  );
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-generated-stub-coverage.mjs",
  verify: () =>
    verifyGeneratedStubCoverage({
      categories: parseCategoryArgs(process.argv.slice(2)),
      report: process.argv.includes("--report"),
    }),
  successMessage: "design:verify: generated stub coverage check completed",
});
