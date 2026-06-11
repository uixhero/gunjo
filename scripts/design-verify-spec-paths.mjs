import { join } from "node:path";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { getComponentSourceCategoryConfig } from "./design-sync/component-source-map.mjs";

export function readCategorySpec({ root = ROOT, category }) {
  const config = getComponentSourceCategoryConfig(category);
  const sourceDirPath = join(root, config.sourceDir);
  return {
    specPath: config.specPath,
    sourceDir: config.sourceDir,
    sourceDirPath,
    spec: readJson(join(root, config.specPath)),
  };
}
