import { getComponentSpecCategoryConfig } from "./component-spec-config.mjs";

export const COMPONENT_SOURCE_CATEGORY_CONFIGS = [
  {
    category: "patterns",
    specPath: getComponentSpecCategoryConfig("patterns").specPath,
    sourceDir: "src/components/patterns",
    fileNameOverrides: {},
  },
  {
    category: "feedback",
    specPath: getComponentSpecCategoryConfig("feedback").specPath,
    sourceDir: "src/components/feedback",
    fileNameOverrides: {},
  },
  {
    category: "layout",
    specPath: getComponentSpecCategoryConfig("layout").specPath,
    sourceDir: "src/components/layout",
    fileNameOverrides: {
      hStack: "HStack.tsx",
      vStack: "VStack.tsx",
    },
  },
  {
    category: "navigation",
    specPath: getComponentSpecCategoryConfig("navigation").specPath,
    sourceDir: "src/components/navigation",
    fileNameOverrides: {},
  },
  {
    category: "overlay",
    specPath: getComponentSpecCategoryConfig("overlay").specPath,
    sourceDir: "src/components/overlay",
    fileNameOverrides: {},
  },
  {
    category: "display",
    specPath: getComponentSpecCategoryConfig("display").specPath,
    sourceDir: "src/components/display",
    fileNameOverrides: {},
  },
  {
    category: "inputs",
    specPath: getComponentSpecCategoryConfig("inputs").specPath,
    sourceDir: "src/components/inputs",
    fileNameOverrides: {
      button: "Button.tsx",
      inputOTP: "InputOTP.tsx",
    },
  },
];

const COMPONENT_SOURCE_CONFIG_BY_CATEGORY = new Map(
  COMPONENT_SOURCE_CATEGORY_CONFIGS.map((config) => [config.category, config])
);

export function getComponentSourceCategoryConfig(category) {
  const config = COMPONENT_SOURCE_CONFIG_BY_CATEGORY.get(category);
  if (!config) {
    throw new Error(`design:sync: unknown component source category "${category}".`);
  }
  return config;
}

export function toPascalCase(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getComponentFileName(componentKey, overrides = {}) {
  return overrides[componentKey] ?? `${toPascalCase(componentKey)}.tsx`;
}
