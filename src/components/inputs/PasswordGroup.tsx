"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    FormMessage,
} from "./Form"
import { PasswordInput, type PasswordInputProps } from "./PasswordInput"
import {
    PasswordRequirementList,
    type PasswordRequirement,
} from "./PasswordRequirementList"
import { PasswordStrengthMeter } from "./PasswordStrengthMeter"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface PasswordGroupProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "defaultValue" | "onChange"
    > {
    id?: string
    label?: React.ReactNode
    description?: React.ReactNode
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    requirements?: PasswordRequirement[]
    strengthScore?: number
    strengthLabel?: React.ReactNode
    strengthDescription?: React.ReactNode
    strengthValueLabel?: React.ReactNode
    error?: React.ReactNode
    disabled?: boolean
    disabledReason?: React.ReactNode
    passwordInputProps?: Omit<
        PasswordInputProps,
        "id" | "value" | "defaultValue" | "onChange" | "disabled"
    >
}

const PasswordGroup = React.forwardRef<HTMLDivElement, PasswordGroupProps>(
    (
        {
            className,
            id: idProp,
            label = "Password",
            description,
            value,
            defaultValue,
            onValueChange,
            requirements,
            strengthScore,
            strengthLabel,
            strengthDescription,
            strengthValueLabel,
            error,
            disabled,
            disabledReason,
            passwordInputProps,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const id = idProp ?? generatedId
        const isControlled = value !== undefined
        const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
        const resolvedValue = isControlled ? value : internalValue

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!isControlled) {
                setInternalValue(event.target.value)
            }
            onValueChange?.(event.target.value)
        }

        const input = (
            <PasswordInput
                {...passwordInputProps}
                id={id}
                value={resolvedValue}
                onChange={handleChange}
                disabled={disabled}
                aria-invalid={error ? true : passwordInputProps?.["aria-invalid"]}
            />
        )

        return (
            <div
                ref={ref}
                className={cn("w-full", className)}
                data-slot="password-group"
                {...props}
            >
                <FormGroup>
                    {label ? <FormLabel htmlFor={id}>{label}</FormLabel> : null}
                    <FormControl>
                        {disabled && disabledReason ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="block w-full" tabIndex={0}>
                                        {input}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>{disabledReason}</TooltipContent>
                            </Tooltip>
                        ) : (
                            input
                        )}
                    </FormControl>
                    {description ? (
                        <FormDescription>{description}</FormDescription>
                    ) : null}
                    {strengthScore !== undefined ? (
                        <PasswordStrengthMeter
                            score={strengthScore}
                            label={strengthLabel}
                            description={strengthDescription}
                            valueLabel={strengthValueLabel}
                        />
                    ) : null}
                    {requirements && requirements.length > 0 ? (
                        <PasswordRequirementList requirements={requirements} />
                    ) : null}
                    {error ? <FormMessage>{error}</FormMessage> : null}
                </FormGroup>
            </div>
        )
    }
)
PasswordGroup.displayName = "PasswordGroup"

export { PasswordGroup }
