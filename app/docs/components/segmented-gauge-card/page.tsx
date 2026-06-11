"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { SegmentedGaugeCard } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof SegmentedGaugeCard>["segments"][number];
const segmentsByLocale: Record<Locale, DataItem[]> = { en: [{ label: "Essentials", value: 35, rangeLabel: "Fixed" }, { label: "Growth", value: 45, rangeLabel: "Investment" }, { label: "Operations", value: 20, rangeLabel: "Capacity" }], ja: [{ label: "基礎費", value: 35, rangeLabel: "固定費" }, { label: "成長投資", value: 45, rangeLabel: "追加投資" }, { label: "運用費", value: 20, rangeLabel: "運用余力" }] };

const segmentsCode = {
    en: `const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];`,
    ja: `const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];`,
} as const;

const code = { en: `import { SegmentedGaugeCard } from "@gunjo/ui";

${segmentsCode.en}

<SegmentedGaugeCard
    title="Spend breakdown"
    description="Segmented gauge"
    value={82}
    valueLabel="82%"
    centerLabel="Current spend"
    delta="45%"
    deltaDescription="Share of the selected segment."
    segments={segments}
    selectedIndex={1}
    targetValue={90}
    targetLabel="Target spend"
    max={100}
    formatValue={(value) => value + "%"}
    totalLabel="Total"
    caption="Inspect spend, progress, or risk status with segmented gauge ranges."
/>`, ja: `import { SegmentedGaugeCard } from "@gunjo/ui";

${segmentsCode.ja}

<SegmentedGaugeCard
    title="支出内訳"
    description="セグメントゲージ"
    value={82}
    valueLabel="82%"
    centerLabel="現在の支出"
    delta="45%"
    deltaDescription="選択したセグメントの構成比です。"
    segments={segments}
    selectedIndex={1}
    targetValue={90}
    targetLabel="目標支出"
    max={100}
    formatValue={(value) => value + "%"}
    totalLabel="合計"
    caption="支出・進捗・リスクをセグメント付きの半円ゲージで確認します。"
/>` } as const;
const usageCode = { en: `${segmentsCode.en}

<SegmentedGaugeCard segments={segments} value={82} targetValue={90} max={100} />
<SegmentedGaugeCard segments={segments} selectedIndex={1} />
<SegmentedGaugeCard segments={segments} variant="compact" showLegend={false} />`, ja: `${segmentsCode.ja}

<SegmentedGaugeCard segments={segments} value={82} targetValue={90} max={100} />
<SegmentedGaugeCard segments={segments} selectedIndex={1} />
<SegmentedGaugeCard segments={segments} variant="compact" showLegend={false} />` } as const;
const propsData = { en: [{"name":"segments","type":"SegmentedGaugeCardSegment[]","description":"Gauge segments rendered across the semicircle arc."},{"name":"value / valueLabel","type":"number / ReactNode","description":"Current value and the display label shown in the gauge center."},{"name":"centerLabel","type":"ReactNode","description":"Label shown below the center value."},{"name":"delta / deltaDescription","type":"ReactNode","description":"Supplementary metric and explanation shown in the card header."},{"name":"targetValue / targetLabel","type":"number / ReactNode","description":"Optional target marker and tooltip label."},{"name":"selectedIndex","type":"number","description":"Highlights the inspected segment."},{"name":"max","type":"number","description":"Maximum gauge scale used for segment and target normalization."},{"name":"showLegend","type":"boolean","description":"Shows segment legend rows below the gauge.","default":"true"}], ja: [{"name":"segments","type":"SegmentedGaugeCardSegment[]","description":"半円アークに表示するゲージセグメントです。"},{"name":"value / valueLabel","type":"number / ReactNode","description":"現在値とゲージ中央に表示するラベルです。"},{"name":"centerLabel","type":"ReactNode","description":"中央値の下に表示するラベルです。"},{"name":"delta / deltaDescription","type":"ReactNode","description":"カードヘッダーに表示する補助指標と説明です。"},{"name":"targetValue / targetLabel","type":"number / ReactNode","description":"任意の目標マーカーとツールチップ用ラベルです。"},{"name":"selectedIndex","type":"number","description":"確認中のセグメントを強調します。"},{"name":"max","type":"number","description":"セグメントと目標値の正規化に使う最大値です。"},{"name":"showLegend","type":"boolean","description":"ゲージ下にセグメント凡例を表示します。","default":"true"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard segmented gauge card.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.en} />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<SegmentedGaugeCard title="Spend breakdown" segments={segments} value={82} valueLabel="82%" targetValue={90} />` }, { key: "selected", title: "Selected segment", description: "Highlights one range segment.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.en} selectedIndex={1} />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<SegmentedGaugeCard title="Spend breakdown" segments={segments} value={82} valueLabel="82%" targetValue={90} selectedIndex={1} />` }, { key: "no-legend", title: "No legend", description: "Hides legend rows when the parent owns details.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.en} showLegend={false} />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<SegmentedGaugeCard title="Spend breakdown" segments={segments} value={82} valueLabel="82%" targetValue={90} showLegend={false} />` }, { key: "compact", title: "Compact", description: "Compact density for small cards.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" segments={segmentsByLocale.en} variant="compact" />, previewBodyWidth: "sm", code: `${segmentsCode.en}\n\n<SegmentedGaugeCard title="Spend breakdown" segments={segments} value={82} valueLabel="82%" variant="compact" />` }], ja: [{ key: "default", title: "標準表示", description: "標準のセグメントゲージカードです。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.ja} />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<SegmentedGaugeCard title="支出内訳" segments={segments} value={82} valueLabel="82%" targetValue={90} />` }, { key: "selected", title: "選択セグメント", description: "確認中の範囲セグメントを強調します。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.ja} selectedIndex={1} />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<SegmentedGaugeCard title="支出内訳" segments={segments} value={82} valueLabel="82%" targetValue={90} selectedIndex={1} />` }, { key: "no-legend", title: "凡例なし", description: "親ビュー側で詳細を持つ場合は凡例行を隠せます。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.ja} showLegend={false} />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<SegmentedGaugeCard title="支出内訳" segments={segments} value={82} valueLabel="82%" targetValue={90} showLegend={false} />` }, { key: "compact", title: "コンパクト", description: "小さなカード向けの密度です。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" segments={segmentsByLocale.ja} variant="compact" />, previewBodyWidth: "sm", code: `${segmentsCode.ja}\n\n<SegmentedGaugeCard title="支出内訳" segments={segments} value={82} valueLabel="82%" variant="compact" />` }] } as const;

export default function SegmentedGaugeCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.segmentedGaugeCard.title, ja: "セグメントゲージカード" }} description={{ en: meta.segmentedGaugeCard.description, ja: "現在値、目標値、範囲セグメントを半円ゲージで示すカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="segmented-gauge-card" embedBase="/embed/segmented-gauge-card" previewHeight={460} states={states} usedComponents={{ en: [{ name: "SegmentedGaugeCard", href: "/docs/components/segmented-gauge-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "セグメントゲージカード", href: "/docs/components/segmented-gauge-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"GaugeChart","href":"/docs/components/gauge-chart"},{"name":"RadialBarChart","href":"/docs/components/radial-bar-chart"}], ja: [{"name":"ゲージチャート","href":"/docs/components/gauge-chart"},{"name":"ラジアルバーチャート","href":"/docs/components/radial-bar-chart"}] }} />;
}
