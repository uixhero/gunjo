"use client";

import type { ComponentProps } from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { HeatmapChart } from "@gunjo/ui";

type HeatmapCell = ComponentProps<typeof HeatmapChart>["data"][number];
type HeatmapSummary = NonNullable<ComponentProps<typeof HeatmapChart>["summary"]>[number];

const heatmapLabelsByLocale = {
    en: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        times: ["00", "04", "08", "12", "16", "20"],
        summaryLabel: "Peak",
        selected: { x: "Thu", y: "12" },
    },
    ja: {
        days: ["月", "火", "水", "木", "金", "土", "日"],
        times: ["00", "04", "08", "12", "16", "20"],
        summaryLabel: "ピーク",
        selected: { x: "木", y: "12" },
    },
} as const;

function buildHeatmapCells(locale: "en" | "ja", color?: HeatmapCell["color"]): HeatmapCell[] {
    const labels = heatmapLabelsByLocale[locale];
    return labels.times.flatMap((y, row) =>
        labels.days.map((x, column) => ({
            x,
            y,
            value: Math.min(100, 24 + row * 9 + column * 5 + (column % 2) * 6),
            color,
            description:
                locale === "ja"
                    ? `${x}曜日 ${y}:00 の利用密度`
                    : `${x} ${y}:00 traffic density`,
        }))
    );
}

function buildHeatmapSummary(cells: HeatmapCell[], locale: "en" | "ja"): HeatmapSummary[] {
    return heatmapLabelsByLocale[locale].days.map((x) => ({
        x,
        value: Math.max(...cells.filter((cell) => cell.x === x).map((cell) => cell.value)),
        description: locale === "ja" ? `${x}曜日のピーク値` : `${x} peak value`,
    }));
}

const codeByLocale = {
    en: `import { HeatmapChart } from "@gunjo/ui";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);
const summary = days.map((x) => ({
    x,
    value: Math.max(...data.filter((cell) => cell.x === x).map((cell) => cell.value)),
}));

export function DensityMap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            summary={summary}
            summaryLabel="Peak"
            max={100}
            selectedCell={{ x: "Thu", y: "12" }}
            showValues
        />
    );
}`,
    ja: `import { HeatmapChart } from "@gunjo/ui";

const days = ["月", "火", "水", "木", "金", "土", "日"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);
const summary = days.map((x) => ({
    x,
    value: Math.max(...data.filter((cell) => cell.x === x).map((cell) => cell.value)),
}));

export function DensityMap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            summary={summary}
            summaryLabel="ピーク"
            max={100}
            selectedCell={{ x: "木", y: "12" }}
            showValues
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { HeatmapChart } from "@gunjo/ui";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);
const summary = days.map((x) => ({
    x,
    value: Math.max(...data.filter((cell) => cell.x === x).map((cell) => cell.value)),
}));

<HeatmapChart data={data} xLabels={days} yLabels={times} />
<HeatmapChart data={data} xLabels={days} yLabels={times} summary={summary} />
<HeatmapChart data={data} xLabels={days} yLabels={times} showValues />
<HeatmapChart data={data} xLabels={days} yLabels={times} selectedCell={{ x: "Thu", y: "12" }} />
<HeatmapChart data={data} xLabels={days} yLabels={times} variant="compact" />`,
    ja: `import { HeatmapChart } from "@gunjo/ui";

const days = ["月", "火", "水", "木", "金", "土", "日"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);
const summary = days.map((x) => ({
    x,
    value: Math.max(...data.filter((cell) => cell.x === x).map((cell) => cell.value)),
}));

<HeatmapChart data={data} xLabels={days} yLabels={times} />
<HeatmapChart data={data} xLabels={days} yLabels={times} summary={summary} />
<HeatmapChart data={data} xLabels={days} yLabels={times} showValues />
<HeatmapChart data={data} xLabels={days} yLabels={times} selectedCell={{ x: "木", y: "12" }} />
<HeatmapChart data={data} xLabels={days} yLabels={times} variant="compact" />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  max={100}
/>`,
        summary: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  summary={summary}
  summaryLabel="Peak"
  max={100}
  summaryMax={100}
/>`,
        values: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  max={100}
  showValues
  formatValue={(value) => \`\${value}%\`}
/>`,
        selected: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  summary={summary}
  summaryLabel="Peak"
  max={100}
  selectedCell={{ x: "Thu", y: "12" }}
  showValues
/>`,
        compact: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  variant="compact"
  max={100}
/>`,
        alternateColor: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  summary={summary}
  summaryLabel="Peak"
  max={100}
  color="success"
/>`,
    },
    ja: {
        default: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  max={100}
/>`,
        summary: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  summary={summary}
  summaryLabel="ピーク"
  max={100}
  summaryMax={100}
/>`,
        values: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  max={100}
  showValues
  formatValue={(value) => \`\${value}%\`}
/>`,
        selected: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  summary={summary}
  summaryLabel="ピーク"
  max={100}
  selectedCell={{ x: "木", y: "12" }}
  showValues
/>`,
        compact: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  variant="compact"
  max={100}
/>`,
        alternateColor: `<HeatmapChart
  data={data}
  xLabels={days}
  yLabels={times}
  summary={summary}
  summaryLabel="ピーク"
  max={100}
  color="success"
/>`,
    },
} as const;

const propsDataByLocale = {
    en: [
    {
        name: "data",
        type: "{ x: string; y: string; value: number; color?: ChartColor }[]",
        description: "Cell values matched against xLabels and yLabels.",
    },
    {
        name: "xLabels",
        type: "string[]",
        description: "Column labels, such as weekdays.",
    },
    {
        name: "yLabels",
        type: "string[]",
        description: "Row labels, such as time ranges.",
    },
    {
        name: "summary",
        type: "{ x: string; value: number; color?: ChartColor; description?: ReactNode }[]",
        description: "Optional column summary values rendered above the heatmap, such as daily peaks.",
    },
    {
        name: "variant",
        type: "\"compact\" | \"default\"",
        default: "\"default\"",
        description: "Generated design variant for cell density.",
    },
    {
        name: "max",
        type: "number",
        description: "Explicit maximum used to normalize cell intensity.",
    },
    {
        name: "summaryMax",
        type: "number",
        description: "Explicit maximum used to normalize summary bar height.",
    },
    {
        name: "showValues",
        type: "boolean",
        default: "false",
        description: "Shows formatted values inside cells.",
    },
    {
        name: "showSummaryValues",
        type: "boolean",
        default: "true",
        description: "Shows formatted values above summary bars.",
    },
    {
        name: "selectedCell",
        type: "{ x: string; y: string }",
        description: "Highlights the cell currently being inspected or edited.",
    },
    {
        name: "onCellSelect",
        type: "(cell, selection) => void",
        description: "Called when a heatmap cell is selected.",
    },
    ],
    ja: [
        { name: "data", type: "{ x: string; y: string; value: number; color?: ChartColor }[]", description: "xLabels と yLabels に対応するセル値です。" },
        { name: "xLabels", type: "string[]", description: "曜日などの列ラベルです。" },
        { name: "yLabels", type: "string[]", description: "時間帯などの行ラベルです。" },
        { name: "summary", type: "{ x: string; value: number; color?: ChartColor; description?: ReactNode }[]", description: "日別ピークなど、ヒートマップ上部に表示する任意の列サマリーです。" },
        { name: "variant", type: "\"compact\" | \"default\"", default: "\"default\"", description: "セル密度を切り替える生成済みデザインバリアントです。" },
        { name: "max", type: "number", description: "セル濃度を正規化する明示的な最大値です。" },
        { name: "summaryMax", type: "number", description: "サマリーバーの高さを正規化する明示的な最大値です。" },
        { name: "showValues", type: "boolean", default: "false", description: "セル内にフォーマット済みの値を表示します。" },
        { name: "showSummaryValues", type: "boolean", default: "true", description: "サマリーバーの上にフォーマット済みの値を表示します。" },
        { name: "selectedCell", type: "{ x: string; y: string }", description: "確認中または編集中のセルを強調します。" },
        { name: "onCellSelect", type: "(cell, selection) => void", description: "ヒートマップセルが選択されたときに呼ばれます。" },
    ],
} as const;

export default function HeatmapChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const stateCodeData = usageCodeByLocale[locale]
        .split("\n\n<HeatmapChart")[0]
        .replace('import { HeatmapChart } from "@gunjo/ui";\n\n', "");
    const withStateCodeData = (nextCode: string) => `${stateCodeData}\n\n${nextCode}`;
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];
    const labels = heatmapLabelsByLocale[locale];
    const days = [...labels.days];
    const times = [...labels.times];
    const heatmapData = buildHeatmapCells(locale);
    const summary = buildHeatmapSummary(heatmapData, locale);
    const alternateColorData = buildHeatmapCells(locale, "success");

    return (
        <ComponentLayout
            title={locale === "ja" ? "ヒートマップ" : meta.heatmapChart.title}
            description={
                locale === "ja"
                    ? "曜日、時間帯、コホートなどの密度をセルの濃淡で比較するチャートです。"
                    : meta.heatmapChart.description
            }
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: locale === "ja" ? "ヒートマップ" : "HeatmapChart", href: "/docs/components/heatmap-chart" },
                { name: locale === "ja" ? "ツールチップ" : "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: locale === "ja" ? "リテンションコホートカード" : "RetentionCohortCard", href: "/docs/components/retention-cohort-card" },
                { name: locale === "ja" ? "塗り分け地図" : "ChoroplethMap", href: "/docs/components/choropleth-map" },
                { name: locale === "ja" ? "分析カード" : "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: locale === "ja" ? "統計" : "Statistic", href: "/docs/components/statistic" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="heatmap-chart"
                embedBase="/embed/heatmap-chart"
                previewHeight={520}
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
                                ? "セルの濃淡だけで密度の山を読む、SSOT 登録済みの標準バリエーションです。"
                                : "The registered SSOT default variant for reading density peaks from cell intensity.",
                            preview: (
                                <HeatmapChart
                                    data={heatmapData}
                                    xLabels={days}
                                    yLabels={times}
                                    max={100}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].default),
                        },
                        {
                            key: "summary",
                            title: locale === "ja" ? "列サマリー付き" : "With column summary",
                            description: locale === "ja"
                                ? "各列のピーク値を上部のバーで示し、セルの密度と合わせて比較します。"
                                : "Adds top summary bars so each column peak can be compared with the cell grid.",
                            preview: (
                                <HeatmapChart
                                    data={heatmapData}
                                    xLabels={days}
                                    yLabels={times}
                                    summary={summary}
                                    summaryLabel={labels.summaryLabel}
                                    max={100}
                                    summaryMax={100}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].summary),
                        },
                        {
                            key: "values",
                            title: locale === "ja" ? "値表示" : "Value labels",
                            description: locale === "ja"
                                ? "セル内に値を表示し、濃淡だけでは読み取りにくい差分を補足します。"
                                : "Shows values inside cells when color intensity alone is not enough.",
                            preview: (
                                <HeatmapChart
                                    data={heatmapData}
                                    xLabels={days}
                                    yLabels={times}
                                    max={100}
                                    showValues
                                    formatValue={(value) => `${value}%`}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].values),
                        },
                        {
                            key: "selected",
                            title: locale === "ja" ? "選択セル" : "Selected cell",
                            description: locale === "ja"
                                ? "確認中または編集中のセルをリングで強調し、クリック選択できる状態です。"
                                : "Highlights the inspected or editable cell and enables cell selection.",
                            preview: (
                                <HeatmapChart
                                    data={heatmapData}
                                    xLabels={days}
                                    yLabels={times}
                                    summary={summary}
                                    summaryLabel={labels.summaryLabel}
                                    max={100}
                                    selectedCell={labels.selected}
                                    showValues
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].selected),
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードやサイドパネル向けにセルの高さを抑える、SSOT 登録済みバリエーションです。"
                                : "A registered SSOT variant with shorter cells for narrow cards and side panels.",
                            preview: (
                                <HeatmapChart
                                    data={heatmapData}
                                    xLabels={days}
                                    yLabels={times}
                                    variant="compact"
                                    max={100}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].compact),
                        },
                        {
                            key: "alternate-color",
                            title: locale === "ja" ? "別カラー" : "Alternate color",
                            description: locale === "ja"
                                ? "同じ密度表現を、文脈に合わせたチャートカラーで表示する状態です。"
                                : "Uses another chart color while keeping the same density behavior.",
                            preview: (
                                <HeatmapChart
                                    data={alternateColorData}
                                    xLabels={days}
                                    yLabels={times}
                                    summary={summary}
                                    summaryLabel={labels.summaryLabel}
                                    max={100}
                                    color="success"
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: withStateCodeData(stateCodeByLocale[locale].alternateColor),
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
        </ComponentLayout>
    );
}
