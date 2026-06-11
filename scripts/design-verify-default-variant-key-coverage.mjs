#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readJson, readText } from "./design-sync/shared.mjs";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { buildVariantKeyEntries } from "./design-sync/sync-variant-keys-shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function getExpectedDefaults(spec) {
  return Object.fromEntries(
    buildVariantKeyEntries(spec).map((entry) => [entry.key, entry.defaultKey])
  );
}

function getActualDefaultsFromGeneratedFile(filePath) {
  const source = readText(filePath);
  const regex = /^export const ([a-zA-Z0-9]+)DefaultVariantKey:[^=]*=\s*"([^"]+)";$/gm;

  const defaults = {};
  let match = regex.exec(source);
  while (match) {
    const componentKey = match[1];
    const defaultKey = match[2];
    defaults[componentKey] = defaultKey;
    match = regex.exec(source);
  }

  return defaults;
}

function compareDefaults(expected, actual) {
  const expectedComponents = new Set(Object.keys(expected));
  const actualComponents = new Set(Object.keys(actual));

  const missingComponents = [...expectedComponents]
    .filter((key) => !actualComponents.has(key))
    .sort((a, b) => a.localeCompare(b));
  const staleComponents = [...actualComponents]
    .filter((key) => !expectedComponents.has(key))
    .sort((a, b) => a.localeCompare(b));

  const mismatches = [];
  for (const componentKey of expectedComponents) {
    if (!actualComponents.has(componentKey)) continue;
    if (expected[componentKey] === actual[componentKey]) continue;
    mismatches.push({
      componentKey,
      expected: expected[componentKey],
      actual: actual[componentKey],
    });
  }

  return {
    missingComponents,
    staleComponents,
    mismatches: mismatches.sort((a, b) => a.componentKey.localeCompare(b.componentKey)),
  };
}

function verifyCoverage({ root, label, specPath, generatedPath }) {
  const expected = getExpectedDefaults(readJson(join(root, specPath)));
  const absoluteGeneratedPath = join(root, generatedPath);
  if (Object.keys(expected).length === 0 && !existsSync(absoluteGeneratedPath)) return;
  const actual = getActualDefaultsFromGeneratedFile(absoluteGeneratedPath);
  const { missingComponents, staleComponents, mismatches } = compareDefaults(expected, actual);

  const hasMismatch =
    missingComponents.length > 0 || staleComponents.length > 0 || mismatches.length > 0;
  if (!hasMismatch) return;

  const lines = [`design:verify: ${label} default variant key coverage mismatch detected.`];

  if (missingComponents.length > 0) {
    lines.push("Missing components in generated default variant keys:");
    for (const componentKey of missingComponents) {
      lines.push(`- ${componentKey}`);
    }
  }

  if (staleComponents.length > 0) {
    lines.push("Unexpected components in generated default variant keys:");
    for (const componentKey of staleComponents) {
      lines.push(`- ${componentKey}`);
    }
  }

  if (mismatches.length > 0) {
    lines.push("Mismatched default variant keys:");
    for (const mismatch of mismatches) {
      lines.push(
        `- ${mismatch.componentKey}: expected "${mismatch.expected}" but got "${mismatch.actual}"`
      );
    }
  }

  lines.push("Run `npm run design:sync:components` to regenerate default variant key exports.");
  throwLinesError(lines);
}

export function verifyDefaultVariantKeyCoverage({ root = ROOT } = {}) {
  for (const config of COMPONENT_SOURCE_CATEGORY_CONFIGS) {
    verifyCoverage({
      root,
      label: config.category,
      specPath: config.specPath,
      generatedPath: `${config.sourceDir}/generated/default-variant-keys.ts`,
    });
  }
}

runVerificationCli({
  scriptName: "design-verify-default-variant-key-coverage.mjs",
  verify: verifyDefaultVariantKeyCoverage,
  successMessage: "design:verify: default variant key coverage check passed",
});
