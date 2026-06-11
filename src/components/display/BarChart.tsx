"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { BarChartVariantKey } from "./generated/variant-keys"
import { barChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: ChartDataPoint[]
    variant?: BarChartVariantKey
    max?: number
    averageValue?: number
    averageLabel?: React.ReactNode
    formatValue?: (value: number) => React.ReactNode
    showGrid?: boolean
    showLabels?: boolean
    showValues?: boolean
}

const barChartVariantClasses: Record<BarChartVariantKey, string> = {
    horizontal: "h-[192px] w-full p-0",
    vertical: "h-[192px] w-full p-0",
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
    (
        {
            className,
            data,
            variant = barChartDefaultVariantKey,
            max,
            averageValue,
            averageLabel = "Average",
            formatValue = defaultChartValueFormatter,
            showGrid = true,
            showLabels = true,
            showValues = false,
            ...props
        },
        ref
    ) => {
        const values = data.map((item) => item.value)
        const maxValue = Math.max(max ?? 0, averageValue ?? 0, ...values, 1)
        const averagePercent =
            averageValue === undefined
                ? null
                : normalizeChartValue(averageValue, maxValue)
        const averageText = chartLabelToString(averageLabel, "Average")

        if (variant === "horizontal") {
            return (
                <div
                    ref={ref}
                    className={cn(
                        barChartVariantClasses[variant],
                        "flex flex-col justify-center gap-3 overflow-hidden",
                        className
                    )}
                    {...props}
                >
                    {data.map((item, index) => {
                        const percent = normalizeChartValue(item.value, maxValue)
                        return (
                            <div
                                key={`${String(item.label)}-${index}`}
                                className={cn(
                                    "grid min-w-0 items-center gap-3 text-sm",
                                    showValues
                                        ? "grid-cols-[minmax(0,0.8fr)_minmax(0,2.8fr)_auto]"
                                        : "grid-cols-[minmax(0,1fr)_minmax(0,3fr)]"
                                )}
                            >
                                {showLabels ? (
                                    <span className="truncate text-muted-foreground">
                                        {item.label}
                                    </span>
                                ) : null}
                                <div className="relative h-3 min-w-0 rounded-full bg-muted">
                                    {averagePercent !== null ? (
                                        <ChartTooltip
                                            label={averageLabel}
                                            value={formatValue(averageValue ?? 0)}
                                        >
                                            <span
                                                className="absolute top-1/2 z-10 h-10 w-5 -translate-x-1/2 -translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                style={{ left: `${averagePercent}%` }}
                                                tabIndex={index === 0 ? 0 : undefined}
                                                aria-label={
                                                    index === 0
                                                        ? `${averageText}: ${formatValue(averageValue ?? 0)}`
                                                        : undefined
                                                }
                                            >
                                                <span
                                                    className="pointer-events-none absolute left-1/2 top-1/2 h-9 -translate-x-1/2 -translate-y-1/2 border-l border-dashed border-foreground/75"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </ChartTooltip>
                                    ) : null}
                                    <ChartTooltip
                                        label={item.label}
                                        value={formatValue(item.value)}
                                        description={
                                            averageValue !== undefined
                                                ? [averageLabel, ": ", formatValue(averageValue)]
                                                : undefined
                                        }
                                    >
                                        <span
                                            className="block h-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            style={{
                                                width: `${percent}%`,
                                                backgroundColor: getChartColor(item.color, index),
                                            }}
                                            tabIndex={0}
                                            aria-label={`${chartLabelToString(item.label)}: ${formatValue(item.value)}${
                                                averageValue !== undefined
                                                    ? ` (${averageText}: ${formatValue(averageValue)})`
                                                    : ""
                                            }`}
                                        />
                                    </ChartTooltip>
                                </div>
                                {showValues ? (
                                    <span className="text-xs tabular-nums text-muted-foreground">
                                        {formatValue(item.value)}
                                    </span>
                                ) : null}
                            </div>
                        )
                    })}
                </div>
            )
        }

        return (
            <div
                ref={ref}
                className={cn(
                    barChartVariantClasses[variant],
                    "flex flex-col justify-end",
                    className
                )}
                {...props}
            >
                <div className="relative min-h-0 flex-1 border-b border-border/70">
                    <div
                        className="absolute inset-x-0 bottom-0 flex items-end gap-2"
                        style={{ top: showValues ? "1.5rem" : 0 }}
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
                        {averagePercent !== null ? (
                            <ChartTooltip
                                label={averageLabel}
                                value={formatValue(averageValue ?? 0)}
                            >
                                <span
                                    className="absolute inset-x-0 z-20 h-4 translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    style={{ bottom: `${averagePercent}%` }}
                                    tabIndex={0}
                                    aria-label={`${averageText}: ${formatValue(averageValue ?? 0)}`}
                                >
                                    <span
                                        className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-foreground/50"
                                        aria-hidden="true"
                                    />
                                </span>
                            </ChartTooltip>
                        ) : null}
                        {data.map((item, index) => {
                            const percent = normalizeChartValue(item.value, maxValue)
                            return (
                                <div
                                    key={`${String(item.label)}-${index}`}
                                    className="relative z-10 flex h-full min-w-0 flex-1 items-end justify-center"
                                >
                                    <ChartTooltip
                                        label={item.label}
                                        value={formatValue(item.value)}
                                        description={
                                            averageValue !== undefined
                                                ? [averageLabel, ": ", formatValue(averageValue)]
                                                : undefined
                                        }
                                    >
                                        <div
                                            className="w-full max-w-12 rounded-t-md shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            style={{
                                                height: `${percent}%`,
                                                backgroundColor: getChartColor(item.color, index),
                                            }}
                                            tabIndex={0}
                                            aria-label={`${chartLabelToString(item.label)}: ${formatValue(item.value)}${
                                                averageValue !== undefined
                                                    ? ` (${averageText}: ${formatValue(averageValue)})`
                                                    : ""
                                            }`}
                                        />
                                    </ChartTooltip>
                                    {showValues ? (
                                        <span
                                            className="absolute text-xs font-medium text-foreground"
                                            style={{ bottom: `calc(${percent}% + 0.375rem)` }}
                                        >
                                            {formatValue(item.value)}
                                        </span>
                                    ) : null}
                                </div>
                            )
                        })}
                    </div>
                </div>
                {showLabels ? (
                    <div className="grid pt-2 text-xs text-muted-foreground" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
                        {data.map((item, index) => (
                            <span key={`${String(item.label)}-label-${index}`} className="min-w-0 truncate text-center">
                                {item.label}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        )
    }
)
BarChart.displayName = "BarChart"

export { BarChart }
