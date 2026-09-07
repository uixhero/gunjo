/**
 * The ONLY place the book banner's wording lives. Nothing in
 * `app/components/book/` may hard-code a string that belongs here.
 *
 * The wording below is a PLACEHOLDER. To ship the real banner:
 *   1. replace the five fields in `ja` and `en` with the final wording
 *   2. set `draft` to false
 * Nothing else needs to change.
 *
 * While `draft` is true the banner does not render in production (it does
 * render locally and on preview deploys), so placeholder wording cannot reach
 * gunjo.jp by accident — the guard is the build, not somebody remembering.
 */
import type { Locale } from "@/lib/translations";

export interface BookPromoStrings {
    /** Small line above the title — the "it's out" line. */
    eyebrow: string;
    /** The book's title. Not a placeholder: this is the real title. */
    title: string;
    /** The description. */
    lead: string;
    /** Optional extra line; an empty string renders nothing. */
    note: string;
    /** The label above the store buttons. */
    cta: string;
}

/** Placeholder wording — see the note at the top of this file. */
export const BOOK_PROMO_DRAFT = true;

export const BOOK_PROMO_COPY: Record<Locale, BookPromoStrings> = {
    ja: {
        eyebrow: "【仮】2026年8月29日 発売",
        title: "あなたがAIにUIを作らせると、何が起きるか",
        lead: "【仮の文言です】ここに gunjo.jp の読者に向けた説明文が入ります。",
        note: "【仮】ここに補足が入ります",
        cta: "【仮】読む",
    },
    en: {
        eyebrow: "[draft] Published 2026-08-29",
        title: "あなたがAIにUIを作らせると、何が起きるか",
        lead: "[draft] A description for gunjo.jp readers goes here. Japanese only for now.",
        note: "[draft] An optional extra line goes here",
        cta: "[draft] Read",
    },
};

/**
 * Whether the banner may render.
 *
 * MUST be called from a server component. `process.env.VERCEL_ENV` is not
 * inlined into the client bundle, so evaluating this in the browser would fall
 * to the "show it" side and leak placeholder wording into production. The
 * NEXT_RUNTIME check makes a wrong call site fail closed instead: it is only
 * defined on the server.
 */
export function isBookPromoVisible(): boolean {
    if (!BOOK_PROMO_DRAFT) return true;
    if (!process.env.NEXT_RUNTIME) return false;
    return process.env.VERCEL_ENV !== "production";
}
