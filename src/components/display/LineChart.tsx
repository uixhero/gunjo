"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor, ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
    getChartColor,
    getChartLabel,
    getChartValue,
} from "./chart-utils"
import { ChartLegend } from "./ChartLegend"
import { ChartTooltip } from "./chart-tooltip"
import type { LineChartVariantKey } from "./generated/variant-keys"
import { lineChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface LineChartSeries {
    label?: React.ReactNode
    data: Array<ChartDataPoint | number>
    color?: ChartColor
}

export interface LineChartProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    series: LineChartSeries[]
    variant?: LineChartVariantKey
    min?: number
    max?: number
    referenceValue?: number
    referenceLabel?: React.ReactNode
    showGrid?: boolean
    showDots?: boolean
    showLegend?: boolean
    showLabels?: boolean
    strokeWidth?: number
    formatValue?: (value: number) => React.ReactNode
}

interface LineChartPoint {
    index: number
    label: React.ReactNode
    x: number
    y: number
    value: number
}

interface LineChartPadding {
    top: number
    right: number
    bottom: number
    left: number
}

const lineChartVariantClasses: Record<LineChartVariantKey, string> = {
    area: "h-[260px] w-full p-0",
    line: "h-[260px] w-full p-0",
}

const plotPadding: LineChartPadding = {
    top: 14,
    right: 12,
    bottom: 10,
    left: 28,
}

function getFiniteSeriesValues(series: LineChartSeries[]) {
    return series.flatMap((item) =>
        item.data.map(getChartValue).filter((value) => Number.isFinite(value))
    )
}

function getChartDomain(
    series: LineChartSeries[],
    min: number | undefined,
    max: number | undefined,
    referenceValue: number | undefined
) {
    const values = getFiniteSeriesValues(series)
    if (referenceValue !== undefined && Number.isFinite(referenceValue)) {
        values.push(referenceValue)
    }

    if (values.length === 0 && min === undefined && max === undefined) {
        return { min: 0, max: 1 }
    }

    const fallbackMin = values.length > 0 ? Math.min(...values) : 0
    const fallbackMax = values.length > 0 ? Math.max(...values) : fallbackMin + 1
    const resolvedMin =
        typeof min === "number" && Number.isFinite(min) ? min : fallbackMin
    const resolvedMax =
        typeof max === "number" && Number.isFinite(max) ? max : fallbackMax

    return {
        min: Math.min(resolvedMin, resolvedMax),
        max: Math.max(resolvedMin, resolvedMax),
    }
}

function buildPoints(
    data: Array<ChartDataPoint | number>,
    width: number,
    height: number,
    padding: LineChartPadding,
    domain: { min: number; max: number },
    maxPointCount: number
) {
    const span = domain.max - domain.min || 1
    const usableWidth = Math.max(1, width - padding.left - padding.right)
    const usableHeight = Math.max(1, height - padding.top - padding.bottom)

    return data
        .map((item, index) => ({
            index,
            label: getChartLabel(item, index),
            value: getChartValue(item),
        }))
        .filter((point) => Number.isFinite(point.value))
        .map((point) => {
            const x =
                maxPointCount <= 1
                    ? width / 2
                    : padding.left + (point.index / (maxPointCount - 1)) * usableWidth
            const y =
                padding.top +
                (1 - (point.value - domain.min) / span) * usableHeight

            return { ...point, x, y }
        })
}

function formatChartNumber(value: number) {
    return Number(value.toFixed(3))
}

function buildSvgPointList(points: LineChartPoint[]) {
    return points
        .map((point) => `${formatChartNumber(point.x)},${formatChartNumber(point.y)}`)
        .join(" ")
}

function buildAreaPointList(
    points: LineChartPoint[],
    height: number,
    padding: LineChartPadding
) {
    if (points.length === 0) return undefined

    const first = points[0]
    const last = points[points.length - 1]
    const baselineY = height - padding.bottom

    return [
        buildSvgPointList(points),
        `${formatChartNumber(last.x)},${formatChartNumber(baselineY)}`,
        `${formatChartNumber(first.x)},${formatChartNumber(baselineY)}`,
    ].join(" ")
}

function getReferenceY(
    value: number | undefined,
    height: number,
    padding: LineChartPadding,
    domain: { min: number; max: number }
) {
    if (value === undefined || !Number.isFinite(value)) return null

    const span = domain.max - domain.min || 1
    return padding.top + (1 - (value - domain.min) / span) * (height - padding.top - padding.bottom)
}

function getSeriesLabel(series: LineChartSeries, index: number) {
    return series.label ?? `Series ${index + 1}`
}

function getLineChartLabels(series: LineChartSeries[]) {
    const longestSeries = series.reduce<LineChartSeries | null>((longest, item) => {
        if (!longest || item.data.length > longest.data.length) return item
        return longest
    }, null)

    return longestSeries?.data.map((item, index) => getChartLabel(item, index)) ?? []
}

function useElementSize<T extends HTMLElement>() {
    const [node, setNode] = React.useState<T | null>(null)
    const [size, setSize] = React.useState({ width: 0, height: 0 })

    React.useEffect(() => {
        if (!node) return undefined
        const updateSize = () => {
            const rect = node.getBoundingClientRect()
            setSize({ width: rect.width, height: rect.height })
        }
        updateSize()

        const observer = new ResizeObserver(updateSize)
        observer.observe(node)
        return () => observer.disconnect()
    }, [node])

    return [setNode, size] as const
}

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
    (
        {
            className,
            series,
            variant = lineChartDefaultVariantKey,
            min,
            max,
            referenceValue,
            referenceLabel = "Reference",
            showGrid = true,
            showDots = true,
            showLegend = false,
            showLabels = true,
            strokeWidth = 2,
            formatValue = defaultChartValueFormatter,
            ...props
        },
        ref
    ) => {
        const [setPlotNode, plotSize] = useElementSize<HTMLDivElement>()
        const width = plotSize.width || 480
        const height = plotSize.height || 212
        const maxPointCount = Math.max(1, ...series.map((item) => item.data.length))
        const domain = getChartDomain(series, min, max, referenceValue)
        const labels = getLineChartLabels(series)
        const referenceY = getReferenceY(referenceValue, height, plotPadding, domain)
        const referenceText = chartLabelToString(referenceLabel, "Reference")
        const legendItems = series.map((item, index) => {
            const lastPoint = [...item.data]
                .reverse()
                .find((point) => Number.isFinite(getChartValue(point)))
            const value =
                lastPoint !== undefined ? formatValue(getChartValue(lastPoint)) : undefined

            return {
                label: getSeriesLabel(item, index),
                value,
                color: item.color,
                description:
                    referenceValue !== undefined
                        ? [referenceLabel, ": ", formatValue(referenceValue)]
                        : undefined,
            }
        })

        return (
            <div
                ref={ref}
                role="img"
                className={cn(
                    lineChartVariantClasses[variant],
                    "flex min-w-0 flex-col gap-3",
                    className
                )}
                {...props}
            >
                <div ref={setPlotNode} className="relative min-h-0 flex-1 overflow-hidden">
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        viewBox={`0 0 ${formatChartNumber(width)} ${formatChartNumber(height)}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {showGrid
                            ? [0, 25, 50, 75, 100].map((percent) => {
                                  const y =
                                      plotPadding.top +
                                      ((height - plotPadding.top - plotPadding.bottom) *
                                          percent) /
                                          100

                                  return (
                                      <line
                                          key={`y-${percent}`}
                                          x1={0}
                                          x2={formatChartNumber(width)}
                                          y1={formatChartNumber(y)}
                                          y2={formatChartNumber(y)}
                                          stroke="hsl(var(--border) / 0.65)"
                                          strokeDasharray="4 4"
                                          vectorEffect="non-scaling-stroke"
                                      />
                                  )
                              })
                            : null}
                        {showGrid && labels.length > 1
                            ? labels.map((label, index) => {
                                  const x =
                                      plotPadding.left +
                                      (index / (labels.length - 1)) *
                                          (width - plotPadding.left - plotPadding.right)

                                  return (
                                      <line
                                          key={`x-${chartLabelToString(label, "Label")}-${index}`}
                                          x1={formatChartNumber(x)}
                                          x2={formatChartNumber(x)}
                                          y1={0}
                                          y2={formatChartNumber(height)}
                                          stroke="hsl(var(--border) / 0.45)"
                                          vectorEffect="non-scaling-stroke"
                                      />
                                  )
                              })
                            : null}
                        {referenceY !== null ? (
                            <line
                                x1={0}
                                x2={formatChartNumber(width)}
                                y1={formatChartNumber(referenceY)}
                                y2={formatChartNumber(referenceY)}
                                stroke="hsl(var(--foreground) / 0.35)"
                                strokeDasharray="4 4"
                                vectorEffect="non-scaling-stroke"
                            />
                        ) : null}
                    </svg>
                    {referenceY !== null ? (
                        <ChartTooltip
                            label={referenceLabel}
                            value={formatValue(referenceValue ?? 0)}
                        >
                            <span
                                className="absolute inset-x-0 z-10 h-5 -translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                style={{ top: `${referenceY}px` }}
                                tabIndex={0}
                                aria-label={`${referenceText}: ${formatValue(referenceValue ?? 0)}`}
                            />
                        </ChartTooltip>
                    ) : null}
                    {series.map((item, seriesIndex) => {
                        const points = buildPoints(
                            item.data,
                            width,
                            height,
                            plotPadding,
                            domain,
                            maxPointCount
                        )
                        const color = getChartColor(item.color, seriesIndex)
                        const linePoints = buildSvgPointList(points)
                        const areaPoints = buildAreaPointList(
                            points,
                            height,
                            plotPadding
                        )

                        return (
                            <React.Fragment key={`${chartLabelToString(item.label, "Series")}-${seriesIndex}`}>
                                <svg
                                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                                    viewBox={`0 0 ${formatChartNumber(width)} ${formatChartNumber(height)}`}
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                >
                                    {variant === "area" && areaPoints ? (
                                        <polygon
                                            points={areaPoints}
                                            fill={color}
                                            opacity={seriesIndex === 0 ? 0.14 : 0.08}
                                        />
                                    ) : null}
                                    <polyline
                                        points={linePoints}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={strokeWidth}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                    {showDots
                                        ? points.map((point, index) => (
                                              <circle
                                                  key={`${seriesIndex}-dot-${point.x}-${index}`}
                                                  cx={formatChartNumber(point.x)}
                                                  cy={formatChartNumber(point.y)}
                                                  r={4}
                                                  fill="hsl(var(--background))"
                                                  stroke={color}
                                                  strokeWidth={2}
                                                  vectorEffect="non-scaling-stroke"
                                              />
                                          ))
                                        : null}
                                </svg>
                                {points.map((point, index) => {
                                    const description =
                                        referenceValue !== undefined
                                            ? [referenceLabel, ": ", formatValue(referenceValue)]
                                            : undefined
                                    const descriptionText =
                                        referenceValue !== undefined
                                            ? ` (${referenceText}: ${formatValue(referenceValue)})`
                                            : ""

                                    return (
                                        <ChartTooltip
                                            key={`${seriesIndex}-hit-${point.x}-${index}`}
                                            label={
                                                <>
                                                    {getSeriesLabel(item, seriesIndex)}
                                                    {" / "}
                                                    {point.label}
                                                </>
                                            }
                                            value={formatValue(point.value)}
                                            description={description}
                                        >
                                            <span
                                                className="absolute z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                style={{
                                                    left: `${(point.x / width) * 100}%`,
                                                    top: `${(point.y / height) * 100}%`,
                                                }}
                                                tabIndex={0}
                                                aria-label={`${chartLabelToString(
                                                    getSeriesLabel(item, seriesIndex),
                                                    "Series"
                                                )} ${chartLabelToString(point.label)}: ${formatValue(point.value)}${descriptionText}`}
                                            />
                                        </ChartTooltip>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </div>
                {showLabels && labels.length > 0 ? (
                    <div
                        className="grid text-xs text-muted-foreground"
                        style={{
                            gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
                            paddingLeft: plotPadding.left,
                            paddingRight: plotPadding.right,
                        }}
                    >
                        {labels.map((label, index) => (
                            <span
                                key={`${chartLabelToString(label, "Label")}-${index}`}
                                className="min-w-0 truncate text-center"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                ) : null}
                {showLegend ? (
                    <ChartLegend items={legendItems} variant="horizontal" />
                ) : null}
            </div>
        )
    }
)
LineChart.displayName = "LineChart"

export { LineChart }
