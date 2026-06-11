#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { metadataKeyToSlug } from "./design-sync/docs-component-config.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENT_DOCS_DIR = join(ROOT, "app/docs/components");
const NAVIGATION_PATH = join(ROOT, "app/lib/navigation.ts");
const PATTERNS_METADATA_PATH = join(ROOT, "design/patterns-metadata.json");
const OUTPUT_PATH = join(ROOT, "docs/component-docs-inventory.md");
const CHECKLIST_OUTPUT_PATH = join(ROOT, "docs/component-docs-checklist.md");
const PATTERN_OUTPUT_PATH = join(ROOT, "docs/pattern-docs-inventory.md");
const PATTERN_CHECKLIST_OUTPUT_PATH = join(ROOT, "docs/pattern-docs-checklist.md");

function readText(filePath) {
  return readFileSync(filePath, "utf-8");
}

function getComponentDocSlugs() {
  return readdirSync(COMPONENT_DOCS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => entry.name !== "tokens")
    .filter((entry) => {
      try {
        readText(join(COMPONENT_DOCS_DIR, entry.name, "page.tsx"));
        return true;
      } catch {
        return false;
      }
    })
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function parseNavigationCategories() {
  const source = readText(NAVIGATION_PATH);
  const categories = new Map();
  const groupRegex = /\{\s*title:\s*"([^"]+)",\s*items:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
  let groupMatch;

  while ((groupMatch = groupRegex.exec(source))) {
    const [, categoryTitle, body] = groupMatch;
    const itemRegex = /\{\s*title:\s*"([^"]+)",\s*href:\s*"\/docs\/components\/([^"]+)"/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(body))) {
      categories.set(itemMatch[2], {
        category: categoryTitle,
        title: itemMatch[1],
      });
    }
  }

  return categories;
}

function getPatternSlugs() {
  const metadata = JSON.parse(readText(PATTERNS_METADATA_PATH));
  return new Set(Object.keys(metadata ?? {}).map((key) => metadataKeyToSlug("patterns", key)));
}

function hasUsageSection(source) {
  return /<ChartDocPage\b/.test(source) || /id=["']usage["']/.test(source) || /sectionLabels\.usage/.test(source) || /使い方|Usage/.test(source);
}

function hasPropsSection(source) {
  return /<ChartDocPage\b/.test(source) || /id=["']props["']/.test(source) || /<PropsTable\b/.test(source) || /sectionLabels\.props/.test(source) || /プロパティ|Props/.test(source);
}

function hasStatesSection(source) {
  return /<ChartDocPage\b/.test(source) || /id=["']states["']/.test(source) || /状態とバリエーション|States and Variants|ComponentDemoStates/.test(source);
}

function hasPreviewCodeCopy(source) {
  return /<ChartDocPage\b/.test(source) || /<ComponentPreview[\s\S]*?\bcode=/.test(source) || /<ChartPreviewWithControls[\s\S]*?\bcode=/.test(source) || /<ComponentControls\b/.test(source);
}

function hasUsageCodeCopy(source) {
  if (!hasUsageSection(source)) return false;
  if (/<ChartDocPage\b/.test(source)) return true;
  if (!/CodeCopyButton/.test(source)) return false;

  const usageIndex = source.search(/id=["']usage["']|sectionLabels\.usage|使い方|Usage/);
  const copyIndex = source.indexOf("CodeCopyButton", Math.max(0, usageIndex));
  return usageIndex >= 0 && copyIndex >= usageIndex;
}

function needsStatesReview(source) {
  return (
    /variant/.test(source) ||
    /disabled|loading|selected|open|empty|compact|error|destructive/.test(source) ||
    /ComponentDemoStates/.test(source)
  );
}

function auditPage(slug, nav, patternSlugs) {
  const filePath = join(COMPONENT_DOCS_DIR, slug, "page.tsx");
  const source = readText(filePath);
  const navEntry = nav.get(slug);
  const isPattern = patternSlugs.has(slug);
  const requiresStates = needsStatesReview(source);
  const usesChartDocPage = /<ChartDocPage\b/.test(source);
  const usesSharedDocPage = /<OverlayAuditDocPage\b/.test(source) || /<InputCompositionDocPage\b/.test(source);
  const isCategoryOverview = /data-doc-category-overview/.test(source) || /<CategoryOverviewPage\b/.test(source);
  const checks = {
    componentLayout: isCategoryOverview || usesChartDocPage || usesSharedDocPage || /<ComponentLayout\b/.test(source),
    preview: isCategoryOverview || usesChartDocPage || usesSharedDocPage || /<ComponentPreview\b/.test(source) || /<ChartPreviewWithControls\b/.test(source) || /<ComponentControls\b/.test(source),
    previewCodeCopy: isCategoryOverview || usesSharedDocPage || hasPreviewCodeCopy(source),
    props: isCategoryOverview || usesSharedDocPage || hasPropsSection(source),
    usage: isCategoryOverview || usesSharedDocPage || hasUsageSection(source),
    usageCodeCopy: isCategoryOverview || usesSharedDocPage || hasUsageCodeCopy(source),
    usedComponents: isCategoryOverview || usesChartDocPage || usesSharedDocPage || /usedComponents=\{/.test(source),
    relatedComponents: isCategoryOverview || usesChartDocPage || usesSharedDocPage || /relatedComponents=\{/.test(source),
    statesAndVariants: isCategoryOverview || usesSharedDocPage || hasStatesSection(source),
    usesLocale: isCategoryOverview || usesChartDocPage || usesSharedDocPage || /useLocale\(/.test(source),
    patternAppLink: isPattern && /["'`]\/patterns(?:\/|["'`])/.test(source),
    gunjoUiImport: /from\s+["']@gunjo\/ui["']/.test(source),
  };
  const gaps = [];

  if (!checks.componentLayout) gaps.push("ComponentLayout");
  if (!checks.preview) gaps.push("Preview");
  if (!checks.previewCodeCopy) gaps.push("Preview code copy");
  if (!checks.props) gaps.push("Props");
  if (!checks.usage) gaps.push("Usage");
  if (!checks.usageCodeCopy) gaps.push("Usage code copy");
  if (!checks.usedComponents) gaps.push("Used Components");
  if (!checks.relatedComponents) gaps.push("Related Components");
  if (requiresStates && !checks.statesAndVariants) {
    gaps.push("States review");
  }

  return {
    slug,
    title: navEntry?.title ?? slug,
    category: isPattern ? "Patterns" : navEntry?.category ?? "Uncategorized",
    path: relative(ROOT, filePath),
    isPattern,
    requiresStates,
    checks,
    gaps,
  };
}

function yes(value) {
  return value ? "yes" : "no";
}

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function buildMarkdown(results, options = {}) {
  const now = today();
  const title = options.title ?? "Component Docs Inventory";
  const pageLabel = options.pageLabel ?? "Component docs pages";
  const notes = options.notes ?? [
    "This is a static audit. It catches structure and obvious affordances, not visual quality.",
    "`States review` means the page appears to use variant/state language but does not expose a `States and Variants` section.",
    "Browser checks still need to be run for representative pages in each sweep PR.",
  ];
  const total = results.length;
  const ready = results.filter((result) => result.gaps.length === 0).length;
  const withUsage = results.filter((result) => result.checks.usage).length;
  const withUsageCopy = results.filter((result) => result.checks.usageCodeCopy).length;
  const withUsed = results.filter((result) => result.checks.usedComponents).length;
  const withRelated = results.filter((result) => result.checks.relatedComponents).length;
  const missing = results.filter((result) => result.gaps.length > 0);

  const byCategory = new Map();
  for (const result of results) {
    const bucket = byCategory.get(result.category) ?? [];
    bucket.push(result);
    byCategory.set(result.category, bucket);
  }

  const lines = [
    `# ${title}`,
    "",
    `Generated: ${now}`,
    "",
    "Parent issue: #202",
    "",
    "Inventory issue: #216",
    "",
    "This report is generated by `node scripts/audit-component-docs.mjs`.",
    "",
    "## Summary",
    "",
    `- ${pageLabel}: ${total}`,
    `- Pages with no detected gaps: ${ready}`,
    `- Pages with Usage: ${withUsage}`,
    `- Pages with Usage code copy: ${withUsageCopy}`,
    `- Pages with Used Components: ${withUsed}`,
    `- Pages with Related Components: ${withRelated}`,
    "",
    "## Category Summary",
    "",
    "| Category | Pages | Ready | Missing Usage | Missing Usage Copy | Missing Used | Missing Related |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const [category, bucket] of [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(
      `| ${category} | ${bucket.length} | ${bucket.filter((item) => item.gaps.length === 0).length} | ${bucket.filter((item) => !item.checks.usage).length} | ${bucket.filter((item) => !item.checks.usageCodeCopy).length} | ${bucket.filter((item) => !item.checks.usedComponents).length} | ${bucket.filter((item) => !item.checks.relatedComponents).length} |`
    );
  }

  lines.push(
    "",
    "## Missing / Review Items",
    "",
    "| Component | Category | Gaps |",
    "| --- | --- | --- |"
  );

  for (const result of missing) {
    lines.push(`| \`${result.slug}\` | ${result.category} | ${result.gaps.join(", ")} |`);
  }

  lines.push(
    "",
    "## Full Matrix",
    "",
    "| Component | Category | Layout | Preview | Preview Copy | Props | Usage | Usage Copy | Used | Related | States | Locale |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const result of results) {
    lines.push(
      `| \`${result.slug}\` | ${result.category} | ${yes(result.checks.componentLayout)} | ${yes(result.checks.preview)} | ${yes(result.checks.previewCodeCopy)} | ${yes(result.checks.props)} | ${yes(result.checks.usage)} | ${yes(result.checks.usageCodeCopy)} | ${yes(result.checks.usedComponents)} | ${yes(result.checks.relatedComponents)} | ${yes(result.checks.statesAndVariants)} | ${yes(result.checks.usesLocale)} |`
    );
  }

  lines.push(
    "",
    "## Notes",
    "",
    ...notes.map((note) => `- ${note}`)
  );

  return `${lines.join("\n").trimEnd()}\n`;
}

function buildPatternMarkdown(results) {
  const now = today();
  const missing = results.filter(
    (result) =>
      !result.checks.componentLayout ||
      !result.checks.preview ||
      !result.checks.previewCodeCopy ||
      !result.checks.patternAppLink ||
      !result.checks.gunjoUiImport
  );
  const ready = results.length - missing.length;
  const lines = [
    "# Pattern Docs Inventory",
    "",
    `Generated: ${now}`,
    "",
    "Parent issue: #202",
    "",
    "This report is generated by `node scripts/audit-component-docs.mjs`.",
    "",
    "## Summary",
    "",
    `- Pattern docs pages: ${results.length}`,
    `- Pages with no detected pattern-doc gaps: ${ready}`,
    `- Pages with Pattern route link: ${results.filter((result) => result.checks.patternAppLink).length}`,
    `- Pages importing GunjoUI components: ${results.filter((result) => result.checks.gunjoUiImport).length}`,
    "",
    "## Missing / Review Items",
    "",
    "| Pattern | Gaps |",
    "| --- | --- |",
  ];

  for (const result of missing) {
    const gaps = [];
    if (!result.checks.componentLayout) gaps.push("ComponentLayout");
    if (!result.checks.preview) gaps.push("Preview");
    if (!result.checks.previewCodeCopy) gaps.push("Preview code copy");
    if (!result.checks.patternAppLink) gaps.push("Pattern route link");
    if (!result.checks.gunjoUiImport) gaps.push("GunjoUI import");
    lines.push(`| \`${result.slug}\` | ${gaps.join(", ")} |`);
  }

  if (missing.length === 0) {
    lines.push("| - | - |");
  }

  lines.push(
    "",
    "## Full Matrix",
    "",
    "| Pattern | Layout | Preview | Preview Copy | Pattern Link | GunjoUI Import |",
    "| --- | --- | --- | --- | --- | --- |"
  );

  for (const result of results.sort((a, b) => a.slug.localeCompare(b.slug))) {
    lines.push(
      `| \`${result.slug}\` | ${yes(result.checks.componentLayout)} | ${yes(result.checks.preview)} | ${yes(result.checks.previewCodeCopy)} | ${yes(result.checks.patternAppLink)} | ${yes(result.checks.gunjoUiImport)} |`
    );
  }

  lines.push(
    "",
    "## Notes",
    "",
    "- Patterns are audited separately from component docs because they are page-level compositions.",
    "- Pattern pages should link users from docs to the live `/patterns` route instead of being counted as reusable components.",
    "- Browser checks still need to verify responsive behavior, fake-browser viewport sizing, overlay containment, and code/preview accuracy."
  );

  return `${lines.join("\n").trimEnd()}\n`;
}

function buildPatternChecklist(results) {
  const now = today();
  const lines = [
    "# パターンドキュメント確認チェックリスト",
    "",
    `Generated: ${now}`,
    "",
    "Parent issue: #202",
    "",
    "このチェックリストは `npm run docs:audit:components` で生成します。Patterns はコンポーネント詳細ではなく、アプリ画面単位の見せ方として別監査します。",
    "",
    "## 使い方",
    "",
    "- コンポーネント監査の件数には含めません。",
    "- `/docs/components/<slug>` は説明とコードの入口、`/patterns/<slug>` は実際の画面確認として扱います。",
    "- 公開可能と判断するには、GunjoUI コンポーネント利用、プレビューとコードの整合、パターン画面のレスポンシブ確認が必要です。",
    "",
    "## 全体の確認項目",
    "",
    "- [ ] パターンページへのリンクがあり、実際の画面へ遷移できる。",
    "- [ ] パターン内の UI が GunjoUI コンポーネントを compose している。",
    "- [ ] docs プレビューとコードが一致している。",
    "- [ ] パターンの擬似ブラウザ内でオーバーレイが外へ漏れない。",
    "- [ ] デスクトップ・タブレット・スマホ幅で画面として破綻していない。",
    "- [ ] 日本語と英語の混在が意図したものになっている。",
    "",
    "## ページ一覧",
    "",
  ];

  for (const result of results.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const structuralReady =
      result.checks.componentLayout &&
      result.checks.preview &&
      result.checks.previewCodeCopy &&
      result.checks.patternAppLink &&
      result.checks.gunjoUiImport;
    lines.push(`### \`${result.slug}\``);
    lines.push("");
    lines.push(`ページ: /docs/components/${result.slug}`);
    lines.push("");
    lines.push(`- ${checkbox(structuralReady)} 自動構造チェック`);
    lines.push(`  - ${checkbox(result.checks.componentLayout)} ComponentLayout / ページシェル`);
    lines.push(`  - ${checkbox(result.checks.preview)} docs プレビュー`);
    lines.push(`  - ${checkbox(result.checks.previewCodeCopy)} プレビューコードコピー`);
    lines.push(`  - ${checkbox(result.checks.patternAppLink)} /patterns への導線`);
    lines.push(`  - ${checkbox(result.checks.gunjoUiImport)} GunjoUI コンポーネント import`);
    lines.push("- [ ] 目視確認");
    lines.push("  - [ ] docs プレビューの横幅・高さが内容に合っている");
    lines.push("  - [ ] コードとプレビューのデータ・文言が一致している");
    lines.push("  - [ ] パターン画面でデスクトップ幅が崩れていない");
    lines.push("  - [ ] パターン画面でタブレット幅が崩れていない");
    lines.push("  - [ ] パターン画面でスマホ幅が崩れていない");
    lines.push("  - [ ] オーバーレイが擬似ブラウザの中に収まっている");
    lines.push("  - [ ] アイコンだけの操作、無効操作、曖昧な操作にツールチップがある");
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function checkbox(value) {
  return value ? "[x]" : "[ ]";
}

function buildChecklist(results) {
  const now = today();
  const byCategory = new Map();
  for (const result of results) {
    const bucket = byCategory.get(result.category) ?? [];
    bucket.push(result);
    byCategory.set(result.category, bucket);
  }

  const lines = [
    "# コンポーネントドキュメント確認チェックリスト",
    "",
    `Generated: ${now}`,
    "",
    "Parent issue: #202",
    "",
    "Inventory issue: #216",
    "",
    "このチェックリストは `npm run docs:audit:components` で生成します。各コンポーネント詳細ページについて、構造上どこまで整っているか、どこから目視確認が必要かを見える化するためのものです。",
    "",
    "## 使い方",
    "",
    "- 自動チェックはページ構造から判定します。見た目の品質や内容の正しさまでは保証しません。",
    "- 目視確認の項目は、実際にページを開いて確認するまで未チェックのままにします。",
    "- 公開可能と判断するには、自動チェックと目視確認の両方が完了している必要があります。",
    "- 状態とバリエーションが不要なページは、生成時に `静的チェック上は不要` として完了扱いにします。",
    "",
    "## 全体の確認項目",
    "",
    "- [ ] 対象ページの日本語コピーを確認する。",
    "- [ ] 対象ページの英語コピーを確認する。",
    "- [ ] 対象ページをデスクトップ・タブレット・スマホ幅で確認する。",
    "- [ ] `AI用仕様をコピー` とコードコピーのボタンがフィードバックを返すことを確認する。",
    "- [ ] 使用コンポーネント / 関連コンポーネントが、ただ存在するだけでなく意味のある内容になっていることを確認する。",
    "- [ ] ドキュメント例が GunjoUI コンポーネントを使っており、その場しのぎの UI になっていないことを確認する。",
    "- [ ] 画像の代替テキストが、装飾、内容、操作、データ可視化の役割に合っていることを確認する。",
    "",
    "## ページ一覧",
    "",
  ];

  for (const [category, bucket] of [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const ready = bucket.filter((item) => item.gaps.length === 0).length;
    lines.push(`### ${category}`, "");
    lines.push(`自動構造チェック完了: ${ready} / ${bucket.length}`, "");

    for (const result of bucket) {
      const structuralReady = result.gaps.length === 0;
      const href = `/docs/components/${result.slug}`;
      lines.push(`#### \`${result.slug}\``);
      lines.push("");
      lines.push(`コンポーネント名: ${result.title}`);
      lines.push("");
      lines.push(`ページ: ${href}`);
      lines.push("");
      lines.push(`- ${checkbox(structuralReady)} 自動構造チェック`);
      lines.push(`  - ${checkbox(result.checks.componentLayout)} ComponentLayout / ページシェル`);
      lines.push(`  - ${checkbox(result.checks.preview)} プレビューセクション`);
      lines.push(`  - ${checkbox(result.checks.previewCodeCopy)} プレビューコードコピー`);
      lines.push(`  - ${checkbox(result.checks.props)} プロパティセクション`);
      lines.push(`  - ${checkbox(result.checks.usage)} 使い方セクション`);
      lines.push(`  - ${checkbox(result.checks.usageCodeCopy)} 使い方コードコピー`);
      lines.push(`  - ${checkbox(result.checks.usedComponents)} 使用コンポーネントセクション`);
      lines.push(`  - ${checkbox(result.checks.relatedComponents)} 関連コンポーネントセクション`);
      if (result.requiresStates) {
        lines.push(`  - ${checkbox(result.checks.statesAndVariants)} 状態とバリエーションセクション`);
      } else {
        lines.push("  - [x] 状態とバリエーションセクションは静的チェック上は不要");
      }
      lines.push(`  - ${checkbox(result.checks.usesLocale)} ロケール対応の実装`);
      lines.push("- [ ] 目視確認");
      lines.push("  - [ ] 日本語コピーが正しい");
      lines.push("  - [ ] 英語コピーが正しい");
      lines.push("  - [ ] デスクトップ幅で崩れていない");
      lines.push("  - [ ] タブレット幅で崩れていない");
      lines.push("  - [ ] スマホ幅で崩れていない");
      lines.push("  - [ ] プレビューと状態例が実際のコンポーネント挙動と合っている");
      lines.push("  - [ ] 使い方が追加プレビューではなくコード中心になっている");
      lines.push("  - [ ] 使用コンポーネント / 関連コンポーネントが有用で正確");
      if (result.gaps.length > 0) {
        lines.push(`- 残っている自動チェック上の不足: ${result.gaps.join(", ")}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function main() {
  const nav = parseNavigationCategories();
  const patternSlugs = getPatternSlugs();
  const results = getComponentDocSlugs().map((slug) => auditPage(slug, nav, patternSlugs));
  const componentResults = results.filter((result) => !result.isPattern);
  const patternResults = results.filter((result) => result.isPattern);
  const markdown = buildMarkdown(componentResults);
  const checklist = buildChecklist(componentResults);
  const patternMarkdown = buildPatternMarkdown(patternResults);
  const patternChecklist = buildPatternChecklist(patternResults);
  writeFileSync(OUTPUT_PATH, markdown, "utf-8");
  writeFileSync(CHECKLIST_OUTPUT_PATH, checklist, "utf-8");
  writeFileSync(PATTERN_OUTPUT_PATH, patternMarkdown, "utf-8");
  writeFileSync(PATTERN_CHECKLIST_OUTPUT_PATH, patternChecklist, "utf-8");
  console.log(`component-docs inventory: wrote ${relative(ROOT, OUTPUT_PATH)}`);
  console.log(`component-docs checklist: wrote ${relative(ROOT, CHECKLIST_OUTPUT_PATH)}`);
  console.log(`pattern-docs inventory: wrote ${relative(ROOT, PATTERN_OUTPUT_PATH)}`);
  console.log(`pattern-docs checklist: wrote ${relative(ROOT, PATTERN_CHECKLIST_OUTPUT_PATH)}`);
}

main();
