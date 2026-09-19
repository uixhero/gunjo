import fs from "node:fs";
import path from "node:path";

// Server-only (uses node:fs on purpose, like cold-test-en.ts — importing this
// from a client component fails loudly instead of silently shipping the gate
// to the browser, where VERCEL_ENV is undefined and every draft would leak).
//
// Production gate for JAPANESE cold-test rounds, mirroring the English
// `status: "draft"` convention (see app/lib/cold-test-en.ts):
//
//   - Rounds listed in app/data/cold-test-draft-rounds.json are DRAFTS.
//   - Drafts render locally and on Vercel previews so KeEem can review them
//     in place, and are withheld from production (/cold-tests grid, detail
//     pages, category pages, sitemap, round counts).
//   - Publishing = remove the round from the draft list, regenerate the
//     gallery snapshot, open a PR.
//
// This is what lets round production run ahead of review: a finished round
// merges to main as a draft immediately, and review happens later per
// industry batch (promotion/handoff/COLDTEST-BACKLOG.md).

const DRAFTS_JSON = path.join(
    process.cwd(),
    "app",
    "data",
    "cold-test-draft-rounds.json"
);

function draftRounds(): Set<number> {
    if (!fs.existsSync(DRAFTS_JSON)) return new Set();
    const parsed = JSON.parse(fs.readFileSync(DRAFTS_JSON, "utf8")) as {
        draft?: number[];
    };
    return new Set(parsed.draft ?? []);
}

/**
 * Whether a Japanese round may render in this environment. Drafts render
 * everywhere except production; published rounds render everywhere.
 */
export function isJaRoundPublishable(round: number): boolean {
    if (!draftRounds().has(round)) return true;
    return process.env.VERCEL_ENV !== "production";
}

/** Filter any round-shaped list down to what this environment may show. */
export function publishableJaEntries<T extends { round: number }>(
    entries: T[]
): T[] {
    const drafts = draftRounds();
    if (drafts.size === 0) return entries;
    if (process.env.VERCEL_ENV !== "production") return entries;
    return entries.filter((e) => !drafts.has(e.round));
}
