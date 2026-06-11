"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import type { AvatarVariantKey } from "./generated/variant-keys"
import { avatarDefaultVariantKey } from "./generated/default-variant-keys"

export type AvatarPresence = "online" | "away" | "busy" | "offline"
type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipContent>

export interface AvatarProps
    extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
    tooltip?: React.ReactNode
    tooltipSide?: TooltipContentProps["side"]
    tooltipAlign?: TooltipContentProps["align"]
    tooltipPortalContainer?: TooltipContentProps["portalContainer"]
    tooltipContentClassName?: string
    presence?: AvatarPresence
    presenceLabel?: React.ReactNode
}

const avatarSlotClasses: Record<AvatarVariantKey, string> = {
    fallback: "flex h-full w-full items-center justify-center rounded-full bg-secondary text-sm font-medium text-muted-foreground",
    image: "aspect-square h-full w-full rounded-full object-cover",
}

const avatarPresenceClasses: Record<AvatarPresence, string> = {
    online: "bg-success",
    away: "bg-warning",
    busy: "bg-destructive",
    offline: "bg-muted-foreground",
}

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarProps
>(
    (
        {
            className,
            children,
            tooltip,
            tooltipSide,
            tooltipAlign,
            tooltipPortalContainer,
            tooltipContentClassName,
            presence,
            presenceLabel,
            ...props
        },
        ref
    ) => {
        const root = (
            <AvatarPrimitive.Root
                ref={ref}
                className={cn(
                    "relative inline-flex h-10 w-10 shrink-0 items-center rounded-full",
                    className
                )}
                {...props}
            >
                {children}
                {presence ? (
                    <span
                        className={cn(
                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                            avatarPresenceClasses[presence]
                        )}
                        aria-label={typeof presenceLabel === "string" ? presenceLabel : undefined}
                        aria-hidden={presenceLabel ? undefined : true}
                    />
                ) : null}
            </AvatarPrimitive.Root>
        )

        if (!tooltip) {
            return root
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>{root}</TooltipTrigger>
                <TooltipContent
                    side={tooltipSide}
                    align={tooltipAlign}
                    portalContainer={tooltipPortalContainer}
                    className={tooltipContentClassName}
                >
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        )
    }
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn(avatarSlotClasses.image, className)}
        {...props}
    />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            avatarSlotClasses[avatarDefaultVariantKey],
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
