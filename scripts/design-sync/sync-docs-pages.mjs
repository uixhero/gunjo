import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ROOT,
  readJson,
  toRelativePath,
  unique,
  uniqueSorted,
  writeText,
} from "./shared.mjs";
import {
  DOCS_COMPONENT_CATEGORY_CONFIGS,
  DOCS_COMPONENT_COMPOSITES,
  metadataKeyToBaseKey,
  metadataKeyToSlug,
} from "./docs-component-config.mjs";
import {
  getComponentFileName,
  getComponentSourceCategoryConfig,
} from "./component-source-map.mjs";
import {
  DOCS_PAGE_PLACEHOLDER_PATTERNS,
  GENERATED_DOCS_PAGE_MARKER,
} from "./docs-page-scaffold-rules.mjs";

function toPascalCaseFromSlug(slug) {
  return slug
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join("");
}

function fallbackTitleFromMetadata(category, metadataKey, metadataEntry) {
  if (typeof metadataEntry?.title === "string" && metadataEntry.title.length > 0) {
    return metadataEntry.title;
  }
  const baseKey = metadataKeyToBaseKey(category, metadataKey);
  return baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
}

function extractVariantMeta(componentSpec) {
  const variants = Array.isArray(componentSpec?.variants) ? componentSpec.variants : [];
  const keys = variants
    .map((variant) => variant?.key)
    .filter((key) => typeof key === "string" && key.length > 0);

  const orderedKeys = unique(keys);
  return {
    defaultVariantKey: orderedKeys.includes("default") ? "default" : orderedKeys[0] ?? null,
    variantKeys: uniqueSorted(orderedKeys),
  };
}

function buildCompositeVariantMeta(composite, specComponents) {
  const variantKeys = uniqueSorted(
    composite.metadataKeys.flatMap((key) => extractVariantMeta(specComponents?.[key]).variantKeys)
  );

  return {
    defaultVariantKey: null,
    variantKeys,
  };
}

function buildPageDefinitions(config, metadata, specComponents) {
  const definitions = [];
  const consumedKeys = new Set();
  const compositeConfigs = DOCS_COMPONENT_COMPOSITES[config.category] ?? [];

  for (const composite of compositeConfigs) {
    const hasAllKeys = composite.metadataKeys.every((key) => key in metadata);
    if (!hasAllKeys) continue;

    const { variantKeys, defaultVariantKey } = buildCompositeVariantMeta(composite, specComponents);

    definitions.push({
      category: config.category,
      pageSlug: composite.slug,
      pageTitle: composite.title,
      metadataKeys: composite.metadataKeys,
      variantKeys,
      defaultVariantKey,
      docsDir: config.docsDir,
      metadataImportPath: config.metadataImportPath,
      metadataVarName: config.metadataVarName,
    });

    for (const key of composite.metadataKeys) {
      consumedKeys.add(key);
    }
  }

  for (const [metadataKey, metadataEntry] of Object.entries(metadata)) {
    if (consumedKeys.has(metadataKey)) continue;

    const { variantKeys, defaultVariantKey } = extractVariantMeta(specComponents?.[metadataKey]);

    definitions.push({
      category: config.category,
      pageSlug: metadataKeyToSlug(config.category, metadataKey),
      pageTitle: fallbackTitleFromMetadata(config.category, metadataKey, metadataEntry),
      metadataKeys: [metadataKey],
      variantKeys,
      defaultVariantKey,
      docsDir: config.docsDir,
      metadataImportPath: config.metadataImportPath,
      metadataVarName: config.metadataVarName,
    });
  }

  return definitions;
}

function shouldRefreshGeneratedPage(filePath) {
  try {
    const source = readFileSync(filePath, "utf-8");
    if (source.includes(GENERATED_DOCS_PAGE_MARKER)) return true;
    return DOCS_PAGE_PLACEHOLDER_PATTERNS.some((pattern) => source.includes(pattern));
  } catch {
    return false;
  }
}

function toComponentExportName(fileName) {
  return fileName.replace(/\.[^.]+$/, "");
}

function buildPreviewTargets(definition) {
  const sourceConfig = getComponentSourceCategoryConfig(definition.category);
  return definition.metadataKeys.map((componentKey) => {
    const fileName = getComponentFileName(componentKey, sourceConfig.fileNameOverrides);
    const componentExportName = toComponentExportName(fileName);
    // The docs site dogfoods the published package, not the raw source tree
    // (the `@/*` alias maps to `app/*`, where these components don't live).
    const componentImportPath = "@gunjo/ui";
    return { componentKey, componentExportName, componentImportPath };
  });
}

function buildPreviewMeta(definition) {
  const targets = buildPreviewTargets(definition);
  if (targets.length === 0) return null;

  const importLines = [
    'import * as React from "react";',
    ...targets.map(
      (target) => `import { ${target.componentExportName} } from "${target.componentImportPath}";`
    ),
  ];

  if (targets.length === 1) {
    const target = targets[0];
    const componentExportName = target.componentExportName;
  const variantKeys = definition.variantKeys ?? [];
  const defaultVariant = definition.defaultVariantKey ?? variantKeys[0] ?? null;
  const variantProp = variantKeys.length > 1 && typeof defaultVariant === "string"
    ? ` variant="${defaultVariant}"`
    : "";

    return {
      importSnippet: importLines.join("\n"),
      previewSetupSnippet: `const PreviewComponent = ${componentExportName} as React.ComponentType<Record<string, unknown>>;`,
      previewNodeSnippet: `<PreviewComponent${variantProp} />`,
      usageCode: `import { ${componentExportName} } from "@gunjo/ui"

export function Example() {
  return <${componentExportName}${variantProp} />
}`,
    };
  }

  const componentNames = targets.map((target) => target.componentExportName);
  const previewSetupSnippet = `const PreviewComponents = [${componentNames.join(
    ", "
  )}].map((Component) => Component as React.ComponentType<Record<string, unknown>>);`;
  const previewNodeSnippet = `<div className="flex w-full flex-col gap-3">
          {PreviewComponents.map((PreviewComponent, index) => (
            <div key={index} className="rounded-md border p-3">
              <PreviewComponent />
            </div>
          ))}
        </div>`;
  const usageCode = `import { ${componentNames.join(", ")} } from "@gunjo/ui"

export function Example() {
  return (
    <div className="space-y-3">
${componentNames.map((name) => `      <${name} />`).join("\n")}
    </div>
  )
}`;

  return {
    importSnippet: importLines.join("\n"),
    previewSetupSnippet,
    previewNodeSnippet,
    usageCode,
  };
}

function renderVariantPropData(definition) {
  if (definition.metadataKeys.length > 1) return "";

  const variantKeys = definition.variantKeys ?? [];
  if (variantKeys.length <= 1) return "";

  const unionType = variantKeys.map((key) => JSON.stringify(key)).join(" | ");
  const defaultVariant = definition.defaultVariantKey ?? variantKeys[0];
  return `  {
    name: "variant",
    type: ${JSON.stringify(unionType)},
    default: ${JSON.stringify(`"${defaultVariant}"`)},
    description: "Variant key derived from design/component-specs.",
  },`;
}

function renderPage(definition) {
  const componentName = `${toPascalCaseFromSlug(definition.pageSlug)}DocPage`;
  const hasCompositeMetadata = definition.metadataKeys.length > 1;
  const previewMeta = buildPreviewMeta(definition);
  const metadataKeySnippet = hasCompositeMetadata
    ? `const metaKeys = ${JSON.stringify(definition.metadataKeys)} as const;`
    : `const metaKey = ${JSON.stringify(definition.metadataKeys[0])};`;
  const titleSnippet = hasCompositeMetadata
    ? `const titles = metaKeys.map((key) => meta[key]?.title).filter((value): value is string => Boolean(value));\n  const title = titles.length > 0 ? titles.join(" + ") : ${JSON.stringify(definition.pageTitle)};`
    : `const title = meta[metaKey]?.title ?? ${JSON.stringify(definition.pageTitle)};`;
  const descriptionSnippet = hasCompositeMetadata
    ? `const descriptions = metaKeys\n    .map((key) => meta[key]?.description)\n    .filter((value): value is string => Boolean(value));\n  const description = descriptions.join(" ");`
    : `const description = meta[metaKey]?.description ?? "";`;
  const previewImportSnippet = previewMeta
    ? previewMeta.importSnippet
    : "";
  const previewSetupSnippet = previewMeta
    ? previewMeta.previewSetupSnippet
    : "";
  const usageCodeLiteral = previewMeta
    ? JSON.stringify(previewMeta.usageCode)
    : JSON.stringify(
      "Auto-generated preview is not available for composite pages.\nAdd a custom demo component when needed."
    );
  const previewNodeSnippet = previewMeta
    ? previewMeta.previewNodeSnippet
    : `<div className="w-full rounded-md border bg-muted p-4 text-sm text-muted-foreground">
          Auto-generated preview is not available for composite pages. Add a custom demo component when needed.
        </div>`;

  const variantPropData = renderVariantPropData(definition);

  return `/**
 * ${GENERATED_DOCS_PAGE_MARKER}.
 * Generated docs component page scaffold from metadata + component-specs.
 */
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import ${definition.metadataVarName} from "${definition.metadataImportPath}";
${previewImportSnippet ? `
${previewImportSnippet}` : ""}

const meta = ${definition.metadataVarName} as Record<string, { title?: string; description?: string }>;
${metadataKeySnippet}
${previewSetupSnippet}

const usageCode = ${usageCodeLiteral};

const propsData = [
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
${variantPropData}
];

export default function ${componentName}() {
  ${titleSnippet}
  ${descriptionSnippet}

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        ${previewNodeSnippet}
      </ComponentPreview>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
        <PropsTable data={propsData} />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
          <CodeBlock code={usageCode} />
        </div>
      </div>
    </ComponentLayout>
  );
}
`;
}

function renderPageSource(definition) {
  return renderPage(definition);
}

function normalizeCategoryList(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return null;
  return [...new Set(categories.map((category) => String(category).trim()).filter(Boolean))];
}

function resolveTargetConfigs(categories) {
  const normalizedCategories = normalizeCategoryList(categories);
  if (!normalizedCategories) return DOCS_COMPONENT_CATEGORY_CONFIGS;

  const configByCategory = new Map(
    DOCS_COMPONENT_CATEGORY_CONFIGS.map((config) => [config.category, config])
  );
  const unknownCategories = normalizedCategories.filter((category) => !configByCategory.has(category));
  if (unknownCategories.length > 0) {
    const knownCategories = DOCS_COMPONENT_CATEGORY_CONFIGS.map((config) => config.category).join(", ");
    throw new Error(
      `design:sync: unknown docs category: ${unknownCategories.join(", ")} (known: ${knownCategories})`
    );
  }

  return normalizedCategories.map((category) => configByCategory.get(category));
}

export function syncDocsPages({ root = ROOT, refreshGenerated = false, categories = null } = {}) {
  const createdPages = [];
  const refreshedPages = [];
  const targetConfigs = resolveTargetConfigs(categories);
  const categorySuffix =
    targetConfigs.length === DOCS_COMPONENT_CATEGORY_CONFIGS.length
      ? ""
      : ` [${targetConfigs.map((config) => config.category).join(", ")}]`;

  for (const config of targetConfigs) {
    const metadata = readJson(join(root, config.metadataPath));
    const spec = readJson(join(root, config.specPath));
    const specComponents = spec?.components ?? {};
    const pageDefinitions = buildPageDefinitions(config, metadata, specComponents);

    for (const definition of pageDefinitions) {
      const pagePath = join(root, definition.docsDir, definition.pageSlug, "page.tsx");
      const pageExists = existsSync(pagePath);

      if (pageExists && !(refreshGenerated && shouldRefreshGeneratedPage(pagePath))) {
        continue;
      }

      const source = renderPageSource(definition);
      writeText(pagePath, source);

      if (pageExists) {
        refreshedPages.push(pagePath);
      } else {
        createdPages.push(pagePath);
      }
    }
  }

  if (createdPages.length === 0 && refreshedPages.length === 0) {
    console.log(`design:sync: docs pages are up to date${categorySuffix}`);
    return;
  }

  if (createdPages.length > 0) {
    console.log(`design:sync: created missing docs component pages${categorySuffix}:`);
    for (const filePath of createdPages) {
      console.log(`- ${toRelativePath(root, filePath)}`);
    }
  }

  if (refreshedPages.length > 0) {
    console.log(`design:sync: refreshed generated docs component pages${categorySuffix}:`);
    for (const filePath of refreshedPages) {
      console.log(`- ${toRelativePath(root, filePath)}`);
    }
  }
}
