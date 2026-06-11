#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import { throwLinesError, runVerificationCli } from "./design-verify-assertions.mjs";
import { readGeneratedConstObject } from "./design-verify-generated-const-object.mjs";

const MANIFEST_PATH = "src/components/generated/component-manifest.ts";
const STYLE_HINTS_PATH = "src/components/generated/component-style-hints.ts";

function sortedKeys(value) {
  return Object.keys(value ?? {}).sort((a, b) => a.localeCompare(b));
}

function sameStringArray(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

function sameKeySet(left, right) {
  const leftKeys = sortedKeys(left);
  const rightKeys = sortedKeys(right);
  return sameStringArray(leftKeys, rightKeys);
}

function readGeneratedArtifacts(root) {
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

export function verifyComponentStyleHintsCoverage({ root = ROOT } = {}) {
  const { manifest, styleHints } = readGeneratedArtifacts(root);
  const errors = [];

  if (!sameKeySet(manifest, styleHints)) {
    errors.push(
      `Category mismatch between generated files (${MANIFEST_PATH} vs ${STYLE_HINTS_PATH})`
    );
  }

  for (const category of sortedKeys(manifest)) {
    const manifestCategory = manifest[category] ?? {};
    const hintsCategory = styleHints[category];

    if (!hintsCategory || typeof hintsCategory !== "object") {
      errors.push(`[${category}] missing style hints category object`);
      continue;
    }

    if (!sameKeySet(manifestCategory, hintsCategory)) {
      errors.push(`[${category}] component key mismatch between manifest and style hints`);
    }

    for (const componentKey of sortedKeys(manifestCategory)) {
      const manifestComponent = manifestCategory[componentKey];
      const hint = hintsCategory[componentKey];

      if (!hint || typeof hint !== "object") {
        errors.push(`[${category}] ${componentKey}: missing style hint entry`);
        continue;
      }

      const expectedVariantKeys = manifestComponent?.variantKeys ?? [];
      const actualVariantKeys = hint?.variantKeys ?? [];
      if (!sameStringArray(expectedVariantKeys, actualVariantKeys)) {
        errors.push(
          `[${category}] ${componentKey}: variantKeys mismatch (${JSON.stringify(expectedVariantKeys)} vs ${JSON.stringify(actualVariantKeys)})`
        );
      }

      if ((manifestComponent?.defaultVariantKey ?? null) !== (hint?.defaultVariantKey ?? null)) {
        errors.push(
          `[${category}] ${componentKey}: defaultVariantKey mismatch (${JSON.stringify(manifestComponent?.defaultVariantKey ?? null)} vs ${JSON.stringify(hint?.defaultVariantKey ?? null)})`
        );
      }

      if (typeof hint?.baseClasses !== "string") {
        errors.push(`[${category}] ${componentKey}: baseClasses should be a string`);
      }

      if (!Array.isArray(hint?.slotIds)) {
        errors.push(`[${category}] ${componentKey}: slotIds should be an array`);
      }

      if (!hint?.variantClasses || typeof hint.variantClasses !== "object") {
        errors.push(`[${category}] ${componentKey}: variantClasses should be an object`);
      } else {
        const variantClassKeys = sortedKeys(hint.variantClasses);
        const expectedKeys = [...expectedVariantKeys].sort((a, b) => a.localeCompare(b));
        if (!sameStringArray(variantClassKeys, expectedKeys)) {
          errors.push(
            `[${category}] ${componentKey}: variantClasses keys mismatch (${JSON.stringify(expectedKeys)} vs ${JSON.stringify(variantClassKeys)})`
          );
        }

        for (const variantKey of variantClassKeys) {
          if (typeof hint.variantClasses[variantKey] !== "string") {
            errors.push(
              `[${category}] ${componentKey}: variantClasses.${variantKey} should be a string`
            );
          }
        }
      }

      if (!hint?.variantColorHints || typeof hint.variantColorHints !== "object") {
        errors.push(`[${category}] ${componentKey}: variantColorHints should be an object`);
      } else {
        const invalidColorHintKeys = sortedKeys(hint.variantColorHints).filter(
          (variantKey) => !expectedVariantKeys.includes(variantKey)
        );
        for (const variantKey of invalidColorHintKeys) {
          errors.push(
            `[${category}] ${componentKey}: variantColorHints has unknown key "${variantKey}"`
          );
        }
      }
    }
  }

  if (errors.length === 0) return;

  const lines = [
    "design:verify: generated component style hints coverage mismatch detected.",
    ...errors.map((error) => `- ${error}`),
    "Run `npm run design:sync:components` and commit updated generated files.",
  ];
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-component-style-hints-coverage.mjs",
  verify: verifyComponentStyleHintsCoverage,
  successMessage: "design:verify: component style hints coverage check passed",
});
