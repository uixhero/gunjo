"use client"

import * as React from "react"
import { IconMenu2 as Menu } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import {
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarToggle,
} from "../navigation/Sidebar"
import { Sheet, SheetContent, SheetTitle } from "../overlay/Sheet"
import { useLocale } from "../utility/LocaleProvider"

interface DashboardTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode
    /**
     * The navigation rows themselves — normally `<SidebarItem>`s. The template
     * owns the shell around them: the provider, the collapsible desktop rail,
     * and the sheet that opens the same rows on small screens. Pass rows, not a
     * sidebar: this slot used to be a fixed `w-64` frame, which pinned a real
     * `<Sidebar>` open and left phones with no navigation at all. (#692)
     */
    sidebar?: React.ReactNode
    /** Brand or workspace switcher, pinned above the rows. */
    sidebarHeader?: React.ReactNode
    /** Account menu or similar, pinned below the rows. */
    sidebarFooter?: React.ReactNode
    /** Show the collapse control on the desktop rail. Default `true`. */
    collapsible?: boolean
    /** Initial collapsed state when uncontrolled. */
    defaultCollapsed?: boolean
    /** Controlled collapsed state. */
    collapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    /** Accessible name for the nav region, its open control, and the sheet. */
    navLabel?: string
    /** Controlled open state of the small-screen navigation sheet. */
    navOpen?: boolean
    onNavOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

export function DashboardTemplate({
    children,
    header,
    sidebar,
    sidebarHeader,
    sidebarFooter,
    collapsible = true,
    defaultCollapsed,
    collapsed,
    onCollapsedChange,
    navLabel,
    navOpen,
    onNavOpenChange,
    className,
    ...props
}: DashboardTemplateProps) {
    const { strings } = useLocale()
    const [internalNavOpen, setInternalNavOpen] = React.useState(false)
    const navIsControlled = navOpen !== undefined
    const resolvedNavOpen = navIsControlled ? navOpen : internalNavOpen
    const label = navLabel ?? strings.navigation

    const setNavOpen = React.useCallback(
        (open: boolean) => {
            if (!navIsControlled) setInternalNavOpen(open)
            onNavOpenChange?.(open)
        },
        [navIsControlled, onNavOpenChange]
    )

    const hasNav = Boolean(sidebar || sidebarHeader || sidebarFooter)

    const nav = (
        <>
            {sidebarHeader && <SidebarHeader>{sidebarHeader}</SidebarHeader>}
            <SidebarBody>{sidebar}</SidebarBody>
            {sidebarFooter && <SidebarFooter>{sidebarFooter}</SidebarFooter>}
        </>
    )

    const togglePlacement = sidebarFooter
        ? "footer"
        : sidebarHeader
            ? "header"
            : "center"

    const shell = (
        // A dashboard scrolls inside its main column, not as a page, and the
        // rail needs a parent whose height is definite — `min-h-screen` alone
        // left the sidebar as short as its own contents. (#692)
        <div
            className={cn("flex h-dvh w-full flex-col overflow-hidden", className)}
            {...props}
        >
            {(header || hasNav) && (
                <div
                    className={cn(
                        "flex flex-shrink-0 items-center gap-2 border-b",
                        !header && "md:hidden"
                    )}
                >
                    {hasNav && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-2 shrink-0 md:hidden"
                            aria-label={label}
                            aria-expanded={resolvedNavOpen}
                            onClick={() => setNavOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="min-w-0 flex-1">{header}</div>
                </div>
            )}
            <div className="flex min-h-0 flex-1">
                {hasNav && (
                    <>
                        <Sidebar className="hidden md:flex" aria-label={label}>
                            {nav}
                            {collapsible && <SidebarToggle placement={togglePlacement} />}
                        </Sidebar>
                        <Sheet open={resolvedNavOpen} onOpenChange={setNavOpen}>
                            <SheetContent
                                side="left"
                                size="sm"
                                className="flex flex-col p-0 md:hidden"
                            >
                                <SheetTitle className="border-b px-4 py-3 text-base">
                                    {label}
                                </SheetTitle>
                                {/* Always expanded: the sheet has room for
                                    labels, and inheriting the desktop rail's
                                    collapsed state would hide them. */}
                                <SidebarProvider collapsed={false}>{nav}</SidebarProvider>
                            </SheetContent>
                        </Sheet>
                    </>
                )}
                <main className="flex-1 min-h-0 overflow-auto bg-muted/50">
                    <div className="container mx-auto py-6 space-y-8 px-4 md:px-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )

    if (!hasNav) return shell

    return (
        <SidebarProvider
            defaultCollapsed={defaultCollapsed}
            collapsed={collapsed}
            onCollapsedChange={onCollapsedChange}
        >
            {shell}
        </SidebarProvider>
    )
}
