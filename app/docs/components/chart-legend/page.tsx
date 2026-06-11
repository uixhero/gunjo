"use client";

import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { ChartLegend } from "@gunjo/ui";

const channelItems = [
    { label: "自然流入", value: "46%", color: "primary", description: "合計: 12,400" },
    { label: "紹介", value: "28%", color: "success", description: "合計: 7,560" },
    { label: "直接", value: "18%", color: "warning", description: "合計: 4,860" },
];

const statusItems = [
    { label: "完了", value: "128", color: "success", description: "公開済みの項目です。" },
    { label: "進行中", value: "36", color: "info", description: "作業中の項目です。" },
    { label: "確認待ち", value: "14", color: "warning", description: "レビュー待ちの項目です。" },
    { label: "差し戻し", value: "5", color: "destructive", description: "修正が必要な項目です。" },
];

const labelOnlyItems = [
    { label: "検索", color: "primary" },
    { label: "SNS", color: "info" },
    { label: "広告", color: "warning" },
    { label: "メール", color: "success" },
    { label: "その他", color: "muted" },
];

const codeByLocale = {
    en: `import { ChartLegend } from "@gunjo/ui";

const items = [
    { label: "Organic", value: "46%", color: "primary", description: "Total: 12,400" },
    { label: "Referral", value: "28%", color: "success", description: "Total: 7,560" },
    { label: "Direct", value: "18%", color: "warning", description: "Total: 4,860" },
];

export function Legend() {
    return <ChartLegend items={items} />;
}`,
    ja: `import { ChartLegend } from "@gunjo/ui";

const items = [
    { label: "自然流入", value: "46%", color: "primary", description: "合計: 12,400" },
    { label: "紹介", value: "28%", color: "success", description: "合計: 7,560" },
    { label: "直接", value: "18%", color: "warning", description: "合計: 4,860" },
];

export function Legend() {
    return <ChartLegend items={items} />;
}`,
} as const;

const usageCodeByLocale = {
    en: `import { ChartLegend } from "@gunjo/ui";

const items = [
    { label: "Organic", value: "46%", color: "primary", description: "Total: 12,400" },
    { label: "Referral", value: "28%", color: "success", description: "Total: 7,560" },
    { label: "Direct", value: "18%", color: "warning", description: "Total: 4,860" },
];

const itemsWithoutValues = [
    { label: "Search", color: "primary" },
    { label: "Social", color: "info" },
    { label: "Ads", color: "warning" },
];

<ChartLegend items={items} />
<ChartLegend items={items} variant="vertical" />
<ChartLegend items={itemsWithoutValues} />`,
    ja: `import { ChartLegend } from "@gunjo/ui";

const items = [
    { label: "自然流入", value: "46%", color: "primary", description: "合計: 12,400" },
    { label: "紹介", value: "28%", color: "success", description: "合計: 7,560" },
    { label: "直接", value: "18%", color: "warning", description: "合計: 4,860" },
];

const itemsWithoutValues = [
    { label: "検索", color: "primary" },
    { label: "SNS", color: "info" },
    { label: "広告", color: "warning" },
];

<ChartLegend items={items} />
<ChartLegend items={items} variant="vertical" />
<ChartLegend items={itemsWithoutValues} />`,
} as const;

const stateCodeByLocale = {
    en: {
        horizontal: `const items = [
  { label: "Organic", value: "46%", color: "primary", description: "Total: 12,400" },
  { label: "Referral", value: "28%", color: "success", description: "Total: 7,560" },
  { label: "Direct", value: "18%", color: "warning", description: "Total: 4,860" },
];

<ChartLegend items={items} />`,
        vertical: `const items = [
  { label: "Complete", value: "128", color: "success", description: "Published items." },
  { label: "In progress", value: "36", color: "info", description: "Items currently in progress." },
  { label: "Review", value: "14", color: "warning", description: "Items waiting for review." },
  { label: "Returned", value: "5", color: "destructive", description: "Items that need changes." },
];

<ChartLegend items={items} variant="vertical" />`,
        labelOnly: `const items = [
  { label: "Search", color: "primary" },
  { label: "Social", color: "info" },
  { label: "Ads", color: "warning" },
  { label: "Email", color: "success" },
  { label: "Other", color: "muted" },
];

<ChartLegend items={items} />`,
        constrained: `const items = [
  { label: "Organic", value: "46%", color: "primary", description: "Total: 12,400" },
  { label: "Referral", value: "28%", color: "success", description: "Total: 7,560" },
  { label: "Direct", value: "18%", color: "warning", description: "Total: 4,860" },
];

<ChartLegend items={items} className="max-w-xs" />`,
    },
    ja: {
        horizontal: `const items = [
  { label: "自然流入", value: "46%", color: "primary", description: "合計: 12,400" },
  { label: "紹介", value: "28%", color: "success", description: "合計: 7,560" },
  { label: "直接", value: "18%", color: "warning", description: "合計: 4,860" },
];

<ChartLegend items={items} />`,
        vertical: `const items = [
  { label: "完了", value: "128", color: "success", description: "公開済みの項目です。" },
  { label: "進行中", value: "36", color: "info", description: "作業中の項目です。" },
  { label: "確認待ち", value: "14", color: "warning", description: "レビュー待ちの項目です。" },
  { label: "差し戻し", value: "5", color: "destructive", description: "修正が必要な項目です。" },
];

<ChartLegend items={items} variant="vertical" />`,
        labelOnly: `const items = [
  { label: "検索", color: "primary" },
  { label: "SNS", color: "info" },
  { label: "広告", color: "warning" },
  { label: "メール", color: "success" },
  { label: "その他", color: "muted" },
];

<ChartLegend items={items} />`,
        constrained: `const items = [
  { label: "自然流入", value: "46%", color: "primary", description: "合計: 12,400" },
  { label: "紹介", value: "28%", color: "success", description: "合計: 7,560" },
  { label: "直接", value: "18%", color: "warning", description: "合計: 4,860" },
];

<ChartLegend items={items} className="max-w-xs" />`,
    },
} as const;

const propsDataByLocale = {
    en: [
        {
            name: "items",
            type: "{ label: ReactNode; value?: ReactNode; color?: ChartColor; description?: ReactNode }[]",
            description: "Legend rows for chart series or distribution segments. Description is exposed through tooltip and accessibility text.",
        },
        {
            name: "variant",
            type: "\"horizontal\" | \"vertical\"",
            default: "\"horizontal\"",
            description: "Registered SSOT variant for legend layout.",
        },
    ],
    ja: [
        { name: "items", type: "{ label: ReactNode; value?: ReactNode; color?: ChartColor; description?: ReactNode }[]", description: "チャート系列や分布セグメントに対応する凡例行です。description はツールチップとアクセシブルテキストに使われます。" },
        { name: "variant", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "凡例の並び方を切り替える SSOT 登録済みバリアントです。" },
    ],
} as const;

export default function ChartLegendPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={meta.chartLegend.title}
            description={meta.chartLegend.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ChartLegend", href: "/docs/components/chart-legend" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "DonutChart", href: "/docs/components/donut-chart" },
                { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                { name: "StackedBarChart", href: "/docs/components/stacked-bar-chart" },
                { name: "PieChart", href: "/docs/components/pie-chart" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="chart-legend"
                embedBase="/embed/chart-legend"
                previewHeight={420}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "横並び" : "Horizontal",
                            description: locale === "ja"
                                ? "チャート下やカード内で複数系列を横に並べる標準の SSOT variant です。"
                                : "The default registered SSOT variant for placing multiple series below a chart or inside a card.",
                            preview: <ChartLegend items={channelItems} />,
                            code: stateCodeByLocale[locale].horizontal,
                        },
                        {
                            key: "vertical",
                            title: locale === "ja" ? "縦並び" : "Vertical",
                            description: locale === "ja"
                                ? "値を右端にそろえて、状態別の内訳を読みやすくする SSOT variant です。"
                                : "A registered SSOT variant that aligns values to the edge for readable status breakdowns.",
                            preview: <ChartLegend items={statusItems} variant="vertical" className="max-w-sm" />,
                            code: stateCodeByLocale[locale].vertical,
                        },
                        {
                            key: "label-only",
                            title: locale === "ja" ? "値なし" : "Without values",
                            description: locale === "ja"
                                ? "色と系列名だけを示し、数値はチャート側で読ませる状態です。"
                                : "Shows color and series labels only, leaving exact values in the chart itself.",
                            preview: <ChartLegend items={labelOnlyItems} />,
                            code: stateCodeByLocale[locale].labelOnly,
                        },
                        {
                            key: "constrained",
                            title: locale === "ja" ? "幅が狭い領域" : "Constrained width",
                            description: locale === "ja"
                                ? "横並び variant は狭い領域では折り返して、凡例がプレビュー外へはみ出さないようにします。"
                                : "The horizontal variant wraps in narrow spaces so legend items do not overflow the preview.",
                            preview: <ChartLegend items={channelItems} className="max-w-xs" />,
                            code: stateCodeByLocale[locale].constrained,
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
