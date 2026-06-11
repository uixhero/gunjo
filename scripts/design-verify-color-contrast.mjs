#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const SOURCE_GLOBALS_PATH = "src/globals.css";
const MIN_AA_CONTRAST = 4.5;

const CONTRAST_PAIRS = [
  ["--background", "--foreground"],
  ["--card", "--card-foreground"],
  ["--popover", "--popover-foreground"],
  ["--muted", "--muted-foreground"],
  ["--secondary", "--secondary-foreground"],
  ["--accent", "--accent-foreground"],
  ["--primary-subtle", "--primary-subtle-foreground"],
  ["--primary", "--primary-foreground"],
  ["--primary-strong", "--primary-strong-foreground"],
  ["--info-subtle", "--info-subtle-foreground"],
  ["--info", "--info-foreground"],
  ["--info-strong", "--info-strong-foreground"],
  ["--success-subtle", "--success-subtle-foreground"],
  ["--success", "--success-foreground"],
  ["--success-strong", "--success-strong-foreground"],
  ["--warning-subtle", "--warning-subtle-foreground"],
  ["--warning", "--warning-foreground"],
  ["--warning-strong", "--warning-strong-foreground"],
  ["--destructive-subtle", "--destructive-subtle-foreground"],
  ["--destructive", "--destructive-foreground"],
  ["--destructive-strong", "--destructive-strong-foreground"],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractCssBlock(globalsCss, selector) {
  const pattern = new RegExp(
    `${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`,
    "m"
  );
  return pattern.exec(globalsCss)?.[1] ?? "";
}

function extractVars(blockContent) {
  return Object.fromEntries(
    [...blockContent.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map(
      (match) => [match[1], match[2].trim()]
    )
  );
}

function parseHsl(value) {
  const parts = value.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
  if (!parts || parts.length < 3) {
    throw new Error(`Expected HSL triplet, got "${value}".`);
  }
  return { h: parts[0], s: parts[1] / 100, l: parts[2] / 100 };
}

function hslToRgb({ h, s, l }) {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [r + m, g + m, b + m];
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((channel) =>
    channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(background, foreground) {
  const bg = relativeLuminance(hslToRgb(parseHsl(background)));
  const fg = relativeLuminance(hslToRgb(parseHsl(foreground)));
  const light = Math.max(bg, fg);
  const dark = Math.min(bg, fg);
  return (light + 0.05) / (dark + 0.05);
}

function verifyThemePairs(themeName, vars, errors) {
  for (const [backgroundVar, foregroundVar] of CONTRAST_PAIRS) {
    const background = vars[backgroundVar];
    const foreground = vars[foregroundVar];

    if (!background || !foreground) {
      errors.push(
        `- ${SOURCE_GLOBALS_PATH} ${themeName} is missing ${backgroundVar} or ${foregroundVar}.`
      );
      continue;
    }

    const ratio = contrastRatio(background, foreground);
    if (ratio < MIN_AA_CONTRAST) {
      errors.push(
        `- ${SOURCE_GLOBALS_PATH} ${themeName} ${backgroundVar} / ${foregroundVar} contrast is ${ratio.toFixed(
          2
        )}:1; expected at least ${MIN_AA_CONTRAST}:1.`
      );
    }
  }
}

export function verifyColorContrast({ root = ROOT } = {}) {
  const globals = readFileSync(join(root, SOURCE_GLOBALS_PATH), "utf-8");
  const rootVars = extractVars(extractCssBlock(globals, ":root"));
  const darkVars = extractVars(extractCssBlock(globals, ".dark"));
  const errors = [];

  verifyThemePairs(":root", rootVars, errors);
  verifyThemePairs(".dark", darkVars, errors);

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: color token contrast drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-color-contrast.mjs",
  verify: verifyColorContrast,
  successMessage: "design:verify: color token contrast passed",
});
