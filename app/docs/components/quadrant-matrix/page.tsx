"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { QuadrantMatrix } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof QuadrantMatrix>["items"][number];
const itemsByLocale: Record<Locale, DataItem[]> = { en: [{ id: "activation", label: "Activation", description: "High impact", value: 88, x: 72, y: 34 }, { id: "expansion", label: "Expansion", description: "Scale candidate", value: 76, x: 58, y: 24 }, { id: "retention", label: "Retention", description: "Strong fit", value: 64, x: 42, y: 44 }, { id: "risk", label: "Risk", description: "Needs review", value: 52, x: 30, y: 72 }], ja: [{ id: "activation", label: "活性化", description: "高い効果", value: 88, x: 72, y: 34 }, { id: "expansion", label: "拡張", description: "拡大候補", value: 76, x: 58, y: 24 }, { id: "retention", label: "継続", description: "適合度が高い", value: 64, x: 42, y: 44 }, { id: "risk", label: "リスク", description: "確認が必要", value: 52, x: 30, y: 72 }] };

const itemsCode = {
    en: `const items = [
    { id: "activation", label: "Activation", description: "High impact", value: 88, x: 72, y: 34 },
    { id: "expansion", label: "Expansion", description: "Scale candidate", value: 76, x: 58, y: 24 },
    { id: "retention", label: "Retention", description: "Strong fit", value: 64, x: 42, y: 44 },
    { id: "risk", label: "Risk", description: "Needs review", value: 52, x: 30, y: 72 },
];`,
    ja: `const items = [
    { id: "activation", label: "活性化", description: "高い効果", value: 88, x: 72, y: 34 },
    { id: "expansion", label: "拡張", description: "拡大候補", value: 76, x: 58, y: 24 },
    { id: "retention", label: "継続", description: "適合度が高い", value: 64, x: 42, y: 44 },
    { id: "risk", label: "リスク", description: "確認が必要", value: 52, x: 30, y: 72 },
];`,
} as const;

const quadrantLabelsCode = {
    en: `const quadrantLabels = {
    topLeft: "Strategic",
    topRight: "Scale",
    bottomLeft: "Review",
    bottomRight: "Efficient",
};`,
    ja: `const quadrantLabels = {
    topLeft: "戦略",
    topRight: "拡大",
    bottomLeft: "見直し",
    bottomRight: "効率",
};`,
} as const;

const code = { en: `import { QuadrantMatrix } from "@gunjo/ui";

${itemsCode.en}

${quadrantLabelsCode.en}

<QuadrantMatrix
    items={items}
    selectedId="activation"
    xAxisLabel="Reach"
    yAxisLabel="Impact"
    quadrantLabels={quadrantLabels}
    showRanking
/>`, ja: `import { QuadrantMatrix } from "@gunjo/ui";

${itemsCode.ja}

${quadrantLabelsCode.ja}

<QuadrantMatrix
    items={items}
    selectedId="activation"
    xAxisLabel="到達範囲"
    yAxisLabel="影響度"
    quadrantLabels={quadrantLabels}
    showRanking
/>` } as const;
const usageCode = { en: `${itemsCode.en}

${quadrantLabelsCode.en}

<QuadrantMatrix
    items={items}
    xAxisLabel="Reach"
    yAxisLabel="Impact"
    quadrantLabels={quadrantLabels}
/>
<QuadrantMatrix items={items} selectedId="activation" showRanking />
<QuadrantMatrix items={items} rankingPlacement="bottom" />`, ja: `${itemsCode.ja}

${quadrantLabelsCode.ja}

<QuadrantMatrix
    items={items}
    xAxisLabel="到達範囲"
    yAxisLabel="影響度"
    quadrantLabels={quadrantLabels}
/>
<QuadrantMatrix items={items} selectedId="activation" showRanking />
<QuadrantMatrix items={items} rankingPlacement="bottom" />` } as const;
const propsData = { en: [{"name":"items","type":"QuadrantMatrixItem[]","description":"Items plotted by percentage x/y coordinates and ranked by value."},{"name":"xAxisLabel","type":"ReactNode","description":"Label shown along the horizontal axis."},{"name":"yAxisLabel","type":"ReactNode","description":"Label shown along the vertical axis."},{"name":"quadrantLabels","type":"QuadrantMatrixLabels","description":"Labels for the top-left, top-right, bottom-left, and bottom-right quadrants."},{"name":"variant","type":"\"default\" | \"compact\"","description":"Registered SSOT variant for matrix height and point scale.","default":"\"default\""},{"name":"rankingPlacement","type":"\"side\" | \"bottom\"","description":"Controls whether ranking sits beside or below the matrix.","default":"\"side\""},{"name":"formatValue","type":"(value: number) => ReactNode","description":"Formats each value. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting."},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)"}], ja: [{"name":"items","type":"QuadrantMatrixItem[]","description":"パーセントの x/y 座標に配置し、値でランキングする項目です。"},{"name":"xAxisLabel","type":"ReactNode","description":"横軸のラベルを表示します。"},{"name":"yAxisLabel","type":"ReactNode","description":"縦軸のラベルを表示します。"},{"name":"quadrantLabels","type":"QuadrantMatrixLabels","description":"左上、右上、左下、右下の象限ラベルを指定します。"},{"name":"variant","type":"\"default\" | \"compact\"","description":"マトリクスの高さと点サイズを切り替える SSOT 登録済みバリエーションです。","default":"\"default\""},{"name":"rankingPlacement","type":"\"side\" | \"bottom\"","description":"ランキングを横または下に配置します。","default":"\"side\""},{"name":"formatValue","type":"(value: number) => ReactNode","description":"各値を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。"},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Matrix with side ranking.", preview: <QuadrantMatrix items={itemsByLocale.en} xAxisLabel="Reach" yAxisLabel="Impact" showRanking />, previewBodyWidth: "xl", code: `${itemsCode.en}\n\n${quadrantLabelsCode.en}\n\n<QuadrantMatrix items={items} xAxisLabel="Reach" yAxisLabel="Impact" quadrantLabels={quadrantLabels} showRanking />` }, { key: "selected", title: "Selected item", description: "Highlights the inspected item.", preview: <QuadrantMatrix items={itemsByLocale.en} selectedId="activation" xAxisLabel="Reach" yAxisLabel="Impact" showRanking />, previewBodyWidth: "xl", code: `${itemsCode.en}\n\n${quadrantLabelsCode.en}\n\n<QuadrantMatrix items={items} selectedId="activation" xAxisLabel="Reach" yAxisLabel="Impact" quadrantLabels={quadrantLabels} showRanking />` }, { key: "bottom", title: "Bottom ranking", description: "Moves ranking below the matrix for narrower containers.", preview: <QuadrantMatrix items={itemsByLocale.en} rankingPlacement="bottom" rankingLimit={3} />, previewBodyWidth: "lg", code: `${itemsCode.en}\n\n<QuadrantMatrix items={items} rankingPlacement="bottom" rankingLimit={3} />` }, { key: "compact", title: "Compact", description: "Compact variant with limited ranking.", preview: <QuadrantMatrix items={itemsByLocale.en} variant="compact" rankingLimit={3} />, previewBodyWidth: "md", code: `${itemsCode.en}\n\n<QuadrantMatrix items={items} variant="compact" rankingLimit={3} />` }], ja: [{ key: "default", title: "標準表示", description: "横にランキングを置いた標準表示です。", preview: <QuadrantMatrix items={itemsByLocale.ja} xAxisLabel="到達範囲" yAxisLabel="影響度" showRanking />, previewBodyWidth: "xl", code: `${itemsCode.ja}\n\n${quadrantLabelsCode.ja}\n\n<QuadrantMatrix items={items} xAxisLabel="到達範囲" yAxisLabel="影響度" quadrantLabels={quadrantLabels} showRanking />` }, { key: "selected", title: "選択項目", description: "確認中の項目を強調します。", preview: <QuadrantMatrix items={itemsByLocale.ja} selectedId="activation" xAxisLabel="到達範囲" yAxisLabel="影響度" showRanking />, previewBodyWidth: "xl", code: `${itemsCode.ja}\n\n${quadrantLabelsCode.ja}\n\n<QuadrantMatrix items={items} selectedId="activation" xAxisLabel="到達範囲" yAxisLabel="影響度" quadrantLabels={quadrantLabels} showRanking />` }, { key: "bottom", title: "下部ランキング", description: "狭い領域向けにランキングを下へ移動します。", preview: <QuadrantMatrix items={itemsByLocale.ja} rankingPlacement="bottom" rankingLimit={3} />, previewBodyWidth: "lg", code: `${itemsCode.ja}\n\n<QuadrantMatrix items={items} rankingPlacement="bottom" rankingLimit={3} />` }, { key: "compact", title: "コンパクト", description: "ランキング数を絞ったコンパクト表示です。", preview: <QuadrantMatrix items={itemsByLocale.ja} variant="compact" rankingLimit={3} />, previewBodyWidth: "md", code: `${itemsCode.ja}\n\n<QuadrantMatrix items={items} variant="compact" rankingLimit={3} />` }] } as const;

export default function QuadrantMatrixPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.quadrantMatrix.title, ja: "4象限マトリクス" }} description={{ en: meta.quadrantMatrix.description, ja: "項目を x/y 位置で配置し、値のランキングも確認できる4象限マトリクスです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="quadrant-matrix" embedBase="/embed/quadrant-matrix" previewHeight={500} states={states} usedComponents={{ en: [{ name: "QuadrantMatrix", href: "/docs/components/quadrant-matrix" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "4象限マトリクス", href: "/docs/components/quadrant-matrix" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"RadarChart","href":"/docs/components/radar-chart"},{"name":"AnalyticsCard","href":"/docs/components/analytics-card"}], ja: [{"name":"レーダーチャート","href":"/docs/components/radar-chart"},{"name":"分析カード","href":"/docs/components/analytics-card"}] }} />;
}
