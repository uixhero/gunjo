"use client";

import type { ComponentProps } from "react";
import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof StackedBarChart>["data"][number];

const dataByLocale: Record<Locale, DataItem[]> = {
    en: [
        {
            label: "Jan",
            segments: [
                { label: "Organic", value: 42, color: "primary" },
                { label: "Referral", value: 24, color: "success" },
                { label: "Paid", value: 18, color: "warning" },
            ],
        },
        {
            label: "Feb",
            segments: [
                { label: "Organic", value: 48, color: "primary" },
                { label: "Referral", value: 31, color: "success" },
                { label: "Paid", value: 16, color: "warning" },
            ],
        },
        {
            label: "Mar",
            segments: [
                { label: "Organic", value: 38, color: "primary" },
                { label: "Referral", value: 28, color: "success" },
                { label: "Paid", value: 26, color: "warning" },
            ],
        },
    ],
    ja: [
        {
            label: "1月",
            segments: [
                { label: "自然流入", value: 42, color: "primary" },
                { label: "紹介", value: 24, color: "success" },
                { label: "広告", value: 18, color: "warning" },
            ],
        },
        {
            label: "2月",
            segments: [
                { label: "自然流入", value: 48, color: "primary" },
                { label: "紹介", value: 31, color: "success" },
                { label: "広告", value: 16, color: "warning" },
            ],
        },
        {
            label: "3月",
            segments: [
                { label: "自然流入", value: 38, color: "primary" },
                { label: "紹介", value: 28, color: "success" },
                { label: "広告", value: 26, color: "warning" },
            ],
        },
    ],
};

const fiveBarDataByLocale: Record<Locale, DataItem[]> = {
    en: [
        ...dataByLocale.en,
        {
            label: "Apr",
            segments: [
                { label: "Organic", value: 52, color: "primary" },
                { label: "Referral", value: 35, color: "success" },
                { label: "Paid", value: 26, color: "warning" },
            ],
        },
        {
            label: "May",
            segments: [
                { label: "Organic", value: 45, color: "primary" },
                { label: "Referral", value: 30, color: "success" },
                { label: "Paid", value: 22, color: "warning" },
            ],
        },
    ],
    ja: [
        ...dataByLocale.ja,
        {
            label: "4月",
            segments: [
                { label: "自然流入", value: 52, color: "primary" },
                { label: "紹介", value: 35, color: "success" },
                { label: "広告", value: 26, color: "warning" },
            ],
        },
        {
            label: "5月",
            segments: [
                { label: "自然流入", value: 45, color: "primary" },
                { label: "紹介", value: 30, color: "success" },
                { label: "広告", value: 22, color: "warning" },
            ],
        },
    ],
};

const dataCode = {
    en: `const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];`,
    ja: `const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];`,
} as const;

const fiveBarDataCode = {
    en: `const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
    {
        label: "Apr",
        segments: [
            { label: "Organic", value: 52, color: "primary" },
            { label: "Referral", value: 35, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
    {
        label: "May",
        segments: [
            { label: "Organic", value: 45, color: "primary" },
            { label: "Referral", value: 30, color: "success" },
            { label: "Paid", value: 22, color: "warning" },
        ],
    },
];`,
    ja: `const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
    {
        label: "4月",
        segments: [
            { label: "自然流入", value: 52, color: "primary" },
            { label: "紹介", value: 35, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
    {
        label: "5月",
        segments: [
            { label: "自然流入", value: 45, color: "primary" },
            { label: "紹介", value: 30, color: "success" },
            { label: "広告", value: 22, color: "warning" },
        ],
    },
];`,
} as const;

const code = {
    en: `import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

${dataCode.en}

<AnalyticsCard
    title="Channel mix"
    description="Monthly revenue"
    value="271"
    delta="95 peak"
    trend="up"
>
    <StackedBarChart
        data={data}
        showLegend
        showValues
        totalLabel="Total"
        aria-label="Channel mix"
    />
</AnalyticsCard>;`,
    ja: `import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

${dataCode.ja}

<AnalyticsCard
    title="チャネル構成"
    description="月次売上"
    value="271"
    delta="95 ピーク"
    trend="up"
>
    <StackedBarChart
        data={data}
        showLegend
        showValues
        totalLabel="合計"
        aria-label="チャネル構成"
    />
</AnalyticsCard>;`,
} as const;

const usageCode = {
    en: `import { StackedBarChart } from "@gunjo/ui";

${dataCode.en}

<StackedBarChart data={data} />
<StackedBarChart data={data} showLegend showValues totalLabel="Total" />
<StackedBarChart data={data} variant="horizontal" normalize showLegend />`,
    ja: `import { StackedBarChart } from "@gunjo/ui";

${dataCode.ja}

<StackedBarChart data={data} />
<StackedBarChart data={data} showLegend showValues totalLabel="合計" />
<StackedBarChart data={data} variant="horizontal" normalize showLegend totalLabel="合計" />`,
} as const;

const propsData = {
    en: [
        {
            name: "data",
            type: "StackedBarChartGroup[]",
            description: "Groups and segment values rendered as stacked bars.",
        },
        {
            name: "variant",
            type: "\"vertical\" | \"horizontal\"",
            description: "Registered SSOT variant for chart orientation.",
            default: "\"vertical\"",
        },
        {
            name: "normalize",
            type: "boolean",
            description: "Normalizes each group to 100% for proportional comparison.",
            default: "false",
        },
    ],
    ja: [
        {
            name: "data",
            type: "StackedBarChartGroup[]",
            description: "積み上げ棒として表示するグループとセグメント値です。",
        },
        {
            name: "variant",
            type: "\"vertical\" | \"horizontal\"",
            description: "縦・横の向きを切り替える SSOT 登録済みバリエーションです。",
            default: "\"vertical\"",
        },
        {
            name: "normalize",
            type: "boolean",
            description: "各グループを 100% に正規化して比率比較します。",
            default: "false",
        },
    ],
} as const;

const states = {
    en: [
        {
            key: "vertical",
            title: "Vertical",
            description: "Default vertical stacked bars.",
            preview: <StackedBarChart data={dataByLocale.en} />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<StackedBarChart data={data} />`,
        },
        {
            key: "five-bars",
            title: "Five bars",
            description: "Checks spacing with five vertical groups.",
            preview: <StackedBarChart data={fiveBarDataByLocale.en} showValues />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${fiveBarDataCode.en}\n\n<StackedBarChart data={data} showValues />`,
        },
        {
            key: "legend",
            title: "Legend and values",
            description: "Shows totals and segment legend.",
            preview: <StackedBarChart data={dataByLocale.en} showLegend showValues totalLabel="Total" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<StackedBarChart data={data} showLegend showValues totalLabel="Total" />`,
        },
        {
            key: "horizontal",
            title: "Horizontal",
            description: "Registered horizontal variant for row comparison.",
            preview: <StackedBarChart data={dataByLocale.en} variant="horizontal" showValues />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<StackedBarChart data={data} variant="horizontal" showValues />`,
        },
        {
            key: "normalized",
            title: "Normalized",
            description: "Compares every group as a 100% composition.",
            preview: <StackedBarChart data={dataByLocale.en} variant="horizontal" normalize showLegend />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.en}\n\n<StackedBarChart data={data} variant="horizontal" normalize showLegend />`,
        },
    ],
    ja: [
        {
            key: "vertical",
            title: "縦棒",
            description: "標準の縦積み上げ棒です。",
            preview: <StackedBarChart data={dataByLocale.ja} totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<StackedBarChart data={data} totalLabel="合計" />`,
        },
        {
            key: "five-bars",
            title: "5本表示",
            description: "5つのグループで、棒の太さと間隔を確認します。",
            preview: <StackedBarChart data={fiveBarDataByLocale.ja} showValues totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${fiveBarDataCode.ja}\n\n<StackedBarChart data={data} showValues totalLabel="合計" />`,
        },
        {
            key: "legend",
            title: "凡例と値",
            description: "合計値とセグメント凡例を表示します。",
            preview: <StackedBarChart data={dataByLocale.ja} showLegend showValues totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<StackedBarChart data={data} showLegend showValues totalLabel="合計" />`,
        },
        {
            key: "horizontal",
            title: "横棒",
            description: "行ごとに比較しやすい横向きバリエーションです。",
            preview: <StackedBarChart data={dataByLocale.ja} variant="horizontal" showValues totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<StackedBarChart data={data} variant="horizontal" showValues totalLabel="合計" />`,
        },
        {
            key: "normalized",
            title: "正規化",
            description: "各グループを 100% にそろえて構成比を比較します。",
            preview: <StackedBarChart data={dataByLocale.ja} variant="horizontal" normalize showLegend totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";\n\n${dataCode.ja}\n\n<StackedBarChart data={data} variant="horizontal" normalize showLegend totalLabel="合計" />`,
        },
    ],
} as const;

export default function StackedBarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return (
        <ChartDocPage
            title={{ en: meta.stackedBarChart.title, ja: "積み上げ棒チャート" }}
            description={{
                en: meta.stackedBarChart.description,
                ja: "グループごとの内訳と合計を、縦または横の積み上げ棒で比較するチャートです。",
            }}
            code={code}
            usageCode={usageCode}
            propsData={propsData}
            demo="stacked-bar-chart"
            embedBase="/embed/stacked-bar-chart"
            previewHeight={620}
            states={states}
            usedComponents={{
                en: [
                    { name: "StackedBarChart", href: "/docs/components/stacked-bar-chart" },
                    { name: "ChartLegend", href: "/docs/components/chart-legend" },
                    { name: "Tooltip", href: "/docs/components/tooltip" },
                ],
                ja: [
                    { name: "積み上げ棒チャート", href: "/docs/components/stacked-bar-chart" },
                    { name: "チャート凡例", href: "/docs/components/chart-legend" },
                    { name: "ツールチップ", href: "/docs/components/tooltip" },
                ],
            }}
            relatedComponents={{
                en: [
                    { name: "BarChart", href: "/docs/components/bar-chart" },
                    { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                ],
                ja: [
                    { name: "棒グラフ", href: "/docs/components/bar-chart" },
                    { name: "分布バー", href: "/docs/components/distribution-bar" },
                ],
            }}
        />
    );
}
