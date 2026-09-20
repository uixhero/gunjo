/**
 * GUNJO で作ったアプリの告知（トップの節と、フッター前の帯）の骨組み。
 *
 * ⭐ このファイルが持つのは「どのアプリを、どのリンクで、出してよいか」と「計測に載せる識別子」だけ。
 * ⛔ 文言は持たない＝正は app/lib/app-promo-copy.ts。
 * ⛔ 見た目・器も持たない＝正は app/components/app-promo/AppPromoBanner.tsx と
 *    app/components/promo/PromoBannerSlot.tsx。
 *
 * ⭐ 形は本の帯（app/lib/book-promo.ts）に合わせてあります＝同じ場所に縦に並ぶ2枚なので、
 *    片方だけ別の作りにすると、増やすときの手順が2通りになります。
 */

/** アプリの識別子。⛔ 一度出した値は変えない（計測の `app` にそのまま乗る） */
export type PromoAppId = "earthmoon";

export interface PromoApp {
    id: PromoAppId;
    /** GUNJO の中の実例ページ。トップの節も帯の見出しもここへ送る */
    docsHref: string;
    /** アプリ自身のサイト（ブラウザ版）。トップの節の副リンク */
    siteHref: string;
    /**
     * ストアのリンク（審査を待たずに使える、ふつうの頁）。
     * ⛔ 国のコード（`/jp/` `/us/`）を入れないこと＝入れると見た人の国のストアへ転送されなくなる
     *    （申し送り §1 の決め）。
     */
    storeHref: string;
    /**
     * ⚠️ ウィジェットのカスタムプロダクトページ。**2026-09-20 時点で審査中**。
     *    審査が通った日に NEXT_PUBLIC_EARTHMOON_WIDGET_PAGE_APPROVED を立てると、
     *    リンクがこちらに切り替わります＝⭐ 切り替えはこの1か所だけ（下の appStoreHref）。
     */
    storeHrefWidgetPage: string;
    /** アイコン。public/apps/earthmoon/icon-192.webp（192×192・4,806バイト） */
    icon: { src: string; width: number; height: number };
}

/**
 * ⭐ 並び順＝この配列の順。**アプリを増やす手順はここに1つ足すだけ**で、
 *    トップの節（app/(home)/page.tsx）・帯・計測はどれも触らなくてよい形にしてあります。
 * ⚠️ いまは1件です。トップの節はそれでも一覧の形（格子）で組んであります。
 */
export const PROMO_APPS: readonly PromoApp[] = [
    {
        id: "earthmoon",
        docsHref: "/docs/apps/earthmoon",
        siteHref: "https://earthmoon.4px.jp/",
        storeHref: "https://apps.apple.com/app/id6808464474",
        storeHrefWidgetPage:
            "https://apps.apple.com/app/id6808464474?ppid=6047df08-2da7-443e-842e-bb1717ecafac",
        icon: { src: "/apps/earthmoon/icon-192.webp", width: 192, height: 192 },
    },
];

function isOn(value: string | undefined): boolean {
    return value === "1" || value === "true";
}

/**
 * ⭐⭐ **出すか出さないかの旗。既定は「出さない」です。**
 *
 * ⚠️ 2026-09-20 時点で App Store の審査中＝KeEem の決めは「審査が終わってから出す」。
 *    旗を立てていない間、トップの節も帯も**1文字も描画しません**（節ごと・帯ごと消えます）。
 *
 * 立てかた＝Vercel の Environment Variables（Production）に
 *   `NEXT_PUBLIC_EARTHMOON_BANNER_PUBLIC` = `1`
 * を足して再デプロイする。手元で見るときは `.env.local` に同じ1行。
 * ⚠️ `NEXT_PUBLIC_` が要ります＝トップの節も帯もクライアント側で描くため
 *    （4px.jp は `EARTHMOON_BANNER_PUBLIC`。Next.js のこちら側では接頭辞が要るぶんだけ名前が違います）。
 * ⚠️ 値は文字列の `1` か `true`。⛔ `process.env` を直に読まないこと＝読み方が2通りになります。
 */
export function isAppPromoPublic(): boolean {
    return isOn(process.env.NEXT_PUBLIC_EARTHMOON_BANNER_PUBLIC);
}

/**
 * ⭐ ウィジェットのカスタムプロダクトページの審査が通ったかどうかの旗。既定は「まだ」。
 *
 * 立てかた＝`NEXT_PUBLIC_EARTHMOON_WIDGET_PAGE_APPROVED` = `1`。
 * ⭐ 上の旗とは別です＝アプリの告知を出すことと、どのストアの頁を見せるかは別の判断なので、
 *    片方だけ先に立てられます（審査が落ちても告知は普通のリンクで出せます）。
 */
export function isWidgetProductPageApproved(): boolean {
    return isOn(process.env.NEXT_PUBLIC_EARTHMOON_WIDGET_PAGE_APPROVED);
}

/** そのアプリの、いま使ってよいストアのリンク。⭐ 切り替えはここ1か所 */
export function appStoreHref(app: PromoApp): string {
    return isWidgetProductPageApproved() ? app.storeHrefWidgetPage : app.storeHref;
}

/**
 * 計測。
 *
 * ⭐ 送り先は本の帯とまったく同じ＝`@vercel/analytics` の `track()`
 *    （app/components/book/BookStoreLink.tsx に、なぜ track() なのかの経緯があります）。
 *    ⛔ 新しい仕組み（`gtag()` の直接呼び出しなど）を増やさないこと。
 *
 * ⚠️⚠️ 申し送りでは「本の告知と同じ `outbound_click` に揃える」でしたが、**gunjo には
 *    `outbound_click` というイベントがありません**。gunjo 側の本の帯は `book_store_click` で、
 *    これは `pack_view` / `pack_cta_click` と同じ〈機能〉_〈動作〉の命名にそろえた名前です
 *    （`outbound_click` は uixhero.com 側の名前）。そこで**仕組みは同じまま、名前だけ gunjo の
 *    型に合わせて** `app_store_click` にしました。`placement` は指示どおり `earthmoon_banner` です。
 *
 *    app       = earthmoon（アプリが増えたときに分けて読むため）
 *    store     = app_store（Google Play に出す日が来たら値を足す）
 *    placement = earthmoon_banner（フッター前の帯）/ home_apps（トップの節）
 */
export const APP_PROMO_EVENT = "app_store_click";
export const APP_PROMO_STORE = "app_store";
export const APP_PROMO_PLACEMENT_BANNER = "earthmoon_banner";
export const APP_PROMO_PLACEMENT_HOME = "home_apps";
