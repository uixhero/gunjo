import { join } from "node:path";
import { ROOT, readJson, writeText } from "./shared.mjs";
import {
  DOCS_COMPONENT_CATEGORY_CONFIGS,
  DOCS_COMPONENT_COMPOSITES,
  FUNCTIONAL_CATEGORY_ORDER,
  functionalCategoryFor,
  metadataKeyToSlug,
  metadataKeyToTitle,
} from "./docs-component-config.mjs";

// Walks every atomic-tier metadata file and emits a flat array of nav
// items keyed by URL slug. The atomic source tier is preserved only as
// metadata (not visible in the nav output) so we can resolve composites
// per source tier.
function collectAllComponentItems({ root }) {
  const items = [];
  const seenSlugs = new Set();

  for (const config of DOCS_COMPONENT_CATEGORY_CONFIGS) {
    const metadata = readJson(join(root, config.metadataPath));
    const keys = Object.keys(metadata ?? {});
    const compositeItems = (DOCS_COMPONENT_COMPOSITES[config.category] ?? []).filter(
      (item) => item.metadataKeys.every((key) => keys.includes(key))
    );
    const compositeByKey = new Map();
    for (const item of compositeItems) {
      for (const key of item.metadataKeys) {
        compositeByKey.set(key, item);
      }
    }

    for (const key of keys) {
      const composite = compositeByKey.get(key);
      const slug = composite ? composite.slug : metadataKeyToSlug(config.category, key);
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      const title = composite ? composite.title : metadataKeyToTitle(config.category, key);
      items.push({
        title,
        slug,
        href: `${config.hrefPrefix}/${slug}`,
      });
    }
  }

  return items;
}

function buildNavigation({ root }) {
  const staticSections = [
    {
      title: "Introduction",
      items: [
        { title: "Introduction", href: "/docs/introduction" },
        { title: "Installation", href: "/docs/installation" },
        { title: "Theming", href: "/docs/theming" },
        { title: "i18n", href: "/docs/i18n" },
        { title: "Comparison", href: "/docs/comparison" },
        { title: "By use case", href: "/docs/by-use-case" },
        { title: "AI handoff", href: "/docs/ai-handoff" },
        { title: "Adoption Guide", href: "/docs/adoption" },
        { title: "Adoption Strategy", href: "/docs/adoption-strategy" },
        { title: "Migration Playbook", href: "/docs/migration-playbook" },
        { title: "Dependencies", href: "/docs/dependencies" },
        { title: "Versioning Policy", href: "/docs/versioning" },
        { title: "Component Addition", href: "/docs/component-addition" },
        { title: "CHANGELOG", href: "/docs/changelog" },
      ],
    },
    {
      title: "Tokens",
      items: [
        { title: "Tokens Overview", href: "/docs/tokens" },
        { title: "Colors", href: "/docs/colors" },
        { title: "Typography", href: "/docs/typography" },
        { title: "Spacing", href: "/docs/spacing" },
        { title: "Shadows", href: "/docs/shadows" },
        { title: "Radius", href: "/docs/radius" },
        { title: "Animation", href: "/docs/animation" },
        { title: "DESIGN.md", href: "/docs/tokens/spec" },
      ],
    },
    {
      title: "Guidelines",
      items: [
        { title: "Guidelines Overview", href: "/docs/guidelines" },
        { title: "Design Principles", href: "/docs/guidelines/principles" },
        { title: "Component Usage", href: "/docs/guidelines/component-usage" },
        { title: "Accessibility", href: "/docs/guidelines/accessibility" },
        { title: "Docs Standards", href: "/docs/guidelines/docs-standards" },
        { title: "Voice & Tone", href: "/docs/guidelines/writing" },
      ],
    },
  ];

  // Group components by their docs-level functional category. Source-tier
  // (atom/molecule/organism/template) is no longer surfaced; everything
  // bucketed by what the component does.
  const allItems = collectAllComponentItems({ root });
  const itemsByCategory = new Map(FUNCTIONAL_CATEGORY_ORDER.map((c) => [c, []]));
  const orphans = [];

  for (const item of allItems) {
    const category = functionalCategoryFor(item.slug);
    if (category && itemsByCategory.has(category)) {
      itemsByCategory.get(category).push(item);
    } else {
      orphans.push(item);
    }
  }

  if (orphans.length > 0) {
    const message = orphans.map((o) => `  ${o.slug}`).join("\n");
    throw new Error(
      `design:sync: components missing from FUNCTIONAL_CATEGORY_OF_SLUG (add them to scripts/design-sync/docs-component-config.mjs):\n${message}`
    );
  }

  const componentSections = FUNCTIONAL_CATEGORY_ORDER.flatMap((category) => {
    if (category === "Patterns") return [];
    const items = itemsByCategory.get(category) ?? [];
    if (items.length === 0) return [];
    items.sort((a, b) => a.title.localeCompare(b.title));
    const overviewItemsByCategory = {
      Inputs: [{ title: "Inputs Overview", href: "/docs/components/inputs" }],
      Display: [{ title: "Display Overview", href: "/docs/components/display" }],
      Charts: [{ title: "Charts Overview", href: "/docs/components/charts" }],
      Feedback: [{ title: "Feedback Overview", href: "/docs/components/feedback" }],
      Navigation: [{ title: "Navigation Overview", href: "/docs/components/navigation" }],
      Overlay: [{ title: "Overlay Overview", href: "/docs/components/overlay" }],
      Layout: [{ title: "Layout Overview", href: "/docs/components/layout" }],
    };
    const overviewItems = overviewItemsByCategory[category] ?? [];
    return [
      {
        title: category,
        items: [...overviewItems, ...items.map(({ title, href }) => ({ title, href }))],
      },
    ];
  });

  const patternSection = {
    title: "Patterns",
    items: [
      { title: "Patterns", href: "/patterns" },
    ],
  };

  return [...staticSections, ...componentSections, patternSection];
}

function quote(value) {
  return JSON.stringify(value);
}

function renderItem(item, indent = "            ") {
  const fields = [`title: ${quote(item.title)}`, `href: ${quote(item.href)}`];
  if (item.external) {
    fields.push("external: true");
  }
  return `${indent}{ ${fields.join(", ")} },`;
}

function renderSection(section) {
  const lines = [
    "    {",
    `        title: ${quote(section.title)},`,
    "        items: [",
    ...section.items.map((item) => renderItem(item)),
    "        ],",
    "    },",
  ];
  return lines.join("\n");
}

function renderNavigationSource(navigation) {
  const sections = navigation.map((section) => renderSection(section)).join("\n");
  return `/**\n * Generated by \`npm run design:sync:docs-navigation\`.\n * Do not edit manually.\n */\nexport const navigation = [\n${sections}\n];\n`;
}

export function syncDocsNavigation({ root = ROOT } = {}) {
  const navigation = buildNavigation({ root });
  const outputPath = join(root, "app", "lib", "navigation.ts");
  const source = renderNavigationSource(navigation);
  writeText(outputPath, source);
  console.log("design:sync: Updated app/lib/navigation.ts from design/*-metadata.json");
}
