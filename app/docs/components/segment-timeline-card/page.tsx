"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { SegmentTimelineCard } from "@gunjo/ui";

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

${timelineCode.en}

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
/>`, ja: `import { SegmentTimelineCard } from "@gunjo/ui";

${timelineCode.ja}

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
/>` } as const;
const usageCode = { en: `${timelineCode.en}

<SegmentTimelineCard segments={segments} />
<SegmentTimelineCard segments={segments} selectedIndex={1} />
<SegmentTimelineCard segments={segments} min={0} max={474} markers={[{ value: 360, label: "Alarm" }]} />`, ja: `${timelineCode.ja}

<SegmentTimelineCard segments={segments} />
<SegmentTimelineCard segments={segments} selectedIndex={1} />
<SegmentTimelineCard segments={segments} min={0} max={474} markers={[{ value: 360, label: "アラーム" }]} />` } as const;
const propsData = { en: [{"name":"segments","type":"SegmentTimelineSegment[]","description":"Categorical ranges rendered across the horizontal timeline."},{"name":"metrics","type":"SegmentTimelineMetric[]","description":"Summary metrics shown above the timeline."},{"name":"selectedIndex","type":"number","description":"Highlights the inspected timeline segment."},{"name":"min / max","type":"number","description":"Timeline range used to normalize segment and marker positions."},{"name":"startLabel / endLabel","type":"ReactNode","description":"Labels shown at the start and end of the timeline."},{"name":"markers","type":"SegmentTimelineMarker[]","description":"Optional reference markers on the timeline."},{"name":"formatValue","type":"(value: number) => ReactNode","description":"Formats durations shown in tooltips and legend rows. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting."},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)"},{"name":"rangeLabel","type":"ReactNode","description":"Label used before the segment start/end range in tooltip descriptions."}], ja: [{"name":"segments","type":"SegmentTimelineSegment[]","description":"横方向のタイムラインに表示するカテゴリ別の時間範囲です。"},{"name":"metrics","type":"SegmentTimelineMetric[]","description":"タイムライン上部に表示する概要指標です。"},{"name":"selectedIndex","type":"number","description":"確認中の時間範囲を強調します。"},{"name":"min / max","type":"number","description":"セグメントとマーカー位置を正規化するタイムライン範囲です。"},{"name":"startLabel / endLabel","type":"ReactNode","description":"タイムラインの開始端と終了端に表示するラベルです。"},{"name":"markers","type":"SegmentTimelineMarker[]","description":"タイムライン上に表示する任意の基準マーカーです。"},{"name":"formatValue","type":"(value: number) => ReactNode","description":"ツールチップと凡例行に表示する時間を整形します。 関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。"},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)"},{"name":"rangeLabel","type":"ReactNode","description":"ツールチップ内の開始終了範囲の前に表示するラベルです。"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard timeline card with metrics.", preview: <SegmentTimelineCard title="Sleep stages" metrics={metricsByLocale.en} segments={segmentsByLocale.en} min={0} max={474} startLabel="11:42 PM" endLabel="7:18 AM" formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} rangeLabel="Stage duration" />, previewBodyWidth: "xl", code: `${timelineCode.en}\n\n<SegmentTimelineCard title="Sleep stages" metrics={metrics} segments={segments} min={0} max={474} startLabel="11:42 PM" endLabel="7:18 AM" formatValue={(value) => formatDuration(value)} rangeLabel="Stage duration" />` }, { key: "selected", title: "Selected segment", description: "Highlights one timeline segment.", preview: <SegmentTimelineCard title="Sleep stages" metrics={metricsByLocale.en} segments={segmentsByLocale.en} selectedIndex={0} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} rangeLabel="Stage duration" />, previewBodyWidth: "xl", code: `${timelineCode.en}\n\n<SegmentTimelineCard title="Sleep stages" metrics={metrics} segments={segments} selectedIndex={0} min={0} max={474} formatValue={(value) => formatDuration(value)} rangeLabel="Stage duration" />` }, { key: "markers", title: "With markers", description: "Shows reference points on the timeline.", preview: <SegmentTimelineCard title="Sleep stages" segments={segmentsByLocale.en} markers={[{ value: 360, label: "Alarm" }]} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} rangeLabel="Stage duration" />, previewBodyWidth: "xl", code: `${timelineCode.en}\n\n<SegmentTimelineCard title="Sleep stages" segments={segments} min={0} max={474} markers={[{ value: 360, label: "Alarm" }]} formatValue={(value) => formatDuration(value)} rangeLabel="Stage duration" />` }, { key: "compact", title: "Compact", description: "Compact card density.", preview: <SegmentTimelineCard title="Sleep stages" segments={segmentsByLocale.en} variant="compact" min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}h ${value % 60}m`} />, previewBodyWidth: "lg", code: `${timelineCode.en}\n\n<SegmentTimelineCard title="Sleep stages" segments={segments} variant="compact" min={0} max={474} formatValue={(value) => formatDuration(value)} />` }], ja: [{ key: "default", title: "標準表示", description: "指標付きの標準タイムラインカードです。", preview: <SegmentTimelineCard title="睡眠ステージ" metrics={metricsByLocale.ja} segments={segmentsByLocale.ja} min={0} max={474} startLabel="23:42" endLabel="07:18" formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} rangeLabel="ステージ時間" />, previewBodyWidth: "xl", code: `${timelineCode.ja}\n\n<SegmentTimelineCard title="睡眠ステージ" metrics={metrics} segments={segments} min={0} max={474} startLabel="23:42" endLabel="07:18" formatValue={(value) => formatDuration(value)} rangeLabel="ステージ時間" />` }, { key: "selected", title: "選択セグメント", description: "確認中の時間範囲を強調します。", preview: <SegmentTimelineCard title="睡眠ステージ" metrics={metricsByLocale.ja} segments={segmentsByLocale.ja} selectedIndex={0} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} rangeLabel="ステージ時間" />, previewBodyWidth: "xl", code: `${timelineCode.ja}\n\n<SegmentTimelineCard title="睡眠ステージ" metrics={metrics} segments={segments} selectedIndex={0} min={0} max={474} formatValue={(value) => formatDuration(value)} rangeLabel="ステージ時間" />` }, { key: "markers", title: "マーカー付き", description: "タイムライン上に基準点を表示します。", preview: <SegmentTimelineCard title="睡眠ステージ" segments={segmentsByLocale.ja} markers={[{ value: 360, label: "アラーム" }]} min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} rangeLabel="ステージ時間" />, previewBodyWidth: "xl", code: `${timelineCode.ja}\n\n<SegmentTimelineCard title="睡眠ステージ" segments={segments} min={0} max={474} markers={[{ value: 360, label: "アラーム" }]} formatValue={(value) => formatDuration(value)} rangeLabel="ステージ時間" />` }, { key: "compact", title: "コンパクト", description: "カード密度を抑えた表示です。", preview: <SegmentTimelineCard title="睡眠ステージ" segments={segmentsByLocale.ja} variant="compact" min={0} max={474} formatValue={(value) => `${Math.floor(value / 60)}時間${value % 60}分`} />, previewBodyWidth: "lg", code: `${timelineCode.ja}\n\n<SegmentTimelineCard title="睡眠ステージ" segments={segments} variant="compact" min={0} max={474} formatValue={(value) => formatDuration(value)} />` }] } as const;

export default function SegmentTimelineCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.segmentTimelineCard.title, ja: "セグメントタイムラインカード" }} description={{ en: meta.segmentTimelineCard.description, ja: "睡眠ステージや稼働状態などの時間範囲を、指標とマーカー付きで示すカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="segment-timeline-card" embedBase="/embed/segment-timeline-card" previewHeight={540} states={states} usedComponents={{ en: [{ name: "SegmentTimelineCard", href: "/docs/components/segment-timeline-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "セグメントタイムラインカード", href: "/docs/components/segment-timeline-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"Timeline","href":"/docs/components/timeline"},{"name":"ActivityTimelineCard","href":"/docs/components/activity-timeline-card"}], ja: [{"name":"タイムライン","href":"/docs/components/timeline"},{"name":"活動タイムラインカード","href":"/docs/components/activity-timeline-card"}] }} />;
}
