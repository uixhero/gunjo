"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface RangeSliderProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    value?: [number, number]
    defaultValue?: [number, number]
    onValueChange?: (value: [number, number]) => void
    min?: number
    max?: number
    step?: number
    minLabel?: string
    maxLabel?: string
    disabled?: boolean
    trackClassName?: string
    rangeClassName?: string
    thumbClassName?: string
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function roundToStep(value: number, step: number) {
    const precision = String(step).split(".")[1]?.length ?? 0
    return Number((Math.round(value / step) * step).toFixed(precision))
}

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
    (
        {
            className,
            value,
            defaultValue,
            onValueChange,
            min = 0,
            max = 100,
            step = 1,
            minLabel = "Minimum value",
            maxLabel = "Maximum value",
            disabled,
            trackClassName,
            rangeClassName,
            thumbClassName,
            ...props
        },
        ref
    ) => {
        const isControlled = value !== undefined
        const [internalValue, setInternalValue] = React.useState<[number, number]>(
            defaultValue ?? [min, max]
        )
        const currentValue = value ?? internalValue
        const minValue = clamp(Math.min(currentValue[0], currentValue[1]), min, max)
        const maxValue = clamp(Math.max(currentValue[0], currentValue[1]), min, max)
        const minPercent = ((minValue - min) / (max - min)) * 100
        const maxPercent = ((maxValue - min) / (max - min)) * 100

        const commit = (nextValue: [number, number]) => {
            const next: [number, number] = [
                clamp(roundToStep(Math.min(nextValue[0], nextValue[1]), step), min, max),
                clamp(roundToStep(Math.max(nextValue[0], nextValue[1]), step), min, max),
            ]
            if (!isControlled) setInternalValue(next)
            onValueChange?.(next)
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex h-7 w-[240px] min-w-0 touch-none select-none items-center",
                    disabled && "pointer-events-none opacity-50",
                    className
                )}
                data-slot="range-slider"
                {...props}
            >
                <div
                    className={cn("absolute left-0 right-0 h-2 rounded-full bg-input", trackClassName)}
                    aria-hidden="true"
                />
                <div
                    className={cn("absolute h-2 rounded-full bg-primary", rangeClassName)}
                    style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                    aria-hidden="true"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    disabled={disabled}
                    onChange={(event) => commit([Number(event.currentTarget.value), maxValue])}
                    className={cn(
                        "pointer-events-none absolute inset-0 z-20 h-7 w-full appearance-none bg-transparent",
                        "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:bg-background",
                        "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background",
                        thumbClassName
                    )}
                    aria-label={minLabel}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    disabled={disabled}
                    onChange={(event) => commit([minValue, Number(event.currentTarget.value)])}
                    className={cn(
                        "pointer-events-none absolute inset-0 z-30 h-7 w-full appearance-none bg-transparent",
                        "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:bg-background",
                        "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background",
                        thumbClassName
                    )}
                    aria-label={maxLabel}
                />
            </div>
        )
    }
)
RangeSlider.displayName = "RangeSlider"

export { RangeSlider }
