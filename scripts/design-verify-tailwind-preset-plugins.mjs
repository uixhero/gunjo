#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const TAILWIND_CONFIG_PATH = "tailwind.config.ts";
const TAILWIND_PRESET_PATH = "tailwind-preset.js";
const PACKAGE_JSON_PATH = "package.json";

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function extractRequirePackages(content) {
  return uniqueSorted(
    [...content.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g)]
      .map((match) => match[1])
      .filter(
        (packageName) =>
          !packageName.startsWith(".") &&
          !packageName.startsWith("/") &&
          !packageName.startsWith("node:")
      )
  );
}

function hasPackageDependency(packageJson, packageName) {
  const dependencyGroups = [
    packageJson.dependencies ?? {},
    packageJson.devDependencies ?? {},
    packageJson.peerDependencies ?? {},
    packageJson.optionalDependencies ?? {},
  ];
  return dependencyGroups.some((group) => packageName in group);
}

function formatSet(values) {
  return values.length === 0 ? "(none)" : values.join(", ");
}

export function verifyTailwindPresetPlugins({ root = ROOT } = {}) {
  const tailwindConfigPath = join(root, TAILWIND_CONFIG_PATH);
  const tailwindPresetPath = join(root, TAILWIND_PRESET_PATH);
  const packageJsonPath = join(root, PACKAGE_JSON_PATH);

  const tailwindConfig = readFileSync(tailwindConfigPath, "utf-8");
  const tailwindPreset = readFileSync(tailwindPresetPath, "utf-8");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  const configPlugins = extractRequirePackages(tailwindConfig);
  const presetPlugins = extractRequirePackages(tailwindPreset);
  const errors = [];

  const missingInPreset = configPlugins.filter((pkg) => !presetPlugins.includes(pkg));
  if (missingInPreset.length > 0) {
    errors.push(
      `- ${TAILWIND_PRESET_PATH} is missing plugins from ${TAILWIND_CONFIG_PATH}: ${formatSet(missingInPreset)}`
    );
  }

  const extraInPreset = presetPlugins.filter((pkg) => !configPlugins.includes(pkg));
  if (extraInPreset.length > 0) {
    errors.push(
      `- ${TAILWIND_PRESET_PATH} has extra plugins not present in ${TAILWIND_CONFIG_PATH}: ${formatSet(extraInPreset)}`
    );
  }

  for (const pluginPkg of presetPlugins) {
    if (!hasPackageDependency(packageJson, pluginPkg)) {
      errors.push(
        `- ${TAILWIND_PRESET_PATH} requires "${pluginPkg}" but ${PACKAGE_JSON_PATH} does not declare it.`
      );
    }
  }

  if (errors.length === 0) return;

  throwLinesError([
    "design:verify: tailwind preset plugin drift detected.",
    ...errors,
  ]);
}

runVerificationCli({
  scriptName: "design-verify-tailwind-preset-plugins.mjs",
  verify: verifyTailwindPresetPlugins,
  successMessage: "design:verify: tailwind preset plugin sync passed",
});
