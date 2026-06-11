import * as React from "react"

import { cn } from "../../lib/utils"
import { metadataListDefaultVariantKey } from "./generated/default-variant-keys"
import type { MetadataListVariantKey } from "./generated/variant-keys"

export interface MetadataListItem {
    label: React.ReactNode
    value: React.ReactNode
    description?: React.ReactNode
    icon?: React.ReactNode
}

export interface MetadataListProps extends React.HTMLAttributes<HTMLDListElement> {
    items: MetadataListItem[]
    variant?: MetadataListVariantKey
    layout?: "vertical" | "horizontal"
    emptyMessage?: React.ReactNode
}

const variantClasses: Record<MetadataListVariantKey, { root: string; row: string; horizontalRow: string; value: string }> = {
    default: {
        root: "space-y-2",
        row: "grid grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-md px-0 py-1.5",
        horizontalRow: "rounded-md border border-border/70 bg-card px-3 py-2.5",
        value: "text-sm",
    },
    compact: {
        root: "space-y-1",
        row: "grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md px-0 py-1",
        horizontalRow: "rounded-md border border-border/70 bg-card px-3 py-2",
        value: "text-xs",
    },
}

const MetadataList = React.forwardRef<HTMLDListElement, MetadataListProps>(
    ({ items, variant = metadataListDefaultVariantKey, layout = "vertical", emptyMessage = "No metadata", className, ...props }, ref) => {
        const classes = variantClasses[variant]
        const isHorizontal = layout === "horizontal"

        if (items.length === 0) {
            return (
                <div className={cn("w-full rounded-md border border-dashed p-4 text-sm text-muted-foreground", className)}>
                    {emptyMessage}
                </div>
            )
        }

        return (
            <dl
                ref={ref}
                className={cn(
                    "w-full p-0",
                    isHorizontal ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : classes.root,
                    className
                )}
                {...props}
            >
                {items.map((item, index) => (
                    <div key={index} className={isHorizontal ? classes.horizontalRow : classes.row}>
                        <dt className="flex min-w-0 items-start gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {item.icon ? <span className="mt-0.5 shrink-0 text-muted-foreground">{item.icon}</span> : null}
                            <span className="min-w-0 truncate">{item.label}</span>
                        </dt>
                        <dd className={cn("min-w-0 font-medium text-foreground", isHorizontal ? "mt-1 text-left" : "text-right", classes.value)}>
                            <div className="truncate">{item.value}</div>
                            {item.description ? (
                                <div className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
                                    {item.description}
                                </div>
                            ) : null}
                        </dd>
                    </div>
                ))}
            </dl>
        )
    }
)
MetadataList.displayName = "MetadataList"

export { MetadataList }
