#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const OUTPUT_JSON = join(ROOT, "docs", "figma-library-discovery.generated.json");
const OUTPUT_MD = join(ROOT, "docs", "figma-library-discovery.generated.md");

const FIGMA_COMPONENT_PAGES = [
  "Inputs",
  "Display",
  "Charts",
  "Feedback",
  "Navigation",
  "Overlay",
  "Layout",
  "Patterns",
];

const SPEC_FILES = [
  ["inputs", "design/component-specs/inputs-core.json"],
  ["display", "design/component-specs/display-core.json"],
  ["feedback", "design/component-specs/feedback-core.json"],
  ["navigation", "design/component-specs/navigation-core.json"],
  ["overlay", "design/component-specs/overlay-core.json"],
  ["layout", "design/component-specs/layout-core.json"],
  ["patterns", "design/component-specs/patterns-core.json"],
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function splitNavigationGroups() {
  const source = readFileSync(join(ROOT, "app", "lib", "navigation.ts"), "utf8");
  const groups = new Map();
  const groupRegex = /\{\s*title: "([^"]+)",\s*items: \[([\s\S]*?)\]\s*,?\s*\}/g;
  const itemRegex = /\{\s*title: "([^"]+)",\s*href: "([^"]+)"\s*\}/g;

  for (const groupMatch of source.matchAll(groupRegex)) {
    const [, title, itemsBlock] = groupMatch;
    const items = [];
    for (const itemMatch of itemsBlock.matchAll(itemRegex)) {
      const [, itemTitle, href] = itemMatch;
      items.push({ title: itemTitle, href });
    }
    groups.set(title, items);
  }

  return groups;
}

function normalizeTitle(value) {
  return String(value ?? "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toLowerCase();
}

function getPublicComponentPageByTitle() {
  const groups = splitNavigationGroups();
  const byTitle = new Map();

  for (const page of FIGMA_COMPONENT_PAGES) {
    if (page === "Patterns") continue;
    const items = groups.get(page) ?? [];
    for (const item of items) {
      if (!item.href.startsWith("/docs/components/")) continue;
      if (item.title.endsWith(" Overview")) continue;
      byTitle.set(item.title, page);
      byTitle.set(normalizeTitle(item.title), page);
    }
  }

  return byTitle;
}

function readSpecs() {
  const publicPageByTitle = getPublicComponentPageByTitle();
  const components = [];
  const unresolvedSpecEntries = [];

  for (const [sourceCategory, relativePath] of SPEC_FILES) {
    const spec = readJson(relativePath);
    const entries = Object.entries(spec.components ?? spec);

    for (const [key, component] of entries) {
      if (!component) {
        unresolvedSpecEntries.push({ key, sourceCategory, reason: "null spec entry" });
        continue;
      }

      const title = component.title ?? key;
      const variants = Array.isArray(component.variants) ? component.variants : [];
      const page =
        sourceCategory === "patterns"
          ? "Patterns"
          : publicPageByTitle.get(title) ??
            publicPageByTitle.get(normalizeTitle(title)) ??
            sourceCategory.charAt(0).toUpperCase() + sourceCategory.slice(1);
      const syntheticVariantKeys = variants
        .filter((variant) => String(variant.id ?? "").startsWith("synthetic:"))
        .map((variant) => variant.key ?? variant.name ?? variant.id);

      components.push({
        key,
        title,
        page,
        sourceCategory,
        variantCount: variants.length,
        variantKeys: variants.map((variant) => variant.key ?? variant.name ?? variant.id),
        syntheticVariantCount: syntheticVariantKeys.length,
        syntheticVariantKeys,
        hasEmptyVariants: variants.length === 0,
        hasFillContainerVariant: variants.some((variant) => variant.width === "fill_container"),
      });
    }
  }

  return { components, unresolvedSpecEntries };
}

function readTokenSummary() {
  const tokens = readJson("design/tokens.pen");
  const tokenVariables = tokens.variables ?? {};
  const byType = {};
  for (const variable of Object.values(tokenVariables)) {
    const type = variable?.type ?? "unknown";
    byType[type] = (byType[type] ?? 0) + 1;
  }

  const globalsCss = readFileSync(join(ROOT, "src", "globals.css"), "utf8");
  const rootBlock = globalsCss.match(/:root\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";
  const darkBlock = globalsCss.match(/\.dark\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";
  const rootCssVariables = [...rootBlock.matchAll(/--([\w-]+):/g)].map((match) => match[1]);
  const darkCssVariables = [...darkBlock.matchAll(/--([\w-]+):/g)].map((match) => match[1]);

  return {
    penVariableCount: Object.keys(tokenVariables).length,
    penVariablesByType: byType,
    rootCssVariableCount: rootCssVariables.length,
    darkCssVariableCount: darkCssVariables.length,
    darkModeOverrideCount: rootCssVariables.filter((name) => darkCssVariables.includes(name)).length,
  };
}

function summarizeByPage(components) {
  return FIGMA_COMPONENT_PAGES.map((page) => {
    const pageComponents = components.filter((component) => component.page === page);
    return {
      page,
      componentCount: pageComponents.length,
      variantCount: pageComponents.reduce((sum, component) => sum + component.variantCount, 0),
      emptyVariantComponents: pageComponents.filter((component) => component.hasEmptyVariants).length,
      syntheticVariantCount: pageComponents.reduce(
        (sum, component) => sum + component.syntheticVariantCount,
        0
      ),
      fillContainerVariantComponents: pageComponents.filter((component) => component.hasFillContainerVariant).length,
    };
  });
}

function buildMarkdown(report) {
  const lines = [
    "# Figma Library Discovery Generated Audit",
    "",
    "> Generated by `npm run design:report:figma-library`. Do not edit manually.",
    "",
    "## Summary",
    "",
    `- Component targets: ${report.summary.componentCount}`,
    `- Variant targets: ${report.summary.variantCount}`,
    `- Components with empty variants: ${report.summary.emptyVariantComponents}`,
    `- Synthetic variants: ${report.summary.syntheticVariantCount}`,
    `- ` + `tokens.pen` + ` variables: ${report.tokens.penVariableCount}`,
    `- ` + `src/globals.css` + ` root variables: ${report.tokens.rootCssVariableCount}`,
    "",
    "## Page Scope",
    "",
    "| Figma page | Components | Variants | Empty variant components | Synthetic variants | Fill-container components |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const page of report.pages) {
    lines.push(
      `| ${page.page} | ${page.componentCount} | ${page.variantCount} | ${page.emptyVariantComponents} | ${page.syntheticVariantCount} | ${page.fillContainerVariantComponents} |`
    );
  }

  lines.push("", "## Components Requiring Manual Design Completion", "");
  const needsWork = report.components.filter(
    (component) => component.hasEmptyVariants || component.syntheticVariantCount > 0
  );
  if (needsWork.length === 0) {
    lines.push("(none)");
  } else {
    lines.push("| Page | Component | Reason |");
    lines.push("| --- | --- | --- |");
    for (const component of needsWork) {
      const reasons = [];
      if (component.hasEmptyVariants) reasons.push("empty variants");
      if (component.syntheticVariantCount > 0) {
        reasons.push(`${component.syntheticVariantCount} synthetic variants`);
      }
      lines.push(`| ${component.page} | ${component.title} | ${reasons.join(", ")} |`);
    }
  }

  lines.push("", "## Unresolved Spec Entries", "");
  if (report.unresolvedSpecEntries.length === 0) {
    lines.push("(none)");
  } else {
    lines.push("| Source category | Key | Reason |");
    lines.push("| --- | --- | --- |");
    for (const entry of report.unresolvedSpecEntries) {
      lines.push(`| ${entry.sourceCategory} | ${entry.key} | ${entry.reason} |`);
    }
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

const { components, unresolvedSpecEntries } = readSpecs();
const tokens = readTokenSummary();
const pages = summarizeByPage(components);
const report = {
  generatedAt: new Date().toISOString(),
  source: {
    components: "design/component-specs/*-core.json",
    navigation: "app/lib/navigation.ts",
    tokens: ["design/tokens.pen", "src/globals.css"],
  },
  summary: {
    componentCount: components.length,
    variantCount: components.reduce((sum, component) => sum + component.variantCount, 0),
    emptyVariantComponents: components.filter((component) => component.hasEmptyVariants).length,
    syntheticVariantCount: components.reduce((sum, component) => sum + component.syntheticVariantCount, 0),
    unresolvedSpecEntries: unresolvedSpecEntries.length,
  },
  tokens,
  pages,
  components,
  unresolvedSpecEntries,
};

writeJson(OUTPUT_JSON, report);
writeText(OUTPUT_MD, buildMarkdown(report));

console.log(`figma-library-discovery: wrote ${OUTPUT_JSON}`);
console.log(`figma-library-discovery: wrote ${OUTPUT_MD}`);
