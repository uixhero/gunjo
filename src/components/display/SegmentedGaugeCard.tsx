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
import type { SegmentedGaugeCardVariantKey } from "./generated/variant-keys"
import { segmentedGaugeCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface SegmentedGaugeCardSegment extends ChartDataPoint {
    rangeLabel?: React.ReactNode
    description?: React.ReactNode
}

export interface SegmentedGaugeCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    segments: SegmentedGaugeCardSegment[]
    title?: React.ReactNode
    description?: React.ReactNode
    value?: number
    valueLabel?: React.ReactNode
    centerLabel?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    targetValue?: number
    targetLabel?: React.ReactNode
    caption?: React.ReactNode
    variant?: SegmentedGaugeCardVariantKey
    selectedIndex?: number
    min?: number
    max?: number
    thickness?: number
    showLegend?: boolean
    formatValue?: (value: number) => React.ReactNode
    totalLabel?: React.ReactNode
    onSegmentSelect?: (segment: SegmentedGaugeCardSegment, index: number) => void
}

interface NormalizedGaugeSegment {
    label?: React.ReactNode
    value: number
    color: string
    start: number
    end: number
}

type SegmentedGaugeCardClassNames = {
    card: string
    header: string
    content: string
    chart: string
    title: string
}

const variantClasses: Record<SegmentedGaugeCardVariantKey, SegmentedGaugeCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        chart: "max-w-56",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        chart: "max-w-72",
        title: "text-base",
    },
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function getSegmentTotal(segments: SegmentedGaugeCardSegment[]) {
    return segments.reduce((sum, segment) => sum + getPositiveValue(segment.value), 0)
}

function normalizeGaugeSegments(
    segments: SegmentedGaugeCardSegment[],
    max: number
): NormalizedGaugeSegment[] {
    let cursor = 0
    return segments.map((segment, index) => {
        const value = getPositiveValue(segment.value)
        const size = normalizeChartValue(value, max)
        const normalized = {
            label: segment.label,
            value,
            color: getChartColor(segment.color, index),
            start: cursor,
            end: Math.min(100, cursor + size),
        }
        cursor = normalized.end
        return normalized
    })
}

function buildGaugeGradient(segments: NormalizedGaugeSegment[]) {
    const trackColor = "hsl(var(--muted))"
    const stops = segments
        .filter((segment) => segment.end > segment.start)
        .map(
            (segment) =>
                `${segment.color} ${segment.start * 1.8}deg ${segment.end * 1.8}deg`
        )
    const lastStop = Math.max(...segments.map((segment) => segment.end), 0)

    return `conic-gradient(from 270deg, ${
        stops.length > 0 ? `${stops.join(", ")}, ` : ""
    }${trackColor} ${lastStop * 1.8}deg 180deg, transparent 180deg 360deg)`
}

function buildSelectedSegmentGradient(
    segment: NormalizedGaugeSegment | undefined,
    color: string
) {
    if (!segment || segment.end <= segment.start) return undefined

    return `conic-gradient(from 270deg, transparent 0deg ${segment.start * 1.8}deg, ${color} ${segment.start * 1.8}deg ${segment.end * 1.8}deg, transparent ${segment.end * 1.8}deg 360deg)`
}

function getSegmentAtPercent(segments: NormalizedGaugeSegment[], percent: number) {
    return (
        segments.find(
            (segment) =>
                segment.end > segment.start &&
                percent >= segment.start &&
                percent <= segment.end
        ) ?? segments.find((segment) => segment.end > segment.start)
    )
}

function getSegmentPosition(segment: NormalizedGaugeSegment | undefined) {
    if (!segment) return { x: 50, y: 18 }
    const percent = (segment.start + segment.end) / 2
    return getGaugeArcPosition(percent)
}

function getGaugeArcPosition(percent: number) {
    const radians = (clamp(percent) / 100) * Math.PI
    return {
        x: clamp(50 - Math.cos(radians) * 42, 8, 92),
        y: clamp(100 - Math.sin(radians) * 82, 12, 88),
    }
}

function getGaugeTargetGuide(percent: number, thickness: number) {
    const radians = (clamp(percent) / 100) * Math.PI
    const position = getGaugeArcPosition(percent)
    const tangentX = 42 * Math.sin(radians)
    const tangentY = -82 * Math.cos(radians)
    return {
        ...position,
        rotation: (Math.atan2(tangentY, tangentX) * 180) / Math.PI,
        length: Math.max(28, Math.min(42, thickness + 14)),
    }
}

function getSegmentSource(
    segments: SegmentedGaugeCardSegment[],
    normalized: NormalizedGaugeSegment | undefined
) {
    if (!normalized) return undefined
    return segments.find((segment) => segment.label === normalized.label)
}

const SegmentedGaugeCard = React.forwardRef<
    HTMLDivElement,
    SegmentedGaugeCardProps
>(
    (
        {
            className,
            segments,
            title = "Segmented gauge",
            description,
            value,
            valueLabel,
            centerLabel,
            delta,
            deltaDescription,
            targetValue,
            targetLabel = "Target",
            caption,
            variant = segmentedGaugeCardDefaultVariantKey,
            selectedIndex,
            min = 0,
            max,
            thickness = variant === "compact" ? 18 : 24,
            showLegend = true,
            formatValue = defaultChartValueFormatter,
            totalLabel = "Total",
            onSegmentSelect,
            ...props
        },
        ref
    ) => {
        const styles = variantClasses[variant]
        const segmentTotal = getSegmentTotal(segments)
        const resolvedMax = Math.max(max ?? segmentTotal, segmentTotal, 1)
        const normalizedSegments = React.useMemo(
            () => normalizeGaugeSegments(segments, resolvedMax),
            [segments, resolvedMax]
        )
        const selectedSegment =
            selectedIndex === undefined ? undefined : normalizedSegments[selectedIndex]
        const [activeSegment, setActiveSegment] = React.useState<
            NormalizedGaugeSegment | undefined
        >(selectedSegment ?? normalizedSegments[0])
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const chartRef = React.useRef<HTMLDivElement | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const [tooltipPosition, setTooltipPosition] = React.useState(
            getSegmentPosition(selectedSegment ?? normalizedSegments[0])
        )
        const activeSource = getSegmentSource(segments, activeSegment)
        const activeShare =
            activeSegment === undefined
                ? undefined
                : `${defaultChartValueFormatter(
                      normalizeChartValue(activeSegment.value, resolvedMax)
                  )}%`
        const normalizedValue =
            value === undefined ? undefined : clamp(value, min, resolvedMax)
        const displayValue =
            valueLabel ??
            (normalizedValue === undefined ? undefined : formatValue(normalizedValue))
        const resolvedCenterLabel = centerLabel ?? totalLabel
        const targetPercent =
            targetValue === undefined
                ? undefined
                : normalizeChartValue(clamp(targetValue, min, resolvedMax) - min, resolvedMax - min)
        const targetGuide =
            targetPercent === undefined
                ? undefined
                : getGaugeTargetGuide(targetPercent, thickness)
        const background = buildGaugeGradient(normalizedSegments)
        const selectedFillBackground = buildSelectedSegmentGradient(
            selectedSegment,
            selectedSegment?.color ?? "transparent"
        )
        const selectedOutlineBackground = buildSelectedSegmentGradient(
            selectedSegment,
            "hsl(var(--foreground))"
        )
        React.useEffect(() => {
            const nextSegment = selectedSegment ?? normalizedSegments[0]
            setActiveSegment(nextSegment)
            setTooltipPosition(getSegmentPosition(nextSegment))
        }, [normalizedSegments, selectedSegment])

        const updateTooltipAtPoint = (
            element: HTMLDivElement,
            clientX: number,
            clientY: number
        ) => {
            const rect = element.getBoundingClientRect()
            const radius = rect.width / 2
            const innerRadius = Math.max(radius - thickness, 0)
            const centerX = rect.left + radius
            const centerY = rect.top + radius
            const dx = clientX - centerX
            const dy = clientY - centerY
            const distance = Math.sqrt(dx * dx + dy * dy)
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI
            const cssAngle = (((angle + 90) % 360) + 360) % 360
            const sweep = (cssAngle - 270 + 360) % 360
            const percent = (sweep / 180) * 100
            const nextSegment = getSegmentAtPercent(normalizedSegments, percent)
            const isOnSegment =
                distance >= innerRadius &&
                distance <= radius &&
                sweep <= 180 &&
                nextSegment !== undefined &&
                percent >= nextSegment.start &&
                percent <= nextSegment.end

            if (!isOnSegment) {
                setTooltipOpen(false)
                return
            }

            setActiveSegment(nextSegment)
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

        const handleActiveSegmentSelect = () => {
            if (!tooltipOpen || !activeSegment) return

            const nextIndex = normalizedSegments.indexOf(activeSegment)
            const sourceSegment = segments[nextIndex]
            if (nextIndex < 0 || !sourceSegment) return

            onSegmentSelect?.(sourceSegment, nextIndex)
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
                    <div className="flex min-w-0 justify-center">
                        <div
                            ref={chartRef}
                            className={cn(
                                "relative aspect-[2/1] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                onSegmentSelect && "cursor-pointer",
                                styles.chart
                            )}
                            role="img"
                            aria-label={
                                activeSegment
                                    ? `${chartLabelToString(activeSegment.label)}: ${formatValue(activeSegment.value)}`
                                    : props["aria-label"]
                            }
                            tabIndex={0}
                            onFocus={() => {
                                const nextSegment =
                                    selectedSegment ?? normalizedSegments[0]
                                setActiveSegment(nextSegment)
                                setTooltipPosition(getSegmentPosition(nextSegment))
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
                                const nextSegment =
                                    selectedSegment ?? normalizedSegments[0]
                                setActiveSegment(nextSegment)
                                setTooltipPosition(getSegmentPosition(nextSegment))
                                setTooltipOpen(false)
                            }}
                            onPointerCancel={() => {
                                touchTooltipStickyRef.current = false
                                setTooltipOpen(false)
                            }}
                            onClick={handleActiveSegmentSelect}
                            onKeyDown={(event) => {
                                if (event.key !== "Enter" && event.key !== " ") return
                                event.preventDefault()
                                handleActiveSegmentSelect()
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
                                {selectedFillBackground ? (
                                    <div
                                        className="absolute inset-x-0 top-0 aspect-square rounded-full opacity-40"
                                        style={{
                                            background: selectedFillBackground,
                                            mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness + 7}px), hsl(var(--palette-black)) calc(100% - ${thickness + 7}px) calc(100% - 1px), transparent calc(100% - 1px))`,
                                            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness + 7}px), hsl(var(--palette-black)) calc(100% - ${thickness + 7}px) calc(100% - 1px), transparent calc(100% - 1px))`,
                                        }}
                                    />
                                ) : null}
                                {selectedOutlineBackground ? (
                                    <div
                                        className="absolute inset-x-0 top-0 aspect-square rounded-full"
                                        style={{
                                            background: selectedOutlineBackground,
                                            mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), hsl(var(--palette-black)) calc(100% - 5px) calc(100% - 1px), transparent calc(100% - 1px))",
                                            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 5px), hsl(var(--palette-black)) calc(100% - 5px) calc(100% - 1px), transparent calc(100% - 1px))",
                                        }}
                                    />
                                ) : null}
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

                            {targetGuide ? (
                                <ChartTooltip
                                    label={targetLabel}
                                    value={formatValue(targetValue ?? 0)}
                                    description={chartLabelToString(
                                        targetLabel,
                                        "Target"
                                    )}
                                >
                                    <span
                                        className="absolute z-30 h-16 w-16 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        style={{
                                            left: `${targetGuide.x}%`,
                                            top: `${targetGuide.y}%`,
                                        }}
                                        tabIndex={0}
                                        aria-label={`${chartLabelToString(targetLabel, "Target")}: ${chartLabelToString(formatValue(targetValue ?? 0), "Value")}`}
                                    >
                                        <span
                                            className="absolute left-1/2 top-1/2 block h-px rounded-full border-t border-dashed border-foreground/80"
                                            style={{
                                                width: targetGuide.length,
                                                transform: `translate(-50%, -50%) rotate(${targetGuide.rotation}deg)`,
                                            }}
                                            aria-hidden="true"
                                        />
                                    </span>
                                </ChartTooltip>
                            ) : null}

                            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-4 text-center">
                                {displayValue !== undefined ? (
                                    <span className="text-3xl font-semibold tracking-tight tabular-nums">
                                        {displayValue}
                                    </span>
                                ) : null}
                                {resolvedCenterLabel !== undefined ? (
                                    <span className="text-xs text-muted-foreground">
                                        {resolvedCenterLabel}
                                    </span>
                                ) : null}
                            </div>

                            <ChartFloatingTooltip
                                label={activeSegment?.label}
                                value={
                                    activeSegment
                                        ? formatValue(activeSegment.value)
                                        : undefined
                                }
                                description={activeSource?.description ?? activeShare}
                                position={tooltipPosition}
                                open={tooltipOpen}
                                anchorRef={chartRef}
                                onOpenChange={setTooltipOpen}
                            />
                        </div>
                    </div>

                    {showLegend ? (
                        <div className="grid min-w-0 gap-2">
                            {segments.map((segment, index) => {
                                const normalizedSegment = normalizedSegments[index]
                                const isActive = selectedSegment
                                    ? selectedSegment === normalizedSegment
                                    : activeSegment === normalizedSegment
                                const share = `${defaultChartValueFormatter(
                                    normalizeChartValue(
                                        getPositiveValue(segment.value),
                                        resolvedMax
                                    )
                                )}%`

                                return (
                                    <ChartTooltip
                                        key={`${chartLabelToString(segment.label, "Segment")}-${index}`}
                                        label={segment.label}
                                        value={formatValue(segment.value)}
                                        description={
                                            segment.description ?? [
                                                totalLabel,
                                                ": ",
                                                share,
                                            ]
                                        }
                                    >
                                        <button
                                            type="button"
                                            className={cn(
                                                "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-md border bg-card px-3 py-2 text-left transition-colors",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                isActive && "border-foreground shadow-sm"
                                            )}
                                            onPointerEnter={() => {
                                                setActiveSegment(normalizedSegment)
                                                setTooltipPosition(
                                                    getSegmentPosition(normalizedSegment)
                                                )
                                            }}
                                            onFocus={() => {
                                                setActiveSegment(normalizedSegment)
                                                setTooltipPosition(
                                                    getSegmentPosition(normalizedSegment)
                                                )
                                            }}
                                            onClick={() => onSegmentSelect?.(segment, index)}
                                        >
                                            <span
                                                className="row-span-2 h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        normalizedSegment?.color,
                                                }}
                                                aria-hidden="true"
                                            />
                                            <span className="min-w-0 truncate text-sm font-medium">
                                                {segment.label}
                                            </span>
                                            <span className="text-sm font-semibold tabular-nums">
                                                {share}
                                            </span>
                                            <span className="min-w-0 truncate text-xs text-muted-foreground">
                                                {formatValue(segment.value)}
                                            </span>
                                            {segment.rangeLabel ? (
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {segment.rangeLabel}
                                                </span>
                                            ) : null}
                                        </button>
                                    </ChartTooltip>
                                )
                            })}
                        </div>
                    ) : null}

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
SegmentedGaugeCard.displayName = "SegmentedGaugeCard"

export { SegmentedGaugeCard }
