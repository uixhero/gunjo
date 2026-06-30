#!/usr/bin/env node
/**
 * Resize cold-test screenshots from `promotion/` into grid- and
 * detail-page-friendly thumbnails committed to `public/cold-test-shots/`.
 *
 * Source PNGs are full-page Playwright captures (2880×3776+ desktop,
 * 750×8000+ mobile). We resample by width:
 *   - desktop → 600px wide  (grid card + detail hero, retina-OK)
 *   - mobile  → 375px wide  (detail mobile preview at native viewport)
 *
 * Uses `sips` (macOS built-in) so no extra dev dependency is needed.
 *
 * Reads which slugs to process from `app/data/cold-test-gallery.json`.
 * From a worktree (where `promotion/` lives in the main checkout):
 *
 *   GUNJO_PROMOTION_DIR=~/dev/gunjo/promotion node scripts/build-coldtest-thumbs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROMO = process.env.GUNJO_PROMOTION_DIR
    ? path.resolve(process.env.GUNJO_PROMOTION_DIR)
    : path.join(ROOT, "promotion");
const SHOTS_IN = path.join(PROMO, "cold-test-screens", "shots");
const SHOTS_OUT = path.join(ROOT, "public", "cold-test-shots");
const DATA = path.join(ROOT, "app", "data", "cold-test-gallery.json");

const VIEWPORTS = [
    { kind: "desktop", width: 600 },
    { kind: "mobile", width: 375 },
];

if (!fs.existsSync(SHOTS_IN)) {
    console.error(`screenshots not found at ${SHOTS_IN}`);
    console.error(`Set GUNJO_PROMOTION_DIR to the absolute path of your promotion/ folder.`);
    process.exit(1);
}
if (!fs.existsSync(DATA)) {
    console.error(`run \`npm run coldtest-gallery:snapshot\` first — ${DATA} missing.`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
fs.mkdirSync(SHOTS_OUT, { recursive: true });

const stats = {};
for (const v of VIEWPORTS) stats[v.kind] = { resized: 0, skipped: 0, missing: 0 };

for (const entry of data.entries) {
    for (const v of VIEWPORTS) {
        const s = stats[v.kind];
        if (!entry.shots[v.kind]) {
            s.missing++;
            continue;
        }
        const src = path.join(SHOTS_IN, `${entry.slug}.${v.kind}.png`);
        const dst = path.join(SHOTS_OUT, `${entry.slug}.${v.kind}.png`);
        if (!fs.existsSync(src)) {
            s.missing++;
            continue;
        }
        if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) {
            s.skipped++;
            continue;
        }
        execFileSync(
            "sips",
            ["--resampleWidth", String(v.width), src, "--out", dst],
            { stdio: ["ignore", "ignore", "inherit"] }
        );
        s.resized++;
    }
}

console.log(`cold-test thumbs → ${path.relative(ROOT, SHOTS_OUT)}/`);
for (const v of VIEWPORTS) {
    const s = stats[v.kind];
    console.log(`  ${v.kind} (${v.width}px): resized=${s.resized} skipped=${s.skipped} missing=${s.missing}`);
}
