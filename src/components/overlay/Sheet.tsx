"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps, cva } from "class-variance-authority"
import { IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-overlay/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
                bottom:
                    "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
                right:
                    "inset-y-0 right-0 h-full w-[384px] w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
    portalContainer?: HTMLElement | null
    overlayClassName?: string
    closeLabel?: string
}

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(({ side = "right", className, children, portalContainer, overlayClassName, closeLabel = "Close", onOpenAutoFocus, ...props }, ref) => {
    const contentRef = React.useRef<React.ElementRef<typeof SheetPrimitive.Content> | null>(null)

    const setRefs = React.useCallback(
        (node: React.ElementRef<typeof SheetPrimitive.Content> | null) => {
            contentRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        },
        [ref]
    )

    const handleOpenAutoFocus = React.useCallback(
        (event: Event) => {
            onOpenAutoFocus?.(event)
            if (event.defaultPrevented) return

            event.preventDefault()
            requestAnimationFrame(() => {
                contentRef.current?.focus({ preventScroll: true })
            })
        },
        [onOpenAutoFocus]
    )

    return (
        <SheetPortal container={portalContainer ?? undefined}>
            <SheetOverlay className={cn(portalContainer && "absolute", overlayClassName)} />
            <SheetPrimitive.Content
                ref={setRefs}
                tabIndex={-1}
                onOpenAutoFocus={handleOpenAutoFocus}
                className={cn(
                    sheetVariants({ side }),
                    portalContainer && "absolute",
                    portalContainer && "data-[state=open]:!transform-none data-[state=closed]:!transform-none",
                    portalContainer && side === "right" && "right-0 top-0 h-full",
                    portalContainer && side === "left" && "left-0 top-0 h-full",
                    portalContainer && side === "top" && "left-0 right-0 top-0",
                    portalContainer && side === "bottom" && "bottom-0 left-0 right-0",
                    className
                )}
                {...props}
            >
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetPrimitive.Close
                                className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-muted-foreground opacity-80 ring-offset-background transition-colors hover:bg-muted hover:text-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                                aria-label={closeLabel}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">{closeLabel}</span>
                            </SheetPrimitive.Close>
                        </TooltipTrigger>
                        <TooltipContent portalContainer={portalContainer}>
                            {closeLabel}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {children}
            </SheetPrimitive.Content>
        </SheetPortal>
    )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-row flex-wrap justify-end gap-2 sm:space-x-2",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
