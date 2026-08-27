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
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function PlatformSalesDonut() {
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
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function PlatformSalesDonut() {
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
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function LabeledDonutCardUsage() {
    return (
        <div className="grid gap-6">
            <LabeledDonutCard
                segments={segments}
                centerValue="105"
                centerLabel="Total"
            />
            <LabeledDonutCard segments={segments} selectedIndex={1} />
            <LabeledDonutCard segments={segments} showCallouts={false} />
            <LabeledDonutCard segments={segments} variant="compact" />
        </div>
    );
}`,
    ja: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function LabeledDonutCardUsage() {
    return (
        <div className="grid gap-6">
            <LabeledDonutCard
                segments={segments}
                centerValue="105"
                centerLabel="合計"
            />
            <LabeledDonutCard segments={segments} selectedIndex={1} />
            <LabeledDonutCard segments={segments} showCallouts={false} />
            <LabeledDonutCard segments={segments} variant="compact" />
        </div>
    );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function PlatformSalesDonut() {
    return (
        <LabeledDonutCard
            title="Sales by platform"
            description="Labeled donut"
            centerValue="105"
            centerLabel="Total"
            segments={segments}
        />
    );
}`,
        selected: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function SelectedSegmentDonut() {
    return (
        <LabeledDonutCard
            title="Sales by platform"
            centerValue="105"
            centerLabel="Total"
            delta="33%"
            segments={segments}
            selectedIndex={1}
        />
    );
}`,
        noCallouts: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function DonutWithoutCallouts() {
    return (
        <LabeledDonutCard
            title="Sales by platform"
            centerValue="105"
            centerLabel="Total"
            segments={segments}
            showCallouts={false}
        />
    );
}`,
        compact: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function CompactPlatformDonut() {
    return (
        <LabeledDonutCard
            title="Sales by platform"
            centerValue="105"
            centerLabel="Total"
            segments={segments}
            variant="compact"
        />
    );
}`,
        formatted: `import { LabeledDonutCard } from "@gunjo/ui";

const budgetSegments = [
    {
        label: "Product",
        calloutLabel: "Product",
        value: 132000,
        comparison: "Roadmap",
    },
    {
        label: "Operations",
        calloutLabel: "Operations",
        value: 84000,
        comparison: "Run cost",
    },
    {
        label: "Support",
        calloutLabel: "Support",
        value: 41000,
        comparison: "Customer work",
    },
    {
        label: "Reserve",
        calloutLabel: "Reserve",
        value: 18000,
        comparison: "Buffer",
    },
];

export function BudgetAllocationDonut() {
    return (
        <LabeledDonutCard
            title="Budget allocation"
            centerValue="$275K"
            centerLabel="Budget"
            segments={budgetSegments}
            selectedIndex={0}
            formatValue={(value) => "$" + value.toLocaleString()}
        />
    );
}`,
        caption: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "Sales channel 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "Sales channel 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "Sales channel 3",
    },
];

export function CaptionedPlatformDonut() {
    return (
        <LabeledDonutCard
            title="Sales by platform"
            centerValue="105"
            centerLabel="Total"
            segments={segments}
            selectedIndex={0}
            caption="Compare segment share with external callout labels."
        />
    );
}`,
    },
    ja: {
        default: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function PlatformSalesDonut() {
    return (
        <LabeledDonutCard
            title="プラットフォーム別売上"
            description="ラベル付きドーナツ"
            centerValue="105"
            centerLabel="合計"
            segments={segments}
        />
    );
}`,
        selected: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function SelectedSegmentDonut() {
    return (
        <LabeledDonutCard
            title="プラットフォーム別売上"
            centerValue="105"
            centerLabel="合計"
            delta="33%"
            segments={segments}
            selectedIndex={1}
        />
    );
}`,
        noCallouts: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function DonutWithoutCallouts() {
    return (
        <LabeledDonutCard
            title="プラットフォーム別売上"
            centerValue="105"
            centerLabel="合計"
            segments={segments}
            showCallouts={false}
        />
    );
}`,
        compact: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function CompactPlatformDonut() {
    return (
        <LabeledDonutCard
            title="プラットフォーム別売上"
            centerValue="105"
            centerLabel="合計"
            segments={segments}
            variant="compact"
        />
    );
}`,
        formatted: `import { LabeledDonutCard } from "@gunjo/ui";

const budgetSegments = [
    {
        label: "プロダクト",
        calloutLabel: "プロダクト",
        value: 132000,
        comparison: "ロードマップ",
    },
    {
        label: "運用",
        calloutLabel: "運用",
        value: 84000,
        comparison: "運用費",
    },
    {
        label: "サポート",
        calloutLabel: "サポート",
        value: 41000,
        comparison: "顧客対応",
    },
    {
        label: "予備",
        calloutLabel: "予備",
        value: 18000,
        comparison: "バッファ",
    },
];

export function BudgetAllocationDonut() {
    return (
        <LabeledDonutCard
            title="予算配分"
            centerValue="27.5万円"
            centerLabel="予算"
            segments={budgetSegments}
            selectedIndex={0}
            formatValue={(value) => value.toLocaleString() + "円"}
        />
    );
}`,
        caption: `import { LabeledDonutCard } from "@gunjo/ui";

const segments = [
    {
        label: "Amazon",
        calloutLabel: "Amazon",
        value: 45,
        comparison: "販売チャネル 1",
    },
    {
        label: "Alibaba",
        calloutLabel: "Alibaba",
        value: 35,
        comparison: "販売チャネル 2",
    },
    {
        label: "Tokopedia",
        calloutLabel: "Tokopedia",
        value: 25,
        comparison: "販売チャネル 3",
    },
];

export function CaptionedPlatformDonut() {
    return (
        <LabeledDonutCard
            title="プラットフォーム別売上"
            centerValue="105"
            centerLabel="合計"
            segments={segments}
            selectedIndex={0}
            caption="セグメントの構成比を外部ラベル付きで比較します。"
        />
    );
}`,
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
                            code: stateCodeByLocale[locale].default,
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
                            code: stateCodeByLocale[locale].selected,
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
                            code: stateCodeByLocale[locale].noCallouts,
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
                            code: stateCodeByLocale[locale].compact,
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
                            code: stateCodeByLocale[locale].formatted,
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
                            code: stateCodeByLocale[locale].caption,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>ドーナツも引き出しラベルも SVG を使わずに置いた。</strong>円は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code>、真ん中の抜きは重ねた丸で作ります。区分の位置は角度から座標を出して、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">calloutLabel</code> を円のまわりに置きます。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showCallouts</code> を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">false</code> にすると引き出しを畳んで、右の一覧だけの姿になります（狭い枠に入れるとき用）。
                        </li>
                        <li>
                            <strong>図の役割が props で変わる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onSegmentSelect</code> を渡すと図の塊は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="button"'}</code> になり、Enter と Space で選べます。渡さなければ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> の読み物です。押せそうな見た目なのに押せない、という状態を作らないためです。
                        </li>
                        <li>
                            <strong>真ん中の値はカードが決めない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerValue</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerLabel</code> は呼ぶ側が渡します。合計を出すのか、いちばん大きい区分を出すのかは画面の意味で変わるからです。指で触ったときのツールチップは触れた位置に出し、離しても少しの間そこに残します。
                            <br />
                            一般のカードの設計は UIXHERO の「カード」にあります。{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/card"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: カード（Card）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Neither the donut nor its callout labels use SVG.</strong> The ring is a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code> with a plain circle stacked over the middle. Segment positions are derived from angles so that <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">calloutLabel</code> can be placed around the ring. Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showCallouts</code> to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">false</code> to drop the callouts and keep only the list on the right, for narrow hosts.
                        </li>
                        <li>
                            <strong>The figure&rsquo;s role changes with the props.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onSegmentSelect</code> and the ring becomes <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="button"'}</code>, selectable with Enter and Space; omit it and the ring is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code>. Nothing should look pressable without being pressable.
                        </li>
                        <li>
                            <strong>The centre value is not the card&rsquo;s decision.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerValue</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerLabel</code> come from the caller, because whether the middle shows a total or the biggest segment depends on the screen. On touch the tooltip appears where the finger landed and lingers briefly after release.
                            <br />
                            The general design of cards is covered by UIXHERO&rsquo;s card article.{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/card"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Card (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
