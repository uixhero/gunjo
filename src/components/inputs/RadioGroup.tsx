"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import type { RadioGroupVariantKey } from "./generated/variant-keys"
import { radioGroupDefaultVariantKey } from "./generated/default-variant-keys"

// Simple Context-less Radio for batch 1, or Context-based?
// Let's go Simple but composable.
// Actually standard standard is RadioGroup + RadioGroupItem.

const RadioGroupContext = React.createContext<{
    value?: string,
    onValueChange?: (value: string) => void,
    name?: string
} | undefined>(undefined);

const radioGroupItemStateClasses: Record<RadioGroupVariantKey, string> = {
    checked: "border-foreground bg-transparent",
    unchecked: "border-input bg-transparent",
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value, onValueChange, defaultValue, name, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue)
        const activeValue = value !== undefined ? value : internalValue

        const handleValueChange = (v: string) => {
            if (value === undefined) setInternalValue(v);
            onValueChange?.(v);
        }

        return (
            <RadioGroupContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, name }}>
                <div className={cn("grid gap-2", className)} ref={ref} {...props}>
                    {children}
                </div>
            </RadioGroupContext.Provider>
        )
    }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext)
        const checked = context?.value === value
        const itemState: RadioGroupVariantKey = checked ? "checked" : radioGroupDefaultVariantKey

        return (
            <button
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => context?.onValueChange?.(value)}
                ref={ref}
                className={cn(
                    "aspect-square h-4 w-4 rounded-lg border text-foreground ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    radioGroupItemStateClasses[itemState],
                    className
                )}
                {...props}
            >
                {checked && (
                    <div className="flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    </div>
                )}
            </button>
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
