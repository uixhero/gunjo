export function getMultiVariantComponentKeys(spec) {
  return Object.entries(spec?.components ?? {})
    .filter(([, componentSpec]) => Array.isArray(componentSpec?.variants) && componentSpec.variants.length > 1)
    .map(([componentKey]) => componentKey)
    .sort((a, b) => a.localeCompare(b));
}
