"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Progress } from "./Progress"
import { Card, CardContent, CardHeader, CardTitle } from "../display/Card"

export interface ProgressWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    value: number
    max?: number
    label?: string
    subtext?: string
    progressLabel?: string
    subtextLive?: "off" | "polite" | "assertive"
    icon?: React.ReactNode
}

const ProgressWidget = React.forwardRef<HTMLDivElement, ProgressWidgetProps>(
    ({ className, title, value, max = 100, label, subtext, progressLabel, subtextLive = "off", icon, ...props }, ref) => {
        const safeMax = max > 0 ? max : 100
        const boundedValue = Math.min(safeMax, Math.max(0, value))
        const percentage = Math.round((boundedValue / safeMax) * 100)

        return (
            <Card ref={ref} className={cn("flex flex-col w-[320px] rounded-lg border overflow-hidden", className)} {...props}>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
                    <CardTitle className="min-w-0 truncate text-sm font-medium">{title}</CardTitle>
                    {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tabular-nums">{label || `${percentage}%`}</div>
                    <Progress value={boundedValue} max={safeMax} className="mt-2 h-2" aria-label={progressLabel ?? title} />
                    {subtext && (
                        <p className="text-xs text-muted-foreground mt-2" aria-live={subtextLive}>{subtext}</p>
                    )}
                </CardContent>
            </Card>
        )
    }
)
ProgressWidget.displayName = "ProgressWidget"

export { ProgressWidget }
