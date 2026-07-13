import * as React from "react"
import { cn } from "../../lib/utils"
import type { InputVariantKey } from "./generated/variant-keys"
import { inputDefaultVariantKey } from "./generated/default-variant-keys"

const inputVariantClasses: Record<InputVariantKey, string> = {
    default: "",
    disabled: "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
    placeholder: "placeholder:text-muted-foreground",
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Optional visible label rendered above the control and associated via `htmlFor`. */
    label?: React.ReactNode
    /** Optional helper text under the control, wired via `aria-describedby`. */
    description?: React.ReactNode
    /** Show a character-count readout under the control. Pairs with `maxLength` to render `count / max`. */
    showCount?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, disabled, label, description, showCount, id, maxLength, value, defaultValue, onChange, "aria-describedby": ariaDescribedby, ...props }, ref) => {
        const inputState: InputVariantKey = disabled ? "disabled" : inputDefaultVariantKey
        const reactId = React.useId()
        const [count, setCount] = React.useState(() => String(value ?? defaultValue ?? "").length)
        React.useEffect(() => {
            if (value !== undefined) setCount(String(value).length)
        }, [value])
        const handleChange = showCount
            ? (event: React.ChangeEvent<HTMLInputElement>) => {
                  setCount(event.target.value.length)
                  onChange?.(event)
              }
            : onChange

        const hasWrap = Boolean(label || description || showCount)
        const controlId = id ?? (hasWrap ? `${reactId}-input` : undefined)
        const descriptionId = description ? `${reactId}-description` : undefined
        const countId = showCount ? `${reactId}-count` : undefined
        const describedBy = [descriptionId, countId, ariaDescribedby].filter(Boolean).join(" ") || undefined

        const control = (
            <input
                type={type}
                className={cn(
                    "inline-flex h-9 w-full max-w-full items-center rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
                    "aria-invalid:border-destructive-border aria-invalid:ring-destructive-border aria-invalid:focus-visible:ring-destructive-border",
                    inputVariantClasses[inputState],
                    inputVariantClasses.placeholder,
                    className
                )}
                ref={ref}
                id={controlId}
                suppressHydrationWarning
                disabled={disabled}
                maxLength={maxLength}
                value={value}
                defaultValue={defaultValue}
                onChange={handleChange}
                aria-describedby={describedBy}
                {...props}
                data-slot="input"
            />
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
                {description || showCount ? (
                    <div className="flex items-start justify-between gap-2">
                        {description ? (
                            <p id={descriptionId} className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        ) : (
                            <span />
                        )}
                        {showCount ? (
                            <span id={countId} className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {maxLength != null ? `${count} / ${maxLength}` : count}
                            </span>
                        ) : null}
                    </div>
                ) : null}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
