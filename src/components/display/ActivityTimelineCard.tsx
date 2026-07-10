"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./Card"
import type { ChartColor, NumberFormatSpec } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
    resolveValueFormatter,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { ActivityTimelineCardVariantKey } from "./generated/variant-keys"
import { activityTimelineCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface ActivityTimelineMetric {
    label: React.ReactNode
    value: React.ReactNode
    description?: React.ReactNode
    tooltip?: React.ReactNode
}

export interface ActivityTimelineSlot {
    label: React.ReactNode
    value: number
    color?: ChartColor
    segments?: ActivityTimelineSegment[]
    description?: React.ReactNode
}

export interface ActivityTimelineSegment {
    label: React.ReactNode
    value: number
    color?: ChartColor
    description?: React.ReactNode
}

export interface ActivityTimelineCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    metrics: ActivityTimelineMetric[]
    slots: ActivityTimelineSlot[]
    segments: ActivityTimelineSegment[]
    title?: React.ReactNode
    description?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    caption?: React.ReactNode
    variant?: ActivityTimelineCardVariantKey
    max?: number
    selectedSlot?: number
    showSlotValues?: boolean
    /**
     * Format each value. **Function prop — pass only from a Client Component**;
     * from a Server Component it breaks `next build`. For RSC-safe numeric
     * formatting use the serializable {@link ActivityTimelineCardProps.valueFormat}. (#338)
     */
    formatValue?: (value: number) => React.ReactNode
    /**
     * Serializable numeric format — the RSC-safe alternative to `formatValue`
     * (`"number" | "compact" | "integer"` preset or `Intl.NumberFormatOptions`).
     * Ignored when `formatValue` is set. Formats with a fixed `en-US` locale. (#338)
     */
    valueFormat?: NumberFormatSpec
    totalLabel?: React.ReactNode
    onSlotSelect?: (slot: ActivityTimelineSlot, index: number) => void
}

type ActivityTimelineCardClassNames = {
    card: string
    header: string
    content: string
    timeline: string
    bar: string
    title: string
}

const variantClasses: Record<ActivityTimelineCardVariantKey, ActivityTimelineCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        timeline: "h-28",
        bar: "rounded-t",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        timeline: "h-36",
        bar: "rounded-t-md",
        title: "text-base",
    },
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function getMaxValue(slots: ActivityTimelineSlot[], max?: number) {
    return Math.max(max ?? 0, ...slots.map((slot) => getPositiveValue(slot.value)), 1)
}

function getSegmentTotal(segments: ActivityTimelineSegment[]) {
    return Math.max(
        segments.reduce((sum, segment) => sum + getPositiveValue(segment.value), 0),
        1
    )
}

const ActivityTimelineCard = React.forwardRef<
    HTMLDivElement,
    ActivityTimelineCardProps
>(
    (
        {
            className,
            metrics,
            slots,
            segments,
            title = "Activity timeline",
            description,
            delta,
            deltaDescription,
            caption,
            variant = activityTimelineCardDefaultVariantKey,
            max,
            selectedSlot,
            showSlotValues = false,
            formatValue: formatValueProp,
            valueFormat,
            totalLabel = "Total",
            onSlotSelect,
            ...props
        },
        ref
    ) => {
        const formatValue = resolveValueFormatter(formatValueProp, valueFormat)
        const styles = variantClasses[variant]
        const maxValue = getMaxValue(slots, max)
        const segmentTotal = getSegmentTotal(segments)
        const canSelectSlots = typeof onSlotSelect === "function"
        const [selectedSegmentIndex, setSelectedSegmentIndex] = React.useState<
            number | null
        >(null)
        const [hoveredSegmentIndex, setHoveredSegmentIndex] = React.useState<
            number | null
        >(null)
        const activeSegmentIndex = hoveredSegmentIndex ?? selectedSegmentIndex

        return (
            <Card
                ref={ref}
                className={cn("w-full min-w-0 overflow-hidden p-0", styles.card, className)}
                {...props}
            >
                <CardHeader className={styles.header}>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                            <CardTitle className={cn("truncate", styles.title)}>
                                {title}
                            </CardTitle>
                            {description ? (
                                <CardDescription className="text-xs">
                                    {description}
                                </CardDescription>
                            ) : null}
                        </div>
                        {delta !== undefined && delta !== null ? (
                            <div
                                className="shrink-0 text-right text-sm font-semibold text-success-strong tabular-nums"
                                title={chartLabelToString(
                                    deltaDescription,
                                    "Delta description"
                                )}
                            >
                                {delta}
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent className={cn("space-y-4", styles.content)}>
                    <div className="grid min-w-0 grid-cols-3 gap-3">
                        {metrics.slice(0, 3).map((metric, index) => {
                            const tooltipDescription =
                                metric.tooltip ?? metric.description

                            return (
                                <ChartTooltip
                                    key={`${chartLabelToString(metric.label, "Metric")}-${index}`}
                                    label={metric.label}
                                    value={metric.value}
                                    description={tooltipDescription}
                                >
                                    <div
                                        className="min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        tabIndex={0}
                                    >
                                        <div className="truncate text-2xl font-semibold leading-none tabular-nums">
                                            {metric.value}
                                        </div>
                                        <div className="mt-1 truncate text-xs text-muted-foreground">
                                            {metric.label}
                                        </div>
                                        {metric.description ? (
                                            <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {metric.description}
                                            </div>
                                        ) : null}
                                    </div>
                                </ChartTooltip>
                            )
                        })}
                    </div>

                    <div className="min-w-0 space-y-2">
                        <div
                            className={cn(
                                "flex min-w-0 items-end gap-1 border-b border-dashed border-border/70",
                                styles.timeline
                            )}
                        >
                            {slots.map((slot, index) => {
                                const value = getPositiveValue(slot.value)
                                const percent = normalizeChartValue(value, maxValue)
                                const isSelected = selectedSlot === index
                                const color = getChartColor(slot.color, index)
                                const label = chartLabelToString(slot.label, "Time")
                                const slotSegments = slot.segments ?? []
                                const slotSegmentTotal = getSegmentTotal(slotSegments)
                                const hasSlotSegments = slotSegments.some(
                                    (segment) => getPositiveValue(segment.value) > 0
                                )
                                const barContent = (
                                    <span
                                        className={cn(
                                            "relative block w-full min-w-0 overflow-hidden bg-muted",
                                            styles.bar,
                                            canSelectSlots &&
                                                "transition-opacity hover:opacity-85 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-1 group-focus-visible:ring-offset-background",
                                            isSelected &&
                                                "ring-2 ring-foreground ring-offset-1 ring-offset-background"
                                        )}
                                        style={{
                                            height: `${Math.max(percent, 4)}%`,
                                            backgroundColor: hasSlotSegments
                                                ? undefined
                                                : color,
                                        }}
                                    >
                                        {hasSlotSegments ? (
                                            <span
                                                className="absolute inset-0 flex flex-col-reverse"
                                                aria-hidden="true"
                                            >
                                                {slotSegments.map((segment, segmentIndex) => {
                                                    const segmentValue = getPositiveValue(
                                                        segment.value
                                                    )
                                                    const segmentPercent = normalizeChartValue(
                                                        segmentValue,
                                                        slotSegmentTotal
                                                    )

                                                    if (segmentValue <= 0) return null

                                                    return (
                                                        <span
                                                            key={`${chartLabelToString(segment.label, "Segment")}-${segmentIndex}`}
                                                            className="block min-h-px w-full transition-opacity duration-150 ease-out"
                                                            style={{
                                                                height: `${segmentPercent}%`,
                                                                backgroundColor: getChartColor(
                                                                    segment.color,
                                                                    segmentIndex
                                                                ),
                                                                opacity:
                                                                    activeSegmentIndex ===
                                                                        null ||
                                                                    activeSegmentIndex ===
                                                                        segmentIndex
                                                                        ? 1
                                                                        : 0.28,
                                                                boxShadow:
                                                                    segmentIndex <
                                                                    slotSegments.length - 1
                                                                        ? "inset 0 1px 0 hsl(var(--background) / 0.75)"
                                                                        : undefined,
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </span>
                                        ) : null}
                                        {showSlotValues ? (
                                            <span className="absolute inset-x-0 top-1 z-10 truncate px-0.5 text-center text-[10px] font-medium text-background">
                                                {formatValue(value)}
                                            </span>
                                        ) : null}
                                    </span>
                                )

                                return (
                                    <ChartTooltip
                                        key={`${label}-${index}`}
                                        label={slot.label}
                                        value={formatValue(value)}
                                        description={slot.description}
                                    >
                                        {canSelectSlots ? (
                                            <button
                                                type="button"
                                                className={cn(
                                                    "group flex h-full min-h-0 min-w-0 flex-1 appearance-none items-end border-0 bg-transparent p-0 text-left focus-visible:outline-none",
                                                    "cursor-pointer"
                                                )}
                                                aria-current={isSelected ? "true" : undefined}
                                                aria-pressed={isSelected}
                                                aria-label={`${label}: ${chartLabelToString(formatValue(value), "Value")}`}
                                                onClick={() => onSlotSelect?.(slot, index)}
                                            >
                                                {barContent}
                                            </button>
                                        ) : (
                                            <span
                                                className="flex h-full min-h-0 min-w-0 flex-1 items-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                tabIndex={0}
                                                aria-current={isSelected ? "true" : undefined}
                                                aria-label={`${label}: ${chartLabelToString(formatValue(value), "Value")}`}
                                            >
                                                {barContent}
                                            </span>
                                        )}
                                    </ChartTooltip>
                                )
                            })}
                        </div>
                        <div
                            className="grid min-w-0 gap-1"
                            style={{
                                gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))`,
                            }}
                        >
                            {slots.map((slot, index) => (
                                <span
                                    key={`${chartLabelToString(slot.label, "Time")}-label-${index}`}
                                    className="min-w-0 truncate text-center text-xs text-muted-foreground"
                                >
                                    {slot.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 overflow-hidden rounded-full bg-muted">
                            <div className="flex h-full w-full">
                                {segments.map((segment, index) => {
                                    const value = getPositiveValue(segment.value)
                                    const percent = normalizeChartValue(value, segmentTotal)
                                    const percentText = `${defaultChartValueFormatter(percent)}%`

                                    return (
                                        <ChartTooltip
                                            key={`${chartLabelToString(segment.label, "Segment")}-${index}`}
                                            label={segment.label}
                                            value={percentText}
                                            description={
                                                segment.description ?? [
                                                    totalLabel,
                                                    ": ",
                                                    formatValue(value),
                                                ]
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="block h-full min-w-px appearance-none border-0 p-0 transition-opacity duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                style={{
                                                    width: `${percent}%`,
                                                    backgroundColor: getChartColor(
                                                        segment.color,
                                                        index
                                                    ),
                                                    opacity:
                                                        activeSegmentIndex === null ||
                                                        activeSegmentIndex === index
                                                            ? 1
                                                            : 0.35,
                                                    boxShadow:
                                                        index < segments.length - 1
                                                            ? "inset -1px 0 0 hsl(var(--background) / 0.75)"
                                                            : undefined,
                                                }}
                                                onClick={() =>
                                                    setSelectedSegmentIndex((current) =>
                                                        current === index ? null : index
                                                    )
                                                }
                                                onPointerEnter={() =>
                                                    setHoveredSegmentIndex(index)
                                                }
                                                onPointerLeave={() =>
                                                    setHoveredSegmentIndex(null)
                                                }
                                                onFocus={() => setHoveredSegmentIndex(index)}
                                                onBlur={() => setHoveredSegmentIndex(null)}
                                                aria-pressed={selectedSegmentIndex === index}
                                                aria-label={`${chartLabelToString(segment.label, "Segment")}: ${percentText}`}
                                            />
                                        </ChartTooltip>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
                            {segments.map((segment, index) => {
                                const value = getPositiveValue(segment.value)
                                const percent = normalizeChartValue(value, segmentTotal)
                                const percentText = `${defaultChartValueFormatter(percent)}%`

                                return (
                                    <ChartTooltip
                                        key={`${chartLabelToString(segment.label, "Segment")}-stat-${index}`}
                                        label={segment.label}
                                        value={formatValue(value)}
                                        description={`${percentText} / ${chartLabelToString(totalLabel, "Total")}`}
                                    >
                                        <button
                                            type="button"
                                            className={cn(
                                                "w-full min-w-0 rounded-md p-1 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                activeSegmentIndex === index && "bg-muted/60"
                                            )}
                                            onClick={() =>
                                                setSelectedSegmentIndex((current) =>
                                                    current === index ? null : index
                                                )
                                            }
                                            onPointerEnter={() =>
                                                setHoveredSegmentIndex(index)
                                            }
                                            onPointerLeave={() =>
                                                setHoveredSegmentIndex(null)
                                            }
                                            onFocus={() => setHoveredSegmentIndex(index)}
                                            onBlur={() => setHoveredSegmentIndex(null)}
                                            aria-pressed={selectedSegmentIndex === index}
                                            aria-label={`${chartLabelToString(segment.label, "Segment")}: ${chartLabelToString(formatValue(value), "Value")}`}
                                        >
                                            <span className="flex min-w-0 items-center gap-1.5">
                                                <span
                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor: getChartColor(
                                                            segment.color,
                                                            index
                                                        ),
                                                    }}
                                                    aria-hidden="true"
                                                />
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {segment.label}
                                                </span>
                                            </span>
                                            <span className="mt-1 block truncate text-lg font-semibold leading-none tabular-nums">
                                                {formatValue(value)}
                                            </span>
                                        </button>
                                    </ChartTooltip>
                                )
                            })}
                        </div>
                    </div>

                    {caption ? (
                        <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                            {caption}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        )
    }
)
ActivityTimelineCard.displayName = "ActivityTimelineCard"

export { ActivityTimelineCard }
