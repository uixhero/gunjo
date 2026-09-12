"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { DayBand, DocNote, Label, SegmentedControl, Switch, TimeTransport } from "@gunjo/ui";

type Locale = "ja" | "en";

/**
 * ⚠️ Every number on this page is a constant. The band holds no clock and the
 * demo does not start one either, so the server and the first client frame
 * render the same thing.
 *
 * Minutes from midnight — the default unit of the band (`min` 0, `max` 1440).
 */
const DAWN = 260; // 04:20 — twilight begins
const SUNRISE = 322; // 05:22
const SUNSET = 1076; // 17:56
const DUSK = 1138; // 18:58 — twilight ends
const DEMO_NOW = 640; // 10:40
const DEMO_VALUE = 870; // 14:30 — away from `now`, so both markers are visible

/**
 * A sky is artwork, not semantics, so the ramp is the GunjoUI brand scale
 * rather than a status tone. These three are theme-independent on purpose:
 * night stays dark in a light theme too.
 */
const SKY = {
    night: "hsl(var(--gunjo-deepest))",
    twilight: "hsl(var(--gunjo-deep))",
    day: "hsl(var(--gunjo-bright))",
};

function clock(minutes: number) {
    const m = Math.round(minutes);
    const h = Math.floor(m / 60);
    return `${String(h).padStart(2, "0")}:${String(((m % 60) + 60) % 60).padStart(2, "0")}`;
}

function skyPhases(locale: Locale) {
    const isJa = locale === "ja";
    return [
        { start: 0, end: DAWN, label: isJa ? "夜" : "Night", color: SKY.night },
        { start: DAWN, end: SUNRISE, label: isJa ? "薄明" : "Twilight", color: SKY.twilight },
        { start: SUNRISE, end: SUNSET, label: isJa ? "昼" : "Day", color: SKY.day },
        { start: SUNSET, end: DUSK, label: isJa ? "薄明" : "Twilight", color: SKY.twilight },
        { start: DUSK, end: 1440, label: isJa ? "夜" : "Night", color: SKY.night },
    ];
}

function skyMarks(locale: Locale) {
    const isJa = locale === "ja";
    return [
        { at: SUNRISE, label: isJa ? `日の出 ${clock(SUNRISE)}` : `Sunrise ${clock(SUNRISE)}`, color: "warning" as const },
        { at: SUNSET, label: isJa ? `日の入 ${clock(SUNSET)}` : `Sunset ${clock(SUNSET)}`, color: "info" as const },
    ];
}

function bandLabels(locale: Locale) {
    if (locale !== "ja") return undefined;
    return { band: "いちにちの中の時刻", now: "いま" };
}

/** The playground owns the position — the band only reports where you moved it. */
function DayBandPlayground({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [value, setValue] = React.useState(DEMO_VALUE);
    const [scrub, setScrub] = React.useState<"absolute" | "relative">("absolute");
    const [showNow, setShowNow] = React.useState(true);

    return (
        <div className="flex w-full flex-col gap-5">
            <DayBand
                value={value}
                onValueChange={setValue}
                phases={skyPhases(locale)}
                marks={skyMarks(locale)}
                now={showNow ? DEMO_NOW : undefined}
                scrub={scrub}
                labels={bandLabels(locale)}
                label={isJa ? "東京　9月12日" : "Tokyo — 12 Sep"}
                hint={clock(value)}
            />

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                    <Label htmlFor="day-band-scrub">{isJa ? "掴んで動かす作法" : "Scrub mode"}</Label>
                    <SegmentedControl
                        id="day-band-scrub"
                        aria-label={isJa ? "掴んで動かす作法" : "Scrub mode"}
                        fullWidth={false}
                        value={scrub}
                        onValueChange={(next) => setScrub(next as "absolute" | "relative")}
                        options={[
                            { value: "absolute", label: isJa ? "触った位置へ" : "Absolute" },
                            { value: "relative", label: isJa ? "掴んで流す" : "Relative" },
                        ]}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Switch id="day-band-now" checked={showNow} onCheckedChange={setShowNow} />
                    <Label htmlFor="day-band-now">{isJa ? "「いま」の印" : "Show now"}</Label>
                </div>
            </div>
        </div>
    );
}

/**
 * A demo band that owns its own position. Every band on this page is
 * controlled — the component never stores the value — so each demo needs a
 * little state of its own to be draggable rather than frozen.
 */
function StateBand({
    start = DEMO_VALUE,
    hint,
    ...props
}: { start?: number } & Omit<React.ComponentProps<typeof DayBand>, "value" | "onValueChange">) {
    const [value, setValue] = React.useState(start);
    return (
        <DayBand
            {...props}
            value={value}
            onValueChange={setValue}
            hint={hint ?? clock(value)}
        />
    );
}

/** The pairing this component was extracted for: the band as the transport's scrub surface. */
function TransportDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [value, setValue] = React.useState(DEMO_VALUE);

    return (
        <TimeTransport
            value={value}
            now={DEMO_NOW}
            onValueChange={setValue}
            // ⚠️ The unit here is MINUTES, so the default 1000 (one second of
            // epoch milliseconds) would call anything inside 16 hours "live".
            liveTolerance={1}
            jumps={[
                { offset: -60, label: isJa ? "1時間" : "1h" },
                { offset: 60, label: isJa ? "1時間" : "1h" },
            ]}
            formatValue={(v) => clock(v)}
            secondary={isJa ? "2026-09-12 JST" : "12 Sep 2026, JST"}
            labels={
                isJa
                    ? {
                          group: "時間の操作",
                          returnToNow: "いまへ戻る",
                          live: "実時間",
                          detached: "いまではない",
                          jumpBack: (label: string) => `${label}戻す`,
                          jumpForward: (label: string) => `${label}進める`,
                      }
                    : undefined
            }
            scrubber={
                <DayBand
                    value={value}
                    onValueChange={setValue}
                    phases={skyPhases(locale)}
                    marks={skyMarks(locale)}
                    now={DEMO_NOW}
                    labels={bandLabels(locale)}
                />
            }
        />
    );
}

export default function DayBandDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/day-band", locale);
    const metadata = inputsMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.dayBand.title ?? "DayBand";
    const description = content?.description ?? metadata.dayBand.description ?? "";

    const usageCode = isJa
        ? `import { DayBand } from "@gunjo/ui";

// 既定の単位は「午前0時からの分」（min 0 / max 1440）。
// 実日付で使うなら min にその日の0時のエポックミリ秒、max に +86400000 を渡します。
export function SunBand() {
  const [value, setValue] = React.useState(640);

  return (
    <DayBand
      value={value}
      onValueChange={setValue}
      // ⚠️ 日の出・日の入は呼び出し側が渡します。部品は天文計算を持ちません。
      phases={[
        { start: 0, end: 260, label: "夜", color: "hsl(var(--gunjo-deepest))" },
        { start: 260, end: 322, label: "薄明", color: "hsl(var(--gunjo-deep))" },
        { start: 322, end: 1076, label: "昼", color: "hsl(var(--gunjo-bright))" },
        { start: 1076, end: 1138, label: "薄明", color: "hsl(var(--gunjo-deep))" },
        { start: 1138, end: 1440, label: "夜", color: "hsl(var(--gunjo-deepest))" },
      ]}
      marks={[
        { at: 322, label: "日の出 05:22", color: "warning" },
        { at: 1076, label: "日の入 17:56", color: "info" },
      ]}
      // ⚠️ いまの時刻は描画中ではなく effect の中で読んでください。
      now={nowMinutes}
      label="東京　9月12日"
      hint={formatClock(value)}
      labels={{ band: "いちにちの中の時刻", now: "いま" }}
    />
  );
}

// TimeTransport の掴んで動かす面として差し込む場合
<TimeTransport value={value} now={now} onValueChange={setValue}
  scrubber={<DayBand value={value} now={now} onValueChange={setValue} phases={PHASES} />} />`
        : `import { DayBand } from "@gunjo/ui";

// The default unit is minutes from midnight (min 0 / max 1440).
// For a real date, pass epoch milliseconds of that day's midnight as min
// and min + 86400000 as max.
export function SunBand() {
  const [value, setValue] = React.useState(640);

  return (
    <DayBand
      value={value}
      onValueChange={setValue}
      // ⚠️ Sunrise and sunset are times YOU pass in. The band does no astronomy.
      phases={[
        { start: 0, end: 260, label: "Night", color: "hsl(var(--gunjo-deepest))" },
        { start: 260, end: 322, label: "Twilight", color: "hsl(var(--gunjo-deep))" },
        { start: 322, end: 1076, label: "Day", color: "hsl(var(--gunjo-bright))" },
        { start: 1076, end: 1138, label: "Twilight", color: "hsl(var(--gunjo-deep))" },
        { start: 1138, end: 1440, label: "Night", color: "hsl(var(--gunjo-deepest))" },
      ]}
      marks={[
        { at: 322, label: "Sunrise 05:22", color: "warning" },
        { at: 1076, label: "Sunset 17:56", color: "info" },
      ]}
      // ⚠️ Read your clock in an effect, not during render.
      now={nowMinutes}
      label="Tokyo — 12 Sep"
      hint={formatClock(value)}
    />
  );
}

// As the scrub surface of a TimeTransport
<TimeTransport value={value} now={now} onValueChange={setValue}
  scrubber={<DayBand value={value} now={now} onValueChange={setValue} phases={PHASES} />} />`;

    const propsData = [
        {
            name: "min / max",
            type: "number / number",
            defaultValue: "0 / 1440",
            description: isJa
                ? "1日の始まりと終わり。単位は呼び出し側のもので、既定は午前0時からの分です。実日付ならその日の0時のエポックミリ秒と +86400000 を渡します。phases・marks・value・now はすべてこの単位です。"
                : "The start and the end of the day, in the caller's own unit — minutes from midnight by default, or epoch milliseconds of local midnight and +86400000. phases, marks, value and now all speak this unit.",
        },
        {
            name: "value",
            type: "number",
            description: isJa
                ? "つまみが指す位置。渡さなければつまみは出ません（見せるだけの帯になります）。"
                : "The position the thumb marks. Omit it for a band that only displays.",
        },
        {
            name: "onValueChange",
            type: "(next: number) => void",
            description: isJa
                ? "掴んで動かしたときの次の位置。渡さなければ帯は操作を受け取らず、スライダーの役割も焦点も持ちません。"
                : "Fires with the next position while the band is scrubbed. Omit it and the band takes no input — no slider role, no focus.",
        },
        {
            name: "phases",
            type: "DayBandPhase[]",
            description: isJa
                ? "1日の中の時間帯。{ start, end, label?, color? } で、面として敷かれます。color はトーン名（success など）か任意の CSS 色。トーンは面のトークン（--*-subtle）へ解決します。⚠️ 0時をまたぐ時間帯は2つに分けてください（22:00–24:00 と 00:00–06:00）。"
                : "The stretches of the day, drawn as surfaces: { start, end, label?, color? }. color is a tone name (resolved to the subtle SURFACE token) or any CSS colour. ⚠️ A stretch crossing midnight is two phases, not one.",
        },
        {
            name: "marks",
            type: "DayBandMark[]",
            description: isJa
                ? "節目の印。{ at, label?, color? }。ラベルは帯の上の行に出ます（下の行は時刻の数字なので、ぶつかりません）。色がつくのは線だけで、文字は着色しません。"
                : "Named moments: { at, label?, color? }. Labels sit in the row above the band (hour numbers sit below, so the two never collide). Only the line takes the colour — the label is never recoloured.",
        },
        {
            name: "now",
            type: "number",
            description: isJa
                ? "「いま」の位置。印として描かれるので、動かしたあとも戻り先が見えます。⚠️ 時刻は effect の中で読んでください（部品は時計を持ちません）。"
                : "The live edge, drawn as its own marker so the position you scrubbed away from stays findable. ⚠️ Read your clock in an effect — the band holds none.",
        },
        {
            name: "scrub",
            type: '"absolute" | "relative"',
            defaultValue: '"absolute"',
            description: isJa
                ? "absolute は触った位置がそのまま時刻（ひと触りでどの時刻へも行けます）。relative は掴んだ距離ぶんだけ動く（指が現在位置を隠さず、触っただけでは動きません）。relative は0時をまたいで帯の外の値も返すので、呼び出し側が日を入れ替えます。"
                : "absolute — the position you press is the position you get. relative — the value moves by how far you dragged, so your finger never covers what you are reading and a stray tap changes nothing; it also emits values outside min…max when it rolls past midnight, and expects the caller to re-base the day.",
        },
        {
            name: "step / coarseStep",
            type: "number / number",
            defaultValue: isJa ? "1日の1/96・1/24" : "1/96 · 1/24 of the day",
            description: isJa
                ? "矢印キーの刻みと、Shift＋矢印・PageUp / PageDown の刻み。既定は15分と1時間ぶんです。Home / End は帯の両端へ飛びます。"
                : "The arrow-key step and the shift-arrow / Page step — 15 minutes and 1 hour by default. Home and End jump to the ends of the day.",
        },
        {
            name: "tickEvery",
            type: "number",
            defaultValue: "3",
            description: isJa
                ? "帯の中に立てる目盛りの間隔（時間）。0 で消えます。"
                : "Hours between the tick lines inside the band. 0 hides them.",
        },
        {
            name: "hourLabels / formatHour",
            type: "number[] / (hour: number) => ReactNode",
            defaultValue: "[0, 6, 12, 18, 24]",
            description: isJa
                ? "帯の下に出す時刻の数字と、その書式。既定は単位なしの数字なので、そのまま多言語に出せます。[] で行ごと消えます。"
                : "Which hours get a number under the band, and how it is written. The default is a bare number, so it travels between languages. [] hides the row.",
        },
        {
            name: "formatValue",
            type: "(value: number) => string",
            description: isJa
                ? "読み上げ（aria-valuetext）の書式。既定は1日の中の位置から出した HH:MM で、時間帯の名前が「10:40 · 昼」のように続きます。"
                : "Formats the position for aria-valuetext. The default is HH:MM derived from the position within the day, followed by the phase name — 10:40 · Day.",
        },
        {
            name: "size",
            type: '"sm" | "default"',
            defaultValue: '"default"',
            description: isJa
                ? "帯の高さ。default は触れる 44px、sm は 24px で、見せるだけの帯に使います。"
                : "Band height. default is the 44px touch size; sm (24px) is for display-only bands.",
        },
        {
            name: "label / hint",
            type: "ReactNode / ReactNode",
            description: isJa
                ? "帯の上の行。左が label（地点・日付・担当）、右が hint（いまの時刻・注記・合計）。現在時刻を出したいときは hint に渡します。"
                : "The row above the band — label on the left (a place, a date, a person), hint on the right (the current time, a note, a total).",
        },
        {
            name: "labels",
            type: "DayBandLabels",
            description: isJa
                ? "組み込みの文字列の差し替え（band＝帯の読み上げ名／now＝「いま」の印の名前）。既定は英語です。"
                : "Overrides for the built-in strings (band, now). Defaults are English.",
        },
        {
            name: "disabled",
            type: "boolean",
            defaultValue: "false",
            description: isJa ? "帯を無効にし、タブ移動からも外します。" : "Greys the band out and takes it out of the tab order.",
        },
    ];

    const roster = isJa
        ? [
              { start: 0, end: 480, label: "夜勤", color: "info" as const },
              { start: 480, end: 540, label: "引き継ぎ", color: "warning" as const },
              { start: 540, end: 1080, label: "日勤", color: "success" as const },
              { start: 1080, end: 1140, label: "引き継ぎ", color: "warning" as const },
              { start: 1140, end: 1440, label: "夜勤", color: "info" as const },
          ]
        : [
              { start: 0, end: 480, label: "Night shift", color: "info" as const },
              { start: 480, end: 540, label: "Handover", color: "warning" as const },
              { start: 540, end: 1080, label: "Day shift", color: "success" as const },
              { start: 1080, end: 1140, label: "Handover", color: "warning" as const },
              { start: 1140, end: 1440, label: "Night shift", color: "info" as const },
          ];

    const hours = isJa
        ? [
              { start: 0, end: 660, label: "閉店", color: "muted" as const },
              { start: 660, end: 1320, label: "営業中", color: "success" as const },
              { start: 1320, end: 1440, label: "閉店", color: "muted" as const },
          ]
        : [
              { start: 0, end: 660, label: "Closed", color: "muted" as const },
              { start: 660, end: 1320, label: "Open", color: "success" as const },
              { start: 1320, end: 1440, label: "Closed", color: "muted" as const },
          ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TimeTransport", href: "/docs/components/time-transport" },
                { name: "SegmentedControl", href: "/docs/components/segmented-control" },
                { name: "Switch", href: "/docs/components/switch" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "TimeTransport", href: "/docs/components/time-transport" },
                { name: "Slider", href: "/docs/components/slider" },
                { name: "SegmentTimelineCard", href: "/docs/components/segment-timeline-card" },
                { name: "WeekView", href: "/docs/components/week-view" },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <DayBandPlayground locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={
                    isJa
                        ? "1日について何も計算しません。日の出も「いま」も、渡された数です"
                        : "It computes nothing about the day — sunrise and now are numbers you pass in"
                }
            >
                {isJa
                    ? "日の出・日の入の時刻、夜と昼の境目、いまの時刻。どれも呼び出し側が渡します。部品の中に天文の計算も setInterval もありません。緯度経度から日の出を出すのは、この帯の仕事ではなく呼び出し側のデータの都合だからです（同じ形が当番表や営業時間にそのまま使えるのは、そのためです）。⚠️ now を渡すときの Date.now() は、描画中ではなく effect の中で読んでください（TimeTransport・Stringline と同じ決まり）。"
                    : "Sunrise, sunset, where night ends, and what time it is now are all numbers the caller hands over. There is no astronomy and no setInterval inside. Deriving sunrise from a latitude is the caller's data problem, not the band's — which is exactly why the same shape serves duty rosters and opening hours. ⚠️ When you pass now, read Date.now() inside an effect, not during render (the TimeTransport / Stringline rule)."}
            </DocNote>

            <DocNote variant="note" heading={isJa ? "似た部品との境界" : "Where the neighbours stop"}>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-1">
                        <li>
                            <strong>TimeTransport</strong> — 時間を<strong>動かす操作盤</strong>。この帯は、その{" "}
                            <code>scrubber</code> スロットに入る「掴んで動かす面」です。組み合わせの例は下にあります。
                        </li>
                        <li>
                            <strong>Slider・RangeSlider</strong> — 値を1つ選ぶだけ。1日という器も、時間帯の面も、節目の印も
                            ありません。
                        </li>
                        <li>
                            <strong>SegmentTimelineCard</strong> — <strong>任意の区間</strong>を段で見せるカード。こちらは
                            「ちょうど1日」が器で、時刻の数字もその前提で入ります。
                        </li>
                        <li>
                            <strong>WeekView・ScheduleGrid</strong> — 日が<strong>複数</strong>あるとき。1本の帯では足りません。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-1">
                        <li>
                            <strong>TimeTransport</strong> — the transport that <strong>moves</strong> time. This band is
                            the scrub surface that goes in its <code>scrubber</code> slot; the pairing is demonstrated
                            below.
                        </li>
                        <li>
                            <strong>Slider / RangeSlider</strong> — one value and nothing else: no day, no phases, no
                            marks.
                        </li>
                        <li>
                            <strong>SegmentTimelineCard</strong> — an <strong>arbitrary</strong> window as a card. This
                            band is exactly one day, and its hour numbers assume it.
                        </li>
                        <li>
                            <strong>WeekView / ScheduleGrid</strong> — when there is <strong>more than one</strong> day.
                        </li>
                    </ul>
                )}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "transport",
                            title: isJa ? "TimeTransport の中に入れる" : "Inside a TimeTransport",
                            description: isJa
                                ? "操作盤の scrubber スロットへ差し込んだ形。帯を掴めば時刻が動き、「いまへ戻る」で戻ります。この組み合わせのために作られた部品です。⚠️ ここでの単位は「分」なので、TimeTransport の liveTolerance も分で渡しています（既定の 1000 はエポックミリ秒の1秒ぶんです）。"
                                : "Dropped into the transport's scrubber slot. Grab the band to move time, press return-to-now to come back. This pairing is what the band was extracted for. ⚠️ The unit here is minutes, so TimeTransport's liveTolerance is given in minutes too — the default 1000 is one second of epoch milliseconds.",
                            preview: <TransportDemo locale={locale as Locale} />,
                            code: `<TimeTransport … scrubber={<DayBand value={value} onValueChange={setValue} phases={PHASES} />} />`,
                        },
                        {
                            key: "roster",
                            title: isJa ? "当番表" : "Duty roster",
                            description: isJa
                                ? "同じ形で当番表になります。時間帯にトーン名を渡すと、面のトークン（--*-subtle）へ解決します。節目の印は交代の時刻です。"
                                : "The same shape as a roster. Tone names on the phases resolve to the subtle surface tokens; the marks are the handover times.",
                            preview: (
                                <StateBand
                                    phases={roster}
                                    marks={[
                                        { at: 480, label: isJa ? "交代 08:00" : "Handover 08:00" },
                                        { at: 1080, label: isJa ? "交代 18:00" : "Handover 18:00" },
                                    ]}
                                    labels={bandLabels(locale as Locale)}
                                    label={isJa ? "3階病棟　9月12日" : "Ward 3 — 12 Sep"}
                                />
                            ),
                            code: `<DayBand phases={[{ start: 540, end: 1080, label: "日勤", color: "success" }, …]} />`,
                        },
                        {
                            key: "display",
                            title: isJa ? "見せるだけ（sm）" : "Display only (sm)",
                            description: isJa
                                ? "onValueChange を渡さなければ操作を受け取らず、焦点も持ちません。value も外せば、つまみのない営業時間の帯になります。size=\"sm\" は 24px です。"
                                : "Without onValueChange the band takes no input and holds no focus; drop value too and it is an opening-hours strip with no thumb. size=\"sm\" is 24px.",
                            preview: (
                                <DayBand
                                    size="sm"
                                    phases={hours}
                                    marks={[{ at: 1260, label: isJa ? "ラストオーダー 21:00" : "Last order 21:00" }]}
                                    hourLabels={[0, 6, 12, 18, 24]}
                                    label={isJa ? "営業時間" : "Opening hours"}
                                    hint={isJa ? "11:00 – 22:00" : "11:00 – 22:00"}
                                    labels={bandLabels(locale as Locale)}
                                />
                            ),
                            code: `<DayBand size="sm" phases={HOURS} />`,
                        },
                        {
                            key: "relative",
                            title: isJa ? "掴んで流す（relative）" : "Relative scrubbing",
                            description: isJa
                                ? "触っただけでは動かず、掴んだ距離ぶんだけ動きます。細い帯で指が現在位置を隠さず、誤って触っても時刻が飛びません。0時をまたぐと帯の外の値も返るので、呼び出し側が日を入れ替えます。"
                                : "A tap does nothing; the value moves by how far you drag. Your finger never covers what you are reading, and a stray touch cannot jump the clock. Past midnight it emits values outside the day and expects you to re-base it.",
                            preview: (
                                <StateBand
                                    scrub="relative"
                                    phases={skyPhases(locale as Locale)}
                                    marks={skyMarks(locale as Locale)}
                                    now={DEMO_NOW}
                                    labels={bandLabels(locale as Locale)}
                                />
                            ),
                            code: `<DayBand scrub="relative" value={value} onValueChange={setValue} … />`,
                        },
                        {
                            key: "bare",
                            title: isJa ? "いちばん小さい形" : "The smallest shape",
                            description: isJa
                                ? "時間帯だけ。印も時刻の数字も目盛りも外せます（marks を渡さず、hourLabels={[]}、tickEvery={0}）。表の行の中など、狭いところに置くときの形です。"
                                : "Phases and nothing else — no marks, no hour numbers (hourLabels={[]}), no ticks (tickEvery={0}). The shape for a table row or any tight space.",
                            preview: (
                                <DayBand
                                    size="sm"
                                    phases={skyPhases(locale as Locale)}
                                    hourLabels={[]}
                                    tickEvery={0}
                                    labels={bandLabels(locale as Locale)}
                                />
                            ),
                            code: `<DayBand size="sm" phases={PHASES} hourLabels={[]} tickEvery={0} />`,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "操作できない" : "Disabled",
                            description: isJa
                                ? "帯全体が無効。読み取り専用の盤や、まだ日が決まっていないときに使います。"
                                : "The whole band is off — a read-only board, or no day chosen yet.",
                            preview: (
                                <DayBand
                                    value={DEMO_VALUE}
                                    onValueChange={() => {}}
                                    disabled
                                    phases={skyPhases(locale as Locale)}
                                    marks={skyMarks(locale as Locale)}
                                    labels={bandLabels(locale as Locale)}
                                    hint={clock(DEMO_VALUE)}
                                />
                            ),
                            code: `<DayBand disabled … />`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>

            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>時間帯の色は「面のトークン」へ解決します。</strong>
                            <code>success</code> のようなトーン名は、強い色ではなく <code>--success-subtle</code> の側へ
                            落とします。時間帯は下地で、その上に印とつまみが乗るからです。空のような
                            <strong>絵としての色</strong>が要るときは、任意の CSS 色をそのまま渡せます。
                        </li>
                        <li>
                            <strong>つまみは2色で描いています。</strong>
                            下地の時間帯は明色でも暗色でもありうるので、背景色の線に前景色の縁を重ねています。
                            片方の色に賭けると、夜の帯か昼の帯のどちらかで必ず消えます。
                        </li>
                        <li>
                            <strong>印のラベルは帯の上、時刻の数字は帯の下。</strong>
                            出どころの実装は1つの行に詰めていたため、印から48px以内の時刻の数字を消して衝突を避けていました。
                            行を分ければ、消す必要がありません。
                        </li>
                        <li>
                            <strong>指で触ったときは、押した瞬間には動きません。</strong>
                            押した指がそのまま縦スクロールに変わることがあるためで、動かしたときか、指を離したとき
                            （＝はっきりした「触った」）に確定します。マウスとペンは押した瞬間です。
                            帯の上から始めた縦スクロールも止めません（<code>touch-action: pan-y</code>）。
                        </li>
                        <li>
                            <strong>色だけに意味を載せません。</strong>
                            読み上げには「10:40 · 昼」のように<strong>時間帯の名前</strong>が乗り、節目は文字のラベルを
                            持ち、時間帯にはポインタで読める名前がつきます。矢印・Shift＋矢印・PageUp / PageDown・
                            Home / End で、触らずに1日を歩けます。
                        </li>
                        <li>
                            <strong>0時をまたぐ時間帯は2つに分けます。</strong>
                            1本の帯は1日です。<code>start</code> が <code>end</code> 以上の時間帯は描かず、開発時に
                            警告を出します（黙って反対側を塗るより、言うほうが正しいためです）。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Phase tones resolve to surface tokens.</strong> A tone name like{" "}
                            <code>success</code> lands on <code>--success-subtle</code>, not the strong tone: a phase is
                            the ground that marks and the thumb are drawn on. When the ramp is genuinely{" "}
                            <strong>artwork</strong> — a sky — pass any CSS colour instead.
                        </li>
                        <li>
                            <strong>The thumb is drawn in two tones.</strong> The phase underneath can be light or dark,
                            so the thumb is a background-coloured bar ringed in foreground. Betting on one colour makes
                            it vanish over either night or day.
                        </li>
                        <li>
                            <strong>Mark labels above, hour numbers below.</strong> The implementation this came from
                            packed both into one row and had to delete any hour number within 48px of a mark. Two rows
                            need no deletions.
                        </li>
                        <li>
                            <strong>A touch does not seek on press.</strong> A finger that lands on the band may still be
                            starting a page scroll, so touch commits on the first move or on release (a deliberate tap).
                            Mouse and pen commit on press. A vertical swipe that starts on the band still scrolls the
                            page (<code>touch-action: pan-y</code>).
                        </li>
                        <li>
                            <strong>No meaning rides on colour alone.</strong> The screen reader hears the{" "}
                            <strong>phase name</strong> — 10:40 · Day — marks carry text labels, phases carry a pointer
                            name, and arrows, shift-arrows, Page keys and Home / End walk the whole day without a
                            pointer.
                        </li>
                        <li>
                            <strong>A stretch crossing midnight is two phases.</strong> One band is one day. A phase
                            whose <code>start</code> is not below its <code>end</code> is skipped with a development
                            warning, rather than silently painting the complement.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
