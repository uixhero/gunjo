// Cold-test article bodies cite earlier rounds as markdown links whose target
// was never filled in — the href is a bare `#`:
//
//     前回まで [#1](#)〜[#119](#)
//     前回: [#1 設定画面](#) / [#2 モーダル告知](#)
//     [第1回（設定画面）](#)に続いて、今回は…
//
// The links are resolved here, at render time, rather than in the data.
// `app/data/cold-test-rounds/*.json` is generated: `npm run
// coldtest-gallery:rounds` rewrites every round file wholesale from
// promotion/ + the gunjo-test app, so a target written into the JSON would be
// erased by the next regeneration. Resolving in the renderer also means a
// round written tomorrow needs no special formatting to get working links.
//
// See issue #726.

import { EN_COLD_TEST_BASE, JA_COLD_TEST_BASE } from "./cold-test-paths";

/** The href an unresolved article link carries. */
export const UNRESOLVED_ARTICLE_HREF = "#";

/** Round numbers that have a page, per language. */
export interface ColdTestRoundIndex {
    /** Every round with a Japanese page. */
    ja: ReadonlySet<number>;
    /** Every round with an English page in this environment. */
    en: ReadonlySet<number>;
}

// `#12` anywhere in the label, as long as it is not glued to a word character
// on the left (so `abc#12` is not a round reference) and not followed by more
// digits. Covers `#12`, `#12 データテーブル`, and `本当に AI に使わせてみた #1（設定画面）`.
const HASH_REF = /(?:^|[^0-9A-Za-z_])#(\d{1,4})(?![0-9])/;
// The prose form used in the earliest rounds: `第1回（設定画面）`.
const KAI_REF = /第(\d{1,4})回/;

/**
 * The round a link label refers to, or null when the label is not a round
 * reference at all (e.g. `まとめ記事: [群青（@gunjo/ui）](#)`).
 */
export function roundRefFromLinkText(text: string): number | null {
    const hash = HASH_REF.exec(text);
    if (hash) return Number(hash[1]);
    const kai = KAI_REF.exec(text);
    if (kai) return Number(kai[1]);
    return null;
}

/**
 * Where a round reference should point from a page under `base`, or null when
 * the round has no page to point at.
 *
 * Existence is checked rather than assumed: the series has gaps (94, 99 and
 * 100 have no round page as of 2026-08-14), and #101 cites `#100` as the end
 * of a range. Returning null for those keeps the reference as plain text
 * instead of manufacturing a 404, and keeps working as more gaps appear.
 */
export function coldTestRoundHref(
    round: number,
    base: string,
    index: ColdTestRoundIndex
): string | null {
    if (base === EN_COLD_TEST_BASE) {
        if (index.en.has(round)) return `${EN_COLD_TEST_BASE}/${round}`;
        // Not translated yet. The Japanese round is still a real page, and a
        // citation that goes nowhere reads worse than one that changes
        // language — the caller marks these with hrefLang="ja" so the switch
        // is announced. This is the one place a link out of /en leaves
        // English; the sidebar and the pager still stay inside the
        // translated set.
        if (index.ja.has(round)) return `${JA_COLD_TEST_BASE}/${round}`;
        return null;
    }
    return index.ja.has(round) ? `${JA_COLD_TEST_BASE}/${round}` : null;
}
