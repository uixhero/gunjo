import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { IconChevronRight as ChevronRight, IconDots as MoreHorizontal } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../overlay/DropdownMenu"

export interface BreadcrumbItemData {
    label: React.ReactNode
    href?: string
    onClick?: () => void
}

const Breadcrumb = React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithoutRef<"nav"> & {
        separator?: React.ReactNode
        /**
         * Data-driven crumbs. When provided, the list renders (and auto-collapses
         * per `maxItems`) instead of `children` — so a deep path doesn't overflow.
         * Omit `items` to compose the primitives by hand (unchanged behaviour).
         */
        items?: BreadcrumbItemData[]
        /** Collapse the middle of the path with an ellipsis menu once items exceed this. */
        maxItems?: number
        /** Crumbs kept at the start when collapsed (default 1). */
        itemsBeforeCollapse?: number
        /** Crumbs kept at the end when collapsed (default 1). */
        itemsAfterCollapse?: number
    }
>(({ items, maxItems, itemsBeforeCollapse = 1, itemsAfterCollapse = 1, separator, children, ...props }, ref) => {
    if (!items) {
        return <nav ref={ref} aria-label="breadcrumb" {...props}>{children}</nav>
    }

    const renderCrumb = (item: BreadcrumbItemData, isLast: boolean, key: React.Key) => (
        <React.Fragment key={key}>
            <BreadcrumbItem>
                {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : item.href ? (
                    <BreadcrumbLink href={item.href} onClick={item.onClick}>{item.label}</BreadcrumbLink>
                ) : (
                    <button type="button" onClick={item.onClick} className="underline underline-offset-2 transition-colors hover:text-foreground">
                        {item.label}
                    </button>
                )}
            </BreadcrumbItem>
            {isLast ? null : <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
        </React.Fragment>
    )

    const collapse =
        typeof maxItems === "number" &&
        items.length > maxItems &&
        items.length > itemsBeforeCollapse + itemsAfterCollapse
    const head = collapse ? items.slice(0, itemsBeforeCollapse) : items
    const hidden = collapse ? items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse) : []
    const tail = collapse ? items.slice(items.length - itemsAfterCollapse) : []

    return (
        <nav ref={ref} aria-label="breadcrumb" {...props}>
            <BreadcrumbList>
                {head.map((item, index) =>
                    renderCrumb(item, !collapse && index === items.length - 1, `h${index}`)
                )}
                {collapse ? (
                    <>
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    aria-label="Show collapsed breadcrumbs"
                                    className="flex h-9 w-9 items-center justify-center rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {hidden.map((item, index) => (
                                        <DropdownMenuItem
                                            key={`x${index}`}
                                            asChild={Boolean(item.href)}
                                            onSelect={item.href ? undefined : item.onClick}
                                        >
                                            {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                    </>
                ) : null}
                {tail.map((item, index) =>
                    renderCrumb(item, index === tail.length - 1, `t${index}`)
                )}
            </BreadcrumbList>
        </nav>
    )
})
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
    HTMLOListElement,
    React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn(
            "flex flex-row flex-wrap items-center w-fit gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
            className
        )}
        {...props}
    />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
    />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<"a"> & {
        asChild?: boolean
    }
>(({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
        <Comp
            ref={ref}
            className={cn("underline underline-offset-2 transition-colors hover:text-foreground", className)}
            {...props}
        />
    )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("font-medium text-foreground", className)}
        {...props}
    />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
    children,
    className,
    ...props
}: React.ComponentProps<"li">) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:size-3.5", className)}
        {...props}
    >
        {children ?? <ChevronRight />}
    </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
    className,
    label = "More",
    ...props
}: React.ComponentProps<"span"> & { label?: string }) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">{label}</span>
    </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
}
