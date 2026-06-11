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
    defaultChartValueFormatter,
    normalizeChartValue,
} from "./chart-utils"
import { ChartFloatingTooltip, ChartTooltip } from "./chart-tooltip"
import {
    buildActiveCircularSegmentGradient,
    buildConicGradient,
    getCircularSegmentAtPercent,
    getCircularSegmentPosition,
    getCircularSegmentShare,
    normalizeCircularSegments,
    type NormalizedCircularSegment,
} from "./circular-chart-utils"
import type { LabeledDonutCardVariantKey } from "./generated/variant-keys"
import { labeledDonutCardDefaultVariantKey } from "./generated/default-variant-keys"

export interface LabeledDonutCardSegment extends ChartDataPoint {
    calloutLabel?: React.ReactNode
    comparison?: React.ReactNode
}

export interface LabeledDonutCardProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
    segments: LabeledDonutCardSegment[]
    title?: React.ReactNode
    description?: React.ReactNode
    centerValue?: React.ReactNode
    centerLabel?: React.ReactNode
    delta?: React.ReactNode
    deltaDescription?: React.ReactNode
    caption?: React.ReactNode
    variant?: LabeledDonutCardVariantKey
    selectedIndex?: number
    thickness?: number
    showCallouts?: boolean
    formatValue?: (value: number) => React.ReactNode
    totalLabel?: React.ReactNode
    onSegmentSelect?: (segment: LabeledDonutCardSegment, index: number) => void
}

type LabeledDonutCardClassNames = {
    card: string
    header: string
    content: string
    chart: string
    title: string
}

const variantClasses: Record<LabeledDonutCardVariantKey, LabeledDonutCardClassNames> = {
    compact: {
        card: "rounded-md",
        header: "p-4 pb-3",
        content: "px-4 pb-4",
        chart: "max-w-40",
        title: "text-sm",
    },
    default: {
        card: "rounded-lg",
        header: "p-5 pb-3",
        content: "px-5 pb-5",
        chart: "max-w-52",
        title: "text-base",
    },
}

function getPositiveValue(value: number) {
    return Number.isFinite(value) ? Math.max(value, 0) : 0
}

function getSegmentByNormalizedSegment(
    segments: LabeledDonutCardSegment[],
    normalized: NormalizedCircularSegment | undefined
) {
    if (!normalized) return undefined
    return segments.find((segment) => segment.label === normalized.label)
}

const LabeledDonutCard = React.forwardRef<
    HTMLDivElement,
    LabeledDonutCardProps
>(
    (
        {
            className,
            segments,
            title = "Sales by platform",
            description,
            centerValue,
            centerLabel,
            delta,
            deltaDescription,
            caption,
            variant = labeledDonutCardDefaultVariantKey,
            selectedIndex,
            thickness = variant === "compact" ? 18 : 24,
            showCallouts = true,
            formatValue = defaultChartValueFormatter,
            totalLabel = "Total",
            onSegmentSelect,
            ...props
        },
        ref
    ) => {
        const styles = variantClasses[variant]
        const normalizedSegments = React.useMemo(
            () => normalizeCircularSegments(segments),
            [segments]
        )
        const selectedSegment =
            selectedIndex === undefined ? undefined : normalizedSegments[selectedIndex]
        const [activeSegment, setActiveSegment] = React.useState<
            NormalizedCircularSegment | undefined
        >(selectedSegment ?? normalizedSegments[0])
        const [tooltipOpen, setTooltipOpen] = React.useState(false)
        const chartRef = React.useRef<HTMLDivElement | null>(null)
        const touchTooltipStickyRef = React.useRef(false)
        const [tooltipPosition, setTooltipPosition] = React.useState(
            getCircularSegmentPosition(selectedSegment ?? normalizedSegments[0])
        )
        const total = Math.max(
            segments.reduce((sum, segment) => sum + getPositiveValue(segment.value), 0),
            1
        )
        const tooltipSegment = activeSegment ?? selectedSegment ?? normalizedSegments[0]
        const tooltipSource = getSegmentByNormalizedSegment(segments, tooltipSegment)
        const tooltipShare = getCircularSegmentShare(tooltipSegment)
        const tooltipShareLabel =
            tooltipShare === undefined
                ? undefined
                : `${defaultChartValueFormatter(tooltipShare)}%`
        const activeSegmentLabel = chartLabelToString(tooltipSegment?.label, "")
        const background = buildConicGradient(normalizedSegments)
        const activeOverlay = tooltipOpen
            ? buildActiveCircularSegmentGradient(tooltipSegment)
            : undefined

        React.useEffect(() => {
            const nextSegment = selectedSegment ?? normalizedSegments[0]
            setActiveSegment(nextSegment)
            setTooltipPosition(getCircularSegmentPosition(nextSegment))
        }, [normalizedSegments, selectedSegment])

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
        const handleSegmentSelect = () => {
            if (!onSegmentSelect || !activeSegment) return

            const segmentIndex = normalizedSegments.findIndex(
                (segment) => segment === activeSegment
            )
            const fallbackIndex = normalizedSegments.findIndex(
                (segment) => segment.label === activeSegment.label
            )
            const index = segmentIndex >= 0 ? segmentIndex : fallbackIndex
            const sourceSegment = segments[index]

            if (!sourceSegment || index < 0) return
            onSegmentSelect(sourceSegment, index)
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
                    <div
                        className={cn(
                            "grid min-w-0 gap-4",
                            showCallouts
                                ? "sm:grid-cols-[minmax(9rem,0.85fr)_minmax(0,1fr)]"
                                : "justify-items-center"
                        )}
                    >
                        <div
                            className={cn(
                                "flex min-w-0 items-center justify-center",
                                !showCallouts && "w-full max-w-xs"
                            )}
                        >
                            <div
                                ref={chartRef}
                                className={cn(
                                    "relative aspect-square w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                    onSegmentSelect && "cursor-pointer",
                                    styles.chart
                                )}
                                style={{ background }}
                                aria-label={
                                    tooltipSegment
                                        ? `${chartLabelToString(tooltipSegment.label)}: ${formatValue(tooltipSegment.value)}${
                                              tooltipShareLabel
                                                  ? ` (${tooltipShareLabel})`
                                                  : ""
                                        }`
                                        : props["aria-label"]
                                }
                                role={onSegmentSelect ? "button" : "img"}
                                tabIndex={0}
                                onClick={handleSegmentSelect}
                                onFocus={() => {
                                    const nextSegment = selectedSegment ?? normalizedSegments[0]
                                    setActiveSegment(nextSegment)
                                    setTooltipPosition(
                                        getCircularSegmentPosition(nextSegment)
                                    )
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
                                    setActiveSegment(selectedSegment ?? normalizedSegments[0])
                                    setTooltipPosition(
                                        getCircularSegmentPosition(
                                            selectedSegment ?? normalizedSegments[0]
                                        )
                                    )
                                    setTooltipOpen(false)
                                }}
                                onPointerCancel={() => {
                                    touchTooltipStickyRef.current = false
                                    setTooltipOpen(false)
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        event.key !== "Enter" &&
                                        event.key !== " "
                                    ) {
                                        return
                                    }

                                    event.preventDefault()
                                    handleSegmentSelect()
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
                                {centerValue !== undefined ||
                                centerLabel !== undefined ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                                        {centerValue !== undefined ? (
                                            <span className="text-2xl font-semibold tracking-tight tabular-nums">
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
                                    description={
                                        tooltipSource?.comparison ?? tooltipShareLabel
                                    }
                                    position={tooltipPosition}
                                    open={tooltipOpen}
                                    anchorRef={chartRef}
                                    onOpenChange={setTooltipOpen}
                                />
                            </div>
                        </div>

                        {showCallouts ? (
                            <div className="grid min-w-0 gap-2">
                                {segments.map((segment, index) => {
                                    const normalizedSegment = normalizedSegments[index]
                                    const share = normalizeChartValue(
                                        getPositiveValue(segment.value),
                                        total
                                    )
                                    const shareLabel = `${defaultChartValueFormatter(share)}%`
                                    const isActive =
                                        activeSegment === normalizedSegment ||
                                        chartLabelToString(segment.label, "") === activeSegmentLabel

                                    return (
                                        <ChartTooltip
                                            key={`${chartLabelToString(segment.label, "Segment")}-${index}`}
                                            label={segment.calloutLabel ?? segment.label}
                                            value={formatValue(segment.value)}
                                            description={
                                                segment.comparison ?? [
                                                    totalLabel,
                                                    ": ",
                                                    shareLabel,
                                                ]
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={cn(
                                                    "grid min-w-0 cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-md border bg-card px-3 py-2 text-left transition-colors",
                                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                    isActive &&
                                                        "border-foreground bg-muted/60 shadow-sm"
                                                )}
                                                aria-current={isActive ? "true" : undefined}
                                                onPointerEnter={() => {
                                                    setActiveSegment(normalizedSegment)
                                                    setTooltipPosition(
                                                        getCircularSegmentPosition(
                                                            normalizedSegment
                                                        )
                                                    )
                                                }}
                                                onFocus={() => {
                                                    setActiveSegment(normalizedSegment)
                                                    setTooltipPosition(
                                                        getCircularSegmentPosition(
                                                            normalizedSegment
                                                        )
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
                                                    {segment.calloutLabel ?? segment.label}
                                                </span>
                                                <span className="text-right text-sm font-semibold tabular-nums">
                                                    {shareLabel}
                                                </span>
                                                <span className="min-w-0 truncate text-xs text-muted-foreground">
                                                    {formatValue(segment.value)}
                                                </span>
                                                {segment.comparison ? (
                                                    <span className="truncate text-right text-xs text-muted-foreground">
                                                        {segment.comparison}
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
LabeledDonutCard.displayName = "LabeledDonutCard"

export { LabeledDonutCard }
