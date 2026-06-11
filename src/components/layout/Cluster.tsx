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

const ALIGN_MAP = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
} as const

const JUSTIFY_MAP = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
} as const

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: keyof typeof GAP_MAP
    align?: keyof typeof ALIGN_MAP
    justify?: keyof typeof JUSTIFY_MAP
}

const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
    (
        { className, gap = 2, align = "center", justify = "start", ...props },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-row flex-wrap",
                GAP_MAP[gap],
                ALIGN_MAP[align],
                JUSTIFY_MAP[justify],
                className
            )}
            {...props}
        />
    )
)
Cluster.displayName = "Cluster"

export { Cluster }
