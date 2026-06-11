"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../display/Accordion"
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
                    <aside className={cn("mb-4 rounded-md border bg-background p-3 lg:hidden", mobileClassName)} aria-label={label}>
                        <Accordion type="single" collapsible defaultValue={defaultOpen ? "page-aside" : undefined} className="w-full border-0">
                            <AccordionItem value="page-aside" className="border-0">
                                <AccordionTrigger className="px-0 py-0 text-left hover:no-underline" openLabel={openLabel} closeLabel={closeLabel}>
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        {title}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0 pt-3">
                                    <div className="space-y-3">
                                        {mobileDescription ? (
                                            <p className="text-xs text-muted-foreground">{mobileDescription}</p>
                                        ) : null}
                                        {renderAside()}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
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
