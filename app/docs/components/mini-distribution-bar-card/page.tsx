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

const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];

export function ProductCategoryDistribution() {
    return (
        <MiniDistributionBarCard
          title="Product categories"
          value="58%"
          segments={segments}
          selectedIndex={0}
        />
    );
}`, ja: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];

export function ProductCategoryDistribution() {
    return <MiniDistributionBarCard
      title="商品カテゴリ"
      value="58%"
      segments={segments}
      selectedIndex={0}
    />;
}` } as const;
const usageCode = { en: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];

export function ProductCategoryDistributionVariants() {
    return (
        <div className="grid gap-6">
            <MiniDistributionBarCard segments={segments} value="58%" />
            <MiniDistributionBarCard segments={segments} selectedIndex={1} />
            <MiniDistributionBarCard segments={segments} variant="compact" />
        </div>
    );
}`, ja: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];

export function ProductCategoryDistributionVariants() {
    return (
        <div className="grid gap-6">
            <MiniDistributionBarCard segments={segments} value="58%" />
            <MiniDistributionBarCard segments={segments} selectedIndex={1} />
            <MiniDistributionBarCard segments={segments} variant="compact" />
        </div>
    );
}` } as const;
const propsData = { en: [{"name":"segments","type":"MiniDistributionBarCardSegment[]","description":"Distribution segments rendered as ticks and summary rows."},{"name":"variant","type":"\"default\" | \"compact\"","description":"Registered SSOT variant for card density.","default":"\"default\""},{"name":"tickCount","type":"number","description":"Number of compact ticks used to represent the distribution.","default":"32"},{"name":"formatValue","type":"(value: number) => ReactNode","description":"Formats segment values shown in tooltips and legend rows. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting."},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)"}], ja: [{"name":"segments","type":"MiniDistributionBarCardSegment[]","description":"ティックと概要行で表示する分布セグメントです。"},{"name":"variant","type":"\"default\" | \"compact\"","description":"カード密度を切り替える SSOT 登録済みバリエーションです。","default":"\"default\""},{"name":"tickCount","type":"number","description":"分布を表現するコンパクトなティック数です。","default":"32"},{"name":"formatValue","type":"(value: number) => ReactNode","description":"ツールチップと凡例行に表示するセグメント値を整形します。 関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。"},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard category distribution card.", preview: <MiniDistributionBarCard title="Product categories" description="Mini distribution" value="58%" delta="+3.2%" segments={segmentsByLocale.en} selectedIndex={0} />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];

export function ProductCategoryDistribution() {
    return (
        <MiniDistributionBarCard
          title="Product categories"
          value="58%"
          segments={segments}
          selectedIndex={0}
        />
    );
}` }, { key: "selected", title: "Selected segment", description: "Highlights the segment currently being inspected.", preview: <MiniDistributionBarCard title="Product categories" value="26%" segments={segmentsByLocale.en} selectedIndex={1} />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];

export function SelectedCategoryDistribution() {
    return <MiniDistributionBarCard segments={segments} selectedIndex={1} />;
}` }, { key: "compact", title: "Compact", description: "Compact registered variant for dense dashboards.", preview: <MiniDistributionBarCard title="Product categories" segments={segmentsByLocale.en} variant="compact" />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];

export function CompactCategoryDistribution() {
    return <MiniDistributionBarCard segments={segments} variant="compact" />;
}` }, { key: "ticks", title: "More ticks", description: "Checks denser tick resolution.", preview: <MiniDistributionBarCard title="Product categories" segments={segmentsByLocale.en} tickCount={48} />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "Accessories", value: 58, detail: "45 products" },
    { label: "Devices", value: 26, detail: "53 products" },
    { label: "Services", value: 16, detail: "61 products" },
];

export function DenseTickCategoryDistribution() {
    return <MiniDistributionBarCard segments={segments} tickCount={48} />;
}` }], ja: [{ key: "default", title: "標準表示", description: "商品カテゴリの分布を標準カードで示します。", preview: <MiniDistributionBarCard title="商品カテゴリ" description="ミニ分布" value="58%" delta="+3.2%" segments={segmentsByLocale.ja} selectedIndex={0} />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];

export function ProductCategoryDistribution() {
    return <MiniDistributionBarCard
      title="商品カテゴリ"
      value="58%"
      segments={segments}
      selectedIndex={0}
    />;
}` }, { key: "selected", title: "選択中セグメント", description: "確認中のセグメントを強調します。", preview: <MiniDistributionBarCard title="商品カテゴリ" value="26%" segments={segmentsByLocale.ja} selectedIndex={1} />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];

export function SelectedCategoryDistribution() {
    return <MiniDistributionBarCard segments={segments} selectedIndex={1} />;
}` }, { key: "compact", title: "コンパクト", description: "密度の高いダッシュボード向けの登録済みバリエーションです。", preview: <MiniDistributionBarCard title="商品カテゴリ" segments={segmentsByLocale.ja} variant="compact" />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];

export function CompactCategoryDistribution() {
    return <MiniDistributionBarCard segments={segments} variant="compact" />;
}` }, { key: "ticks", title: "ティック多め", description: "より細かいティック分割を確認します。", preview: <MiniDistributionBarCard title="商品カテゴリ" segments={segmentsByLocale.ja} tickCount={48} />, previewBodyWidth: "md", code: `import { MiniDistributionBarCard } from "@gunjo/ui";

const segments = [
    { label: "アクセサリ", value: 58, detail: "45 件" },
    { label: "デバイス", value: 26, detail: "53 件" },
    { label: "サービス", value: 16, detail: "61 件" },
];

export function DenseTickCategoryDistribution() {
    return <MiniDistributionBarCard segments={segments} tickCount={48} />;
}` }] } as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>帯を32個の目盛りに割った。</strong>1本の連続した帯ではなく、既定で32個（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tickCount</code>）の四角に分け、各区分の取り分だけ色を塗ります。割り当ては端数の大きい区分から1つずつ足す形なので、塗った数の合計は必ず <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tickCount</code> に一致します。1%未満の区分が消えてしまわないための形です。
            </li>
            <li>
                <strong>目盛りの1つずつが押せるボタンになっている。</strong>それぞれに「区分名: NN%」という読み上げ名を付け、下の一覧の行と同じ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onSegmentSelect</code> を呼びます。資料の「カードのアクションは最大2つ」に対して、GUNJO はここを「複数のアクション」ではなく「同じ1つの選択に対する複数の入口」と見なしました。カードの外枠は押せません。
            </li>
            <li>
                <strong>分母はデータから作り、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> で上書きできる。</strong>既定の分母は区分の合計です。分母を固定したい（未回答のぶんを空けておきたい）ときだけ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> を渡します。負の値と数値でない値は0として扱い、帯が壊れないようにしています。
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
        </>
    ),
    en: (
        <>
            <li>
                <strong>The bar is cut into 32 ticks.</strong> Instead of one continuous bar, the card draws <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tickCount</code> (32 by default) small blocks and colours each segment&rsquo;s share of them. Ticks are handed out largest-remainder first, so the coloured blocks always add up to exactly <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tickCount</code>, which is how a sub-1% segment stays visible.
            </li>
            <li>
                <strong>Every tick is its own button.</strong> Each carries a segment-and-percentage accessible name and calls the same <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onSegmentSelect</code> as the legend row below. Against the article&rsquo;s two-actions-maximum rule, GUNJO reads these not as many actions but as many doors into one selection. The card shell itself stays inert.
            </li>
            <li>
                <strong>The denominator comes from the data and can be overridden with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code>.</strong> By default it is the sum of the segments. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> only when the denominator must stay fixed (for example to leave the un-answered share empty). Negative and non-finite values are treated as zero so the bar cannot break.
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
        </>
    ),
};

export default function MiniDistributionBarCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.miniDistributionBarCard.title, ja: "ミニ分布バーカード" }} description={{ en: meta.miniDistributionBarCard.description, ja: "カテゴリ構成や利用率を、密集したティックと概要行で示すカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="mini-distribution-bar-card" embedBase="/embed/mini-distribution-bar-card" previewHeight={420} states={states} usedComponents={{ en: [{ name: "MiniDistributionBarCard", href: "/docs/components/mini-distribution-bar-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "ミニ分布バーカード", href: "/docs/components/mini-distribution-bar-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"DistributionBar","href":"/docs/components/distribution-bar"},{"name":"Statistic","href":"/docs/components/statistic"}], ja: [{"name":"分布バー","href":"/docs/components/distribution-bar"},{"name":"統計","href":"/docs/components/statistic"}] }} />;
}
