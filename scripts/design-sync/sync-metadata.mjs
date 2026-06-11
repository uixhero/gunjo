import { join } from "node:path";
import { ROOT, findNodeById, readJson, writeJson } from "./shared.mjs";
import { CATEGORY_REGISTRY } from "./category-registry.mjs";
import { getComponentSpecCategoryConfig } from "./component-spec-config.mjs";

function createTitleDescMap(definitions) {
  return Object.fromEntries(
    definitions.map((definition) => {
      const syntheticTitle =
        definition.syntheticSpec?.title ?? definition.metadata?.title;
      const syntheticDescription =
        definition.syntheticSpec?.description ?? definition.metadata?.description;

      if (definition.syntheticSpec || definition.metadata) {
        return [
          definition.key,
          {
            synthetic: true,
            title: syntheticTitle,
            description: syntheticDescription,
          },
        ];
      }

      return [
        definition.key,
        { titleId: definition.titleId, descId: definition.descId },
      ];
    })
  );
}

export const METADATA_SYNC_CATEGORY_CONFIGS = CATEGORY_REGISTRY.map((entry) => {
  const specConfig = getComponentSpecCategoryConfig(entry.category);
  return {
    label: entry.category,
    penPath: specConfig.penPath,
    metadataPath: `design/${entry.category}-metadata.json`,
    nodeMap: createTitleDescMap(entry.definitions),
  };
});

function loadPenRoot(penPath) {
  const pen = readJson(penPath);
  const root = pen.children?.[0];
  if (!root) throw new Error(`design:sync: ${penPath} missing root frame`);
  return { pen, root };
}

function syncCategory({
  penPath,
  metadataPath,
  nodeMap,
  fromMetadata,
  label,
}) {
  const penBundle = loadPenRoot(penPath);

  const { pen, root } = penBundle;

  if (fromMetadata) {
    let metadata;
    try {
      metadata = readJson(metadataPath);
    } catch (error) {
      console.warn(`design:sync: skipped ${label} from-metadata (${error.message})`);
      return;
    }

    for (const [key, meta] of Object.entries(metadata)) {
      const ids = nodeMap[key];
      if (!ids) continue;
      if (ids.synthetic) continue;
      const titleNode = findNodeById(root, ids.titleId);
      const descNode = findNodeById(root, ids.descId);

      if (titleNode && meta.title) titleNode.content = meta.title;
      if (descNode && meta.description) descNode.content = meta.description;
    }

    writeJson(penPath, pen);
    console.log(`design:sync: Updated ${label}.pen from ${label}-metadata.json`);
    return;
  }

  let existingMetadata = {};
  try {
    existingMetadata = readJson(metadataPath);
  } catch {
    existingMetadata = {};
  }

  // Keep the existing file order for current entries, but drop keys that are no
  // longer in the registry. Stale metadata keys otherwise regenerate removed
  // component docs and navigation entries.
  const metadata = {};
  for (const key of Object.keys(existingMetadata)) {
    if (nodeMap[key]) metadata[key] = {};
  }
  for (const key of Object.keys(nodeMap)) {
    if (!metadata[key]) metadata[key] = {};
  }

  for (const [key, ids] of Object.entries(nodeMap)) {
    if (ids.synthetic) {
      if (!metadata[key]) metadata[key] = {};
      if (ids.title) metadata[key].title = ids.title;
      if (ids.description) metadata[key].description = ids.description;
      continue;
    }

    const titleNode =
      findNodeById(root, ids.titleId) ?? findNodeById(pen, ids.titleId);
    const descNode =
      findNodeById(root, ids.descId) ?? findNodeById(pen, ids.descId);
    if (!metadata[key]) metadata[key] = {};
    if (titleNode?.content) metadata[key].title = titleNode.content;
    if (descNode?.content) metadata[key].description = descNode.content;
  }

  writeJson(metadataPath, metadata);
  console.log(`design:sync: Updated ${label}-metadata.json from ${label}.pen`);
}

export function syncMetadata({ root = ROOT, fromMetadata = false } = {}) {
  for (const category of METADATA_SYNC_CATEGORY_CONFIGS) {
    syncCategory({
      penPath: join(root, category.penPath),
      metadataPath: join(root, category.metadataPath),
      nodeMap: category.nodeMap,
      fromMetadata,
      label: category.label,
    });
  }
}
