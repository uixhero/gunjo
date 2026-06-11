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
import type { ChartDataPoint } from "./chart-utils"
import {
    chartLabelToString,
    clamp,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"
import { ChartFloatingTooltip, ChartTooltip } from "./chart-tooltip"
import type { ConcentricProgressCardVariantKey } from "./generated/variant-keys"
import { concentricProgressCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface ConcentricProgressRing extends ChartDataPoint {
    description?: React.ReactNode
    detail?: React.ReactNode
}

export interface ConcentricProgressMetric {
    label: React.ReactNode
    value: React.ReactNode
    description?: React.ReactNode
}

export interface ConcentricProgressCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    rings: ConcentricProgressRing[]
    title?: React.ReactNode
    description?: React.ReactNode
    value?: React.ReactNode
    centerLabel?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    metrics?: ConcentricProgressMetric[]
    selectedIndex?: number
    max?: number
    caption?: React.ReactNode
    variant?: ConcentricProgressCardVariantKey
    thickness?: number
    gap?: number
    showLegend?: boolean
    formatValue?: (value: number) => React.ReactNode
    maxLabel?: React.ReactNode
    onRingSelect?: (ring: ConcentricProgressRing, index: number) => void
}

type ConcentricProgressCardClassNames = {
    card: string
    header: string
    content: string
    chart: string
    metric: string
    title: string
}

const variantClasses: Record<ConcentricProgressCardVariantKey, ConcentricProgressCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        chart: "max-w-52",
        metric: "px-3 py-2",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        chart: "max-w-64",
        metric: "px-3 py-2.5",
        title: "text-base",
    },
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function getRingIndexAtPoint(
    rect: DOMRect,
    clientX: number,
    clientY: number,
    rings: ConcentricProgressRing[],
    maxValue: number,
    thickness: number,
    gap: number
) {
    const radius = Math.min(rect.width, rect.height) / 2
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = clientX - centerX
    const dy = clientY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const step = thickness + gap
    const hitSlop = Math.max(2, gap / 2)
    const anglePercent =
        ((((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360) / 360) * 100
    const angleSlop = 1.5

    return rings.findIndex((ring, index) => {
        const outerRadius = radius - index * step
        const innerRadius = outerRadius - thickness
        const activePercent = normalizeChartValue(
            getPositiveValue(ring.value),
            maxValue
        )

        return (
            distance <= outerRadius + hitSlop &&
            distance >= innerRadius - hitSlop &&
            activePercent > 0 &&
            anglePercent <= Math.min(100, activePercent + angleSlop)
        )
    })
}

function buildRingMask(ringThickness: number) {
    const feather = 1
    return `radial-gradient(circle closest-side, transparent calc(100% - ${ringThickness + feather}px), hsl(var(--palette-black) / 0.65) calc(100% - ${ringThickness + feather / 2}px), hsl(var(--palette-black)) calc(100% - ${ringThickness}px))`
}

const ConcentricProgressCard = React.forwardRef<
    HTMLDivElement,
    ConcentricProgressCardProps
>(
    (
        {
            className,
            rings,
            title = "Concentric progress",
            description,
            value,
            centerLabel,
            delta,
            deltaDescription,
            metrics = [],
            selectedIndex,
            max,
            caption,
            variant = concentricProgressCardDefaultVariantKey,
            thickness = variant === "compact" ? 12 : 14,
            gap = variant === "compact" ? 4 : 5,
            showLegend = true,
            formatValue = defaultChartValueFormatter,
            maxLabel = "Max",
            onRingSelect,
            ...props
        },
        ref
    ) => {
        const styles = variantClasses[variant]
        const fallbackMaxValue = Math.max(...rings.map((ring) => getPositiveValue(ring.value)), 1)
        const maxValue = Math.max(max ?? fallbackMaxValue, 1)
        const step = thickness + gap
        const centerInset = rings.length * step
        const centerClearance = variant === "compact" ? 4 : 6
        const initialActiveIndex = Math.min(
            rings.length - 1,
            Math.max(0, selectedIndex ?? 0)
        )
        const [activeIndex, setActiveIndex] = React.useState(initialActiveIndex)
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const [tooltipPosition, setTooltipPosition] = React.useState({
            x: 50,
            y: 12,
        })
        const chartRef = React.useRef<HTMLDivElement | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const activeRing = rings[activeIndex] ?? rings[0]
        const selectedRing =
            selectedIndex === undefined ? undefined : rings[selectedIndex]
        const activePercent =
            activeRing === undefined
                ? 0
                : normalizeChartValue(getPositiveValue(activeRing.value), maxValue)
        const activePercentLabel = `${defaultChartValueFormatter(activePercent)}%`
        const selectedPercent =
            selectedRing === undefined
                ? 0
                : normalizeChartValue(getPositiveValue(selectedRing.value), maxValue)
        const selectedHighlightInset =
            selectedIndex === undefined ? 0 : selectedIndex * step + 2
        const selectedHighlightThickness = Math.max(thickness - 4, 2)

        React.useEffect(() => {
            setActiveIndex(initialActiveIndex)
        }, [initialActiveIndex])

        const updateTooltipAtPoint = (
            element: HTMLDivElement,
            clientX: number,
            clientY: number
        ) => {
            const rect = element.getBoundingClientRect()
            const nextIndex = getRingIndexAtPoint(
                rect,
                clientX,
                clientY,
                rings,
                maxValue,
                thickness,
                gap
            )

            if (nextIndex < 0) {
                setTooltipOpen(false)
                return
            }

            setActiveIndex(nextIndex)
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

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (!onRingSelect) return

            const rect = event.currentTarget.getBoundingClientRect()
            const nextIndex = getRingIndexAtPoint(
                rect,
                event.clientX,
                event.clientY,
                rings,
                maxValue,
                thickness,
                gap
            )
            const nextRing = rings[nextIndex]

            if (nextRing) onRingSelect(nextRing, nextIndex)
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
                        {delta !== undefined && delta !== null ? (
                            <div
                                className="shrink-0 text-right text-sm font-semibold text-success-strong tabular-nums"
                                title={chartLabelToString(
                                    deltaDescription,
                                    "Delta description"
                                )}
                            >
                                {delta}
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent className={cn("space-y-4", styles.content)}>
                    {metrics.length > 0 ? (
                        <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                            {metrics.map((metric, index) => (
                                <div
                                    key={`${chartLabelToString(metric.label, "Metric")}-${index}`}
                                    className={cn(
                                        "min-w-0 rounded-md border bg-card",
                                        styles.metric
                                    )}
                                >
                                    <div className="truncate text-xl font-semibold tracking-tight tabular-nums">
                                        {metric.value}
                                    </div>
                                    <div className="mt-1 truncate text-xs text-muted-foreground">
                                        {metric.label}
                                    </div>
                                    {metric.description ? (
                                        <div className="mt-1 truncate text-xs text-muted-foreground">
                                            {metric.description}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div
                        className={cn(
                            "grid min-w-0 gap-4",
                            showLegend
                                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
                                : "justify-items-center"
                        )}
                    >
                        <div
                            className={cn(
                                "flex min-w-0 justify-center",
                                !showLegend && "w-full"
                            )}
                        >
                            <div
                                ref={chartRef}
                                className={cn(
                                    "relative aspect-square w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                    onRingSelect && "cursor-pointer",
                                    styles.chart
                                )}
                                role="img"
                                aria-label={
                                    activeRing
                                        ? `${chartLabelToString(activeRing.label)}: ${formatValue(activeRing.value)} (${activePercentLabel} / ${chartLabelToString(maxLabel, "Max")}: ${formatValue(maxValue)})`
                                        : props["aria-label"]
                                }
                                tabIndex={0}
                                onFocus={() => {
                                    setActiveIndex(initialActiveIndex)
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
                                onClick={handleClick}
                            >
                                {rings.map((ring, index) => {
                                    const inset = index * step
                                    const ringValue = getPositiveValue(ring.value)
                                    const percent = normalizeChartValue(ringValue, maxValue)
                                    const color = getChartColor(ring.color, index)
                                    const trackColor = "hsl(var(--muted))"
                                    const background = `conic-gradient(${color} 0% ${percent}%, ${trackColor} ${percent}% 100%)`
                                    const ringMask = buildRingMask(thickness)
                                    const isSelected = selectedIndex === index

                                    return (
                                        <span
                                            key={`${chartLabelToString(ring.label, "Ring")}-${index}`}
                                            className={cn(
                                                "pointer-events-none absolute rounded-full transition-opacity",
                                                selectedIndex !== undefined &&
                                                    !isSelected &&
                                                    "opacity-45"
                                            )}
                                            style={{
                                                inset,
                                                background,
                                                WebkitMaskImage: ringMask,
                                                maskImage: ringMask,
                                                zIndex: rings.length - index,
                                            }}
                                            aria-hidden="true"
                                        />
                                    )
                                })}
                                {selectedRing ? (
                                    <span
                                        className="pointer-events-none absolute rounded-full"
                                        style={{
                                            inset: selectedHighlightInset,
                                            background: `conic-gradient(hsl(var(--foreground) / 0.22) 0% ${selectedPercent}%, transparent ${selectedPercent}% 100%)`,
                                            WebkitMaskImage: buildRingMask(selectedHighlightThickness),
                                            maskImage: buildRingMask(selectedHighlightThickness),
                                            zIndex: rings.length + 1,
                                        }}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                {value !== undefined || centerLabel !== undefined ? (
                                    <div
                                        className="absolute flex flex-col items-center justify-center rounded-full px-3 text-center"
                                        style={{
                                            inset: Math.max(
                                                centerInset - gap + centerClearance,
                                                thickness
                                            ),
                                            zIndex: rings.length + 2,
                                        }}
                                    >
                                        {value !== undefined ? (
                                            <span
                                                className={cn(
                                                    "whitespace-nowrap font-semibold tracking-tight tabular-nums leading-none",
                                                    variant === "compact" ? "text-lg" : "text-xl"
                                                )}
                                            >
                                                {value}
                                            </span>
                                        ) : null}
                                        {centerLabel !== undefined ? (
                                            <span className="mt-1 max-w-full whitespace-nowrap text-[11px] leading-none text-muted-foreground">
                                                {centerLabel}
                                            </span>
                                        ) : null}
                                    </div>
                                ) : null}
                                <ChartFloatingTooltip
                                    label={activeRing?.label}
                                    value={
                                        activeRing
                                            ? formatValue(activeRing.value)
                                            : undefined
                                    }
                                    description={
                                        activeRing?.description ?? [
                                            activePercentLabel,
                                            " / ",
                                            maxLabel,
                                            ": ",
                                            formatValue(maxValue),
                                        ]
                                    }
                                    position={tooltipPosition}
                                    open={tooltipOpen}
                                    anchorRef={chartRef}
                                    onOpenChange={setTooltipOpen}
                                />
                            </div>
                        </div>

                        {showLegend ? (
                            <div className="grid min-w-0 gap-2">
                                {rings.map((ring, index) => {
                                    const percent = normalizeChartValue(
                                        getPositiveValue(ring.value),
                                        maxValue
                                    )
                                    const isSelected = selectedIndex === index

                                    return (
                                        <ChartTooltip
                                            key={`${chartLabelToString(ring.label, "Ring")}-row-${index}`}
                                            label={ring.label}
                                            value={formatValue(ring.value)}
                                            description={
                                                ring.description ??
                                                `${defaultChartValueFormatter(percent)}%`
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={cn(
                                                    "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-md border bg-card px-3 py-2 text-left transition-colors",
                                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                    onRingSelect
                                                        ? "cursor-pointer hover:bg-accent/10"
                                                        : "cursor-default",
                                                    isSelected &&
                                                        "border-foreground shadow-sm"
                                                )}
                                                onClick={() => onRingSelect?.(ring, index)}
                                            >
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor: getChartColor(
                                                            ring.color,
                                                            index
                                                        ),
                                                    }}
                                                    aria-hidden="true"
                                                />
                                                <span className="min-w-0 truncate text-xs text-muted-foreground">
                                                    {ring.label}
                                                </span>
                                                <span className="text-sm font-semibold tabular-nums">
                                                    {formatValue(ring.value)}
                                                </span>
                                                {ring.detail ? (
                                                    <span className="col-span-3 truncate text-xs text-muted-foreground">
                                                        {ring.detail}
                                                    </span>
                                                ) : null}
                                            </button>
                                        </ChartTooltip>
                                    )
                                })}
                            </div>
                        ) : null}
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
ConcentricProgressCard.displayName = "ConcentricProgressCard"

export { ConcentricProgressCard }
