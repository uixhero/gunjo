#!/usr/bin/env node

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { sorted } from "./design-verify-collections.mjs";
import { METADATA_SYNC_CATEGORY_CONFIGS } from "./design-sync/sync-metadata.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";
// Exclusion governance: design/policy/coverage-exclusions.md

const EXCLUDED_ATOM_METADATA = new Set([
  // Add atoms keys here when intentionally excluded from component-spec coverage.
]);

const EXCLUDED_MOLECULE_METADATA = new Set();
const EXCLUDED_ORGANISM_METADATA = new Set();
const EXCLUDED_TEMPLATE_METADATA = new Set();

const EXCLUDED_ATOM_SOURCE_COMPONENTS = new Set([
  // Add atom component keys here when intentionally excluded from source-file parity checks.
]);
const EXCLUDED_MOLECULE_SOURCE_COMPONENTS = new Set();
const EXCLUDED_ORGANISM_SOURCE_COMPONENTS = new Set();
const EXCLUDED_TEMPLATE_SOURCE_COMPONENTS = new Set();
const EXCLUDED_DISPLAY_SOURCE_COMPONENTS = new Set([
  // chart-tooltip — internal chart hover helper, not a public component; permanent; added 2026-05-10.
  "chart-tooltip",
]);
const EXCLUDED_OVERLAY_SOURCE_COMPONENTS = new Set([
  // aiChatInput / aiChatMessage — compatibility aliases that re-export ChatInput / ChatMessage during the AIChat → Chat migration; permanent while aliases remain; added 2026-06-02.
  "aiChatInput",
  "aiChatMessage",
]);
const EXCLUDED_INPUTS_SOURCE_COMPONENTS = new Set([
  // voiceInputButton — internal ChatInput control, not a standalone public docs component; permanent; added 2026-06-02.
  "voiceInputButton",
]);
const EXCLUDED_PATTERNS_SOURCE_COMPONENTS = new Set();

const EXCLUDED_METADATA_BY_CATEGORY = {
  atoms: EXCLUDED_ATOM_METADATA,
  molecules: EXCLUDED_MOLECULE_METADATA,
  organisms: EXCLUDED_ORGANISM_METADATA,
  templates: EXCLUDED_TEMPLATE_METADATA,
};

const EXCLUDED_SOURCE_BY_CATEGORY = {
  atoms: EXCLUDED_ATOM_SOURCE_COMPONENTS,
  molecules: EXCLUDED_MOLECULE_SOURCE_COMPONENTS,
  organisms: EXCLUDED_ORGANISM_SOURCE_COMPONENTS,
  templates: EXCLUDED_TEMPLATE_SOURCE_COMPONENTS,
  display: EXCLUDED_DISPLAY_SOURCE_COMPONENTS,
  overlay: EXCLUDED_OVERLAY_SOURCE_COMPONENTS,
  inputs: EXCLUDED_INPUTS_SOURCE_COMPONENTS,
  patterns: EXCLUDED_PATTERNS_SOURCE_COMPONENTS,
};

function pascalToCamel(name) {
  if (!name) return name;
  const head = name.match(/^[A-Z]+(?=[A-Z][a-z]|$)/)?.[0];
  const normalized = head ? head.toLowerCase() + name.slice(head.length) : name;
  return normalized.charAt(0).toLowerCase() + normalized.slice(1);
}

function listSourceComponentKeys(root, sourceDir, excluded = new Set()) {
  const absoluteDir = join(root, sourceDir);
  if (!existsSync(absoluteDir)) {
    return [];
  }
  const names = readdirSync(absoluteDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""))
    .map((name) => pascalToCamel(name))
    .filter((key) => !excluded.has(key));

  return sorted(names);
}

function verifyCategoryCoverage({
  metadata,
  specs,
  sourceKeys,
  excludedMetadata,
}) {
  const metadataKeys = new Set(Object.keys(metadata || {}));
  const expectedKeys = sorted(
    [...metadataKeys].filter((key) => !excludedMetadata.has(key))
  );

  const specKeys = sorted(Object.keys(specs?.components || {}));
  const specSet = new Set(specKeys);
  const missingSpecs = expectedKeys.filter((key) => !specSet.has(key));
  const staleSpecs = specKeys.filter(
    (key) => !metadataKeys.has(key) && !excludedMetadata.has(key)
  );

  const sourceSet = new Set(sourceKeys);
  const missingMetadataForSource = sourceKeys.filter((key) => !metadataKeys.has(key));
  const metadataWithoutSource = expectedKeys.filter((key) => !sourceSet.has(key));

  const hasMismatch =
    missingSpecs.length > 0 ||
    staleSpecs.length > 0 ||
    missingMetadataForSource.length > 0 ||
    metadataWithoutSource.length > 0;

  return {
    hasMismatch,
    missingSpecs,
    staleSpecs,
    missingMetadataForSource,
    metadataWithoutSource,
  };
}

function buildSpecCoverageCategories() {
  const metadataPathByCategory = new Map(
    METADATA_SYNC_CATEGORY_CONFIGS.map((config) => [config.label, config.metadataPath])
  );

  return COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => {
    const category = config.category;
    const metadataPath = metadataPathByCategory.get(category);

    if (!metadataPath) {
      throw new Error(
        `design:verify: missing metadata sync category config for "${category}".`
      );
    }

    return {
      label: category,
      metadataPath,
      specPath: config.specPath,
      sourceDir: config.sourceDir,
      excludedMetadata: EXCLUDED_METADATA_BY_CATEGORY[category] ?? new Set(),
      excludedSource: EXCLUDED_SOURCE_BY_CATEGORY[category] ?? new Set(),
    };
  });
}

export function verifySpecCoverage({ root = ROOT } = {}) {
  const categories = buildSpecCoverageCategories().map((category) => {
    const metadata = readJson(join(root, category.metadataPath));
    const specs = readJson(join(root, category.specPath));
    const sourceKeys = listSourceComponentKeys(root, category.sourceDir, category.excludedSource);

    return {
      ...category,
      ...verifyCategoryCoverage({
        metadata,
        specs,
        sourceKeys,
        excludedMetadata: category.excludedMetadata,
      }),
    };
  });

  if (categories.some((category) => category.hasMismatch)) {
    const lines = ["design:verify: component spec coverage mismatch detected."];

    for (const category of categories) {
      if (!category.hasMismatch) continue;

      lines.push(`[${category.label}]`);

      if (category.missingSpecs.length > 0) {
        lines.push(`Missing in ${category.specPath}:`);
        for (const key of category.missingSpecs) {
          lines.push(`- ${key}`);
        }
      }

      if (category.staleSpecs.length > 0) {
        lines.push(`Unexpected keys in ${category.specPath}:`);
        for (const key of category.staleSpecs) {
          lines.push(`- ${key}`);
        }
      }

      if (category.missingMetadataForSource.length > 0) {
        lines.push(`Missing keys in ${category.metadataPath} required by source components:`);
        for (const key of category.missingMetadataForSource) {
          lines.push(`- ${key}`);
        }
      }

      if (category.metadataWithoutSource.length > 0) {
        lines.push(`Keys in ${category.metadataPath} without source component in ${category.sourceDir}:`);
        for (const key of category.metadataWithoutSource) {
          lines.push(`- ${key}`);
        }
      }
    }

    lines.push(
      "Run `npm run design:sync:components`, then `npm run design:sync:stubs`, and update exclusions (see design/policy/coverage-exclusions.md) if intentional."
    );
    throwLinesError(lines);
  }
}

runVerificationCli({
  scriptName: "design-verify-spec-coverage.mjs",
  verify: verifySpecCoverage,
  successMessage: "design:verify: component spec coverage check passed",
});
