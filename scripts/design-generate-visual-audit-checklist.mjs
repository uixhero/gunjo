#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");

const CATEGORIES = ["atoms", "molecules", "organisms", "patterns"];
const CATEGORY_LABELS = {
  atoms: "Atoms",
  molecules: "Molecules",
  organisms: "Organisms",
  templates: "Templates",
};

const DOCS_MANIFEST_PATH = join(ROOT, ".design-audit", "docs", "manifest.json");
const PEN_SCREENSHOT_ROOT = join(ROOT, ".design-audit", "pen");
const COMPARE_ROOT = join(ROOT, ".design-audit", "compare");
const OUTPUT_MD_PATH = join(ROOT, "COMPONENT_VISUAL_AUDIT.md");
const OUTPUT_JSON_PATH = join(ROOT, ".design-audit", "visual-audit.json");

function normalizePath(value) {
  return value.split("\\").join("/");
}

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|");
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

function camelToKebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replaceAll("_", "-")
    .toLowerCase();
}

function docsKeysFromHref(category, slug) {
  const baseKey = slugToKey(slug);
  if (category === "patterns") return [`${baseKey}Template`];
  return [baseKey];
}

function toCamelFromPascal(name) {
  const parts =
    String(name).match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|[0-9]+/g) ?? [String(name)];
  return parts
    .map((part, index) =>
      index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");
}

function parseDocsRoutes() {
  const navigationPath = join(ROOT, "app", "lib", "navigation.ts");
  const source = readFileSync(navigationPath, "utf8");
  const pattern =
    /href:\s*"\/docs\/components\/(atoms|molecules|organisms|templates)\/([^"]+)"/g;

  const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, []]));
  const seen = new Set();

  for (const match of source.matchAll(pattern)) {
    const [, category, slug] = match;
    const routeKey = `${category}/${slug}`;
    if (seen.has(routeKey)) continue;
    seen.add(routeKey);

    byCategory[category].push({
      category,
      slug,
      pageId: `components/${category}/${slug}`,
      docsKeys: docsKeysFromHref(category, slug),
    });
  }

  return byCategory;
}

function readManifestMap() {
  if (!existsSync(DOCS_MANIFEST_PATH)) return new Map();
  const manifest = JSON.parse(readFileSync(DOCS_MANIFEST_PATH, "utf8"));
  const map = new Map();
  for (const result of manifest.results ?? []) {
    map.set(result.pageId, result);
  }
  return map;
}

function readMetadataByCategory(category) {
  const metadataPath = join(ROOT, "design", `${category}-metadata.json`);
  return JSON.parse(readFileSync(metadataPath, "utf8"));
}

function readSourceComponentsByCategory(category) {
  const dir = join(ROOT, "src", "components", category);
  const entries = readdirSync(dir, { withFileTypes: true });
  const keys = new Set();

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".tsx")) continue;
    const stem = entry.name.replace(/\.tsx$/, "");
    keys.add(toCamelFromPascal(stem));
  }

  return keys;
}

function readPenComponentsByCategory(category) {
  const specPath = join(ROOT, "design", "component-specs", `${category}-core.json`);
  const spec = JSON.parse(readFileSync(specPath, "utf8"));
  return new Set(Object.keys(spec?.components ?? {}));
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

function collectVariantMetrics(node) {
  const metrics = {
    nodes: 0,
    frameNodes: 0,
    nonFrameNodes: 0,
    leafFrameNodes: 0,
    emptyLeafFrameNodes: 0,
  };

  function walk(current) {
    if (!current || typeof current !== "object") return;
    metrics.nodes += 1;

    if (current.type === "frame") {
      metrics.frameNodes += 1;
      const children = Array.isArray(current.children) ? current.children : [];
      if (children.length === 0) {
        metrics.leafFrameNodes += 1;
        if (!hasVisualFrameStyle(current)) metrics.emptyLeafFrameNodes += 1;
      }
      for (const child of children) walk(child);
      return;
    }

    metrics.nonFrameNodes += 1;
    if (Array.isArray(current.children)) {
      for (const child of current.children) walk(child);
    }
  }

  walk(node);
  return metrics;
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
        entries.push(metrics);
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

function summarizeVariantMetrics(entries) {
  if (!entries || entries.length === 0) {
    return {
      variantCount: 0,
      avgNodes: 0,
      avgNonFrameNodes: 0,
      frameOnlyRatio: 1,
      emptyLeafRatio: 0,
    };
  }

  const total = entries.length;
  const sum = entries.reduce(
    (acc, item) => {
      acc.nodes += item.nodes;
      acc.nonFrameNodes += item.nonFrameNodes;
      acc.frameOnly += item.nonFrameNodes === 0 ? 1 : 0;
      if (item.leafFrameNodes > 0) {
        acc.emptyLeafRatio += item.emptyLeafFrameNodes / item.leafFrameNodes;
        acc.emptyLeafRatioCount += 1;
      }
      return acc;
    },
    { nodes: 0, nonFrameNodes: 0, frameOnly: 0, emptyLeafRatio: 0, emptyLeafRatioCount: 0 }
  );

  return {
    variantCount: total,
    avgNodes: Number((sum.nodes / total).toFixed(1)),
    avgNonFrameNodes: Number((sum.nonFrameNodes / total).toFixed(1)),
    frameOnlyRatio: Number((sum.frameOnly / total).toFixed(2)),
    emptyLeafRatio:
      sum.emptyLeafRatioCount > 0
        ? Number((sum.emptyLeafRatio / sum.emptyLeafRatioCount).toFixed(2))
        : 0,
  };
}

function autoCheckLabel(category, summary, hasPenSpec) {
  if (!hasPenSpec) return "❌ No Pen spec";
  if (summary.variantCount === 0) return "❌ No reusable variant";

  if (category !== "atoms" && summary.frameOnlyRatio === 1) {
    return "⚠️ Frame-only variants";
  }
  if (category !== "atoms" && summary.frameOnlyRatio >= 0.5) {
    return "⚠️ Mostly frame-only variants";
  }
  if (summary.emptyLeafRatio >= 0.4) {
    return "⚠️ Placeholder-heavy";
  }
  if (category !== "atoms" && summary.avgNonFrameNodes <= 1.2) {
    return "⚠️ Low content density";
  }
  return "✅ Structural pass";
}

function findPenScreenshot(category, key, slug) {
  const candidates = [
    join(PEN_SCREENSHOT_ROOT, category, `${key}.png`),
    join(PEN_SCREENSHOT_ROOT, category, `${camelToKebab(key)}.png`),
    join(PEN_SCREENSHOT_ROOT, category, `${slug}.png`),
  ];

  for (const absolutePath of candidates) {
    if (!existsSync(absolutePath)) continue;
    return {
      absolutePath,
      relativePath: normalizePath(relative(ROOT, absolutePath)),
    };
  }

  return {
    absolutePath: null,
    relativePath: normalizePath(
      relative(ROOT, join(PEN_SCREENSHOT_ROOT, category, `${key}.png`))
    ),
  };
}

function buildCompareMarkdownPath(category, slug, key) {
  const fileName = `${slug}--${key}.md`;
  return join(COMPARE_ROOT, category, fileName);
}

function writeCompareFile({
  category,
  slug,
  key,
  docsPreviewPath,
  penRelativePath,
  docsRoute,
  autoCheck,
  status,
}) {
  const comparePath = buildCompareMarkdownPath(category, slug, key);
  mkdirSync(dirname(comparePath), { recursive: true });

  const docsAssetPath = docsPreviewPath
    ? normalizePath(relative(dirname(comparePath), join(ROOT, docsPreviewPath)))
    : null;
  const penAssetPath = penRelativePath
    ? normalizePath(relative(dirname(comparePath), join(ROOT, penRelativePath)))
    : null;

  const lines = [
    `# ${docsRoute}`,
    "",
    `- component key: \`${key}\``,
    `- auto check: ${autoCheck}`,
    `- status: ${status}`,
    "",
    "| Docs Preview | Pen Screenshot |",
    "| --- | --- |",
    `| ${docsAssetPath ? `![docs](${docsAssetPath})` : "docs screenshot missing"} | ${penAssetPath ? `![pen](${penAssetPath})` : "pen screenshot missing"} |`,
    "",
    "## Notes",
    "",
    "- [ ] Compare layout/spacing/typography/color against docs.",
    "- [ ] Fix `design/*.pen` if mismatch exists.",
    "- [ ] Re-export Pen screenshot and re-check.",
    "",
  ];

  writeFileSync(comparePath, lines.join("\n"), "utf8");
  return normalizePath(relative(ROOT, comparePath));
}

function buildStatus({ hasDocsImage, hasPenImage, autoCheck }) {
  if (!hasDocsImage) return "🔴 docs screenshot missing";
  if (!hasPenImage) return "🟡 pen screenshot pending";
  if (autoCheck.startsWith("❌") || autoCheck.startsWith("⚠️")) {
    return "🟠 update pen candidate";
  }
  return "🟢 ready to confirm";
}

function main() {
  const docsManifestMap = readManifestMap();
  const routesByCategory = parseDocsRoutes();

  mkdirSync(dirname(OUTPUT_JSON_PATH), { recursive: true });
  mkdirSync(COMPARE_ROOT, { recursive: true });

  const summary = {
    generatedAt: new Date().toISOString(),
    docsManifestPath: normalizePath(relative(ROOT, DOCS_MANIFEST_PATH)),
    outputMarkdownPath: normalizePath(relative(ROOT, OUTPUT_MD_PATH)),
    categories: {},
  };

  const lines = [
    "# Component Visual Audit Checklist (Docs vs Pen)",
    "",
    "docs と pen の見た目差分を 1 コンポーネントずつ潰すための台帳です。",
    "",
    "## How To Use",
    "",
    "1. `npm run design:audit:docs-capture` で docs スクリーンショットを更新する。",
    "2. Pencil から pen スクリーンショットを `./.design-audit/pen/<category>/<componentKey>.png` に保存する。",
    "3. `npm run design:audit:checklist` を実行し、一覧と比較ページを再生成する。",
    "4. `./.design-audit/compare/**` を開いて 1 件ずつ修正する。",
    "",
    "<!--SUMMARY-->",
    "",
  ];

  let totalRows = 0;
  let rowsWithDocs = 0;
  let rowsWithPen = 0;
  let warningRows = 0;

  for (const category of CATEGORIES) {
    const categoryLabel = CATEGORY_LABELS[category];
    const metadata = readMetadataByCategory(category);
    const sourceKeys = readSourceComponentsByCategory(category);
    const penKeys = readPenComponentsByCategory(category);
    const variantStats = readPenVariantStatsByCategory(category);

    const routes = routesByCategory[category] ?? [];
    const rows = [];

    for (const route of routes) {
      const docsResult = docsManifestMap.get(route.pageId);
      const docsPreviewPath = docsResult?.screenshots?.preview ?? null;
      const docsPagePath = docsResult?.screenshots?.page ?? null;

      for (const key of route.docsKeys) {
        const metricSummary = summarizeVariantMetrics(variantStats.get(key));
        const hasPenSpec = penKeys.has(key);
        const autoCheck = autoCheckLabel(category, metricSummary, hasPenSpec);
        const penScreenshot = findPenScreenshot(category, key, route.slug);
        const hasPenImage = !!penScreenshot.absolutePath;
        const hasDocsImage = !!docsPreviewPath || !!docsPagePath;
        const status = buildStatus({ hasDocsImage, hasPenImage, autoCheck });
        const comparePath = writeCompareFile({
          category,
          slug: route.slug,
          key,
          docsPreviewPath: docsPreviewPath ?? docsPagePath,
          penRelativePath: hasPenImage ? penScreenshot.relativePath : null,
          docsRoute: `/docs/components/${category}/${route.slug}`,
          autoCheck,
          status,
        });

        const title = metadata[key]?.title ?? key;
        rows.push({
          route,
          key,
          title,
          hasSource: sourceKeys.has(key),
          hasPenSpec,
          hasDocsImage,
          docsPreviewPath: docsPreviewPath ?? docsPagePath,
          penScreenshotPath: penScreenshot.relativePath,
          hasPenImage,
          autoCheck,
          status,
          comparePath,
        });
      }
    }

    summary.categories[category] = {
      total: rows.length,
      docsCaptured: rows.filter((row) => row.hasDocsImage).length,
      penCaptured: rows.filter((row) => row.hasPenImage).length,
      warning: rows.filter(
        (row) => row.autoCheck.startsWith("⚠️") || row.autoCheck.startsWith("❌")
      ).length,
    };

    lines.push(`## ${categoryLabel}`);
    lines.push("");
    lines.push(
      `- total: ${rows.length}, docs captured: ${summary.categories[category].docsCaptured}, pen captured: ${summary.categories[category].penCaptured}, auto warnings: ${summary.categories[category].warning}`
    );
    lines.push("");
    lines.push(
      "| Review | Component | Docs Route | Docs Shot | Pen Shot | Auto Check | Status | Compare |"
    );
    lines.push(
      "| --- | --- | --- | --- | --- | --- | --- | --- |"
    );

    for (const row of rows) {
      const docsShotCell = row.docsPreviewPath
        ? `[docs](${normalizePath(`./${row.docsPreviewPath}`)})`
        : "missing";
      const penShotCell = row.hasPenImage
        ? `[pen](${normalizePath(`./${row.penScreenshotPath}`)})`
        : `missing (\`${row.penScreenshotPath}\`)`;
      const componentCell = `\`${row.key}\` (${escapeTable(row.title)})`;
      const routeCell = `/docs/components/${category}/${row.route.slug}`;
      const compareCell = `[open](${normalizePath(`./${row.comparePath}`)})`;
      lines.push(
        `| ☐ | ${componentCell} | ${routeCell} | ${docsShotCell} | ${penShotCell} | ${row.autoCheck} | ${row.status} | ${compareCell} |`
      );

      totalRows += 1;
      if (row.hasDocsImage) rowsWithDocs += 1;
      if (row.hasPenImage) rowsWithPen += 1;
      if (row.autoCheck.startsWith("⚠️") || row.autoCheck.startsWith("❌")) warningRows += 1;
    }

    lines.push("");
  }

  const summaryLines = [
    "## Snapshot Summary",
    "",
    `- rows total: ${totalRows}`,
    `- docs screenshots ready: ${rowsWithDocs}/${totalRows}`,
    `- pen screenshots ready: ${rowsWithPen}/${totalRows}`,
    `- structural warnings: ${warningRows}`,
    "",
  ];
  const summaryMarkerIndex = lines.indexOf("<!--SUMMARY-->");
  if (summaryMarkerIndex >= 0) {
    lines.splice(summaryMarkerIndex, 1, ...summaryLines);
  }

  writeFileSync(OUTPUT_MD_PATH, `${lines.join("\n")}\n`, "utf8");
  writeFileSync(OUTPUT_JSON_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  console.log(
    `design:audit: wrote ${normalizePath(relative(ROOT, OUTPUT_MD_PATH))}`
  );
  console.log(
    `design:audit: wrote ${normalizePath(relative(ROOT, OUTPUT_JSON_PATH))}`
  );
}

main();
