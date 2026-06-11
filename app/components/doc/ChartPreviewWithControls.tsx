"use client";

import { useMemo, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    FormGroup,
    FormLabel,
    NumberInput,
    Select,
    Switch,
} from "@gunjo/ui";

import { ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    ActivityTimelineCardDemo,
    AnalyticsCardDemo,
    BarChartDemo,
    type ChartDemoLocale,
    ChartComponentsDemo,
    ChartDataControls,
    chartDeltaBaselines,
    ChartLegendDemo,
    ConcentricProgressCardDemo,
    ChoroplethMapDemo,
    defaultConcentricProgressSelectionValues,
    defaultChoroplethSelectionValues,
    defaultActivityTimelineSelectionValues,
    defaultChartDataValues,
    defaultHeatmapSelectionValues,
    defaultLabeledDonutSelectionValues,
    defaultLineChartValues,
    defaultMiniDistributionSelectionValues,
    defaultRadialBarValues,
    defaultRetentionCohortSelectionValues,
    defaultRibbonChartValues,
    defaultSegmentTimelineSelectionValues,
    defaultSegmentedGaugeSelectionValues,
    defaultStackedBarValues,
    DonutChartDemo,
    DistributionBarDemo,
    encodeChartValues,
    GaugeChartDemo,
    getActivitySegmentLabels,
    getActivityTimelineLabels,
    getConcentricProgressLabels,
    getDistributionLabels,
    getChartDataLabels,
    getHeatmapXLabels,
    getLabeledDonutLabels,
    getMiniDistributionLabels,
    getQuadrantMatrixLabels,
    getRadialBarLabels,
    getRadarLabels,
    getRetentionCohortLabels,
    getRetentionPeriodLabels,
    getRibbonLayerLabels,
    getSegmentTimelineLabels,
    getSegmentedGaugeLabels,
    getStackedBarLabels,
    getStackedSegmentLabels,
    getTokyoChoroplethLabels,
    HeatmapChartDemo,
    LabeledDonutCardDemo,
    MiniDistributionBarCardDemo,
    SegmentedGaugeCardDemo,
    heatmapXLabels,
    heatmapYLabels,
    LineChartDemo,
    PieChartDemo,
    defaultQuadrantMatrixSelectionValues,
    quadrantMatrixLabels,
    QuadrantMatrixDemo,
    RadialBarChartDemo,
    RadarChartDemo,
    RetentionCohortCardDemo,
    RibbonChartDemo,
    SegmentTimelineCardDemo,
    SparklineChartDemo,
    StackedBarChartDemo,
    tokyoChoroplethLabels,
} from "@/components/demos/ChartComponentsDemo";

type ChartPreviewDemo =
    | "activity-timeline-card"
    | "analytics-card"
    | "bar-chart"
    | "chart-legend"
    | "choropleth-map"
    | "charts"
    | "concentric-progress-card"
    | "donut-chart"
    | "distribution-bar"
    | "gauge-chart"
    | "heatmap-chart"
    | "labeled-donut-card"
    | "line-chart"
    | "mini-distribution-bar-card"
    | "pie-chart"
    | "quadrant-matrix"
    | "radial-bar-chart"
    | "radar-chart"
    | "retention-cohort-card"
    | "ribbon-chart"
    | "segment-timeline-card"
    | "segmented-gauge-card"
    | "sparkline-chart"
    | "stacked-bar-chart";

interface ChartPreviewWithControlsProps {
    code: string;
    demo: ChartPreviewDemo;
    embedBase: string;
    previewHeight: number;
}

const demoComponents = {
    "activity-timeline-card": ActivityTimelineCardDemo,
    "analytics-card": AnalyticsCardDemo,
    "bar-chart": BarChartDemo,
    "chart-legend": ChartLegendDemo,
    "choropleth-map": ChoroplethMapDemo,
    "concentric-progress-card": ConcentricProgressCardDemo,
    charts: ChartComponentsDemo,
    "donut-chart": DonutChartDemo,
    "distribution-bar": DistributionBarDemo,
    "gauge-chart": GaugeChartDemo,
    "heatmap-chart": HeatmapChartDemo,
    "labeled-donut-card": LabeledDonutCardDemo,
    "line-chart": LineChartDemo,
    "mini-distribution-bar-card": MiniDistributionBarCardDemo,
    "pie-chart": PieChartDemo,
    "quadrant-matrix": QuadrantMatrixDemo,
    "radial-bar-chart": RadialBarChartDemo,
    "radar-chart": RadarChartDemo,
    "retention-cohort-card": RetentionCohortCardDemo,
    "ribbon-chart": RibbonChartDemo,
    "segment-timeline-card": SegmentTimelineCardDemo,
    "segmented-gauge-card": SegmentedGaugeCardDemo,
    "sparkline-chart": SparklineChartDemo,
    "stacked-bar-chart": StackedBarChartDemo,
};

type ChartPreviewBodyWidth = "md" | "lg" | "xl" | "2xl" | "full";

const chartPreviewBodyWidths: Record<ChartPreviewDemo, ChartPreviewBodyWidth> = {
    "activity-timeline-card": "lg",
    "analytics-card": "xl",
    "bar-chart": "xl",
    "chart-legend": "md",
    "choropleth-map": "2xl",
    charts: "2xl",
    "concentric-progress-card": "lg",
    "donut-chart": "md",
    "distribution-bar": "md",
    "gauge-chart": "md",
    "heatmap-chart": "lg",
    "labeled-donut-card": "lg",
    "line-chart": "full",
    "mini-distribution-bar-card": "lg",
    "pie-chart": "md",
    "quadrant-matrix": "xl",
    "radial-bar-chart": "md",
    "radar-chart": "md",
    "retention-cohort-card": "xl",
    "ribbon-chart": "xl",
    "segment-timeline-card": "xl",
    "segmented-gauge-card": "lg",
    "sparkline-chart": "md",
    "stacked-bar-chart": "xl",
};

const defaultGaugeValue = 82;
const activityTimelineDemoIds = new Set<ChartPreviewDemo>(["activity-timeline-card"]);
const activityTimelineSlotFieldCount = 4;

function getActivityTimelineValueOffset(slotIndex: number) {
    return 1 + slotIndex * activityTimelineSlotFieldCount;
}

function clampActivityTimelineSlotIndex(slotIndex: number) {
    return Math.min(
        getActivityTimelineLabels().length - 1,
        Math.max(0, Math.round(slotIndex))
    );
}

function createActivityTimelineScenario(
    slotIndex: number,
    slotValues: [number, number, number, number]
) {
    const normalizedSlotIndex = clampActivityTimelineSlotIndex(slotIndex);
    const nextValues = [...defaultActivityTimelineSelectionValues];
    const offset = getActivityTimelineValueOffset(normalizedSlotIndex);

    nextValues[0] = normalizedSlotIndex;
    nextValues[offset] = clampTimelineValue(slotValues[0]);
    nextValues[offset + 1] = clampTimelineValue(slotValues[1]);
    nextValues[offset + 2] = clampTimelineValue(slotValues[2]);
    nextValues[offset + 3] = clampTimelineValue(slotValues[3]);

    return nextValues;
}

const activityTimelineScenarioValues = [
    createActivityTimelineScenario(2, [118, 28, 52, 38]),
    createActivityTimelineScenario(4, [172, 42, 78, 52]),
    createActivityTimelineScenario(1, [78, 16, 36, 26]),
];
const labeledDonutDemoIds = new Set<ChartPreviewDemo>(["labeled-donut-card"]);
const labeledDonutScenarioValues = [
    [0, 58, 32, 18, 0, 0],
    [1, 36, 54, 22, 0, 0],
    [2, 42, 28, 46, 0, 0],
];
const segmentedGaugeDemoIds = new Set<ChartPreviewDemo>(["segmented-gauge-card"]);
const segmentedGaugeScenarioValues = [
    [0, 28, 46, 26, 74, 88],
    [1, 42, 34, 24, 86, 92],
    [2, 24, 28, 48, 64, 78],
];
const miniDistributionDemoIds = new Set<ChartPreviewDemo>(["mini-distribution-bar-card"]);
const miniDistributionScenarioValues = [
    [0, 58, 26, 16, 45, 0],
    [1, 34, 48, 18, 62, 0],
    [2, 24, 32, 44, 38, 0],
];
const segmentTimelineDemoIds = new Set<ChartPreviewDemo>(["segment-timeline-card"]);
const segmentTimelineScenarioValues = [
    [1, 112, 248, 86, 28, 83],
    [2, 84, 214, 122, 42, 76],
    [0, 146, 196, 64, 18, 91],
];
const distributionDemoIds = new Set<ChartPreviewDemo>([
    "chart-legend",
    "distribution-bar",
    "donut-chart",
    "pie-chart",
]);
const distributionLabels = ["Core", "Growth", "Retention", "Expansion"] as const;
const defaultDistributionValues = [100, 104, 51, 74];
const distributionScenarioValues = [
    [86, 124, 62, 38],
    [142, 74, 48, 65],
    [68, 92, 120, 43],
];
const radialBarDemoIds = new Set<ChartPreviewDemo>(["radial-bar-chart"]);
const concentricProgressDemoIds = new Set<ChartPreviewDemo>(["concentric-progress-card"]);
const referenceToggleDemoIds = new Set<ChartPreviewDemo>([
    "bar-chart",
    "charts",
    "line-chart",
    "sparkline-chart",
]);
const radialBarScenarioValues = [
    [92, 70, 48],
    [64, 78, 55],
    [42, 58, 86],
];
const concentricProgressScenarioValues = [
    [1, 42, 68, 27, 18, 256],
    [2, 64, 92, 34, 28, 512],
    [0, 28, 54, 18, 22, 128],
];
const lineChartDemoIds = new Set<ChartPreviewDemo>(["line-chart"]);
const lineChartScenarioValues = [
    [
        38, 46, 52, 61, 72, 84,
        44, 54, 58, 66, 76, 90,
    ],
    [
        74, 63, 58, 49, 41, 34,
        70, 66, 61, 55, 48, 42,
    ],
    [
        34, 72, 28, 81, 44, 67,
        48, 68, 52, 74, 58, 76,
    ],
];
const ribbonChartDemoIds = new Set<ChartPreviewDemo>(["ribbon-chart"]);
const ribbonChartScenarioValues = [
    [
        18, 26, 34, 46, 58, 72,
        14, 20, 28, 36, 44, 54,
        6, 12, 18, 28, 36, 44,
    ],
    [
        58, 52, 46, 38, 30, 24,
        42, 38, 32, 28, 24, 20,
        30, 26, 22, 18, 14, 10,
    ],
    [
        22, 34, 26, 48, 38, 64,
        18, 28, 36, 30, 46, 40,
        12, 20, 16, 34, 28, 52,
    ],
];
const stackedBarDemoIds = new Set<ChartPreviewDemo>(["stacked-bar-chart"]);
const stackedBarScenarioValues = [
    [
        96, 54, 28, 18,
        118, 44, 38, 18,
        74, 36, 42, 22,
        132, 58, 24, 18,
    ],
    [
        144, 36, 44, 20,
        92, 50, 30, 20,
        108, 42, 28, 30,
        68, 34, 46, 20,
    ],
    [
        72, 42, 24, 34,
        84, 48, 32, 20,
        126, 34, 36, 30,
        154, 62, 22, 16,
    ],
];
const heatmapDemoIds = new Set<ChartPreviewDemo>(["heatmap-chart"]);
const heatmapScenarioValues = [
    [4, 4, 91, 0, 0, 0],
    [1, 2, 66, 0, 0, 0],
    [6, 0, 44, 0, 0, 0],
];
const retentionCohortDemoIds = new Set<ChartPreviewDemo>(["retention-cohort-card"]);
const retentionCohortScenarioValues = [
    [0, 4, 51, 0, 0, 0],
    [2, 2, 58, 0, 0, 0],
    [4, 1, 72, 0, 0, 0],
];
const choroplethDemoIds = new Set<ChartPreviewDemo>(["choropleth-map"]);
const choroplethScenarioValues = [
    [1, 86, 0, 0, 0, 0],
    [3, 78, 0, 0, 0, 0],
    [5, 64, 0, 0, 0, 0],
];
const quadrantMatrixDemoIds = new Set<ChartPreviewDemo>(["quadrant-matrix"]);
const quadrantMatrixScenarioValues = [
    [1, 84, 0, 0, 0, 0],
    [3, 72, 0, 0, 0, 0],
    [5, 58, 0, 0, 0, 0],
];

type BaselineKind = keyof typeof chartDeltaBaselines;

function getBaselineKind(demo: ChartPreviewDemo): BaselineKind | null {
    if (demo === "gauge-chart") return "previousGaugeScore";
    if (
        demo === "charts" ||
        demo === "heatmap-chart" ||
        demo === "quadrant-matrix" ||
        demo === "radar-chart"
    ) {
        return "referenceScore";
    }
    return null;
}

const controlCopy = {
    en: {
        data: "Data",
        editing: "Target",
        score: "Score",
        day: "Day",
        time: "Time",
        density: "Density",
        ward: "Ward",
        incidents: "Incidents",
        item: "Item",
        cohort: "Cohort",
        retention: "Retention",
        baseline: "Baseline",
        previousScore: "Previous score",
        month: "Month",
        period: "Period",
        activity: "Activity",
        walking: "Walking",
        running: "Running",
        workout: "Workout",
        series: "Series",
        stage: "Stage",
        interval: "Interval",
        intervals: "Intervals",
        intervalSettings: "Interval settings",
        intervalSettingsDescription: "Edit each timeline interval by stage and duration.",
        intervalCount: "Intervals",
        minutes: "min",
        addInterval: "Add interval",
        remove: "Remove",
        duration: "Duration",
        quality: "Quality",
        capacity: "Capacity",
        value: "Value",
        actual: "Actual",
        targetValue: "Target",
        ratio: "Ratio",
        totalValue: "Total",
        scenario: "Scenario",
        reset: "Reset",
        averageLine: "Average line",
        referenceLine: "Reference line",
    },
    ja: {
        data: "データ",
        editing: "対象",
        score: "スコア",
        day: "曜日",
        time: "時間帯",
        density: "密度",
        ward: "区",
        incidents: "件数",
        item: "項目",
        cohort: "コホート",
        retention: "継続率",
        baseline: "基準値",
        previousScore: "前回スコア",
        month: "月",
        period: "期間",
        activity: "活動量",
        walking: "ウォーク",
        running: "ラン",
        workout: "ワークアウト",
        series: "系列",
        stage: "ステージ",
        interval: "区間",
        intervals: "区間",
        intervalSettings: "区間設定",
        intervalSettingsDescription: "タイムラインの各区間をステージと時間で編集します。",
        intervalCount: "区間数",
        minutes: "分",
        addInterval: "区間を追加",
        remove: "削除",
        duration: "時間",
        quality: "品質",
        capacity: "容量",
        value: "値",
        actual: "実績",
        targetValue: "目標",
        ratio: "比率",
        totalValue: "総数",
        scenario: "シナリオ",
        reset: "リセット",
        averageLine: "平均線",
        referenceLine: "基準線",
    },
} as const;

function toChartDemoLocale(locale: string): ChartDemoLocale {
    return locale === "en" ? "en" : "ja";
}

function clampGaugeValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, Math.round(value)));
}

function clampTimelineValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(200, Math.max(0, Math.round(value)));
}

function clampDurationValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(480, Math.max(0, Math.round(value)));
}

function clampStorageValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1024, Math.max(0, Math.round(value)));
}

function getBaselineLabel(locale: ChartDemoLocale, kind: BaselineKind) {
    const copy = controlCopy[locale];
    return kind === "previousGaugeScore" ? copy.previousScore : copy.baseline;
}

function activityTimelineValuesFromPreview(values: number[]) {
    const normalized = [...defaultActivityTimelineSelectionValues];
    const source = values.length > 0 ? values : defaultActivityTimelineSelectionValues;
    const slotIndex = clampActivityTimelineSlotIndex(
        source[0] ?? defaultActivityTimelineSelectionValues[0]
    );

    normalized[0] = slotIndex;

    if (source.length <= 6) {
        const offset = getActivityTimelineValueOffset(slotIndex);
        normalized[offset] = clampTimelineValue(source[1] ?? normalized[offset]);
        normalized[offset + 1] = clampTimelineValue(source[2] ?? normalized[offset + 1]);
        normalized[offset + 2] = clampTimelineValue(source[3] ?? normalized[offset + 2]);
        normalized[offset + 3] = clampTimelineValue(source[4] ?? normalized[offset + 3]);

        return normalized;
    }

    for (let index = 1; index < normalized.length; index += 1) {
        normalized[index] = clampTimelineValue(source[index] ?? normalized[index]);
    }

    return normalized;
}

function previewValuesFromActivityTimeline(
    values: number[],
    slotIndex: number,
    activity: number,
    walking: number,
    running: number,
    workout: number
) {
    const normalized = activityTimelineValuesFromPreview(values);
    const normalizedSlotIndex = clampActivityTimelineSlotIndex(slotIndex);
    const offset = getActivityTimelineValueOffset(normalizedSlotIndex);

    normalized[0] = normalizedSlotIndex;
    normalized[offset] = clampTimelineValue(activity);
    normalized[offset + 1] = clampTimelineValue(walking);
    normalized[offset + 2] = clampTimelineValue(running);
    normalized[offset + 3] = clampTimelineValue(workout);

    return normalized;
}

function labeledDonutValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultLabeledDonutSelectionValues.length) {
        normalized.push(defaultLabeledDonutSelectionValues[normalized.length]);
    }

    return [
        Math.min(
            getLabeledDonutLabels().length - 1,
            Math.max(0, Math.round(normalized[0]))
        ),
        clampDistributionValue(normalized[1]),
        clampDistributionValue(normalized[2]),
        clampDistributionValue(normalized[3]),
        0,
        0,
    ];
}

function previewValuesFromLabeledDonut(
    segmentIndex: number,
    firstValue: number,
    secondValue: number,
    thirdValue: number
) {
    return [
        Math.min(
            getLabeledDonutLabels().length - 1,
            Math.max(0, Math.round(segmentIndex))
        ),
        clampDistributionValue(firstValue),
        clampDistributionValue(secondValue),
        clampDistributionValue(thirdValue),
        0,
        0,
    ];
}

function segmentedGaugeValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultSegmentedGaugeSelectionValues.length) {
        normalized.push(defaultSegmentedGaugeSelectionValues[normalized.length]);
    }

    return [
        Math.min(
            getSegmentedGaugeLabels().length - 1,
            Math.max(0, Math.round(normalized[0]))
        ),
        clampGaugeValue(normalized[1]),
        clampGaugeValue(normalized[2]),
        clampGaugeValue(normalized[3]),
        clampGaugeValue(normalized[4]),
        clampGaugeValue(normalized[5]),
    ];
}

function previewValuesFromSegmentedGauge(
    segmentIndex: number,
    firstValue: number,
    secondValue: number,
    thirdValue: number,
    currentValue: number,
    targetValue: number
) {
    return [
        Math.min(
            getSegmentedGaugeLabels().length - 1,
            Math.max(0, Math.round(segmentIndex))
        ),
        clampGaugeValue(firstValue),
        clampGaugeValue(secondValue),
        clampGaugeValue(thirdValue),
        clampGaugeValue(currentValue),
        clampGaugeValue(targetValue),
    ];
}

function miniDistributionValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultMiniDistributionSelectionValues.length) {
        normalized.push(defaultMiniDistributionSelectionValues[normalized.length]);
    }

    return [
        Math.min(
            getMiniDistributionLabels().length - 1,
            Math.max(0, Math.round(normalized[0]))
        ),
        clampGaugeValue(normalized[1]),
        clampGaugeValue(normalized[2]),
        clampGaugeValue(normalized[3]),
        clampDistributionValue(normalized[4]),
        0,
    ];
}

function previewValuesFromMiniDistribution(
    segmentIndex: number,
    firstValue: number,
    secondValue: number,
    thirdValue: number,
    products: number
) {
    return [
        Math.min(
            getMiniDistributionLabels().length - 1,
            Math.max(0, Math.round(segmentIndex))
        ),
        clampGaugeValue(firstValue),
        clampGaugeValue(secondValue),
        clampGaugeValue(thirdValue),
        clampDistributionValue(products),
        0,
    ];
}

function concentricProgressValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultConcentricProgressSelectionValues.length) {
        normalized.push(defaultConcentricProgressSelectionValues[normalized.length]);
    }

    return [
        Math.min(
            getConcentricProgressLabels().length - 1,
            Math.max(0, Math.round(normalized[0]))
        ),
        clampStorageValue(normalized[1]),
        clampStorageValue(normalized[2]),
        clampStorageValue(normalized[3]),
        clampStorageValue(normalized[4]),
        Math.max(1, clampStorageValue(normalized[5])),
    ];
}

function previewValuesFromConcentricProgress(
    ringIndex: number,
    firstValue: number,
    secondValue: number,
    thirdValue: number,
    fourthValue: number,
    capacity: number
) {
    return [
        Math.min(
            getConcentricProgressLabels().length - 1,
            Math.max(0, Math.round(ringIndex))
        ),
        clampStorageValue(firstValue),
        clampStorageValue(secondValue),
        clampStorageValue(thirdValue),
        clampStorageValue(fourthValue),
        Math.max(1, clampStorageValue(capacity)),
    ];
}

interface SegmentTimelineControlInterval {
    stageIndex: number;
    duration: number;
}

const segmentTimelineLegacyStageOrder = [
    1, 0, 1, 2, 1, 3, 1, 0,
    1, 2, 1, 0, 1, 2, 3, 1,
] as const;

function splitSegmentTimelineControlDurations(durations: number[]) {
    const remainingDurations = [...durations];
    const remainingSlots = durations.map((_, stageIndex) =>
        segmentTimelineLegacyStageOrder.filter((nextStageIndex) => nextStageIndex === stageIndex).length
    );
    const intervals: SegmentTimelineControlInterval[] = [];

    segmentTimelineLegacyStageOrder.forEach((stageIndex) => {
        const remainingDuration = remainingDurations[stageIndex] ?? 0;
        if (remainingDuration <= 0) return;

        const slotCount = Math.max(remainingSlots[stageIndex] ?? 1, 1);
        const duration = Math.min(
            remainingDuration,
            Math.max(1, Math.round(remainingDuration / slotCount))
        );

        intervals.push({ stageIndex, duration });
        remainingDurations[stageIndex] = remainingDuration - duration;
        remainingSlots[stageIndex] = slotCount - 1;
    });

    remainingDurations.forEach((duration, stageIndex) => {
        if (duration > 0) {
            intervals.push({ stageIndex, duration });
        }
    });

    return intervals;
}

function segmentTimelineIntervalsFromPreviewValues(
    values: number[],
    labelCount: number
) {
    const intervals: SegmentTimelineControlInterval[] = [];

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

    return splitSegmentTimelineControlDurations([112, 248, 86, 28]);
}

function segmentTimelineTotalsFromIntervals(
    intervals: SegmentTimelineControlInterval[],
    labelCount: number
) {
    const totals = Array.from({ length: labelCount }, () => 0);

    intervals.forEach((interval) => {
        totals[interval.stageIndex] =
            (totals[interval.stageIndex] ?? 0) + interval.duration;
    });

    return totals;
}

function segmentTimelineValuesFromPreview(values: number[]) {
    const normalized = [...values];
    const labels = getSegmentTimelineLabels();
    const hasIntervals = normalized.length > 6;
    const legacyDurations = [112, 248, 86, 28];
    const intervals = hasIntervals
        ? segmentTimelineIntervalsFromPreviewValues(normalized, labels.length)
        : splitSegmentTimelineControlDurations(
              labels.map((_, index) =>
                  clampDurationValue(normalized[index + 1] ?? legacyDurations[index])
              )
    );

    return {
        selectedIndex: Math.min(
            labels.length - 1,
            Math.max(0, Math.round(normalized[0] ?? defaultSegmentTimelineSelectionValues[0]))
        ),
        intervals,
        totals: segmentTimelineTotalsFromIntervals(intervals, labels.length),
        quality: clampGaugeValue(
            normalized[hasIntervals ? 1 : 5] ??
                defaultSegmentTimelineSelectionValues[1]
        ),
    };
}

function previewValuesFromSegmentTimeline(
    segmentIndex: number,
    intervals: SegmentTimelineControlInterval[],
    quality: number
) {
    return [
        Math.min(
            getSegmentTimelineLabels().length - 1,
            Math.max(0, Math.round(segmentIndex))
        ),
        clampGaugeValue(quality),
        ...intervals.flatMap((interval) => [
            Math.min(
                getSegmentTimelineLabels().length - 1,
                Math.max(0, Math.round(interval.stageIndex))
            ),
            clampDurationValue(interval.duration),
        ]),
    ];
}

function codeString(value: string) {
    return JSON.stringify(value);
}

function codeLiteral(value: unknown) {
    return JSON.stringify(value, null, 4);
}

function codeConst(name: string, value: unknown) {
    return `const ${name} = ${codeLiteral(value)};`;
}

function formatPercentDeltaCode(delta: number) {
    const rounded = Math.round(delta * 10) / 10;
    return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function formatPointDeltaCode(delta: number) {
    const rounded = Math.round(delta);
    return `${rounded > 0 ? "+" : ""}${rounded}pt`;
}

function averageCode(values: number[]) {
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function trendFromDeltaCode(delta: number) {
    return delta > 0 ? "up" : delta < 0 ? "down" : "flat";
}

function getChartCopy(locale: ChartDemoLocale) {
    return locale === "ja"
        ? {
              acquisition: "獲得",
              actualVsTarget: "実績と目標",
              activityTimeline: "活動タイムライン",
              audienceShare: "オーディエンス比率",
              averageSessionsByDay: "曜日別の平均セッション",
              avg: "平均",
              burned: "消費",
              capabilityBalance: "能力バランス",
              categorySplit: "カテゴリ内訳",
              channelDistribution: "チャネル分布",
              channelLegend: "チャネル凡例",
              channelMix: "チャネル構成",
              cohortRetention: "コホート継続率",
              comparedWithPreviousPeriod: "前期間との比較",
              currentAcquisitionShare: "現在の獲得比率",
              dailyAverage: "日平均",
              energyTimeline: "活動量タイムライン",
              lineChart: "折れ線チャート",
              miniDistribution: "ミニ分布",
              monthlyRevenue: "月次売上",
              productCategories: "商品カテゴリ",
              quadrantMatrix: "4象限マトリクス",
              radarChart: "レーダーチャート",
              radialBarChart: "ラジアルバーチャート",
              retentionCohort: "継続率コホート",
              revenue: "売上",
              revenueTrend: "売上トレンド",
              ribbonChart: "リボンチャート",
              score: "スコア",
              segmentMix: "セグメント構成",
              seriesLabels: "系列ラベルと現在比率",
              sessions: "セッション",
              shareByChannel: "チャネル別シェア",
              sleepStages: "睡眠ステージ",
              sparklineDescription: "編集したデータ",
              stackedBarChart: "積み上げ棒チャート",
              storageOverview: "ストレージ概要",
              target: "目標",
              ticketLoad: "チケット負荷",
              tokyoIncidents: "東京都インシデント",
              total: "合計",
              totalCapacity: "総容量",
              trafficDensity: "混雑度",
              usedStorage: "使用済み容量",
              weeklyActivity: "週次アクティビティ",
          }
        : {
              acquisition: "Acquisition",
              actualVsTarget: "Actual vs target",
              activityTimeline: "Activity timeline",
              audienceShare: "Audience share",
              averageSessionsByDay: "Average sessions by day",
              avg: "avg",
              burned: "Burned",
              capabilityBalance: "Capability balance",
              categorySplit: "Category split",
              channelDistribution: "Channel distribution",
              channelLegend: "Channel legend",
              channelMix: "Channel mix",
              cohortRetention: "Cohort retention",
              comparedWithPreviousPeriod: "Compared with previous period",
              currentAcquisitionShare: "Current acquisition share",
              dailyAverage: "Daily avg",
              energyTimeline: "Energy timeline",
              lineChart: "Line chart",
              miniDistribution: "Mini distribution",
              monthlyRevenue: "Monthly revenue",
              productCategories: "Product categories",
              quadrantMatrix: "Quadrant matrix",
              radarChart: "Radar chart",
              radialBarChart: "Radial bar chart",
              retentionCohort: "Retention cohort",
              revenue: "Revenue",
              revenueTrend: "Revenue trend",
              ribbonChart: "Ribbon chart",
              score: "Score",
              segmentMix: "Segment mix",
              seriesLabels: "Series labels and current share",
              sessions: "Sessions",
              shareByChannel: "Share by channel",
              sleepStages: "Sleep stages",
              sparklineDescription: "Edited data",
              stackedBarChart: "Stacked bar chart",
              storageOverview: "Storage overview",
              target: "Target",
              ticketLoad: "Ticket load",
              tokyoIncidents: "Tokyo incidents",
              total: "Total",
              totalCapacity: "Total capacity",
              trafficDensity: "Traffic density",
              usedStorage: "Used storage",
              weeklyActivity: "Weekly activity",
          };
}

function buildChartData(values: number[], locale: ChartDemoLocale) {
    const labels = getChartDataLabels(locale);
    const colors = ["primary", "success", "warning", "info", "accent", "primary"];
    return values.map((value, index) => ({
        label: labels[index],
        value,
        color: colors[index],
    }));
}

function buildSparklineCodeData(values: number[], locale: ChartDemoLocale) {
    const labels = getChartDataLabels(locale);
    return values.map((value, index) => ({
        label: labels[index] ?? `#${index + 1}`,
        value,
    }));
}

function buildDistributionCodeSegments(values: number[], locale: ChartDemoLocale) {
    const labels = getDistributionLabels(locale);
    const distributionValues = distributionValuesFromPreview(values);
    const colors = ["primary", "success", "warning", "info"];
    return labels.map((label, index) => ({
        label,
        value: distributionValues[index],
        color: colors[index],
    }));
}

function buildLegendCodeItems(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const segments = buildDistributionCodeSegments(values, locale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    return segments.map((segment) => ({
        label: segment.label,
        value: `${total > 0 ? Math.round((segment.value / total) * 100) : 0}%`,
        color: segment.color,
        description: `${copy.total}: ${segment.value.toLocaleString()}`,
    }));
}

function buildLineCodeSeries(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const labels = getChartDataLabels(locale);
    const lineValues = lineChartValuesFromPreview(values);
    const actualValues = lineValues.slice(0, labels.length);
    const targetValues = lineValues.slice(labels.length);

    return [
        {
            label: copy.revenue,
            color: "primary",
            data: actualValues.map((value, index) => ({
                label: labels[index],
                value,
            })),
        },
        {
            label: copy.target,
            color: "success",
            data: targetValues.map((value, index) => ({
                label: labels[index],
                value,
            })),
        },
    ];
}

function buildRibbonCodeLayers(values: number[], locale: ChartDemoLocale) {
    const labels = getChartDataLabels(locale);
    const layerLabels = getRibbonLayerLabels(locale);
    const ribbonValues = ribbonChartValuesFromPreview(values);
    const colors = ["primary", "success", "warning"];

    return layerLabels.map((label, layerIndex) => ({
        label,
        color: colors[layerIndex],
        data: labels.map((periodLabel, index) => ({
            label: periodLabel,
            value: ribbonValues[layerIndex * labels.length + index],
        })),
    }));
}

function buildRadialCodeData(values: number[], locale: ChartDemoLocale) {
    const labels = getRadialBarLabels(locale);
    const colors = ["primary", "success", "warning"];
    return radialBarValuesFromPreview(values).map((value, index) => ({
        label: labels[index],
        value,
        color: colors[index],
    }));
}

function buildConcentricCodeRings(values: number[], locale: ChartDemoLocale) {
    const labels = getConcentricProgressLabels(locale);
    const progressValues = concentricProgressValuesFromPreview(values);
    const capacity = progressValues[5];
    const colors = ["primary", "info", "success", "warning"];

    return labels.map((label, index) => {
        const value = progressValues[index + 1];
        return {
            label,
            value,
            color: colors[index],
            detail:
                locale === "ja"
                    ? `全体 ${capacity}GB 中の ${Math.round((value / capacity) * 100)}%`
                    : `${Math.round((value / capacity) * 100)}% of ${capacity}GB total`,
        };
    });
}

function buildStackedCodeGroups(values: number[], locale: ChartDemoLocale) {
    const labels = getStackedBarLabels(locale);
    const segmentLabels = getStackedSegmentLabels(locale);
    const colors = ["primary", "success", "warning"];
    const stackedValues = stackedBarValuesFromPreview(values);

    return labels.map((label, groupIndex) => {
        const offset = groupIndex * 4;
        const total = stackedValues[offset];
        const ratios = stackedValues.slice(offset + 1, offset + 4);
        const firstValue = Math.round((total * ratios[0]) / 100);
        const secondValue = Math.round((total * ratios[1]) / 100);
        const segmentValues = [
            firstValue,
            secondValue,
            Math.max(0, total - firstValue - secondValue),
        ];

        return {
            label,
            segments: segmentLabels.map((segmentLabel, segmentIndex) => ({
                label: segmentLabel,
                value: segmentValues[segmentIndex],
                color: colors[segmentIndex],
            })),
        };
    });
}

function buildHeatmapCodeData(values: number[], locale: ChartDemoLocale) {
    const selected = heatmapValuesFromPreview(values);
    const xLabels = getHeatmapXLabels(locale);

    return heatmapYLabels.flatMap((y, rowIndex) =>
        xLabels.map((x, columnIndex) => {
            const baseValue = clampGaugeValue(
                24 + rowIndex * 7 + columnIndex * 4 + ((rowIndex + columnIndex) % 2) * 5
            );

            return {
                x,
                y,
                value:
                    selected[0] === columnIndex && selected[1] === rowIndex
                        ? selected[2]
                        : baseValue,
            };
        })
    );
}

function buildActivityCodeSlots(values: number[], locale: ChartDemoLocale) {
    const timelineValues = activityTimelineValuesFromPreview(values);
    const labels = getActivityTimelineLabels(locale);
    const segmentLabels = getActivitySegmentLabels(locale);
    const colors = ["success", "primary", "accent"];

    return labels.map((label, index) => {
        const offset = getActivityTimelineValueOffset(index);
        return {
            label,
            value: timelineValues[offset],
            color: index === timelineValues[0] ? "success" : "info",
            segments: segmentLabels.map((segmentLabel, segmentIndex) => ({
                label: segmentLabel,
                value: timelineValues[offset + segmentIndex + 1],
                color: colors[segmentIndex],
            })),
        };
    });
}

function buildLabeledDonutCodeSegments(values: number[], locale: ChartDemoLocale) {
    const labels = getLabeledDonutLabels(locale);
    const donutValues = labeledDonutValuesFromPreview(values);
    const colors = ["primary", "warning", "success"];

    return labels.map((label, index) => ({
        label,
        calloutLabel: label,
        value: donutValues[index + 1],
        color: colors[index],
        comparison:
            locale === "ja"
                ? `${index + 1}番目の販売チャネル`
                : `Sales channel ${index + 1}`,
    }));
}

function buildMiniDistributionCodeSegments(values: number[], locale: ChartDemoLocale) {
    const labels = getMiniDistributionLabels(locale);
    const miniValues = miniDistributionValuesFromPreview(values);
    const colors = ["warning", "primary", "success"];

    return labels.map((label, index) => ({
        label,
        value: miniValues[index + 1],
        color: colors[index],
        detail:
            locale === "ja"
                ? `${miniValues[4] + index * 8} 件`
                : `${miniValues[4] + index * 8} products`,
    }));
}

function buildRetentionCodeCohorts(values: number[], locale: ChartDemoLocale) {
    const selected = retentionCohortValuesFromPreview(values);
    const cohortLabels = getRetentionCohortLabels(locale);
    const baseValues = [
        [100, 76, 64, 58, 51, 46, 41, 36],
        [100, 72, 62, 54, 48, 42, 37],
        [100, 68, 56, 49, 43, 38],
        [100, 70, 59, 50, 44],
        [100, 66, 53, 47],
        [100, 63, 51],
    ];

    return cohortLabels.map((label, cohortIndex) => ({
        label,
        size: 1240 - cohortIndex * 96,
        values: baseValues[cohortIndex].map((value, periodIndex) => ({
            value:
                selected[0] === cohortIndex && selected[1] === periodIndex
                    ? selected[2]
                    : value,
        })),
    }));
}

function buildChoroplethCodeRegions(values: number[], locale: ChartDemoLocale) {
    const selected = choroplethValuesFromPreview(values);
    const labels = getTokyoChoroplethLabels(locale);
    const baseValues = [76, 64, 58, 92, 48, 54, 42, 38];

    return labels.slice(0, 8).map((label, index) => ({
        id: label.toLowerCase().replace(/\s+/g, "-"),
        label,
        value: selected[0] === index ? selected[1] : baseValues[index],
        geometry: {
            type: "Polygon",
            coordinates: [[
                [139.62 + (index % 4) * 0.035, 35.73 - Math.floor(index / 4) * 0.045],
                [139.65 + (index % 4) * 0.035, 35.73 - Math.floor(index / 4) * 0.045],
                [139.65 + (index % 4) * 0.035, 35.69 - Math.floor(index / 4) * 0.045],
                [139.62 + (index % 4) * 0.035, 35.69 - Math.floor(index / 4) * 0.045],
            ]],
        },
    }));
}

function buildQuadrantCodeItems(values: number[], locale: ChartDemoLocale) {
    const selected = quadrantMatrixValuesFromPreview(values);
    const labels = getQuadrantMatrixLabels(locale);
    const ids = ["activation", "expansion", "retention", "risk", "reach", "quality"];
    const base = [
        { value: 88, x: 72, y: 34, color: "primary" },
        { value: 76, x: 58, y: 24, color: "success" },
        { value: 64, x: 42, y: 44, color: "warning" },
        { value: 52, x: 30, y: 72, color: "info" },
        { value: 41, x: 76, y: 70, color: "accent" },
        { value: 35, x: 24, y: 26, color: "destructive" },
    ];

    return labels.map((label, index) => ({
        id: ids[index],
        label,
        ...base[index],
        value: selected[0] === index ? selected[1] : base[index].value,
    }));
}

function formatDurationCodeValue(value: number, locale: ChartDemoLocale) {
    const minutes = Math.max(0, Math.round(value));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (locale === "ja") {
        return hours > 0
            ? `${hours}時間${remainingMinutes}分`
            : `${remainingMinutes}分`;
    }

    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

function buildSegmentedGaugePreviewCode(
    values: number[],
    locale: ChartDemoLocale
) {
    const labels = getSegmentedGaugeLabels(locale);
    const ranges =
        locale === "ja"
            ? ["固定費", "追加投資", "運用余力"]
            : ["Fixed", "Investment", "Capacity"];
    const colors = ["success", "warning", "primary"] as const;
    const gaugeValues = segmentedGaugeValuesFromPreview(values);
    const segmentIndex = gaugeValues[0];
    const segmentValues = gaugeValues.slice(1, 4);
    const currentValue = gaugeValues[4];
    const targetValue = gaugeValues[5];
    const total = segmentValues.reduce((sum, value) => sum + value, 0);
    const selectedShare =
        total > 0
            ? Math.round(((segmentValues[segmentIndex] ?? 0) / total) * 100)
            : 0;
    const segmentsCode = segmentValues
        .map(
            (value, index) =>
                `    { label: ${codeString(labels[index] ?? `Segment ${index + 1}`)}, value: ${value}, color: ${codeString(colors[index] ?? "primary")}, rangeLabel: ${codeString(ranges[index] ?? "")} },`
        )
        .join("\n");

    if (locale === "ja") {
        return `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
${segmentsCode}
];

<SegmentedGaugeCard
    title="支出内訳"
    description="セグメントゲージ"
    value={${currentValue}}
    valueLabel="${currentValue}%"
    centerLabel="現在の支出"
    delta="${selectedShare}%"
    deltaDescription="選択したセグメントの構成比です。"
    segments={segments}
    selectedIndex={${segmentIndex}}
    targetValue={${targetValue}}
    targetLabel="目標支出"
    max={100}
    formatValue={(value) => value + "%"}
    totalLabel="合計"
    caption="支出・進捗・リスクをセグメント付きの半円ゲージで確認します。"
/>;
`;
    }

    return `import { SegmentedGaugeCard } from "@gunjo/ui";

const segments = [
${segmentsCode}
];

<SegmentedGaugeCard
    title="Spend breakdown"
    description="Segmented gauge"
    value={${currentValue}}
    valueLabel="${currentValue}%"
    centerLabel="Current spend"
    delta="${selectedShare}%"
    deltaDescription="Share of the selected segment."
    segments={segments}
    selectedIndex={${segmentIndex}}
    targetValue={${targetValue}}
    targetLabel="Target spend"
    max={100}
    formatValue={(value) => value + "%"}
    totalLabel="Total"
    caption="Inspect spend, progress, or risk status with segmented gauge ranges."
/>;
`;
}

function buildSegmentTimelinePreviewCode(
    values: number[],
    locale: ChartDemoLocale
) {
    const labels = getSegmentTimelineLabels(locale);
    const timelineValues = segmentTimelineValuesFromPreview(values);
    const colors = ["primary", "info", "success", "warning"] as const;
    let cursor = 0;
    const segments = timelineValues.intervals.map((interval) => {
        const start = cursor;
        const end = cursor + interval.duration;
        cursor = end;

        return {
            label: labels[interval.stageIndex] ?? `Stage ${interval.stageIndex + 1}`,
            value: interval.duration,
            start,
            end,
            color: colors[interval.stageIndex] ?? "primary",
        };
    });
    const totalDuration = timelineValues.totals.reduce(
        (sum, duration) => sum + duration,
        0
    );
    const awakeDuration = timelineValues.totals[3] ?? 0;
    const asleepDuration = Math.max(totalDuration - awakeDuration, 0);
    const selectedLabel = labels[timelineValues.selectedIndex];
    const selectedSegmentIndex = Math.max(
        0,
        segments.findIndex((segment) => segment.label === selectedLabel)
    );
    const qualityDelta = timelineValues.quality - 76;
    const delta = `${qualityDelta > 0 ? "+" : ""}${qualityDelta}%`;
    const segmentsCode = segments
        .map(
            (segment) =>
                `    { label: ${codeString(segment.label)}, value: ${segment.value}, start: ${segment.start}, end: ${segment.end}, color: ${codeString(segment.color)} },`
        )
        .join("\n");

    if (locale === "ja") {
        return `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "睡眠品質", value: "${timelineValues.quality}%", description: "基準品質 76% と比較した睡眠品質スコアです。" },
    { label: "睡眠時間", value: "${formatDurationCodeValue(asleepDuration, locale)}", description: "総時間から覚醒時間を除いた睡眠時間です。" },
    { label: "覚醒時間", value: "${formatDurationCodeValue(awakeDuration, locale)}", description: "覚醒ステージに分類された時間の合計です。" },
];

const segments = [
${segmentsCode}
];

const formatDuration = (minutes) =>
    Math.floor(minutes / 60) > 0
        ? Math.floor(minutes / 60) + "時間" + (minutes % 60) + "分"
        : minutes + "分";

<SegmentTimelineCard
    title="睡眠ステージ"
    description="セグメントタイムライン"
    delta="${delta}"
    deltaDescription="基準品質 76% との差分です。"
    metrics={metrics}
    segments={segments}
    selectedIndex={${selectedSegmentIndex}}
    min={0}
    max={${Math.max(totalDuration, 1)}}
    startLabel="23:42"
    endLabel="07:18"
    formatValue={(value) => formatDuration(value)}
    rangeLabel="ステージ時間"
    caption="睡眠、稼働状況、配送状態などの時間範囲をカテゴリごとに確認します。"
/>;
`;
    }

    return `import { SegmentTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "Sleep quality", value: "${timelineValues.quality}%", description: "Sleep quality score compared with the 76% baseline." },
    { label: "Time asleep", value: "${formatDurationCodeValue(asleepDuration, locale)}", description: "Total sleep duration excluding awake time." },
    { label: "Awake time", value: "${formatDurationCodeValue(awakeDuration, locale)}", description: "Total duration classified as awake." },
];

const segments = [
${segmentsCode}
];

const formatDuration = (minutes) =>
    Math.floor(minutes / 60) > 0
        ? Math.floor(minutes / 60) + "h " + (minutes % 60) + "m"
        : minutes + "m";

<SegmentTimelineCard
    title="Sleep stages"
    description="Segment timeline"
    delta="${delta}"
    deltaDescription="Difference from the 76% quality baseline."
    metrics={metrics}
    segments={segments}
    selectedIndex={${selectedSegmentIndex}}
    min={0}
    max={${Math.max(totalDuration, 1)}}
    startLabel="11:42 PM"
    endLabel="7:18 AM"
    formatValue={(value) => formatDuration(value)}
    rangeLabel="Stage duration"
    caption="Review categorical time ranges for sleep, uptime, or delivery states."
/>;
`;
}

function buildChartValuesPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const chartValues = values.slice(0, defaultChartDataValues.length).map(clampGaugeValue);
    while (chartValues.length < defaultChartDataValues.length) {
        chartValues.push(defaultChartDataValues[chartValues.length]);
    }
    const barData = buildChartData(chartValues, locale);
    const lineSeries = buildLineCodeSeries([
        ...chartValues,
        ...chartValues.map((value, index) => clampGaugeValue(Math.round(value * 0.82 + 12 + index * 2))),
    ], locale);
    const segments = buildDistributionCodeSegments(
        [chartValues[0], chartValues[1], chartValues[2], chartValues[3], chartValues[4], chartValues[5]],
        locale
    );
    const radarData = getRadarLabels(locale).map((label, index) => ({
        label,
        value: chartValues[index],
        color: ["primary", "success", "warning", "info", "accent", "primary"][index],
    }));

    return `import { AnalyticsCard, BarChart, DistributionBar, LineChart, RadarChart, SparklineChart } from "@gunjo/ui";

${codeConst("barData", barData)}

${codeConst("lineSeries", lineSeries)}

${codeConst("segments", segments)}

${codeConst("radarData", radarData)}

<div className="grid gap-4 md:grid-cols-2">
    <AnalyticsCard title="${copy.sessions}" value="${chartValues.reduce((sum, value) => sum + value, 0).toLocaleString()}">
        <BarChart data={barData} showValues />
    </AnalyticsCard>
    <AnalyticsCard title="${copy.revenueTrend}" value="${chartValues[chartValues.length - 1]}">
        <LineChart series={lineSeries} variant="area" showLegend />
    </AnalyticsCard>
    <AnalyticsCard title="${copy.channelMix}" value="${segments.reduce((sum, segment) => sum + segment.value, 0).toLocaleString()}">
        <DistributionBar segments={segments} totalLabel="${copy.total}" showLegend />
    </AnalyticsCard>
    <AnalyticsCard title="${copy.capabilityBalance}" value="${averageCode(chartValues)}% ${copy.avg}">
        <RadarChart data={radarData} max={100} />
    </AnalyticsCard>
    <AnalyticsCard title="${copy.revenue}" value="${chartValues[chartValues.length - 1]}">
        <SparklineChart data={barData} variant="area" />
    </AnalyticsCard>
</div>;
`;
}

function buildAnalyticsCardPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const chartValues = values.slice(0, defaultChartDataValues.length).map(clampGaugeValue);
    while (chartValues.length < defaultChartDataValues.length) {
        chartValues.push(defaultChartDataValues[chartValues.length]);
    }
    const sparklineData = buildSparklineCodeData(chartValues, locale);
    const segments = buildDistributionCodeSegments(
        [chartValues[0], chartValues[1], chartValues[2], chartValues[3], chartValues[4], chartValues[5]],
        locale
    );
    const total = chartValues.reduce((sum, value) => sum + value, 0);
    const delta = chartValues[chartValues.length - 1] - chartValues[0];
    const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);
    const firstShare = segmentTotal > 0
        ? Math.round(((segments[0]?.value ?? 0) / segmentTotal) * 100)
        : 0;

    return `import { AnalyticsCard, DistributionBar, SparklineChart } from "@gunjo/ui";

${codeConst("sparklineData", sparklineData)}

${codeConst("segments", segments)}

<div className="grid gap-4 md:grid-cols-2">
    <AnalyticsCard
        title="${copy.revenue}"
        description="${copy.sparklineDescription}"
        value="$${(total * 120).toLocaleString()}"
        delta="${delta >= 0 ? "+" : ""}${delta}"
        trend="${trendFromDeltaCode(delta)}"
    >
        <SparklineChart data={sparklineData} variant="area" color="primary" />
    </AnalyticsCard>
    <AnalyticsCard
        title="${copy.channelMix}"
        description="${copy.currentAcquisitionShare}"
        value="${firstShare}%"
        trend="flat"
    >
        <DistributionBar segments={segments} totalLabel="${copy.total}" showLegend />
    </AnalyticsCard>
</div>;
`;
}

function buildBarChartPreviewCode(values: number[], locale: ChartDemoLocale, showReference: boolean) {
    const copy = getChartCopy(locale);
    const chartValues = values.slice(0, defaultChartDataValues.length).map(clampGaugeValue);
    while (chartValues.length < defaultChartDataValues.length) {
        chartValues.push(defaultChartDataValues[chartValues.length]);
    }
    const data = buildChartData(chartValues, locale);
    const average = averageCode(chartValues);
    const total = chartValues.reduce((sum, value) => sum + value, 0);

    return `import { AnalyticsCard, BarChart } from "@gunjo/ui";

${codeConst("data", data)}

<AnalyticsCard
    title="${copy.weeklyActivity}"
    description="${copy.averageSessionsByDay}"
    value="${total.toLocaleString()}"
    delta="${average} ${copy.avg}"
    trend="flat"
>
    <BarChart
        data={data}
        averageValue={${showReference ? average : "undefined"}}
        averageLabel="${copy.avg}"
        showValues
    />
</AnalyticsCard>;
`;
}

function buildSparklinePreviewCode(values: number[], locale: ChartDemoLocale, showReference: boolean) {
    const copy = getChartCopy(locale);
    const chartValues = values.slice(0, defaultChartDataValues.length).map(clampGaugeValue);
    while (chartValues.length < defaultChartDataValues.length) {
        chartValues.push(defaultChartDataValues[chartValues.length]);
    }
    const data = buildSparklineCodeData(chartValues, locale);
    const average = averageCode(chartValues);
    const total = chartValues.reduce((sum, value) => sum + value, 0);
    const delta = chartValues[chartValues.length - 1] - chartValues[0];

    return `import { AnalyticsCard, SparklineChart } from "@gunjo/ui";

${codeConst("data", data)}

<AnalyticsCard
    title="${copy.revenueTrend}"
    description="${copy.sparklineDescription}"
    value="$${(total * 120).toLocaleString()}"
    delta="${delta >= 0 ? "+" : ""}${delta}"
    deltaDescription="${copy.comparedWithPreviousPeriod}"
    trend="${trendFromDeltaCode(delta)}"
>
    <SparklineChart
        data={data}
        variant="area"
        color="primary"
        referenceValue={${showReference ? average : "undefined"}}
        referenceLabel="${copy.avg}"
        showDots
        aria-label="${copy.revenueTrend}"
    />
</AnalyticsCard>;
`;
}

function buildLineChartPreviewCode(values: number[], locale: ChartDemoLocale, showReference: boolean) {
    const copy = getChartCopy(locale);
    const series = buildLineCodeSeries(values, locale);
    const actualValues = lineChartValuesFromPreview(values).slice(0, defaultChartDataValues.length);
    const average = averageCode(actualValues);
    const total = actualValues.reduce((sum, value) => sum + value, 0);
    const delta = actualValues[actualValues.length - 1] - actualValues[0];

    return `import { AnalyticsCard, LineChart } from "@gunjo/ui";

${codeConst("series", series)}

<AnalyticsCard
    title="${copy.revenueTrend}"
    description="${copy.actualVsTarget}"
    value="$${(total * 120).toLocaleString()}"
    delta="${delta >= 0 ? "+" : ""}${delta}"
    trend="${trendFromDeltaCode(delta)}"
>
    <LineChart
        series={series}
        variant="area"
        referenceValue={${showReference ? average : "undefined"}}
        referenceLabel="${copy.avg}"
        showLegend
    />
</AnalyticsCard>;
`;
}

function buildRibbonPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const layers = buildRibbonCodeLayers(values, locale);
    const totalsByPeriod = getChartDataLabels(locale).map((_, index) =>
        layers.reduce((sum, layer) => sum + (layer.data[index]?.value ?? 0), 0)
    );
    const total = totalsByPeriod.reduce((sum, value) => sum + value, 0);
    const delta = totalsByPeriod[totalsByPeriod.length - 1] - totalsByPeriod[0];

    return `import { AnalyticsCard, RibbonChart } from "@gunjo/ui";

${codeConst("layers", layers)}

<AnalyticsCard
    title="${copy.ribbonChart}"
    value="${total.toLocaleString()}"
    delta="${delta >= 0 ? "+" : ""}${delta}"
    trend="${trendFromDeltaCode(delta)}"
>
    <RibbonChart layers={layers} variant="flow" totalLabel="${copy.total}" showLegend />
</AnalyticsCard>;
`;
}

function buildRadialPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const data = buildRadialCodeData(values, locale);
    const average = averageCode(data.map((item) => item.value));

    return `import { AnalyticsCard, RadialBarChart } from "@gunjo/ui";

${codeConst("data", data)}

<AnalyticsCard title="${copy.radialBarChart}" value="${average}% ${copy.avg}" trend="flat">
    <RadialBarChart
        data={data}
        centerValue="${average}%"
        centerLabel="${copy.avg}"
        formatValue={(value) => value + "%"}
        showLegend
    />
</AnalyticsCard>;
`;
}

function buildConcentricPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const progressValues = concentricProgressValuesFromPreview(values);
    const rings = buildConcentricCodeRings(values, locale);
    const used = rings.reduce((sum, ring) => sum + ring.value, 0);
    const capacity = progressValues[5];
    const usedPercent = Math.round((used / capacity) * 100);

    return `import { ConcentricProgressCard } from "@gunjo/ui";

${codeConst("rings", rings)}

<ConcentricProgressCard
    title="${copy.storageOverview}"
    value="${used}GB"
    centerLabel="${copy.usedStorage}"
    delta="${usedPercent}%"
    rings={rings}
    selectedIndex={${progressValues[0]}}
    max={${capacity}}
    formatValue={(value) => value + "GB"}
    maxLabel="${copy.totalCapacity}"
/>;
`;
}

function buildStackedPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const data = buildStackedCodeGroups(values, locale);
    const totals = data.map((group) =>
        group.segments.reduce((sum, segment) => sum + segment.value, 0)
    );
    const max = Math.max(...totals);
    const total = totals.reduce((sum, value) => sum + value, 0);

    return `import { AnalyticsCard, StackedBarChart } from "@gunjo/ui";

${codeConst("data", data)}

<div className="grid gap-4 md:grid-cols-2">
    <AnalyticsCard
        title="${copy.channelMix}"
        description="${copy.monthlyRevenue}"
        value="${total.toLocaleString()}"
        delta="${max} ${locale === "ja" ? "ピーク" : "peak"}"
        trend="up"
    >
        <StackedBarChart
            data={data}
            showLegend
            showValues
            totalLabel="${copy.total}"
            aria-label="${copy.channelMix}"
        />
    </AnalyticsCard>
    <AnalyticsCard
        title="${copy.acquisition}"
        description="${copy.channelDistribution}"
        value="${data.length} ${locale === "ja" ? "グループ" : "groups"}"
        trend="flat"
    >
        <StackedBarChart
            data={data}
            variant="horizontal"
            normalize
            showValues
            totalLabel="${copy.total}"
            aria-label="${copy.channelDistribution}"
        />
    </AnalyticsCard>
</div>;
`;
}

function buildDistributionPreviewCode(demo: ChartPreviewDemo, values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const segments = buildDistributionCodeSegments(values, locale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    if (demo === "chart-legend") {
        return `import { AnalyticsCard, ChartLegend } from "@gunjo/ui";

${codeConst("items", buildLegendCodeItems(values, locale))}

<AnalyticsCard title="${copy.channelLegend}" value="${total.toLocaleString()}">
    <ChartLegend items={items} />
    <ChartLegend variant="vertical" items={items} />
</AnalyticsCard>;
`;
    }

    const componentName =
        demo === "donut-chart" ? "DonutChart" :
        demo === "pie-chart" ? "PieChart" :
        "DistributionBar";
    const extraProps =
        demo === "donut-chart"
            ? ` centerValue="${total.toLocaleString()}" centerLabel="${copy.total}"`
            : "";

    return `import { AnalyticsCard, ${componentName} } from "@gunjo/ui";

${codeConst("segments", segments)}

<AnalyticsCard title="${demo === "pie-chart" ? copy.audienceShare : copy.segmentMix}" value="${total.toLocaleString()}">
    <${componentName} segments={segments}${extraProps} totalLabel="${copy.total}" showLegend />
</AnalyticsCard>;
`;
}

function buildGaugePreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const score = averageCode(values.slice(0, defaultChartDataValues.length).map(clampGaugeValue));

    return `import { GaugeChart } from "@gunjo/ui";

<GaugeChart
    value={${score}}
    label="${copy.score}"
    valueLabel="${score}%"
    formatValue={(value) => value + "%"}
/>;
`;
}

function buildRadarPreviewCode(values: number[], locale: ChartDemoLocale, baseline?: number) {
    const copy = getChartCopy(locale);
    const chartValues = values.slice(0, defaultChartDataValues.length).map(clampGaugeValue);
    while (chartValues.length < defaultChartDataValues.length) {
        chartValues.push(defaultChartDataValues[chartValues.length]);
    }
    const data = getRadarLabels(locale).map((label, index) => ({
        label,
        value: chartValues[index],
        color: ["primary", "success", "warning", "info", "accent", "primary"][index],
    }));
    const average = averageCode(chartValues);
    const reference = baseline ?? chartDeltaBaselines.referenceScore;
    const delta = average - reference;

    return `import { AnalyticsCard, RadarChart } from "@gunjo/ui";

${codeConst("data", data)}

<AnalyticsCard
    title="${copy.capabilityBalance}"
    value="${average}% ${copy.avg}"
    delta="${formatPointDeltaCode(delta)}"
    trend="${trendFromDeltaCode(delta)}"
>
    <RadarChart data={data} max={100} formatValue={(value) => value + "%"} />
</AnalyticsCard>;
`;
}

function buildHeatmapPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const selected = heatmapValuesFromPreview(values);
    const data = buildHeatmapCodeData(values, locale);

    return `import { HeatmapChart } from "@gunjo/ui";

${codeConst("data", data)}

<HeatmapChart
    data={data}
    xLabels={${codeLiteral(getHeatmapXLabels(locale))}}
    yLabels={${codeLiteral(heatmapYLabels)}}
    selectedCell={{ x: ${codeString(getHeatmapXLabels(locale)[selected[0]])}, y: ${codeString(heatmapYLabels[selected[1]])} }}
    summaryLabel="${locale === "ja" ? "ピーク" : "Peak"}"
    max={100}
    showValues
    aria-label="${copy.trafficDensity}"
/>;
`;
}

function buildActivityTimelinePreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const timelineValues = activityTimelineValuesFromPreview(values);
    const slots = buildActivityCodeSlots(values, locale);
    const selectedSlot = slots[timelineValues[0]];
    const total = slots.reduce((sum, slot) => sum + slot.value, 0);
    const dailyAverage = Math.round(total / slots.length);

    return `import { ActivityTimelineCard } from "@gunjo/ui";

${codeConst("slots", slots)}

<ActivityTimelineCard
    title="${copy.energyTimeline}"
    description="${copy.activityTimeline}"
    delta="${formatPercentDeltaCode((((selectedSlot?.value ?? 0) - 100) / 100) * 100)}"
    metrics={[
        { label: "${copy.burned}", value: "${total.toLocaleString()} kcal" },
        { label: "${copy.dailyAverage}", value: "${dailyAverage.toLocaleString()} kcal" },
    ]}
    slots={slots}
    segments={slots[${timelineValues[0]}].segments}
    selectedSlot={${timelineValues[0]}}
    max={200}
/>;
`;
}

function buildLabeledDonutPreviewCode(values: number[], locale: ChartDemoLocale) {
    const segments = buildLabeledDonutCodeSegments(values, locale);
    const selectedIndex = labeledDonutValuesFromPreview(values)[0];
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    return `import { LabeledDonutCard } from "@gunjo/ui";

${codeConst("segments", segments)}

<LabeledDonutCard
    title="${locale === "ja" ? "プラットフォーム別売上" : "Sales by platform"}"
    centerValue="${total.toLocaleString()}"
    centerLabel="${locale === "ja" ? "合計" : "Total"}"
    segments={segments}
    selectedIndex={${selectedIndex}}
/>;
`;
}

function buildMiniDistributionPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const miniValues = miniDistributionValuesFromPreview(values);
    const segments = buildMiniDistributionCodeSegments(values, locale);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const selectedShare = total > 0
        ? Math.round(((segments[miniValues[0]]?.value ?? 0) / total) * 100)
        : 0;

    return `import { MiniDistributionBarCard } from "@gunjo/ui";

${codeConst("segments", segments)}

<MiniDistributionBarCard
    title="${copy.productCategories}"
    description="${copy.miniDistribution}"
    value="${selectedShare}%"
    delta="+3.2%"
    segments={segments}
    selectedIndex={${miniValues[0]}}
    tickCount={32}
    totalLabel="${copy.total}"
/>;
`;
}

function buildRetentionPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const selected = retentionCohortValuesFromPreview(values);
    const periods = getRetentionPeriodLabels(locale);
    const cohorts = buildRetentionCodeCohorts(values, locale);
    const selectedValue = cohorts[selected[0]]?.values[selected[1]]?.value ?? selected[2];

    return `import { RetentionCohortCard } from "@gunjo/ui";

${codeConst("periods", periods)}

${codeConst("cohorts", cohorts)}

<RetentionCohortCard
    title="${copy.cohortRetention}"
    value="${selectedValue}%"
    periods={periods}
    cohorts={cohorts}
    selectedCell={{ cohortIndex: ${selected[0]}, periodIndex: ${selected[1]} }}
/>;
`;
}

function buildChoroplethPreviewCode(values: number[], locale: ChartDemoLocale) {
    const copy = getChartCopy(locale);
    const selected = choroplethValuesFromPreview(values);

    return `import { AnalyticsCard, ChoroplethMap } from "@gunjo/ui";

${codeConst("regions", buildChoroplethCodeRegions(values, locale))}

<AnalyticsCard title="${copy.tokyoIncidents}" value="${selected[1]}">
    <ChoroplethMap regions={regions} selectedId={regions[${selected[0]}].id} showRanking />
</AnalyticsCard>;
`;
}

function buildQuadrantPreviewCode(values: number[], locale: ChartDemoLocale, baseline?: number) {
    const copy = getChartCopy(locale);
    const selected = quadrantMatrixValuesFromPreview(values);
    const items = buildQuadrantCodeItems(values, locale);
    const reference = baseline ?? chartDeltaBaselines.referenceScore;
    const delta = selected[1] - reference;

    return `import { AnalyticsCard, QuadrantMatrix } from "@gunjo/ui";

${codeConst("items", items)}

<AnalyticsCard
    title="${copy.quadrantMatrix}"
    value="${selected[1]}% ${copy.score}"
    delta="${formatPointDeltaCode(delta)}"
    trend="${trendFromDeltaCode(delta)}"
>
    <QuadrantMatrix
        items={items}
        selectedId={items[${selected[0]}].id}
        xAxisLabel="${locale === "ja" ? "到達範囲" : "Reach"}"
        yAxisLabel="${locale === "ja" ? "影響度" : "Impact"}"
        showRanking
    />
</AnalyticsCard>;
`;
}

function buildDynamicPreviewCode(
    demo: ChartPreviewDemo,
    values: number[],
    locale: ChartDemoLocale,
    baseline?: number,
    showReference = true
) {
    if (demo === "charts") {
        return buildChartValuesPreviewCode(values, locale);
    }

    if (demo === "analytics-card") {
        return buildAnalyticsCardPreviewCode(values, locale);
    }

    if (demo === "bar-chart") {
        return buildBarChartPreviewCode(values, locale, showReference);
    }

    if (demo === "sparkline-chart") {
        return buildSparklinePreviewCode(values, locale, showReference);
    }

    if (demo === "line-chart") {
        return buildLineChartPreviewCode(values, locale, showReference);
    }

    if (demo === "ribbon-chart") {
        return buildRibbonPreviewCode(values, locale);
    }

    if (demo === "radial-bar-chart") {
        return buildRadialPreviewCode(values, locale);
    }

    if (demo === "concentric-progress-card") {
        return buildConcentricPreviewCode(values, locale);
    }

    if (demo === "stacked-bar-chart") {
        return buildStackedPreviewCode(values, locale);
    }

    if (distributionDemoIds.has(demo)) {
        return buildDistributionPreviewCode(demo, values, locale);
    }

    if (demo === "gauge-chart") {
        return buildGaugePreviewCode(values, locale);
    }

    if (demo === "radar-chart") {
        return buildRadarPreviewCode(values, locale, baseline);
    }

    if (demo === "heatmap-chart") {
        return buildHeatmapPreviewCode(values, locale);
    }

    if (demo === "activity-timeline-card") {
        return buildActivityTimelinePreviewCode(values, locale);
    }

    if (demo === "labeled-donut-card") {
        return buildLabeledDonutPreviewCode(values, locale);
    }

    if (demo === "segmented-gauge-card") {
        return buildSegmentedGaugePreviewCode(values, locale);
    }

    if (demo === "mini-distribution-bar-card") {
        return buildMiniDistributionPreviewCode(values, locale);
    }

    if (demo === "segment-timeline-card") {
        return buildSegmentTimelinePreviewCode(values, locale);
    }

    if (demo === "retention-cohort-card") {
        return buildRetentionPreviewCode(values, locale);
    }

    if (demo === "choropleth-map") {
        return buildChoroplethPreviewCode(values, locale);
    }

    if (demo === "quadrant-matrix") {
        return buildQuadrantPreviewCode(values, locale, baseline);
    }

    return undefined;
}

function ReferenceLineSwitch({
    id,
    label,
    checked,
    onCheckedChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
            <FormLabel htmlFor={id} className="text-xs font-medium">
                {label}
            </FormLabel>
        </div>
    );
}

interface ActivityTimelineDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function ActivityTimelineDataControls({
    values,
    onValuesChange,
    locale,
}: ActivityTimelineDataControlsProps) {
    const copy = controlCopy[locale];
    const timelineLabels = getActivityTimelineLabels(locale);
    const segmentLabels = getActivitySegmentLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const timelineValues = activityTimelineValuesFromPreview(values);
    const slotIndex = timelineValues[0];
    const slotOffset = getActivityTimelineValueOffset(slotIndex);
    const activity = timelineValues[slotOffset];
    const walking = timelineValues[slotOffset + 1];
    const running = timelineValues[slotOffset + 2];
    const workout = timelineValues[slotOffset + 3];

    const selectSlot = (nextSlotIndex: number) => {
        const nextValues = [...timelineValues];
        nextValues[0] = clampActivityTimelineSlotIndex(nextSlotIndex);
        onValuesChange(nextValues);
    };

    const updateSlotValues = (
        nextActivity: number,
        nextWalking: number,
        nextRunning: number,
        nextWorkout: number
    ) => {
        onValuesChange(
            previewValuesFromActivityTimeline(
                timelineValues,
                slotIndex,
                nextActivity,
                nextWalking,
                nextRunning,
                nextWorkout
            )
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % activityTimelineScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(activityTimelineScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {timelineLabels[slotIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultActivityTimelineSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-activity-time" className="text-xs">
                            {copy.time}
                        </FormLabel>
                        <Select
                            id="chart-data-activity-time"
                            className="w-full"
                            value={String(slotIndex)}
                            onChange={(event) =>
                                selectSlot(Number(event.currentTarget.value))
                            }
                        >
                            {timelineLabels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-activity-value" className="text-xs">
                            {copy.activity}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-activity-value"
                            min={0}
                            max={200}
                            value={activity}
                            onValueChange={(nextValue) =>
                                updateSlotValues(nextValue, walking, running, workout)
                            }
                        />
                    </FormGroup>
                    {[walking, running, workout].map((segmentValue, index) => (
                        <FormGroup key={segmentLabels[index]} className="min-w-0 gap-1">
                            <FormLabel
                                htmlFor={`chart-data-activity-segment-${index}`}
                                className="text-xs"
                            >
                                {segmentLabels[index]}
                            </FormLabel>
                            <NumberInput
                                id={`chart-data-activity-segment-${index}`}
                                min={0}
                                max={200}
                                value={segmentValue}
                                onValueChange={(nextValue) => {
                                    const nextSegments = [walking, running, workout];
                                    nextSegments[index] = nextValue;
                                    updateSlotValues(
                                        activity,
                                        nextSegments[0],
                                        nextSegments[1],
                                        nextSegments[2]
                                    );
                                }}
                            />
                        </FormGroup>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface LabeledDonutDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function LabeledDonutDataControls({
    values,
    onValuesChange,
    locale,
}: LabeledDonutDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getLabeledDonutLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const donutValues = labeledDonutValuesFromPreview(values);
    const segmentIndex = donutValues[0];
    const segmentValues = donutValues.slice(1, 4);

    const updateValues = (nextSegmentIndex: number, nextValues: number[]) => {
        onValuesChange(
            previewValuesFromLabeledDonut(
                nextSegmentIndex,
                nextValues[0],
                nextValues[1],
                nextValues[2]
            )
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % labeledDonutScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(labeledDonutScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[segmentIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultLabeledDonutSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-labeled-donut-segment" className="text-xs">
                            {copy.series}
                        </FormLabel>
                        <Select
                            id="chart-data-labeled-donut-segment"
                            className="w-full"
                            value={String(segmentIndex)}
                            onChange={(event) =>
                                updateValues(
                                    Number(event.currentTarget.value),
                                    segmentValues
                                )
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    {segmentValues.map((segmentValue, index) => (
                        <FormGroup key={labels[index]} className="min-w-0 gap-1">
                            <FormLabel
                                htmlFor={`chart-data-labeled-donut-${index}`}
                                className="text-xs"
                            >
                                {labels[index]}
                            </FormLabel>
                            <NumberInput
                                id={`chart-data-labeled-donut-${index}`}
                                min={0}
                                max={200}
                                value={segmentValue}
                                onValueChange={(nextValue) => {
                                    const nextValues = [...segmentValues];
                                    nextValues[index] = nextValue;
                                    updateValues(segmentIndex, nextValues);
                                }}
                            />
                        </FormGroup>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface SegmentedGaugeDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function SegmentedGaugeDataControls({
    values,
    onValuesChange,
    locale,
}: SegmentedGaugeDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getSegmentedGaugeLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const gaugeValues = segmentedGaugeValuesFromPreview(values);
    const segmentIndex = gaugeValues[0];
    const segmentValues = gaugeValues.slice(1, 4);
    const currentValue = gaugeValues[4];
    const targetValue = gaugeValues[5];

    const updateValues = (
        nextSegmentIndex: number,
        nextSegmentValues: number[],
        nextCurrentValue: number,
        nextTargetValue: number
    ) => {
        onValuesChange(
            previewValuesFromSegmentedGauge(
                nextSegmentIndex,
                nextSegmentValues[0],
                nextSegmentValues[1],
                nextSegmentValues[2],
                nextCurrentValue,
                nextTargetValue
            )
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % segmentedGaugeScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(segmentedGaugeScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[segmentIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultSegmentedGaugeSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-segmented-gauge-segment" className="text-xs">
                            {copy.series}
                        </FormLabel>
                        <Select
                            id="chart-data-segmented-gauge-segment"
                            className="w-full"
                            value={String(segmentIndex)}
                            onChange={(event) =>
                                updateValues(
                                    Number(event.currentTarget.value),
                                    segmentValues,
                                    currentValue,
                                    targetValue
                                )
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    {segmentValues.map((segmentValue, index) => (
                        <FormGroup key={labels[index]} className="min-w-0 gap-1">
                            <FormLabel
                                htmlFor={`chart-data-segmented-gauge-${index}`}
                                className="text-xs"
                            >
                                {labels[index]}
                            </FormLabel>
                            <NumberInput
                                id={`chart-data-segmented-gauge-${index}`}
                                min={0}
                                max={100}
                                value={segmentValue}
                                onValueChange={(nextValue) => {
                                    const nextValues = [...segmentValues];
                                    nextValues[index] = nextValue;
                                    updateValues(
                                        segmentIndex,
                                        nextValues,
                                        currentValue,
                                        targetValue
                                    );
                                }}
                            />
                        </FormGroup>
                    ))}
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-segmented-gauge-current" className="text-xs">
                            {copy.value}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-segmented-gauge-current"
                            min={0}
                            max={100}
                            value={currentValue}
                            onValueChange={(nextValue) =>
                                updateValues(segmentIndex, segmentValues, nextValue, targetValue)
                            }
                        />
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-segmented-gauge-target" className="text-xs">
                            {copy.targetValue}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-segmented-gauge-target"
                            min={0}
                            max={100}
                            value={targetValue}
                            onValueChange={(nextValue) =>
                                updateValues(segmentIndex, segmentValues, currentValue, nextValue)
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface MiniDistributionDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function MiniDistributionDataControls({
    values,
    onValuesChange,
    locale,
}: MiniDistributionDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getMiniDistributionLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const distributionValues = miniDistributionValuesFromPreview(values);
    const segmentIndex = distributionValues[0];
    const segmentValues = distributionValues.slice(1, 4);
    const products = distributionValues[4];

    const updateValues = (
        nextSegmentIndex: number,
        nextSegmentValues: number[],
        nextProducts: number
    ) => {
        onValuesChange(
            previewValuesFromMiniDistribution(
                nextSegmentIndex,
                nextSegmentValues[0],
                nextSegmentValues[1],
                nextSegmentValues[2],
                nextProducts
            )
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % miniDistributionScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(miniDistributionScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[segmentIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultMiniDistributionSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-mini-distribution-segment" className="text-xs">
                            {copy.series}
                        </FormLabel>
                        <Select
                            id="chart-data-mini-distribution-segment"
                            className="w-full"
                            value={String(segmentIndex)}
                            onChange={(event) =>
                                updateValues(
                                    Number(event.currentTarget.value),
                                    segmentValues,
                                    products
                                )
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    {segmentValues.map((segmentValue, index) => (
                        <FormGroup key={labels[index]} className="min-w-0 gap-1">
                            <FormLabel
                                htmlFor={`chart-data-mini-distribution-${index}`}
                                className="text-xs"
                            >
                                {labels[index]}
                            </FormLabel>
                            <NumberInput
                                id={`chart-data-mini-distribution-${index}`}
                                min={0}
                                max={100}
                                value={segmentValue}
                                onValueChange={(nextValue) => {
                                    const nextValues = [...segmentValues];
                                    nextValues[index] = nextValue;
                                    updateValues(segmentIndex, nextValues, products);
                                }}
                            />
                        </FormGroup>
                    ))}
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-mini-distribution-products" className="text-xs">
                            {copy.totalValue}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-mini-distribution-products"
                            min={0}
                            max={200}
                            value={products}
                            onValueChange={(nextValue) =>
                                updateValues(segmentIndex, segmentValues, nextValue)
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface ConcentricProgressDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function ConcentricProgressDataControls({
    values,
    onValuesChange,
    locale,
}: ConcentricProgressDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getConcentricProgressLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const progressValues = concentricProgressValuesFromPreview(values);
    const ringIndex = progressValues[0];
    const ringValues = progressValues.slice(1, 5);
    const capacity = progressValues[5];

    const updateValues = (
        nextRingIndex: number,
        nextRingValues: number[],
        nextCapacity: number
    ) => {
        onValuesChange(
            previewValuesFromConcentricProgress(
                nextRingIndex,
                nextRingValues[0],
                nextRingValues[1],
                nextRingValues[2],
                nextRingValues[3],
                nextCapacity
            )
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % concentricProgressScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(concentricProgressScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[ringIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultConcentricProgressSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {ringValues.map((ringValue, index) => (
                        <FormGroup key={labels[index]} className="min-w-0 gap-1">
                            <FormLabel
                                htmlFor={`chart-data-concentric-value-${index}`}
                                className="text-xs"
                            >
                                {labels[index]}
                            </FormLabel>
                            <NumberInput
                                id={`chart-data-concentric-value-${index}`}
                                min={0}
                                max={1024}
                                value={ringValue}
                                onValueChange={(nextValue) => {
                                    const nextValues = [...ringValues];
                                    nextValues[index] = nextValue;
                                    updateValues(ringIndex, nextValues, capacity);
                                }}
                            />
                        </FormGroup>
                    ))}
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-concentric-capacity" className="text-xs">
                            {copy.capacity}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-concentric-capacity"
                            min={1}
                            max={1024}
                            value={capacity}
                            onValueChange={(nextValue) =>
                                updateValues(ringIndex, ringValues, nextValue)
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface SegmentTimelineDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function SegmentTimelineDataControls({
    values,
    onValuesChange,
    locale,
}: SegmentTimelineDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getSegmentTimelineLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const timelineValues = segmentTimelineValuesFromPreview(values);
    const segmentIndex = timelineValues.selectedIndex;
    const intervals = timelineValues.intervals;
    const totals = timelineValues.totals;
    const quality = timelineValues.quality;
    const totalDuration = totals.reduce((sum, duration) => sum + duration, 0);

    const updateValues = (
        nextSegmentIndex: number,
        nextIntervals: SegmentTimelineControlInterval[],
        nextQuality: number
    ) => {
        onValuesChange(
            previewValuesFromSegmentTimeline(
                nextSegmentIndex,
                nextIntervals,
                nextQuality
            )
        );
    };
    const updateInterval = (
        index: number,
        partial: Partial<SegmentTimelineControlInterval>
    ) => {
        const nextIntervals = intervals.map((interval, intervalIndex) =>
            intervalIndex === index ? { ...interval, ...partial } : interval
        );

        updateValues(segmentIndex, nextIntervals, quality);
    };
    const addInterval = () => {
        updateValues(
            segmentIndex,
            [...intervals, { stageIndex: segmentIndex, duration: 20 }],
            quality
        );
    };
    const removeInterval = (index: number) => {
        const nextIntervals = intervals.filter((_, intervalIndex) => intervalIndex !== index);

        updateValues(segmentIndex, nextIntervals.length > 0 ? nextIntervals : intervals, quality);
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % segmentTimelineScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(segmentTimelineScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[segmentIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultSegmentTimelineSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {totals.map((duration, index) => (
                        <div
                            key={labels[index]}
                            className="rounded-md border bg-background px-2.5 py-2"
                        >
                            <div className="truncate text-xs text-muted-foreground">
                                {labels[index]}
                            </div>
                            <div className="text-sm font-semibold tabular-nums">
                                {duration}
                            </div>
                        </div>
                    ))}
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-segment-timeline-quality" className="text-xs">
                            {copy.quality}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-segment-timeline-quality"
                            min={0}
                            max={100}
                            value={quality}
                            onValueChange={(nextValue) =>
                                updateValues(segmentIndex, intervals, nextValue)
                            }
                        />
                    </FormGroup>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-2.5 py-2">
                    <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">
                            {copy.intervalCount}
                        </div>
                        <div className="text-sm font-semibold tabular-nums">
                            {intervals.length} / {totalDuration} {copy.minutes}
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                                {copy.intervalSettings}
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className="max-h-[min(42rem,calc(100vh-4rem))] max-w-3xl overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none"
                        >
                            <DialogHeader>
                                <DialogTitle>{copy.intervalSettings}</DialogTitle>
                                <DialogDescription>
                                    {copy.intervalSettingsDescription}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {copy.intervals}: {intervals.length}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addInterval}
                                    >
                                        {copy.addInterval}
                                    </Button>
                                </div>
                                <div className="grid max-h-[28rem] min-w-0 grid-cols-1 gap-2 overflow-auto pr-1 md:grid-cols-2">
                                    {intervals.map((interval, index) => (
                                        <div
                                            key={`${index}-${interval.stageIndex}`}
                                            className="grid min-w-0 grid-cols-[minmax(0,1fr)_7rem_auto] items-end gap-2 rounded-md border bg-background p-2"
                                        >
                                            <FormGroup className="min-w-0 gap-1">
                                                <FormLabel
                                                    htmlFor={`chart-data-segment-timeline-interval-stage-${index}`}
                                                    className="text-xs"
                                                >
                                                    {copy.interval} {index + 1}
                                                </FormLabel>
                                                <Select
                                                    id={`chart-data-segment-timeline-interval-stage-${index}`}
                                                    className="w-full"
                                                    value={String(interval.stageIndex)}
                                                    onChange={(event) =>
                                                        updateInterval(index, {
                                                            stageIndex: Number(event.currentTarget.value),
                                                        })
                                                    }
                                                >
                                                    {labels.map((label, labelIndex) => (
                                                        <option key={label} value={labelIndex}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormGroup>
                                            <FormGroup className="min-w-0 gap-1">
                                                <FormLabel
                                                    htmlFor={`chart-data-segment-timeline-interval-duration-${index}`}
                                                    className="text-xs"
                                                >
                                                    {copy.duration}
                                                </FormLabel>
                                                <NumberInput
                                                    id={`chart-data-segment-timeline-interval-duration-${index}`}
                                                    min={1}
                                                    max={480}
                                                    value={interval.duration}
                                                    onValueChange={(nextValue) =>
                                                        updateInterval(index, { duration: nextValue })
                                                    }
                                                />
                                            </FormGroup>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => removeInterval(index)}
                                                disabled={intervals.length <= 1}
                                            >
                                                {copy.remove}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

function buildGaugeValues(value: number) {
    return defaultChartDataValues.map(() => clampGaugeValue(value));
}

function clampDistributionValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(200, Math.max(0, Math.round(value)));
}

function distributionValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < 6) {
        normalized.push(0);
    }
    return [
        clampDistributionValue(normalized[0] + normalized[1]),
        clampDistributionValue(normalized[2] + normalized[3]),
        clampDistributionValue(normalized[4]),
        clampDistributionValue(normalized[5]),
    ];
}

function previewValuesFromDistribution(values: number[]) {
    const normalized = values.map(clampDistributionValue);
    while (normalized.length < distributionLabels.length) {
        normalized.push(defaultDistributionValues[normalized.length]);
    }
    return [normalized[0], 0, normalized[1], 0, normalized[2], normalized[3]];
}

function lineChartValuesFromPreview(values: number[]) {
    const normalized = values.slice(0, defaultLineChartValues.length).map(clampGaugeValue);
    while (normalized.length < defaultLineChartValues.length) {
        normalized.push(defaultLineChartValues[normalized.length]);
    }
    return normalized;
}

function ribbonChartValuesFromPreview(values: number[]) {
    const normalized = values
        .slice(0, defaultRibbonChartValues.length)
        .map(clampDistributionValue);
    while (normalized.length < defaultRibbonChartValues.length) {
        normalized.push(defaultRibbonChartValues[normalized.length]);
    }
    return normalized;
}

function radialBarValuesFromPreview(values: number[]) {
    const normalized = values.slice(0, defaultRadialBarValues.length).map(clampGaugeValue);
    while (normalized.length < defaultRadialBarValues.length) {
        normalized.push(defaultRadialBarValues[normalized.length]);
    }
    return normalized;
}

function stackedBarValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultStackedBarValues.length) {
        normalized.push(defaultStackedBarValues[normalized.length]);
    }
    return normalizeStackedBarValues(normalized);
}

function previewValuesFromStackedBar(values: number[]) {
    return normalizeStackedBarValues(values);
}

function normalizeStackedBarValues(values: number[]) {
    const normalized: number[] = [];
    const groupCount = getStackedBarLabels().length;

    for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
        const offset = groupIndex * 4;
        const fallback = defaultStackedBarValues.slice(offset, offset + 4);
        normalized.push(
            clampDistributionValue(values[offset] ?? fallback[0]),
            ...normalizeStackedRatios(
                values.slice(offset + 1, offset + 4),
                fallback.slice(1, 4)
            )
        );
    }

    return normalized;
}

function normalizeStackedRatios(values: number[], fallback = [48, 32, 20]) {
    const raw = [...values].slice(0, 3).map(clampGaugeValue);
    while (raw.length < 3) {
        raw.push(fallback[raw.length]);
    }

    const sum = raw.reduce((total, value) => total + value, 0);
    if (sum <= 0) return fallback;

    const normalized = raw.map((value) => Math.round((value / sum) * 100));
    normalized[2] += 100 - normalized.reduce((total, value) => total + value, 0);
    return normalized;
}

function rebalanceStackedRatios(values: number[], index: number, nextValue: number) {
    const current = normalizeStackedRatios(values);
    const next = clampGaugeValue(nextValue);
    const remaining = 100 - next;
    const otherIndexes = [0, 1, 2].filter((item) => item !== index);
    const otherSum = otherIndexes.reduce((sum, item) => sum + current[item], 0);
    const balanced = [...current];
    balanced[index] = next;

    if (otherSum <= 0) {
        balanced[otherIndexes[0]] = Math.floor(remaining / 2);
        balanced[otherIndexes[1]] = remaining - balanced[otherIndexes[0]];
        return balanced;
    }

    balanced[otherIndexes[0]] = Math.round((current[otherIndexes[0]] / otherSum) * remaining);
    balanced[otherIndexes[1]] = remaining - balanced[otherIndexes[0]];

    return balanced;
}

function heatmapValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultHeatmapSelectionValues.length) {
        normalized.push(defaultHeatmapSelectionValues[normalized.length]);
    }
    return [
        Math.min(heatmapXLabels.length - 1, Math.max(0, Math.round(normalized[0]))),
        Math.min(heatmapYLabels.length - 1, Math.max(0, Math.round(normalized[1]))),
        clampGaugeValue(normalized[2]),
        0,
        0,
        0,
    ];
}

function previewValuesFromHeatmap(dayIndex: number, timeIndex: number, value: number) {
    return [
        Math.min(heatmapXLabels.length - 1, Math.max(0, Math.round(dayIndex))),
        Math.min(heatmapYLabels.length - 1, Math.max(0, Math.round(timeIndex))),
        clampGaugeValue(value),
        0,
        0,
        0,
    ];
}

function getRetentionPeriodCountForCohort(cohortIndex: number) {
    return Math.max(1, getRetentionPeriodLabels().length - cohortIndex);
}

function retentionCohortValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultRetentionCohortSelectionValues.length) {
        normalized.push(defaultRetentionCohortSelectionValues[normalized.length]);
    }
    const cohortIndex = Math.min(
        getRetentionCohortLabels().length - 1,
        Math.max(0, Math.round(normalized[0]))
    );
    const periodIndex = Math.min(
        getRetentionPeriodCountForCohort(cohortIndex) - 1,
        Math.max(0, Math.round(normalized[1]))
    );

    return [
        cohortIndex,
        periodIndex,
        clampGaugeValue(normalized[2]),
        0,
        0,
        0,
    ];
}

function previewValuesFromRetentionCohort(cohortIndex: number, periodIndex: number, value: number) {
    const normalizedCohortIndex = Math.min(
        getRetentionCohortLabels().length - 1,
        Math.max(0, Math.round(cohortIndex))
    );

    return [
        normalizedCohortIndex,
        Math.min(
            getRetentionPeriodCountForCohort(normalizedCohortIndex) - 1,
            Math.max(0, Math.round(periodIndex))
        ),
        clampGaugeValue(value),
        0,
        0,
        0,
    ];
}

function choroplethValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultChoroplethSelectionValues.length) {
        normalized.push(defaultChoroplethSelectionValues[normalized.length]);
    }
    return [
        Math.min(tokyoChoroplethLabels.length - 1, Math.max(0, Math.round(normalized[0]))),
        clampGaugeValue(normalized[1]),
        0,
        0,
        0,
        0,
    ];
}

function previewValuesFromChoropleth(regionIndex: number, incidents: number) {
    return [
        Math.min(tokyoChoroplethLabels.length - 1, Math.max(0, Math.round(regionIndex))),
        clampGaugeValue(incidents),
        0,
        0,
        0,
        0,
    ];
}

function quadrantMatrixValuesFromPreview(values: number[]) {
    const normalized = [...values];
    while (normalized.length < defaultQuadrantMatrixSelectionValues.length) {
        normalized.push(defaultQuadrantMatrixSelectionValues[normalized.length]);
    }
    return [
        Math.min(quadrantMatrixLabels.length - 1, Math.max(0, Math.round(normalized[0]))),
        clampGaugeValue(normalized[1]),
        0,
        0,
        0,
        0,
    ];
}

function previewValuesFromQuadrantMatrix(itemIndex: number, score: number) {
    return [
        Math.min(quadrantMatrixLabels.length - 1, Math.max(0, Math.round(itemIndex))),
        clampGaugeValue(score),
        0,
        0,
        0,
        0,
    ];
}

interface GaugeDataControlsProps {
    value: number;
    onValueChange: (value: number) => void;
    baselineValue: number;
    onBaselineChange: (value: number) => void;
    baselineDefault: number;
    locale: ChartDemoLocale;
}

function GaugeDataControls({
    value,
    onValueChange,
    baselineValue,
    onBaselineChange,
    baselineDefault,
    locale,
}: GaugeDataControlsProps) {
    const copy = controlCopy[locale];

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{copy.data}</h3>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            onValueChange(defaultGaugeValue);
                            onBaselineChange(baselineDefault);
                        }}
                    >
                        {copy.reset}
                    </Button>
                </div>
                <div className="grid gap-2 sm:max-w-sm sm:grid-cols-2">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-score" className="text-xs">
                            {copy.score}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-score"
                            min={0}
                            max={100}
                            value={value}
                            onValueChange={(nextValue) =>
                                onValueChange(clampGaugeValue(nextValue))
                            }
                        />
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-baseline" className="text-xs">
                            {copy.previousScore}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-baseline"
                            min={0}
                            max={100}
                            value={baselineValue}
                            onValueChange={(nextValue) =>
                                onBaselineChange(clampGaugeValue(nextValue))
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface DistributionDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function DistributionDataControls({
    values,
    onValuesChange,
    locale,
}: DistributionDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getDistributionLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const distributionValues = distributionValuesFromPreview(values);

    const updateValue = (index: number, nextValue: number) => {
        const nextValues = distributionValues.map((value, valueIndex) =>
            valueIndex === index ? clampDistributionValue(nextValue) : value
        );
        onValuesChange(previewValuesFromDistribution(nextValues));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % distributionScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(previewValuesFromDistribution(distributionScenarioValues[nextIndex]));
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{copy.data}</h3>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                onValuesChange(previewValuesFromDistribution(defaultDistributionValues))
                            }
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
                    {distributionValues.map((value, index) => {
                        const inputId = `chart-data-distribution-${index}`;
                        return (
                            <FormGroup key={labels[index]} className="min-w-0 gap-1">
                                <FormLabel htmlFor={inputId} className="text-xs">
                                    {labels[index]}
                                </FormLabel>
                                <NumberInput
                                    id={inputId}
                                    min={0}
                                    max={200}
                                    value={value}
                                    onValueChange={(nextValue) => updateValue(index, nextValue)}
                                />
                            </FormGroup>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface RadialBarDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function RadialBarDataControls({
    values,
    onValuesChange,
    locale,
}: RadialBarDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getRadialBarLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const radialValues = radialBarValuesFromPreview(values);

    const updateValue = (index: number, nextValue: number) => {
        const nextValues = radialValues.map((value, valueIndex) =>
            valueIndex === index ? clampGaugeValue(nextValue) : value
        );
        onValuesChange(radialBarValuesFromPreview(nextValues));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % radialBarScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(radialBarScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{copy.data}</h3>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultRadialBarValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    {radialValues.map((value, index) => {
                        const inputId = `chart-data-radial-bar-${index}`;
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
                </div>
            </div>
        </div>
    );
}

interface LineChartDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    showReference: boolean;
    onShowReferenceChange: (showReference: boolean) => void;
    locale: ChartDemoLocale;
}

function LineChartDataControls({
    values,
    onValuesChange,
    showReference,
    onShowReferenceChange,
    locale,
}: LineChartDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getChartDataLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const lineValues = lineChartValuesFromPreview(values);
    const actualValue = lineValues[selectedIndex];
    const targetValue = lineValues[selectedIndex + labels.length];

    const updateActual = (nextValue: number) => {
        const nextValues = [...lineValues];
        nextValues[selectedIndex] = clampGaugeValue(nextValue);
        onValuesChange(lineChartValuesFromPreview(nextValues));
    };

    const updateTarget = (nextValue: number) => {
        const nextValues = [...lineValues];
        nextValues[selectedIndex + labels.length] = clampGaugeValue(nextValue);
        onValuesChange(lineChartValuesFromPreview(nextValues));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % lineChartScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(lineChartScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[selectedIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <ReferenceLineSwitch
                            id="chart-data-line-reference"
                            label={copy.referenceLine}
                            checked={showReference}
                            onCheckedChange={onShowReferenceChange}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultLineChartValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid gap-2 sm:max-w-2xl sm:grid-cols-[minmax(0,1fr)_minmax(0,10rem)_minmax(0,10rem)]">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-line-month" className="text-xs">
                            {copy.month}
                        </FormLabel>
                        <Select
                            id="chart-data-line-month"
                            className="w-full"
                            value={String(selectedIndex)}
                            onChange={(event) =>
                                setSelectedIndex(Number(event.currentTarget.value))
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-line-actual" className="text-xs">
                            {copy.actual}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-line-actual"
                            min={0}
                            max={100}
                            value={actualValue}
                            onValueChange={updateActual}
                        />
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-line-target" className="text-xs">
                            {copy.targetValue}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-line-target"
                            min={0}
                            max={100}
                            value={targetValue}
                            onValueChange={updateTarget}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface RibbonChartDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function RibbonChartDataControls({
    values,
    onValuesChange,
    locale,
}: RibbonChartDataControlsProps) {
    const copy = controlCopy[locale];
    const periods = getChartDataLabels(locale);
    const layers = getRibbonLayerLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
    const ribbonValues = ribbonChartValuesFromPreview(values);

    const getLayerValue = (layerIndex: number) =>
        ribbonValues[layerIndex * periods.length + selectedPeriodIndex];

    const updateLayerValue = (layerIndex: number, nextValue: number) => {
        const nextValues = [...ribbonValues];
        nextValues[layerIndex * periods.length + selectedPeriodIndex] =
            clampDistributionValue(nextValue);
        onValuesChange(ribbonChartValuesFromPreview(nextValues));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % ribbonChartScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(ribbonChartScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {periods[selectedPeriodIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultRibbonChartValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-ribbon-period" className="text-xs">
                            {copy.period}
                        </FormLabel>
                        <Select
                            id="chart-data-ribbon-period"
                            className="w-full"
                            value={String(selectedPeriodIndex)}
                            onChange={(event) =>
                                setSelectedPeriodIndex(Number(event.currentTarget.value))
                            }
                        >
                            {periods.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    {layers.map((label, layerIndex) => {
                        const inputId = `chart-data-ribbon-layer-${layerIndex}`;
                        return (
                            <FormGroup key={label} className="min-w-0 gap-1">
                                <FormLabel htmlFor={inputId} className="text-xs">
                                    {label}
                                </FormLabel>
                                <NumberInput
                                    id={inputId}
                                    min={0}
                                    max={200}
                                    value={getLayerValue(layerIndex)}
                                    onValueChange={(nextValue) =>
                                        updateLayerValue(layerIndex, nextValue)
                                    }
                                />
                            </FormGroup>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface StackedBarDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function StackedBarDataControls({
    values,
    onValuesChange,
    locale,
}: StackedBarDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getStackedBarLabels(locale);
    const ratioLabels = getStackedSegmentLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const stackedValues = stackedBarValuesFromPreview(values);
    const selectedOffset = selectedIndex * 4;
    const totalValue = stackedValues[selectedOffset];
    const ratioValues = stackedValues.slice(selectedOffset + 1, selectedOffset + 4);

    const updateTotal = (nextValue: number) => {
        const nextValues = [...stackedValues];
        nextValues[selectedOffset] = clampDistributionValue(nextValue);
        onValuesChange(previewValuesFromStackedBar(nextValues));
    };

    const updateRatio = (index: number, nextValue: number) => {
        const nextRatios = rebalanceStackedRatios(ratioValues, index, nextValue);
        const nextValues = [...stackedValues];
        nextValues.splice(selectedOffset + 1, 3, ...nextRatios);
        onValuesChange(previewValuesFromStackedBar(nextValues));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % stackedBarScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(stackedBarScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{copy.data}</h3>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultStackedBarValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid gap-3 lg:grid-cols-[minmax(0,12rem)_minmax(0,10rem)_minmax(0,1fr)] lg:items-end">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-stacked-month" className="text-xs">
                            {copy.month}
                        </FormLabel>
                        <Select
                            id="chart-data-stacked-month"
                            className="w-full"
                            value={String(selectedIndex)}
                            onChange={(event) =>
                                setSelectedIndex(Number(event.currentTarget.value))
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-stacked-total" className="text-xs">
                            {copy.totalValue}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-stacked-total"
                            min={0}
                            max={200}
                            value={totalValue}
                            onValueChange={updateTotal}
                        />
                    </FormGroup>
                    <div className="min-w-0 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            {copy.ratio}
                        </p>
                        <div className="grid min-w-0 grid-cols-3 gap-2">
                            {ratioValues.map((value, index) => {
                                const inputId = `chart-data-stacked-ratio-${index}`;
                                return (
                                    <FormGroup key={ratioLabels[index]} className="min-w-0 gap-1">
                                        <FormLabel htmlFor={inputId} className="text-xs">
                                            {ratioLabels[index]}
                                        </FormLabel>
                                        <NumberInput
                                            id={inputId}
                                            min={0}
                                            max={100}
                                            value={value}
                                            onValueChange={(nextValue) =>
                                                updateRatio(index, nextValue)
                                            }
                                        />
                                    </FormGroup>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface HeatmapDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    baselineValue: number;
    onBaselineChange: (value: number) => void;
    baselineDefault: number;
    locale: ChartDemoLocale;
}

function HeatmapDataControls({
    values,
    onValuesChange,
    baselineValue,
    onBaselineChange,
    baselineDefault,
    locale,
}: HeatmapDataControlsProps) {
    const copy = controlCopy[locale];
    const xLabels = getHeatmapXLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const heatmapValues = heatmapValuesFromPreview(values);
    const dayIndex = heatmapValues[0];
    const timeIndex = heatmapValues[1];
    const density = heatmapValues[2];

    const updateDay = (nextDayIndex: number) => {
        onValuesChange(previewValuesFromHeatmap(nextDayIndex, timeIndex, density));
    };

    const updateTime = (nextTimeIndex: number) => {
        onValuesChange(previewValuesFromHeatmap(dayIndex, nextTimeIndex, density));
    };

    const updateDensity = (nextValue: number) => {
        onValuesChange(previewValuesFromHeatmap(dayIndex, timeIndex, nextValue));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % heatmapScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(heatmapScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {xLabels[dayIndex]} {heatmapYLabels[timeIndex]}:00
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onValuesChange(defaultHeatmapSelectionValues);
                                onBaselineChange(baselineDefault);
                            }}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-day" className="text-xs">
                            {copy.day}
                        </FormLabel>
                        <Select
                            id="chart-data-day"
                            className="w-full"
                            value={String(dayIndex)}
                            onChange={(event) => updateDay(Number(event.currentTarget.value))}
                        >
                            {xLabels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-time" className="text-xs">
                            {copy.time}
                        </FormLabel>
                        <Select
                            id="chart-data-time"
                            className="w-full"
                            value={String(timeIndex)}
                            onChange={(event) => updateTime(Number(event.currentTarget.value))}
                        >
                            {heatmapYLabels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}:00
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-density" className="text-xs">
                            {copy.density}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-density"
                            min={0}
                            max={100}
                            value={density}
                            onValueChange={updateDensity}
                        />
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-baseline" className="text-xs">
                            {copy.baseline}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-baseline"
                            min={0}
                            max={100}
                            value={baselineValue}
                            onValueChange={(nextValue) =>
                                onBaselineChange(clampGaugeValue(nextValue))
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface RetentionCohortDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function RetentionCohortDataControls({
    values,
    onValuesChange,
    locale,
}: RetentionCohortDataControlsProps) {
    const copy = controlCopy[locale];
    const cohortLabels = getRetentionCohortLabels(locale);
    const periodLabels = getRetentionPeriodLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const retentionValues = retentionCohortValuesFromPreview(values);
    const cohortIndex = retentionValues[0];
    const periodIndex = retentionValues[1];
    const retention = retentionValues[2];
    const availablePeriodCount = getRetentionPeriodCountForCohort(cohortIndex);
    const availablePeriods = periodLabels.slice(0, availablePeriodCount);

    const updateCohort = (nextCohortIndex: number) => {
        onValuesChange(
            previewValuesFromRetentionCohort(nextCohortIndex, periodIndex, retention)
        );
    };

    const updatePeriod = (nextPeriodIndex: number) => {
        onValuesChange(
            previewValuesFromRetentionCohort(cohortIndex, nextPeriodIndex, retention)
        );
    };

    const updateRetention = (nextValue: number) => {
        onValuesChange(
            previewValuesFromRetentionCohort(cohortIndex, periodIndex, nextValue)
        );
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % retentionCohortScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(retentionCohortScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {cohortLabels[cohortIndex]} / {periodLabels[periodIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultRetentionCohortSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-retention-cohort" className="text-xs">
                            {copy.cohort}
                        </FormLabel>
                        <Select
                            id="chart-data-retention-cohort"
                            className="w-full"
                            value={String(cohortIndex)}
                            onChange={(event) => updateCohort(Number(event.currentTarget.value))}
                        >
                            {cohortLabels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-retention-period" className="text-xs">
                            {copy.period}
                        </FormLabel>
                        <Select
                            id="chart-data-retention-period"
                            className="w-full"
                            value={String(periodIndex)}
                            onChange={(event) => updatePeriod(Number(event.currentTarget.value))}
                        >
                            {availablePeriods.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-retention-value" className="text-xs">
                            {copy.retention}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-retention-value"
                            min={0}
                            max={100}
                            value={retention}
                            onValueChange={updateRetention}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface ChoroplethDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    locale: ChartDemoLocale;
}

function ChoroplethDataControls({
    values,
    onValuesChange,
    locale,
}: ChoroplethDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getTokyoChoroplethLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const choroplethValues = choroplethValuesFromPreview(values);
    const regionIndex = choroplethValues[0];
    const incidents = choroplethValues[1];

    const updateRegion = (nextRegionIndex: number) => {
        onValuesChange(previewValuesFromChoropleth(nextRegionIndex, incidents));
    };

    const updateIncidents = (nextValue: number) => {
        onValuesChange(previewValuesFromChoropleth(regionIndex, nextValue));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % choroplethScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(choroplethScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[regionIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onValuesChange(defaultChoroplethSelectionValues)}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:max-w-xl sm:grid-cols-[minmax(0,1fr)_minmax(0,10rem)]">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-region" className="text-xs">
                            {copy.ward}
                        </FormLabel>
                        <Select
                            id="chart-data-region"
                            className="w-full"
                            value={String(regionIndex)}
                            onChange={(event) =>
                                updateRegion(Number(event.currentTarget.value))
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-incidents" className="text-xs">
                            {copy.incidents}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-incidents"
                            min={0}
                            max={100}
                            value={incidents}
                            onValueChange={updateIncidents}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

interface QuadrantMatrixDataControlsProps {
    values: number[];
    onValuesChange: (values: number[]) => void;
    baselineValue: number;
    onBaselineChange: (value: number) => void;
    baselineDefault: number;
    locale: ChartDemoLocale;
}

function QuadrantMatrixDataControls({
    values,
    onValuesChange,
    baselineValue,
    onBaselineChange,
    baselineDefault,
    locale,
}: QuadrantMatrixDataControlsProps) {
    const copy = controlCopy[locale];
    const labels = getQuadrantMatrixLabels(locale);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const matrixValues = quadrantMatrixValuesFromPreview(values);
    const itemIndex = matrixValues[0];
    const score = matrixValues[1];

    const updateItem = (nextItemIndex: number) => {
        onValuesChange(previewValuesFromQuadrantMatrix(nextItemIndex, score));
    };

    const updateScore = (nextValue: number) => {
        onValuesChange(previewValuesFromQuadrantMatrix(itemIndex, nextValue));
    };

    const applyScenario = () => {
        const nextIndex = (scenarioIndex + 1) % quadrantMatrixScenarioValues.length;
        setScenarioIndex(nextIndex);
        onValuesChange(quadrantMatrixScenarioValues[nextIndex]);
    };

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold">{copy.data}</h3>
                        <p className="text-xs text-muted-foreground">
                            {copy.editing}: {labels[itemIndex]}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={applyScenario}>
                            {copy.scenario}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                onValuesChange(defaultQuadrantMatrixSelectionValues);
                                onBaselineChange(baselineDefault);
                            }}
                        >
                            {copy.reset}
                        </Button>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-item" className="text-xs">
                            {copy.item}
                        </FormLabel>
                        <Select
                            id="chart-data-item"
                            className="w-full"
                            value={String(itemIndex)}
                            onChange={(event) =>
                                updateItem(Number(event.currentTarget.value))
                            }
                        >
                            {labels.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-score" className="text-xs">
                            {copy.score}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-score"
                            min={0}
                            max={100}
                            value={score}
                            onValueChange={updateScore}
                        />
                    </FormGroup>
                    <FormGroup className="min-w-0 gap-1">
                        <FormLabel htmlFor="chart-data-baseline" className="text-xs">
                            {copy.baseline}
                        </FormLabel>
                        <NumberInput
                            id="chart-data-baseline"
                            min={0}
                            max={100}
                            value={baselineValue}
                            onValueChange={(nextValue) =>
                                onBaselineChange(clampGaugeValue(nextValue))
                            }
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

export function ChartPreviewWithControls({
    code,
    demo,
    embedBase,
    previewHeight,
}: ChartPreviewWithControlsProps) {
    const { locale } = useLocale();
    const chartLocale = toChartDemoLocale(locale);
    const isGaugeDemo = demo === "gauge-chart";
    const isDistributionDemo = distributionDemoIds.has(demo);
    const isRadialBarDemo = radialBarDemoIds.has(demo);
    const isConcentricProgressDemo = concentricProgressDemoIds.has(demo);
    const isLineChartDemo = lineChartDemoIds.has(demo);
    const isRibbonChartDemo = ribbonChartDemoIds.has(demo);
    const isStackedBarDemo = stackedBarDemoIds.has(demo);
    const isActivityTimelineDemo = activityTimelineDemoIds.has(demo);
    const isLabeledDonutDemo = labeledDonutDemoIds.has(demo);
    const isSegmentedGaugeDemo = segmentedGaugeDemoIds.has(demo);
    const isMiniDistributionDemo = miniDistributionDemoIds.has(demo);
    const isSegmentTimelineDemo = segmentTimelineDemoIds.has(demo);
    const isChoroplethDemo = choroplethDemoIds.has(demo);
    const isHeatmapDemo = heatmapDemoIds.has(demo);
    const isRetentionCohortDemo = retentionCohortDemoIds.has(demo);
    const isQuadrantMatrixDemo = quadrantMatrixDemoIds.has(demo);
    const hasReferenceToggle = referenceToggleDemoIds.has(demo);
    const isRadarDemo = demo === "radar-chart";
    const baselineKind = getBaselineKind(demo);
    const baselineDefaultValue =
        baselineKind === null ? null : chartDeltaBaselines[baselineKind];
    const [baselineValue, setBaselineValue] = useState<number>(
        baselineDefaultValue ?? chartDeltaBaselines.referenceScore
    );
    const [showReference, setShowReference] = useState(true);
    const [values, setValues] = useState(
        isGaugeDemo
            ? buildGaugeValues(defaultGaugeValue)
            : isDistributionDemo
              ? previewValuesFromDistribution(defaultDistributionValues)
              : isRadialBarDemo
                ? defaultRadialBarValues
                : isConcentricProgressDemo
                  ? defaultConcentricProgressSelectionValues
                  : isLineChartDemo
                    ? defaultLineChartValues
                    : isRibbonChartDemo
                      ? defaultRibbonChartValues
                      : isStackedBarDemo
                        ? defaultStackedBarValues
                        : isActivityTimelineDemo
                          ? defaultActivityTimelineSelectionValues
                          : isLabeledDonutDemo
                            ? defaultLabeledDonutSelectionValues
                            : isSegmentedGaugeDemo
                              ? defaultSegmentedGaugeSelectionValues
                              : isMiniDistributionDemo
                                ? defaultMiniDistributionSelectionValues
                                : isSegmentTimelineDemo
                                  ? defaultSegmentTimelineSelectionValues
                                  : isChoroplethDemo
                                    ? defaultChoroplethSelectionValues
                                    : isHeatmapDemo
                                      ? defaultHeatmapSelectionValues
                                      : isRetentionCohortDemo
                                        ? defaultRetentionCohortSelectionValues
                                        : isQuadrantMatrixDemo
                                          ? defaultQuadrantMatrixSelectionValues
                                          : defaultChartDataValues
    );
    const DemoComponent = demoComponents[demo];
    const previewValues = isGaugeDemo ? buildGaugeValues(values[0]) : values;
    const previewValueMax = isConcentricProgressDemo
        ? 1024
        : isSegmentTimelineDemo
          ? 480
          : 200;
    const activeBaseline =
        baselineDefaultValue === null ? undefined : clampGaugeValue(baselineValue);
    const embedSrc = useMemo(
        () =>
            `${embedBase}?values=${encodeChartValues(previewValues, previewValueMax)}&locale=${chartLocale}${
                activeBaseline === undefined ? "" : `&baseline=${activeBaseline}`
            }${
                hasReferenceToggle ? `&reference=${showReference ? "1" : "0"}` : ""
            }`,
        [activeBaseline, chartLocale, embedBase, hasReferenceToggle, previewValueMax, previewValues, showReference]
    );
    const previewBodyWidth = chartPreviewBodyWidths[demo];
    const displayCode = useMemo(
        () =>
            buildDynamicPreviewCode(
                demo,
                previewValues,
                chartLocale,
                activeBaseline,
                showReference
            ) ?? code,
        [activeBaseline, chartLocale, code, demo, previewValues, showReference]
    );

    return (
        <div className="space-y-3">
            <ComponentPreview
                embedSrc={embedSrc}
                previewHeight={previewHeight}
                previewBodyWidth={previewBodyWidth}
                code={displayCode}
                codeBlock={<CodeBlock code={displayCode} />}
            >
                <DemoComponent
                    values={previewValues}
                    onValuesChange={setValues}
                    baseline={activeBaseline}
                    showReference={showReference}
                    locale={chartLocale}
                />
            </ComponentPreview>
            {isGaugeDemo ? (
                <GaugeDataControls
                    locale={chartLocale}
                    value={clampGaugeValue(values[0])}
                    onValueChange={(nextValue) => setValues(buildGaugeValues(nextValue))}
                    baselineValue={clampGaugeValue(baselineValue)}
                    onBaselineChange={setBaselineValue}
                    baselineDefault={baselineDefaultValue ?? chartDeltaBaselines.previousGaugeScore}
                />
            ) : isDistributionDemo ? (
                <DistributionDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isRadialBarDemo ? (
                <RadialBarDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isConcentricProgressDemo ? (
                <ConcentricProgressDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isLineChartDemo ? (
                <LineChartDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                    showReference={showReference}
                    onShowReferenceChange={setShowReference}
                />
            ) : isRibbonChartDemo ? (
                <RibbonChartDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isStackedBarDemo ? (
                <StackedBarDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isActivityTimelineDemo ? (
                <ActivityTimelineDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isLabeledDonutDemo ? (
                <LabeledDonutDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isSegmentedGaugeDemo ? (
                <SegmentedGaugeDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isMiniDistributionDemo ? (
                <MiniDistributionDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isSegmentTimelineDemo ? (
                <SegmentTimelineDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isChoroplethDemo ? (
                <ChoroplethDataControls locale={chartLocale} values={values} onValuesChange={setValues} />
            ) : isHeatmapDemo ? (
                <HeatmapDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                    baselineValue={clampGaugeValue(baselineValue)}
                    onBaselineChange={setBaselineValue}
                    baselineDefault={baselineDefaultValue ?? chartDeltaBaselines.referenceScore}
                />
            ) : isRetentionCohortDemo ? (
                <RetentionCohortDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                />
            ) : isQuadrantMatrixDemo ? (
                <QuadrantMatrixDataControls
                    locale={chartLocale}
                    values={values}
                    onValuesChange={setValues}
                    baselineValue={clampGaugeValue(baselineValue)}
                    onBaselineChange={setBaselineValue}
                    baselineDefault={baselineDefaultValue ?? chartDeltaBaselines.referenceScore}
                />
            ) : (
                <ChartDataControls
                    locale={chartLocale}
                    values={values}
                    labels={isRadarDemo ? getRadarLabels(chartLocale) : undefined}
                    showReferenceControl={hasReferenceToggle}
                    showReference={showReference}
                    onShowReferenceChange={setShowReference}
                    referenceToggleLabel={
                        demo === "bar-chart"
                            ? controlCopy[chartLocale].averageLine
                            : controlCopy[chartLocale].referenceLine
                    }
                    baselineValue={
                        baselineKind === null ? undefined : clampGaugeValue(baselineValue)
                    }
                    baselineLabel={
                        baselineKind === null
                            ? undefined
                            : getBaselineLabel(chartLocale, baselineKind)
                    }
                    baselineDefault={baselineDefaultValue ?? undefined}
                    onBaselineChange={baselineKind === null ? undefined : setBaselineValue}
                    onValuesChange={setValues}
                />
            )}
        </div>
    );
}
