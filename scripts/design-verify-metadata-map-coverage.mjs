#!/usr/bin/env node

import { join } from "node:path";
import {
  ROOT,
  findNodeById,
  readJson,
} from "./design-sync/shared.mjs";
import {
  METADATA_SYNC_CATEGORY_CONFIGS,
} from "./design-sync/sync-metadata.mjs";
import { sorted } from "./design-verify-collections.mjs";
import { runVerificationCli } from "./design-verify-assertions.mjs";

function validateCategory({
  label,
  root,
  penPath,
  metadataPath,
  nodeMap,
}) {
  const errors = [];
  const metadata = readJson(join(root, metadataPath));
  const pen = readJson(join(root, penPath));
  const penRoot = pen.children?.[0];

  if (!penRoot) {
    return [`[${label}] missing root frame in ${penPath}`];
  }

  const mapKeys = new Set(Object.keys(nodeMap));
  const metadataKeys = new Set(Object.keys(metadata || {}));

  const missingMapEntries = sorted(
    [...metadataKeys].filter((key) => !mapKeys.has(key))
  );
  if (missingMapEntries.length > 0) {
    errors.push(`[${label}] keys in ${metadataPath} missing in sync map:`);
    for (const key of missingMapEntries) {
      errors.push(`- ${key}`);
    }
  }

  const staleMapEntries = sorted(
    [...mapKeys].filter((key) => !metadataKeys.has(key))
  );
  if (staleMapEntries.length > 0) {
    errors.push(`[${label}] keys in sync map missing in ${metadataPath}:`);
    for (const key of staleMapEntries) {
      errors.push(`- ${key}`);
    }
  }

  const usedTitleIds = new Map();
  const usedDescIds = new Map();

  for (const [key, ids] of Object.entries(nodeMap)) {
    if (ids?.synthetic) {
      if (!ids.title || !ids.description) {
        errors.push(`[${label}] ${key} synthetic metadata is missing title/description`);
      }
      continue;
    }

    if (!ids?.titleId || !ids?.descId) {
      errors.push(`[${label}] ${key} is missing titleId/descId in sync map`);
      continue;
    }

    const titleNode =
      findNodeById(penRoot, ids.titleId) ?? findNodeById(pen, ids.titleId);
    const descNode =
      findNodeById(penRoot, ids.descId) ?? findNodeById(pen, ids.descId);
    if (!titleNode) {
      errors.push(
        `[${label}] ${key} titleId node not found in ${penPath}: ${ids.titleId}`
      );
    }
    if (!descNode) {
      errors.push(
        `[${label}] ${key} descId node not found in ${penPath}: ${ids.descId}`
      );
    }

    usedTitleIds.set(ids.titleId, [...(usedTitleIds.get(ids.titleId) || []), key]);
    usedDescIds.set(ids.descId, [...(usedDescIds.get(ids.descId) || []), key]);
  }

  for (const [nodeId, owners] of usedTitleIds.entries()) {
    if (owners.length > 1) {
      errors.push(
        `[${label}] duplicate titleId "${nodeId}" used by: ${owners.join(", ")}`
      );
    }
  }
  for (const [nodeId, owners] of usedDescIds.entries()) {
    if (owners.length > 1) {
      errors.push(
        `[${label}] duplicate descId "${nodeId}" used by: ${owners.join(", ")}`
      );
    }
  }

  return errors;
}

export function verifyMetadataMapCoverage({ root = ROOT } = {}) {
  const errors = METADATA_SYNC_CATEGORY_CONFIGS.flatMap((category) =>
    validateCategory({ ...category, root })
  );

  if (errors.length > 0) {
    throw new Error(
      [
        "design:verify: metadata sync map coverage mismatch detected.",
        ...errors,
        "Update scripts/design-sync/sync-metadata.mjs or related metadata/.pen nodes.",
      ].join("\n")
    );
  }
}

runVerificationCli({
  scriptName: "design-verify-metadata-map-coverage.mjs",
  verify: verifyMetadataMapCoverage,
  successMessage: "design:verify: metadata sync map coverage check passed",
});
