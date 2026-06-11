import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readJson, readText } from "./design-sync/shared.mjs";
import { getComponentSourceCategoryConfig } from "./design-sync/component-source-map.mjs";
import { throwLinesError } from "./design-verify-assertions.mjs";
import { toPascalCase } from "./design-verify-component-file-map.mjs";
import { getMultiVariantComponentKeys } from "./design-verify-component-spec-utils.mjs";

export function verifyGeneratedVariantKeyUsageForCategory({
  root = ROOT,
  category,
  label,
  getComponentFileName,
}) {
  const config = getComponentSourceCategoryConfig(category);
  const specPath = join(root, config.specPath);
  const componentsDir = join(root, config.sourceDir);
  const expectedComponents = getMultiVariantComponentKeys(readJson(specPath));

  const missingFiles = [];
  const missingTypeUsage = [];
  const missingRecordUsage = [];

  for (const componentKey of expectedComponents) {
    const fileName = getComponentFileName(componentKey);
    const filePath = join(componentsDir, fileName);
    const typeName = `${toPascalCase(componentKey)}VariantKey`;

    if (!existsSync(filePath)) {
      missingFiles.push({ componentKey, fileName });
      continue;
    }

    const source = readText(filePath);
    if (!source.includes(typeName)) {
      missingTypeUsage.push({ componentKey, typeName, fileName });
    }
    if (!new RegExp(`\\bRecord<${typeName},`).test(source)) {
      missingRecordUsage.push({ componentKey, typeName, fileName });
    }
  }

  if (
    missingFiles.length === 0 &&
    missingTypeUsage.length === 0 &&
    missingRecordUsage.length === 0
  ) {
    return;
  }

  const lines = [`design:verify: ${label} generated variant key usage mismatch detected.`];

  if (missingFiles.length > 0) {
    lines.push(`Missing ${label} implementation files:`);
    for (const item of missingFiles) {
      lines.push(`- ${item.componentKey}: expected ${config.sourceDir}/${item.fileName}`);
    }
  }

  if (missingTypeUsage.length > 0) {
    lines.push(`Missing generated variant key type usage in ${label} implementation:`);
    for (const item of missingTypeUsage) {
      lines.push(
        `- ${item.componentKey}: expected \`${item.typeName}\` in ${config.sourceDir}/${item.fileName}`
      );
    }
  }

  if (missingRecordUsage.length > 0) {
    lines.push("Missing Record map keyed by generated variant key type:");
    for (const item of missingRecordUsage) {
      lines.push(
        `- ${item.componentKey}: expected \`Record<${item.typeName}, ...>\` in ${config.sourceDir}/${item.fileName}`
      );
    }
  }

  lines.push(
    `Import the generated type from ${config.sourceDir}/generated/variant-keys.ts and use it in component source.`
  );
  throwLinesError(lines);
}
