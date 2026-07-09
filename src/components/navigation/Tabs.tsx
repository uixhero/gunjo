"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../../lib/utils"

const Tabs = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Root
        ref={ref}
        className={cn(
            "flex flex-col w-full max-w-full rounded-lg border",
            // Vertical orientation lays out as a real left rail + content (no
            // bordered card, no horizontal list) without consumer className
            // surgery. Radix sets data-orientation on the root/list/triggers. (#165)
            "data-[orientation=vertical]:flex-row data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-4 data-[orientation=vertical]:rounded-none data-[orientation=vertical]:border-0",
            className
        )}
        {...props}
    />
))
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            // Horizontal: scroll-x instead of clipping when triggers (esp. CJK labels) exceed the
            // width — never truncate a tab. justify-start so the first tab stays reachable when scrolling.
            "inline-flex min-h-12 max-w-full items-center justify-start overflow-x-auto overflow-y-hidden rounded-md bg-muted p-1.5 text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center",
            "data-[orientation=vertical]:min-h-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:justify-start data-[orientation=vertical]:gap-1 data-[orientation=vertical]:overflow-visible data-[orientation=vertical]:rounded-lg data-[orientation=vertical]:bg-transparent data-[orientation=vertical]:p-0 data-[orientation=vertical]:sm:w-48",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all data-[state=inactive]:hover:bg-background/60 data-[state=inactive]:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
