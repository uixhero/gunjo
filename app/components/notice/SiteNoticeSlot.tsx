"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { siteNoticeFor } from "@/lib/site-notice";
import { SiteNoticeBanner } from "./SiteNoticeBanner";

/**
 * 面の中に「お知らせの帯」を置くための枠。
 *
 * ⭐⭐ **既定は何も出ません。** app/lib/site-notice.ts の `SITE_NOTICE` が null の間、
 *    ここは null を返す＝DOM にも何も出ません（空の帯も枠も出ません）。
 *    ⚠️ だから余白はこの枠が `className` で持ちます。⛔ 呼ぶ側で
 *       `<div className="mt-10"><SiteNoticeSlot /></div>` のように外から巻かないこと
 *       ＝告知が無い日に、中身の無い 40px の空きだけが残ります。
 *
 * ⭐⭐ **言語をここで決めます。** 出す／出さないの言語側の判定は `useLocale()`
 *    （LocaleProvider）1箇所だけです。
 *    ⛔⛔ **「/en で始まるか」をここにも帯にも書かないこと。** 英語かどうかを知っているのは
 *    LocaleProvider で、そこは既に `/en/**` を見て locale を決めています。ここでパスをもう一度
 *    読むと判定が2箇所になり、`app/en/` に面が増えた日に片方だけ直し忘れます
 *    ＝それが下げた「AI指示書パック」の帯の不具合（英語のコールドテスト117本に日本語のまま出た）でした。
 *
 * ⭐ その言語の文言が無ければ帯ごと出ません＝日本語だけの告知は日本語の面にだけ出ます。
 *    ⛔ 日本語の文言を英語の面にそのまま出さない・⛔ 機械翻訳もしない。
 *
 * ⚠️ 判定が locale であって「URL が /en か」ではないので、日本語の面でも**読み手が言語の
 *    切り替えを English にしている間は日本語だけの告知が出ません**。⭐ 意図した挙動です
 *    ＝BookBannerSlot.tsx と同じ考え方でそろえてあります。
 *
 * ⚠️ フッター手前の本の帯（BookBannerSlot）との切り分け:
 *    - BookBannerSlot … サイト共通・フッターの手前・常設の販促（本）。位置は器が決める。
 *    - SiteNoticeSlot … 面の中・その面の本文の流れの中・期間限定のお知らせ。位置は呼ぶ面が決める。
 *    ⛔ 片方の役目をもう片方に足さないこと。
 */
export function SiteNoticeSlot({
    placement,
    className,
}: {
    /** どの面に置いた帯か。計測に乗ります（例: "coldtests_index"） */
    placement: string;
    /** この枠自身の余白。⭐ 呼ぶ側で外から巻かないこと（上の説明のとおり） */
    className?: string;
}) {
    const { locale } = useLocale();
    const notice = siteNoticeFor(locale);
    if (!notice) return null;

    return (
        <SiteNoticeBanner
            id={notice.id}
            copy={notice.copy}
            placement={placement}
            className={className}
        />
    );
}
