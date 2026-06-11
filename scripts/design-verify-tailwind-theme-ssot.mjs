#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const TAILWIND_CONFIG_PATH = "tailwind.config.ts";
const TAILWIND_PRESET_PATH = "tailwind-preset.js";
const TAILWIND_THEME_EXTEND_PATH = "tailwind-theme-extend.cjs";

const SHARED_REQUIRE_SNIPPET = `require("./${TAILWIND_THEME_EXTEND_PATH}")`;

function hasSnippet(content, pattern) {
  return pattern.test(content);
}

export function verifyTailwindThemeSsot({ root = ROOT } = {}) {
  const tailwindConfigPath = join(root, TAILWIND_CONFIG_PATH);
  const tailwindPresetPath = join(root, TAILWIND_PRESET_PATH);
  const tailwindConfig = readFileSync(tailwindConfigPath, "utf-8");
  const tailwindPreset = readFileSync(tailwindPresetPath, "utf-8");

  const errors = [];

  if (!tailwindConfig.includes(SHARED_REQUIRE_SNIPPET)) {
    errors.push(
      `- ${TAILWIND_CONFIG_PATH} should import shared theme extend via ${SHARED_REQUIRE_SNIPPET}.`
    );
  }

  if (!hasSnippet(tailwindConfig, /extend\s*:\s*themeExtend/)) {
    errors.push(
      `- ${TAILWIND_CONFIG_PATH} should set theme.extend from shared themeExtend.`
    );
  }

  if (!tailwindPreset.includes(SHARED_REQUIRE_SNIPPET)) {
    errors.push(
      `- ${TAILWIND_PRESET_PATH} should import shared theme extend via ${SHARED_REQUIRE_SNIPPET}.`
    );
  }

  if (!hasSnippet(tailwindPreset, /extend\s*:\s*themeExtend/)) {
    errors.push(
      `- ${TAILWIND_PRESET_PATH} should set theme.extend from shared themeExtend.`
    );
  }

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: tailwind theme ssot drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-tailwind-theme-ssot.mjs",
  verify: verifyTailwindThemeSsot,
  successMessage: "design:verify: tailwind theme ssot check passed",
});
