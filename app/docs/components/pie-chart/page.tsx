"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { PieChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof PieChart>["segments"][number];

const segmentsByLocale: Record<Locale, DataItem[]> = {
    en: [
        { label: "Core", value: 46, color: "primary" },
        { label: "Growth", value: 28, color: "success" },
        { label: "Retention", value: 18, color: "warning" },
        { label: "Expansion", value: 8, color: "info" },
    ],
    ja: [
        { label: "基盤", value: 46, color: "primary" },
        { label: "成長", value: 28, color: "success" },
        { label: "継続", value: 18, color: "warning" },
        { label: "拡張", value: 8, color: "info" },
    ],
};

const denseSegmentsByLocale: Record<Locale, DataItem[]> = {
    en: [
        { label: "Search", value: 34, color: "primary" },
        { label: "Social", value: 22, color: "info" },
        { label: "Email", value: 16, color: "success" },
        { label: "Ads", value: 12, color: "warning" },
        { label: "Other", value: 16, color: "muted" },
    ],
    ja: [
        { label: "検索", value: 34, color: "primary" },
        { label: "SNS", value: 22, color: "info" },
        { label: "メール", value: 16, color: "success" },
        { label: "広告", value: 12, color: "warning" },
        { label: "その他", value: 16, color: "muted" },
    ],
};

const segmentsCode = {
    en: `const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];`,
    ja: `const segments = [
    { label: "基盤", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];`,
} as const;

const denseSegmentsCode = {
    en: `const sourceSegments = [
    { label: "Search", value: 34, color: "primary" },
    { label: "Social", value: 22, color: "info" },
    { label: "Email", value: 16, color: "success" },
    { label: "Ads", value: 12, color: "warning" },
    { label: "Other", value: 16, color: "muted" },
];`,
    ja: `const sourceSegments = [
    { label: "検索", value: 34, color: "primary" },
    { label: "SNS", value: 22, color: "info" },
    { label: "メール", value: 16, color: "success" },
    { label: "広告", value: 12, color: "warning" },
    { label: "その他", value: 16, color: "muted" },
];`,
} as const;

const code = {
    en: `import { PieChart } from "@gunjo/ui";

${segmentsCode.en}

export function AudienceShare() {
    return <PieChart segments={segments} totalLabel="Total" showLegend />;
}`,
    ja: `import { PieChart } from "@gunjo/ui";

${segmentsCode.ja}

export function AudienceShare() {
    return <PieChart segments={segments} totalLabel="合計" showLegend />;
}`,
} as const;

const usageCode = {
    en: `import { PieChart } from "@gunjo/ui";

${segmentsCode.en}

<PieChart segments={segments} />
<PieChart segments={segments} showLegend totalLabel="Total" />
<PieChart segments={segments} variant="compact" showLegend />`,
    ja: `import { PieChart } from "@gunjo/ui";

${segmentsCode.ja}

<PieChart segments={segments} />
<PieChart segments={segments} showLegend totalLabel="合計" />
<PieChart segments={segments} variant="compact" showLegend />`,
} as const;

const propsData = {
    en: [
        { name: "segments", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "Proportional segments rendered with a conic gradient." },
        { name: "variant", type: "\"default\" | \"compact\"", default: "\"default\"", description: "Registered SSOT variant for chart size." },
        { name: "showLegend", type: "boolean", default: "false", description: "Renders a ChartLegend below the pie." },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "Formats each value. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting." },
        { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)" },
    ],
    ja: [
        { name: "segments", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "円全体の比率として表示するセグメントです。" },
        { name: "variant", type: "\"default\" | \"compact\"", default: "\"default\"", description: "チャートサイズを切り替える SSOT 登録済みバリエーションです。" },
        { name: "showLegend", type: "boolean", default: "false", description: "円グラフの下にチャート凡例を表示します。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "各値を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。" },
        { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)" },
    ],
} as const;

const states = {
    en: [
        {
            key: "default",
            title: "Default",
            description: "Standard proportional share display.",
            preview: <PieChart segments={segmentsByLocale.en} />,
            previewBodyWidth: "md",
            code: `${segmentsCode.en}

<PieChart segments={segments} />`,
        },
        {
            key: "legend",
            title: "With legend",
            description: "Adds labels and values below the pie.",
            preview: <PieChart segments={segmentsByLocale.en} showLegend totalLabel="Total" />,
            previewBodyWidth: "md",
            code: `${segmentsCode.en}

<PieChart segments={segments} showLegend totalLabel="Total" />`,
        },
        {
            key: "compact",
            title: "Compact",
            description: "Registered compact size for narrow panels.",
            preview: <PieChart segments={segmentsByLocale.en} variant="compact" showLegend />,
            previewBodyWidth: "sm",
            code: `${segmentsCode.en}

<PieChart segments={segments} variant="compact" showLegend />`,
        },
        {
            key: "dense",
            title: "Dense segments",
            description: "Checks readability with more segments.",
            preview: <PieChart segments={denseSegmentsByLocale.en} showLegend totalLabel="Sources" />,
            previewBodyWidth: "md",
            code: `${denseSegmentsCode.en}

<PieChart segments={sourceSegments} showLegend totalLabel="Sources" />`,
        },
    ],
    ja: [
        {
            key: "default",
            title: "標準表示",
            description: "構成比を標準サイズで表示します。",
            preview: <PieChart segments={segmentsByLocale.ja} />,
            previewBodyWidth: "md",
            code: `${segmentsCode.ja}

<PieChart segments={segments} />`,
        },
        {
            key: "legend",
            title: "凡例付き",
            description: "ラベルと値を円グラフ下で確認します。",
            preview: <PieChart segments={segmentsByLocale.ja} showLegend totalLabel="合計" />,
            previewBodyWidth: "md",
            code: `${segmentsCode.ja}

<PieChart segments={segments} showLegend totalLabel="合計" />`,
        },
        {
            key: "compact",
            title: "コンパクト",
            description: "狭い領域向けの SSOT 登録済みサイズです。",
            preview: <PieChart segments={segmentsByLocale.ja} variant="compact" showLegend />,
            previewBodyWidth: "sm",
            code: `${segmentsCode.ja}

<PieChart segments={segments} variant="compact" showLegend />`,
        },
        {
            key: "dense",
            title: "セグメント多め",
            description: "区分が多い時の見え方を確認します。",
            preview: <PieChart segments={denseSegmentsByLocale.ja} showLegend totalLabel="流入元" />,
            previewBodyWidth: "md",
            code: `${denseSegmentsCode.ja}

<PieChart segments={sourceSegments} showLegend totalLabel="流入元" />`,
        },
    ],
} as const;

export default function PieChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return (
        <ChartDocPage
            title={{ en: meta.pieChart.title, ja: "円グラフ" }}
            description={{ en: meta.pieChart.description, ja: "セグメントの構成比を円全体で比較するチャートです。" }}
            code={code}
            usageCode={usageCode}
            propsData={propsData}
            demo="pie-chart"
            embedBase="/embed/pie-chart"
            previewHeight={460}
            states={states}
            usedComponents={{
                en: [
                    { name: "PieChart", href: "/docs/components/pie-chart" },
                    { name: "ChartLegend", href: "/docs/components/chart-legend" },
                    { name: "Tooltip", href: "/docs/components/tooltip" },
                ],
                ja: [
                    { name: "円グラフ", href: "/docs/components/pie-chart" },
                    { name: "チャート凡例", href: "/docs/components/chart-legend" },
                    { name: "ツールチップ", href: "/docs/components/tooltip" },
                ],
            }}
            relatedComponents={{
                en: [
                    { name: "DonutChart", href: "/docs/components/donut-chart" },
                    { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                ],
                ja: [
                    { name: "ドーナツチャート", href: "/docs/components/donut-chart" },
                    { name: "分布バー", href: "/docs/components/distribution-bar" },
                ],
            }}
        />
    );
}
