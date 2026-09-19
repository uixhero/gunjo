"use client";

import * as React from "react";
import { IconCloud, IconCloudRain, IconCloudStorm, IconSun } from "@tabler/icons-react";
import { Card, Grid, Icon, SegmentedControl, cn, type IconGlyph } from "@gunjo/ui";

/**
 * Pattern demo: forecast day grid (docs/apps/earthmoon/forecast-day-grid).
 *
 * One column per day, the rows shared across columns through CSS subgrid so the
 * temperature and rain rows line up even when one day's forecast text runs long.
 * Built from Grid + Card; nothing here is registered in @gunjo/ui because the
 * rows (6-hour rain chance, forecast text) are specific to weather.
 */

type Locale = "ja" | "en";
export type ForecastClock = "morning" | "afternoon" | "after-midnight";
export type WeatherKind = "sun" | "cloud" | "rain" | "storm";

export interface ForecastDay {
    /** YYYY-MM-DD */
    date: string;
    kind: WeatherKind;
    text: Record<Locale, string>;
    min: number | null;
    max: number | null;
    /** 6-hour chance of rain, keyed by the start hour (0, 6, 12, 18). Empty when not issued. */
    pops: { from: number; value: number }[];
}

const ICONS: Record<WeatherKind, IconGlyph> = {
    sun: IconSun,
    cloud: IconCloud,
    rain: IconCloudRain,
    storm: IconCloudStorm,
};

const WEEKDAYS: Record<Locale, string[]> = {
    ja: ["日", "月", "火", "水", "木", "金", "土"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

function addDays(date: string, n: number) {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
}

function weekday(date: string) {
    return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Three days of a forecast issued on the morning of `start`. Rain chance covers today and tomorrow only. */
export function sampleForecast(start: string): ForecastDay[] {
    return [
        {
            date: start,
            kind: "cloud",
            text: { ja: "くもり 時々 雨", en: "Cloudy, rain at times" },
            min: 21,
            max: 26,
            pops: [
                { from: 0, value: 20 },
                { from: 6, value: 30 },
                { from: 12, value: 50 },
                { from: 18, value: 50 },
            ],
        },
        {
            date: addDays(start, 1),
            kind: "storm",
            text: {
                ja: "雨 所により 朝から 雷を伴い 激しく降る",
                en: "Rain, heavy with thunder in places from the morning",
            },
            min: 21,
            max: 24,
            pops: [
                { from: 0, value: 80 },
                { from: 6, value: 80 },
                { from: 12, value: 80 },
                { from: 18, value: 80 },
            ],
        },
        {
            date: addDays(start, 2),
            kind: "rain",
            text: { ja: "雨", en: "Rain" },
            min: 20,
            max: 28,
            pops: [],
        },
    ];
}

/**
 * What the grid shows at a given moment.
 * - afternoon: today's past 6-hour slots are dropped.
 * - after-midnight: yesterday's forecast is still the latest, so its first day is dropped.
 */
export function visibleDays(days: ForecastDay[], clock: ForecastClock) {
    if (clock === "after-midnight") return { today: days[1].date, days: days.slice(1) };
    const hour = clock === "afternoon" ? 13 : 5.5;
    return {
        today: days[0].date,
        days: days.map((d, i) => (i === 0 ? { ...d, pops: d.pops.filter((p) => p.from + 6 > hour) } : d)),
    };
}

function dayName(date: string, today: string, locale: Locale) {
    if (date === today) return locale === "ja" ? "今日" : "Today";
    if (date === addDays(today, 1)) return locale === "ja" ? "あす" : "Tomorrow";
    const w = WEEKDAYS[locale][weekday(date)];
    return locale === "ja" ? `${w}曜` : w;
}

function dateLine(date: string, locale: Locale) {
    const m = Number(date.slice(5, 7));
    const d = Number(date.slice(8, 10));
    const w = WEEKDAYS[locale][weekday(date)];
    return locale === "ja" ? `${m}/${d}（${w}）` : `${w} ${m}/${d}`;
}

/** Saturday blue, Sunday red: the same tokens as Calendar. */
function weekendClass(date: string) {
    const w = weekday(date);
    return w === 6 ? "text-info" : w === 0 ? "text-destructive" : undefined;
}

export function ForecastDayGrid({
    days,
    today,
    locale,
    source,
}: {
    days: ForecastDay[];
    today: string;
    locale: Locale;
    source: string;
}) {
    const ja = locale === "ja";
    return (
        <section className="w-full space-y-2" aria-label={ja ? "日ごとの予報" : "Daily forecast"}>
            <p className="text-xs text-muted-foreground">
                {ja ? "日ごとの予報" : "Daily forecast"}　{source}
            </p>
            <Card className="overflow-hidden">
                <Grid
                    cols={days.length === 2 ? 2 : 3}
                    gap={0}
                    className="grid-rows-[auto_auto_auto_auto_auto] divide-x divide-border"
                >
                    {days.map((d) => (
                        <div key={d.date} className="row-span-5 grid grid-rows-subgrid gap-0 px-2 py-3 text-center">
                            <div className={weekendClass(d.date)}>
                                <p className="text-sm font-semibold">{dayName(d.date, today, locale)}</p>
                                <p className="text-xs tabular-nums opacity-80">{dateLine(d.date, locale)}</p>
                            </div>
                            <div className="flex justify-center py-2 text-muted-foreground">
                                <Icon icon={ICONS[d.kind]} size="xl" strokeWidth={1.5} />
                            </div>
                            <p className="text-xs leading-relaxed">{d.text[locale]}</p>
                            <p className="mt-2 flex justify-center gap-2 text-sm tabular-nums">
                                <span>
                                    <span className="text-xs text-muted-foreground">{ja ? "最低" : "Low"} </span>
                                    {d.min != null ? `${d.min}°` : "—"}
                                </span>
                                <span>
                                    <span className="text-xs text-muted-foreground">{ja ? "最高" : "High"} </span>
                                    {d.max != null ? `${d.max}°` : "—"}
                                </span>
                            </p>
                            <div className="mt-2 border-t border-border pt-2">
                                {d.pops.length ? (
                                    <dl className="mx-auto grid w-fit grid-cols-2 gap-x-3 gap-y-1">
                                        {d.pops.map((p) => (
                                            <div key={p.from} className="flex flex-col items-center">
                                                <dt className="text-[11px] tabular-nums text-muted-foreground">
                                                    {p.from}-{p.from + 6}
                                                    {ja ? "時" : "h"}
                                                </dt>
                                                <dd className="text-xs font-medium tabular-nums">{p.value}%</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <p className="py-1 text-xs text-muted-foreground">
                                        <span aria-hidden="true">—</span>
                                        <span className="sr-only">{ja ? "降水確率は未発表" : "Chance of rain not issued"}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </Grid>
            </Card>
        </section>
    );
}

const STARTS = { thu: "2026-09-17", fri: "2026-09-18", sat: "2026-09-19" } as const;

export function ForecastDayGridDemo({
    locale,
    controls = true,
    clock: initialClock = "morning",
    start: initialStart = "sat",
}: {
    locale: Locale;
    controls?: boolean;
    clock?: ForecastClock;
    start?: keyof typeof STARTS;
}) {
    const ja = locale === "ja";
    const [clock, setClock] = React.useState<ForecastClock>(initialClock);
    const [start, setStart] = React.useState<keyof typeof STARTS>(initialStart);
    const view = visibleDays(sampleForecast(STARTS[start]), clock);

    return (
        <div className={cn("flex w-full flex-col gap-4", controls && "max-w-[480px]")}>
            {controls ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium">{ja ? "開いた時刻" : "Opened at"}</p>
                        <SegmentedControl
                            aria-label={ja ? "開いた時刻" : "Opened at"}
                            size="sm"
                            value={clock}
                            onValueChange={(v) => setClock(v as ForecastClock)}
                            options={[
                                { value: "morning", label: ja ? "5時半" : "5:30" },
                                { value: "afternoon", label: ja ? "13時" : "13:00" },
                                { value: "after-midnight", label: ja ? "0時半" : "0:30" },
                            ]}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium">{ja ? "予報の1日目" : "First forecast day"}</p>
                        <SegmentedControl
                            aria-label={ja ? "予報の1日目" : "First forecast day"}
                            size="sm"
                            value={start}
                            onValueChange={(v) => setStart(v as keyof typeof STARTS)}
                            options={[
                                { value: "thu", label: ja ? "木曜" : "Thu" },
                                { value: "fri", label: ja ? "金曜" : "Fri" },
                                { value: "sat", label: ja ? "土曜" : "Sat" },
                            ]}
                        />
                    </div>
                </div>
            ) : null}
            <ForecastDayGrid days={view.days} today={view.today} locale={locale} source={ja ? "気象庁" : "JMA"} />
        </div>
    );
}
