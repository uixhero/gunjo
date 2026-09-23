"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { MidnightColumnsFigure } from "@/components/doc/PatternFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { ForecastDayGridDemo } from "@/components/demos/ForecastDayGridPatternDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocNote } from "@gunjo/ui";

type Locale = "ja" | "en";

/* Pattern page, not a component page: the grid is Grid + Card, and the
   weather-specific rows stay out of @gunjo/ui (KeEem, 2026-09-19). */

const USAGE_JA = `"use client";

import { IconCloud, IconCloudRain } from "@tabler/icons-react";
import { Card, Grid, Icon } from "@gunjo/ui";

const DAYS = [
  { name: "今日", date: "9/19（土）", weekday: 6, icon: IconCloud,
    text: "くもり 時々 雨", min: 21, max: 26,
    pops: [["12-18", 50], ["18-24", 50]] },
  { name: "あす", date: "9/20（日）", weekday: 0, icon: IconCloudRain,
    text: "雨 所により 朝から 雷を伴い 激しく降る", min: 21, max: 24,
    pops: [["0-6", 80], ["6-12", 80], ["12-18", 80], ["18-24", 80]] },
  { name: "月曜", date: "9/21（月）", weekday: 1, icon: IconCloudRain,
    text: "雨", min: 20, max: 28, pops: [] },
] as const;

// 土曜は青、日曜は赤（Calendar と同じトークン）
const tone = (w: number) => (w === 6 ? "text-info" : w === 0 ? "text-destructive" : undefined);

export function ForecastDays() {
  return (
    <Card className="overflow-hidden">
      {/* subgrid で行を3列で共有する＝長い文の列があっても気温の段がそろう */}
      <Grid cols={3} gap={0} className="grid-rows-[auto_auto_auto_auto_auto] divide-x divide-border">
        {DAYS.map((d) => (
          <div key={d.date} className="row-span-5 grid grid-rows-subgrid px-2 py-3 text-center">
            <div className={tone(d.weekday)}>
              <p className="text-sm font-semibold">{d.name}</p>
              <p className="text-xs">{d.date}</p>
            </div>
            <div className="flex justify-center py-2"><Icon icon={d.icon} size="xl" /></div>
            <p className="text-xs">{d.text}</p>
            <p className="mt-2 text-sm tabular-nums">最低 {d.min}° 最高 {d.max}°</p>
            <div className="mt-2 border-t pt-2 text-xs tabular-nums">
              {d.pops.length
                ? d.pops.map(([h, v]) => <span key={h} className="mx-1 inline-block">{h}時 {v}%</span>)
                : "—"}
            </div>
          </div>
        ))}
      </Grid>
    </Card>
  );
}`;

const USAGE_EN = `"use client";

import { IconCloud, IconCloudRain } from "@tabler/icons-react";
import { Card, Grid, Icon } from "@gunjo/ui";

const DAYS = [
  { name: "Today", date: "Sat 9/19", weekday: 6, icon: IconCloud,
    text: "Cloudy, rain at times", min: 21, max: 26,
    pops: [["12-18", 50], ["18-24", 50]] },
  { name: "Tomorrow", date: "Sun 9/20", weekday: 0, icon: IconCloudRain,
    text: "Rain, heavy with thunder in places from the morning", min: 21, max: 24,
    pops: [["0-6", 80], ["6-12", 80], ["12-18", 80], ["18-24", 80]] },
  { name: "Mon", date: "Mon 9/21", weekday: 1, icon: IconCloudRain,
    text: "Rain", min: 20, max: 28, pops: [] },
] as const;

// Saturday blue, Sunday red (the same tokens as Calendar)
const tone = (w: number) => (w === 6 ? "text-info" : w === 0 ? "text-destructive" : undefined);

export function ForecastDays() {
  return (
    <Card className="overflow-hidden">
      {/* subgrid shares the rows, so a long forecast doesn't push one column's temperatures down */}
      <Grid cols={3} gap={0} className="grid-rows-[auto_auto_auto_auto_auto] divide-x divide-border">
        {DAYS.map((d) => (
          <div key={d.date} className="row-span-5 grid grid-rows-subgrid px-2 py-3 text-center">
            <div className={tone(d.weekday)}>
              <p className="text-sm font-semibold">{d.name}</p>
              <p className="text-xs">{d.date}</p>
            </div>
            <div className="flex justify-center py-2"><Icon icon={d.icon} size="xl" /></div>
            <p className="text-xs">{d.text}</p>
            <p className="mt-2 text-sm tabular-nums">Low {d.min}° High {d.max}°</p>
            <div className="mt-2 border-t pt-2 text-xs tabular-nums">
              {d.pops.length
                ? d.pops.map(([h, v]) => <span key={h} className="mx-1 inline-block">{h}h {v}%</span>)
                : "—"}
            </div>
          </div>
        ))}
      </Grid>
    </Card>
  );
}`;

export default function ForecastDayGridPatternPage() {
    const { locale, sectionLabels } = useLocale();
    const ja = locale === "ja";
    const l = locale as Locale;
    const usageCode = ja ? USAGE_JA : USAGE_EN;

    const title = ja ? "日ごとの予報の格子" : "Forecast day grid";
    const description = ja
        ? "今日から3日ぶんを3列に並べて、1日を1列に要約する事例です。曜日、天気、最低と最高の気温、6時間ごとの降水確率を、上から順に積みます。"
        : "A pattern that lays three days side by side and sums up each day in one column: the day, the weather, the low and high, and the chance of rain in 6-hour blocks.";

    const propsData = ja
        ? [
              { name: "date", type: "string", description: "その日の日付（YYYY-MM-DD）。呼び名と曜日の色はここから決める。" },
              { name: "kind", type: '"sun" | "cloud" | "rain" | "storm"', description: "天気の絵。" },
              { name: "text", type: "string", description: "天気の文。長さはまちまち。" },
              { name: "min / max", type: "number | null", description: "最低と最高の気温。無ければ「—」。" },
              { name: "pops", type: "{ from: number; value: number }[]", description: "6時間ごとの降水確率。今日とあすだけ。無い日は空の配列。" },
          ]
        : [
              { name: "date", type: "string", description: "The day (YYYY-MM-DD). The label and weekend colour come from it." },
              { name: "kind", type: '"sun" | "cloud" | "rain" | "storm"', description: "The weather picture." },
              { name: "text", type: "string", description: "The forecast in words. Any length." },
              { name: "min / max", type: "number | null", description: "Low and high. Missing shows “—”." },
              { name: "pops", type: "{ from: number; value: number }[]", description: "Chance of rain per 6 hours; today and tomorrow only. Empty otherwise." },
          ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            uixheroLinks={[
                {
                    label: ja ? "日ごとの予報の格子の記事（#1001）" : "Article on the forecast day grid (#1001)",
                    href: "https://github.com/uixhero/gunjo/issues/1001",
                    relation: "unwritten",
                },
            ]}
            usedComponents={[
                { name: "Grid", href: "/docs/components/grid" },
                { name: "Card", href: "/docs/components/card" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "SegmentedControl", href: "/docs/components/segmented-control" },
            ]}
            relatedComponents={[
                {
                    name: "WeekView",
                    href: "/docs/components/week-view",
                    boundary: ja ? "時刻を軸にした週の予定表。1日を1列に要約しない。" : "A week of timed events; no one-column summary per day.",
                },
                {
                    name: "ScheduleGrid",
                    href: "/docs/components/schedule-grid",
                    boundary: ja ? "時間割。行が時刻で、要約の段を持たない。" : "A timetable; rows are times, not summary rows.",
                },
                {
                    name: "Calendar",
                    href: "/docs/components/calendar",
                    boundary: ja ? "日付を選ぶ。土日の色はここと同じ。" : "Picks a date; same weekend colours as here.",
                },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                embedSrc="/embed/forecast-day-grid"
                previewBodyWidth="md"
            >
                <ForecastDayGridDemo locale={l} />
            </ComponentPreview>

            <DocNote variant="note" heading={ja ? "コンポーネントにしない理由" : "Why this is not a component"}>
                {ja
                    ? "GUNJO で近い WeekView（週の予定表）と ScheduleGrid（時間割）は、時刻を軸にした予定表です。6時間ごとの降水確率や天気の文は天気に固有なので、汎用のコンポーネントにはせず、列を並べる Grid と枠の Card で組みます。日ごとの要約を横に並べる画面なら、同じ組み方が使えます。たとえば、配送の予定日ごとの時間帯、店の日ごとの混み具合、施設の日ごとの空きです。"
                    : "GUNJO's nearest pieces, WeekView (a week planner) and ScheduleGrid (a timetable), are laid out along the clock. A 6-hour chance of rain and a forecast sentence belong to weather, so this stays a composition of Grid for the columns and Card for the frame. The same build fits any screen that sums up days side by side: delivery slots per day, how busy a shop is per day, free rooms per day."}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {ja ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "three-days",
                            title: ja ? "3日並ぶ" : "Three days",
                            description: ja
                                ? "朝5時の発表の直後に開くと、今日の降水確率は 0〜6時・6〜12時・12〜18時・18〜24時の4つがそろいます。"
                                : "Opened just after the 5 am forecast, today has all four blocks: 0–6, 6–12, 12–18 and 18–24.",
                            preview: <ForecastDayGridDemo locale={l} controls={false} />,
                            previewHeight: "auto",
                            code: `const TODAY = [
  { from: 0, value: 20 }, { from: 6, value: 30 },
  { from: 12, value: 50 }, { from: 18, value: 50 },
];

export function MorningSlots() {
  const slots = TODAY.filter((p) => p.from + 6 > 5.5); // 5:30
  return <p>{slots.map((p) => \`\${p.from}-\${p.from + 6}${ja ? "時" : "h"} \${p.value}%\`).join("  ")}</p>;
}`,
                        },
                        {
                            key: "past-slots",
                            title: ja ? "今日の過ぎた時間帯は出さない" : "Past blocks are dropped",
                            description: ja
                                ? "13時に開いたら、今日の降水確率は 12〜18時と 18〜24時の2つだけにします。"
                                : "Opened at 13:00, today shows only 12–18 and 18–24.",
                            preview: <ForecastDayGridDemo locale={l} controls={false} clock="afternoon" />,
                            previewHeight: "auto",
                            code: `const TODAY = [
  { from: 0, value: 20 }, { from: 6, value: 30 },
  { from: 12, value: 50 }, { from: 18, value: 50 },
];

export function AfternoonSlots() {
  const hour = 13;
  const slots = TODAY.filter((p) => p.from + 6 > hour); // ${ja ? "終わった時間帯を外す" : "drop blocks that have ended"}
  return <p>{slots.map((p) => \`\${p.from}-\${p.from + 6}${ja ? "時" : "h"} \${p.value}%\`).join("  ")}</p>;
}`,
                        },
                        {
                            key: "after-midnight",
                            title: ja ? "日付が変わった直後" : "Just after midnight",
                            description: ja
                                ? "0時を過ぎても、次の発表（朝5時）までは前の日の予報を使います。その予報の「今日」の列はもう昨日なので外し、残る2日を「今日」「あす」と呼び直して2列で出します。"
                                : "After midnight, yesterday's forecast is still the latest until the 5 am one. Its first column is now yesterday, so it goes, and the other two become Today and Tomorrow in two columns.",
                            preview: <ForecastDayGridDemo locale={l} controls={false} clock="after-midnight" />,
                            previewHeight: "auto",
                            code: `const FORECAST = ["2026-09-19", "2026-09-20", "2026-09-21"]; // ${ja ? "9/19 夕方の発表" : "issued 9/19, evening"}

export function AfterMidnight() {
  const today = "2026-09-20"; // 0:30
  const days = FORECAST.filter((d) => d >= today);
  const name = (d: string, i: number) => (i === 0 ? "${ja ? "今日" : "Today"}" : i === 1 ? "${ja ? "あす" : "Tomorrow"}" : d);
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: \`repeat(\${days.length}, 1fr)\` }}>
      {days.map((d, i) => <p key={d}>{name(d, i)} {d}</p>)}
    </div>
  );
}`,
                        },
                        {
                            key: "no-pops",
                            title: ja ? "降水確率が無い日" : "No rain blocks",
                            description: ja
                                ? "6時間ごとの降水確率は、今日とあすのぶんしか発表されません。3日目の欄は「—」だけにします。"
                                : "The 6-hour chance of rain is issued for today and tomorrow only. The third column shows just “—”.",
                            preview: <ForecastDayGridDemo locale={l} controls={false} start="thu" clock="afternoon" />,
                            previewHeight: "auto",
                            code: `const THIRD_DAY_POPS: { from: number; value: number }[] = []; // ${ja ? "3日目は発表されない" : "not issued for day three"}

export function RainBlocks() {
  const pops = THIRD_DAY_POPS;
  if (!pops.length) {
    return (
      <p className="text-xs text-muted-foreground">
        <span aria-hidden="true">—</span>
        <span className="sr-only">${ja ? "降水確率は未発表" : "Chance of rain not issued"}</span>
      </p>
    );
  }
  return <p>{pops.map((p) => \`\${p.value}%\`).join(" ")}</p>;
}`,
                        },
                        {
                            key: "weekend",
                            title: ja ? "土日の色" : "Weekend colours",
                            description: ja
                                ? "土曜は青、日曜は赤で、GUNJO の Calendar（日付を選ぶカレンダー）と同じ色です。「あす」のような呼び名で出す日も、土日なら色を付けます。"
                                : "Saturday is blue and Sunday red, the same as GUNJO's Calendar (the date picker). A day shown as Tomorrow is still coloured if it falls on a weekend.",
                            preview: <ForecastDayGridDemo locale={l} controls={false} start="fri" />,
                            previewHeight: "auto",
                            code: `const DAYS = [
  { name: "${ja ? "今日" : "Today"}", date: "${ja ? "9/18（金）" : "Fri 9/18"}", weekday: 5 },
  { name: "${ja ? "あす" : "Tomorrow"}", date: "${ja ? "9/19（土）" : "Sat 9/19"}", weekday: 6 },
  { name: "${ja ? "日曜" : "Sun"}", date: "${ja ? "9/20（日）" : "Sun 9/20"}", weekday: 0 },
];

export function WeekendNames() {
  const tone = (w: number) => (w === 6 ? "text-info" : w === 0 ? "text-destructive" : undefined);
  return (
    <div className="flex gap-6">
      {DAYS.map((d) => (
        <div key={d.date} className={tone(d.weekday)}>
          <p className="font-semibold">{d.name}</p>
          <p className="text-xs">{d.date}</p>
        </div>
      ))}
    </div>
  );
}`,
                        },
                    ]}
                />
                <MidnightColumnsFigure locale={l} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {ja ? "1日ぶんのデータ" : "One day's data"}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>

            <section className="space-y-4">
                <div className="pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {ja ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                    {(ja
                        ? [
                              "各列の上に、呼び名を出します。「今日」「あす」、3列目は「あさって」ではなく「月曜」のように曜日で呼びます。呼び名の下に、日付と曜日を「9/21（月）」の形で小さく添えます。「あす」の列でも曜日が読めます。",
                              "気温には「最低」「最高」と語を添えます。",
                              "土日も気温も、色だけで区別しません。",
                              "天気の文は長さがまちまちです（「雨 所により 朝から 雷を伴い 激しく降る」のような長い文もあります）。文の欄は、3列でいちばん長い文に高さを合わせます。気温と降水確率の段が3列でそろいます。",
                              "数字は等幅の数字にして、列ごとに桁をそろえます。",
                              "格子の上の見出しに、予報の出どころ（例：気象庁）を添えます。",
                          ]
                        : [
                              "Each column is headed by a name: Today, Tomorrow, then the weekday (“Mon”) rather than “the day after”. Under it, the date and weekday in small type, so the weekday is readable even under Tomorrow.",
                              "Temperatures carry the words Low and High.",
                              "Neither weekends nor temperatures rely on colour alone.",
                              "Forecast sentences vary in length (some run to “Rain, heavy with thunder in places from the morning”). The text row takes the height of the longest one, so temperatures and rain line up across the columns.",
                              "Digits are tabular so figures line up column by column.",
                              "The heading above the grid names the source (for example, JMA).",
                          ]
                    ).map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </ComponentLayout>
    );
}
