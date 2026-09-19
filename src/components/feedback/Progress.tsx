"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

/** Semantic colour of the filled bar. Use it for capacity / budget / health where
 *  the fill carries meaning (near-full → `warning`, over → `destructive`). (#229) */
export type ProgressTone = "default" | "primary" | "success" | "warning" | "destructive" | "info"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
    /** Accessible name for the progress bar — a `progressbar` needs one. (#219) */
    label?: string
    /** Human-readable value announced to screen readers (e.g. `"完了 42/120"`). */
    valueText?: string
    /** Colour of the filled portion. Default `"default"` (neutral `foreground`). (#229) */
    tone?: ProgressTone
    /**
     * The real completion is unknown. A short segment sweeps across instead of
     * a fill, and `aria-valuenow` is omitted so assistive tech does not announce
     * an invented percentage. Under `prefers-reduced-motion: reduce` (or inside
     * a `data-motion="reduce"` ancestor) the sweep stops and a still, dimmed
     * full-width bar remains. (#996)
     */
    indeterminate?: boolean
}

const TONE_INDICATOR: Record<ProgressTone, string> = {
    default: "bg-foreground",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    info: "bg-info",
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, label, valueText, tone = "default", indeterminate = false, "aria-label": ariaLabel, ...props }, ref) => {
        const safeMax = max > 0 ? max : 100
        const percentage = Math.min(100, Math.max(0, ((value || 0) / safeMax) * 100))

        return (
            <div
                ref={ref}
                role="progressbar"
                aria-label={ariaLabel ?? label}
                aria-valuetext={valueText}
                aria-valuemin={0}
                aria-valuemax={indeterminate ? undefined : safeMax}
                aria-valuenow={indeterminate ? undefined : value}
                data-indeterminate={indeterminate || undefined}
                className={cn(
                    "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
                    className
                )}
                {...props}
            >
                {indeterminate ? (
                    <div className={cn("gunjo-progress-indeterminate h-full w-2/5 rounded-full", TONE_INDICATOR[tone])} />
                ) : (
                    <div
                        className={cn("h-full w-full flex-1 transition-all", TONE_INDICATOR[tone])}
                        style={{ transform: `translateX(-${100 - percentage}%)` }}
                    />
                )}
            </div>
        )
    }
)
Progress.displayName = "Progress"

export { Progress }
