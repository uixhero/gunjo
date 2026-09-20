"use client";

import { track } from "@vercel/analytics";
import { IconExternalLink } from "@tabler/icons-react";
import { Button } from "@gunjo/ui";
import { BOOK_ID, BOOK_PROMO_PLACEMENT, type BookStoreId } from "@/lib/book-promo";
import type { BookPromoStrings } from "@/lib/book-promo-copy";

interface BookStoreLinkProps {
    id: BookStoreId;
    /** 店の名前（読み上げ用）。画面に出る文字は label */
    name: string;
    /** ボタンの文字。正は book-promo-copy.ts */
    label: string;
    href: string;
    /** その面の言語の文言。⛔ ここで言語を選ばないこと＝選ぶのは BookBannerSlot（ロケールを持つ側） */
    copy: BookPromoStrings;
}

/**
 * 本の帯の中の「販売先へ行くリンク」1本。
 *
 * ⭐ gunjo には計測の送り先が2つあります。
 *    1. `@vercel/analytics` の track()＝この帯の `book_store_click`、
 *       面の中のお知らせの `site_notice_click`（app/components/notice/SiteNoticeBanner.tsx）
 *    2. GTM の dataLayer＝`sendGTMEvent()`（GTM 自体の読み込みは app/layout.tsx）
 *       ⚠️ 2026-09-20 時点で、これを送っている画面はありません（唯一の送り手だった
 *          /pack の先行登録フォームを下げたため）。仕組みだけが layout.tsx に残っています。
 *    この帯は track() のほうに揃えました＝イベント名 `book_store_click` を、gunjo の既存の命名
 *    （〈機能〉_〈動作〉の snake_case）に合わせるためです。
 *    ⛔ 3つ目の仕組み（`gtag()` の直接呼び出しなど）を増やさないこと。
 *    ⚠️ `gtag()` はそもそも届きません＝このサイトは <GoogleTagManager> 経由でしか GA4 を
 *    読み込んでいないためです。
 *    ⚠️ uixhero.com の同じ帯は GA4 の `outbound_click` ですが、あちらは「本文中の外部リンク」と
 *    同じ名前で揃える設計で、gunjo には outbound_click に当たる既存イベントがありません。
 *    ⛔ 別サイトの名前をそのまま持ち込まないこと（ここでは gunjo 側の命名が正）。
 *
 *    store     = zenn | amazon | apple_books | google_play_books（正は app/lib/book-promo.ts）
 *    placement = book_banner（本文中の導線と区別する）
 *    book      = gunjo-ai-ui-175（2冊目が出たときに本ごとに分けて読むため）
 */
export function BookStoreLink({ id, name, label, href, copy }: BookStoreLinkProps) {
    return (
        <Button asChild variant="primary">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={copy.newTabTitle(name)}
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
                <span className="sr-only">{copy.newTabNotice}</span>
            </a>
        </Button>
    );
}
