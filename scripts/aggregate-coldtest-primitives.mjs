#!/usr/bin/env node
/**
 * Aggregate build markers from promotion/zenn-yattemita-series.md into
 * app/data/cold-test-categories.json so Stage B door pages can list newly
 * crystallised primitives without a full manual re-read.
 *
 * Deterministic markers extracted:
 *   **<Name>(land #<pr>)**        — component built in that round
 *   **<Name> fix(#<pr>)**         — fix landed in that round
 *   ★<Name> 3-confirm 到達→...    — narrative "just cleared the bar" callout
 *
 * Rounds are identified from the table row: `| **N** | **title** | ... |`.
 * Categories come from scripts/coldtest-category-map.mjs. Each detected
 * (name, round) pair maps to the round's category; entries are then
 * cross-checked against cold-test-categories.json and reported as either
 *   - already present (skip)
 *   - candidate (add on --apply)
 *
 * Never overwrites existing blurbs. --apply only appends { name, slug,
 * round, blurbJa: "", blurbEn: "" } stubs; KeEem fills the blurbs by hand.
 *
 * Usage:
 *   GUNJO_PROMOTION_DIR=~/dev/gunjo/promotion node scripts/aggregate-coldtest-primitives.mjs [--dry-run|--apply]
 *
 * Exit codes:
 *   0  ok (dry-run or apply completed)
 *   1  missing prerequisites (series.md / categories.json)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categoryOf } from "./coldtest-category-map.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROMO = process.env.GUNJO_PROMOTION_DIR
    ? path.resolve(process.env.GUNJO_PROMOTION_DIR)
    : path.join(ROOT, "promotion");
const SERIES = path.join(PROMO, "zenn-yattemita-series.md");
const CATEGORIES_JSON = path.join(ROOT, "app", "data", "cold-test-categories.json");
const NAV = path.join(ROOT, "app", "lib", "navigation.ts");

// Real docs slugs from navigation.ts — same filter used by
// scripts/build-coldtest-rounds.mjs (PR #469). Names whose kebab slug
// isn't in this Set are treated as narrative false positives (e.g. "When",
// "So") and dropped from the aggregation output.
const REAL_DOC_SLUGS = (() => {
    if (!fs.existsSync(NAV)) return new Set();
    const src = fs.readFileSync(NAV, "utf8");
    const set = new Set();
    const re = /\/docs\/components\/([a-z0-9-]+)/g;
    let m;
    while ((m = re.exec(src))) set.add(m[1]);
    return set;
})();

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const DRY_RUN = args.includes("--dry-run") || !APPLY;

if (!fs.existsSync(SERIES)) {
    console.error(`series.md not found: ${SERIES}`);
    console.error(`Set GUNJO_PROMOTION_DIR to the absolute path of your promotion/ folder.`);
    process.exit(1);
}
if (!fs.existsSync(CATEGORIES_JSON)) {
    console.error(`categories JSON not found: ${CATEGORIES_JSON}`);
    process.exit(1);
}

// PascalCase → kebab-case, matching docSlugFor() elsewhere in the app so the
// suggested docs link resolves to the same page.
function docSlugFor(name) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

// Resolve an extracted name to its documented ancestor — or null. Mirrors
// scripts/build-coldtest-rounds.mjs so `TimelineDescription` folds to
// `Timeline`, `AlertTitle` folds to `Alert`, and English narrative words
// (no ancestor) drop out entirely.
function resolveDocumentedName(name) {
    if (REAL_DOC_SLUGS.size === 0) return name;
    if (REAL_DOC_SLUGS.has(docSlugFor(name))) return name;
    let head = name;
    while (true) {
        const trimmed = head.replace(/[A-Z][a-z0-9]*$/, "");
        if (!trimmed || trimmed === head) return null;
        head = trimmed;
        if (REAL_DOC_SLUGS.has(docSlugFor(head))) return head;
    }
}

// Walk series.md line-by-line, tracking the current round from table rows.
// A row header looks like `| **N** | **title** | components... |`; the round
// stays "active" until the next such row so multi-line markers under the same
// round still associate correctly.
function extractMarkers() {
    const text = fs.readFileSync(SERIES, "utf8");
    const lines = text.split("\n");

    const markers = []; // { name, round, kind: 'land' | 'fix' | 'confirm', pr?: number }
    let currentRound = null;

    // Table-row: `| **12** | **お題** | ... |`
    const rowRe = /^\|\s*\*\*(\d+)\*\*\s*\|/;
    // Retro narrative: `- **#83（...** → ...`
    const retroRe = /^-\s*\*\*#(\d+)/;

    // Table markers embedded in a components cell.
    const landRe = /\*\*([A-Z][A-Za-z0-9]+)\(land #(\d+)\)\*\*/g;
    const fixRe = /\*\*([A-Z][A-Za-z0-9]+) fix\(#(\d+)\)\*\*/g;
    // Narrative "3-confirm → build" callouts. The name is the token that
    // immediately precedes " 3-confirm 到達" / " 3回目→build". Bold is
    // inconsistent in the narrative so both `**Name` and bare `Name` forms
    // are accepted; false positives (English words like "When") are dropped
    // later by the REAL_DOC_SLUGS filter.
    const confirmRe = /(?:\*\*)?\b([A-Z][A-Za-z0-9]+) 3-confirm 到達/g;
    const trigger3Re = /(?:\*\*)?\b([A-Z][A-Za-z0-9]+) 3回目→build/g;

    for (const line of lines) {
        const rowMatch = line.match(rowRe);
        if (rowMatch) {
            currentRound = parseInt(rowMatch[1], 10);
        } else {
            const retroMatch = line.match(retroRe);
            if (retroMatch) currentRound = parseInt(retroMatch[1], 10);
        }
        if (currentRound == null) continue;

        for (const [regex, kind] of [
            [landRe, "land"],
            [fixRe, "fix"],
            [confirmRe, "confirm"],
            [trigger3Re, "confirm"],
        ]) {
            regex.lastIndex = 0;
            let m;
            while ((m = regex.exec(line))) {
                // Fold sub-component names to their documented parent and
                // drop narrative false positives (English narrative words
                // like "When", "So" resolve to null and get skipped).
                const resolved = resolveDocumentedName(m[1]);
                if (!resolved) continue;
                markers.push({
                    name: resolved,
                    round: currentRound,
                    kind,
                    pr: m[2] ? parseInt(m[2], 10) : null,
                });
            }
        }
    }

    return markers;
}

function loadCategoriesJson() {
    return JSON.parse(fs.readFileSync(CATEGORIES_JSON, "utf8"));
}

function saveCategoriesJson(data) {
    fs.writeFileSync(CATEGORIES_JSON, JSON.stringify(data, null, 4) + "\n");
}

// Fold table + narrative markers into { category → [{ name, round, kinds:Set }] }.
// A single component often gets both a `land` marker and a downstream `fix`
// marker — we dedupe by name × round and merge the marker kinds.
function groupByCategory(markers) {
    const byCategoryName = new Map(); // category → Map(nameRound → entry)
    for (const m of markers) {
        const category = categoryOf(m.round);
        if (!category) continue;
        let per = byCategoryName.get(category);
        if (!per) {
            per = new Map();
            byCategoryName.set(category, per);
        }
        const key = `${m.name}@${m.round}`;
        const prev = per.get(key);
        if (prev) {
            prev.kinds.add(m.kind);
            if (m.pr && !prev.prs.includes(m.pr)) prev.prs.push(m.pr);
        } else {
            per.set(key, {
                name: m.name,
                round: m.round,
                kinds: new Set([m.kind]),
                prs: m.pr ? [m.pr] : [],
            });
        }
    }
    // Also flatten to keep round=earliest per name when we're deciding
    // "already covered". A single primitive can land in one round and be
    // fixed / re-confirmed in later rounds — we keep every occurrence for
    // the report but the JSON entry uses the earliest round.
    return byCategoryName;
}

// A category "already has" a primitive if its published[].discoveredComponents
// contains a name-matching entry. Matching is strict on `.name` (PascalCase).
function categoryEntry(catData, slug) {
    return catData.published?.find((c) => c.slug === slug);
}

function buildSlugToJaMap(catData) {
    const map = new Map();
    for (const [ja, slug] of Object.entries(catData.slugMap ?? {})) {
        map.set(slug, ja);
    }
    return map;
}

function main() {
    console.log(`series.md: ${path.relative(ROOT, SERIES)}`);
    console.log(`categories: ${path.relative(ROOT, CATEGORIES_JSON)}`);
    console.log(`mode: ${APPLY ? "APPLY (will write)" : "dry-run (no writes)"}`);
    console.log("");

    const markers = extractMarkers();
    console.log(`extracted ${markers.length} raw markers (land / fix / 3-confirm)`);

    const grouped = groupByCategory(markers);

    const catData = loadCategoriesJson();
    const jaBySlug = buildSlugToJaMap(catData);
    const slugByJa = new Map(
        Object.entries(catData.slugMap ?? {}).map(([ja, slug]) => [ja, slug])
    );

    let totalCandidates = 0;
    let totalPresent = 0;
    let totalWritten = 0;

    // Iterate in the categories-file order so the report reads left-to-right
    // matching what KeEem sees on the site.
    for (const catEntry of catData.published ?? []) {
        const jaName = catEntry.jaCategory;
        const entries = grouped.get(jaName);
        if (!entries || entries.size === 0) continue;

        const existingNames = new Set(
            (catEntry.discoveredComponents ?? []).map((c) => c.name)
        );

        const sorted = [...entries.values()].sort((a, b) => a.round - b.round);

        const candidates = [];
        for (const entry of sorted) {
            if (existingNames.has(entry.name)) {
                totalPresent += 1;
                continue;
            }
            candidates.push(entry);
        }

        if (candidates.length === 0) continue;

        console.log(`\n[${catEntry.slug}] ${jaName} — ${candidates.length} new candidate(s)`);
        for (const c of candidates) {
            const kinds = [...c.kinds].join("/");
            const prs = c.prs.length ? ` PR#${c.prs.join(",")}` : "";
            console.log(`  + ${c.name} (round #${c.round}, ${kinds}${prs})`);
        }
        totalCandidates += candidates.length;

        if (APPLY) {
            if (!Array.isArray(catEntry.discoveredComponents)) {
                catEntry.discoveredComponents = [];
            }
            for (const c of candidates) {
                catEntry.discoveredComponents.push({
                    name: c.name,
                    slug: docSlugFor(c.name),
                    round: c.round,
                    blurbJa: "",
                    blurbEn: "",
                });
                totalWritten += 1;
            }
        }
    }

    // Cross-check: any category with markers but no matching published entry?
    for (const [jaName, entries] of grouped.entries()) {
        const slug = slugByJa.get(jaName);
        if (!slug) continue;
        const isPublished = catData.published?.some((c) => c.slug === slug);
        if (!isPublished) {
            console.log(
                `\n[warn] ${jaName} has ${entries.size} marker(s) but no published entry (slug: ${slug})`
            );
        }
    }

    console.log("");
    console.log(`summary: ${totalPresent} already present, ${totalCandidates} new candidate(s)`);

    if (APPLY) {
        saveCategoriesJson(catData);
        console.log(`applied: wrote ${totalWritten} TBD stub(s) → ${path.relative(ROOT, CATEGORIES_JSON)}`);
        console.log(`Fill blurbJa / blurbEn by hand; existing blurbs were left untouched.`);
    } else {
        console.log(`dry-run: no files written. Pass --apply to add ${totalCandidates} TBD stub(s).`);
    }
}

main();
