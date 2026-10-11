#!/usr/bin/env node
// Guard the heavy-component subpath split (#492).
//
// From 0.2.0 the components in scripts/design-sync/subpath-entries.mjs are
// exported only from `@gunjo/ui/<entry>` and their dependency is an optional
// peer. That only holds while all of these stay true, so each is checked:
//
// 1. package.json — every entry has an `exports` subpath pointing at
//    dist/entries/<name>, and every listed dependency is an optional peer
//    (peerDependencies + peerDependenciesMeta.optional), not a dependency, and
//    a devDependency (the docs site itself still renders these components).
// 2. Root closure — no file the root barrel (src/index.ts) reaches through
//    relative imports imports an optional peer, type-only imports included
//    (a type import still lands in dist/index.d.ts). Otherwise a root
//    `import { Button } from "@gunjo/ui"` breaks for adopters who did not
//    install the peer.
// 3. Docs snippets — no code under app/ or docs/ (real imports and the code
//    samples shown on docs pages) imports a subpath-only name from the root.
//    Real imports also fail type-check; code samples inside strings do not.
//    app/data/ is skipped: cold-test records keep the code as it was written.
//
//   node scripts/design-verify-subpath-entries.mjs
//   node scripts/design-verify-subpath-entries.mjs --self-test
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { ROOT } from "./design-sync/shared.mjs";
import { OPTIONAL_PEER_DEPENDENCIES, SUBPATH_ENTRIES } from "./design-sync/subpath-entries.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)["']([^"']+)["']/g;
const ROOT_NAMED_IMPORT = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*\\?["'`]@gunjo\/ui\\?["'`]/g;
const SNIPPET_SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".git", "data"]);

function isPeer(specifier, peers) {
  return peers.some((peer) => specifier === peer || specifier.startsWith(`${peer}/`));
}

function resolveRelative(fromFile, specifier, fileExists) {
  const base = resolve(dirname(fromFile), specifier);
  return [`${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")].find(fileExists) ?? null;
}

/**
 * Walk relative imports from `entryFile` and report every reached file that
 * imports one of `peers`, with the import chain that reaches it.
 */
export function findPeerImportsReachableFrom(entryFile, { readFile, fileExists, peers }) {
  const findings = [];
  const seen = new Set();
  const queue = [[entryFile, [entryFile]]];
  while (queue.length > 0) {
    const [file, chain] = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    const source = readFile(file);
    for (const match of source.matchAll(SPECIFIER)) {
      const specifier = match[1];
      if (specifier.startsWith(".")) {
        const target = resolveRelative(file, specifier, fileExists);
        if (target && !seen.has(target)) queue.push([target, [...chain, target]]);
      } else if (isPeer(specifier, peers)) {
        findings.push({ file, specifier, chain });
      }
    }
  }
  return findings;
}

function exportedNames(componentSource) {
  const names = new Set();
  for (const m of componentSource.matchAll(
    /export\s+(?:declare\s+)?(?:const|let|function|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/g
  )) {
    names.add(m[1]);
  }
  for (const m of componentSource.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop();
      if (name) names.add(name);
    }
  }
  return names;
}

/** name -> entry name, for everything a subpath entry exports. */
export function subpathOnlyNames(root) {
  const owner = new Map();
  for (const entry of SUBPATH_ENTRIES) {
    for (const component of entry.components) {
      const source = readFileSync(join(root, "src/components", `${component}.tsx`), "utf8");
      for (const name of exportedNames(source)) owner.set(name, entry.name);
    }
    for (const line of entry.extraExports) {
      for (const name of exportedNames(line)) owner.set(name, entry.name);
    }
  }
  return owner;
}

/** Root-barrel imports (real or inside a code sample) that name a subpath-only export. */
export function findRootImportsOfSubpathNames(source, owner) {
  const findings = [];
  for (const match of source.matchAll(ROOT_NAMED_IMPORT)) {
    for (const part of match[1].split(",")) {
      const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0];
      if (name && owner.has(name)) findings.push({ name, entry: owner.get(name) });
    }
  }
  return findings;
}

function listSnippetFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SNIPPET_SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) listSnippetFiles(path, out);
    else if (/\.(tsx?|mdx?)$/.test(name)) out.push(path);
  }
  return out;
}

function verifyPackageJson(root, errors) {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  for (const entry of SUBPATH_ENTRIES) {
    const target = pkg.exports?.[`./${entry.name}`];
    const types = `./dist/entries/${entry.name}.d.ts`;
    const js = `./dist/entries/${entry.name}.js`;
    if (!target || target.types !== types || target.default !== js) {
      errors.push(`package.json exports["./${entry.name}"] must be { "types": "${types}", "default": "${js}" }`);
    }
    if (!existsSync(join(root, "src/entries", `${entry.name}.ts`))) {
      errors.push(`src/entries/${entry.name}.ts is missing — run \`npm run design:sync:components\``);
    }
  }
  for (const dep of OPTIONAL_PEER_DEPENDENCIES) {
    if (pkg.dependencies?.[dep]) errors.push(`${dep} is in dependencies — subpath-only deps must be optional peers`);
    if (!pkg.peerDependencies?.[dep]) errors.push(`${dep} is missing from peerDependencies`);
    if (pkg.peerDependenciesMeta?.[dep]?.optional !== true) {
      errors.push(`${dep} must be marked { "optional": true } in peerDependenciesMeta`);
    }
    if (!pkg.devDependencies?.[dep]) errors.push(`${dep} is missing from devDependencies (the docs site renders it)`);
  }
}

export function verifySubpathEntries({ root = ROOT } = {}) {
  const errors = [];
  verifyPackageJson(root, errors);

  const closure = findPeerImportsReachableFrom(join(root, "src/index.ts"), {
    readFile: (file) => readFileSync(file, "utf8"),
    fileExists: existsSync,
    peers: OPTIONAL_PEER_DEPENDENCIES,
  });
  for (const { specifier, chain } of closure) {
    errors.push(
      `the root barrel reaches "${specifier}" (an optional peer): ${chain.map((file) => relative(root, file)).join(" -> ")}`
    );
  }

  const owner = subpathOnlyNames(root);
  for (const dir of ["app", "docs"]) {
    for (const file of listSnippetFiles(join(root, dir))) {
      for (const { name, entry } of findRootImportsOfSubpathNames(readFileSync(file, "utf8"), owner)) {
        errors.push(`${relative(root, file)}: imports ${name} from "@gunjo/ui" — it is exported only from "@gunjo/ui/${entry}"`);
      }
    }
  }

  if (errors.length > 0) {
    throwLinesError([
      "design:verify: heavy-component subpath split (#492) is broken:",
      ...errors.map((error) => `- ${error}`),
      "The SSOT is scripts/design-sync/subpath-entries.mjs.",
    ]);
  }
}

function selfTest() {
  // 1. A light component that starts importing a heavy peer must be caught
  //    through the barrel, including via a type-only import.
  const files = {
    "/r/src/index.ts": "export * from './components/Button';\nexport * from './components/Card';\n",
    "/r/src/components/Button.tsx": "import { cn } from '../lib/utils'\nexport const Button = 1\n",
    "/r/src/components/Card.tsx": "import type { ColumnDef } from \"@tanstack/react-table\"\nexport const Card = 1\n",
    "/r/src/lib/utils.ts": "import { motion } from 'framer-motion/dom'\nexport const cn = 1\n",
  };
  const found = findPeerImportsReachableFrom("/r/src/index.ts", {
    readFile: (file) => files[file],
    fileExists: (file) => file in files,
    peers: OPTIONAL_PEER_DEPENDENCIES,
  }).map((finding) => finding.specifier).sort();
  const expected = ["@tanstack/react-table", "framer-motion/dom"];
  if (JSON.stringify(found) !== JSON.stringify(expected)) {
    console.error("design-verify-subpath-entries --self-test: closure check FAILED", { found, expected });
    process.exit(1);
  }

  // 2. A docs code sample (inside a template string) that imports a subpath-only
  //    name from the root must be caught; the subpath form must pass.
  const owner = new Map([["DataTable", "table"], ["ColumnDef", "table"]]);
  const bad = findRootImportsOfSubpathNames('const code = `import { Button, DataTable, type ColumnDef } from "@gunjo/ui"`', owner);
  const good = findRootImportsOfSubpathNames('const code = `import { DataTable } from "@gunjo/ui/table"`', owner);
  if (bad.length !== 2 || good.length !== 0) {
    console.error("design-verify-subpath-entries --self-test: snippet check FAILED", { bad, good });
    process.exit(1);
  }
  console.log("design-verify-subpath-entries --self-test: ok (peer reached via the barrel and a root import of DataTable are both caught)");
}

if (process.argv.includes("--self-test") && process.argv[1]?.endsWith("design-verify-subpath-entries.mjs")) {
  selfTest();
} else {
  runVerificationCli({
    scriptName: "design-verify-subpath-entries.mjs",
    verify: () => verifySubpathEntries({ root: ROOT }),
    successMessage: `design:verify:subpath-entries: passed (${SUBPATH_ENTRIES.length} entries, ${OPTIONAL_PEER_DEPENDENCIES.length} optional peers)`,
  });
}
