 "use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor, ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    clamp,
    defaultChartValueFormatter,
    getChartColor,
    getChartLabel,
    getChartValue,
} from "./chart-utils"
import { ChartFloatingTooltip, ChartTooltip } from "./chart-tooltip"
import type { SparklineChartVariantKey } from "./generated/variant-keys"
import { sparklineChartDefaultVariantKey } from "./generated/default-variant-keys"

interface NormalizedPoint {
    index: number
    label: React.ReactNode
    x: number
    y: number
    value: number
}

interface SparklineTooltipState {
    label: React.ReactNode
    value: React.ReactNode
}

export interface SparklineChartProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    data: Array<ChartDataPoint | number>
    variant?: SparklineChartVariantKey
    color?: ChartColor
    referenceValue?: number
    referenceLabel?: React.ReactNode
    showGrid?: boolean
    showDots?: boolean
    strokeWidth?: number
    formatValue?: (value: number) => React.ReactNode
}

const sparklineChartVariantClasses: Record<SparklineChartVariantKey, string> = {
    area: "h-24 w-full p-0",
    line: "h-24 w-full p-0",
    step: "h-24 w-full p-0",
}

function buildPoints(
    data: Array<ChartDataPoint | number>,
    width: number,
    height: number,
    padding: number,
    domain?: { min: number; max: number }
) {
    const normalizedData = data
        .map((item, index) => ({
            index,
            label: getChartLabel(item, index),
            value: getChartValue(item),
        }))
        .filter((point) => Number.isFinite(point.value))
    if (normalizedData.length === 0) return []

    const values = normalizedData.map((point) => point.value)
    const min = domain?.min ?? Math.min(...values)
    const max = domain?.max ?? Math.max(...values)
    const span = max - min || 1
    const usableWidth = width - padding * 2
    const usableHeight = height - padding * 2

    return normalizedData.map((point, index) => {
        const x =
            normalizedData.length === 1
                ? width / 2
                : padding + (index / (normalizedData.length - 1)) * usableWidth
        const y = padding + (1 - (point.value - min) / span) * usableHeight
        return { ...point, x, y }
    })
}

function buildLinePoints(points: NormalizedPoint[]) {
    return points
}

function buildStepPoints(points: NormalizedPoint[]) {
    const steppedPoints: NormalizedPoint[] = []
    if (points.length === 0) return steppedPoints

    steppedPoints.push(points[0])
    for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1]
        const current = points[index]
        const midpoint = {
            index: previous.index,
            label: previous.label,
            x: previous.x + (current.x - previous.x) / 2,
            y: previous.y,
            value: previous.value,
        }
        const verticalPoint = {
            index: current.index,
            label: current.label,
            x: midpoint.x,
            y: current.y,
            value: current.value,
        }
        steppedPoints.push(midpoint, verticalPoint, current)
    }

    return steppedPoints
}

function formatChartNumber(value: number) {
    return Number(value.toFixed(3))
}

function buildSvgPointList(points: NormalizedPoint[]) {
    return points
        .map((point) => `${formatChartNumber(point.x)},${formatChartNumber(point.y)}`)
        .join(" ")
}

function buildAreaPointList(points: NormalizedPoint[], height: number) {
    if (points.length === 0) return undefined
    const last = points[points.length - 1]
    const first = points[0]

    return [
        buildSvgPointList(points),
        `${formatChartNumber(last.x)},${formatChartNumber(height)}`,
        `${formatChartNumber(first.x)},${formatChartNumber(height)}`,
    ].join(" ")
}

function getPointHitRange(points: NormalizedPoint[], index: number, width: number) {
    const point = points[index]
    if (!point) return { start: 0, end: width }
    if (points.length <= 1) return { start: 0, end: width }

    const next = points[index + 1]

    return {
        start: index === 0 ? 0 : point.x,
        end: next ? next.x : width,
    }
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

const SparklineChart = React.forwardRef<HTMLDivElement, SparklineChartProps>(
    (
        {
            className,
            data,
            variant = sparklineChartDefaultVariantKey,
            color,
            referenceValue,
            referenceLabel = "Reference",
            showGrid = true,
            showDots = false,
            strokeWidth = 2,
            formatValue = defaultChartValueFormatter,
            ...props
        },
        ref
    ) => {
        const [setRootNode, size] = useElementSize<HTMLDivElement>()
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const [tooltipPosition, setTooltipPosition] = React.useState({
            x: 50,
            y: 20,
        })
        const [tooltipContent, setTooltipContent] =
            React.useState<SparklineTooltipState | null>(null)
        const width = size.width || 240
        const height = size.height || 96
        const padding = 6
        const values = data.map(getChartValue).filter((value) => Number.isFinite(value))
        const domainValues =
            referenceValue === undefined ? values : [...values, referenceValue]
        const domain =
            domainValues.length > 0
                ? {
                      min: Math.min(...domainValues),
                      max: Math.max(...domainValues),
                  }
                : undefined
        const points = buildPoints(data, width, height, padding, domain)
        const strokeColor = getChartColor(color, 0)
        const referencePoints =
            referenceValue === undefined
                ? []
                : buildPoints([referenceValue, referenceValue], width, height, padding, domain)
        const referenceY =
            referencePoints.length === 2 ? (referencePoints[0].y / height) * 100 : null
        const referenceText = chartLabelToString(referenceLabel, "Reference")
        const linePoints = variant === "step" ? buildStepPoints(points) : buildLinePoints(points)
        const linePointList = buildSvgPointList(linePoints)
        const areaPointList = buildAreaPointList(linePoints, height)
        const setRef = (node: HTMLDivElement | null) => {
            setRootNode(node)
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        }
        const openPointTooltip = (
            point: NormalizedPoint,
            position: { x: number; y: number }
        ) => {
            setTooltipContent({
                label: point.label,
                value: formatValue(point.value),
            })
            setTooltipPosition(position)
            setTooltipOpen(true)
        }
        const handlePointerMove = (
            event:
                | React.PointerEvent<HTMLDivElement>
                | React.MouseEvent<HTMLDivElement>
        ) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const localX = event.clientX - rect.left
            const localY = event.clientY - rect.top

            for (let index = 0; index < points.length; index += 1) {
                const point = points[index]
                const range = getPointHitRange(points, index, width)
                const isLast = index === points.length - 1

                if (
                    localX >= range.start &&
                    (localX < range.end || isLast)
                ) {
                    openPointTooltip(point, {
                        x: clamp((localX / rect.width) * 100),
                        y: clamp((localY / rect.height) * 100),
                    })
                    return
                }
            }

            setTooltipOpen(false)
        }

        return (
            <div
                ref={setRef}
                role="img"
                className={cn(
                    sparklineChartVariantClasses[variant],
                    "relative",
                    className
                )}
                onPointerMove={handlePointerMove}
                onMouseMove={handlePointerMove}
                onMouseLeave={() => setTooltipOpen(false)}
                onPointerLeave={() => setTooltipOpen(false)}
                {...props}
            >
                {showGrid
                    ? [25, 50, 75].map((percent) => (
                          <span
                              key={percent}
                              className="pointer-events-none absolute inset-x-0 border-t border-border/55"
                              style={{ top: `${percent}%` }}
                              aria-hidden="true"
                          />
                      ))
                    : null}
                {referenceY !== null ? (
                    <>
                        <span
                            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-foreground/35"
                            style={{ top: `${referenceY}%` }}
                            aria-hidden="true"
                        />
                        <ChartTooltip
                            label={referenceLabel}
                            value={formatValue(referenceValue ?? 0)}
                        >
                            <span
                                className="absolute inset-x-0 z-20 h-5 -translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                style={{ top: `${referenceY}%` }}
                                tabIndex={0}
                                aria-label={`${referenceText}: ${formatValue(referenceValue ?? 0)}`}
                                onPointerMove={(event) => {
                                    event.stopPropagation()
                                    setTooltipOpen(false)
                                }}
                                onMouseMove={(event) => {
                                    event.stopPropagation()
                                    setTooltipOpen(false)
                                }}
                            />
                        </ChartTooltip>
                    </>
                ) : null}
                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    viewBox={`0 0 ${formatChartNumber(width)} ${formatChartNumber(height)}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {variant === "area" && areaPointList ? (
                        <polygon
                            points={areaPointList}
                            fill={strokeColor}
                            opacity={0.12}
                        />
                    ) : null}
                    <polyline
                        points={linePointList}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                    {showDots
                        ? points.map((point, index) => (
                              <circle
                                  key={`${point.x}-${index}`}
                                  cx={formatChartNumber(point.x)}
                                  cy={formatChartNumber(point.y)}
                                  r={4}
                                  fill="hsl(var(--background))"
                                  stroke={strokeColor}
                                  strokeWidth={2}
                                  vectorEffect="non-scaling-stroke"
                              />
                          ))
                        : null}
                </svg>
                {points.map((point, index) => {
                    const range = getPointHitRange(points, index, width)

                    return (
                        <span
                            key={`hit-${point.x}-${index}`}
                            className="pointer-events-none absolute inset-y-0 z-10 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            style={{
                                left: `${(range.start / width) * 100}%`,
                                width: `${((range.end - range.start) / width) * 100}%`,
                            }}
                            tabIndex={0}
                            aria-label={`${chartLabelToString(point.label)}: ${formatValue(point.value)}`}
                            onFocus={() =>
                                openPointTooltip(point, {
                                    x: (point.x / width) * 100,
                                    y: (point.y / height) * 100,
                                })
                            }
                            onBlur={() => setTooltipOpen(false)}
                        />
                    )
                })}
                <ChartFloatingTooltip
                    label={tooltipContent?.label}
                    value={tooltipContent?.value}
                    position={tooltipPosition}
                    open={tooltipOpen}
                />
            </div>
        )
    }
)
SparklineChart.displayName = "SparklineChart"

export { SparklineChart }
