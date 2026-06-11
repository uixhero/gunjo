#!/usr/bin/env node

import { join } from "node:path";
import ts from "typescript";
import { ROOT, readJson, readText } from "./design-sync/shared.mjs";
import { getComponentSourceCategoryConfig } from "./design-sync/component-source-map.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";
import { uniqueSorted } from "./design-verify-collections.mjs";

function getPropertyNameText(nameNode) {
  if (!nameNode) return null;
  if (ts.isIdentifier(nameNode)) return nameNode.text;
  if (ts.isStringLiteral(nameNode)) return nameNode.text;
  if (ts.isNumericLiteral(nameNode)) return nameNode.text;
  return null;
}

function collectObjectLiteralKeys(objectLiteral) {
  if (!objectLiteral || !ts.isObjectLiteralExpression(objectLiteral)) return [];
  return objectLiteral.properties
    .map((prop) => {
      if (
        ts.isPropertyAssignment(prop) ||
        ts.isShorthandPropertyAssignment(prop) ||
        ts.isMethodDeclaration(prop)
      ) {
        return getPropertyNameText(prop.name);
      }
      return null;
    })
    .filter((key) => Boolean(key));
}

function findVariableDeclaration(sourceFile, variableName) {
  let match = null;

  function visit(node) {
    if (match) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      if (node.name.text === variableName) {
        match = node;
        return;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return match;
}

function findObjectProperty(objectLiteral, propertyName) {
  if (!objectLiteral || !ts.isObjectLiteralExpression(objectLiteral)) return null;
  return objectLiteral.properties.find((prop) => {
    if (!ts.isPropertyAssignment(prop)) return false;
    return getPropertyNameText(prop.name) === propertyName;
  });
}

function parseSourceFile(absolutePath) {
  const sourceText = readText(absolutePath);
  return ts.createSourceFile(
    absolutePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    absolutePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
}

function resolveObjectLiteralExpression(sourceFile, expression) {
  if (!expression) return null;
  if (ts.isObjectLiteralExpression(expression)) return expression;
  if (ts.isParenthesizedExpression(expression)) {
    return resolveObjectLiteralExpression(sourceFile, expression.expression);
  }
  if (ts.isAsExpression(expression)) {
    return resolveObjectLiteralExpression(sourceFile, expression.expression);
  }
  if (ts.isIdentifier(expression)) {
    const declaration = findVariableDeclaration(sourceFile, expression.text);
    if (!declaration || !declaration.initializer) return null;
    return resolveObjectLiteralExpression(sourceFile, declaration.initializer);
  }
  return null;
}

function extractButtonVariantKeys(absolutePath) {
  const sourceFile = parseSourceFile(absolutePath);
  const declaration = findVariableDeclaration(sourceFile, "buttonVariants");
  if (!declaration || !declaration.initializer || !ts.isCallExpression(declaration.initializer)) {
    throw new Error(`Unable to parse buttonVariants call in ${absolutePath}`);
  }

  const cvaArgs = declaration.initializer.arguments;
  if (cvaArgs.length < 2) {
    throw new Error(`buttonVariants must provide cva options object in ${absolutePath}`);
  }

  const optionsArg = cvaArgs[1];
  if (!ts.isObjectLiteralExpression(optionsArg)) {
    throw new Error(`buttonVariants cva options must be an object literal in ${absolutePath}`);
  }

  const variantsProperty = findObjectProperty(optionsArg, "variants");
  const variantsObject = variantsProperty?.initializer;
  if (!variantsProperty || !variantsObject || !ts.isObjectLiteralExpression(variantsObject)) {
    throw new Error(`buttonVariants options must include variants object in ${absolutePath}`);
  }

  const variantProperty = findObjectProperty(variantsObject, "variant");
  const variantObject = resolveObjectLiteralExpression(sourceFile, variantProperty?.initializer);
  if (!variantProperty || !variantObject) {
    throw new Error(`buttonVariants variants must include variant key object in ${absolutePath}`);
  }

  return uniqueSorted(collectObjectLiteralKeys(variantObject));
}

function extractToolPillVariantKeys(absolutePath) {
  const sourceFile = parseSourceFile(absolutePath);
  const declaration = findVariableDeclaration(sourceFile, "variantClasses");
  if (!declaration || !declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
    throw new Error(`Unable to parse variantClasses object in ${absolutePath}`);
  }

  return uniqueSorted(collectObjectLiteralKeys(declaration.initializer));
}

function compareKeys({ label, expected, actual, sourcePath }) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);

  const missing = expected.filter((key) => !actualSet.has(key));
  const extra = actual.filter((key) => !expectedSet.has(key));

  return {
    label,
    sourcePath,
    missing,
    extra,
    hasMismatch: missing.length > 0 || extra.length > 0,
  };
}

export function verifyAtomVariantKeyCoverage({ root = ROOT } = {}) {
  const inputsConfig = getComponentSourceCategoryConfig("inputs");
  const inputsSpec = readJson(join(root, inputsConfig.specPath));
  const expectedButtonKeys = uniqueSorted(
    (inputsSpec?.components?.button?.variants ?? []).map((variant) => variant.key)
  );
  const displayConfig = getComponentSourceCategoryConfig("display");
  const displaySpec = readJson(join(root, displayConfig.specPath));
  const expectedToolPillKeys = uniqueSorted(
    (displaySpec?.components?.toolPill?.variants ?? []).map((variant) => variant.key)
  );

  const buttonSourcePath = join(root, "src", "components", "inputs", "ButtonVariants.ts");
  const toolPillSourcePath = join(root, "src", "components", "display", "ToolPill.tsx");

  const results = [
    compareKeys({
      label: "button",
      sourcePath: "src/components/inputs/ButtonVariants.ts",
      expected: expectedButtonKeys,
      actual: extractButtonVariantKeys(buttonSourcePath),
    }),
    compareKeys({
      label: "toolPill",
      sourcePath: "src/components/display/ToolPill.tsx",
      expected: expectedToolPillKeys,
      actual: extractToolPillVariantKeys(toolPillSourcePath),
    }),
  ];

  if (!results.some((result) => result.hasMismatch)) {
    return;
  }

  const lines = ["design:verify: atom variant key mismatch detected."];

  for (const result of results) {
    if (!result.hasMismatch) continue;
    lines.push(`[${result.label}] ${result.sourcePath}`);

    if (result.missing.length > 0) {
      lines.push("Missing keys from source:");
      for (const key of result.missing) {
        lines.push(`- ${key}`);
      }
    }

    if (result.extra.length > 0) {
      lines.push("Unexpected keys in source:");
      for (const key of result.extra) {
        lines.push(`- ${key}`);
      }
    }
  }

  lines.push("Update design/atoms.pen variants or source variant maps to restore key parity.");
  throwLinesError(lines);
}

runVerificationCli({
  scriptName: "design-verify-atom-variant-key-coverage.mjs",
  verify: verifyAtomVariantKeyCoverage,
  successMessage: "design:verify: atom variant key coverage check passed",
});
