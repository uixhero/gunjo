#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectExtendedTokenUsage,
  escapeCell,
  mergeExtendedTokenUsage,
  needsExtendedTokenReview,
  unique,
} from "./audit-extended-token-utils.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAVIGATION_PATH = join(ROOT, "app/lib/navigation.ts");
const COMPONENT_MANIFEST_PATH = join(ROOT, "src/components/generated/component-manifest.ts");
const COMPONENT_DOCS_DIR = join(ROOT, "app/docs/components");
const EMBED_DIR = join(ROOT, "app/embed");
const DEMOS_DIR = join(ROOT, "app/components/demos");
const OUTPUT_PATH = join(ROOT, "docs/component-extended-token-audit.md");
const AUDIT_ISSUE = 269;
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

  const usages = filePaths.map((filePath) => collectExtendedTokenUsage(readText(filePath)));
  return {
    ...component,
    docsUrl: `/docs/components/${component.slug}`,
    files: filePaths.map((filePath) => relative(ROOT, filePath)),
    usage: mergeExtendedTokenUsage(usages),
  };
}

function buildBatchRows(components) {
  const rows = [];
  for (let index = 0; index < components.length; index += BATCH_SIZE) {
    const batch = Math.floor(index / BATCH_SIZE) + 1;
    const batchItems = components.slice(index, index + BATCH_SIZE);
    const componentsNeedingReview = batchItems.filter(needsExtendedTokenReview);
    const status = componentsNeedingReview.length === 0 ? "complete" : "pending";
    const notes =
      componentsNeedingReview.length === 0
        ? "No arbitrary or inline extended token values."
        : `${componentsNeedingReview.length} component(s) need extended token review.`;
    rows.push(
      `| ${batch.toString().padStart(2, "0")} | ${escapeCell(batchItems.map((item) => `\`${item.slug}\``))} | ${status} | ${escapeCell(notes)} |`
    );
  }
  return rows;
}

function countWith(items, key) {
  return items.filter((item) => item.usage[key].length > 0).length;
}

function hasInlineImplementationStyles(item) {
  return (
    item.usage.inlineMotion.length > 0 ||
    item.usage.inlineLayering.length > 0 ||
    item.usage.inlineOpacity.length > 0 ||
    item.usage.inlineBorderWidth.length > 0
  );
}

function buildMarkdown(components) {
  const generated = new Date().toISOString().slice(0, 10);
  const lines = [
    "# Component Extended Token Audit",
    "",
    `Generated: ${generated}`,
    "",
    `Parent issue: #${AUDIT_ISSUE}`,
    "",
    "This report is generated by `npm run docs:audit:component-extended-tokens`.",
    "",
    "Scope: interaction, layering, motion, opacity, border width, breakpoint/container sizing, icon size, and density usage in component docs, embeds, demos, and source files.",
    "",
    "## Summary",
    "",
    `- Component docs entries: ${components.length}`,
    `- Entries with arbitrary motion classes: ${countWith(components, "motionArbitrary")}`,
    `- Entries with arbitrary layering classes: ${countWith(components, "layeringArbitrary")}`,
    `- Entries with arbitrary opacity classes: ${countWith(components, "opacityArbitrary")}`,
    `- Entries with arbitrary border width classes: ${countWith(components, "borderWidthArbitrary")}`,
    `- Entries with arbitrary container sizing classes: ${countWith(components, "containerSizingArbitrary")}`,
    `- Entries with arbitrary density classes: ${countWith(components, "densityArbitrary")}`,
    `- Entries with inline implementation styles: ${components.filter(hasInlineImplementationStyles).length}`,
    `- Entries needing review: ${components.filter(needsExtendedTokenReview).length}`,
    "",
    "## Batch Plan",
    "",
    "| Batch | Components | Status | Notes |",
    "| --- | --- | --- | --- |",
    ...buildBatchRows(components),
    "",
    "## Full Matrix",
    "",
    "| Component | Category | Docs | Files | Motion | Motion arbitrary | Layering | Layering arbitrary | Overlay position | Opacity | Opacity arbitrary | Border width | Border width arbitrary | Breakpoints | Container sizing | Container sizing arbitrary | Icon size | Density | Density arbitrary | Inline implementation styles | Inline container sizing |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const item of components) {
    const inlineReview = [
      ...item.usage.inlineMotion,
      ...item.usage.inlineLayering,
      ...item.usage.inlineOpacity,
      ...item.usage.inlineBorderWidth,
    ];
    lines.push(
      [
        `\`${item.slug}\``,
        item.category,
        item.docsUrl,
        escapeCell(item.files),
        escapeCell(item.usage.motion),
        escapeCell(item.usage.motionArbitrary),
        escapeCell(item.usage.layering),
        escapeCell(item.usage.layeringArbitrary),
        escapeCell(item.usage.overlayPosition),
        escapeCell(item.usage.opacity),
        escapeCell(item.usage.opacityArbitrary),
        escapeCell(item.usage.borderWidth),
        escapeCell(item.usage.borderWidthArbitrary),
        escapeCell(item.usage.breakpoints),
        escapeCell(item.usage.containerSizing),
        escapeCell(item.usage.containerSizingArbitrary),
        escapeCell(item.usage.iconSize),
        escapeCell(item.usage.density),
        escapeCell(item.usage.densityArbitrary),
        escapeCell(inlineReview),
        escapeCell(item.usage.inlineContainerSizing),
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    );
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- Standard Tailwind token utilities are listed for visibility. Arbitrary classes and inline motion/border width styles need review.",
    "- Inline layering and opacity values are listed for visibility because charts, SVG layers, overlays, and clipboard fallbacks can require implementation-level values.",
    "- Inline container sizing is listed separately because chart geometry, device frames, and measured layouts can be intrinsic to the component scenario.",
    "- `Overlay position` records positioning primitives that often interact with z-index and portal behavior; presence alone is not a failure."
  );

  return `${lines.join("\n")}\n`;
}

function main() {
  const manifestFiles = parseManifestSourceFiles();
  const components = parseNavigationComponents().map((component) =>
    auditComponent(component, manifestFiles)
  );
  writeFileSync(OUTPUT_PATH, buildMarkdown(components), "utf-8");
  console.log(`component-extended-token-audit: wrote ${relative(ROOT, OUTPUT_PATH)}`);
}

main();
