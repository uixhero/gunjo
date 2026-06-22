"use client"

import * as React from "react"
import {
    IconChevronDown as ChevronDown,
    IconChevronUp as ChevronUp,
    IconMinus as Minus,
    IconPlus as Plus,
} from "@tabler/icons-react";

import { cn } from "../../lib/utils"

export interface NumberInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
    value?: number
    onValueChange?: (value: number) => void
    min?: number
    max?: number
    step?: number
    incrementLabel?: string
    decrementLabel?: string
    /**
     * `"spinner"` (default) renders the conventional input with stacked up/down
     * chevrons. `"stepper"` renders a horizontal `− [value] +` control, the
     * layout commerce quantity pickers expect. The native `<input type=number>`
     * keeps its spinbutton semantics in both layouts. (#169)
     */
    layout?: "spinner" | "stepper"
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            className,
            value,
            onValueChange,
            min,
            max,
            step = 1,
            incrementLabel = "Increment",
            decrementLabel = "Decrement",
            layout = "spinner",
            disabled,
            ...props
        },
        ref
    ) => {
        const clamp = React.useCallback(
            (next: number) => {
                let result = next
                if (min !== undefined) result = Math.max(min, result)
                if (max !== undefined) result = Math.min(max, result)
                return result
            },
            [min, max]
        )

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const raw = event.target.value
            if (raw === "" || raw === "-") return
            const parsed = Number(raw)
            if (Number.isNaN(parsed)) return
            onValueChange?.(clamp(parsed))
        }

        const adjust = (delta: number) => {
            const current = value ?? 0
            onValueChange?.(clamp(current + delta))
        }

        const atMax = max !== undefined && (value ?? 0) >= max
        const atMin = min !== undefined && (value ?? 0) <= min

        if (layout === "stepper") {
            return (
                <div
                    className={cn(
                        "inline-flex items-center rounded-md border border-input bg-transparent shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                        disabled && "opacity-50 pointer-events-none",
                        className
                    )}
                    data-slot="number-input"
                    data-layout="stepper"
                >
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => adjust(-step)}
                        disabled={disabled || atMin}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-l-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                        aria-label={decrementLabel}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <input
                        ref={ref}
                        type="number"
                        inputMode={step % 1 === 0 ? "numeric" : "decimal"}
                        value={value ?? ""}
                        onChange={handleChange}
                        disabled={disabled}
                        min={min}
                        max={max}
                        step={step}
                        className="h-9 w-12 border-x border-input bg-transparent px-1 py-1 text-center text-sm placeholder:text-muted-foreground focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        {...props}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => adjust(step)}
                        disabled={disabled || atMax}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-r-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                        aria-label={incrementLabel}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            )
        }

        return (
            <div
                className={cn(
                    "inline-flex items-center rounded-md border border-input bg-transparent shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                    disabled && "opacity-50 pointer-events-none",
                    className
                )}
                data-slot="number-input"
            >
                <input
                    ref={ref}
                    type="number"
                    inputMode={step % 1 === 0 ? "numeric" : "decimal"}
                    value={value ?? ""}
                    onChange={handleChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    className="h-9 w-full rounded-l-md bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...props}
                />
                <div className="flex flex-col border-l border-input">
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => adjust(step)}
                        disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
                        className="flex h-[18px] w-7 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
                        aria-label={incrementLabel}
                    >
                        <ChevronUp className="h-3 w-3" />
                    </button>
                    <div className="h-px bg-input" />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => adjust(-step)}
                        disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
                        className="flex h-[18px] w-7 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-50"
                        aria-label={decrementLabel}
                    >
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </div>
            </div>
        )
    }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
