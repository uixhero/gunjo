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
    10: "gap-10",
    12: "gap-12",
} as const

// String aliases for the numeric gap scale, so `gap="lg"` works alongside
// `gap={6}` — the numeric scale is a spacing token, distinct from Button/Tag
// `size`, and adopters reflexively reach for the string form. (#330)
const GAP_ALIAS = { none: 0, xs: 1, sm: 2, md: 4, lg: 6, xl: 8 } as const

const ALIGN_MAP = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
} as const

const JUSTIFY_MAP = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
} as const

export interface VStackProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Space between children — a numeric spacing-scale step (`gap={6}`) **or** a
     * string alias (`"none" | "xs" | "sm" | "md" | "lg" | "xl"`). It is a spacing
     * token, not a component `size`. Default `2`. (#330)
     */
    gap?: keyof typeof GAP_MAP | keyof typeof GAP_ALIAS
    align?: keyof typeof ALIGN_MAP
    justify?: keyof typeof JUSTIFY_MAP
    inline?: boolean
}

const VStack = React.forwardRef<HTMLDivElement, VStackProps>(
    (
        {
            className,
            gap = 2,
            align = "stretch",
            justify = "start",
            inline = false,
            ...props
        },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                inline ? "inline-flex" : "flex",
                "flex-col",
                GAP_MAP[typeof gap === "string" ? GAP_ALIAS[gap] : gap],
                ALIGN_MAP[align],
                JUSTIFY_MAP[justify],
                className
            )}
            {...props}
        />
    )
)
VStack.displayName = "VStack"

export { VStack }
