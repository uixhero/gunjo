#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { ROOT } from "./design-sync/shared.mjs";
import { listDocsComponentPages, toRelativePath } from "./design-verify-path-utils.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

export function verifyDocsSpecImports({ root = ROOT } = {}) {
  const directSpecImports = [];

  for (const filePath of listDocsComponentPages(root)) {
    const source = readFileSync(filePath, "utf-8");
    if (source.includes('@design/component-specs/')) {
      directSpecImports.push(toRelativePath(root, filePath));
    }
  }

  if (directSpecImports.length === 0) return;

  const lines = [
    "design:verify: docs pages import component specs directly.",
    "Use helpers from app/lib/docs-spec.ts instead of importing @design/component-specs/* in docs pages.",
  ];

  for (const filePath of directSpecImports.sort((a, b) => a.localeCompare(b))) {
    lines.push(`- ${filePath}`);
  }

  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-docs-spec-imports.mjs",
  verify: verifyDocsSpecImports,
  successMessage: "design:verify: docs spec import check passed",
});
