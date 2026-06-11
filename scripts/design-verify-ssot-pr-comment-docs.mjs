#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function sortUnique(values) {
  return [...new Set(values)].sort();
}

function collectWorkflowDefaults(workflowSource) {
  const entries = [...workflowSource.matchAll(/vars\.(SSOT_PR_COMMENT_[A-Z0-9_]+)\s*\|\|\s*'([^']*)'/g)];
  return new Map(entries.map((match) => [match[1], match[2]]));
}

function collectReadmeDefaults(readmeSource) {
  const entries = [
    ...readmeSource.matchAll(/\|\s*`(SSOT_PR_COMMENT_[A-Z0-9_]+)`\s*\|\s*`([^`]+)`\s*\|/g),
  ];
  return new Map(entries.map((match) => [match[1], match[2]]));
}

export function verifySsotPrCommentDocs({ root = ROOT } = {}) {
  const workflowPath = join(root, ".github", "workflows", "design-verify.yml");
  const readmePath = join(root, "design", "README.md");
  const workflowSource = readFileSync(workflowPath, "utf-8");
  const readmeSource = readFileSync(readmePath, "utf-8");

  const repoVariables = sortUnique(
    [...workflowSource.matchAll(/vars\.(SSOT_PR_COMMENT_[A-Z0-9_]+)/g)].map((match) => match[1])
  );
  const workflowDefaults = collectWorkflowDefaults(workflowSource);
  const readmeDefaults = collectReadmeDefaults(readmeSource);
  const labels = sortUnique(
    [...workflowSource.matchAll(/ssot-comment:[a-z-]+/g)].map((match) => match[0])
  );

  const missingVariables = repoVariables.filter((name) => !readmeSource.includes(name));
  const missingLabels = labels.filter((name) => !readmeSource.includes(name));
  const defaultMismatches = [];

  for (const [name, defaultValue] of workflowDefaults.entries()) {
    const readmeDefault = readmeDefaults.get(name);
    if (readmeDefault == null) continue;
    if (readmeDefault !== defaultValue) {
      defaultMismatches.push({ name, workflow: defaultValue, readme: readmeDefault });
    }
  }

  if (missingVariables.length === 0 && missingLabels.length === 0 && defaultMismatches.length === 0) {
    return;
  }

  const lines = [
    "design:verify: SSOT PR comment docs are out of sync with workflow config.",
    "Update design/README.md to include all SSOT PR comment labels and repo variables from .github/workflows/design-verify.yml.",
  ];

  if (missingVariables.length > 0) {
    lines.push("Missing repo variable references:");
    for (const name of missingVariables) {
      lines.push(`- ${name}`);
    }
  }

  if (missingLabels.length > 0) {
    lines.push("Missing label references:");
    for (const name of missingLabels) {
      lines.push(`- ${name}`);
    }
  }

  if (defaultMismatches.length > 0) {
    lines.push("Mismatched repo variable defaults between workflow and README:");
    for (const mismatch of defaultMismatches) {
      lines.push(`- ${mismatch.name}: workflow='${mismatch.workflow}' readme='${mismatch.readme}'`);
    }
  }

  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-ssot-pr-comment-docs.mjs",
  verify: verifySsotPrCommentDocs,
  successMessage: "design:verify: SSOT PR comment docs check passed",
});
