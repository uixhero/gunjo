#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const TAILWIND_THEME_EXTEND_PATH = "tailwind-theme-extend.cjs";

const REQUIRED_BORDER_RADIUS = [
  { key: "lg", value: "var(--radius)" },
  { key: "md", value: "calc(var(--radius) - 2px)" },
  { key: "sm", value: "calc(var(--radius) - 4px)" },
];

const REQUIRED_BOX_SHADOW = [
  { key: "sm", value: "var(--shadow-sm)" },
  { key: "DEFAULT", value: "var(--shadow)" },
  { key: "md", value: "var(--shadow-md)" },
  { key: "lg", value: "var(--shadow-lg)" },
  { key: "xl", value: "var(--shadow-xl)" },
  { key: "2xl", value: "var(--shadow-2xl)" },
  { key: "inner", value: "var(--shadow-inner)" },
  { key: "none", value: "var(--shadow-none)" },
];

const REQUIRED_TRANSITION_DURATIONS = [
  { key: "75", value: "var(--duration-75)" },
  { key: "100", value: "var(--duration-100)" },
  { key: "150", value: "var(--duration-150)" },
  { key: "200", value: "var(--duration-200)" },
  { key: "300", value: "var(--duration-300)" },
  { key: "500", value: "var(--duration-500)" },
  { key: "700", value: "var(--duration-700)" },
  { key: "1000", value: "var(--duration-1000)" },
];

const REQUIRED_TRANSITION_EASINGS = [
  { key: "linear", value: "var(--ease-linear)" },
  { key: "in", value: "var(--ease-in)" },
  { key: "out", value: "var(--ease-out)" },
  { key: "in-out", value: "var(--ease-in-out)" },
];

const REQUIRED_ANIMATIONS = [
  {
    key: "accordion-down",
    value: "accordion-down var(--duration-200) var(--ease-out)",
  },
  {
    key: "accordion-up",
    value: "accordion-up var(--duration-200) var(--ease-out)",
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildKeyPattern(key) {
  const escaped = escapeRegExp(key);
  if (/^\d+$/.test(key)) return `(?:"${escaped}"|'${escaped}'|${escaped})`;
  return `(?:"${escaped}"|'${escaped}'|${escaped})`;
}

function hasNestedMapping(content, sectionKey, itemKey, expectedValue) {
  const pattern = new RegExp(
    `${escapeRegExp(sectionKey)}\\s*:\\s*\\{[\\s\\S]*?${buildKeyPattern(
      itemKey
    )}\\s*:\\s*"${escapeRegExp(expectedValue)}"[\\s\\S]*?\\}`,
    "m"
  );
  return pattern.test(content);
}

function verifyMappingSet({ content, errors, sectionKey, mappings, description }) {
  for (const { key, value } of mappings) {
    if (!hasNestedMapping(content, sectionKey, key, value)) {
      errors.push(
        `- ${TAILWIND_THEME_EXTEND_PATH} ${description} should map "${key}" to "${value}".`
      );
    }
  }
}

export function verifyTailwindFoundationTokens({ root = ROOT } = {}) {
  const tailwindThemeExtendPath = join(root, TAILWIND_THEME_EXTEND_PATH);
  const content = readFileSync(tailwindThemeExtendPath, "utf-8");

  const errors = [];

  verifyMappingSet({
    content,
    errors,
    sectionKey: "borderRadius",
    mappings: REQUIRED_BORDER_RADIUS,
    description: "borderRadius",
  });

  verifyMappingSet({
    content,
    errors,
    sectionKey: "boxShadow",
    mappings: REQUIRED_BOX_SHADOW,
    description: "boxShadow",
  });

  verifyMappingSet({
    content,
    errors,
    sectionKey: "transitionDuration",
    mappings: REQUIRED_TRANSITION_DURATIONS,
    description: "transitionDuration",
  });

  verifyMappingSet({
    content,
    errors,
    sectionKey: "transitionTimingFunction",
    mappings: REQUIRED_TRANSITION_EASINGS,
    description: "transitionTimingFunction",
  });

  verifyMappingSet({
    content,
    errors,
    sectionKey: "animation",
    mappings: REQUIRED_ANIMATIONS,
    description: "animation",
  });

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: tailwind foundation token mapping drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-tailwind-foundation-tokens.mjs",
  verify: verifyTailwindFoundationTokens,
  successMessage: "design:verify: tailwind foundation token mapping passed",
});
