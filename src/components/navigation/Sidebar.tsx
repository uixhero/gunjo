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

/**
 * Collapsed state of the nearest `<SidebarProvider>`, or `null` when there is
 * none. Unlike `useSidebar`, this does not throw, so components that are valid
 * both inside and outside a sidebar (e.g. `SidebarItem`) can follow the
 * collapse without forcing every caller to wrap them in a provider. (#692)
 */
export function useSidebarCollapsed(): boolean | null {
    return React.useContext(SidebarContext)?.collapsed ?? null
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

/**
 * The sidebar column. Fills the cross size of a flex or grid parent on its own
 * (`self-stretch`), so it reaches the bottom whether the parent's height is
 * fixed (`h-dvh`) or content-driven (`min-h-dvh`).
 *
 * It used to set `height:100%`, which resolves against the parent — `auto` when
 * the parent has no definite height — and also cancels the flex stretch that
 * would otherwise have done the right thing. The sidebar then stopped at the
 * height of its own contents with nothing on screen to explain why. If you
 * place it in a *block* parent, where neither stretch nor percentage height
 * applies, give it an explicit height yourself. (#692)
 */
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
                "relative flex flex-col self-stretch overflow-visible bg-muted transition-[width] duration-200",
                // 区切りは 1px の罫線ではなく面の濃淡で伝える（DECISIONS.md
                // 2026-09-22）。bg-muted/40 は地との比が dark 1.10:1 / light
                // 1.04:1 しかなく罫線を外すと消えるので、bg-muted（dark 1.37:1 /
                // light 1.10:1）まで上げてある。border-r は幅だけ残して透明にし、
                // ハイコントラストでだけ色を戻す（モード間で幅がずれないため）。
                "border-r border-r-transparent contrast-more:border-r-border forced-colors:border-r-[CanvasText]",
                collapsed ? "w-[60px]" : "w-[240px]",
                className
            )}
            {...props}
        />
    )
})
Sidebar.displayName = "Sidebar"

// Header and footer follow the collapse too: at 60px the 16px side padding
// leaves almost nothing, so they centre, tighten, and clip rather than letting
// a brand name or account row spill past the rail. (#692)
const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const collapsed = useSidebarCollapsed()
    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center gap-2 overflow-hidden bg-background py-3",
                // 本体（bg-muted）との面の差が境目になる。罫線は幅だけ残して
                // 透明にし、ハイコントラストで戻す。
                "border-b border-b-transparent contrast-more:border-b-border forced-colors:border-b-[CanvasText]",
                collapsed ? "justify-center px-2" : "px-4",
                className
            )}
            {...props}
        />
    )
})
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
>(({ className, ...props }, ref) => {
    const collapsed = useSidebarCollapsed()
    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center gap-2 overflow-hidden bg-background py-3",
                // ヘッダーと同じ扱い。面の差で区切り、ハイコントラストで罫線に戻す。
                "border-t border-t-transparent contrast-more:border-t-border forced-colors:border-t-[CanvasText]",
                collapsed ? "justify-center px-2" : "px-4",
                className
            )}
            {...props}
        />
    )
})
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
