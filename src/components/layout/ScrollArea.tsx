"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "../../lib/utils"

export interface ScrollAreaProps
    extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    viewportClassName?: string
    scrollbarClassName?: string
    thumbClassName?: string
    scrollbarOrientation?: "vertical" | "horizontal" | "both"
}

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    ScrollAreaProps
>(({ className, viewportClassName, scrollbarClassName, thumbClassName, scrollbarOrientation = "vertical", children, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden flex min-h-0 min-w-0 flex-col", className)}
        {...props}
    >
        <ScrollAreaPrimitive.Viewport
            className={cn(
                "h-full w-full rounded-[inherit] [&>div]:!block [&>div]:!min-w-0 [&>div]:!w-full",
                viewportClassName
            )}
        >
            {children}
        </ScrollAreaPrimitive.Viewport>
        {(scrollbarOrientation === "vertical" || scrollbarOrientation === "both") && (
            <ScrollBar className={scrollbarClassName} thumbClassName={thumbClassName} />
        )}
        {(scrollbarOrientation === "horizontal" || scrollbarOrientation === "both") && (
            <ScrollBar orientation="horizontal" className={scrollbarClassName} thumbClassName={thumbClassName} />
        )}
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export interface ScrollBarProps
    extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
    thumbClassName?: string
}

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
    ScrollBarProps
>(({ className, thumbClassName, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.Scrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
            "flex touch-none select-none transition-colors",
            orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent p-[1px]",
            orientation === "horizontal" &&
            "h-2.5 border-t border-t-transparent p-[1px]",
            className
        )}
        {...props}
    >
        <ScrollAreaPrimitive.Thumb className={cn("relative flex-1 rounded-full bg-border", thumbClassName)} />
    </ScrollAreaPrimitive.Scrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName

export { ScrollArea, ScrollBar }
