/**
 * 有料本『あなたがAIにUIを作らせると、何が起きるか』への導線（フッター前の帯）の骨組み。
 *
 * ⭐ このファイルが持つのは「販売先が在るか無いか」と「計測に載せる識別子」だけ。
 * ⛔ 文言は持たない＝正は app/lib/book-promo-copy.ts（同じ本でもサイトごとに言い方が違い、
 *    後から差し替わるため）。
 * ⛔ 見た目・器も持たない＝正は app/components/book/BookBanner.tsx と BookBannerSlot.tsx。
 */

/**
 * 販売先の識別子。計測の `store` にそのまま乗る値でもあるので、
 * ⛔ 一度出した値は変えない（変えるとレポートが分断される）。
 */
export type BookStoreId = "zenn" | "amazon" | "apple_books" | "google_play_books";

export interface BookStore {
    id: BookStoreId;
    /** 店の名前。読み上げ用の「◯◯ を新しいタブで開く」に使う（画面に出る文字ではない） */
    name: string;
    /**
     * ⭐ 販売先を増やす手順は「ここに URL を入れる」だけ。まだ出していない販売先は null＝表に出ない。
     * ⛔ available のような別のフラグは持たない。URL と在り／無しを2箇所で持つと必ずずれる。
     */
    href: string | null;
}

/**
 * ⭐ 並び順＝この配列の順。増やすときは href に URL を入れるだけで、
 *    器（BookBanner.tsx）・並び・計測はどれも触らなくてよい。
 *
 * ⚠️ URL に ref= / qid= のような追跡パラメータを付けないこと。下の2本は HQ が 200 を実測した最短の形。
 */
export const BOOK_STORES: readonly BookStore[] = [
    { id: "zenn", name: "Zenn", href: "https://zenn.dev/uixhero/books/gunjo-ai-ui-175" },
    { id: "amazon", name: "Amazon", href: "https://www.amazon.co.jp/dp/B0HGY96KXR" },
    // ⚠️ 2026-09-12 時点でまだ出していない。出したら href に URL を入れるだけでこの順に並ぶ。
    { id: "apple_books", name: "Apple Books", href: null },
    { id: "google_play_books", name: "Google Play ブックス", href: null },
];

/** URL が入っている販売先だけを、配列の順で返す */
export function availableBookStores(): { id: BookStoreId; name: string; href: string }[] {
    return BOOK_STORES.filter(
        (store): store is BookStore & { href: string } => store.href !== null
    );
}

/** この本の識別子。計測の `book` に乗る＝2冊目が出たときに本ごとに分けて読むため */
export const BOOK_ID = "gunjo-ai-ui-175";

/** 帯の中から押されたことを示す値。本文中の導線と混ざらないように分ける */
export const BOOK_PROMO_PLACEMENT = "book_banner";

/** 表紙。public/images/book-gunjo-ai-ui-175-cover.webp（320×448・15,210バイト） */
export const BOOK_COVER = {
    src: "/images/book-gunjo-ai-ui-175-cover.webp",
    width: 320,
    height: 448,
} as const;

/** 帯を出してよいか。販売先が1つも無いときは器ごと出さない（URL を全部消せば静かに消える） */
export function isBookBannerVisible(): boolean {
    return availableBookStores().length > 0;
}
