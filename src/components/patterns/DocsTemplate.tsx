import * as React from "react"

import { cn } from "../../lib/utils"

export interface DocsTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Left navigation sidebar content. */
    sidebar: React.ReactNode
    /** Right "On this page" TOC content. Optional. */
    toc?: React.ReactNode
    /** Top header. Optional (e.g. site Header organism). */
    header?: React.ReactNode
}

const DocsTemplate = React.forwardRef<HTMLDivElement, DocsTemplateProps>(
    ({ className, sidebar, toc, header, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex min-h-screen w-full flex-col bg-background text-foreground",
                className
            )}
            {...props}
        >
            {header}
            <div className="grid flex-1 grid-cols-[200px_minmax(0,1fr)] md:grid-cols-[220px_minmax(0,1fr)_180px]">
                <aside className="border-r border-border bg-muted/40 p-4 overflow-y-auto">
                    {sidebar}
                </aside>
                <main className="p-6 md:p-10 overflow-x-auto">{children}</main>
                {toc ? (
                    <aside className="hidden md:block border-l border-border p-4 overflow-y-auto text-sm">
                        {toc}
                    </aside>
                ) : null}
            </div>
        </div>
    )
)
DocsTemplate.displayName = "DocsTemplate"

export { DocsTemplate }
