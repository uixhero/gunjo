"use client";

import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

type Locale = "en" | "ja";
const dataByLocale = {
    en: [
        { label: "Jan", value: 24 },
        { label: "Feb", value: 28 },
        { label: "Mar", value: 22 },
        { label: "Apr", value: 36 },
        { label: "May", value: 32 },
        { label: "Jun", value: 44 },
        { label: "Jul", value: 39 },
        { label: "Aug", value: 52 },
        { label: "Sep", value: 48 },
        { label: "Oct", value: 57 },
        { label: "Nov", value: 51 },
        { label: "Dec", value: 64 },
    ],
    ja: [
        { label: "1月", value: 24 },
        { label: "2月", value: 28 },
        { label: "3月", value: 22 },
        { label: "4月", value: 36 },
        { label: "5月", value: 32 },
        { label: "6月", value: 44 },
        { label: "7月", value: 39 },
        { label: "8月", value: 52 },
        { label: "9月", value: 48 },
        { label: "10月", value: 57 },
        { label: "11月", value: 51 },
        { label: "12月", value: 64 },
    ],
};

const dataCode = {
    en: `const data = [
    { label: "Jan", value: 24 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 36 },
    { label: "May", value: 32 },
    { label: "Jun", value: 44 },
    { label: "Jul", value: 39 },
    { label: "Aug", value: 52 },
    { label: "Sep", value: 48 },
    { label: "Oct", value: 57 },
    { label: "Nov", value: 51 },
    { label: "Dec", value: 64 },
];`,
    ja: `const data = [
    { label: "1月", value: 24 },
    { label: "2月", value: 28 },
    { label: "3月", value: 22 },
    { label: "4月", value: 36 },
    { label: "5月", value: 32 },
    { label: "6月", value: 44 },
    { label: "7月", value: 39 },
    { label: "8月", value: 52 },
    { label: "9月", value: 48 },
    { label: "10月", value: 57 },
    { label: "11月", value: 51 },
    { label: "12月", value: 64 },
];`,
} as const;

const code = { en: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

${dataCode.en}

<AnalyticsCard
    title="Revenue trend"
    description="Monthly recurring revenue"
    value="$128,430"
    delta="+12.4%"
    deltaDescription="Change compared with the previous period."
    trend="up"
>
    <SparklineChart
        data={data}
        variant="area"
        referenceValue={42}
        referenceLabel="Average"
        showDots
        aria-label="Revenue trend"
    />
</AnalyticsCard>;`, ja: `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

${dataCode.ja}

<AnalyticsCard
    title="売上トレンド"
    description="月次経常収益"
    value="$128,430"
    delta="+12.4%"
    deltaDescription="前期間との比較です。"
    trend="up"
>
    <SparklineChart
        data={data}
        variant="area"
        referenceValue={42}
        referenceLabel="平均"
        showDots
        aria-label="売上トレンド"
    />
</AnalyticsCard>;` } as const;
const usageCode = { en: `import { SparklineChart } from "@gunjo/ui";

${dataCode.en}

<SparklineChart data={data} />
<SparklineChart data={data} variant="area" color="success" />
<SparklineChart data={data} variant="step" referenceValue={50} referenceLabel="Target" />`, ja: `import { SparklineChart } from "@gunjo/ui";

${dataCode.ja}

<SparklineChart data={data} />
<SparklineChart data={data} variant="area" color="success" />
<SparklineChart data={data} variant="step" referenceValue={50} referenceLabel="目標" />` } as const;
const propsData = { en: [{ name: "data", type: "Array<number | { label?: ReactNode; value: number }>", description: "Numeric trend values rendered across the compact chart." }, { name: "variant", type: "\"line\" | \"area\" | \"step\"", default: "\"line\"", description: "Registered SSOT variant for the sparkline shape." }, { name: "referenceValue", type: "number", description: "Optional dashed reference line." }], ja: [{ name: "data", type: "Array<number | { label?: ReactNode; value: number }>", description: "コンパクトなチャート幅に表示する数値トレンドです。" }, { name: "variant", type: "\"line\" | \"area\" | \"step\"", default: "\"line\"", description: "線・面・ステップを切り替える SSOT 登録済みバリエーションです。" }, { name: "referenceValue", type: "number", description: "任意の点線基準値です。" }] } as const;
const states = { en: [{ key: "line", title: "Line", description: "Simple trend line for dense cards.", preview: <SparklineChart data={dataByLocale.en} />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<SparklineChart data={data} />` }, { key: "area", title: "Area", description: "Adds fill for stronger trend emphasis.", preview: <SparklineChart data={dataByLocale.en} variant="area" color="success" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<SparklineChart data={data} variant="area" color="success" />` }, { key: "step", title: "Step", description: "Shows discrete changes such as stages or thresholds.", preview: <SparklineChart data={dataByLocale.en} variant="step" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<SparklineChart data={data} variant="step" />` }, { key: "reference", title: "Reference", description: "Displays the target or average line.", preview: <SparklineChart data={dataByLocale.en} variant="area" referenceValue={42} referenceLabel="Average" showDots />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<SparklineChart data={data} variant="area" referenceValue={42} referenceLabel="Average" showDots />` }], ja: [{ key: "line", title: "線表示", description: "密度の高いカードで使うシンプルな傾向線です。", preview: <SparklineChart data={dataByLocale.ja} />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<SparklineChart data={data} />` }, { key: "area", title: "面表示", description: "塗りを加えて傾向を強調します。", preview: <SparklineChart data={dataByLocale.ja} variant="area" color="success" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<SparklineChart data={data} variant="area" color="success" />` }, { key: "step", title: "ステップ", description: "段階的な変化やしきい値の推移に使います。", preview: <SparklineChart data={dataByLocale.ja} variant="step" />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<SparklineChart data={data} variant="step" />` }, { key: "reference", title: "基準線", description: "目標値や平均値を点線で表示します。", preview: <SparklineChart data={dataByLocale.ja} variant="area" referenceValue={42} referenceLabel="平均" showDots />, previewBodyWidth: "md", code: `import { SparklineChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<SparklineChart data={data} variant="area" referenceValue={42} referenceLabel="平均" showDots />` }] } as const;

export default function SparklineChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.sparklineChart.title, ja: "スパークライン" }} description={{ en: meta.sparklineChart.description, ja: "カード内の小さな領域で傾向を示す線・面・ステップチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="sparkline-chart" embedBase="/embed/sparkline-chart" previewHeight={360} states={states} usedComponents={{ en: [{ name: "SparklineChart", href: "/docs/components/sparkline-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "スパークライン", href: "/docs/components/sparkline-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{ name: "LineChart", href: "/docs/components/line-chart" }, { name: "AnalyticsCard", href: "/docs/components/analytics-card" }], ja: [{ name: "折れ線チャート", href: "/docs/components/line-chart" }, { name: "分析カード", href: "/docs/components/analytics-card" }] }} />;
}
