#!/usr/bin/env node
/**
 * Per-round detail snapshot for /cold-tests/[round] pages.
 *
 * For each of the 170 rounds, emits `app/data/cold-test-rounds/<round>.json`
 * containing:
 *   - meta:      route, slug, score, category, title, summary
 *   - article:   full markdown body of zenn-yattemita-NN-*.md
 *   - code:      [{ file, language, source }] read from gunjo-test/app/<route>/
 *   - components: unique @gunjo/ui imports referenced across the route's files
 *   - shots:     desktop/mobile presence flags
 *   - overwrittenBy: round number that later reused this route (code lost), or null
 *
 * Two routes were reused across rounds in the cold-test app — the live source
 * only reflects the LATER round, so the earlier one's code is irretrievably
 * gone. We disclose this on the detail page rather than show wrong code.
 *
 * Requires both:
 *   GUNJO_PROMOTION_DIR — promotion/ folder (default: <root>/promotion)
 *   GUNJO_COLDTEST_APP_DIR — gunjo-test/app/ folder (default: <root>/../gunjo-test/app)
 *
 * Example (worktree):
 *   GUNJO_PROMOTION_DIR=~/dev/gunjo/promotion \
 *   GUNJO_COLDTEST_APP_DIR=~/dev/gunjo-test/app \
 *     node scripts/build-coldtest-rounds.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROMO = process.env.GUNJO_PROMOTION_DIR
    ? path.resolve(process.env.GUNJO_PROMOTION_DIR)
    : path.join(ROOT, "promotion");
const APP = process.env.GUNJO_COLDTEST_APP_DIR
    ? path.resolve(process.env.GUNJO_COLDTEST_APP_DIR)
    : path.resolve(ROOT, "..", "gunjo-test", "app");
const SHOTS = path.join(PROMO, "cold-test-screens", "shots");
const GALLERY = path.join(ROOT, "app", "data", "cold-test-gallery.json");
const OUT_DIR = path.join(ROOT, "app", "data", "cold-test-rounds");

if (!fs.existsSync(GALLERY)) {
    console.error(`run \`npm run coldtest-gallery:snapshot\` first — ${GALLERY} missing.`);
    process.exit(1);
}
if (!fs.existsSync(PROMO)) {
    console.error(`promotion/ not found at ${PROMO}`);
    console.error(`Set GUNJO_PROMOTION_DIR.`);
    process.exit(1);
}
if (!fs.existsSync(APP)) {
    console.error(`gunjo-test/app/ not found at ${APP}`);
    console.error(`Set GUNJO_COLDTEST_APP_DIR.`);
    process.exit(1);
}

const gallery = JSON.parse(fs.readFileSync(GALLERY, "utf8"));

// Two cold-test routes were captured at multiple rounds; the later round
// overwrote the earlier round's source. Record overwrittenBy so the detail
// page can disclose code loss honestly instead of showing later code.
const reuseMap = new Map();
{
    const byRoute = new Map();
    for (const e of gallery.entries) {
        if (!byRoute.has(e.route)) byRoute.set(e.route, []);
        byRoute.get(e.route).push(e.round);
    }
    for (const [, rounds] of byRoute) {
        if (rounds.length < 2) continue;
        rounds.sort((a, b) => a - b);
        const latest = rounds[rounds.length - 1];
        for (const r of rounds) {
            if (r !== latest) reuseMap.set(r, latest);
        }
    }
}

function languageOf(file) {
    if (file.endsWith(".tsx")) return "tsx";
    if (file.endsWith(".ts")) return "ts";
    if (file.endsWith(".css")) return "css";
    if (file.endsWith(".json")) return "json";
    return "text";
}

function readRouteCode(route) {
    const dir = path.join(APP, route.replace(/^\//, ""));
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
    const out = [];
    // Direct children only — sub-directories under a route belong to a
    // DIFFERENT round in the cold-test app (e.g. /settings/notifications
    // is #19, not #1). Recursing would leak that round's source into the
    // parent route's detail page.
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!ent.isFile()) continue;
        if (!/\.(tsx?|css)$/.test(ent.name)) continue;
        out.push({
            file: ent.name,
            language: languageOf(ent.name),
            source: fs.readFileSync(path.join(dir, ent.name), "utf8"),
        });
    }
    // page.tsx first; otherwise alphabetical.
    out.sort((a, b) => {
        const ap = a.file.endsWith("page.tsx") ? 0 : 1;
        const bp = b.file.endsWith("page.tsx") ? 0 : 1;
        return ap - bp || a.file.localeCompare(b.file);
    });
    return out;
}

function componentsFrom(codeFiles) {
    const set = new Set();
    const re = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["']@gunjo\/ui["']/g;
    for (const f of codeFiles) {
        let m;
        while ((m = re.exec(f.source))) {
            for (const raw of m[1].split(",")) {
                const name = raw
                    .trim()
                    .replace(/^type\s+/, "")
                    .split(/\s+as\s+/)[0]
                    .trim();
                // Skip lowercase identifiers (utilities like cn, formatCurrency).
                // Component docs are titlecase-routed; surfacing utilities mixed
                // in would dilute the "components used" list.
                if (name && /^[A-Z]/.test(name)) set.add(name);
            }
        }
    }
    return [...set].sort();
}

function readArticleBody(articleFile) {
    if (!articleFile) return "";
    const p = path.join(PROMO, articleFile);
    if (!fs.existsSync(p)) return "";
    return fs.readFileSync(p, "utf8");
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let codePresent = 0;
let codeMissing = 0;
let withMobile = 0;

for (const entry of gallery.entries) {
    const overwrittenBy = reuseMap.get(entry.round) ?? null;
    // Only read code for the LATEST occurrence of a reused route; older rounds
    // get an empty `code` array and an overwrittenBy pointer for the disclosure.
    const code = overwrittenBy ? [] : readRouteCode(entry.route);
    const components = componentsFrom(code);
    const article = readArticleBody(entry.article?.file);

    const detail = {
        round: entry.round,
        route: entry.route,
        slug: entry.slug,
        score: entry.score,
        category: entry.category,
        title: entry.title,
        readmeTitle: entry.readmeTitle,
        summary: entry.summary,
        article: entry.article
            ? { file: entry.article.file, slug: entry.article.slug, markdown: article }
            : null,
        code,
        components,
        shots: entry.shots,
        overwrittenBy,
    };

    fs.writeFileSync(
        path.join(OUT_DIR, `${entry.round}.json`),
        JSON.stringify(detail, null, 2) + "\n"
    );
    written++;
    if (code.length > 0) codePresent++;
    else codeMissing++;
    if (entry.shots.mobile) withMobile++;
}

console.log(`cold-test rounds → ${path.relative(ROOT, OUT_DIR)}/`);
console.log(`  rounds written:    ${written}`);
console.log(`  with source code:  ${codePresent}`);
console.log(`  code unavailable:  ${codeMissing} (route reuse or directory missing)`);
console.log(`  with mobile shot:  ${withMobile}`);
