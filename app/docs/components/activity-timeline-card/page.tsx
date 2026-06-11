"use client";

import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import displayMetadata from "@design/display-metadata.json";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ActivityTimelineCard } from "@gunjo/ui";

const codeByLocale = {
    en: `import { useState } from "react";
import { ActivityTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "Than yesterday", value: "+23%", tooltip: "Compared with the same time slot baseline." },
    { label: "Burned", value: "760 kcal", tooltip: "Sum of activity across all time slots." },
    { label: "Daily avg", value: "253 kcal", tooltip: "Burned total divided by the number of slots." },
];

const segments = [
    { label: "Walking", value: 127 },
    { label: "Running", value: 384 },
    { label: "Workout", value: 249 },
];

const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);
const createSlotSegments = (value: number) =>
    segments.map((segment) => ({
        ...segment,
        value: Math.round((value * segment.value) / segmentTotal),
    }));

const slots = [
    { label: "6 AM", value: 42, segments: createSlotSegments(42) },
    { label: "8 AM", value: 84, segments: createSlotSegments(84) },
    { label: "10 AM", value: 58, segments: createSlotSegments(58) },
    { label: "12 PM", value: 156, segments: createSlotSegments(156) },
    { label: "2 PM", value: 92, segments: createSlotSegments(92) },
    { label: "4 PM", value: 46, segments: createSlotSegments(46) },
];

export function ActivityPanel() {
    const [selectedSlot, setSelectedSlot] = useState(3);
    const selectedSegments = slots[selectedSlot]?.segments ?? segments;

    return (
        <ActivityTimelineCard
            title="Energy timeline"
            description="Activity timeline"
            delta="+18%"
            metrics={metrics}
            slots={slots}
            segments={selectedSegments}
            selectedSlot={selectedSlot}
            onSlotSelect={(_, index) => setSelectedSlot(index)}
            max={200}
            caption="Inspect the selected time slot load and segment contribution."
        />
    );
}`,
    ja: `import { useState } from "react";
import { ActivityTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "昨日比", value: "+23%", tooltip: "同じ時間帯の基準値と比較しています。" },
    { label: "消費", value: "760 kcal", tooltip: "全時間帯の活動量を合計しています。" },
    { label: "日平均", value: "253 kcal", tooltip: "消費合計を時間帯数で割っています。" },
];

const segments = [
    { label: "ウォーク", value: 127 },
    { label: "ラン", value: 384 },
    { label: "ワークアウト", value: 249 },
];

const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);
const createSlotSegments = (value: number) =>
    segments.map((segment) => ({
        ...segment,
        value: Math.round((value * segment.value) / segmentTotal),
    }));

const slots = [
    { label: "6時", value: 42, segments: createSlotSegments(42) },
    { label: "8時", value: 84, segments: createSlotSegments(84) },
    { label: "10時", value: 58, segments: createSlotSegments(58) },
    { label: "12時", value: 156, segments: createSlotSegments(156) },
    { label: "14時", value: 92, segments: createSlotSegments(92) },
    { label: "16時", value: 46, segments: createSlotSegments(46) },
];

export function ActivityPanel() {
    const [selectedSlot, setSelectedSlot] = useState(3);
    const selectedSegments = slots[selectedSlot]?.segments ?? segments;

    return (
        <ActivityTimelineCard
            title="活動量タイムライン"
            description="時間帯別の活動量"
            delta="+18%"
            metrics={metrics}
            slots={slots}
            segments={selectedSegments}
            selectedSlot={selectedSlot}
            onSlotSelect={(_, index) => setSelectedSlot(index)}
            max={200}
            caption="選択した時間帯の活動量と内訳を一枚のカードで確認します。"
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { ActivityTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "Than yesterday", value: "+23%" },
    { label: "Burned", value: "760 kcal" },
    { label: "Daily avg", value: "253 kcal" },
];

const segments = [
    { label: "Walking", value: 127 },
    { label: "Running", value: 384 },
    { label: "Workout", value: 249 },
];

const slots = [
    { label: "6 AM", value: 42 },
    { label: "8 AM", value: 84 },
    { label: "10 AM", value: 58 },
    { label: "12 PM", value: 156 },
    { label: "2 PM", value: 92 },
    { label: "4 PM", value: 46 },
];

<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} />
<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} selectedSlot={3} />
<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} showSlotValues />
<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} variant="compact" />`,
    ja: `import { ActivityTimelineCard } from "@gunjo/ui";

const metrics = [
    { label: "昨日比", value: "+23%" },
    { label: "消費", value: "760 kcal" },
    { label: "日平均", value: "253 kcal" },
];

const segments = [
    { label: "ウォーク", value: 127 },
    { label: "ラン", value: 384 },
    { label: "ワークアウト", value: 249 },
];

const slots = [
    { label: "6時", value: 42 },
    { label: "8時", value: 84 },
    { label: "10時", value: 58 },
    { label: "12時", value: 156 },
    { label: "14時", value: 92 },
    { label: "16時", value: 46 },
];

<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} />
<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} selectedSlot={3} />
<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} showSlotValues />
<ActivityTimelineCard metrics={metrics} slots={slots} segments={segments} variant="compact" />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `<ActivityTimelineCard
  title="Energy timeline"
  metrics={metrics}
  slots={slots}
  segments={segments}
  max={200}
/>`,
        selected: `<ActivityTimelineCard
  title="Selected time slot"
  metrics={metrics}
  slots={slots}
  segments={slots[3].segments}
  selectedSlot={3}
  showSlotValues
  max={200}
/>`,
        compact: `<ActivityTimelineCard
  title="Compact timeline"
  metrics={metrics}
  slots={slots}
  segments={segments}
  variant="compact"
  max={200}
/>`,
    },
    ja: {
        default: `<ActivityTimelineCard
  title="活動量タイムライン"
  metrics={metrics}
  slots={slots}
  segments={segments}
  max={200}
/>`,
        selected: `<ActivityTimelineCard
  title="選択中の時間帯"
  metrics={metrics}
  slots={slots}
  segments={slots[3].segments}
  selectedSlot={3}
  showSlotValues
  max={200}
/>`,
        compact: `<ActivityTimelineCard
  title="コンパクト表示"
  metrics={metrics}
  slots={slots}
  segments={segments}
  variant="compact"
  max={200}
/>`,
    },
} as const;

const propsDataByLocale = {
    en: [
        {
            name: "metrics",
            type: "{ label: ReactNode; value: ReactNode; description?: ReactNode; tooltip?: ReactNode }[]",
            description: "Summary metrics shown above the timeline. Use tooltip for calculation details.",
        },
        {
            name: "slots",
            type: "{ label: ReactNode; value: number; color?: ChartColor; segments?: ActivityTimelineSegment[]; description?: ReactNode }[]",
            description: "Time-based values rendered as vertical bars. Optional segments render the same contribution breakdown inside each bar.",
        },
        {
            name: "segments",
            type: "{ label: ReactNode; value: number; color?: ChartColor; description?: ReactNode }[]",
            description: "Segment contribution values rendered in the stacked progress bar and stat rows.",
        },
        {
            name: "variant",
            type: "\"default\" | \"compact\"",
            default: "\"default\"",
            description: "Generated design variant for card density.",
        },
        {
            name: "selectedSlot",
            type: "number",
            description: "Highlights the currently inspected time slot.",
        },
        {
            name: "onSlotSelect",
            type: "(slot: ActivityTimelineSlot, index: number) => void",
            description: "Called when a timeline bar is clicked.",
        },
        {
            name: "showSlotValues",
            type: "boolean",
            default: "false",
            description: "Shows formatted values inside timeline bars.",
        },
        {
            name: "max",
            type: "number",
            description: "Explicit maximum used to normalize timeline bar height.",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "Formats timeline values, segment values, and tooltip values.",
        },
    ],
    ja: [
        {
            name: "metrics",
            type: "{ label: ReactNode; value: ReactNode; description?: ReactNode; tooltip?: ReactNode }[]",
            description: "タイムライン上部に表示する概要メトリクスです。tooltip で計算根拠を補足できます。",
        },
        {
            name: "slots",
            type: "{ label: ReactNode; value: number; color?: ChartColor; segments?: ActivityTimelineSegment[]; description?: ReactNode }[]",
            description: "時間帯ごとの値です。任意の segments を渡すと、同じ内訳を縦棒の中にも積み上げ表示します。",
        },
        {
            name: "segments",
            type: "{ label: ReactNode; value: number; color?: ChartColor; description?: ReactNode }[]",
            description: "下部の積み上げバーと統計行に表示する内訳値です。",
        },
        {
            name: "variant",
            type: "\"default\" | \"compact\"",
            default: "\"default\"",
            description: "カード密度を切り替える生成済みデザインバリアントです。",
        },
        {
            name: "selectedSlot",
            type: "number",
            description: "確認中の時間帯スロットを強調します。",
        },
        {
            name: "onSlotSelect",
            type: "(slot: ActivityTimelineSlot, index: number) => void",
            description: "タイムラインの棒がクリックされたときに呼ばれます。",
        },
        {
            name: "showSlotValues",
            type: "boolean",
            default: "false",
            description: "タイムラインの棒の中にフォーマット済みの値を表示します。",
        },
        {
            name: "max",
            type: "number",
            description: "タイムラインの棒の高さを正規化するための最大値です。",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: "タイムライン、内訳、ツールチップに表示する値のフォーマット関数です。",
        },
    ],
} as const;

const stateCodeDataByLocale = {
    en: `const metrics = [
  { label: "Than yesterday", value: "+23%" },
  { label: "Burned", value: "760 kcal" },
  { label: "Daily avg", value: "253 kcal" },
];

const segments = [
  { label: "Walking", value: 127 },
  { label: "Running", value: 384 },
  { label: "Workout", value: 249 },
];

const slots = [
  { label: "6 AM", value: 42 },
  { label: "8 AM", value: 84 },
  { label: "10 AM", value: 58 },
  { label: "12 PM", value: 156 },
  { label: "2 PM", value: 92 },
  { label: "4 PM", value: 46 },
];`,
    ja: `const metrics = [
  { label: "昨日比", value: "+23%" },
  { label: "消費", value: "760 kcal" },
  { label: "日平均", value: "253 kcal" },
];

const segments = [
  { label: "ウォーク", value: 127 },
  { label: "ラン", value: 384 },
  { label: "ワークアウト", value: 249 },
];

const slots = [
  { label: "6時", value: 42 },
  { label: "8時", value: 84 },
  { label: "10時", value: 58 },
  { label: "12時", value: 156 },
  { label: "14時", value: 92 },
  { label: "16時", value: 46 },
];`,
} as const;

function buildActivityTimelineData(locale: "ja" | "en") {
    const metrics = locale === "ja"
        ? [
            { label: "昨日比", value: "+23%", tooltip: "同じ時間帯の基準値と比較しています。" },
            { label: "消費", value: "760 kcal", tooltip: "全時間帯の活動量を合計しています。" },
            { label: "日平均", value: "253 kcal", tooltip: "消費合計を時間帯数で割っています。" },
        ]
        : [
            { label: "Than yesterday", value: "+23%", tooltip: "Compared with the same time slot baseline." },
            { label: "Burned", value: "760 kcal", tooltip: "Sum of activity across all time slots." },
            { label: "Daily avg", value: "253 kcal", tooltip: "Burned total divided by the number of slots." },
        ];
    const segments = locale === "ja"
        ? [
            { label: "ウォーク", value: 127 },
            { label: "ラン", value: 384 },
            { label: "ワークアウト", value: 249 },
        ]
        : [
            { label: "Walking", value: 127 },
            { label: "Running", value: 384 },
            { label: "Workout", value: 249 },
        ];
    const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);
    const createSlotSegments = (value: number) =>
        segments.map((segment) => ({
            ...segment,
            value: Math.round((value * segment.value) / segmentTotal),
        }));
    const slotLabels = locale === "ja"
        ? ["6時", "8時", "10時", "12時", "14時", "16時"]
        : ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM"];
    const slotValues = [42, 84, 58, 156, 92, 46];
    const slots = slotLabels.map((label, index) => ({
        label,
        value: slotValues[index] ?? 0,
        segments: createSlotSegments(slotValues[index] ?? 0),
    }));

    return { metrics, segments, slots };
}

export default function ActivityTimelineCardPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const stateData = buildActivityTimelineData(locale);
    const withStateCodeData = (nextCode: string) => `${stateCodeDataByLocale[locale]}\n\n${nextCode}`;

    return (
        <ComponentLayout
            title={meta.activityTimelineCard.title}
            description={meta.activityTimelineCard.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ActivityTimelineCard", href: "/docs/components/activity-timeline-card" },
                { name: "DistributionBar", href: "/docs/components/distribution-bar" },
                { name: "ChartLegend", href: "/docs/components/chart-legend" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Timeline", href: "/docs/components/timeline" },
                { name: "SegmentTimelineCard", href: "/docs/components/segment-timeline-card" },
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "BarChart", href: "/docs/components/bar-chart" },
            ]}
        >
            <ChartPreviewWithControls
                code={codeByLocale[locale]}
                demo="activity-timeline-card"
                embedBase="/embed/activity-timeline-card"
                previewHeight={460}
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
                                ? "概要値、タイムライン、内訳バーを一枚のカードで表示します。"
                                : "Shows summary metrics, a timeline, and segment contribution in one card.",
                            preview: (
                                <ActivityTimelineCard
                                    className="max-w-md"
                                    title={locale === "ja" ? "活動量タイムライン" : "Energy timeline"}
                                    description={locale === "ja" ? "時間帯別の活動量" : "Activity by time slot"}
                                    delta="+18%"
                                    metrics={stateData.metrics}
                                    slots={stateData.slots}
                                    segments={stateData.segments}
                                    max={200}
                                />
                            ),
                            code: withStateCodeData(stateCodeByLocale[locale].default),
                        },
                        {
                            key: "selected",
                            title: locale === "ja" ? "選択中の時間帯" : "Selected time slot",
                            description: locale === "ja"
                                ? "selectedSlot と showSlotValues で、確認中の時間帯と値を明示します。"
                                : "Use selectedSlot and showSlotValues to make the inspected time slot explicit.",
                            preview: (
                                <ActivityTimelineCard
                                    className="max-w-md"
                                    title={locale === "ja" ? "選択中の時間帯" : "Selected time slot"}
                                    description={locale === "ja" ? "12時の活動量" : "12 PM activity"}
                                    delta="+18%"
                                    metrics={stateData.metrics}
                                    slots={stateData.slots}
                                    segments={stateData.slots[3]?.segments ?? stateData.segments}
                                    selectedSlot={3}
                                    showSlotValues
                                    max={200}
                                />
                            ),
                            code: withStateCodeData(stateCodeByLocale[locale].selected),
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト表示" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードやサイドパネルでは variant=\"compact\" で密度を上げます。"
                                : "Use variant=\"compact\" for denser cards and side panels.",
                            preview: (
                                <ActivityTimelineCard
                                    className="max-w-md"
                                    title={locale === "ja" ? "コンパクト表示" : "Compact timeline"}
                                    metrics={stateData.metrics}
                                    slots={stateData.slots}
                                    segments={stateData.segments}
                                    variant="compact"
                                    max={200}
                                />
                            ),
                            code: withStateCodeData(stateCodeByLocale[locale].compact),
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
                    <CodeCopyButton code={usageCodeByLocale[locale]} />
                </div>
                <CodeBlock code={usageCodeByLocale[locale]} />
            </div>
        </ComponentLayout>
    );
}
