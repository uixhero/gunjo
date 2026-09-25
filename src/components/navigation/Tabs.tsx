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
            // 平常時は外枠を見せない（#1029）。中の TabsList（bg-muted）と
            // TabsContent が面なので、塗りの無い root に線を引くと区切りが二重に
            // なる。ハイコントラストでは他の面と同じく枠が戻る（幅は常に 1px）。
            "flex flex-col w-full max-w-full rounded-lg border border-transparent contrast-more:border-border forced-colors:border-[CanvasText]",
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
            // タブの中の数（Badge secondary 等）は bg-card に上げる。選ばれていない
            // タブの下は TabsList の bg-muted で、dark は --secondary = --muted＝
            // 1.000:1 で消える。bg-card なら muted の上 1.306 / 1.139、選ばれた
            // タブ（bg-background）の上 1.098 / 1.202 で両方と分かれる（#1029）。
            "[&_.bg-secondary]:bg-card",
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
