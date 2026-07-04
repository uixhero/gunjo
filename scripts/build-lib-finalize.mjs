#!/usr/bin/env node
// Finalize the compiled library output in dist/.
//
// 1. Copy the token stylesheet so `@gunjo/ui/styles` resolves inside dist.
// 2. Emit dist/package.json marking the compiled output as ESM. This scopes
//    `"type": "module"` to dist/ only, so the repo root stays CommonJS-default
//    and tooling like tailwind-preset.js / postcss keep working unchanged.
//
// tsc preserves each file's leading `"use client"` directive (it is a directive
// prologue), so the RSC client/server boundary survives the compile as-is.
import { copyFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

if (!existsSync(resolve(dist, "index.js"))) {
  console.error("build-lib-finalize: dist/index.js missing — did tsc emit fail?");
  process.exit(1);
}

copyFileSync(resolve(root, "src/globals.css"), resolve(dist, "globals.css"));

writeFileSync(
  resolve(dist, "package.json"),
  JSON.stringify({ type: "module", sideEffects: ["*.css"] }, null, 2) + "\n",
);

console.log("build-lib-finalize: dist/ ready (globals.css copied, ESM package.json written)");
