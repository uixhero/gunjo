import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..", "..");

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function writeJson(path, value) {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function readText(path) {
  return readFileSync(path, "utf-8");
}

export function writeText(path, value) {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, value);
}

export function toRelativePath(root, absolutePath) {
  return absolutePath.replace(`${root}/`, "");
}

export function unique(values) {
  return [...new Set(values)];
}

export function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

export function uniqueSorted(values) {
  return sorted(unique(values));
}

export function findNodeById(obj, id) {
  if (!obj || typeof obj !== "object") return null;
  if (obj.id === id) return obj;

  const children = obj.children;
  if (!Array.isArray(children)) return null;

  for (const child of children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function normalizePadding(padding) {
  if (Array.isArray(padding)) {
    if (padding.length === 2) {
      return [padding[0], padding[1], padding[0], padding[1]];
    }
    if (padding.length === 4) {
      return padding;
    }
  }

  if (typeof padding === "number") {
    return [padding, padding, padding, padding];
  }

  return null;
}

/** Hex to HSL (Tailwind format: "H S% L%") */
export function hexToHsl(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
}
