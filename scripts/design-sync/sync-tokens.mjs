import { join } from "node:path";
import { ROOT, hexToHsl, readJson, readText, writeText } from "./shared.mjs";

const VAR_MAP = {
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
  info: "color-info",
  success: "color-success",
  warning: "color-warning",
  radius: "radius",
  "shadow-sm": "shadow-sm",
  shadow: "shadow-base",
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

const TOKEN_OVERRIDES = {
  destructive: "0 72% 51%",
  "muted-foreground": "215 20% 40%",
};

function resolveCssVars(variables) {
  const cssVars = {};

  for (const [key, def] of Object.entries(variables || {})) {
    if (!def || typeof def !== "object") continue;
    const value = Array.isArray(def.values) ? def.values[0]?.value : def.value;
    if (value === undefined) continue;

    if (def.type === "color" && typeof value === "string") {
      const hsl = hexToHsl(value);
      if (hsl) cssVars[key] = hsl;
    } else if (def.type === "number" && typeof value === "number") {
      cssVars[key] = key.startsWith("duration-") ? `${value}ms` : `${value / 16}rem`;
    } else if (def.type === "string" && typeof value === "string") {
      if (key.startsWith("shadow-") || key.startsWith("ease-")) {
        cssVars[key] = value;
      }
    }
  }

  const resolved = {};
  for (const [cssKey, penKey] of Object.entries(VAR_MAP)) {
    if (cssVars[penKey] !== undefined) {
      resolved[cssKey] = cssVars[penKey];
    }
  }
  return { ...resolved, ...TOKEN_OVERRIDES };
}

function replaceOrInsertCssVar(globalsCss, key, value) {
  const prop = key === "radius" ? "--radius" : `--${key}`;
  const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped}:\\s*)[^;]+`);
  const replacement = `$1${value}`;

  if (globalsCss.includes(prop)) {
    return globalsCss.replace(regex, replacement);
  }

  const rootMatch = globalsCss.match(/:root\s*\{/);
  if (!rootMatch) return globalsCss;

  const insertPoint = globalsCss.indexOf(rootMatch[0]) + rootMatch[0].length;
  return (
    globalsCss.slice(0, insertPoint) +
    `\n        ${prop}: ${value};` +
    globalsCss.slice(insertPoint)
  );
}

export function syncTokens({ root = ROOT } = {}) {
  const tokensPath = join(root, "design", "tokens.pen");
  const globalsPath = join(root, "src", "globals.css");

  const tokens = readJson(tokensPath);
  const resolved = resolveCssVars(tokens.variables);
  let globalsCss = readText(globalsPath);

  for (const [key, value] of Object.entries(resolved)) {
    globalsCss = replaceOrInsertCssVar(globalsCss, key, value);
  }

  writeText(globalsPath, globalsCss);
  console.log("design:sync: Updated globals.css from tokens.pen");
}
