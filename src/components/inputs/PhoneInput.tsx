"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Input, type InputProps } from "./Input"

export interface PhoneInputProps
    extends Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    countryCallingCode?: string
    countryLabel?: React.ReactNode
    formatValue?: (value: string) => string
    disabledReason?: React.ReactNode
}

function formatJapanesePhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            className,
            value,
            defaultValue,
            onValueChange,
            countryCallingCode = "+81",
            countryLabel = "Japan",
            formatValue = formatJapanesePhone,
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
                    "inline-flex w-[280px] max-w-full items-stretch rounded-lg border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring",
                    disabled && "opacity-50",
                    className
                )}
                data-slot="phone-input"
            >
                <span className="inline-flex min-w-16 items-center justify-center border-r border-input px-3 text-sm text-muted-foreground">
                    <span className="sr-only">{countryLabel}</span>
                    {countryCallingCode}
                </span>
                <Input
                    ref={ref}
                    type="tel"
                    inputMode="tel"
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
PhoneInput.displayName = "PhoneInput"

export { PhoneInput, formatJapanesePhone }
