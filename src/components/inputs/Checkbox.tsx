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
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
        const checkboxState: CheckboxVariantKey = disabled
            ? "disabled"
            : checked
                ? "checked"
                : checkboxDefaultVariantKey

        return (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
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
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
