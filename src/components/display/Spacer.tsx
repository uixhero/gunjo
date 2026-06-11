import * as React from "react"

import { cn } from "../../lib/utils"

const SIZE_MAP = {
    1: "h-1 w-1",
    2: "h-2 w-2",
    3: "h-3 w-3",
    4: "h-4 w-4",
    6: "h-6 w-6",
    8: "h-8 w-8",
    12: "h-12 w-12",
    16: "h-16 w-16",
    24: "h-24 w-24",
} as const

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Fixed size (px scale 1=4px, 4=16px, etc.).
     * If omitted, Spacer flex-grows to fill remaining space (use inside flex containers).
     */
    size?: keyof typeof SIZE_MAP
    axis?: "x" | "y" | "both"
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
    ({ className, size, axis = "both", ...props }, ref) => {
        const fixed = size !== undefined
        const sizeClass = fixed ? SIZE_MAP[size] : ""

        const flexGrowClass = !fixed
            ? axis === "x"
                ? "flex-grow"
                : axis === "y"
                  ? "flex-grow"
                  : "flex-1"
            : ""

        return (
            <div
                ref={ref}
                aria-hidden
                className={cn(sizeClass, flexGrowClass, className)}
                {...props}
            />
        )
    }
)
Spacer.displayName = "Spacer"

export { Spacer }
