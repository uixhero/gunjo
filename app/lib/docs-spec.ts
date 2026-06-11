import inputsSpec from "@design/component-specs/inputs-core.json";
import displaySpec from "@design/component-specs/display-core.json";
import feedbackSpec from "@design/component-specs/feedback-core.json";
import navigationSpec from "@design/component-specs/navigation-core.json";
import overlaySpec from "@design/component-specs/overlay-core.json";
import layoutSpec from "@design/component-specs/layout-core.json";
import patternsSpec from "@design/component-specs/patterns-core.json";

type VariantSpec = {
  key?: string | null;
};

type ComponentSpec = {
  variants?: VariantSpec[];
};

type ComponentsSpecMap = Record<string, ComponentSpec | null | undefined>;

type FunctionalCategory =
  | "inputs"
  | "display"
  | "feedback"
  | "navigation"
  | "overlay"
  | "layout"
  | "patterns";

const componentsByCategory: Record<FunctionalCategory, ComponentsSpecMap | undefined> = {
  inputs: (inputsSpec as { components?: ComponentsSpecMap }).components,
  display: (displaySpec as { components?: ComponentsSpecMap }).components,
  feedback: (feedbackSpec as { components?: ComponentsSpecMap }).components,
  navigation: (navigationSpec as { components?: ComponentsSpecMap }).components,
  overlay: (overlaySpec as { components?: ComponentsSpecMap }).components,
  layout: (layoutSpec as { components?: ComponentsSpecMap }).components,
  patterns: (patternsSpec as { components?: ComponentsSpecMap }).components,
};

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function getVariantUnionType(
  components: ComponentsSpecMap | undefined,
  componentKey: string,
  fallback = "string"
) {
  const keys = uniqueSorted(
    (components?.[componentKey]?.variants ?? [])
      .map((variant) => variant?.key)
      .filter((key): key is string => Boolean(key))
  );

  if (keys.length === 0) return fallback;
  return keys.map((key) => `"${key}"`).join(" | ");
}

export function getCategoryVariantUnionType(
  category: FunctionalCategory,
  componentKey: string,
  fallback = "string"
) {
  return getVariantUnionType(componentsByCategory[category], componentKey, fallback);
}
