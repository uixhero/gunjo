#!/usr/bin/env node

import { join } from "node:path";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function uniqueSlotIds(variants) {
  const values = [];
  for (const variant of variants) {
    if (!Array.isArray(variant?.children)) continue;
    for (const childId of variant.children) {
      if (typeof childId !== "string" || childId.length === 0) continue;
      if (!values.includes(childId)) values.push(childId);
    }
  }
  return values;
}

function collectNodeIds(componentSpec) {
  const nodes = componentSpec?.nodes;
  if (!nodes || typeof nodes !== "object") return new Set();
  return new Set(
    Object.values(nodes)
      .filter((node) => node && typeof node === "object")
      .map((node) => node.id)
      .filter((id) => typeof id === "string" && id.length > 0)
  );
}

export function verifySlotNodeCoverage({ root = ROOT } = {}) {
  const misses = [];

  for (const config of COMPONENT_SOURCE_CATEGORY_CONFIGS) {
    const spec = readJson(join(root, config.specPath));
    const components = spec?.components ?? {};

    for (const componentKey of Object.keys(components)) {
      const componentSpec = components[componentKey];
      const slotIds = uniqueSlotIds(componentSpec?.variants ?? []);
      if (slotIds.length === 0) continue;

      const nodeIds = collectNodeIds(componentSpec);
      const missingSlotNodeIds = slotIds.filter((slotId) => !nodeIds.has(slotId));
      if (missingSlotNodeIds.length === 0) continue;

      misses.push({
        category: config.category,
        componentKey,
        missingSlotNodeIds,
        specPath: config.specPath,
      });
    }
  }

  if (misses.length === 0) return;

  const lines = [
    "design:verify: slot -> node snapshot coverage mismatch detected in component-specs.",
    "Each variant children slot id should resolve to a node snapshot entry.",
  ];

  for (const miss of misses) {
    lines.push(
      `- [${miss.category}] ${miss.componentKey} (${miss.specPath}): ${miss.missingSlotNodeIds.join(", ")}`
    );
  }

  lines.push(
    "Run `npm run design:sync:components` and ensure nodeIds mappings in sync-*specs scripts cover variant slot ids."
  );
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-slot-node-coverage.mjs",
  verify: verifySlotNodeCoverage,
  successMessage: "design:verify: slot node coverage check passed",
});
