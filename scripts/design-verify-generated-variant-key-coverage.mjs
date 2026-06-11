#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { verifyGeneratedVariantKeyCoverageForCategory } from "./design-verify-generated-variant-key-coverage-shared.mjs";
import { runVerificationCli } from "./design-verify-assertions.mjs";

export function verifyAllGeneratedVariantKeyCoverage({ root = ROOT } = {}) {
  for (const config of COMPONENT_SOURCE_CATEGORY_CONFIGS) {
    verifyGeneratedVariantKeyCoverageForCategory({
      root,
      category: config.category,
      label: config.category,
    });
  }
}

runVerificationCli({
  scriptName: "design-verify-generated-variant-key-coverage.mjs",
  verify: verifyAllGeneratedVariantKeyCoverage,
  successMessage: "design:verify: generated variant key coverage check passed",
});
