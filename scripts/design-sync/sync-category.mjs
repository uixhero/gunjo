import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { ROOT, readJson, writeJson, writeText } from "./shared.mjs";
import { buildStructuredSpec } from "./sync-structured-spec-utils.mjs";
import {
  buildComponentSpec,
  buildTextSampleSpec,
} from "./sync-component-specs-builders.mjs";
import { getComponentSpecCategoryConfig } from "./component-spec-config.mjs";
import { getCategoryRegistryEntry } from "./category-registry.mjs";
import {
  buildVariantKeyEntries,
  renderGeneratedDefaultVariantKeyFile,
  renderGeneratedVariantKeyFile,
} from "./sync-variant-keys-shared.mjs";

// Pick the right spec builder per definition shape:
//  - sampleTextId  → text-sample (label-style)
//  - nodeIds       → structured (with extracted node geometry)
//  - otherwise     → atom-style (variants only)
function buildOneComponentSpec({ root, definition, structuredSpecOptions }) {
  let spec;
  if (definition.syntheticSpec) {
    spec = definition.syntheticSpec;
  } else if (definition.sampleTextId) {
    spec = buildTextSampleSpec({
      root,
      frameId: definition.frameId,
      titleId: definition.titleId,
      descId: definition.descId,
      sampleTextId: definition.sampleTextId,
    });
  } else if (definition.nodeIds !== undefined) {
    spec = buildStructuredSpec({
      root,
      frameId: definition.frameId,
      titleId: definition.titleId,
      descId: definition.descId,
      variantsId: definition.variantsId,
      nodeIds: definition.nodeIds,
      ...structuredSpecOptions,
    });
  } else {
    spec = buildComponentSpec({
      root,
      frameId: definition.frameId,
      titleId: definition.titleId,
      descId: definition.descId,
      variantsId: definition.variantsId,
    });
  }

  return applyVariantOverrides(
    applyAdditionalVariants(
      applyComponentOverrides(spec, definition.componentOverrides),
      definition.additionalVariants
    ),
    definition.variantOverrides
  );
}

function applyComponentOverrides(spec, componentOverrides) {
  if (!componentOverrides || !spec || typeof spec !== "object") return spec;
  return { ...spec, ...componentOverrides };
}

function applyVariantOverrides(spec, variantOverrides) {
  if (!variantOverrides || !Array.isArray(spec?.variants)) return spec;

  return {
    ...spec,
    variants: spec.variants.map((variant) => {
      const override = variantOverrides[variant?.key];
      return override ? { ...variant, ...override } : variant;
    }),
  };
}

function applyAdditionalVariants(spec, additionalVariants) {
  if (!Array.isArray(additionalVariants) || !Array.isArray(spec?.variants)) {
    return spec;
  }

  const existingKeys = new Set(spec.variants.map((variant) => variant?.key));
  const nextVariants = additionalVariants.filter(
    (variant) => variant?.key && !existingKeys.has(variant.key)
  );

  if (nextVariants.length === 0) return spec;

  return {
    ...spec,
    variants: [...spec.variants, ...nextVariants],
  };
}

function buildCategoryComponents({ root, definitions, structuredSpecOptions }) {
  return Object.fromEntries(
    definitions.map((definition) => [
      definition.key,
      buildOneComponentSpec({ root, definition, structuredSpecOptions }),
    ])
  );
}

function syncCategoryVariantKeys({
  root,
  category,
  spec,
  variantKeysGroupedExportName,
  defaultVariantKeysGroupedExportName,
}) {
  const entries = buildVariantKeyEntries(spec);
  const outputDir = join(root, "src", "components", category, "generated");
  const variantKeysPath = join(outputDir, "variant-keys.ts");
  const defaultKeysPath = join(outputDir, "default-variant-keys.ts");
  mkdirSync(dirname(variantKeysPath), { recursive: true });

  writeText(
    variantKeysPath,
    renderGeneratedVariantKeyFile({
      entries,
      groupedExportName: variantKeysGroupedExportName,
    })
  );
  writeText(
    defaultKeysPath,
    renderGeneratedDefaultVariantKeyFile({
      entries,
      groupedExportName: defaultVariantKeysGroupedExportName,
    })
  );

  console.log(
    `design:sync: Updated src/components/${category}/generated/variant-keys.ts from design/component-specs/${category}-core.json`
  );
  console.log(
    `design:sync: Updated src/components/${category}/generated/default-variant-keys.ts from design/component-specs/${category}-core.json`
  );
}

export function syncCategorySpecs({ root = ROOT, category } = {}) {
  const registryEntry = getCategoryRegistryEntry(category);
  const config = getComponentSpecCategoryConfig(category);
  const penPath = join(root, config.penPath);
  const outputPath = join(root, config.specPath);
  const pen = readJson(penPath);
  const penRoot = pen.children?.[0];
  if (!penRoot) {
    throw new Error(`design:sync: ${config.penPath} has no root frame`);
  }

  const payload = {
    schemaVersion: 1,
    source: config.penPath,
    components: buildCategoryComponents({
      root: penRoot,
      definitions: registryEntry.definitions,
      structuredSpecOptions: registryEntry.structuredSpecOptions,
    }),
  };

  writeJson(outputPath, payload);
  console.log(`design:sync: Updated ${config.specPath} from ${config.penPath}`);

  if (!registryEntry.skipVariantKeys) {
    syncCategoryVariantKeys({
      root,
      category,
      spec: payload,
      variantKeysGroupedExportName: registryEntry.variantKeysGroupedExportName,
      defaultVariantKeysGroupedExportName:
        registryEntry.defaultVariantKeysGroupedExportName,
    });
  }
}
