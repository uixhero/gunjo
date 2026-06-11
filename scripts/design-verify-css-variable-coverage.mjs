#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const TAILWIND_THEME_EXTEND_PATH = "tailwind-theme-extend.cjs";
const SOURCE_GLOBALS_PATH = "src/globals.css";

const REQUIRED_DARK_VARS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary-subtle",
  "--primary-subtle-foreground",
  "--primary",
  "--primary-foreground",
  "--primary-strong",
  "--primary-strong-foreground",
  "--primary-border",
  "--info-subtle",
  "--info-subtle-foreground",
  "--info",
  "--info-foreground",
  "--info-strong",
  "--info-strong-foreground",
  "--info-border",
  "--success-subtle",
  "--success-subtle-foreground",
  "--success",
  "--success-foreground",
  "--success-strong",
  "--success-strong-foreground",
  "--success-border",
  "--warning-subtle",
  "--warning-subtle-foreground",
  "--warning",
  "--warning-foreground",
  "--warning-strong",
  "--warning-strong-foreground",
  "--warning-border",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive-subtle",
  "--destructive-subtle-foreground",
  "--destructive",
  "--destructive-foreground",
  "--destructive-strong",
  "--destructive-strong-foreground",
  "--destructive-border",
  "--border",
  "--input",
  "--ring",
  "--overlay",
  "--palette-red",
  "--palette-green",
  "--palette-blue",
  "--palette-yellow",
  "--palette-cyan",
  "--palette-magenta",
  "--palette-gray",
  "--palette-white",
  "--palette-black",
  "--shadow-sm",
  "--shadow",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
  "--shadow-2xl",
  "--shadow-inner",
  "--shadow-none",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

const EXTERNAL_CSS_VAR_PREFIXES = ["--radix-"];

function isDesignTokenVar(cssVar) {
  return !EXTERNAL_CSS_VAR_PREFIXES.some((prefix) => cssVar.startsWith(prefix));
}

function extractReferencedCssVars(tailwindConfig) {
  return uniqueSorted(
    [...tailwindConfig.matchAll(/\bvar\(\s*(--[a-z0-9-]+)\s*\)/g)]
      .map((match) => match[1])
      .filter(isDesignTokenVar)
  );
}

function extractCssBlock(globalsCss, selector) {
  const pattern = new RegExp(
    `${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`,
    "m"
  );
  return pattern.exec(globalsCss)?.[1] ?? "";
}

function extractDefinedCssVars(blockContent) {
  return new Set(
    [...blockContent.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1])
  );
}

function buildMissingMessages(requiredVars, definedVars, contextLabel, filePath) {
  return requiredVars
    .filter((cssVar) => !definedVars.has(cssVar))
    .map(
      (cssVar) =>
        `- ${filePath} ${contextLabel} should define "${cssVar}" (referenced by tailwind token mapping).`
    );
}

export function verifyCssVariableCoverage({ root = ROOT } = {}) {
  const tailwindThemeExtendPath = join(root, TAILWIND_THEME_EXTEND_PATH);
  const sourceGlobalsPath = join(root, SOURCE_GLOBALS_PATH);

  const tailwindThemeExtend = readFileSync(tailwindThemeExtendPath, "utf-8");
  const sourceGlobals = readFileSync(sourceGlobalsPath, "utf-8");

  const referencedCssVars = extractReferencedCssVars(tailwindThemeExtend);
  const rootBlock = extractCssBlock(sourceGlobals, ":root");
  const darkBlock = extractCssBlock(sourceGlobals, ".dark");

  const rootDefinedVars = extractDefinedCssVars(rootBlock);
  const darkDefinedVars = extractDefinedCssVars(darkBlock);

  const errors = [
    ...buildMissingMessages(
      referencedCssVars,
      rootDefinedVars,
      "(:root)",
      SOURCE_GLOBALS_PATH
    ),
    ...buildMissingMessages(
      REQUIRED_DARK_VARS,
      darkDefinedVars,
      "(.dark)",
      SOURCE_GLOBALS_PATH
    ),
  ];

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: css variable coverage drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-css-variable-coverage.mjs",
  verify: verifyCssVariableCoverage,
  successMessage: "design:verify: css variable coverage passed",
});
