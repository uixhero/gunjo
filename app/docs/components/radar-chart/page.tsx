"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { ChartLegend, RadarChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof RadarChart>["data"][number];
const dataByLocale: Record<Locale, DataItem[]> = { en: [{ label: "Reach", value: 72 }, { label: "Quality", value: 84 }, { label: "Revenue", value: 58 }, { label: "Retention", value: 76 }, { label: "Speed", value: 64 }, { label: "Risk", value: 42 }], ja: [{ label: "到達", value: 72 }, { label: "品質", value: 84 }, { label: "売上", value: 58 }, { label: "継続", value: 76 }, { label: "速度", value: 64 }, { label: "リスク", value: 42 }] };
const growthDataByLocale: Record<Locale, { current: DataItem[]; target: DataItem[] }> = {
    en: {
        current: [{ label: "STR", value: 42 }, { label: "DEX", value: 58 }, { label: "INT", value: 36 }, { label: "VIT", value: 50 }, { label: "AGI", value: 62 }, { label: "LUK", value: 28 }],
        target: [{ label: "STR", value: 76 }, { label: "DEX", value: 70 }, { label: "INT", value: 54 }, { label: "VIT", value: 68 }, { label: "AGI", value: 82 }, { label: "LUK", value: 46 }],
    },
    ja: {
        current: [{ label: "STR", value: 42 }, { label: "DEX", value: 58 }, { label: "INT", value: 36 }, { label: "VIT", value: 50 }, { label: "AGI", value: 62 }, { label: "LUK", value: 28 }],
        target: [{ label: "STR", value: 76 }, { label: "DEX", value: 70 }, { label: "INT", value: 54 }, { label: "VIT", value: 68 }, { label: "AGI", value: 82 }, { label: "LUK", value: 46 }],
    },
};

const dataCode = {
    en: `const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];`,
    ja: `const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];`,
} as const;
const growthCode = {
    en: `const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "As-is", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "To-be", data: targetData, color: "success", fillOpacity: 0.14 },
];`,
    ja: `const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "現在", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "成長後", data: targetData, color: "success", fillOpacity: 0.14 },
];`,
} as const;

const code = { en: `import { RadarChart } from "@gunjo/ui";

${dataCode.en}

<RadarChart data={data} max={100} formatValue={(value) => value + "%"} maxLabel="Max" />`, ja: `import { RadarChart } from "@gunjo/ui";

${dataCode.ja}

<RadarChart data={data} max={100} formatValue={(value) => value + "%"} maxLabel="最大" />` } as const;
const usageCode = { en: `${dataCode.en}

<RadarChart data={data} max={100} />
<RadarChart data={data} variant="compact" showLabels={false} />
<RadarChart data={data} color="success" fillOpacity={0.12} />

${growthCode.en}

<RadarChart data={currentData} series={series} max={100} />`, ja: `${dataCode.ja}

<RadarChart data={data} max={100} />
<RadarChart data={data} variant="compact" showLabels={false} />
<RadarChart data={data} color="success" fillOpacity={0.12} />

${growthCode.ja}

<RadarChart data={currentData} series={series} max={100} />` } as const;
const propsData = { en: [{"name":"data","type":"ChartDataPoint[]","description":"Single-series values rendered as a normalized radar polygon."},{"name":"series","type":"RadarChartSeries[]","description":"Multiple radar polygons for comparing current and target values."},{"name":"variant","type":"\"default\" | \"compact\"","description":"Registered SSOT variant for chart size.","default":"\"default\""},{"name":"showGrid / showLabels","type":"boolean","description":"Controls grid rings and axis labels."}], ja: [{"name":"data","type":"ChartDataPoint[]","description":"単一系列として正規化した多角形で表示する値です。"},{"name":"series","type":"RadarChartSeries[]","description":"現在値と目標値など、複数のレーダー面を重ねて比較します。"},{"name":"variant","type":"\"default\" | \"compact\"","description":"チャートサイズを切り替える SSOT 登録済みバリエーションです。","default":"\"default\""},{"name":"showGrid / showLabels","type":"boolean","description":"グリッドリングと軸ラベルの表示を切り替えます。"}] } as const;
const states = {
    en: [
        {
            key: "default",
            title: "Default",
            description: "Standard radar with labels and grid.",
            preview: <RadarChart data={dataByLocale.en} max={100} />,
            previewBodyWidth: "md",
            code: `${dataCode.en}\n\n<RadarChart data={data} max={100} />`,
        },
        {
            key: "growth",
            title: "As-is / To-be",
            description: "Compares current skill values with the expected growth after training.",
            preview: (
                <div className="w-full max-w-md space-y-3">
                    <RadarChart
                        data={growthDataByLocale.en.current}
                        series={[
                            { label: "As-is", data: growthDataByLocale.en.current, color: "muted", fillOpacity: 0.08 },
                            { label: "To-be", data: growthDataByLocale.en.target, color: "success", fillOpacity: 0.14 },
                        ]}
                        max={100}
                        formatValue={(value) => `${value}%`}
                        maxLabel="Max"
                    />
                    <ChartLegend
                        className="justify-center"
                        items={[
                            { label: "As-is", value: "46%", color: "muted" },
                            { label: "To-be", value: "66%", color: "success" },
                        ]}
                    />
                </div>
            ),
            previewBodyWidth: "md",
            code: `${growthCode.en}\n\n<RadarChart data={currentData} series={series} max={100} formatValue={(value) => value + \"%\"} maxLabel=\"Max\" />\n<ChartLegend className=\"justify-center\" items={[{ label: \"As-is\", value: \"46%\", color: \"muted\" }, { label: \"To-be\", value: \"66%\", color: \"success\" }]} />`,
        },
        {
            key: "compact",
            title: "Compact",
            description: "Compact variant without axis labels.",
            preview: <RadarChart data={dataByLocale.en} variant="compact" showLabels={false} />,
            previewBodyWidth: "sm",
            code: `${dataCode.en}\n\n<RadarChart data={data} variant="compact" showLabels={false} />`,
        },
        {
            key: "success",
            title: "Success color",
            description: "Uses another chart color token.",
            preview: <RadarChart data={dataByLocale.en} color="success" fillOpacity={0.12} />,
            previewBodyWidth: "md",
            code: `${dataCode.en}\n\n<RadarChart data={data} color="success" fillOpacity={0.12} />`,
        },
        {
            key: "minimal",
            title: "Minimal",
            description: "Hides grid rings for dense panels.",
            preview: <RadarChart data={dataByLocale.en} showGrid={false} showDots={false} />,
            previewBodyWidth: "md",
            code: `${dataCode.en}\n\n<RadarChart data={data} showGrid={false} showDots={false} />`,
        },
    ],
    ja: [
        {
            key: "default",
            title: "標準表示",
            description: "ラベルとグリッドを含む標準表示です。",
            preview: <RadarChart data={dataByLocale.ja} max={100} />,
            previewBodyWidth: "md",
            code: `${dataCode.ja}\n\n<RadarChart data={data} max={100} />`,
        },
        {
            key: "growth",
            title: "現在と成長後",
            description: "スキルの現在値と、育成後に伸びる想定値を比較します。",
            preview: (
                <div className="w-full max-w-md space-y-3">
                    <RadarChart
                        data={growthDataByLocale.ja.current}
                        series={[
                            { label: "現在", data: growthDataByLocale.ja.current, color: "muted", fillOpacity: 0.08 },
                            { label: "成長後", data: growthDataByLocale.ja.target, color: "success", fillOpacity: 0.14 },
                        ]}
                        max={100}
                        formatValue={(value) => `${value}%`}
                        maxLabel="最大"
                    />
                    <ChartLegend
                        className="justify-center"
                        items={[
                            { label: "現在", value: "46%", color: "muted" },
                            { label: "成長後", value: "66%", color: "success" },
                        ]}
                    />
                </div>
            ),
            previewBodyWidth: "md",
            code: `${growthCode.ja}\n\n<RadarChart data={currentData} series={series} max={100} formatValue={(value) => value + \"%\"} maxLabel=\"最大\" />\n<ChartLegend className=\"justify-center\" items={[{ label: \"現在\", value: \"46%\", color: \"muted\" }, { label: \"成長後\", value: \"66%\", color: \"success\" }]} />`,
        },
        {
            key: "compact",
            title: "コンパクト",
            description: "軸ラベルを省いたコンパクト表示です。",
            preview: <RadarChart data={dataByLocale.ja} variant="compact" showLabels={false} />,
            previewBodyWidth: "sm",
            code: `${dataCode.ja}\n\n<RadarChart data={data} variant="compact" showLabels={false} />`,
        },
        {
            key: "success",
            title: "別カラー",
            description: "別のチャート色トークンで表示します。",
            preview: <RadarChart data={dataByLocale.ja} color="success" fillOpacity={0.12} />,
            previewBodyWidth: "md",
            code: `${dataCode.ja}\n\n<RadarChart data={data} color="success" fillOpacity={0.12} />`,
        },
        {
            key: "minimal",
            title: "最小表示",
            description: "密度の高いパネル向けにグリッドを非表示にします。",
            preview: <RadarChart data={dataByLocale.ja} showGrid={false} showDots={false} />,
            previewBodyWidth: "md",
            code: `${dataCode.ja}\n\n<RadarChart data={data} showGrid={false} showDots={false} />`,
        },
    ],
} as const;

export default function RadarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.radarChart.title, ja: "レーダーチャート" }} description={{ en: meta.radarChart.description, ja: "複数軸の正規化スコアを多角形で比較するレーダーチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="radar-chart" embedBase="/embed/radar-chart" previewHeight={460} states={states} usedComponents={{ en: [{ name: "RadarChart", href: "/docs/components/radar-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "レーダーチャート", href: "/docs/components/radar-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"RadialBarChart","href":"/docs/components/radial-bar-chart"},{"name":"QuadrantMatrix","href":"/docs/components/quadrant-matrix"}], ja: [{"name":"ラジアルバーチャート","href":"/docs/components/radial-bar-chart"},{"name":"4象限マトリクス","href":"/docs/components/quadrant-matrix"}] }} />;
}
