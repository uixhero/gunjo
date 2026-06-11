export const COMPONENT_SPEC_CATEGORY_CONFIGS = [
  {
    category: "patterns",
    penPath: "design/patterns.pen",
    specPath: "design/component-specs/patterns-core.json",
  },
  {
    category: "feedback",
    penPath: "design/feedback.pen",
    specPath: "design/component-specs/feedback-core.json",
  },
  {
    category: "layout",
    penPath: "design/layout.pen",
    specPath: "design/component-specs/layout-core.json",
  },
  {
    category: "navigation",
    penPath: "design/navigation.pen",
    specPath: "design/component-specs/navigation-core.json",
  },
  {
    category: "overlay",
    penPath: "design/overlay.pen",
    specPath: "design/component-specs/overlay-core.json",
  },
  {
    category: "display",
    penPath: "design/display.pen",
    specPath: "design/component-specs/display-core.json",
  },
  {
    category: "inputs",
    penPath: "design/inputs.pen",
    specPath: "design/component-specs/inputs-core.json",
  },
];

const CONFIG_BY_CATEGORY = new Map(
  COMPONENT_SPEC_CATEGORY_CONFIGS.map((config) => [config.category, config])
);

export function getComponentSpecCategoryConfig(category) {
  const config = CONFIG_BY_CATEGORY.get(category);
  if (!config) {
    throw new Error(`design:sync: unknown component spec category "${category}".`);
  }
  return config;
}
