import * as React from "react"
import { cn } from "../../lib/utils"

interface MediaLibraryTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode
    sidebar?: React.ReactNode
    details?: React.ReactNode
    children: React.ReactNode
}

export function MediaLibraryTemplate({
    children,
    header,
    sidebar,
    details,
    className,
    ...props
}: MediaLibraryTemplateProps) {
    return (
        <div className={cn("flex flex-col w-[1280px] h-[720px] h-screen w-full overflow-hidden bg-background", className)} {...props}>
            {/* Header */}
            {header && (
                <div className="flex-shrink-0 z-20 border-b bg-background">
                    <div className="flex h-14 items-center px-4">
                        {header}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar (Folders/Collections) */}
                {sidebar && (
                    <aside className="group hidden w-64 flex-shrink-0 overflow-hidden border-r bg-muted/10 md:block">
                        {sidebar}
                    </aside>
                )}

                {/* Asset Grid / Center Area */}
                <main className="flex-1 relative overflow-hidden flex flex-col bg-background">
                    <div className="w-full h-full overflow-auto">
                        {children}
                    </div>
                </main>

                {/* Right Details Panel (Asset Metadata) */}
                {details && (
                    <aside className="flex-shrink-0 w-80 border-l bg-background hidden lg:block overflow-y-auto">
                        {details}
                    </aside>
                )}
            </div>
        </div>
    )
}
