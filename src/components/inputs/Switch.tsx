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
    /**
     * Optional visible label rendered next to the switch and wired as its
     * accessible name (`aria-labelledby`), so callers don't have to remember an
     * external `<label>`/`aria-label`. Omit for a bare switch.
     */
    label?: React.ReactNode
    /** Optional helper text rendered under the label and wired via `aria-describedby`. */
    description?: React.ReactNode
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, defaultChecked, onCheckedChange, onClick, label, description, ...props }, ref) => {
        const [uncontrolledChecked, setUncontrolledChecked] = React.useState(Boolean(defaultChecked))
        const isControlled = checked !== undefined
        const currentChecked = isControlled ? checked : uncontrolledChecked
        const switchState: SwitchVariantKey = currentChecked ? "checked" : switchDefaultVariantKey
        const reactId = React.useId()
        const labelId = label ? `${reactId}-label` : undefined
        const descriptionId = description ? `${reactId}-description` : undefined

        const toggle = () => {
            const nextChecked = !currentChecked
            if (!isControlled) setUncontrolledChecked(nextChecked)
            onCheckedChange?.(nextChecked)
        }

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event)
            if (event.defaultPrevented) return
            toggle()
        }

        const control = (
            <button
                type="button"
                role="switch"
                aria-checked={currentChecked}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
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

        if (!label && !description) return control

        return (
            <span className="inline-flex items-center gap-2">
                {control}
                <span className="flex flex-col">
                    {label ? (
                        <span id={labelId} className="cursor-pointer text-sm font-medium leading-none" onClick={toggle}>
                            {label}
                        </span>
                    ) : null}
                    {description ? (
                        <span id={descriptionId} className="mt-1 text-xs text-muted-foreground">
                            {description}
                        </span>
                    ) : null}
                </span>
            </span>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }
