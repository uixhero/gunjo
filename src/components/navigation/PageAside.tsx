"use client"

import * as React from "react"
import { IconChevronDown as ChevronDown } from "@tabler/icons-react"
import { cn } from "../../lib/utils"
import { RightRail } from "./RightRail"

export interface PageAsideProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode
    renderAside: () => React.ReactNode
    children: React.ReactNode
    asideLabel?: string
    contentLabel?: string
    mobileDescription?: React.ReactNode
    defaultOpen?: boolean
    width?: string
    contentClassName?: string
    mobileClassName?: string
    railClassName?: string
    railContentClassName?: string
    openLabel?: string
    closeLabel?: string
}

const PageAside = React.forwardRef<HTMLDivElement, PageAsideProps>(
    (
        {
            className,
            title,
            renderAside,
            children,
            asideLabel,
            contentLabel,
            mobileDescription,
            defaultOpen = true,
            width = "w-72",
            contentClassName,
            mobileClassName,
            railClassName,
            railContentClassName,
            openLabel = "Open",
            closeLabel = "Close",
            ...props
        },
        ref
    ) => {
        const label = asideLabel ?? (typeof title === "string" ? title : undefined)

        return (
            <div ref={ref} className={cn("flex min-h-0 w-full flex-col lg:flex-row", className)} {...props}>
                <div className={cn("min-w-0 flex-1", contentClassName)} aria-label={contentLabel}>
                    {/*
                     * Mobile disclosure uses a native <details>/<summary> (the
                     * summary is NOT a heading) so it never injects an out-of-
                     * order heading before the page <h1> — unlike an Accordion,
                     * whose Radix header renders an <h3>. Summary natively
                     * announces expanded/collapsed state to assistive tech.
                     */}
                    <aside className={cn("mb-4 rounded-md border bg-background p-3 lg:hidden", mobileClassName)} aria-label={label}>
                        <details open={defaultOpen} className="group w-full">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-left [&::-webkit-details-marker]:hidden">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {title}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span className="sr-only group-open:hidden">{openLabel}</span>
                                    <span className="sr-only hidden group-open:inline">{closeLabel}</span>
                                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                                </span>
                            </summary>
                            <div className="space-y-3 pt-3">
                                {mobileDescription ? (
                                    <p className="text-xs text-muted-foreground">{mobileDescription}</p>
                                ) : null}
                                {renderAside()}
                            </div>
                        </details>
                    </aside>
                    {children}
                </div>
                <RightRail width={width} className={cn("hidden bg-background lg:flex", railClassName)} aria-label={label}>
                    <div className={cn("space-y-5 p-4", railContentClassName)}>
                        {renderAside()}
                    </div>
                </RightRail>
            </div>
        )
    }
)
PageAside.displayName = "PageAside"

export { PageAside }
