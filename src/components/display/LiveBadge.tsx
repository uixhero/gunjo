import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge, type BadgeSize } from "./Badge"

export interface LiveBadgeProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
    /**
     * Whether the value beside this badge is the current one. The caller
     * decides — the badge holds no clock and compares nothing.
     */
    live?: boolean
    /**
     * The word on the badge while live. Default `"LIVE"`. Keep it a **word**:
     * the pulsing dot is decoration, and a state carried by a dot alone is a
     * state half the readers never receive.
     */
    children?: React.ReactNode
    /**
     * What to show **instead** when `live` is false — the answer to "then when
     * is this from?": a date, a timestamp, "as of 09:40". Leave it out and the
     * badge renders nothing at all, which is the honest result when the
     * component has not been told what the value is from.
     */
    detached?: React.ReactNode
    /** Pill size, same scale as `Badge`. Default `"default"`. */
    size?: BadgeSize
    /** Element to render. Default `"span"` — a status pill is phrasing content. */
    as?: "div" | "span"
}

/**
 * LiveBadge — the small bordered pill that says **"this is the current value"**,
 * with a dot that pulses slowly to show something is still arriving. When the
 * value is no longer current the badge steps aside and states *when* the value
 * is from instead.
 *
 * Monitoring boards, streams, match commentary, trading screens, sensor
 * readouts — anywhere a number could be either live or a snapshot and the
 * reader cannot tell by looking at it.
 *
 * ⭐ **It holds no clock and compares nothing.** `live` is a decision the caller
 * makes; the badge only renders it. (Same rule as `TimeTransport`, which uses
 * this badge for its own live state.)
 *
 * ⚠️ **The state is never carried by the dot or the colour.** The badge always
 * has a word on it, and the detached form replaces that word with the "when".
 *
 * ⚠️ **The dot does not pulse under `prefers-reduced-motion: reduce`.**
 *
 * It is deliberately **not** a live region: `role="status"` here would interrupt
 * a screen reader on every reconnection, for a badge that is usually ambient.
 * Pass `role="status"` yourself on the rare screen where the change is the news.
 *
 * Use `Badge` for a state that is not about freshness, `ExpiryBadge` for a
 * deadline, and `TimeTransport` when the reader also needs to *move* the value.
 */
function LiveBadge({
    className,
    live = true,
    children = "LIVE",
    detached,
    size = "default",
    as = "span",
    ...props
}: LiveBadgeProps) {
    if (!live) {
        if (detached == null || detached === "") return null
        return (
            <Badge
                variant="warning"
                size={size}
                as={as}
                className={cn("font-medium tabular-nums", className)}
                {...props}
            >
                {detached}
            </Badge>
        )
    }

    return (
        <Badge
            variant="success"
            size={size}
            as={as}
            className={cn("tracking-wide", className)}
            icon={
                // `motion-reduce:animate-none` is the whole accommodation: the
                // dot stays, it simply stops breathing. Removing it instead
                // would take away a cue for no reason.
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success motion-reduce:animate-none" />
            }
            {...props}
        >
            {children}
        </Badge>
    )
}

export { LiveBadge }
