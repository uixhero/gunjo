"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "../../lib/utils"
import { useDialogDescribedBy, useRegisterDialogDescription } from "./dialog-a11y"

type DrawerSide = "bottom" | "right" | "left" | "top"

/**
 * The Root `direction`, shared with `DrawerContent` so its `side` styling and
 * vaul's drag layer come from **one** source of truth. Setting `side` on
 * `DrawerContent` alone restyles the panel but leaves vaul's drag layer oriented
 * for `bottom`, which silently intercepts pointer events on side panels. (#335)
 */
const DrawerDirectionContext = React.createContext<DrawerSide>("bottom")

/** Dev-only: warn once per side/direction mismatch, not on every render. (#335) */
const warnedDrawerSideMismatch = new Set<string>()

/**
 * A bottom sheet with drag-to-dismiss (vaul). For a `left`/`right`/`top` panel,
 * set `direction` here (it drives both the styling and the drag layer) — do
 * **not** set `side` on `DrawerContent` alone, or pointer events on children
 * break. For a plain side panel with no drag gesture, prefer `Sheet`.
 */
const Drawer = ({
    shouldScaleBackground = true,
    direction = "bottom",
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
    <DrawerDirectionContext.Provider value={direction as DrawerSide}>
        <DrawerPrimitive.Root
            shouldScaleBackground={shouldScaleBackground}
            direction={direction}
            {...props}
        />
    </DrawerDirectionContext.Provider>
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-overlay/80", className)}
        {...props}
    />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const drawerContentSideClasses: Record<DrawerSide, string> = {
    bottom: "inset-x-0 bottom-0 mt-24 h-auto rounded-t-[10px] border",
    right: "inset-y-0 right-0 h-full w-80 max-w-[calc(100%_-_2rem)] rounded-l-[10px] border-l",
    left: "inset-y-0 left-0 h-full w-80 max-w-[calc(100%_-_2rem)] rounded-r-[10px] border-r",
    top: "inset-x-0 top-0 mb-24 h-auto rounded-b-[10px] border",
}

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
        side?: DrawerSide
        portalContainer?: HTMLElement | null
        overlayClassName?: string
    }
>(({ className, children, side, portalContainer, overlayClassName, ...props }, ref) => {
    const rootDirection = React.useContext(DrawerDirectionContext)
    // Single source of truth: fall back to the Root `direction`. An explicit
    // `side` that disagrees with the Root is the silent-break case — vaul's drag
    // layer follows the Root, so children stop receiving pointer events. (#335)
    const resolvedSide = side ?? rootDirection
    if (process.env.NODE_ENV !== "production" && side && side !== rootDirection) {
        const key = `${side}:${rootDirection}`
        if (!warnedDrawerSideMismatch.has(key)) {
            warnedDrawerSideMismatch.add(key)
            console.warn(
                `[gunjo] <DrawerContent side="${side}"> doesn't match <Drawer direction="${rootDirection}">. ` +
                    `vaul's drag layer follows the Root direction, so pointer events on children can silently break. ` +
                    `Set direction="${side}" on <Drawer> (it drives both), or use <Sheet> for a plain side panel.`
            )
        }
    }
    const { describedByProps, register, DescriptionProvider } = useDialogDescribedBy(
        "aria-describedby" in props
    )
    return (
        <DrawerPortal container={portalContainer ?? undefined}>
            <DrawerOverlay className={cn(portalContainer && "absolute", overlayClassName)} />
            <DrawerPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 flex flex-col bg-background",
                    portalContainer && "absolute",
                    drawerContentSideClasses[resolvedSide],
                    className
                )}
                {...props}
                {...describedByProps}
            >
                <DescriptionProvider value={register}>
                    {resolvedSide === "bottom" ? <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" /> : null}
                    {children}
                </DescriptionProvider>
            </DrawerPrimitive.Content>
        </DrawerPortal>
    )
})
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("grid gap-1.5 p-4 text-left", className)}
        {...props}
    />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("mt-auto flex flex-row flex-wrap justify-end gap-2 p-4", className)}
        {...props}
    />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => {
    useRegisterDialogDescription()
    return (
        <DrawerPrimitive.Description
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
})
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
}
