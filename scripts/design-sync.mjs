#!/usr/bin/env node
/**
 * design:sync orchestrator
 *
 * Usage:
 *   npm run design:sync
 *   npm run design:sync -- --from-metadata
 *   npm run design:sync -- --tokens
 *   npm run design:sync -- --metadata
 *   npm run design:sync -- --components
 *   npm run design:sync -- --docs-navigation
 *   npm run design:sync -- --docs-pages
 *   npm run design:sync -- --docs-pages --category=atoms
 *   npm run design:sync -- --stubs
 *   npm run design:sync -- --stubs --category=atoms
 *   npm run design:sync -- --stubs --categories=atoms,molecules
 *   npm run design:sync -- --stubs --production-stubs
 *   npm run design:sync -- --docs-pages --refresh-generated
 *   npm run design:sync -- --stubs --refresh-generated
 */

import { syncTokens } from "./design-sync/sync-tokens.mjs";
import { syncMetadata } from "./design-sync/sync-metadata.mjs";
import { syncComponentSpecs } from "./design-sync/sync-component-specs.mjs";
import { syncDocsNavigation } from "./design-sync/sync-docs-navigation.mjs";
import { syncDocsPages } from "./design-sync/sync-docs-pages.mjs";
import { syncComponentStubs } from "./design-sync/sync-component-stubs.mjs";

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
  const rawArgs = process.argv.slice(2);
  const args = new Set(rawArgs);
  const fromMetadata = args.has("--from-metadata");
  const refreshGenerated = args.has("--refresh-generated");
  const productionStubs = args.has("--production-stubs");
  const scopedCategories = parseCategoryArgs(rawArgs);

  const hasScopedTarget =
    args.has("--tokens") ||
    args.has("--metadata") ||
    args.has("--components") ||
    args.has("--docs-navigation") ||
    args.has("--docs-pages") ||
    args.has("--stubs");

  const runTokens = !hasScopedTarget || args.has("--tokens");
  const runMetadata = !hasScopedTarget || args.has("--metadata");
  const runComponents = !hasScopedTarget || args.has("--components");
  const runDocsNavigation =
    !hasScopedTarget || args.has("--docs-navigation") || runMetadata;
  const runDocsPages = !hasScopedTarget || args.has("--docs-pages") || runMetadata;
  const runStubs = !hasScopedTarget || args.has("--stubs");

  if (runTokens) {
    syncTokens();
  }

  if (runMetadata) {
    syncMetadata({ fromMetadata });
  }

  if (runComponents) {
    syncComponentSpecs();
  }

  if (runDocsNavigation) {
    syncDocsNavigation();
  }

  if (runDocsPages) {
    syncDocsPages({ refreshGenerated, categories: scopedCategories });
  }

  if (runStubs) {
    syncComponentStubs({
      refreshGenerated,
      production: productionStubs,
      categories: scopedCategories,
    });
  }
}

main();
