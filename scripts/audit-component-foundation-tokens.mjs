#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectFoundationUsage,
  escapeCell,
  mergeFoundationUsage,
  needsFoundationReview,
  unique,
} from "./audit-foundation-token-utils.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAVIGATION_PATH = join(ROOT, "app/lib/navigation.ts");
const COMPONENT_MANIFEST_PATH = join(ROOT, "src/components/generated/component-manifest.ts");
const COMPONENT_DOCS_DIR = join(ROOT, "app/docs/components");
const EMBED_DIR = join(ROOT, "app/embed");
const DEMOS_DIR = join(ROOT, "app/components/demos");
const OUTPUT_PATH = join(ROOT, "docs/component-foundation-token-audit.md");
const AUDIT_ISSUE = 267;
const BATCH_SIZE = 8;

const COMPONENT_CATEGORIES = new Set([
  "Inputs",
  "Display",
  "Charts",
  "Feedback",
  "Navigation",
  "Overlay",
  "Layout",
]);

function readText(filePath) {
  return readFileSync(filePath, "utf-8");
}

function maybeReadText(filePath) {
  return existsSync(filePath) ? readText(filePath) : "";
}

function toSlug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function parseNavigationComponents() {
  const source = readText(NAVIGATION_PATH);
  const items = [];
  const groupRegex = /\{\s*title:\s*"([^"]+)",\s*items:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
  let groupMatch;

  while ((groupMatch = groupRegex.exec(source))) {
    const [, category, body] = groupMatch;
    if (!COMPONENT_CATEGORIES.has(category)) continue;

    const itemRegex = /\{\s*title:\s*"([^"]+)",\s*href:\s*"\/docs\/components\/([^"]+)"/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(body))) {
      items.push({
        title: itemMatch[1],
        slug: itemMatch[2],
        category,
      });
    }
  }

  return items;
}

function parseManifestSourceFiles() {
  const source = readText(COMPONENT_MANIFEST_PATH);
  const entries = new Map();
  const blockRegex = /"([^"]+)":\s*\{[\s\S]*?"title":\s*("[^"]+"|null),[\s\S]*?"sourceFile":\s*"([^"]+)"/g;
  let match;

  while ((match = blockRegex.exec(source))) {
    const [, key, rawTitle, sourceFile] = match;
    const title = rawTitle === "null" ? null : rawTitle.slice(1, -1);
    entries.set(toSlug(key), sourceFile);
    if (title) entries.set(toSlug(title), sourceFile);
  }

  return entries;
}

function findImportedDemoFiles(docSource) {
  const demoFiles = [];
  const importRegex = /from\s+["']([^"']*components\/demos\/([^"']+))["']/g;
  let match;

  while ((match = importRegex.exec(docSource))) {
    const demoName = match[2];
    for (const ext of [".tsx", ".ts"]) {
      const absolutePath = join(DEMOS_DIR, `${demoName}${ext}`);
      if (existsSync(absolutePath)) demoFiles.push(absolutePath);
    }
  }

  return demoFiles;
}

function resolveSourceImport(filePath, importPath) {
  if (!importPath.startsWith(".")) return null;
  const basePath = join(dirname(filePath), importPath);
  for (const ext of [".tsx", ".ts"]) {
    const candidate = `${basePath}${ext}`;
    if (existsSync(candidate)) return candidate;
  }
  for (const indexFile of ["index.tsx", "index.ts"]) {
    const candidate = join(basePath, indexFile);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function findDirectRelativeImportFiles(filePath, source) {
  const importFiles = [];
  const importRegex = /from\s+["'](\.[^"']+)["']/g;
  let match;

  while ((match = importRegex.exec(source))) {
    const resolved = resolveSourceImport(filePath, match[1]);
    if (!resolved) continue;
    if (resolved.includes("/generated/")) continue;
    importFiles.push(resolved);
  }

  return importFiles;
}

function auditComponent(component, manifestFiles) {
  const docsPage = join(COMPONENT_DOCS_DIR, component.slug, "page.tsx");
  const embedPage = join(EMBED_DIR, component.slug, "page.tsx");
  const sourceFile = manifestFiles.get(component.slug);
  const sourcePath = sourceFile ? join(ROOT, sourceFile) : null;
  const docSource = maybeReadText(docsPage);
  const embedSource = maybeReadText(embedPage);
  const componentSource = sourcePath && existsSync(sourcePath) ? readText(sourcePath) : "";
  const directImports = [
    ...(existsSync(docsPage) ? findDirectRelativeImportFiles(docsPage, docSource) : []),
    ...(existsSync(embedPage) ? findDirectRelativeImportFiles(embedPage, embedSource) : []),
    ...(sourcePath && existsSync(sourcePath) ? findDirectRelativeImportFiles(sourcePath, componentSource) : []),
  ];

  const filePaths = unique([
    existsSync(docsPage) ? docsPage : null,
    existsSync(embedPage) ? embedPage : null,
    sourcePath && existsSync(sourcePath) ? sourcePath : null,
    ...directImports,
    ...findImportedDemoFiles(docSource),
  ]);

  const usages = filePaths.map((filePath) => collectFoundationUsage(readText(filePath)));
  return {
    ...component,
    docsUrl: `/docs/components/${component.slug}`,
    files: filePaths.map((filePath) => relative(ROOT, filePath)),
    usage: mergeFoundationUsage(usages),
  };
}

function needsReview(item) {
  return needsFoundationReview(item);
}

function buildBatchRows(components) {
  const rows = [];
  for (let index = 0; index < components.length; index += BATCH_SIZE) {
    const batch = Math.floor(index / BATCH_SIZE) + 1;
    const batchItems = components.slice(index, index + BATCH_SIZE);
    const componentsNeedingReview = batchItems.filter(needsReview);
    const status = componentsNeedingReview.length === 0 ? "complete" : "pending";
    const notes =
      componentsNeedingReview.length === 0
        ? "No arbitrary or inline foundation values."
        : `${componentsNeedingReview.length} component(s) need non-color token review.`;
    rows.push(
      `| ${batch.toString().padStart(2, "0")} | ${escapeCell(batchItems.map((item) => `\`${item.slug}\``))} | ${status} | ${escapeCell(notes)} |`
    );
  }
  return rows;
}

function buildMarkdown(components) {
  const generated = new Date().toISOString().slice(0, 10);
  const withTypographyArbitrary = components.filter((item) => item.usage.typographyArbitrary.length > 0).length;
  const withSpacingArbitrary = components.filter((item) => item.usage.spacingArbitrary.length > 0).length;
  const withRadiusArbitrary = components.filter((item) => item.usage.radiusArbitrary.length > 0).length;
  const withShadowArbitrary = components.filter((item) => item.usage.shadowArbitrary.length > 0).length;
  const withInlineGeometry = components.filter((item) => item.usage.inlineGeometry.length > 0).length;
  const withInlineReview = components.filter((item) => item.usage.inlineReview.length > 0).length;

  const lines = [
    "# Component Foundation Token Audit",
    "",
    `Generated: ${generated}`,
    "",
    `Parent issue: #${AUDIT_ISSUE}`,
    "",
    "This report is generated by `npm run docs:audit:component-foundation-tokens`.",
    "",
    "## Summary",
    "",
    `- Component docs entries: ${components.length}`,
    `- Entries with arbitrary typography classes: ${withTypographyArbitrary}`,
    `- Entries with arbitrary spacing/layout classes: ${withSpacingArbitrary}`,
    `- Entries with arbitrary radius classes: ${withRadiusArbitrary}`,
    `- Entries with arbitrary shadow classes: ${withShadowArbitrary}`,
    `- Entries with intrinsic inline geometry styles: ${withInlineGeometry}`,
    `- Entries with inline foundation styles needing review: ${withInlineReview}`,
    "",
    "## Batch Plan",
    "",
    "| Batch | Components | Status | Notes |",
    "| --- | --- | --- | --- |",
    ...buildBatchRows(components),
    "",
    "## Full Matrix",
    "",
    "| Component | Category | Docs | Files | Typography | Typography arbitrary | Spacing/layout | Spacing arbitrary | Radius | Radius arbitrary | Shadow | Shadow arbitrary | Intrinsic inline geometry | Inline review styles | Review notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const item of components) {
    lines.push(
      [
        `\`${item.slug}\``,
        item.category,
        item.docsUrl,
        escapeCell(item.files),
        escapeCell(item.usage.typography),
        escapeCell(item.usage.typographyArbitrary),
        escapeCell(item.usage.spacing),
        escapeCell(item.usage.spacingArbitrary),
        escapeCell(item.usage.radius),
        escapeCell(item.usage.radiusArbitrary),
        escapeCell(item.usage.shadow),
        escapeCell(item.usage.shadowArbitrary),
        escapeCell(item.usage.inlineGeometry),
        escapeCell(item.usage.inlineReview),
        "",
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    );
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- This is a static source audit for typography, spacing, radius, and shadow usage in component docs, embeds, demos, and source files.",
    "- Standard Tailwind scale utilities are treated as tokenized usage. Arbitrary classes and non-geometry inline style literals need review before replacement.",
    "- Inline geometry styles are listed for visibility but are usually intrinsic to data visualization, measured layout, or documented frame sizing.",
    "- A flagged value is not automatically wrong. Keep values that are intrinsic to a documented scenario, such as fixed device frames or chart geometry, and document the reason.",
    "- Pattern pages are intentionally outside this component foundation audit and should be handled by the pattern audit."
  );

  return `${lines.join("\n")}\n`;
}

export function auditComponentFoundationTokens({ root = ROOT } = {}) {
  const manifestFiles = parseManifestSourceFiles();
  const components = parseNavigationComponents().map((component) =>
    auditComponent(component, manifestFiles)
  );
  writeFileSync(OUTPUT_PATH, buildMarkdown(components), "utf-8");
  console.log(`component-foundation-token-audit: wrote ${relative(root, OUTPUT_PATH)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  auditComponentFoundationTokens();
}
