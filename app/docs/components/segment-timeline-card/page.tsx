"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { SegmentTimelineCard } from "@gunjo/ui";
import { UIXHERO_BASE_URL, type UixheroLink } from "@/lib/uixhero-links";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof SegmentTimelineCard>["segments"][number];
const segmentsByLocale: Record<Locale, DataItem[]> = {
    en: [{ label: "Light sleep", value: 31, start: 0, end: 31, color: "info" }, { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" }, { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" }, { label: "REM", value: 29, start: 99, end: 128, color: "success" }, { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" }, { label: "Awake", value: 14, start: 159, end: 173, color: "warning" }, { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" }, { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" }, { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" }, { label: "REM", value: 29, start: 272, end: 301, color: "success" }, { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" }, { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" }, { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" }, { label: "REM", value: 28, start: 401, end: 429, color: "success" }, { label: "Awake", value: 14, start: 429, end: 443, color: "warning" }, { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" }],
    ja: [{ label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" }, { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" }, { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" }, { label: "レム", value: 29, start: 99, end: 128, color: "success" }, { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" }, { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" }, { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" }, { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" }, { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" }, { label: "レム", value: 29, start: 272, end: 301, color: "success" }, { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" }, { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" }, { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" }, { label: "レム", value: 28, start: 401, end: 429, color: "success" }, { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" }, { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" }],
};
const metricsByLocale = { en: [{ label: "Sleep quality", value: "83%", description: "Sleep quality score compared with the 76% baseline." }, { label: "Time asleep", value: "7h 26m", description: "Total sleep duration excluding awake time." }, { label: "Awake time", value: "28m", description: "Total duration classified as awake." }], ja: [{ label: "睡眠品質", value: "83%", description: "基準品質 76% と比較した睡眠品質スコアです。" }, { label: "睡眠時間", value: "7時間26分", description: "総時間から覚醒時間を除いた睡眠時間です。" }, { label: "覚醒時間", value: "28分", description: "覚醒ステージに分類された時間の合計です。" }] };

const timelineCode = {
    en: `const metrics = [
    { label: "Sleep quality", value: "83%", description: "Sleep quality score compared with the 76% baseline." },
    { label: "Time asleep", value: "7h 26m", description: "Total sleep duration excluding awake time." },
    { label: "Awake time", value: "28m", description: "Total duration classified as awake." },
];
const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => \`\${Math.floor(minutes / 60)}h \${minutes % 60}m\`;`,
    ja: `const metrics = [
    { label: "睡眠品質", value: "83%", description: "基準品質 76% と比較した睡眠品質スコアです。" },
    { label: "睡眠時間", value: "7時間26分", description: "総時間から覚醒時間を除いた睡眠時間です。" },
    { label: "覚醒時間", value: "28分", description: "覚醒ステージに分類された時間の合計です。" },
];
const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => \`\${Math.floor(minutes / 60)}時間\${minutes % 60}分\`;`,
} as const;

const code = { en: `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    {
      label: "Sleep quality",
      value: "83%",
      description: "Sleep quality score compared with the 76% baseline.",
    },
    {
      label: "Time asleep",
      value: "7h 26m",
      description: "Total sleep duration excluding awake time.",
    },
    {
      label: "Awake time",
      value: "28m",
      description: "Total duration classified as awake.",
    },
];
const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";

export function SleepStageTimeline() {
    return (
        <SegmentTimelineCard
            title="Sleep stages"
            description="Segment timeline"
            delta="+7%"
            deltaDescription="Difference from the 76% quality baseline."
            metrics={metrics}
            segments={segments}
            selectedIndex={0}
            min={0}
            max={474}
            startLabel="11:42 PM"
            endLabel="7:18 AM"
            formatValue={(value) => formatDuration(value)}
            rangeLabel="Stage duration"
            caption="Review categorical time ranges for sleep, uptime, or delivery states."
        />
    );
}`, ja: `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "睡眠品質", value: "83%", description: "基準品質 76% と比較した睡眠品質スコアです。" },
    { label: "睡眠時間", value: "7時間26分", description: "総時間から覚醒時間を除いた睡眠時間です。" },
    { label: "覚醒時間", value: "28分", description: "覚醒ステージに分類された時間の合計です。" },
];
const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "\\u6642\\u9593" + (minutes % 60) + "\\u5206";

export function SleepStageTimeline() {
    return (
        <SegmentTimelineCard
            title="睡眠ステージ"
            description="セグメントタイムライン"
            delta="+7%"
            deltaDescription="基準品質 76% との差分です。"
            metrics={metrics}
            segments={segments}
            selectedIndex={0}
            min={0}
            max={474}
            startLabel="23:42"
            endLabel="07:18"
            formatValue={(value) => formatDuration(value)}
            rangeLabel="ステージ時間"
            caption="睡眠、稼働状況、配送状態などの時間範囲をカテゴリごとに確認します。"
        />
    );
}` } as const;
const usageCode = { en: `import { SegmentTimelineCard } from "@gunjo/ui";

const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];

export function SleepStageTimelineVariants() {
    return (
        <div className="grid gap-6">
            <SegmentTimelineCard segments={segments} />
            <SegmentTimelineCard segments={segments} selectedIndex={1} />
            <SegmentTimelineCard
              segments={segments}
              min={0}
              max={474}
              markers={[{ value: 360, label: "Alarm" }]}
            />
        </div>
    );
}`, ja: `import { SegmentTimelineCard } from "@gunjo/ui";

const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];

export function SleepStageTimelineVariants() {
    return (
        <div className="grid gap-6">
            <SegmentTimelineCard segments={segments} />
            <SegmentTimelineCard segments={segments} selectedIndex={1} />
            <SegmentTimelineCard
              segments={segments}
              min={0}
              max={474}
              markers={[{ value: 360, label: "アラーム" }]}
            />
        </div>
    );
}` } as const;
const propsData = { en: [{"name":"segments","type":"SegmentTimelineSegment[]","description":"Categorical ranges rendered across the horizontal timeline."},{"name":"metrics","type":"SegmentTimelineMetric[]","description":"Summary metrics shown above the timeline."},{"name":"selectedIndex","type":"number","description":"Highlights the inspected timeline segment."},{"name":"min / max","type":"number","description":"Timeline range used to normalize segment and marker positions."},{"name":"startLabel / endLabel","type":"ReactNode","description":"Labels shown at the start and end of the timeline."},{"name":"markers","type":"SegmentTimelineMarker[]","description":"Optional reference markers on the timeline."},{"name":"formatValue","type":"(value: number) => ReactNode","description":"Formats durations shown in tooltips and legend rows. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting."},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)"},{"name":"rangeLabel","type":"ReactNode","description":"Label used before the segment start/end range in tooltip descriptions."}], ja: [{"name":"segments","type":"SegmentTimelineSegment[]","description":"横方向のタイムラインに表示するカテゴリ別の時間範囲です。"},{"name":"metrics","type":"SegmentTimelineMetric[]","description":"タイムライン上部に表示する概要指標です。"},{"name":"selectedIndex","type":"number","description":"確認中の時間範囲を強調します。"},{"name":"min / max","type":"number","description":"セグメントとマーカー位置を正規化するタイムライン範囲です。"},{"name":"startLabel / endLabel","type":"ReactNode","description":"タイムラインの開始端と終了端に表示するラベルです。"},{"name":"markers","type":"SegmentTimelineMarker[]","description":"タイムライン上に表示する任意の基準マーカーです。"},{"name":"formatValue","type":"(value: number) => ReactNode","description":"ツールチップと凡例行に表示する時間を整形します。 関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。"},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)"},{"name":"rangeLabel","type":"ReactNode","description":"ツールチップ内の開始終了範囲の前に表示するラベルです。"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard timeline card with metrics.", preview: <SegmentTimelineCard title="Sleep stages" metrics={metricsByLocale.en} segments={segmentsByLocale.en} min={0} max={474} startLabel="11:42 PM" endLabel="7:18 AM" formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} rangeLabel="Stage duration" />, previewBodyWidth: "xl", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    {
      label: "Sleep quality",
      value: "83%",
      description: "Sleep quality score compared with the 76% baseline.",
    },
    {
      label: "Time asleep",
      value: "7h 26m",
      description: "Total sleep duration excluding awake time.",
    },
    {
      label: "Awake time",
      value: "28m",
      description: "Total duration classified as awake.",
    },
];
const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";

export function SleepStageTimeline() {
    return (
        <SegmentTimelineCard
          title="Sleep stages"
          metrics={metrics}
          segments={segments}
          min={0}
          max={474}
          startLabel="11:42 PM"
          endLabel="7:18 AM"
          formatValue
          value
        > formatDuration(value)} rangeLabel="Stage duration" />
    );
}` }, { key: "selected", title: "Selected segment", description: "Highlights one timeline segment.", preview: <SegmentTimelineCard title="Sleep stages" metrics={metricsByLocale.en} segments={segmentsByLocale.en} selectedIndex={0} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} rangeLabel="Stage duration" />, previewBodyWidth: "xl", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    {
      label: "Sleep quality",
      value: "83%",
      description: "Sleep quality score compared with the 76% baseline.",
    },
    {
      label: "Time asleep",
      value: "7h 26m",
      description: "Total sleep duration excluding awake time.",
    },
    {
      label: "Awake time",
      value: "28m",
      description: "Total duration classified as awake.",
    },
];
const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";

export function SelectedSleepStageTimeline() {
    return (
        <SegmentTimelineCard
          title="Sleep stages"
          metrics={metrics}
          segments={segments}
          selectedIndex={0}
          min={0}
          max={474}
          formatValue
          value
        > formatDuration(value)} rangeLabel="Stage duration" />
    );
}` }, { key: "markers", title: "With markers", description: "Shows reference points on the timeline.", preview: <SegmentTimelineCard title="Sleep stages" segments={segmentsByLocale.en} markers={[{ value: 360, label: "Alarm" }]} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} rangeLabel="Stage duration" />, previewBodyWidth: "xl", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";

export function SleepStageTimelineWithMarkers() {
    return (
        <SegmentTimelineCard
          title="Sleep stages"
          segments={segments}
          min={0}
          max={474}
          markers={[{ value: 360, label: "Alarm" }]}
          formatValue
          value
        > formatDuration(value)} rangeLabel="Stage duration" />
    );
}` }, { key: "compact", title: "Compact", description: "Compact card density.", preview: <SegmentTimelineCard title="Sleep stages" segments={segmentsByLocale.en} variant="compact" min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} />, previewBodyWidth: "lg", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const segments = [
    { label: "Light sleep", value: 31, start: 0, end: 31, color: "info" },
    { label: "Deep sleep", value: 37, start: 31, end: 68, color: "primary" },
    { label: "Light sleep", value: 31, start: 68, end: 99, color: "info" },
    { label: "REM", value: 29, start: 99, end: 128, color: "success" },
    { label: "Light sleep", value: 31, start: 128, end: 159, color: "info" },
    { label: "Awake", value: 14, start: 159, end: 173, color: "warning" },
    { label: "Light sleep", value: 31, start: 173, end: 204, color: "info" },
    { label: "Deep sleep", value: 37, start: 204, end: 241, color: "primary" },
    { label: "Light sleep", value: 31, start: 241, end: 272, color: "info" },
    { label: "REM", value: 29, start: 272, end: 301, color: "success" },
    { label: "Light sleep", value: 31, start: 301, end: 332, color: "info" },
    { label: "Deep sleep", value: 38, start: 332, end: 370, color: "primary" },
    { label: "Light sleep", value: 31, start: 370, end: 401, color: "info" },
    { label: "REM", value: 28, start: 401, end: 429, color: "success" },
    { label: "Awake", value: 14, start: 429, end: 443, color: "warning" },
    { label: "Light sleep", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";

export function CompactSleepStageTimeline() {
    return (
        <SegmentTimelineCard
          title="Sleep stages"
          segments={segments}
          variant="compact"
          min={0}
          max={474}
          formatValue
          value
        > formatDuration(value)} />
    );
}` }], ja: [{ key: "default", title: "標準表示", description: "指標付きの標準タイムラインカードです。", preview: <SegmentTimelineCard title="睡眠ステージ" metrics={metricsByLocale.ja} segments={segmentsByLocale.ja} min={0} max={474} startLabel="23:42" endLabel="07:18" formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} rangeLabel="ステージ時間" />, previewBodyWidth: "xl", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "睡眠品質", value: "83%", description: "基準品質 76% と比較した睡眠品質スコアです。" },
    { label: "睡眠時間", value: "7時間26分", description: "総時間から覚醒時間を除いた睡眠時間です。" },
    { label: "覚醒時間", value: "28分", description: "覚醒ステージに分類された時間の合計です。" },
];
const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "\\u6642\\u9593" + (minutes % 60) + "\\u5206";

export function SleepStageTimeline() {
    return (
        <SegmentTimelineCard
          title="睡眠ステージ"
          metrics={metrics}
          segments={segments}
          min={0}
          max={474}
          startLabel="23:42"
          endLabel="07:18"
          formatValue
          value
        > formatDuration(value)} rangeLabel="ステージ時間" />
    );
}` }, { key: "selected", title: "選択セグメント", description: "確認中の時間範囲を強調します。", preview: <SegmentTimelineCard title="睡眠ステージ" metrics={metricsByLocale.ja} segments={segmentsByLocale.ja} selectedIndex={0} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} rangeLabel="ステージ時間" />, previewBodyWidth: "xl", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "睡眠品質", value: "83%", description: "基準品質 76% と比較した睡眠品質スコアです。" },
    { label: "睡眠時間", value: "7時間26分", description: "総時間から覚醒時間を除いた睡眠時間です。" },
    { label: "覚醒時間", value: "28分", description: "覚醒ステージに分類された時間の合計です。" },
];
const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "\\u6642\\u9593" + (minutes % 60) + "\\u5206";

export function SelectedSleepStageTimeline() {
    return (
        <SegmentTimelineCard
          title="睡眠ステージ"
          metrics={metrics}
          segments={segments}
          selectedIndex={0}
          min={0}
          max={474}
          formatValue
          value
        > formatDuration(value)} rangeLabel="ステージ時間" />
    );
}` }, { key: "markers", title: "マーカー付き", description: "タイムライン上に基準点を表示します。", preview: <SegmentTimelineCard title="睡眠ステージ" segments={segmentsByLocale.ja} markers={[{ value: 360, label: "アラーム" }]} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} rangeLabel="ステージ時間" />, previewBodyWidth: "xl", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "\\u6642\\u9593" + (minutes % 60) + "\\u5206";

export function SleepStageTimelineWithMarkers() {
    return (
        <SegmentTimelineCard
          title="睡眠ステージ"
          segments={segments}
          min={0}
          max={474}
          markers={[{ value: 360, label: "アラーム" }]}
          formatValue
          value
        > formatDuration(value)} rangeLabel="ステージ時間" />
    );
}` }, { key: "compact", title: "コンパクト", description: "カード密度を抑えた表示です。", preview: <SegmentTimelineCard title="睡眠ステージ" segments={segmentsByLocale.ja} variant="compact" min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} />, previewBodyWidth: "lg", code: `import { SegmentTimelineCard } from "@gunjo/ui";

const segments = [
    { label: "浅い睡眠", value: 31, start: 0, end: 31, color: "info" },
    { label: "深い睡眠", value: 37, start: 31, end: 68, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 68, end: 99, color: "info" },
    { label: "レム", value: 29, start: 99, end: 128, color: "success" },
    { label: "浅い睡眠", value: 31, start: 128, end: 159, color: "info" },
    { label: "覚醒", value: 14, start: 159, end: 173, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 173, end: 204, color: "info" },
    { label: "深い睡眠", value: 37, start: 204, end: 241, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 241, end: 272, color: "info" },
    { label: "レム", value: 29, start: 272, end: 301, color: "success" },
    { label: "浅い睡眠", value: 31, start: 301, end: 332, color: "info" },
    { label: "深い睡眠", value: 38, start: 332, end: 370, color: "primary" },
    { label: "浅い睡眠", value: 31, start: 370, end: 401, color: "info" },
    { label: "レム", value: 28, start: 401, end: 429, color: "success" },
    { label: "覚醒", value: 14, start: 429, end: 443, color: "warning" },
    { label: "浅い睡眠", value: 31, start: 443, end: 474, color: "info" },
];
const formatDuration = (minutes) => Math.floor(minutes / 60) + "\\u6642\\u9593" + (minutes % 60) + "\\u5206";

export function CompactSleepStageTimeline() {
    return (
        <SegmentTimelineCard
          title="睡眠ステージ"
          segments={segments}
          variant="compact"
          min={0}
          max={474}
          formatValue
          value
        > formatDuration(value)} />
    );
}` }] } as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>時間の帯を横スクロールでカードの中に収めた。</strong>帯は最低 36rem を確保し、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-x-auto</code> の入れ物に入れています。スマホでカードごと横に伸びると、ページ全体が横に流れてしまうためです。
            </li>
            <li>
                <strong>押せるのは区分と凡例で、目印は読み物にした。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> の一片と凡例の行は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> ですが、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">markers</code>（締切・交代の時刻）は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> の飾りです。目印は幅を持たないので、タップの的として使えないためです。
            </li>
            <li>
                <strong>時間の左端と右端は呼ぶ側が書く。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">startLabel</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">endLabel</code>、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> は渡された値をそのまま使い、部品は時刻の書式を持ちません。24時間の1日なのか、8時間の1シフトなのかで、書き方も刻みも変わるからです。
                <br />
                一般のカードの設計は UIXHERO の「カード」にあります。
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>The timeline scrolls inside the card.</strong> The track holds a 36rem floor inside an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overflow-x-auto</code> box. Letting the card itself grow wider would drag page-level horizontal scroll onto phones.
            </li>
            <li>
                <strong>Segments and legend rows are pressable; markers are not.</strong> Each <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> block and each legend row is a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code>, while <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">markers</code> (a cut-off, a shift change) are <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> decorations: a marker has no width, so it cannot be a tap target.
            </li>
            <li>
                <strong>The two ends of the axis are written by the caller.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">startLabel</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">endLabel</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> are used verbatim; the component owns no time formatting. A 24-hour day and an 8-hour shift want different labels and different ticks.
                <br />
                The general design of cards is covered by UIXHERO&rsquo;s card article.
            </li>
        </>
    ),
};

// 本文からこの節へ移した UIXHERO の記事リンク（gunjo #955 の受け口）。
const uixheroLinks: Record<"ja" | "en", UixheroLink[]> = {
    ja: [
        {
            label: "UIXHERO: カード（Card）",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/card`,
            relation: "nearest",
        },
    ],
    en: [
        {
            label: "UIXHERO: Card (in Japanese)",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/card`,
            relation: "nearest",
        },
    ],
};

export default function SegmentTimelineCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.segmentTimelineCard.title, ja: "セグメントタイムラインカード" }} description={{ en: meta.segmentTimelineCard.description, ja: "睡眠ステージや稼働状態などの時間範囲を、指標とマーカー付きで示すカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="segment-timeline-card" embedBase="/embed/segment-timeline-card" previewHeight={540} states={states} usedComponents={{ en: [{ name: "SegmentTimelineCard", href: "/docs/components/segment-timeline-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "セグメントタイムラインカード", href: "/docs/components/segment-timeline-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"Timeline","href":"/docs/components/timeline"},{"name":"ActivityTimelineCard","href":"/docs/components/activity-timeline-card"}], ja: [{"name":"タイムライン","href":"/docs/components/timeline"},{"name":"活動タイムラインカード","href":"/docs/components/activity-timeline-card"}] }} uixheroLinks={uixheroLinks} />;
}
