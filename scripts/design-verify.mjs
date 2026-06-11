#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { syncTokens } from "./design-sync/sync-tokens.mjs";
import { syncMetadata } from "./design-sync/sync-metadata.mjs";
import { syncComponentSpecs } from "./design-sync/sync-component-specs.mjs";
import { syncDocsNavigation } from "./design-sync/sync-docs-navigation.mjs";
import { ROOT } from "./design-sync/shared.mjs";
import { verifyAllComponentDrift } from "./design-verify-components.mjs";
import { verifyMetadataMapCoverage } from "./design-verify-metadata-map-coverage.mjs";
import { verifySpecCoverage } from "./design-verify-spec-coverage.mjs";
import { verifyDocsMetadataCoverage } from "./design-verify-docs-metadata-coverage.mjs";
import { verifyGeneratedStubCoverage } from "./design-verify-generated-stub-coverage.mjs";
import { verifyGeneratedDocsPageCoverage } from "./design-verify-generated-docs-page-coverage.mjs";
import { verifyDocsContentSsot } from "./design-verify-docs-content-ssot.mjs";
import { verifyDocsNavigationCoverage } from "./design-verify-docs-navigation-coverage.mjs";
import { verifyNavTranslationCoverage } from "./design-verify-nav-translation-coverage.mjs";
import { verifyDocsSpecImports } from "./design-verify-docs-spec-imports.mjs";
import { verifySsotPrCommentDocs } from "./design-verify-ssot-pr-comment-docs.mjs";
import { verifyNoHardcodedColorClasses } from "./design-verify-hardcoded-color-classes.mjs";
import { verifyAppGlobalsSync } from "./design-verify-app-globals-sync.mjs";
import { verifyTailwindColorTokens } from "./design-verify-tailwind-color-tokens.mjs";
import { verifyTailwindFoundationTokens } from "./design-verify-tailwind-foundation-tokens.mjs";
import { verifyTailwindPresetPlugins } from "./design-verify-tailwind-preset-plugins.mjs";
import { verifyTailwindThemeSsot } from "./design-verify-tailwind-theme-ssot.mjs";
import { verifyCssVariableCoverage } from "./design-verify-css-variable-coverage.mjs";
import { verifyColorContrast } from "./design-verify-color-contrast.mjs";
import { METADATA_SYNC_CATEGORY_CONFIGS } from "./design-sync/sync-metadata.mjs";
import { COMPONENT_SOURCE_CATEGORY_CONFIGS } from "./design-sync/component-source-map.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function dedupe(values) {
  return [...new Set(values)];
}

const STATIC_GENERATED_FILES = [
  "src/globals.css",
  "src/components/generated/component-manifest.ts",
  "src/components/generated/component-style-hints.ts",
  "src/index.ts",
  "app/lib/navigation.ts",
];

function buildGeneratedFiles() {
  const metadataFiles = METADATA_SYNC_CATEGORY_CONFIGS.map((config) => config.metadataPath);
  const componentSpecFiles = COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => config.specPath);
  const generatedVariantKeyFiles = COMPONENT_SOURCE_CATEGORY_CONFIGS.flatMap((config) => [
    `src/components/${config.category}/generated/variant-keys.ts`,
    `src/components/${config.category}/generated/default-variant-keys.ts`,
  ]);

  return dedupe([
    ...STATIC_GENERATED_FILES,
    ...metadataFiles,
    ...componentSpecFiles,
    ...generatedVariantKeyFiles,
  ]);
}

const GENERATED_FILES = buildGeneratedFiles();

function readSnapshot(filePath) {
  const absolutePath = join(ROOT, filePath);
  try {
    return readFileSync(absolutePath, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function snapshotGeneratedFiles() {
  return Object.fromEntries(
    GENERATED_FILES.map((filePath) => [filePath, readSnapshot(filePath)])
  );
}

function detectChangedFiles(before, after) {
  return GENERATED_FILES.filter((filePath) => before[filePath] !== after[filePath]);
}

function main() {
  const before = snapshotGeneratedFiles();

  syncTokens();
  syncMetadata();
  syncComponentSpecs();
  syncDocsNavigation();
  verifyMetadataMapCoverage({ root: ROOT });
  verifySpecCoverage({ root: ROOT });
  verifyDocsMetadataCoverage({ root: ROOT });
  verifyDocsContentSsot({ root: ROOT });
  verifySsotPrCommentDocs({ root: ROOT });
  verifyDocsNavigationCoverage({ root: ROOT });
  verifyNavTranslationCoverage({ root: ROOT });
  verifyDocsSpecImports({ root: ROOT });
  verifyGeneratedStubCoverage({ root: ROOT });
  verifyGeneratedDocsPageCoverage({ root: ROOT });
  verifyAllComponentDrift({ root: ROOT });
  verifyNoHardcodedColorClasses({ root: ROOT });
  verifyTailwindColorTokens({ root: ROOT });
  verifyTailwindFoundationTokens({ root: ROOT });
  verifyTailwindThemeSsot({ root: ROOT });
  verifyTailwindPresetPlugins({ root: ROOT });
  verifyCssVariableCoverage({ root: ROOT });
  verifyColorContrast({ root: ROOT });
  verifyAppGlobalsSync({ root: ROOT });

  const after = snapshotGeneratedFiles();
  const changedFiles = detectChangedFiles(before, after);

  if (changedFiles.length > 0) {
    const lines = [
      "design:verify: generated artifacts changed during verification.",
      "Run `npm run design:sync` and commit the updates:",
      ...changedFiles.map((filePath) => `- ${filePath}`),
    ];
    throwLinesError(lines);
  }
}

runVerificationCli({
  scriptName: "design-verify.mjs",
  verify: main,
  successMessage: "design:verify: passed",
});
