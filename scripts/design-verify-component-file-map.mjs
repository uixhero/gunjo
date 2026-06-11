import { toPascalCase } from "./design-sync/component-source-map.mjs";
export { toPascalCase } from "./design-sync/component-source-map.mjs";

// Component-key → relative file (within its functional source dir) where the
// cva definition / variant maps live. Used by the default-variant-key usage
// and generated-variant-key usage checks. Most components use the convention
// `<Pascal>.tsx`; only override when the cva lives in a sibling file.
export const VARIANT_DEFINITION_FILE_OVERRIDES = {
  button: "ButtonVariants.ts",
  inputOTP: "InputOTP.tsx",
  hStack: "HStack.tsx",
  vStack: "VStack.tsx",
};

export function getComponentFileName(componentKey, overrides = {}) {
  return overrides[componentKey] ?? `${toPascalCase(componentKey)}.tsx`;
}

export function getVariantDefinitionFileName(componentKey) {
  return getComponentFileName(componentKey, VARIANT_DEFINITION_FILE_OVERRIDES);
}
