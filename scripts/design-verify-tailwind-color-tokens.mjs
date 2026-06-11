#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const TAILWIND_THEME_EXTEND_PATH = "tailwind-theme-extend.cjs";

const REQUIRED_COLOR_ALIASES = [
  { key: "border", cssVar: "--border" },
  { key: "input", cssVar: "--input" },
  { key: "ring", cssVar: "--ring" },
  { key: "overlay", cssVar: "--overlay" },
  { key: "background", cssVar: "--background" },
  { key: "foreground", cssVar: "--foreground" },
];

const REQUIRED_COLOR_GROUPS = [
  {
    key: "primary",
    defaultVar: "--primary",
    foregroundVar: "--primary-foreground",
    subtleVar: "--primary-subtle",
    subtleForegroundVar: "--primary-subtle-foreground",
    strongVar: "--primary-strong",
    strongForegroundVar: "--primary-strong-foreground",
    borderVar: "--primary-border",
  },
  {
    key: "info",
    defaultVar: "--info",
    foregroundVar: "--info-foreground",
    subtleVar: "--info-subtle",
    subtleForegroundVar: "--info-subtle-foreground",
    strongVar: "--info-strong",
    strongForegroundVar: "--info-strong-foreground",
    borderVar: "--info-border",
  },
  {
    key: "success",
    defaultVar: "--success",
    foregroundVar: "--success-foreground",
    subtleVar: "--success-subtle",
    subtleForegroundVar: "--success-subtle-foreground",
    strongVar: "--success-strong",
    strongForegroundVar: "--success-strong-foreground",
    borderVar: "--success-border",
  },
  {
    key: "warning",
    defaultVar: "--warning",
    foregroundVar: "--warning-foreground",
    subtleVar: "--warning-subtle",
    subtleForegroundVar: "--warning-subtle-foreground",
    strongVar: "--warning-strong",
    strongForegroundVar: "--warning-strong-foreground",
    borderVar: "--warning-border",
  },
  {
    key: "secondary",
    defaultVar: "--secondary",
    foregroundVar: "--secondary-foreground",
  },
  {
    key: "destructive",
    defaultVar: "--destructive",
    foregroundVar: "--destructive-foreground",
    subtleVar: "--destructive-subtle",
    subtleForegroundVar: "--destructive-subtle-foreground",
    strongVar: "--destructive-strong",
    strongForegroundVar: "--destructive-strong-foreground",
    borderVar: "--destructive-border",
  },
  { key: "muted", defaultVar: "--muted", foregroundVar: "--muted-foreground" },
  { key: "accent", defaultVar: "--accent", foregroundVar: "--accent-foreground" },
  { key: "popover", defaultVar: "--popover", foregroundVar: "--popover-foreground" },
  { key: "card", defaultVar: "--card", foregroundVar: "--card-foreground" },
];

const REQUIRED_PALETTE_ENTRIES = [
  { key: "red", cssVar: "--palette-red" },
  { key: "green", cssVar: "--palette-green" },
  { key: "blue", cssVar: "--palette-blue" },
  { key: "yellow", cssVar: "--palette-yellow" },
  { key: "cyan", cssVar: "--palette-cyan" },
  { key: "magenta", cssVar: "--palette-magenta" },
  { key: "gray", cssVar: "--palette-gray" },
  { key: "white", cssVar: "--palette-white" },
  { key: "black", cssVar: "--palette-black" },
];

const TOKEN_COLOR_VALUE_PATTERN =
  /^hsl\(var\(--[a-z0-9-]+\)(?:\s*\/\s*(?:<alpha-value>|[0-9.]+%?))?\)$/;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasColorAlias(content, key, cssVar) {
  const pattern = new RegExp(
    `${escapeRegExp(key)}\\s*:\\s*"hsl\\(var\\(${escapeRegExp(cssVar)}\\)\\)"`
  );
  return pattern.test(content);
}

function hasColorEntry(block, property, cssVar) {
  const pattern = new RegExp(
    `${escapeRegExp(property)}\\s*:\\s*"hsl\\(var\\(${escapeRegExp(cssVar)}\\)\\)"`,
    "m"
  );
  return pattern.test(block);
}

function hasColorGroup(content, group) {
  const block = extractObjectBlock(content, group.key);
  if (!block) return false;

  const requiredEntries = [
    ["DEFAULT", group.defaultVar],
    ["foreground", group.foregroundVar],
    group.subtleVar ? ["subtle", group.subtleVar] : null,
    group.subtleForegroundVar
      ? ['"subtle-foreground"', group.subtleForegroundVar]
      : null,
    group.strongVar ? ["strong", group.strongVar] : null,
    group.strongForegroundVar
      ? ['"strong-foreground"', group.strongForegroundVar]
      : null,
    group.borderVar ? ["border", group.borderVar] : null,
  ].filter(Boolean);

  return requiredEntries.every(([property, cssVar]) =>
    hasColorEntry(block, property, cssVar)
  );
}

function extractObjectBlock(content, objectKey) {
  const startPattern = new RegExp(`${escapeRegExp(objectKey)}\\s*:\\s*\\{`, "m");
  const startMatch = startPattern.exec(content);
  if (!startMatch) return null;

  const openBraceIndex = startMatch.index + startMatch[0].lastIndexOf("{");
  let depth = 0;

  for (let index = openBraceIndex; index < content.length; index += 1) {
    const char = content[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return content.slice(openBraceIndex + 1, index);
      }
    }
  }

  return null;
}

function verifyColorsBlockTokenValues(content, errors) {
  const colorsBlock = extractObjectBlock(content, "colors");
  if (!colorsBlock) {
    errors.push(
      `- ${TAILWIND_THEME_EXTEND_PATH} is missing colors section under theme.extend.`
    );
    return;
  }

  const valueEntries = [...colorsBlock.matchAll(/:\s*"([^"]+)"/g)];
  for (const entry of valueEntries) {
    const value = entry[1];
    if (TOKEN_COLOR_VALUE_PATTERN.test(value)) continue;
    errors.push(
      `- ${TAILWIND_THEME_EXTEND_PATH} colors should use token-based values only. Found "${value}".`
    );
  }
}

export function verifyTailwindColorTokens({ root = ROOT } = {}) {
  const tailwindThemeExtendPath = join(root, TAILWIND_THEME_EXTEND_PATH);
  const content = readFileSync(tailwindThemeExtendPath, "utf-8");

  const errors = [];

  for (const { key, cssVar } of REQUIRED_COLOR_ALIASES) {
    if (!hasColorAlias(content, key, cssVar)) {
      errors.push(
        `- ${TAILWIND_THEME_EXTEND_PATH} should map "${key}" to "hsl(var(${cssVar}))".`
      );
    }
  }

  for (const group of REQUIRED_COLOR_GROUPS) {
    if (!hasColorGroup(content, group)) {
      errors.push(
        `- ${TAILWIND_THEME_EXTEND_PATH} should define "${group.key}" group with the required semantic token entries.`
      );
    }
  }

  const paletteBlock = extractObjectBlock(content, "palette");
  if (!paletteBlock) {
    errors.push(
      `- ${TAILWIND_THEME_EXTEND_PATH} should define "palette" group for editor/content color choices.`
    );
  } else {
    for (const { key, cssVar } of REQUIRED_PALETTE_ENTRIES) {
      if (!hasColorEntry(paletteBlock, key, cssVar)) {
        errors.push(
          `- ${TAILWIND_THEME_EXTEND_PATH} should map "palette.${key}" to "hsl(var(${cssVar}))".`
        );
      }
    }
  }

  verifyColorsBlockTokenValues(content, errors);

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: tailwind color token mapping drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-tailwind-color-tokens.mjs",
  verify: verifyTailwindColorTokens,
  successMessage: "design:verify: tailwind color token mapping passed",
});
