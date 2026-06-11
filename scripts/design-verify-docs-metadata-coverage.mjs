#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DOCS_COMPONENT_CATEGORY_CONFIGS,
  DOCS_COMPONENT_COMPOSITES,
  metadataKeyToSlug,
  // eslint-disable-next-line no-unused-vars
} from "./design-sync/docs-component-config.mjs";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function listDocSlugs(root, docsDir) {
  return readdirSync(join(root, docsDir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => existsSync(join(root, docsDir, slug, "page.tsx")))
    .sort((a, b) => a.localeCompare(b));
}

function buildCompositePageKeyMap() {
  const map = new Map();

  for (const [category, composites] of Object.entries(DOCS_COMPONENT_COMPOSITES)) {
    for (const composite of composites) {
      map.set(`${category}/${composite.slug}`, composite.metadataKeys);
    }
  }

  return map;
}

function verifyCategory({ root, config, compositePageKeys }) {
  const metadata = readJson(join(root, config.metadataPath));
  const metadataKeys = Object.keys(metadata ?? {});
  // The flat docs dir contains pages from all four source tiers; filter
  // to slugs that THIS tier's metadata (or its composites) owns.
  const allSlugs = listDocSlugs(root, config.docsDir);
  const metadataKeysBySlug = new Map(
    metadataKeys.map((key) => [metadataKeyToSlug(config.category, key), key])
  );
  const compositesForCategory = DOCS_COMPONENT_COMPOSITES[config.category] ?? [];
  const compositeSlugsForCategory = new Set(
    compositesForCategory
      .filter((c) => c.metadataKeys.every((k) => metadataKeys.includes(k)))
      .map((c) => c.slug)
  );
  const slugs = allSlugs.filter(
    (slug) => metadataKeysBySlug.has(slug) || compositeSlugsForCategory.has(slug)
  );
  const coveredMetadataKeys = new Set();

  const missingMetadataKeys = [];
  const missingImports = [];
  const missingTitleBindings = [];
  const missingDescriptionBindings = [];

  for (const slug of slugs) {
    const pageId = `${config.category}/${slug}`;
    const expectedKeys = compositePageKeys.get(pageId) ?? [metadataKeysBySlug.get(slug)];
    const pagePath = join(root, config.docsDir, slug, "page.tsx");
    const source = readFileSync(pagePath, "utf-8");
    const expectedImport = `import ${config.metadataVarName} from "${config.metadataImportPath}";`;

    if (!source.includes(expectedImport)) {
      missingImports.push(pageId);
    }

    for (const key of expectedKeys) {
      if (!key) {
        missingMetadataKeys.push({ pageId, expectedKey: `(unresolved from slug: ${slug})` });
        continue;
      }

      const componentMeta = metadata[key];
      if (!componentMeta) {
        missingMetadataKeys.push({ pageId, expectedKey: key });
        continue;
      }

      coveredMetadataKeys.add(key);

      const expectedTitleRef = new RegExp(`\\.${key}\\.title\\b`);
      const expectedDescriptionRef = new RegExp(`\\.${key}\\.description\\b`);

      if (!expectedTitleRef.test(source)) {
        missingTitleBindings.push(`${pageId} (${key})`);
      }
      if (!expectedDescriptionRef.test(source)) {
        missingDescriptionBindings.push(`${pageId} (${key})`);
      }
    }
  }

  const metadataWithoutDocPage = metadataKeys.filter((key) => !coveredMetadataKeys.has(key));

  return {
    category: config.category,
    metadataPath: config.metadataPath,
    docsDir: config.docsDir,
    missingMetadataKeys,
    missingImports,
    missingTitleBindings,
    missingDescriptionBindings,
    metadataWithoutDocPage,
  };
}

export function verifyDocsMetadataCoverage({ root = ROOT } = {}) {
  const compositePageKeys = buildCompositePageKeyMap();

  const categories = DOCS_COMPONENT_CATEGORY_CONFIGS.map((config) =>
    verifyCategory({ root, config, compositePageKeys })
  );

  const hasMismatch = categories.some((category) => {
    return (
      category.missingMetadataKeys.length > 0 ||
      category.missingImports.length > 0 ||
      category.missingTitleBindings.length > 0 ||
      category.missingDescriptionBindings.length > 0 ||
      category.metadataWithoutDocPage.length > 0
    );
  });

  if (!hasMismatch) return;

  const lines = ["design:verify: docs metadata coverage mismatch detected."];

  for (const category of categories) {
    const {
      metadataPath,
      docsDir,
      missingMetadataKeys,
      missingImports,
      missingTitleBindings,
      missingDescriptionBindings,
      metadataWithoutDocPage,
    } = category;

    const hasCategoryMismatch =
      missingMetadataKeys.length > 0 ||
      missingImports.length > 0 ||
      missingTitleBindings.length > 0 ||
      missingDescriptionBindings.length > 0 ||
      metadataWithoutDocPage.length > 0;

    if (!hasCategoryMismatch) continue;

    lines.push(`[${category.category}]`);

    if (missingMetadataKeys.length > 0) {
      lines.push(`Docs page has no metadata key in ${metadataPath}:`);
      for (const item of missingMetadataKeys) {
        lines.push(`- ${item.pageId} -> expected key: ${item.expectedKey}`);
      }
    }

    if (missingImports.length > 0) {
      lines.push(`Missing metadata import in docs pages under ${docsDir}:`);
      for (const pageId of missingImports) {
        lines.push(`- ${pageId}`);
      }
    }

    if (missingTitleBindings.length > 0) {
      lines.push("Missing metadata title binding:");
      for (const pageId of missingTitleBindings) {
        lines.push(`- ${pageId}`);
      }
    }

    if (missingDescriptionBindings.length > 0) {
      lines.push("Missing metadata description binding:");
      for (const pageId of missingDescriptionBindings) {
        lines.push(`- ${pageId}`);
      }
    }

    if (metadataWithoutDocPage.length > 0) {
      lines.push(`Metadata keys in ${metadataPath} without matching docs page in ${docsDir}:`);
      for (const key of metadataWithoutDocPage) {
        lines.push(`- ${key}`);
      }
    }
  }

  lines.push("Composite pages must declare all covered metadata keys in DOCS_COMPONENT_COMPOSITES.");
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-docs-metadata-coverage.mjs",
  verify: verifyDocsMetadataCoverage,
  successMessage: "design:verify: docs metadata coverage check passed",
});
