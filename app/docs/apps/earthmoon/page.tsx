"use client";

import Link from "next/link";
import { IconArrowUpRight, IconExternalLink } from "@tabler/icons-react";
import { Button, Card, CardContent, Icon } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

// App Examples: screens from an app built with GUNJO, kept in that app's own
// context (ISS, weather). Screen types every app has stay in /patterns
// (KeEem, 2026-09-20). Add the next app as a sibling of /docs/apps/earthmoon.

type Locale = "ja" | "en";

const APP_URL = "https://earthmoon.4px.jp/app/";

const COPY = {
    ja: {
        eyebrow: "アプリの実例",
        heading: "地球と月",
        lead: "GUNJO で作ったアプリ「地球と月」の実例です。いま地球で起きていることを、実際の時刻のまま映す地球儀のアプリです。雲・雨雲・昼と夜の境目・ISS（国際宇宙ステーション）の位置を見られ、ISS が次に空を通る日と、見る方角を案内します。",
        open: "地球と月を開く",
        about: "ログインやダッシュボードのように、どのアプリにも出てくる画面の型は、パターン（Patterns）にあります。",
        patternsHeading: "解説している画面",
        componentsHeading: "このアプリで作り、GUNJO に加えたコンポーネント",
    },
    en: {
        eyebrow: "App Examples",
        heading: "Earth and Moon",
        lead: "An app built with GUNJO. Earth and Moon is a globe that shows what is happening on Earth right now: clouds, rain, the line between day and night, and where the ISS (International Space Station) is. It also tells you the next time the ISS crosses your sky and where to look.",
        open: "Open Earth and Moon",
        about: "Screen types that every app has, such as sign-in or a dashboard, are in Patterns.",
        patternsHeading: "Screens explained",
        componentsHeading: "Components built for this app and added to GUNJO",
    },
} as const;

const PAGES: { href: string; title: Record<Locale, string>; body: Record<Locale, string> }[] = [
    {
        href: "/docs/apps/earthmoon/direction-finder",
        title: { ja: "方角と高さの案内", en: "Direction finder" },
        body: {
            ja: "端末を空へかざすと、ISS を見る方角と高さまであと何度かを、矢印と言葉で案内します。",
            en: "Hold the device up to the sky; arrows and words say how many degrees are left to where the ISS will be.",
        },
    },
    {
        href: "/docs/apps/earthmoon/forecast-day-grid",
        title: { ja: "日ごとの予報の格子", en: "Forecast day grid" },
        body: {
            ja: "気象庁の予報を、今日から3日ぶん、1日1列で並べます。",
            en: "Three days of the Japan Meteorological Agency forecast, one column per day.",
        },
    },
];

const COMPONENTS: { name: string; slug: string; ja: string }[] = [
    { name: "MapControlButton", slug: "map-control-button", ja: "地図の上の丸いボタン" },
    { name: "ScaleBar", slug: "scale-bar", ja: "縮尺バー" },
    { name: "LayerMenu", slug: "layer-menu", ja: "レイヤーのメニュー" },
    { name: "PlacePanel", slug: "place-panel", ja: "地点の詳細" },
    { name: "DayBand", slug: "day-band", ja: "1日の昼と夜を見せる帯" },
    { name: "LiveBadge", slug: "live-badge", ja: "LIVE の札" },
    { name: "TimeTransport", slug: "time-transport", ja: "時間を進める・戻す操作" },
    { name: "RangeBar", slug: "range-bar", ja: "最低から最高の範囲を見せる帯" },
    { name: "MapStatusCorner", slug: "map-status-corner", ja: "地図の右上の状態表示" },
    { name: "TimelineScrubber", slug: "timeline-scrubber", ja: "過去と未来をまたぐ時刻の目盛り" },
];

export default function EarthmoonAppPage() {
    const { locale } = useLocale();
    const l: Locale = locale === "ja" ? "ja" : "en";
    const c = COPY[l];

    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{c.eyebrow}</p>
                <h1 className="text-4xl font-bold tracking-tight">{c.heading}</h1>
                <p className="text-lg text-muted-foreground">{c.lead}</p>
                <p className="text-sm text-muted-foreground">{c.about}</p>
                <Button asChild>
                    <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                        {c.open}
                        <Icon icon={IconExternalLink} size="sm" />
                    </a>
                </Button>
            </header>

            <section className="space-y-4">
                <h2 id="patterns" className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.patternsHeading}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {PAGES.map((page) => (
                        <Link key={page.href} href={page.href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <Card className="h-full transition-colors group-hover:border-primary-border">
                                <CardContent className="space-y-2 p-5">
                                    <p className="flex items-center justify-between gap-2 font-semibold">
                                        {page.title[l]}
                                        <Icon icon={IconArrowUpRight} size="sm" className="text-muted-foreground" />
                                    </p>
                                    <p className="text-sm text-muted-foreground">{page.body[l]}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 id="components" className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.componentsHeading}
                </h2>
                <ul className="flex flex-wrap gap-2">
                    {COMPONENTS.map((item) => (
                        <li key={item.slug}>
                            <Link
                                href={`/docs/components/${item.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-sm transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {l === "ja" ? (
                                    <>
                                        {item.ja}
                                        <span className="text-xs text-muted-foreground">{item.name}</span>
                                    </>
                                ) : (
                                    item.name
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
