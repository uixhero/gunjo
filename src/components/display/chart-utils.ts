import type { ReactNode } from "react"

export type ChartTone =
    | "primary"
    | "success"
    | "warning"
    | "info"
    | "accent"
    | "destructive"
    | "muted"

export type ChartColor = ChartTone | (string & {})

export interface ChartDataPoint {
    label?: ReactNode
    value: number
    color?: ChartColor
}

export const chartToneOrder: ChartTone[] = [
    "primary",
    "success",
    "warning",
    "info",
    "accent",
    "destructive",
]

const chartToneValues: Record<ChartTone, string> = {
    primary: "hsl(var(--primary))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    info: "hsl(var(--info))",
    accent: "hsl(var(--accent))",
    destructive: "hsl(var(--destructive))",
    muted: "hsl(var(--muted-foreground))",
}

export function clamp(value: number, min = 0, max = 100) {
    return Math.min(max, Math.max(min, value))
}

export function getChartColor(color: ChartColor | undefined, index: number) {
    const resolvedColor = color ?? chartToneOrder[index % chartToneOrder.length]
    return chartToneValues[resolvedColor as ChartTone] ?? resolvedColor
}

export function getChartValue(point: ChartDataPoint | number) {
    return typeof point === "number" ? point : point.value
}

export function getChartLabel(point: ChartDataPoint | number, index: number) {
    if (typeof point === "number") return `#${index + 1}`
    return point.label ?? `#${index + 1}`
}

export function chartLabelToString(label: ReactNode, fallback = "Data") {
    if (typeof label === "string" || typeof label === "number") return String(label)
    return fallback
}

export function normalizeChartValue(value: number, max: number) {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0
    return clamp((value / max) * 100)
}

export function defaultChartValueFormatter(value: number) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value % 1 === 0 ? 0 : 1,
    }).format(value)
}
