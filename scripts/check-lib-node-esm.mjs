#!/usr/bin/env node
// Import every JS entry of the built library (dist/) with plain Node ESM — no
// bundler — and fail if any of them cannot be loaded. This is the #717 class:
// tsc emits extensionless relative specifiers (`./Button`), bundlers accept
// them, Node ESM does not (ERR_MODULE_NOT_FOUND). build-lib-finalize.mjs adds
// the extensions; this check proves the result loads.
//
// Entries are read from package.json `exports`, so a new subpath is covered
// without editing this file. Run after `npm run build:lib`.
//
//   node scripts/check-lib-node-esm.mjs             # check dist/
//   node scripts/check-lib-node-esm.mjs --self-test # prove the check catches #717
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function tryImport(file) {
  try {
    const mod = await import(pathToFileURL(file).href);
    return { ok: true, count: Object.keys(mod).length };
  } catch (error) {
    return { ok: false, code: error.code ?? error.name, message: String(error.message).split("\n")[0] };
  }
}

function jsEntries() {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const entries = [];
  for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
    const file = typeof target === "string" ? target : target.default ?? target.import;
    if (typeof file === "string" && file.startsWith("./dist/") && file.endsWith(".js")) {
      entries.push({ subpath, file: join(root, file) });
    }
  }
  return entries;
}

async function selfTest() {
  // The shape tsc produced before #717: an ESM package whose barrel re-exports
  // an extensionless relative path. The check must report it as a failure.
  const dir = mkdtempSync(join(tmpdir(), "gunjo-node-esm-"));
  try {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module" }));
    writeFileSync(join(dir, "a.js"), "export const a = 1;\n");
    writeFileSync(join(dir, "broken.js"), "export * from './a';\n");
    writeFileSync(join(dir, "fixed.js"), "export * from './a.js';\n");
    const broken = await tryImport(join(dir, "broken.js"));
    const fixed = await tryImport(join(dir, "fixed.js"));
    if (broken.ok || broken.code !== "ERR_MODULE_NOT_FOUND" || !fixed.ok) {
      console.error("check-lib-node-esm --self-test: FAILED", { broken, fixed });
      process.exit(1);
    }
    console.log("check-lib-node-esm --self-test: ok (extensionless import is caught, .js import passes)");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (process.argv.includes("--self-test")) {
  await selfTest();
} else {
  const entries = jsEntries();
  if (entries.length === 0) {
    console.error("check-lib-node-esm: no ./dist/*.js entries in package.json exports");
    process.exit(1);
  }
  let failed = 0;
  for (const { subpath, file } of entries) {
    const result = await tryImport(file);
    if (result.ok) {
      console.log(`  ok   ${subpath} (${result.count} exports)`);
    } else {
      failed += 1;
      console.log(`  FAIL ${subpath}: ${result.code} ${result.message}`);
    }
  }
  if (failed > 0) {
    console.error(`check-lib-node-esm: ${failed} of ${entries.length} entries do not load in plain Node ESM (run \`npm run build:lib\` first)`);
    process.exit(1);
  }
  console.log(`check-lib-node-esm: all ${entries.length} entries load in plain Node ESM`);
}
