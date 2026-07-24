"use client"

import * as React from "react"
import { createPortal } from "react-dom"

type ChartTooltipSide = "top" | "right" | "bottom" | "left"

export interface ChartTooltipProps {
    label?: React.ReactNode
    value?: React.ReactNode
    description?: React.ReactNode
    children: React.ReactElement
    side?: ChartTooltipSide
}

interface ChartTooltipPosition {
    left: number
    top: number
    translateX: string
    translateY: string
}

function hasTooltipContent(value: React.ReactNode) {
    return value !== undefined && value !== null && value !== ""
}

function clampTooltipPercent(value: number, min = 12, max = 88) {
    if (!Number.isFinite(value)) return 50
    return Math.min(max, Math.max(min, value))
}

function clampTooltipPixel(value: number, viewportSize: number, edgeOffset = 16) {
    if (!Number.isFinite(value)) return edgeOffset
    return Math.min(viewportSize - edgeOffset, Math.max(edgeOffset, value))
}

function getPortalTooltipPosition(
    rect: DOMRect,
    side: ChartTooltipSide
): ChartTooltipPosition {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const resolvedSide =
        side === "top" && rect.top < 96
            ? "bottom"
            : side === "bottom" && viewportHeight - rect.bottom < 96
              ? "top"
              : side === "left" && rect.left < 192
                ? "right"
                : side === "right" && viewportWidth - rect.right < 192
                  ? "left"
                  : side
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const left =
        resolvedSide === "left"
            ? rect.left - 8
            : resolvedSide === "right"
              ? rect.right + 8
              : centerX
    const top =
        resolvedSide === "bottom"
            ? rect.bottom + 8
            : resolvedSide === "left" || resolvedSide === "right"
              ? centerY
              : rect.top - 8
    const clampedLeft = clampTooltipPixel(left, viewportWidth)
    const clampedTop = clampTooltipPixel(top, viewportHeight)
    const translateX =
        resolvedSide === "left"
            ? "-100%"
            : resolvedSide === "right"
              ? "0"
              : clampedLeft < 144
                ? "0"
                : clampedLeft > viewportWidth - 144
                  ? "-100%"
                  : "-50%"
    const translateY =
        resolvedSide === "bottom"
            ? "0"
            : resolvedSide === "left" || resolvedSide === "right"
              ? "-50%"
              : "-100%"

    return {
        left: clampedLeft,
        top: clampedTop,
        translateX,
        translateY,
    }
}

function composeEventHandlers<Event>(
    userHandler: ((event: Event) => void) | undefined,
    internalHandler: (event: Event) => void
) {
    return (event: Event) => {
        userHandler?.(event)
        internalHandler(event)
    }
}

function ChartTooltipBody({
    label,
    value,
    description,
}: Pick<ChartTooltipProps, "label" | "value" | "description">) {
    return (
        <div className="grid max-w-48 gap-1">
            {hasTooltipContent(label) ? (
                <div className="text-xs font-medium text-popover-foreground">
                    {label}
                </div>
            ) : null}
            {hasTooltipContent(value) ? (
                <div className="text-sm font-semibold tabular-nums text-popover-foreground">
                    {value}
                </div>
            ) : null}
            {hasTooltipContent(description) ? (
                <div className="text-xs text-muted-foreground">
                    {description}
                </div>
            ) : null}
        </div>
    )
}

export function ChartTooltip({
    label,
    value,
    description,
    children,
    side = "top",
}: ChartTooltipProps) {
    const tooltipId = React.useId()
    const [open, setOpen] = React.useState(false)
    const [position, setPosition] = React.useState<ChartTooltipPosition | null>(
        null
    )
    const lastPointerTypeRef = React.useRef<string | null>(null)
    const triggerElementRef = React.useRef<HTMLElement | null>(null)
    const child =
        children as React.ReactElement<
            React.HTMLAttributes<HTMLElement> & {
                "aria-describedby"?: string
                "data-chart-tooltip-open"?: string
            }
        >

    const updatePosition = React.useCallback(
        (element: HTMLElement) => {
            setPosition(getPortalTooltipPosition(element.getBoundingClientRect(), side))
        },
        [side]
    )

    const showTooltip = React.useCallback(
        (event: React.PointerEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
            if ("pointerType" in event) {
                lastPointerTypeRef.current = event.pointerType
            }
            triggerElementRef.current = event.currentTarget
            updatePosition(event.currentTarget)
            setOpen(true)
        },
        [updatePosition]
    )

    const hideTooltip = React.useCallback((event?: React.SyntheticEvent<HTMLElement>) => {
        const pointerType =
            event && "pointerType" in event ? event.pointerType : undefined
        if (pointerType === "touch" || lastPointerTypeRef.current === "touch") {
            return
        }
        setOpen(false)
    }, [])

    const handlePointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLElement>) => {
            lastPointerTypeRef.current = event.pointerType
            if (event.pointerType === "touch" || event.pointerType === "pen") {
                triggerElementRef.current = event.currentTarget
                updatePosition(event.currentTarget)
                setOpen(true)
            }
        },
        [updatePosition]
    )

    React.useEffect(() => {
        if (!open) return undefined

        const closeTooltip = () => {
            lastPointerTypeRef.current = null
            triggerElementRef.current = null
            setOpen(false)
        }
        const closeTooltipOnOutsidePointerDown = (event: PointerEvent) => {
            const target = event.target
            if (
                target instanceof Node &&
                triggerElementRef.current?.contains(target)
            ) {
                return
            }

            closeTooltip()
        }

        window.addEventListener("pointerdown", closeTooltipOnOutsidePointerDown, true)
        window.addEventListener("scroll", closeTooltip, true)
        window.addEventListener("touchmove", closeTooltip, { passive: true })
        window.addEventListener("wheel", closeTooltip, { passive: true })
        window.addEventListener("resize", closeTooltip)
        window.visualViewport?.addEventListener("scroll", closeTooltip)
        window.visualViewport?.addEventListener("resize", closeTooltip)

        return () => {
            window.removeEventListener("pointerdown", closeTooltipOnOutsidePointerDown, true)
            window.removeEventListener("scroll", closeTooltip, true)
            window.removeEventListener("touchmove", closeTooltip)
            window.removeEventListener("wheel", closeTooltip)
            window.removeEventListener("resize", closeTooltip)
            window.visualViewport?.removeEventListener("scroll", closeTooltip)
            window.visualViewport?.removeEventListener("resize", closeTooltip)
        }
    }, [open])

    // After all hooks: bail out without tooltip behavior when there is nothing to show
    if (
        !hasTooltipContent(label) &&
        !hasTooltipContent(value) &&
        !hasTooltipContent(description)
    ) {
        return children
    }

    const tooltip =
        open && position && typeof document !== "undefined"
            ? createPortal(
                  <div
                      id={tooltipId}
                      role="tooltip"
                      className="pointer-events-none fixed z-50 w-max overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-left text-sm text-popover-foreground shadow-md"
                      style={{
                          left: position.left,
                          top: position.top,
                          transform: `translate(${position.translateX}, ${position.translateY})`,
                          maxWidth: "min(20rem, calc(100vw - 2rem))",
                      }}
                  >
                      <ChartTooltipBody
                          label={label}
                          value={value}
                          description={description}
                      />
                  </div>,
                  document.body
              )
            : null

    return (
        <>
            {React.cloneElement(child, {
                "aria-describedby": open ? tooltipId : child.props["aria-describedby"],
                "data-chart-tooltip-open": open ? "true" : undefined,
                className: [
                    child.props.className,
                    "data-[chart-tooltip-open=true]:ring-2 data-[chart-tooltip-open=true]:ring-ring data-[chart-tooltip-open=true]:ring-offset-2 data-[chart-tooltip-open=true]:ring-offset-background",
                ]
                    .filter(Boolean)
                    .join(" "),
                onBlur: composeEventHandlers(child.props.onBlur, hideTooltip),
                onFocus: composeEventHandlers(child.props.onFocus, showTooltip),
                onPointerDown: composeEventHandlers(
                    child.props.onPointerDown,
                    handlePointerDown
                ),
                onPointerEnter: composeEventHandlers(
                    child.props.onPointerEnter,
                    showTooltip
                ),
                onPointerLeave: composeEventHandlers(
                    child.props.onPointerLeave,
                    hideTooltip
                ),
                onPointerMove: composeEventHandlers(
                    child.props.onPointerMove,
                    showTooltip
                ),
            })}
            {tooltip}
        </>
    )
}

export interface ChartFloatingTooltipProps {
    label?: React.ReactNode
    value?: React.ReactNode
    description?: React.ReactNode
    position?: { x: number; y: number }
    open?: boolean
    anchorRef?: React.RefObject<HTMLElement | null>
    onOpenChange?: (open: boolean) => void
    showMarker?: boolean
}

export function ChartFloatingTooltip({
    label,
    value,
    description,
    position = { x: 50, y: 20 },
    open = false,
    anchorRef,
    onOpenChange,
    showMarker = true,
}: ChartFloatingTooltipProps) {
    React.useEffect(() => {
        if (!open || !onOpenChange) return

        const closeTooltip = () => onOpenChange(false)
        window.addEventListener("scroll", closeTooltip, true)
        window.addEventListener("touchmove", closeTooltip, { passive: true })
        window.addEventListener("wheel", closeTooltip, { passive: true })
        window.addEventListener("resize", closeTooltip)
        window.visualViewport?.addEventListener("scroll", closeTooltip)
        window.visualViewport?.addEventListener("resize", closeTooltip)

        return () => {
            window.removeEventListener("scroll", closeTooltip, true)
            window.removeEventListener("touchmove", closeTooltip)
            window.removeEventListener("wheel", closeTooltip)
            window.removeEventListener("resize", closeTooltip)
            window.visualViewport?.removeEventListener("scroll", closeTooltip)
            window.visualViewport?.removeEventListener("resize", closeTooltip)
        }
    }, [onOpenChange, open])

    if (
        !open ||
        (!hasTooltipContent(label) &&
            !hasTooltipContent(value) &&
            !hasTooltipContent(description))
    ) {
        return null
    }

    const x = clampTooltipPercent(position.x)
    const y = clampTooltipPercent(position.y)
    const showBelow = y < 24
    const translateX = x < 24 ? "0" : x > 76 ? "-100%" : "-50%"
    const translateY = showBelow ? "0.5rem" : "calc(-100% - 0.5rem)"
    const anchor = anchorRef?.current

    if (anchor && typeof document !== "undefined") {
        const rect = anchor.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const left = clampTooltipPixel(rect.left + (rect.width * x) / 100, viewportWidth)
        const top = clampTooltipPixel(rect.top + (rect.height * y) / 100, viewportHeight)

        return createPortal(
            <>
                {showMarker ? (
                    <span
                        className="pointer-events-none fixed z-40 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ring bg-background shadow-[0_0_0_3px_hsl(var(--background)),0_0_0_6px_hsl(var(--ring)/0.2)]"
                        style={{ left, top }}
                        aria-hidden="true"
                    />
                ) : null}
                <div
                    role="tooltip"
                    className="pointer-events-none fixed z-50 w-max overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-left text-sm text-popover-foreground shadow-md"
                    style={{
                        left,
                        top,
                        transform: `translate(${translateX}, ${translateY})`,
                        maxWidth: "min(20rem, calc(100vw - 2rem))",
                    }}
                >
                    <ChartTooltipBody
                        label={label}
                        value={value}
                        description={description}
                    />
                </div>
            </>,
            document.body
        )
    }

    return (
        <>
            {showMarker ? (
                <span
                    className="pointer-events-none absolute z-40 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ring bg-background shadow-[0_0_0_3px_hsl(var(--background)),0_0_0_6px_hsl(var(--ring)/0.2)]"
                    style={{
                        left: `${x}%`,
                        top: `${y}%`,
                    }}
                    aria-hidden="true"
                />
            ) : null}
            <div
                role="tooltip"
                className="pointer-events-none absolute z-50 w-max overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-left text-sm text-popover-foreground shadow-md"
                style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(${translateX}, ${translateY})`,
                    maxWidth: "min(20rem, calc(100vw - 2rem))",
                }}
            >
                <ChartTooltipBody
                    label={label}
                    value={value}
                    description={description}
                />
            </div>
        </>
    )
}
