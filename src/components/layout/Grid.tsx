import * as React from "react"

import { cn } from "../../lib/utils"

const GAP_MAP = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
} as const

const COLS_MAP = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
} as const

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Fixed number of columns. Mutually exclusive with `minItemWidth`. */
    cols?: keyof typeof COLS_MAP
    /**
     * If set, uses CSS grid auto-fit with this minimum item width (px).
     * Items wrap and fill available space responsively.
     */
    minItemWidth?: number
    gap?: keyof typeof GAP_MAP
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, cols, minItemWidth, gap = 4, style, ...props }, ref) => {
        const useAutoFit = minItemWidth !== undefined
        const computedStyle = useAutoFit
            ? {
                  ...style,
                  gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
              }
            : style

        return (
            <div
                ref={ref}
                style={computedStyle}
                className={cn(
                    "grid",
                    !useAutoFit && cols !== undefined && COLS_MAP[cols],
                    !useAutoFit && cols === undefined && "grid-cols-3",
                    GAP_MAP[gap],
                    className
                )}
                {...props}
            />
        )
    }
)
Grid.displayName = "Grid"

export { Grid }
