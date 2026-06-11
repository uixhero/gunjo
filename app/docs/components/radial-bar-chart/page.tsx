"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { RadialBarChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof RadialBarChart>["data"][number];
const dataByLocale: Record<Locale, DataItem[]> = { en: [{ label: "Website", value: 78, color: "primary" }, { label: "Market", value: 64, color: "success" }, { label: "Shopping", value: 49, color: "warning" }], ja: [{ label: "サイト", value: 78, color: "primary" }, { label: "市場", value: 64, color: "success" }, { label: "購入", value: 49, color: "warning" }] };

const dataCode = {
    en: `const data = [
    { label: "Website", value: 78, color: "primary" },
    { label: "Market", value: 64, color: "success" },
    { label: "Shopping", value: 49, color: "warning" },
];`,
    ja: `const data = [
    { label: "サイト", value: 78, color: "primary" },
    { label: "市場", value: 64, color: "success" },
    { label: "購入", value: 49, color: "warning" },
];`,
} as const;

const code = { en: `import { RadialBarChart } from "@gunjo/ui";

${dataCode.en}

<RadialBarChart data={data} centerValue="64%" centerLabel="Average" showLegend />`, ja: `import { RadialBarChart } from "@gunjo/ui";

${dataCode.ja}

<RadialBarChart data={data} centerValue="64%" centerLabel="平均" showLegend maxLabel="最大" />` } as const;
const usageCode = { en: `${dataCode.en}

<RadialBarChart data={data} />
<RadialBarChart data={data} showLegend />
<RadialBarChart data={data} variant="compact" centerValue="64%" />`, ja: `${dataCode.ja}

<RadialBarChart data={data} />
<RadialBarChart data={data} showLegend maxLabel="最大" />
<RadialBarChart data={data} variant="compact" centerValue="64%" />` } as const;
const propsData = { en: [{"name":"data","type":"ChartDataPoint[]","description":"Series values rendered as concentric radial bars."},{"name":"variant","type":"\"default\" | \"compact\"","description":"Registered SSOT variant for chart size.","default":"\"default\""},{"name":"centerValue / centerLabel","type":"ReactNode","description":"Optional centered summary text."}], ja: [{"name":"data","type":"ChartDataPoint[]","description":"同心円バーとして表示する系列値です。"},{"name":"variant","type":"\"default\" | \"compact\"","description":"チャートサイズを切り替える SSOT 登録済みバリエーションです。","default":"\"default\""},{"name":"centerValue / centerLabel","type":"ReactNode","description":"中央に表示する任意の概要テキストです。"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard radial comparison.", preview: <RadialBarChart data={dataByLocale.en} centerValue="64%" centerLabel="Average" />, previewBodyWidth: "md", code: `${dataCode.en}\n\n<RadialBarChart data={data} centerValue="64%" centerLabel="Average" />` }, { key: "legend", title: "With legend", description: "Adds labels and values below the rings.", preview: <RadialBarChart data={dataByLocale.en} centerValue="64%" centerLabel="Average" showLegend />, previewBodyWidth: "md", code: `${dataCode.en}\n\n<RadialBarChart data={data} showLegend />` }, { key: "compact", title: "Compact", description: "Compact ring size for narrow cards.", preview: <RadialBarChart data={dataByLocale.en} variant="compact" centerValue="64%" />, previewBodyWidth: "sm", code: `${dataCode.en}\n\n<RadialBarChart data={data} variant="compact" centerValue="64%" />` }, { key: "thick", title: "Thicker bars", description: "Increases thickness for stronger visibility.", preview: <RadialBarChart data={dataByLocale.en} thickness={22} gap={7} showLegend />, previewBodyWidth: "md", code: `${dataCode.en}\n\n<RadialBarChart data={data} thickness={22} gap={7} showLegend />` }], ja: [{ key: "default", title: "標準表示", description: "標準サイズでラジアル値を比較します。", preview: <RadialBarChart data={dataByLocale.ja} centerValue="64%" centerLabel="平均" maxLabel="最大" />, previewBodyWidth: "md", code: `${dataCode.ja}\n\n<RadialBarChart data={data} centerValue="64%" centerLabel="平均" />` }, { key: "legend", title: "凡例付き", description: "リング下にラベルと値を表示します。", preview: <RadialBarChart data={dataByLocale.ja} centerValue="64%" centerLabel="平均" showLegend maxLabel="最大" />, previewBodyWidth: "md", code: `${dataCode.ja}\n\n<RadialBarChart data={data} showLegend maxLabel="最大" />` }, { key: "compact", title: "コンパクト", description: "狭いカード向けのコンパクトサイズです。", preview: <RadialBarChart data={dataByLocale.ja} variant="compact" centerValue="64%" maxLabel="最大" />, previewBodyWidth: "sm", code: `${dataCode.ja}\n\n<RadialBarChart data={data} variant="compact" centerValue="64%" />` }, { key: "thick", title: "太いバー", description: "視認性を高めるためバーを太くします。", preview: <RadialBarChart data={dataByLocale.ja} thickness={22} gap={7} showLegend maxLabel="最大" />, previewBodyWidth: "md", code: `${dataCode.ja}\n\n<RadialBarChart data={data} thickness={22} gap={7} showLegend />` }] } as const;

export default function RadialBarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.radialBarChart.title, ja: "ラジアルバーチャート" }} description={{ en: meta.radialBarChart.description, ja: "複数系列の進捗や容量を同心円バーで比較するチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="radial-bar-chart" embedBase="/embed/radial-bar-chart" previewHeight={500} states={states} usedComponents={{ en: [{ name: "RadialBarChart", href: "/docs/components/radial-bar-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "ラジアルバーチャート", href: "/docs/components/radial-bar-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"GaugeChart","href":"/docs/components/gauge-chart"},{"name":"ConcentricProgressCard","href":"/docs/components/concentric-progress-card"}], ja: [{"name":"ゲージチャート","href":"/docs/components/gauge-chart"},{"name":"同心円進捗カード","href":"/docs/components/concentric-progress-card"}] }} />;
}
