"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { LineChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type LineSeries = ComponentProps<typeof LineChart>["series"][number];

const seriesByLocale: Record<Locale, LineSeries[]> = {
    en: [
        { label: "Revenue", color: "primary", data: [{ label: "Jan", value: 42 }, { label: "Feb", value: 58 }, { label: "Mar", value: 36 }, { label: "Apr", value: 68 }, { label: "May", value: 51 }, { label: "Jun", value: 74 }] },
        { label: "Target", color: "success", data: [{ label: "Jan", value: 46 }, { label: "Feb", value: 52 }, { label: "Mar", value: 48 }, { label: "Apr", value: 64 }, { label: "May", value: 56 }, { label: "Jun", value: 78 }] },
    ],
    ja: [
        { label: "売上", color: "primary", data: [{ label: "1月", value: 42 }, { label: "2月", value: 58 }, { label: "3月", value: 36 }, { label: "4月", value: 68 }, { label: "5月", value: 51 }, { label: "6月", value: 74 }] },
        { label: "目標", color: "success", data: [{ label: "1月", value: 46 }, { label: "2月", value: 52 }, { label: "3月", value: 48 }, { label: "4月", value: 64 }, { label: "5月", value: 56 }, { label: "6月", value: 78 }] },
    ],
};

const seriesCode = {
    en: "const series = [\n  { label: \"Revenue\", color: \"primary\", data: [{ label: \"Jan\", value: 42 }, { label: \"Feb\", value: 58 }, { label: \"Mar\", value: 36 }] },\n  { label: \"Target\", color: \"success\", data: [{ label: \"Jan\", value: 46 }, { label: \"Feb\", value: 52 }, { label: \"Mar\", value: 48 }] },\n];",
    ja: "const series = [\n  { label: \"売上\", color: \"primary\", data: [{ label: \"1月\", value: 42 }, { label: \"2月\", value: 58 }, { label: \"3月\", value: 36 }] },\n  { label: \"目標\", color: \"success\", data: [{ label: \"1月\", value: 46 }, { label: \"2月\", value: 52 }, { label: \"3月\", value: 48 }] },\n];",
} as const;

const code = { en: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "Revenue",
    color: "primary",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 36 },
    ],
  },
  {
    label: "Target",
    color: "success",
    data: [
      { label: "Jan", value: 46 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
    ],
  },
];

export function RevenueComparison() {
  return <LineChart
    series={series}
    variant="area"
    referenceValue={55}
    referenceLabel="Average"
    showLegend
  />;
}`, ja: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "売上",
    color: "primary",
    data: [
      { label: "1月", value: 42 },
      { label: "2月", value: 58 },
      { label: "3月", value: 36 },
    ],
  },
  {
    label: "目標",
    color: "success",
    data: [
      { label: "1月", value: 46 },
      { label: "2月", value: 52 },
      { label: "3月", value: 48 },
    ],
  },
];

export function RevenueComparison() {
  return <LineChart
    series={series}
    variant="area"
    referenceValue={55}
    referenceLabel="平均"
    showLegend
  />;
}` } as const;
const usageCode = { en: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "Revenue",
    color: "primary",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 36 },
    ],
  },
  {
    label: "Target",
    color: "success",
    data: [
      { label: "Jan", value: 46 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
    ],
  },
];

export function RevenueTrendVariants() {
    return (
        <div className="grid gap-6">
            <LineChart series={series} />
            <LineChart series={series} variant="area" showLegend />
            <LineChart
              series={series}
              referenceValue={50}
              referenceLabel="Goal"
              showDots={false}
            />
        </div>
    );
}`, ja: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "売上",
    color: "primary",
    data: [
      { label: "1月", value: 42 },
      { label: "2月", value: 58 },
      { label: "3月", value: 36 },
    ],
  },
  {
    label: "目標",
    color: "success",
    data: [
      { label: "1月", value: 46 },
      { label: "2月", value: 52 },
      { label: "3月", value: 48 },
    ],
  },
];

export function RevenueTrendVariants() {
    return (
        <div className="grid gap-6">
            <LineChart series={series} />
            <LineChart series={series} variant="area" showLegend />
            <LineChart
              series={series}
              referenceValue={50}
              referenceLabel="目標"
              showDots={false}
            />
        </div>
    );
}` } as const;

const propsData = {
    en: [
        { name: "series", type: "{ label?: ReactNode; data: Array<number | { label?: ReactNode; value: number }>; color?: ChartColor }[]", description: "Series and point values rendered across the chart width." },
        { name: "variant", type: "\"area\" | \"line\"", default: "\"line\"", description: "Registered SSOT variant for line or area rendering." },
        { name: "referenceValue", type: "number", description: "Optional dashed reference line." },
        { name: "showLegend", type: "boolean", default: "false", description: "Renders a ChartLegend for the series." },
        { name: "showDots", type: "boolean", default: "true", description: "Shows markers for each data point." },
    ],
    ja: [
        { name: "series", type: "{ label?: ReactNode; data: Array<number | { label?: ReactNode; value: number }>; color?: ChartColor }[]", description: "チャート幅に沿って表示する系列と各点の値です。" },
        { name: "variant", type: "\"area\" | \"line\"", default: "\"line\"", description: "線表示と面表示を切り替える SSOT 登録済みバリエーションです。" },
        { name: "referenceValue", type: "number", description: "任意の点線基準値です。" },
        { name: "showLegend", type: "boolean", default: "false", description: "系列のチャート凡例を表示します。" },
        { name: "showDots", type: "boolean", default: "true", description: "各データ点のマーカーを表示します。" },
    ],
} as const;

const states = {
    en: [
        { key: "line", title: "Line", description: "The registered line variant for direct time-series comparison.", preview: <LineChart series={seriesByLocale.en} />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "Revenue",
    color: "primary",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 36 },
    ],
  },
  {
    label: "Target",
    color: "success",
    data: [
      { label: "Jan", value: 46 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
    ],
  },
];

export function RevenueTrendLine() {
    return <LineChart series={series} />;
}` },
        { key: "area", title: "Area with legend", description: "Adds area fill, a reference line, and series legend for dashboard panels.", preview: <LineChart series={seriesByLocale.en} variant="area" referenceValue={55} referenceLabel="Average" showLegend />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "Revenue",
    color: "primary",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 36 },
    ],
  },
  {
    label: "Target",
    color: "success",
    data: [
      { label: "Jan", value: 46 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
    ],
  },
];

export function RevenueTrendArea() {
    return (
        <LineChart
          series={series}
          variant="area"
          referenceValue={55}
          referenceLabel="Average"
          showLegend
        />
    );
}` },
        { key: "no-dots", title: "Without point markers", description: "Hides markers when the trend shape matters more than individual samples.", preview: <LineChart series={seriesByLocale.en} showDots={false} showGrid={false} />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "Revenue",
    color: "primary",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 36 },
    ],
  },
  {
    label: "Target",
    color: "success",
    data: [
      { label: "Jan", value: 46 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
    ],
  },
];

export function RevenueTrendWithoutDots() {
    return <LineChart series={series} showDots={false} showGrid={false} />;
}` },
        { key: "bounded", title: "Explicit range", description: "Locks the vertical domain when multiple charts need comparable scale.", preview: <LineChart series={seriesByLocale.en} min={0} max={100} referenceValue={75} referenceLabel="Goal" showLegend />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "Revenue",
    color: "primary",
    data: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 58 },
      { label: "Mar", value: 36 },
    ],
  },
  {
    label: "Target",
    color: "success",
    data: [
      { label: "Jan", value: 46 },
      { label: "Feb", value: 52 },
      { label: "Mar", value: 48 },
    ],
  },
];

export function RevenueTrendFixedRange() {
    return (
        <LineChart
          series={series}
          min={0}
          max={100}
          referenceValue={75}
          referenceLabel="Goal"
          showLegend
        />
    );
}` },
    ],
    ja: [
        { key: "line", title: "線表示", description: "時系列を直接比較する SSOT 登録済みの線バリエーションです。", preview: <LineChart series={seriesByLocale.ja} />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "売上",
    color: "primary",
    data: [
      { label: "1月", value: 42 },
      { label: "2月", value: 58 },
      { label: "3月", value: 36 },
    ],
  },
  {
    label: "目標",
    color: "success",
    data: [
      { label: "1月", value: 46 },
      { label: "2月", value: 52 },
      { label: "3月", value: 48 },
    ],
  },
];

export function RevenueTrendLine() {
    return <LineChart series={series} />;
}` },
        { key: "area", title: "面表示と凡例", description: "面の塗り、基準線、系列凡例を加えてダッシュボードで読みやすくします。", preview: <LineChart series={seriesByLocale.ja} variant="area" referenceValue={55} referenceLabel="平均" showLegend />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "売上",
    color: "primary",
    data: [
      { label: "1月", value: 42 },
      { label: "2月", value: 58 },
      { label: "3月", value: 36 },
    ],
  },
  {
    label: "目標",
    color: "success",
    data: [
      { label: "1月", value: 46 },
      { label: "2月", value: 52 },
      { label: "3月", value: 48 },
    ],
  },
];

export function RevenueTrendArea() {
    return <LineChart
      series={series}
      variant="area"
      referenceValue={55}
      referenceLabel="平均"
      showLegend
    />;
}` },
        { key: "no-dots", title: "点なし", description: "個別の点より傾向線を優先したい場合はマーカーを非表示にします。", preview: <LineChart series={seriesByLocale.ja} showDots={false} showGrid={false} />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "売上",
    color: "primary",
    data: [
      { label: "1月", value: 42 },
      { label: "2月", value: 58 },
      { label: "3月", value: 36 },
    ],
  },
  {
    label: "目標",
    color: "success",
    data: [
      { label: "1月", value: 46 },
      { label: "2月", value: 52 },
      { label: "3月", value: 48 },
    ],
  },
];

export function RevenueTrendWithoutDots() {
    return <LineChart series={series} showDots={false} showGrid={false} />;
}` },
        { key: "bounded", title: "範囲固定", description: "複数チャートのスケールを揃えたい場合に縦軸の範囲を固定します。", preview: <LineChart series={seriesByLocale.ja} min={0} max={100} referenceValue={75} referenceLabel="目標" showLegend />, previewBodyWidth: "full", code: `import { LineChart } from "@gunjo/ui";

const series = [
  {
    label: "売上",
    color: "primary",
    data: [
      { label: "1月", value: 42 },
      { label: "2月", value: 58 },
      { label: "3月", value: 36 },
    ],
  },
  {
    label: "目標",
    color: "success",
    data: [
      { label: "1月", value: 46 },
      { label: "2月", value: 52 },
      { label: "3月", value: 48 },
    ],
  },
];

export function RevenueTrendFixedRange() {
    return (
        <LineChart
          series={series}
          min={0}
          max={100}
          referenceValue={75}
          referenceLabel="目標"
          showLegend
        />
    );
}` },
    ],
} as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>縦軸はゼロに固定していません。棒グラフとは逆の判断です。</strong>折れ線は長さではなく傾きで読ませる図なので、既定の範囲はデータの最小値から最大値までで、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> で固定できます。ただし GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LineChart</code> は縦軸の目盛りの数字を描きません（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showLabels</code> が出すのは横軸のラベルだけです）。資料が求める「ゼロから始まっていないと分かるようにする」は、図の外の文字で書いてください。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceValue</code> は範囲の計算に入るので、基準線が枠の外に出ることはありません。
            </li>
            <li>
                <strong>線は SVG で描き、当たり判定は HTML で置いています。</strong>線と点と補助線の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">&lt;svg&gt;</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> かつ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pointer-events-none</code> で、その上に時点ごとの透明な丸（28px）を HTML の要素として重ねています。読み上げ名は「系列名 時点: 値」で、ホバーでもキーボードのフォーカスでも同じツールチップが出ます。資料は当たり判定の目安に 44px を挙げていますが、点が密なときに隣と重ならないことを優先しました。
            </li>
            <li>
                <strong>図の名前は、呼ぶ側が付けます。</strong>部品は外枠に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> を付けますが、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> の既定は持ちません。何の、いつの数字かという図の題は、部品には分からないからです。系列の区別も色だけで、点はすべて同じ丸です。資料が挙げる「実線と破線を使い分ける」「線の終わりに系列名を置く」は、いまは呼ぶ側の仕事として残っています。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showLegend</code> は既定で off で、on にすると各系列の最後の値が凡例に並びます。
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/line-chart"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: 折れ線グラフ（Line Chart）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>The value axis is not pinned to zero, unlike the bar chart.</strong> A line is read by its slope rather than its length, so the default domain runs from the smallest to the largest value in the data and can be fixed with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">min</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code>. GUNJO&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LineChart</code> draws no numbers on the value axis, though (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showLabels</code> only renders the category labels along the bottom), so the article&rsquo;s requirement to show that the axis is truncated has to be met in copy around the chart. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">referenceValue</code> is folded into the domain, so a reference line never falls outside the plot.
            </li>
            <li>
                <strong>The line is SVG; the hit areas are HTML.</strong> The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">&lt;svg&gt;</code> that draws lines, dots and grid is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pointer-events-none</code>, and a transparent 28px circle per point is layered over it as a normal element. Its accessible name reads “series label, point label, value”, and hover and keyboard focus open the same tooltip. The article suggests 44px targets; here, not overlapping the neighbouring point in a dense series won.
            </li>
            <li>
                <strong>Naming the chart is the caller&rsquo;s job.</strong> The component sets <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="img"'}</code> on the wrapper but ships no default <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code>, because it cannot know what the figure is of, or when. Series are separated by colour alone as well: every dot is the same circle. The article&rsquo;s advice to mix solid with dashed strokes, or to label each line at its end, is still work for the caller. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showLegend</code> is off by default; turning it on lists each series with its last value.
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/line-chart"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: Line Chart (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function LineChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.lineChart.title, ja: "折れ線チャート" }} description={{ en: meta.lineChart.description, ja: "複数系列の時系列を、線・面表示、基準線、凡例付きで比較するチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="line-chart" embedBase="/embed/line-chart" previewHeight={520} states={states} usedComponents={{ en: [{ name: "LineChart", href: "/docs/components/line-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "折れ線チャート", href: "/docs/components/line-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{ name: "SparklineChart", href: "/docs/components/sparkline-chart" }, { name: "RibbonChart", href: "/docs/components/ribbon-chart" }, { name: "BarChart", href: "/docs/components/bar-chart" }], ja: [{ name: "スパークライン", href: "/docs/components/sparkline-chart" }, { name: "リボンチャート", href: "/docs/components/ribbon-chart" }, { name: "棒グラフ", href: "/docs/components/bar-chart" }] }} />;
}
