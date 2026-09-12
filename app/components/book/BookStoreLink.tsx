"use client";

import { track } from "@vercel/analytics";
import { IconExternalLink } from "@tabler/icons-react";
import { Button } from "@gunjo/ui";
import { BOOK_ID, BOOK_PROMO_PLACEMENT, type BookStoreId } from "@/lib/book-promo";
import { BOOK_PROMO_COPY } from "@/lib/book-promo-copy";

interface BookStoreLinkProps {
    id: BookStoreId;
    /** 店の名前（読み上げ用）。画面に出る文字は label */
    name: string;
    /** ボタンの文字。正は book-promo-copy.ts */
    label: string;
    href: string;
}

/**
 * 本の帯の中の「販売先へ行くリンク」1本。
 *
 * ⭐ 計測は gunjo.jp が既に使っている仕組みに合わせる＝`@vercel/analytics` の track()。
 *    ⛔ 新しい仕組み（gtag / dataLayer への直接 push）を持ち込まないこと。GTM は app/layout.tsx に
 *    入っていますが、アプリ側から送っているイベントは PackForm.tsx / PackCta.tsx の track() だけです。
 * ⭐ イベント名 `book_store_click` は、gunjo の既存の命名（`pack_view` / `pack_registered` /
 *    `pack_cta_click`＝〈機能〉_〈動作〉の snake_case）に合わせて決めました。
 *    ⚠️ uixhero.com の同じ帯は GA4 の `outbound_click` ですが、あちらは「本文中の外部リンク」と
 *    同じ名前で揃える設計で、gunjo には outbound_click に当たる既存イベントがありません。
 *    ⛔ 別サイトの名前をそのまま持ち込まないこと（ここでは gunjo 側の命名が正）。
 *
 *    store     = zenn | amazon | apple_books | google_play_books（正は app/lib/book-promo.ts）
 *    placement = book_banner（本文中の導線と区別する）
 *    book      = gunjo-ai-ui-175（2冊目が出たときに本ごとに分けて読むため）
 */
export function BookStoreLink({ id, name, label, href }: BookStoreLinkProps) {
    return (
        <Button asChild variant="primary">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={BOOK_PROMO_COPY.newTabTitle(name)}
                onClick={() =>
                    track("book_store_click", {
                        store: id,
                        placement: BOOK_PROMO_PLACEMENT,
                        book: BOOK_ID,
                    })
                }
            >
                {label}
                <IconExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
                <span className="sr-only">{BOOK_PROMO_COPY.newTabNotice}</span>
            </a>
        </Button>
    );
}
