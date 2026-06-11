#!/usr/bin/env node

import { join } from "node:path";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

export function verifyNodeSnapshotCoverage({ root = ROOT } = {}) {
  const errors = [];

  for (const config of COMPONENT_SOURCE_CATEGORY_CONFIGS) {
    const spec = readJson(join(root, config.specPath));
    const components = spec?.components ?? {};

    for (const componentKey of Object.keys(components)) {
      const nodes = components[componentKey]?.nodes;
      if (!nodes || typeof nodes !== "object") continue;

      for (const [nodeKey, node] of Object.entries(nodes)) {
        if (!node || typeof node !== "object") {
          errors.push(
            `[${config.category}] ${componentKey}: nodes.${nodeKey} is missing`
          );
          continue;
        }

        if (typeof node.id !== "string" || node.id.length === 0) {
          errors.push(
            `[${config.category}] ${componentKey}: nodes.${nodeKey} has invalid id`
          );
        }
      }
    }
  }

  if (errors.length === 0) return;

  const lines = [
    "design:verify: node snapshot coverage mismatch detected in component-specs.",
    "Each nodes.* entry must resolve to a snapshot object with a valid id.",
    ...errors.map((entry) => `- ${entry}`),
    "Run `npm run design:sync:components` and fix missing nodeIds mappings in sync-*specs scripts.",
  ];
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-node-snapshot-coverage.mjs",
  verify: verifyNodeSnapshotCoverage,
  successMessage: "design:verify: node snapshot coverage check passed",
});
