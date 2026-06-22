"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue"> {
    value?: number | string
    defaultValue?: number | string
    onValueChange?: (value: number) => void
    /**
     * Format the value for the screen-reader `aria-valuetext` and the optional
     * visible value label, e.g. `formatValue={(v) => formatCurrency(v)}` so it's
     * announced as `¥35,000,000` rather than `35000000`. (#193)
     */
    formatValue?: (value: number) => string
    /** Render the (formatted) current value above the track. */
    showValue?: boolean
    /** Optional label rendered above the track, opposite the value. */
    label?: React.ReactNode
}

function toNumber(value: number | string | undefined, fallback: number): number {
    if (value === undefined || value === "") return fallback
    const n = Number(value)
    return Number.isNaN(n) ? fallback : n
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, onChange, onValueChange, formatValue, showValue, label, id, style: styleProp, ...props }, ref) => {
        const min = toNumber(props.min as number | string | undefined, 0)
        const max = toNumber(props.max as number | string | undefined, 100)

        // Track the value for the filled portion: controlled `value`, else the
        // last changed value (seeded from defaultValue), so the fill follows the
        // thumb in both modes.
        const isControlled = props.value !== undefined
        const [internal, setInternal] = React.useState<number>(() =>
            toNumber(props.value ?? props.defaultValue, min)
        )
        const current = isControlled ? toNumber(props.value, min) : internal

        const reactId = React.useId()
        const controlId = id ?? (label || showValue ? `${reactId}-slider` : undefined)
        const pct = max > min ? ((current - min) / (max - min)) * 100 : 0
        const valueText = formatValue ? formatValue(current) : undefined

        const slider = (
            <div
                className={cn("relative flex w-full touch-none select-none items-center", className)}
                data-slot="slider"
            >
                <input
                    type="range"
                    ref={ref}
                    id={controlId}
                    aria-valuetext={valueText}
                    onChange={(event) => {
                        if (!isControlled) setInternal(Number(event.currentTarget.value))
                        onChange?.(event)
                        onValueChange?.(Number(event.currentTarget.value))
                    }}
                    // Filled track up to the thumb (inline style keeps the class
                    // list — and the drift contract — unchanged). (#193)
                    style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--input)) ${pct}%, hsl(var(--input)) 100%)`,
                        ...styleProp,
                    }}
                    className={cn(
                        "h-5 w-full cursor-pointer appearance-none rounded-[10px] bg-input disabled:cursor-not-allowed disabled:opacity-50",
                        "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:focus-visible:outline-none [&::-webkit-slider-thumb]:focus-visible:ring-1 [&::-webkit-slider-thumb]:focus-visible:ring-ring [&::-webkit-slider-thumb]:focus-visible:ring-offset-1 [&::-webkit-slider-thumb]:focus-visible:ring-offset-background [&::-webkit-slider-thumb]:disabled:pointer-events-none [&::-webkit-slider-thumb]:disabled:opacity-50"
                    )}
                    {...props}
                />
            </div>
        )

        if (!label && !showValue) return slider

        return (
            <div className="flex w-full flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                    {label ? (
                        <label htmlFor={controlId} className="font-medium leading-none text-foreground">
                            {label}
                        </label>
                    ) : <span />}
                    {showValue ? (
                        <output htmlFor={controlId} className="font-semibold tabular-nums text-foreground">
                            {valueText ?? current}
                        </output>
                    ) : null}
                </div>
                {slider}
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
