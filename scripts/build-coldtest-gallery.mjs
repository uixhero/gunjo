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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROMO = process.env.GUNJO_PROMOTION_DIR
    ? path.resolve(process.env.GUNJO_PROMOTION_DIR)
    : path.join(ROOT, "promotion");
const README = path.join(PROMO, "cold-test-screens", "README.md");
const SHOTS = path.join(PROMO, "cold-test-screens", "shots");
const OUT = path.join(ROOT, "app", "data", "cold-test-gallery.json");

if (!fs.existsSync(PROMO)) {
    console.error(`promotion/ not found at ${PROMO}`);
    console.error(`Set GUNJO_PROMOTION_DIR to the absolute path of your promotion/ folder.`);
    process.exit(1);
}
if (!fs.existsSync(README)) {
    console.error(`README not found: ${README}`);
    process.exit(1);
}

// Display order of industry categories (UI grouping). Kept identical to
// gunjo-test/app/gallery/_data.ts so the labels match the live dev gallery.
const CATEGORIES = [
    "基盤UI・汎用",
    "金融",
    "会計・給与",
    "小売・EC",
    "物流・倉庫",
    "医療・ヘルスケア",
    "不動産",
    "製造",
    "教育",
    "公共・行政",
    "メディア・出版",
    "人材・HR・採用",
    "介護・福祉",
    "飲食・レストラン",
    "保険",
    "運輸：鉄道",
    "運輸：航空",
    "運輸：バス",
    "運輸：タクシー",
    "運輸：トラック",
];

// Industry category assignment per round. The series ran roughly industry-by-
// industry; explicit exceptions (out-of-block rounds, toC interleaving) are
// listed individually. Ported verbatim from gunjo-test/app/gallery/_data.ts;
// keep in sync when the cold-test series adds more rounds.
function categoryOf(round) {
    if (round === 31) return "小売・EC";
    if (round <= 30) return "基盤UI・汎用";
    if (round <= 36) return "金融";
    if (round <= 41) return "会計・給与";
    if (round <= 46) return "小売・EC";
    if (round <= 52) return "物流・倉庫";
    if (round <= 59) return "医療・ヘルスケア";
    if (round <= 63) return "不動産";
    if (round <= 69) return "製造";
    if (round <= 74) return "教育";
    if (round <= 79) return "公共・行政";
    if (round <= 82) return "メディア・出版";
    if (round <= 88) return "人材・HR・採用";
    if (round <= 93) return "介護・福祉";
    if (round <= 98) return "飲食・レストラン";
    if (round <= 105) return "保険";
    if (round === 117) return "運輸：鉄道";
    if (round === 118) return "小売・EC";
    if (round === 119) return "運輸：鉄道";
    if (round === 120) return "運輸：鉄道";
    if (round === 121) return "運輸：鉄道";
    if (round === 128) return "運輸：鉄道";
    if (round === 129) return "運輸：鉄道";
    if (round === 130) return "運輸：航空";
    if (round === 131) return "運輸：航空";
    if (round === 132) return "運輸：鉄道";
    if (round === 133) return "運輸：鉄道";
    if (round === 134) return "運輸：航空";
    if (round === 135) return "運輸：航空";
    if (round === 136) return "運輸：バス";
    if (round === 137) return "運輸：バス";
    if (round === 138) return "運輸：バス";
    if (round === 139) return "運輸：バス";
    if (round === 140) return "運輸：バス";
    if (round === 141) return "運輸：タクシー";
    if (round === 142) return "運輸：タクシー";
    if (round === 143) return "運輸：タクシー";
    if (round === 144) return "運輸：タクシー";
    if (round === 145) return "運輸：タクシー";
    if (round === 146) return "運輸：タクシー";
    if (round === 147) return "運輸：タクシー";
    if (round === 148) return "運輸：タクシー";
    if (round === 149) return "運輸：タクシー";
    if (round === 150) return "運輸：タクシー";
    if (round === 151) return "運輸：タクシー";
    if (round === 152) return "運輸：タクシー";
    if (round === 153) return "運輸：バス";
    if (round === 154) return "運輸：バス";
    if (round === 155) return "運輸：バス";
    if (round === 156) return "運輸：バス";
    if (round === 157) return "運輸：バス";
    if (round === 158) return "運輸：バス";
    if (round === 159) return "運輸：トラック";
    if (round === 160) return "運輸：トラック";
    if (round === 161) return "運輸：トラック";
    if (round === 162) return "運輸：トラック";
    if (round === 163) return "運輸：トラック";
    if (round === 164) return "運輸：トラック";
    if (round === 165) return "運輸：トラック";
    if (round === 166) return "運輸：トラック";
    if (round === 167) return "運輸：トラック";
    if (round === 168) return "運輸：トラック";
    if (round === 169) return "運輸：鉄道";
    if (round === 170) return "運輸：鉄道";
    if (round === 171) return "会計・給与";
    if (round === 172) return "金融";
    if (round === 173) return "金融";
    if (round <= 111) return "運輸：鉄道";
    return "運輸：航空";
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

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(
        OUT,
        JSON.stringify(
            {
                generatedFrom: "promotion/cold-test-screens/README.md + zenn-yattemita-*.md",
                generator: "scripts/build-coldtest-gallery.mjs",
                count: entries.length,
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
}

build();
