import * as React from "react"

import { cn } from "../../lib/utils"

export interface MapStatusCornerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * What the map is showing right now, one short line each, top to bottom:
     * the viewpoint, day or night, which cloud frame, where the terrain comes
     * from. `null` / `false` entries are skipped, so a line can come and go
     * without the caller rebuilding the array.
     */
    items: React.ReactNode[]
    /**
     * Words in the top-left corner (the view's name, a `LiveBadge`). They float
     * left, so only the first line or two of `items` sit beside them and the
     * rest run underneath at full width.
     */
    lead?: React.ReactNode
    /**
     * Room to keep free on the left under `lead`, in px — for a compass or a
     * button that sits in that corner. The lines never run into it. Default 0.
     */
    startInset?: number
    /** A top-to-bottom shade from the page colour, so the words read over bright imagery. Default true. */
    scrim?: boolean
    /** Accessible name of the list. Default `"Map status"`. */
    label?: string
}

const HALO =
    "[text-shadow:0_1px_7px_hsl(var(--background)),0_0_3px_hsl(var(--background)),0_0_12px_hsl(var(--background)/0.85)]"

/**
 * MapStatusCorner — a few short lines in the top-right of a map that say what
 * the reader is looking at.
 *
 * ⭐ On a narrow screen the corner shares the top edge with the words on the
 * left. A two-column flex row pushes whole lines down or clips a word in half
 * ("実況" loses its last character). Here `lead` floats left and each line is
 * one unbreakable run, so a line that does not fit beside `lead` moves below
 * it instead of breaking: only the first line or two share the row, and the
 * rest get the full width.
 *
 * The words use the canvas type tier (`text-canvas-2xs`) with a halo in the
 * page colour. The whole corner ignores the pointer, so the map underneath
 * still drags. Place it yourself, usually `absolute inset-x-0 top-0`.
 */
const MapStatusCorner = React.forwardRef<HTMLDivElement, MapStatusCornerProps>(
    ({ className, items, lead, startInset = 0, scrim = true, label = "Map status", ...props }, ref) => {
        const lines = items.filter((item) => item !== null && item !== undefined && item !== false)
        return (
            <div
                ref={ref}
                className={cn(
                    "pointer-events-none w-full px-3.5 pb-6 pt-2.5 font-mono text-canvas-2xs",
                    scrim &&
                        "bg-gradient-to-b from-background/70 via-background/30 via-55% to-transparent",
                    className
                )}
                {...props}
            >
                {lead ? (
                    <div
                        className={cn(
                            "float-left mr-3 whitespace-nowrap tracking-[0.16em] text-foreground/75",
                            HALO
                        )}
                    >
                        {lead}
                    </div>
                ) : null}
                {/* ⚠️ No flex, grid or overflow here: any of them makes a new
                    formatting context and the list stops flowing around the
                    float — it would sit beside `lead` at full height instead. */}
                <ul
                    aria-label={label}
                    className={cn("list-none text-right leading-[1.55] text-foreground/75", HALO)}
                    style={startInset ? { marginLeft: startInset } : undefined}
                >
                    {lines.map((line, index) => (
                        <li key={index} className="whitespace-nowrap">
                            {line}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
)
MapStatusCorner.displayName = "MapStatusCorner"

export { MapStatusCorner }
