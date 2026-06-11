#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const OUTPUT_PATH = join(ROOT, "COMPONENT_COVERAGE_MATRIX.md");

const CATEGORIES = ["atoms", "molecules", "organisms", "patterns"];
const CATEGORY_LABELS = {
  atoms: "Atoms",
  molecules: "Molecules",
  organisms: "Organisms",
  templates: "Templates",
};
const NON_VARIANT_COMPONENTS_BY_CATEGORY = {
  atoms: new Set(["label"]),
  molecules: new Set(),
  organisms: new Set(),
  templates: new Set(),
};

const COMPOSITE_DOC_PAGE_KEYS = {};

function toCamelFromPascal(name) {
  const parts = String(name).match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|[0-9]+/g) ?? [String(name)];
  return parts
    .map((part, index) =>
      index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");
}

function slugToKey(slug) {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
}

function docsKeysFromHref(category, slug) {
  const pageId = `components/${category}/${slug}`;
  const composite = COMPOSITE_DOC_PAGE_KEYS[pageId];
  if (composite) return composite;

  const baseKey = slugToKey(slug);
  if (category === "patterns") return [`${baseKey}Template`];
  return [baseKey];
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b, "en"));
}

function hasVisualFrameStyle(node) {
  return !!(
    node?.fill != null ||
    node?.stroke != null ||
    node?.cornerRadius != null ||
    node?.effects != null ||
    node?.shadow != null ||
    node?.opacity != null
  );
}

function collectVariantMetrics(node) {
  const metrics = {
    nodes: 0,
    frameNodes: 0,
    nonFrameNodes: 0,
    textNodes: 0,
    otherNodes: 0,
    leafFrameNodes: 0,
    emptyLeafFrameNodes: 0,
    visualFrameNodes: 0,
  };

  function walk(current) {
    if (!current || typeof current !== "object") return;
    metrics.nodes += 1;

    if (current.type === "frame") {
      metrics.frameNodes += 1;
      if (hasVisualFrameStyle(current)) metrics.visualFrameNodes += 1;

      const children = Array.isArray(current.children) ? current.children : [];
      if (children.length === 0) {
        metrics.leafFrameNodes += 1;
        if (!hasVisualFrameStyle(current)) {
          metrics.emptyLeafFrameNodes += 1;
        }
      }
      for (const child of children) walk(child);
      return;
    }

    metrics.nonFrameNodes += 1;
    if (current.type === "text") metrics.textNodes += 1;
    else metrics.otherNodes += 1;

    if (Array.isArray(current.children)) {
      for (const child of current.children) walk(child);
    }
  }

  walk(node);
  return metrics;
}

function componentKeyFromReusableName(category, reusableName) {
  const rawHead = String(reusableName ?? "")
    .split("/")[0]
    .replace(/[^A-Za-z0-9]/g, "");
  if (!rawHead) return null;
  let key = toCamelFromPascal(rawHead);
  if (category === "patterns" && !key.endsWith("Template")) {
    key = `${key}Template`;
  }
  return key;
}

function formatList(items) {
  if (items.length === 0) return "(none)";
  return items.map((item) => `\`${item}\``).join("<br>");
}

function readSourceComponentsByCategory(category) {
  const dir = join(ROOT, "src", "components", category);
  const entries = readdirSync(dir, { withFileTypes: true });
  const keys = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".tsx")) continue;
    const stem = entry.name.replace(/\.tsx$/, "");
    keys.push(toCamelFromPascal(stem));
  }

  return new Set(keys);
}

function readPenComponentsByCategory(category) {
  const specPath = join(ROOT, "design", "component-specs", `${category}-core.json`);
  const spec = JSON.parse(readFileSync(specPath, "utf8"));
  const keys = Object.keys(spec?.components ?? {});
  return new Set(keys);
}

function readPenVariantStatsByCategory(category) {
  const penPath = join(ROOT, "design", `${category}.pen`);
  const pen = JSON.parse(readFileSync(penPath, "utf8"));
  const byKey = new Map();

  function walk(node) {
    if (!node || typeof node !== "object") return;

    if (
      (node.type === "frame" || node.type === "icon_font") &&
      node.reusable === true
    ) {
      const key = componentKeyFromReusableName(category, node.name);
      if (key) {
        const entries = byKey.get(key) ?? [];
        const metrics = collectVariantMetrics(node);
        entries.push({
          ...metrics,
          isFrameOnly: metrics.nonFrameNodes === 0,
          emptyLeafRatio:
            metrics.leafFrameNodes > 0
              ? Number((metrics.emptyLeafFrameNodes / metrics.leafFrameNodes).toFixed(2))
              : 0,
        });
        byKey.set(key, entries);
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  }

  for (const child of pen.children ?? []) walk(child);
  return byKey;
}

function readDocsComponentsByCategory() {
  const navigationPath = join(ROOT, "app", "lib", "navigation.ts");
  const source = readFileSync(navigationPath, "utf8");
  const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, new Set()]));

  const hrefPattern =
    /href:\s*"\/docs\/components\/(atoms|molecules|organisms|templates)\/([^"]+)"/g;

  for (const match of source.matchAll(hrefPattern)) {
    const [, category, slug] = match;
    const keys = docsKeysFromHref(category, slug);
    for (const key of keys) {
      byCategory[category].add(key);
    }
  }

  return byCategory;
}

function toPenReadiness({
  hasPenEntry,
  category,
  component,
  variantCount,
  avgNodes,
  avgNonFrameNodes,
  frameOnlyRatio,
  emptyLeafRatio,
  maxNodes,
}) {
  if (!hasPenEntry) return "❌ No Pen Entry";
  if (variantCount === 0) {
    if (NON_VARIANT_COMPONENTS_BY_CATEGORY[category]?.has(component)) {
      return "✅ Sample-Only (No Variant Required)";
    }
    return "❌ Spec Only (No Reusable Variant)";
  }

  if (category === "patterns") {
    if (frameOnlyRatio === 1) return "❌ Frame-Only Skeleton";
    if (avgNonFrameNodes < 1.5) return "⚠️ Low Content Density";
    if (maxNodes < 8) return "⚠️ Thin Layout Skeleton";
  } else {
    if (frameOnlyRatio === 1 && category !== "atoms") return "⚠️ Frame-Only Variants";
    if (frameOnlyRatio >= 0.5 && category !== "atoms") return "⚠️ Mostly Frame-Only";
    if (variantCount === 1 && avgNodes <= 3 && avgNonFrameNodes <= 1)
      return "⚠️ Thin Variant";
  }

  if (emptyLeafRatio >= 0.4) return "⚠️ Placeholder Frames";
  return "✅ Ready";
}

function buildCategorySection(category, sourceSet, docsSet, penSet, penVariantStats) {
  const union = new Set([...sourceSet, ...docsSet, ...penSet]);
  const components = sorted(union);
  const rows = [];
  let completed = 0;
  let readyCount = 0;
  let reviewCount = 0;

  for (const component of components) {
    const inSource = sourceSet.has(component);
    const inDocs = docsSet.has(component);
    const inPen = penSet.has(component);
    const coverageDone = inSource && inDocs && inPen;
    if (coverageDone) completed += 1;

    const missing = [];
    if (!inSource) missing.push("Source");
    if (!inDocs) missing.push("Docs");
    if (!inPen) missing.push("Pen");

    const variants = penVariantStats.get(component) ?? [];
    const variantCount = variants.length;
    const avgNodes =
      variantCount > 0
        ? Number(
            (
              variants.reduce((sum, variant) => sum + variant.nodes, 0) / variantCount
            ).toFixed(1)
          )
        : 0;
    const avgNonFrameNodes =
      variantCount > 0
        ? Number(
            (
              variants.reduce((sum, variant) => sum + variant.nonFrameNodes, 0) / variantCount
            ).toFixed(1)
          )
        : 0;
    const frameOnlyVariantCount = variants.filter((variant) => variant.isFrameOnly).length;
    const frameOnlyRatio =
      variantCount > 0
        ? Number((frameOnlyVariantCount / variantCount).toFixed(2))
        : 0;
    const emptyLeafRatio =
      variantCount > 0
        ? Number(
            (
              variants.reduce((sum, variant) => sum + variant.emptyLeafRatio, 0) / variantCount
            ).toFixed(2)
          )
        : 0;
    const maxNodes =
      variants.length > 0 ? Math.max(...variants.map((variant) => variant.nodes)) : 0;

    const readiness = toPenReadiness({
      hasPenEntry: inPen,
      category,
      component,
      variantCount,
      avgNodes,
      avgNonFrameNodes,
      frameOnlyRatio,
      emptyLeafRatio,
      maxNodes,
    });
    const isReady = readiness.startsWith("✅");
    if (isReady) readyCount += 1;
    else reviewCount += 1;

    rows.push({
      component,
      inSource,
      inDocs,
      inPen,
      coverageDone,
      missing,
      variantCount,
      avgNodes,
      avgNonFrameNodes,
      frameOnlyVariantCount,
      frameOnlyRatio,
      emptyLeafRatio,
      readiness,
    });
  }

  const listTable = [
    "| Source (`src/components`) | Docs (`app/lib/navigation.ts`) | Pen (`design/component-specs`) |",
    "|---|---|---|",
    `| ${formatList(sorted(sourceSet))} | ${formatList(sorted(docsSet))} | ${formatList(
      sorted(penSet)
    )} |`,
  ].join("\n");

  const matrixHeader = [
    "| Component Key | Source | Docs | Pen | Coverage | Pen Variants | Avg Nodes / Variant | Avg Non-Frame / Variant | Frame-Only Variants | Empty Leaf Ratio | Design Completeness | Missing |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|",
  ].join("\n");

  const matrixRows = rows
    .map(
      (row) =>
        `| \`${row.component}\` | ${row.inSource ? "✅" : "❌"} | ${row.inDocs ? "✅" : "❌"} | ${row.inPen ? "✅" : "❌"} | ${row.coverageDone ? "✅ Complete" : "⚠️ Incomplete"} | ${row.variantCount} | ${row.variantCount > 0 ? row.avgNodes : "-"} | ${row.variantCount > 0 ? row.avgNonFrameNodes : "-"} | ${row.variantCount > 0 ? `${row.frameOnlyVariantCount}/${row.variantCount}` : "-"} | ${row.variantCount > 0 ? row.emptyLeafRatio : "-"} | ${row.readiness} | ${row.missing.length > 0 ? row.missing.join(", ") : "-"} |`
    )
    .join("\n");

  const section = [
    `## ${CATEGORY_LABELS[category]}`,
    "",
    `- Total (union): **${components.length}**`,
    `- Coverage Complete (Source+Docs+Pen): **${completed}**`,
    `- Coverage Incomplete: **${components.length - completed}**`,
    `- Pen Ready (heuristic): **${readyCount}**`,
    `- Pen Needs Review (heuristic): **${reviewCount}**`,
    "",
    "### 3 Lists",
    "",
    listTable,
    "",
    "### Coverage Matrix",
    "",
    matrixHeader,
    matrixRows,
  ].join("\n");

  return { section, total: components.length, completed, readyCount, reviewCount, rows };
}

function main() {
  const docsByCategory = readDocsComponentsByCategory();

  let totalAll = 0;
  let completedAll = 0;
  let readyAll = 0;
  let reviewAll = 0;
  const sections = [];
  const reviewQueue = [];

  for (const category of CATEGORIES) {
    const sourceSet = readSourceComponentsByCategory(category);
    const docsSet = docsByCategory[category];
    const penSet = readPenComponentsByCategory(category);
    const penVariantStats = readPenVariantStatsByCategory(category);
    const { section, total, completed, readyCount, reviewCount, rows } = buildCategorySection(
      category,
      sourceSet,
      docsSet,
      penSet,
      penVariantStats
    );

    sections.push(section);
    totalAll += total;
    completedAll += completed;
    readyAll += readyCount;
    reviewAll += reviewCount;

    for (const row of rows) {
      if (row.readiness.startsWith("✅")) continue;
      const severity = row.readiness.startsWith("❌") ? 0 : 1;
      reviewQueue.push({
        category,
        component: row.component,
        readiness: row.readiness,
        frameOnly: `${row.frameOnlyVariantCount}/${row.variantCount}`,
        avgNodes: row.variantCount > 0 ? row.avgNodes : "-",
        avgNonFrame: row.variantCount > 0 ? row.avgNonFrameNodes : "-",
        emptyLeafRatio: row.variantCount > 0 ? row.emptyLeafRatio : "-",
        severity,
      });
    }
  }

  const orderedReviewQueue = reviewQueue.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity - b.severity;
    if (a.category !== b.category) return a.category.localeCompare(b.category, "en");
    return a.component.localeCompare(b.component, "en");
  });

  const reviewQueueSection = [
    "## Review Queue (One-by-One)",
    "",
    "Priority order: `❌` first, then `⚠️`.",
    "",
    "| Priority | Category | Component | Design Completeness | Frame-Only Variants | Avg Nodes | Avg Non-Frame | Empty Leaf Ratio |",
    "|---|---|---|---|---|---|---|---|",
    ...(orderedReviewQueue.length > 0
      ? orderedReviewQueue.map((item, index) => {
          const priority = item.severity === 0 ? `P0-${index + 1}` : `P1-${index + 1}`;
          return `| ${priority} | ${item.category} | \`${item.component}\` | ${item.readiness} | ${item.frameOnly} | ${item.avgNodes} | ${item.avgNonFrame} | ${item.emptyLeafRatio} |`;
        })
      : ["| - | - | (none) | ✅ No pending review items | - | - | - | - |"]),
    "",
  ].join("\n");

  const now = new Date();
  const generatedAt = now.toISOString();
  const content = [
    "# Component Coverage Matrix (Source vs Docs vs Pen)",
    "",
    `Generated at: \`${generatedAt}\``,
    "",
    "## Overall",
    "",
    `- Total (sum of category unions): **${totalAll}**`,
    `- Coverage Complete (Source+Docs+Pen): **${completedAll}**`,
    `- Coverage Incomplete: **${totalAll - completedAll}**`,
    `- Pen Ready (heuristic): **${readyAll}**`,
    `- Pen Needs Review (heuristic): **${reviewAll}**`,
    "",
    reviewQueueSection,
    "",
    ...sections.flatMap((section) => ["---", "", section, ""]),
  ].join("\n");

  writeFileSync(OUTPUT_PATH, `${content}\n`, "utf8");
  console.log(`Generated: ${OUTPUT_PATH}`);
  console.log(`Overall complete: ${completedAll}/${totalAll}`);
}

main();
