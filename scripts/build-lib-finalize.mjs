#!/usr/bin/env node
// Finalize the compiled library output in dist/.
//
// 1. Copy the token stylesheet so `@gunjo/ui/styles` resolves inside dist.
// 2. Copy the standalone CSS assets (public/tokens.css, public/patterns.css)
//    so `@gunjo/ui/tokens.css` / `@gunjo/ui/patterns.css` resolve inside dist.
//    These are the same files served at gunjo.jp/tokens.css etc. — public/ is
//    the SSOT (tokens.css is generated from src/globals.css with drift checks,
//    patterns.css is hand-written and token-verified). (#684)
// 3. Emit dist/package.json marking the compiled output as ESM. This scopes
//    `"type": "module"` to dist/ only, so the repo root stays CommonJS-default
//    and tooling like tailwind-preset.js / postcss keep working unchanged.
// 4. Add the file extension to every relative import/export specifier in the
//    emitted .js and .d.ts (`./Button` -> `./Button.js`, `./generated` ->
//    `./generated/index.js`). The source is written for `moduleResolution:
//    "bundler"`, so tsc emits extensionless specifiers, which plain Node ESM
//    (Vitest/Jest node resolution, custom SSR scripts) cannot resolve:
//    ERR_MODULE_NOT_FOUND (#717). Bundlers accept both forms. A specifier that
//    resolves to no emitted file fails the build instead of shipping silently.
//
// tsc preserves each file's leading `"use client"` directive (it is a directive
// prologue), so the RSC client/server boundary survives the compile as-is.
import { copyFileSync, writeFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

if (!existsSync(resolve(dist, "index.js"))) {
  console.error("build-lib-finalize: dist/index.js missing — did tsc emit fail?");
  process.exit(1);
}

// `from "./x"`, `import "./x"`, `import("./x")` (the last also appears in .d.ts
// type references). Only relative specifiers are touched; packages are left to
// their own `exports` maps.
const RELATIVE_SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.\.?\/[^"']*)\2/g;

function listFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...listFiles(path));
    else if (name.endsWith(".js") || name.endsWith(".d.ts")) out.push(path);
  }
  return out;
}

function withExtension(file, specifier, unresolved) {
  if (/\.(m?js|cjs|json|css)$/.test(specifier)) return specifier;
  const base = resolve(dirname(file), specifier);
  if (existsSync(`${base}.js`)) return `${specifier}.js`;
  if (existsSync(join(base, "index.js"))) return `${specifier.replace(/\/$/, "")}/index.js`;
  unresolved.push(`${relative(root, file)}: ${specifier}`);
  return specifier;
}

const unresolved = [];
let rewritten = 0;
for (const file of listFiles(dist)) {
  const source = readFileSync(file, "utf8");
  const next = source.replace(RELATIVE_SPECIFIER, (match, lead, quote, specifier) => {
    const fixed = withExtension(file, specifier, unresolved);
    if (fixed === specifier) return match;
    rewritten += 1;
    return `${lead}${quote}${fixed}${quote}`;
  });
  if (next !== source) writeFileSync(file, next);
}
if (unresolved.length > 0) {
  console.error(
    `build-lib-finalize: ${unresolved.length} relative import(s) resolve to no emitted file:\n  ${unresolved.join("\n  ")}`,
  );
  process.exit(1);
}

copyFileSync(resolve(root, "src/globals.css"), resolve(dist, "globals.css"));

for (const asset of ["tokens.css", "patterns.css"]) {
  const source = resolve(root, "public", asset);
  if (!existsSync(source)) {
    console.error(
      `build-lib-finalize: public/${asset} missing — run \`npm run design:sync\` first (it is a tracked file, so a fresh checkout should already have it)`,
    );
    process.exit(1);
  }
  copyFileSync(source, resolve(dist, asset));
}

writeFileSync(
  resolve(dist, "package.json"),
  JSON.stringify({ type: "module", sideEffects: ["*.css"] }, null, 2) + "\n",
);

console.log(
  `build-lib-finalize: dist/ ready (globals.css + tokens.css + patterns.css copied, ESM package.json written, ${rewritten} relative imports given an extension)`,
);
