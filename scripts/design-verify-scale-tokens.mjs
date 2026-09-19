#!/usr/bin/env node

import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import {
  CANVAS_TEXT_STEPS,
  DENSITY_TOKENS,
  FONT_STACKS,
  LEADING_STEPS,
  SPACING_BASE_REM,
  SPACING_STEPS,
  TEXT_STEPS,
  WEIGHT_STEPS,
  scaleTokenNames,
  spacingValue,
  textValue,
} from "./design-sync/token-scales.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

// GunjoUI does not override Tailwind's spacing or type scale, so the scale
// public/tokens.css publishes has to stay equal to Tailwind's own. This check
// reads the installed `tailwindcss/theme.css` and compares every step, which is
// what makes the standalone sheet a derivative rather than a second copy: if a
// Tailwind upgrade moves a value, CI fails here instead of the sheet quietly
// describing a scale the package no longer uses. (#969)
//
// It also guards the direction that is easy to get wrong by hand: the sheet
// must not be the place where a *different* scale gets invented.

const TOKENS_CSS_PATH = "public/tokens.css";
const SOURCE_GLOBALS_PATH = "src/globals.css";

/**
 * Tailwind-owned custom properties. Defining these in src/globals.css would put
 * them in the `base` layer, which outranks Tailwind's `theme` layer, silently
 * re-pointing every utility in every consumer — see token-scales.mjs.
 */
const TAILWIND_OWNED_PREFIXES = ["--text-", "--leading-", "--font-weight-", "--font-sans", "--font-mono"];

function readTailwindTheme() {
  const require = createRequire(import.meta.url);
  let themePath;
  try {
    themePath = require.resolve("tailwindcss/theme.css");
  } catch {
    throwLinesError([
      "design:verify: scale tokens: could not resolve `tailwindcss/theme.css`.",
      "This check compares the published scale against Tailwind's own theme, so it needs",
      "tailwindcss v4 installed. Run `npm ci` (the repo pins tailwindcss ^4).",
    ]);
  }
  return readFileSync(themePath, "utf-8");
}

/**
 * Read one declaration out of Tailwind's theme sheet. Values may wrap across
 * lines (the font stacks do), so this reads to the terminating semicolon.
 */
function themeValue(themeCss, name) {
  const pattern = new RegExp(`(?:^|\\n)\\s*${name.replace(/[-]/g, "\\-")}\\s*:\\s*([^;]+);`);
  const match = pattern.exec(themeCss);
  return match ? match[1] : null;
}

/** Whitespace and quote style differ between the sheets; the stack does not. */
function normalizeFontStack(value) {
  return value.replace(/'/g, '"').replace(/\s+/g, " ").trim();
}

function normalizeNumeric(value) {
  return value.replace(/\s+/g, " ").trim();
}

function checkSpacing(themeCss, errors) {
  const base = themeValue(themeCss, "--spacing");
  if (base === null) {
    errors.push("- tailwindcss/theme.css does not define `--spacing` (unexpected for v4).");
    return;
  }
  const baseRem = Number.parseFloat(normalizeNumeric(base));
  if (!Number.isFinite(baseRem) || !normalizeNumeric(base).endsWith("rem")) {
    errors.push(`- tailwindcss/theme.css \`--spacing\` is "${base}", which this check cannot read as rem.`);
    return;
  }
  if (baseRem !== SPACING_BASE_REM) {
    errors.push(
      `- SPACING_BASE_REM is ${SPACING_BASE_REM} but Tailwind's \`--spacing\` is ${baseRem}rem. Update token-scales.mjs and re-run design:sync.`
    );
    return;
  }
  for (const entry of SPACING_STEPS) {
    if (entry.literal) continue;
    const expected = entry.multiplier === 0 ? "0px" : `${Math.round(entry.multiplier * baseRem * 1e6) / 1e6}rem`;
    const actual = spacingValue(entry);
    if (actual !== expected) {
      errors.push(
        `- ${entry.name} ships "${actual}" but step ${entry.step} of Tailwind's spacing scale is "${expected}" (calc(var(--spacing) * ${entry.multiplier})).`
      );
    }
  }
}

function checkAgainstTheme(themeCss, errors, entries, valueOf, label) {
  for (const entry of entries) {
    const tailwindName = entry.tailwind === undefined ? entry.name : entry.tailwind;
    if (tailwindName === null) continue;
    const upstream = themeValue(themeCss, tailwindName);
    if (upstream === null) {
      errors.push(`- tailwindcss/theme.css does not define \`${tailwindName}\` (${label}).`);
      continue;
    }
    const expected = label === "font stack" ? normalizeFontStack(upstream) : normalizeNumeric(upstream);
    const actual = label === "font stack" ? normalizeFontStack(valueOf(entry)) : normalizeNumeric(valueOf(entry));
    if (actual !== expected) {
      errors.push(
        `- ${entry.name} ships "${actual}" but Tailwind's ${tailwindName} is "${expected}" (${label}).`
      );
    }
  }
}

function checkDensity(themeCss, errors) {
  const base = themeValue(themeCss, "--spacing");
  if (base === null) return;
  const baseRem = Number.parseFloat(normalizeNumeric(base));
  for (const entry of DENSITY_TOKENS) {
    if (entry.tailwindSpacingMultiplier === undefined) continue;
    const expected = `${Math.round(entry.tailwindSpacingMultiplier * baseRem * 1e6) / 1e6}rem`;
    if (entry.value !== expected) {
      errors.push(
        `- ${entry.name} ships "${entry.value}" but h-${entry.tailwindSpacingMultiplier} is "${expected}".`
      );
    }
  }
}

/** Everything declared here must actually reach the standalone sheet. */
function checkTokensCss(root, errors) {
  const tokensCss = readFileSync(join(root, TOKENS_CSS_PATH), "utf-8");
  for (const name of scaleTokenNames()) {
    if (!new RegExp(`(?:^|\\n)\\s*${name.replace(/[-]/g, "\\-")}\\s*:`).test(tokensCss)) {
      errors.push(`- ${TOKENS_CSS_PATH} is missing "${name}". Run \`npm run design:sync\`.`);
    }
  }
}

/** ...and must stay out of the package stylesheet, where it would leak. */
function checkGlobalsStaysClean(root, errors) {
  const globalsCss = readFileSync(join(root, SOURCE_GLOBALS_PATH), "utf-8");
  for (const match of globalsCss.matchAll(/(--[a-z0-9-]+)\s*:/g)) {
    const name = match[1];
    if (!TAILWIND_OWNED_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;
    errors.push(
      `- ${SOURCE_GLOBALS_PATH} defines "${name}", which Tailwind owns. src/globals.css lands in the \`base\` layer and outranks Tailwind's \`theme\` layer, so this re-points every \`${name.replace(/^--/, "")}\` utility in every consumer. Declare the scale in scripts/design-sync/token-scales.mjs (standalone sheet only) instead.`
    );
  }
}

const CANVAS_TEXT_ALLOWLIST_PATH = "design/policy/canvas-text-allowlist.json";
const CANVAS_TEXT_SCAN_DIRS = ["src", "app"];
const CANVAS_TEXT_USE_PATTERN = /\btext-canvas-(?:sm|xs|2xs)\b|--text-canvas-/g;

/**
 * The canvas tier is GunjoUI's own (not Tailwind's), so the thing to hold it to
 * is the theme block that ships it: every step in CANVAS_TEXT_STEPS must be in
 * tailwind-theme-extend.cjs `fontSize` with the same size and line height, and
 * nothing else may be — the rest of the type scale stays Tailwind's.
 */
function checkCanvasTheme(errors) {
  const require = createRequire(import.meta.url);
  const themeExtend = require("../tailwind-theme-extend.cjs");
  const fontSize = themeExtend.fontSize ?? {};
  const expectedKeys = CANVAS_TEXT_STEPS.map((entry) => entry.utility.replace(/^text-/, ""));
  for (const key of Object.keys(fontSize)) {
    if (!expectedKeys.includes(key)) {
      errors.push(
        `- tailwind-theme-extend.cjs fontSize defines "${key}", which is not a canvas step. GunjoUI does not override Tailwind's type scale; only CANVAS_TEXT_STEPS belong here.`
      );
    }
  }
  for (const entry of CANVAS_TEXT_STEPS) {
    const key = entry.utility.replace(/^text-/, "");
    const shipped = fontSize[key];
    const expected = [textValue(entry), { lineHeight: entry.lineHeight }];
    if (JSON.stringify(shipped) !== JSON.stringify(expected)) {
      errors.push(
        `- tailwind-theme-extend.cjs fontSize["${key}"] is ${JSON.stringify(shipped)} but token-scales.mjs declares ${JSON.stringify(expected)}.`
      );
    }
  }
}

function listSourceFiles(dir) {
  const files = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === "generated") continue;
      const absolutePath = join(current, entry.name);
      if (entry.isDirectory()) stack.push(absolutePath);
      else if (entry.isFile() && entry.name.endsWith(".tsx")) files.push(absolutePath);
    }
  }
  return files;
}

/**
 * Where the canvas tier may be used. The decision was "canvas overlays only",
 * and a class name cannot tell a map label from a paragraph — so the list of
 * files is the check. Adding a file means saying why in the policy JSON.
 */
export function collectCanvasTextViolations(root, allowedFiles) {
  const allowed = new Set(allowedFiles);
  const violations = [];
  for (const dir of CANVAS_TEXT_SCAN_DIRS) {
    for (const filePath of listSourceFiles(join(root, dir))) {
      const relativePath = relative(root, filePath);
      if (allowed.has(relativePath)) continue;
      const content = readFileSync(filePath, "utf-8");
      const match = CANVAS_TEXT_USE_PATTERN.exec(content);
      CANVAS_TEXT_USE_PATTERN.lastIndex = 0;
      if (!match) continue;
      const line = content.slice(0, match.index).split(/\r?\n/).length;
      violations.push(`${relativePath}:${line} "${match[0]}"`);
    }
  }
  return violations;
}

function checkCanvasUsage(root, errors) {
  const policy = JSON.parse(readFileSync(join(root, CANVAS_TEXT_ALLOWLIST_PATH), "utf-8"));
  const entries = Array.isArray(policy?.allowed) ? policy.allowed : [];
  const files = [];
  for (const [index, entry] of entries.entries()) {
    if (typeof entry?.file !== "string" || typeof entry?.reason !== "string" || entry.reason.length === 0) {
      errors.push(`- ${CANVAS_TEXT_ALLOWLIST_PATH} allowed[${index}] needs "file" and a non-empty "reason".`);
      continue;
    }
    files.push(entry.file);
  }
  for (const violation of collectCanvasTextViolations(root, files)) {
    errors.push(
      `- ${violation}: the canvas type tier is for text on a map / canvas / image only. Use text-xs or larger, or add the file to ${CANVAS_TEXT_ALLOWLIST_PATH} with the reason (ask KeEem first).`
    );
  }
}

export function verifyScaleTokens({ root = ROOT } = {}) {
  const themeCss = readTailwindTheme();
  const errors = [];

  checkSpacing(themeCss, errors);
  checkAgainstTheme(themeCss, errors, TEXT_STEPS, textValue, "font size");
  checkAgainstTheme(themeCss, errors, LEADING_STEPS, (entry) => entry.value, "line height");
  checkAgainstTheme(themeCss, errors, WEIGHT_STEPS, (entry) => entry.value, "font weight");
  checkAgainstTheme(themeCss, errors, FONT_STACKS, (entry) => entry.value, "font stack");
  checkDensity(themeCss, errors);
  checkCanvasTheme(errors);
  checkCanvasUsage(root, errors);
  checkTokensCss(root, errors);
  checkGlobalsStaysClean(root, errors);

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: scale token drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-scale-tokens.mjs",
  verify: verifyScaleTokens,
  successMessage: "design:verify: scale token check passed",
});
