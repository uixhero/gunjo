/**
 * The paid book banner that sits just above the site footer.
 *
 * This module owns the *stores* only. The wording lives in
 * `app/lib/book-promo-copy.ts` — it differs per site and gets replaced later,
 * so it must not be mixed into either the structure or the components.
 *
 * The same shape exists in uixhero.com and design-qa.com. It is deliberately
 * NOT part of `@gunjo/ui`: the design system ships components, not marketing
 * data, and pulling a store list through an npm release would make adding a
 * store a three-repo release instead of a one-line edit.
 */

/**
 * Store identifiers. These values are sent to GA4 as `destination`, so once a
 * value has shipped it must not be renamed — doing so splits the report.
 */
export type BookStoreId = "zenn" | "amazon" | "apple_books" | "google_play_books";

export interface BookStore {
    id: BookStoreId;
    /** Shown on the button, and used for the link's hover title. */
    label: string;
    /**
     * Adding a store means putting its URL here — nothing else.
     * A store that is not on sale yet stays `null` and is simply not rendered.
     *
     * There is deliberately no separate `available` flag: holding "is it live"
     * and "where is it" in two places guarantees they drift apart.
     */
    href: string | null;
}

/**
 * Render order is the order of this array. Adding a store touches this array
 * and nothing else — not the banner, not the ordering, not the tracking.
 *
 * Keep the URLs in this short form. Amazon links copied from a browser carry
 * `ref=` / `qid=` tracking parameters; both URLs below were measured returning
 * 200 in this exact form on 2026-09-08.
 */
export const BOOK_STORES: readonly BookStore[] = [
    { id: "zenn", label: "Zenn", href: "https://zenn.dev/uixhero/books/gunjo-ai-ui-175" },
    { id: "amazon", label: "Amazon Kindle", href: "https://www.amazon.co.jp/dp/B0HGY96KXR" },
    // Not published on these two yet (2026-09-08). Fill in the URL to ship.
    { id: "apple_books", label: "Apple Books", href: null },
    { id: "google_play_books", label: "Google Play Books", href: null },
];

/** The stores that have a URL, in array order. */
export function availableBookStores(): { id: BookStoreId; label: string; href: string }[] {
    return BOOK_STORES.filter(
        (store): store is BookStore & { href: string } => store.href !== null
    );
}

/** Sent to GA4 as `book`, so a second title can be told apart under the same event. */
export const BOOK_ID = "gunjo-ai-ui-175";

/** Sent to GA4 as `site` — which of the three sites the click came from. */
export const BOOK_PROMO_SITE = "gunjo";

/** public/book-gunjo-ai-ui-175-cover.webp — 320x448, 15 KB. */
export const BOOK_COVER = {
    src: "/book-gunjo-ai-ui-175-cover.webp",
    width: 320,
    height: 448,
} as const;
