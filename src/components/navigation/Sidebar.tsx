"use client"

import * as React from "react"
import {
    IconChevronLeft as ChevronLeft,
    IconChevronRight as ChevronRight,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { TooltipButton, type TooltipButtonProps } from "../inputs/TooltipButton"

interface SidebarContextValue {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
    toggleCollapsed: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
    const ctx = React.useContext(SidebarContext)
    if (!ctx)
        throw new Error("useSidebar must be used within <SidebarProvider>")
    return ctx
}

export interface SidebarProviderProps {
    defaultCollapsed?: boolean
    collapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    children: React.ReactNode
}

const SidebarProvider = ({
    defaultCollapsed = false,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    children,
}: SidebarProviderProps) => {
    const [internalCollapsed, setInternalCollapsed] =
        React.useState(defaultCollapsed)
    const isControlled = controlledCollapsed !== undefined
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed

    const setCollapsed = React.useCallback(
        (value: boolean) => {
            if (!isControlled) setInternalCollapsed(value)
            onCollapsedChange?.(value)
        },
        [isControlled, onCollapsedChange]
    )

    const toggleCollapsed = React.useCallback(
        () => setCollapsed(!collapsed),
        [collapsed, setCollapsed]
    )

    const value = React.useMemo(
        () => ({ collapsed, setCollapsed, toggleCollapsed }),
        [collapsed, setCollapsed, toggleCollapsed]
    )

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
    const { collapsed } = useSidebar()
    return (
        <aside
            ref={ref}
            data-collapsed={collapsed}
            className={cn(
                "relative flex h-full flex-col overflow-visible border-r bg-muted/40 transition-[width] duration-200",
                collapsed ? "w-[60px]" : "w-[240px]",
                className
            )}
            {...props}
        />
    )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center gap-2 border-b bg-background px-4 py-3",
            className
        )}
        {...props}
    />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarBody = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex-1 overflow-y-auto flex flex-col gap-0.5 p-2",
            // Scrollbar UX: hide by default, reveal a thin, track-less
            // thumb only while the cursor is inside the sidebar. Firefox
            // uses `scrollbar-width` / `scrollbar-color`; WebKit uses
            // ::-webkit-scrollbar pseudo-elements. Consumers can override
            // by passing their own scrollbar utilities through className.
            "[scrollbar-width:none] hover:[scrollbar-width:thin]",
            "[scrollbar-color:transparent_transparent] hover:[scrollbar-color:hsl(var(--border))_transparent]",
            "[&::-webkit-scrollbar]:w-0 hover:[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-border/60",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            className
        )}
        {...props}
    />
))
SidebarBody.displayName = "SidebarBody"

const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center gap-2 border-t bg-background px-4 py-3",
            className
        )}
        {...props}
    />
))
SidebarFooter.displayName = "SidebarFooter"

export interface SidebarToggleProps
    extends Omit<TooltipButtonProps, "children" | "tooltip" | "onClick"> {
    expandLabel?: React.ReactNode
    collapseLabel?: React.ReactNode
    placement?: "center" | "header" | "footer"
}

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
    (
        {
            className,
            expandLabel = "Expand sidebar",
            collapseLabel = "Collapse sidebar",
            placement = "footer",
            tooltipSide = "right",
            tooltipAlign = "center",
            tooltipSideOffset = 8,
            ...props
        },
        ref
    ) => {
        const { collapsed, toggleCollapsed } = useSidebar()
        const label = collapsed ? expandLabel : collapseLabel
        const placementClass = {
            center: "top-1/2 -translate-y-1/2",
            header: "top-[52px] -translate-y-1/2",
            footer: "bottom-[52px] translate-y-1/2",
        }[placement]

        return (
            <TooltipButton
                ref={ref}
                type="button"
                variant="outline"
                size="icon"
                className={cn(
                    "absolute right-0 z-20 h-7 w-7 translate-x-1/2 rounded-full bg-background shadow-sm",
                    placementClass,
                    className
                )}
                tooltip={label}
                tooltipSide={tooltipSide}
                tooltipAlign={tooltipAlign}
                tooltipSideOffset={tooltipSideOffset}
                onClick={toggleCollapsed}
                aria-label={typeof label === "string" ? label : undefined}
                {...props}
            >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </TooltipButton>
        )
    }
)
SidebarToggle.displayName = "SidebarToggle"

const SidebarSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        role="separator"
        className={cn("mx-2 my-2 h-px bg-border", className)}
        {...props}
    />
))
SidebarSeparator.displayName = "SidebarSeparator"

export {
    Sidebar,
    SidebarProvider,
    SidebarHeader,
    SidebarBody,
    SidebarFooter,
    SidebarToggle,
    SidebarSeparator,
}
