#!/usr/bin/env node

import { verifyComponentDrift } from "./design-verify-component-drift.mjs";
import { verifyAtomVariantKeyCoverage } from "./design-verify-atom-variant-key-coverage.mjs";
import { verifyAllGeneratedVariantKeyCoverage } from "./design-verify-generated-variant-key-coverage.mjs";
import { verifyAllGeneratedVariantKeyUsage } from "./design-verify-generated-variant-key-usage.mjs";
import { verifyDefaultVariantKeyCoverage } from "./design-verify-default-variant-key-coverage.mjs";
import { verifyAllDefaultVariantKeyUsage } from "./design-verify-default-variant-key-usage.mjs";
import { verifyMoleculeDrift } from "./design-verify-molecule-drift.mjs";
import { verifyOrganismDrift } from "./design-verify-organism-drift.mjs";
import { verifyTemplateDrift } from "./design-verify-template-drift.mjs";
import { verifyNodeSnapshotCoverage } from "./design-verify-node-snapshot-coverage.mjs";
import { verifyComponentStyleHintsCoverage } from "./design-verify-component-style-hints-coverage.mjs";
import { verifyComponentStyleDriftReport } from "./design-verify-component-style-drift-report.mjs";
import { verifySlotNodeCoverage } from "./design-verify-slot-node-coverage.mjs";
import { runVerificationCli } from "./design-verify-assertions.mjs";

export function verifyAllComponentDrift({ root } = {}) {
  verifyComponentDrift({ root });
  verifyAtomVariantKeyCoverage({ root });
  verifyAllGeneratedVariantKeyCoverage({ root });
  verifyAllGeneratedVariantKeyUsage({ root });
  verifyDefaultVariantKeyCoverage({ root });
  verifyAllDefaultVariantKeyUsage({ root });
  verifyMoleculeDrift({ root });
  verifyOrganismDrift({ root });
  verifyTemplateDrift({ root });
  verifyNodeSnapshotCoverage({ root });
  verifySlotNodeCoverage({ root });
  verifyComponentStyleHintsCoverage({ root });
  verifyComponentStyleDriftReport({ root, strict: true });
}

runVerificationCli({
  scriptName: "design-verify-components.mjs",
  verify: verifyAllComponentDrift,
  successMessage: "design:verify: component drift checks passed",
});
