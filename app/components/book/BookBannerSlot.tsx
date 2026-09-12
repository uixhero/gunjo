"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BookBanner } from "./BookBanner";

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
 */
export function BookBannerSlot({
    placement = "global",
}: {
    placement?: BookBannerPlacement;
}) {
    const pathname = usePathname();
    const [isInIframe, setIsInIframe] = React.useState(false);

    React.useEffect(() => {
        try {
            setIsInIframe(window.self !== window.top);
        } catch {
            setIsInIframe(true);
        }
    }, []);

    if (pathname?.startsWith("/embed")) return null;
    if (isInIframe) return null;
    if (
        placement === "global" &&
        pathname &&
        SURFACES_WITH_OWN_SLOT.some((surface) => surface.test(pathname))
    ) {
        return null;
    }

    if (placement === "content") return <BookBanner />;

    return (
        <div className="container">
            <BookBanner />
        </div>
    );
}
