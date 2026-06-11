"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import type { SwitchVariantKey } from "./generated/variant-keys"
import { switchDefaultVariantKey } from "./generated/default-variant-keys"

const switchStateClasses: Record<SwitchVariantKey, string> = {
    checked: "justify-end bg-foreground",
    unchecked: "justify-start bg-secondary",
}

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, defaultChecked, onCheckedChange, onClick, ...props }, ref) => {
        const [uncontrolledChecked, setUncontrolledChecked] = React.useState(Boolean(defaultChecked))
        const isControlled = checked !== undefined
        const currentChecked = isControlled ? checked : uncontrolledChecked
        const switchState: SwitchVariantKey = currentChecked ? "checked" : switchDefaultVariantKey

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event)
            if (event.defaultPrevented) return
            const nextChecked = !currentChecked
            if (!isControlled) setUncontrolledChecked(nextChecked)
            onCheckedChange?.(nextChecked)
        }

        return (
            <button
                type="button"
                role="switch"
                aria-checked={currentChecked}
                onClick={handleClick}
                className={cn(
                    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    switchStateClasses[switchState],
                    className
                )}
                ref={ref}
                {...props}
            >
                <span
                    className={cn(
                        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform"
                    )}
                />
            </button>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }
