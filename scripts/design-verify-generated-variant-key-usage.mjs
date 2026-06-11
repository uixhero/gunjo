#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { getVariantDefinitionFileName } from "./design-verify-component-file-map.mjs";
import { verifyGeneratedVariantKeyUsageForCategory } from "./design-verify-generated-variant-key-usage-shared.mjs";
import { runVerificationCli } from "./design-verify-assertions.mjs";

export function verifyAllGeneratedVariantKeyUsage({ root = ROOT } = {}) {
  for (const config of COMPONENT_SOURCE_CATEGORY_CONFIGS) {
    verifyGeneratedVariantKeyUsageForCategory({
      root,
      category: config.category,
      label: config.category,
      getComponentFileName: getVariantDefinitionFileName,
    });
  }
}

runVerificationCli({
  scriptName: "design-verify-generated-variant-key-usage.mjs",
  verify: verifyAllGeneratedVariantKeyUsage,
  successMessage: "design:verify: generated variant key usage check passed",
});
