"use client";

import Link from "next/link";
import { IconArrowRight as ArrowRight, IconChartDots3 as ChartNoAxesCombined } from "@tabler/icons-react";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@gunjo/ui";

import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";

const code = `import { useState } from "react";
import {
    ActivityTimelineCard,
    AnalyticsCard,
    BarChart,
    Button,
    ChoroplethMap,
    ConcentricProgressCard,
    DonutChart,
    HeatmapChart,
    LabeledDonutCard,
    LineChart,
    MiniDistributionBarCard,
    NumberInput,
    QuadrantMatrix,
    RadialBarChart,
    RadarChart,
    RetentionCohortCard,
    RibbonChart,
    SegmentTimelineCard,
    SegmentedGaugeCard,
    SparklineChart,
    StackedBarChart,
} from "@gunjo/ui";

export function DashboardPanel() {
    const [values, setValues] = useState([42, 58, 36, 68, 51, 74]);
    const barData = values.map((value, index) => ({
        label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index],
        value,
    }));
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const times = ["00", "04", "08", "12", "16", "20"];
    const heatmapData = times.flatMap((y, row) =>
        days.map((x, column) => ({
            x,
            y,
            value: Math.min(100, values[row % values.length] + column * 4),
        }))
    );
    const tokyoRegions = [
        {
            id: "shinjuku",
            label: "Shinjuku",
            value: values[0],
            geometry: {
                type: "Polygon",
                coordinates: [[[139.68, 35.71], [139.72, 35.71], [139.72, 35.67], [139.68, 35.67]]],
            },
        },
        {
            id: "shibuya",
            label: "Shibuya",
            value: values[1],
            geometry: {
                type: "Polygon",
                coordinates: [[[139.67, 35.67], [139.71, 35.67], [139.71, 35.63], [139.67, 35.63]]],
            },
        },
        {
            id: "chiyoda",
            label: "Chiyoda",
            value: values[2],
            geometry: {
                type: "Polygon",
                coordinates: [[[139.74, 35.70], [139.78, 35.70], [139.78, 35.67], [139.74, 35.67]]],
            },
        },
    ];
    const matrixItems = [
        { id: "activation", label: "Activation", value: values[0], x: 72, y: 34 },
        { id: "expansion", label: "Expansion", value: values[1], x: 58, y: 24 },
        { id: "retention", label: "Retention", value: values[2], x: 42, y: 44 },
    ];
    const radarData = values.map((value, index) => ({
        label: ["Reach", "Quality", "Revenue", "Retention", "Speed", "Risk"][index],
        value,
    }));
    const retentionPeriods = ["M0", "M1", "M2", "M3", "M4", "M5"];
    const activitySlots = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM"].map((label, index) => ({
        label,
        value: Math.min(200, values[index] * 2),
    }));
    const activitySegments = [
        { label: "Walking", value: values[0] * 2 },
        { label: "Running", value: values[1] * 3 },
        { label: "Workout", value: values[2] * 2 },
    ];
    const labeledDonutSegments = [
        { label: "Amazon", value: values[0] },
        { label: "Alibaba", value: values[1] },
        { label: "Tokopedia", value: values[2] },
    ];
    const segmentedGaugeSegments = [
        { label: "Essentials", value: 35, rangeLabel: "Fixed" },
        { label: "Growth", value: 45, rangeLabel: "Investment" },
        { label: "Operations", value: 20, rangeLabel: "Capacity" },
    ];
    const miniDistributionSegments = [
        { label: "Accessories", value: 58, detail: "45 products" },
        { label: "Devices", value: 26, detail: "53 products" },
        { label: "Services", value: 16, detail: "61 products" },
    ];
    const segmentTimelineSegments = [
        { label: "Deep sleep", value: 112, start: 0, end: 112, color: "primary" },
        { label: "Light sleep", value: 248, start: 112, end: 360, color: "info" },
        { label: "REM", value: 86, start: 360, end: 446, color: "success" },
        { label: "Awake", value: 28, start: 446, end: 474, color: "warning" },
    ];
    const retentionCohorts = [
        {
            label: "Jan cohort",
            size: 1240,
            values: values.map((value, index) => ({
                value: index === 0 ? 100 : Math.max(24, value),
            })),
        },
        {
            label: "Feb cohort",
            size: 1144,
            values: values.slice(0, 5).map((value, index) => ({
                value: index === 0 ? 100 : Math.max(24, value - 4),
            })),
        },
    ];
    const lineSeries = [
        { label: "Revenue", data: barData, color: "primary" },
        {
            label: "Target",
            color: "success",
            data: values.map((value, index) => ({
                label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index],
                value: Math.round(value * 0.82 + 12 + index * 2),
            })),
        },
    ];
    const ribbonLayers = [
        {
            label: "New",
            color: "primary",
            data: values.map((value, index) => ({
                label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index],
                value: Math.round(value * 0.58),
            })),
        },
        {
            label: "Returning",
            color: "success",
            data: values.map((value, index) => ({
                label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index],
                value: Math.round(value * 0.42),
            })),
        },
        {
            label: "Expansion",
            color: "warning",
            data: values.map((value, index) => ({
                label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index],
                value: Math.round(value * 0.28),
            })),
        },
    ];
    const radialData = [
        { label: "Website", value: values[0], color: "primary" },
        { label: "Market", value: values[1], color: "success" },
        { label: "Shopping", value: values[2], color: "warning" },
    ];
    const concentricRings = [
        { label: "Documents", value: 42, color: "primary" },
        { label: "Media", value: 68, color: "info" },
        { label: "Apps", value: 27, color: "success" },
        { label: "System", value: 18, color: "warning" },
    ];
    const stackedData = ["Jan", "Feb", "Mar", "Apr"].map((label, index) => ({
        label,
        segments: [
            { label: "Organic", value: values[index], color: "primary" },
            { label: "Referral", value: values[(index + 1) % values.length], color: "success" },
            { label: "Paid", value: values[(index + 2) % values.length], color: "warning" },
        ],
    }));

    return (
        <div className="grid gap-4">
            <AnalyticsCard title="Revenue" value="$45,231" delta="+8.2%" deltaDescription="Compared with the previous period." trend="up">
                <SparklineChart data={values} variant="area" />
            </AnalyticsCard>
            <AnalyticsCard title="Sessions" value="18,420" delta="avg" deltaDescription="Average of the current values.">
                <BarChart data={barData} showValues />
            </AnalyticsCard>
            <AnalyticsCard title="Revenue trend" value="$45,231" delta="+8.2%" deltaDescription="Compared with the previous period.">
                <LineChart series={lineSeries} variant="area" referenceValue={55} showLegend />
            </AnalyticsCard>
            <AnalyticsCard title="Flow distribution" value="612" delta="+18" deltaDescription="Change from the first point in the preview data.">
                <RibbonChart layers={ribbonLayers} variant="flow" showLegend />
            </AnalyticsCard>
            <AnalyticsCard title="Channel progress" value="64% avg">
                <RadialBarChart data={radialData} centerValue="64%" centerLabel="Average" showLegend />
            </AnalyticsCard>
            <ConcentricProgressCard
                title="Storage overview"
                description="Concentric progress"
                value="155GB"
                centerLabel="Used storage"
                delta="61%"
                rings={concentricRings}
                selectedIndex={1}
                max={256}
                formatValue={(value) => \`\${value}GB\`}
            />
            <AnalyticsCard title="Channel stack" value="4 groups">
                <StackedBarChart data={stackedData} showLegend />
            </AnalyticsCard>
            <MiniDistributionBarCard
                title="Product categories"
                description="Mini distribution"
                value="58%"
                delta="+3.2%"
                segments={miniDistributionSegments}
                selectedIndex={0}
                tickCount={32}
            />
            <AnalyticsCard title="Segment mix" value="100%">
                <DonutChart segments={barData} centerValue="100%" centerLabel="Total" />
            </AnalyticsCard>
            <LabeledDonutCard
                title="Sales by platform"
                description="Platform share"
                centerValue="105"
                centerLabel="Total"
                segments={labeledDonutSegments}
                selectedIndex={0}
            />
            <AnalyticsCard title="Density" value="84% peak" delta="+12pt" deltaDescription="Difference between the peak value and the current average.">
                <HeatmapChart data={heatmapData} xLabels={days} yLabels={times} />
            </AnalyticsCard>
            <ActivityTimelineCard
                title="Energy timeline"
                description="Activity timeline"
                delta="+18%"
                metrics={[
                    { label: "Than yesterday", value: "+18%" },
                    { label: "Burned", value: "760 kcal" },
                    { label: "Daily avg", value: "253 kcal" },
                ]}
                slots={activitySlots}
                segments={activitySegments}
                selectedSlot={3}
                max={200}
            />
            <SegmentTimelineCard
                title="Sleep stages"
                description="Segment timeline"
                delta="+7%"
                metrics={[
                    { label: "Sleep quality", value: "83%" },
                    { label: "Time asleep", value: "7h 26m" },
                    { label: "Awake time", value: "28m" },
                ]}
                segments={segmentTimelineSegments}
                selectedIndex={1}
                min={0}
                max={474}
                startLabel="11:42 PM"
                endLabel="7:18 AM"
            />
            <RetentionCohortCard title="Cohort retention" value="62%" periods={retentionPeriods} cohorts={retentionCohorts} selectedCell={{ cohortIndex: 1, periodIndex: 2 }} />
            <AnalyticsCard title="Tokyo incidents" value="92 peak">
                <ChoroplethMap regions={tokyoRegions} selectedId="shinjuku" showRanking />
            </AnalyticsCard>
            <AnalyticsCard title="Quadrant matrix" value="88% peak" delta="+18pt" deltaDescription="Difference between the top ranked value and the current average.">
                <QuadrantMatrix items={matrixItems} selectedId="activation" showRanking />
            </AnalyticsCard>
            <SegmentedGaugeCard
                title="Spend breakdown"
                description="Segmented gauge"
                value={82}
                valueLabel="82%"
                centerLabel="Current spend"
                targetValue={90}
                targetLabel="Target spend"
                segments={segmentedGaugeSegments}
                selectedIndex={1}
                max={100}
                formatValue={(value) => \`\${value}%\`}
            />
            <AnalyticsCard title="Capability balance" value="64% avg" delta="+14pt" deltaDescription="Difference from the 50% reference baseline.">
                <RadarChart data={radarData} max={100} />
            </AnalyticsCard>
            <NumberInput value={values[0]} min={0} max={100} onValueChange={(value) => {
                setValues((current) => current.map((item, index) => index === 0 ? value : item));
            }} />
            <Button type="button" onClick={() => setValues([42, 58, 36, 68, 51, 74])}>
                Reset
            </Button>
        </div>
    );
}`;

const codeByLocale = {
    en: code,
    ja: [
        [`"Jan"`, `"1月"`],
        [`"Feb"`, `"2月"`],
        [`"Mar"`, `"3月"`],
        [`"Apr"`, `"4月"`],
        [`"May"`, `"5月"`],
        [`"Jun"`, `"6月"`],
        [`"Mon"`, `"月"`],
        [`"Tue"`, `"火"`],
        [`"Wed"`, `"水"`],
        [`"Thu"`, `"木"`],
        [`"Fri"`, `"金"`],
        [`"Sat"`, `"土"`],
        [`"Sun"`, `"日"`],
        [`"Shinjuku"`, `"新宿区"`],
        [`"Shibuya"`, `"渋谷区"`],
        [`"Chiyoda"`, `"千代田区"`],
        [`"Activation"`, `"有効化"`],
        [`"Expansion"`, `"拡張"`],
        [`"Retention"`, `"継続"`],
        [`"Reach"`, `"到達"`],
        [`"Quality"`, `"品質"`],
        [`"Revenue"`, `"売上"`],
        [`"Speed"`, `"速度"`],
        [`"Risk"`, `"リスク"`],
        [`"M0"`, `"初月"`],
        [`"M1"`, `"1か月"`],
        [`"M2"`, `"2か月"`],
        [`"M3"`, `"3か月"`],
        [`"M4"`, `"4か月"`],
        [`"M5"`, `"5か月"`],
        [`"6 AM"`, `"6時"`],
        [`"8 AM"`, `"8時"`],
        [`"10 AM"`, `"10時"`],
        [`"12 PM"`, `"12時"`],
        [`"2 PM"`, `"14時"`],
        [`"4 PM"`, `"16時"`],
        [`"Walking"`, `"ウォーク"`],
        [`"Running"`, `"ラン"`],
        [`"Workout"`, `"ワークアウト"`],
        [`"Essentials"`, `"基礎費"`],
        [`"Growth"`, `"成長投資"`],
        [`"Operations"`, `"運用費"`],
        [`"Fixed"`, `"固定費"`],
        [`"Investment"`, `"追加投資"`],
        [`"Capacity"`, `"運用余力"`],
        [`"Accessories"`, `"アクセサリ"`],
        [`"Devices"`, `"デバイス"`],
        [`"Services"`, `"サービス"`],
        [`"45 products"`, `"45 件"`],
        [`"53 products"`, `"53 件"`],
        [`"61 products"`, `"61 件"`],
        [`"Jan cohort"`, `"1月コホート"`],
        [`"Feb cohort"`, `"2月コホート"`],
        [`"Target"`, `"目標"`],
        [`"New"`, `"新規"`],
        [`"Returning"`, `"継続"`],
        [`"Website"`, `"Web"`],
        [`"Market"`, `"店舗"`],
        [`"Shopping"`, `"購買"`],
        [`"Organic"`, `"自然流入"`],
        [`"Referral"`, `"紹介"`],
        [`"Paid"`, `"広告"`],
        [`"Revenue trend"`, `"売上トレンド"`],
        [`"Flow distribution"`, `"流量分布"`],
        [`"Channel progress"`, `"チャネル進捗"`],
        [`"Average"`, `"平均"`],
        [`"Channel stack"`, `"チャネル内訳"`],
        [`"Segment mix"`, `"セグメント構成"`],
        [`"Total"`, `"合計"`],
        [`"Sales by platform"`, `"プラットフォーム別売上"`],
        [`"Platform share"`, `"プラットフォーム比率"`],
        [`"Density"`, `"密度"`],
        [`"Energy timeline"`, `"活動量タイムライン"`],
        [`"Activity timeline"`, `"活動タイムライン"`],
        [`"Than yesterday"`, `"昨日比"`],
        [`"Burned"`, `"消費"`],
        [`"Daily avg"`, `"日平均"`],
        [`"Cohort retention"`, `"コホート継続率"`],
        [`"Tokyo incidents"`, `"東京都インシデント"`],
        [`"Quadrant matrix"`, `"4象限マトリクス"`],
        [`"Spend breakdown"`, `"支出内訳"`],
        [`"Segmented gauge"`, `"セグメントゲージ"`],
        [`"Current spend"`, `"現在の支出"`],
        [`"Target spend"`, `"目標支出"`],
        [`"Product categories"`, `"商品カテゴリ"`],
        [`"Mini distribution"`, `"ミニ分布"`],
        [`"Capability balance"`, `"能力バランス"`],
        [`"Sessions"`, `"セッション"`],
        [`"Reset"`, `"リセット"`],
        [`"avg"`, `"平均"`],
        [`"groups"`, `"グループ"`],
        [`"peak"`, `"ピーク"`],
        [`"Compared with the previous period."`, `"前期間との比較です。"`],
        [`"Average of the current values."`, `"現在値の平均です。"`],
        [`"Change from the first point in the preview data."`, `"プレビュー内の最初の値との差分です。"`],
        [`"Difference between the peak value and the current average."`, `"ピーク値と現在の平均値との差分です。"`],
        [`"Difference between the top ranked value and the current average."`, `"ランキング上位値と現在の平均値との差分です。"`],
        [`"Difference from the 50% reference baseline."`, `"基準値 50% との差分です。"`],
    ].reduce((localizedCode, [from, to]) => localizedCode.split(from).join(to), code),
} as const;

const chartPages = [
    {
        titleKey: "AnalyticsCard",
        href: "/docs/components/analytics-card",
        description: {
            en: "Metric card shell for chart previews and deltas.",
            ja: "チャートプレビュー、差分、補足情報を載せるメトリックカードです。",
        },
    },
    {
        titleKey: "SparklineChart",
        href: "/docs/components/sparkline-chart",
        description: {
            en: "Compact line, area, or step trend chart.",
            ja: "密度の高いカード向けの小さな線・面・ステップチャートです。",
        },
    },
    {
        titleKey: "LineChart",
        href: "/docs/components/line-chart",
        description: {
            en: "Multi-series line or area chart for time-series comparison.",
            ja: "複数系列の時系列比較に使う線・面チャートです。",
        },
    },
    {
        titleKey: "RibbonChart",
        href: "/docs/components/ribbon-chart",
        description: {
            en: "Changing flow and segment width across periods.",
            ja: "期間ごとの流量やセグメント幅の変化を比較するチャートです。",
        },
    },
    {
        titleKey: "RadialBarChart",
        href: "/docs/components/radial-bar-chart",
        description: {
            en: "Concentric radial bars for progress and share comparison.",
            ja: "進捗・比率・容量を同心円バーで比較するチャートです。",
        },
    },
    {
        titleKey: "ConcentricProgressCard",
        href: "/docs/components/concentric-progress-card",
        description: {
            en: "Multi-ring progress card for storage, quota, and utilization widgets.",
            ja: "ストレージやクォータを複数リングで示す進捗カードです。",
        },
    },
    {
        titleKey: "BarChart",
        href: "/docs/components/bar-chart",
        description: {
            en: "Vertical or horizontal bar chart with an average marker.",
            ja: "平均値マーカー付きの縦棒・横棒チャートです。",
        },
    },
    {
        titleKey: "StackedBarChart",
        href: "/docs/components/stacked-bar-chart",
        description: {
            en: "Grouped stacked bars for segment comparison.",
            ja: "グループごとの内訳を比較する積み上げ棒チャートです。",
        },
    },
    {
        titleKey: "DistributionBar",
        href: "/docs/components/distribution-bar",
        description: {
            en: "Stacked percentage bar for segment distribution.",
            ja: "セグメントやチャネル構成を示す積み上げ割合バーです。",
        },
    },
    {
        titleKey: "MiniDistributionBarCard",
        href: "/docs/components/mini-distribution-bar-card",
        description: {
            en: "Compact tick distribution card for category share and utilization widgets.",
            ja: "カテゴリ構成や利用率を密集したティックバーで示すカードです。",
        },
    },
    {
        titleKey: "DonutChart",
        href: "/docs/components/donut-chart",
        description: {
            en: "Donut chart with proportional segments and center labels.",
            ja: "中央ラベル付きで構成比を示すドーナツチャートです。",
        },
    },
    {
        titleKey: "LabeledDonutCard",
        href: "/docs/components/labeled-donut-card",
        description: {
            en: "Donut chart card with central summary and external callouts.",
            ja: "中央サマリーと外部ラベルで構成比を見せるドーナツカードです。",
        },
    },
    {
        titleKey: "PieChart",
        href: "/docs/components/pie-chart",
        description: {
            en: "Pie chart for proportional segment comparison.",
            ja: "セグメントの構成比を比較する円グラフです。",
        },
    },
    {
        titleKey: "GaugeChart",
        href: "/docs/components/gauge-chart",
        description: {
            en: "Semi-circle gauge for scores, progress, and capacity.",
            ja: "スコア、進捗、容量を示す半円ゲージです。",
        },
    },
    {
        titleKey: "SegmentedGaugeCard",
        href: "/docs/components/segmented-gauge-card",
        description: {
            en: "Segmented semicircle gauge card for spend, risk, and progress status.",
            ja: "支出、リスク、進捗状態をセグメント付き半円ゲージで示すカードです。",
        },
    },
    {
        titleKey: "RadarChart",
        href: "/docs/components/radar-chart",
        description: {
            en: "Multi-axis radar chart for normalized score comparison.",
            ja: "複数軸の正規化スコアを比較するレーダーチャートです。",
        },
    },
    {
        titleKey: "HeatmapChart",
        href: "/docs/components/heatmap-chart",
        description: {
            en: "Density grid for day, time, and cohort intensity.",
            ja: "曜日・時間・コホートの密集度を示すヒートマップです。",
        },
    },
    {
        titleKey: "ActivityTimelineCard",
        href: "/docs/components/activity-timeline-card",
        description: {
            en: "Timeline card for activity, sleep, and operations segments.",
            ja: "活動量、睡眠、業務負荷の時間帯別データをまとめるカードです。",
        },
    },
    {
        titleKey: "SegmentTimelineCard",
        href: "/docs/components/segment-timeline-card",
        description: {
            en: "Horizontal segment timeline card for categorical duration ranges.",
            ja: "カテゴリ別の時間範囲を横方向に示すタイムラインカードです。",
        },
    },
    {
        titleKey: "RetentionCohortCard",
        href: "/docs/components/retention-cohort-card",
        description: {
            en: "Cohort retention card for period-by-period comparison.",
            ja: "コホートごとの継続率を期間別に比較するカードです。",
        },
    },
    {
        titleKey: "ChoroplethMap",
        href: "/docs/components/choropleth-map",
        description: {
            en: "Region density map with markers and ranked locations.",
            ja: "地域別の密集度、地点マーカー、ランキングを示す地図です。",
        },
    },
    {
        titleKey: "QuadrantMatrix",
        href: "/docs/components/quadrant-matrix",
        description: {
            en: "Four-quadrant matrix with ranked plotted items.",
            ja: "項目を x/y 位置で配置してランキングできる4象限マトリクスです。",
        },
    },
    {
        titleKey: "ChartLegend",
        href: "/docs/components/chart-legend",
        description: {
            en: "Legend rows for chart series and segment values.",
            ja: "チャート系列やセグメントのラベル・値を表示します。",
        },
    },
];

export default function ChartsPage() {
    const { locale, t } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="space-y-10" data-doc-category-overview="true">
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <ChartNoAxesCombined className="h-5 w-5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {isJa ? "チャート" : "Charts"}
                    </span>
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {isJa ? "チャートの概要" : "Charts Overview"}
                    </h1>
                    <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                        {isJa
                            ? "ダッシュボードパターンで使うチャートプリミティブとチャートカードのカテゴリ概要です。データの形、比較対象、表示密度に合わせて適切なチャートへ移動できます。"
                            : "A category overview for composable chart primitives and chart cards used in dashboard patterns. Choose by data shape, comparison target, and display density."}
                    </p>
                    <Badge variant="secondary">{isJa ? "カテゴリ概要" : "Category overview"}</Badge>
                </div>
            </header>

            <section className="grid gap-4 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isJa ? "このカテゴリの責務" : "Category responsibility"}
                        </CardTitle>
                        <CardDescription>
                            {isJa
                                ? "データの比較、分布、構成比、時間変化、進捗を、用途に合う視覚表現で読み取れるようにします。"
                                : "Make comparison, distribution, composition, time change, and progress readable through the right visual form."}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isJa ? "コードの前提" : "Code expectation"}
                        </CardTitle>
                        <CardDescription>
                            {isJa
                                ? "チャートページのコードは、表示データ、選択状態、凡例、スマホ操作までコピーして再現できることを前提にします。"
                                : "Chart examples must include data, selected state, legends, and mobile interactions so copied code can reproduce the preview."}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isJa ? "パターンで確認する場面" : "Where patterns validate it"}
                        </CardTitle>
                        <CardDescription>
                            {isJa
                                ? "ダッシュボードや分析画面で、複数チャートを並べた時の密度、凡例、タッチ選択、ツールチップを確認します。"
                                : "Patterns validate density, legends, touch selection, and tooltips when several charts appear together."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full justify-between">
                            <Link href="/patterns">
                                {isJa ? "パターンを見る" : "Open patterns"}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <ChartPreviewWithControls
                code={codeByLocale[locale]}
                demo="charts"
                embedBase="/embed/charts"
                previewHeight={900}
            />

            <section className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "コンポーネント一覧" : "Components"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isJa
                            ? "各チャートの詳細ページで、データ、プレビュー、コード、スマホ時の操作を確認できます。"
                            : "Open each chart page to review data, previews, code, and mobile interactions."}
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {chartPages.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-start justify-between gap-4 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:border-primary-border"
                        >
                            <span className="space-y-1">
                                <span className="block font-medium">{t(item.titleKey)}</span>
                                <span className="block text-sm text-muted-foreground">
                                    {item.description[locale]}
                                </span>
                            </span>
                            <ArrowRight className="mt-0.5 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
