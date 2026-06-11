"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    defaultChartValueFormatter,
} from "./chart-utils"
import { ChartLegend } from "./ChartLegend"
import { ChartFloatingTooltip } from "./chart-tooltip"
import {
    buildActiveCircularSegmentGradient,
    buildConicGradient,
    buildLegendItems,
    getCircularSegmentAtPercent,
    getCircularSegmentPosition,
    getCircularSegmentShare,
    type NormalizedCircularSegment,
    normalizeCircularSegments,
} from "./circular-chart-utils"
import type { DonutChartVariantKey } from "./generated/variant-keys"
import { donutChartDefaultVariantKey } from "./generated/default-variant-keys"

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
    segments: ChartDataPoint[]
    variant?: DonutChartVariantKey
    centerLabel?: React.ReactNode
    centerValue?: React.ReactNode
    thickness?: number
    showLegend?: boolean
    formatValue?: (value: number) => React.ReactNode
    totalLabel?: React.ReactNode
}

const donutChartVariantClasses: Record<DonutChartVariantKey, string> = {
    compact: "min-h-[144px] w-full p-0",
    default: "min-h-[192px] w-full p-0",
}

const donutChartSizeClasses: Record<DonutChartVariantKey, string> = {
    compact: "max-w-36",
    default: "max-w-48",
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
    (
        {
            className,
            segments,
            variant = donutChartDefaultVariantKey,
            centerLabel,
            centerValue,
            thickness = variant === "compact" ? 18 : 24,
            showLegend = false,
            formatValue = defaultChartValueFormatter,
            totalLabel = "Total",
            ...props
        },
        ref
    ) => {
        const normalizedSegments = React.useMemo(
            () => normalizeCircularSegments(segments),
            [segments]
        )
        const background = buildConicGradient(normalizedSegments)
        const legendItems = buildLegendItems(segments, formatValue, totalLabel)
        const [activeSegment, setActiveSegment] = React.useState<
            NormalizedCircularSegment | undefined
        >(
            normalizedSegments[0]
        )
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const [tooltipPosition, setTooltipPosition] = React.useState({
            x: 50,
            y: 18,
        })
        const chartRef = React.useRef<HTMLDivElement | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const tooltipSegment = activeSegment ?? normalizedSegments[0]
        const tooltipShare = getCircularSegmentShare(tooltipSegment)
        const tooltipShareLabel =
            tooltipShare !== undefined
                ? `${defaultChartValueFormatter(tooltipShare)}%`
                : undefined
        const activeOverlay = tooltipOpen
            ? buildActiveCircularSegmentGradient(tooltipSegment)
            : undefined
        const activeIndex = Math.max(
            0,
            normalizedSegments.findIndex(
                (segment) =>
                    segment === tooltipSegment ||
                    segment.label === tooltipSegment?.label
            )
        )

        React.useEffect(() => {
            setActiveSegment(normalizedSegments[0])
            setTooltipPosition(getCircularSegmentPosition(normalizedSegments[0]))
        }, [normalizedSegments])

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

            if (distance < innerRadius || distance > radius) {
                setTooltipOpen(false)
                return
            }

            const angle = (Math.atan2(dy, dx) * 180) / Math.PI
            const percent = ((((angle + 90) % 360) + 360) % 360) / 360 * 100
            setActiveSegment(getCircularSegmentAtPercent(normalizedSegments, percent))
            setTooltipPosition({
                x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
                y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
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
                    donutChartVariantClasses[variant],
                    "flex flex-col items-center justify-center gap-3",
                    className
                )}
                {...props}
            >
                <div
                    ref={chartRef}
                    className={cn(
                        "relative aspect-square w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        donutChartSizeClasses[variant]
                    )}
                    style={{ background }}
                    role="img"
                    aria-label={
                        tooltipSegment
                            ? `${chartLabelToString(tooltipSegment.label)}: ${formatValue(tooltipSegment.value)}${
                                  tooltipShareLabel ? ` (${tooltipShareLabel})` : ""
                              }`
                            : props["aria-label"]
                    }
                    tabIndex={0}
                    onFocus={() => {
                        setActiveSegment(normalizedSegments[0])
                        setTooltipPosition(getCircularSegmentPosition(normalizedSegments[0]))
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
                        setActiveSegment(normalizedSegments[0])
                        setTooltipPosition(getCircularSegmentPosition(normalizedSegments[0]))
                        setTooltipOpen(false)
                    }}
                    onPointerCancel={() => {
                        touchTooltipStickyRef.current = false
                        setTooltipOpen(false)
                    }}
                >
                    {activeOverlay ? (
                        <span
                            className="pointer-events-none absolute inset-0 rounded-full mix-blend-multiply dark:mix-blend-screen"
                            style={{
                                background: activeOverlay,
                                filter: "drop-shadow(0 0 8px hsl(var(--foreground) / 0.32)) drop-shadow(0 0 14px hsl(var(--ring) / 0.26))",
                            }}
                            data-chart-active-overlay="true"
                            aria-hidden="true"
                        />
                    ) : null}
                    <div
                        className="absolute rounded-full bg-card"
                        style={{ inset: thickness }}
                        aria-hidden="true"
                    />
                    {centerLabel !== undefined || centerValue !== undefined ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
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
                        label={tooltipSegment?.label}
                        value={
                            tooltipSegment
                                ? formatValue(tooltipSegment.value)
                                : undefined
                        }
                        description={tooltipShareLabel}
                        position={tooltipPosition}
                        open={tooltipOpen}
                        anchorRef={chartRef}
                        onOpenChange={setTooltipOpen}
                    />
                </div>
                {showLegend ? (
                    <ChartLegend items={legendItems} activeIndex={activeIndex} />
                ) : null}
            </div>
        )
    }
)
DonutChart.displayName = "DonutChart"

export { DonutChart }
