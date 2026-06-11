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
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { MiniDistributionBarCardVariantKey } from "./generated/variant-keys"
import { miniDistributionBarCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface MiniDistributionBarCardSegment extends ChartDataPoint {
    detail?: React.ReactNode
    description?: React.ReactNode
}

export interface MiniDistributionBarCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    segments: MiniDistributionBarCardSegment[]
    title?: React.ReactNode
    description?: React.ReactNode
    value?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    selectedIndex?: number
    tickCount?: number
    max?: number
    caption?: React.ReactNode
    variant?: MiniDistributionBarCardVariantKey
    formatValue?: (value: number) => React.ReactNode
    totalLabel?: React.ReactNode
    onSegmentSelect?: (segment: MiniDistributionBarCardSegment, index: number) => void
}

type MiniDistributionBarCardClassNames = {
    card: string
    header: string
    content: string
    tick: string
    title: string
}

const variantClasses: Record<MiniDistributionBarCardVariantKey, MiniDistributionBarCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        tick: "h-7 rounded-sm",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        tick: "h-9 rounded",
        title: "text-base",
    },
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function getTotal(segments: MiniDistributionBarCardSegment[], max?: number) {
    return Math.max(
        max ?? 0,
        segments.reduce((sum, segment) => sum + getPositiveValue(segment.value), 0),
        1
    )
}

function buildTicks(
    segments: MiniDistributionBarCardSegment[],
    tickCount: number,
    total: number
) {
    const safeTickCount = Math.max(1, Math.round(tickCount))
    const rawCounts = segments.map((segment) =>
        Math.max(0, (getPositiveValue(segment.value) / total) * safeTickCount)
    )
    const counts = rawCounts.map(Math.floor)
    let remaining = safeTickCount - counts.reduce((sum, count) => sum + count, 0)
    const order = rawCounts
        .map((count, index) => ({ index, fraction: count - Math.floor(count) }))
        .sort((a, b) => b.fraction - a.fraction)

    for (const item of order) {
        if (remaining <= 0) break
        counts[item.index] += 1
        remaining -= 1
    }

    return counts.flatMap((count, segmentIndex) =>
        Array.from({ length: count }, (_, tickIndex) => ({
            segmentIndex,
            tickIndex,
        }))
    )
}

const MiniDistributionBarCard = React.forwardRef<
    HTMLDivElement,
    MiniDistributionBarCardProps
>(
    (
        {
            className,
            segments,
            title = "Product categories",
            description,
            value,
            delta,
            deltaDescription,
            selectedIndex,
            tickCount = 32,
            max,
            caption,
            variant = miniDistributionBarCardDefaultVariantKey,
            formatValue = defaultChartValueFormatter,
            totalLabel = "Total",
            onSegmentSelect,
            ...props
        },
        ref
    ) => {
        const styles = variantClasses[variant]
        const total = getTotal(segments, max)
        const ticks = buildTicks(segments, tickCount, total)
        const selectedSegment =
            selectedIndex === undefined ? undefined : segments[selectedIndex]
        const selectedPercent =
            selectedSegment === undefined
                ? undefined
                : `${defaultChartValueFormatter(
                      normalizeChartValue(getPositiveValue(selectedSegment.value), total)
                  )}%`

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
                    <div className="flex min-w-0 items-end justify-between gap-4">
                        <div className="min-w-0">
                            {value !== undefined ? (
                                <div className="truncate text-3xl font-semibold tracking-tight tabular-nums">
                                    {value}
                                </div>
                            ) : null}
                            {selectedSegment ? (
                                <div className="mt-1 truncate text-xs text-muted-foreground">
                                    {selectedSegment.label}
                                    {selectedPercent ? ` · ${selectedPercent}` : ""}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div
                        className="grid min-w-0 gap-1"
                        style={{
                            gridTemplateColumns: `repeat(${Math.max(
                                ticks.length,
                                1
                            )}, minmax(0, 1fr))`,
                        }}
                    >
                        {ticks.map(({ segmentIndex, tickIndex }, index) => {
                            const segment = segments[segmentIndex]
                            const percent = normalizeChartValue(
                                getPositiveValue(segment.value),
                                total
                            )
                            const percentLabel = `${defaultChartValueFormatter(percent)}%`
                            const isSelected = selectedIndex === segmentIndex

                            return (
                                <ChartTooltip
                                    key={`${segmentIndex}-${tickIndex}-${index}`}
                                    label={segment.label}
                                    value={percentLabel}
                                    description={
                                        segment.description ?? [
                                            totalLabel,
                                            ": ",
                                            formatValue(segment.value),
                                        ]
                                    }
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            "min-w-0 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                            styles.tick,
                                            selectedIndex !== undefined &&
                                                !isSelected &&
                                                "opacity-45"
                                        )}
                                        style={{
                                            backgroundColor: getChartColor(
                                                segment.color,
                                                segmentIndex
                                            ),
                                        }}
                                        onClick={() => onSegmentSelect?.(segment, segmentIndex)}
                                        aria-label={`${chartLabelToString(segment.label, "Segment")}: ${percentLabel}`}
                                    />
                                </ChartTooltip>
                            )
                        })}
                    </div>

                    <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                        {segments.map((segment, index) => {
                            const percent = `${defaultChartValueFormatter(
                                normalizeChartValue(getPositiveValue(segment.value), total)
                            )}%`
                            const isSelected = selectedIndex === index

                            return (
                                <ChartTooltip
                                    key={`${chartLabelToString(segment.label, "Segment")}-row-${index}`}
                                    label={segment.label}
                                    value={formatValue(segment.value)}
                                    description={segment.description ?? percent}
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-md border bg-card px-3 py-2 text-left transition-colors",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                            isSelected && "border-foreground shadow-sm"
                                        )}
                                        onClick={() => onSegmentSelect?.(segment, index)}
                                    >
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{
                                                backgroundColor: getChartColor(
                                                    segment.color,
                                                    index
                                                ),
                                            }}
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0 truncate text-xs text-muted-foreground">
                                            {segment.label}
                                        </span>
                                        <span className="text-sm font-semibold tabular-nums">
                                            {percent}
                                        </span>
                                        {segment.detail ? (
                                            <span className="col-span-3 truncate text-xs text-muted-foreground">
                                                {segment.detail}
                                            </span>
                                        ) : null}
                                    </button>
                                </ChartTooltip>
                            )
                        })}
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
MiniDistributionBarCard.displayName = "MiniDistributionBarCard"

export { MiniDistributionBarCard }
