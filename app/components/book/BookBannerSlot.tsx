"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BookBanner } from "./BookBanner";
import { bookPromoCopyFor } from "@/lib/book-promo-copy";
import { useLocale } from "@/components/providers/LocaleProvider";

export type BookBannerPlacement = "global" | "content";

/**
 * 面ごとに本文の幅が違う面。ここに挙げた面は、面を知っている側（DocsShell / TokensLayout /
 * ColdTestShell）が `placement="content"` で自分の本文の列の中に帯を置きます。
 * ⛔ だから `placement="global"`（app/layout.tsx）は、この面では出しません＝出すと帯が2つになります。
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
 * 帯（BookBanner）に「その面の器」を巻いて置くための枠。
 *
 * ⭐⭐ 幅は **ここ**（面を知っている側）で決めます。⛔ 帯そのものには器を持たせません。
 *   - `global`  … サイト共通の面。本文と同じ `container` を巻く。
 *   - `content` … 自分でサイドバー付きの器を持っている面。既にその列の中にいるので**何も巻かない**。
 *
 * ⚠️ 「同じ幅の値を書く」ではなく「同じ器（`container`）を通す」こと。Tailwind の `container` は
 *    ブレークポイントがそのまま最大幅なので、値で写すと必ずずれます。
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
 *    English にしている間は帯が出ません**。⭐ これは意図した挙動です＝画面の言語を英語にしている
 *    読み手は英語の読み手で、日本語の本の売り文句を見せる相手ではありません。
 */
export function BookBannerSlot({
    placement = "global",
}: {
    placement?: BookBannerPlacement;
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

    // ⭐ その言語の文言が無ければ帯ごと出しません（いま英語は未設定＝book-promo-copy.ts の `en`）。
    const copy = bookPromoCopyFor(locale);
    if (!copy) return null;

    if (pathname?.startsWith("/embed")) return null;
    if (isInIframe) return null;
    if (
        placement === "global" &&
        pathname &&
        SURFACES_WITH_OWN_SLOT.some((surface) => surface.test(pathname))
    ) {
        return null;
    }

    if (placement === "content") return <BookBanner copy={copy} />;

    return (
        <div className="container">
            <BookBanner copy={copy} />
        </div>
    );
}
