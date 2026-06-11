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
import type { QuadrantMatrixVariantKey } from "./generated/variant-keys"
import { quadrantMatrixDefaultVariantKey } from "./generated/default-variant-keys"

export interface QuadrantMatrixItem {
    id?: string
    label: string
    value: number
    x: number
    y: number
    color?: ChartColor
    description?: React.ReactNode
}

export interface QuadrantMatrixLabels {
    topLeft?: React.ReactNode
    topRight?: React.ReactNode
    bottomLeft?: React.ReactNode
    bottomRight?: React.ReactNode
}

export interface QuadrantMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
    items: QuadrantMatrixItem[]
    variant?: QuadrantMatrixVariantKey
    max?: number
    color?: ChartColor
    selectedId?: string
    showRanking?: boolean
    rankingLimit?: number
    xAxisLabel?: React.ReactNode
    yAxisLabel?: React.ReactNode
    quadrantLabels?: QuadrantMatrixLabels
    formatValue?: (value: number) => React.ReactNode
    onItemSelect?: (item: QuadrantMatrixItem, id: string) => void
    rankingPlacement?: "side" | "bottom"
}

const quadrantMatrixVariantClasses: Record<QuadrantMatrixVariantKey, string> = {
    compact: "w-full p-0",
    default: "w-full p-0",
}

const quadrantMatrixPanelClasses: Record<QuadrantMatrixVariantKey, string> = {
    compact: "min-h-44",
    default: "min-h-56",
}

function itemKey(item: QuadrantMatrixItem, index: number) {
    return item.id ?? `${item.label}-${index}`
}

interface QuadrantRankingContentProps {
    item: QuadrantMatrixItem
    percent: number
    activeColor: string
    formatValue: (value: number) => React.ReactNode
}

function QuadrantRankingContent({
    item,
    percent,
    activeColor,
    formatValue,
}: QuadrantRankingContentProps) {
    return (
        <>
            <span className="flex min-w-0 items-center justify-between gap-3">
                <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                        {item.label}
                    </span>
                    {item.description ? (
                        <span className="block truncate text-xs text-muted-foreground">
                            {item.description}
                        </span>
                    ) : null}
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatValue(item.value)}
                </span>
            </span>
            <span className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        width: `${percent}%`,
                        backgroundColor: activeColor,
                    }}
                />
            </span>
        </>
    )
}

const QuadrantMatrix = React.forwardRef<HTMLDivElement, QuadrantMatrixProps>(
    (
        {
            className,
            items,
            variant = quadrantMatrixDefaultVariantKey,
            max,
            color,
            selectedId,
            showRanking = true,
            rankingLimit = 5,
            xAxisLabel,
            yAxisLabel,
            quadrantLabels,
            formatValue = defaultChartValueFormatter,
            onItemSelect,
            rankingPlacement = "side",
            ...props
        },
        ref
    ) => {
        const values = items.map((item) => item.value)
        const maxValue = Math.max(max ?? 0, ...values, 1)
        const rankedItems = [...items]
            .sort((a, b) => b.value - a.value)
            .slice(0, rankingLimit)
        const canSelectItems = typeof onItemSelect === "function"

        return (
            <div
                ref={ref}
                className={cn(quadrantMatrixVariantClasses[variant], "min-w-0", className)}
                {...props}
            >
                <div
                    className={cn(
                        "grid min-w-0 gap-4",
                        showRanking &&
                            rankingPlacement === "side" &&
                            "md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)]"
                    )}
                >
                    <div
                        className={cn(
                            "relative min-w-0 overflow-hidden rounded-md border bg-muted/20",
                            quadrantMatrixPanelClasses[variant]
                        )}
                    >
                        <div
                            className="absolute inset-0 grid grid-cols-2 grid-rows-2"
                            aria-hidden="true"
                        >
                            <span className="border-b border-r border-border/70 bg-muted/20" />
                            <span className="border-b border-border/70 bg-muted/10" />
                            <span className="border-r border-border/70 bg-muted/10" />
                            <span className="bg-muted/20" />
                        </div>
                        <span
                            className="absolute inset-x-0 top-1/2 border-t border-dashed border-border"
                            aria-hidden="true"
                        />
                        <span
                            className="absolute inset-y-0 left-1/2 border-l border-dashed border-border"
                            aria-hidden="true"
                        />
                        {quadrantLabels ? (
                            <div
                                className="pointer-events-none absolute inset-3 grid grid-cols-2 grid-rows-2 gap-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                                aria-hidden="true"
                            >
                                <span>{quadrantLabels.topLeft}</span>
                                <span className="text-right">{quadrantLabels.topRight}</span>
                                <span className="self-end">{quadrantLabels.bottomLeft}</span>
                                <span className="self-end text-right">
                                    {quadrantLabels.bottomRight}
                                </span>
                            </div>
                        ) : null}
                        {yAxisLabel ? (
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-muted-foreground">
                                {yAxisLabel}
                            </span>
                        ) : null}
                        {xAxisLabel ? (
                            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
                                {xAxisLabel}
                            </span>
                        ) : null}
                        {items.map((item, index) => {
                            const id = itemKey(item, index)
                            const percent = normalizeChartValue(item.value, maxValue)
                            const size =
                                variant === "compact"
                                    ? 1.1 + (percent / 100) * 1.4
                                    : 1.25 + (percent / 100) * 1.9
                            const isSelected = selectedId === id
                            const activeColor = getChartColor(item.color ?? color, index)

                            const itemStyle = {
                                left: `${clamp(item.x)}%`,
                                top: `${clamp(item.y)}%`,
                                width: `${size}rem`,
                                height: `${size}rem`,
                                backgroundColor: activeColor,
                            }
                            const itemClassName = cn(
                                "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-background/80 p-0 shadow-sm",
                                canSelectItems &&
                                    "cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                !canSelectItems && "cursor-default",
                                isSelected &&
                                    "z-20 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                            )
                            const itemContents = (
                                <>
                                    <span
                                        className="absolute inset-0 rounded-full bg-background/20"
                                        aria-hidden="true"
                                    />
                                    <span className="relative h-1.5 w-1.5 rounded-full bg-background" />
                                </>
                            )

                            return (
                                <ChartTooltip
                                    key={id}
                                    label={item.label}
                                    value={formatValue(item.value)}
                                    description={item.description}
                                >
                                    {canSelectItems ? (
                                        <button
                                            type="button"
                                            className={itemClassName}
                                            style={itemStyle}
                                            aria-label={`${chartLabelToString(item.label)}: ${formatValue(item.value)}`}
                                            aria-current={isSelected ? "true" : undefined}
                                            onClick={() => onItemSelect?.(item, id)}
                                        >
                                            {itemContents}
                                        </button>
                                    ) : (
                                        <span
                                            className={itemClassName}
                                            style={itemStyle}
                                            tabIndex={0}
                                            aria-label={`${chartLabelToString(item.label)}: ${formatValue(item.value)}`}
                                            aria-current={isSelected ? "true" : undefined}
                                        >
                                            {itemContents}
                                        </span>
                                    )}
                                </ChartTooltip>
                            )
                        })}
                    </div>
                    {showRanking ? (
                        <ol className="grid min-w-0 content-start gap-2">
                            {rankedItems.map((item, index) => {
                                const id = itemKey(item, items.indexOf(item))
                                const percent = normalizeChartValue(item.value, maxValue)
                                const activeColor = getChartColor(item.color ?? color, index)
                                const isSelected = selectedId === id

                                return (
                                    <li key={id}>
                                        <ChartTooltip
                                            label={item.label}
                                            value={formatValue(item.value)}
                                            description={item.description}
                                        >
                                            {canSelectItems ? (
                                                <button
                                                    type="button"
                                                    className={cn(
                                                        "grid w-full min-w-0 gap-1 rounded-md border bg-card p-2 text-left cursor-pointer transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                        isSelected && "ring-1 ring-foreground"
                                                    )}
                                                    aria-current={
                                                        isSelected ? "true" : undefined
                                                    }
                                                    onClick={() => onItemSelect?.(item, id)}
                                                >
                                                    <QuadrantRankingContent
                                                        item={item}
                                                        percent={percent}
                                                        activeColor={activeColor}
                                                        formatValue={formatValue}
                                                    />
                                                </button>
                                            ) : (
                                                <span
                                                    className={cn(
                                                        "grid w-full min-w-0 cursor-default gap-1 rounded-md border bg-card p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                        isSelected && "ring-1 ring-foreground"
                                                    )}
                                                    tabIndex={0}
                                                    aria-current={
                                                        isSelected ? "true" : undefined
                                                    }
                                                >
                                                    <QuadrantRankingContent
                                                        item={item}
                                                        percent={percent}
                                                        activeColor={activeColor}
                                                        formatValue={formatValue}
                                                    />
                                                </span>
                                            )}
                                        </ChartTooltip>
                                    </li>
                                )
                            })}
                        </ol>
                    ) : null}
                </div>
            </div>
        )
    }
)
QuadrantMatrix.displayName = "QuadrantMatrix"

export { QuadrantMatrix }
