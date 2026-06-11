#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

function readNavigationTitles(source) {
  const titles = new Set();
  const pattern = /title:\s*"([^"]+)"/g;

  let match = pattern.exec(source);
  while (match) {
    titles.add(match[1]);
    match = pattern.exec(source);
  }

  return titles;
}

function readTranslationNavKeysByLocale(source) {
  const keysByLocale = { ja: new Set() };
  const lines = source.split("\n");

  let currentLocale = null;
  let inNav = false;
  let navDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!inNav) {
      if (trimmed.startsWith("ja: {")) {
        currentLocale = "ja";
      } else if (currentLocale && trimmed.startsWith("nav: {")) {
        inNav = true;
        navDepth = 1;
      }

      continue;
    }

    navDepth += (line.match(/\{/g) ?? []).length;
    navDepth -= (line.match(/\}/g) ?? []).length;

    const keyMatch = line.match(/^\s*(?:"([^"]+)"|([A-Za-z_][A-Za-z0-9_]*))\s*:\s*".*"\s*,?\s*$/);
    if (keyMatch) {
      const key = keyMatch[1] ?? keyMatch[2];
      if (currentLocale === "ja") {
        keysByLocale.ja.add(key);
      }
    }

    if (navDepth === 0) {
      inNav = false;
    }
  }

  return keysByLocale;
}

function sortedMissing(expected, actual) {
  return [...expected].filter((value) => !actual.has(value)).sort((a, b) => a.localeCompare(b));
}

export function verifyNavTranslationCoverage({ root = ROOT } = {}) {
  const navigationPath = join(root, "app", "lib", "navigation.ts");
  const translationsPath = join(root, "app", "lib", "translations.ts");

  const navigationSource = readFileSync(navigationPath, "utf-8");
  const translationsSource = readFileSync(translationsPath, "utf-8");
  const navigationTitles = readNavigationTitles(navigationSource);
  const navKeysByLocale = readTranslationNavKeysByLocale(translationsSource);

  const missingJa = sortedMissing(navigationTitles, navKeysByLocale.ja);

  if (missingJa.length === 0) return;

  const lines = ["design:verify: navigation translation coverage mismatch detected."];
  lines.push(`[ja] Missing nav translation keys: ${missingJa.join(", ")}`);
  lines.push("English uses key fallback; add missing keys under translations.ja.nav.");
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-nav-translation-coverage.mjs",
  verify: verifyNavTranslationCoverage,
  successMessage: "design:verify: navigation translation coverage check passed",
});
