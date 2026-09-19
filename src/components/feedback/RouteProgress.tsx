"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { useLocale } from "../utility/LocaleProvider"
import { Progress } from "./Progress"

export interface RouteProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * `"viewport"` pins the bar to the top of the window (a route loading
     * screen). `"container"` pins it to the top of the nearest positioned
     * ancestor (a panel or card that is reloading). Default `"viewport"`.
     */
    placement?: "viewport" | "container"
    /** Accessible name. Defaults to the LocaleProvider `loading` string. */
    label?: string
}

/**
 * A thin bar with no end point for a page or view that is loading. Render it
 * while the transition is pending (e.g. from a route's loading boundary) and
 * unmount it when done. It never shows a percentage; under reduced motion it
 * stays as a still, dimmed bar.
 */
const RouteProgress = React.forwardRef<HTMLDivElement, RouteProgressProps>(
    ({ placement = "viewport", label, className, ...props }, ref) => {
        const { strings } = useLocale()

        return (
            <div
                ref={ref}
                data-placement={placement}
                className={cn(
                    "pointer-events-none inset-x-0 top-0 z-50",
                    placement === "viewport" ? "fixed" : "absolute",
                    className
                )}
                {...props}
            >
                <Progress
                    indeterminate
                    aria-label={label ?? strings.loading}
                    tone="primary"
                    className="h-1 rounded-none bg-primary/10"
                />
            </div>
        )
    }
)
RouteProgress.displayName = "RouteProgress"

export { RouteProgress }
