// Single source of truth for which functional categories exist and how each
// one's specs should be built. Adding a new tier = (1) drop a definitions
// file under tier-definitions/, (2) append a registry entry below, (3) add
// matching entries to component-spec-config / component-source-map / docs-
// component-config.
//
// Each entry tells the generic syncCategory pipeline:
//  - which tier-definitions file to read (definitions)
//  - what options to pass to buildStructuredSpec for components with nodeIds
//  - the export name for the generated grouped variant-keys file
//
// Any component definition with `sampleTextId` falls through to
// buildTextSampleSpec; with `nodeIds` to buildStructuredSpec; otherwise to
// buildComponentSpec — consistent across all tiers.

import { PATTERNS_SPEC_DEFINITIONS } from "./tier-definitions/patterns.mjs";
import { FEEDBACK_SPEC_DEFINITIONS } from "./tier-definitions/feedback.mjs";
import { LAYOUT_SPEC_DEFINITIONS } from "./tier-definitions/layout.mjs";
import { NAVIGATION_SPEC_DEFINITIONS } from "./tier-definitions/navigation.mjs";
import { OVERLAY_SPEC_DEFINITIONS } from "./tier-definitions/overlay.mjs";
import { DISPLAY_SPEC_DEFINITIONS } from "./tier-definitions/display.mjs";
import { INPUTS_SPEC_DEFINITIONS } from "./tier-definitions/inputs.mjs";

const STANDARD_STRUCTURED_OPTIONS = {
  includeIconFontFields: true,
  autoIncludeVariantChildrenNodes: true,
};

const PATTERNS_STRUCTURED_OPTIONS = {
  variantNodeTypes: ["frame"],
  autoIncludeVariantChildrenNodes: true,
};

export const CATEGORY_REGISTRY = [
  {
    category: "patterns",
    definitions: PATTERNS_SPEC_DEFINITIONS,
    structuredSpecOptions: PATTERNS_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "patternsVariantKeys",
    defaultVariantKeysGroupedExportName: "patternsDefaultVariantKeys",
    skipVariantKeys: true,
  },
  {
    category: "feedback",
    definitions: FEEDBACK_SPEC_DEFINITIONS,
    structuredSpecOptions: STANDARD_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "feedbackVariantKeys",
    defaultVariantKeysGroupedExportName: "feedbackDefaultVariantKeys",
  },
  {
    category: "layout",
    definitions: LAYOUT_SPEC_DEFINITIONS,
    structuredSpecOptions: STANDARD_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "layoutVariantKeys",
    defaultVariantKeysGroupedExportName: "layoutDefaultVariantKeys",
  },
  {
    category: "navigation",
    definitions: NAVIGATION_SPEC_DEFINITIONS,
    structuredSpecOptions: STANDARD_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "navigationVariantKeys",
    defaultVariantKeysGroupedExportName: "navigationDefaultVariantKeys",
  },
  {
    category: "overlay",
    definitions: OVERLAY_SPEC_DEFINITIONS,
    structuredSpecOptions: STANDARD_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "overlayVariantKeys",
    defaultVariantKeysGroupedExportName: "overlayDefaultVariantKeys",
  },
  {
    category: "display",
    definitions: DISPLAY_SPEC_DEFINITIONS,
    structuredSpecOptions: STANDARD_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "displayVariantKeys",
    defaultVariantKeysGroupedExportName: "displayDefaultVariantKeys",
  },
  {
    category: "inputs",
    definitions: INPUTS_SPEC_DEFINITIONS,
    structuredSpecOptions: STANDARD_STRUCTURED_OPTIONS,
    variantKeysGroupedExportName: "inputsVariantKeys",
    defaultVariantKeysGroupedExportName: "inputsDefaultVariantKeys",
  },
];

const REGISTRY_BY_CATEGORY = new Map(
  CATEGORY_REGISTRY.map((entry) => [entry.category, entry])
);

export function getCategoryRegistryEntry(category) {
  const entry = REGISTRY_BY_CATEGORY.get(category);
  if (!entry) {
    throw new Error(`design:sync: unknown category "${category}" in registry.`);
  }
  return entry;
}
