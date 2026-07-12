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
    name?: string,
    disabled?: boolean
} | undefined>(undefined);

const radioGroupItemStateClasses: Record<RadioGroupVariantKey, string> = {
    checked: "border-foreground",
    unchecked: "border-input",
}

// A radio is disabled for roving-tabindex / arrow-nav if it's natively disabled
// (own `disabled` OR an ancestor `<fieldset disabled>` — the latter only shows up
// via `:disabled`, not the `.disabled` IDL property) or marked `aria-disabled`. (#273)
function isRadioDisabled(r: HTMLButtonElement): boolean {
    return r.matches(":disabled") || r.getAttribute("aria-disabled") === "true"
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    name?: string
    /**
     * Disable every item in the group. Each `RadioGroupItem` reflects it as
     * `aria-disabled` and drops out of the roving tab order. An ancestor
     * `<fieldset disabled>` is honored the same way, even without this prop. (#273)
     */
    disabled?: boolean
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value, onValueChange, defaultValue, name, disabled, children, ...props }, forwardedRef) => {
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
            const firstEnabled = radios.find((r) => !isRadioDisabled(r))
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
            ).filter((r) => !isRadioDisabled(r))
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
            <RadioGroupContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, name, disabled }}>
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
    /**
     * Optional visible label rendered next to the radio and wired as its
     * accessible name (`aria-labelledby`), so callers don't hand-roll a `<label>`
     * — consistent with `Switch`/`Checkbox`. Omit for a bare radio.
     */
    label?: React.ReactNode
    /** Optional helper text under the label, wired via `aria-describedby`. */
    description?: React.ReactNode
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
    ({ className, value, label, description, disabled, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext)
        const checked = context?.value === value
        const itemState: RadioGroupVariantKey = checked ? "checked" : radioGroupDefaultVariantKey
        const reactId = React.useId()
        const labelId = label ? `${reactId}-label` : undefined
        const descriptionId = description ? `${reactId}-description` : undefined

        // Effective disabled = own prop OR RadioGroup `disabled` OR an ancestor
        // `<fieldset disabled>`. The fieldset case is detected from the DOM
        // (`:disabled`) after mount, so it's reflected in aria + tab order even
        // though React never sees a `disabled` prop for it. (#273)
        const ownOrGroupDisabled = (disabled ?? false) || (context?.disabled ?? false)
        const buttonRef = React.useRef<HTMLButtonElement | null>(null)
        const setRefs = React.useCallback(
            (node: HTMLButtonElement | null) => {
                buttonRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref) ref.current = node
            },
            [ref]
        )
        const [detectedDisabled, setDetectedDisabled] = React.useState(false)
        React.useEffect(() => {
            const el = buttonRef.current
            setDetectedDisabled(el ? el.matches(":disabled") : false)
        })
        const isDisabled = ownOrGroupDisabled || detectedDisabled

        const control = (
            <button
                type="button"
                role="radio"
                aria-checked={checked}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                aria-disabled={isDisabled || undefined}
                tabIndex={isDisabled ? -1 : checked ? 0 : -1}
                onClick={() => context?.onValueChange?.(value)}
                ref={setRefs}
                disabled={ownOrGroupDisabled}
                className={cn(
                    "aspect-square h-4 w-4 shrink-0 rounded-lg border bg-transparent text-foreground ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
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

        if (!label && !description) return control

        return (
            <span className="inline-flex items-start gap-2">
                {control}
                <span className="flex flex-col">
                    {label ? (
                        <span
                            id={labelId}
                            className={cn(
                                "text-sm font-medium leading-none",
                                isDisabled ? "text-muted-foreground" : "cursor-pointer"
                            )}
                            onClick={isDisabled ? undefined : () => context?.onValueChange?.(value)}
                        >
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
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
