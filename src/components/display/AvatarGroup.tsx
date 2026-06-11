"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover"
import { Avatar, AvatarFallback } from "./Avatar"

type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverContent>

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Maximum avatars to show before collapsing into a +N indicator. */
    max?: number
    /** Pixel overlap between avatars (negative margin). Default 8. */
    overlap?: number
    /** Size class applied to each Avatar. */
    avatarClassName?: string
    /** Tooltip content shown on the +N overflow avatar. */
    overflowTooltip?: React.ReactNode
    /** Popover content opened when the +N overflow avatar is clicked. */
    overflowContent?: React.ReactNode
    /** Accessible label for the clickable +N overflow avatar. */
    overflowAriaLabel?: string
    /** Class applied to the +N overflow popover content. */
    overflowContentClassName?: string
    /** Portal container for the +N overflow popover. */
    overflowPortalContainer?: HTMLElement | null
    /** Side used by the +N overflow popover. */
    overflowContentSide?: PopoverContentProps["side"]
    /** Alignment used by the +N overflow popover. */
    overflowContentAlign?: PopoverContentProps["align"]
    /** Offset used by the +N overflow popover. */
    overflowContentSideOffset?: PopoverContentProps["sideOffset"]
    /** Whether the +N overflow popover may flip to avoid viewport collisions. */
    overflowContentAvoidCollisions?: PopoverContentProps["avoidCollisions"]
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
    (
        {
            className,
            max,
            overlap = 8,
            avatarClassName,
            overflowTooltip,
            overflowContent,
            overflowAriaLabel,
            overflowContentClassName,
            overflowPortalContainer,
            overflowContentSide = "bottom",
            overflowContentAlign = "end",
            overflowContentSideOffset = 8,
            overflowContentAvoidCollisions,
            children,
            ...props
        },
        ref
    ) => {
        const items = React.Children.toArray(children).filter(React.isValidElement)
        const visible = max !== undefined ? items.slice(0, max) : items
        const overflow = max !== undefined ? items.length - visible.length : 0
        const overflowAvatar = (
            <Avatar
                className={cn(
                    "ring-2 ring-background bg-muted",
                    avatarClassName
                )}
                tooltip={overflowTooltip}
            >
                <AvatarFallback className="text-xs font-medium">
                    +{overflow}
                </AvatarFallback>
            </Avatar>
        )

        return (
            <div
                ref={ref}
                className={cn("flex items-center", className)}
                {...props}
            >
                {visible.map((child, idx) => {
                    const isFirst = idx === 0
                    return (
                        <div
                            key={idx}
                            style={isFirst ? undefined : { marginLeft: -overlap }}
                            className={cn(
                                "rounded-full ring-2 ring-background",
                                avatarClassName
                            )}
                        >
                            {child}
                        </div>
                    )
                })}
                {overflow > 0 && overflowContent ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                style={{ marginLeft: -overlap }}
                                className="inline-flex shrink-0 rounded-full border-0 bg-transparent p-0 text-inherit outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={overflowAriaLabel ?? `Show ${overflow} more avatars`}
                            >
                                {overflowAvatar}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            align={overflowContentAlign}
                            side={overflowContentSide}
                            sideOffset={overflowContentSideOffset}
                            avoidCollisions={overflowContentAvoidCollisions}
                            className={cn("w-72 p-0", overflowContentClassName)}
                            portalContainer={overflowPortalContainer}
                        >
                            {overflowContent}
                        </PopoverContent>
                    </Popover>
                ) : overflow > 0 ? (
                    <div style={{ marginLeft: -overlap }}>
                        {overflowAvatar}
                    </div>
                ) : null}
            </div>
        )
    }
)
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
