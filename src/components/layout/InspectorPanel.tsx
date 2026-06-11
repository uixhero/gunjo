"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface InspectorPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    header?: React.ReactNode
    footer?: React.ReactNode
}

export const InspectorPanel = React.forwardRef<HTMLDivElement, InspectorPanelProps>(
    ({ className, title, header, children, footer, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex h-full w-full flex-col border-l border-border bg-background w-[320px] h-[420px]",
                    className
                )}
                {...props}
            >
                {header ?? (title && (
                    <div className="flex items-center h-12 px-4 border-b border-border bg-muted/30">
                        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    </div>
                ))}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 border-t border-border bg-muted/30">
                        {footer}
                    </div>
                )}
            </div>
        )
    }
)
InspectorPanel.displayName = "InspectorPanel"

export const InspectorSection = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { title: string }
>(({ className, title, children, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
        </h4>
        <div className="space-y-2">
            {children}
        </div>
    </div>
))
InspectorSection.displayName = "InspectorSection"

export const InspectorField = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { label: string }
>(({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn("grid min-w-0 gap-1.5", className)} {...props}>
        <label className="text-xs font-medium text-foreground">{label}</label>
        {children}
    </div>
))
InspectorField.displayName = "InspectorField"
