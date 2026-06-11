import * as React from "react"
import { cn } from "../../lib/utils"
import type { InputVariantKey } from "./generated/variant-keys"
import { inputDefaultVariantKey } from "./generated/default-variant-keys"

const inputVariantClasses: Record<InputVariantKey, string> = {
    default: "",
    disabled: "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
    placeholder: "placeholder:text-muted-foreground",
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, disabled, ...props }, ref) => {
        const inputState: InputVariantKey = disabled ? "disabled" : inputDefaultVariantKey

        return (
            <input
                type={type}
                className={cn(
                    "inline-flex h-9 w-[280px] max-w-full items-center rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
                    "aria-invalid:border-destructive-border aria-invalid:ring-destructive-border aria-invalid:focus-visible:ring-destructive-border",
                    inputVariantClasses[inputState],
                    inputVariantClasses.placeholder,
                    className
                )}
                ref={ref}
                suppressHydrationWarning
                disabled={disabled}
                {...props}
                data-slot="input"
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
