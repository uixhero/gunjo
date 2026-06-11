"use client"

import * as React from "react"
import { Button, type ButtonProps } from "./Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { cn } from "../../lib/utils"

type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipContent>

export interface TooltipButtonProps extends ButtonProps {
    tooltip: React.ReactNode
    tooltipSide?: TooltipContentProps["side"]
    tooltipAlign?: TooltipContentProps["align"]
    tooltipSideOffset?: TooltipContentProps["sideOffset"]
    tooltipContentClassName?: string
    tooltipPortalContainer?: TooltipContentProps["portalContainer"]
    tooltipOpenOnClick?: boolean
    tooltipCloseOnPress?: boolean
    tooltipClickDuration?: number
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
    (
        {
            tooltip,
            tooltipSide,
            tooltipAlign,
            tooltipSideOffset,
            tooltipContentClassName,
            tooltipPortalContainer,
            tooltipOpenOnClick = false,
            tooltipCloseOnPress = false,
            tooltipClickDuration = 1600,
            className,
            onClick,
            onBlur,
            onPointerDown,
            onPointerLeave,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const closeTimerRef = React.useRef<number | null>(null)
        const suppressHoverRef = React.useRef(false)

        React.useEffect(() => {
            return () => {
                if (closeTimerRef.current !== null) {
                    window.clearTimeout(closeTimerRef.current)
                }
            }
        }, [])

        const scheduleClose = React.useCallback(() => {
            if (closeTimerRef.current !== null) {
                window.clearTimeout(closeTimerRef.current)
            }
            closeTimerRef.current = window.setTimeout(() => {
                setOpen(false)
                closeTimerRef.current = null
            }, tooltipClickDuration)
        }, [tooltipClickDuration])

        const handleClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event)
                if (tooltipCloseOnPress && !tooltipOpenOnClick) {
                    setOpen(false)
                }
                if (!tooltipOpenOnClick || event.defaultPrevented) return
                setOpen(true)
                scheduleClose()
            },
            [onClick, scheduleClose, tooltipCloseOnPress, tooltipOpenOnClick]
        )

        const handlePointerDown = React.useCallback(
            (event: React.PointerEvent<HTMLButtonElement>) => {
                onPointerDown?.(event)
                if (!tooltipCloseOnPress || event.defaultPrevented) return
                suppressHoverRef.current = true
                setOpen(false)
            },
            [onPointerDown, tooltipCloseOnPress]
        )

        const handlePointerLeave = React.useCallback(
            (event: React.PointerEvent<HTMLButtonElement>) => {
                onPointerLeave?.(event)
                if (tooltipCloseOnPress) {
                    suppressHoverRef.current = false
                }
            },
            [onPointerLeave, tooltipCloseOnPress]
        )

        const handleBlur = React.useCallback(
            (event: React.FocusEvent<HTMLButtonElement>) => {
                onBlur?.(event)
                if (tooltipOpenOnClick) {
                    setOpen(false)
                }
            },
            [onBlur, tooltipOpenOnClick]
        )

        const handleOpenChange = React.useCallback(
            (nextOpen: boolean) => {
                if (tooltipCloseOnPress && suppressHoverRef.current && nextOpen) return
                setOpen(nextOpen)
            },
            [tooltipCloseOnPress]
        )

        const tooltipRootProps = tooltipOpenOnClick || tooltipCloseOnPress
            ? { open, onOpenChange: handleOpenChange }
            : undefined

        return (
            <Tooltip {...tooltipRootProps} openOnPress={!tooltipCloseOnPress}>
                <TooltipTrigger asChild>
                    <Button
                        ref={ref}
                        className={cn(className)}
                        onClick={handleClick}
                        onBlur={handleBlur}
                        onPointerDown={handlePointerDown}
                        onPointerLeave={handlePointerLeave}
                        {...props}
                    />
                </TooltipTrigger>
                <TooltipContent
                    side={tooltipSide}
                    align={tooltipAlign}
                    sideOffset={tooltipSideOffset}
                    portalContainer={tooltipPortalContainer}
                    className={tooltipContentClassName}
                >
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        )
    }
)
TooltipButton.displayName = "TooltipButton"

export { TooltipButton }
