import * as React from "react"
import { cn } from "../../lib/utils"

interface EditorTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    topBar?: React.ReactNode
    leftPanel?: React.ReactNode
    rightPanel?: React.ReactNode
    children: React.ReactNode // The canvas area
}

export function EditorTemplate({
    children,
    topBar,
    leftPanel,
    rightPanel,
    className,
    ...props
}: EditorTemplateProps) {
    return (
        <div className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden", className)} {...props}>
            {topBar && (
                <div className="flex-shrink-0 border-b h-14 flex items-center bg-background z-10">
                    {topBar}
                </div>
            )}
            <div className="flex flex-1 overflow-hidden relative">
                {leftPanel && (
                    <aside className="flex-shrink-0 border-r w-64 bg-background z-10 hidden md:block">
                        {leftPanel}
                    </aside>
                )}

                <main className="flex-1 relative bg-muted/50 overflow-hidden">
                    {/* Canvas Area */}
                    {children}
                </main>

                {rightPanel && (
                    <aside className="flex-shrink-0 border-l w-72 bg-background z-10 hidden lg:block">
                        {rightPanel}
                    </aside>
                )}
            </div>
        </div>
    )
}
