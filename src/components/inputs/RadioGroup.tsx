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
    checked: "border-foreground",
    unchecked: "border-input",
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value, onValueChange, defaultValue, name, children, ...props }, forwardedRef) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue)
        const activeValue = value !== undefined ? value : internalValue

        const innerRef = React.useRef<HTMLDivElement>(null)
        React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement)

        const handleValueChange = (v: string) => {
            if (value === undefined) setInternalValue(v);
            onValueChange?.(v);
        }

        // Roving tabindex: a checked item is tabbable via JSX (tabIndex=0). When nothing
        // is checked, make the first enabled radio the single tab stop so the group stays
        // reachable with one Tab, per the WAI-ARIA radiogroup pattern.
        React.useEffect(() => {
            const el = innerRef.current
            if (!el) return
            const radios = Array.from(
                el.querySelectorAll<HTMLButtonElement>('[role="radio"]')
            )
            if (radios.some((r) => r.getAttribute("aria-checked") === "true")) return
            const firstEnabled = radios.find((r) => !r.disabled)
            radios.forEach((r) => {
                r.tabIndex = r === firstEnabled ? 0 : -1
            })
        })

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (
                !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(
                    event.key
                )
            )
                return
            const el = innerRef.current
            if (!el) return
            const radios = Array.from(
                el.querySelectorAll<HTMLButtonElement>('[role="radio"]')
            ).filter((r) => !r.disabled)
            if (radios.length === 0) return
            event.preventDefault()
            const current = radios.indexOf(document.activeElement as HTMLButtonElement)
            let next: number
            if (event.key === "Home") next = 0
            else if (event.key === "End") next = radios.length - 1
            else {
                const dir =
                    event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1
                next = ((current === -1 ? 0 : current) + dir + radios.length) % radios.length
            }
            radios[next].focus()
            radios[next].click()
        }

        return (
            <RadioGroupContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, name }}>
                <div
                    role="radiogroup"
                    className={cn("grid gap-2", className)}
                    ref={innerRef}
                    onKeyDown={handleKeyDown}
                    {...props}
                >
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
                tabIndex={checked ? 0 : -1}
                onClick={() => context?.onValueChange?.(value)}
                ref={ref}
                className={cn(
                    "aspect-square h-4 w-4 rounded-lg border bg-transparent text-foreground ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
