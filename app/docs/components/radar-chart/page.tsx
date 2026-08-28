"use client";

import type { ComponentProps } from "react";
import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { ChartLegend, RadarChart } from "@gunjo/ui";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof RadarChart>["data"][number];
const dataByLocale: Record<Locale, DataItem[]> = { en: [{ label: "Reach", value: 72 }, { label: "Quality", value: 84 }, { label: "Revenue", value: 58 }, { label: "Retention", value: 76 }, { label: "Speed", value: 64 }, { label: "Risk", value: 42 }], ja: [{ label: "到達", value: 72 }, { label: "品質", value: 84 }, { label: "売上", value: 58 }, { label: "継続", value: 76 }, { label: "速度", value: 64 }, { label: "リスク", value: 42 }] };
const growthDataByLocale: Record<Locale, { current: DataItem[]; target: DataItem[] }> = {
    en: {
        current: [{ label: "STR", value: 42 }, { label: "DEX", value: 58 }, { label: "INT", value: 36 }, { label: "VIT", value: 50 }, { label: "AGI", value: 62 }, { label: "LUK", value: 28 }],
        target: [{ label: "STR", value: 76 }, { label: "DEX", value: 70 }, { label: "INT", value: 54 }, { label: "VIT", value: 68 }, { label: "AGI", value: 82 }, { label: "LUK", value: 46 }],
    },
    ja: {
        current: [{ label: "STR", value: 42 }, { label: "DEX", value: 58 }, { label: "INT", value: 36 }, { label: "VIT", value: 50 }, { label: "AGI", value: 62 }, { label: "LUK", value: 28 }],
        target: [{ label: "STR", value: 76 }, { label: "DEX", value: 70 }, { label: "INT", value: 54 }, { label: "VIT", value: 68 }, { label: "AGI", value: 82 }, { label: "LUK", value: 46 }],
    },
};

const dataCode = {
    en: `const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];`,
    ja: `const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];`,
} as const;
const growthCode = {
    en: `const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "As-is", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "To-be", data: targetData, color: "success", fillOpacity: 0.14 },
];`,
    ja: `const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "現在", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "成長後", data: targetData, color: "success", fillOpacity: 0.14 },
];`,
} as const;

const code = { en: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];

export function ScoreRadar() {
    return <RadarChart
      data={data}
      max={100}
      formatValue
      value
    > value + "%"} maxLabel="Max" />;
}`, ja: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];

export function ScoreRadar() {
    return <RadarChart
      data={data}
      max={100}
      formatValue
      value
    > value + "%"} maxLabel="最大" />;
}` } as const;
const usageCode = { en: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];

const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "As-is", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "To-be", data: targetData, color: "success", fillOpacity: 0.14 },
];

export function ScoreRadarVariants() {
    return (
        <div className="grid gap-6">
            <RadarChart data={data} max={100} />
            <RadarChart data={data} variant="compact" showLabels={false} />
            <RadarChart data={data} color="success" fillOpacity={0.12} />
            <RadarChart data={currentData} series={series} max={100} />
        </div>
    );
}`, ja: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];

const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "現在", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "成長後", data: targetData, color: "success", fillOpacity: 0.14 },
];

export function ScoreRadarVariants() {
    return (
        <div className="grid gap-6">
            <RadarChart data={data} max={100} />
            <RadarChart data={data} variant="compact" showLabels={false} />
            <RadarChart data={data} color="success" fillOpacity={0.12} />
            <RadarChart data={currentData} series={series} max={100} />
        </div>
    );
}` } as const;
const propsData = { en: [{"name":"data","type":"ChartDataPoint[]","description":"Single-series values rendered as a normalized radar polygon."},{"name":"series","type":"RadarChartSeries[]","description":"Multiple radar polygons for comparing current and target values."},{"name":"variant","type":"\"default\" | \"compact\"","description":"Registered SSOT variant for chart size.","default":"\"default\""},{"name":"showGrid / showLabels","type":"boolean","description":"Controls grid rings and axis labels."}], ja: [{"name":"data","type":"ChartDataPoint[]","description":"単一系列として正規化した多角形で表示する値です。"},{"name":"series","type":"RadarChartSeries[]","description":"現在値と目標値など、複数のレーダー面を重ねて比較します。"},{"name":"variant","type":"\"default\" | \"compact\"","description":"チャートサイズを切り替える SSOT 登録済みバリエーションです。","default":"\"default\""},{"name":"showGrid / showLabels","type":"boolean","description":"グリッドリングと軸ラベルの表示を切り替えます。"}] } as const;
const states = {
    en: [
        {
            key: "default",
            title: "Default",
            description: "Standard radar with labels and grid.",
            preview: <RadarChart data={dataByLocale.en} max={100} />,
            previewBodyWidth: "md",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];

export function ScoreRadar() {
    return <RadarChart data={data} max={100} />;
}`,
        },
        {
            key: "growth",
            title: "As-is / To-be",
            description: "Compares current skill values with the expected growth after training.",
            preview: (
                <div className="w-full max-w-md space-y-3">
                    <RadarChart
                        data={growthDataByLocale.en.current}
                        series={[
                            { label: "As-is", data: growthDataByLocale.en.current, color: "muted", fillOpacity: 0.08 },
                            { label: "To-be", data: growthDataByLocale.en.target, color: "success", fillOpacity: 0.14 },
                        ]}
                        max={100}
                        formatValue={(value) => `${value}%`}
                        maxLabel="Max"
                    />
                    <ChartLegend
                        className="justify-center"
                        items={[
                            { label: "As-is", value: "46%", color: "muted" },
                            { label: "To-be", value: "66%", color: "success" },
                        ]}
                    />
                </div>
            ),
            previewBodyWidth: "md",
            code: `import { ChartLegend, RadarChart } from "@gunjo/ui";

const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "As-is", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "To-be", data: targetData, color: "success", fillOpacity: 0.14 },
];

export function GrowthRadar() {
    return (
        <div className="grid gap-6">
            <RadarChart
              data={currentData}
              series={series}
              max={100}
              formatValue
              value
            > value + "%"} maxLabel="Max" />
            <ChartLegend
              className="justify-center"
              items={[
                { label: "As-is", value: "46%", color: "muted" },
                { label: "To-be", value: "66%", color: "success" },
              ]}
            />
        </div>
    );
}`,
        },
        {
            key: "compact",
            title: "Compact",
            description: "Compact variant without axis labels.",
            preview: <RadarChart data={dataByLocale.en} variant="compact" showLabels={false} />,
            previewBodyWidth: "sm",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];

export function CompactScoreRadar() {
    return <RadarChart data={data} variant="compact" showLabels={false} />;
}`,
        },
        {
            key: "success",
            title: "Success color",
            description: "Uses another chart color token.",
            preview: <RadarChart data={dataByLocale.en} color="success" fillOpacity={0.12} />,
            previewBodyWidth: "md",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];

export function SuccessColorRadar() {
    return <RadarChart data={data} color="success" fillOpacity={0.12} />;
}`,
        },
        {
            key: "minimal",
            title: "Minimal",
            description: "Hides grid rings for dense panels.",
            preview: <RadarChart data={dataByLocale.en} showGrid={false} showDots={false} />,
            previewBodyWidth: "md",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "Reach", value: 72 },
    { label: "Quality", value: 84 },
    { label: "Revenue", value: 58 },
    { label: "Retention", value: 76 },
    { label: "Speed", value: 64 },
    { label: "Risk", value: 42 },
];

export function MinimalScoreRadar() {
    return <RadarChart data={data} showGrid={false} showDots={false} />;
}`,
        },
    ],
    ja: [
        {
            key: "default",
            title: "標準表示",
            description: "ラベルとグリッドを含む標準表示です。",
            preview: <RadarChart data={dataByLocale.ja} max={100} />,
            previewBodyWidth: "md",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];

export function ScoreRadar() {
    return <RadarChart data={data} max={100} />;
}`,
        },
        {
            key: "growth",
            title: "現在と成長後",
            description: "スキルの現在値と、育成後に伸びる想定値を比較します。",
            preview: (
                <div className="w-full max-w-md space-y-3">
                    <RadarChart
                        data={growthDataByLocale.ja.current}
                        series={[
                            { label: "現在", data: growthDataByLocale.ja.current, color: "muted", fillOpacity: 0.08 },
                            { label: "成長後", data: growthDataByLocale.ja.target, color: "success", fillOpacity: 0.14 },
                        ]}
                        max={100}
                        formatValue={(value) => `${value}%`}
                        maxLabel="最大"
                    />
                    <ChartLegend
                        className="justify-center"
                        items={[
                            { label: "現在", value: "46%", color: "muted" },
                            { label: "成長後", value: "66%", color: "success" },
                        ]}
                    />
                </div>
            ),
            previewBodyWidth: "md",
            code: `import { ChartLegend, RadarChart } from "@gunjo/ui";

const currentData = [
    { label: "STR", value: 42 },
    { label: "DEX", value: 58 },
    { label: "INT", value: 36 },
    { label: "VIT", value: 50 },
    { label: "AGI", value: 62 },
    { label: "LUK", value: 28 },
];

const targetData = [
    { label: "STR", value: 76 },
    { label: "DEX", value: 70 },
    { label: "INT", value: 54 },
    { label: "VIT", value: 68 },
    { label: "AGI", value: 82 },
    { label: "LUK", value: 46 },
];

const series = [
    { label: "現在", data: currentData, color: "muted", fillOpacity: 0.08 },
    { label: "成長後", data: targetData, color: "success", fillOpacity: 0.14 },
];

export function GrowthRadar() {
    return (
        <div className="grid gap-6">
            <RadarChart
              data={currentData}
              series={series}
              max={100}
              formatValue
              value
            > value + "%"} maxLabel="最大" />
            <ChartLegend
              className="justify-center"
              items={[
                { label: "現在", value: "46%", color: "muted" },
                { label: "成長後", value: "66%", color: "success" },
              ]}
            />
        </div>
    );
}`,
        },
        {
            key: "compact",
            title: "コンパクト",
            description: "軸ラベルを省いたコンパクト表示です。",
            preview: <RadarChart data={dataByLocale.ja} variant="compact" showLabels={false} />,
            previewBodyWidth: "sm",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];

export function CompactScoreRadar() {
    return <RadarChart data={data} variant="compact" showLabels={false} />;
}`,
        },
        {
            key: "success",
            title: "別カラー",
            description: "別のチャート色トークンで表示します。",
            preview: <RadarChart data={dataByLocale.ja} color="success" fillOpacity={0.12} />,
            previewBodyWidth: "md",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];

export function SuccessColorRadar() {
    return <RadarChart data={data} color="success" fillOpacity={0.12} />;
}`,
        },
        {
            key: "minimal",
            title: "最小表示",
            description: "密度の高いパネル向けにグリッドを非表示にします。",
            preview: <RadarChart data={dataByLocale.ja} showGrid={false} showDots={false} />,
            previewBodyWidth: "md",
            code: `import { RadarChart } from "@gunjo/ui";

const data = [
    { label: "到達", value: 72 },
    { label: "品質", value: 84 },
    { label: "売上", value: 58 },
    { label: "継続", value: 76 },
    { label: "速度", value: 64 },
    { label: "リスク", value: 42 },
];

export function MinimalScoreRadar() {
    return <RadarChart data={data} showGrid={false} showDots={false} />;
}`,
        },
    ],
} as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>満点を、読み上げ名に入れます。</strong>レーダーは外周が何点かが分からないと読めません。頂点の読み上げ名は「軸名: 値（Max: 満点）」の形で、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> が必ず入ります。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> を渡さないとデータの最大値が満点になるので、全員のスコアが低い回では「全員が外周の近く」という図が出ます。満点は固定してください。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">maxLabel</code> の既定は英語の「Max」です。
            </li>
            <li>
                <strong>軸のラベルは、読み上げから外してあります。</strong>軸名の文字は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> で、同じ名前が頂点の読み上げ名の中に入っています。二重に読ませないための形です。頂点の当たり判定は 28px の丸で、多角形と補助線を描く <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">&lt;svg&gt;</code> のほうは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> にしてあります。
            </li>
            <li>
                <strong>系列の区別は、いまは色と塗りの濃さだけです。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">series</code> で複数の面を重ねられ、塗りは既定で <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">fillOpacity</code> が 0.16 なので後ろの面が透けます。ただし線はすべて実線で、点もすべて同じ丸です。資料が挙げる「現在は実線、目標は破線」「系列ごとに点の形を変える」は、GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RadarChart</code> にはまだありません。重ねるのは2つまでにして、軸ごとの数字を図のそばに置いてください。
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/radar-chart"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: レーダーチャート（Radar Chart）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>The full score goes into the accessible name.</strong> A radar chart cannot be read without knowing what the outer ring is worth. Each vertex is named “axis: value (Max: full score)”, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> is always part of it. Leave <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> out and the largest value in the data becomes the outer ring, which produces a chart where everyone sits near the edge in a month where every score was low. Pin the maximum. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">maxLabel</code> defaults to the English “Max”.
            </li>
            <li>
                <strong>The axis labels are kept out of the accessible tree.</strong> The axis names are <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code>, because the same names already appear inside each vertex&rsquo;s accessible name, and reading them twice helps nobody. The hit area on a vertex is a 28px circle, and the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">&lt;svg&gt;</code> that draws the polygons and the grid is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> too.
            </li>
            <li>
                <strong>Series are separated by colour and fill weight alone, for now.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">series</code> layers several polygons, and the default <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">fillOpacity</code> of 0.16 keeps the one behind visible. Every stroke is solid, though, and every dot is the same circle. The article&rsquo;s advice — solid for current, dashed for target, a different dot shape per series — is not in GUNJO&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">RadarChart</code> yet. Keep it to two overlaid shapes and put the per-axis numbers next to the figure.
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/radar-chart"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: Radar Chart (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function RadarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return <ChartDocPage designDecisions={designDecisions} title={{ en: meta.radarChart.title, ja: "レーダーチャート" }} description={{ en: meta.radarChart.description, ja: "複数軸の正規化スコアを多角形で比較するレーダーチャートです。" }} code={code} usageCode={usageCode} propsData={propsData} demo="radar-chart" embedBase="/embed/radar-chart" previewHeight={460} states={states} usedComponents={{ en: [{ name: "RadarChart", href: "/docs/components/radar-chart" }, { name: "ChartLegend", href: "/docs/components/chart-legend" }, { name: "Tooltip", href: "/docs/components/tooltip" }], ja: [{ name: "レーダーチャート", href: "/docs/components/radar-chart" }, { name: "チャート凡例", href: "/docs/components/chart-legend" }, { name: "ツールチップ", href: "/docs/components/tooltip" }] }} relatedComponents={{ en: [{"name":"RadialBarChart","href":"/docs/components/radial-bar-chart"},{"name":"QuadrantMatrix","href":"/docs/components/quadrant-matrix"}], ja: [{"name":"ラジアルバーチャート","href":"/docs/components/radial-bar-chart"},{"name":"4象限マトリクス","href":"/docs/components/quadrant-matrix"}] }} />;
}
