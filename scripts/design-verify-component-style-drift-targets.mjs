import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "./design-sync/shared.mjs";

export const COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH =
  "design/policy/component-style-drift-strict-targets.json";
export const STRICT_TARGET_POLICY_FLAG = "--strict-target-policy";
export const STRICT_CATEGORY_PREFIX = "--strict-category=";
export const STRICT_COMPONENT_PREFIX = "--strict-component=";

function normalizeList(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length > 0);
}

function parseListFlagValues({ argv, prefix }) {
  const values = [];
  for (const arg of argv) {
    if (!arg.startsWith(prefix)) continue;
    const rawValue = arg.slice(prefix.length).trim();
    if (!rawValue) continue;
    values.push(
      ...rawValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }
  return values;
}

function splitTargetKey(value) {
  const parts = value.split("/");
  if (parts.length !== 2) return null;
  const [category, componentKey] = parts;
  if (!category || !componentKey) return null;
  return { category, componentKey };
}

function dedupe(values) {
  return [...new Set(values)];
}

export function parseStrictTargetCli({ argv = process.argv.slice(2) } = {}) {
  return {
    usePolicy: argv.includes(STRICT_TARGET_POLICY_FLAG),
    categories: dedupe(parseListFlagValues({ argv, prefix: STRICT_CATEGORY_PREFIX })),
    components: dedupe(parseListFlagValues({ argv, prefix: STRICT_COMPONENT_PREFIX })),
  };
}

export function loadComponentStyleDriftStrictTargets({
  root,
  styleHints,
  enabled,
} = {}) {
  if (!enabled) {
    return {
      enabled: false,
      path: COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH,
      categoryTargets: new Set(),
      componentTargets: new Set(),
      problems: [],
    };
  }

  const absolutePath = join(root, COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH);
  if (!existsSync(absolutePath)) {
    return {
      enabled: true,
      path: COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH,
      categoryTargets: new Set(),
      componentTargets: new Set(),
      problems: [
        `strict target policy file not found: ${COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH}`,
      ],
    };
  }

  let payload;
  try {
    payload = readJson(absolutePath);
  } catch (error) {
    return {
      enabled: true,
      path: COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH,
      categoryTargets: new Set(),
      componentTargets: new Set(),
      problems: [
        `failed to parse ${COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH}: ${error.message}`,
      ],
    };
  }

  const categories = normalizeList(payload?.categories);
  const components = normalizeList(payload?.components);
  const categoryTargets = new Set();
  const componentTargets = new Set();
  const problems = [];
  const seenCategory = new Set();
  const seenComponent = new Set();

  for (const category of categories) {
    if (seenCategory.has(category)) {
      problems.push(`duplicate strict target category: ${category}`);
      continue;
    }
    seenCategory.add(category);

    if (!styleHints?.[category]) {
      problems.push(`unknown strict target category: ${category}`);
      continue;
    }
    categoryTargets.add(category);
  }

  for (const value of components) {
    if (seenComponent.has(value)) {
      problems.push(`duplicate strict target component: ${value}`);
      continue;
    }
    seenComponent.add(value);

    const parsed = splitTargetKey(value);
    if (!parsed) {
      problems.push(`invalid strict target component format: ${value} (expected category/componentKey)`);
      continue;
    }

    if (!styleHints?.[parsed.category]?.[parsed.componentKey]) {
      problems.push(`unknown strict target component: ${value}`);
      continue;
    }
    componentTargets.add(value);
  }

  return {
    enabled: true,
    path: COMPONENT_STYLE_DRIFT_STRICT_TARGETS_PATH,
    categoryTargets,
    componentTargets,
    problems,
  };
}
