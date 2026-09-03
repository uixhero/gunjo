// Measures what `app/lib/cold-test-hash-refs.ts` will actually link, over the
// whole cold-test corpus, so the detection rule is judged against the real
// articles instead of on paper. It imports the renderer's own module rather
// than re-implementing the scan, so the two cannot drift apart.
//
//   node --experimental-strip-types scripts/audit-coldtest-hash-refs.mjs
//   … --dump          every kept candidate with its surrounding text
//   … --dropped       every candidate the forward-reference window rejected
//   … --lang en       audit the English articles instead
//
// Needs Node >= 22.6 for `--experimental-strip-types` (the module it imports is
// TypeScript). It is a review tool, not part of the build or of CI.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
    FORWARD_REF_WINDOW,
    collectRoundRefs,
    issueNumberFromHref,
} from "../app/lib/cold-test-hash-refs.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const JA_DIR = join(ROOT, "app", "data", "cold-test-rounds");

const args = process.argv.slice(2);
const wantDump = args.includes("--dump");
const wantDropped = args.includes("--dropped");
const lang = args[args.indexOf("--lang") + 1] === "en" ? "en" : "ja";
const dir = lang === "en" ? join(JA_DIR, "en") : JA_DIR;

function readRounds(from) {
    const rounds = new Map();
    for (const name of readdirSync(from)) {
        const match = /^(\d+)\.json$/.exec(name);
        if (!match) continue;
        const data = JSON.parse(readFileSync(join(from, name), "utf8"));
        const markdown = data.article?.markdown;
        if (typeof markdown === "string") rounds.set(Number(match[1]), markdown);
    }
    return new Map([...rounds].sort((a, b) => a[0] - b[0]));
}

// Every round with a Japanese article — the set the renderer resolves against.
// English rounds cite the same numbering, so both languages use it.
const jaRounds = readRounds(JA_DIR);
const existing = new Set(jaRounds.keys());
const corpus = lang === "en" ? readRounds(dir) : jaRounds;

// Stage counts. Each is measured by re-running the scan with one filter
// relaxed, so the funnel is the module's behaviour and not a copy of it.
const RAW = /#(\d{1,4})/g;
const RIGHT_GUARDED = /#(\d{1,4})(?![0-9A-Za-z_])/g;
const allRounds = new Set(Array.from({ length: 100000 }, (_, i) => i));

let raw = 0;
let rightGuarded = 0;
for (const markdown of corpus.values()) {
    raw += (markdown.match(RAW) ?? []).length;
    rightGuarded += (markdown.match(RIGHT_GUARDED) ?? []).length;
}

let inCorpusRegions = 0;
let existingRound = 0;
let withinWindow = 0;
const kept = [];
const dropped = [];
for (const [round, markdown] of corpus) {
    // A round number nothing can equal or outrun disables the self-citation
    // and forward-window filters, leaving only the masking. The stages below
    // then re-apply each filter one at a time.
    const noFilters = collectRoundRefs(markdown, {
        currentRound: Number.MAX_SAFE_INTEGER,
        rounds: allRounds,
    });
    inCorpusRegions += noFilters.length;
    const roundsOnly = noFilters.filter((r) => existing.has(r.round));
    existingRound += roundsOnly.length;
    const inWindow = roundsOnly.filter((r) => r.round <= round + FORWARD_REF_WINDOW);
    withinWindow += inWindow.length;

    for (const ref of roundsOnly) {
        const record = {
            round,
            ref: ref.round,
            before: markdown.slice(Math.max(0, ref.index - 44), ref.index).replace(/\n/g, "⏎"),
            after: markdown
                .slice(ref.index + ref.length, ref.index + ref.length + 30)
                .replace(/\n/g, "⏎"),
        };
        if (ref.round > round + FORWARD_REF_WINDOW) dropped.push(record);
        else if (ref.round !== round) kept.push(record);
    }
}

// How the issue links in the same corpus are labelled today, which is what
// decides whether rewriting the label to `issue#N` is safe to do blindly.
let issueLinks = 0;
let plainIssueLabels = 0;
const otherIssueLabels = [];
const LINK = /\[([^\]\n]*)\]\((\S+?)(?:\s+"[^"]*")?\)/g;
for (const markdown of corpus.values()) {
    LINK.lastIndex = 0;
    let match;
    while ((match = LINK.exec(markdown)) !== null) {
        const number = issueNumberFromHref(match[2]);
        if (number === null) continue;
        issueLinks += 1;
        if (match[1] === `#${number}`) plainIssueLabels += 1;
        else otherIssueLabels.push(match[1]);
    }
}

const pct = (n, of) => (of === 0 ? "—" : `${((n / of) * 100).toFixed(1)}%`);

console.log(`cold-test hash refs — ${lang} corpus, ${corpus.size} articles\n`);
console.log("bare #N funnel");
console.log(`  raw \`#N\` anywhere ..................... ${raw}`);
console.log(`  not glued to a word char on the right .. ${rightGuarded}`);
console.log(`  outside code / links / URLs ............ ${inCorpusRegions}`);
console.log(`  N is a round that exists ............... ${existingRound}`);
console.log(
    `  N <= round + ${FORWARD_REF_WINDOW} ......................... ${withinWindow}` +
        `   (dropped ${dropped.length} — all issue numbers)`
);
console.log(`  N !== this round (self stays plain) .... ${kept.length}\n`);
console.log("issue links");
console.log(`  links to a GitHub issue ................ ${issueLinks}`);
console.log(
    `  labelled exactly \`#N\` .................. ${plainIssueLabels}  (${pct(plainIssueLabels, issueLinks)})`
);
console.log(`  labelled otherwise (left untouched) .... ${otherIssueLabels.length}`);
if (otherIssueLabels.length > 0) {
    console.log(`    ${[...new Set(otherIssueLabels)].join("  ")}`);
}

if (wantDropped) {
    console.log(`\n--- dropped by the forward window (${dropped.length}) ---`);
    for (const d of dropped) console.log(`r${d.round} #${d.ref}  …${d.before}⟦#${d.ref}⟧${d.after}…`);
}
if (wantDump) {
    console.log(`\n--- linked (${kept.length}) ---`);
    for (const k of kept) console.log(`r${k.round} #${k.ref}  …${k.before}⟦#${k.ref}⟧${k.after}…`);
}
