#!/usr/bin/env node
/**
 * Generate the WebP asset tiers consumed by /cold-tests pages.
 *
 * For each round we ship:
 *   - desktop.webp       (600px wide)     — grid card thumbnail
 *   - desktop.lg.webp    (1400px wide)    — detail page hero, retina-sharp
 *   - desktop.full.webp  (~2880px wide)   — MediaLightbox full view
 *   - mobile.webp        (375px wide)     — grid mobile preview
 *   - mobile.lg.webp     (750px wide)     — detail in-frame + lightbox
 *
 * Source PNGs are full-page Playwright captures (2880×3776+ desktop,
 * 750×8000+ mobile). cwebp at q85 gives 5-7x smaller files than PNG with
 * no perceptible quality loss for UI screenshots.
 *
 * Requires `cwebp` on PATH. Install with: `brew install webp`.
 *
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
const QUALITY = 85;

// kind: source viewport, suffix: output filename qualifier (empty = grid),
// width: 0 means use the source's native width (no resize — the source IS
// already at retina resolution for that viewport).
// WebP's hard limit per side. Sources longer than this are scaled to fit
// (see the native-width branch below) rather than dropped.
const WEBP_MAX_SIDE = 16383;

/** Read a PNG's pixel dimensions from its IHDR header (no image library). */
function pngSize(file) {
    const head = Buffer.alloc(24);
    const fd = fs.openSync(file, "r");
    try {
        fs.readSync(fd, head, 0, 24, 0);
    } finally {
        fs.closeSync(fd);
    }
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

const VARIANTS = [
    { kind: "desktop", suffix: "", width: 600 },
    { kind: "desktop", suffix: ".lg", width: 1400 },
    { kind: "desktop", suffix: ".full", width: 0 },
    { kind: "mobile", suffix: "", width: 375 },
    { kind: "mobile", suffix: ".lg", width: 0 },
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

try {
    execFileSync("cwebp", ["-version"], { stdio: ["ignore", "ignore", "ignore"] });
} catch {
    console.error("cwebp not found on PATH.");
    console.error("Install it once with: brew install webp");
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
fs.mkdirSync(SHOTS_OUT, { recursive: true });

const stats = {};
for (const v of VARIANTS) {
    const key = `${v.kind}${v.suffix}`;
    stats[key] = { written: 0, skipped: 0, missing: 0 };
}

for (const entry of data.entries) {
    for (const v of VARIANTS) {
        const key = `${v.kind}${v.suffix}`;
        const s = stats[key];
        if (!entry.shots[v.kind]) {
            s.missing++;
            continue;
        }
        const src = path.join(SHOTS_IN, `${entry.slug}.${v.kind}.png`);
        const dst = path.join(SHOTS_OUT, `${entry.slug}.${v.kind}${v.suffix}.webp`);
        if (!fs.existsSync(src)) {
            s.missing++;
            continue;
        }
        if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) {
            s.skipped++;
            continue;
        }
        const args = ["-q", String(QUALITY), "-mt"];
        if (v.width > 0) args.push("-resize", String(v.width), "0");
        else {
            // WebP tops out at 16383px per side. Full-page captures of long
            // business screens go past that (a 375px round can be 23,000px
            // tall at 2x), and cwebp fails with BAD_DIMENSION after creating
            // an empty file. Scale the native variant down to fit instead of
            // losing the shot.
            const { width: sw, height: sh } = pngSize(src);
            if (sh > WEBP_MAX_SIDE || sw > WEBP_MAX_SIDE) {
                const scale = WEBP_MAX_SIDE / Math.max(sw, sh);
                args.push("-resize", String(Math.floor(sw * scale)), "0");
                s.clamped = (s.clamped ?? 0) + 1;
            }
        }
        args.push(src, "-o", dst);
        // cwebp writes a verbose summary to stderr per file even on success;
        // swallow it so the script output stays readable. On failure
        // re-throw with the source path so the offending file is obvious.
        try {
            execFileSync("cwebp", args, { stdio: ["ignore", "ignore", "pipe"] });
        } catch (err) {
            const stderr = err.stderr ? err.stderr.toString() : "";
            throw new Error(`cwebp failed on ${src} → ${dst}\nargs: ${args.join(" ")}\n${stderr}`);
        }
        s.written++;
    }
}

console.log(`cold-test thumbs → ${path.relative(ROOT, SHOTS_OUT)}/ (WebP q${QUALITY})`);
for (const v of VARIANTS) {
    const key = `${v.kind}${v.suffix}`;
    const s = stats[key];
    const widthLabel = v.width === 0 ? "native" : `${v.width}px`;
    console.log(
        `  ${key.padEnd(14)} (${widthLabel.padStart(7)}): written=${s.written} skipped=${s.skipped} missing=${s.missing}` +
            (s.clamped ? ` clamped=${s.clamped}` : "")
    );
}
