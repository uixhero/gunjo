"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface AppRailProps extends React.HTMLAttributes<HTMLDivElement> {

}

const AppRail = React.forwardRef<HTMLDivElement, AppRailProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "w-16 h-[320px] h-full bg-foreground flex flex-col items-center py-4 px-0 gap-4 text-muted z-40 flex-shrink-0",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
AppRail.displayName = "AppRail"

export { AppRail }
