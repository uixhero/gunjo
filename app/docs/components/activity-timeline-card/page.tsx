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
    { label: "Than yesterday", value: "+23%" },
    { label: "Burned", value: "760 kcal" },
    { label: "Daily avg", value: "253 kcal" },
];

const segments = [
    { label: "Walking", value: 127 },
    { label: "Running", value: 384 },
    { label: "Workout", value: 249 },
];

const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);

const createSlotSegments = (slotValue: number) =>
    segments.map((segment) => ({
        ...segment,
        value: Math.round((slotValue * segment.value) / segmentTotal),
    }));

const slots = [
    { label: "6 AM", value: 42, segments: createSlotSegments(42) },
    { label: "8 AM", value: 84, segments: createSlotSegments(84) },
    { label: "10 AM", value: 58, segments: createSlotSegments(58) },
    { label: "12 PM", value: 156, segments: createSlotSegments(156) },
    { label: "2 PM", value: 92, segments: createSlotSegments(92) },
    { label: "4 PM", value: 46, segments: createSlotSegments(46) },
];

export function ActivityTimelinePanel() {
    const [selectedSlot, setSelectedSlot] = useState(3);
    const selectedSegments = slots[selectedSlot].segments;

    return (
        <ActivityTimelineCard
            title="Energy timeline"
            description="Activity timeline"
            delta="+18%"
            metrics={metrics}
            slots={slots}
            segments={selectedSegments}
            selectedSlot={selectedSlot}
            onSlotSelect={(slot, index) => setSelectedSlot(index)}
            max={200}
            caption="Inspect the selected time slot load and segment contribution."
        />
    );
}`,
    ja: `import { useState } from "react";
import { ActivityTimelineCard } from "@gunjo/ui";

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

const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);

const createSlotSegments = (slotValue: number) =>
    segments.map((segment) => ({
        ...segment,
        value: Math.round((slotValue * segment.value) / segmentTotal),
    }));

const slots = [
    { label: "6時", value: 42, segments: createSlotSegments(42) },
    { label: "8時", value: 84, segments: createSlotSegments(84) },
    { label: "10時", value: 58, segments: createSlotSegments(58) },
    { label: "12時", value: 156, segments: createSlotSegments(156) },
    { label: "14時", value: 92, segments: createSlotSegments(92) },
    { label: "16時", value: 46, segments: createSlotSegments(46) },
];

export function ActivityTimelinePanel() {
    const [selectedSlot, setSelectedSlot] = useState(3);
    const selectedSegments = slots[selectedSlot].segments;

    return (
        <ActivityTimelineCard
            title="活動量タイムライン"
            description="時間帯別の活動量"
            delta="+18%"
            metrics={metrics}
            slots={slots}
            segments={selectedSegments}
            selectedSlot={selectedSlot}
            onSlotSelect={(slot, index) => setSelectedSlot(index)}
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

export function ActivityTimelineCardUsage() {
    return (
        <div className="grid gap-8">
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
            />
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
                selectedSlot={3}
            />
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
                showSlotValues
            />
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
                variant="compact"
            />
        </div>
    );
}`,
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

export function ActivityTimelineCardUsage() {
    return (
        <div className="grid gap-8">
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
            />
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
                selectedSlot={3}
            />
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
                showSlotValues
            />
            <ActivityTimelineCard
                metrics={metrics}
                slots={slots}
                segments={segments}
                variant="compact"
            />
        </div>
    );
}`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `import { ActivityTimelineCard } from "@gunjo/ui";

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

export function ActivityTimelinePanel() {
    return (
        <ActivityTimelineCard
            title="Energy timeline"
            metrics={metrics}
            slots={slots}
            segments={segments}
            max={200}
        />
    );
}`,
        selected: `import { ActivityTimelineCard } from "@gunjo/ui";

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

const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);

const createSlotSegments = (slotValue: number) =>
    segments.map((segment) => ({
        ...segment,
        value: Math.round((slotValue * segment.value) / segmentTotal),
    }));

const slots = [
    { label: "6 AM", value: 42, segments: createSlotSegments(42) },
    { label: "8 AM", value: 84, segments: createSlotSegments(84) },
    { label: "10 AM", value: 58, segments: createSlotSegments(58) },
    { label: "12 PM", value: 156, segments: createSlotSegments(156) },
    { label: "2 PM", value: 92, segments: createSlotSegments(92) },
    { label: "4 PM", value: 46, segments: createSlotSegments(46) },
];

export function SelectedSlotTimeline() {
    return (
        <ActivityTimelineCard
            title="Selected time slot"
            metrics={metrics}
            slots={slots}
            segments={slots[3].segments}
            selectedSlot={3}
            showSlotValues
            max={200}
        />
    );
}`,
        compact: `import { ActivityTimelineCard } from "@gunjo/ui";

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

export function CompactActivityTimeline() {
    return (
        <ActivityTimelineCard
            title="Compact timeline"
            metrics={metrics}
            slots={slots}
            segments={segments}
            variant="compact"
            max={200}
        />
    );
}`,
    },
    ja: {
        default: `import { ActivityTimelineCard } from "@gunjo/ui";

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

export function ActivityTimelinePanel() {
    return (
        <ActivityTimelineCard
            title="活動量タイムライン"
            metrics={metrics}
            slots={slots}
            segments={segments}
            max={200}
        />
    );
}`,
        selected: `import { ActivityTimelineCard } from "@gunjo/ui";

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

const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);

const createSlotSegments = (slotValue: number) =>
    segments.map((segment) => ({
        ...segment,
        value: Math.round((slotValue * segment.value) / segmentTotal),
    }));

const slots = [
    { label: "6時", value: 42, segments: createSlotSegments(42) },
    { label: "8時", value: 84, segments: createSlotSegments(84) },
    { label: "10時", value: 58, segments: createSlotSegments(58) },
    { label: "12時", value: 156, segments: createSlotSegments(156) },
    { label: "14時", value: 92, segments: createSlotSegments(92) },
    { label: "16時", value: 46, segments: createSlotSegments(46) },
];

export function SelectedSlotTimeline() {
    return (
        <ActivityTimelineCard
            title="選択中の時間帯"
            metrics={metrics}
            slots={slots}
            segments={slots[3].segments}
            selectedSlot={3}
            showSlotValues
            max={200}
        />
    );
}`,
        compact: `import { ActivityTimelineCard } from "@gunjo/ui";

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

export function CompactActivityTimeline() {
    return (
        <ActivityTimelineCard
            title="コンパクト表示"
            metrics={metrics}
            slots={slots}
            segments={segments}
            variant="compact"
            max={200}
        />
    );
}`,
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
            description: "Formats timeline values, segment values, and tooltip values. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting.",
        },
        { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)" },
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
            description: "タイムライン、内訳、ツールチップに表示する値のフォーマット関数です。 関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。",
        },
        { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)" },
    ],
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
                            code: stateCodeByLocale[locale].default,
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
                            code: stateCodeByLocale[locale].selected,
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
                            code: stateCodeByLocale[locale].compact,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>1枚に3つの領域を重ねた。</strong>資料はカードの責務を「1つのエンティティを伝えて次の行動へ導く」と定めています。この部品は上から <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">metrics</code>（数値3つ）・時間帯の棒・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> の凡例を1枚に載せていますが、これは3件のエンティティではなく、同じ1つの活動を粗さの違う3段で見せたものです。だから3枚に割らず、カードの中にカードを入れることもしていません。
                        </li>
                        <li>
                            <strong>押せるのは中の印だけで、外枠は押せない。</strong>資料は「カード全体を押せるようにするなら、中にボタンを入れない」を挙げています。GUNJO はこの部品でカードの外枠に何も付けず、時間帯の棒と凡例の行だけを本物の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> にしました。1枚から選べる対象が複数あるので、外枠まで押せるようにすると入れ子になります。
                        </li>
                        <li>
                            <strong>棒の高さの基準を呼ぶ側に開けた。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> を渡さなければ、いちばん高い棒はそのデータの最大値です。カードを2枚並べて比べるときは、同じ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> を渡して基準をそろえます。値の書式は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code>（関数）と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code>（文字列で渡せる形）の2本立てで、サーバーコンポーネントから渡せるのは後者だけです（#338）。
                            <br />
                            一般のカードの設計は UIXHERO の「カード」にあります。{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/card"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: カード（Card）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Three regions stacked into one card.</strong> The article defines a card&rsquo;s job as carrying one entity and pointing at the next action. This component puts <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">metrics</code>, an hour-by-hour bar row and the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">segments</code> legend into a single card, but those are not three entities: they are one activity at three grains. So it is never split into three cards, and no card is nested inside another.
                        </li>
                        <li>
                            <strong>Only the marks inside are clickable; the shell is not.</strong> The article warns against putting a button inside a card that is itself clickable. GUNJO leaves the card shell inert and makes only the slot bars and the legend rows real <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> elements. One card offers several things to pick, so making the shell clickable too would nest interactive roles.
                        </li>
                        <li>
                            <strong>The bar scale stays open to the caller.</strong> Without <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code>, the tallest bar is the largest value in that data set. Pass the same <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max</code> to two cards to put them on one scale. Values format through either <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">formatValue</code> (a function) or <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">valueFormat</code> (a serializable spec); only the latter can be passed from a Server Component (#338).
                            <br />
                            The general design of cards is covered by UIXHERO&rsquo;s card article.{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/card"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Card (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
