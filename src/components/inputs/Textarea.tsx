import * as React from "react"
import { cn } from "../../lib/utils"
import type { TextareaVariantKey } from "./generated/variant-keys"
import { textareaDefaultVariantKey } from "./generated/default-variant-keys"

const textareaVariantClasses: Record<TextareaVariantKey, string> = {
    default: "placeholder:text-muted-foreground",
    disabled:
        "placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50",
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, disabled, ...props }, ref) => {
        const textareaState: TextareaVariantKey = disabled ? "disabled" : textareaDefaultVariantKey

        return (
            <textarea
                className={cn(
                    "inline-flex h-20 w-[280px] max-w-full items-center rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
                    "aria-invalid:border-destructive-border aria-invalid:ring-destructive-border aria-invalid:focus-visible:ring-destructive-border",
                    textareaVariantClasses[textareaState],
                    className
                )}
                ref={ref}
                disabled={disabled}
                {...props}
                data-slot="textarea"
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
