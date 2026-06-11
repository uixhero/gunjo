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
import type { ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    clamp,
    defaultChartValueFormatter,
    getChartColor,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { SegmentTimelineCardVariantKey } from "./generated/variant-keys"
import { segmentTimelineCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface SegmentTimelineMetric {
    label: React.ReactNode
    value: React.ReactNode
    description?: React.ReactNode
}

export interface SegmentTimelineSegment extends ChartDataPoint {
    start: number
    end: number
    description?: React.ReactNode
}

export interface SegmentTimelineMarker {
    value: number
    label?: React.ReactNode
    description?: React.ReactNode
}

export interface SegmentTimelineCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    segments: SegmentTimelineSegment[]
    metrics?: SegmentTimelineMetric[]
    title?: React.ReactNode
    description?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    caption?: React.ReactNode
    variant?: SegmentTimelineCardVariantKey
    selectedIndex?: number
    min?: number
    max?: number
    startLabel?: React.ReactNode
    endLabel?: React.ReactNode
    markers?: SegmentTimelineMarker[]
    showLegend?: boolean
    formatValue?: (value: number) => React.ReactNode
    rangeLabel?: React.ReactNode
    onSegmentSelect?: (segment: SegmentTimelineSegment, index: number) => void
}

type SegmentTimelineCardClassNames = {
    card: string
    header: string
    content: string
    metric: string
    timeline: string
    title: string
}

const variantClasses: Record<SegmentTimelineCardVariantKey, SegmentTimelineCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        metric: "px-3 py-2",
        timeline: "h-20",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        metric: "px-3 py-2.5",
        timeline: "h-24",
        title: "text-base",
    },
}

function getFiniteValue(value: number, fallback = 0) {
    return Number.isFinite(value) ? value : fallback
}

function getTimelineBounds(
    segments: SegmentTimelineSegment[],
    min?: number,
    max?: number
) {
    const segmentStarts = segments.map((segment) => getFiniteValue(segment.start))
    const segmentEnds = segments.map((segment) => getFiniteValue(segment.end))
    const resolvedMin = min ?? Math.min(...segmentStarts, 0)
    const resolvedMax = Math.max(max ?? Math.max(...segmentEnds, 1), resolvedMin + 1)

    return {
        min: resolvedMin,
        max: resolvedMax,
        range: resolvedMax - resolvedMin,
    }
}

function getSegmentPosition(
    segment: SegmentTimelineSegment,
    min: number,
    range: number
) {
    const start = clamp(((getFiniteValue(segment.start) - min) / range) * 100)
    const end = clamp(((getFiniteValue(segment.end) - min) / range) * 100)
    const left = Math.min(start, end)
    const width = Math.max(Math.abs(end - start), 0)

    return { left, width }
}

function getMarkerPosition(marker: SegmentTimelineMarker, min: number, range: number) {
    return clamp(((getFiniteValue(marker.value) - min) / range) * 100)
}

function getSegmentDuration(segment: SegmentTimelineSegment) {
    return Math.max(
        getFiniteValue(segment.end) - getFiniteValue(segment.start),
        0
    )
}

function getSegmentLegendItems(segments: SegmentTimelineSegment[]) {
    const items: Array<{
        label: React.ReactNode
        labelString: string
        duration: number
        color?: SegmentTimelineSegment["color"]
        description?: React.ReactNode
        firstIndex: number
    }> = []
    const itemIndexes = new Map<string, number>()

    segments.forEach((segment, index) => {
        const labelString = chartLabelToString(segment.label, `Segment ${index + 1}`)
        const existingIndex = itemIndexes.get(labelString)
        const duration = getSegmentDuration(segment)

        if (existingIndex === undefined) {
            itemIndexes.set(labelString, items.length)
            items.push({
                label: segment.label,
                labelString,
                duration,
                color: segment.color,
                description: segment.description,
                firstIndex: index,
            })
            return
        }

        items[existingIndex].duration += duration
    })

    return items
}

const SegmentTimelineCard = React.forwardRef<
    HTMLDivElement,
    SegmentTimelineCardProps
>(
    (
        {
            className,
            segments,
            metrics = [],
            title = "Segment timeline",
            description,
            delta,
            deltaDescription,
            caption,
            variant = segmentTimelineCardDefaultVariantKey,
            selectedIndex,
            min,
            max,
            startLabel,
            endLabel,
            markers = [],
            showLegend = true,
            formatValue = defaultChartValueFormatter,
            rangeLabel = "Range",
            onSegmentSelect,
            ...props
        },
        ref
    ) => {
        const styles = variantClasses[variant]
        const bounds = getTimelineBounds(segments, min, max)
        const selectedSegmentLabel =
            selectedIndex === undefined
                ? undefined
                : segments[selectedIndex]
                  ? chartLabelToString(segments[selectedIndex].label, "Segment")
                  : undefined
        const legendItems = getSegmentLegendItems(segments)

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
                    {metrics.length > 0 ? (
                        <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                            {metrics.map((metric, index) => {
                                const metricLabel = chartLabelToString(metric.label, "Metric")

                                return (
                                    <ChartTooltip
                                        key={`${metricLabel}-${index}`}
                                        label={metric.label}
                                        value={metric.value}
                                        description={metric.description}
                                    >
                                        <div
                                            className={cn(
                                                "min-w-0 rounded-md border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                styles.metric
                                            )}
                                            tabIndex={0}
                                            role="group"
                                            aria-label={`${metricLabel}: ${chartLabelToString(metric.value, "")}`}
                                        >
                                            <div className="truncate text-xl font-semibold tracking-tight tabular-nums">
                                                {metric.value}
                                            </div>
                                            <div className="mt-1 truncate text-xs text-muted-foreground">
                                                {metric.label}
                                            </div>
                                            {metric.description ? (
                                                <div className="mt-1 truncate text-xs text-muted-foreground">
                                                    {metric.description}
                                                </div>
                                            ) : null}
                                        </div>
                                    </ChartTooltip>
                                )
                            })}
                        </div>
                    ) : null}

                    <div className="min-w-0 overflow-x-auto overflow-y-hidden pb-1">
                        <div className="min-w-[36rem] space-y-2 sm:min-w-0">
                            <div
                                className={cn(
                                    "relative min-w-0 rounded-lg border bg-muted/20 px-3",
                                    styles.timeline
                                )}
                            >
                                <div className="absolute inset-x-3 top-1/2 h-9 -translate-y-1/2 rounded-md bg-muted/50" />
                                {segments.map((segment, index) => {
                                    const position = getSegmentPosition(
                                        segment,
                                        bounds.min,
                                        bounds.range
                                    )
                                    const segmentLabel = chartLabelToString(
                                        segment.label,
                                        `Segment ${index + 1}`
                                    )
                                    const isSelected =
                                        selectedSegmentLabel === undefined
                                            ? selectedIndex === index
                                            : selectedSegmentLabel === segmentLabel
                                    const duration = getSegmentDuration(segment)

                                    return (
                                        <ChartTooltip
                                            key={`${chartLabelToString(segment.label, "Segment")}-${index}`}
                                            label={segment.label}
                                            value={formatValue(duration)}
                                            description={
                                                segment.description ?? [
                                                    rangeLabel,
                                                    ": ",
                                                    formatValue(segment.start),
                                                    " - ",
                                                    formatValue(segment.end),
                                                ]
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={cn(
                                                    "absolute top-1/2 h-9 -translate-y-1/2 rounded-md transition-[opacity,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                    onSegmentSelect
                                                        ? "cursor-pointer hover:scale-y-110"
                                                        : "cursor-default",
                                                    selectedIndex !== undefined &&
                                                        !isSelected &&
                                                        "opacity-45",
                                                    isSelected &&
                                                        "shadow-[0_0_0_2px_hsl(var(--foreground))]"
                                                )}
                                                style={{
                                                    left: `calc(${position.left}% + 0.75rem)`,
                                                    width: `max(calc(${position.width}% - 1.5rem), 0.625rem)`,
                                                    backgroundColor: getChartColor(
                                                        segment.color,
                                                        index
                                                    ),
                                                }}
                                                onClick={() => onSegmentSelect?.(segment, index)}
                                                aria-label={`${chartLabelToString(segment.label, "Segment")}: ${formatValue(duration)}`}
                                            />
                                        </ChartTooltip>
                                    )
                                })}
                                {markers.map((marker, index) => {
                                    const left = getMarkerPosition(
                                        marker,
                                        bounds.min,
                                        bounds.range
                                    )

                                    return (
                                        <ChartTooltip
                                            key={`${chartLabelToString(marker.label, "Marker")}-${index}`}
                                            label={marker.label}
                                            value={formatValue(marker.value)}
                                            description={marker.description}
                                        >
                                            <span
                                                className="absolute top-3 h-[calc(100%-1.5rem)] w-px cursor-default border-l border-dashed border-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                style={{
                                                    left: `calc(${left}% + 0.75rem)`,
                                                }}
                                                tabIndex={0}
                                                role="img"
                                                aria-label={`${chartLabelToString(marker.label, "Marker")}: ${formatValue(marker.value)}`}
                                            />
                                        </ChartTooltip>
                                    )
                                })}
                            </div>
                            {(startLabel || endLabel) ? (
                                <div className="flex min-w-0 items-center justify-between gap-3 text-xs text-muted-foreground">
                                    <span className="min-w-0 flex-1 truncate">
                                        {startLabel}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-right">
                                        {endLabel}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {showLegend ? (
                        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                            {legendItems.map((item) => {
                                const segment = segments[item.firstIndex]
                                const isSelected =
                                    selectedSegmentLabel === item.labelString

                                return (
                                    <ChartTooltip
                                        key={`${item.labelString}-row`}
                                        label={item.label}
                                        value={formatValue(item.duration)}
                                        description={item.description}
                                    >
                                        <button
                                            type="button"
                                            className={cn(
                                                "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-md border bg-card px-3 py-2 text-left transition-colors",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                onSegmentSelect
                                                    ? "cursor-pointer hover:bg-accent/10"
                                                    : "cursor-default",
                                                isSelected && "border-foreground shadow-sm"
                                            )}
                                            onClick={() =>
                                                onSegmentSelect?.(segment, item.firstIndex)
                                            }
                                        >
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{
                                                    backgroundColor: getChartColor(
                                                        item.color,
                                                        item.firstIndex
                                                    ),
                                                }}
                                                aria-hidden="true"
                                            />
                                            <span className="min-w-0 truncate text-xs text-muted-foreground">
                                                {item.label}
                                            </span>
                                            <span className="text-sm font-semibold tabular-nums">
                                                {formatValue(item.duration)}
                                            </span>
                                        </button>
                                    </ChartTooltip>
                                )
                            })}
                        </div>
                    ) : null}

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
SegmentTimelineCard.displayName = "SegmentTimelineCard"

export { SegmentTimelineCard }
