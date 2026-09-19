import * as React from "react"

import { cn } from "../../lib/utils"

export interface NiceScale {
    /** The rounded distance the bar stands for, in metres (1, 2 or 5 × 10ⁿ). */
    meters: number
    /** How long the bar is drawn, in CSS pixels. */
    px: number
    /** The words under the bar: `"20 km"`, `"500 m"`. */
    text: string
}

/**
 * Round a map's current scale to a length a reader can use.
 *
 * Takes how many metres one CSS pixel covers at the centre of the view and the
 * length the bar should roughly be, and returns the nearest 1 / 2 / 5 × 10ⁿ
 * distance at or under that length. Pure — call it on the server, in a test,
 * or every frame.
 *
 * Returns `null` when the scale is unknown (no view yet, a projection with no
 * meaningful centre scale): a bar that guesses is worse than no bar.
 */
export function niceScale(
    metersPerPixel: number | null | undefined,
    targetWidth = 96,
    minWidth = 24
): NiceScale | null {
    if (metersPerPixel == null || !Number.isFinite(metersPerPixel) || metersPerPixel <= 0) return null
    const raw = metersPerPixel * targetWidth
    const power = Math.pow(10, Math.floor(Math.log10(raw)))
    const n = raw / power
    const meters = (n >= 5 ? 5 : n >= 2 ? 2 : 1) * power
    const px = Math.max(minWidth, Math.round(meters / metersPerPixel))
    const text =
        meters >= 1000
            ? `${Math.round(meters / 1000).toLocaleString("en-US")} km`
            : meters >= 1
              ? `${Math.round(meters)} m`
              : `${Math.round(meters * 100)} cm`
    return { meters, px, text }
}

export interface ScaleBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * How many metres one CSS pixel covers at the centre of the view. Your map
     * library knows this (`6371 km / radius in px` for a globe; the resolution
     * at the centre latitude for a web map). `null` while there is no view.
     */
    metersPerPixel: number | null | undefined
    /** Roughly how long the bar should be, in px. Default 96. */
    targetWidth?: number
    /** The bar never gets shorter than this, in px. Default 24. */
    minWidth?: number
    /**
     * Prefix for the accessible name: `"Scale"` reads as "Scale: 20 km".
     * Default `"Scale"`.
     */
    label?: string
}

/**
 * ScaleBar — how far the reader is looking, as a distance and a line whose
 * length is that distance on the map right now.
 *
 * ⭐ **It never shows a zoom factor.** "×250" answers "250 times what?" with
 * nothing; "20 km" and a line are a ruler the reader can hold against the map.
 *
 * The length is rounded to 1 / 2 / 5 × 10ⁿ (`niceScale`) so the words stay
 * short, and the line — not the words — absorbs the remainder. The line eases
 * between lengths so a pinch reads as one motion.
 *
 * Sits on imagery: the words use the canvas type tier (`text-canvas-2xs`) with
 * a halo in the page background colour, so they read over sea and city alike.
 * Place it yourself (usually bottom-left); a column of `MapControlButton`s
 * beside it should not move when the bar changes length.
 */
const ScaleBar = React.forwardRef<HTMLDivElement, ScaleBarProps>(
    (
        { className, metersPerPixel, targetWidth = 96, minWidth = 24, label = "Scale", ...props },
        ref
    ) => {
        const scale = niceScale(metersPerPixel, targetWidth, minWidth)
        const text = scale ? scale.text : "—"
        return (
            <div
                ref={ref}
                role="img"
                aria-label={`${label}: ${text}`}
                className={cn("inline-flex min-w-0 flex-col items-start gap-1", className)}
                {...props}
            >
                <span
                    aria-hidden
                    className="font-mono text-canvas-2xs leading-none tracking-wide text-foreground/85 [text-shadow:0_0_3px_hsl(var(--background)),0_1px_6px_hsl(var(--background))]"
                >
                    {text}
                </span>
                {/* The line: a foreground stroke inside a 1px halo in the page
                    colour, so it reads over dark and light imagery alike. */}
                <span
                    aria-hidden
                    className={cn(
                        "block border border-t-0 border-background/70 transition-[width] duration-200 ease-out motion-reduce:transition-none",
                        !scale && "opacity-0"
                    )}
                    style={{ width: scale ? scale.px : minWidth }}
                >
                    <span className="block h-1.5 border border-t-0 border-foreground/80" />
                </span>
            </div>
        )
    }
)
ScaleBar.displayName = "ScaleBar"

export { ScaleBar }
