"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { LineChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type LineSeries = ComponentProps<typeof LineChart>["series"][number];

const seriesByLocale: Record<Locale, LineSeries[]> = {
    en: [
        { label: "Revenue", color: "primary", data: [{ label: "Jan", value: 42 }, { label: "Feb", value: 58 }, { label: "Mar", value: 36 }, { label: "Apr", value: 68 }, { label: "May", value: 51 }, { label: "Jun", value: 74 }] },
        { label: "Target", color: "success", data: [{ label: "Jan", value: 46 }, { label: "Feb", value: 52 }, { label: "Mar", value: 48 }, { label: "Apr", value: 64 }, { label: "May", value: 56 }, { label: "Jun", value: 78 }] },
    ],
    ja: [
        { label: "売上", color: "primary", data: [{ label: "1月", value: 42 }, { label: "2月", value: 58 }, { label: "3月", value: 36 }, { label: "4月", value: 68 }, { label: "5月", value: 51 }, { label: "6月", value: 74 }] },
        { label: "目標", color: "success", data: [{ label: "1月", value: 46 }, { label: "2月", value: 52 }, { label: "3月", value: 48 }, { label: "4月", value: 64 }, { label: "5月", value: 56 }, { label: "6月", value: 78 }] },
    ],
};

const seriesCode = {
    en: "const series = [\n  { label: \"Revenue\", color: \"primary\", data: [{ label: \"Jan\", value: 42 }, { label: \"Feb\", value: 58 }, { label: \"Mar\", value: 36 }] },\n  { label: \"Target\", color: \"success\", data: [{ label: \"Jan\", value: 46 }, { label: \"Feb\", value: 52 }, { label: \"Mar\", value: 48 }] },\n];",
    ja: "const series = [\n  { label: \"売上\", color: \"primary\", data: [{ label: \"1月\", value: 42 }, { label: \"2月\", value: 58 }, { label: \"3月\", value: 36 }] },\n  { label: \"目標\", color: \"success\", data: [{ label: \"1月\", value: 46 }, { label: \"2月\", value: 52 }, { label: \"3月\", value: 48 }] },\n];",
} as const;

const code = { en: `import { LineChart } from "@gunjo/ui";

${seriesCode.en}

export function RevenueComparison() {
  return <LineChart series={series} variant="area" referenceValue={55} referenceLabel="Average" showLegend />;
}`, ja: `import { LineChart } from "@gunjo/ui";

${seriesCode.ja}

export function RevenueComparison() {
  return <LineChart series={series} variant="area" referenceValue={55} referenceLabel="平均" showLegend />;
}` } as const;
const usageCode = { en: `import { LineChart } from "@gunjo/ui";

${seriesCode.en}

<LineChart series={series} />
<LineChart series={series} variant="area" showLegend />
<LineChart series={series} referenceValue={50} referenceLabel="Goal" showDots={false} />`, ja: `import { LineChart } from "@gunjo/ui";

${seriesCode.ja}

<LineChart series={series} />
<LineChart series={series} variant="area" showLegend />
<LineChart series={series} referenceValue={50} referenceLabel="目標" showDots={false} />` } as const;

const propsData = {
    en: [
        { name: "series", type: "{ label?: ReactNode; data: Array<number | { label?: ReactNode; value: number }>; color?: ChartColor }[]", description: "Series and point values rendered across the chart width." },
        { name: "variant", type: "\"area\" | \"line\"", default: "\"line\"", description: "Registered SSOT variant for line or area rendering." },
        { name: "referenceValue", type: "number", description: "Optional dashed reference line." },
        { name: "showLegend", type: "boolean", default: "false", description: "Renders a ChartLegend for the series." },
        { name: "showDots", type: "boolean", default: "true", description: "Shows markers for each data point." },
    ],
    ja: [
        { name: "series", type: "{ label?: ReactNode; data: Array<number | { label?: ReactNode; value: number }>; color?: ChartColor }[]", description: "チャート幅に沿って表示する系列と各点の値です。" },
        { name: "variant", type: "\"area\" | \"line\"", default: "\"line\"", description: "線表示と面表示を切り替える SSOT 登録済みバリエーションです。" },
        { name: "referenceValue", type: "number", description: "任意の点線基準値です。" },
        { name: "showLegend", type: "boolean", default: "false", description: "系列のチャート凡例を表示します。" },
        { name: "showDots", type: "boolean", default: "true", description: "各データ点のマーカーを表示します。" },
    ],
} as const;

const states = {
    en: [
        { key: "line", title: "Line", description: "The registered line variant for direct time-series comparison.", preview: <LineChart series={seriesByLocale.en} />, previewBodyWidth: "full", code: `${seriesCode.en}\n\n<LineChart series={series} />` },
        { key: "area", title: "Area with legend", description: "Adds area fill, a reference line, and series legend for dashboard panels.", preview: <LineChart series={seriesByLocale.en} variant="area" referenceValue={55} referenceLabel="Average" showLegend />, previewBodyWidth: "full", code: `${seriesCode.en}\n\n<LineChart series={series} variant="area" referenceValue={55} referenceLabel="Average" showLegend />` },
        { key: "no-dots", title: "Without point markers", description: "Hides markers when the trend shape matters more than individual samples.", preview: <LineChart series={seriesByLocale.en} showDots={false} showGrid={false} />, previewBodyWidth: "full", code: `${seriesCode.en}\n\n<LineChart series={series} showDots={false} showGrid={false} />` },
        { key: "bounded", title: "Explicit range", description: "Locks the vertical domain when multiple charts need comparable scale.", preview: <LineChart series={seriesByLocale.en} min={0} max={100} referenceValue={75} referenceLabel="Goal" showLegend />, previewBodyWidth: "full", code: `${seriesCode.en}\n\n<LineChart series={series} min={0} max={100} referenceValue={75} referenceLabel="Goal" showLegend />` },
    ],
    ja: [
        { key: "line", title: "線表示", description: "時系列を直接比較する SSOT 登録済みの線バリエーションです。", preview: <LineChart series={seriesByLocale.ja} />, previewBodyWidth: "full", code: `${seriesCode.ja}\n\n<LineChart series={series} />` },
        { key: "area", title: "面表示と凡例", description: "面の塗り、基準線、系列凡例を加えてダッシュボードで読みやすくします。", preview: <LineChart series={seriesByLocale.ja} variant="area" referenceValue={55} referenceLabel="平均" showLegend />, previewBodyWidth: "full", code: `${seriesCode.ja}\n\n<LineChart series={series} variant="area" referenceValue={55} referenceLabel="平均" showLegend />` },
        { key: "no-dots", title: "点なし", description: "個別の点より傾向線を優先したい場合はマーカーを非表示にします。", preview: <LineChart series={seriesByLocale.ja} showDots={false} showGrid={false} />, previewBodyWidth: "full", code: `${seriesCode.ja}\n\n<LineChart series={series} showDots={false} showGrid={false} />` },
        { key: "bounded", title: "範囲固定", description: "複数チャートのスケールを揃えたい場合に縦軸の範囲を固定します。", preview: <LineChart series={seriesByLocale.ja} min={0} max={100} referenceValue={75} referenceLabel="目標" showLegend />, previewBodyWidth: "full", code: `${seriesCode.ja}\n\n<LineChart series={series} min={0} max={100} referenceValue={75} referenceLabel="目標" showLegend />` },
    ],
} as const;

export default function LineChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.lineChart.title, ja: "折れ線チャート" }} description={{ en: meta.lineChart.description, ja: "複数系列の時系列を、線・面表示、基準線、凡例付きで比較するチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="line-chart" embedBase="/embed/line-chart" previewHeight={520} states={states} usedComponents={{ en: [{ name: "LineChart", href: "/docs/components/line-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "折れ線チャート", href: "/docs/components/line-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{ name: "SparklineChart", href: "/docs/components/sparkline-chart" }, { name: "RibbonChart", href: "/docs/components/ribbon-chart" }, { name: "BarChart", href: "/docs/components/bar-chart" }], ja: [{ name: "スパークライン", href: "/docs/components/sparkline-chart" }, { name: "リボンチャート", href: "/docs/components/ribbon-chart" }, { name: "棒グラフ", href: "/docs/components/bar-chart" }] }} />;
}
