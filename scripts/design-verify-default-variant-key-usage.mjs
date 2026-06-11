#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readJson, readText } from "./design-sync/shared.mjs";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { buildVariantKeyEntries } from "./design-sync/sync-variant-keys-shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";
import {
  VARIANT_DEFINITION_FILE_OVERRIDES,
  getComponentFileName,
} from "./design-verify-component-file-map.mjs";

function verifyDefaultVariantKeyUsage({
  root,
  label,
  specPath,
  componentsDir,
}) {
  const spec = readJson(join(root, specPath));
  const expectedComponents = buildVariantKeyEntries(spec).map((entry) => entry.key);
  const missingFiles = [];
  const missingUsage = [];

  for (const componentKey of expectedComponents) {
    const fileName = getComponentFileName(componentKey, VARIANT_DEFINITION_FILE_OVERRIDES);
    const filePath = join(root, componentsDir, fileName);
    const defaultVariantKeyName = `${componentKey}DefaultVariantKey`;

    if (!existsSync(filePath)) {
      missingFiles.push({ componentKey, fileName });
      continue;
    }

    const source = readText(filePath);
    if (!new RegExp(`\\b${defaultVariantKeyName}\\b`).test(source)) {
      missingUsage.push({ componentKey, fileName, defaultVariantKeyName });
    }
  }

  if (missingFiles.length === 0 && missingUsage.length === 0) return;

  const lines = [`design:verify: ${label} default variant key usage mismatch detected.`];

  if (missingFiles.length > 0) {
    lines.push(`Missing ${label} implementation files:`);
    for (const item of missingFiles) {
      lines.push(`- ${item.componentKey}: expected ${componentsDir}/${item.fileName}`);
    }
  }

  if (missingUsage.length > 0) {
    lines.push(`Missing generated default variant key usage in ${label} implementation:`);
    for (const item of missingUsage) {
      lines.push(
        `- ${item.componentKey}: expected \`${item.defaultVariantKeyName}\` in ${componentsDir}/${item.fileName}`
      );
    }
  }

  lines.push("Import the generated default variant key from `generated/default-variant-keys.ts`.");
  throwLinesError(lines);
}

export function verifyAllDefaultVariantKeyUsage({ root = ROOT } = {}) {
  for (const config of COMPONENT_SOURCE_CATEGORY_CONFIGS) {
    verifyDefaultVariantKeyUsage({
      root,
      label: config.category,
      specPath: config.specPath,
      componentsDir: config.sourceDir,
    });
  }
}

runVerificationCli({
  scriptName: "design-verify-default-variant-key-usage.mjs",
  verify: verifyAllDefaultVariantKeyUsage,
  successMessage: "design:verify: default variant key usage check passed",
});
