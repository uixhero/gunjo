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

// Literal class maps per breakpoint — Tailwind v4 only emits a class whose exact
// string (incl. the `md:`/`lg:` prefix) appears in source, so responsive column
// counts can't be built dynamically; they must be enumerated. (#114)
const COLS_MAP = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
} as const

const SM_COLS_MAP = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    12: "sm:grid-cols-12",
} as const

const MD_COLS_MAP = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    12: "md:grid-cols-12",
} as const

const LG_COLS_MAP = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    12: "lg:grid-cols-12",
} as const

const XL_COLS_MAP = {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
    12: "xl:grid-cols-12",
} as const

type ColCount = keyof typeof COLS_MAP

/** Responsive column counts — `{ base: 1, md: 3 }` is 1-up on mobile, 3-up from `md`. */
export interface ResponsiveCols {
    base?: ColCount
    sm?: ColCount
    md?: ColCount
    lg?: ColCount
    xl?: ColCount
}

function resolveCols(cols: ColCount | ResponsiveCols | undefined): string {
    if (cols === undefined) return "grid-cols-3"
    if (typeof cols === "number") return COLS_MAP[cols]
    return cn(
        cols.base !== undefined && COLS_MAP[cols.base],
        cols.sm !== undefined && SM_COLS_MAP[cols.sm],
        cols.md !== undefined && MD_COLS_MAP[cols.md],
        cols.lg !== undefined && LG_COLS_MAP[cols.lg],
        cols.xl !== undefined && XL_COLS_MAP[cols.xl]
    )
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Number of columns. A **fixed** count (`cols={3}`) stays N-up at every width
     * — on a narrow screen that overflows, so use it only for layouts that should
     * not reflow. For mobile-safe layouts pass a **responsive** object
     * (`cols={{ base: 1, md: 3 }}`) or use `minItemWidth`. Mutually exclusive with
     * `minItemWidth`. (#114)
     */
    cols?: ColCount | ResponsiveCols
    /**
     * If set, uses CSS grid auto-fit with this minimum item width (px).
     * Items wrap and fill available space responsively (always mobile-safe).
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
                    !useAutoFit && resolveCols(cols),
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
