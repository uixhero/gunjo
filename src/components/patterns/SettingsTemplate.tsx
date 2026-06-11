import * as React from "react"
import { cn } from "../../lib/utils"

interface SettingsTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    navigation?: React.ReactNode
    children: React.ReactNode
}

export function SettingsTemplate({
    children,
    navigation,
    title = "Settings",
    description = "Manage your account settings and preferences.",
    className,
    ...props
}: SettingsTemplateProps) {
    return (
        <>
            <div className={cn("md:hidden flex flex-col items-center w-[1280px] h-[720px] gap-4 w-full h-auto", className)} {...props}>
                {/* Mobile View Placeholder or simple stack */}
                <div className="p-4 space-y-4">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {navigation}
                    {children}
                </div>
            </div>
            <div className={cn("hidden flex flex-col items-center w-[1280px] h-[720px] gap-4 space-y-6 p-10 pb-16 md:block", className)} {...props}>
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-6"></div>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        {navigation}
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
