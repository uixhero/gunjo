#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAVIGATION_PATH = join(ROOT, "app/lib/navigation.ts");
const COMPONENT_MANIFEST_PATH = join(ROOT, "src/components/generated/component-manifest.ts");
const COMPONENT_DOCS_DIR = join(ROOT, "app/docs/components");
const EMBED_DIR = join(ROOT, "app/embed");
const DEMOS_DIR = join(ROOT, "app/components/demos");
const OUTPUT_PATH = join(ROOT, "docs/component-color-audit.md");
const AUDIT_ISSUE = 260;
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

const TOKEN_COLOR_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|shadow|from|to|via|stroke|fill|outline|decoration)-(?:primary|info|success|warning|destructive|background|foreground|card|card-foreground|popover|popover-foreground|muted|muted-foreground|secondary|secondary-foreground|accent|accent-foreground|border|input|overlay|palette-[\w-]+|gunjo-[\w-]+|kobicha-[\w-]+)(?:-[\w]+)*(?:\/[0-9]{1,3})?\b/g;
const OLD_SEMANTIC_ALPHA_PATTERN =
  /\b(?:bg|text|border|ring|shadow|from|to|via|stroke|fill|outline|decoration)-(?:primary|info|success|warning|destructive)(?:-[\w]+)?\/[0-9]{1,3}\b/g;
const COLOR_SCALE_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|from|to|via|shadow|drop-shadow|stroke|fill|outline|decoration)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-[0-9]{2,3})?(?:\/[0-9]{1,3})?\b/g;
const ARBITRARY_COLOR_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|from|to|via|shadow|drop-shadow|stroke|fill|outline|decoration)-\[[^\]]*(?:#|rgb|hsl|oklch|oklab|lab|lch)[^\]]*\]\b/g;
const CSS_VAR_PATTERN = /--[a-z0-9][a-z0-9-]*/g;
const INLINE_STYLE_COLOR_LITERAL_PATTERN =
  /\b(?:background(?:Color|Image)?|color|fill|stroke|boxShadow|filter)\s*:\s*["'`][^"'`]*(?:#(?:[0-9a-fA-F]{3,8})\b|rgba?\(|hsla?\()[^"'`]*["'`]/g;

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

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function escapeCell(value) {
  const text = Array.isArray(value) ? value.join("<br>") : `${value}`;
  if (!text) return "-";
  return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
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

function listDemoFiles() {
  if (!existsSync(DEMOS_DIR)) return [];
  return readdirSync(DEMOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ts|tsx)$/.test(entry.name))
    .map((entry) => join(DEMOS_DIR, entry.name));
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

function collectColorUsage(source) {
  return {
    tokenClasses: unique(source.match(TOKEN_COLOR_CLASS_PATTERN) ?? []),
    oldSemanticAlpha: unique(source.match(OLD_SEMANTIC_ALPHA_PATTERN) ?? []),
    hardcodedColorClasses: unique([
      ...(source.match(COLOR_SCALE_CLASS_PATTERN) ?? []),
      ...(source.match(ARBITRARY_COLOR_CLASS_PATTERN) ?? []),
    ]),
    cssVars: unique(source.match(CSS_VAR_PATTERN) ?? []),
    inlineColors: unique(
      (source.match(INLINE_STYLE_COLOR_LITERAL_PATTERN) ?? []).filter(
        (fragment) => !fragment.includes("var(--") && !fragment.includes("var(${")
      )
    ),
  };
}

function mergeUsage(usages) {
  return {
    tokenClasses: unique(usages.flatMap((usage) => usage.tokenClasses)),
    oldSemanticAlpha: unique(usages.flatMap((usage) => usage.oldSemanticAlpha)),
    hardcodedColorClasses: unique(usages.flatMap((usage) => usage.hardcodedColorClasses)),
    cssVars: unique(usages.flatMap((usage) => usage.cssVars)),
    inlineColors: unique(usages.flatMap((usage) => usage.inlineColors)),
  };
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

  const usages = filePaths.map((filePath) => collectColorUsage(readText(filePath)));
  return {
    ...component,
    docsUrl: `/docs/components/${component.slug}`,
    files: filePaths.map((filePath) => relative(ROOT, filePath)),
    usage: mergeUsage(usages),
  };
}

function buildBatchRows(components) {
  const rows = [];
  for (let index = 0; index < components.length; index += BATCH_SIZE) {
    const batch = Math.floor(index / BATCH_SIZE) + 1;
    const batchItems = components.slice(index, index + BATCH_SIZE);
    const componentsNeedingReview = batchItems.filter((item) => {
      return (
        item.usage.oldSemanticAlpha.length > 0 ||
        item.usage.hardcodedColorClasses.length > 0 ||
        item.usage.inlineColors.length > 0
      );
    });
    const status = componentsNeedingReview.length === 0 ? "complete" : "pending";
    const notes =
      componentsNeedingReview.length === 0
        ? "No old semantic alpha or hardcoded color literals."
        : `${componentsNeedingReview.length} component(s) need color token review.`;
    rows.push(
      `| ${batch.toString().padStart(2, "0")} | ${escapeCell(batchItems.map((item) => `\`${item.slug}\``))} | ${status} | ${escapeCell(notes)} |`
    );
  }
  return rows;
}

function buildMarkdown(components) {
  const generated = new Date().toISOString().slice(0, 10);
  const withOldAlpha = components.filter((item) => item.usage.oldSemanticAlpha.length > 0).length;
  const withHardcoded = components.filter((item) => item.usage.hardcodedColorClasses.length > 0 || item.usage.inlineColors.length > 0).length;
  const withCssVars = components.filter((item) => item.usage.cssVars.length > 0).length;

  const lines = [
    "# Component Color Audit",
    "",
    `Generated: ${generated}`,
    "",
    `Parent issue: #${AUDIT_ISSUE}`,
    "",
    "This report is generated by `npm run docs:audit:component-colors`.",
    "",
    "## Summary",
    "",
    `- Component docs entries: ${components.length}`,
    `- Entries using CSS variables: ${withCssVars}`,
    `- Entries with old semantic alpha classes: ${withOldAlpha}`,
    `- Entries with hardcoded color classes or inline color literals: ${withHardcoded}`,
    "",
    "## Batch Plan",
    "",
    "| Batch | Components | Status | Notes |",
    "| --- | --- | --- | --- |",
    ...buildBatchRows(components),
    "",
    "## Full Matrix",
    "",
    "| Component | Category | Docs | Files | Token color classes | CSS vars | Old semantic alpha | Hardcoded color classes | Inline color literals | Review notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const item of components) {
    lines.push(
      [
        `\`${item.slug}\``,
        item.category,
        item.docsUrl,
        escapeCell(item.files),
        escapeCell(item.usage.tokenClasses),
        escapeCell(item.usage.cssVars),
        escapeCell(item.usage.oldSemanticAlpha),
        escapeCell(item.usage.hardcodedColorClasses),
        escapeCell(item.usage.inlineColors),
        "",
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    );
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- This is a static source audit. It identifies color usage in source/docs/embed/demo files, not rendered contrast or visual quality.",
    "- Pattern pages are intentionally outside this component color audit and should be handled by the pattern audit.",
    "- `Old semantic alpha` entries such as `bg-primary/10` should be reviewed first because they often map to `*-subtle`, `*-border`, or a non-color token.",
    "- Browser checks are still required for every 8-component sweep in light and dark mode."
  );

  return `${lines.join("\n")}\n`;
}

export function auditComponentColors({ root = ROOT } = {}) {
  const manifestFiles = parseManifestSourceFiles();
  const components = parseNavigationComponents().map((component) =>
    auditComponent(component, manifestFiles)
  );
  writeFileSync(OUTPUT_PATH, buildMarkdown(components), "utf-8");
  console.log(`component-color-audit: wrote ${relative(root, OUTPUT_PATH)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  auditComponentColors();
}
