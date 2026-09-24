import * as React from "react"
import { cn } from "../../lib/utils"

interface KanbanTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    sidebar?: React.ReactNode
    header?: React.ReactNode
    children: React.ReactNode // The columns
}

export function KanbanTemplate({
    sidebar,
    header,
    children,
    className,
    ...props
}: KanbanTemplateProps) {
    return (
        <div className={cn("flex h-full min-h-0 w-full overflow-hidden", className)} {...props}>
            {sidebar && (
                <aside className="hidden w-64 border-r border-r-transparent contrast-more:border-r-border forced-colors:border-r-[CanvasText] bg-muted md:block flex-shrink-0">
                    {sidebar}
                </aside>
            )}
            <div className="flex flex-col flex-1 h-full min-w-0">
                {header && (
                    <header className="flex h-14 items-center gap-4 border-b border-b-transparent contrast-more:border-b-border forced-colors:border-b-[CanvasText] bg-muted px-6 lg:h-[60px]">
                        {header}
                    </header>
                )}
                <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                    <div className="flex h-full gap-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
