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

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function AudienceShare() {
    return <PieChart segments={segments} totalLabel="Total" showLegend />;
}`,
    ja: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "基盤", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function AudienceShare() {
    return <PieChart segments={segments} totalLabel="合計" showLegend />;
}`,
} as const;

const usageCode = {
    en: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function RevenueMixPieVariants() {
    return (
        <div className="grid gap-6">
            <PieChart segments={segments} />
            <PieChart segments={segments} showLegend totalLabel="Total" />
            <PieChart segments={segments} variant="compact" showLegend />
        </div>
    );
}`,
    ja: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "基盤", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function RevenueMixPieVariants() {
    return (
        <div className="grid gap-6">
            <PieChart segments={segments} />
            <PieChart segments={segments} showLegend totalLabel="合計" />
            <PieChart segments={segments} variant="compact" showLegend />
        </div>
    );
}`,
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
            code: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function RevenueMixPie() {
    return <PieChart segments={segments} />;
}`,
        },
        {
            key: "legend",
            title: "With legend",
            description: "Adds labels and values below the pie.",
            preview: <PieChart segments={segmentsByLocale.en} showLegend totalLabel="Total" />,
            previewBodyWidth: "md",
            code: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function RevenueMixPieWithLegend() {
    return <PieChart segments={segments} showLegend totalLabel="Total" />;
}`,
        },
        {
            key: "compact",
            title: "Compact",
            description: "Registered compact size for narrow panels.",
            preview: <PieChart segments={segmentsByLocale.en} variant="compact" showLegend />,
            previewBodyWidth: "sm",
            code: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "Core", value: 46, color: "primary" },
    { label: "Growth", value: 28, color: "success" },
    { label: "Retention", value: 18, color: "warning" },
    { label: "Expansion", value: 8, color: "info" },
];

export function CompactRevenueMixPie() {
    return <PieChart segments={segments} variant="compact" showLegend />;
}`,
        },
        {
            key: "dense",
            title: "Dense segments",
            description: "Checks readability with more segments.",
            preview: <PieChart segments={denseSegmentsByLocale.en} showLegend totalLabel="Sources" />,
            previewBodyWidth: "md",
            code: `import { PieChart } from "@gunjo/ui";

const sourceSegments = [
    { label: "Search", value: 34, color: "primary" },
    { label: "Social", value: 22, color: "info" },
    { label: "Email", value: 16, color: "success" },
    { label: "Ads", value: 12, color: "warning" },
    { label: "Other", value: 16, color: "muted" },
];

export function ChannelMixPie() {
    return <PieChart segments={sourceSegments} showLegend totalLabel="Sources" />;
}`,
        },
    ],
    ja: [
        {
            key: "default",
            title: "標準表示",
            description: "構成比を標準サイズで表示します。",
            preview: <PieChart segments={segmentsByLocale.ja} />,
            previewBodyWidth: "md",
            code: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "基盤", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function RevenueMixPie() {
    return <PieChart segments={segments} />;
}`,
        },
        {
            key: "legend",
            title: "凡例付き",
            description: "ラベルと値を円グラフ下で確認します。",
            preview: <PieChart segments={segmentsByLocale.ja} showLegend totalLabel="合計" />,
            previewBodyWidth: "md",
            code: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "基盤", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function RevenueMixPieWithLegend() {
    return <PieChart segments={segments} showLegend totalLabel="合計" />;
}`,
        },
        {
            key: "compact",
            title: "コンパクト",
            description: "狭い領域向けの SSOT 登録済みサイズです。",
            preview: <PieChart segments={segmentsByLocale.ja} variant="compact" showLegend />,
            previewBodyWidth: "sm",
            code: `import { PieChart } from "@gunjo/ui";

const segments = [
    { label: "基盤", value: 46, color: "primary" },
    { label: "成長", value: 28, color: "success" },
    { label: "継続", value: 18, color: "warning" },
    { label: "拡張", value: 8, color: "info" },
];

export function CompactRevenueMixPie() {
    return <PieChart segments={segments} variant="compact" showLegend />;
}`,
        },
        {
            key: "dense",
            title: "セグメント多め",
            description: "区分が多い時の見え方を確認します。",
            preview: <PieChart segments={denseSegmentsByLocale.ja} showLegend totalLabel="流入元" />,
            previewBodyWidth: "md",
            code: `import { PieChart } from "@gunjo/ui";

const sourceSegments = [
    { label: "検索", value: 34, color: "primary" },
    { label: "SNS", value: 22, color: "info" },
    { label: "メール", value: 16, color: "success" },
    { label: "広告", value: 12, color: "warning" },
    { label: "その他", value: 16, color: "muted" },
];

export function ChannelMixPie() {
    return <PieChart segments={sourceSegments} showLegend totalLabel="流入元" />;
}`,
        },
    ],
} as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>円は SVG ではなく、背景の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code> で描いています。</strong>扇形は1枚の div に敷いた背景で、割合は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> の値から自動で出ます。パーセントを自分で計算して渡す必要はありません。負の値は 0 として扱い、合計が 0 でも円が壊れないようにしてあります。
            </li>
            <li>
                <strong>図に名前を持たせ、いま指している扇形を読ませます。</strong>円には <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tabIndex</code> が付いていて、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> は「区分名: 値（割合）」の形で、いま選ばれている扇形を読みます。ポインタでもキーボードでも同じ扇形が選ばれ、選択中の扇形は色を変えるのではなく、上に明るさを変える層を重ねて示します。
            </li>
            <li>
                <strong>凡例は既定で出しません。区切り線はまだ持っていません。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showLegend</code> を on にすると、区分の名前と割合、そして「Total:」に続けてその区分の実数が並びます。資料は割合を必ず文字で出すことを求めているので、凡例を切るなら図の周りに割合を書いてください。資料が挙げるもう1つの手当て「扇形どうしの境目に背景色の細い線を入れる」は、GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PieChart</code> にはまだありません。色が近い区分が隣り合うときは、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">color</code> で明度の離れた色を指定します。数値の整形は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> のほかに、サーバーコンポーネントからも渡せる <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> を持っています（#338）。
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/pie-chart"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: 円グラフ（Pie Chart）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>The pie is a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code>, not an SVG.</strong> The slices are a background painted on a single div, and the shares are computed from the values in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> — you never pass percentages in. Negative values are treated as zero so the circle survives a data set that sums to nothing.
            </li>
            <li>
                <strong>The figure carries a name, and it reads the slice you are on.</strong> The wheel has <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tabIndex</code>, and its <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> reads “segment: value (share)” for whichever slice is currently selected. Pointer and keyboard select the same slice, and the selected one is marked by a luminance layer laid over it rather than by a colour change.
            </li>
            <li>
                <strong>The legend is off by default, and there are no separator lines yet.</strong> Turning <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showLegend</code> on lists each name with its share and, under a “Total:” label, that segment&rsquo;s own raw value. The article insists the share always be written out, so if you drop the legend, put the percentages in the copy around the chart. Its other remedy — a hairline in the background colour between slices — is not in GUNJO&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PieChart</code> yet; when similar hues end up adjacent, pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">color</code> values that differ in lightness. Alongside <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> this chart also takes the serializable <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code>, which a Server Component can pass (#338).
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/pie-chart"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: Pie Chart (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function PieChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return (
        <ChartDocPage
            designDecisions={designDecisions}
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
