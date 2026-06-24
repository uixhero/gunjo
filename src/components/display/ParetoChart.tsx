"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor } from "./chart-utils"
import {
    chartLabelToString,
    clamp,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"

export interface ParetoDatum {
    label?: React.ReactNode
    /** Count / minutes / cost for this category. */
    value: number
    color?: ChartColor
}

export interface ParetoChartProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: ParetoDatum[]
    /**
     * Cumulative-axis reference line in percent (0–100) — the classic Pareto
     * "vital few" cutoff. Default `80`. Pass `null` to hide it.
     */
    threshold?: number | null
    /** Label for the threshold line. Defaults to `"<threshold>%"`. */
    thresholdLabel?: React.ReactNode
    /**
     * Sort the data descending by value before plotting (the Pareto
     * convention). Default `true`; set `false` to keep the given order.
     */
    sort?: boolean
    /** Format the bar values (counts / minutes). */
    formatValue?: (value: number) => React.ReactNode
    /** Format the cumulative percentage. Default `"<n>%"`. */
    formatPercent?: (percent: number) => React.ReactNode
    /** Draw the dashed horizontal grid (right axis 25/50/75/100%). Default `true`. */
    showGrid?: boolean
    /** Render the value above each bar. Default `false`. */
    showValues?: boolean
    /** Show the legend (bars / cumulative / threshold). Default `true`. */
    showLegend?: boolean
    /** Accessible name for the chart. */
    label?: React.ReactNode
    /** Legend / tooltip label for the cumulative line. Default `"Cumulative"`. */
    cumulativeLabel?: React.ReactNode
}

interface ParetoPoint {
    index: number
    label: React.ReactNode
    value: number
    color?: ChartColor
    /** Bar height as a fraction of the tallest bar (0–100). */
    barPercent: number
    /** Running cumulative share of the total (0–100). */
    cumulative: number
    /** Centre x of this column (0–100). */
    x: number
}

const CUMULATIVE_STROKE = "hsl(var(--foreground))"

/**
 * Pareto chart: descending value bars overlaid with a cumulative-% line and a
 * "vital few" threshold (80% by default). Bars are HTML/CSS (left value axis,
 * scaled to the tallest bar); the cumulative line is a single SVG polyline on a
 * right 0–100% axis, with focusable points and an accessible per-category
 * summary. For defect / downtime / cause analysis and any "which few drive most
 * of the total" breakdown. (#270)
 */
const ParetoChart = React.forwardRef<HTMLDivElement, ParetoChartProps>(
    (
        {
            className,
            data,
            threshold = 80,
            thresholdLabel,
            sort = true,
            formatValue = defaultChartValueFormatter,
            formatPercent = (percent: number) => `${Math.round(percent)}%`,
            showGrid = true,
            showValues = false,
            showLegend = true,
            label,
            cumulativeLabel = "Cumulative",
            ...props
        },
        ref
    ) => {
        const sorted = sort
            ? [...data].sort((a, b) => b.value - a.value)
            : data
        const total =
            sorted.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1
        const maxValue = Math.max(...sorted.map((item) => item.value), 1)
        const count = sorted.length || 1

        let running = 0
        const points: ParetoPoint[] = sorted.map((item, index) => {
            running += Math.max(0, item.value)
            return {
                index,
                label: item.label,
                value: item.value,
                color: item.color,
                barPercent: normalizeChartValue(item.value, maxValue),
                cumulative: clamp((running / total) * 100),
                x: ((index + 0.5) / count) * 100,
            }
        })

        const thresholdPercent =
            threshold === null || threshold === undefined
                ? null
                : clamp(threshold)
        const resolvedThresholdLabel =
            thresholdLabel ??
            (thresholdPercent !== null ? `${Math.round(thresholdPercent)}%` : "")
        const cumulativeText = chartLabelToString(cumulativeLabel, "Cumulative")

        const linePoints = points
            .map((point) => `${point.x},${100 - point.cumulative}`)
            .join(" ")

        const summary = `${
            label ? `${chartLabelToString(label, "")}: ` : ""
        }Pareto chart — ${points
            .map(
                (point) =>
                    `${chartLabelToString(point.label, `#${point.index + 1}`)} ${defaultFormat(
                        point.value,
                        formatValue
                    )}, ${cumulativeText} ${formatPercentText(point.cumulative, formatPercent)}`
            )
            .join("; ")}`

        return (
            <div
                ref={ref}
                role="img"
                aria-label={summary}
                className={cn("flex w-full min-w-0 flex-col gap-3 p-0", className)}
                data-slot="pareto-chart"
                {...props}
            >
                <div className="relative h-[220px] w-full border-b border-l border-border/70">
                    {/* horizontal grid + right-axis percent ticks */}
                    {showGrid
                        ? [25, 50, 75, 100].map((percent) => (
                              <span
                                  key={`grid-${percent}`}
                                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-border/60"
                                  style={{ top: `${100 - percent}%` }}
                                  aria-hidden="true"
                              >
                                  <span className="absolute right-0 -top-2 translate-x-full pl-1 text-[10px] tabular-nums text-muted-foreground">
                                      {percent}%
                                  </span>
                              </span>
                          ))
                        : null}

                    {/* threshold line (the "vital few" cutoff) */}
                    {thresholdPercent !== null ? (
                        <ChartTooltip label={cumulativeLabel} value={resolvedThresholdLabel}>
                            <span
                                className="absolute inset-x-0 z-20 h-4 -translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                style={{ top: `${100 - thresholdPercent}%` }}
                                tabIndex={0}
                                aria-label={`${cumulativeText} ${resolvedThresholdLabel}`}
                            >
                                <span
                                    className="pointer-events-none absolute inset-x-0 top-1/2 border-t-2 border-dashed border-warning"
                                    aria-hidden="true"
                                />
                            </span>
                        </ChartTooltip>
                    ) : null}

                    {/* bars (HTML/CSS, left value axis) */}
                    <div
                        className="absolute inset-0 grid"
                        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
                    >
                        {points.map((point) => (
                            <div
                                key={`bar-${chartLabelToString(point.label, String(point.index))}-${point.index}`}
                                className="relative flex items-end justify-center"
                            >
                                <ChartTooltip
                                    label={point.label}
                                    value={formatValue(point.value)}
                                    description={[
                                        cumulativeLabel,
                                        ": ",
                                        formatPercent(point.cumulative),
                                    ]}
                                >
                                    <div
                                        className="w-full max-w-12 rounded-t-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        style={{
                                            height: `${point.barPercent}%`,
                                            backgroundColor: getChartColor(point.color, point.index),
                                        }}
                                        tabIndex={0}
                                        aria-label={`${chartLabelToString(
                                            point.label,
                                            `#${point.index + 1}`
                                        )}: ${defaultFormat(point.value, formatValue)} (${cumulativeText} ${formatPercentText(
                                            point.cumulative,
                                            formatPercent
                                        )})`}
                                    />
                                </ChartTooltip>
                                {showValues ? (
                                    <span
                                        className="absolute text-[10px] font-medium tabular-nums text-foreground"
                                        style={{ bottom: `calc(${point.barPercent}% + 0.25rem)` }}
                                    >
                                        {formatValue(point.value)}
                                    </span>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    {/* cumulative line (SVG polyline — the one thing bars can't do) */}
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polyline
                            points={linePoints}
                            fill="none"
                            stroke={CUMULATIVE_STROKE}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    {/* cumulative points (HTML dots stay round; focusable for detail) */}
                    {points.map((point) => (
                        <ChartTooltip
                            key={`pt-${chartLabelToString(point.label, String(point.index))}-${point.index}`}
                            label={<>{cumulativeLabel} / {point.label}</>}
                            value={formatPercent(point.cumulative)}
                        >
                            <span
                                className="absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                style={{ left: `${point.x}%`, top: `${100 - point.cumulative}%` }}
                                tabIndex={0}
                                aria-label={`${cumulativeText} ${chartLabelToString(
                                    point.label,
                                    `#${point.index + 1}`
                                )}: ${formatPercentText(point.cumulative, formatPercent)}`}
                            >
                                <span
                                    className="h-2 w-2 rounded-full border-2 border-foreground bg-background"
                                    aria-hidden="true"
                                />
                            </span>
                        </ChartTooltip>
                    ))}
                </div>

                {/* x-axis labels */}
                <div
                    className="grid text-xs text-muted-foreground"
                    style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
                >
                    {points.map((point) => (
                        <span
                            key={`label-${chartLabelToString(point.label, String(point.index))}-${point.index}`}
                            className="min-w-0 truncate px-0.5 text-center"
                        >
                            {point.label}
                        </span>
                    ))}
                </div>

                {showLegend ? (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <span
                                className="h-2.5 w-2.5 rounded-sm"
                                style={{ backgroundColor: getChartColor(undefined, 0) }}
                                aria-hidden="true"
                            />
                            {label ?? "Count"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-0.5 w-4 rounded-full bg-foreground" aria-hidden="true" />
                            {cumulativeLabel}
                        </span>
                        {thresholdPercent !== null ? (
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-0 w-4 border-t-2 border-dashed border-warning" aria-hidden="true" />
                                {resolvedThresholdLabel}
                            </span>
                        ) : null}
                    </div>
                ) : null}
            </div>
        )
    }
)
ParetoChart.displayName = "ParetoChart"

function defaultFormat(
    value: number,
    formatValue: (value: number) => React.ReactNode
) {
    return chartLabelToString(formatValue(value), String(value))
}

function formatPercentText(
    percent: number,
    formatPercent: (percent: number) => React.ReactNode
) {
    return chartLabelToString(formatPercent(percent), `${Math.round(percent)}%`)
}

export { ParetoChart }
