"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

type TooltipProviderOptions = Pick<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
    "delayDuration" | "skipDelayDuration" | "disableHoverableContent"
>

type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> &
    TooltipProviderOptions & {
        /**
         * Opens the tooltip for a short time on touch/pen press.
         * This keeps disabled reasons and icon-only feedback available on mobile.
         */
        openOnPress?: boolean
        pressOpenDuration?: number
    }

type TooltipInteractionContextValue = {
    openFromPress: () => void
}

const TooltipInteractionContext = React.createContext<TooltipInteractionContextValue | null>(null)

const Tooltip = ({
    children,
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    skipDelayDuration,
    disableHoverableContent,
    openOnPress = true,
    pressOpenDuration = 2200,
    ...props
}: TooltipProps) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
    const closeTimerRef = React.useRef<number | null>(null)
    const isControlled = open !== undefined
    const resolvedOpen = isControlled ? open : internalOpen

    React.useEffect(() => {
        return () => {
            if (closeTimerRef.current !== null) {
                window.clearTimeout(closeTimerRef.current)
            }
        }
    }, [])

    const setOpen = React.useCallback(
        (nextOpen: boolean) => {
            if (!isControlled) {
                setInternalOpen(nextOpen)
            }
            onOpenChange?.(nextOpen)
        },
        [isControlled, onOpenChange]
    )

    const openFromPress = React.useCallback(() => {
        if (!openOnPress) return

        if (closeTimerRef.current !== null) {
            window.clearTimeout(closeTimerRef.current)
        }

        setOpen(true)
        closeTimerRef.current = window.setTimeout(() => {
            setOpen(false)
            closeTimerRef.current = null
        }, pressOpenDuration)
    }, [openOnPress, pressOpenDuration, setOpen])

    const contextValue = React.useMemo(() => ({ openFromPress }), [openFromPress])

    return (
        <TooltipPrimitive.Provider
            delayDuration={delayDuration}
            skipDelayDuration={skipDelayDuration}
            disableHoverableContent={disableHoverableContent}
        >
            <TooltipInteractionContext.Provider value={contextValue}>
                <TooltipPrimitive.Root
                    open={resolvedOpen}
                    onOpenChange={setOpen}
                    {...props}
                >
                    {children}
                </TooltipPrimitive.Root>
            </TooltipInteractionContext.Provider>
        </TooltipPrimitive.Provider>
    )
}

const TooltipTrigger = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onPointerDown, ...props }, ref) => {
    const interaction = React.useContext(TooltipInteractionContext)

    return (
        <TooltipPrimitive.Trigger
            ref={ref}
            onPointerDown={(event) => {
                onPointerDown?.(event)
                if (event.defaultPrevented) return
                if (event.pointerType === "touch" || event.pointerType === "pen") {
                    interaction?.openFromPress()
                }
            }}
            {...props}
        />
    )
})
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    portalContainer?: HTMLElement | null
}

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    TooltipContentProps
>(({ className, sideOffset = 4, portalContainer, ...props }, ref) => (
    <TooltipPrimitive.Portal container={portalContainer ?? undefined}>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "pointer-events-none z-50 w-fit max-w-xs overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-center text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
