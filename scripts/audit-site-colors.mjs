#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = join(ROOT, "app");
const OUTPUT_PATH = join(ROOT, "docs/site-color-audit.md");
const AUDIT_ISSUE = 260;

const EXCLUDED_PAGE_PREFIXES = [
  "app/docs/components/",
  "app/embed/",
];

const TOKEN_COLOR_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|shadow|from|to|via|stroke|fill|outline|decoration)-(?:primary|info|success|warning|destructive|background|foreground|card|card-foreground|popover|popover-foreground|muted|muted-foreground|secondary|secondary-foreground|accent|accent-foreground|border|input|overlay|palette-[\w-]+|gunjo-[\w-]+|kobicha-[\w-]+)(?:-[\w]+)*(?:\/[0-9]{1,3})?\b/g;
const OLD_SEMANTIC_ALPHA_PATTERN =
  /\b(?:bg|text|border|ring|shadow|from|to|via|stroke|fill|outline|decoration)-(?:primary|info|success|warning|destructive)(?:-[\w]+)?\/[0-9]{1,3}\b/g;
const COLOR_SCALE_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|from|to|via|shadow|drop-shadow|stroke|fill|outline|decoration)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-[0-9]{2,3})?(?:\/[0-9]{1,3})?\b/g;
const ARBITRARY_COLOR_CLASS_PATTERN =
  /\b(?:bg|text|border|ring|from|to|via|shadow|drop-shadow|stroke|fill|outline|decoration)-\[[^\]]*(?:#|rgb|hsl|oklch|oklab|lab|lch)[^\]]*\]\b/g;
const INLINE_STYLE_COLOR_LITERAL_PATTERN =
  /\b(?:background(?:Color|Image)?|color|fill|stroke|boxShadow|filter)\s*:\s*["'`][^"'`]*(?:#(?:[0-9a-fA-F]{3,8})\b|rgba?\(|hsla?\()[^"'`]*["'`]/g;
const CONTENT_COLOR_REFERENCE_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;
const CSS_VAR_PATTERN = /--[a-z0-9][a-z0-9-]*/g;

function readText(filePath) {
  return readFileSync(filePath, "utf-8");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function escapeCell(value) {
  const text = Array.isArray(value) ? value.join("<br>") : `${value}`;
  if (!text) return "-";
  return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function listFiles(rootDir) {
  if (!existsSync(rootDir)) return [];

  const files = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }
      if (entry.isFile() && entry.name === "page.tsx") files.push(absolutePath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function routeFromPage(relativeFilePath) {
  const route = relativeFilePath
    .replace(/^app/, "")
    .replace(/\/page\.tsx$/, "")
    .replace(/^\//, "");
  return route.length === 0 ? "/" : `/${route}`;
}

function categoryForRoute(route) {
  if (route.startsWith("/patterns")) return "Patterns";
  if (route.startsWith("/tokens")) return "Tokens";
  if (route.startsWith("/docs")) return "Docs";
  if (route.startsWith("/ai-handoff")) return "AI handoff";
  if (route === "/") return "Home";
  return "Site";
}

function collectUsage(source) {
  const inlineColorFragments = unique(
    (source.match(INLINE_STYLE_COLOR_LITERAL_PATTERN) ?? []).filter(
      (fragment) => !fragment.includes("var(--") && !fragment.includes("var(${")
    )
  );
  const contentColorReferences = unique(source.match(CONTENT_COLOR_REFERENCE_PATTERN) ?? []);

  return {
    tokenClasses: unique(source.match(TOKEN_COLOR_CLASS_PATTERN) ?? []),
    oldSemanticAlpha: unique(source.match(OLD_SEMANTIC_ALPHA_PATTERN) ?? []),
    hardcodedColorClasses: unique([
      ...(source.match(COLOR_SCALE_CLASS_PATTERN) ?? []),
      ...(source.match(ARBITRARY_COLOR_CLASS_PATTERN) ?? []),
    ]),
    cssVars: unique(source.match(CSS_VAR_PATTERN) ?? []),
    inlineColors: inlineColorFragments,
    contentColorReferences,
  };
}

function auditPages() {
  return listFiles(APP_DIR)
    .map((filePath) => {
      const relativeFilePath = relative(ROOT, filePath);
      return { filePath, relativeFilePath };
    })
    .filter(({ relativeFilePath }) =>
      !EXCLUDED_PAGE_PREFIXES.some((prefix) => relativeFilePath.startsWith(prefix))
    )
    .map(({ filePath, relativeFilePath }) => {
      const route = routeFromPage(relativeFilePath);
      return {
        route,
        category: categoryForRoute(route),
        file: relativeFilePath,
        usage: collectUsage(readText(filePath)),
      };
    });
}

function buildMarkdown(results) {
  const generated = new Date().toISOString().slice(0, 10);
  const withOldAlpha = results.filter((item) => item.usage.oldSemanticAlpha.length > 0).length;
  const withHardcoded = results.filter((item) => item.usage.hardcodedColorClasses.length > 0 || item.usage.inlineColors.length > 0).length;
  const withContentReferences = results.filter((item) => item.usage.contentColorReferences.length > 0).length;

  const lines = [
    "# Site Color Audit",
    "",
    `Generated: ${generated}`,
    "",
    `Parent issue: #${AUDIT_ISSUE}`,
    "",
    "This report is generated by `npm run docs:audit:site-colors`.",
    "",
    "Scope: `app/**/page.tsx`, excluding `app/docs/components/**` and `app/embed/**` because component docs are covered by `docs/component-color-audit.md`.",
    "",
    "## Summary",
    "",
    `- Site/page entries: ${results.length}`,
    `- Entries with old semantic alpha classes: ${withOldAlpha}`,
    `- Entries with hardcoded color classes or inline color literals: ${withHardcoded}`,
    `- Entries with content color references: ${withContentReferences}`,
    "",
    "## Matrix",
    "",
    "| Route | Category | File | Token color classes | CSS vars | Old semantic alpha | Hardcoded color classes | Inline color literals | Content color references |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const item of results) {
    lines.push(
      `| ${escapeCell(item.route)} | ${escapeCell(item.category)} | ${escapeCell(item.file)} | ${escapeCell(item.usage.tokenClasses)} | ${escapeCell(item.usage.cssVars)} | ${escapeCell(item.usage.oldSemanticAlpha)} | ${escapeCell(item.usage.hardcodedColorClasses)} | ${escapeCell(item.usage.inlineColors)} | ${escapeCell(item.usage.contentColorReferences)} |`
    );
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- `Content color references` are literal color values in visible copy or documentation text, not style usage. Review them manually before changing.",
    "- `Old semantic alpha` and `Hardcoded color classes` should be zero for token-aligned UI."
  );

  return `${lines.join("\n")}\n`;
}

function main() {
  const results = auditPages();
  writeFileSync(OUTPUT_PATH, buildMarkdown(results));
  console.log(`site-color-audit: wrote ${relative(ROOT, OUTPUT_PATH)}`);
}

main();
