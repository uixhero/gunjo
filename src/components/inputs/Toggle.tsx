"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

export const toggleVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border disabled:border-input disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-100 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground disabled:data-[state=on]:!bg-primary-subtle disabled:data-[state=on]:!text-primary-subtle-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-transparent",
                outline:
                    "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-9 px-2.5 min-w-9",
                sm: "h-8 px-2 min-w-8",
                lg: "h-10 px-3 min-w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ToggleProps
    extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
        VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    ToggleProps
>(({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
    />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
