#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function findLineNumbers(source, pattern) {
  return source
    .split("\n")
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter((entry) => pattern.test(entry.line))
    .map((entry) => entry.lineNumber);
}

export function verifyDocsContentSsot({ root = ROOT } = {}) {
  const enContentPath = join(root, "app", "lib", "docs-content", "en.ts");
  const componentsIndexPath = join(root, "app", "docs", "components", "page.tsx");
  const enSource = readFileSync(enContentPath, "utf-8");
  const componentsIndexSource = readFileSync(componentsIndexPath, "utf-8");

  const duplicatedComponentEntries = findLineNumbers(
    enSource,
    /["']components\/(?:atoms|molecules|organisms|templates)\//
  );
  const hasManualDescriptionFallback = /function\s+getComponentDescription\s*\(/.test(
    componentsIndexSource
  );

  if (duplicatedComponentEntries.length === 0 && !hasManualDescriptionFallback) return;

  const lines = [
    "design:verify: docs content SSOT mismatch detected.",
    "Component description source must be metadata (or ja translation content), not duplicated hardcoded maps.",
  ];

  if (duplicatedComponentEntries.length > 0) {
    lines.push("Remove component page entries from app/lib/docs-content/en.ts lines:");
    for (const lineNumber of duplicatedComponentEntries) {
      lines.push(`- ${lineNumber}`);
    }
  }

  if (hasManualDescriptionFallback) {
    lines.push(
      "Remove `getComponentDescription` fallback map from app/docs/components/page.tsx."
    );
  }

  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-docs-content-ssot.mjs",
  verify: verifyDocsContentSsot,
  successMessage: "design:verify: docs content SSOT check passed",
});
