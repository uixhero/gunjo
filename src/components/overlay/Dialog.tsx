"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { useLocale } from "../utility/LocaleProvider"
import { useDialogDescribedBy, useRegisterDialogDescription } from "./dialog-a11y"

// True when a direct child has the given displayName. Used to opt DialogContent
// into a managed-scroll flex column *only* when a DialogBody is present, so
// existing dialogs (no DialogBody) render byte-identically. (#293)
function hasChildOfType(children: React.ReactNode, displayName: string): boolean {
    return React.Children.toArray(children).some(
        (child) =>
            React.isValidElement(child) &&
            (child.type as { displayName?: string })?.displayName === displayName
    )
}

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-overlay/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        portalContainer?: HTMLElement | null
        overlayClassName?: string
        showCloseButton?: boolean
        closeLabel?: string
    }
>(({ className, children, portalContainer, overlayClassName, showCloseButton = true, closeLabel, ...props }, ref) => {
    const { strings } = useLocale()
    const { describedByProps, register, DescriptionProvider } = useDialogDescribedBy(
        "aria-describedby" in props
    )
    // When a DialogBody is present, switch from the default `grid` to a bounded
    // flex column (`flex` overrides `grid` via tailwind-merge) so the body
    // scrolls within a max height instead of the dialog overflowing the
    // viewport. Existing dialogs (no DialogBody) are unchanged. (#293)
    const hasBody = hasChildOfType(children, "DialogBody")
    return (
    <DialogPortal container={portalContainer ?? undefined}>
        <DialogOverlay className={cn(portalContainer && "absolute", overlayClassName)} />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-1/2 top-1/2 z-50 grid w-[512px] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg",
                hasBody && "flex flex-col max-h-[calc(100dvh-2rem)]",
                portalContainer && "absolute w-[calc(100%-2rem)] max-w-[calc(100%-2rem)]",
                className
            )}
            {...props}
            {...describedByProps}
        >
            <DescriptionProvider value={register}>
                {children}
                {showCloseButton ? (
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">{closeLabel ?? strings.close}</span>
                    </DialogPrimitive.Close>
                ) : null}
            </DescriptionProvider>
        </DialogPrimitive.Content>
    </DialogPortal>
    )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 pr-4 text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

// Scrollable body region for long forms. Placed as a direct child of
// DialogContent (between DialogHeader and DialogFooter), it flexes to fill the
// bounded height and scrolls its own overflow while header/footer stay pinned.
// Its presence switches DialogContent to a bounded flex column. (#293)
const DialogBody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex-1 min-h-0 overflow-y-auto", className)} {...props} />
)
DialogBody.displayName = "DialogBody"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-tight tracking-tight",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
    useRegisterDialogDescription()
    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
})
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogBody,
    DialogTitle,
    DialogDescription,
}
