import { ROOT } from "./shared.mjs";
import { syncComponentManifest } from "./sync-component-manifest.mjs";
import { syncComponentStyleHints } from "./sync-component-style-hints.mjs";
import { syncPublicExports } from "./sync-public-exports.mjs";
import { CATEGORY_REGISTRY } from "./category-registry.mjs";
import { syncCategorySpecs } from "./sync-category.mjs";

export { buildComponentSpec, buildTextSampleSpec } from "./sync-component-specs-builders.mjs";

export function syncComponentSpecs({ root = ROOT } = {}) {
  for (const entry of CATEGORY_REGISTRY) {
    syncCategorySpecs({ root, category: entry.category });
  }
  syncComponentManifest({ root });
  syncComponentStyleHints({ root });
  syncPublicExports({ root });
}
