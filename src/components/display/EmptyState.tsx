import * as React from "react"

import { cn } from "../../lib/utils"

export interface EmptyStateProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    icon?: React.ReactNode
    title: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
    /** Heading level for the title so screen-reader heading navigation works. Default 2. */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    (
        { className, icon, title, description, action, headingLevel = 2, children, ...props },
        ref
    ) => {
        const TitleTag = `h${headingLevel}` as React.ElementType
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-6 py-10 text-center",
                    className
                )}
                {...props}
            >
                {icon ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {icon}
                    </div>
                ) : null}
                <div className="space-y-1">
                    <TitleTag className="text-sm font-semibold text-foreground">{title}</TitleTag>
                    {description ? (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                {action ? <div className="mt-2">{action}</div> : null}
                {children}
            </div>
        )
    }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
