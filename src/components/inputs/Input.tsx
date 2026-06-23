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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, disabled, label, description, id, "aria-describedby": ariaDescribedby, ...props }, ref) => {
        const inputState: InputVariantKey = disabled ? "disabled" : inputDefaultVariantKey
        const reactId = React.useId()
        const hasWrap = Boolean(label || description)
        const controlId = id ?? (hasWrap ? `${reactId}-input` : undefined)
        const descriptionId = description ? `${reactId}-description` : undefined
        const describedBy = [descriptionId, ariaDescribedby].filter(Boolean).join(" ") || undefined

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
                {description ? (
                    <p id={descriptionId} className="text-xs text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
