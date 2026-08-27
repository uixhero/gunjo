"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { SegmentedGaugeCard } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof SegmentedGaugeCard>["segments"][number];
const segmentsByLocale: Record<Locale, DataItem[]> = { en: [{ label: "Essentials", value: 35, rangeLabel: "Fixed" }, { label: "Growth", value: 45, rangeLabel: "Investment" }, { label: "Operations", value: 20, rangeLabel: "Capacity" }], ja: [{ label: "基礎費", value: 35, rangeLabel: "固定費" }, { label: "成長投資", value: 45, rangeLabel: "追加投資" }, { label: "運用費", value: 20, rangeLabel: "運用余力" }] };

const segmentsCode = {
    en: `const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];`,
    ja: `const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];`,
} as const;

const code = { en: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];

export function SpendBreakdownGauge() {
    return (
        <SegmentedGaugeCard
            title="Spend breakdown"
            description="Segmented gauge"
            value={82}
            valueLabel="82%"
            centerLabel="Current spend"
            delta="45%"
            deltaDescription="Share of the selected segment."
            segments={segments}
            selectedIndex={1}
            targetValue={90}
            targetLabel="Target spend"
            max={100}
            formatValue={(value) => value + "%"}
            totalLabel="Total"
            caption="Inspect spend, progress, or risk status with segmented gauge ranges."
        />
    );
}`, ja: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];

export function SpendBreakdownGauge() {
    return (
        <SegmentedGaugeCard
            title="支出内訳"
            description="セグメントゲージ"
            value={82}
            valueLabel="82%"
            centerLabel="現在の支出"
            delta="45%"
            deltaDescription="選択したセグメントの構成比です。"
            segments={segments}
            selectedIndex={1}
            targetValue={90}
            targetLabel="目標支出"
            max={100}
            formatValue={(value) => value + "%"}
            totalLabel="合計"
            caption="支出・進捗・リスクをセグメント付きの半円ゲージで確認します。"
        />
    );
}` } as const;
const usageCode = { en: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];

export function SpendBreakdownGaugeVariants() {
    return (
        <div className="grid gap-6">
            <SegmentedGaugeCard
              segments={segments}
              value={82}
              targetValue={90}
              max={100}
            />
            <SegmentedGaugeCard segments={segments} selectedIndex={1} />
            <SegmentedGaugeCard
              segments={segments}
              variant="compact"
              showLegend={false}
            />
        </div>
    );
}`, ja: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];

export function SpendBreakdownGaugeVariants() {
    return (
        <div className="grid gap-6">
            <SegmentedGaugeCard
              segments={segments}
              value={82}
              targetValue={90}
              max={100}
            />
            <SegmentedGaugeCard segments={segments} selectedIndex={1} />
            <SegmentedGaugeCard
              segments={segments}
              variant="compact"
              showLegend={false}
            />
        </div>
    );
}` } as const;
const propsData = { en: [{"name":"segments","type":"SegmentedGaugeCardSegment[]","description":"Gauge segments rendered across the semicircle arc."},{"name":"value / valueLabel","type":"number / ReactNode","description":"Current value and the display label shown in the gauge center."},{"name":"centerLabel","type":"ReactNode","description":"Label shown below the center value."},{"name":"delta / deltaDescription","type":"ReactNode","description":"Supplementary metric and explanation shown in the card header."},{"name":"targetValue / targetLabel","type":"number / ReactNode","description":"Optional target marker and tooltip label."},{"name":"selectedIndex","type":"number","description":"Highlights the inspected segment."},{"name":"max","type":"number","description":"Maximum gauge scale used for segment and target normalization."},{"name":"showLegend","type":"boolean","description":"Shows segment legend rows below the gauge.","default":"true"},{"name":"formatValue","type":"(value: number) => ReactNode","description":"Formats each value. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting."},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)"}], ja: [{"name":"segments","type":"SegmentedGaugeCardSegment[]","description":"半円アークに表示するゲージセグメントです。"},{"name":"value / valueLabel","type":"number / ReactNode","description":"現在値とゲージ中央に表示するラベルです。"},{"name":"centerLabel","type":"ReactNode","description":"中央値の下に表示するラベルです。"},{"name":"delta / deltaDescription","type":"ReactNode","description":"カードヘッダーに表示する補助指標と説明です。"},{"name":"targetValue / targetLabel","type":"number / ReactNode","description":"任意の目標マーカーとツールチップ用ラベルです。"},{"name":"selectedIndex","type":"number","description":"確認中のセグメントを強調します。"},{"name":"max","type":"number","description":"セグメントと目標値の正規化に使う最大値です。"},{"name":"showLegend","type":"boolean","description":"ゲージ下にセグメント凡例を表示します。","default":"true"},{"name":"formatValue","type":"(value: number) => ReactNode","description":"各値を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。"},{"name":"valueFormat","type":"\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions","description":"シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)"}] } as const;
const states = { en: [{ key: "default", title: "Default", description: "Standard segmented gauge card.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.en} />, previewBodyWidth: "md", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];

export function SpendBreakdownGauge() {
    return (
        <SegmentedGaugeCard
          title="Spend breakdown"
          segments={segments}
          value={82}
          valueLabel="82%"
          targetValue={90}
        />
    );
}` }, { key: "selected", title: "Selected segment", description: "Highlights one range segment.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.en} selectedIndex={1} />, previewBodyWidth: "md", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];

export function SelectedSegmentSpendGauge() {
    return (
        <SegmentedGaugeCard
          title="Spend breakdown"
          segments={segments}
          value={82}
          valueLabel="82%"
          targetValue={90}
          selectedIndex={1}
        />
    );
}` }, { key: "no-legend", title: "No legend", description: "Hides legend rows when the parent owns details.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.en} showLegend={false} />, previewBodyWidth: "md", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];

export function SpendBreakdownGaugeWithoutLegend() {
    return (
        <SegmentedGaugeCard
          title="Spend breakdown"
          segments={segments}
          value={82}
          valueLabel="82%"
          targetValue={90}
          showLegend={false}
        />
    );
}` }, { key: "compact", title: "Compact", description: "Compact density for small cards.", preview: <SegmentedGaugeCard title="Spend breakdown" value={82} valueLabel="82%" segments={segmentsByLocale.en} variant="compact" />, previewBodyWidth: "sm", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "Essentials", value: 35, rangeLabel: "Fixed" },
    { label: "Growth", value: 45, rangeLabel: "Investment" },
    { label: "Operations", value: 20, rangeLabel: "Capacity" },
];

export function CompactSpendBreakdownGauge() {
    return (
        <SegmentedGaugeCard
          title="Spend breakdown"
          segments={segments}
          value={82}
          valueLabel="82%"
          variant="compact"
        />
    );
}` }], ja: [{ key: "default", title: "標準表示", description: "標準のセグメントゲージカードです。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.ja} />, previewBodyWidth: "md", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];

export function SpendBreakdownGauge() {
    return (
        <SegmentedGaugeCard
          title="支出内訳"
          segments={segments}
          value={82}
          valueLabel="82%"
          targetValue={90}
        />
    );
}` }, { key: "selected", title: "選択セグメント", description: "確認中の範囲セグメントを強調します。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.ja} selectedIndex={1} />, previewBodyWidth: "md", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];

export function SelectedSegmentSpendGauge() {
    return (
        <SegmentedGaugeCard
          title="支出内訳"
          segments={segments}
          value={82}
          valueLabel="82%"
          targetValue={90}
          selectedIndex={1}
        />
    );
}` }, { key: "no-legend", title: "凡例なし", description: "親ビュー側で詳細を持つ場合は凡例行を隠せます。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" targetValue={90} segments={segmentsByLocale.ja} showLegend={false} />, previewBodyWidth: "md", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];

export function SpendBreakdownGaugeWithoutLegend() {
    return (
        <SegmentedGaugeCard
          title="支出内訳"
          segments={segments}
          value={82}
          valueLabel="82%"
          targetValue={90}
          showLegend={false}
        />
    );
}` }, { key: "compact", title: "コンパクト", description: "小さなカード向けの密度です。", preview: <SegmentedGaugeCard title="支出内訳" value={82} valueLabel="82%" segments={segmentsByLocale.ja} variant="compact" />, previewBodyWidth: "sm", code: `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
    { label: "基礎費", value: 35, rangeLabel: "固定費" },
    { label: "成長投資", value: 45, rangeLabel: "追加投資" },
    { label: "運用費", value: 20, rangeLabel: "運用余力" },
];

export function CompactSpendBreakdownGauge() {
    return (
        <SegmentedGaugeCard
          title="支出内訳"
          segments={segments}
          value={82}
          valueLabel="82%"
          variant="compact"
        />
    );
}` }] } as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>半円のメーターも <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code> で描いた。</strong>SVG は使わず、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">from 270deg</code> の円錐グラデーションを「1%＝1.8度」で回して半円を作ります。区分ごとに色を指定でき、太さは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thickness</code> で変えられます。
            </li>
            <li>
                <strong>目標値は針ではなく、独立した目印として置いた。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">targetValue</code> を渡すと、現在値とは別の印が同じ弧の上に出ます。針を1本にして「いまの値か目標値か」を色だけで分けると、色を見分けられない人に届かなくなるためです。
            </li>
            <li>
                <strong>弧は1枚の絵で、選ぶのは凡例の行。</strong>弧には <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> と読み上げ用の名前が付き、押せるのは下の凡例（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code>）です。弧の一片は端に行くほど細くなり、タップの的として使えないためです。
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
                <strong>The half-circle gauge is a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">conic-gradient</code> too.</strong> No SVG: a conic gradient starting <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">from 270deg</code> is stepped at 1.8 degrees per percent to sweep a half circle. Each band can carry its own colour and the arc width is set with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thickness</code>.
            </li>
            <li>
                <strong>The target is a separate mark, not a second needle.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">targetValue</code> and it appears on the same arc, distinct from the current value. Using one needle and separating current from target by colour alone would fail anyone who cannot tell those colours apart.
            </li>
            <li>
                <strong>The arc is one image; picking happens in the legend.</strong> The arc carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> and a spoken name, and the pressable elements are the legend rows (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code>) below it. Arc bands narrow toward the ends, so they make poor tap targets.
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

export default function SegmentedGaugeCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.segmentedGaugeCard.title, ja: "セグメントゲージカード" }} description={{ en: meta.segmentedGaugeCard.description, ja: "現在値、目標値、範囲セグメントを半円ゲージで示すカードです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="segmented-gauge-card" embedBase="/embed/segmented-gauge-card" previewHeight={460} states={states} usedComponents={{ en: [{ name: "SegmentedGaugeCard", href: "/docs/components/segmented-gauge-card" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "セグメントゲージカード", href: "/docs/components/segmented-gauge-card" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"GaugeChart","href":"/docs/components/gauge-chart"},{"name":"RadialBarChart","href":"/docs/components/radial-bar-chart"}], ja: [{"name":"ゲージチャート","href":"/docs/components/gauge-chart"},{"name":"ラジアルバーチャート","href":"/docs/components/radial-bar-chart"}] }} />;
}
