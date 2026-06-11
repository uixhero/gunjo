"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
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
    formatValue?: (value: number) => React.ReactNode
    totalLabel?: React.ReactNode
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
            formatValue = defaultChartValueFormatter,
            totalLabel = "Total",
            ...props
        },
        ref
    ) => {
        const maxTotal = getMaxTotal(data, max)
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
                                <div className="relative h-4 min-w-0 rounded-full bg-muted">
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
                                                        aria-label={`${chartLabelToString(group.label, "Group")} ${chartLabelToString(segment.label, "Segment")}: ${formatValue(segment.value)} (${chartLabelToString(totalLabel, "Total")} ${formatValue(total)} / ${percentText})`}
                                                    />
                                                </ChartTooltip>
                                            )
                                        })}
                                    </div>
                                </div>
                                {showValues ? (
                                    <span className="text-xs tabular-nums text-muted-foreground">
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
                        {data.map((group, index) => (
                            <span
                                key={`${chartLabelToString(group.label, "Group")}-value-${index}`}
                                className="min-w-0 truncate text-center"
                            >
                                {formatValue(getGroupTotal(group))}
                            </span>
                        ))}
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
                                                    aria-label={`${chartLabelToString(group.label, "Group")} ${chartLabelToString(segment.label, "Segment")}: ${formatValue(segment.value)} (${chartLabelToString(totalLabel, "Total")} ${formatValue(total)} / ${percentText})`}
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
