import * as React from "react"
import { cn } from "../../lib/utils"

interface ChatTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    sidebarList?: React.ReactNode // Channel/User list
    sidebarDetail?: React.ReactNode // User profile / Thread details
    header?: React.ReactNode
    children: React.ReactNode // Message stream
    composer?: React.ReactNode // Input area
}

export function ChatTemplate({
    sidebarList,
    sidebarDetail,
    header,
    children,
    composer,
    className,
    ...props
}: ChatTemplateProps) {
    return (
        <div className={cn("flex h-full min-h-0 w-full overflow-hidden bg-background", className)} {...props}>
            {/* Left Sidebar (Channels) */}
            {sidebarList && (
                <aside className="hidden w-[280px] flex-col border-r bg-muted/30 md:flex flex-shrink-0">
                    {sidebarList}
                </aside>
            )}

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {header && (
                    <header className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                        {header}
                    </header>
                )}
                <main className="flex-1 overflow-y-auto p-4 flex flex-col">
                    {children}
                </main>
                {composer && (
                    <div className="p-4 border-t bg-background">
                        {composer}
                    </div>
                )}
            </div>

            {/* Right Sidebar (Details) - Optional */}
            {sidebarDetail && (
                <aside className="hidden w-[300px] border-l bg-muted/30 xl:block flex-shrink-0">
                    {sidebarDetail}
                </aside>
            )}
        </div>
    )
}
