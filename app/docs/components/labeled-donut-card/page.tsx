"use client";

import type { ComponentProps } from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import displayMetadata from "@design/display-metadata.json";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LabeledDonutCard } from "@gunjo/ui";

type LabeledDonutSegment = ComponentProps<typeof LabeledDonutCard>["segments"][number];

const platformSegmentsByLocale: Record<"en" | "ja", LabeledDonutSegment[]> = {
    en: [
        { label: "Amazon", calloutLabel: "Amazon", value: 45, color: "primary", comparison: "Sales channel 1" },
        { label: "Alibaba", calloutLabel: "Alibaba", value: 35, color: "success", comparison: "Sales channel 2" },
        { label: "Tokopedia", calloutLabel: "Tokopedia", value: 25, color: "warning", comparison: "Sales channel 3" },
    ],
    ja: [
        { label: "Amazon", calloutLabel: "Amazon", value: 45, color: "primary", comparison: "販売チャネル 1" },
        { label: "Alibaba", calloutLabel: "Alibaba", value: 35, color: "success", comparison: "販売チャネル 2" },
        { label: "Tokopedia", calloutLabel: "Tokopedia", value: 25, color: "warning", comparison: "販売チャネル 3" },
    ],
};

const budgetSegmentsByLocale: Record<"en" | "ja", LabeledDonutSegment[]> = {
    en: [
        { label: "Product", calloutLabel: "Product", value: 132000, color: "primary", comparison: "Roadmap" },
        { label: "Operations", calloutLabel: "Operations", value: 84000, color: "info", comparison: "Run cost" },
        { label: "Support", calloutLabel: "Support", value: 41000, color: "success", comparison: "Customer work" },
        { label: "Reserve", calloutLabel: "Reserve", value: 18000, color: "warning", comparison: "Buffer" },
    ],
    ja: [
        { label: "プロダクト", calloutLabel: "プロダクト", value: 132000, color: "primary", comparison: "ロードマップ" },
        { label: "運用", calloutLabel: "運用", value: 84000, color: "info", comparison: "運用費" },
        { label: "サポート", calloutLabel: "サポート", value: 41000, color: "success", comparison: "顧客対応" },
        { label: "予備", calloutLabel: "予備", value: 18000, color: "warning", comparison: "バッファ" },
    ],
};

const codeByLocale = {
    en: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    { label: "Amazon", calloutLabel: "Amazon", value: 45, comparison: "Sales channel 1" },
    { label: "Alibaba", calloutLabel: "Alibaba", value: 35, comparison: "Sales channel 2" },
    { label: "Tokopedia", calloutLabel: "Tokopedia", value: 25, comparison: "Sales channel 3" },
];

export function PlatformSales() {
    return (
        <LabeledDonutCard
            title="Sales by platform"
            description="Labeled donut"
            centerValue="105"
            centerLabel="Total"
            delta="43%"
            segments={segments}
            selectedIndex={0}
            caption="Compare segment share with external callout labels."
        />
    );
}`,
    ja: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    { label: "Amazon", calloutLabel: "Amazon", value: 45, comparison: "販売チャネル 1" },
    { label: "Alibaba", calloutLabel: "Alibaba", value: 35, comparison: "販売チャネル 2" },
    { label: "Tokopedia", calloutLabel: "Tokopedia", value: 25, comparison: "販売チャネル 3" },
];

export function PlatformSales() {
    return (
        <LabeledDonutCard
            title="プラットフォーム別売上"
            description="ラベル付きドーナツ"
            centerValue="105"
            centerLabel="合計"
            delta="43%"
            segments={segments}
            selectedIndex={0}
            caption="セグメントの構成比を外部ラベル付きで比較します。"
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    { label: "Amazon", calloutLabel: "Amazon", value: 45, comparison: "Sales channel 1" },
    { label: "Alibaba", calloutLabel: "Alibaba", value: 35, comparison: "Sales channel 2" },
    { label: "Tokopedia", calloutLabel: "Tokopedia", value: 25, comparison: "Sales channel 3" },
];

<LabeledDonutCard segments={segments} centerValue="105" centerLabel="Total" />
<LabeledDonutCard segments={segments} selectedIndex={1} />
<LabeledDonutCard segments={segments} showCallouts={false} />
<LabeledDonutCard segments={segments} variant="compact" />`,
    ja: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    { label: "Amazon", calloutLabel: "Amazon", value: 45, comparison: "販売チャネル 1" },
    { label: "Alibaba", calloutLabel: "Alibaba", value: 35, comparison: "販売チャネル 2" },
    { label: "Tokopedia", calloutLabel: "Tokopedia", value: 25, comparison: "販売チャネル 3" },
];

<LabeledDonutCard segments={segments} centerValue="105" centerLabel="合計" />
<LabeledDonutCard segments={segments} selectedIndex={1} />
<LabeledDonutCard segments={segments} showCallouts={false} />
<LabeledDonutCard segments={segments} variant="compact" />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `<LabeledDonutCard
  title="Sales by platform"
  description="Labeled donut"
  centerValue="105"
  centerLabel="Total"
  segments={segments}
/>`,
        selected: `<LabeledDonutCard
  title="Sales by platform"
  centerValue="105"
  centerLabel="Total"
  delta="33%"
  segments={segments}
  selectedIndex={1}
/>`,
        noCallouts: `<LabeledDonutCard
  title="Sales by platform"
  centerValue="105"
  centerLabel="Total"
  segments={segments}
  showCallouts={false}
/>`,
        compact: `<LabeledDonutCard
  title="Sales by platform"
  centerValue="105"
  centerLabel="Total"
  segments={segments}
  variant="compact"
/>`,
        formatted: `<LabeledDonutCard
  title="Budget allocation"
  centerValue="$275K"
  centerLabel="Budget"
  segments={budgetSegments}
  selectedIndex={0}
  formatValue={(value) => \`$\${value.toLocaleString()}\`}
/>`,
        caption: `<LabeledDonutCard
  title="Sales by platform"
  centerValue="105"
  centerLabel="Total"
  segments={segments}
  selectedIndex={0}
  caption="Compare segment share with external callout labels."
/>`,
    },
    ja: {
        default: `<LabeledDonutCard
  title="プラットフォーム別売上"
  description="ラベル付きドーナツ"
  centerValue="105"
  centerLabel="合計"
  segments={segments}
/>`,
        selected: `<LabeledDonutCard
  title="プラットフォーム別売上"
  centerValue="105"
  centerLabel="合計"
  delta="33%"
  segments={segments}
  selectedIndex={1}
/>`,
        noCallouts: `<LabeledDonutCard
  title="プラットフォーム別売上"
  centerValue="105"
  centerLabel="合計"
  segments={segments}
  showCallouts={false}
/>`,
        compact: `<LabeledDonutCard
  title="プラットフォーム別売上"
  centerValue="105"
  centerLabel="合計"
  segments={segments}
  variant="compact"
/>`,
        formatted: `<LabeledDonutCard
  title="予算配分"
  centerValue="27.5万円"
  centerLabel="予算"
  segments={budgetSegments}
  selectedIndex={0}
  formatValue={(value) => \`\${value.toLocaleString()}円\`}
/>`,
        caption: `<LabeledDonutCard
  title="プラットフォーム別売上"
  centerValue="105"
  centerLabel="合計"
  segments={segments}
  selectedIndex={0}
  caption="セグメントの構成比を外部ラベル付きで比較します。"
/>`,
    },
} as const;

const propsDataByLocale = {
    en: [
        {
            name: "segments",
            type: "{ label?: ReactNode; value: number; color?: ChartColor; calloutLabel?: ReactNode; comparison?: ReactNode }[]",
            description: "Donut segments and optional external callout labels.",
        },
        {
            name: "variant",
            type: "\"default\" | \"compact\"",
            default: "\"default\"",
            description: "Generated design variant for card density.",
        },
        {
            name: "selectedIndex",
            type: "number",
            description: "Highlights the segment currently being inspected.",
        },
        {
            name: "showCallouts",
            type: "boolean",
            default: "true",
            description: "Shows external segment callout rows beside the donut.",
        },
        {
            name: "thickness",
            type: "number",
            description: "Donut ring thickness in pixels.",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "Formats segment values in tooltips and callout rows.",
        },
        {
            name: "onSegmentSelect",
            type: "(segment, index) => void",
            description: "Optional callback fired when the donut ring or a callout row is selected.",
        },
    ],
    ja: [
        {
            name: "segments",
            type: "{ label?: ReactNode; value: number; color?: ChartColor; calloutLabel?: ReactNode; comparison?: ReactNode }[]",
            description: "ドーナツのセグメントと、必要に応じて外側に表示するラベルです。",
        },
        {
            name: "variant",
            type: "\"default\" | \"compact\"",
            default: "\"default\"",
            description: "カード密度を切り替える生成済みデザインバリアントです。",
        },
        {
            name: "selectedIndex",
            type: "number",
            description: "確認中のセグメントを強調します。",
        },
        {
            name: "showCallouts",
            type: "boolean",
            default: "true",
            description: "ドーナツの横に外部ラベル行を表示します。",
        },
        {
            name: "thickness",
            type: "number",
            description: "ドーナツリングの太さをピクセルで指定します。",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "ツールチップと外部ラベル行に表示するセグメント値のフォーマット関数です。",
        },
        {
            name: "onSegmentSelect",
            type: "(segment, index) => void",
            description: "ドーナツリングまたは外部ラベル行を選択したときに呼ばれる任意のコールバックです。",
        },
    ],
} as const;

export default function LabeledDonutCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const stateCodeData = usageCodeByLocale[locale]
        .split("\n\n<LabeledDonutCard")[0]
        .replace('import { LabeledDonutCard } from "@gunjo/ui";\n\n', "");
    const withStateCodeData = (nextCode: string) => `${stateCodeData}\n\n${nextCode}`;
    const segments = platformSegmentsByLocale[locale];
    const budgetSegments = budgetSegmentsByLocale[locale];

    return (
        <ComponentLayout
            title={locale === "ja" ? "ラベル付きドーナツカード" : meta.labeledDonutCard.title}
            description={
                locale === "ja"
                    ? "中央サマリー、外部ラベル、選択状態を合わせて、セグメントの構成比を読み取りやすくするカードです。"
                    : meta.labeledDonutCard.description
            }
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: locale === "ja" ? "ラベル付きドーナツカード" : "LabeledDonutCard", href: "/docs/components/labeled-donut-card" },
                { name: locale === "ja" ? "ツールチップ" : "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: locale === "ja" ? "ドーナツチャート" : "DonutChart", href: "/docs/components/donut-chart" },
                { name: locale === "ja" ? "円グラフ" : "PieChart", href: "/docs/components/pie-chart" },
                { name: locale === "ja" ? "分析カード" : "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: locale === "ja" ? "チャート凡例" : "ChartLegend", href: "/docs/components/chart-legend" },
            ]}
        >
            <ChartPreviewWithControls
                code={codeByLocale[locale]}
                demo="labeled-donut-card"
                embedBase="/embed/labeled-donut-card"
                previewHeight={460}
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
                                ? "中央サマリーと外部ラベルを持つ、SSOT 登録済みの標準バリエーションです。"
                                : "The registered SSOT default variant with a center summary and external callout rows.",
                            preview: (
                                <LabeledDonutCard
                                    className="mx-auto max-w-3xl"
                                    title={locale === "ja" ? "プラットフォーム別売上" : "Sales by platform"}
                                    description={locale === "ja" ? "ラベル付きドーナツ" : "Labeled donut"}
                                    centerValue="105"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    segments={segments}
                                />
                            ),
                            previewBodyWidth: "xl",
                            code: withStateCodeData(stateCodeByLocale[locale].default),
                        },
                        {
                            key: "selected",
                            title: locale === "ja" ? "選択セグメント" : "Selected segment",
                            description: locale === "ja"
                                ? "確認中のセグメントをリングと外部ラベル行で強調します。"
                                : "Highlights the inspected segment in both the ring and callout row.",
                            preview: (
                                <LabeledDonutCard
                                    className="mx-auto max-w-3xl"
                                    title={locale === "ja" ? "プラットフォーム別売上" : "Sales by platform"}
                                    centerValue="105"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    delta="33%"
                                    deltaDescription={locale === "ja" ? "選択セグメントの構成比です。" : "Share of the selected segment."}
                                    segments={segments}
                                    selectedIndex={1}
                                />
                            ),
                            previewBodyWidth: "xl",
                            code: withStateCodeData(stateCodeByLocale[locale].selected),
                        },
                        {
                            key: "no-callouts",
                            title: locale === "ja" ? "外部ラベルなし" : "Without callouts",
                            description: locale === "ja"
                                ? "カード幅が狭い場合や、周辺で凡例を持つ場合は外部ラベルを省略できます。"
                                : "Hides external labels for narrow cards or when another legend is already present.",
                            preview: (
                                <LabeledDonutCard
                                    className="mx-auto max-w-sm"
                                    title={locale === "ja" ? "プラットフォーム別売上" : "Sales by platform"}
                                    centerValue="105"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    segments={segments}
                                    showCallouts={false}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: withStateCodeData(stateCodeByLocale[locale].noCallouts),
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードグリッド向けに余白とチャートサイズを抑える、SSOT 登録済みバリエーションです。"
                                : "A registered SSOT variant that reduces spacing and chart size for compact grids.",
                            preview: (
                                <LabeledDonutCard
                                    className="mx-auto max-w-xl"
                                    title={locale === "ja" ? "プラットフォーム別売上" : "Sales by platform"}
                                    centerValue="105"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    segments={segments}
                                    variant="compact"
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].compact),
                        },
                        {
                            key: "formatted-values",
                            title: locale === "ja" ? "値の整形" : "Formatted values",
                            description: locale === "ja"
                                ? "金額や単位付きの値を、ツールチップと外部ラベル行で同じ形式に整えます。"
                                : "Formats currency or unit values consistently across tooltips and callout rows.",
                            preview: (
                                <LabeledDonutCard
                                    className="mx-auto max-w-3xl"
                                    title={locale === "ja" ? "予算配分" : "Budget allocation"}
                                    centerValue={locale === "ja" ? "27.5万円" : "$275K"}
                                    centerLabel={locale === "ja" ? "予算" : "Budget"}
                                    segments={budgetSegments}
                                    selectedIndex={0}
                                    formatValue={(value) =>
                                        locale === "ja"
                                            ? `${value.toLocaleString()}円`
                                            : `$${value.toLocaleString()}`
                                    }
                                />
                            ),
                            previewBodyWidth: "xl",
                            code: withStateCodeData(stateCodeByLocale[locale].formatted),
                        },
                        {
                            key: "caption",
                            title: locale === "ja" ? "補足付き" : "With caption",
                            description: locale === "ja"
                                ? "グラフの読み方や比較条件をカード下部の補足で伝える状態です。"
                                : "Adds a short caption for reading guidance or comparison context.",
                            preview: (
                                <LabeledDonutCard
                                    className="mx-auto max-w-3xl"
                                    title={locale === "ja" ? "プラットフォーム別売上" : "Sales by platform"}
                                    centerValue="105"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    segments={segments}
                                    selectedIndex={0}
                                    caption={
                                        locale === "ja"
                                            ? "セグメントの構成比を外部ラベル付きで比較します。"
                                            : "Compare segment share with external callout labels."
                                    }
                                />
                            ),
                            previewBodyWidth: "xl",
                            code: withStateCodeData(stateCodeByLocale[locale].caption),
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
                    <CodeCopyButton code={usageCodeByLocale[locale]} />
                </div>
                <CodeBlock code={usageCodeByLocale[locale]} />
            </div>
        </ComponentLayout>
    );
}
