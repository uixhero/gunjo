#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const APP_GLOBALS_PATH = "app/globals.css";
const TAILWIND_IMPORT = '@import "tailwindcss";';
const TAILWIND_CONFIG_DIRECTIVE = '@config "../tailwind.config.ts";';
const SOURCE_GLOBALS_IMPORT = '@import "../src/globals.css";';

export function verifyAppGlobalsSync({ root = ROOT } = {}) {
  const appGlobalsPath = join(root, APP_GLOBALS_PATH);
  const content = readFileSync(appGlobalsPath, "utf-8");

  const errors = [];

  if (!content.includes(TAILWIND_IMPORT)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} must import Tailwind via ${TAILWIND_IMPORT}`
    );
  }

  if (!content.includes(TAILWIND_CONFIG_DIRECTIVE)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} must pin Tailwind config via ${TAILWIND_CONFIG_DIRECTIVE}`
    );
  }

  const configDirectiveMatches = content.match(/@config\s+["'][^"']+["'];?/g) ?? [];
  if (configDirectiveMatches.length > 1) {
    errors.push(
      `- ${APP_GLOBALS_PATH} should contain only one @config directive (found ${configDirectiveMatches.length}).`
    );
  }

  if (!content.includes(SOURCE_GLOBALS_IMPORT)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} must import src globals via ${SOURCE_GLOBALS_IMPORT}`
    );
  }

  if (/:root\s*\{/.test(content)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} should not define :root variables directly (use src/globals.css as SSOT)`
    );
  }

  if (/\.dark\s*\{/.test(content)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} should not define .dark variables directly (use src/globals.css as SSOT)`
    );
  }

  if (/#(?:[0-9a-fA-F]{3,8})\b/.test(content) || /\brgba?\(/.test(content)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} contains raw color literals (#hex/rgb). Use token references like hsl(var(--overlay) / <alpha>).`
    );
  }

  if (!/\.hero-gradient[\s\S]*hsl\(var\(--overlay\)\s*\/\s*0\./.test(content)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} .hero-gradient should be based on --overlay token`
    );
  }

  if (!/\.hero-vignette[\s\S]*hsl\(var\(--overlay\)\s*\/\s*0\./.test(content)) {
    errors.push(
      `- ${APP_GLOBALS_PATH} .hero-vignette should be based on --overlay token`
    );
  }

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: app globals sync check failed.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-app-globals-sync.mjs",
  verify: verifyAppGlobalsSync,
  successMessage: "design:verify: app globals sync check passed",
});
