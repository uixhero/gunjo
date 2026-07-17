"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps, cva } from "class-variance-authority"
import { IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip"
import { useLocale } from "../utility/LocaleProvider"
import { useDialogDescribedBy, useRegisterDialogDescription } from "./dialog-a11y"

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
                left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
                right:
                    "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            },
            // Desktop max-width of a left/right drawer. Default `sm` matches the
            // previous fixed width; go wider for dense drill-in content. No effect
            // on top/bottom sheets. (#328)
            size: {
                sm: "",
                md: "",
                lg: "",
                xl: "",
                full: "",
            },
        },
        compoundVariants: [
            { side: ["left", "right"], size: "sm", class: "sm:max-w-sm" },
            { side: ["left", "right"], size: "md", class: "sm:max-w-md" },
            { side: ["left", "right"], size: "lg", class: "sm:max-w-lg" },
            { side: ["left", "right"], size: "xl", class: "sm:max-w-xl" },
            { side: ["left", "right"], size: "full", class: "w-full sm:max-w-none" },
        ],
        defaultVariants: {
            side: "right",
            size: "sm",
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

// True when a direct child has the given displayName. Used to opt SheetContent
// into a managed-scroll flex column *only* when a SheetBody is present, so
// existing sheets (no SheetBody) render byte-identically. (#293)
function hasChildOfType(children: React.ReactNode, displayName: string): boolean {
    return React.Children.toArray(children).some(
        (child) =>
            React.isValidElement(child) &&
            (child.type as { displayName?: string })?.displayName === displayName
    )
}

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(({ side = "right", size, className, children, portalContainer, overlayClassName, closeLabel, onOpenAutoFocus, ...props }, ref) => {
    const { strings } = useLocale()
    // When a SheetBody is present, lay the content out as a flex column so the
    // body can flex-1/scroll between a pinned header and footer. Left/right
    // sheets are already `h-full`, which bounds the scroll. (#293)
    const hasBody = hasChildOfType(children, "SheetBody")
    const resolvedCloseLabel = closeLabel ?? strings.close
    const { describedByProps, register, DescriptionProvider } = useDialogDescribedBy(
        "aria-describedby" in props
    )
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
                    sheetVariants({ side, size }),
                    hasBody && "flex flex-col",
                    portalContainer && "absolute",
                    portalContainer && "data-[state=open]:!transform-none data-[state=closed]:!transform-none",
                    portalContainer && side === "right" && "right-0 top-0 h-full",
                    portalContainer && side === "left" && "left-0 top-0 h-full",
                    portalContainer && side === "top" && "left-0 right-0 top-0",
                    portalContainer && side === "bottom" && "bottom-0 left-0 right-0",
                    className
                )}
                {...props}
                {...describedByProps}
            >
                <DescriptionProvider value={register}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SheetPrimitive.Close
                                    className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-muted-foreground opacity-80 ring-offset-background transition-colors hover:bg-muted hover:text-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                                    aria-label={resolvedCloseLabel}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">{resolvedCloseLabel}</span>
                                </SheetPrimitive.Close>
                            </TooltipTrigger>
                            <TooltipContent portalContainer={portalContainer}>
                                {resolvedCloseLabel}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {children}
                </DescriptionProvider>
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

// Scrollable body region for long forms. Placed as a direct child of
// SheetContent (between SheetHeader and SheetFooter), it flexes to fill the
// remaining height and scrolls its own overflow while header/footer stay
// pinned. Works in left/right sheets (which are `h-full`). (#293)
const SheetBody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex-1 min-h-0 overflow-y-auto", className)} {...props} />
)
SheetBody.displayName = "SheetBody"

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
>(({ className, ...props }, ref) => {
    useRegisterDialogDescription()
    return (
        <SheetPrimitive.Description
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
})
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
    SheetBody,
    SheetTitle,
    SheetDescription,
}
