"use client";

import type { ComponentProps } from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { DistributionBar } from "@gunjo/ui";

type DistributionSegment = ComponentProps<typeof DistributionBar>["segments"][number];

const channelSegmentsByLocale: Record<"en" | "ja", DistributionSegment[]> = {
    en: [
        { label: "Organic", value: 46, color: "primary" },
        { label: "Referral", value: 28, color: "success" },
        { label: "Direct", value: 18, color: "warning" },
        { label: "Paid", value: 8, color: "info" },
    ],
    ja: [
        { label: "自然流入", value: 46, color: "primary" },
        { label: "紹介", value: 28, color: "success" },
        { label: "直接", value: 18, color: "warning" },
        { label: "広告", value: 8, color: "info" },
    ],
};

const allocationSegmentsByLocale: Record<"en" | "ja", DistributionSegment[]> = {
    en: [
        { label: "Product", value: 132000, color: "primary" },
        { label: "Operations", value: 84000, color: "info" },
        { label: "Support", value: 41000, color: "success" },
        { label: "Reserve", value: 18000, color: "warning" },
    ],
    ja: [
        { label: "プロダクト", value: 132000, color: "primary" },
        { label: "運用", value: 84000, color: "info" },
        { label: "サポート", value: 41000, color: "success" },
        { label: "予備", value: 18000, color: "warning" },
    ],
};

const denseSegmentsByLocale: Record<"en" | "ja", DistributionSegment[]> = {
    en: [
        { label: "Search", value: 34, color: "primary" },
        { label: "Social", value: 22, color: "info" },
        { label: "Email", value: 16, color: "success" },
        { label: "Ads", value: 12, color: "warning" },
        { label: "Partner", value: 9, color: "accent" },
        { label: "Other", value: 7, color: "muted" },
    ],
    ja: [
        { label: "検索", value: 34, color: "primary" },
        { label: "SNS", value: 22, color: "info" },
        { label: "メール", value: 16, color: "success" },
        { label: "広告", value: 12, color: "warning" },
        { label: "提携", value: 9, color: "accent" },
        { label: "その他", value: 7, color: "muted" },
    ],
};

const smallSegmentsByLocale: Record<"en" | "ja", DistributionSegment[]> = {
    en: [
        { label: "Complete", value: 92, color: "success" },
        { label: "Review", value: 5, color: "warning" },
        { label: "Blocked", value: 2, color: "destructive" },
        { label: "Unassigned", value: 1, color: "muted" },
    ],
    ja: [
        { label: "完了", value: 92, color: "success" },
        { label: "確認中", value: 5, color: "warning" },
        { label: "停止中", value: 2, color: "destructive" },
        { label: "未割当", value: 1, color: "muted" },
    ],
};

const codeByLocale = {
    en: `import { DistributionBar } from "@gunjo/ui";

const segments = [
    { label: "Organic", value: 46, color: "primary" },
    { label: "Referral", value: 28, color: "success" },
    { label: "Direct", value: 18, color: "warning" },
    { label: "Paid", value: 8, color: "info" },
];

export function ChannelMix() {
    return <DistributionBar segments={segments} totalLabel="Total" showLegend />;
}`,
    ja: `import { DistributionBar } from "@gunjo/ui";

const segments = [
    { label: "自然流入", value: 46, color: "primary" },
    { label: "紹介", value: 28, color: "success" },
    { label: "直接", value: 18, color: "warning" },
    { label: "広告", value: 8, color: "info" },
];

export function ChannelMix() {
    return <DistributionBar segments={segments} totalLabel="合計" showLegend />;
}`,
} as const;

const usageCodeByLocale = {
    en: `import { DistributionBar } from "@gunjo/ui";

const segments = [
    { label: "Organic", value: 46, color: "primary" },
    { label: "Referral", value: 28, color: "success" },
    { label: "Direct", value: 18, color: "warning" },
    { label: "Ads", value: 8, color: "info" },
];

<DistributionBar segments={segments} />
<DistributionBar segments={segments} totalLabel="Total" showLegend />
<DistributionBar segments={segments} formatValue={(value) => \`$\${value.toLocaleString()}\`} />`,
    ja: `import { DistributionBar } from "@gunjo/ui";

const segments = [
    { label: "自然流入", value: 46, color: "primary" },
    { label: "紹介", value: 28, color: "success" },
    { label: "直接", value: 18, color: "warning" },
    { label: "広告", value: 8, color: "info" },
];

<DistributionBar segments={segments} />
<DistributionBar segments={segments} totalLabel="合計" showLegend />
<DistributionBar segments={segments} formatValue={(value) => \`\${value.toLocaleString()}円\`} />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `const segments = [
  { label: "Organic", value: 46, color: "primary" },
  { label: "Referral", value: 28, color: "success" },
  { label: "Direct", value: 18, color: "warning" },
  { label: "Paid", value: 8, color: "info" },
];

<DistributionBar segments={segments} totalLabel="Total" />`,
        legend: `const segments = [
  { label: "Organic", value: 46, color: "primary" },
  { label: "Referral", value: 28, color: "success" },
  { label: "Direct", value: 18, color: "warning" },
  { label: "Paid", value: 8, color: "info" },
];

<DistributionBar segments={segments} totalLabel="Total" showLegend />`,
        formatted: `const segments = [
  { label: "Product", value: 132000, color: "primary" },
  { label: "Operations", value: 84000, color: "info" },
  { label: "Support", value: 41000, color: "success" },
  { label: "Reserve", value: 18000, color: "warning" },
];

<DistributionBar
  segments={segments}
  totalLabel="Budget"
  showLegend
  formatValue={(value) => \`$\${value.toLocaleString()}\`}
/>`,
        dense: `const segments = [
  { label: "Search", value: 34, color: "primary" },
  { label: "Social", value: 22, color: "info" },
  { label: "Email", value: 16, color: "success" },
  { label: "Ads", value: 12, color: "warning" },
  { label: "Partner", value: 9, color: "accent" },
  { label: "Other", value: 7, color: "muted" },
];

<DistributionBar segments={segments} totalLabel="Share" showLegend />`,
        small: `const segments = [
  { label: "Complete", value: 92, color: "success" },
  { label: "Review", value: 5, color: "warning" },
  { label: "Blocked", value: 2, color: "destructive" },
  { label: "Unassigned", value: 1, color: "muted" },
];

<DistributionBar segments={segments} totalLabel="Items" showLegend />`,
    },
    ja: {
        default: `const segments = [
  { label: "自然流入", value: 46, color: "primary" },
  { label: "紹介", value: 28, color: "success" },
  { label: "直接", value: 18, color: "warning" },
  { label: "広告", value: 8, color: "info" },
];

<DistributionBar segments={segments} totalLabel="合計" />`,
        legend: `const segments = [
  { label: "自然流入", value: 46, color: "primary" },
  { label: "紹介", value: 28, color: "success" },
  { label: "直接", value: 18, color: "warning" },
  { label: "広告", value: 8, color: "info" },
];

<DistributionBar segments={segments} totalLabel="合計" showLegend />`,
        formatted: `const segments = [
  { label: "プロダクト", value: 132000, color: "primary" },
  { label: "運用", value: 84000, color: "info" },
  { label: "サポート", value: 41000, color: "success" },
  { label: "予備", value: 18000, color: "warning" },
];

<DistributionBar
  segments={segments}
  totalLabel="予算"
  showLegend
  formatValue={(value) => \`\${value.toLocaleString()}円\`}
/>`,
        dense: `const segments = [
  { label: "検索", value: 34, color: "primary" },
  { label: "SNS", value: 22, color: "info" },
  { label: "メール", value: 16, color: "success" },
  { label: "広告", value: 12, color: "warning" },
  { label: "提携", value: 9, color: "accent" },
  { label: "その他", value: 7, color: "muted" },
];

<DistributionBar segments={segments} totalLabel="構成比" showLegend />`,
        small: `const segments = [
  { label: "完了", value: 92, color: "success" },
  { label: "確認中", value: 5, color: "warning" },
  { label: "停止中", value: 2, color: "destructive" },
  { label: "未割当", value: 1, color: "muted" },
];

<DistributionBar segments={segments} totalLabel="項目数" showLegend />`,
    },
} as const;

const propsDataByLocale = {
    en: [
    {
        name: "segments",
        type: "{ label?: ReactNode; value: number; color?: ChartColor }[]",
        description: "Segments normalized into a stacked percentage bar.",
    },
    {
        name: "showLegend",
        type: "boolean",
        default: "false",
        description: "Renders a ChartLegend below the bar.",
    },
    {
        name: "formatValue",
        type: "(value: number) => ReactNode",
        description: "Formats raw segment values shown in tooltips and legend descriptions.",
    },
    {
        name: "totalLabel",
        type: "ReactNode",
        default: "\"Total\"",
        description: "Label used in legend tooltips for the raw segment value.",
    },
    ],
    ja: [
        { name: "segments", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "積み上げ割合バーに正規化して表示するセグメントです。" },
        { name: "showLegend", type: "boolean", default: "false", description: "バーの下にチャート凡例を表示します。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "ツールチップと凡例説明に表示する生のセグメント値を整形します。" },
        { name: "totalLabel", type: "ReactNode", default: "\"Total\"", description: "凡例ツールチップで生のセグメント値の前に表示するラベルです。" },
    ],
} as const;

export default function DistributionBarPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];
    const channelSegments = channelSegmentsByLocale[locale];
    const allocationSegments = allocationSegmentsByLocale[locale];
    const denseSegments = denseSegmentsByLocale[locale];
    const smallSegments = smallSegmentsByLocale[locale];

    return (
        <ComponentLayout
            title={locale === "ja" ? "分布バー" : meta.distributionBar.title}
            description={meta.distributionBar.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: locale === "ja" ? "分布バー" : "DistributionBar", href: "/docs/components/distribution-bar" },
                { name: locale === "ja" ? "チャート凡例" : "ChartLegend", href: "/docs/components/chart-legend" },
                { name: locale === "ja" ? "ツールチップ" : "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: locale === "ja" ? "ドーナツチャート" : "DonutChart", href: "/docs/components/donut-chart" },
                { name: locale === "ja" ? "積み上げ棒チャート" : "StackedBarChart", href: "/docs/components/stacked-bar-chart" },
                { name: locale === "ja" ? "ミニ分布バーカード" : "MiniDistributionBarCard", href: "/docs/components/mini-distribution-bar-card" },
                { name: locale === "ja" ? "分析カード" : "AnalyticsCard", href: "/docs/components/analytics-card" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="distribution-bar"
                embedBase="/embed/distribution-bar"
                previewHeight={420}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "標準表示" : "Default",
                            description: locale === "ja"
                                ? "バー単体で構成比だけを示す、SSOT 登録済みの標準バリエーションです。"
                                : "The registered SSOT default variant for showing distribution share as a standalone bar.",
                            preview: (
                                <DistributionBar
                                    className="mx-auto max-w-xl"
                                    segments={channelSegments}
                                    totalLabel={locale === "ja" ? "合計" : "Total"}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: stateCodeByLocale[locale].default,
                        },
                        {
                            key: "legend",
                            title: locale === "ja" ? "凡例付き" : "With legend",
                            description: locale === "ja"
                                ? "セグメントのラベル、割合、元の値をバーの下で確認する状態です。"
                                : "Shows segment labels, percentages, and raw values below the bar.",
                            preview: (
                                <DistributionBar
                                    className="mx-auto max-w-xl"
                                    segments={channelSegments}
                                    totalLabel={locale === "ja" ? "合計" : "Total"}
                                    showLegend
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: stateCodeByLocale[locale].legend,
                        },
                        {
                            key: "formatted-values",
                            title: locale === "ja" ? "値の整形" : "Formatted values",
                            description: locale === "ja"
                                ? "割合は自動計算し、ツールチップや凡例に表示する元の値だけを整形します。"
                                : "Keeps percentages normalized while formatting raw values in tooltips and legend descriptions.",
                            preview: (
                                <DistributionBar
                                    className="mx-auto max-w-xl"
                                    segments={allocationSegments}
                                    totalLabel={locale === "ja" ? "予算" : "Budget"}
                                    showLegend
                                    formatValue={(value) =>
                                        locale === "ja"
                                            ? `${value.toLocaleString()}円`
                                            : `$${value.toLocaleString()}`
                                    }
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: stateCodeByLocale[locale].formatted,
                        },
                        {
                            key: "dense",
                            title: locale === "ja" ? "セグメント多め" : "Dense segments",
                            description: locale === "ja"
                                ? "6 区分程度の細かい構成比でも、バーと凡例を合わせて確認できます。"
                                : "Keeps a six-part distribution readable with the bar and legend together.",
                            preview: (
                                <DistributionBar
                                    className="mx-auto max-w-xl"
                                    segments={denseSegments}
                                    totalLabel={locale === "ja" ? "構成比" : "Share"}
                                    showLegend
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: stateCodeByLocale[locale].dense,
                        },
                        {
                            key: "small-segments",
                            title: locale === "ja" ? "小さいセグメント" : "Small segments",
                            description: locale === "ja"
                                ? "1〜5% 程度の小さい区分も、フォーカスとツールチップで確認できる状態です。"
                                : "Small one-to-five percent slices remain available through focus and tooltips.",
                            preview: (
                                <DistributionBar
                                    className="mx-auto max-w-xl"
                                    segments={smallSegments}
                                    totalLabel={locale === "ja" ? "項目数" : "Items"}
                                    showLegend
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: stateCodeByLocale[locale].small,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
