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
import { ChartLegend } from "./ChartLegend"
import { ChartFloatingTooltip } from "./chart-tooltip"
import type { RibbonChartVariantKey } from "./generated/variant-keys"
import { ribbonChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface RibbonChartLayer {
    label?: React.ReactNode
    data: Array<ChartDataPoint | number>
    color?: ChartColor
}

export interface RibbonChartProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    layers: RibbonChartLayer[]
    variant?: RibbonChartVariantKey
    max?: number
    totalLabel?: React.ReactNode
    showGrid?: boolean
    showLegend?: boolean
    showLabels?: boolean
    formatValue?: (value: number) => React.ReactNode
}

interface RibbonPoint {
    index: number
    label: React.ReactNode
    value: number
    total: number
    x: number
    top: number
    bottom: number
}

interface RibbonPadding {
    top: number
    right: number
    bottom: number
    left: number
}

interface RibbonTooltipState {
    label: React.ReactNode
    value: React.ReactNode
    description: React.ReactNode
    ariaLabel: string
}

interface ActiveRibbonPoint {
    layerIndex: number
    pointIndex: number
}

interface RibbonHitBox {
    left: number
    right: number
    centerY: number
    height: number
}

const ribbonChartVariantClasses: Record<RibbonChartVariantKey, string> = {
    flow: "h-[260px] w-full p-0",
    stacked: "h-[260px] w-full p-0",
}

const plotPadding: RibbonPadding = {
    top: 14,
    right: 12,
    bottom: 10,
    left: 28,
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(0, value) : 0
}

function getLayerLabel(layer: RibbonChartLayer, index: number) {
    return layer.label ?? `Layer ${index + 1}`
}

function getMaxPointCount(layers: RibbonChartLayer[]) {
    return Math.max(1, ...layers.map((layer) => layer.data.length))
}

function getRibbonLabels(layers: RibbonChartLayer[]) {
    const longestLayer = layers.reduce<RibbonChartLayer | null>((longest, layer) => {
        if (!longest || layer.data.length > longest.data.length) return layer
        return longest
    }, null)

    return longestLayer?.data.map((item, index) => getChartLabel(item, index)) ?? []
}

function getLayerPointLabel(
    layer: RibbonChartLayer,
    labels: React.ReactNode[],
    index: number
) {
    const point = layer.data[index]
    if (point !== undefined) return getChartLabel(point, index)
    return labels[index] ?? `#${index + 1}`
}

function getLayerPointValue(layer: RibbonChartLayer, index: number) {
    const point = layer.data[index]
    return point === undefined ? 0 : getPositiveValue(getChartValue(point))
}

function buildLayerValues(layers: RibbonChartLayer[], pointCount: number) {
    return layers.map((layer) =>
        Array.from({ length: pointCount }, (_, index) => getLayerPointValue(layer, index))
    )
}

function getMaxTotal(
    layerValues: number[][],
    pointCount: number,
    max: number | undefined
) {
    const totals = Array.from({ length: pointCount }, (_, pointIndex) =>
        layerValues.reduce((sum, values) => sum + (values[pointIndex] ?? 0), 0)
    )

    return Math.max(max ?? 0, ...totals, 1)
}

function getXPosition(
    index: number,
    pointCount: number,
    width: number,
    padding: RibbonPadding
) {
    if (pointCount <= 1) return width / 2
    const usableWidth = Math.max(1, width - padding.left - padding.right)
    return padding.left + (index + 0.5) * (usableWidth / pointCount)
}

function getPointHitRange(
    index: number,
    pointCount: number,
    width: number,
    padding: RibbonPadding
) {
    const startX = padding.left
    const endX = width - padding.right

    if (pointCount <= 1) {
        return { start: startX, end: endX }
    }

    const currentX = getXPosition(index, pointCount, width, padding)
    const nextX =
        index === pointCount - 1
            ? endX
            : getXPosition(index + 1, pointCount, width, padding)

    return {
        start: index === 0 ? startX : currentX,
        end: nextX,
    }
}

function buildRibbonPoints({
    layers,
    width,
    height,
    padding,
    max,
    variant,
}: {
    layers: RibbonChartLayer[]
    width: number
    height: number
    padding: RibbonPadding
    max?: number
    variant: RibbonChartVariantKey
}) {
    const pointCount = getMaxPointCount(layers)
    const labels = getRibbonLabels(layers)
    const layerValues = buildLayerValues(layers, pointCount)
    const maxTotal = getMaxTotal(layerValues, pointCount, max)
    const usableHeight = Math.max(1, height - padding.top - padding.bottom)
    const layerPoints = layers.map<RibbonPoint[]>(() => [])

    for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
        const columnTotal = layerValues.reduce(
            (sum, values) => sum + (values[pointIndex] ?? 0),
            0
        )
        const columnHeight = (columnTotal / maxTotal) * usableHeight
        const columnTop =
            variant === "flow"
                ? padding.top + (usableHeight - columnHeight) / 2
                : height - padding.bottom - columnHeight
        let cursor = columnTop

        layers.forEach((layer, layerIndex) => {
            const value = layerValues[layerIndex]?.[pointIndex] ?? 0
            const pointHeight = (value / maxTotal) * usableHeight
            layerPoints[layerIndex].push({
                index: pointIndex,
                label: getLayerPointLabel(layer, labels, pointIndex),
                value,
                total: columnTotal,
                x: getXPosition(pointIndex, pointCount, width, padding),
                top: cursor,
                bottom: cursor + pointHeight,
            })
            cursor += pointHeight
        })
    }

    return { labels, layerPoints }
}

function buildRibbonClipPath(points: RibbonPoint[], width: number, height: number) {
    if (points.length === 0) return undefined

    const topPoints = points
        .map((point) => `${(point.x / width) * 100}% ${(point.top / height) * 100}%`)
        .join(", ")
    const bottomPoints = [...points]
        .reverse()
        .map((point) => `${(point.x / width) * 100}% ${(point.bottom / height) * 100}%`)
        .join(", ")

    return `polygon(${topPoints}, ${bottomPoints})`
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

const RibbonChart = React.forwardRef<HTMLDivElement, RibbonChartProps>(
    (
        {
            className,
            layers,
            variant = ribbonChartDefaultVariantKey,
            max,
            totalLabel = "Total",
            showGrid = true,
            showLegend = false,
            showLabels = true,
            formatValue = defaultChartValueFormatter,
            ...props
        },
        ref
    ) => {
        const [setPlotNode, plotSize] = useElementSize<HTMLDivElement>()
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const [tooltipPosition, setTooltipPosition] = React.useState({
            x: 50,
            y: 20,
        })
        const [tooltipContent, setTooltipContent] =
            React.useState<RibbonTooltipState | null>(null)
        const [activePoint, setActivePoint] =
            React.useState<ActiveRibbonPoint | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const width = plotSize.width || 480
        const height = plotSize.height || 212
        const pointCount = getMaxPointCount(layers)
        const { labels, layerPoints } = buildRibbonPoints({
            layers,
            width,
            height,
            padding: plotPadding,
            max,
            variant,
        })
        const layerTotals = layers.map((layer) =>
            layer.data.reduce<number>(
                (sum, point) => sum + getPositiveValue(getChartValue(point)),
                0
            )
        )
        const allLayerTotal = Math.max(
            layerTotals.reduce((sum, value) => sum + value, 0),
            1
        )
        const legendItems = layers.map((layer, index) => {
            const value = layerTotals[index] ?? 0
            const share = (value / allLayerTotal) * 100

            return {
                label: getLayerLabel(layer, index),
                value: formatValue(value),
                color: layer.color,
                description: [totalLabel, ": ", `${defaultChartValueFormatter(share)}%`],
            }
        })
        const getPointHitBox = (point: RibbonPoint): RibbonHitBox => {
            const hitRange = getPointHitRange(
                point.index,
                pointCount,
                width,
                plotPadding
            )
            return {
                left: hitRange.start,
                right: hitRange.end,
                centerY: (point.top + point.bottom) / 2,
                height: Math.max(point.bottom - point.top, 32),
            }
        }
        const getPointTooltip = (
            layerIndex: number,
            point: RibbonPoint
        ): RibbonTooltipState => {
            const layer = layers[layerIndex]
            const share =
                point.total > 0 ? (point.value / point.total) * 100 : 0
            const shareLabel = `${defaultChartValueFormatter(share)}%`
            const totalText = chartLabelToString(totalLabel, "Total")
            const layerText = chartLabelToString(
                getLayerLabel(layer, layerIndex),
                "Layer"
            )
            const pointText = chartLabelToString(point.label)
            const value = formatValue(point.value)
            const valueText = chartLabelToString(value, String(point.value))
            const totalValue = formatValue(point.total)
            const totalValueText = chartLabelToString(
                totalValue,
                String(point.total)
            )

            return {
                label: `${layerText} / ${pointText}`,
                value,
                description: (
                    <>
                        {totalLabel}
                        {" "}
                        {totalValue}
                        {" / "}
                        {shareLabel}
                    </>
                ),
                ariaLabel: `${layerText} ${pointText}: ${valueText} (${totalText} ${totalValueText} / ${shareLabel})`,
            }
        }
        const openPointTooltip = (
            layerIndex: number,
            point: RibbonPoint,
            position: { x: number; y: number }
        ) => {
            setTooltipContent(getPointTooltip(layerIndex, point))
            setActivePoint({ layerIndex, pointIndex: point.index })
            setTooltipPosition(position)
            setTooltipOpen(true)
        }
        const closePointTooltip = () => {
            touchTooltipStickyRef.current = false
            setTooltipOpen(false)
            setActivePoint(null)
        }
        const handlePlotPointerMove = (
            event:
                | React.PointerEvent<HTMLDivElement>
                | React.MouseEvent<HTMLDivElement>
        ) => {
            if ("pointerType" in event && event.pointerType !== "touch") {
                touchTooltipStickyRef.current = false
            }
            const rect = event.currentTarget.getBoundingClientRect()
            const localX = event.clientX - rect.left
            const localY = event.clientY - rect.top

            for (let layerIndex = 0; layerIndex < layerPoints.length; layerIndex += 1) {
                const points = layerPoints[layerIndex] ?? []

                for (const point of points) {
                    const hitBox = getPointHitBox(point)
                    const top = hitBox.centerY - hitBox.height / 2
                    const bottom = hitBox.centerY + hitBox.height / 2

                    const isInsideX =
                        localX >= hitBox.left &&
                        (localX < hitBox.right ||
                            point.index === pointCount - 1)

                    if (isInsideX && localY >= top && localY <= bottom) {
                        openPointTooltip(layerIndex, point, {
                            x: clamp((localX / rect.width) * 100),
                            y: clamp((localY / rect.height) * 100),
                        })
                        return
                    }
                }
            }

            closePointTooltip()
        }
        const handlePlotPointerDown = (
            event: React.PointerEvent<HTMLDivElement>
        ) => {
            touchTooltipStickyRef.current = event.pointerType === "touch"
            if (event.pointerType === "touch") {
                event.preventDefault()
            }
            handlePlotPointerMove(event)
        }
        const activeLayerIndex = tooltipOpen ? activePoint?.layerIndex : undefined

        return (
            <div
                ref={ref}
                role="img"
                className={cn(
                    ribbonChartVariantClasses[variant],
                    "flex min-w-0 flex-col gap-3",
                    className
                )}
                {...props}
            >
                <div
                    ref={setPlotNode}
                    className="relative min-h-0 flex-1"
                    onPointerDown={handlePlotPointerDown}
                    onPointerMove={handlePlotPointerMove}
                    onMouseMove={handlePlotPointerMove}
                    onMouseEnter={handlePlotPointerMove}
                    onPointerLeave={() => {
                        if (touchTooltipStickyRef.current) return
                        closePointTooltip()
                    }}
                    onMouseLeave={closePointTooltip}
                >
                    {showGrid
                        ? [0, 25, 50, 75, 100].map((percent) => (
                              <span
                                  key={`y-${percent}`}
                                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-border/65"
                                  style={{
                                      top: `${
                                          plotPadding.top +
                                          ((height - plotPadding.top - plotPadding.bottom) *
                                              percent) /
                                              100
                                      }px`,
                                  }}
                                  aria-hidden="true"
                              />
                          ))
                        : null}
                    {showGrid && labels.length > 1
                        ? labels.map((label, index) => (
                              <span
                                  key={`x-${chartLabelToString(label, "Label")}-${index}`}
                                  className="pointer-events-none absolute inset-y-0 border-l border-border/45"
                                  style={{
                                      left: `${
                                          getXPosition(
                                              index,
                                              labels.length,
                                              width,
                                              plotPadding
                                          )
                                      }px`,
                                  }}
                                  aria-hidden="true"
                              />
                          ))
                        : null}
                    {layers.map((layer, layerIndex) => {
                        const points = layerPoints[layerIndex] ?? []
                        const color = getChartColor(layer.color, layerIndex)
                        const clipPath = buildRibbonClipPath(points, width, height)
                        const isActiveLayer = activeLayerIndex === layerIndex

                        return (
                            <React.Fragment key={`${chartLabelToString(layer.label, "Layer")}-${layerIndex}`}>
                                {clipPath ? (
                                    <span
                                        className="pointer-events-none absolute inset-0"
                                        style={{
                                            backgroundColor: color,
                                            clipPath,
                                            opacity:
                                                activeLayerIndex !== undefined && !isActiveLayer
                                                    ? 0.42
                                                    : 0.86,
                                            zIndex: 1,
                                        }}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                {clipPath && isActiveLayer ? (
                                    <span
                                        className="pointer-events-none absolute inset-0"
                                        style={{
                                            backgroundColor: color,
                                            clipPath,
                                            filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 8px 16px hsl(var(--foreground) / 0.2))`,
                                            opacity: 0.48,
                                            zIndex: 2,
                                        }}
                                        data-chart-active-overlay="true"
                                        aria-hidden="true"
                                    />
                                ) : null}
                                {points.map((point, pointIndex) => {
                                    const hitBox = getPointHitBox(point)
                                    const tooltip = getPointTooltip(layerIndex, point)

                                    return (
                                        <span
                                            key={`${layerIndex}-${point.x}-${pointIndex}`}
                                            className="absolute z-10 -translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            style={{
                                                left: `${(hitBox.left / width) * 100}%`,
                                                top: `${(hitBox.centerY / height) * 100}%`,
                                                width: `${((hitBox.right - hitBox.left) / width) * 100}%`,
                                                height: `${hitBox.height}px`,
                                            }}
                                            tabIndex={0}
                                            aria-label={tooltip.ariaLabel}
                                            onFocus={() => {
                                                setTooltipPosition({
                                                    x:
                                                        (((hitBox.left + hitBox.right) / 2) /
                                                            width) *
                                                        100,
                                                    y: (hitBox.centerY / height) * 100,
                                                })
                                                setTooltipContent(tooltip)
                                                setActivePoint({
                                                    layerIndex,
                                                    pointIndex: point.index,
                                                })
                                                setTooltipOpen(true)
                                            }}
                                            onBlur={closePointTooltip}
                                        />
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                    <ChartFloatingTooltip
                        label={tooltipContent?.label}
                        value={tooltipContent?.value}
                        description={tooltipContent?.description}
                        position={tooltipPosition}
                        open={tooltipOpen}
                        onOpenChange={(open) => {
                            setTooltipOpen(open)
                            if (!open) {
                                touchTooltipStickyRef.current = false
                                setActivePoint(null)
                            }
                        }}
                    />
                </div>
                {showLabels && labels.length > 0 ? (
                    <div
                        className="grid min-w-0 text-xs text-muted-foreground"
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
                    <ChartLegend
                        items={legendItems}
                        variant="horizontal"
                        activeIndex={activeLayerIndex}
                    />
                ) : null}
            </div>
        )
    }
)
RibbonChart.displayName = "RibbonChart"

export { RibbonChart }
