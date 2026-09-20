"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BookBanner } from "@/components/book/BookBanner";
import { AppPromoBanner } from "@/components/app-promo/AppPromoBanner";
import { bookPromoCopyFor } from "@/lib/book-promo-copy";
import { appPromoCopyFor } from "@/lib/app-promo-copy";
import { isBookBannerVisible } from "@/lib/book-promo";
import { isAppPromoPublic } from "@/lib/app-promo";
import { useLocale } from "@/components/providers/LocaleProvider";

export type PromoBannerPlacement = "global" | "content";

/**
 * 面ごとに本文の幅が違う面。ここに挙げた面は、面を知っている側（DocsShell / TokensLayout /
 * ColdTestShell）が `placement="content"` で自分の本文の列の中に枠を置きます。
 * ⛔ だから `placement="global"`（app/layout.tsx）は、この面では出しません＝出すと枠が2つになります。
 *
 * ⚠️ ここは幅の値ではなく「どちらが器を巻くか」の一覧です。幅そのものはそれぞれの面が持ちます。
 */
const SURFACES_WITH_OWN_SLOT: readonly RegExp[] = [
    // /docs/** … DocsShell のサイドバー付きグリッドの右列が本文
    /^\/docs(\/|$)/,
    // /tokens/** … TokensLayout の左ナビ付きグリッドの右列が本文
    /^\/tokens(\/|$)/,
    // /cold-tests/<回> と /en/cold-tests/<回> … ColdTestShell の右列が本文
    //（一覧の /cold-tests・/cold-tests/why・/cold-tests/categories/** は container なので global 側）
    /^(\/en)?\/cold-tests\/\d+(\/|$)/,
];

/**
 * フッターの手前の「告知の枠」。⭐⭐ **1つの枠に、上から本の帯・アプリの帯を縦に並べます**
 *（4px.jp と同じ並べ方）。
 *
 * ⭐⭐ 幅は **ここ**（面を知っている側）で決めます。⛔ 帯そのものには器を持たせません。
 *   - `global`  … サイト共通の面。本文と同じ `container` を巻く。
 *   - `content` … 自分でサイドバー付きの器を持っている面。既にその列の中にいるので**何も巻かない**。
 *
 * ⚠️ 「同じ幅の値を書く」ではなく「同じ器（`container`）を通す」こと。Tailwind の `container` は
 *    ブレークポイントがそのまま最大幅なので、値で写すと必ずずれます。
 *
 * ⭐⭐ **上下の空きもここが持ちます**（`py-10 sm:py-14`）。⛔ 帯の側に戻さないこと＝
 *    2枚が縦に並ぶと、帯ごとの空きが足し合わさって間だけが広がります。帯どうしの間は `gap-6`。
 *
 * ⭐ 出さない面は SiteFooter.tsx と同じ考え方でそろえてあります
 *    （/embed はサイトの枠そのものが無い・iframe の中は埋め込みプレビュー）。
 *
 * ⭐⭐ **言語もここで決めます。** 帯を出すか出さないかの言語側の判定は
 *    `useLocale()`（LocaleProvider）1箇所だけです。
 *    ⛔⛔ **「/en で始まるか」をここで書かないこと。** 英語かどうかを知っているのは
 *    LocaleProvider で、そこは既に `/en/**` を見て locale を決めています。ここでパスをもう一度
 *    読むと判定が2箇所になり、`app/en/` に面が増えた日に片方だけ直し忘れます。
 *    ⭐ いまの形なら、`app/en/` に何を足しても**その面は勝手に帯なし側に入ります**。
 *
 * ⚠️ 判定が locale であって「URL が /en か」ではないので、日本語の面でも**読み手が言語の切り替えを
 *    English にしている間は本の帯が出ません**。⭐ これは意図した挙動です＝画面の言語を英語にしている
 *    読み手は英語の読み手で、日本語の本の売り文句を見せる相手ではありません。
 *    ⭐ アプリの帯は英語の文言があるので、英語の面ではアプリの帯だけが残ります。
 *
 * ⚠️⚠️ **2026-09-20 時点で、アプリの帯は既定では出ません**（App Store の審査待ち）。
 *    旗の名前と立てかたは app/lib/app-promo.ts の isAppPromoPublic() にあります。
 */
export function PromoBannerSlot({
    placement = "global",
}: {
    placement?: PromoBannerPlacement;
}) {
    const pathname = usePathname();
    const { locale } = useLocale();
    const [isInIframe, setIsInIframe] = React.useState(false);

    React.useEffect(() => {
        try {
            setIsInIframe(window.self !== window.top);
        } catch {
            setIsInIframe(true);
        }
    }, []);

    // ⭐ その言語の文言が無ければ、その帯だけ出しません（いま英語は本の帯が未設定）。
    const bookCopy = bookPromoCopyFor(locale);
    const appCopy = appPromoCopyFor(locale);

    const showBook = bookCopy !== null && isBookBannerVisible();
    const showApp = appCopy !== null && isAppPromoPublic();

    // ⭐ 2枚とも出ないなら枠ごと出しません。⛔ 空の枠を残さないこと＝上下の空きだけが残ります。
    if (!showBook && !showApp) return null;

    if (pathname?.startsWith("/embed")) return null;
    if (isInIframe) return null;
    if (
        placement === "global" &&
        pathname &&
        SURFACES_WITH_OWN_SLOT.some((surface) => surface.test(pathname))
    ) {
        return null;
    }

    const banners = (
        <div className="flex flex-col gap-6 py-10 sm:py-14">
            {showBook && bookCopy ? <BookBanner copy={bookCopy} /> : null}
            {showApp && appCopy ? <AppPromoBanner copy={appCopy} /> : null}
        </div>
    );

    if (placement === "content") return banners;

    return <div className="container">{banners}</div>;
}
