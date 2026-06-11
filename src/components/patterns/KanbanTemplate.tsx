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
        <div className={cn("flex w-[1280px] h-[720px] h-screen w-full overflow-hidden", className)} {...props}>
            {sidebar && (
                <aside className="hidden w-64 border-r bg-muted/40 md:block flex-shrink-0">
                    {sidebar}
                </aside>
            )}
            <div className="flex flex-col flex-1 h-full min-w-0">
                {header && (
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
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
