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
import type { ChartColor } from "./chart-utils"
import {
    chartLabelToString,
    clamp,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { RetentionCohortCardVariantKey } from "./generated/variant-keys"
import { retentionCohortCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface RetentionCohortCell {
    value: number
    color?: ChartColor
    description?: React.ReactNode
}

export interface RetentionCohortRow {
    label: React.ReactNode
    size?: number
    values: RetentionCohortCell[]
}

export interface RetentionCohortCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    cohorts: RetentionCohortRow[]
    periods: React.ReactNode[]
    title?: React.ReactNode
    description?: React.ReactNode
    value?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    caption?: React.ReactNode
    variant?: RetentionCohortCardVariantKey
    max?: number
    color?: ChartColor
    selectedCell?: { cohortIndex: number; periodIndex: number }
    showValues?: boolean
    formatValue?: (value: number) => React.ReactNode
    formatSize?: (value: number) => React.ReactNode
    onCellSelect?: (
        cell: RetentionCohortCell,
        selection: { cohortIndex: number; periodIndex: number }
    ) => void
}

type RetentionCohortCardClassNames = {
    card: string
    header: string
    content: string
    cell: string
    title: string
}

const variantClasses: Record<RetentionCohortCardVariantKey, RetentionCohortCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        cell: "min-h-6 rounded",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        cell: "min-h-8 rounded-md",
        title: "text-base",
    },
}

function defaultPercentFormatter(value: number) {
    return `${defaultChartValueFormatter(value)}%`
}

function defaultSizeFormatter(value: number) {
    return defaultChartValueFormatter(value)
}

function getCellValue(cell: RetentionCohortCell | undefined) {
    return Number.isFinite(cell?.value) ? Math.max(0, cell?.value ?? 0) : 0
}

function renderCohortLabel(label: React.ReactNode) {
    if (typeof label !== "string") return label

    const japaneseMatch = label.match(/^(.+?)(コホート)$/)
    if (japaneseMatch) {
        return (
            <>
                {japaneseMatch[1]}
                <br className="sm:hidden" />
                {japaneseMatch[2]}
            </>
        )
    }

    const englishMatch = label.match(/^(.+)\s+(cohort)$/i)
    if (englishMatch) {
        return (
            <>
                {englishMatch[1]}
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> </span>
                {englishMatch[2]}
            </>
        )
    }

    return label
}

const RetentionCohortCard = React.forwardRef<
    HTMLDivElement,
    RetentionCohortCardProps
>(
    (
        {
            className,
            cohorts,
            periods,
            title = "User retention",
            description,
            value,
            delta,
            deltaDescription,
            caption,
            variant = retentionCohortCardDefaultVariantKey,
            max,
            color = "warning",
            selectedCell,
            showValues = true,
            formatValue = defaultPercentFormatter,
            formatSize = defaultSizeFormatter,
            onCellSelect,
            ...props
        },
        ref
    ) => {
        const styles = variantClasses[variant]
        const values = cohorts.flatMap((cohort) =>
            cohort.values.map((cell) => getCellValue(cell))
        )
        const maxValue = Math.max(max ?? 0, ...values, 1)
        const canSelectCells = typeof onCellSelect === "function"

        const renderCell = (
            cell: RetentionCohortCell | undefined,
            cohort: RetentionCohortRow,
            cohortIndex: number,
            period: React.ReactNode,
            periodIndex: number
        ) => {
            const hasCell = cell !== undefined
            const rawValue = getCellValue(cell)
            const percent = normalizeChartValue(rawValue, maxValue)
            const opacity = 0.08 + (clamp(percent, 0, 100) / 100) * 0.92
            const activeColor = getChartColor(cell?.color ?? color, periodIndex)
            const isSelected =
                selectedCell?.cohortIndex === cohortIndex &&
                selectedCell?.periodIndex === periodIndex
            const label = `${chartLabelToString(cohort.label, "Cohort")} · ${chartLabelToString(period, "Period")}`
            const sizeLabel =
                cohort.size === undefined
                    ? undefined
                    : ["Cohort size: ", formatSize(cohort.size)]

            if (!hasCell) {
                return (
                    <span
                        key={`${cohortIndex}-${periodIndex}`}
                        aria-hidden="true"
                        className={cn("block bg-transparent", styles.cell)}
                    />
                )
            }

            const cellClassName = cn(
                "relative block overflow-hidden bg-muted text-center font-medium tabular-nums text-foreground",
                "w-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                canSelectCells &&
                    "cursor-pointer border-0 p-0 transition-transform hover:scale-[1.04]",
                !canSelectCells && "cursor-default",
                styles.cell,
                "text-[9px] sm:text-[10px]",
                isSelected &&
                    "z-10 ring-2 ring-foreground ring-offset-1 ring-offset-background"
            )
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
                            className="absolute inset-0 z-10 flex items-center justify-center px-0.5 text-center text-foreground"
                        >
                            <span className="max-w-full truncate rounded-[3px] bg-background/75 px-1 shadow-sm">
                                {formatValue(rawValue)}
                            </span>
                        </span>
                    ) : null}
                </>
            )

            return (
                <ChartTooltip
                    key={`${cohortIndex}-${periodIndex}`}
                    label={label}
                    value={formatValue(rawValue)}
                    description={cell?.description ?? sizeLabel}
                >
                    {canSelectCells ? (
                        <button
                            type="button"
                            className={cellClassName}
                            aria-current={isSelected ? "true" : undefined}
                            aria-pressed={isSelected}
                            aria-label={`${label}: ${chartLabelToString(formatValue(rawValue), "Value")}`}
                            onClick={() =>
                                onCellSelect?.(cell, {
                                    cohortIndex,
                                    periodIndex,
                                })
                            }
                        >
                            {cellContent}
                        </button>
                    ) : (
                        <span
                            className={cellClassName}
                            tabIndex={0}
                            aria-current={isSelected ? "true" : undefined}
                            aria-label={`${label}: ${chartLabelToString(formatValue(rawValue), "Value")}`}
                        >
                            {cellContent}
                        </span>
                    )}
                </ChartTooltip>
            )
        }

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
                        {value || delta ? (
                            <div className="shrink-0 text-right">
                                {value ? (
                                    <div className="text-2xl font-semibold leading-none tabular-nums">
                                        {value}
                                    </div>
                                ) : null}
                                {delta ? (
                                    <div
                                        className="mt-1 text-xs font-medium text-success"
                                        title={chartLabelToString(
                                            deltaDescription,
                                            "Delta description"
                                        )}
                                    >
                                        {delta}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent className={cn("space-y-3", styles.content)}>
                    <div className="min-w-0 overflow-x-auto overflow-y-hidden pb-1">
                        <div
                            className="grid min-w-[34rem] grid-cols-[minmax(4.75rem,0.9fr)_repeat(var(--retention-period-count),minmax(2.35rem,1fr))] items-center gap-1 sm:min-w-0 sm:grid-cols-[minmax(3.5rem,1.15fr)_repeat(var(--retention-period-count),minmax(1.45rem,1fr))]"
                            style={{
                                "--retention-period-count": periods.length,
                            } as React.CSSProperties}
                        >
                            <span aria-hidden="true" />
                            {periods.map((period, index) => (
                                <span
                                    key={`${chartLabelToString(period, "Period")}-${index}`}
                                    className="truncate text-center text-[10px] text-muted-foreground sm:text-xs"
                                >
                                    {period}
                                </span>
                            ))}
                            {cohorts.map((cohort, cohortIndex) => (
                                <React.Fragment
                                    key={`${chartLabelToString(cohort.label, "Cohort")}-${cohortIndex}`}
                                >
                                    <span className="min-w-0 whitespace-normal break-keep pr-1 text-[10px] leading-tight text-muted-foreground sm:truncate sm:text-xs">
                                        {renderCohortLabel(cohort.label)}
                                    </span>
                                    {periods.map((period, periodIndex) =>
                                        renderCell(
                                            cohort.values[periodIndex],
                                            cohort,
                                            cohortIndex,
                                            period,
                                            periodIndex
                                        )
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
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
RetentionCohortCard.displayName = "RetentionCohortCard"

export { RetentionCohortCard }
