"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartDataPoint, NumberFormatSpec } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
    resolveValueFormatter,
} from "./chart-utils"
import { ChartLegend } from "./ChartLegend"
import { ChartTooltip } from "./chart-tooltip"

export interface DistributionBarProps extends React.HTMLAttributes<HTMLDivElement> {
    segments: ChartDataPoint[]
    showLegend?: boolean
    /**
     * Format each segment value. **Function prop — pass only from a Client
     * Component**; from a Server Component it breaks `next build`. For RSC-safe
     * numeric formatting use the serializable {@link DistributionBarProps.valueFormat}. (#338)
     */
    formatValue?: (value: number) => React.ReactNode
    /**
     * Serializable numeric format — the RSC-safe alternative to `formatValue`
     * (`"number" | "compact" | "integer"` preset or `Intl.NumberFormatOptions`).
     * Ignored when `formatValue` is set. Formats with a fixed `en-US` locale. (#338)
     */
    valueFormat?: NumberFormatSpec
    totalLabel?: React.ReactNode
}

const baseClasses = "h-9 w-full overflow-hidden rounded-full border border-border/70 bg-muted p-0"

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

const DistributionBar = React.forwardRef<HTMLDivElement, DistributionBarProps>(
    (
        {
            className,
            segments,
            showLegend = false,
            formatValue: formatValueProp,
            valueFormat,
            totalLabel = "Total",
            ...props
        },
        ref
    ) => {
        const formatValue = resolveValueFormatter(formatValueProp, valueFormat)
        const total = Math.max(
            segments.reduce((sum, segment) => sum + getPositiveValue(segment.value), 0),
            1
        )
        const legendItems = segments.map((segment, index) => {
            const rawValue = getPositiveValue(segment.value)
            const percent = normalizeChartValue(rawValue, total)

            return {
                label: segment.label,
                value: `${defaultChartValueFormatter(percent)}%`,
                color: segment.color ?? getChartColor(undefined, index),
                description: [totalLabel, ": ", formatValue(segment.value)],
            }
        })

        return (
            <div ref={ref} className={cn("w-full space-y-3 p-0", className)} {...props}>
                <div className={baseClasses}>
                    <div className="flex h-full w-full">
                        {segments.map((segment, index) => {
                            const percent = normalizeChartValue(
                                getPositiveValue(segment.value),
                                total
                            )
                            const percentText = `${defaultChartValueFormatter(percent)}%`

                            return (
                                <ChartTooltip
                                    key={`${chartLabelToString(segment.label, "Segment")}-${index}`}
                                    label={segment.label}
                                    value={percentText}
                                    description={[totalLabel, ": ", formatValue(segment.value)]}
                                >
                                    <span
                                        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        style={{
                                            width: `${percent}%`,
                                            backgroundColor: getChartColor(segment.color, index),
                                            boxShadow:
                                                index < segments.length - 1
                                                    ? "inset -1px 0 0 hsl(var(--background) / 0.65)"
                                                    : undefined,
                                        }}
                                        tabIndex={0}
                                        aria-label={`${chartLabelToString(segment.label)}: ${percentText} (${chartLabelToString(totalLabel, "Total")}: ${formatValue(segment.value)})`}
                                    />
                                </ChartTooltip>
                            )
                        })}
                    </div>
                </div>
                {showLegend ? (
                    <ChartLegend items={legendItems} variant="horizontal" />
                ) : null}
            </div>
        )
    }
)
DistributionBar.displayName = "DistributionBar"

export { DistributionBar }
