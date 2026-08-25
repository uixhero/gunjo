// `#NNN` inside a cold-test article is ambiguous by construction. The series
// numbers its rounds `#1`–`#244`, and the GitHub issues those articles cite are
// numbered in the same range and written in exactly the same shape. A reader
// meets both forms in the same sentence:
//
//     #3 で見つけて #52 で直した欠陥が、tooltip を多用する DataTable でも…
//        ^^ round      ^^ issue
//
// Nothing in the text separates them, which is why this is resolved here, at
// render time, from data the renderer has and the reader doesn't. The article
// markdown itself is never edited: `app/data/cold-test-rounds/*.json` is
// regenerated wholesale by `npm run coldtest-gallery:rounds`, so any marker
// written into it would be erased on the next regeneration — the same reason
// the `[#12](#)` citations are resolved in the renderer (issue #726).
//
// Two things happen:
//
//   1. A markdown link whose target is a GitHub issue renders its label as
//      `issue#N` instead of `#N`, so the kind is legible without hovering.
//   2. A *bare* `#N` that this module judges to be a round citation is turned
//      into a link to that round's page, with a preview card.
//
// ## How a bare `#N` is judged to be a round
//
// Three filters, in order. The numbers below are the measured result over all
// 185 Japanese round articles (`npm run coldtest:hash-refs:audit`).
//
//   raw `#N` anywhere ........................................... 3,425
//   (a) not glued to a word character on the right .............. 3,424  (kills `#9acd32`)
//   (b) outside code / inline code / links / URLs ............... 2,244
//   (c) N is a round that exists ................................ 1,954
//   (d) N <= currentRound + FORWARD_REF_WINDOW .................. 1,768
//   (e) N !== currentRound (self-citation stays plain text) ..... 1,224
//
// Filter (d) is what separates rounds from issues, and it works because of how
// the series is written rather than how it is worded. An article can only cite
// a round that already happened, plus the one or two it previews at the end
// ("次回予告（やってみた #102）"); an issue number, by contrast, always runs far
// ahead of the round that first mentions it, because the issue tracker was
// already in the hundreds while the series was in the tens. Measured over the
// corpus, the distribution has a clean gap:
//
//   N < current ............ 1,032      current+3 < N <= current+10 ...... 1
//   N === current .......... 544        N > current+10 ................. 186
//   current < N <= +3 ...... 191
//
// All 186 above the window were read by hand and all 186 are issue numbers.
// The single occurrence inside the window (round 200 listing `#204` among the
// insurance screens) is a genuine round citation, which is why the window is
// 10 and not 3. False positives measured on the kept set: 0 of 223 read by
// hand (all 103 candidates with N < 20, plus a random sample of 120).
//
// The window also resolves the case that has no textual tell at all: `#142` is
// round 142 (taxi crew licences) *and* issue 142 (the Gantt component). Rounds
// 68–81 cite the issue and are 60+ rounds below it; round 151 cites the round
// and is above it. Same string, opposite verdicts, no wording involved.

// This module imports nothing, on purpose: `scripts/audit-coldtest-hash-refs.mjs`
// loads it directly under Node's type stripping to measure the real corpus, and
// Node's resolver cannot follow the extensionless imports the app uses. Anything
// that needs a neighbour (`citedRounds`) lives in `cold-test-article-links.ts`.

/** Rounds this far ahead of the current one still read as round citations. */
export const FORWARD_REF_WINDOW = 10;

/**
 * Sentinel href for a bare `#N` that resolved to a round. It is a fragment so
 * that react-markdown's URL sanitiser passes it through untouched; the article
 * bodies use no real in-page anchors (the only `#`-hrefs in the corpus are the
 * 732 unresolved `[#12](#)` citations), so nothing else can collide with it.
 */
export const ROUND_REF_HREF_PREFIX = "#gunjo-round-";

export function roundRefHref(round: number): string {
    return `${ROUND_REF_HREF_PREFIX}${round}`;
}

/** The round a sentinel href points at, or null when it is not one. */
export function roundRefFromHref(href: string | undefined): number | null {
    if (!href || !href.startsWith(ROUND_REF_HREF_PREFIX)) return null;
    const round = Number(href.slice(ROUND_REF_HREF_PREFIX.length));
    return Number.isInteger(round) && round > 0 ? round : null;
}

const GITHUB_ISSUE_HREF = /^https?:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+)(?:[#?].*)?$/;

/** The issue a GitHub issue URL points at, or null. Pull requests return null. */
export function issueNumberFromHref(href: string | undefined): number | null {
    if (!href) return null;
    const match = GITHUB_ISSUE_HREF.exec(href);
    return match ? Number(match[1]) : null;
}

// Regions a `#N` must not be read out of. Union of all of them, so a region
// that is matched twice (a URL inside a link destination) simply masks twice —
// over-masking is safe, under-masking is not.
const MASK_PATTERNS: readonly RegExp[] = [
    /```[\s\S]*?(?:```|$)/g, // fenced code
    /`[^`\n]*`/g, // inline code
    /<!--[\s\S]*?-->/g, // html comment
    /!?\[[^\]\n]*\]\([^)\s]*(?:\s+"[^"]*")?\)/g, // markdown link / image, label included
    /https?:\/\/\S+/g, // bare url
];

// No word-boundary guard on the left: the corpus glues the marker to a code
// word often enough to matter (`棚卸 SKU#43`, `OCC#113`, `IC#158` — 9 genuine
// citations), and the cases where a left-glued `#N` is an issue (`ReferenceValue#241`)
// are already outside the forward window. The guard on the right stays: it is
// what stops a hex colour (`#9acd32`) from reading as round 9.
const HASH_REF = /#(\d{1,4})(?![0-9A-Za-z_])/g;

/** Merged, sorted, non-overlapping spans that a `#N` must not be read out of. */
function maskedRanges(markdown: string): Array<[number, number]> {
    const raw: Array<[number, number]> = [];
    for (const pattern of MASK_PATTERNS) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(markdown)) !== null) {
            raw.push([match.index, match.index + match[0].length]);
        }
    }
    raw.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    const merged: Array<[number, number]> = [];
    for (const [start, end] of raw) {
        const last = merged[merged.length - 1];
        if (last && start <= last[1]) {
            if (end > last[1]) last[1] = end;
            continue;
        }
        merged.push([start, end]);
    }
    return merged;
}

export interface RoundRefCandidate {
    /** Offset of the `#` in the source markdown. */
    index: number;
    /** Length of the matched `#NNN` run. */
    length: number;
    /** The round it cites. */
    round: number;
}

export interface RoundRefOptions {
    /** The round whose article this is. Its own number stays plain text. */
    currentRound: number;
    /** Every round number that has an article, in either language. */
    rounds: ReadonlySet<number>;
}

/**
 * Every bare `#N` in `markdown` that reads as a citation of another round.
 * Exported so `scripts/audit-coldtest-hash-refs.mjs` measures exactly what the
 * renderer links, rather than a second implementation that can drift from it.
 */
export function collectRoundRefs(
    markdown: string,
    { currentRound, rounds }: RoundRefOptions
): RoundRefCandidate[] {
    const masks = maskedRanges(markdown);
    const found: RoundRefCandidate[] = [];
    // Masks are merged and sorted, and matches arrive in source order, so one
    // forward cursor over the mask list is enough.
    let mask = 0;

    HASH_REF.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = HASH_REF.exec(markdown)) !== null) {
        const index = match.index;
        while (mask < masks.length && masks[mask][1] <= index) mask += 1;
        if (mask < masks.length && masks[mask][0] <= index) continue;

        const round = Number(match[1]);
        if (!rounds.has(round)) continue;
        if (round > currentRound + FORWARD_REF_WINDOW) continue;
        if (round === currentRound) continue;
        found.push({ index, length: match[0].length, round });
    }
    return found;
}

/**
 * `markdown` with every bare round citation rewritten into a link carrying the
 * sentinel href. Purely a render-time view of the article — the stored
 * markdown is not touched.
 */
export function linkifyRoundRefs(markdown: string, options: RoundRefOptions): string {
    const refs = collectRoundRefs(markdown, options);
    if (refs.length === 0) return markdown;

    const out: string[] = [];
    let cursor = 0;
    for (const ref of refs) {
        out.push(markdown.slice(cursor, ref.index));
        const label = markdown.slice(ref.index, ref.index + ref.length);
        out.push(`[${label}](${roundRefHref(ref.round)})`);
        cursor = ref.index + ref.length;
    }
    out.push(markdown.slice(cursor));
    return out.join("");
}
