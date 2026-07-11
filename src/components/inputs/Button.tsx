"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Spinner } from "../feedback/Spinner"
import { buttonVariants } from "./ButtonVariants"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    /**
     * Async pending state: shows a leading `Spinner`, disables the button, and
     * sets `aria-busy` (the label stays, so the width is stable). Use for
     * form/action buttons awaiting a promise. Ignored when `asChild` is set —
     * the child owns its content. (#305)
     */
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"
        const classes = cn(buttonVariants({ variant, size, className }))

        // asChild: the child owns its content (Slot requires a single child), so
        // we don't inject a Spinner — only forward the pending semantics.
        if (asChild) {
            return (
                <Comp
                    className={classes}
                    ref={ref}
                    aria-busy={loading || undefined}
                    disabled={disabled}
                    {...props}
                >
                    {children}
                </Comp>
            )
        }

        return (
            <Comp
                className={classes}
                ref={ref}
                aria-busy={loading || undefined}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? <Spinner aria-hidden /> : null}
                {children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button }
