import { existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { ROOT, readJson, readText } from "./design-sync/shared.mjs";
import { getComponentSourceCategoryConfig } from "./design-sync/component-source-map.mjs";
import { throwLinesError } from "./design-verify-assertions.mjs";
import { uniqueSorted } from "./design-verify-collections.mjs";

function getExpectedVariantKeys(spec) {
  const components = spec?.components ?? {};
  return Object.fromEntries(
    Object.entries(components)
      .filter(
        ([, componentSpec]) =>
          Array.isArray(componentSpec?.variants) && componentSpec.variants.length > 1
      )
      .map(([componentKey, componentSpec]) => [
        componentKey,
        uniqueSorted(
          (componentSpec.variants ?? [])
            .map((variant) => variant?.key)
            .filter((key) => typeof key === "string" && key.length > 0)
        ),
      ])
      .sort(([a], [b]) => a.localeCompare(b))
  );
}

function getActualVariantKeysFromGeneratedFile(filePath) {
  const source = readText(filePath);
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const entries = {};

  function resolveArrayLiteral(expression) {
    if (!expression) return null;
    if (ts.isArrayLiteralExpression(expression)) return expression;
    if (ts.isAsExpression(expression)) return resolveArrayLiteral(expression.expression);
    if (ts.isParenthesizedExpression(expression)) return resolveArrayLiteral(expression.expression);
    return null;
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      const varName = declaration.name.text;
      if (!varName.endsWith("VariantKeys")) continue;
      const arrayLiteral = resolveArrayLiteral(declaration.initializer);
      if (!arrayLiteral) continue;

      const componentKey = varName.slice(0, -("VariantKeys".length));
      const keys = arrayLiteral.elements
        .filter((element) => ts.isStringLiteral(element))
        .map((element) => element.text);

      entries[componentKey] = uniqueSorted(keys);
    }
  }

  return entries;
}

function compareKeys(expected, actual) {
  const expectedComponents = new Set(Object.keys(expected));
  const actualComponents = new Set(Object.keys(actual));

  const missingComponents = [...expectedComponents]
    .filter((key) => !actualComponents.has(key))
    .sort((a, b) => a.localeCompare(b));
  const staleComponents = [...actualComponents]
    .filter((key) => !expectedComponents.has(key))
    .sort((a, b) => a.localeCompare(b));

  const mismatches = [];
  for (const componentKey of expectedComponents) {
    if (!actualComponents.has(componentKey)) continue;
    const expectedKeys = expected[componentKey] ?? [];
    const actualKeys = actual[componentKey] ?? [];
    const expectedSet = new Set(expectedKeys);
    const actualSet = new Set(actualKeys);

    const missingKeys = expectedKeys.filter((key) => !actualSet.has(key));
    const extraKeys = actualKeys.filter((key) => !expectedSet.has(key));
    if (missingKeys.length === 0 && extraKeys.length === 0) continue;

    mismatches.push({
      componentKey,
      missingKeys,
      extraKeys,
    });
  }

  return {
    missingComponents,
    staleComponents,
    mismatches: mismatches.sort((a, b) => a.componentKey.localeCompare(b.componentKey)),
  };
}

export function verifyGeneratedVariantKeyCoverageForCategory({
  root = ROOT,
  category,
  label,
}) {
  const config = getComponentSourceCategoryConfig(category);
  const specPath = join(root, config.specPath);
  const generatedPath = join(root, config.sourceDir, "generated", "variant-keys.ts");

  const expected = getExpectedVariantKeys(readJson(specPath));
  if (Object.keys(expected).length === 0 && !existsSync(generatedPath)) return;
  const actual = getActualVariantKeysFromGeneratedFile(generatedPath);
  const { missingComponents, staleComponents, mismatches } = compareKeys(expected, actual);

  const hasMismatch =
    missingComponents.length > 0 || staleComponents.length > 0 || mismatches.length > 0;
  if (!hasMismatch) return;

  const lines = [`design:verify: ${label} variant key coverage mismatch detected.`];

  if (missingComponents.length > 0) {
    lines.push("Missing components in generated variant keys:");
    for (const componentKey of missingComponents) {
      lines.push(`- ${componentKey}`);
    }
  }

  if (staleComponents.length > 0) {
    lines.push("Unexpected components in generated variant keys:");
    for (const componentKey of staleComponents) {
      lines.push(`- ${componentKey}`);
    }
  }

  for (const mismatch of mismatches) {
    lines.push(`[${mismatch.componentKey}]`);
    if (mismatch.missingKeys.length > 0) {
      lines.push("Missing keys in generated file:");
      for (const key of mismatch.missingKeys) {
        lines.push(`- ${key}`);
      }
    }
    if (mismatch.extraKeys.length > 0) {
      lines.push("Unexpected keys in generated file:");
      for (const key of mismatch.extraKeys) {
        lines.push(`- ${key}`);
      }
    }
  }

  lines.push(`Run \`npm run design:sync:components\` to regenerate ${label} variant key exports.`);
  throwLinesError(lines);
}
