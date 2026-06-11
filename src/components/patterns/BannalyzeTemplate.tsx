import * as React from "react"
import { cn } from "../../lib/utils"

interface BannalyzeTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode
    sidebar?: React.ReactNode
    inspector?: React.ReactNode
    children: React.ReactNode
}

export function BannalyzeTemplate({
    children,
    header,
    sidebar,
    inspector,
    className,
    ...props
}: BannalyzeTemplateProps) {
    return (
        <div className={cn("flex flex-col w-[1280px] h-[720px] h-screen w-full overflow-hidden bg-background", className)} {...props}>
            {/* Header */}
            {header && (
                <div className="flex-shrink-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center px-4">
                        {header}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar */}
                {sidebar && (
                    <aside className="group flex-shrink-0 w-64 border-r bg-muted/10 hidden md:block overflow-y-auto">
                        {sidebar}
                    </aside>
                )}

                {/* Canvas / Center Area */}
                <main className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-muted/20">
                    <div className="w-full h-full p-4 overflow-auto flex items-center justify-center">
                        {children}
                    </div>
                </main>

                {/* Right Inspector Panel */}
                {inspector && (
                    <aside className="flex-shrink-0 w-80 border-l bg-background hidden lg:block overflow-y-auto">
                        {inspector}
                    </aside>
                )}
            </div>
        </div>
    )
}
