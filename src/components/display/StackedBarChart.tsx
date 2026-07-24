"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor, ChartTone, NumberFormatSpec } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
    resolveValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartLegend } from "./ChartLegend"
import { ChartTooltip } from "./chart-tooltip"
import type { StackedBarChartVariantKey } from "./generated/variant-keys"
import { stackedBarChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface StackedBarChartSegment {
    label?: React.ReactNode
    value: number
    color?: ChartColor
}

export interface StackedBarChartGroup {
    label?: React.ReactNode
    segments: StackedBarChartSegment[]
}

export interface StackedBarChartProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: StackedBarChartGroup[]
    variant?: StackedBarChartVariantKey
    max?: number
    normalize?: boolean
    showGrid?: boolean
    showLabels?: boolean
    showValues?: boolean
    showLegend?: boolean
    /**
     * Format each value. **Function prop — pass only from a Client Component**;
     * from a Server Component it breaks `next build`. For RSC-safe numeric
     * formatting use the serializable {@link StackedBarChartProps.valueFormat}. (#338)
     */
    formatValue?: (value: number) => React.ReactNode
    /**
     * Serializable numeric format — the RSC-safe alternative to `formatValue`
     * (`"number" | "compact" | "integer"` preset or `Intl.NumberFormatOptions`).
     * Ignored when `formatValue` is set. Formats with a fixed `en-US` locale. (#338)
     */
    valueFormat?: NumberFormatSpec
    totalLabel?: React.ReactNode
    /**
     * A capacity / limit line on each group's **total**. Draws a reference line and
     * marks over-limit groups with a ring + a `thresholdTone` total readout.
     *
     * Segment colours are never changed — each segment carries its own meaning, so
     * the over-limit signal lives at the group level, not on the stack. The state is
     * also announced in each segment's `aria-label`, so it is never colour-only.
     *
     * Ignored when `normalize` is set: every group is then 100%, so an absolute
     * total has no position on the track. (#285)
     */
    threshold?: number
    /** Accessible name / tooltip label for the threshold line. Defaults to "Limit". */
    thresholdLabel?: React.ReactNode
    /** Tone for the limit line and the over-limit marking. Default `"destructive"`. */
    thresholdTone?: ChartTone
}

const stackedBarChartVariantClasses: Record<StackedBarChartVariantKey, string> = {
    horizontal: "h-[224px] w-full p-0",
    vertical: "h-[224px] w-full p-0",
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function getGroupTotal(group: StackedBarChartGroup) {
    return group.segments.reduce(
        (sum, segment) => sum + getPositiveValue(segment.value),
        0
    )
}

function getMaxTotal(data: StackedBarChartGroup[], max?: number) {
    return Math.max(max ?? 0, ...data.map(getGroupTotal), 1)
}

function getHorizontalGridClass(showLabels: boolean, showValues: boolean) {
    if (showLabels && showValues) {
        return "grid-cols-[minmax(0,0.8fr)_minmax(0,2.8fr)_auto]"
    }

    if (showLabels) {
        return "grid-cols-[minmax(0,1fr)_minmax(0,3fr)]"
    }

    if (showValues) {
        return "grid-cols-[minmax(0,1fr)_auto]"
    }

    return "grid-cols-1"
}

function getStackedSegmentDescription(
    totalLabel: React.ReactNode,
    total: number,
    percentText: string,
    formatValue: (value: number) => React.ReactNode
) {
    return (
        <>
            {totalLabel}: {formatValue(total)} / {percentText}
        </>
    )
}

function getLegendItems(
    data: StackedBarChartGroup[],
    formatValue: (value: number) => React.ReactNode,
    totalLabel: React.ReactNode
) {
    const segmentCount = Math.max(0, ...data.map((group) => group.segments.length))
    const grandTotal = Math.max(
        data.reduce((sum, group) => sum + getGroupTotal(group), 0),
        1
    )

    return Array.from({ length: segmentCount }, (_, index) => {
        const firstSegment = data.find((group) => group.segments[index])?.segments[index]
        const total = data.reduce(
            (sum, group) => sum + getPositiveValue(group.segments[index]?.value ?? 0),
            0
        )
        const percentText = `${defaultChartValueFormatter((total / grandTotal) * 100)}%`

        return {
            label: firstSegment?.label ?? `Segment ${index + 1}`,
            value: formatValue(total),
            color: firstSegment?.color,
            description: [totalLabel, ": ", formatValue(grandTotal), " / ", percentText],
        }
    })
}

const StackedBarChart = React.forwardRef<HTMLDivElement, StackedBarChartProps>(
    (
        {
            className,
            data,
            variant = stackedBarChartDefaultVariantKey,
            max,
            normalize = false,
            showGrid = true,
            showLabels = true,
            showValues = false,
            showLegend = false,
            formatValue: formatValueProp,
            valueFormat,
            totalLabel = "Total",
            threshold,
            thresholdLabel = "Limit",
            thresholdTone = "destructive",
            ...props
        },
        ref
    ) => {
        const formatValue = resolveValueFormatter(formatValueProp, valueFormat)
        // A total-based limit has no position once every group is normalized to
        // 100%, so `threshold` is ignored there. Warn rather than fail quietly. (#285)
        const thresholdActive = threshold !== undefined && !normalize
        if (
            process.env.NODE_ENV !== "production" &&
            threshold !== undefined &&
            normalize
        ) {
            console.warn(
                "[gunjo] StackedBarChart: `threshold` is ignored while `normalize` is set — every group renders at 100%, so an absolute total has no position on the track."
            )
        }
        // Keep the limit line inside the track when it sits above every total.
        const maxTotal = Math.max(getMaxTotal(data, max), thresholdActive ? threshold : 0)
        const thresholdPercent = thresholdActive
            ? normalizeChartValue(threshold, maxTotal)
            : null
        const thresholdText = chartLabelToString(thresholdLabel, "Limit")
        const thresholdColor = getChartColor(thresholdTone, 0)
        const isOverThreshold = (total: number) => thresholdActive && total > threshold
        const overSuffix = (total: number) =>
            isOverThreshold(total) ? ` (over ${thresholdText})` : ""
        const legendItems = getLegendItems(data, formatValue, totalLabel)
        const shouldConstrainVerticalTrack = variant === "vertical" && data.length <= 5
        const verticalTrackStyle: React.CSSProperties = {
            width: "100%",
            maxWidth: shouldConstrainVerticalTrack
                ? `${Math.max(280, data.length * 88)}px`
                : undefined,
            marginInline: shouldConstrainVerticalTrack ? "auto" : undefined,
        }
        const verticalGridStyle: React.CSSProperties = {
            ...verticalTrackStyle,
            gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
        }
        const verticalBarMaxWidth =
            data.length <= 3 ? "4.5rem" : data.length <= 5 ? "4rem" : "3rem"

        if (variant === "horizontal") {
            return (
                <div
                    ref={ref}
                    className={cn(
                        stackedBarChartVariantClasses[variant],
                        "flex flex-col justify-center gap-3",
                        className
                    )}
                    {...props}
                >
                    {data.map((group, groupIndex) => {
                        const total = getGroupTotal(group)
                        const stackPercent = normalize
                            ? 100
                            : normalizeChartValue(total, maxTotal)

                        return (
                            <div
                                key={`${chartLabelToString(group.label, "Group")}-${groupIndex}`}
                                className={cn(
                                    "grid min-w-0 items-center gap-3 text-sm",
                                    getHorizontalGridClass(showLabels, showValues)
                                )}
                            >
                                {showLabels ? (
                                    <span className="truncate text-muted-foreground">
                                        {group.label}
                                    </span>
                                ) : null}
                                <div
                                    className="relative h-4 min-w-0 rounded-full bg-muted"
                                    style={
                                        isOverThreshold(total)
                                            ? { boxShadow: `0 0 0 2px ${thresholdColor}` }
                                            : undefined
                                    }
                                >
                                    {showGrid && !normalize
                                        ? [25, 50, 75].map((percent) => (
                                              <span
                                                  key={percent}
                                                  className="pointer-events-none absolute inset-y-0 border-l border-dashed border-border/70"
                                                  style={{ left: `${percent}%` }}
                                                  aria-hidden="true"
                                              />
                                          ))
                                        : null}
                                    {thresholdPercent !== null ? (
                                        <span
                                            className="pointer-events-none absolute inset-y-[-3px] z-20 border-l-2"
                                            style={{ left: `${thresholdPercent}%`, borderColor: thresholdColor }}
                                            aria-hidden="true"
                                        />
                                    ) : null}
                                    <div
                                        className="flex h-full overflow-hidden rounded-full"
                                        style={{ width: `${stackPercent}%` }}
                                    >
                                        {group.segments.map((segment, segmentIndex) => {
                                            const percent = normalizeChartValue(
                                                getPositiveValue(segment.value),
                                                total
                                            )
                                            const percentText = `${formatValue(percent)}%`

                                            return (
                                                <ChartTooltip
                                                    key={`${chartLabelToString(segment.label, "Segment")}-${segmentIndex}`}
                                                    label={
                                                        <>
                                                            {group.label}
                                                            {group.label && segment.label ? " / " : null}
                                                            {segment.label}
                                                        </>
                                                    }
                                                    value={formatValue(segment.value)}
                                                    description={getStackedSegmentDescription(
                                                        totalLabel,
                                                        total,
                                                        percentText,
                                                        formatValue
                                                    )}
                                                >
                                                    <span
                                                        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                        style={{
                                                            width: `${percent}%`,
                                                            backgroundColor: getChartColor(
                                                                segment.color,
                                                                segmentIndex
                                                            ),
                                                            boxShadow:
                                                                segmentIndex < group.segments.length - 1
                                                                    ? "inset -1px 0 0 hsl(var(--background) / 0.65)"
                                                                    : undefined,
                                                        }}
                                                        tabIndex={0}
                                                        aria-label={`${chartLabelToString(group.label, "Group")} ${chartLabelToString(segment.label, "Segment")}: ${formatValue(segment.value)} (${chartLabelToString(totalLabel, "Total")} ${formatValue(total)} / ${percentText})${overSuffix(total)}`}
                                                    />
                                                </ChartTooltip>
                                            )
                                        })}
                                    </div>
                                </div>
                                {showValues ? (
                                    <span
                                        className={cn(
                                            "text-xs tabular-nums",
                                            isOverThreshold(total) ? "font-medium" : "text-muted-foreground"
                                        )}
                                        style={isOverThreshold(total) ? { color: thresholdColor } : undefined}
                                    >
                                        {formatValue(total)}
                                    </span>
                                ) : null}
                            </div>
                        )
                    })}
                    {showLegend ? (
                        <ChartLegend items={legendItems} variant="horizontal" />
                    ) : null}
                </div>
            )
        }

        return (
            <div
                ref={ref}
                className={cn(
                    stackedBarChartVariantClasses[variant],
                    "flex flex-col justify-end",
                    className
                )}
                {...props}
            >
                {showValues ? (
                    <div
                        className="grid pb-1 text-xs font-medium tabular-nums text-foreground"
                        style={verticalGridStyle}
                    >
                        {data.map((group, index) => {
                            const groupTotal = getGroupTotal(group)
                            return (
                                <span
                                    key={`${chartLabelToString(group.label, "Group")}-value-${index}`}
                                    className="min-w-0 truncate text-center"
                                    style={isOverThreshold(groupTotal) ? { color: thresholdColor } : undefined}
                                >
                                    {formatValue(groupTotal)}
                                </span>
                            )
                        })}
                    </div>
                ) : null}
                <div
                    className="relative flex min-h-0 flex-1 items-end gap-2 border-b border-border/70"
                    style={verticalTrackStyle}
                >
                    {showGrid
                        ? [25, 50, 75].map((percent) => (
                              <span
                                  key={percent}
                                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-border/70"
                                  style={{ bottom: `${percent}%` }}
                                  aria-hidden="true"
                              />
                          ))
                        : null}
                    {thresholdPercent !== null ? (
                        <span
                            className="pointer-events-none absolute inset-x-0 z-20 border-t-2"
                            style={{ bottom: `${thresholdPercent}%`, borderColor: thresholdColor }}
                            aria-hidden="true"
                        />
                    ) : null}
                    {data.map((group, groupIndex) => {
                        const total = getGroupTotal(group)
                        const stackPercent = normalize
                            ? 100
                            : normalizeChartValue(total, maxTotal)

                        return (
                            <div
                                key={`${chartLabelToString(group.label, "Group")}-${groupIndex}`}
                                className="relative z-10 flex h-full min-w-0 flex-1 items-end justify-center"
                            >
                                <div
                                    className="flex w-full flex-col-reverse overflow-hidden rounded-t-md bg-muted shadow-sm"
                                    style={{
                                        height: `${stackPercent}%`,
                                        maxWidth: verticalBarMaxWidth,
                                        boxShadow: isOverThreshold(total)
                                            ? `0 0 0 2px ${thresholdColor}`
                                            : undefined,
                                    }}
                                >
                                    {group.segments.map((segment, segmentIndex) => {
                                        const percent = normalizeChartValue(
                                            getPositiveValue(segment.value),
                                            total
                                        )
                                        const percentText = `${formatValue(percent)}%`

                                        return (
                                            <ChartTooltip
                                                key={`${chartLabelToString(segment.label, "Segment")}-${segmentIndex}`}
                                                label={
                                                    <>
                                                        {group.label}
                                                        {group.label && segment.label ? " / " : null}
                                                        {segment.label}
                                                    </>
                                                }
                                                value={formatValue(segment.value)}
                                                description={getStackedSegmentDescription(
                                                    totalLabel,
                                                    total,
                                                    percentText,
                                                    formatValue
                                                )}
                                            >
                                                <span
                                                    className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                    style={{
                                                        height: `${percent}%`,
                                                        backgroundColor: getChartColor(
                                                            segment.color,
                                                            segmentIndex
                                                        ),
                                                        boxShadow:
                                                            segmentIndex < group.segments.length - 1
                                                                ? "inset 0 1px 0 hsl(var(--background) / 0.65)"
                                                                : undefined,
                                                    }}
                                                    tabIndex={0}
                                                    aria-label={`${chartLabelToString(group.label, "Group")} ${chartLabelToString(segment.label, "Segment")}: ${formatValue(segment.value)} (${chartLabelToString(totalLabel, "Total")} ${formatValue(total)} / ${percentText})${overSuffix(total)}`}
                                                />
                                            </ChartTooltip>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {showLabels ? (
                    <div
                        className="grid pt-2 text-xs text-muted-foreground"
                        style={verticalGridStyle}
                    >
                        {data.map((group, index) => (
                            <span
                                key={`${chartLabelToString(group.label, "Group")}-label-${index}`}
                                className="min-w-0 truncate text-center"
                            >
                                {group.label}
                            </span>
                        ))}
                    </div>
                ) : null}
                {showLegend ? (
                    <div className="pt-3">
                        <ChartLegend items={legendItems} variant="horizontal" />
                    </div>
                ) : null}
            </div>
        )
    }
)
StackedBarChart.displayName = "StackedBarChart"

export { StackedBarChart }
