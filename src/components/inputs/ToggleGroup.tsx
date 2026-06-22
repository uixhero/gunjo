"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "../../lib/utils"
import type { ToggleGroupVariantKey } from "./generated/variant-keys"
import { toggleGroupDefaultVariantKey } from "./generated/default-variant-keys"

const toggleGroupVariantClasses: Record<ToggleGroupVariantKey, string> = {
    default: "bg-secondary text-foreground hover:bg-muted hover:text-muted-foreground",
    outline: "border border-input bg-transparent text-foreground hover:bg-muted",
}

type ToggleGroupSize = "default" | "sm" | "lg"

// Lets `variant`/`size` be set once on the root and inherited by every item
// (each item can still override). Mirrors the conventional segmented-control API.
const ToggleGroupContext = React.createContext<{
    variant?: ToggleGroupVariantKey
    size?: ToggleGroupSize
}>({})

const ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
        variant?: ToggleGroupVariantKey
        size?: ToggleGroupSize
        /**
         * When set, clicking the active item no longer clears the selection —
         * Radix's empty value (`""` for single, `[]` for multiple) is ignored.
         * Use for segmented controls that must always keep one choice
         * (e.g. size / color variant pickers). (#170)
         */
        disallowEmpty?: boolean
    }
>(({ className, children, variant, size, disallowEmpty, onValueChange, ...props }, ref) => {
    const handleValueChange = React.useCallback(
        (next: string | string[]) => {
            if (disallowEmpty && (next === "" || (Array.isArray(next) && next.length === 0))) return
            // Radix narrows onValueChange by `type`; forward the raw value.
            ;(onValueChange as ((value: string | string[]) => void) | undefined)?.(next)
        },
        [disallowEmpty, onValueChange]
    )

    return (
        <ToggleGroupPrimitive.Root
            ref={ref}
            className={cn("flex items-center justify-center gap-1", className)}
            onValueChange={onValueChange ? (handleValueChange as never) : undefined}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ variant, size }}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    )
})

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
        variant?: ToggleGroupVariantKey
        size?: ToggleGroupSize
    }
>(({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    const resolvedVariant = variant ?? context.variant ?? toggleGroupDefaultVariantKey
    const resolvedSize = size ?? context.size ?? "default"

    return (
        <ToggleGroupPrimitive.Item
            ref={ref}
            className={cn(
                "inline-flex w-fit items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border disabled:border-input disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-100 data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground disabled:data-[state=on]:!bg-primary-subtle disabled:data-[state=on]:!text-primary-subtle-foreground",
                // Size variants
                resolvedSize === "default" && "h-9 py-0 px-3",
                resolvedSize === "sm" && "h-8 px-2",
                resolvedSize === "lg" && "h-10 px-3",
                toggleGroupVariantClasses[resolvedVariant],
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
