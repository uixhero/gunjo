"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { BarChart } from "@gunjo/ui";

const weeklyData = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
    { label: "金", value: 54, color: "primary" },
];

const channelData = [
    { label: "検索", value: 74, color: "primary" },
    { label: "SNS", value: 48, color: "info" },
    { label: "広告", value: 62, color: "warning" },
    { label: "紹介", value: 31, color: "success" },
];

// Editable threshold demo: drag the limit and watch bars cross it turn destructive. (#285)
function ThresholdBarDemo({ locale }: { locale: "ja" | "en" }) {
    const isJa = locale === "ja";
    const [threshold, setThreshold] = React.useState(55);
    const data = [
        { label: isJa ? "A棟" : "A", value: 42, color: "primary" as const },
        { label: isJa ? "B棟" : "B", value: 68, color: "primary" as const },
        { label: isJa ? "C棟" : "C", value: 51, color: "primary" as const },
        { label: isJa ? "D棟" : "D", value: 73, color: "primary" as const },
        { label: isJa ? "E棟" : "E", value: 38, color: "primary" as const },
    ];
    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <BarChart data={data} threshold={threshold} thresholdLabel={isJa ? "上限" : "Limit"} showValues />
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="shrink-0">{isJa ? "上限" : "Limit"}</span>
                <span className="w-8 shrink-0 font-medium tabular-nums text-foreground">{threshold}</span>
                <input
                    type="range"
                    min={20}
                    max={90}
                    value={threshold}
                    onChange={(event) => setThreshold(Number(event.target.value))}
                    className="min-w-0 flex-1"
                    aria-label={isJa ? "上限を調整" : "Adjust the limit"}
                />
            </label>
        </div>
    );
}

const codeByLocale = {
    en: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
];

export function WeeklyActivity() {
    return <BarChart data={data} averageValue={50} averageLabel="Average" />;
}`,
    ja: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
];

export function WeeklyActivity() {
    return <BarChart data={data} averageValue={50} averageLabel="平均" />;
}`,
} as const;

const usageCodeByLocale = {
    en: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
];

<BarChart data={data} />
<BarChart data={data} variant="horizontal" showValues />
<BarChart data={data} averageValue={50} averageLabel="Average" />
<BarChart data={data} showGrid={false} showLabels={false} />`,
    ja: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
];

<BarChart data={data} />
<BarChart data={data} variant="horizontal" showValues />
<BarChart data={data} averageValue={50} averageLabel="平均" />
<BarChart data={data} showGrid={false} showLabels={false} />`,
} as const;

const stateCodeByLocale = {
    en: {
        vertical: `const data = [
  { label: "Mon", value: 42, color: "primary" },
  { label: "Tue", value: 58, color: "success" },
  { label: "Wed", value: 36, color: "warning" },
  { label: "Thu", value: 68, color: "info" },
  { label: "Fri", value: 54, color: "primary" },
];

<BarChart data={data} className="mx-auto max-w-md" />`,
        reference: `const data = [
  { label: "Mon", value: 42, color: "primary" },
  { label: "Tue", value: 58, color: "success" },
  { label: "Wed", value: 36, color: "warning" },
  { label: "Thu", value: 68, color: "info" },
  { label: "Fri", value: 54, color: "primary" },
];

<BarChart
  data={data}
  averageValue={50}
  averageLabel="Average"
  className="mx-auto max-w-md"
  showValues
/>`,
        horizontal: `const data = [
  { label: "Search", value: 74, color: "primary" },
  { label: "Social", value: 48, color: "info" },
  { label: "Ads", value: 62, color: "warning" },
  { label: "Referral", value: 31, color: "success" },
];

<BarChart data={data} variant="horizontal" showValues />`,
        quiet: `const data = [
  { label: "Mon", value: 42, color: "primary" },
  { label: "Tue", value: 58, color: "success" },
  { label: "Wed", value: 36, color: "warning" },
  { label: "Thu", value: 68, color: "info" },
  { label: "Fri", value: 54, color: "primary" },
];

<BarChart data={data} className="mx-auto max-w-md" showGrid={false} showLabels={false} />`,
    },
    ja: {
        vertical: `const data = [
  { label: "月", value: 42, color: "primary" },
  { label: "火", value: 58, color: "success" },
  { label: "水", value: 36, color: "warning" },
  { label: "木", value: 68, color: "info" },
  { label: "金", value: 54, color: "primary" },
];

<BarChart data={data} className="mx-auto max-w-md" />`,
        reference: `const data = [
  { label: "月", value: 42, color: "primary" },
  { label: "火", value: 58, color: "success" },
  { label: "水", value: 36, color: "warning" },
  { label: "木", value: 68, color: "info" },
  { label: "金", value: 54, color: "primary" },
];

<BarChart
  data={data}
  averageValue={50}
  averageLabel="平均"
  className="mx-auto max-w-md"
  showValues
/>`,
        horizontal: `const data = [
  { label: "検索", value: 74, color: "primary" },
  { label: "SNS", value: 48, color: "info" },
  { label: "広告", value: 62, color: "warning" },
  { label: "紹介", value: 31, color: "success" },
];

<BarChart data={data} variant="horizontal" showValues />`,
        quiet: `const data = [
  { label: "月", value: 42, color: "primary" },
  { label: "火", value: 58, color: "success" },
  { label: "水", value: 36, color: "warning" },
  { label: "木", value: 68, color: "info" },
  { label: "金", value: 54, color: "primary" },
];

<BarChart data={data} className="mx-auto max-w-md" showGrid={false} showLabels={false} />`,
    },
} as const;

const propsDataByLocale = {
    en: [
        { name: "data", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "Bars to render. Values are normalized against max." },
        { name: "variant", type: "\"horizontal\" | \"vertical\"", default: "\"vertical\"", description: "Registered SSOT variant for chart orientation." },
        { name: "max", type: "number", description: "Explicit maximum value. Defaults to the largest data or reference value." },
        { name: "averageValue", type: "number", description: "Optional dashed average or reference marker." },
        { name: "averageLabel", type: "ReactNode", default: "\"Average\"", description: "Tooltip and accessible label for the average or reference marker." },
        { name: "threshold", type: "number", description: "A capacity/limit line. Bars above it are painted in thresholdTone (over-limit = bad) and a reference line is drawn. (#285)" },
        { name: "thresholdLabel", type: "ReactNode", default: "\"Limit\"", description: "Tooltip and accessible label for the threshold line." },
        { name: "thresholdTone", type: "ChartTone", default: "\"destructive\"", description: "Tone applied to bars over the threshold." },
        { name: "showGrid", type: "boolean", default: "true", description: "Shows the horizontal reference grid in vertical mode." },
        { name: "showLabels", type: "boolean", default: "true", description: "Shows category labels next to or below bars." },
        { name: "showValues", type: "boolean", default: "false", description: "Shows formatted values next to horizontal bars or above vertical bars." },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "Formats bar, average marker, and tooltip values." },
    ],
    ja: [
        { name: "data", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "表示する棒のデータです。値は max を基準に正規化されます。" },
        { name: "variant", type: "\"horizontal\" | \"vertical\"", default: "\"vertical\"", description: "棒の向きを切り替える SSOT 登録済みバリアントです。" },
        { name: "max", type: "number", description: "明示的な最大値です。未指定時は data または基準値の最大値を使います。" },
        { name: "averageValue", type: "number", description: "任意の平均値・基準値マーカーです。" },
        { name: "averageLabel", type: "ReactNode", default: "\"Average\"", description: "平均値・基準値マーカーのツールチップとアクセシブルラベルです。" },
        { name: "threshold", type: "number", description: "容量・上限ライン。これを超えた棒を thresholdTone で塗り（超過＝bad）、基準線を描きます。(#285)" },
        { name: "thresholdLabel", type: "ReactNode", default: "\"Limit\"", description: "閾値ラインのツールチップとアクセシブルラベルです。" },
        { name: "thresholdTone", type: "ChartTone", default: "\"destructive\"", description: "閾値を超えた棒に適用するトーンです。" },
        { name: "showGrid", type: "boolean", default: "true", description: "縦棒表示の横方向の補助線を表示します。" },
        { name: "showLabels", type: "boolean", default: "true", description: "棒の横または下にカテゴリラベルを表示します。" },
        { name: "showValues", type: "boolean", default: "false", description: "横棒では棒の横に、縦棒では棒の上にフォーマット済みの値を表示します。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "棒、平均値マーカー、ツールチップの値を整形します。" },
    ],
} as const;

export default function BarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={meta.barChart.title}
            description={meta.barChart.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "BarChart", href: "/docs/components/bar-chart" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "StackedBarChart", href: "/docs/components/stacked-bar-chart" },
                { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "ChartLegend", href: "/docs/components/chart-legend" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="bar-chart"
                embedBase="/embed/bar-chart"
                previewHeight={560}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "vertical",
                            title: locale === "ja" ? "縦棒" : "Vertical bars",
                            description: locale === "ja"
                                ? "カテゴリ別の量を縦方向の高さで比較する標準の SSOT variant です。"
                                : "The default registered SSOT variant for comparing categories by vertical height.",
                            preview: <BarChart data={weeklyData} className="mx-auto max-w-md" />,
                            code: stateCodeByLocale[locale].vertical,
                        },
                        {
                            key: "reference",
                            title: locale === "ja" ? "基準線と値表示" : "Reference marker with values",
                            description: locale === "ja"
                                ? "平均値や目標値を破線で重ね、各棒の値も表示する状態です。"
                                : "Adds a dashed average or target marker and visible values for each bar.",
                            preview: (
                                <BarChart
                                    data={weeklyData}
                                    averageValue={50}
                                    averageLabel={locale === "ja" ? "平均" : "Average"}
                                    className="mx-auto max-w-md"
                                    showValues
                                />
                            ),
                            code: stateCodeByLocale[locale].reference,
                        },
                        {
                            key: "threshold",
                            title: locale === "ja" ? "閾値トーン（上限超え）" : "Threshold tone (over limit)",
                            description: locale === "ja"
                                ? "threshold を渡すと上限ラインを引き、それを超えた棒を destructive トーンで塗ります。スライダーで上限を動かすと、棒が超過した瞬間に色が変わります。"
                                : "Pass threshold to draw a limit line and paint bars above it in the destructive tone. Drag the slider to move the limit and watch bars flip as they cross it.",
                            preview: <ThresholdBarDemo locale={locale} />,
                            code: `import { BarChart } from "@gunjo/ui";

const data = [
  { label: "A", value: 42, color: "primary" },
  { label: "B", value: 68, color: "primary" },
  { label: "C", value: 51, color: "primary" },
  { label: "D", value: 73, color: "primary" },
];

// Bars above 55 turn destructive; a limit line is drawn at 55.
<BarChart data={data} threshold={55} thresholdLabel="${locale === "ja" ? "上限" : "Limit"}" showValues />`,
                        },
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "横棒" : "Horizontal bars",
                            description: locale === "ja"
                                ? "項目名が長い比較やランキングで使う SSOT variant です。"
                                : "A registered SSOT variant for rankings or comparisons with longer category labels.",
                            preview: <BarChart data={channelData} variant="horizontal" showValues />,
                            code: stateCodeByLocale[locale].horizontal,
                        },
                        {
                            key: "quiet",
                            title: locale === "ja" ? "補助線とラベルなし" : "Without grid or labels",
                            description: locale === "ja"
                                ? "カード内の小さな推移表示など、周辺文脈で項目が分かる場合の props 状態です。"
                                : "A prop state for compact card contexts where surrounding copy already identifies the categories.",
                            preview: <BarChart data={weeklyData} className="mx-auto max-w-md" showGrid={false} showLabels={false} />,
                            code: stateCodeByLocale[locale].quiet,
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
