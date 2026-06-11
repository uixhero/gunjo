"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface RightRailProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string
}

const RightRail = React.forwardRef<HTMLDivElement, RightRailProps>(
    ({ className, width = "w-64", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "z-30 flex h-full min-h-0 flex-shrink-0 flex-col border-l border-border bg-background",
                    width,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
RightRail.displayName = "RightRail"

export { RightRail }
