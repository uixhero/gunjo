"use client"

import * as React from "react"
import { IconCheck as Check } from "@tabler/icons-react";
import { cn } from "../../lib/utils"
import type { CheckboxVariantKey } from "./generated/variant-keys"
import { checkboxDefaultVariantKey } from "./generated/default-variant-keys"

const checkboxStateClasses: Record<CheckboxVariantKey, string> = {
    checked: "border-transparent bg-foreground text-background text-xs font-semibold",
    disabled: "bg-transparent disabled:bg-muted disabled:opacity-50",
    unchecked: "bg-transparent",
}

export interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    /**
     * Optional visible label rendered next to the box and wired as its accessible
     * name (`aria-labelledby`), so callers don't have to remember a per-instance
     * `aria-label`. Omit for a bare checkbox.
     */
    label?: React.ReactNode
    /** Optional helper text rendered under the label and wired via `aria-describedby`. */
    description?: React.ReactNode
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, disabled, label, description, ...props }, ref) => {
        const checkboxState: CheckboxVariantKey = disabled
            ? "disabled"
            : checked
                ? "checked"
                : checkboxDefaultVariantKey
        const reactId = React.useId()
        const labelId = label ? `${reactId}-label` : undefined
        const descriptionId = description ? `${reactId}-description` : undefined

        const control = (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                onClick={() => onCheckedChange?.(!checked)}
                ref={ref}
                className={cn(
                    "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-input bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
                    checkboxStateClasses[checkboxState],
                    className
                )}
                disabled={disabled}
                {...props}
            >
                {checked && (
                    <Check className="h-3 w-3" strokeWidth={3} />
                )}
            </button>
        )

        if (!label && !description) return control

        return (
            <span className="inline-flex items-start gap-2">
                {control}
                <span className="flex flex-col">
                    {label ? (
                        <span
                            id={labelId}
                            className={cn(
                                "text-sm font-medium leading-5",
                                disabled ? "text-muted-foreground" : "cursor-pointer"
                            )}
                            onClick={disabled ? undefined : () => onCheckedChange?.(!checked)}
                        >
                            {label}
                        </span>
                    ) : null}
                    {description ? (
                        <span id={descriptionId} className="text-xs text-muted-foreground">
                            {description}
                        </span>
                    ) : null}
                </span>
            </span>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
