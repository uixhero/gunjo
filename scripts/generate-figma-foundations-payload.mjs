#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const OUTPUT_JSON = join(ROOT, "docs", "figma-library-foundations.generated.json");
const OUTPUT_MD = join(ROOT, "docs", "figma-library-foundations.generated.md");

const CSS_VAR_BY_TOKEN = {
  background: "background",
  foreground: "foreground",
  card: "card",
  "card-foreground": "card-foreground",
  popover: "popover",
  "popover-foreground": "popover-foreground",
  primary: "primary",
  "primary-foreground": "primary-foreground",
  secondary: "secondary",
  "secondary-foreground": "secondary-foreground",
  muted: "muted",
  "muted-foreground": "muted-foreground",
  accent: "accent",
  "accent-foreground": "accent-foreground",
  destructive: "destructive",
  "destructive-foreground": "destructive-foreground",
  border: "border",
  input: "input",
  ring: "ring",
  overlay: "overlay",
  "color-info": "info",
  "color-success": "success",
  "color-warning": "warning",
  "shadow-sm": "shadow-sm",
  "shadow-base": "shadow",
  "shadow-md": "shadow-md",
  "shadow-lg": "shadow-lg",
  "shadow-xl": "shadow-xl",
  "shadow-2xl": "shadow-2xl",
  "shadow-inner": "shadow-inner",
  "shadow-none": "shadow-none",
  "duration-75": "duration-75",
  "duration-100": "duration-100",
  "duration-150": "duration-150",
  "duration-200": "duration-200",
  "duration-300": "duration-300",
  "duration-500": "duration-500",
  "duration-700": "duration-700",
  "duration-1000": "duration-1000",
  "ease-linear": "ease-linear",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
};

const PAGES = [
  "Cover",
  "Changelog",
  "Tokens",
  "Inputs",
  "Display",
  "Charts",
  "Feedback",
  "Navigation",
  "Overlay",
  "Layout",
  "Patterns",
];

const TEXT_STYLES = [
  { name: "Gunjo/Display", fontFamily: "Inter", fontStyle: "Bold", fontSize: 40, lineHeight: 48 },
  { name: "Gunjo/Heading 1", fontFamily: "Inter", fontStyle: "Bold", fontSize: 32, lineHeight: 40 },
  { name: "Gunjo/Heading 2", fontFamily: "Inter", fontStyle: "Semi Bold", fontSize: 24, lineHeight: 32 },
  { name: "Gunjo/Body", fontFamily: "Inter", fontStyle: "Regular", fontSize: 16, lineHeight: 24 },
  { name: "Gunjo/Body Small", fontFamily: "Inter", fontStyle: "Regular", fontSize: 14, lineHeight: 20 },
  { name: "Gunjo/Label", fontFamily: "Inter", fontStyle: "Medium", fontSize: 14, lineHeight: 20 },
  { name: "Gunjo/Caption", fontFamily: "Inter", fontStyle: "Medium", fontSize: 12, lineHeight: 16 },
];

const EFFECT_STYLES = [
  "Gunjo/Shadow/sm",
  "Gunjo/Shadow/base",
  "Gunjo/Shadow/md",
  "Gunjo/Shadow/lg",
  "Gunjo/Shadow/xl",
  "Gunjo/Shadow/2xl",
  "Gunjo/Shadow/inner",
  "Gunjo/Shadow/none",
];

const RUNTIME_COLOR_VARIABLES = [
  {
    name: "color/primary-strong",
    cssName: "primary-strong",
    scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
  },
  {
    name: "color/primary-strong-foreground",
    cssName: "primary-strong-foreground",
    scopes: ["TEXT_FILL"],
  },
  {
    name: "color/info-strong",
    cssName: "info-strong",
    scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
  },
  {
    name: "color/info-strong-foreground",
    cssName: "info-strong-foreground",
    scopes: ["TEXT_FILL"],
  },
  {
    name: "color/success-strong",
    cssName: "success-strong",
    scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
  },
  {
    name: "color/success-strong-foreground",
    cssName: "success-strong-foreground",
    scopes: ["TEXT_FILL"],
  },
  {
    name: "color/warning-strong",
    cssName: "warning-strong",
    scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
  },
  {
    name: "color/warning-strong-foreground",
    cssName: "warning-strong-foreground",
    scopes: ["TEXT_FILL"],
  },
  {
    name: "color/destructive-strong",
    cssName: "destructive-strong",
    scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
  },
  {
    name: "color/destructive-strong-foreground",
    cssName: "destructive-strong-foreground",
    scopes: ["TEXT_FILL"],
  },
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function readCssVariables(blockName) {
  const css = readFileSync(join(ROOT, "src", "globals.css"), "utf8");
  const pattern = blockName === "root" ? /:root\s*\{([\s\S]*?)\n\s*\}/ : /\.dark\s*\{([\s\S]*?)\n\s*\}/;
  const block = css.match(pattern)?.[1] ?? "";
  const variables = {};
  for (const match of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    variables[match[1]] = match[2].trim();
  }
  return variables;
}

function rawTokenValue(definition) {
  if (Array.isArray(definition.values)) return definition.values[0]?.value;
  return definition.value;
}

function figmaVariableName(key, type) {
  if (type === "color") return `color/${key.replace(/^color-/, "")}`;
  if (key === "shadow-base") return "shadow/base";
  if (key.startsWith("shadow-")) return `shadow/${key.replace(/^shadow-/, "")}`;
  if (key.startsWith("duration-")) return `motion/duration/${key.replace(/^duration-/, "")}`;
  if (key.startsWith("ease-")) return `motion/ease/${key.replace(/^ease-/, "")}`;
  return key;
}

function figmaResolvedType(type) {
  if (type === "color") return "COLOR";
  if (type === "number") return "FLOAT";
  return "STRING";
}

function modeValue(type, value) {
  if (type !== "number") return value;
  if (typeof value === "number") return value;
  const numeric = Number.parseFloat(String(value));
  return Number.isFinite(numeric) ? numeric : value;
}

function scopesForToken(key, type) {
  if (type !== "color") return [];
  if (["background", "foreground"].includes(key)) return ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
  if (key.includes("foreground")) return ["TEXT_FILL"];
  if (["border", "input", "ring"].includes(key)) return ["STROKE_COLOR"];
  return ["FRAME_FILL", "SHAPE_FILL"];
}

function buildTokenVariables() {
  const tokenDefinitions = readJson("design/tokens.pen").variables ?? {};
  const rootCss = readCssVariables("root");
  const darkCss = readCssVariables("dark");

  return Object.entries(tokenDefinitions).map(([key, definition]) => {
    const cssName = CSS_VAR_BY_TOKEN[key] ?? key;
    const lightValue = rawTokenValue(definition);
    const darkValue = darkCss[cssName] ?? rootCss[cssName] ?? lightValue;
    return {
      name: figmaVariableName(key, definition.type),
      resolvedType: figmaResolvedType(definition.type),
      scopes: scopesForToken(key, definition.type),
      codeSyntax: {
        WEB: `var(--${cssName})`,
      },
      modes: {
        Light: modeValue(definition.type, lightValue),
        Dark: modeValue(definition.type, darkValue),
      },
    };
  });
}

function buildReport() {
  const rootCss = readCssVariables("root");
  const darkCss = readCssVariables("dark");
  const tokenVariables = buildTokenVariables();
  const runtimeColorVariables = RUNTIME_COLOR_VARIABLES.map((variable) => ({
    name: variable.name,
    resolvedType: "COLOR",
    scopes: variable.scopes,
    codeSyntax: { WEB: `var(--${variable.cssName})` },
    modes: {
      Light: rootCss[variable.cssName],
      Dark: darkCss[variable.cssName] ?? rootCss[variable.cssName],
    },
    note: "Runtime CSS semantic color required for component binding; not currently emitted by design/tokens.pen.",
  }));
  const runtimeVariables = [
    {
      name: "radius/base",
      resolvedType: "FLOAT",
      scopes: ["CORNER_RADIUS"],
      codeSyntax: { WEB: "var(--radius)" },
      modes: { Value: 8 },
      note: "Runtime CSS variable required for component corner-radius binding; not currently emitted by design/tokens.pen.",
    },
  ];
  const gunjoTokenVariables = [...tokenVariables, ...runtimeColorVariables];

  return {
    generatedAt: new Date().toISOString(),
    source: {
      tokenSource: "design/tokens.pen",
      runtimeCss: "src/globals.css",
      discovery: "docs/figma-library-discovery.md",
    },
    pages: PAGES,
    collections: [
      {
        name: "Gunjo Tokens",
        modes: ["Light", "Dark"],
        variables: gunjoTokenVariables,
      },
      {
        name: "Gunjo Runtime",
        modes: ["Value"],
        variables: runtimeVariables,
      },
    ],
    textStyles: TEXT_STYLES,
    effectStyles: EFFECT_STYLES,
    summary: {
      pageCount: PAGES.length,
      tokenVariableCount: gunjoTokenVariables.length,
      sourceTokenVariableCount: tokenVariables.length,
      runtimeColorVariableCount: runtimeColorVariables.length,
      runtimeVariableCount: runtimeVariables.length,
      textStyleCount: TEXT_STYLES.length,
      effectStyleCount: EFFECT_STYLES.length,
    },
  };
}

function buildMarkdown(report) {
  const lines = [
    "# Figma Library Foundations Generated Payload",
    "",
    "> Generated by `npm run design:report:figma-foundations`. Do not edit manually.",
    "",
    "## Summary",
    "",
    `- Pages: ${report.summary.pageCount}`,
    `- Gunjo Tokens variables: ${report.summary.tokenVariableCount}`,
    `  - Source token variables: ${report.summary.sourceTokenVariableCount}`,
    `  - Runtime color variables: ${report.summary.runtimeColorVariableCount}`,
    `- Gunjo Runtime variables: ${report.summary.runtimeVariableCount}`,
    `- Text styles: ${report.summary.textStyleCount}`,
    `- Effect styles: ${report.summary.effectStyleCount}`,
    "",
    "## Pages",
    "",
    report.pages.map((page) => `- ${page}`).join("\n"),
    "",
    "## Variable Collections",
    "",
  ];

  for (const collection of report.collections) {
    lines.push(`### ${collection.name}`, "");
    lines.push(`Modes: ${collection.modes.map((mode) => `\`${mode}\``).join(", ")}`, "");
    lines.push("| Name | Type | Scopes | Code syntax |");
    lines.push("| --- | --- | --- | --- |");
    for (const variable of collection.variables) {
      lines.push(
        `| ${variable.name} | ${variable.resolvedType} | ${variable.scopes.map((scope) => `\`${scope}\``).join(", ") || "(hidden)"} | \`${variable.codeSyntax.WEB}\` |`
      );
    }
    lines.push("");
  }

  lines.push("## Text Styles", "");
  for (const style of report.textStyles) {
    lines.push(`- ${style.name}: ${style.fontFamily} ${style.fontStyle}, ${style.fontSize}/${style.lineHeight}`);
  }

  lines.push("", "## Effect Styles", "");
  for (const style of report.effectStyles) {
    lines.push(`- ${style}`);
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

const report = buildReport();
writeJson(OUTPUT_JSON, report);
writeText(OUTPUT_MD, buildMarkdown(report));

console.log(`figma-foundations: wrote ${OUTPUT_JSON}`);
console.log(`figma-foundations: wrote ${OUTPUT_MD}`);
