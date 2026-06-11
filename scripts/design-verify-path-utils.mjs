import { readdirSync } from "node:fs";
import { join } from "node:path";
export { toRelativePath } from "./design-sync/shared.mjs";

export function listDocsComponentPages(root) {
  const docsComponentsRoot = join(root, "app", "docs", "components");
  const categories = readdirSync(docsComponentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const pages = [];
  for (const category of categories) {
    const categoryPath = join(docsComponentsRoot, category);
    const slugs = readdirSync(categoryPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const slug of slugs) {
      pages.push(join(categoryPath, slug, "page.tsx"));
    }
  }

  return pages;
}
