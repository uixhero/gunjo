"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
    /** Accessible name for the progress bar — a `progressbar` needs one. (#219) */
    label?: string
    /** Human-readable value announced to screen readers (e.g. `"完了 42/120"`). */
    valueText?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, label, valueText, "aria-label": ariaLabel, ...props }, ref) => {
        const safeMax = max > 0 ? max : 100
        const percentage = Math.min(100, Math.max(0, ((value || 0) / safeMax) * 100))

        return (
            <div
                ref={ref}
                role="progressbar"
                aria-label={ariaLabel ?? label}
                aria-valuetext={valueText}
                aria-valuemin={0}
                aria-valuemax={safeMax}
                aria-valuenow={value}
                className={cn(
                    "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
                    className
                )}
                {...props}
            >
                <div
                    className="h-full w-full flex-1 bg-foreground transition-all"
                    style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
            </div>
        )
    }
)
Progress.displayName = "Progress"

export { Progress }
