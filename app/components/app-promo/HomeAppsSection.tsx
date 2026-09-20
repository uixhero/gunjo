"use client";

import Link from "next/link";
import { IconArrowUpRight, IconExternalLink } from "@tabler/icons-react";
import { Card, CardContent, Icon } from "@gunjo/ui";
import { APP_PROMO_PLACEMENT_HOME, isAppPromoPublic, PROMO_APPS, type PromoApp } from "@/lib/app-promo";
import { appPromoCopyFor, type AppPromoStrings } from "@/lib/app-promo-copy";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AppStoreLink } from "./AppStoreLink";

/**
 * トップの「GUNJO を使って作っているアプリ」の節。
 *
 * ⭐⭐ ここが **トップから実例ページ（/docs/apps/earthmoon）への導線**です。
 *    実例ページは前から在りましたが、トップから行く道がありませんでした（#1012）。
 *
 * ⭐⭐ **アプリが増えても並べられる形**にしてあります＝一覧は app/lib/app-promo.ts の
 *    `PROMO_APPS` をそのまま回すだけで、2件目を足すときにこのファイルは1行も直りません。
 *
 * ⭐⭐ **1件のときだけ、カードが幅いっぱいに広がります**（KeEem・2026-09-20 のプレビュー確認）。
 *    2列の格子に1枚だけ置くと右半分が空いたままになるためです。⚠️ 2件目を足した日は、
 *    `PROMO_APPS` の長さが変わるだけで**自動的に2列に戻ります**（下の `single`）。
 *    ⭐ カードの中の組み方も同じ判定で変わります＝1件のときは読む列と画面の列を横に分け、
 *       2件以上のときは（カードが狭いので）画面を文章の下に積みます。
 *
 * ⛔ 文言をここに書かないこと＝正は app/lib/app-promo-copy.ts。
 * ⛔ どの画面を並べるかもここで決めないこと＝正は app/lib/app-promo.ts の `shots`。
 * ⛔ 出すか出さないかをここで決めないこと＝旗の正は app/lib/app-promo.ts。
 * ⚠️⚠️ **既定では節ごと出ません**（App Store の審査待ち・KeEem「審査が終わってから出す」）。
 *    ⭐ 出ていない間、トップの題も説明文も `/llms.txt` もサイトマップも変わりません
 *       ＝この節は本文の中にしか居ないためです。
 *
 * ⛔ 左端の縦の色帯を足さないこと＝gunjo.jp の UI 共通の禁止事項（CLAUDE.md）。
 */
export function HomeAppsSection() {
    const { locale } = useLocale();
    const copy = appPromoCopyFor(locale);

    if (!isAppPromoPublic()) return null;
    if (!copy) return null;

    const single = PROMO_APPS.length === 1;

    return (
        <section id="apps" className="border-t border-border/40 bg-background py-24">
            <div className="container">
                <div className="mb-10 max-w-2xl space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight">{copy.homeHeading}</h2>
                    <p className="text-lg text-muted-foreground">{copy.homeDescription}</p>
                </div>

                <ul className={single ? "grid gap-6" : "grid gap-6 sm:grid-cols-2"}>
                    {PROMO_APPS.map((app) => (
                        <li key={app.id}>
                            <AppCard app={app} copy={copy} single={single} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function AppCard({ app, copy, single }: { app: PromoApp; copy: AppPromoStrings; single: boolean }) {
    return (
        <Card className="h-full">
            <CardContent className="p-6">
                <div className={single ? "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12" : "flex flex-col gap-6"}>
                    <div className={single ? "flex min-w-0 flex-col gap-4 lg:flex-1" : "flex flex-col gap-4"}>
                        <div className="flex items-center gap-4">
                            {/* ⛔ ここに小見出し（copy.eyebrow）と説明文（copy.bannerLead）を足さないこと。
                                すぐ上の見出しと、同じ面の下に出る帯が、同じことを言い直すだけになります
                                （文脈ゼロの検品で指摘・2026-09-20。app/lib/app-promo-copy.ts に経緯）。 */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={app.icon.src}
                                alt=""
                                width={app.icon.width}
                                height={app.icon.height}
                                loading="lazy"
                                decoding="async"
                                className="h-16 w-16 shrink-0 rounded-2xl border border-border"
                            />
                            <p className="min-w-0 text-xl font-semibold tracking-tight">{copy.name}</p>
                        </div>

                        <p className="text-sm font-medium leading-relaxed">{copy.tagline}</p>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                            <AppStoreLink app={app} copy={copy} placement={APP_PROMO_PLACEMENT_HOME} />
                            <Link
                                href={app.docsHref}
                                className="inline-flex items-center gap-1 rounded-md text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {copy.docsLabel}
                                <Icon icon={IconArrowUpRight} size="sm" className="shrink-0" />
                            </Link>
                            <a
                                href={app.siteHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {copy.siteLabel}
                                <Icon icon={IconExternalLink} size="sm" className="shrink-0 opacity-70" />
                                <span className="sr-only">{copy.newTabNotice}</span>
                            </a>
                        </div>
                    </div>

                    {/* アプリの画面。
                        ⭐ 縦長の画面を横に並べます＝読む前に「電話のアプリ」だと分かります。
                        ⭐ 狭い画面では2×2、広い画面では横1列。⛔ 1列に詰め込まないこと＝375px で
                           4枚を横に並べると1枚 49px になり、何の画面か分からなくなります。
                        ⭐ 1枚の上限は 165px＝元が 330px 幅なので、ちょうど2倍で止まります
                           （狭い画面では格子が縮むぶんだけ倍率が上がります）。
                        ⛔ 代替テキストを空にしないこと＝これは飾りではなく、
                           「どんなアプリか」を伝えている本体の絵です（アイコンとは扱いが違います）。 */}
                    <ul
                        aria-label={copy.shotsLabel}
                        className={
                            single
                                ? "grid shrink-0 grid-cols-2 gap-3 lg:w-[696px] lg:grid-cols-4"
                                : "grid grid-cols-2 gap-3"
                        }
                    >
                        {app.shots.map((shot) => (
                            <li key={shot.key}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={shot.src}
                                    alt={copy.shotAlts[shot.key] ?? ""}
                                    width={shot.width}
                                    height={shot.height}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-auto w-full max-w-[165px] rounded-xl border border-border"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
