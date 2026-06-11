#!/usr/bin/env node

import { verifyGeneratedStubCoverage } from "./design-verify-generated-stub-coverage.mjs";
import { verifyGeneratedDocsPageCoverage } from "./design-verify-generated-docs-page-coverage.mjs";

function parseCategoryArgs(rawArgs) {
  const categories = [];

  const pushCategories = (value) => {
    for (const category of String(value).split(",")) {
      const trimmed = category.trim();
      if (trimmed.length > 0) categories.push(trimmed);
    }
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg.startsWith("--category=")) {
      pushCategories(arg.slice("--category=".length));
      continue;
    }
    if (arg.startsWith("--categories=")) {
      pushCategories(arg.slice("--categories=".length));
      continue;
    }
    if (arg === "--category" || arg === "--categories") {
      const value = rawArgs[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        pushCategories(value);
        index += 1;
      }
    }
  }

  if (categories.length === 0) return null;
  return [...new Set(categories)];
}

function main() {
  const categories = parseCategoryArgs(process.argv.slice(2));
  const scopeLabel = categories ? categories.join(", ") : "all categories";

  console.log(`design:verify: generated artifacts report (${scopeLabel})`);
  console.log("");
  console.log("[stubs]");
  verifyGeneratedStubCoverage({ categories, report: true });
  console.log("");
  console.log("[docs-pages]");
  verifyGeneratedDocsPageCoverage({ categories, report: true });
  console.log("");
  console.log("design:verify: generated artifacts report completed");
}

main();
