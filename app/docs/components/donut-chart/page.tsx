"use client";

import type { ComponentProps } from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { DonutChart } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

type DonutSegment = ComponentProps<typeof DonutChart>["segments"][number];

const segmentMixByLocale: Record<"en" | "ja", DonutSegment[]> = {
    en: [
        { label: "Core", value: 46, color: "primary" },
        { label: "Growth", value: 28, color: "success" },
        { label: "Retention", value: 18, color: "warning" },
        { label: "Expansion", value: 8, color: "info" },
    ],
    ja: [
        { label: "コア", value: 46, color: "primary" },
        { label: "成長", value: 28, color: "success" },
        { label: "継続", value: 18, color: "warning" },
        { label: "拡張", value: 8, color: "info" },
    ],
};

const budgetSegmentsByLocale: Record<"en" | "ja", DonutSegment[]> = {
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

const denseSegmentsByLocale: Record<"en" | "ja", DonutSegment[]> = {
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

const codeByLocale = {
    en: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function SegmentMixDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100"
            centerLabel="Total"
            totalLabel="Total"
            showLegend
        />
    );
}`,
    ja: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "コア", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function SegmentMixDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100"
            centerLabel="合計"
            totalLabel="合計"
            showLegend
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Organic", value: 46, color: "primary" },
    { label: "Referral", value: 28, color: "success" },
    { label: "Direct", value: 18, color: "warning" },
    { label: "Ads", value: 8, color: "info" },
];

export function DonutChartUsage() {
    return (
        <div className="grid gap-6">
            <DonutChart segments={segments} />
            <DonutChart
                segments={segments}
                centerValue="100"
                centerLabel="Total"
                totalLabel="Total"
                showLegend
            />
            <DonutChart segments={segments} variant="compact" thickness={18} />
            <DonutChart
                segments={segments}
                formatValue={(value) => "$" + value.toLocaleString()}
            />
        </div>
    );
}`,
    ja: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "自然流入", value: 46, color: "primary" },
    { label: "紹介", value: 28, color: "success" },
    { label: "直接", value: 18, color: "warning" },
    { label: "広告", value: 8, color: "info" },
];

export function DonutChartUsage() {
    return (
        <div className="grid gap-6">
            <DonutChart segments={segments} />
            <DonutChart
                segments={segments}
                centerValue="100"
                centerLabel="合計"
                totalLabel="合計"
                showLegend
            />
            <DonutChart segments={segments} variant="compact" thickness={18} />
            <DonutChart
                segments={segments}
                formatValue={(value) => value.toLocaleString() + "円"}
            />
        </div>
    );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function SegmentMixDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100"
            centerLabel="Total"
            totalLabel="Total"
        />
    );
}`,
        legend: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function SegmentMixDonutWithLegend() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100"
            centerLabel="Total"
            totalLabel="Total"
            showLegend
        />
    );
}`,
        compact: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function CompactSegmentDonut() {
    return (
        <DonutChart
            segments={segments}
            variant="compact"
            centerValue="100%"
            centerLabel="Share"
            thickness={18}
        />
    );
}`,
        thick: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function ThickSegmentDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100%"
            centerLabel="Share"
            thickness={34}
            showLegend
        />
    );
}`,
        formatted: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Product", value: 132000, color: "primary" },
    { label: "Operations", value: 84000, color: "info" },
    { label: "Support", value: 41000, color: "success" },
    { label: "Reserve", value: 18000, color: "warning" },
];

export function BudgetDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="$275K"
            centerLabel="Budget"
            totalLabel="Budget"
            showLegend
            formatValue={(value) => "$" + value.toLocaleString()}
        />
    );
}`,
        dense: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "Search", value: 34, color: "primary" },
    { label: "Social", value: 22, color: "info" },
    { label: "Email", value: 16, color: "success" },
    { label: "Ads", value: 12, color: "warning" },
    { label: "Partner", value: 9, color: "accent" },
    { label: "Other", value: 7, color: "muted" },
];

export function DenseSourceDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="6"
            centerLabel="Sources"
            showLegend
        />
    );
}`,
    },
    ja: {
        default: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "コア", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function SegmentMixDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100"
            centerLabel="合計"
            totalLabel="合計"
        />
    );
}`,
        legend: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "コア", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function SegmentMixDonutWithLegend() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100"
            centerLabel="合計"
            totalLabel="合計"
            showLegend
        />
    );
}`,
        compact: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "コア", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function CompactSegmentDonut() {
    return (
        <DonutChart
            segments={segments}
            variant="compact"
            centerValue="100%"
            centerLabel="構成比"
            thickness={18}
        />
    );
}`,
        thick: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "コア", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function ThickSegmentDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="100%"
            centerLabel="構成比"
            thickness={34}
            showLegend
        />
    );
}`,
        formatted: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "プロダクト", value: 132000, color: "primary" },
    { label: "運用", value: 84000, color: "info" },
    { label: "サポート", value: 41000, color: "success" },
    { label: "予備", value: 18000, color: "warning" },
];

export function BudgetDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="27.5万円"
            centerLabel="予算"
            totalLabel="予算"
            showLegend
            formatValue={(value) => value.toLocaleString() + "円"}
        />
    );
}`,
        dense: `import { DonutChart } from "@gunjo/ui";

const segments = [
    { label: "検索", value: 34, color: "primary" },
    { label: "SNS", value: 22, color: "info" },
    { label: "メール", value: 16, color: "success" },
    { label: "広告", value: 12, color: "warning" },
    { label: "提携", value: 9, color: "accent" },
    { label: "その他", value: 7, color: "muted" },
];

export function DenseSourceDonut() {
    return (
        <DonutChart
            segments={segments}
            centerValue="6"
            centerLabel="チャネル"
            showLegend
        />
    );
}`,
    },
} as const;

const propsDataByLocale = {
    en: [
    {
        name: "segments",
        type: "{ label?: ReactNode; value: number; color?: ChartColor }[]",
        description: "Proportional segments rendered with an HTML/CSS conic gradient.",
    },
    {
        name: "variant",
        type: "\"compact\" | \"default\"",
        default: "\"default\"",
        description: "Registered SSOT variant for chart size.",
    },
    {
        name: "centerValue",
        type: "ReactNode",
        description: "Primary value rendered inside the donut.",
    },
    {
        name: "centerLabel",
        type: "ReactNode",
        description: "Muted label rendered below the center value.",
    },
    {
        name: "thickness",
        type: "number",
        description: "Inner cutout inset in pixels.",
    },
    {
        name: "showLegend",
        type: "boolean",
        default: "false",
        description: "Renders a ChartLegend below the donut.",
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
        { name: "segments", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "円環の比率として表示するセグメントです。" },
        { name: "variant", type: "\"compact\" | \"default\"", default: "\"default\"", description: "チャートサイズを切り替える SSOT 登録済みバリエーションです。" },
        { name: "centerValue", type: "ReactNode", description: "ドーナツ中央に表示する主要な値です。" },
        { name: "centerLabel", type: "ReactNode", description: "中央値の下に表示する補足ラベルです。" },
        { name: "thickness", type: "number", description: "内側のくり抜き幅をピクセルで指定します。" },
        { name: "showLegend", type: "boolean", default: "false", description: "ドーナツの下にチャート凡例を表示します。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "ツールチップと凡例説明に表示する生のセグメント値を整形します。" },
        { name: "totalLabel", type: "ReactNode", default: "\"Total\"", description: "凡例ツールチップで生のセグメント値の前に表示するラベルです。" },
    ],
} as const;

export default function DonutChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];
    const segments = segmentMixByLocale[locale];
    const budgetSegments = budgetSegmentsByLocale[locale];
    const denseSegments = denseSegmentsByLocale[locale];

    return (
        <ComponentLayout
            title={locale === "ja" ? "ドーナツチャート" : meta.donutChart.title}
            description={meta.donutChart.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: locale === "ja" ? "ドーナツチャート" : "DonutChart", href: "/docs/components/donut-chart" },
                { name: locale === "ja" ? "チャート凡例" : "ChartLegend", href: "/docs/components/chart-legend" },
                { name: locale === "ja" ? "ツールチップ" : "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: locale === "ja" ? "ラベル付きドーナツカード" : "LabeledDonutCard", href: "/docs/components/labeled-donut-card" },
                { name: locale === "ja" ? "円グラフ" : "PieChart", href: "/docs/components/pie-chart" },
                { name: locale === "ja" ? "分布バー" : "DistributionBar", href: "/docs/components/distribution-bar" },
                { name: locale === "ja" ? "分析カード" : "AnalyticsCard", href: "/docs/components/analytics-card" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: ドーナツチャート（Donut Chart）" : "UIXHERO: Donut Chart (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/donut-chart`,
                },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="donut-chart"
                embedBase="/embed/donut-chart"
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
                                ? "中央値付きのドーナツで構成比を示す、SSOT 登録済みの標準バリエーションです。"
                                : "The registered SSOT default variant for proportional segments with a center value.",
                            preview: (
                                <DonutChart
                                    segments={segments}
                                    centerValue="100"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    totalLabel={locale === "ja" ? "合計" : "Total"}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].default,
                        },
                        {
                            key: "legend",
                            title: locale === "ja" ? "凡例付き" : "With legend",
                            description: locale === "ja"
                                ? "セグメントのラベル、割合、元の値をドーナツの下で確認する状態です。"
                                : "Shows segment labels, percentages, and raw values below the donut.",
                            preview: (
                                <DonutChart
                                    segments={segments}
                                    centerValue="100"
                                    centerLabel={locale === "ja" ? "合計" : "Total"}
                                    totalLabel={locale === "ja" ? "合計" : "Total"}
                                    showLegend
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].legend,
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードやサイドパネルでサイズを抑える SSOT 登録済みバリエーションです。"
                                : "A registered SSOT variant that reduces chart size for narrow cards or side panels.",
                            preview: (
                                <DonutChart
                                    segments={segments}
                                    variant="compact"
                                    centerValue="100%"
                                    centerLabel={locale === "ja" ? "構成比" : "Share"}
                                    thickness={18}
                                />
                            ),
                            previewBodyWidth: "sm",
                            code: stateCodeByLocale[locale].compact,
                        },
                        {
                            key: "thick-ring",
                            title: locale === "ja" ? "太いリング" : "Thick ring",
                            description: locale === "ja"
                                ? "強い視認性が必要な場合は、くり抜き幅を調整してリングを太くできます。"
                                : "Uses a smaller inner cutout to make the ring more prominent.",
                            preview: (
                                <DonutChart
                                    segments={segments}
                                    centerValue="100%"
                                    centerLabel={locale === "ja" ? "構成比" : "Share"}
                                    thickness={34}
                                    showLegend
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].thick,
                        },
                        {
                            key: "formatted-values",
                            title: locale === "ja" ? "値の整形" : "Formatted values",
                            description: locale === "ja"
                                ? "割合は自動計算し、ツールチップや凡例に表示する元の値だけを整形します。"
                                : "Keeps percentages normalized while formatting raw values in tooltips and legend descriptions.",
                            preview: (
                                <DonutChart
                                    segments={budgetSegments}
                                    centerValue={locale === "ja" ? "27.5万円" : "$275K"}
                                    centerLabel={locale === "ja" ? "予算" : "Budget"}
                                    totalLabel={locale === "ja" ? "予算" : "Budget"}
                                    showLegend
                                    formatValue={(value) =>
                                        locale === "ja"
                                            ? `${value.toLocaleString()}円`
                                            : `$${value.toLocaleString()}`
                                    }
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].formatted,
                        },
                        {
                            key: "dense",
                            title: locale === "ja" ? "セグメント多め" : "Dense segments",
                            description: locale === "ja"
                                ? "6 区分程度の構成比でも、ドーナツと凡例を合わせて確認できます。"
                                : "Keeps a six-part distribution readable with the donut and legend together.",
                            preview: (
                                <DonutChart
                                    segments={denseSegments}
                                    centerValue="6"
                                    centerLabel={locale === "ja" ? "チャネル" : "Sources"}
                                    showLegend
                                />
                            ),
                            previewBodyWidth: "md",
                            code: stateCodeByLocale[locale].dense,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>中央の数字は、図の外の要素です。</strong>資料は「中央の数字を SVG の中に閉じ込めない」を挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DonutChart</code> はリングを <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code> で描き、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerValue</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerLabel</code> はその上に重ねた普通の HTML の要素です。読み上げにも、文字の拡大にも乗ります。
                        </li>
                        <li>
                            <strong>中央の値を、部品は計算しません。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerValue</code> は呼ぶ側が渡します。中央に置くものが合計とは限らないからです（達成率、母数、前期比のどれもあり得ます）。資料の「中央とリングで同じことを2回言わない」を、部品が勝手に合計を出さないことで書く人の判断に残しました。
                        </li>
                        <li>
                            <strong>くり抜きは、カードの色で塗っています。</strong>中央の穴は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thickness</code> ピクセルぶん内側に置いた円で、色は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">bg-card</code> です。カードの上に置く前提の作りなので、違う色の面に置くときは重なりを確かめてください。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thickness</code> の既定は 24（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">compact</code> は 18）です。数値の整形は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> だけで、シリアライズできる <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DonutChart</code> にはまだありません。サーバーコンポーネントからは渡せないので、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'"use client"'}</code> の境界を挟みます（#338）。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The centre number lives outside the drawing.</strong> The article asks you not to trap it inside the SVG. GUNJO&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DonutChart</code> paints the ring with a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code>, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerValue</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerLabel</code> are ordinary HTML elements layered on top, so they reach both a screen reader and text zoom.
                        </li>
                        <li>
                            <strong>The component never computes the centre value.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">centerValue</code> comes from the caller, because what belongs in the hole is not necessarily the total — it may be an attainment rate, a denominator, or a change against last period. Not summing automatically is how the article&rsquo;s “don&rsquo;t say the same thing twice” stays a decision the author makes.
                        </li>
                        <li>
                            <strong>The hole is painted in the card colour.</strong> It is a circle inset by <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thickness</code> pixels filled with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">bg-card</code>, which assumes the chart sits on a card; check the overlap when you place it on a differently coloured surface. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thickness</code> defaults to 24 (18 for <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">compact</code>). Formatting goes through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> only: the serializable <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> is not on <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DonutChart</code> yet, so a Server Component needs a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'"use client"'}</code> boundary in between (#338).
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
