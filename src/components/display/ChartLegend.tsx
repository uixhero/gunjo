"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor } from "./chart-utils"
import { chartLabelToString, getChartColor } from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { ChartLegendVariantKey } from "./generated/variant-keys"
import { chartLegendDefaultVariantKey } from "./generated/default-variant-keys"

export interface ChartLegendItem {
    label: React.ReactNode
    value?: React.ReactNode
    color?: ChartColor
    description?: React.ReactNode
}

export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
    items: ChartLegendItem[]
    variant?: ChartLegendVariantKey
    activeIndex?: number
}

const chartLegendVariantClasses: Record<ChartLegendVariantKey, string> = {
    horizontal: "inline-flex w-full flex-wrap items-center gap-2 p-0",
    vertical: "flex w-full flex-col items-stretch gap-2 p-0",
}

function chartLegendNodeToString(value: React.ReactNode, fallback = ""): string {
    if (value === undefined || value === null || typeof value === "boolean") {
        return fallback
    }

    if (typeof value === "string" || typeof value === "number") {
        return String(value)
    }

    if (Array.isArray(value)) {
        const text = value
            .map((item) => chartLegendNodeToString(item))
            .join("")
            .trim()
        return text || fallback
    }

    return fallback
}

function getLegendItemLabel(item: ChartLegendItem, index: number) {
    const label = chartLegendNodeToString(item.label, `Series ${index + 1}`)
    const value = chartLegendNodeToString(item.value)
    const description = chartLegendNodeToString(item.description)

    return [label, value, description].filter(Boolean).join(": ")
}

const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(
    (
        {
            className,
            items,
            variant = chartLegendDefaultVariantKey,
            activeIndex,
            role,
            ...props
        },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(chartLegendVariantClasses[variant], className)}
            role={role ?? "list"}
            {...props}
        >
            {items.map((item, index) => {
                const itemLabel = getLegendItemLabel(item, index)
                const isActive = activeIndex === index

                return (
                    <ChartTooltip
                        key={`${chartLabelToString(item.label, "Series")}-${index}`}
                        label={item.label}
                        value={item.value}
                        description={item.description}
                    >
                        <div
                            className={cn(
                                "inline-flex min-w-0 items-center gap-3 rounded-sm border border-transparent px-2 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                variant === "vertical"
                                    ? "w-full justify-between"
                                    : "w-auto justify-start",
                                isActive && "border-border bg-muted/60 text-foreground shadow-sm"
                            )}
                            role="listitem"
                            tabIndex={0}
                            aria-current={isActive ? "true" : undefined}
                            aria-label={itemLabel}
                        >
                            <span className="inline-flex min-w-0 items-center gap-2 text-muted-foreground">
                                <span
                                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                    style={{
                                        backgroundColor: getChartColor(item.color, index),
                                    }}
                                    aria-hidden="true"
                                />
                                <span className="truncate">{item.label}</span>
                            </span>
                            {item.value !== undefined ? (
                                <span className="flex-shrink-0 font-medium text-foreground">
                                    {item.value}
                                </span>
                            ) : null}
                        </div>
                    </ChartTooltip>
                )
            })}
        </div>
    )
)
ChartLegend.displayName = "ChartLegend"

export { ChartLegend }
