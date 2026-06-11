"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Input, type InputProps } from "./Input"

export interface PostalCodeInputProps
    extends Omit<InputProps, "type" | "value" | "defaultValue" | "onChange" | "prefix"> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    prefix?: React.ReactNode
    formatValue?: (value: string) => string
    disabledReason?: React.ReactNode
}

function formatJapanesePostalCode(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 7)
    if (digits.length <= 3) return digits
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
}

const PostalCodeInput = React.forwardRef<
    HTMLInputElement,
    PostalCodeInputProps
>(
    (
        {
            className,
            value,
            defaultValue,
            onValueChange,
            prefix = "〒",
            formatValue = formatJapanesePostalCode,
            disabled,
            disabledReason,
            ...props
        },
        ref
    ) => {
        const isControlled = value !== undefined
        const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
        const resolvedValue = isControlled ? value : internalValue

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = formatValue(event.target.value)
            if (!isControlled) {
                setInternalValue(next)
            }
            onValueChange?.(next)
        }

        const control = (
            <div
                className={cn(
                    "inline-flex w-[220px] max-w-full items-stretch rounded-lg border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring",
                    disabled && "opacity-50",
                    className
                )}
                data-slot="postal-code-input"
            >
                <span className="inline-flex items-center justify-center border-r border-input px-3 text-sm text-muted-foreground">
                    {prefix}
                </span>
                <Input
                    ref={ref}
                    type="text"
                    inputMode="numeric"
                    value={resolvedValue}
                    onChange={handleChange}
                    disabled={disabled}
                    className="h-9 min-w-0 flex-1 border-0 shadow-none focus-visible:ring-0"
                    {...props}
                />
            </div>
        )

        if (disabled && disabledReason) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex max-w-full" tabIndex={0}>
                            {control}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{disabledReason}</TooltipContent>
                </Tooltip>
            )
        }

        return control
    }
)
PostalCodeInput.displayName = "PostalCodeInput"

export { PostalCodeInput, formatJapanesePostalCode }
