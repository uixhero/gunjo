"use client"

import * as React from "react"
import { IconEye as Eye, IconEyeOff as EyeOff } from "@tabler/icons-react";

import { cn } from "../../lib/utils"

export interface PasswordInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    /** If provided, controls the show/hide state externally. */
    show?: boolean
    onShowChange?: (show: boolean) => void
    showLabel?: string
    hideLabel?: string
    /** Classes for the inner `<input>` (the `className` prop styles the wrapper). */
    inputClassName?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            className,
            inputClassName,
            show: showProp,
            onShowChange,
            showLabel = "Show password",
            hideLabel = "Hide password",
            disabled,
            ...props
        },
        ref
    ) => {
        const [internalShow, setInternalShow] = React.useState(false)
        const isControlled = showProp !== undefined
        const show = isControlled ? showProp : internalShow

        const toggle = () => {
            const next = !show
            if (!isControlled) setInternalShow(next)
            onShowChange?.(next)
        }

        const Icon = show ? EyeOff : Eye

        return (
            <div
                className={cn(
                    "relative inline-flex items-center w-full",
                    disabled && "opacity-50 pointer-events-none",
                    className
                )}
                data-slot="password-input"
            >
                <input
                    ref={ref}
                    type={show ? "text" : "password"}
                    disabled={disabled}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        "aria-invalid:border-destructive-border aria-invalid:ring-destructive-border aria-invalid:focus-visible:ring-destructive-border",
                        inputClassName
                    )}
                    {...props}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={toggle}
                    disabled={disabled}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                    aria-label={show ? hideLabel : showLabel}
                >
                    <Icon className="h-4 w-4" />
                </button>
            </div>
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
