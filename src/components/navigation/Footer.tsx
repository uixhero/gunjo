import * as React from "react"

import { cn } from "../../lib/utils"

const Footer = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
    <footer
        ref={ref}
        className={cn(
            "flex w-full flex-col gap-6 border-t border-border bg-background px-6 py-8",
            className
        )}
        {...props}
    />
))
Footer.displayName = "Footer"

const FooterColumns = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}
        {...props}
    />
))
FooterColumns.displayName = "FooterColumns"

interface FooterSectionProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: React.ReactNode
}

const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(
    ({ className, title, children, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
            {title ? (
                <p className="text-sm font-semibold text-foreground">{title}</p>
            ) : null}
            {children}
        </div>
    )
)
FooterSection.displayName = "FooterSection"

const FooterLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
    <a
        ref={ref}
        className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-foreground",
            className
        )}
        {...props}
    />
))
FooterLink.displayName = "FooterLink"

const FooterBrand = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
    />
))
FooterBrand.displayName = "FooterBrand"

const FooterCopyright = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("border-t border-border pt-4 text-xs text-muted-foreground", className)}
        {...props}
    />
))
FooterCopyright.displayName = "FooterCopyright"

export { Footer, FooterColumns, FooterSection, FooterLink, FooterBrand, FooterCopyright }
