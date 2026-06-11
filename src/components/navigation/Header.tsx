"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

const Header = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
    <header
        ref={ref}
        className={cn(
            "flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border bg-background px-4 py-3 sm:px-6",
            className
        )}
        {...props}
    />
))
Header.displayName = "Header"

const HeaderBrand = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex min-w-0 shrink-0 items-center gap-2", className)}
        {...props}
    />
))
HeaderBrand.displayName = "HeaderBrand"

const HeaderNav = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
    <nav
        ref={ref}
        className={cn(
            "order-last flex w-full min-w-0 items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:order-none sm:w-auto",
            className
        )}
        {...props}
    />
))
HeaderNav.displayName = "HeaderNav"

interface HeaderNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean
}

const HeaderNavLink = React.forwardRef<HTMLAnchorElement, HeaderNavLinkProps>(
    ({ className, active, ...props }, ref) => (
        <a
            ref={ref}
            className={cn(
                "whitespace-nowrap text-sm transition-colors hover:text-foreground",
                active ? "font-medium text-foreground" : "text-muted-foreground",
                className
            )}
            {...props}
        />
    )
)
HeaderNavLink.displayName = "HeaderNavLink"

const HeaderActions = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
        {...props}
    />
))
HeaderActions.displayName = "HeaderActions"

export { Header, HeaderBrand, HeaderNav, HeaderNavLink, HeaderActions }
