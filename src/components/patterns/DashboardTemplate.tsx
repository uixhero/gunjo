import * as React from "react"
import { cn } from "../../lib/utils"

interface DashboardTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode
    sidebar?: React.ReactNode
    children: React.ReactNode
}

export function DashboardTemplate({
    children,
    header,
    sidebar,
    className,
    ...props
}: DashboardTemplateProps) {
    return (
        <div className={cn("flex flex-col min-h-screen w-full", className)} {...props}>
            {header && <div className="border-b">{header}</div>}
            <div className="flex flex-1 min-h-0">
                {sidebar && (
                    <aside className="hidden border-r w-64 md:block flex-shrink-0">
                        {sidebar}
                    </aside>
                )}
                <main className="flex-1 min-h-0 overflow-auto bg-muted/50">
                    <div className="container mx-auto py-6 space-y-8 px-4 md:px-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
