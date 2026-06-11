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
import { ChartFloatingTooltip } from "./chart-tooltip"
import type { GaugeChartVariantKey } from "./generated/variant-keys"
import { gaugeChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface GaugeChartProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
    min?: number
    max?: number
    variant?: GaugeChartVariantKey
    color?: ChartColor
    label?: React.ReactNode
    valueLabel?: React.ReactNode
    thickness?: number
    formatValue?: (value: number) => React.ReactNode
    rangeLabel?: React.ReactNode
}

const gaugeChartVariantClasses: Record<GaugeChartVariantKey, string> = {
    compact: "h-[112px] w-full p-0",
    default: "h-[144px] w-full p-0",
}

const gaugeChartSizeClasses: Record<GaugeChartVariantKey, string> = {
    compact: "max-w-44",
    default: "max-w-56",
}

const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
    (
        {
            className,
            value,
            min = 0,
            max = 100,
            variant = gaugeChartDefaultVariantKey,
            color,
            label,
            valueLabel,
            thickness = variant === "compact" ? 16 : 22,
            formatValue = defaultChartValueFormatter,
            rangeLabel = "Range",
            ...props
        },
        ref
    ) => {
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const [tooltipPosition, setTooltipPosition] = React.useState({
            x: 50,
            y: 24,
        })
        const chartRef = React.useRef<HTMLDivElement | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const range = Math.max(max - min, 1)
        const normalizedValue = clamp(value, min, max)
        const percent = normalizeChartValue(normalizedValue - min, range)
        const degrees = (percent / 100) * 180
        const activeColor = getChartColor(color, 0)
        const trackColor = "hsl(var(--muted))"
        const background = `conic-gradient(from 270deg, ${activeColor} 0deg ${degrees}deg, ${trackColor} ${degrees}deg 180deg, transparent 180deg 360deg)`
        const formattedValue = formatValue(normalizedValue)
        const displayValue = valueLabel ?? formattedValue
        const rangeValueLabel = `${formatValue(min)} - ${formatValue(max)}`
        const ariaValue = chartLabelToString(
            displayValue,
            chartLabelToString(formattedValue, String(normalizedValue))
        )
        const ariaLabel = `${chartLabelToString(label, "Gauge")}: ${ariaValue} (${chartLabelToString(rangeLabel, "Range")}: ${rangeValueLabel})`

        const updateTooltipAtPoint = (
            element: HTMLDivElement,
            clientX: number,
            clientY: number
        ) => {
            const rect = element.getBoundingClientRect()
            const radius = rect.width / 2
            const centerX = rect.left + radius
            const centerY = rect.top + radius
            const dx = clientX - centerX
            const dy = clientY - centerY
            const distance = Math.sqrt(dx * dx + dy * dy)
            const innerRadius = Math.max(radius - thickness, 0)
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI
            const cssAngle = (((angle + 90) % 360) + 360) % 360
            const sweep = (cssAngle - 270 + 360) % 360
            const isOnActiveArc =
                distance >= innerRadius &&
                distance <= radius &&
                sweep <= degrees &&
                sweep <= 180

            if (!isOnActiveArc) {
                setTooltipOpen(false)
                return
            }

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
                    gaugeChartVariantClasses[variant],
                    "flex flex-col items-center justify-end",
                    className
                )}
                {...props}
            >
                <div
                    ref={chartRef}
                    className={cn(
                        "relative aspect-[2/1] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        gaugeChartSizeClasses[variant]
                    )}
                    role="img"
                    aria-label={props["aria-label"] ?? ariaLabel}
                    tabIndex={0}
                    onFocus={() => {
                        setTooltipPosition({ x: percent, y: 24 })
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
                    <div
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                        aria-hidden="true"
                    >
                        <div
                            className="absolute inset-x-0 top-0 aspect-square rounded-full"
                            style={{ background }}
                        />
                        <div
                            className="absolute rounded-full bg-card"
                            style={{
                                insetInline: thickness,
                                top: thickness,
                                width: `calc(100% - ${thickness * 2}px)`,
                                aspectRatio: "1 / 1",
                            }}
                        />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-4 text-center">
                        <span className="text-2xl font-semibold tracking-tight">
                            {valueLabel ?? formatValue(normalizedValue)}
                        </span>
                        {label !== undefined ? (
                            <span className="text-xs text-muted-foreground">{label}</span>
                        ) : null}
                    </div>
                    <ChartFloatingTooltip
                        label={label}
                        value={displayValue}
                        description={[rangeLabel, ": ", rangeValueLabel]}
                        position={tooltipPosition}
                        open={tooltipOpen}
                        anchorRef={chartRef}
                        onOpenChange={setTooltipOpen}
                    />
                </div>
            </div>
        )
    }
)
GaugeChart.displayName = "GaugeChart"

export { GaugeChart }
