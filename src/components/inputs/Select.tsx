import * as React from "react"
import { cn } from "../../lib/utils"
import { IconChevronDown as ChevronDown } from "@tabler/icons-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        const isFullWidth =
            typeof className === "string" &&
            className.split(/\s+/).includes("w-full")

        return (
            <div
                className={cn(
                    "relative inline-block max-w-full align-middle",
                    isFullWidth && "block w-full"
                )}
                data-slot="select"
            >
                <select
                    className={cn(
                        "inline-flex h-9 w-[200px] max-w-full appearance-none items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 pr-9 text-sm font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                    data-slot="select-control"
                >
                    {children}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
