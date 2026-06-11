import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readJson, toRelativePath, writeText } from "./shared.mjs";
import {
  COMPONENT_SOURCE_CATEGORY_CONFIGS,
  getComponentFileName,
  toPascalCase,
} from "./component-source-map.mjs";
import { buildVariantKeyEntries } from "./sync-variant-keys-shared.mjs";
import {
  buildColorHint,
  buildVariantClasses,
  extractSlotIds,
} from "./component-style-hints-shared.mjs";
import {
  GENERATED_STUB_MARKER,
  PRODUCTION_STUB_MARKER,
} from "./component-stub-markers.mjs";

function renderLiteralArray(values) {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

function toSemanticSlotTag(slotId, slotNodeType = "unknown") {
  const normalized = String(slotId ?? "").toLowerCase();
  if (normalized.includes("header")) return "header";
  if (normalized.includes("footer")) return "footer";
  if (normalized.includes("nav") || normalized.includes("menu") || normalized.includes("breadcrumb")) {
    return "nav";
  }
  if (
    normalized.includes("sidebar") ||
    normalized.includes("rail") ||
    normalized.includes("aside") ||
    normalized.includes("inspector")
  ) {
    return "aside";
  }
  if (normalized.includes("main") || normalized.includes("content") || normalized.includes("body")) {
    return "section";
  }
  if (normalized.includes("form")) return "form";
  if (slotNodeType === "text") return "span";
  if (slotNodeType === "icon_font") return "span";
  if (
    normalized.includes("text") ||
    normalized.includes("label") ||
    normalized.includes("title") ||
    normalized.includes("hint") ||
    normalized.includes("icon")
  ) {
    return "span";
  }
  return "div";
}

function toSlotAriaLabel(slotId, { production = false } = {}) {
  const words = String(slotId ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  if (production) return words.length > 0 ? `${words} slot` : "slot";
  return words.length > 0 ? `generated ${words} slot` : "generated slot";
}

function buildNodeById(componentSpec) {
  const nodes = componentSpec?.nodes;
  if (!nodes || typeof nodes !== "object") return new Map();
  return new Map(
    Object.values(nodes)
      .filter(
        (node) =>
          node &&
          typeof node === "object" &&
          typeof node.id === "string" &&
          node.id.length > 0
      )
      .map((node) => [node.id, node])
  );
}

function buildSlotClassById(slotIds, componentSpec) {
  const nodeById = buildNodeById(componentSpec);
  return Object.fromEntries(
    slotIds.map((slotId) => [slotId, buildVariantClasses(nodeById.get(slotId))])
  );
}

function toSlotNodeType(slotNode) {
  if (!slotNode || typeof slotNode !== "object") return "unknown";
  const nodeType = slotNode.type;
  if (nodeType === "frame" || nodeType === "text" || nodeType === "icon_font") {
    return nodeType;
  }
  return "unknown";
}

function toSlotPlaceholderText(slotId, slotNode, { production = false } = {}) {
  const content = typeof slotNode?.content === "string" ? slotNode.content.trim() : "";
  if (content.length > 0) return content;
  if (toSlotNodeType(slotNode) !== "text") return null;
  if (production) return null;

  const words = String(slotId ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return words.length > 0 ? `generated ${words} text` : "generated text";
}

function buildSlotNodeTypeById(slotIds, componentSpec) {
  const nodeById = buildNodeById(componentSpec);
  return Object.fromEntries(
    slotIds.map((slotId) => [slotId, toSlotNodeType(nodeById.get(slotId))])
  );
}

function buildSlotPlaceholderTextById(slotIds, componentSpec, { production = false } = {}) {
  const nodeById = buildNodeById(componentSpec);
  return Object.fromEntries(
    slotIds.map((slotId) => [
      slotId,
      toSlotPlaceholderText(slotId, nodeById.get(slotId), { production }),
    ])
  );
}

function buildSlotDecorativeById(slotIds, slotNodeTypeById) {
  return Object.fromEntries(
    slotIds.map((slotId) => {
      const normalized = String(slotId ?? "").toLowerCase();
      const isDecorative =
        slotNodeTypeById[slotId] === "icon_font" ||
        normalized.includes("icon") ||
        normalized.includes("separator");
      return [slotId, isDecorative];
    })
  );
}

function renderSlotConstants({
  slotIds,
  slotClassById,
  slotNodeTypeById,
  slotPlaceholderTextById,
  slotDecorativeById,
  production = false,
}) {
  if (slotIds.length === 0) return "";
  const idList = slotIds.map((slotId) => JSON.stringify(slotId)).join(", ");
  const classEntries = slotIds
    .map(
      (slotId) =>
        `  ${JSON.stringify(slotId)}: ${JSON.stringify(slotClassById[slotId] ?? "")},`
    )
    .join("\n");
  const tagEntries = slotIds
    .map(
      (slotId) =>
        `  ${JSON.stringify(slotId)}: ${JSON.stringify(
          toSemanticSlotTag(slotId, slotNodeTypeById[slotId])
        )},`
    )
    .join("\n");
  const ariaLabelEntries = slotIds
    .map(
      (slotId) =>
        `  ${JSON.stringify(slotId)}: ${JSON.stringify(
          toSlotAriaLabel(slotId, { production })
        )},`
    )
    .join("\n");
  const placeholderTextEntries = slotIds
    .map((slotId) => {
      const value = slotPlaceholderTextById[slotId];
      const literal = typeof value === "string" ? JSON.stringify(value) : "null";
      return `  ${JSON.stringify(slotId)}: ${literal},`;
    })
    .join("\n");
  const decorativeEntries = slotIds
    .map((slotId) => `  ${JSON.stringify(slotId)}: ${slotDecorativeById[slotId] ? "true" : "false"},`)
    .join("\n");
  const dataSlotPlaceholderAttr = production ? "" : "\n      data-slot-placeholder";
  const slotPlaceholderComment = production
    ? ""
    : "\n      {/* Generated slot placeholder. Replace with concrete UI/content. */}";
  return `
const slotIds = [${idList}] as const
const slotClasses: Record<(typeof slotIds)[number], string> = {
${classEntries}
}
const slotTagById: Record<(typeof slotIds)[number], keyof React.JSX.IntrinsicElements> = {
${tagEntries}
}
const slotAriaLabelById: Record<(typeof slotIds)[number], string> = {
${ariaLabelEntries}
}
const slotPlaceholderTextById: Record<(typeof slotIds)[number], string | null> = {
${placeholderTextEntries}
}
const slotDecorativeById: Record<(typeof slotIds)[number], boolean> = {
${decorativeEntries}
}

function renderSlotNode(slotId: (typeof slotIds)[number]) {
  const SlotTag = slotTagById[slotId]
  const isDecorative = slotDecorativeById[slotId]
  return (
    <SlotTag
      key={slotId}
      data-slot={slotId}${dataSlotPlaceholderAttr}
      aria-label={isDecorative ? undefined : slotAriaLabelById[slotId]}
      aria-hidden={isDecorative ? true : undefined}
      className={cn(slotClasses[slotId])}
    >
      {slotPlaceholderTextById[slotId]}${slotPlaceholderComment}
    </SlotTag>
  )
}
`;
}

function renderSlotNodes(slotIdExpression) {
  if (!slotIdExpression) return "";
  return `
    {${slotIdExpression}.map((slotId) => renderSlotNode(slotId))}`;
}

function collectVariantSlotIds({ variantKeys, variantByKey }) {
  const variantSlotIdsByKey = new Map();
  const allSlotIds = [];

  for (const key of variantKeys) {
    const variantSpec = variantByKey.get(key);
    const slotIds = extractSlotIds(variantSpec);
    variantSlotIdsByKey.set(key, slotIds);
    for (const slotId of slotIds) {
      if (!allSlotIds.includes(slotId)) {
        allSlotIds.push(slotId);
      }
    }
  }

  return { variantSlotIdsByKey, allSlotIds };
}

function renderVariantSlotMap({ componentKey, variantTypeName, variantKeys, variantSlotIdsByKey }) {
  if (variantKeys.length === 0) return "";
  const entries = variantKeys
    .map((key) => {
      const slotIds = variantSlotIdsByKey.get(key) ?? [];
      return `  ${JSON.stringify(key)}: ${renderLiteralArray(slotIds)},`;
    })
    .join("\n");

  return `
const ${componentKey}VariantSlotIds: Record<${variantTypeName}, readonly (typeof slotIds)[number][]> = {
${entries}
}
`;
}

function buildVariantRecordEntries({ variantKeys, variantByKey }) {
  return variantKeys
    .map((key) => {
      const variantSpec = variantByKey.get(key);
      const variantClass = buildVariantClasses(variantSpec);
      const colorHint = buildColorHint(variantSpec);
      const suffix = colorHint ? ` // ${colorHint}` : "";
      return `  ${key}: ${JSON.stringify(variantClass)},${suffix}`;
    })
    .join("\n");
}

function buildMultiVariantStub({
  componentKey,
  componentName,
  componentSpec,
  variantEntries,
  variantKeys,
  defaultVariantKey,
  variantByKey,
  importPathPrefix,
  useGeneratedVariantTypes,
  production,
}) {
  const variantTypeName = `${componentName}VariantKey`;
  const defaultVariantKeyName = `${componentKey}DefaultVariantKey`;
  const { variantSlotIdsByKey, allSlotIds } = collectVariantSlotIds({ variantKeys, variantByKey });
  const slotClassById = buildSlotClassById(allSlotIds, componentSpec);
  const slotNodeTypeById = buildSlotNodeTypeById(allSlotIds, componentSpec);
  const slotPlaceholderTextById = buildSlotPlaceholderTextById(allSlotIds, componentSpec, {
    production,
  });
  const slotDecorativeById = buildSlotDecorativeById(allSlotIds, slotNodeTypeById);
  const slotConstants = renderSlotConstants({
    slotIds: allSlotIds,
    slotClassById,
    slotNodeTypeById,
    slotPlaceholderTextById,
    slotDecorativeById,
    production,
  });
  const variantSlotMap = renderVariantSlotMap({
    componentKey,
    variantTypeName,
    variantKeys,
    variantSlotIdsByKey,
  });
  const slotNodes = allSlotIds.length > 0 ? renderSlotNodes(`${componentKey}VariantSlotIds[variant]`) : "";
  const variantTypeSource = useGeneratedVariantTypes
    ? `import type { ${variantTypeName} } from "${importPathPrefix}/variant-keys"
import { ${defaultVariantKeyName} } from "${importPathPrefix}/default-variant-keys"`
    : `const ${componentKey}VariantKeys = ${renderLiteralArray(variantKeys)} as const
type ${variantTypeName} = (typeof ${componentKey}VariantKeys)[number]
const ${defaultVariantKeyName}: ${variantTypeName} = ${JSON.stringify(defaultVariantKey)}`;
  const rootContent = slotNodes
    ? `<div ref={ref} className={cn(${componentKey}VariantClasses[variant], className)} {...props}>${slotNodes}
  </div>`
    : `<div ref={ref} className={cn(${componentKey}VariantClasses[variant], className)} {...props} />`;
  const header = production
    ? `// ${PRODUCTION_STUB_MARKER}`
    : "// Generated by `npm run design:sync:stubs`. Edit classes as needed.";
  return `${header}\n\nimport * as React from "react"\nimport { cn } from "../../lib/utils"\n${variantTypeSource}\n\nconst ${componentKey}VariantClasses: Record<${variantTypeName}, string> = {\n${variantEntries}\n}${slotConstants}${variantSlotMap}\n\nexport interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {\n  variant?: ${variantTypeName}\n}\n\nexport const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(\n  ({ className, variant = ${defaultVariantKeyName}, ...props }, ref) => {\n    return ${rootContent}\n  }\n)\n\n${componentName}.displayName = "${componentName}"\n`;
}

function buildSingleVariantStub({
  componentName,
  componentSpec,
  baseClasses,
  colorHint,
  slotIds,
  production,
}) {
  const slotClassById = buildSlotClassById(slotIds, componentSpec);
  const slotNodeTypeById = buildSlotNodeTypeById(slotIds, componentSpec);
  const slotPlaceholderTextById = buildSlotPlaceholderTextById(slotIds, componentSpec, {
    production,
  });
  const slotDecorativeById = buildSlotDecorativeById(slotIds, slotNodeTypeById);
  const slotConstants = renderSlotConstants({
    slotIds,
    slotClassById,
    slotNodeTypeById,
    slotPlaceholderTextById,
    slotDecorativeById,
    production,
  });
  const slotNodes = renderSlotNodes("slotIds");
  const rootContent = slotNodes
    ? `<div ref={ref} className={cn(baseClasses, className)} {...props}>${slotNodes}
  </div>`
    : `<div ref={ref} className={cn(baseClasses, className)} {...props} />`;
  const colorHintComment = colorHint ? `// Color hint from spec: ${colorHint}\n` : "";
  const header = production
    ? `// ${PRODUCTION_STUB_MARKER}`
    : "// Generated by `npm run design:sync:stubs`. Flesh out this component.";
  return `${header}\n\nimport * as React from "react"\nimport { cn } from "../../lib/utils"\n\n${colorHintComment}const baseClasses = ${JSON.stringify(baseClasses)}${slotConstants}\n\nexport interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {}\n\nexport const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(\n  ({ className, ...props }, ref) => {\n    return ${rootContent}\n  }\n)\n\n${componentName}.displayName = "${componentName}"\n`;
}

function buildStubSource({
  category,
  componentKey,
  componentSpec,
  variantKeys,
  importPathPrefix = "./generated",
  production = false,
}) {
  const componentName = toPascalCase(componentKey);
  const variants = Array.isArray(componentSpec?.variants) ? componentSpec.variants : [];
  const variantByKey = new Map(
    variants
      .filter((variant) => typeof variant?.key === "string" && variant.key.length > 0)
      .map((variant) => [variant.key, variant])
  );
  const hasMultipleVariants = variantKeys.length > 1;
  const baseVariant = variantByKey.get("default") ?? variants[0] ?? null;
  const slotIds = extractSlotIds(baseVariant);
  const defaultVariantKey = variantKeys.includes("default")
    ? "default"
    : variantKeys[0] ?? "default";

  if (!hasMultipleVariants) {
    return buildSingleVariantStub({
      componentName,
      componentSpec,
      baseClasses: buildVariantClasses(baseVariant),
      colorHint: buildColorHint(baseVariant),
      slotIds,
      production,
    });
  }

  return buildMultiVariantStub({
    componentKey,
    componentName,
    componentSpec,
    variantEntries: buildVariantRecordEntries({ variantKeys, variantByKey }),
    variantKeys,
    defaultVariantKey,
    variantByKey,
    importPathPrefix,
    useGeneratedVariantTypes: category !== "patterns",
    production,
  });
}

function canRefreshGeneratedStub(filePath, { production = false } = {}) {
  try {
    const source = readFileSync(filePath, "utf-8");
    if (production) {
      return source.includes(PRODUCTION_STUB_MARKER) || source.includes(GENERATED_STUB_MARKER);
    }
    return source.includes(GENERATED_STUB_MARKER);
  } catch {
    return false;
  }
}

function syncCategoryStubs({ root, config, refreshGenerated, production }) {
  const spec = readJson(join(root, config.specPath));
  const components = spec?.components ?? {};
  const multiVariantEntryByKey = new Map(
    buildVariantKeyEntries(spec).map((entry) => [entry.key, entry])
  );
  const createdFiles = [];
  const updatedFiles = [];

  for (const componentKey of Object.keys(components)) {
    const fileName = getComponentFileName(componentKey, config.fileNameOverrides);
    const filePath = join(root, config.sourceDir, fileName);
    const variantKeys = multiVariantEntryByKey.get(componentKey)?.keys ?? [];
    const source = buildStubSource({
      category: config.category,
      componentKey,
      componentSpec: components[componentKey],
      variantKeys,
      importPathPrefix: config.importPathPrefix,
      production,
    });
    const fileExists = existsSync(filePath);
    if (!fileExists) {
      writeText(filePath, source);
      createdFiles.push(filePath);
      continue;
    }

    if (refreshGenerated && canRefreshGeneratedStub(filePath, { production })) {
      writeText(filePath, source);
      updatedFiles.push(filePath);
    }
  }

  return { createdFiles, updatedFiles };
}

function normalizeCategoryList(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return null;
  return [...new Set(categories.map((category) => String(category).trim()).filter(Boolean))];
}

function resolveTargetConfigs(categories) {
  const normalizedCategories = normalizeCategoryList(categories);
  if (!normalizedCategories) return COMPONENT_SOURCE_CATEGORY_CONFIGS;

  const configByCategory = new Map(
    COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => [config.category, config])
  );
  const unknownCategories = normalizedCategories.filter((category) => !configByCategory.has(category));
  if (unknownCategories.length > 0) {
    const knownCategories = COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => config.category).join(", ");
    throw new Error(
      `design:sync: unknown stub category: ${unknownCategories.join(", ")} (known: ${knownCategories})`
    );
  }

  return normalizedCategories.map((category) => configByCategory.get(category));
}

export function syncComponentStubs({
  root = ROOT,
  refreshGenerated = false,
  production = false,
  categories = null,
} = {}) {
  const targetConfigs = resolveTargetConfigs(categories);
  const result = targetConfigs.map((config) =>
    syncCategoryStubs({ root, config, refreshGenerated, production })
  );
  const createdFiles = result.flatMap((item) => item.createdFiles);
  const updatedFiles = result.flatMap((item) => item.updatedFiles);
  const modeSuffix = production ? " (production mode)" : "";
  const categorySuffix =
    targetConfigs.length === COMPONENT_SOURCE_CATEGORY_CONFIGS.length
      ? ""
      : ` [${targetConfigs.map((config) => config.category).join(", ")}]`;

  if (createdFiles.length === 0 && updatedFiles.length === 0) {
    console.log(`design:sync: component stubs are up to date${modeSuffix}${categorySuffix}`);
    return;
  }

  if (createdFiles.length > 0) {
    console.log(`design:sync: created missing component stubs${modeSuffix}${categorySuffix}:`);
    for (const filePath of createdFiles) {
      console.log(`- ${toRelativePath(root, filePath)}`);
    }
  }

  if (updatedFiles.length > 0) {
    console.log(`design:sync: refreshed generated component stubs${modeSuffix}${categorySuffix}:`);
    for (const filePath of updatedFiles) {
      console.log(`- ${toRelativePath(root, filePath)}`);
    }
  }
}
