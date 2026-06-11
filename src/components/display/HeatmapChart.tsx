"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor } from "./chart-utils"
import {
    clamp,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { HeatmapChartVariantKey } from "./generated/variant-keys"
import { heatmapChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface HeatmapChartCell {
    x: string
    y: string
    value: number
    color?: ChartColor
    description?: React.ReactNode
}

export interface HeatmapChartSummary {
    x: string
    value: number
    color?: ChartColor
    description?: React.ReactNode
}

export interface HeatmapChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: HeatmapChartCell[]
    xLabels: string[]
    yLabels: string[]
    summary?: HeatmapChartSummary[]
    variant?: HeatmapChartVariantKey
    max?: number
    summaryMax?: number
    color?: ChartColor
    selectedCell?: { x: string; y: string }
    showValues?: boolean
    showSummaryValues?: boolean
    formatValue?: (value: number) => React.ReactNode
    summaryLabel?: React.ReactNode
    onCellSelect?: (cell: HeatmapChartCell, selection: { x: string; y: string }) => void
}

const heatmapChartVariantClasses: Record<HeatmapChartVariantKey, string> = {
    compact: "w-full p-0",
    default: "w-full p-0",
}

const heatmapCellClasses: Record<HeatmapChartVariantKey, string> = {
    compact: "min-h-6 rounded",
    default: "min-h-8 rounded-md",
}

const heatmapLabelColumnWidth = "2.75rem"

const HeatmapChart = React.forwardRef<HTMLDivElement, HeatmapChartProps>(
    (
        {
            className,
            data,
            xLabels,
            yLabels,
            summary,
            variant = heatmapChartDefaultVariantKey,
            max,
            summaryMax,
            color,
            selectedCell,
            showValues = false,
            showSummaryValues = true,
            formatValue = defaultChartValueFormatter,
            summaryLabel,
            onCellSelect,
            ...props
        },
        ref
    ) => {
        const values = data.map((cell) => cell.value)
        const maxValue = Math.max(max ?? 0, ...values, 1)
        const summaryValues = summary?.map((item) => item.value) ?? []
        const maxSummaryValue = Math.max(summaryMax ?? 0, ...summaryValues, 1)
        const cellMap = new Map(data.map((cell) => [`${cell.x}::${cell.y}`, cell]))
        const summaryMap = new Map(summary?.map((item) => [item.x, item]) ?? [])
        const canSelectCells = typeof onCellSelect === "function"

        return (
            <div
                ref={ref}
                className={cn(
                    heatmapChartVariantClasses[variant],
                    "min-w-0",
                    className
                )}
                {...props}
            >
                {summary ? (
                    <div
                        className="mb-2 grid w-full min-w-0 items-end gap-1"
                        style={{
                            gridTemplateColumns: `${heatmapLabelColumnWidth} repeat(${xLabels.length}, minmax(0, 1fr))`,
                        }}
                    >
                        <span className="truncate pr-1 text-right text-xs text-muted-foreground">
                            {summaryLabel}
                        </span>
                        {xLabels.map((label, index) => {
                            const item = summaryMap.get(label)
                            const value = item?.value ?? 0
                            const percent = normalizeChartValue(value, maxSummaryValue)
                            const activeColor = getChartColor(
                                item?.color ?? color ?? "primary",
                                index
                            )

                            return (
                                <ChartTooltip
                                    key={`${label}-summary`}
                                    label={label}
                                    value={formatValue(value)}
                                    description={item?.description}
                                >
                                    <span
                                        className="flex min-h-14 min-w-0 flex-col items-center justify-end gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        tabIndex={0}
                                        aria-label={`${label}: ${formatValue(value)}`}
                                    >
                                        {showSummaryValues ? (
                                            <span className="truncate text-[10px] font-medium tabular-nums text-muted-foreground">
                                                {formatValue(value)}
                                            </span>
                                        ) : null}
                                        <span className="flex h-10 w-full items-end justify-center">
                                            <span
                                                className="block w-3 rounded-full"
                                                style={{
                                                    height: `${Math.max(percent, 6)}%`,
                                                    backgroundColor: activeColor,
                                                    opacity: 0.35 + (clamp(percent, 0, 100) / 100) * 0.65,
                                                }}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </span>
                                </ChartTooltip>
                            )
                        })}
                    </div>
                ) : null}
                <div
                    className="grid w-full min-w-0 items-center gap-1"
                    style={{
                        gridTemplateColumns: `${heatmapLabelColumnWidth} repeat(${xLabels.length}, minmax(0, 1fr))`,
                    }}
                >
                    <span aria-hidden="true" />
                    {xLabels.map((label) => (
                        <span
                            key={label}
                            className="min-w-0 truncate text-center text-xs text-muted-foreground"
                        >
                            {label}
                        </span>
                    ))}
                    {yLabels.map((rowLabel) => (
                        <React.Fragment key={rowLabel}>
                            <span className="min-w-0 truncate pr-1 text-right text-xs text-muted-foreground">
                                {rowLabel}
                            </span>
                            {xLabels.map((columnLabel) => {
                                const cell = cellMap.get(`${columnLabel}::${rowLabel}`)
                                const value = cell?.value ?? 0
                                const percent = normalizeChartValue(value, maxValue)
                                const opacity = 0.1 + (clamp(percent, 0, 100) / 100) * 0.9
                                const cellColor = cell?.color ?? color ?? "primary"
                                const activeColor = getChartColor(
                                    cellColor,
                                    0
                                )
                                const isSelected =
                                    selectedCell?.x === columnLabel &&
                                    selectedCell?.y === rowLabel
                                const cellContent = (
                                    <>
                                        <span
                                            className="absolute inset-0"
                                            style={{
                                                backgroundColor: activeColor,
                                                opacity,
                                            }}
                                            aria-hidden="true"
                                        />
                                        {showValues ? (
                                            <span
                                                className={cn(
                                                    "absolute inset-0 z-10 flex items-center justify-center px-0.5 text-center text-foreground"
                                                )}
                                            >
                                                <span className="rounded-[3px] bg-background/75 px-1 shadow-sm">
                                                    {formatValue(value)}
                                                </span>
                                            </span>
                                        ) : null}
                                    </>
                                )
                                const cellClassName = cn(
                                    "relative block overflow-hidden bg-muted text-center text-[10px] font-medium tabular-nums",
                                    "w-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                    canSelectCells &&
                                        "cursor-pointer border-0 p-0 transition-transform hover:scale-[1.04]",
                                    !canSelectCells && "cursor-default",
                                    heatmapCellClasses[variant],
                                    isSelected &&
                                        "z-10 ring-2 ring-foreground ring-offset-1 ring-offset-background"
                                )

                                return (
                                    <ChartTooltip
                                        key={`${columnLabel}-${rowLabel}`}
                                        label={`${columnLabel} ${rowLabel}`}
                                        value={formatValue(value)}
                                        description={cell?.description}
                                    >
                                        {canSelectCells && cell ? (
                                            <button
                                                type="button"
                                                className={cellClassName}
                                                aria-label={`${columnLabel} ${rowLabel}: ${formatValue(value)}`}
                                                aria-current={isSelected ? "true" : undefined}
                                                aria-pressed={isSelected}
                                                onClick={() =>
                                                    onCellSelect?.(cell, {
                                                        x: columnLabel,
                                                        y: rowLabel,
                                                    })
                                                }
                                            >
                                                {cellContent}
                                            </button>
                                        ) : (
                                            <span
                                                className={cellClassName}
                                                tabIndex={0}
                                                aria-label={`${columnLabel} ${rowLabel}: ${formatValue(value)}`}
                                                aria-current={isSelected ? "true" : undefined}
                                            >
                                                {cellContent}
                                            </span>
                                        )}
                                    </ChartTooltip>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )
    }
)
HeatmapChart.displayName = "HeatmapChart"

export { HeatmapChart }
