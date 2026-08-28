"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { BarChart } from "@gunjo/ui";

const weeklyData = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
    { label: "金", value: 54, color: "primary" },
];

const channelData = [
    { label: "検索", value: 74, color: "primary" },
    { label: "SNS", value: 48, color: "info" },
    { label: "広告", value: 62, color: "warning" },
    { label: "紹介", value: 31, color: "success" },
];

// Editable threshold demo: drag the limit and watch bars cross it turn destructive. (#285)
function ThresholdBarDemo({ locale }: { locale: "ja" | "en" }) {
    const isJa = locale === "ja";
    const [threshold, setThreshold] = React.useState(55);
    const data = [
        { label: isJa ? "A棟" : "A", value: 42, color: "primary" as const },
        { label: isJa ? "B棟" : "B", value: 68, color: "primary" as const },
        { label: isJa ? "C棟" : "C", value: 51, color: "primary" as const },
        { label: isJa ? "D棟" : "D", value: 73, color: "primary" as const },
        { label: isJa ? "E棟" : "E", value: 38, color: "primary" as const },
    ];
    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <BarChart data={data} threshold={threshold} thresholdLabel={isJa ? "上限" : "Limit"} showValues />
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="shrink-0">{isJa ? "上限" : "Limit"}</span>
                <span className="w-8 shrink-0 font-medium tabular-nums text-foreground">{threshold}</span>
                <input
                    type="range"
                    min={20}
                    max={90}
                    value={threshold}
                    onChange={(event) => setThreshold(Number(event.target.value))}
                    className="min-w-0 flex-1"
                    aria-label={isJa ? "上限を調整" : "Adjust the limit"}
                />
            </label>
        </div>
    );
}

const codeByLocale = {
    en: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
];

export function WeeklyActivityBars() {
    return (
        <BarChart data={data} averageValue={50} averageLabel="Average" />
    );
}`,
    ja: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
];

export function WeeklyActivityBars() {
    return (
        <BarChart data={data} averageValue={50} averageLabel="平均" />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
];

export function BarChartUsage() {
    return (
        <div className="grid gap-6">
            <BarChart data={data} />
            <BarChart data={data} variant="horizontal" showValues />
            <BarChart data={data} averageValue={50} averageLabel="Average" />
            <BarChart data={data} showGrid={false} showLabels={false} />
        </div>
    );
}`,
    ja: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
];

export function BarChartUsage() {
    return (
        <div className="grid gap-6">
            <BarChart data={data} />
            <BarChart data={data} variant="horizontal" showValues />
            <BarChart data={data} averageValue={50} averageLabel="平均" />
            <BarChart data={data} showGrid={false} showLabels={false} />
        </div>
    );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        vertical: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
    { label: "Fri", value: 54, color: "primary" },
];

export function WeeklyActivityBars() {
    return (
        <BarChart data={data} className="mx-auto max-w-md" />
    );
}`,
        reference: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
    { label: "Fri", value: 54, color: "primary" },
];

export function WeeklyActivityWithAverage() {
    return (
        <BarChart
            data={data}
            averageValue={50}
            averageLabel="Average"
            className="mx-auto max-w-md"
            showValues
        />
    );
}`,
        horizontal: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Search", value: 74, color: "primary" },
    { label: "Social", value: 48, color: "info" },
    { label: "Ads", value: 62, color: "warning" },
    { label: "Referral", value: 31, color: "success" },
];

export function ChannelRankingBars() {
    return (
        <BarChart data={data} variant="horizontal" showValues />
    );
}`,
        threshold: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "A", value: 42, color: "primary" },
    { label: "B", value: 68, color: "primary" },
    { label: "C", value: 51, color: "primary" },
    { label: "D", value: 73, color: "primary" },
];

// Bars above 55 turn destructive; a limit line is drawn at 55.
export function ThresholdBars() {
    return (
        <BarChart
            data={data}
            threshold={55}
            thresholdLabel="Limit"
            showValues
        />
    );
}`,
        quiet: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "Mon", value: 42, color: "primary" },
    { label: "Tue", value: 58, color: "success" },
    { label: "Wed", value: 36, color: "warning" },
    { label: "Thu", value: 68, color: "info" },
    { label: "Fri", value: 54, color: "primary" },
];

export function QuietWeeklyBars() {
    return (
        <BarChart
            data={data}
            className="mx-auto max-w-md"
            showGrid={false}
            showLabels={false}
        />
    );
}`,
    },
    ja: {
        vertical: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
    { label: "金", value: 54, color: "primary" },
];

export function WeeklyActivityBars() {
    return (
        <BarChart data={data} className="mx-auto max-w-md" />
    );
}`,
        reference: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
    { label: "金", value: 54, color: "primary" },
];

export function WeeklyActivityWithAverage() {
    return (
        <BarChart
            data={data}
            averageValue={50}
            averageLabel="平均"
            className="mx-auto max-w-md"
            showValues
        />
    );
}`,
        horizontal: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "検索", value: 74, color: "primary" },
    { label: "SNS", value: 48, color: "info" },
    { label: "広告", value: 62, color: "warning" },
    { label: "紹介", value: 31, color: "success" },
];

export function ChannelRankingBars() {
    return (
        <BarChart data={data} variant="horizontal" showValues />
    );
}`,
        threshold: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "A", value: 42, color: "primary" },
    { label: "B", value: 68, color: "primary" },
    { label: "C", value: 51, color: "primary" },
    { label: "D", value: 73, color: "primary" },
];

// 55 を超えた棒は destructive トーンになり、55 の位置に上限ラインを引きます。
export function ThresholdBars() {
    return (
        <BarChart
            data={data}
            threshold={55}
            thresholdLabel="上限"
            showValues
        />
    );
}`,
        quiet: `import { BarChart } from "@gunjo/ui";

const data = [
    { label: "月", value: 42, color: "primary" },
    { label: "火", value: 58, color: "success" },
    { label: "水", value: 36, color: "warning" },
    { label: "木", value: 68, color: "info" },
    { label: "金", value: 54, color: "primary" },
];

export function QuietWeeklyBars() {
    return (
        <BarChart
            data={data}
            className="mx-auto max-w-md"
            showGrid={false}
            showLabels={false}
        />
    );
}`,
    },
} as const;

const propsDataByLocale = {
    en: [
        { name: "data", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "Bars to render. Values are normalized against max." },
        { name: "variant", type: "\"horizontal\" | \"vertical\"", default: "\"vertical\"", description: "Registered SSOT variant for chart orientation." },
        { name: "max", type: "number", description: "Explicit maximum value. Defaults to the largest data or reference value." },
        { name: "averageValue", type: "number", description: "Optional dashed average or reference marker." },
        { name: "averageLabel", type: "ReactNode", default: "\"Average\"", description: "Tooltip and accessible label for the average or reference marker." },
        { name: "threshold", type: "number", description: "A capacity/limit line. Bars above it are painted in thresholdTone (over-limit = bad) and a reference line is drawn. (#285)" },
        { name: "thresholdLabel", type: "ReactNode", default: "\"Limit\"", description: "Tooltip and accessible label for the threshold line." },
        { name: "thresholdTone", type: "ChartTone", default: "\"destructive\"", description: "Tone applied to bars over the threshold." },
        { name: "showGrid", type: "boolean", default: "true", description: "Shows the horizontal reference grid in vertical mode." },
        { name: "showLabels", type: "boolean", default: "true", description: "Shows category labels next to or below bars." },
        { name: "showValues", type: "boolean", default: "false", description: "Shows formatted values next to horizontal bars or above vertical bars." },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "Formats bar, average marker, and tooltip values." },
    ],
    ja: [
        { name: "data", type: "{ label?: ReactNode; value: number; color?: ChartColor }[]", description: "表示する棒のデータです。値は max を基準に正規化されます。" },
        { name: "variant", type: "\"horizontal\" | \"vertical\"", default: "\"vertical\"", description: "棒の向きを切り替える SSOT 登録済みバリアントです。" },
        { name: "max", type: "number", description: "明示的な最大値です。未指定時は data または基準値の最大値を使います。" },
        { name: "averageValue", type: "number", description: "任意の平均値・基準値マーカーです。" },
        { name: "averageLabel", type: "ReactNode", default: "\"Average\"", description: "平均値・基準値マーカーのツールチップとアクセシブルラベルです。" },
        { name: "threshold", type: "number", description: "容量・上限ライン。これを超えた棒を thresholdTone で塗り（超過＝bad）、基準線を描きます。(#285)" },
        { name: "thresholdLabel", type: "ReactNode", default: "\"Limit\"", description: "閾値ラインのツールチップとアクセシブルラベルです。" },
        { name: "thresholdTone", type: "ChartTone", default: "\"destructive\"", description: "閾値を超えた棒に適用するトーンです。" },
        { name: "showGrid", type: "boolean", default: "true", description: "縦棒表示の横方向の補助線を表示します。" },
        { name: "showLabels", type: "boolean", default: "true", description: "棒の横または下にカテゴリラベルを表示します。" },
        { name: "showValues", type: "boolean", default: "false", description: "横棒では棒の横に、縦棒では棒の上にフォーマット済みの値を表示します。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "棒、平均値マーカー、ツールチップの値を整形します。" },
    ],
} as const;

export default function BarChartPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];

    return (
        <ComponentLayout
            title={meta.barChart.title}
            description={meta.barChart.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "BarChart", href: "/docs/components/bar-chart" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "StackedBarChart", href: "/docs/components/stacked-bar-chart" },
                { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "ChartLegend", href: "/docs/components/chart-legend" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="bar-chart"
                embedBase="/embed/bar-chart"
                previewHeight={560}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "vertical",
                            title: locale === "ja" ? "縦棒" : "Vertical bars",
                            description: locale === "ja"
                                ? "カテゴリ別の量を縦方向の高さで比較する標準の SSOT variant です。"
                                : "The default registered SSOT variant for comparing categories by vertical height.",
                            preview: <BarChart data={weeklyData} className="mx-auto max-w-md" />,
                            code: stateCodeByLocale[locale].vertical,
                        },
                        {
                            key: "reference",
                            title: locale === "ja" ? "基準線と値表示" : "Reference marker with values",
                            description: locale === "ja"
                                ? "平均値や目標値を破線で重ね、各棒の値も表示する状態です。"
                                : "Adds a dashed average or target marker and visible values for each bar.",
                            preview: (
                                <BarChart
                                    data={weeklyData}
                                    averageValue={50}
                                    averageLabel={locale === "ja" ? "平均" : "Average"}
                                    className="mx-auto max-w-md"
                                    showValues
                                />
                            ),
                            code: stateCodeByLocale[locale].reference,
                        },
                        {
                            key: "threshold",
                            title: locale === "ja" ? "閾値トーン（上限超え）" : "Threshold tone (over limit)",
                            description: locale === "ja"
                                ? "threshold を渡すと上限ラインを引き、それを超えた棒を destructive トーンで塗ります。スライダーで上限を動かすと、棒が超過した瞬間に色が変わります。"
                                : "Pass threshold to draw a limit line and paint bars above it in the destructive tone. Drag the slider to move the limit and watch bars flip as they cross it.",
                            preview: <ThresholdBarDemo locale={locale} />,
                            code: stateCodeByLocale[locale].threshold,
                        },
                        {
                            key: "horizontal",
                            title: locale === "ja" ? "横棒" : "Horizontal bars",
                            description: locale === "ja"
                                ? "項目名が長い比較やランキングで使う SSOT variant です。"
                                : "A registered SSOT variant for rankings or comparisons with longer category labels.",
                            preview: <BarChart data={channelData} variant="horizontal" showValues />,
                            code: stateCodeByLocale[locale].horizontal,
                        },
                        {
                            key: "quiet",
                            title: locale === "ja" ? "補助線とラベルなし" : "Without grid or labels",
                            description: locale === "ja"
                                ? "カード内の小さな推移表示など、周辺文脈で項目が分かる場合の props 状態です。"
                                : "A prop state for compact card contexts where surrounding copy already identifies the categories.",
                            preview: <BarChart data={weeklyData} className="mx-auto max-w-md" showGrid={false} showLabels={false} />,
                            code: stateCodeByLocale[locale].quiet,
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
                            <strong>基線を動かす指定を、作りませんでした。</strong>資料は「縦軸はゼロから始める」を最優先の判断に挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BarChart</code> には下端を決める prop がありません。棒の長さは常に「値 ÷ 上端 × 100」で、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> は上端を上げるだけです。差が小さくて読み取れないときに軸を切る、という逃げ道を部品の側で塞いでいます。
                        </li>
                        <li>
                            <strong>上限の超過は、色と同時に読み上げ名にも入ります。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> を渡すと上限の線が引かれ、超えた棒が <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thresholdTone</code>（既定は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">destructive</code>）で塗られます。それだけでは色だけの合図になるので、超えた棒の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> の末尾に「(over Limit)」が付きます（#285）。画面の上でも文字にしたいときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValues</code> を足してください。上端は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code>・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">averageValue</code>・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code>・データの最大値のうち最も大きいものになるので、線が枠の外に出ることはありません。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thresholdLabel</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">averageLabel</code> の既定は英語なので、日本語の画面では渡し直します。
                        </li>
                        <li>
                            <strong>数値の整形は、呼ぶ側に残しました。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> は関数を渡す prop なので、サーバーコンポーネントからは渡せません。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PieChart</code> などにはシリアライズできる <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> を足しましたが（#338）、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BarChart</code> にはまだありません。桁区切りを変えたいときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'"use client"'}</code> の境界を挟みます。棒は div の幅と高さで描いていて SVG ではないので、色は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ChartTone</code> の名前で渡します。綴りを間違えた色は開発中に一度だけ警告が出ます（#296）。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/bar-chart"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: 棒グラフ（Bar Chart）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>There is no way to move the baseline.</strong> The article makes “start the value axis at zero” its first principle. GUNJO&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BarChart</code> has no prop for the lower bound. A bar&rsquo;s length is always value divided by the top of the scale, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> only raises that top. The escape hatch of truncating the axis when differences look too small is closed inside the component.
                        </li>
                        <li>
                            <strong>Crossing the limit is announced in text, not only in colour.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> and the chart draws a limit line and paints bars above it in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thresholdTone</code> (default <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">destructive</code>). Colour alone would not reach every reader, so each over-limit bar appends “(over Limit)” to its <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> (#285). Add <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showValues</code> when the same signal has to be readable on screen. The top of the scale is the largest of <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">averageValue</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">threshold</code> and the data, so a reference line never lands outside the track. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">thresholdLabel</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">averageLabel</code> default to English and should be replaced on a Japanese screen.
                        </li>
                        <li>
                            <strong>Number formatting stays with the caller.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> is a function prop, so it cannot be passed from a Server Component. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PieChart</code> and its siblings gained the serializable <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> (#338); <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BarChart</code> has not yet. Until it does, put a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'"use client"'}</code> boundary in between. Bars are plain divs sized by width and height rather than SVG, so colours arrive as <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ChartTone</code> names; a misspelled tone warns once in development (#296).
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/bar-chart"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Bar Chart (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
