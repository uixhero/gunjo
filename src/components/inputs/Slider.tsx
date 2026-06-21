"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue"> {
    value?: number | string
    defaultValue?: number | string
    onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, onChange, onValueChange, ...props }, ref) => (
        <div
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                className
            )}
            data-slot="slider"
        >
            <input
                type="range"
                ref={ref}
                onChange={(event) => {
                    onChange?.(event)
                    onValueChange?.(Number(event.currentTarget.value))
                }}
                className={cn(
                    "h-5 w-full cursor-pointer appearance-none rounded-[10px] bg-input disabled:cursor-not-allowed disabled:opacity-50",
                    "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:focus-visible:outline-none [&::-webkit-slider-thumb]:focus-visible:ring-1 [&::-webkit-slider-thumb]:focus-visible:ring-ring [&::-webkit-slider-thumb]:focus-visible:ring-offset-1 [&::-webkit-slider-thumb]:focus-visible:ring-offset-background [&::-webkit-slider-thumb]:disabled:pointer-events-none [&::-webkit-slider-thumb]:disabled:opacity-50"
                )}
                {...props}
            />
        </div>
    )
)
Slider.displayName = "Slider"

export { Slider }
