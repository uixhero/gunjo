import type { Locale } from "@/lib/translations";

/**
 * 面の中に出す「お知らせの帯」の唯一の置き場所。
 *
 * ⭐⭐ 次の告知を出す手順は「下の SITE_NOTICE に1つ入れる」だけです。
 *    器（SiteNoticeBanner.tsx）・置き場所（SiteNoticeSlot.tsx と、それを呼ぶ4面）は1文字も触りません。
 *
 * ⛔ 既定は null＝**告知が無ければ、どの面にも何も出ません**（空の帯も枠も出ません）。
 * ⛔ 特定の企画の語（商品名・「先行登録」など）をこのファイルの型や関数名に入れないこと。
 *    ここが持つのは「いま告知が在るか」と「その文言」だけで、中身が何の告知かは知りません。
 *
 * ⚠️ フッター手前の本の帯（app/lib/book-promo.ts + BookBannerSlot.tsx）とは別物です。
 *    あちらは「常設の販促・サイト共通の位置」、こちらは「期間限定のお知らせ・面の中」。
 *    ⛔ 片方の文言をもう片方に入れないこと。
 */
export interface SiteNoticeCopy {
    /** 帯に出す文。⭐ 折り返します＝長さの上限はありませんが、2〜3行で収まる長さに。 */
    message: string;
    /** ボタンの札 */
    actionLabel: string;
    /**
     * 行き先。⭐ `/` で始まればサイト内（next/link）、それ以外は外部リンク（別タブ）として出ます。
     *
     * ⚠️⚠️ **言語ごとに別の URL を入れられます。** 日本語の着地先しか無い告知を英語の面から
     *    踏ませない、というのがこの形の目的です（下げた「AI指示書パック」の帯の失敗がそれでした）。
     */
    href: string;
}

export interface SiteNotice {
    /**
     * 計測に乗る識別子。⛔ 一度出した値は変えない（変えるとレポートが分断されます）。
     * 〈告知の中身〉を snake_case で（例: "book_launch"）。
     */
    id: string;
    /**
     * 言語ごとの文言。
     *
     * ⭐⭐ **その言語の文言が無ければ、その言語の面には帯ごと出ません。**
     *    ⛔ 日本語の文言を英語の面にそのまま出さない・⛔ 機械翻訳もしない。逆（en だけ）も同じです。
     *    ＝日本語だけの告知は `{ ja: … }` と書けば、それだけで英語の面から消えます。
     */
    copy: Partial<Record<Locale, SiteNoticeCopy>>;
}

/**
 * ⭐⭐ **いま出ている告知。null＝何も出ない（既定）。**
 *
 * 例（コメントのまま。出すときはこの形を null と差し替える）:
 *
 *   export const SITE_NOTICE: SiteNotice | null = {
 *       id: "book_launch",
 *       copy: {
 *           ja: { message: "…", actionLabel: "…", href: "/…" },
 *           en: { message: "…", actionLabel: "…", href: "/en/…" },
 *       },
 *   };
 *
 * ⛔ 同時に2つ出す形にしないこと＝面の中のお知らせは1つまで（2つ並ぶと両方読まれません）。
 */
export const SITE_NOTICE: SiteNotice | null = null;

/** その言語の面に出す告知。⭐ 無ければ null＝呼び出し側は何も描きません。 */
export function siteNoticeFor(
    locale: Locale
): { id: string; copy: SiteNoticeCopy } | null {
    const notice = SITE_NOTICE;
    if (!notice) return null;
    const copy = notice.copy[locale];
    if (!copy) return null;
    return { id: notice.id, copy };
}
