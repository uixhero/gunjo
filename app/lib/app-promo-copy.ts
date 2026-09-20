import type { Locale } from "@/lib/translations";

/**
 * ⛔⛔ ここが「GUNJO で作ったアプリの告知」の文言の唯一の置き場所です。
 *      実装（AppPromoBanner.tsx / AppStoreLink.tsx / HomeAppsSection.tsx）には1文字も書かないこと。
 *
 * ⭐ トップの節と、フッター前の帯の、両方の文言をここに置いています。
 *    ⚠️ トップの文言なのに app/lib/translations.ts ではありません。理由＝この告知は**旗1本で丸ごと
 *    消える**もので、審査の結果しだいで文も入れ替わります。消す日・差し替える日に触る場所を
 *    1つにしたいので、本の帯（app/lib/book-promo-copy.ts）と同じ扱いにしてあります。
 *
 * ⭐ 名義の規範（~/dev/new-4px/skills/brand-voice/）＝一人称を使わない・用語は「コンポーネント」
 *    （⛔「部品」は禁止語）・矢印（→）と em-dash を使わない。
 *
 * ⛔⛔ アプリの名前を変えないこと。ストアの配布名が「地球と月」「Earth and Moon」です。
 *      ⛔「Earth & Moon」はホーム画面用の短い名前なので、文章では使いません（申し送り §2）。
 */
export interface AppPromoStrings {
    /**
     * 小見出し。⚠️ **帯だけ**が使います。
     * ⛔ トップの節では出しません＝すぐ上に同じことを言う見出し（homeHeading）が出るためです
     *    （文脈ゼロの検品で「同じことを2回言っている」と指摘されました・2026-09-20）。
     */
    eyebrow: string;
    /** アプリの名前 */
    name: string;
    /** 一行。⛔ 申し送り §4 の確定文言なので言い回しを直さないこと */
    tagline: string;
    /**
     * 説明文。⚠️ **帯だけ**が使います。
     * ⛔ トップの節のカードでは出しません＝トップには節と帯が両方出るので、同じ面に同じ文が
     *    2回並びます（上と同じ検品で指摘・2026-09-20）。節の側は homeDescription が受けます。
     */
    bannerLead: string;
    /** ストアのボタンの文字 */
    storeLabel: string;
    /** 実例ページへ送るリンクの文字 */
    docsLabel: string;
    /** トップの節の見出しと説明文 */
    homeHeading: string;
    homeDescription: string;
    /** アプリ自身のサイトへのリンクの文字 */
    siteLabel: string;
    /** 読み上げ用の補助 */
    newTabTitle: string;
    newTabNotice: string;
}

const JA: AppPromoStrings = {
    eyebrow: "GUNJO で作っているアプリ",
    name: "地球と月",
    tagline: "いま地球で起きていることを、そのまま映す地球儀",
    bannerLead:
        "iPhone と iPad のアプリです。雲・雨雲・昼と夜の境目・ISS（国際宇宙ステーション）の位置を、実際の時刻のまま見られます。" +
        "この画面を組むために作ったコンポーネントは、GUNJO に入っています。",
    storeLabel: "App Store で入手",
    docsLabel: "画面の作りを読む",
    homeHeading: "GUNJO を使って作っているアプリ",
    homeDescription:
        "GUNJO のコンポーネントで組んで、App Store に出しているアプリです。どの画面をどう作ったかと、そこで生まれたコンポーネントは、実例のページにあります。",
    siteLabel: "ブラウザ版を試す",
    newTabTitle: "App Store を新しいタブで開く",
    newTabNotice: "（新しいタブで開く）",
};

const EN: AppPromoStrings = {
    eyebrow: "Built with GUNJO",
    name: "Earth and Moon",
    tagline: "A live globe of what is happening on Earth right now",
    bannerLead:
        "An app for iPhone and iPad. It shows clouds, rain, the line between day and night, and where the ISS (International Space Station) is, all at the real time of day. " +
        "The components built for these screens are part of GUNJO.",
    storeLabel: "Get it on the App Store",
    docsLabel: "Read how the screens are built",
    homeHeading: "Apps built with GUNJO",
    homeDescription:
        "Apps built from GUNJO components and shipped on the App Store. How each screen is made, and which components came out of it, are on the example page.",
    siteLabel: "Try the browser version",
    newTabTitle: "Open the App Store in a new tab",
    newTabNotice: "(opens in a new tab)",
};

/**
 * 言語ごとの文言。⭐ 未設定（null）の言語には告知を出しません。
 *
 * ⭐⭐ 本の帯と違って**英語も埋めてあります**。本は日本語だけの商品ですが、アプリとその実例ページ
 *    （/docs/apps/earthmoon）は英語もあり、英語の一行も申し送り §4 で確定しているためです。
 * ⛔ 英語の面に出したくなくなったら、下の `en` を null にするだけ（実装は1行も直りません）。
 */
export const APP_PROMO_COPY: Record<Locale, AppPromoStrings | null> = {
    ja: JA,
    en: EN,
};

/** その面の言語の文言。⭐ 無ければ null ＝呼ぶ側は告知ごと出しません */
export function appPromoCopyFor(locale: Locale): AppPromoStrings | null {
    return APP_PROMO_COPY[locale];
}
