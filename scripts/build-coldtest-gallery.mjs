#!/usr/bin/env node
/**
 * Snapshot the cold-test gallery (170 rounds) into a committed JSON file
 * that gunjo.jp can ship without a runtime dependency on the gitignored
 * `promotion/` folder.
 *
 * Source of truth lives in three places under `promotion/`:
 *   1. `cold-test-screens/README.md`     — route table (round / route / title / score)
 *   2. `zenn-yattemita-NN-*.md`          — per-round article drafts (H1 + summary)
 *   3. `cold-test-screens/shots/*.png`   — screenshot presence (desktop / mobile / .en)
 *
 * Output: `app/data/cold-test-gallery.json` — flat array of 170 entries.
 *
 * Promotion is local-only. To run from a worktree (where `promotion/` lives
 * in the main checkout), point GUNJO_PROMOTION_DIR at the real folder:
 *
 *   GUNJO_PROMOTION_DIR=~/dev/gunjo/promotion node scripts/build-coldtest-gallery.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES, categoryOf } from "./coldtest-category-map.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROMO = process.env.GUNJO_PROMOTION_DIR
    ? path.resolve(process.env.GUNJO_PROMOTION_DIR)
    : path.join(ROOT, "promotion");
const README = path.join(PROMO, "cold-test-screens", "README.md");
const SHOTS = path.join(PROMO, "cold-test-screens", "shots");
const OUT = path.join(ROOT, "app", "data", "cold-test-gallery.json");
const CATEGORIES_JSON = path.join(ROOT, "app", "data", "cold-test-categories.json");

if (!fs.existsSync(PROMO)) {
    console.error(`promotion/ not found at ${PROMO}`);
    console.error(`Set GUNJO_PROMOTION_DIR to the absolute path of your promotion/ folder.`);
    process.exit(1);
}
if (!fs.existsSync(README)) {
    console.error(`README not found: ${README}`);
    process.exit(1);
}

function slugFor(route) {
    return route === "/" ? "_root" : route.replace(/^\//, "").replace(/\//g, "__");
}

function parseReadme() {
    // route cell may carry extra text after the route (e.g. `/landing` (+ `/landing/template-demo`));
    // score may carry a leading ~/〜 (e.g. "〜3.5/5"). The early-round rows were silently dropped
    // by a stricter regex before — keep this loose so all 170 rows match.
    const md = fs.readFileSync(README, "utf8");
    const rows = [];
    for (const line of md.split("\n")) {
        const m = line.match(/^\s*\|\s*`(\/[^`]+)`[^|]*\|\s*#(\d+)\s*\|\s*(.*?)\s*\|\s*([~〜]?\s*[\d.]+\s*\/\s*5)\s*\|/);
        if (!m) continue;
        rows.push({
            route: m[1],
            round: parseInt(m[2], 10),
            readmeTitle: m[3],
            score: m[4].replace(/\s+/g, ""),
        });
    }
    rows.sort((a, b) => a.round - b.round);
    return rows;
}

function findArticle(round) {
    const nn = String(round).padStart(2, "0");
    let names = [];
    try {
        names = fs.readdirSync(PROMO).filter((f) => f.startsWith(`zenn-yattemita-${nn}-`) && f.endsWith(".md"));
    } catch {
        return null;
    }
    if (!names.length) return null;
    const name = names[0];
    const content = fs.readFileSync(path.join(PROMO, name), "utf8");
    return { name, content };
}

// Pull the article H1 (`# ...`) and a single-paragraph summary out of the
// raw markdown. The drafts don't use YAML frontmatter — the H1 is the first
// non-blank line and the summary is the first plain paragraph after it
// (skipping blockquotes, which carry the "やってみたシリーズ" boilerplate).
function extractArticleMeta(content) {
    const lines = content.split("\n");
    let title = "";
    let summary = "";

    for (const line of lines) {
        if (/^#\s+/.test(line)) {
            title = line.replace(/^#\s+/, "").trim();
            break;
        }
    }

    let inFence = false;
    const paragraph = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^```/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        if (/^#\s+/.test(line)) continue;
        if (/^>/.test(line)) continue;
        if (/^##+\s/.test(line)) {
            if (paragraph.length) break;
            continue;
        }
        if (!line.trim()) {
            if (paragraph.length) break;
            continue;
        }
        paragraph.push(line.trim());
    }
    summary = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (summary.length > 280) summary = summary.slice(0, 277) + "…";

    return { title, summary };
}

function articleSlugFromName(name) {
    // zenn-yattemita-12-chat.md → "12-chat"
    const m = name.match(/^zenn-yattemita-(\d+-[^.]+)\.md$/);
    return m ? m[1] : name.replace(/\.md$/, "");
}

function shotsFor(slug) {
    const variants = ["desktop", "mobile", "en.desktop", "en.mobile"];
    const out = {};
    for (const v of variants) {
        out[v] = fs.existsSync(path.join(SHOTS, `${slug}.${v}.png`));
    }
    return out;
}

// Count unique crystallised primitives across every published industry door
// page. Names are deduped globally so a primitive that appears in multiple
// categories (e.g. Meter across logistics + manufacturing + education) counts
// once. Returns 0 when the categories JSON is missing so this stays optional.
function countCrystallisedPrimitives() {
    if (!fs.existsSync(CATEGORIES_JSON)) return 0;
    const data = JSON.parse(fs.readFileSync(CATEGORIES_JSON, "utf8"));
    const seen = new Set();
    for (const cat of data.published ?? []) {
        for (const c of cat.discoveredComponents ?? []) {
            if (c?.name) seen.add(c.name);
        }
    }
    return seen.size;
}

function build() {
    const rows = parseReadme();
    const entries = rows.map((row) => {
        const slug = slugFor(row.route);
        const article = findArticle(row.round);
        const meta = article ? extractArticleMeta(article.content) : { title: "", summary: "" };
        return {
            round: row.round,
            route: row.route,
            slug,
            score: row.score,
            category: categoryOf(row.round),
            title: meta.title || row.readmeTitle,
            readmeTitle: row.readmeTitle,
            summary: meta.summary,
            article: article ? { file: article.name, slug: articleSlugFromName(article.name) } : null,
            shots: shotsFor(slug),
        };
    });

    const crystallizedCount = countCrystallisedPrimitives();

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(
        OUT,
        JSON.stringify(
            {
                generatedFrom: "promotion/cold-test-screens/README.md + zenn-yattemita-*.md",
                generator: "scripts/build-coldtest-gallery.mjs",
                count: entries.length,
                crystallizedCount,
                categories: CATEGORIES,
                entries,
            },
            null,
            2
        ) + "\n"
    );

    const withArticle = entries.filter((e) => e.article).length;
    const withDesktop = entries.filter((e) => e.shots.desktop).length;
    const withMobile = entries.filter((e) => e.shots.mobile).length;
    const withEn = entries.filter((e) => e.shots["en.desktop"] || e.shots["en.mobile"]).length;
    console.log(`wrote ${entries.length} entries → ${path.relative(ROOT, OUT)}`);
    console.log(`  with article draft: ${withArticle}/${entries.length}`);
    console.log(`  with desktop shot:  ${withDesktop}/${entries.length}`);
    console.log(`  with mobile shot:   ${withMobile}/${entries.length}`);
    console.log(`  with .en variant:   ${withEn}/${entries.length}`);
    console.log(`  crystallised total: ${crystallizedCount} (unique across published categories)`);
}

build();
