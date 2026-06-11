"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor, ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { RadarChartVariantKey } from "./generated/variant-keys"
import { radarChartDefaultVariantKey } from "./generated/default-variant-keys"

interface RadarPoint {
    index: number
    label: React.ReactNode
    value: number
    x: number
    y: number
}

export interface RadarChartSeries {
    id?: string
    label?: React.ReactNode
    data: ChartDataPoint[]
    color?: ChartColor
    fillOpacity?: number
}

export interface RadarChartProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: ChartDataPoint[]
    series?: RadarChartSeries[]
    variant?: RadarChartVariantKey
    max?: number
    color?: ChartColor
    showGrid?: boolean
    showLabels?: boolean
    showDots?: boolean
    fillOpacity?: number
    formatValue?: (value: number) => React.ReactNode
    maxLabel?: React.ReactNode
}

const radarChartVariantClasses: Record<RadarChartVariantKey, string> = {
    compact: "h-[208px] w-full p-0",
    default: "h-[256px] w-full p-0",
}

const chartCenter = 50
const chartRadius = 34
const labelRadius = 45
const minimumAxisCount = 3

function getRadarPosition(index: number, count: number, ratio = 1, radius = chartRadius) {
    const angle = -90 + (index / count) * 360
    const radians = (angle * Math.PI) / 180
    return {
        angle,
        x: chartCenter + Math.cos(radians) * radius * ratio,
        y: chartCenter + Math.sin(radians) * radius * ratio,
    }
}

function normalizeRadarData(data: ChartDataPoint[]) {
    return data.filter((item) => Number.isFinite(item.value))
}

function buildRadarPoints(data: ChartDataPoint[], maxValue: number, axisCount?: number) {
    const normalizedData = normalizeRadarData(data)
    const count = axisCount ?? Math.max(normalizedData.length, minimumAxisCount)

    return normalizedData.map((item, index) => {
        const position = getRadarPosition(
            index,
            count,
            normalizeChartValue(item.value, maxValue) / 100
        )

        return {
            index,
            label: item.label,
            value: item.value,
            x: position.x,
            y: position.y,
        }
    })
}

function buildRingPoints(count: number, ratio: number) {
    return Array.from({ length: count }, (_, index) =>
        getRadarPosition(index, count, ratio)
    )
}

function formatChartNumber(value: number) {
    return Number(value.toFixed(3))
}

function buildSvgPointList(points: Array<{ x: number; y: number }>) {
    if (points.length < minimumAxisCount) return undefined
    return [...points, points[0]]
        .map((point) => `${formatChartNumber(point.x)},${formatChartNumber(point.y)}`)
        .join(" ")
}

function normalizeRadarSeries(
    data: ChartDataPoint[],
    series?: RadarChartSeries[]
): Array<RadarChartSeries & { id: string; data: ChartDataPoint[] }> {
    if (series?.length) {
        return series
            .map((item, index) => ({
                ...item,
                id: item.id ?? `series-${index}`,
                data: normalizeRadarData(item.data),
            }))
            .filter((item) => item.data.length > 0)
    }

    return [
        {
            id: "data",
            data: normalizeRadarData(data),
        },
    ].filter((item) => item.data.length > 0)
}

const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
    (
        {
            className,
            data,
            series,
            variant = radarChartDefaultVariantKey,
            max,
            color,
            showGrid = true,
            showLabels = true,
            showDots = true,
            fillOpacity = 0.16,
            formatValue = defaultChartValueFormatter,
            maxLabel = "Max",
            ...props
        },
        ref
    ) => {
        const normalizedSeries = normalizeRadarSeries(data, series)
        const labelData = normalizedSeries[0]?.data ?? []
        const axisCount = Math.max(
            ...normalizedSeries.map((item) => item.data.length),
            minimumAxisCount
        )
        const maxValue = Math.max(
            max ?? 0,
            ...normalizedSeries.flatMap((item) => item.data.map((point) => point.value)),
            1
        )
        const renderedSeries = normalizedSeries.map((item, index) => {
            const points = buildRadarPoints(item.data, maxValue, axisCount)
            const activeColor = getChartColor(item.color ?? color, index)

            return {
                ...item,
                seriesIndex: index,
                color: activeColor,
                fillOpacity: item.fillOpacity ?? fillOpacity,
                points,
                svgPoints: buildSvgPointList(points),
            }
        })
        const gridRings = [0.25, 0.5, 0.75, 1].map((ratio) => ({
            ratio,
            points: buildSvgPointList(buildRingPoints(axisCount, ratio)),
        }))
        const axisLines = Array.from({ length: axisCount }, (_, index) =>
            getRadarPosition(index, axisCount, 1)
        )

        return (
            <div
                ref={ref}
                role="img"
                className={cn(
                    radarChartVariantClasses[variant],
                    "flex items-center justify-center overflow-hidden",
                    className
                )}
                {...props}
            >
                <div className="relative aspect-square h-full max-h-full max-w-full">
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {showGrid
                            ? gridRings.map((ring) =>
                                  ring.points ? (
                                      <polyline
                                          key={`ring-${ring.ratio}`}
                                          points={ring.points}
                                          fill="none"
                                          stroke="hsl(var(--border) / 0.7)"
                                          strokeWidth={1}
                                          vectorEffect="non-scaling-stroke"
                                      />
                                  ) : null
                              )
                            : null}
                        {showGrid
                            ? axisLines.map((point, index) => (
                                  <line
                                      key={`axis-${index}`}
                                      x1={chartCenter}
                                      y1={chartCenter}
                                      x2={formatChartNumber(point.x)}
                                      y2={formatChartNumber(point.y)}
                                      stroke="hsl(var(--border) / 0.5)"
                                      strokeWidth={1}
                                      vectorEffect="non-scaling-stroke"
                                  />
                              ))
                            : null}
                        {renderedSeries.map((item) =>
                            item.svgPoints ? (
                                <polygon
                                    key={`${item.id}-fill`}
                                    points={item.svgPoints}
                                    fill={item.color}
                                    opacity={item.fillOpacity}
                                />
                            ) : null
                        )}
                        {renderedSeries.map((item) =>
                            item.svgPoints ? (
                                <polyline
                                    key={`${item.id}-line`}
                                    points={item.svgPoints}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ) : null
                        )}
                        {showDots
                            ? renderedSeries.flatMap((item) =>
                                  item.points.map((point, index) => (
                                      <circle
                                          key={`${item.id}-dot-${index}`}
                                          cx={formatChartNumber(point.x)}
                                          cy={formatChartNumber(point.y)}
                                          r={1.4}
                                          fill="hsl(var(--background))"
                                          stroke={item.color}
                                          strokeWidth={2}
                                          vectorEffect="non-scaling-stroke"
                                      />
                                  ))
                              )
                            : null}
                    </svg>
                    {showLabels
                        ? labelData.map((item, index) => {
                              const position = getRadarPosition(
                                  index,
                                  axisCount,
                                  1,
                                  labelRadius
                              )
                              return (
                                  <span
                                      key={`${String(item.label)}-label-${index}`}
                                      className="pointer-events-none absolute max-w-20 -translate-x-1/2 -translate-y-1/2 truncate text-center text-xs text-muted-foreground"
                                      style={{
                                          left: `${position.x}%`,
                                          top: `${position.y}%`,
                                      }}
                                      aria-hidden="true"
                                  >
                                      {item.label}
                                  </span>
                              )
                          })
                        : null}
                    {renderedSeries.flatMap((item) =>
                        item.points.map((point, index) => {
                            const seriesLabel = chartLabelToString(
                                item.label,
                                renderedSeries.length > 1
                                    ? `Series ${item.seriesIndex + 1}`
                                    : ""
                            )
                            const description =
                                renderedSeries.length > 1 && item.label
                                    ? [item.label, " / ", maxLabel, ": ", formatValue(maxValue)]
                                    : [maxLabel, ": ", formatValue(maxValue)]

                            return (
                                <ChartTooltip
                                    key={`${item.id}-${String(point.label)}-${index}`}
                                    label={point.label}
                                    value={formatValue(point.value)}
                                    description={description}
                                >
                                    <span
                                        className="absolute z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        style={{
                                            left: `${point.x}%`,
                                            top: `${point.y}%`,
                                        }}
                                        tabIndex={0}
                                        aria-label={`${seriesLabel ? `${seriesLabel} ` : ""}${chartLabelToString(point.label)}: ${formatValue(point.value)} (${chartLabelToString(maxLabel, "Max")}: ${formatValue(maxValue)})`}
                                    >
                                        <span className="sr-only">{point.label}</span>
                                    </span>
                                </ChartTooltip>
                            )
                        })
                    )}
                </div>
            </div>
        )
    }
)
RadarChart.displayName = "RadarChart"

export { RadarChart }
