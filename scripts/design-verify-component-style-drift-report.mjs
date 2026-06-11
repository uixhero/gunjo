#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readText } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";
import { readGeneratedConstObject } from "./design-verify-generated-const-object.mjs";
import { loadComponentStyleDriftExclusions } from "./design-verify-component-style-drift-exclusions.mjs";
import {
  loadComponentStyleDriftStrictTargets,
  parseStrictTargetCli,
} from "./design-verify-component-style-drift-targets.mjs";

const MANIFEST_PATH = "src/components/generated/component-manifest.ts";
const STYLE_HINTS_PATH = "src/components/generated/component-style-hints.ts";
const STRICT_FLAG = "--strict";
const CATEGORY_FLAG = "--category";
const CATEGORIES_FLAG = "--categories";
const MAX_COMPONENT_LINES = 24;
const MAX_VARIANT_LINES = 2;
const MAX_MISSING_TOKENS = 8;
const STYLE_SOURCE_FILE_OVERRIDES = {
  "inputs/button": "src/components/inputs/ButtonVariants.ts",
};

const STRUCTURAL_TOKEN_PATTERNS = [
  /^inline-flex$/,
  /^flex$/,
  /^flex-(row|col)$/,
  /^items-/,
  /^justify-/,
  /^w-/,
  /^h-/,
  /^p[trblxy]?-/,
  /^gap-/,
  /^rounded/,
  /^border(?:$|-)/,
  /^text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|\[[^\]]+\])$/,
  /^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  /^underline$/,
  /^bg-transparent$/,
  /^cursor-/,
];

function sortedKeys(value) {
  return Object.keys(value ?? {}).sort((a, b) => a.localeCompare(b));
}

function parseCategoryArgs({ argv = process.argv.slice(2) } = {}) {
  const categories = [];

  const pushCategories = (value) => {
    for (const category of String(value).split(",")) {
      const trimmed = category.trim();
      if (trimmed.length > 0) categories.push(trimmed);
    }
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg.startsWith(`${CATEGORY_FLAG}=`)) {
      pushCategories(arg.slice(`${CATEGORY_FLAG}=`.length));
      continue;
    }
    if (arg.startsWith(`${CATEGORIES_FLAG}=`)) {
      pushCategories(arg.slice(`${CATEGORIES_FLAG}=`.length));
      continue;
    }
    if (arg === CATEGORY_FLAG || arg === CATEGORIES_FLAG) {
      const value = argv[index + 1];
      if (typeof value === "string" && !value.startsWith("--")) {
        pushCategories(value);
        index += 1;
      }
    }
  }

  if (categories.length === 0) return null;
  return [...new Set(categories)];
}

function resolveCategoryScope({ styleHints, categories }) {
  const availableCategories = sortedKeys(styleHints);
  if (!Array.isArray(categories) || categories.length === 0) {
    return {
      categoryScope: new Set(availableCategories),
      unknownCategories: [],
    };
  }

  const unknownCategories = categories.filter(
    (category) => !availableCategories.includes(category)
  );
  const categoryScope = new Set(
    categories.filter((category) => availableCategories.includes(category))
  );
  return { categoryScope, unknownCategories };
}

function uniqueOrdered(values) {
  return [...new Set(values)];
}

function tokenizeClasses(value) {
  if (typeof value !== "string") return [];
  return value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function isStructuralToken(token) {
  return STRUCTURAL_TOKEN_PATTERNS.some((pattern) => pattern.test(token));
}

function extractStructuralTokens(value) {
  return uniqueOrdered(tokenizeClasses(value).filter(isStructuralToken));
}

function findMissingTokens(tokens, source) {
  return tokens.filter((token) => !source.includes(token));
}

function toIssueKey({ category, componentKey }) {
  return `${category}/${componentKey}`;
}

function resolveStyleSourceFile({ category, componentKey, sourceFile }) {
  return STYLE_SOURCE_FILE_OVERRIDES[toIssueKey({ category, componentKey })] ?? sourceFile;
}

function readArtifacts(root) {
  return {
    manifest: readGeneratedConstObject({
      root,
      filePath: MANIFEST_PATH,
      exportName: "componentManifest",
    }),
    styleHints: readGeneratedConstObject({
      root,
      filePath: STYLE_HINTS_PATH,
      exportName: "componentStyleHints",
    }),
  };
}

function createVariantIssue({ label, missingTokens, expectedCount }) {
  return {
    label,
    expectedCount,
    missingTokens,
    missingCount: missingTokens.length,
  };
}

function collectComponentIssues({ category, componentKey, sourceFile, hint, source }) {
  const variantIssues = [];
  const variantClasses = hint?.variantClasses ?? {};

  for (const variantKey of sortedKeys(variantClasses)) {
    const tokens = extractStructuralTokens(variantClasses[variantKey]);
    if (tokens.length === 0) continue;
    const missingTokens = findMissingTokens(tokens, source);
    if (missingTokens.length === 0) continue;
    variantIssues.push(
      createVariantIssue({
        label: variantKey,
        missingTokens,
        expectedCount: tokens.length,
      })
    );
  }

  const baseTokens = extractStructuralTokens(hint?.baseClasses ?? "");
  const baseMissingTokens = findMissingTokens(baseTokens, source);
  if (baseMissingTokens.length > 0) {
    variantIssues.push(
      createVariantIssue({
        label: "base",
        missingTokens: baseMissingTokens,
        expectedCount: baseTokens.length,
      })
    );
  }

  if (variantIssues.length === 0) return null;

  const missingCount = variantIssues.reduce((total, item) => total + item.missingCount, 0);
  const expectedCount = variantIssues.reduce((total, item) => total + item.expectedCount, 0);

  return {
    category,
    componentKey,
    sourceFile,
    missingCount,
    expectedCount,
    variantIssues: variantIssues.sort((a, b) => b.missingCount - a.missingCount),
  };
}

function collectDriftReport({ root, manifest, styleHints, categoryScope }) {
  const componentIssues = [];
  const missingManifestEntries = [];
  const missingSourceFiles = [];

  for (const category of sortedKeys(styleHints)) {
    if (categoryScope && !categoryScope.has(category)) continue;
    for (const componentKey of sortedKeys(styleHints[category])) {
      const manifestEntry = manifest?.[category]?.[componentKey];
      if (!manifestEntry?.sourceFile) {
        missingManifestEntries.push({ category, componentKey });
        continue;
      }

      const sourceFile = manifestEntry.sourceFile;
      const styleSourceFile = resolveStyleSourceFile({ category, componentKey, sourceFile });
      const sourcePath = join(root, styleSourceFile);
      if (!existsSync(sourcePath)) {
        missingSourceFiles.push({ category, componentKey, sourceFile: styleSourceFile });
        continue;
      }

      const source = readText(sourcePath);
      const componentIssue = collectComponentIssues({
        category,
        componentKey,
        sourceFile: styleSourceFile,
        hint: styleHints[category][componentKey],
        source,
      });
      if (!componentIssue) continue;
      componentIssues.push(componentIssue);
    }
  }

  componentIssues.sort((a, b) => b.missingCount - a.missingCount);
  return { componentIssues, missingManifestEntries, missingSourceFiles };
}

function applyExclusions({ componentIssues, exclusions }) {
  const filteredIssues = [];
  const excludedIssues = [];

  for (const issue of componentIssues) {
    if (!exclusions.activeEntryByKey.has(toIssueKey(issue))) {
      filteredIssues.push(issue);
      continue;
    }
    excludedIssues.push(issue);
  }

  const appliedKeySet = new Set(excludedIssues.map((issue) => toIssueKey(issue)));
  const unusedExclusions = exclusions.activeEntries.filter(
    (entry) => !appliedKeySet.has(entry.key)
  );

  return {
    filteredIssues,
    excludedIssues,
    unusedExclusions,
  };
}

function hasExclusionPolicyProblems(exclusions) {
  return Boolean(
    exclusions.malformedFileError ||
      exclusions.invalidEntries.length > 0 ||
      exclusions.duplicateEntries.length > 0 ||
      exclusions.unknownEntries.length > 0 ||
      exclusions.expiredEntries.length > 0
  );
}

function mergeSets(...sets) {
  return new Set(sets.flatMap((set) => [...set]));
}

function splitIssueKey(value) {
  const parts = value.split("/");
  if (parts.length !== 2) return null;
  const [category, componentKey] = parts;
  if (!category || !componentKey) return null;
  return { category, componentKey };
}

function validateCliStrictTargets({ styleHints, cliTargets }) {
  const categoryTargets = new Set();
  const componentTargets = new Set();
  const problems = [];

  for (const category of cliTargets.categories) {
    if (!styleHints?.[category]) {
      problems.push(`unknown CLI strict target category: ${category}`);
      continue;
    }
    categoryTargets.add(category);
  }

  for (const value of cliTargets.components) {
    const parsed = splitIssueKey(value);
    if (!parsed) {
      problems.push(
        `invalid CLI strict target component format: ${value} (expected category/componentKey)`
      );
      continue;
    }

    if (!styleHints?.[parsed.category]?.[parsed.componentKey]) {
      problems.push(`unknown CLI strict target component: ${value}`);
      continue;
    }
    componentTargets.add(value);
  }

  return {
    categoryTargets,
    componentTargets,
    problems,
  };
}

function issueInStrictScope(issue, strictScope) {
  if (!strictScope.hasTargetScope) return true;
  return (
    strictScope.componentTargets.has(toIssueKey(issue)) ||
    strictScope.categoryTargets.has(issue.category)
  );
}

function applyStrictTargetScope({ componentIssues, strictScope }) {
  if (!strictScope.hasTargetScope) {
    return {
      enforcedComponentIssues: componentIssues,
      outOfScopeComponentIssues: [],
    };
  }

  const enforcedComponentIssues = [];
  const outOfScopeComponentIssues = [];

  for (const issue of componentIssues) {
    if (issueInStrictScope(issue, strictScope)) {
      enforcedComponentIssues.push(issue);
      continue;
    }
    outOfScopeComponentIssues.push(issue);
  }

  return {
    enforcedComponentIssues,
    outOfScopeComponentIssues,
  };
}

function summarizeComponentIssuesByCategory(componentIssues) {
  const countsByCategory = new Map();
  for (const issue of componentIssues) {
    countsByCategory.set(issue.category, (countsByCategory.get(issue.category) ?? 0) + 1);
  }
  return Object.fromEntries(
    [...countsByCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  );
}

function formatDriftReportLines({
  allComponentIssues,
  enforcedComponentIssues,
  outOfScopeComponentIssues,
  excludedIssues,
  unusedExclusions,
  missingManifestEntries,
  missingSourceFiles,
  exclusions,
  strictScope,
  allAvailableCategories,
  categoryScope,
  strictTargetSource,
  strictTargetProblems,
  strict,
}) {
  const totalVariantIssues = allComponentIssues.reduce(
    (total, component) => total + component.variantIssues.length,
    0
  );
  const enforcedVariantIssues = enforcedComponentIssues.reduce(
    (total, component) => total + component.variantIssues.length,
    0
  );
  const hasStrictScope = strictScope.hasTargetScope;
  const strictScopeLabel = strict ? (hasStrictScope ? "scoped" : "all") : "n/a";
  const topDriftIssues = strict ? enforcedComponentIssues : allComponentIssues;
  const categoryScopeLabel =
    categoryScope.size === allAvailableCategories.length
      ? "all"
      : [...categoryScope].sort((a, b) => a.localeCompare(b)).join(", ");

  const lines = [
    "design:verify: component style drift report",
    `- strict mode: ${strict ? "on" : "off"}`,
    `- category scope: ${categoryScopeLabel}`,
    `- strict scope: ${strictScopeLabel}`,
    `- strict target source: ${strictTargetSource}`,
    `- strict target categories: ${strictScope.categoryTargets.size}`,
    `- strict target components: ${strictScope.componentTargets.size}`,
    `- strict target policy problems: ${strictTargetProblems.length}`,
    `- components with drift (after exclusions): ${allComponentIssues.length}`,
    `- variants/base entries with drift (after exclusions): ${totalVariantIssues}`,
    `- strict scope drift components: ${enforcedComponentIssues.length}`,
    `- strict scope variants/base entries with drift: ${enforcedVariantIssues}`,
    `- out-of-scope drift components: ${outOfScopeComponentIssues.length}`,
    `- excluded components: ${excludedIssues.length}`,
    `- configured exclusions: ${exclusions.activeEntries.length} (${exclusions.path})`,
    `- unused exclusions: ${unusedExclusions.length}`,
    `- expired exclusions: ${exclusions.expiredEntries.length}`,
    `- invalid exclusions: ${exclusions.invalidEntries.length}`,
    `- duplicate exclusions: ${exclusions.duplicateEntries.length}`,
    `- unknown exclusions: ${exclusions.unknownEntries.length}`,
    `- missing manifest entries: ${missingManifestEntries.length}`,
    `- missing source files: ${missingSourceFiles.length}`,
  ];

  if (strictTargetProblems.length > 0) {
    lines.push("Strict target policy issues:");
    for (const problem of strictTargetProblems) {
      lines.push(`- ${problem}`);
    }
  }

  if (exclusions.malformedFileError) {
    lines.push(`Exclusion policy file error: ${exclusions.malformedFileError}`);
  }

  if (exclusions.invalidEntries.length > 0) {
    lines.push("Invalid exclusions:");
    for (const item of exclusions.invalidEntries) {
      lines.push(`- #${item.index + 1}: ${item.errors.join(", ")}`);
    }
  }

  if (exclusions.duplicateEntries.length > 0) {
    lines.push("Duplicate exclusions:");
    for (const item of exclusions.duplicateEntries) {
      lines.push(`- #${item.index + 1}: ${item.key}`);
    }
  }

  if (exclusions.unknownEntries.length > 0) {
    lines.push("Unknown exclusions:");
    for (const item of exclusions.unknownEntries) {
      lines.push(`- #${item.index + 1}: ${item.key}`);
    }
  }

  if (exclusions.expiredEntries.length > 0) {
    lines.push("Expired exclusions:");
    for (const item of exclusions.expiredEntries) {
      lines.push(
        `- #${item.index + 1}: ${item.key} expired on ${item.entry.expiresOn} (${item.entry.reason})`
      );
    }
  }

  if (unusedExclusions.length > 0) {
    lines.push("Unused active exclusions:");
    for (const item of unusedExclusions) {
      lines.push(`- #${item.index + 1}: ${item.key} (${item.entry.reason})`);
    }
  }

  if (missingManifestEntries.length > 0) {
    lines.push("Missing manifest entries:");
    for (const item of missingManifestEntries) {
      lines.push(`- [${item.category}] ${item.componentKey}`);
    }
  }

  if (missingSourceFiles.length > 0) {
    lines.push("Missing source files:");
    for (const item of missingSourceFiles) {
      lines.push(`- [${item.category}] ${item.componentKey}: ${item.sourceFile}`);
    }
  }

  if (topDriftIssues.length > 0) {
    lines.push("Top drift components:");
    const targetComponents = topDriftIssues.slice(0, MAX_COMPONENT_LINES);
    for (const component of targetComponents) {
      lines.push(
        `- [${component.category}] ${component.componentKey}: ${component.missingCount}/${component.expectedCount} hints missing (${component.sourceFile})`
      );
      const variantLines = component.variantIssues.slice(0, MAX_VARIANT_LINES);
      for (const variant of variantLines) {
        const tokenPreview = variant.missingTokens.slice(0, MAX_MISSING_TOKENS).join(", ");
        const hasMore = variant.missingTokens.length > MAX_MISSING_TOKENS;
        lines.push(
          `  ${variant.label}: ${variant.missingCount}/${variant.expectedCount} missing -> ${tokenPreview}${hasMore ? ", ..." : ""}`
        );
      }
    }
    if (topDriftIssues.length > targetComponents.length) {
      lines.push(
        `... ${topDriftIssues.length - targetComponents.length} more components omitted`
      );
    }
  }

  if (!strict) {
    lines.push(
      "Run `npm run design:verify:component-style-drift` to enforce this report in strict mode."
    );
  }

  return lines;
}

export function verifyComponentStyleDriftReport({
  root = ROOT,
  argv = process.argv.slice(2),
  strict = null,
  silent = false,
} = {}) {
  const strictMode = typeof strict === "boolean" ? strict : argv.includes(STRICT_FLAG);
  const cliTargets = parseStrictTargetCli({ argv });
  const { manifest, styleHints } = readArtifacts(root);
  const allAvailableCategories = sortedKeys(styleHints);
  const { categoryScope, unknownCategories } = resolveCategoryScope({
    styleHints,
    categories: parseCategoryArgs({ argv }),
  });
  if (unknownCategories.length > 0) {
    throwLinesError([
      "design:verify: component style drift report: unknown category scope.",
      `Known categories: ${allAvailableCategories.join(", ")}`,
      ...unknownCategories.map((category) => `- ${category}`),
    ]);
  }
  const cliTargetValidation = validateCliStrictTargets({ styleHints, cliTargets });
  const strictPolicyTargets = loadComponentStyleDriftStrictTargets({
    root,
    styleHints,
    enabled: cliTargets.usePolicy,
  });
  const strictScope = {
    categoryTargets: mergeSets(
      strictPolicyTargets.categoryTargets,
      cliTargetValidation.categoryTargets
    ),
    componentTargets: mergeSets(
      strictPolicyTargets.componentTargets,
      cliTargetValidation.componentTargets
    ),
  };
  strictScope.hasTargetScope =
    strictScope.categoryTargets.size > 0 || strictScope.componentTargets.size > 0;
  const strictTargetSource = [
    ...(cliTargets.usePolicy ? [`policy(${strictPolicyTargets.path})`] : []),
    ...(cliTargetValidation.categoryTargets.size > 0 || cliTargetValidation.componentTargets.size > 0
      ? ["cli"]
      : []),
  ].join(" + ") || "none";
  const strictTargetProblems = [
    ...strictPolicyTargets.problems,
    ...cliTargetValidation.problems,
  ];
  if (strictMode && cliTargets.usePolicy && !strictScope.hasTargetScope) {
    strictTargetProblems.push(
      `strict target policy is enabled but no valid targets are configured in ${strictPolicyTargets.path}`
    );
  }

  const exclusions = loadComponentStyleDriftExclusions({ root, styleHints });
  const { componentIssues, missingManifestEntries, missingSourceFiles } = collectDriftReport({
    root,
    manifest,
    styleHints,
    categoryScope,
  });
  const { filteredIssues, excludedIssues, unusedExclusions } = applyExclusions({
    componentIssues,
    exclusions,
  });
  const { enforcedComponentIssues, outOfScopeComponentIssues } = applyStrictTargetScope({
    componentIssues: filteredIssues,
    strictScope,
  });
  const hasPolicyProblems = hasExclusionPolicyProblems(exclusions);
  const hasStrictTargetProblems = strictTargetProblems.length > 0;
  const scopeCategories = [...categoryScope].sort((a, b) => a.localeCompare(b));
  const summary = {
    strict: strictMode,
    scopeCategories,
    counts: {
      componentsWithDrift: filteredIssues.length,
      strictScopeComponentsWithDrift: enforcedComponentIssues.length,
      outOfScopeComponentsWithDrift: outOfScopeComponentIssues.length,
      missingManifestEntries: missingManifestEntries.length,
      missingSourceFiles: missingSourceFiles.length,
      excludedComponents: excludedIssues.length,
      unusedExclusions: unusedExclusions.length,
      strictTargetProblems: strictTargetProblems.length,
      hasPolicyProblems,
    },
    driftByCategory: summarizeComponentIssuesByCategory(filteredIssues),
  };

  if (
    filteredIssues.length === 0 &&
    enforcedComponentIssues.length === 0 &&
    missingManifestEntries.length === 0 &&
    missingSourceFiles.length === 0 &&
    !hasPolicyProblems &&
    !hasStrictTargetProblems
  ) {
    const scopeLabel =
      categoryScope.size === allAvailableCategories.length
        ? "all"
        : [...categoryScope].sort((a, b) => a.localeCompare(b)).join(", ");
    if (!silent) {
      console.log(
        `design:verify: component style drift report: no structural drift detected (scope: ${scopeLabel})`
      );
    }
    return summary;
  }

  const lines = formatDriftReportLines({
    allComponentIssues: filteredIssues,
    enforcedComponentIssues,
    outOfScopeComponentIssues,
    excludedIssues,
    unusedExclusions,
    missingManifestEntries,
    missingSourceFiles,
    exclusions,
    strictScope,
    allAvailableCategories,
    categoryScope,
    strictTargetSource,
    strictTargetProblems,
    strict: strictMode,
  });

  if (
    strictMode &&
    (enforcedComponentIssues.length > 0 ||
      missingManifestEntries.length > 0 ||
      missingSourceFiles.length > 0 ||
      hasPolicyProblems ||
      hasStrictTargetProblems)
  ) {
    throwLinesError(lines);
  }

  if (!silent) {
    console.warn(lines.join("\n"));
  }
  return {
    ...summary,
    lines,
  };
}

runVerificationCli({
  scriptName: "design-verify-component-style-drift-report.mjs",
  verify: verifyComponentStyleDriftReport,
  successMessage: "design:verify: component style drift report generated",
});
