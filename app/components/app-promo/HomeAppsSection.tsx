"use client";

import Link from "next/link";
import { IconArrowUpRight, IconExternalLink } from "@tabler/icons-react";
import { Card, CardContent, Icon } from "@gunjo/ui";
import { APP_PROMO_PLACEMENT_HOME, isAppPromoPublic, PROMO_APPS } from "@/lib/app-promo";
import { appPromoCopyFor } from "@/lib/app-promo-copy";
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
 *    ⚠️ 2026-09-20 時点では1件です（格子の残りは空きます＝それが正しい見え方です）。
 *
 * ⛔ 文言をここに書かないこと＝正は app/lib/app-promo-copy.ts。
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

    return (
        <section id="apps" className="border-t border-border/40 bg-background py-24">
            <div className="container">
                <div className="mb-10 max-w-2xl space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight">{copy.homeHeading}</h2>
                    <p className="text-lg text-muted-foreground">{copy.homeDescription}</p>
                </div>

                <ul className="grid gap-6 sm:grid-cols-2">
                    {PROMO_APPS.map((app) => (
                        <li key={app.id}>
                            <Card className="h-full">
                                <CardContent className="flex h-full flex-col gap-4 p-6">
                                    <div className="flex items-center gap-4">
                                        {/* すぐ横に同じ文字（アプリの名前）が出るので、アイコンは飾りの扱い。
                                            枠線は暗い側で地に溶けないため（AppPromoBanner.tsx に理由）。 */}
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
                                        {/* ⛔ ここに小見出し（copy.eyebrow）と説明文（copy.bannerLead）を足さないこと。
                                            すぐ上の見出しと、同じ面の下に出る帯が、同じことを言い直すだけになります
                                            （文脈ゼロの検品で指摘・2026-09-20。app/lib/app-promo-copy.ts に経緯）。 */}
                                        <p className="min-w-0 text-xl font-semibold tracking-tight">{copy.name}</p>
                                    </div>

                                    <p className="text-sm font-medium leading-relaxed">{copy.tagline}</p>

                                    <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
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
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
