"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface PasswordStrengthMeterProps
    extends React.HTMLAttributes<HTMLDivElement> {
    score: number
    maxScore?: number
    label?: React.ReactNode
    description?: React.ReactNode
    valueLabel?: React.ReactNode
}

function getStrengthClass(score: number, maxScore: number) {
    const ratio = maxScore <= 0 ? 0 : score / maxScore
    if (ratio >= 0.75) return "bg-success"
    if (ratio >= 0.5) return "bg-warning"
    if (ratio > 0) return "bg-destructive"
    return "bg-muted"
}

const PasswordStrengthMeter = React.forwardRef<
    HTMLDivElement,
    PasswordStrengthMeterProps
>(
    (
        {
            className,
            score,
            maxScore = 4,
            label = "Password strength",
            description,
            valueLabel,
            ...props
        },
        ref
    ) => {
        const normalizedMax = Math.max(1, maxScore)
        const normalizedScore = Math.max(0, Math.min(score, normalizedMax))
        const segments = Array.from({ length: normalizedMax }, (_, index) => index)
        const meterId = React.useId()

        return (
            <div
                ref={ref}
                className={cn("grid gap-2", className)}
                data-slot="password-strength-meter"
                {...props}
            >
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <span id={meterId} className="text-sm font-medium">
                        {label}
                    </span>
                    {valueLabel ? (
                        <span className="text-xs font-medium text-muted-foreground">
                            {valueLabel}
                        </span>
                    ) : null}
                </div>
                <div
                    className="grid gap-1"
                    style={{ gridTemplateColumns: `repeat(${normalizedMax}, minmax(0, 1fr))` }}
                    role="meter"
                    aria-labelledby={meterId}
                    aria-valuemin={0}
                    aria-valuemax={normalizedMax}
                    aria-valuenow={normalizedScore}
                >
                    {segments.map((segment) => (
                        <span
                            key={segment}
                            className={cn(
                                "h-1.5 rounded-full",
                                segment < normalizedScore
                                    ? getStrengthClass(normalizedScore, normalizedMax)
                                    : "bg-muted"
                            )}
                            aria-hidden="true"
                        />
                    ))}
                </div>
                {description ? (
                    <p className="text-xs text-muted-foreground">{description}</p>
                ) : null}
            </div>
        )
    }
)
PasswordStrengthMeter.displayName = "PasswordStrengthMeter"

export { PasswordStrengthMeter }
