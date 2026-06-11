"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { MiniDistributionBarCard } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof MiniDistributionBarCard>["segments"][number];
const segmentsByLocale: Record<Locale, DataItem[]> = { en: [{ label: "Accessories", value: 58, detail: "45 products" }, { label: "Devices", value: 26, detail: "53 products" }, { label: "Services", value: 16, detail: "61 products" }], ja: [{ label: "アクセサリ", value: 58, detail: "45 件" }, { label: "デバイス", value: 26, detail: "53 件" }, { label: "サービス", value: 16, detail: "61 件" }] };

const segmentsCode = {
    en: `const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];`,
    ja: `const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];`,
} as const;

const code = { en: `import { MiniDistributionBarCard } from "@gunjo/ui";

${segmentsCode.en}

<MiniDistributionBarCard title="Product categories" value="58%" segments={segments} selectedIndex={0} />`, ja: `import { MiniDistributionBarCard } from "@gunjo/ui";

${segmentsCode.ja}

<MiniDistributionBarCard title="商品カテゴリ" value="58%" segments={segments} selectedIndex={0} />` } as const;
const usageCode = { en: `${segmentsCode.en}

<MiniDistributionBarCard segments={segments} value="58%" />
<MiniDistributionBarCard segments={segments} selectedIndex={1} />
<MiniDistributionBarCard segments={segments} variant="compact" />`, ja: `${segmentsCode.ja}

<MiniDistributionBarCard segments={segments} value="58%" />
<MiniDistributionBarCard segments={segments} selectedIndex={1} />
<MiniDistributionBarCard segments={segments} variant="compact" />` } as const;
const propsData = { en: [{"name":"segments","type":"MiniDistributionBarCardSegment[]","description":"Distribution segments rendered as ticks and summary rows."},{"name":"variant","type":"\"default\" | \"compact\"","description":"Registered SSOT variant for card density.","default":"\"default\""},{"name":"tickCount","type":"number","description":"Number of compact ticks used to represent the distribution.","default":"32"}], ja: [{"name":"segments","type":"MiniDistributionBarCardSegment[]","description":"ティックと概要行で表示する分布セグメントです。"},{"name":"variant","type":"\"default\" | \"compact\"","description":"カード密度を切り替える SSOT 登録済みバリエーションです。","default":"\"default\""},{"name":"tickCount","type":"number","description":"分布を表現するコンパクトなティック数です。","default":"32"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard category distribution card.", preview: <MiniDistributionBarCard title="Product categories" description="Mini distribution" value="58%" delta="+3.2%" segments={segmentsByLocale.en} selectedIndex={0} />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<MiniDistributionBarCard title="Product categories" value="58%" segments={segments} selectedIndex={0} />` }, { key: "selected", title: "Selected segment", description: "Highlights the segment currently being inspected.", preview: <MiniDistributionBarCard title="Product categories" value="26%" segments={segmentsByLocale.en} selectedIndex={1} />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<MiniDistributionBarCard segments={segments} selectedIndex={1} />` }, { key: "compact", title: "Compact", description: "Compact registered variant for dense dashboards.", preview: <MiniDistributionBarCard title="Product categories" segments={segmentsByLocale.en} variant="compact" />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<MiniDistributionBarCard segments={segments} variant="compact" />` }, { key: "ticks", title: "More ticks", description: "Checks denser tick resolution.", preview: <MiniDistributionBarCard title="Product categories" segments={segmentsByLocale.en} tickCount={48} />, previewBodyWidth: "md", code: `${segmentsCode.en}\n\n<MiniDistributionBarCard segments={segments} tickCount={48} />` }], ja: [{ key: "default", title: "標準表示", description: "商品カテゴリの分布を標準カードで示します。", preview: <MiniDistributionBarCard title="商品カテゴリ" description="ミニ分布" value="58%" delta="+3.2%" segments={segmentsByLocale.ja} selectedIndex={0} />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<MiniDistributionBarCard title="商品カテゴリ" value="58%" segments={segments} selectedIndex={0} />` }, { key: "selected", title: "選択中セグメント", description: "確認中のセグメントを強調します。", preview: <MiniDistributionBarCard title="商品カテゴリ" value="26%" segments={segmentsByLocale.ja} selectedIndex={1} />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<MiniDistributionBarCard segments={segments} selectedIndex={1} />` }, { key: "compact", title: "コンパクト", description: "密度の高いダッシュボード向けの登録済みバリエーションです。", preview: <MiniDistributionBarCard title="商品カテゴリ" segments={segmentsByLocale.ja} variant="compact" />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<MiniDistributionBarCard segments={segments} variant="compact" />` }, { key: "ticks", title: "ティック多め", description: "より細かいティック分割を確認します。", preview: <MiniDistributionBarCard title="商品カテゴリ" segments={segmentsByLocale.ja} tickCount={48} />, previewBodyWidth: "md", code: `${segmentsCode.ja}\n\n<MiniDistributionBarCard segments={segments} tickCount={48} />` }] } as const;

export default function MiniDistributionBarCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage title={{ en: meta.miniDistributionBarCard.title, ja: "ミニ分布バーカード" }} description={{ en: meta.miniDistributionBarCard.description, ja: "カテゴリ構成や利用率を、密集したティックと概要行で示すカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="mini-distribution-bar-card" embedBase="/embed/mini-distribution-bar-card" previewHeight={420} states={states} usedComponents={{ en: [{ name: "MiniDistributionBarCard", href: "/docs/components/mini-distribution-bar-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "ミニ分布バーカード", href: "/docs/components/mini-distribution-bar-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"DistributionBar","href":"/docs/components/distribution-bar"},{"name":"Statistic","href":"/docs/components/statistic"}], ja: [{"name":"分布バー","href":"/docs/components/distribution-bar"},{"name":"統計","href":"/docs/components/statistic"}] }} />;
}
