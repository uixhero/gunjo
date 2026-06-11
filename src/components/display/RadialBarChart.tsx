"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartDataPoint } from "./chart-utils"
import {
    clamp,
    chartLabelToString,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartLegend } from "./ChartLegend"
import { ChartFloatingTooltip } from "./chart-tooltip"
import type { RadialBarChartVariantKey } from "./generated/variant-keys"
import { radialBarChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface RadialBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: ChartDataPoint[]
    variant?: RadialBarChartVariantKey
    max?: number
    centerLabel?: React.ReactNode
    centerValue?: React.ReactNode
    thickness?: number
    gap?: number
    showLegend?: boolean
    formatValue?: (value: number) => React.ReactNode
    maxLabel?: React.ReactNode
}

const radialBarChartVariantClasses: Record<RadialBarChartVariantKey, string> = {
    compact: "min-h-[176px] w-full p-0",
    default: "min-h-[224px] w-full p-0",
}

const radialBarChartSizeClasses: Record<RadialBarChartVariantKey, string> = {
    compact: "max-w-44",
    default: "max-w-56",
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(0, value) : 0
}

const RadialBarChart = React.forwardRef<HTMLDivElement, RadialBarChartProps>(
    (
        {
            className,
            data,
            variant = radialBarChartDefaultVariantKey,
            max = 100,
            centerLabel,
            centerValue,
            thickness = variant === "compact" ? 14 : 18,
            gap = variant === "compact" ? 6 : 8,
            showLegend = false,
            formatValue = defaultChartValueFormatter,
            maxLabel = "Max",
            ...props
        },
        ref
    ) => {
        const maxValue = Math.max(max, ...data.map((item) => getPositiveValue(item.value)), 1)
        const step = thickness + gap
        const centerInset = data.length * step
        const centerClearance = variant === "compact" ? 4 : 6
        const [activeIndex, setActiveIndex] = React.useState(0)
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const [tooltipPosition, setTooltipPosition] = React.useState({
            x: 50,
            y: 12,
        })
        const chartRef = React.useRef<HTMLDivElement | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const tooltipItem = data[activeIndex] ?? data[0]
        const tooltipPercent = tooltipItem
            ? normalizeChartValue(getPositiveValue(tooltipItem.value), maxValue)
            : 0
        const tooltipPercentLabel = `${defaultChartValueFormatter(tooltipPercent)}%`
        const legendItems = data.map((item, index) => ({
            label: item.label,
            value: formatValue(item.value),
            color: item.color ?? getChartColor(undefined, index),
            description: [maxLabel, ": ", formatValue(maxValue)],
        }))

        const updateTooltipAtPoint = (
            element: HTMLDivElement,
            clientX: number,
            clientY: number
        ) => {
            const rect = element.getBoundingClientRect()
            const center = rect.width / 2
            const dx = clientX - rect.left - center
            const dy = clientY - rect.top - center
            const distance = Math.sqrt(dx * dx + dy * dy)
            const hitSlop = Math.max(2, gap / 2)
            const anglePercent =
                (((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360) / 360 * 100
            const angleSlop = 1.5
            const nextActiveIndex = data.findIndex((item, index) => {
                const outerRadius = center - index * step
                const innerRadius = outerRadius - thickness
                const activePercent = normalizeChartValue(
                    getPositiveValue(item.value),
                    maxValue
                )

                return (
                    distance <= outerRadius + hitSlop &&
                    distance >= innerRadius - hitSlop &&
                    activePercent > 0 &&
                    anglePercent <= Math.min(100, activePercent + angleSlop)
                )
            })

            if (nextActiveIndex < 0) {
                setTooltipOpen(false)
                return
            }

            setActiveIndex(nextActiveIndex)
            setTooltipPosition({
                x: clamp(((clientX - rect.left) / rect.width) * 100),
                y: clamp(((clientY - rect.top) / rect.height) * 100),
            })
            setTooltipOpen(true)
        }
        const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.pointerType !== "touch") {
                touchTooltipStickyRef.current = false
            }
            updateTooltipAtPoint(event.currentTarget, event.clientX, event.clientY)
        }
        const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
            touchTooltipStickyRef.current = event.pointerType === "touch"
            if (event.pointerType === "touch") {
                event.preventDefault()
            }
            event.currentTarget.focus({ preventScroll: true })
            updateTooltipAtPoint(event.currentTarget, event.clientX, event.clientY)
        }
        const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
            const touch = event.touches[0]
            if (!touch) return
            touchTooltipStickyRef.current = true
            event.preventDefault()
            event.currentTarget.focus({ preventScroll: true })
            updateTooltipAtPoint(event.currentTarget, touch.clientX, touch.clientY)
        }

        return (
            <div
                ref={ref}
                className={cn(
                    radialBarChartVariantClasses[variant],
                    "flex flex-col items-center justify-center gap-4",
                    className
                )}
                {...props}
            >
                <div
                    ref={chartRef}
                    className={cn(
                        "relative aspect-square w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        radialBarChartSizeClasses[variant]
                    )}
                    role="img"
                    aria-label={
                        tooltipItem
                            ? `${chartLabelToString(tooltipItem.label)}: ${formatValue(tooltipItem.value)} (${tooltipPercentLabel} / ${chartLabelToString(maxLabel, "Max")}: ${formatValue(maxValue)})`
                            : props["aria-label"]
                    }
                    tabIndex={0}
                    onFocus={() => {
                        setActiveIndex(0)
                        setTooltipPosition({ x: 50, y: 12 })
                        setTooltipOpen(true)
                    }}
                    onBlur={() => {
                        touchTooltipStickyRef.current = false
                        setTooltipOpen(false)
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onTouchStart={handleTouchStart}
                    onPointerLeave={() => {
                        if (touchTooltipStickyRef.current) return
                        setTooltipOpen(false)
                    }}
                    onPointerCancel={() => {
                        touchTooltipStickyRef.current = false
                        setTooltipOpen(false)
                    }}
                >
                    {data.map((item, index) => {
                        const inset = index * step
                        const value = getPositiveValue(item.value)
                        const percent = normalizeChartValue(value, maxValue)
                        const color = getChartColor(item.color, index)
                        const background = `conic-gradient(${color} 0% ${percent}%, hsl(var(--muted)) ${percent}% 100%)`
                        const ringMask = `radial-gradient(circle closest-side, transparent calc(100% - ${thickness}px), hsl(var(--palette-black)) calc(100% - ${thickness}px))`

                        return (
                            <React.Fragment key={`${chartLabelToString(item.label, "Item")}-${index}`}>
                                <span
                                    className="pointer-events-none absolute rounded-full"
                                    style={{
                                        inset,
                                        background,
                                        WebkitMaskImage: ringMask,
                                        maskImage: ringMask,
                                        zIndex: data.length - index,
                                    }}
                                    aria-hidden="true"
                                />
                            </React.Fragment>
                        )
                    })}
                    {centerLabel !== undefined || centerValue !== undefined ? (
                        <div
                            className="absolute flex flex-col items-center justify-center rounded-full px-3 text-center"
                            style={{
                                inset: Math.max(centerInset - gap + centerClearance, thickness),
                                zIndex: data.length + 1,
                            }}
                        >
                            {centerValue !== undefined ? (
                                <span className="text-2xl font-semibold tracking-tight">
                                    {centerValue}
                                </span>
                            ) : null}
                            {centerLabel !== undefined ? (
                                <span className="text-xs text-muted-foreground">
                                    {centerLabel}
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                    <ChartFloatingTooltip
                        label={tooltipItem?.label}
                        value={tooltipItem ? formatValue(tooltipItem.value) : undefined}
                        description={[
                            tooltipPercentLabel,
                            " / ",
                            maxLabel,
                            ": ",
                            formatValue(maxValue),
                        ]}
                        position={tooltipPosition}
                        open={tooltipOpen}
                        anchorRef={chartRef}
                        onOpenChange={setTooltipOpen}
                    />
                </div>
                {showLegend ? <ChartLegend className="justify-center" items={legendItems} /> : null}
            </div>
        )
    }
)
RadialBarChart.displayName = "RadialBarChart"

export { RadialBarChart }
