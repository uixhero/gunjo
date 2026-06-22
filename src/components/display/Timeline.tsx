import * as React from "react"

import { cn } from "../../lib/utils"

const Timeline = React.forwardRef<
    HTMLOListElement,
    React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn("relative flex flex-col", className)}
        {...props}
    />
))
Timeline.displayName = "Timeline"

export interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    /** Whether to draw a connector line below this item. Default true; set false on last item. */
    connector?: boolean
    /** Marker variant. Semantic tones (success/warning/destructive/info) suit
     *  status and approval timelines — they match the Badge/Button tone set. (#205) */
    variant?: "default" | "muted" | "active" | "outline" | "success" | "warning" | "destructive" | "info"
    /** Custom marker node (icon, etc.). Overrides default dot. */
    marker?: React.ReactNode
}

const VARIANT_CLASS = {
    default: "bg-foreground",
    muted: "bg-muted-foreground",
    active: "gunjo-timeline-marker-active border-2 border-primary-border bg-primary",
    outline: "border-2 border-foreground bg-background",
    success: "bg-success-strong",
    warning: "bg-warning-strong",
    destructive: "bg-destructive-strong",
    info: "bg-info-strong",
} as const

function hasTimelineTime(children: React.ReactNode): boolean {
    return React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) return false
        const type = child.type as { displayName?: string }
        return type.displayName === "TimelineTime"
    })
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
    (
        {
            className,
            connector = true,
            variant = "default",
            marker,
            children,
            ...props
        },
        ref
    ) => {
        const hasTime = hasTimelineTime(children)

        return (
            <li
                ref={ref}
                className={cn("relative flex items-start gap-3", className)}
                {...props}
            >
                <div className={cn("flex self-stretch flex-col items-center", hasTime ? "pt-1" : "pt-0.5")}>
                    {marker ? (
                        <div className="flex h-4 w-4 items-center justify-center">
                            {marker}
                        </div>
                    ) : (
                        <span
                            aria-hidden
                            className={cn("h-4 w-4 rounded-full", VARIANT_CLASS[variant])}
                        />
                    )}
                    {connector ? (
                        <span aria-hidden className={cn("min-h-4 w-0.5 flex-1 bg-border", hasTime ? "-mb-1" : "-mb-0.5")} />
                    ) : null}
                </div>
                <div className={cn("min-w-0 pb-6", connector ? "" : "pb-0")}>
                    {children}
                </div>
            </li>
        )
    }
)
TimelineItem.displayName = "TimelineItem"

const TimelineTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm font-semibold text-foreground", className)}
        {...props}
    />
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
TimelineDescription.displayName = "TimelineDescription"

const TimelineTime = React.forwardRef<
    HTMLTimeElement,
    React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
    <time
        ref={ref}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
    />
))
TimelineTime.displayName = "TimelineTime"

export { Timeline, TimelineItem, TimelineTitle, TimelineDescription, TimelineTime }
