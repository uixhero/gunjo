import * as React from "react"
import { cn } from "../../lib/utils"
import type { TextareaVariantKey } from "./generated/variant-keys"
import { textareaDefaultVariantKey } from "./generated/default-variant-keys"

const textareaVariantClasses: Record<TextareaVariantKey, string> = {
    default: "placeholder:text-muted-foreground",
    disabled:
        "placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Optional visible label rendered above the control and associated via `htmlFor`. */
    label?: React.ReactNode
    /** Optional helper text under the control, wired via `aria-describedby`. */
    description?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, disabled, label, description, id, "aria-describedby": ariaDescribedby, ...props }, ref) => {
        const textareaState: TextareaVariantKey = disabled ? "disabled" : textareaDefaultVariantKey
        const reactId = React.useId()
        const hasWrap = Boolean(label || description)
        const controlId = id ?? (hasWrap ? `${reactId}-textarea` : undefined)
        const descriptionId = description ? `${reactId}-description` : undefined
        const describedBy = [descriptionId, ariaDescribedby].filter(Boolean).join(" ") || undefined

        const control = (
            <textarea
                className={cn(
                    "block h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
                    "aria-invalid:border-destructive-border aria-invalid:ring-destructive-border aria-invalid:focus-visible:ring-destructive-border",
                    textareaVariantClasses[textareaState],
                    className
                )}
                ref={ref}
                id={controlId}
                disabled={disabled}
                aria-describedby={describedBy}
                {...props}
                data-slot="textarea"
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
Textarea.displayName = "Textarea"

export { Textarea }
