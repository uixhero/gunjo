#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DOCS_COMPONENT_CATEGORY_CONFIGS,
  DOCS_COMPONENT_COMPOSITES,
  metadataKeyToSlug,
} from "./design-sync/docs-component-config.mjs";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const COMPONENT_CATEGORY_CONFIGS = DOCS_COMPONENT_CATEGORY_CONFIGS.map((config) => ({
  category: config.category,
  metadataPath: config.metadataPath,
})).filter((config) => config.category !== "patterns");

const CATEGORY_OVERVIEW_SLUGS = new Set([
  "inputs",
  "display",
  "charts",
  "feedback",
  "navigation",
  "overlay",
  "layout",
]);

function readNavigationSlugs(source) {
  // Flat URLs after the atomic→functional taxonomy migration. The
  // section grouping in navigation.ts is now functional (Inputs / Display
  // / etc.) so we no longer extract source tier from the URL — every
  // /docs/components/<slug> entry is a component nav item.
  const slugs = new Set();
  const pattern = /href:\s*"\/docs\/components\/([^"\/]+)"/g;

  let match = pattern.exec(source);
  while (match) {
    slugs.add(match[1]);
    match = pattern.exec(source);
  }

  return slugs;
}

function buildExpectedSlugs(category, metadataKeys) {
  const expected = new Set();
  const consumedKeys = new Set();
  const compositeItems = DOCS_COMPONENT_COMPOSITES[category] ?? [];

  for (const composite of compositeItems) {
    if (!composite.metadataKeys.every((key) => metadataKeys.includes(key))) continue;

    expected.add(composite.slug);
    for (const key of composite.metadataKeys) {
      consumedKeys.add(key);
    }
  }

  for (const key of metadataKeys) {
    if (consumedKeys.has(key)) continue;
    expected.add(metadataKeyToSlug(category, key));
  }

  return expected;
}

function collectSortedDiff(sourceSet, targetSet) {
  return [...sourceSet].filter((value) => !targetSet.has(value)).sort((a, b) => a.localeCompare(b));
}

export function verifyDocsNavigationCoverage({ root = ROOT } = {}) {
  const navigationPath = join(root, "app", "lib", "navigation.ts");
  const navigationSource = readFileSync(navigationPath, "utf-8");
  const navSlugs = readNavigationSlugs(navigationSource);
  const errors = [];

  // Aggregate expected slugs across all source tiers. After the flat URL
  // migration, navigation.ts no longer carries source-tier information,
  // so coverage is checked as a single union.
  const expectedSlugs = new Set();
  for (const config of COMPONENT_CATEGORY_CONFIGS) {
    const metadata = readJson(join(root, config.metadataPath));
    const metadataKeys = Object.keys(metadata ?? {});
    for (const slug of buildExpectedSlugs(config.category, metadataKeys)) {
      expectedSlugs.add(slug);
    }
  }

  const missingInNavigation = collectSortedDiff(expectedSlugs, navSlugs);
  const navComponentSlugs = new Set(
    [...navSlugs].filter(
      (slug) => !CATEGORY_OVERVIEW_SLUGS.has(slug)
    )
  );
  const unexpectedInNavigation = collectSortedDiff(navComponentSlugs, expectedSlugs);

  if (missingInNavigation.length > 0) {
    errors.push(`Missing in navigation: ${missingInNavigation.join(", ")}`);
  }

  if (unexpectedInNavigation.length > 0) {
    errors.push(`Unexpected in navigation: ${unexpectedInNavigation.join(", ")}`);
  }

  const missingDocPages = [...navSlugs]
    .filter((slug) => !existsSync(join(root, "app", "docs", "components", slug, "page.tsx")))
    .sort((a, b) => a.localeCompare(b));

  if (missingDocPages.length > 0) {
    errors.push(`Missing docs page.tsx: ${missingDocPages.join(", ")}`);
  }

  if (errors.length === 0) return;

  const lines = ["design:verify: docs navigation coverage mismatch detected.", ...errors];
  lines.push("Navigation under app/lib/navigation.ts must stay aligned with metadata + docs pages.");
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-docs-navigation-coverage.mjs",
  verify: verifyDocsNavigationCoverage,
  successMessage: "design:verify: docs navigation coverage check passed",
});
