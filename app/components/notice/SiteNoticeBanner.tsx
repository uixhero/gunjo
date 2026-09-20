"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { Alert, Button, cn } from "@gunjo/ui";
import type { SiteNoticeCopy } from "@/lib/site-notice";

/**
 * 面の中に置く「お知らせの帯」の器。
 *
 * ⛔⛔ **文言をここに書かないこと**＝正は app/lib/site-notice.ts。`copy` で外から渡ります。
 * ⛔⛔ **言語をここで選ばないこと**＝選ぶのはロケールを持っている側＝SiteNoticeSlot.tsx。
 *    ⛔ ここで `pathname` を読んで「/en で始まるか」を見ないこと。判定が2箇所になります。
 * ⛔ 横幅の器もここには持たせません＝置く側（各面）が自分の列の中に置きます。
 *
 * ⭐⭐ **地は Banner ではなく Alert です。** @gunjo/ui の Banner は `h-10` の1行で、
 *    はみ出した本文を truncate で切る部品です（Banner.tsx の説明のとおり）。告知の文は
 *    言語で長さが変わる＝英語は語の途中で折り返せないぶん日本語より横に長い行ができるので、
 *    1行に固定すると必ず切れます。折り返す告知は Alert、というのは同じ設計判断を
 *    StickyNoticeBar も採っています（「Messages wrap instead of truncating」）。
 *    ⛔ Banner に戻さないこと＝それが issue #874（375px でボタンの文字が2行に割れて外へ出る）です。
 *
 * ⭐ 375px で壊れない形（#874 の直し）:
 *    1. 狭いときは**縦積み**（`flex-col`）＝文とボタンが横幅を取り合いません。
 *    2. ボタンは狭いとき**横いっぱい**（`w-full sm:w-auto`）＝札が折り返して外へ出ません。
 *    3. 文は `min-w-0` + 折り返し＝切れずに何行にでもなります（Alert に高さの上限はありません）。
 *    4. 横に余裕が出たら（`sm:` 以上）1行に戻り、ボタンは `shrink-0` で潰れません。
 *
 * ⛔ 左端の縦の色帯（border-left / inset shadow / absolute left-0 の細い帯）を足さないこと
 *    ＝gunjo.jp の UI 共通の禁止事項（CLAUDE.md）。
 */
export function SiteNoticeBanner({
    id,
    copy,
    placement,
    className,
}: {
    /** 計測に乗る告知の識別子。正は app/lib/site-notice.ts */
    id: string;
    /** その面の言語の文言。⛔ ここで言語を選ばない */
    copy: SiteNoticeCopy;
    /** どの面の帯が押されたか。どこが効くかを後から読むため */
    placement: string;
    className?: string;
}) {
    // ⭐ サイト内（`/…`）は next/link、それ以外は外部リンクとして別タブで開きます。
    //    ⚠️ 判定は href の形だけ＝告知ごとに「内部／外部」のフラグを別に持たせません
    //       （URL と種類を2箇所で持つと必ずずれます）。
    const isInternal = copy.href.startsWith("/");
    const onClick = () => track("site_notice_click", { notice: id, placement });

    return (
        <Alert variant="info" className={className}>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="min-w-0 text-sm leading-relaxed">{copy.message}</p>
                <Button
                    asChild
                    size="sm"
                    variant="info"
                    className="w-full shrink-0 sm:w-auto"
                >
                    {isInternal ? (
                        <Link href={copy.href} onClick={onClick}>
                            {copy.actionLabel}
                        </Link>
                    ) : (
                        <a
                            href={copy.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClick}
                        >
                            {copy.actionLabel}
                        </a>
                    )}
                </Button>
            </div>
        </Alert>
    );
}
