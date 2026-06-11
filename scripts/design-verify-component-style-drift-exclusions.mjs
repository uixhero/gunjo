import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "./design-sync/shared.mjs";

export const COMPONENT_STYLE_DRIFT_EXCLUSIONS_PATH =
  "design/policy/component-style-drift-exclusions.json";

function isIsoDate(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time);
}

function normalizeStringField(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toEntryKey({ category, componentKey }) {
  return `${category}/${componentKey}`;
}

function validateEntry(raw, index) {
  const entry = {
    category: normalizeStringField(raw?.category),
    componentKey: normalizeStringField(raw?.componentKey),
    reason: normalizeStringField(raw?.reason),
    expiresOn: normalizeStringField(raw?.expiresOn),
    addedOn: normalizeStringField(raw?.addedOn),
  };

  const errors = [];

  if (!entry.category) errors.push("category is required");
  if (!entry.componentKey) errors.push("componentKey is required");
  if (!entry.reason) errors.push("reason is required");
  if (!entry.expiresOn) {
    errors.push("expiresOn is required");
  } else if (entry.expiresOn !== "permanent" && !isIsoDate(entry.expiresOn)) {
    errors.push('expiresOn must be "permanent" or YYYY-MM-DD');
  }
  if (!entry.addedOn) {
    errors.push("addedOn is required");
  } else if (!isIsoDate(entry.addedOn)) {
    errors.push("addedOn must be YYYY-MM-DD");
  }

  return {
    index,
    entry,
    errors,
  };
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function loadComponentStyleDriftExclusions({ root, styleHints }) {
  const absolutePath = join(root, COMPONENT_STYLE_DRIFT_EXCLUSIONS_PATH);
  if (!existsSync(absolutePath)) {
    return {
      path: COMPONENT_STYLE_DRIFT_EXCLUSIONS_PATH,
      validEntries: [],
      activeEntries: [],
      activeEntryByKey: new Map(),
      invalidEntries: [],
      duplicateEntries: [],
      unknownEntries: [],
      expiredEntries: [],
      malformedFileError: null,
    };
  }

  let payload;
  try {
    payload = readJson(absolutePath);
  } catch (error) {
    return {
      path: COMPONENT_STYLE_DRIFT_EXCLUSIONS_PATH,
      validEntries: [],
      activeEntries: [],
      activeEntryByKey: new Map(),
      invalidEntries: [],
      duplicateEntries: [],
      unknownEntries: [],
      expiredEntries: [],
      malformedFileError: `failed to parse JSON (${error.message})`,
    };
  }

  if (!Array.isArray(payload?.entries)) {
    return {
      path: COMPONENT_STYLE_DRIFT_EXCLUSIONS_PATH,
      validEntries: [],
      activeEntries: [],
      activeEntryByKey: new Map(),
      invalidEntries: [],
      duplicateEntries: [],
      unknownEntries: [],
      expiredEntries: [],
      malformedFileError: 'expected top-level object shape: { "entries": [] }',
    };
  }

  const invalidEntries = [];
  const duplicateEntries = [];
  const unknownEntries = [];
  const expiredEntries = [];
  const validEntries = [];
  const seenKeys = new Set();
  const today = getTodayIso();

  for (const validation of payload.entries.map((entry, index) => validateEntry(entry, index))) {
    if (validation.errors.length > 0) {
      invalidEntries.push(validation);
      continue;
    }

    const entryKey = toEntryKey(validation.entry);
    if (seenKeys.has(entryKey)) {
      duplicateEntries.push({
        ...validation,
        key: entryKey,
      });
      continue;
    }
    seenKeys.add(entryKey);

    const hasCategory = Boolean(styleHints?.[validation.entry.category]);
    const hasComponent = Boolean(
      styleHints?.[validation.entry.category]?.[validation.entry.componentKey]
    );
    if (!hasCategory || !hasComponent) {
      unknownEntries.push({
        ...validation,
        key: entryKey,
      });
      continue;
    }

    if (validation.entry.expiresOn !== "permanent" && validation.entry.expiresOn < today) {
      expiredEntries.push({
        ...validation,
        key: entryKey,
      });
      continue;
    }

    validEntries.push({
      ...validation,
      key: entryKey,
    });
  }

  const activeEntryByKey = new Map(validEntries.map((item) => [item.key, item]));

  return {
    path: COMPONENT_STYLE_DRIFT_EXCLUSIONS_PATH,
    validEntries,
    activeEntries: validEntries,
    activeEntryByKey,
    invalidEntries,
    duplicateEntries,
    unknownEntries,
    expiredEntries,
    malformedFileError: null,
  };
}
