"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { RibbonChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof RibbonChart>["layers"][number];
const layersByLocale: Record<Locale, DataItem[]> = { en: [{ label: "New", color: "primary", data: [{ label: "Jan", value: 22 }, { label: "Feb", value: 30 }, { label: "Mar", value: 36 }, { label: "Apr", value: 44 }, { label: "May", value: 52 }, { label: "Jun", value: 60 }] }, { label: "Returning", color: "success", data: [{ label: "Jan", value: 16 }, { label: "Feb", value: 22 }, { label: "Mar", value: 30 }, { label: "Apr", value: 38 }, { label: "May", value: 46 }, { label: "Jun", value: 52 }] }, { label: "Expansion", color: "warning", data: [{ label: "Jan", value: 8 }, { label: "Feb", value: 14 }, { label: "Mar", value: 22 }, { label: "Apr", value: 30 }, { label: "May", value: 38 }, { label: "Jun", value: 48 }] }], ja: [{ label: "新規", color: "primary", data: [{ label: "1月", value: 22 }, { label: "2月", value: 30 }, { label: "3月", value: 36 }, { label: "4月", value: 44 }, { label: "5月", value: 52 }, { label: "6月", value: 60 }] }, { label: "継続", color: "success", data: [{ label: "1月", value: 16 }, { label: "2月", value: 22 }, { label: "3月", value: 30 }, { label: "4月", value: 38 }, { label: "5月", value: 46 }, { label: "6月", value: 52 }] }, { label: "拡張", color: "warning", data: [{ label: "1月", value: 8 }, { label: "2月", value: 14 }, { label: "3月", value: 22 }, { label: "4月", value: 30 }, { label: "5月", value: 38 }, { label: "6月", value: 48 }] }] };

const layersCode = {
    en: `const layers = [
    { label: "New", color: "primary", data: [{ label: "Jan", value: 22 }, { label: "Feb", value: 30 }, { label: "Mar", value: 36 }, { label: "Apr", value: 44 }, { label: "May", value: 52 }, { label: "Jun", value: 60 }] },
    { label: "Returning", color: "success", data: [{ label: "Jan", value: 16 }, { label: "Feb", value: 22 }, { label: "Mar", value: 30 }, { label: "Apr", value: 38 }, { label: "May", value: 46 }, { label: "Jun", value: 52 }] },
    { label: "Expansion", color: "warning", data: [{ label: "Jan", value: 8 }, { label: "Feb", value: 14 }, { label: "Mar", value: 22 }, { label: "Apr", value: 30 }, { label: "May", value: 38 }, { label: "Jun", value: 48 }] },
];`,
    ja: `const layers = [
    { label: "新規", color: "primary", data: [{ label: "1月", value: 22 }, { label: "2月", value: 30 }, { label: "3月", value: 36 }, { label: "4月", value: 44 }, { label: "5月", value: 52 }, { label: "6月", value: 60 }] },
    { label: "継続", color: "success", data: [{ label: "1月", value: 16 }, { label: "2月", value: 22 }, { label: "3月", value: 30 }, { label: "4月", value: 38 }, { label: "5月", value: 46 }, { label: "6月", value: 52 }] },
    { label: "拡張", color: "warning", data: [{ label: "1月", value: 8 }, { label: "2月", value: 14 }, { label: "3月", value: 22 }, { label: "4月", value: 30 }, { label: "5月", value: 38 }, { label: "6月", value: 48 }] },
];`,
} as const;

const code = { en: `import { AnalyticsCard, RibbonChart } from "@gunjo/ui";

${layersCode.en}

<AnalyticsCard
    title="Ribbon chart"
    description="Flow distribution"
    value="608"
    delta="+114"
    deltaDescription="Change from the first preview value."
    trend="up"
>
    <RibbonChart
        layers={layers}
        variant="flow"
        totalLabel="Total"
        showLegend
    />
</AnalyticsCard>`, ja: `import { AnalyticsCard, RibbonChart } from "@gunjo/ui";

${layersCode.ja}

<AnalyticsCard
    title="リボンチャート"
    description="流量分布"
    value="608"
    delta="+114"
    deltaDescription="プレビュー内の最初の値との差分です。"
    trend="up"
>
    <RibbonChart
        layers={layers}
        variant="flow"
        totalLabel="合計"
        showLegend
    />
</AnalyticsCard>` } as const;
const usageCode = { en: `${layersCode.en}

<RibbonChart layers={layers} />
<RibbonChart layers={layers} variant="flow" totalLabel="Total" showLegend />
<RibbonChart layers={layers} variant="stacked" />`, ja: `${layersCode.ja}

<RibbonChart layers={layers} />
<RibbonChart layers={layers} variant="flow" showLegend totalLabel="合計" />
<RibbonChart layers={layers} variant="stacked" />` } as const;
const propsData = { en: [{"name":"layers","type":"RibbonChartLayer[]","description":"Layers and point values rendered as changing ribbon widths."},{"name":"variant","type":"\"flow\" | \"stacked\"","description":"Registered SSOT variant for centered flow or stacked area rendering.","default":"\"flow\""},{"name":"max","type":"number","description":"Optional maximum total used to keep multiple charts on the same scale."},{"name":"totalLabel","type":"ReactNode","description":"Label used in legend tooltip descriptions.","default":"\"Total\""},{"name":"showLegend","type":"boolean","description":"Renders a ChartLegend for layer totals.","default":"false"},{"name":"showLabels","type":"boolean","description":"Shows or hides period labels below the ribbons.","default":"true"}], ja: [{"name":"layers","type":"RibbonChartLayer[]","description":"幅が変化するリボンとして表示するレイヤーと値です。"},{"name":"variant","type":"\"flow\" | \"stacked\"","description":"中央寄せのフロー表示と積み上げ表示を切り替える SSOT 登録済みバリエーションです。","default":"\"flow\""},{"name":"max","type":"number","description":"複数チャートを同じスケールで比較するための最大合計値です。"},{"name":"totalLabel","type":"ReactNode","description":"凡例ツールチップの説明に使う合計ラベルです。","default":"\"Total\""},{"name":"showLegend","type":"boolean","description":"レイヤー合計のチャート凡例を表示します。","default":"false"},{"name":"showLabels","type":"boolean","description":"リボン下の期間ラベルの表示を切り替えます。","default":"true"}] } as const;
const states = { en: [{ key: "flow", title: "Flow", description: "Centered flow variant for changing volume.", preview: <RibbonChart layers={layersByLocale.en} variant="flow" totalLabel="Total" showLegend />, previewBodyWidth: "xl", code: `${layersCode.en}\n\n<RibbonChart layers={layers} variant="flow" totalLabel="Total" showLegend />` }, { key: "stacked", title: "Stacked", description: "Stacked area variant for cumulative totals.", preview: <RibbonChart layers={layersByLocale.en} variant="stacked" totalLabel="Total" showLegend />, previewBodyWidth: "xl", code: `${layersCode.en}\n\n<RibbonChart layers={layers} variant="stacked" totalLabel="Total" showLegend />` }, { key: "no-labels", title: "No labels", description: "Hides period labels in compact contexts.", preview: <RibbonChart layers={layersByLocale.en} showLabels={false} />, previewBodyWidth: "xl", code: `${layersCode.en}\n\n<RibbonChart layers={layers} showLabels={false} />` }, { key: "bounded", title: "Explicit max", description: "Keeps multiple ribbon charts on the same scale.", preview: <RibbonChart layers={layersByLocale.en} max={160} totalLabel="Total" showLegend />, previewBodyWidth: "xl", code: `${layersCode.en}\n\n<RibbonChart layers={layers} max={160} totalLabel="Total" showLegend />` }], ja: [{ key: "flow", title: "フロー", description: "量の変化を中央寄せの流れとして表示します。", preview: <RibbonChart layers={layersByLocale.ja} variant="flow" totalLabel="合計" showLegend />, previewBodyWidth: "xl", code: `${layersCode.ja}\n\n<RibbonChart layers={layers} variant="flow" totalLabel="合計" showLegend />` }, { key: "stacked", title: "積み上げ", description: "合計量を読みやすい積み上げ面で表示します。", preview: <RibbonChart layers={layersByLocale.ja} variant="stacked" totalLabel="合計" showLegend />, previewBodyWidth: "xl", code: `${layersCode.ja}\n\n<RibbonChart layers={layers} variant="stacked" totalLabel="合計" showLegend />` }, { key: "no-labels", title: "ラベルなし", description: "コンパクトな領域では期間ラベルを非表示にできます。", preview: <RibbonChart layers={layersByLocale.ja} showLabels={false} />, previewBodyWidth: "xl", code: `${layersCode.ja}\n\n<RibbonChart layers={layers} showLabels={false} />` }, { key: "bounded", title: "最大値指定", description: "複数のリボンチャートを同じスケールで比較します。", preview: <RibbonChart layers={layersByLocale.ja} max={160} totalLabel="合計" showLegend />, previewBodyWidth: "xl", code: `${layersCode.ja}\n\n<RibbonChart layers={layers} max={160} totalLabel="合計" showLegend />` }] } as const;

export default function RibbonChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.ribbonChart.title, ja: "リボンチャート" }} description={{ en: meta.ribbonChart.description, ja: "期間ごとの流量や構成量の変化を、幅の変わるリボンで比較するチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="ribbon-chart" embedBase="/embed/ribbon-chart" previewHeight={520} states={states} usedComponents={{ en: [{ name: "RibbonChart", href: "/docs/components/ribbon-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "リボンチャート", href: "/docs/components/ribbon-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"LineChart","href":"/docs/components/line-chart"},{"name":"StackedBarChart","href":"/docs/components/stacked-bar-chart"}], ja: [{"name":"折れ線チャート","href":"/docs/components/line-chart"},{"name":"積み上げ棒チャート","href":"/docs/components/stacked-bar-chart"}] }} />;
}
