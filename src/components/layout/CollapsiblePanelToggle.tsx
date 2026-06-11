"use client"

import * as React from "react"
import { IconLayoutBottombarCollapse as PanelBottomClose, IconLayoutBottombarExpand as PanelBottomOpen, IconLayoutSidebarLeftCollapse as PanelLeftClose, IconLayoutSidebarLeftExpand as PanelLeftOpen, IconLayoutSidebarRightCollapse as PanelRightClose, IconLayoutSidebarRightExpand as PanelRightOpen, IconLayoutNavbarCollapse as PanelTopClose, IconLayoutNavbarExpand as PanelTopOpen } from "@tabler/icons-react";
import { TooltipButton, type TooltipButtonProps } from "../inputs/TooltipButton"
import { cn } from "../../lib/utils"
import type { CollapsiblePanelToggleVariantKey } from "./generated/variant-keys"
import { collapsiblePanelToggleDefaultVariantKey } from "./generated/default-variant-keys"

export type CollapsiblePanelToggleSide = CollapsiblePanelToggleVariantKey

export interface CollapsiblePanelToggleProps
    extends Omit<TooltipButtonProps, "children" | "tooltip" | "tooltipSide"> {
    side?: CollapsiblePanelToggleSide
    collapsed: boolean
    openLabel?: string
    closeLabel?: string
    tooltip?: React.ReactNode
    iconClassName?: string
}

const iconBySide: Record<CollapsiblePanelToggleVariantKey, {
    open: React.ComponentType<React.SVGProps<SVGSVGElement>>
    close: React.ComponentType<React.SVGProps<SVGSVGElement>>
    tooltipSide: "top" | "right" | "bottom" | "left"
}> = {
    left: {
        open: PanelLeftOpen,
        close: PanelLeftClose,
        tooltipSide: "right",
    },
    right: {
        open: PanelRightOpen,
        close: PanelRightClose,
        tooltipSide: "left",
    },
    top: {
        open: PanelTopOpen,
        close: PanelTopClose,
        tooltipSide: "bottom",
    },
    bottom: {
        open: PanelBottomOpen,
        close: PanelBottomClose,
        tooltipSide: "top",
    },
} as const

const CollapsiblePanelToggle = React.forwardRef<
    HTMLButtonElement,
    CollapsiblePanelToggleProps
>(
    (
        {
            side = collapsiblePanelToggleDefaultVariantKey,
            collapsed,
            openLabel = "Open panel",
            closeLabel = "Close panel",
            tooltip,
            iconClassName,
            className,
            "aria-label": ariaLabel,
            ...props
        },
        ref
    ) => {
        const config = iconBySide[side]
        const Icon = collapsed ? config.open : config.close
        const label = collapsed ? openLabel : closeLabel

        return (
            <TooltipButton
                ref={ref}
                type="button"
                variant="outline"
                size="icon"
                aria-label={ariaLabel ?? label}
                tooltip={tooltip ?? label}
                tooltipSide={config.tooltipSide}
                tooltipCloseOnPress
                className={cn(
                    "h-10 w-10 rounded-full border-border bg-background text-muted-foreground shadow-md ring-1 ring-border/70 transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-background hover:text-foreground motion-reduce:transition-none",
                    className
                )}
                {...props}
            >
                <Icon className={cn("h-5 w-5", iconClassName)} aria-hidden="true" />
            </TooltipButton>
        )
    }
)
CollapsiblePanelToggle.displayName = "CollapsiblePanelToggle"

export { CollapsiblePanelToggle }
