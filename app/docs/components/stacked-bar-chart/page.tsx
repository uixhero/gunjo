"use client";

import * as React from "react";
import type { ComponentProps } from "react";
import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

import { ChartDocPage } from "@/components/doc/ChartDocPage";
import displayMetadata from "@design/display-metadata.json";
import { UIXHERO_BASE_URL, type UixheroLink } from "@/lib/uixhero-links";

type Locale = "en" | "ja";
type DataItem = ComponentProps<typeof StackedBarChart>["data"][number];

const dataByLocale: Record<Locale, DataItem[]> = {
    en: [
        {
            label: "Jan",
            segments: [
                { label: "Organic", value: 42, color: "primary" },
                { label: "Referral", value: 24, color: "success" },
                { label: "Paid", value: 18, color: "warning" },
            ],
        },
        {
            label: "Feb",
            segments: [
                { label: "Organic", value: 48, color: "primary" },
                { label: "Referral", value: 31, color: "success" },
                { label: "Paid", value: 16, color: "warning" },
            ],
        },
        {
            label: "Mar",
            segments: [
                { label: "Organic", value: 38, color: "primary" },
                { label: "Referral", value: 28, color: "success" },
                { label: "Paid", value: 26, color: "warning" },
            ],
        },
    ],
    ja: [
        {
            label: "1月",
            segments: [
                { label: "自然流入", value: 42, color: "primary" },
                { label: "紹介", value: 24, color: "success" },
                { label: "広告", value: 18, color: "warning" },
            ],
        },
        {
            label: "2月",
            segments: [
                { label: "自然流入", value: 48, color: "primary" },
                { label: "紹介", value: 31, color: "success" },
                { label: "広告", value: 16, color: "warning" },
            ],
        },
        {
            label: "3月",
            segments: [
                { label: "自然流入", value: 38, color: "primary" },
                { label: "紹介", value: 28, color: "success" },
                { label: "広告", value: 26, color: "warning" },
            ],
        },
    ],
};

const fiveBarDataByLocale: Record<Locale, DataItem[]> = {
    en: [
        ...dataByLocale.en,
        {
            label: "Apr",
            segments: [
                { label: "Organic", value: 52, color: "primary" },
                { label: "Referral", value: 35, color: "success" },
                { label: "Paid", value: 26, color: "warning" },
            ],
        },
        {
            label: "May",
            segments: [
                { label: "Organic", value: 45, color: "primary" },
                { label: "Referral", value: 30, color: "success" },
                { label: "Paid", value: 22, color: "warning" },
            ],
        },
    ],
    ja: [
        ...dataByLocale.ja,
        {
            label: "4月",
            segments: [
                { label: "自然流入", value: 52, color: "primary" },
                { label: "紹介", value: 35, color: "success" },
                { label: "広告", value: 26, color: "warning" },
            ],
        },
        {
            label: "5月",
            segments: [
                { label: "自然流入", value: 45, color: "primary" },
                { label: "紹介", value: 30, color: "success" },
                { label: "広告", value: 22, color: "warning" },
            ],
        },
    ],
};

const dataCode = {
    en: `const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];`,
    ja: `const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];`,
} as const;

const fiveBarDataCode = {
    en: `const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
    {
        label: "Apr",
        segments: [
            { label: "Organic", value: 52, color: "primary" },
            { label: "Referral", value: 35, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
    {
        label: "May",
        segments: [
            { label: "Organic", value: 45, color: "primary" },
            { label: "Referral", value: 30, color: "success" },
            { label: "Paid", value: 22, color: "warning" },
        ],
    },
];`,
    ja: `const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
    {
        label: "4月",
        segments: [
            { label: "自然流入", value: 52, color: "primary" },
            { label: "紹介", value: 35, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
    {
        label: "5月",
        segments: [
            { label: "自然流入", value: 45, color: "primary" },
            { label: "紹介", value: 30, color: "success" },
            { label: "広告", value: 22, color: "warning" },
        ],
    },
];`,
} as const;

const code = {
    en: `import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];

export function AcquisitionMixCard() {
    return (
        <AnalyticsCard
            title="Channel mix"
            description="Monthly revenue"
            value="271"
            delta="95 peak"
            trend="up"
        >
            <StackedBarChart
                data={data}
                showLegend
                showValues
                totalLabel="Total"
                aria-label="Channel mix"
            />
        </AnalyticsCard>
    );
}`,
    ja: `import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];

export function AcquisitionMixCard() {
    return (
        <AnalyticsCard
            title="チャネル構成"
            description="月次売上"
            value="271"
            delta="95 ピーク"
            trend="up"
        >
            <StackedBarChart
                data={data}
                showLegend
                showValues
                totalLabel="合計"
                aria-label="チャネル構成"
            />
        </AnalyticsCard>
    );
}`,
} as const;

const usageCode = {
    en: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];

export function AcquisitionMixVariants() {
    return (
        <div className="grid gap-6">
            <StackedBarChart data={data} />
            <StackedBarChart data={data} showLegend showValues totalLabel="Total" />
            <StackedBarChart data={data} variant="horizontal" normalize showLegend />
        </div>
    );
}`,
    ja: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];

export function AcquisitionMixVariants() {
    return (
        <div className="grid gap-6">
            <StackedBarChart data={data} />
            <StackedBarChart data={data} showLegend showValues totalLabel="合計" />
            <StackedBarChart
              data={data}
              variant="horizontal"
              normalize
              showLegend
              totalLabel="合計"
            />
        </div>
    );
}`,
} as const;

const propsData = {
    en: [
        {
            name: "data",
            type: "StackedBarChartGroup[]",
            description: "Groups and segment values rendered as stacked bars.",
        },
        {
            name: "variant",
            type: "\"vertical\" | \"horizontal\"",
            description: "Registered SSOT variant for chart orientation.",
            default: "\"vertical\"",
        },
        {
            name: "normalize",
            type: "boolean",
            description: "Normalizes each group to 100% for proportional comparison.",
            default: "false",
        },
        {
            name: "threshold",
            type: "number",
            description: "A capacity/limit line on each group's total. Draws a reference line and marks over-limit groups with a ring + a thresholdTone total. Segment colours are never changed. Ignored when normalize is set (every group is 100%). (#285)",
        },
        {
            name: "thresholdLabel",
            type: "ReactNode",
            default: "\"Limit\"",
            description: "Accessible name for the threshold line; also used in the over-limit announcement.",
        },
        {
            name: "thresholdTone",
            type: "ChartTone",
            default: "\"destructive\"",
            description: "Tone for the limit line and the over-limit marking.",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "Formats each value. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting.",
        },
        {
            name: "valueFormat",
            type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions",
            description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)",
        },
    ],
    ja: [
        {
            name: "data",
            type: "StackedBarChartGroup[]",
            description: "積み上げ棒として表示するグループとセグメント値です。",
        },
        {
            name: "variant",
            type: "\"vertical\" | \"horizontal\"",
            description: "縦・横の向きを切り替える SSOT 登録済みバリエーションです。",
            default: "\"vertical\"",
        },
        {
            name: "normalize",
            type: "boolean",
            description: "各グループを 100% に正規化して比率比較します。",
            default: "false",
        },
        {
            name: "threshold",
            type: "number",
            description: "各グループの「合計」に対する上限ライン。基準線を引き、超過グループをリング＋thresholdTone の合計値で示します。segment の色は一切変えません。normalize 指定時は無視（各グループが 100% になり絶対値の位置が無いため）。(#285)",
        },
        {
            name: "thresholdLabel",
            type: "ReactNode",
            default: "\"Limit\"",
            description: "閾値ラインのアクセシブル名。超過の読み上げにも使われます。",
        },
        {
            name: "thresholdTone",
            type: "ChartTone",
            default: "\"destructive\"",
            description: "上限ラインと超過マーキングのトーンです。",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "各値を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。",
        },
        {
            name: "valueFormat",
            type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions",
            description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)",
        },
    ],
} as const;

// Editable threshold demo: drag the limit and watch over-limit groups get the
// ring + destructive total — segment colours stay untouched. (#285)
const thresholdDataByLocale: Record<Locale, DataItem[]> = {
    en: [
        { label: "Team A", segments: [{ label: "Regular", value: 40, color: "primary" }, { label: "Overtime", value: 25, color: "info" }] },
        { label: "Team B", segments: [{ label: "Regular", value: 55, color: "primary" }, { label: "Overtime", value: 45, color: "info" }] },
        { label: "Team C", segments: [{ label: "Regular", value: 48, color: "primary" }, { label: "Overtime", value: 30, color: "info" }] },
        { label: "Team D", segments: [{ label: "Regular", value: 60, color: "primary" }, { label: "Overtime", value: 50, color: "info" }] },
    ],
    ja: [
        { label: "A班", segments: [{ label: "通常", value: 40, color: "primary" }, { label: "残業", value: 25, color: "info" }] },
        { label: "B班", segments: [{ label: "通常", value: 55, color: "primary" }, { label: "残業", value: 45, color: "info" }] },
        { label: "C班", segments: [{ label: "通常", value: 48, color: "primary" }, { label: "残業", value: 30, color: "info" }] },
        { label: "D班", segments: [{ label: "通常", value: 60, color: "primary" }, { label: "残業", value: 50, color: "info" }] },
    ],
};

function ThresholdStackDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [threshold, setThreshold] = React.useState(90);
    return (
        <div className="flex w-full flex-col gap-4">
            <StackedBarChart
                data={thresholdDataByLocale[locale]}
                threshold={threshold}
                thresholdLabel={isJa ? "上限" : "Limit"}
                totalLabel={isJa ? "合計" : "Total"}
                showValues
                showLegend
            />
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="shrink-0">{isJa ? "上限" : "Limit"}</span>
                <span className="w-10 shrink-0 font-medium tabular-nums text-foreground">{threshold}</span>
                <input
                    type="range"
                    min={50}
                    max={130}
                    value={threshold}
                    onChange={(event) => setThreshold(Number(event.target.value))}
                    className="min-w-0 flex-1"
                    aria-label={isJa ? "上限を調整" : "Adjust the limit"}
                />
            </label>
        </div>
    );
}

const thresholdCode = {
    en: `import { StackedBarChart } from "@gunjo/ui";

const shiftHours = [
    {
      label: "Team A",
      segments: [
        { label: "Regular", value: 40, color: "primary" },
        { label: "Overtime", value: 25, color: "info" },
      ],
    },
    {
      label: "Team B",
      segments: [
        { label: "Regular", value: 55, color: "primary" },
        { label: "Overtime", value: 45, color: "info" },
      ],
    },
    {
      label: "Team C",
      segments: [
        { label: "Regular", value: 48, color: "primary" },
        { label: "Overtime", value: 30, color: "info" },
      ],
    },
    {
      label: "Team D",
      segments: [
        { label: "Regular", value: 60, color: "primary" },
        { label: "Overtime", value: 50, color: "info" },
      ],
    },
];

// Over-limit groups get a ring and a destructive total. Segment colours are untouched.

export function ShiftHoursWithLimit() {
    return (
        <StackedBarChart
            data={shiftHours}
            threshold={90}
            thresholdLabel="Limit"
            totalLabel="Total"
            showValues
            showLegend
        />
    );
}`,
    ja: `import { StackedBarChart } from "@gunjo/ui";

const shiftHours = [
    {
      label: "A班",
      segments: [
        { label: "通常", value: 40, color: "primary" },
        { label: "残業", value: 25, color: "info" },
      ],
    },
    {
      label: "B班",
      segments: [
        { label: "通常", value: 55, color: "primary" },
        { label: "残業", value: 45, color: "info" },
      ],
    },
    {
      label: "C班",
      segments: [
        { label: "通常", value: 48, color: "primary" },
        { label: "残業", value: 30, color: "info" },
      ],
    },
    {
      label: "D班",
      segments: [
        { label: "通常", value: 60, color: "primary" },
        { label: "残業", value: 50, color: "info" },
      ],
    },
];

// 上限を超えたグループはリングと destructive の合計値で示します。セグメントの色は変わりません。

export function ShiftHoursWithLimit() {
    return (
        <StackedBarChart
            data={shiftHours}
            threshold={90}
            thresholdLabel="上限"
            totalLabel="合計"
            showValues
            showLegend
        />
    );
}`,
} as const;

const states = {
    en: [
        {
            key: "vertical",
            title: "Vertical",
            description: "Default vertical stacked bars.",
            preview: <StackedBarChart data={dataByLocale.en} />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];

export function VerticalAcquisitionMix() {
    return <StackedBarChart data={data} />;
}`,
        },
        {
            key: "five-bars",
            title: "Five bars",
            description: "Checks spacing with five vertical groups.",
            preview: <StackedBarChart data={fiveBarDataByLocale.en} showValues />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
    {
        label: "Apr",
        segments: [
            { label: "Organic", value: 52, color: "primary" },
            { label: "Referral", value: 35, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
    {
        label: "May",
        segments: [
            { label: "Organic", value: 45, color: "primary" },
            { label: "Referral", value: 30, color: "success" },
            { label: "Paid", value: 22, color: "warning" },
        ],
    },
];

export function FiveMonthAcquisitionMix() {
    return <StackedBarChart data={data} showValues />;
}`,
        },
        {
            key: "legend",
            title: "Legend and values",
            description: "Shows totals and segment legend.",
            preview: <StackedBarChart data={dataByLocale.en} showLegend showValues totalLabel="Total" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];

export function AcquisitionMixWithLegend() {
    return <StackedBarChart data={data} showLegend showValues totalLabel="Total" />;
}`,
        },
        {
            key: "horizontal",
            title: "Horizontal",
            description: "Registered horizontal variant for row comparison.",
            preview: <StackedBarChart data={dataByLocale.en} variant="horizontal" showValues />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];

export function HorizontalAcquisitionMix() {
    return <StackedBarChart data={data} variant="horizontal" showValues />;
}`,
        },
        {
            key: "threshold",
            title: "Threshold (over limit)",
            description: "threshold draws a limit line on each group's total and marks over-limit groups with a ring + a destructive total. Segment colours are never changed — they carry their own meaning. Drag the slider to move the limit. Ignored when normalize is set.",
            preview: <ThresholdStackDemo locale="en" />,
            previewBodyWidth: "xl",
            code: thresholdCode.en,
        },
        {
            key: "normalized",
            title: "Normalized",
            description: "Compares every group as a 100% composition.",
            preview: <StackedBarChart data={dataByLocale.en} variant="horizontal" normalize showLegend />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "Jan",
        segments: [
            { label: "Organic", value: 42, color: "primary" },
            { label: "Referral", value: 24, color: "success" },
            { label: "Paid", value: 18, color: "warning" },
        ],
    },
    {
        label: "Feb",
        segments: [
            { label: "Organic", value: 48, color: "primary" },
            { label: "Referral", value: 31, color: "success" },
            { label: "Paid", value: 16, color: "warning" },
        ],
    },
    {
        label: "Mar",
        segments: [
            { label: "Organic", value: 38, color: "primary" },
            { label: "Referral", value: 28, color: "success" },
            { label: "Paid", value: 26, color: "warning" },
        ],
    },
];

export function NormalizedAcquisitionMix() {
    return <StackedBarChart data={data} variant="horizontal" normalize showLegend />;
}`,
        },
    ],
    ja: [
        {
            key: "vertical",
            title: "縦棒",
            description: "標準の縦積み上げ棒です。",
            preview: <StackedBarChart data={dataByLocale.ja} totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];

export function VerticalAcquisitionMix() {
    return <StackedBarChart data={data} totalLabel="合計" />;
}`,
        },
        {
            key: "five-bars",
            title: "5本表示",
            description: "5つのグループで、棒の太さと間隔を確認します。",
            preview: <StackedBarChart data={fiveBarDataByLocale.ja} showValues totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
    {
        label: "4月",
        segments: [
            { label: "自然流入", value: 52, color: "primary" },
            { label: "紹介", value: 35, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
    {
        label: "5月",
        segments: [
            { label: "自然流入", value: 45, color: "primary" },
            { label: "紹介", value: 30, color: "success" },
            { label: "広告", value: 22, color: "warning" },
        ],
    },
];

export function FiveMonthAcquisitionMix() {
    return <StackedBarChart data={data} showValues totalLabel="合計" />;
}`,
        },
        {
            key: "legend",
            title: "凡例と値",
            description: "合計値とセグメント凡例を表示します。",
            preview: <StackedBarChart data={dataByLocale.ja} showLegend showValues totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];

export function AcquisitionMixWithLegend() {
    return <StackedBarChart data={data} showLegend showValues totalLabel="合計" />;
}`,
        },
        {
            key: "horizontal",
            title: "横棒",
            description: "行ごとに比較しやすい横向きバリエーションです。",
            preview: <StackedBarChart data={dataByLocale.ja} variant="horizontal" showValues totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];

export function HorizontalAcquisitionMix() {
    return <StackedBarChart
      data={data}
      variant="horizontal"
      showValues
      totalLabel="合計"
    />;
}`,
        },
        {
            key: "threshold",
            title: "閾値（上限超え）",
            description: "threshold は各グループの合計に上限ラインを引き、超過グループをリング＋destructive の合計値で示します。segment の色は一切変えません（それぞれ意味を持つため）。スライダーで上限を動かせます。normalize 指定時は無視されます。",
            preview: <ThresholdStackDemo locale="ja" />,
            previewBodyWidth: "xl",
            code: thresholdCode.ja,
        },
        {
            key: "normalized",
            title: "正規化",
            description: "各グループを 100% にそろえて構成比を比較します。",
            preview: <StackedBarChart data={dataByLocale.ja} variant="horizontal" normalize showLegend totalLabel="合計" />,
            previewBodyWidth: "xl",
            code: `import { StackedBarChart } from "@gunjo/ui";

const data = [
    {
        label: "1月",
        segments: [
            { label: "自然流入", value: 42, color: "primary" },
            { label: "紹介", value: 24, color: "success" },
            { label: "広告", value: 18, color: "warning" },
        ],
    },
    {
        label: "2月",
        segments: [
            { label: "自然流入", value: 48, color: "primary" },
            { label: "紹介", value: 31, color: "success" },
            { label: "広告", value: 16, color: "warning" },
        ],
    },
    {
        label: "3月",
        segments: [
            { label: "自然流入", value: 38, color: "primary" },
            { label: "紹介", value: 28, color: "success" },
            { label: "広告", value: 26, color: "warning" },
        ],
    },
];

export function NormalizedAcquisitionMix() {
    return <StackedBarChart
      data={data}
      variant="horizontal"
      normalize
      showLegend
      totalLabel="合計"
    />;
}`,
        },
    ],
} as const;

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>上限の超過を、系列の色を変えずに示します。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> は各グループの合計に対する線です。超えたグループは全周のリングと、合計値の色と太さで示し、帯の色は1つも変えません。系列の色にはそれぞれ意味があるからです（#285）。文字の側にも出ていて、各帯の読み上げ名の末尾に「(over Limit)」が付きます。
            </li>
            <li>
                <strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">normalize</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> は同時に効きません。黙って無視せず、警告します。</strong>すべてのグループが 100% になると、実数の上限には置き場所がありません。両方を渡した場合は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> を無視し、開発中はその理由をコンソールに出します。両方が要る画面になったら、図を2つに分けてください。
            </li>
            <li>
                <strong>帯の読み上げ名には、いつも取り分が入ります。</strong>「グループ名 系列名: 値（Total: 合計 / NN%）」の形です。帯が細くて数字を書けないときでも、割合はキーボードと読み上げには届きます。積む順は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> の並び順そのままで、配列の先頭が下段になります。資料が最も効く判断に挙げる「比べさせたい系列を最下段に置く」は、配列を並べ替えて行います。数値の整形は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> のほかに、サーバーコンポーネントからも渡せる <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> を持っています（#338）。
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>Crossing the limit is marked without touching the segment colours.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> is a line against each group&rsquo;s total. An over-limit group is marked with a ring around the whole stack and by the weight and colour of its total readout; not one band changes colour, because each segment&rsquo;s colour already means something (#285). The state is in text as well: every band appends “(over Limit)” to its accessible name.
            </li>
            <li>
                <strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">normalize</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> cannot both apply, and the conflict is not swallowed.</strong> Once every group renders at 100%, an absolute limit has nowhere to sit on the track. Passing both ignores <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> and logs why in development. When a screen genuinely needs both, split it into two charts.
            </li>
            <li>
                <strong>Every band announces its share.</strong> The accessible name reads “group, segment: value (Total: total / NN%)”, so the share reaches keyboard and screen-reader users even when a band is too thin to hold a number. Stacking order follows <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> exactly, first item at the bottom, which is how you apply the article&rsquo;s sharpest rule: put the series you want compared at the base. Alongside <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> this chart takes the serializable <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code>, which a Server Component can pass (#338).
            </li>
        </>
    ),
};

// 本文からこの節へ移した UIXHERO の記事リンク（gunjo #955 の受け口）。
const uixheroLinks: Record<"ja" | "en", UixheroLink[]> = {
    ja: [
        {
            label: "UIXHERO: 積み上げ棒グラフ（Stacked Bar Chart）",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/stacked-bar-chart`,
        },
    ],
    en: [
        {
            label: "UIXHERO: Stacked Bar Chart (in Japanese)",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/stacked-bar-chart`,
        },
    ],
};

export default function StackedBarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;

    return (
        <ChartDocPage
            designDecisions={designDecisions}
            title={{ en: meta.stackedBarChart.title, ja: "積み上げ棒チャート" }}
            description={{
                en: meta.stackedBarChart.description,
                ja: "グループごとの内訳と合計を、縦または横の積み上げ棒で比較するチャートです。",
            }}
            code={code}
            usageCode={usageCode}
            propsData={propsData}
            demo="stacked-bar-chart"
            embedBase="/embed/stacked-bar-chart"
            previewHeight={620}
            states={states}
            usedComponents={{
                en: [
                    { name: "StackedBarChart", href: "/docs/components/stacked-bar-chart" },
                    { name: "ChartLegend", href: "/docs/components/chart-legend" },
                    { name: "Tooltip", href: "/docs/components/tooltip" },
                ],
                ja: [
                    { name: "積み上げ棒チャート", href: "/docs/components/stacked-bar-chart" },
                    { name: "チャート凡例", href: "/docs/components/chart-legend" },
                    { name: "ツールチップ", href: "/docs/components/tooltip" },
                ],
            }}
            relatedComponents={{
                en: [
                    { name: "BarChart", href: "/docs/components/bar-chart" },
                    { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                ],
                ja: [
                    { name: "棒グラフ", href: "/docs/components/bar-chart" },
                    { name: "分布バー", href: "/docs/components/distribution-bar" },
                ],
            }}
            uixheroLinks={uixheroLinks}
        />
    );
}
