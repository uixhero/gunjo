"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { IconChevronDown as ChevronDown } from "@tabler/icons-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Optional visible label rendered above the control and associated via `htmlFor`. */
    label?: React.ReactNode
    /** Optional helper text under the control, wired via `aria-describedby`. */
    description?: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, label, description, id, "aria-describedby": ariaDescribedby, ...props }, ref) => {
        const reactId = React.useId()
        const hasWrap = Boolean(label || description)
        const controlId = id ?? (hasWrap ? `${reactId}-select` : undefined)
        const descriptionId = description ? `${reactId}-description` : undefined
        const describedBy = [descriptionId, ariaDescribedby].filter(Boolean).join(" ") || undefined

        const control = (
            <div
                className="relative block w-full max-w-full align-middle"
                data-slot="select"
            >
                <select
                    id={controlId}
                    aria-describedby={describedBy}
                    className={cn(
                        "inline-flex h-9 w-full max-w-full appearance-none items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 pr-9 text-sm font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
                        "aria-invalid:border-destructive-border aria-invalid:ring-destructive-border aria-invalid:focus:ring-destructive-border",
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

        if (!hasWrap) return control

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label ? (
                    <label htmlFor={controlId} className="text-sm font-medium leading-none text-foreground">
                        {label}
                    </label>
                ) : null}
                {control}
                {description ? (
                    <p id={descriptionId} className="text-xs text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
