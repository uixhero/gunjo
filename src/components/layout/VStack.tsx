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
    gap?: keyof typeof GAP_MAP
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
                GAP_MAP[gap],
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
