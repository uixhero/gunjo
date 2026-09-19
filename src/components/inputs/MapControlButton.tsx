"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import type { MapControlButtonVariantKey } from "./generated/variant-keys"
import { mapControlButtonDefaultVariantKey } from "./generated/default-variant-keys"

/**
 * What the button is doing right now, apart from on / off.
 *
 * - `idle` — nothing in flight.
 * - `busy` — waiting on something the press started (finding the current
 *   location). The glyph pulses and the button reports `aria-busy`.
 * - `error` — the last attempt failed. A warning ring and a `!` mark, so the
 *   state is not carried by colour alone. Meant to be brief: the caller clears
 *   it (the button holds no timer).
 */
export type MapControlButtonStatus = "idle" | "busy" | "error"

const sizeClasses: Record<MapControlButtonVariantKey, string> = {
    // 44px — the touch line GunjoUI holds everywhere else (#837).
    default: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
    // 34px — the floor. A dense map column on a phone; never smaller.
    sm: "h-[34px] w-[34px] [&_svg]:h-[17px] [&_svg]:w-[17px]",
    // 48px — tablets, where the map is the whole screen.
    lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
}

export interface MapControlButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
    /**
     * What the button does, in words ("Zoom in", "Go to my location"). It is
     * the accessible name AND the tooltip — the button itself shows only a
     * glyph, so this is the only place the action is written down.
     */
    label: string
    /** The glyph. Pass an icon component's element (`<IconPlus />`). */
    children: React.ReactNode
    /**
     * On / off for a toggle (follow my location, show the picked place).
     * Leave undefined for a one-shot action (zoom) — `aria-pressed` is then
     * not rendered at all.
     */
    pressed?: boolean
    /** See `MapControlButtonStatus`. Default `"idle"`. */
    status?: MapControlButtonStatus
    /**
     * Read out when `status` changes to `busy` or `error` ("Finding your
     * location", "Location unavailable"). Rendered in a polite live region, and
     * shown as the tooltip while the status holds.
     */
    statusLabel?: string
    /**
     * Why the button cannot be pressed ("Pick a place on the map first").
     * Shown as the tooltip while `disabled`; the disabled button stays
     * focusable through its wrapper so keyboard readers reach the reason too.
     */
    disabledReason?: string
    /** `sm` 34px (the floor) / `default` 44px / `lg` 48px. */
    size?: MapControlButtonVariantKey
    /** Side for the tooltip. Default `"left"` — map columns sit on the right edge. */
    tooltipSide?: "top" | "right" | "bottom" | "left"
}

/**
 * MapControlButton — the round, icon-only button that floats on a map or a
 * canvas: zoom in, zoom out, go to the picked place, go to my location.
 *
 * ⭐ It sits on imagery, so its surface is its own: a translucent background,
 * a blurred backdrop and a hairline border keep it readable over sea, city and
 * cloud alike. It is not a Button variant because a Button on a page has the
 * page behind it; this one has a satellite photo.
 *
 * ⚠️ **Never below 34px** (`size="sm"`). The default is 44px, the touch line
 * the rest of GunjoUI holds.
 *
 * ⚠️ **The glyph carries meaning, so keep two of them apart**: "my location"
 * is a pin, "the place I picked" is a ring with a dot. They are different
 * places; one glyph for both makes the reader guess which one the map will
 * jump to.
 *
 * States: `pressed` (a toggle that is on), `disabled` with `disabledReason`,
 * `status="busy"` while something the press started is in flight, and
 * `status="error"` for a brief failure mark. None of them is colour alone:
 * pressed fills the button, busy pulses, error adds a `!`.
 */
const MapControlButton = React.forwardRef<HTMLButtonElement, MapControlButtonProps>(
    (
        {
            className,
            label,
            children,
            pressed,
            status = "idle",
            statusLabel,
            disabledReason,
            disabled,
            size = mapControlButtonDefaultVariantKey,
            tooltipSide = "left",
            type = "button",
            ...props
        },
        ref
    ) => {
        const busy = status === "busy"
        const error = status === "error"
        const tooltip =
            disabled && disabledReason
                ? disabledReason
                : status !== "idle" && statusLabel
                  ? statusLabel
                  : label

        const button = (
            <button
                ref={ref}
                type={type}
                aria-label={label}
                aria-pressed={pressed === undefined ? undefined : pressed}
                aria-busy={busy || undefined}
                disabled={disabled}
                data-status={status}
                className={cn(
                    "relative inline-flex shrink-0 items-center justify-center rounded-full border p-0",
                    "border-border bg-background/85 text-muted-foreground shadow-md backdrop-blur-md",
                    "transition-colors duration-150 cursor-pointer",
                    "hover:bg-background hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "disabled:pointer-events-none disabled:opacity-40",
                    "[&_svg]:shrink-0",
                    sizeClasses[size],
                    pressed &&
                        "border-primary-strong bg-primary-strong text-primary-strong-foreground hover:bg-primary-strong hover:text-primary-strong-foreground",
                    busy &&
                        !pressed &&
                        "border-success-border text-success hover:text-success",
                    busy && "[&_svg]:animate-pulse motion-reduce:[&_svg]:animate-none",
                    error && "border-warning-border text-warning hover:text-warning",
                    className
                )}
                {...props}
            >
                {children}
                {error ? (
                    <span
                        aria-hidden
                        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warning-strong text-canvas-xs font-bold leading-none text-warning-strong-foreground"
                    >
                        !
                    </span>
                ) : null}
            </button>
        )

        return (
            <>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {disabled ? (
                            // A disabled button fires no pointer or focus events,
                            // so the reason would never show. The wrapper takes
                            // focus and hover in its place.
                            <span
                                className="inline-flex rounded-full"
                                tabIndex={disabledReason ? 0 : undefined}
                                aria-label={disabledReason ? `${label}: ${disabledReason}` : undefined}
                            >
                                {button}
                            </span>
                        ) : (
                            button
                        )}
                    </TooltipTrigger>
                    <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
                </Tooltip>
                <span className="sr-only" role="status" aria-live="polite">
                    {status !== "idle" && statusLabel ? statusLabel : ""}
                </span>
            </>
        )
    }
)
MapControlButton.displayName = "MapControlButton"

export { MapControlButton }
