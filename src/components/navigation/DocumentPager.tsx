"use client"

import * as React from "react"
import { IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from "@tabler/icons-react";
import { cn } from "../../lib/utils"

export interface DocumentPagerItem {
    href: string
    directionLabel: React.ReactNode
    title: React.ReactNode
    subtitle?: React.ReactNode
    description?: React.ReactNode
    categoryLabel?: React.ReactNode
    thumbnailSrc?: string
    thumbnailAlt?: string
    thumbnailFallback?: React.ReactNode
    ariaLabel?: string
}

export interface DocumentPagerLinkProps {
    href: string
    className?: string
    "aria-label"?: string
    children: React.ReactNode
}

export interface DocumentPagerProps extends React.HTMLAttributes<HTMLElement> {
    previous?: DocumentPagerItem | null
    next?: DocumentPagerItem | null
    linkComponent?: React.ElementType<DocumentPagerLinkProps>
}

function DocumentPagerThumb({
    src,
    alt,
    fallback,
}: {
    src?: string
    alt?: string
    fallback?: React.ReactNode
}) {
    const [errored, setErrored] = React.useState(false)

    if (!src && !errored) return null

    return (
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md border border-border/70 bg-muted/40 p-1.5 sm:w-28">
            {src && !errored ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={src}
                    alt={alt ?? ""}
                    onError={() => setErrored(true)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-[4px] object-cover object-top shadow-sm"
                />
            ) : (
                <div className="grid h-full w-full place-items-center rounded-[4px] bg-muted text-center text-[10px] leading-tight text-muted-foreground">
                    {fallback ?? "Preview"}
                </div>
            )}
        </div>
    )
}

function DocumentPagerCard({
    item,
    direction,
    LinkComponent,
}: {
    item: DocumentPagerItem
    direction: "previous" | "next"
    LinkComponent: React.ElementType<DocumentPagerLinkProps>
}) {
    const ariaLabel =
        item.ariaLabel ??
        `${typeof item.directionLabel === "string" ? item.directionLabel : direction}: ${
            typeof item.title === "string" ? item.title : ""
        }`

    return (
        <LinkComponent
            href={item.href}
            className="group block h-full rounded-md border border-border/70 bg-background p-3 transition-colors hover:border-primary-border hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={ariaLabel}
        >
            <div
                className={cn(
                    "mb-2.5 flex items-center",
                    direction === "next" ? "justify-end" : "justify-start"
                )}
            >
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors group-hover:text-primary">
                    {direction === "previous" ? <ChevronLeft className="h-4 w-4" /> : null}
                    {item.directionLabel}
                    {direction === "next" ? <ChevronRight className="h-4 w-4" /> : null}
                </span>
            </div>

            <div className="flex min-w-0 gap-3">
                <DocumentPagerThumb
                    src={item.thumbnailSrc}
                    alt={item.thumbnailAlt}
                    fallback={item.thumbnailFallback}
                />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex min-w-0 flex-col items-start gap-1.5">
                        <span className="min-w-0 max-w-full space-y-0.5 text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                            <span className="block break-words leading-snug">{item.title}</span>
                            {item.subtitle ? (
                                <span className="block break-words text-[10px] font-normal leading-snug text-muted-foreground">
                                    {item.subtitle}
                                </span>
                            ) : null}
                        </span>
                        {item.categoryLabel ? (
                            <span className="inline-flex min-h-5 max-w-full shrink-0 items-center rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {item.categoryLabel}
                            </span>
                        ) : null}
                    </div>
                    {item.description ? (
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                        </p>
                    ) : null}
                </div>
            </div>
        </LinkComponent>
    )
}

const DocumentPager = React.forwardRef<HTMLElement, DocumentPagerProps>(
    ({ previous, next, linkComponent, className, ...props }, ref) => {
        const LinkComponent = linkComponent ?? "a"

        if (!previous && !next) return null

        return (
            <nav
                ref={ref}
                className={cn(
                    "grid w-full gap-3 border-t border-border/60 px-0 pb-0 pt-5 xl:grid-cols-2",
                    className
                )}
                {...props}
            >
                {previous ? (
                    <DocumentPagerCard
                        item={previous}
                        direction="previous"
                        LinkComponent={LinkComponent}
                    />
                ) : (
                    <div className="hidden md:block" aria-hidden="true" />
                )}
                {next ? (
                    <DocumentPagerCard
                        item={next}
                        direction="next"
                        LinkComponent={LinkComponent}
                    />
                ) : null}
            </nav>
        )
    }
)
DocumentPager.displayName = "DocumentPager"

export { DocumentPager }
