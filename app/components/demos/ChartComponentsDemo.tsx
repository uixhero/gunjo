"use client";

import { useEffect, useState, type ComponentProps } from "react";
import {
    ActivityTimelineCard,
    AnalyticsCard,
    BarChart,
    Button,
    ChartLegend,
    ChoroplethMap,
    ConcentricProgressCard,
    DonutChart,
    DistributionBar,
    FormGroup,
    FormLabel,
    GaugeChart,
    HeatmapChart,
    LabeledDonutCard,
    LineChart,
    MiniDistributionBarCard,
    NumberInput,
    PieChart,
    QuadrantMatrix,
    RadialBarChart,
    RadarChart,
    RetentionCohortCard,
    RibbonChart,
    SegmentTimelineCard,
    SegmentedGaugeCard,
    SparklineChart,
    StackedBarChart,
    Switch,
} from "@gunjo/ui";

import { useLocale } from "@/components/providers/LocaleProvider";
import { tokyoIncidentMarkers, tokyoWardBoundaries } from "./tokyo-ward-boundaries";

const trendData = [24, 28, 22, 36, 32, 44, 39, 52, 48, 57, 51, 64];

// Demo-only baselines used to explain AnalyticsCard delta values.
export const chartDeltaBaselines = {
    referenceScore: 50,
    previousGaugeScore: 82,
} as const;

export type ChartDemoLocale = "en" | "ja";

function toChartDemoLocale(raw: string | null | undefined): ChartDemoLocale | null {
    return raw === "en" || raw === "ja" ? raw : null;
}

function useResolvedChartDemoLocale(locale?: ChartDemoLocale): ChartDemoLocale {
    const { locale: contextLocale } = useLocale();
    const [queryLocale, setQueryLocale] = useState<ChartDemoLocale | null>(null);

    useEffect(() => {
        if (locale || typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        setQueryLocale(toChartDemoLocale(params.get("locale")));
    }, [locale]);

    return locale ?? queryLocale ?? contextLocale;
}

const weekdayBarsByLocale = {
    en: [
        { label: "Mon", value: 42, color: "primary" },
        { label: "Tue", value: 58, color: "success" },
        { label: "Wed", value: 36, color: "warning" },
        { label: "Thu", value: 68, color: "info" },
        { label: "Fri", value: 51, color: "accent" },
    ],
    ja: [
        { label: "月", value: 42, color: "primary" },
        { label: "火", value: 58, color: "success" },
        { label: "水", value: 36, color: "warning" },
        { label: "木", value: 68, color: "info" },
        { label: "金", value: 51, color: "accent" },
    ],
} as const;

const channelsByLocale = {
    en: [
        { label: "Organic", value: 46, color: "primary" },
        { label: "Referral", value: 28, color: "success" },
        { label: "Direct", value: 18, color: "warning" },
        { label: "Paid", value: 8, color: "info" },
    ],
    ja: [
        { label: "自然流入", value: 46, color: "primary" },
        { label: "紹介", value: 28, color: "success" },
        { label: "直接", value: 18, color: "warning" },
        { label: "広告", value: 8, color: "info" },
    ],
} as const;

const chartDataLabelsByLocale = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    ja: ["1月", "2月", "3月", "4月", "5月", "6月"],
} as const;

const trendDataLabelsByLocale = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
} as const;

const distributionLabelsByLocale = {
    en: ["Core", "Growth", "Retention", "Expansion"],
    ja: ["基盤", "成長", "継続", "拡張"],
} as const;

const stackedSegmentLabelsByLocale = {
    en: ["Organic", "Referral", "Paid"],
    ja: ["自然流入", "紹介", "広告"],
} as const;

const ribbonLayerLabelsByLocale = {
    en: ["New", "Returning", "Expansion"],
    ja: ["新規", "継続", "拡張"],
} as const;

const radialBarLabelsByLocale = {
    en: ["Website", "Market", "Shopping"],
    ja: ["Web", "店舗", "購買"],
} as const;

const concentricProgressLabelsByLocale = {
    en: ["Documents", "Media", "Apps", "System"],
    ja: ["書類", "メディア", "アプリ", "システム"],
} as const;

const radarLabelsByLocale = {
    en: ["Reach", "Quality", "Revenue", "Retention", "Speed", "Risk"],
    ja: ["到達", "品質", "売上", "継続", "速度", "リスク"],
} as const;

const heatmapXLabelsByLocale = {
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ja: ["月", "火", "水", "木", "金", "土", "日"],
} as const;

const activityTimelineLabelsByLocale = {
    en: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM"],
    ja: ["6時", "8時", "10時", "12時", "14時", "16時"],
} as const;

const activitySegmentLabelsByLocale = {
    en: ["Walking", "Running", "Workout"],
    ja: ["ウォーク", "ラン", "ワークアウト"],
} as const;

const labeledDonutLabelsByLocale = {
    en: ["Amazon", "Alibaba", "Tokopedia"],
    ja: ["Amazon", "Alibaba", "Tokopedia"],
} as const;

const segmentedGaugeLabelsByLocale = {
    en: ["Essentials", "Growth", "Operations"],
    ja: ["基礎費", "成長投資", "運用費"],
} as const;

const miniDistributionLabelsByLocale = {
    en: ["Accessories", "Devices", "Services"],
    ja: ["アクセサリ", "デバイス", "サービス"],
} as const;

const segmentTimelineLabelsByLocale = {
    en: ["Deep sleep", "Light sleep", "REM", "Awake"],
    ja: ["深い睡眠", "浅い睡眠", "レム", "覚醒"],
} as const;

const retentionCohortLabelsByLocale = {
    en: ["Jan cohort", "Feb cohort", "Mar cohort", "Apr cohort", "May cohort", "Jun cohort"],
    ja: ["1月コホート", "2月コホート", "3月コホート", "4月コホート", "5月コホート", "6月コホート"],
} as const;

const retentionPeriodLabelsByLocale = {
    en: ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"],
    ja: ["初月", "1か月", "2か月", "3か月", "4か月", "5か月", "6か月", "7か月"],
} as const;

const tokyoMarkerLabelsJa: Record<string, string> = {
    "marker-shinjuku": "新宿駅",
    "marker-shibuya": "渋谷スクランブル交差点",
    "marker-tokyo": "東京駅",
    "marker-roppongi": "六本木",
    "marker-ueno": "上野",
    "marker-toyosu": "豊洲",
    "marker-sangenjaya": "三軒茶屋",
};

const quadrantMatrixTextByLocale = {
    en: [
        { id: "activation", label: "Activation", description: "High impact" },
        { id: "expansion", label: "Expansion", description: "Scale candidate" },
        { id: "retention", label: "Retention", description: "Strong fit" },
        { id: "risk", label: "Risk", description: "Needs review" },
        { id: "reach", label: "Reach", description: "Low impact" },
        { id: "quality", label: "Quality", description: "Strategic bet" },
    ],
    ja: [
        { id: "activation", label: "有効化", description: "高い影響" },
        { id: "expansion", label: "拡張", description: "拡大候補" },
        { id: "retention", label: "継続", description: "適合度が高い" },
        { id: "risk", label: "リスク", description: "要確認" },
        { id: "reach", label: "リーチ", description: "影響が低い" },
        { id: "quality", label: "品質", description: "戦略投資" },
    ],
} as const;

const chartDemoCopy = {
    en: {
        editedData: "Edited data",
        revenueTrend: "Revenue trend",
        monthlyRecurringRevenue: "Monthly recurring revenue",
        weeklyActivity: "Weekly activity",
        averageSessionsByDay: "Average sessions by day",
        ticketLoad: "Ticket load",
        openSupportTickets: "Open support tickets",
        acquisition: "Acquisition",
        channelDistribution: "Channel distribution",
        segmentMix: "Segment mix",
        shareByChannel: "Share by channel",
        audienceShare: "Audience share",
        categorySplit: "Category split",
        performanceScore: "Performance score",
        averageOfCurrentValues: "Average of current values",
        trafficDensity: "Traffic density",
        tokyoIncidents: "Tokyo incidents",
        quadrantMatrix: "Quadrant matrix",
        priorityRanking: "Priority ranking",
        channelLegend: "Channel legend",
        seriesLabels: "Series labels and current share",
        revenue: "Revenue",
        lastTwelveMonths: "Last 12 months",
        channelMix: "Channel mix",
        currentAcquisitionShare: "Current acquisition share",
        monthlyRevenue: "Monthly revenue",
        comparedWithPreviousPeriod: "Compared with previous period",
        sessions: "Sessions",
        weekdayAverage: "Weekday average",
        donutChart: "Donut chart",
        pieChart: "Pie chart",
        gaugeChart: "Gauge chart",
        stackedBarChart: "Stacked bar chart",
        lineChart: "Line chart",
        actualVsTarget: "Actual vs target",
        target: "Target",
        ribbonChart: "Ribbon chart",
        flowDistribution: "Flow distribution",
        radialBarChart: "Radial bar chart",
        progressShare: "Progress share",
        concentricProgress: "Concentric progress",
        storageOverview: "Storage overview",
        usedStorage: "Used storage",
        totalCapacity: "Total capacity",
        radarChart: "Radar chart",
        capabilityBalance: "Capability balance",
        heatmapChart: "Heatmap chart",
        activityTimeline: "Activity timeline",
        energyTimeline: "Energy timeline",
        activeMinutes: "Active minutes",
        burned: "Burned",
        dailyAverage: "Daily avg",
        thanYesterday: "than yesterday",
        segmentTimeline: "Segment timeline",
        sleepStages: "Sleep stages",
        sleepQuality: "Sleep quality",
        timeAsleep: "Time asleep",
        awakeTime: "Awake time",
        stageDuration: "Stage duration",
        labeledDonut: "Labeled donut",
        salesByPlatform: "Sales by platform",
        platformShare: "Platform share",
        segmentedGauge: "Segmented gauge",
        spendBreakdown: "Spend breakdown",
        currentSpend: "Current spend",
        targetSpend: "Target spend",
        miniDistribution: "Mini distribution",
        productCategories: "Product categories",
        categoryShare: "Category share",
        retentionCohort: "Retention cohort",
        cohortRetention: "Cohort retention",
        activeCohorts: "Active cohorts",
        cohortSize: "Cohort size",
        choroplethMap: "Choropleth map",
        supportLoad: "Support load",
        ticketVolumeByPeriod: "Ticket volume by period",
        total: "Total",
        max: "Max",
        range: "Range",
        score: "Score",
        avg: "avg",
        min: "min",
        flat: "flat",
        groups: "groups",
        sources: "sources",
        segments: "segments",
        selected: "selected",
        incidents: "incidents",
        peak: "peak",
        rank: "Rank",
        reach: "Reach",
        impact: "Impact",
        strategic: "Strategic",
        scale: "Scale",
        review: "Review",
        efficient: "Efficient",
        changeFromFirstPoint: "Change from the first point in the preview data.",
        changeFromPreviousPeriod: "Change compared with the previous period.",
        averageOfPreviewData: "Average of the current preview values.",
        minimumOfPreviewData: "Minimum value in the current preview values.",
        peakOfPreviewData: "Peak value in the current preview values.",
        differenceBetweenPeakAndAverage: "Difference between the peak value and the current average.",
        differenceBetweenTopRankAndAverage: "Difference between the top ranked value and the current average.",
        previousShareComparison: "Change compared with the previous channel share.",
        data: "Data",
        scenario: "Scenario",
        reset: "Reset",
        averageLine: "Average line",
        referenceLine: "Reference line",
    },
    ja: {
        editedData: "編集したデータ",
        revenueTrend: "売上トレンド",
        monthlyRecurringRevenue: "月次経常収益",
        weeklyActivity: "週次アクティビティ",
        averageSessionsByDay: "曜日別の平均セッション",
        ticketLoad: "チケット負荷",
        openSupportTickets: "未対応サポートチケット",
        acquisition: "獲得",
        channelDistribution: "チャネル分布",
        segmentMix: "セグメント構成",
        shareByChannel: "チャネル別シェア",
        audienceShare: "オーディエンス比率",
        categorySplit: "カテゴリ内訳",
        performanceScore: "パフォーマンススコア",
        averageOfCurrentValues: "現在値の平均",
        trafficDensity: "混雑度",
        tokyoIncidents: "東京都インシデント",
        quadrantMatrix: "4象限マトリクス",
        priorityRanking: "優先度ランキング",
        channelLegend: "チャネル凡例",
        seriesLabels: "系列ラベルと現在比率",
        revenue: "売上",
        lastTwelveMonths: "直近12か月",
        channelMix: "チャネル構成",
        currentAcquisitionShare: "現在の獲得比率",
        monthlyRevenue: "月次売上",
        comparedWithPreviousPeriod: "前期間との比較",
        sessions: "セッション",
        weekdayAverage: "平日平均",
        donutChart: "ドーナツチャート",
        pieChart: "パイチャート",
        gaugeChart: "ゲージチャート",
        stackedBarChart: "積み上げ棒チャート",
        lineChart: "折れ線チャート",
        actualVsTarget: "実績と目標",
        target: "目標",
        ribbonChart: "リボンチャート",
        flowDistribution: "流量分布",
        radialBarChart: "ラジアルバーチャート",
        progressShare: "進捗比率",
        concentricProgress: "同心円進捗",
        storageOverview: "ストレージ概要",
        usedStorage: "使用済み容量",
        totalCapacity: "総容量",
        radarChart: "レーダーチャート",
        capabilityBalance: "能力バランス",
        heatmapChart: "ヒートマップ",
        activityTimeline: "活動タイムライン",
        energyTimeline: "活動量タイムライン",
        activeMinutes: "アクティブ時間",
        burned: "消費",
        dailyAverage: "日平均",
        thanYesterday: "昨日比",
        segmentTimeline: "セグメントタイムライン",
        sleepStages: "睡眠ステージ",
        sleepQuality: "睡眠品質",
        timeAsleep: "睡眠時間",
        awakeTime: "覚醒時間",
        stageDuration: "ステージ時間",
        labeledDonut: "ラベル付きドーナツ",
        salesByPlatform: "プラットフォーム別売上",
        platformShare: "プラットフォーム比率",
        segmentedGauge: "セグメントゲージ",
        spendBreakdown: "支出内訳",
        currentSpend: "現在の支出",
        targetSpend: "目標支出",
        miniDistribution: "ミニ分布",
        productCategories: "商品カテゴリ",
        categoryShare: "カテゴリ比率",
        retentionCohort: "継続率コホート",
        cohortRetention: "コホート継続率",
        activeCohorts: "対象コホート",
        cohortSize: "コホート規模",
        choroplethMap: "階級区分図",
        supportLoad: "サポート負荷",
        ticketVolumeByPeriod: "期間別のチケット数",
        total: "合計",
        max: "最大",
        range: "範囲",
        score: "スコア",
        avg: "平均",
        min: "最小",
        flat: "横ばい",
        groups: "グループ",
        sources: "チャネル",
        segments: "セグメント",
        selected: "選択中",
        incidents: "件",
        peak: "ピーク",
        rank: "順位",
        reach: "到達範囲",
        impact: "影響度",
        strategic: "戦略",
        scale: "拡大",
        review: "見直し",
        efficient: "効率",
        changeFromFirstPoint: "プレビュー内の最初の値との差分です。",
        changeFromPreviousPeriod: "前期間と比較した変化量です。",
        averageOfPreviewData: "現在のプレビュー値の平均です。",
        minimumOfPreviewData: "現在のプレビュー値の最小値です。",
        peakOfPreviewData: "現在のプレビュー値のピーク値です。",
        differenceBetweenPeakAndAverage: "ピーク値と現在の平均値の差分です。",
        differenceBetweenTopRankAndAverage: "ランキング上位値と現在の平均値の差分です。",
        previousShareComparison: "前回のチャネル比率と比較した変化量です。",
        data: "データ",
        scenario: "シナリオ",
        reset: "リセット",
        averageLine: "平均線",
        referenceLine: "基準線",
    },
} as const;

function getChartDemoCopy(locale: ChartDemoLocale) {
    return chartDemoCopy[locale];
}

function getReferenceBaselineDeltaDescription(
    locale: ChartDemoLocale,
    baseline: number
) {
    return locale === "ja"
        ? `基準値 ${baseline}% との差分です。`
        : `Difference from the reference baseline (${baseline}%).`;
}

function getPreviousGaugeScoreDeltaDescription(
    locale: ChartDemoLocale,
    baseline: number
) {
    return locale === "ja"
        ? `前回スコア ${baseline}% との差分です。`
        : `Difference from the previous score baseline (${baseline}%).`;
}

function getSegmentTimelineMetricDescriptions(locale: ChartDemoLocale) {
    return locale === "ja"
        ? {
              quality: "基準品質 76% と比較した睡眠品質スコアです。",
              asleep: "総時間から覚醒時間を除いた睡眠時間です。",
              awake: "覚醒ステージに分類された時間の合計です。",
          }
        : {
              quality: "Sleep quality score compared with the 76% baseline.",
              asleep: "Total sleep duration excluding awake time.",
              awake: "Total duration classified as awake.",
          };
}

function getWeekdayBars(locale: ChartDemoLocale) {
    return [...weekdayBarsByLocale[locale]];
}

function getChannels(locale: ChartDemoLocale) {
    return [...channelsByLocale[locale]];
}

export function getChartDataLabels(locale: ChartDemoLocale = "en") {
    return [...chartDataLabelsByLocale[locale]];
}

export function getStackedBarLabels(locale: ChartDemoLocale = "en") {
    return getChartDataLabels(locale).slice(0, 4);
}

export function getDistributionLabels(locale: ChartDemoLocale = "en") {
    return [...distributionLabelsByLocale[locale]];
}

export function getStackedSegmentLabels(locale: ChartDemoLocale = "en") {
    return [...stackedSegmentLabelsByLocale[locale]];
}

export function getRibbonLayerLabels(locale: ChartDemoLocale = "en") {
    return [...ribbonLayerLabelsByLocale[locale]];
}

export function getRadialBarLabels(locale: ChartDemoLocale = "en") {
    return [...radialBarLabelsByLocale[locale]];
}

export function getConcentricProgressLabels(locale: ChartDemoLocale = "en") {
    return [...concentricProgressLabelsByLocale[locale]];
}

export function getRadarLabels(locale: ChartDemoLocale = "en") {
    return [...radarLabelsByLocale[locale]];
}

export function getHeatmapXLabels(locale: ChartDemoLocale = "en") {
    return [...heatmapXLabelsByLocale[locale]];
}

export function getActivityTimelineLabels(locale: ChartDemoLocale = "en") {
    return [...activityTimelineLabelsByLocale[locale]];
}

export function getActivitySegmentLabels(locale: ChartDemoLocale = "en") {
    return [...activitySegmentLabelsByLocale[locale]];
}

export function getLabeledDonutLabels(locale: ChartDemoLocale = "en") {
    return [...labeledDonutLabelsByLocale[locale]];
}

export function getSegmentedGaugeLabels(locale: ChartDemoLocale = "en") {
    return [...segmentedGaugeLabelsByLocale[locale]];
}

export function getMiniDistributionLabels(locale: ChartDemoLocale = "en") {
    return [...miniDistributionLabelsByLocale[locale]];
}

export function getSegmentTimelineLabels(locale: ChartDemoLocale = "en") {
    return [...segmentTimelineLabelsByLocale[locale]];
}

export function getRetentionCohortLabels(locale: ChartDemoLocale = "en") {
    return [...retentionCohortLabelsByLocale[locale]];
}

export function getRetentionPeriodLabels(locale: ChartDemoLocale = "en") {
    return [...retentionPeriodLabelsByLocale[locale]];
}

export function getTokyoChoroplethLabels(locale: ChartDemoLocale = "en") {
    return tokyoWardBoundaries.map((region) =>
        locale === "ja" ? region.nameJa : region.label
    );
}

export function getQuadrantMatrixLabels(locale: ChartDemoLocale = "en") {
    return quadrantMatrixTextByLocale[locale].map((item) => item.label);
}

function getTokyoRegionLabel(region: (typeof tokyoWardBoundaries)[number], locale: ChartDemoLocale) {
    return locale === "ja" ? region.nameJa : region.label;
}

function getTokyoRegionDescription(region: (typeof tokyoWardBoundaries)[number], value: number, locale: ChartDemoLocale) {
    const avg = (value / 20).toFixed(1);
    return locale === "ja"
        ? `${region.nameJa} / 平均 ${avg}件/日`
        : `${region.label} / Avg ${avg}/day`;
}

function getTokyoIncidentMarkers(locale: ChartDemoLocale) {
    if (locale === "en") return tokyoIncidentMarkers;
    return tokyoIncidentMarkers.map((marker) => ({
        ...marker,
        label: marker.id ? tokyoMarkerLabelsJa[marker.id] ?? marker.label : marker.label,
    }));
}

export const chartDataLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;
const chartDataColors = ["primary", "success", "warning", "info", "accent", "primary"] as const;
export const defaultChartDataValues = [42, 58, 36, 68, 51, 74];
export const defaultLineChartValues = [
    42, 58, 36, 68, 51, 74,
    46, 62, 46, 74, 62, 83,
];
export const defaultRibbonChartValues = [
    22, 30, 36, 44, 52, 60,
    16, 22, 30, 38, 46, 52,
    8, 14, 22, 30, 38, 48,
];
export const defaultRadialBarValues = [78, 64, 49];
export const concentricProgressLabels = ["Documents", "Media", "Apps", "System"];
export const defaultConcentricProgressSelectionValues = [1, 42, 68, 27, 18, 256];
export const defaultStackedBarValues = [
    81, 48, 32, 20,
    93, 44, 36, 20,
    87, 52, 28, 20,
    113, 40, 34, 26,
];
const scenarioValues = [
    [38, 46, 52, 61, 72, 84],
    [74, 63, 58, 49, 41, 34],
    [34, 72, 28, 81, 44, 67],
];
export const heatmapXLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const heatmapYLabels = ["00", "04", "08", "12", "16", "20"];
export const defaultHeatmapSelectionValues = [3, 3, 82, 0, 0, 0];
export const activityTimelineLabels = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM"];
export const labeledDonutLabels = ["Amazon", "Alibaba", "Tokopedia"];
export const defaultLabeledDonutSelectionValues = [0, 45, 35, 25, 0, 0];
export const segmentedGaugeLabels = ["Essentials", "Growth", "Operations"];
export const defaultSegmentedGaugeSelectionValues = [1, 35, 45, 20, 82, 90];
export const miniDistributionLabels = ["Accessories", "Devices", "Services"];
export const defaultMiniDistributionSelectionValues = [0, 58, 26, 16, 45, 0];
export const segmentTimelineLabels = ["Deep sleep", "Light sleep", "REM", "Awake"];
export const defaultSegmentTimelineSelectionValues = [
    1, 83,
    1, 31, 0, 37, 1, 31, 2, 29,
    1, 31, 3, 14, 1, 31, 0, 37,
    1, 31, 2, 29, 1, 31, 0, 38,
    1, 31, 2, 28, 3, 14, 1, 31,
];
const segmentTimelineStageOrder = [
    1, 0, 1, 2, 1, 3, 1, 0,
    1, 2, 1, 0, 1, 2, 3, 1,
] as const;
export const retentionCohortLabels = ["Jan cohort", "Feb cohort", "Mar cohort", "Apr cohort", "May cohort", "Jun cohort"];
export const retentionPeriodLabels = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"];
export const defaultRetentionCohortSelectionValues = [1, 3, 62, 0, 0, 0];
export const tokyoChoroplethLabels = tokyoWardBoundaries.map((region) => region.label);
export const defaultChoroplethSelectionValues = [3, 92, 0, 0, 0, 0];
export const quadrantMatrixLabels = ["Activation", "Expansion", "Retention", "Risk", "Reach", "Quality"];
export const defaultQuadrantMatrixSelectionValues = [0, 88, 0, 0, 0, 0];

type BarDatum = ComponentProps<typeof BarChart>["data"][number];
type ChoroplethRegion = ComponentProps<typeof ChoroplethMap>["regions"][number];
type DistributionSegment = ComponentProps<typeof DistributionBar>["segments"][number];
type ChartLegendItem = ComponentProps<typeof ChartLegend>["items"][number];
type ConcentricProgressRing = ComponentProps<typeof ConcentricProgressCard>["rings"][number];
type LineChartSeries = ComponentProps<typeof LineChart>["series"][number];
type QuadrantMatrixItem = ComponentProps<typeof QuadrantMatrix>["items"][number];
type RadialBarDatum = ComponentProps<typeof RadialBarChart>["data"][number];
type RadarDatum = ComponentProps<typeof RadarChart>["data"][number];
type ActivityTimelineSlot = ComponentProps<typeof ActivityTimelineCard>["slots"][number];
type ActivityTimelineSegment = ComponentProps<typeof ActivityTimelineCard>["segments"][number];
type LabeledDonutSegment = ComponentProps<typeof LabeledDonutCard>["segments"][number];
type MiniDistributionSegment = ComponentProps<typeof MiniDistributionBarCard>["segments"][number];
type RetentionCohortRow = ComponentProps<typeof RetentionCohortCard>["cohorts"][number];
type RibbonLayer = ComponentProps<typeof RibbonChart>["layers"][number];
type SegmentedGaugeSegment = ComponentProps<typeof SegmentedGaugeCard>["segments"][number];
type SegmentTimelineSegment = ComponentProps<typeof SegmentTimelineCard>["segments"][number];
type StackedBarGroup = ComponentProps<typeof StackedBarChart>["data"][number];

interface ChartDemoProps {
    values?: number[];
    onValuesChange?: (values: number[]) => void;
    baseline?: number;
    showReference?: boolean;
    locale?: ChartDemoLocale;
}

function clampChartValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, Math.round(value)));
}

function clampChartParamValue(value: number, max = 200) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(max, Math.max(0, Math.round(value)));
}

function clampStorageValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1024, Math.max(0, Math.round(value)));
}

function clampDurationValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(480, Math.max(0, Math.round(value)));
}

function average(values: number[]) {
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function trendFromDelta(delta: number) {
    return delta > 0 ? "up" : delta < 0 ? "down" : "flat";
}

function formatPointDelta(delta: number) {
    const rounded = Math.round(delta);
    return `${rounded > 0 ? "+" : ""}${rounded}pt`;
}

function formatPercentValue(value: number) {
    return `${new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value % 1 === 0 ? 0 : 1,
    }).format(value)}%`;
}

function formatPercentDelta(delta: number) {
    const rounded = Math.round(delta * 10) / 10;
    return `${rounded > 0 ? "+" : ""}${formatPercentValue(rounded)}`;
}

function formatShareOfTotal(value: number, total: number) {
    if (total <= 0) return formatPercentValue(0);
    return formatPercentValue((Math.max(value, 0) / total) * 100);
}

function formatDurationMinutes(value: number, locale: ChartDemoLocale) {
    const minutes = Math.max(0, Math.round(value));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (locale === "ja") {
        return hours > 0 ? `${hours}時間${remainingMinutes}分` : `${remainingMinutes}分`;
    }

    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

function getSegmentShare(segments: DistributionSegment[], index: number) {
    const total = segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0);
    if (total <= 0) return 0;

    return (Math.max(segments[index]?.value ?? 0, 0) / total) * 100;
}

function normalizeChartValues(values?: number[]) {
    const normalized = (values ?? defaultChartDataValues)
        .slice(0, chartDataLabels.length)
        .map(clampChartValue);

    while (normalized.length < chartDataLabels.length) {
        normalized.push(defaultChartDataValues[normalized.length]);
    }

    return normalized;
}

function normalizeDistributionPreviewValues(values?: number[]) {
    const normalized = (values ?? defaultChartDataValues)
        .slice(0, chartDataLabels.length)
        .map(clampChartParamValue);

    while (normalized.length < chartDataLabels.length) {
        normalized.push(defaultChartDataValues[normalized.length]);
    }

    return normalized;
}

function deriveLineTargetValue(actualValue: number, index: number) {
    return clampChartValue(Math.round(actualValue * 0.82 + 12 + index * 2));
}

export function normalizeLineChartValues(values?: number[]) {
    const actualValues = normalizeChartValues(values?.slice(0, chartDataLabels.length));
    const rawTargetValues = values?.slice(
        chartDataLabels.length,
        chartDataLabels.length * 2
    );
    const targetValues = Array.from(
        { length: chartDataLabels.length },
        (_, index) =>
            clampChartValue(
                rawTargetValues?.[index] ??
                    defaultLineChartValues[chartDataLabels.length + index] ??
                    deriveLineTargetValue(actualValues[index], index)
            )
    );

    return [...actualValues, ...targetValues];
}

export function normalizeRibbonChartValues(values?: number[]) {
    const source = values ?? defaultRibbonChartValues;
    const normalized = source
        .slice(0, defaultRibbonChartValues.length)
        .map(clampChartParamValue);

    while (normalized.length < defaultRibbonChartValues.length) {
        normalized.push(defaultRibbonChartValues[normalized.length]);
    }

    return normalized;
}

export function normalizeRadialBarValues(values?: number[]) {
    const source = values ?? defaultRadialBarValues;
    const normalized = source.slice(0, defaultRadialBarValues.length).map(clampChartValue);

    while (normalized.length < defaultRadialBarValues.length) {
        normalized.push(defaultRadialBarValues[normalized.length]);
    }

    return normalized;
}

function normalizePreviewValues(values: number[], fallback: number[], max = 200) {
    const normalized = values
        .slice(0, fallback.length)
        .map((value) => clampChartParamValue(value, max));

    while (normalized.length < fallback.length) {
        normalized.push(fallback[normalized.length]);
    }

    return normalized;
}

function normalizeStackedRatios(values?: number[], fallback = [48, 32, 20]) {
    const source = values && values.length > 0 ? values : fallback;
    const raw = source.slice(0, 3).map(clampChartValue);

    while (raw.length < 3) {
        raw.push(fallback[raw.length]);
    }

    const sum = raw.reduce((total, value) => total + value, 0);
    if (sum <= 0) return fallback;

    const normalized = raw.map((value) => Math.round((value / sum) * 100));
    normalized[2] += 100 - normalized.reduce((total, value) => total + value, 0);

    return normalized;
}

function normalizeStackedBarValues(values?: number[]) {
    const source = values ?? defaultStackedBarValues;
    const normalized: number[] = [];
    const groupCount = getStackedBarLabels().length;

    for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
        const offset = groupIndex * 4;
        const fallback = defaultStackedBarValues.slice(offset, offset + 4);
        const total = clampChartParamValue(source[offset] ?? fallback[0]);
        const ratios = normalizeStackedRatios(
            source.slice(offset + 1, offset + 4),
            fallback.slice(1, 4)
        );
        normalized.push(total, ...ratios);
    }

    return normalized;
}

function buildBarData(values: number[], locale: ChartDemoLocale): BarDatum[] {
    const labels = getChartDataLabels(locale);
    return values.map((value, index) => ({
        label: labels[index],
        value,
        color: chartDataColors[index],
    }));
}

function buildSparklineData(values: number[], locale: ChartDemoLocale) {
    const labels =
        values.length === trendData.length
            ? trendDataLabelsByLocale[locale]
            : getChartDataLabels(locale);

    return values.map((value, index) => ({
        label: labels[index] ?? `#${index + 1}`,
        value,
    }));
}

function buildLineChartSeries(values: number[], locale: ChartDemoLocale): LineChartSeries[] {
    const labels = getChartDataLabels(locale);
    const copy = getChartDemoCopy(locale);
    const lineValues = normalizeLineChartValues(values);
    const actualValues = lineValues.slice(0, chartDataLabels.length);
    const targetValues = lineValues.slice(chartDataLabels.length);
    const actualData = actualValues.map((value, index) => ({
        label: labels[index],
        value,
    }));
    const targetData = targetValues.map((value, index) => ({
        label: labels[index],
        value,
    }));

    return [
        {
            label: copy.revenue,
            color: "primary",
            data: actualData,
        },
        {
            label: copy.target,
            color: "success",
            data: targetData,
        },
    ];
}

function getLineChartActualValues(values?: number[]) {
    return normalizeLineChartValues(values).slice(0, chartDataLabels.length);
}

function buildDerivedLineChartSeries(values: number[], locale: ChartDemoLocale): LineChartSeries[] {
    const labels = getChartDataLabels(locale);
    const copy = getChartDemoCopy(locale);
    const actualData = normalizeChartValues(values).map((value, index) => ({
        label: labels[index],
        value,
    }));
    const targetData = actualData.map((point, index) => ({
        label: point.label,
        value: deriveLineTargetValue(point.value, index),
    }));

    return [
        {
            label: copy.revenue,
            color: "primary",
            data: actualData,
        },
        {
            label: copy.target,
            color: "success",
            data: targetData,
        },
    ];
}

function buildRibbonLayers(values: number[], locale: ChartDemoLocale): RibbonLayer[] {
    const labels = getChartDataLabels(locale);
    const layerLabels = getRibbonLayerLabels(locale);
    const colors = ["primary", "success", "warning"] as const;
    const normalized = normalizeRibbonChartValues(values);

    return layerLabels.map((layerLabel, layerIndex) => {
        const offset = layerIndex * chartDataLabels.length;

        return {
            label: layerLabel,
            color: colors[layerIndex],
            data: labels.map((label, index) => ({
                label,
                value: normalized[offset + index],
            })),
        };
    });
}

function buildDerivedRibbonLayers(values: number[], locale: ChartDemoLocale): RibbonLayer[] {
    const chartValues = normalizeChartValues(values);
    const derivedValues = [
        ...chartValues.map((value) => Math.round(value * 0.58)),
        ...chartValues.map((value) => Math.round(value * 0.42)),
        ...chartValues.map((value) => Math.round(value * 0.28)),
    ];

    return buildRibbonLayers(derivedValues, locale);
}

function buildRadialBarData(values: number[], locale: ChartDemoLocale): RadialBarDatum[] {
    const labels = getRadialBarLabels(locale);
    const colors = ["primary", "success", "warning"] as const;

    return normalizeRadialBarValues(values).map((value, index) => ({
        label: labels[index],
        value,
        color: colors[index],
    }));
}

function buildDerivedRadialBarData(values: number[], locale: ChartDemoLocale): RadialBarDatum[] {
    const chartValues = normalizeChartValues(values);
    const derivedValues = [
        Math.round((chartValues[0] + chartValues[3]) / 2),
        Math.round((chartValues[1] + chartValues[4]) / 2),
        Math.round((chartValues[2] + chartValues[5]) / 2),
    ];

    return buildRadialBarData(derivedValues, locale);
}

function readConcentricProgressSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultConcentricProgressSelectionValues;
    const labels = getConcentricProgressLabels(locale);
    const selectedIndex = Math.min(
        labels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultConcentricProgressSelectionValues[0]))
    );

    return {
        selectedIndex,
        values: labels.map((_, index) =>
            clampStorageValue(
                normalized[index + 1] ?? defaultConcentricProgressSelectionValues[index + 1]
            )
        ),
        capacity: Math.max(
            1,
            clampStorageValue(normalized[5] ?? defaultConcentricProgressSelectionValues[5])
        ),
    };
}

function buildConcentricProgressRings(
    values: number[] | undefined,
    locale: ChartDemoLocale
): ConcentricProgressRing[] {
    const selected = readConcentricProgressSelection(values, locale);
    const labels = getConcentricProgressLabels(locale);
    const colors = ["primary", "info", "success", "warning"] as const;

    return labels.map((label, index) => {
        const value = selected.values[index];
        const capacityShare = formatShareOfTotal(value, selected.capacity);

        return {
            label,
            value,
            color: colors[index],
            detail:
                locale === "ja"
                    ? `全体 ${selected.capacity}GB 中の ${capacityShare}`
                    : `${capacityShare} of ${selected.capacity}GB total`,
            description:
                locale === "ja"
                    ? `${label}: ${value}GB。全体 ${selected.capacity}GB 中の ${capacityShare}。`
                    : `${label}: ${value}GB, ${capacityShare} of ${selected.capacity}GB total.`,
        };
    });
}

function buildDistributionSegments(values: number[], locale: ChartDemoLocale): DistributionSegment[] {
    const labels = getDistributionLabels(locale);
    return [
        {
            label: labels[0],
            value: values[0] + values[1],
            color: "primary",
        },
        {
            label: labels[1],
            value: values[2] + values[3],
            color: "success",
        },
        {
            label: labels[2],
            value: values[4],
            color: "warning",
        },
        {
            label: labels[3],
            value: values[5],
            color: "info",
        },
    ];
}

function buildStackedBarGroups(values: number[], locale: ChartDemoLocale): StackedBarGroup[] {
    const groupLabels = getStackedBarLabels(locale);
    const segmentLabels = stackedSegmentLabelsByLocale[locale];
    const colors = ["primary", "success", "warning"] as const;
    const normalized = normalizeStackedBarValues(values);

    return groupLabels.map((label, groupIndex) => ({
        label,
        segments: (() => {
            const offset = groupIndex * 4;
            const total = normalized[offset];
            const ratios = normalized.slice(offset + 1, offset + 4);
            const firstValue = Math.round((total * ratios[0]) / 100);
            const secondValue = Math.round((total * ratios[1]) / 100);
            const segmentValues = [
                firstValue,
                secondValue,
                Math.max(0, total - firstValue - secondValue),
            ];

            return segmentLabels.map((segmentLabel, segmentIndex) => ({
                label: segmentLabel,
                value: segmentValues[segmentIndex],
                color: colors[segmentIndex],
            }));
        })(),
    }));
}

function buildRadarData(values: number[], locale: ChartDemoLocale): RadarDatum[] {
    const labels = getRadarLabels(locale);
    return normalizeChartValues(values).map((value, index) => ({
        label: labels[index],
        value,
        color: chartDataColors[index],
    }));
}

function buildLegendItemsFromSegments(
    segments: DistributionSegment[],
    locale: ChartDemoLocale
): ChartLegendItem[] {
    const copy = getChartDemoCopy(locale);
    const total = segments.reduce((sum, item) => sum + item.value, 0);

    return segments.map((item) => ({
        label: item.label,
        value: `${total > 0 ? Math.round((item.value / total) * 100) : 0}%`,
        color: item.color,
        description: `${copy.total}: ${item.value.toLocaleString()}`,
    }));
}

function buildHeatmapData(values: number[], locale: ChartDemoLocale) {
    const normalized = normalizeChartValues(values)
    const xLabels = getHeatmapXLabels(locale)
    const timeBands = [
        normalized[0],
        normalized[1],
        Math.round((normalized[1] + normalized[2]) / 2),
        normalized[2],
        normalized[3],
        Math.round((normalized[0] + normalized[3]) / 2),
    ]
    const dayWeights = [0.68, 0.82, 0.94, 1, 0.9, 0.72, 0.58]

    return heatmapYLabels.flatMap((y, rowIndex) =>
        xLabels.map((x, columnIndex) => ({
            x,
            y,
            value: clampChartValue(
                Math.round(
                    timeBands[rowIndex] * dayWeights[columnIndex] +
                        ((rowIndex + columnIndex) % 3) * 5
                )
            ),
        }))
    )
}

function readHeatmapSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultHeatmapSelectionValues;
    const xLabels = getHeatmapXLabels(locale);
    const dayIndex = Math.min(
        xLabels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultHeatmapSelectionValues[0]))
    );
    const timeIndex = Math.min(
        heatmapYLabels.length - 1,
        Math.max(0, Math.round(normalized[1] ?? defaultHeatmapSelectionValues[1]))
    );
    return {
        x: xLabels[dayIndex],
        y: heatmapYLabels[timeIndex],
        value: clampChartValue(normalized[2] ?? defaultHeatmapSelectionValues[2]),
    };
}

function buildEditableHeatmapData(values: number[] | undefined, locale: ChartDemoLocale) {
    const selected = readHeatmapSelection(values, locale);
    const xLabels = getHeatmapXLabels(locale);

    return heatmapYLabels.flatMap((y, rowIndex) =>
        xLabels.map((x, columnIndex) => {
            const baseValue = clampChartValue(
                24 + rowIndex * 7 + columnIndex * 4 + ((rowIndex + columnIndex) % 2) * 5
            );
            const value = selected.x === x && selected.y === y ? selected.value : baseValue;
            return {
                x,
                y,
                value,
                description:
                    locale === "ja"
                        ? `${x} ${y}:00 の密集度です。`
                        : `${x} ${y}:00 density.`,
            };
        })
    );
}

function buildHeatmapSummary(data: ReturnType<typeof buildEditableHeatmapData>, locale: ChartDemoLocale) {
    const xLabels = getHeatmapXLabels(locale);

    return xLabels.map((x) => {
        const cells = data.filter((cell) => cell.x === x);
        const peak = Math.max(...cells.map((cell) => cell.value), 0);
        return {
            x,
            value: peak,
            description:
                locale === "ja"
                    ? `${x} のピーク密度です。`
                    : `${x} peak density.`,
        };
    });
}

function previewValuesFromHeatmapCell(
    x: string,
    y: string,
    value: number,
    locale: ChartDemoLocale
) {
    const xLabels = getHeatmapXLabels(locale);

    return [
        Math.max(0, xLabels.findIndex((label) => label === x)),
        Math.max(0, heatmapYLabels.findIndex((label) => label === y)),
        clampChartValue(value),
        0,
        0,
        0,
    ];
}

const activityTimelineBaseValues = [42, 84, 58, 132, 92, 46];
const activityTimelineBaseSegments = [
    [9, 20, 13],
    [18, 39, 27],
    [12, 28, 18],
    [34, 55, 43],
    [20, 44, 28],
    [10, 22, 14],
];
const activityTimelineSlotFieldCount = 4;

function getActivityTimelineValueOffset(slotIndex: number) {
    return 1 + slotIndex * activityTimelineSlotFieldCount;
}

function createActivityTimelineSelectionValues(
    selectedSlotIndex: number,
    overrides: Record<number, [number, number, number, number]> = {}
) {
    const normalizedSlotIndex = Math.min(
        activityTimelineBaseValues.length - 1,
        Math.max(0, Math.round(selectedSlotIndex))
    );
    const values = [normalizedSlotIndex];

    activityTimelineBaseValues.forEach((value, index) => {
        const baseSegments = activityTimelineBaseSegments[index];
        const override = overrides[index];

        values.push(
            override?.[0] ?? value,
            override?.[1] ?? baseSegments[0],
            override?.[2] ?? baseSegments[1],
            override?.[3] ?? baseSegments[2]
        );
    });

    return values;
}

export const defaultActivityTimelineSelectionValues = createActivityTimelineSelectionValues(3, {
    3: [156, 38, 60, 58],
});

function normalizeActivityTimelineSelectionValues(values: number[] | undefined) {
    const normalized = [...defaultActivityTimelineSelectionValues];
    const source = values ?? defaultActivityTimelineSelectionValues;
    const slotIndex = Math.min(
        activityTimelineBaseValues.length - 1,
        Math.max(0, Math.round(source[0] ?? defaultActivityTimelineSelectionValues[0]))
    );

    normalized[0] = slotIndex;

    if (source.length <= 6) {
        const offset = getActivityTimelineValueOffset(slotIndex);
        normalized[offset] = clampChartParamValue(
            source[1] ?? normalized[offset]
        );
        normalized[offset + 1] = clampChartParamValue(
            source[2] ?? normalized[offset + 1]
        );
        normalized[offset + 2] = clampChartParamValue(
            source[3] ?? normalized[offset + 2]
        );
        normalized[offset + 3] = clampChartParamValue(
            source[4] ?? normalized[offset + 3]
        );

        return normalized;
    }

    for (let index = 1; index < normalized.length; index += 1) {
        normalized[index] = clampChartParamValue(source[index] ?? normalized[index]);
    }

    return normalized;
}

function readActivityTimelineSelection(values: number[] | undefined) {
    const normalized = normalizeActivityTimelineSelectionValues(values);
    const slotIndex = Math.min(
        activityTimelineBaseValues.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultActivityTimelineSelectionValues[0]))
    );
    const slots = activityTimelineBaseValues.map((_, index) => {
        const offset = getActivityTimelineValueOffset(index);

        return {
            value: clampChartParamValue(normalized[offset]),
            segments: [
                clampChartParamValue(normalized[offset + 1]),
                clampChartParamValue(normalized[offset + 2]),
                clampChartParamValue(normalized[offset + 3]),
            ],
        };
    });
    const selectedSlot = slots[slotIndex];

    return {
        slotIndex,
        value: selectedSlot.value,
        segments: selectedSlot.segments,
        slots,
        values: normalized,
    };
}

function buildActivityTimelineSlots(
    values: number[] | undefined,
    locale: ChartDemoLocale
): ActivityTimelineSlot[] {
    const selected = readActivityTimelineSelection(values);
    const labels = getActivityTimelineLabels(locale);

    return labels.map((label, index) => {
        const slot = selected.slots[index];
        const value = slot.value;
        const slotSegments = buildActivitySlotSegments(slot.segments, locale);
        const segmentSummary = slotSegments
            .map((segment) => `${segment.label} ${segment.value} kcal`)
            .join(" / ");

        return {
            label,
            value,
            color: index === selected.slotIndex ? "success" : "info",
            segments: slotSegments,
            description:
                locale === "ja"
                    ? `${label} の活動量: ${value} kcal（${segmentSummary}）`
                    : `${label} activity load: ${value} kcal (${segmentSummary})`,
        };
    });
}

function buildActivitySlotSegments(
    segmentValues: number[],
    locale: ChartDemoLocale
): ActivityTimelineSegment[] {
    const labels = getActivitySegmentLabels(locale);
    const colors = ["success", "primary", "accent"] as const;

    return labels.map((label, index) => {
        return {
            label,
            value: clampChartParamValue(segmentValues[index] ?? 0),
            color: colors[index],
            description:
                locale === "ja"
                    ? `${label} の時間帯内訳`
                    : `${label} share in this time slot`,
        };
    });
}

function buildActivitySegments(
    values: number[] | undefined,
    locale: ChartDemoLocale
): ActivityTimelineSegment[] {
    const selected = readActivityTimelineSelection(values);
    return buildActivitySlotSegments(selected.segments, locale);
}

function getActivityTimelineMetricTooltips({
    locale,
    selectedLabel,
    selectedValue,
    baselineValue,
    percentDelta,
    total,
    slotCount,
    dailyAverage,
}: {
    locale: ChartDemoLocale;
    selectedLabel: string;
    selectedValue: number;
    baselineValue: number;
    percentDelta: number;
    total: number;
    slotCount: number;
    dailyAverage: number;
}) {
    const formattedDelta = `${percentDelta >= 0 ? "+" : ""}${percentDelta}%`;

    return {
        delta:
            locale === "ja"
                ? `このデモでは昨日の同時間帯を基準値として扱います。${selectedLabel}: (${selectedValue} - ${baselineValue}) ÷ ${baselineValue} × 100 = ${formattedDelta}`
                : `This demo treats the same time yesterday as the baseline. ${selectedLabel}: (${selectedValue} - ${baselineValue}) / ${baselineValue} x 100 = ${formattedDelta}`,
        total:
            locale === "ja"
                ? `全${slotCount}時間帯の活動量を合計しています。合計 = ${total.toLocaleString()} kcal`
                : `Sum of activity across all ${slotCount} time slots. Total = ${total.toLocaleString()} kcal`,
        dailyAverage:
            locale === "ja"
                ? `消費 ${total.toLocaleString()} kcal ÷ ${slotCount}時間帯 = ${dailyAverage.toLocaleString()} kcal`
                : `${total.toLocaleString()} kcal burned / ${slotCount} time slots = ${dailyAverage.toLocaleString()} kcal`,
    };
}

function readLabeledDonutSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultLabeledDonutSelectionValues;
    const labels = getLabeledDonutLabels(locale);
    const selectedIndex = Math.min(
        labels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultLabeledDonutSelectionValues[0]))
    );

    return {
        selectedIndex,
        values: labels.map((_, index) =>
            clampChartParamValue(
                normalized[index + 1] ?? defaultLabeledDonutSelectionValues[index + 1]
            )
        ),
    };
}

function buildLabeledDonutSegments(
    values: number[] | undefined,
    locale: ChartDemoLocale
): LabeledDonutSegment[] {
    const selected = readLabeledDonutSelection(values, locale);
    const labels = getLabeledDonutLabels(locale);
    const colors = ["primary", "warning", "success"] as const;

    return labels.map((label, index) => ({
        label,
        calloutLabel: label,
        value: selected.values[index],
        color: colors[index],
        comparison:
            locale === "ja"
                ? `${index + 1}番目の販売チャネル`
                : `Sales channel ${index + 1}`,
    }));
}

function readSegmentedGaugeSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultSegmentedGaugeSelectionValues;
    const labels = getSegmentedGaugeLabels(locale);
    const selectedIndex = Math.min(
        labels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultSegmentedGaugeSelectionValues[0]))
    );

    return {
        selectedIndex,
        segments: labels.map((_, index) =>
            clampChartParamValue(
                normalized[index + 1] ?? defaultSegmentedGaugeSelectionValues[index + 1]
            )
        ),
        value: clampChartValue(normalized[4] ?? defaultSegmentedGaugeSelectionValues[4]),
        target: clampChartValue(normalized[5] ?? defaultSegmentedGaugeSelectionValues[5]),
    };
}

function buildSegmentedGaugeSegments(
    values: number[] | undefined,
    locale: ChartDemoLocale
): SegmentedGaugeSegment[] {
    const selected = readSegmentedGaugeSelection(values, locale);
    const labels = getSegmentedGaugeLabels(locale);
    const colors = ["success", "warning", "primary"] as const;
    const ranges = locale === "ja"
        ? ["固定費", "追加投資", "運用余力"]
        : ["Fixed", "Investment", "Capacity"];

    return labels.map((label, index) => ({
        label,
        value: selected.segments[index],
        color: colors[index],
        rangeLabel: ranges[index],
        description:
            locale === "ja"
                ? `${label} の配分です。`
                : `${label} allocation.`,
    }));
}

function readMiniDistributionSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultMiniDistributionSelectionValues;
    const labels = getMiniDistributionLabels(locale);
    const selectedIndex = Math.min(
        labels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultMiniDistributionSelectionValues[0]))
    );

    return {
        selectedIndex,
        values: labels.map((_, index) =>
            clampChartValue(
                normalized[index + 1] ?? defaultMiniDistributionSelectionValues[index + 1]
            )
        ),
        products: clampChartParamValue(normalized[4] ?? defaultMiniDistributionSelectionValues[4]),
    };
}

function buildMiniDistributionSegments(
    values: number[] | undefined,
    locale: ChartDemoLocale
): MiniDistributionSegment[] {
    const selected = readMiniDistributionSelection(values, locale);
    const labels = getMiniDistributionLabels(locale);
    const colors = ["warning", "primary", "success"] as const;

    return labels.map((label, index) => ({
        label,
        value: selected.values[index],
        color: colors[index],
        detail:
            locale === "ja"
                ? `${selected.products + index * 8} 件`
                : `${selected.products + index * 8} products`,
        description:
            locale === "ja"
                ? `${label} の構成比です。`
                : `${label} category share.`,
    }));
}

function readSegmentTimelineSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultSegmentTimelineSelectionValues;
    const labels = getSegmentTimelineLabels(locale);
    const selectedIndex = Math.min(
        labels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultSegmentTimelineSelectionValues[0]))
    );
    const hasIntervalValues = normalized.length > 6;
    const quality = clampChartValue(
        normalized[hasIntervalValues ? 1 : 5] ??
            defaultSegmentTimelineSelectionValues[1]
    );
    const legacyDurations = [112, 248, 86, 28];
    const intervals = hasIntervalValues
        ? segmentTimelineIntervalsFromValues(normalized, labels.length)
        : splitSegmentTimelineDurations(
              labels.map((_, index) =>
                  clampDurationValue(
                      normalized[index + 1] ?? legacyDurations[index]
                  )
              )
          );
    const durations = segmentTimelineDurationsFromIntervals(
        intervals,
        labels.length
    );

    return {
        selectedIndex,
        durations,
        intervals,
        quality,
    };
}

function segmentTimelineIntervalsFromValues(values: number[], labelCount: number) {
    const intervals: Array<{ stageIndex: number; duration: number }> = [];

    for (let index = 2; index < values.length - 1; index += 2) {
        const stageIndex = Math.min(
            labelCount - 1,
            Math.max(0, Math.round(values[index] ?? 0))
        );
        const duration = clampDurationValue(values[index + 1] ?? 0);

        if (duration > 0) {
            intervals.push({ stageIndex, duration });
        }
    }

    if (intervals.length > 0) return intervals;

    return splitSegmentTimelineDurations([112, 248, 86, 28]);
}

function segmentTimelineDurationsFromIntervals(
    intervals: Array<{ stageIndex: number; duration: number }>,
    labelCount: number
) {
    const durations = Array.from({ length: labelCount }, () => 0);

    intervals.forEach((interval) => {
        durations[interval.stageIndex] =
            (durations[interval.stageIndex] ?? 0) + interval.duration;
    });

    return durations;
}

function segmentTimelineValuesFromSelection(
    selectedIndex: number,
    quality: number,
    intervals: Array<{ stageIndex: number; duration: number }>
) {
    return [
        selectedIndex,
        quality,
        ...intervals.flatMap((interval) => [
            interval.stageIndex,
            interval.duration,
        ]),
    ];
}

function splitSegmentTimelineDurations(durations: number[]) {
    const remainingDurations = [...durations];
    const remainingSlots = durations.map((_, stageIndex) =>
        segmentTimelineStageOrder.filter((nextStageIndex) => nextStageIndex === stageIndex).length
    );
    const chunks: Array<{ stageIndex: number; duration: number }> = [];

    segmentTimelineStageOrder.forEach((stageIndex) => {
        const remainingDuration = remainingDurations[stageIndex] ?? 0;
        if (remainingDuration <= 0) return;

        const slotCount = Math.max(remainingSlots[stageIndex] ?? 1, 1);
        const duration = Math.min(
            remainingDuration,
            Math.max(1, Math.round(remainingDuration / slotCount))
        );

        chunks.push({ stageIndex, duration });
        remainingDurations[stageIndex] = remainingDuration - duration;
        remainingSlots[stageIndex] = slotCount - 1;
    });

    remainingDurations.forEach((duration, stageIndex) => {
        if (duration > 0) {
            chunks.push({ stageIndex, duration });
        }
    });

    return chunks;
}

function buildSegmentTimelineSegments(
    values: number[] | undefined,
    locale: ChartDemoLocale
): SegmentTimelineSegment[] {
    const selected = readSegmentTimelineSelection(values, locale);
    const labels = getSegmentTimelineLabels(locale);
    const colors = ["primary", "info", "success", "warning"] as const;
    let cursor = 0;

    return selected.intervals.map((chunk) => {
        const label = labels[chunk.stageIndex];
        const duration = chunk.duration;
        const segment = {
            label,
            value: duration,
            start: cursor,
            end: cursor + duration,
            color: colors[chunk.stageIndex],
        };
        cursor += duration;
        return segment;
    });
}

const retentionBaseValues = [
    [100, 76, 64, 58, 51, 46, 41, 36],
    [100, 72, 62, 54, 48, 42, 37],
    [100, 68, 56, 49, 43, 38],
    [100, 70, 59, 50, 44],
    [100, 66, 53, 47],
    [100, 63, 51],
];

function readRetentionCohortSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultRetentionCohortSelectionValues;
    const cohortLabels = getRetentionCohortLabels(locale);
    const cohortIndex = Math.min(
        cohortLabels.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultRetentionCohortSelectionValues[0]))
    );
    const maxPeriodIndex = Math.max(0, retentionBaseValues[cohortIndex].length - 1);
    const periodIndex = Math.min(
        maxPeriodIndex,
        Math.max(0, Math.round(normalized[1] ?? defaultRetentionCohortSelectionValues[1]))
    );

    return {
        cohortIndex,
        periodIndex,
        value: clampChartValue(normalized[2] ?? defaultRetentionCohortSelectionValues[2]),
    };
}

function previewValuesFromRetentionCohort(
    cohortIndex: number,
    periodIndex: number,
    value: number
) {
    const normalizedCohortIndex = Math.min(
        retentionBaseValues.length - 1,
        Math.max(0, Math.round(cohortIndex))
    );
    const maxPeriodIndex = Math.max(
        0,
        retentionBaseValues[normalizedCohortIndex].length - 1
    );

    return [
        normalizedCohortIndex,
        Math.min(maxPeriodIndex, Math.max(0, Math.round(periodIndex))),
        clampChartValue(value),
        0,
        0,
        0,
    ];
}

function buildRetentionCohorts(values: number[] | undefined, locale: ChartDemoLocale): RetentionCohortRow[] {
    const selected = readRetentionCohortSelection(values, locale);
    const cohortLabels = getRetentionCohortLabels(locale);
    const periodLabels = getRetentionPeriodLabels(locale);
    const copy = getChartDemoCopy(locale);

    return cohortLabels.map((label, cohortIndex) => ({
        label,
        size: 1240 - cohortIndex * 96,
        values: retentionBaseValues[cohortIndex].map((value, periodIndex) => ({
            value:
                selected.cohortIndex === cohortIndex && selected.periodIndex === periodIndex
                    ? selected.value
                    : value,
            description:
                locale === "ja"
                    ? `${copy.cohortSize}: ${(1240 - cohortIndex * 96).toLocaleString()} / ${periodLabels[periodIndex]}`
                    : `${copy.cohortSize}: ${(1240 - cohortIndex * 96).toLocaleString()} / ${periodLabels[periodIndex]}`,
        })),
    }));
}

function readChoroplethSelection(values?: number[]) {
    const normalized = values ?? defaultChoroplethSelectionValues;
    const index = Math.min(
        tokyoWardBoundaries.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultChoroplethSelectionValues[0]))
    );

    return {
        index,
        region: tokyoWardBoundaries[index],
        value: clampChartValue(normalized[1] ?? tokyoWardBoundaries[index].value),
    };
}

function buildTokyoChoroplethRegions(values: number[] | undefined, locale: ChartDemoLocale): ChoroplethRegion[] {
    const selected = readChoroplethSelection(values);

    return tokyoWardBoundaries.map((region, index) => ({
        ...region,
        label: getTokyoRegionLabel(region, locale),
        description: getTokyoRegionDescription(
            region,
            index === selected.index ? selected.value : region.value,
            locale
        ),
        value: index === selected.index ? selected.value : region.value,
    }));
}

function previewValuesFromTokyoRegion(index: number, value: number) {
    return [
        Math.min(tokyoWardBoundaries.length - 1, Math.max(0, Math.round(index))),
        clampChartValue(value),
        0,
        0,
        0,
        0,
    ];
}

function previewValuesFromQuadrantMatrix(index: number, value: number) {
    return [
        Math.min(quadrantMatrixTextByLocale.en.length - 1, Math.max(0, Math.round(index))),
        clampChartValue(value),
        0,
        0,
        0,
        0,
    ];
}

const quadrantMatrixBaseGeometry = [
    { value: 88, x: 72, y: 34, color: "primary" },
    { value: 76, x: 58, y: 24, color: "success" },
    { value: 64, x: 42, y: 44, color: "warning" },
    { value: 52, x: 30, y: 72, color: "info" },
    { value: 41, x: 76, y: 70, color: "accent" },
    { value: 35, x: 24, y: 26, color: "destructive" },
] as const;

function getQuadrantMatrixBaseItems(locale: ChartDemoLocale): Array<Omit<QuadrantMatrixItem, "value"> & { value: number }> {
    return quadrantMatrixTextByLocale[locale].map((item, index) => ({
        ...item,
        ...quadrantMatrixBaseGeometry[index],
    }));
}

function readQuadrantMatrixSelection(values: number[] | undefined, locale: ChartDemoLocale) {
    const normalized = values ?? defaultQuadrantMatrixSelectionValues;
    const baseItems = getQuadrantMatrixBaseItems(locale);
    const index = Math.min(
        baseItems.length - 1,
        Math.max(0, Math.round(normalized[0] ?? defaultQuadrantMatrixSelectionValues[0]))
    );

    return {
        index,
        item: baseItems[index],
        value: clampChartValue(normalized[1] ?? baseItems[index].value),
    };
}

function buildQuadrantMatrixItems(values: number[] | undefined, locale: ChartDemoLocale): QuadrantMatrixItem[] {
    const selected = readQuadrantMatrixSelection(values, locale);

    return getQuadrantMatrixBaseItems(locale).map((item, index) => ({
        ...item,
        value: index === selected.index ? selected.value : item.value,
    }));
}

export function encodeChartValues(values: number[], max = 200) {
    return values.map((value) => clampChartParamValue(value, max)).join(",");
}

export function parseChartValuesParam(
    raw: string | null,
    fallback = defaultChartDataValues,
    max = 200
) {
    if (!raw) return fallback;
    const parsed = raw.split(",").map((value) => Number(value));
    return normalizePreviewValues(parsed, fallback, max);
}

export function parseSegmentTimelineValuesParam(raw: string | null) {
    if (!raw) return defaultSegmentTimelineSelectionValues;
    const parsed = raw.split(",").map((value) => clampChartParamValue(Number(value), 480));

    if (parsed.length <= 6) return parsed;

    return normalizePreviewValues(
        parsed,
        defaultSegmentTimelineSelectionValues,
        480
    );
}

export function parseChartBaselineParam(raw: string | null, fallback: number) {
    if (!raw) return fallback;
    return clampChartValue(Number(raw));
}

export function useChartPreviewValues(fallback = defaultChartDataValues, max = 200) {
    const [values, setValues] = useState(fallback);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setValues(parseChartValuesParam(params.get("values"), fallback, max));
    }, [fallback, max]);

    return values;
}

export function useSegmentTimelinePreviewValues() {
    const [values, setValues] = useState(defaultSegmentTimelineSelectionValues);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setValues(parseSegmentTimelineValuesParam(params.get("values")));
    }, []);

    return values;
}

export function useChartPreviewBaseline(fallback: number) {
    const [baseline, setBaseline] = useState(fallback);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setBaseline(parseChartBaselineParam(params.get("baseline"), fallback));
    }, [fallback]);

    return baseline;
}

export function parseChartReferenceParam(raw: string | null, fallback = true) {
    if (raw === null) return fallback;
    return raw !== "0" && raw !== "false";
}

export function useChartPreviewReference(fallback = true) {
    const [showReference, setShowReference] = useState(fallback);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setShowReference(parseChartReferenceParam(params.get("reference"), fallback));
    }, [fallback]);

    return showReference;
}

export function SparklineChartDemo({ values, showReference = true, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = values ?? trendData;
    const sparklineData = buildSparklineData(chartValues, chartLocale);
    const avg = average(chartValues);
    const total = chartValues.reduce((sum, value) => sum + value, 0);
    const delta = chartValues[chartValues.length - 1] - chartValues[0];

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.revenueTrend}
            description={values ? copy.editedData : copy.monthlyRecurringRevenue}
            value={values ? `$${(total * 120).toLocaleString()}` : "$128,430"}
            delta={values ? `${delta >= 0 ? "+" : ""}${delta}` : "+12.4%"}
            deltaDescription={values ? copy.changeFromFirstPoint : copy.changeFromPreviousPeriod}
            trend={delta > 0 ? "up" : delta < 0 ? "down" : "flat"}
        >
            <SparklineChart
                data={sparklineData}
                variant="area"
                color="primary"
                referenceValue={showReference ? (values ? avg : 42) : undefined}
                referenceLabel={values ? copy.avg : copy.referenceLine}
                showDots
                aria-label={copy.revenueTrend}
            />
        </AnalyticsCard>
    );
}

export function LineChartDemo({ values, showReference = true, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeLineChartValues(values);
    const actualValues = getLineChartActualValues(chartValues);
    const series = buildLineChartSeries(chartValues, chartLocale);
    const avg = average(actualValues);
    const total = actualValues.reduce((sum, value) => sum + value, 0);
    const delta = actualValues[actualValues.length - 1] - actualValues[0];

    return (
        <AnalyticsCard
            className="w-full max-w-none"
            title={copy.revenueTrend}
            description={copy.actualVsTarget}
            value={`$${(total * 120).toLocaleString()}`}
            delta={`${delta >= 0 ? "+" : ""}${delta}`}
            deltaDescription={copy.changeFromFirstPoint}
            trend={delta > 0 ? "up" : delta < 0 ? "down" : "flat"}
        >
            <LineChart
                series={series}
                variant="area"
                referenceValue={showReference ? avg : undefined}
                referenceLabel={copy.avg}
                showLegend
                aria-label={copy.lineChart}
            />
        </AnalyticsCard>
    );
}

export function RibbonChartDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeRibbonChartValues(values);
    const layers = buildRibbonLayers(chartValues, chartLocale);
    const totalsByPeriod = Array.from({ length: chartDataLabels.length }, (_, index) =>
        getRibbonLayerLabels(chartLocale).reduce(
            (sum, _, layerIndex) =>
                sum + chartValues[layerIndex * chartDataLabels.length + index],
            0
        )
    );
    const total = totalsByPeriod.reduce((sum, value) => sum + value, 0);
    const delta = totalsByPeriod[totalsByPeriod.length - 1] - totalsByPeriod[0];

    return (
        <AnalyticsCard
            className="w-full max-w-5xl"
            title={copy.ribbonChart}
            description={copy.flowDistribution}
            value={total.toLocaleString()}
            delta={`${delta >= 0 ? "+" : ""}${delta}`}
            deltaDescription={copy.changeFromFirstPoint}
            trend={delta > 0 ? "up" : delta < 0 ? "down" : "flat"}
        >
            <RibbonChart
                layers={layers}
                variant="flow"
                totalLabel={copy.total}
                showLegend
                aria-label={copy.ribbonChart}
            />
        </AnalyticsCard>
    );
}

export function RadialBarChartDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeRadialBarValues(values);
    const data = buildRadialBarData(chartValues, chartLocale);
    const avg = average(chartValues);

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.radialBarChart}
            description={copy.progressShare}
            value={`${avg}% ${copy.avg}`}
            trend="flat"
        >
            <RadialBarChart
                data={data}
                centerValue={`${avg}%`}
                centerLabel={copy.avg}
                formatValue={(value) => `${value}%`}
                maxLabel={copy.max}
                showLegend
                aria-label={copy.radialBarChart}
            />
        </AnalyticsCard>
    );
}

export function ConcentricProgressCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const selected = readConcentricProgressSelection(values, chartLocale);
    const [localSelectedIndex, setLocalSelectedIndex] = useState(selected.selectedIndex);
    const rings = buildConcentricProgressRings(values, chartLocale);
    const used = rings.reduce((sum, ring) => sum + ring.value, 0);
    const activeSelectedIndex = onValuesChange
        ? selected.selectedIndex
        : localSelectedIndex;
    const normalizedSelectedIndex = Math.min(
        rings.length - 1,
        Math.max(0, activeSelectedIndex)
    );
    const selectedRing = rings[normalizedSelectedIndex];
    const usedPercent = Math.round((used / Math.max(selected.capacity, 1)) * 100);
    const selectedCapacityShare = selectedRing
        ? formatShareOfTotal(selectedRing.value, selected.capacity)
        : undefined;
    const handleRingSelect = (_ring: ConcentricProgressRing, index: number) => {
        const nextIndex = Math.min(rings.length - 1, Math.max(0, index));

        if (onValuesChange) {
            onValuesChange([
                nextIndex,
                selected.values[0],
                selected.values[1],
                selected.values[2],
                selected.values[3],
                selected.capacity,
            ]);
            return;
        }

        setLocalSelectedIndex(nextIndex);
    };

    useEffect(() => {
        setLocalSelectedIndex(selected.selectedIndex);
    }, [selected.selectedIndex]);

    return (
        <ConcentricProgressCard
            className="w-full max-w-3xl"
            title={copy.storageOverview}
            description={copy.concentricProgress}
            value={`${used}GB`}
            centerLabel={copy.usedStorage}
            delta={`${usedPercent}%`}
            deltaDescription={
                chartLocale === "ja"
                    ? "総容量に対する使用率です。"
                    : "Used share of total capacity."
            }
            metrics={[
                {
                    label: copy.usedStorage,
                    value: `${used}GB`,
                    description: `${usedPercent}%`,
                },
                {
                    label: copy.totalCapacity,
                    value: `${selected.capacity}GB`,
                },
                {
                    label: copy.selected,
                    value: selectedRing ? selectedRing.label : "-",
                    description:
                        selectedRing && selectedCapacityShare
                            ? chartLocale === "ja"
                                ? `${selectedRing.value}GB / 全体 ${selected.capacity}GB 中の ${selectedCapacityShare}`
                                : `${selectedRing.value}GB / ${selectedCapacityShare} of total`
                            : undefined,
                },
            ]}
            rings={rings}
            selectedIndex={normalizedSelectedIndex}
            onRingSelect={handleRingSelect}
            max={selected.capacity}
            formatValue={(nextValue) => `${nextValue}GB`}
            maxLabel={copy.totalCapacity}
            caption={
                chartLocale === "ja"
                    ? "ストレージ、使用量、クォータなどを複数リングで比較します。"
                    : "Compare storage, usage, and quota values with selectable rings."
            }
        />
    );
}

export function BarChartDemo({ values, showReference = true, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeChartValues(values);
    const barData = values ? buildBarData(chartValues, chartLocale) : getWeekdayBars(chartLocale);
    const avg = values ? average(chartValues) : 50;
    const total = values
        ? chartValues.reduce((sum, value) => sum + value, 0)
        : 18420;
    const max = values ? Math.max(...chartValues) : 246;

    return (
        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
            <AnalyticsCard
                title={copy.weeklyActivity}
                description={copy.averageSessionsByDay}
                value={total.toLocaleString()}
                delta={values ? `${avg} ${copy.avg}` : "+3.1%"}
                deltaDescription={values ? copy.averageOfPreviewData : copy.changeFromPreviousPeriod}
                trend={values ? "flat" : "up"}
            >
                <BarChart
                    data={barData}
                    averageValue={showReference ? avg : undefined}
                    averageLabel={copy.avg}
                    showValues
                    aria-label={copy.weeklyActivity}
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.ticketLoad}
                description={copy.openSupportTickets}
                value={max.toLocaleString()}
                delta={values ? `${Math.min(...chartValues)} ${copy.min}` : "-4.5%"}
                deltaDescription={values ? copy.minimumOfPreviewData : copy.changeFromPreviousPeriod}
                trend={values ? "flat" : "down"}
            >
                <BarChart
                    data={barData}
                    variant="horizontal"
                    averageValue={showReference ? avg : undefined}
                    averageLabel={copy.avg}
                    showValues
                    aria-label={copy.averageSessionsByDay}
                />
            </AnalyticsCard>
        </div>
    );
}

export function StackedBarChartDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeStackedBarValues(values);
    const groups = buildStackedBarGroups(chartValues, chartLocale);
    const totals = groups.map((group) =>
        group.segments.reduce((sum, segment) => sum + segment.value, 0)
    );
    const max = Math.max(...totals);
    const total = totals.reduce((sum, value) => sum + value, 0);

    return (
        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
            <AnalyticsCard
                title={copy.channelMix}
                description={copy.monthlyRevenue}
                value={total.toLocaleString()}
                delta={`${max} ${copy.peak}`}
                deltaDescription={copy.peakOfPreviewData}
                trend="up"
            >
                <StackedBarChart
                    data={groups}
                    showLegend
                    showValues
                    totalLabel={copy.total}
                    aria-label={copy.channelMix}
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.acquisition}
                description={copy.channelDistribution}
                value={`${groups.length} ${copy.groups}`}
                trend="flat"
            >
                <StackedBarChart
                    data={groups}
                    variant="horizontal"
                    normalize
                    showValues
                    totalLabel={copy.total}
                    aria-label={copy.channelDistribution}
                />
            </AnalyticsCard>
        </div>
    );
}

export function DistributionBarDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const segments = values
        ? buildDistributionSegments(normalizeDistributionPreviewValues(values), chartLocale)
        : getChannels(chartLocale);

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.acquisition}
            description={copy.channelDistribution}
            value={values ? `4 ${copy.groups}` : `4 ${copy.sources}`}
            trend="flat"
        >
            <DistributionBar segments={segments} totalLabel={copy.total} showLegend />
        </AnalyticsCard>
    );
}

export function DonutChartDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeDistributionPreviewValues(values);
    const segments = values ? buildDistributionSegments(chartValues, chartLocale) : getChannels(chartLocale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.segmentMix}
            description={copy.shareByChannel}
            value={total.toLocaleString()}
            trend="flat"
        >
            <DonutChart
                segments={segments}
                centerValue={total.toLocaleString()}
                centerLabel={copy.total}
                totalLabel={copy.total}
                showLegend
            />
        </AnalyticsCard>
    );
}

export function PieChartDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeDistributionPreviewValues(values);
    const segments = values ? buildDistributionSegments(chartValues, chartLocale) : getChannels(chartLocale);

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.audienceShare}
            description={copy.categorySplit}
            value={`${segments.length} ${copy.segments}`}
            trend="flat"
        >
            <PieChart segments={segments} totalLabel={copy.total} showLegend />
        </AnalyticsCard>
    );
}

export function GaugeChartDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeChartValues(values);
    const score = average(chartValues);

    return (
        <GaugeChart
            value={score}
            label={copy.score}
            valueLabel={`${score}%`}
            formatValue={(nextValue) => `${nextValue}%`}
            rangeLabel={copy.range}
        />
    );
}

export function RadarChartDemo({ values, baseline, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeChartValues(values);
    const radarData = buildRadarData(chartValues, chartLocale);
    const avg = average(chartValues);
    const referenceBaseline = baseline ?? chartDeltaBaselines.referenceScore;
    const delta = avg - referenceBaseline;

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.capabilityBalance}
            description={copy.radarChart}
            value={`${avg}% ${copy.avg}`}
            delta={values ? formatPointDelta(delta) : "+8pt"}
            deltaDescription={getReferenceBaselineDeltaDescription(
                chartLocale,
                referenceBaseline
            )}
            trend={values ? trendFromDelta(delta) : "up"}
        >
            <RadarChart
                data={radarData}
                max={100}
                color="primary"
                formatValue={(value) => `${value}%`}
                maxLabel={copy.max}
                aria-label={copy.capabilityBalance}
            />
        </AnalyticsCard>
    );
}

export function HeatmapChartDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const xLabels = getHeatmapXLabels(chartLocale);
    const [localValues, setLocalValues] = useState(values ?? defaultHeatmapSelectionValues);
    const activeValues = onValuesChange ? values ?? defaultHeatmapSelectionValues : localValues;
    const selected = readHeatmapSelection(activeValues, chartLocale);
    const heatmapData = buildEditableHeatmapData(activeValues, chartLocale);
    const heatmapSummary = buildHeatmapSummary(heatmapData, chartLocale);
    const updateSelection = (nextValues: number[]) => {
        if (onValuesChange) {
            onValuesChange(nextValues);
            return;
        }

        setLocalValues(nextValues);
    };

    return (
        <HeatmapChart
            data={heatmapData}
            xLabels={xLabels}
            yLabels={heatmapYLabels}
            summary={heatmapSummary}
            summaryLabel={chartLocale === "ja" ? "ピーク" : "Peak"}
            max={100}
            summaryMax={100}
            selectedCell={{ x: selected.x, y: selected.y }}
            showValues
            onCellSelect={(cell) =>
                updateSelection(
                    previewValuesFromHeatmapCell(
                        cell.x,
                        cell.y,
                        cell.value,
                        chartLocale
                    )
                )
            }
            aria-label={chartLocale === "ja" ? "利用密度" : "Traffic density"}
        />
    );
}

export function ActivityTimelineCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const externalSelected = readActivityTimelineSelection(values);
    const [localSelected, setLocalSelected] = useState(externalSelected);
    const selected = onValuesChange ? externalSelected : localSelected;
    const activeValues = selected.values;
    const slots = buildActivityTimelineSlots(activeValues, chartLocale);
    const selectedSlotSegments = buildActivitySegments(activeValues, chartLocale);
    const total = selected.slots.reduce((sum, slot) => sum + slot.value, 0);
    const dailyAverage = Math.round(total / Math.max(selected.slots.length, 1));
    const selectedLabel = getActivityTimelineLabels(chartLocale)[selected.slotIndex];
    const selectedBaselineValue = activityTimelineBaseValues[selected.slotIndex];
    const selectedDelta =
        selected.value - selectedBaselineValue;
    const selectedPercentDelta =
        selectedBaselineValue > 0
            ? Math.round(
                  (selectedDelta / selectedBaselineValue) * 100
              )
            : 0;
    const metricTooltips = getActivityTimelineMetricTooltips({
        locale: chartLocale,
        selectedLabel,
        selectedValue: selected.value,
        baselineValue: selectedBaselineValue,
        percentDelta: selectedPercentDelta,
        total,
        slotCount: selected.slots.length,
        dailyAverage,
    });
    const handleSlotSelect = (slot: ActivityTimelineSlot, index: number) => {
        const nextValues = [...selected.values];
        nextValues[0] = Math.min(
            activityTimelineBaseValues.length - 1,
            Math.max(0, Math.round(index))
        );

        if (onValuesChange) {
            onValuesChange(nextValues);
            return;
        }

        setLocalSelected(readActivityTimelineSelection(nextValues));
    };

    useEffect(() => {
        if (onValuesChange) return;
        setLocalSelected(externalSelected);
    }, [values, onValuesChange]);

    return (
        <ActivityTimelineCard
            className="w-full max-w-3xl"
            title={copy.energyTimeline}
            description={copy.activityTimeline}
            delta={`${selectedPercentDelta >= 0 ? "+" : ""}${selectedPercentDelta}%`}
            deltaDescription={
                chartLocale === "ja"
                    ? "選択した時間帯の基準値との差分です。"
                    : "Change from the selected time slot baseline."
            }
            metrics={[
                {
                    label: copy.thanYesterday,
                    value: `${selectedPercentDelta >= 0 ? "+" : ""}${selectedPercentDelta}%`,
                    tooltip: metricTooltips.delta,
                },
                {
                    label: copy.burned,
                    value: `${total.toLocaleString()} kcal`,
                    tooltip: metricTooltips.total,
                },
                {
                    label: copy.dailyAverage,
                    value: `${dailyAverage.toLocaleString()} kcal`,
                    tooltip: metricTooltips.dailyAverage,
                },
            ]}
            slots={slots}
            segments={selectedSlotSegments}
            selectedSlot={selected.slotIndex}
            onSlotSelect={handleSlotSelect}
            max={200}
            totalLabel={copy.total}
            caption={
                chartLocale === "ja"
                    ? "選択した時間帯の活動量と内訳を一枚のカードで確認します。"
                    : "Inspect the selected time slot load and segment contribution in one card."
            }
        />
    );
}

export function LabeledDonutCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const [localValues, setLocalValues] = useState(values ?? defaultLabeledDonutSelectionValues);
    const activeValues = onValuesChange ? values ?? defaultLabeledDonutSelectionValues : localValues;
    const selected = readLabeledDonutSelection(activeValues, chartLocale);
    const segments = buildLabeledDonutSegments(activeValues, chartLocale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const selectedSegment = segments[selected.selectedIndex];
    const share =
        total > 0 && selectedSegment
            ? Math.round((selectedSegment.value / total) * 100)
            : 0;
    const updateSelection = (nextIndex: number) => {
        const nextValues = [
            nextIndex,
            selected.values[0],
            selected.values[1],
            selected.values[2],
            0,
            0,
        ];

        if (onValuesChange) {
            onValuesChange(nextValues);
            return;
        }

        setLocalValues(nextValues);
    };

    return (
        <LabeledDonutCard
            className="w-full max-w-3xl"
            title={copy.salesByPlatform}
            description={copy.labeledDonut}
            centerValue={`${total.toLocaleString()}`}
            centerLabel={copy.total}
            delta={`${share}%`}
            deltaDescription={
                chartLocale === "ja"
                    ? "選択したセグメントの構成比です。"
                    : "Share of the selected segment."
            }
            segments={segments}
            selectedIndex={selected.selectedIndex}
            totalLabel={copy.total}
            onSegmentSelect={(_, index) => updateSelection(index)}
            caption={
                chartLocale === "ja"
                    ? "セグメントの構成比を外部ラベル付きで確認します。"
                    : "Compare segment share with external callout labels."
            }
        />
    );
}

export function SegmentedGaugeCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const selected = readSegmentedGaugeSelection(values, chartLocale);
    const [localSelectedIndex, setLocalSelectedIndex] = useState(selected.selectedIndex);
    const segments = buildSegmentedGaugeSegments(values, chartLocale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const activeSelectedIndex = onValuesChange
        ? selected.selectedIndex
        : localSelectedIndex;
    const normalizedSelectedIndex = Math.min(
        segments.length - 1,
        Math.max(0, activeSelectedIndex)
    );
    const selectedSegment = segments[normalizedSelectedIndex];
    const selectedShare =
        selectedSegment && total > 0
            ? Math.round((selectedSegment.value / total) * 100)
            : 0;
    const handleSegmentSelect = (_segment: SegmentedGaugeSegment, index: number) => {
        const nextIndex = Math.min(segments.length - 1, Math.max(0, index));

        if (onValuesChange) {
            onValuesChange([
                nextIndex,
                selected.segments[0],
                selected.segments[1],
                selected.segments[2],
                selected.value,
                selected.target,
            ]);
            return;
        }

        setLocalSelectedIndex(nextIndex);
    };

    useEffect(() => {
        setLocalSelectedIndex(selected.selectedIndex);
    }, [selected.selectedIndex]);

    return (
        <SegmentedGaugeCard
            className="w-full max-w-3xl"
            title={copy.spendBreakdown}
            description={copy.segmentedGauge}
            value={selected.value}
            valueLabel={`${selected.value}%`}
            centerLabel={copy.currentSpend}
            delta={`${selectedShare}%`}
            deltaDescription={
                chartLocale === "ja"
                    ? "選択したセグメントの構成比です。"
                    : "Share of the selected segment."
            }
            segments={segments}
            selectedIndex={normalizedSelectedIndex}
            onSegmentSelect={handleSegmentSelect}
            targetValue={selected.target}
            targetLabel={copy.targetSpend}
            max={100}
            formatValue={(nextValue) => `${nextValue}%`}
            totalLabel={copy.total}
            caption={
                chartLocale === "ja"
                    ? "支出・進捗・リスクをセグメント付きの半円ゲージで確認します。"
                    : "Inspect spend, progress, or risk status with segmented gauge ranges."
            }
        />
    );
}

export function MiniDistributionBarCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const selected = readMiniDistributionSelection(values, chartLocale);
    const [localSelectedIndex, setLocalSelectedIndex] = useState(selected.selectedIndex);
    const segments = buildMiniDistributionSegments(values, chartLocale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const activeSelectedIndex = onValuesChange
        ? selected.selectedIndex
        : localSelectedIndex;
    const normalizedSelectedIndex = Math.min(
        segments.length - 1,
        Math.max(0, activeSelectedIndex)
    );
    const selectedSegment = segments[normalizedSelectedIndex];
    const selectedShare =
        selectedSegment && total > 0
            ? Math.round((selectedSegment.value / total) * 100)
            : 0;
    const handleSegmentSelect = (_segment: MiniDistributionSegment, index: number) => {
        const nextIndex = Math.min(segments.length - 1, Math.max(0, index));

        if (onValuesChange) {
            onValuesChange([
                nextIndex,
                selected.values[0],
                selected.values[1],
                selected.values[2],
                selected.products,
                0,
            ]);
            return;
        }

        setLocalSelectedIndex(nextIndex);
    };

    useEffect(() => {
        setLocalSelectedIndex(selected.selectedIndex);
    }, [selected.selectedIndex]);

    return (
        <MiniDistributionBarCard
            className="w-full max-w-3xl"
            title={copy.productCategories}
            description={copy.miniDistribution}
            value={`${selectedShare}%`}
            delta="+3.2%"
            deltaDescription={
                chartLocale === "ja"
                    ? "選択したカテゴリの前期間との差分です。"
                    : "Change from the previous period for the selected category."
            }
            segments={segments}
            selectedIndex={normalizedSelectedIndex}
            onSegmentSelect={handleSegmentSelect}
            tickCount={32}
            totalLabel={copy.total}
            caption={
                chartLocale === "ja"
                    ? "カテゴリ構成をコンパクトなティックバーで確認します。"
                    : "Review category allocation with a compact tick distribution."
            }
        />
    );
}

export function SegmentTimelineCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const labels = getSegmentTimelineLabels(chartLocale);
    const selected = readSegmentTimelineSelection(values, chartLocale);
    const [localSelectedIndex, setLocalSelectedIndex] = useState(selected.selectedIndex);
    const segments = buildSegmentTimelineSegments(values, chartLocale);
    const activeSelectedIndex = onValuesChange
        ? selected.selectedIndex
        : localSelectedIndex;
    const normalizedSelectedIndex = Math.max(
        0,
        segments.findIndex((segment) => segment.label === labels[activeSelectedIndex])
    );
    const totalDuration = selected.durations.reduce((sum, duration) => sum + duration, 0);
    const awakeDuration = selected.durations[3] ?? 0;
    const asleepDuration = Math.max(totalDuration - awakeDuration, 0);
    const qualityDelta = selected.quality - 76;
    const metricDescriptions = getSegmentTimelineMetricDescriptions(chartLocale);
    const handleSegmentSelect = (_segment: SegmentTimelineSegment, index: number) => {
        const nextIndex = Math.max(
            0,
            labels.findIndex((label) => label === segments[index]?.label)
        );

        if (onValuesChange) {
            onValuesChange(
                segmentTimelineValuesFromSelection(
                    nextIndex,
                    selected.quality,
                    selected.intervals
                )
            );
            return;
        }

        setLocalSelectedIndex(nextIndex);
    };

    useEffect(() => {
        setLocalSelectedIndex(selected.selectedIndex);
    }, [selected.selectedIndex]);

    return (
        <SegmentTimelineCard
            className="w-full max-w-5xl"
            title={copy.sleepStages}
            description={copy.segmentTimeline}
            delta={formatPercentDelta(qualityDelta)}
            deltaDescription={
                chartLocale === "ja"
                    ? "基準品質 76% との差分です。"
                    : "Difference from the 76% quality baseline."
            }
            metrics={[
                {
                    label: copy.sleepQuality,
                    value: `${selected.quality}%`,
                    description: metricDescriptions.quality,
                },
                {
                    label: copy.timeAsleep,
                    value: formatDurationMinutes(asleepDuration, chartLocale),
                    description: metricDescriptions.asleep,
                },
                {
                    label: copy.awakeTime,
                    value: formatDurationMinutes(awakeDuration, chartLocale),
                    description: metricDescriptions.awake,
                },
            ]}
            segments={segments}
            selectedIndex={normalizedSelectedIndex}
            onSegmentSelect={handleSegmentSelect}
            min={0}
            max={Math.max(totalDuration, 1)}
            startLabel={chartLocale === "ja" ? "23:42" : "11:42 PM"}
            endLabel={chartLocale === "ja" ? "07:18" : "7:18 AM"}
            formatValue={(nextValue) => formatDurationMinutes(nextValue, chartLocale)}
            rangeLabel={copy.stageDuration}
            caption={
                chartLocale === "ja"
                    ? "睡眠、稼働状況、配送状態などの時間範囲をカテゴリごとに確認します。"
                    : "Review categorical time ranges for sleep, uptime, or delivery states."
            }
        />
    );
}

export function RetentionCohortCardDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const [localValues, setLocalValues] = useState(defaultRetentionCohortSelectionValues);
    const activeValues = onValuesChange ? values ?? defaultRetentionCohortSelectionValues : localValues;
    const selected = readRetentionCohortSelection(activeValues, chartLocale);
    const cohorts = buildRetentionCohorts(activeValues, chartLocale);
    const periods = getRetentionPeriodLabels(chartLocale);
    const selectedValue = cohorts[selected.cohortIndex].values[selected.periodIndex].value;
    const selectedLabel = getRetentionCohortLabels(chartLocale)[selected.cohortIndex];
    const firstPeriodValue = cohorts[selected.cohortIndex].values[0].value;
    const delta = selectedValue - firstPeriodValue;
    const updateSelection = (nextValues: number[]) => {
        if (onValuesChange) {
            onValuesChange(nextValues);
            return;
        }

        setLocalValues(nextValues);
    };

    return (
        <RetentionCohortCard
            className="w-full max-w-5xl"
            title={copy.cohortRetention}
            description={`${selectedLabel} / ${periods[selected.periodIndex]} ${copy.selected}`}
            value={formatPercentValue(selectedValue)}
            delta={formatPointDelta(delta)}
            deltaDescription={
                chartLocale === "ja"
                    ? "初月からの変化量です。"
                    : "Change from the first cohort period."
            }
            cohorts={cohorts}
            periods={periods}
            selectedCell={{
                cohortIndex: selected.cohortIndex,
                periodIndex: selected.periodIndex,
            }}
            onCellSelect={(cell, selection) =>
                updateSelection(
                    previewValuesFromRetentionCohort(
                        selection.cohortIndex,
                        selection.periodIndex,
                        cell.value
                    )
                )
            }
            caption={
                chartLocale === "ja"
                    ? "期間別の継続率をコホートごとに比較します。"
                    : "Compare period retention across cohorts."
            }
        />
    );
}

export function ChoroplethMapDemo({ values, onValuesChange, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const [localValues, setLocalValues] = useState(values ?? defaultChoroplethSelectionValues);
    const activeValues = onValuesChange ? values ?? defaultChoroplethSelectionValues : localValues;
    const selected = readChoroplethSelection(activeValues);
    const regions = buildTokyoChoroplethRegions(activeValues, chartLocale);
    const markers = getTokyoIncidentMarkers(chartLocale);
    const selectedLabel = getTokyoRegionLabel(selected.region, chartLocale);

    useEffect(() => {
        if (values) setLocalValues(values);
    }, [values]);

    const updateSelection = (nextValues: number[]) => {
        setLocalValues(nextValues);
        onValuesChange?.(nextValues);
    };

    const selectRegion = (region: ChoroplethRegion) => {
        const index = tokyoWardBoundaries.findIndex((item) => item.id === region.id);
        if (index === -1) return;
        updateSelection(previewValuesFromTokyoRegion(index, region.value));
    };

    const selectMarker = (marker: (typeof tokyoIncidentMarkers)[number]) => {
        const index = tokyoWardBoundaries.findIndex((item) => item.id === marker.regionId);
        if (index === -1) return;
        updateSelection(
            previewValuesFromTokyoRegion(
                index,
                marker.value ?? tokyoWardBoundaries[index].value
            )
        );
    };

    return (
        <AnalyticsCard
            className="w-full max-w-5xl border-0 bg-transparent shadow-none"
            title={copy.tokyoIncidents}
            description={`${selectedLabel} ${copy.selected}`}
            value={chartLocale === "ja" ? `${selected.value} ${copy.incidents}` : `${selected.value} ${copy.incidents}`}
        >
            <ChoroplethMap
                regions={regions}
                markers={markers}
                selectedId={selected.region.id}
                showRanking
                formatValue={(value) => `${value}`}
                selectedLabel={copy.selected}
                rankLabel={copy.rank}
                onRegionSelect={selectRegion}
                onMarkerSelect={selectMarker}
                aria-label={copy.tokyoIncidents}
            />
        </AnalyticsCard>
    );
}

export function QuadrantMatrixDemo({ values, onValuesChange, baseline, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const [localValues, setLocalValues] = useState(values ?? defaultQuadrantMatrixSelectionValues);
    const activeValues = onValuesChange ? values ?? defaultQuadrantMatrixSelectionValues : localValues;
    const selected = readQuadrantMatrixSelection(activeValues, chartLocale);
    const items = buildQuadrantMatrixItems(activeValues, chartLocale);
    const referenceBaseline = baseline ?? chartDeltaBaselines.referenceScore;
    const scoreDelta = selected.value - referenceBaseline;

    useEffect(() => {
        if (values) setLocalValues(values);
    }, [values]);

    const updateSelection = (nextValues: number[]) => {
        setLocalValues(nextValues);
        onValuesChange?.(nextValues);
    };

    const selectItem = (item: QuadrantMatrixItem) => {
        const index = getQuadrantMatrixBaseItems(chartLocale).findIndex(
            (baseItem) => baseItem.id === item.id
        );
        if (index === -1) return;
        updateSelection(previewValuesFromQuadrantMatrix(index, item.value));
    };

    return (
        <AnalyticsCard
            className="w-full max-w-5xl"
            title={copy.quadrantMatrix}
            description={`${selected.item.label} ${copy.selected}`}
            value={`${selected.value}% ${copy.score}`}
            delta={values ? formatPointDelta(scoreDelta) : "+7pt"}
            deltaDescription={getReferenceBaselineDeltaDescription(
                chartLocale,
                referenceBaseline
            )}
            trend={values ? trendFromDelta(scoreDelta) : "up"}
        >
            <QuadrantMatrix
                items={items}
                selectedId={selected.item.id}
                showRanking
                xAxisLabel={copy.reach}
                yAxisLabel={copy.impact}
                onItemSelect={selectItem}
                quadrantLabels={{
                    topLeft: copy.strategic,
                    topRight: copy.scale,
                    bottomLeft: copy.review,
                    bottomRight: copy.efficient,
                }}
                formatValue={(value) => `${value}%`}
                aria-label={copy.quadrantMatrix}
            />
        </AnalyticsCard>
    );
}

export function ChartLegendDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const segments = values
        ? buildDistributionSegments(normalizeDistributionPreviewValues(values), chartLocale)
        : getChannels(chartLocale);
    const items = buildLegendItemsFromSegments(segments, chartLocale);
    const total = segments.reduce((sum, item) => sum + item.value, 0);

    return (
        <AnalyticsCard
            className="w-full max-w-xl"
            title={copy.channelLegend}
            description={copy.seriesLabels}
            value={total.toLocaleString()}
            trend="flat"
        >
            <ChartLegend items={items} />
            <ChartLegend variant="vertical" items={items} />
        </AnalyticsCard>
    );
}

export function AnalyticsCardDemo({ values, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const chartValues = normalizeChartValues(values);
    const total = chartValues.reduce((sum, value) => sum + value, 0);
    const delta = chartValues[chartValues.length - 1] - chartValues[0];
    const segments = values ? buildDistributionSegments(chartValues, chartLocale) : getChannels(chartLocale);
    const channelShare = getSegmentShare(segments, 0);
    const previousChannelShare = getSegmentShare(getChannels(chartLocale), 0);
    const channelShareDelta = channelShare - previousChannelShare;

    return (
        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
            <AnalyticsCard
                title={copy.revenue}
                description={copy.lastTwelveMonths}
                value={values ? `$${(total * 120).toLocaleString()}` : "$128,430"}
                delta={values ? `${delta >= 0 ? "+" : ""}${delta}` : "+12.4%"}
                deltaDescription={values ? copy.changeFromFirstPoint : copy.changeFromPreviousPeriod}
                trend={delta > 0 ? "up" : delta < 0 ? "down" : "flat"}
            >
                <SparklineChart
                    data={buildSparklineData(values ? chartValues : trendData, chartLocale)}
                    variant="area"
                    color="primary"
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.channelMix}
                description={copy.currentAcquisitionShare}
                value={formatPercentValue(channelShare)}
                delta={formatPercentDelta(channelShareDelta)}
                deltaDescription={copy.previousShareComparison}
                trend={trendFromDelta(channelShareDelta)}
            >
                <DistributionBar segments={segments} totalLabel={copy.total} showLegend />
            </AnalyticsCard>
        </div>
    );
}

export function ChartComponentsDemo({ values, baseline, showReference = true, locale }: ChartDemoProps = {}) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const [selectedRegionId, setSelectedRegionId] = useState("shinjuku");
    const [selectedMatrixId, setSelectedMatrixId] = useState("activation");
    const [selectedSegmentedGaugeIndex, setSelectedSegmentedGaugeIndex] = useState(1);
    const [selectedMiniDistributionIndex, setSelectedMiniDistributionIndex] = useState(0);
    const [selectedSegmentTimelineIndex, setSelectedSegmentTimelineIndex] = useState(1);
    const [selectedConcentricProgressIndex, setSelectedConcentricProgressIndex] = useState(1);
    const chartValues = normalizeChartValues(values);
    const barData = buildBarData(chartValues, chartLocale);
    const lineSeries = buildDerivedLineChartSeries(chartValues, chartLocale);
    const ribbonLayers = buildDerivedRibbonLayers(chartValues, chartLocale);
    const radialBarData = buildDerivedRadialBarData(chartValues, chartLocale);
    const stackedGroups = buildStackedBarGroups(
        chartValues.slice(0, 4).flatMap((value, index) => [
            value,
            ...defaultStackedBarValues.slice(index * 4 + 1, index * 4 + 4),
        ]),
        chartLocale
    );
    const distributionSegments = buildDistributionSegments(chartValues, chartLocale);
    const radarData = buildRadarData(chartValues, chartLocale);
    const xLabels = getHeatmapXLabels(chartLocale);
    const total = chartValues.reduce((sum, value) => sum + value, 0);
    const avg = average(chartValues);
    const activitySelectionValues = [
        3,
        Math.min(200, avg * 2),
        Math.min(200, chartValues[0] * 2),
        Math.min(200, chartValues[1] * 3),
        Math.min(200, chartValues[2] * 2),
        0,
    ];
    const activitySelection = readActivityTimelineSelection(activitySelectionValues);
    const activitySlots = buildActivityTimelineSlots(activitySelectionValues, chartLocale);
    const activitySegments = buildActivitySegments(activitySelectionValues, chartLocale);
    const activitySelectedSegments = activitySlots[3]?.segments ?? activitySegments;
    const activityTotal = activitySelection.slots.reduce((sum, slot) => sum + slot.value, 0);
    const activityDailyAverage = Math.round(
        activityTotal / Math.max(activitySelection.slots.length, 1)
    );
    const activityDeltaPercent = Math.round(
        ((activitySelection.value - activityTimelineBaseValues[3]) /
            activityTimelineBaseValues[3]) *
            100
    );
    const activityMetricTooltips = getActivityTimelineMetricTooltips({
        locale: chartLocale,
        selectedLabel: getActivityTimelineLabels(chartLocale)[3],
        selectedValue: activitySelection.value,
        baselineValue: activityTimelineBaseValues[3],
        percentDelta: activityDeltaPercent,
        total: activityTotal,
        slotCount: activitySelection.slots.length,
        dailyAverage: activityDailyAverage,
    });
    const labeledDonutValues = [0, chartValues[0], chartValues[1], chartValues[2], 0, 0];
    const labeledDonutSegments = buildLabeledDonutSegments(labeledDonutValues, chartLocale);
    const labeledDonutTotal = labeledDonutSegments.reduce(
        (sum, segment) => sum + segment.value,
        0
    );
    const segmentedGaugeValues = [
        1,
        Math.max(12, Math.round(chartValues[0] * 0.72)),
        Math.max(12, Math.round(chartValues[1] * 0.78)),
        Math.max(12, Math.round(chartValues[2] * 0.58)),
        avg,
        Math.min(100, avg + 12),
    ];
    const segmentedGaugeSegments = buildSegmentedGaugeSegments(
        segmentedGaugeValues,
        chartLocale
    );
    const segmentedGaugeTotal = segmentedGaugeSegments.reduce(
        (sum, segment) => sum + segment.value,
        0
    );
    const segmentedGaugeSelection = readSegmentedGaugeSelection(
        segmentedGaugeValues,
        chartLocale
    );
    const activeSegmentedGaugeIndex = Math.min(
        segmentedGaugeSegments.length - 1,
        Math.max(0, selectedSegmentedGaugeIndex)
    );
    const miniDistributionValues = [0, chartValues[0], chartValues[1], chartValues[2], 45, 0];
    const miniDistributionSegments = buildMiniDistributionSegments(
        miniDistributionValues,
        chartLocale
    );
    const miniDistributionTotal = miniDistributionSegments.reduce(
        (sum, segment) => sum + segment.value,
        0
    );
    const activeMiniDistributionIndex = Math.min(
        miniDistributionSegments.length - 1,
        Math.max(0, selectedMiniDistributionIndex)
    );
    const concentricProgressValues = [
        1,
        Math.max(18, Math.round(chartValues[0] * 0.72)),
        Math.max(28, Math.round(chartValues[1] * 1.18)),
        Math.max(12, Math.round(chartValues[2] * 0.74)),
        Math.max(10, Math.round(chartValues[4] * 0.36)),
        256,
    ];
    const concentricProgressSelection = readConcentricProgressSelection(
        concentricProgressValues,
        chartLocale
    );
    const concentricProgressRings = buildConcentricProgressRings(
        concentricProgressValues,
        chartLocale
    );
    const concentricProgressUsed = concentricProgressRings.reduce(
        (sum, ring) => sum + ring.value,
        0
    );
    const activeConcentricProgressIndex = Math.min(
        concentricProgressRings.length - 1,
        Math.max(0, selectedConcentricProgressIndex)
    );
    const segmentTimelineValues = [
        1,
        Math.max(48, Math.round(chartValues[2] * 1.8)),
        Math.max(120, Math.round(chartValues[3] * 2.6)),
        Math.max(48, Math.round(chartValues[1] * 1.4)),
        Math.max(16, Math.round(chartValues[0] * 0.5)),
        avg,
    ];
    const segmentTimelineSelection = readSegmentTimelineSelection(
        segmentTimelineValues,
        chartLocale
    );
    const segmentTimelineSegments = buildSegmentTimelineSegments(
        segmentTimelineValues,
        chartLocale
    );
    const segmentTimelineTotal = segmentTimelineSelection.durations.reduce(
        (sum, duration) => sum + duration,
        0
    );
    const segmentTimelineMetricDescriptions =
        getSegmentTimelineMetricDescriptions(chartLocale);
    const segmentTimelineStageLabels = getSegmentTimelineLabels(chartLocale);
    const activeSegmentTimelineIndex = Math.max(
        0,
        segmentTimelineSegments.findIndex(
            (segment) =>
                segment.label === segmentTimelineStageLabels[selectedSegmentTimelineIndex]
        )
    );
    const retentionSelectionValues = [1, 3, avg, 0, 0, 0];
    const retentionCohorts = buildRetentionCohorts(retentionSelectionValues, chartLocale);
    const retentionPeriods = getRetentionPeriodLabels(chartLocale);
    const mapRegions = buildTokyoChoroplethRegions([defaultChoroplethSelectionValues[0], avg], chartLocale);
    const matrixItems = buildQuadrantMatrixItems([0, avg], chartLocale);
    const delta = chartValues[chartValues.length - 1] - chartValues[0];
    const trend = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
    const deltaLabel = `${delta >= 0 ? "+" : ""}${delta}`;
    const referenceBaseline = baseline ?? chartDeltaBaselines.referenceScore;
    const performanceDelta = avg - referenceBaseline;
    const maxHeatmapValue = Math.max(...buildHeatmapData(chartValues, chartLocale).map((cell) => cell.value));
    const heatmapDelta = maxHeatmapValue - avg;
    const maxMatrixValue = Math.max(...matrixItems.map((item) => item.value));
    const matrixDelta = maxMatrixValue - avg;
    const activeRegionId =
        mapRegions.find((region) => region.id === selectedRegionId)?.id ??
        mapRegions[0]?.id;
    const activeMatrixId =
        matrixItems.find((item) => item.id === selectedMatrixId)?.id ??
        matrixItems[0]?.id;

    return (
        <div className="grid w-full max-w-6xl gap-4 lg:grid-cols-3">
            <AnalyticsCard
                title={copy.monthlyRevenue}
                description={copy.comparedWithPreviousPeriod}
                value={`$${(total * 120).toLocaleString()}`}
                delta={deltaLabel}
                deltaDescription={copy.changeFromFirstPoint}
                trend={trend}
            >
                <SparklineChart
                    data={buildSparklineData(chartValues, chartLocale)}
                    variant="area"
                    referenceValue={showReference ? avg : undefined}
                    referenceLabel={copy.avg}
                    showDots
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.revenueTrend}
                description={copy.lineChart}
                value={`$${(total * 120).toLocaleString()}`}
                delta={deltaLabel}
                deltaDescription={copy.changeFromFirstPoint}
                trend={trend}
            >
                <LineChart
                    series={lineSeries}
                    variant="line"
                    referenceValue={showReference ? avg : undefined}
                    referenceLabel={copy.avg}
                    showLegend
                    showDots
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.sessions}
                description={copy.weekdayAverage}
                value={total.toLocaleString()}
                delta={`${avg} ${copy.avg}`}
                deltaDescription={copy.averageOfPreviewData}
                trend="flat"
            >
                <BarChart
                    data={barData}
                    averageValue={showReference ? avg : undefined}
                    averageLabel={copy.avg}
                    showValues
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.ribbonChart}
                description={copy.flowDistribution}
                value={ribbonLayers
                    .reduce(
                        (sum, layer) =>
                            sum +
                            layer.data.reduce<number>(
                                (layerSum, point) =>
                                    layerSum +
                                    (typeof point === "number" ? point : point.value),
                                0
                            ),
                        0
                    )
                    .toLocaleString()}
                trend="flat"
            >
                <RibbonChart
                    layers={ribbonLayers}
                    variant="flow"
                    totalLabel={copy.total}
                    showLegend
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.radialBarChart}
                description={copy.progressShare}
                value={`${average(radialBarData.map((item) => item.value))}% ${copy.avg}`}
                trend="flat"
            >
                <RadialBarChart
                    data={radialBarData}
                    centerValue={`${average(radialBarData.map((item) => item.value))}%`}
                    centerLabel={copy.avg}
                    formatValue={(value) => `${value}%`}
                    maxLabel={copy.max}
                    showLegend
                />
            </AnalyticsCard>
            <ConcentricProgressCard
                title={copy.storageOverview}
                description={copy.concentricProgress}
                value={`${concentricProgressUsed}GB`}
                centerLabel={copy.usedStorage}
                delta={`${Math.round((concentricProgressUsed / concentricProgressSelection.capacity) * 100)}%`}
                deltaDescription={
                    chartLocale === "ja"
                        ? "総容量に対する使用率です。"
                        : "Used share of total capacity."
                }
                rings={concentricProgressRings}
                selectedIndex={activeConcentricProgressIndex}
                onRingSelect={(_, index) => setSelectedConcentricProgressIndex(index)}
                max={concentricProgressSelection.capacity}
                formatValue={(nextValue) => `${nextValue}GB`}
                maxLabel={copy.totalCapacity}
            />
            <AnalyticsCard
                title={copy.channelMix}
                description={copy.stackedBarChart}
                value={`${stackedGroups.length} ${copy.groups}`}
                trend="flat"
            >
                <StackedBarChart
                    data={stackedGroups}
                    totalLabel={copy.total}
                    showLegend
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.acquisition}
                description={copy.channelDistribution}
                value={`4 ${copy.groups}`}
                trend="flat"
            >
                <DistributionBar
                    segments={distributionSegments}
                    totalLabel={copy.total}
                    showLegend
                />
            </AnalyticsCard>
            <MiniDistributionBarCard
                title={copy.productCategories}
                description={copy.miniDistribution}
                value={`${Math.round(((miniDistributionSegments[activeMiniDistributionIndex]?.value ?? 0) / Math.max(miniDistributionTotal, 1)) * 100)}%`}
                delta="+3.2%"
                deltaDescription={
                    chartLocale === "ja"
                        ? "選択したカテゴリの前期間との差分です。"
                        : "Change from the previous period for the selected category."
                }
                segments={miniDistributionSegments}
                selectedIndex={activeMiniDistributionIndex}
                onSegmentSelect={(_, index) => setSelectedMiniDistributionIndex(index)}
                tickCount={32}
                totalLabel={copy.total}
            />
            <AnalyticsCard
                title={copy.segmentMix}
                description={copy.donutChart}
                value={total.toLocaleString()}
                trend="flat"
            >
                <DonutChart
                    segments={distributionSegments}
                    centerValue={total.toLocaleString()}
                    centerLabel={copy.total}
                    totalLabel={copy.total}
                    showLegend
                />
            </AnalyticsCard>
            <LabeledDonutCard
                title={copy.salesByPlatform}
                description={copy.platformShare}
                centerValue={labeledDonutTotal.toLocaleString()}
                centerLabel={copy.total}
                delta={`${Math.round(((labeledDonutSegments[0]?.value ?? 0) / Math.max(labeledDonutTotal, 1)) * 100)}%`}
                deltaDescription={
                    chartLocale === "ja"
                        ? "選択したセグメントの構成比です。"
                        : "Share of the selected segment."
                }
                segments={labeledDonutSegments}
                selectedIndex={0}
                totalLabel={copy.total}
            />
            <AnalyticsCard
                title={copy.audienceShare}
                description={copy.pieChart}
                value={`${distributionSegments.length} ${copy.segments}`}
                trend="flat"
            >
                <PieChart
                    segments={distributionSegments}
                    totalLabel={copy.total}
                    showLegend
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.performanceScore}
                description={copy.gaugeChart}
                value={`${avg}%`}
                delta={formatPointDelta(performanceDelta)}
                deltaDescription={getReferenceBaselineDeltaDescription(
                    chartLocale,
                    referenceBaseline
                )}
                trend={trendFromDelta(performanceDelta)}
            >
                <GaugeChart
                    value={avg}
                    label={copy.score}
                    valueLabel={`${avg}%`}
                    formatValue={(nextValue) => `${nextValue}%`}
                    rangeLabel={copy.range}
                />
            </AnalyticsCard>
            <SegmentedGaugeCard
                title={copy.spendBreakdown}
                description={copy.segmentedGauge}
                value={segmentedGaugeSelection.value}
                valueLabel={`${segmentedGaugeSelection.value}%`}
                centerLabel={copy.currentSpend}
                delta={`${Math.round(((segmentedGaugeSegments[activeSegmentedGaugeIndex]?.value ?? 0) / Math.max(segmentedGaugeTotal, 1)) * 100)}%`}
                deltaDescription={
                    chartLocale === "ja"
                        ? "選択したセグメントの構成比です。"
                        : "Share of the selected segment."
                }
                segments={segmentedGaugeSegments}
                selectedIndex={activeSegmentedGaugeIndex}
                onSegmentSelect={(_, index) => setSelectedSegmentedGaugeIndex(index)}
                targetValue={segmentedGaugeSelection.target}
                targetLabel={copy.targetSpend}
                max={100}
                formatValue={(nextValue) => `${nextValue}%`}
                totalLabel={copy.total}
            />
            <AnalyticsCard
                title={copy.capabilityBalance}
                description={copy.radarChart}
                value={`${avg}% ${copy.avg}`}
                delta={formatPointDelta(performanceDelta)}
                deltaDescription={getReferenceBaselineDeltaDescription(
                    chartLocale,
                    referenceBaseline
                )}
                trend={trendFromDelta(performanceDelta)}
            >
                <RadarChart
                    data={radarData}
                    max={100}
                    color="primary"
                    formatValue={(value) => `${value}%`}
                    maxLabel={copy.max}
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.trafficDensity}
                description={copy.heatmapChart}
                value={`${maxHeatmapValue}% ${copy.peak}`}
                delta={formatPointDelta(heatmapDelta)}
                deltaDescription={copy.differenceBetweenPeakAndAverage}
                trend={trendFromDelta(heatmapDelta)}
            >
                <HeatmapChart
                    data={buildHeatmapData(chartValues, chartLocale)}
                    xLabels={xLabels}
                    yLabels={heatmapYLabels}
                    max={100}
                />
            </AnalyticsCard>
            <ActivityTimelineCard
                className="lg:col-span-2"
                title={copy.energyTimeline}
                description={copy.activityTimeline}
                delta={formatPercentDelta(activityDeltaPercent)}
                deltaDescription={
                    chartLocale === "ja"
                        ? "選択した時間帯の基準値との差分です。"
                        : "Change from the selected time slot baseline."
                }
                metrics={[
                    {
                        label: copy.thanYesterday,
                        value: formatPercentDelta(activityDeltaPercent),
                        tooltip: activityMetricTooltips.delta,
                    },
                    {
                        label: copy.burned,
                        value: `${activityTotal.toLocaleString()} kcal`,
                        tooltip: activityMetricTooltips.total,
                    },
                    {
                        label: copy.dailyAverage,
                        value: `${activityDailyAverage.toLocaleString()} kcal`,
                        tooltip: activityMetricTooltips.dailyAverage,
                    },
                ]}
                slots={activitySlots}
                segments={activitySelectedSegments}
                selectedSlot={3}
                max={200}
                totalLabel={copy.total}
                caption={
                    chartLocale === "ja"
                        ? "選択した時間帯の活動量と内訳を一枚のカードで確認します。"
                        : "Inspect the selected time slot load and segment contribution in one card."
                }
            />
            <SegmentTimelineCard
                className="lg:col-span-2"
                title={copy.sleepStages}
                description={copy.segmentTimeline}
                delta={formatPercentDelta(segmentTimelineSelection.quality - 76)}
                deltaDescription={
                    chartLocale === "ja"
                        ? "基準品質 76% との差分です。"
                        : "Difference from the 76% quality baseline."
                }
                metrics={[
                    {
                        label: copy.sleepQuality,
                        value: `${segmentTimelineSelection.quality}%`,
                        description: segmentTimelineMetricDescriptions.quality,
                    },
                    {
                        label: copy.timeAsleep,
                        value: formatDurationMinutes(
                            segmentTimelineTotal -
                                (segmentTimelineSelection.durations[3] ?? 0),
                            chartLocale
                        ),
                        description: segmentTimelineMetricDescriptions.asleep,
                    },
                    {
                        label: copy.awakeTime,
                        value: formatDurationMinutes(
                            segmentTimelineSelection.durations[3] ?? 0,
                            chartLocale
                        ),
                        description: segmentTimelineMetricDescriptions.awake,
                    },
                ]}
                segments={segmentTimelineSegments}
                selectedIndex={activeSegmentTimelineIndex}
                onSegmentSelect={(segment) => {
                    const nextIndex = segmentTimelineStageLabels.findIndex(
                        (label) => label === segment.label
                    );
                    setSelectedSegmentTimelineIndex(Math.max(0, nextIndex));
                }}
                min={0}
                max={Math.max(segmentTimelineTotal, 1)}
                startLabel={chartLocale === "ja" ? "23:42" : "11:42 PM"}
                endLabel={chartLocale === "ja" ? "07:18" : "7:18 AM"}
                formatValue={(nextValue) => formatDurationMinutes(nextValue, chartLocale)}
                rangeLabel={copy.stageDuration}
            />
            <RetentionCohortCard
                className="lg:col-span-2"
                title={copy.cohortRetention}
                description={copy.retentionCohort}
                value={formatPercentValue(avg)}
                delta={formatPointDelta(avg - retentionBaseValues[1][0])}
                deltaDescription={
                    chartLocale === "ja"
                        ? "初月からの変化量です。"
                        : "Change from the first cohort period."
                }
                cohorts={retentionCohorts}
                periods={retentionPeriods}
                selectedCell={{ cohortIndex: 1, periodIndex: 3 }}
                caption={
                    chartLocale === "ja"
                        ? "期間別の継続率をコホートごとに比較します。"
                        : "Compare period retention across cohorts."
                }
            />
            <AnalyticsCard
                title={copy.tokyoIncidents}
                description={copy.choroplethMap}
                value={`${Math.max(...mapRegions.map((region) => region.value))} ${copy.peak}`}
            >
                <ChoroplethMap
                    regions={mapRegions}
                    markers={getTokyoIncidentMarkers(chartLocale)}
                    selectedId={activeRegionId}
                    showRanking
                    formatValue={(value) => `${value}`}
                    selectedLabel={copy.selected}
                    rankLabel={copy.rank}
                    onRegionSelect={(_, id) => setSelectedRegionId(id)}
                    onMarkerSelect={(marker) => {
                        if (marker.regionId) setSelectedRegionId(marker.regionId);
                    }}
                    aria-label={copy.tokyoIncidents}
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.quadrantMatrix}
                description={copy.priorityRanking}
                value={`${maxMatrixValue}% ${copy.peak}`}
                delta={formatPointDelta(matrixDelta)}
                deltaDescription={copy.differenceBetweenTopRankAndAverage}
                trend={trendFromDelta(matrixDelta)}
            >
                <QuadrantMatrix
                    items={matrixItems}
                    selectedId={activeMatrixId}
                    showRanking
                    rankingPlacement="bottom"
                    xAxisLabel={copy.reach}
                    yAxisLabel={copy.impact}
                    onItemSelect={(item) => {
                        if (item.id) setSelectedMatrixId(item.id);
                    }}
                    formatValue={(value) => `${value}%`}
                    aria-label={copy.quadrantMatrix}
                />
            </AnalyticsCard>
            <AnalyticsCard
                title={copy.supportLoad}
                description={copy.ticketVolumeByPeriod}
                value={Math.max(...chartValues).toLocaleString()}
                delta={`${Math.min(...chartValues)} ${copy.min}`}
                deltaDescription={copy.minimumOfPreviewData}
                trend="flat"
            >
                <BarChart
                    data={barData}
                    variant="horizontal"
                    averageValue={showReference ? avg : undefined}
                    averageLabel={copy.avg}
                    showValues
                />
            </AnalyticsCard>
        </div>
    );
}

interface ChartDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale?: ChartDemoLocale;
    labels?: string[];
    showReferenceControl?: boolean;
    showReference?: boolean;
    onShowReferenceChange?: (showReference: boolean) => void;
    referenceToggleLabel?: string;
    baselineValue?: number;
    onBaselineChange?: (value: number) => void;
    baselineLabel?: string;
    baselineDefault?: number;
}

export function ChartDataControls({
    values,
    onValuesChange,
    locale,
    labels: labelsProp,
    showReferenceControl = false,
    showReference = true,
    onShowReferenceChange,
    referenceToggleLabel,
    baselineValue,
    onBaselineChange,
    baselineLabel,
    baselineDefault,
}: ChartDataControlsProps) {
    const chartLocale = useResolvedChartDemoLocale(locale);
    const copy = getChartDemoCopy(chartLocale);
    const labels = labelsProp ?? getChartDataLabels(chartLocale);
    const [scenarioIndex, setScenarioIndex] = useState(0);

    const updateValue = (index: number, nextValue: number) => {
        onValuesChange(
            normalizeChartValues(values).map((value, valueIndex) =>
                valueIndex === index ? clampChartValue(nextValue) : value
            )
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % scenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(scenarioValues[nextIndex]);
    };
    const hasBaselineControl =
        baselineValue !== undefined &&
        onBaselineChange !== undefined &&
        baselineLabel !== undefined;
    const hasReferenceToggle =
        showReferenceControl && onShowReferenceChange !== undefined;
    const referenceToggleId = "chart-data-reference-toggle";

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{copy.data}</h3>
                    <div className="flex flex-wrap justify-end gap-2">
                        {hasReferenceToggle ? (
                            <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
                                <Switch
                                    id={referenceToggleId}
                                    checked={showReference}
                                    onCheckedChange={onShowReferenceChange}
                                />
                                <FormLabel
                                    htmlFor={referenceToggleId}
                                    className="text-xs font-medium"
                                >
                                    {referenceToggleLabel ?? copy.referenceLine}
                                </FormLabel>
                            </div>
                        ) : null}
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onValuesChange(defaultChartDataValues);
                                if (
                                    baselineDefault !== undefined &&
                                    onBaselineChange !== undefined
                                ) {
                                    onBaselineChange(baselineDefault);
                                }
                            }}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div
                    className={`grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 ${
                        hasBaselineControl ? "lg:grid-cols-7" : "lg:grid-cols-6"
                    }`}
                >
                    {normalizeChartValues(values).map((value, index) => {
                        const inputId = `chart-data-${index}`;
                        return (
                            <FormGroup key={labels[index]} className="min-w-0 gap-1">
                                <FormLabel htmlFor={inputId} className="text-xs">
                                    {labels[index]}
                                </FormLabel>
                                <NumberInput
                                    id={inputId}
                                    min={0}
                                    max={100}
                                    value={value}
                                    onValueChange={(nextValue) => updateValue(index, nextValue)}
                                />
                            </FormGroup>
                        );
                    })}
                    {hasBaselineControl ? (
                        <FormGroup className="min-w-0 gap-1">
                            <FormLabel htmlFor="chart-data-baseline" className="text-xs">
                                {baselineLabel}
                            </FormLabel>
                            <NumberInput
                                id="chart-data-baseline"
                                min={0}
                                max={100}
                                value={baselineValue}
                                onValueChange={(nextValue) =>
                                    onBaselineChange(clampChartValue(nextValue))
                                }
                            />
                        </FormGroup>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
