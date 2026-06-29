#!/usr/bin/env node
/**
 * Resize the desktop cold-test screenshots from `promotion/` into
 * grid-friendly thumbnails committed to `public/cold-test-shots/`.
 *
 * The source PNGs are full-page Playwright captures (2880×3776+) at
 * ~534KB each. We resize the width to 600px (height preserved) so the
 * grid card can use `object-cover object-top` to show the above-fold
 * portion, mirroring how `public/patterns-thumbs/` is consumed.
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
const TARGET_WIDTH = 600;

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

let resized = 0;
let skipped = 0;
let missing = 0;
const missingSlugs = [];

for (const entry of data.entries) {
    if (!entry.shots.desktop) {
        missing++;
        missingSlugs.push(`#${entry.round} ${entry.slug}`);
        continue;
    }
    const src = path.join(SHOTS_IN, `${entry.slug}.desktop.png`);
    const dst = path.join(SHOTS_OUT, `${entry.slug}.desktop.png`);
    if (!fs.existsSync(src)) {
        missing++;
        missingSlugs.push(`#${entry.round} ${entry.slug} (data says present but file missing)`);
        continue;
    }
    // Skip if destination is newer than source — cheap incremental rebuild.
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) {
        skipped++;
        continue;
    }
    execFileSync(
        "sips",
        ["--resampleWidth", String(TARGET_WIDTH), src, "--out", dst],
        { stdio: ["ignore", "ignore", "inherit"] }
    );
    resized++;
}

console.log(`cold-test thumbs → ${path.relative(ROOT, SHOTS_OUT)}/`);
console.log(`  resized: ${resized}`);
console.log(`  skipped (up to date): ${skipped}`);
console.log(`  missing source: ${missing}`);
if (missingSlugs.length && missingSlugs.length <= 10) {
    for (const s of missingSlugs) console.log(`    - ${s}`);
}
