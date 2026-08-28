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

export function TrafficDensityHeatmap() {
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

export function TrafficDensityHeatmap() {
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

export function HeatmapChartUsage() {
    return (
        <div className="grid gap-8">
            <HeatmapChart data={data} xLabels={days} yLabels={times} />
            <HeatmapChart
                data={data}
                xLabels={days}
                yLabels={times}
                summary={summary}
            />
            <HeatmapChart data={data} xLabels={days} yLabels={times} showValues />
            <HeatmapChart
                data={data}
                xLabels={days}
                yLabels={times}
                selectedCell={{ x: "Thu", y: "12" }}
            />
            <HeatmapChart
                data={data}
                xLabels={days}
                yLabels={times}
                variant="compact"
            />
        </div>
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

export function HeatmapChartUsage() {
    return (
        <div className="grid gap-8">
            <HeatmapChart data={data} xLabels={days} yLabels={times} />
            <HeatmapChart
                data={data}
                xLabels={days}
                yLabels={times}
                summary={summary}
            />
            <HeatmapChart data={data} xLabels={days} yLabels={times} showValues />
            <HeatmapChart
                data={data}
                xLabels={days}
                yLabels={times}
                selectedCell={{ x: "木", y: "12" }}
            />
            <HeatmapChart
                data={data}
                xLabels={days}
                yLabels={times}
                variant="compact"
            />
        </div>
    );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `import { HeatmapChart } from "@gunjo/ui";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);

export function TrafficDensityHeatmap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            max={100}
        />
    );
}`,
        summary: `import { HeatmapChart } from "@gunjo/ui";

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

export function HeatmapWithPeakSummary() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            summary={summary}
            summaryLabel="Peak"
            max={100}
            summaryMax={100}
        />
    );
}`,
        values: `import { HeatmapChart } from "@gunjo/ui";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);

export function HeatmapWithValues() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            max={100}
            showValues
            formatValue={(value) => value + "%"}
        />
    );
}`,
        selected: `import { HeatmapChart } from "@gunjo/ui";

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

export function HeatmapWithSelectedCell() {
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
        compact: `import { HeatmapChart } from "@gunjo/ui";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);

export function CompactTrafficHeatmap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            variant="compact"
            max={100}
        />
    );
}`,
        alternateColor: `import { HeatmapChart } from "@gunjo/ui";

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

export function SuccessToneHeatmap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            summary={summary}
            summaryLabel="Peak"
            max={100}
            color="success"
        />
    );
}`,
    },
    ja: {
        default: `import { HeatmapChart } from "@gunjo/ui";

const days = ["月", "火", "水", "木", "金", "土", "日"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);

export function TrafficDensityHeatmap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            max={100}
        />
    );
}`,
        summary: `import { HeatmapChart } from "@gunjo/ui";

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

export function HeatmapWithPeakSummary() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            summary={summary}
            summaryLabel="ピーク"
            max={100}
            summaryMax={100}
        />
    );
}`,
        values: `import { HeatmapChart } from "@gunjo/ui";

const days = ["月", "火", "水", "木", "金", "土", "日"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);

export function HeatmapWithValues() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            max={100}
            showValues
            formatValue={(value) => value + "%"}
        />
    );
}`,
        selected: `import { HeatmapChart } from "@gunjo/ui";

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

export function HeatmapWithSelectedCell() {
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
        compact: `import { HeatmapChart } from "@gunjo/ui";

const days = ["月", "火", "水", "木", "金", "土", "日"];
const times = ["00", "04", "08", "12", "16", "20"];
const data = times.flatMap((y, row) =>
    days.map((x, column) => ({
        x,
        y,
        value: Math.min(100, 30 + row * 8 + column * 4),
    }))
);

export function CompactTrafficHeatmap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            variant="compact"
            max={100}
        />
    );
}`,
        alternateColor: `import { HeatmapChart } from "@gunjo/ui";

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

export function SuccessToneHeatmap() {
    return (
        <HeatmapChart
            data={data}
            xLabels={days}
            yLabels={times}
            summary={summary}
            summaryLabel="ピーク"
            max={100}
            color="success"
        />
    );
}`,
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
                            code: stateCodeByLocale[locale].default,
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
                            code: stateCodeByLocale[locale].summary,
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
                            code: stateCodeByLocale[locale].values,
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
                            code: stateCodeByLocale[locale].selected,
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
                            code: stateCodeByLocale[locale].compact,
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
                            code: stateCodeByLocale[locale].alternateColor,
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
                            <strong>濃淡は連続で、値は必ず文字でも持たせます。</strong>セルは1色の不透明度を 0.1 から 1.0 まで動かして塗ります。段には切っていません。資料は5段から7段に切ることを薦めているので、そのぶん GUNJO は、すべてのセルに「列 行: 値」という読み上げ名を持たせました。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValues</code> を on にすると値が画面にも出ます。濃いセルでも読めるように、背景色の下地を敷いた上に載せています。
                        </li>
                        <li>
                            <strong>押せるセルだけが button になります。ただし、すべてのセルにフォーカスできます。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onCellSelect</code> を渡したときだけ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">&lt;button&gt;</code> になり、渡さないときも <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tabIndex</code> を持つ要素として、値がキーボードで読めるようにしてあります。意味のほとんどが色に載る図なので、止まる場所を増やしてでも値に届くほうを選びました。資料が言うとおり、列の多い格子ではタブの回数が増えます。狭い画面では、行ごとの一覧に組み替えてください。
                        </li>
                        <li>
                            <strong>選択中のセルは、色ではなく輪郭で示します。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">selectedCell</code> に当たるセルには前景色のリングが付き、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-current</code> も立ちます。塗りの濃さは値のままなので、選択の合図と値がぶつかりません。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> を渡すと正規化の基準がそろうので、ヒートマップを並べて比べるときは同じ値を渡します。なお <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">xLabels</code>・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">yLabels</code> の組み合わせのうち <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">data</code> に無いマスは 0 として塗られます。「値が無い」と「0」は、いまの <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">HeatmapChart</code> では区別できません。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/heatmap-chart"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: ヒートマップ（Heatmap Chart）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The shading is continuous, and the value is always available as text.</strong> A cell is one hue whose opacity runs from 0.1 to 1.0; it is not cut into steps. The article recommends five to seven steps, so in exchange every cell here carries an accessible name of “column row: value”. Turn <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValues</code> on and the number appears on screen as well, set on a background-coloured chip so it stays readable on the darkest cells.
                        </li>
                        <li>
                            <strong>Only clickable cells become buttons, but every cell is focusable.</strong> A cell renders as a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">&lt;button&gt;</code> only when <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onCellSelect</code> is supplied; without it, the cell still takes <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tabIndex</code> so its value can be read from the keyboard. Almost all the meaning of a heatmap rides on colour, so reaching the values won over keeping the tab order short. As the article warns, a wide grid then costs many tab stops; on a narrow screen, rebuild it as a list of rows.
                        </li>
                        <li>
                            <strong>The selected cell is marked by an outline, not a colour.</strong> The cell matching <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">selectedCell</code> gets a foreground-coloured ring and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-current</code>, while its fill keeps showing the value, so selection and magnitude never compete. Passing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> fixes the scale, so give several heatmaps the same value when they are meant to be compared. Note that any <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">xLabels</code>/<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">yLabels</code> pair missing from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">data</code> is painted as zero: today&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">HeatmapChart</code> cannot tell “no data” apart from “zero”.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/heatmap-chart"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Heatmap Chart (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
