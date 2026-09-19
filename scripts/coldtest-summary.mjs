/**
 * Summary extraction for the cold-test rounds.
 *
 * Used by `build-coldtest-gallery.mjs`, which writes the gallery snapshot;
 * `build-coldtest-rounds.mjs` copies the field on from there.
 *
 * The summary is shown in exactly three places, and all three want the same
 * thing — what the round FOUND:
 *   1. the card on /cold-tests             (line-clamp-3, ~50 JP chars visible)
 *   2. the card on /cold-tests/categories  (same clamp)
 *   3. <meta name="description"> + OG/Twitter for /cold-tests/[round]
 *
 * It used to be the first plain paragraph after the H1. That paragraph is
 * fixed by the format of the series — it reports how many files and lines the
 * agent wrote, that the type check passed and that nothing scrolls sideways —
 * so every one of the 185 summaries described the WORK and none of them
 * described the FINDING, even where the title announced one.
 *
 * The finding is already written down, in the section headings: `結果` carries
 * the verdict after the score and `学び` carries the lesson. We quote those
 * rather than compose anything new, so a summary can never drift from the
 * article it belongs to.
 */

const SCORE = /[~〜]?\s*\d+(?:\.\d+)?\s*\/\s*5/;

// Headings that never carry a finding: the brief, the method, the scoreboard,
// the progress ledger, the next-round teaser and the install call to action.
const NON_FINDING_HEADING =
    /^(?:[📊📋]|試す|次回予告|お題|実験の条件|やってみた|コンポーネント化スコアボード|ここまでのスコアボード|これまでに群青へ加わったコンポーネント|スコアボード|進捗|課題|前回まで|関連|補足|付録|この先)/;

const LESSON_HEADING = /^(?:学び|まとめ|一周して見えたこと)/;

// `— ` / `：` / `:` all appear as the split between a heading's label and the
// sentence stating what the round found.
const HEADING_SEPARATOR = /^\s*[—–:：\-]\s*/;

// Only real sentence enders count. A tail closing on 」or ）is still a noun
// phrase and needs its own 。, or two pieces run together into one line.
const SENTENCE_END = /[。？！?!…]$/;

const TEXT_ARROW = /[→←↑↓»]/;

const MIN_PIECE = 6;
const MAX_PIECES = 2;
const MAX_LENGTH = 120;

function stripInline(text) {
    return text
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [label](url) keeps the label
        .replace(/`([^`]*)`/g, "$1")
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .trim();
}

/**
 * Tidy a heading tail into something that can stand on its own.
 *
 * The em-dash these headings use for an inline aside is allowed in a heading
 * but belongs as 読点 in prose (promotion/handoff/WRITING-GUARDRAILS.md §3),
 * and the summary is prose. A tail that starts mid-sentence (`、そして…`) or
 * continues one (`→ src で…`) needs its connective trimmed, and the 🔴 markers
 * some headings carry are heading decoration, not part of the sentence.
 */
function tidyTail(tail) {
    return tail
        .replace(/[—–]{1,2}/g, "、")
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
        .replace(/^[・、。,\s]+/, "")
        .replace(/^[→←↑↓]\s*/, "")
        .replace(/^そして[、\s]*/, "")
        .replace(/、+/g, "、")
        .replace(/[（(]\s+/g, "（")
        .replace(/\s+[）)]/g, "）")
        .replace(/\s{2,}/g, " ")
        .trim();
}

/** Split the markdown into H2 sections, ignoring anything inside code fences. */
export function sectionsOf(markdown) {
    const out = [];
    let current = null;
    let inFence = false;
    for (const line of markdown.split("\n")) {
        if (/^```/.test(line)) inFence = !inFence;
        if (!inFence && /^##\s+\S/.test(line)) {
            current = { heading: stripInline(line.replace(/^##\s+/, "")), body: [] };
            out.push(current);
            continue;
        }
        if (current) current.body.push(line);
    }
    return out;
}

/**
 * Trim the label off a heading and return the sentence behind it.
 * `学び — 索引には「2種類の罠」がある` → `索引には「2種類の罠」がある`
 */
function headingTail(heading, label) {
    const tail = heading.slice(label.length);
    if (!HEADING_SEPARATOR.test(tail) && tail && !/^[（(]/.test(tail)) return "";
    return tail.replace(HEADING_SEPARATOR, "").trim();
}

/**
 * The 結果 heading minus its score. The score already has its own badge on the
 * card, and repeating it there eats the clamp.
 *
 * Three shapes occur, and the parenthetical means something different in each:
 *   `結果 — 4/5（最近で最高）`                → the parens qualify the score
 *   `結果 — 4/5（深掘りの中で高め）。理由は…`   → …and the point follows
 *   `結果 — 4.5/5（tsc/build 緑・全部採用）`   → the parens ARE the point
 * So drop a leading parenthetical only when text follows it; otherwise unwrap.
 */
function resultLead(sections) {
    const section = sections.find((s) => s.heading.startsWith("結果"));
    if (!section) return "";
    let tail = headingTail(section.heading, "結果");
    if (!tail) return "";

    tail = tail.replace(SCORE, "").trim();
    // `動いた（4/5）` leaves an empty pair behind once the score is gone.
    tail = tail.replace(/[（(]\s*[）)]/g, "").trim();

    const leadingParen = tail.match(/^[（(]([^）)]*)[）)]\s*(.*)$/s);
    if (leadingParen) {
        const [, inner, rest] = leadingParen;
        tail = rest.trim() ? rest.trim() : inner.trim();
    }
    return tidyTail(tail);
}

/** The 学び / まとめ heading minus its label. */
function lessonLead(sections) {
    const section = sections.find((s) => LESSON_HEADING.test(s.heading));
    if (!section) return "";
    return tidyTail(headingTail(section.heading, section.heading.match(LESSON_HEADING)[0]));
}

/**
 * Fallback for the early rounds, where `## 学び` stands bare and the 結果
 * heading is only a score. There the finding lives in the section right after
 * 結果 — `粗さ — …`, `この回の主役 — …`, `今回の本題 — …`. Take the headings
 * after 結果 that are not one of the fixed-format sections.
 */
function findingLeads(sections) {
    const start = sections.findIndex((s) => s.heading.startsWith("結果"));
    const out = [];
    for (const section of sections.slice(start + 1)) {
        const { heading } = section;
        if (NON_FINDING_HEADING.test(heading)) continue;
        if (LESSON_HEADING.test(heading)) continue;
        const match = heading.match(/^([^—–:：]{1,24}?)\s*[—–:：]\s*(\S.*)$/s);
        if (!match) continue;
        const tail = tidyTail(match[2]);
        if (tail.length >= MIN_PIECE) out.push(tail);
    }
    return out;
}

function joinPieces(pieces) {
    return pieces
        .map((p) => (SENTENCE_END.test(p) ? p : `${p}。`))
        .join("")
        .replace(/。+/g, "。");
}

function selectPieces(candidates) {
    const pieces = [];
    for (const candidate of candidates) {
        if (candidate.length < MIN_PIECE) continue;
        // Two headings in the same round can restate each other; keep the first.
        if (pieces.some((p) => p.includes(candidate) || candidate.includes(p))) continue;
        pieces.push(candidate);
        if (pieces.length === MAX_PIECES) break;
    }
    return pieces;
}

export function summaryFrom(markdown) {
    const sections = sectionsOf(markdown);
    const lead = resultLead(sections);
    const lesson = lessonLead(sections);
    const findings = findingLeads(sections);

    // Text arrows are banned in prose (WRITING-GUARDRAILS.md §3), but some
    // rounds coin their finding WITH one — `作る→検証`, `署名→ロック→追記`,
    // `A→B 区間` — and no mechanical rewrite keeps those meanings. Among the
    // interchangeable fallback headings we can simply pick an arrow-free one;
    // 結果 and 学び are the round's own verdict and are quoted as written.
    const withArrows = selectPieces([lead, lesson, ...findings]);
    const withoutArrows = selectPieces([lead, lesson, ...findings.filter((f) => !TEXT_ARROW.test(f))]);
    const pieces = withoutArrows.length === withArrows.length ? withoutArrows : withArrows;
    if (!pieces.length) return "";

    let summary = joinPieces(pieces);
    if (summary.length > MAX_LENGTH) {
        // Drop the second piece rather than cutting a sentence in half.
        summary = joinPieces(pieces.slice(0, 1));
        if (summary.length > MAX_LENGTH) summary = `${summary.slice(0, MAX_LENGTH - 1)}…`;
    }
    return summary;
}
