"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
    leftNode?: React.ReactNode
    rightNode?: React.ReactNode
    fixed?: boolean
}

const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
    ({ className, leftNode, rightNode, fixed = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid w-[640px] max-w-full grid-cols-2 items-center justify-between gap-x-3 gap-y-1 overflow-hidden px-4 py-1 bg-primary text-primary-foreground text-xs z-50 shadow-md sm:flex sm:flex-col sm:flex-row sm:gap-2",
                    fixed && "fixed bottom-0 left-0 right-0",
                    className
                )}
                {...props}
            >
                <div className="order-2 flex min-w-0 items-center justify-start gap-4 text-left sm:order-none sm:max-w-[30%] [&>*]:truncate">
                    {leftNode}
                </div>

                <div className="order-1 col-span-2 flex min-w-0 w-full flex-1 items-center justify-center gap-2 text-center sm:order-none sm:w-auto [&>*]:truncate">
                    {children}
                </div>

                <div className="order-3 flex min-w-0 items-center justify-end gap-4 text-right sm:order-none sm:max-w-[30%] [&>*]:truncate">
                    {rightNode}
                </div>
            </div>
        )
    }
)
StatusBar.displayName = "StatusBar"

export { StatusBar }
