#!/usr/bin/env node
/**
 * Generates per-component embed pages under `app/embed/<category>/<name>/page.tsx`
 * and patches the corresponding `app/docs/components/<category>/<name>/page.tsx`
 * to pass `embedSrc="/embed/<category>/<name>"` to its <ComponentPreview>.
 *
 * The embed page renders just the demo component (no docs chrome) so that the
 * preview iframe in tablet/mobile mode resolves Tailwind responsive prefixes
 * (md:/lg:) against the iframe's own viewport width instead of the parent.
 *
 * Idempotent: re-running skips pages that already have `embedSrc=`.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DOCS_DIR = join(ROOT, "app", "docs", "components");
const EMBED_DIR = join(ROOT, "app", "embed");

const DEMO_IMPORT_RE = /import\s*\{\s*([^}]+?)\s*\}\s*from\s*["']@\/components\/demos\/([^"']+)["']/g;

function walkPages(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) out.push(...walkPages(full));
        else if (name === "page.tsx") out.push(full);
    }
    return out;
}

function findPreviewBlock(src) {
    const startMatch = /<ComponentPreview\b/.exec(src);
    if (!startMatch) return null;
    const start = startMatch.index;
    let depth = 0;
    let i = start;
    while (i < src.length) {
        if (src.startsWith("<ComponentPreview", i)) {
            depth++;
            i += "<ComponentPreview".length;
        } else if (src.startsWith("</ComponentPreview>", i)) {
            depth--;
            i += "</ComponentPreview>".length;
            if (depth === 0) return src.slice(start, i);
        } else {
            i++;
        }
    }
    return null;
}

function parseDemoImports(src) {
    const map = new Map();
    DEMO_IMPORT_RE.lastIndex = 0;
    for (const m of src.matchAll(DEMO_IMPORT_RE)) {
        const names = m[1].split(",").map((s) => s.trim()).filter(Boolean);
        const source = m[2];
        for (const name of names) {
            map.set(name, source);
        }
    }
    return map;
}

function pickDemoFromBlock(block, demoMap) {
    for (const name of demoMap.keys()) {
        if (new RegExp(`<${name}\\b`).test(block)) return name;
    }
    return null;
}

function generateEmbed({ slug, demoName, demoSource }) {
    const target = join(EMBED_DIR, slug, "page.tsx");
    mkdirSync(dirname(target), { recursive: true });
    const isFullBleed = slug.startsWith("templates/") || slug.startsWith("organisms/");
    const inner = isFullBleed
        ? `<${demoName} />`
        : `<div className="flex min-h-screen items-center justify-center p-4">
            <${demoName} />
        </div>`;
    const body = `"use client";

import { ${demoName} } from "@/components/demos/${demoSource}";

export default function Embed() {
    return (
        ${inner}
    );
}
`;
    writeFileSync(target, body);
}

function patchDocsPage(file, slug) {
    const src = readFileSync(file, "utf8");
    if (/embedSrc\s*=/.test(src)) return { patched: false, reason: "already has embedSrc" };
    const patched = src.replace(
        /<ComponentPreview\b/,
        `<ComponentPreview embedSrc="/embed/${slug}"`
    );
    if (patched === src) return { patched: false, reason: "no ComponentPreview replaced" };
    writeFileSync(file, patched);
    return { patched: true };
}

function run() {
    const pages = walkPages(DOCS_DIR);
    const summary = { generated: [], patched: [], skipped: [] };

    for (const file of pages) {
        const slug = relative(DOCS_DIR, dirname(file)).replace(/\\/g, "/");
        const src = readFileSync(file, "utf8");

        const previewBlock = findPreviewBlock(src);
        if (!previewBlock) {
            summary.skipped.push({ slug, reason: "no <ComponentPreview>" });
            continue;
        }

        const demoMap = parseDemoImports(src);
        if (demoMap.size === 0) {
            summary.skipped.push({ slug, reason: "no demo import" });
            continue;
        }

        const demoName = pickDemoFromBlock(previewBlock, demoMap);
        if (!demoName) {
            summary.skipped.push({ slug, reason: "no demo usage in preview block" });
            continue;
        }

        const demoSource = demoMap.get(demoName);
        generateEmbed({ slug, demoName, demoSource });
        summary.generated.push({ slug, demoName, demoSource });

        const patchResult = patchDocsPage(file, slug);
        if (patchResult.patched) summary.patched.push(slug);
    }

    console.log(`Generated ${summary.generated.length} embed pages.`);
    console.log(`Patched ${summary.patched.length} docs pages.`);
    if (summary.skipped.length) {
        console.log(`Skipped ${summary.skipped.length}:`);
        for (const s of summary.skipped) console.log(`  - ${s.slug}: ${s.reason}`);
    }
}

run();
