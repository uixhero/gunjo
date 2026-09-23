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
        shotsLabel: "アプリの画面",
    },
    en: {
        eyebrow: "App Examples",
        heading: "Earth and Moon",
        lead: "An app built with GUNJO. Earth and Moon is a globe that shows what is happening on Earth right now: clouds, rain, the line between day and night, and where the ISS (International Space Station) is. It also tells you the next time the ISS crosses your sky and where to look.",
        open: "Open Earth and Moon",
        about: "Screen types that every app has, such as sign-in or a dashboard, are in Patterns.",
        patternsHeading: "Screens explained",
        componentsHeading: "Components built for this app and added to GUNJO",
        shotsLabel: "App screens",
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

/* Screenshots from the published app (earthmoon.4px.jp/shots), resized to
   330px wide WebP: shown at ~165px in the grid, so 2x for sharp screens.
   The phone aspect (440×956) is kept by width/height, never cropped. */
const SHOTS: { src: string; caption: Record<Locale, string>; alt: Record<Locale, string> }[] = [
    {
        src: "/apps/earthmoon/shot-01.webp",
        caption: { ja: "地球（夜の日本と ISS）", en: "Earth (Japan at night, the ISS)" },
        alt: {
            ja: "夜の日本を見下ろした地球儀に、街の灯り、現在地、ISS の位置と通り道の線が重なっている。",
            en: "A globe looking down on Japan at night, with city lights, your location, and the ISS with the line of its path.",
        },
    },
    {
        src: "/apps/earthmoon/shot-03.webp",
        caption: { ja: "雨雲", en: "Rain radar" },
        alt: {
            ja: "関東の地図に気象庁の雨雲レーダーを重ねている。下の目盛りで時刻を選べ、現在地には「いま雨。11:50ごろ やみそう」と出ている。",
            en: "JMA rain radar over a map of the Kanto area. A scale at the bottom picks the time; at your location it says it is raining now and should stop around 11:50.",
        },
    },
    {
        src: "/apps/earthmoon/shot-05.webp",
        caption: { ja: "予報（日ごとの予報の格子）", en: "Forecast (the forecast day grid)" },
        alt: {
            ja: "上に雨雲を重ねた地図、その下にいまの気温、今日・あす・日曜の予報の格子、週間予報が並ぶ。",
            en: "A map with rain on top, then the current temperature, a grid for today, tomorrow and Sunday, and the week ahead.",
        },
    },
    {
        src: "/apps/earthmoon/shot-06.webp",
        caption: { ja: "時間の操作（一日の帯）", en: "Time controls (the day band)" },
        alt: {
            ja: "地球の画面で、下から時間の操作を引き出したところ。雲のかかった昼の日本の下に、再生の操作と、日の出から日の入までを色で示した一日の帯が出ている。",
            en: "The Earth screen with the time controls pulled up from the bottom. Under a cloudy Japan in daylight are playback controls and a band colouring the day from sunrise to sunset.",
        },
    },
    {
        src: "/apps/earthmoon/shot-07.webp",
        caption: { ja: "軌道（月と ISS）", en: "Orbits (the Moon and the ISS)" },
        alt: {
            ja: "太陽・地球・月の位置を北から見た図の下に、月の満ち欠けと、ISS の高度・速度、現在地から ISS が見える日時の一覧が並ぶ。",
            en: "The Sun, Earth and Moon seen from the north, then the Moon's phase, the ISS's height and speed, and when the ISS is visible from your location.",
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
                <div className="flex items-center gap-3">
                    {/* The name sits right beside it, so the icon is decorative. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/apps/earthmoon/icon-128.webp" alt="" width={56} height={56} className="h-14 w-14 rounded-2xl" />
                    <h1 className="text-4xl font-bold tracking-tight">{c.heading}</h1>
                </div>
                <p className="text-lg text-muted-foreground">{c.lead}</p>
                <p className="text-sm text-muted-foreground">{c.about}</p>
                <Button asChild>
                    <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                        {c.open}
                        <Icon icon={IconExternalLink} size="sm" />
                    </a>
                </Button>
            </header>

            <ul aria-label={c.shotsLabel} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {SHOTS.map((shot) => (
                    <li key={shot.src}>
                        <figure className="space-y-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={shot.src}
                                alt={shot.alt[l]}
                                width={330}
                                height={717}
                                loading="lazy"
                                className="h-auto w-full rounded-xl border border-border"
                            />
                            <figcaption className="break-keep text-xs text-muted-foreground">{shot.caption[l]}</figcaption>
                        </figure>
                    </li>
                ))}
            </ul>

            <section className="space-y-4">
                <h2 id="patterns" className="pb-2 text-2xl font-semibold tracking-tight">
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
                <h2 id="components" className="pb-2 text-2xl font-semibold tracking-tight">
                    {c.componentsHeading}
                </h2>
                <ul className="flex flex-wrap gap-2">
                    {COMPONENTS.map((item) => (
                        <li key={item.slug}>
                            <Link
                                href={`/docs/components/${item.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-md border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-card px-2.5 py-1 text-sm transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
