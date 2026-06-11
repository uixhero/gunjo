import type { PointerEvent, ReactNode } from "react"

import type { ChartDataPoint } from "./chart-utils"
import {
    clamp,
    defaultChartValueFormatter,
    getChartColor,
    normalizeChartValue,
} from "./chart-utils"

export interface NormalizedCircularSegment {
    label?: ReactNode
    value: number
    color: string
    start: number
    end: number
}

export function normalizeCircularSegments(segments: ChartDataPoint[]) {
    const positiveSegments = segments.map((segment, index) => ({
        label: segment.label,
        value: Math.max(segment.value, 0),
        color: getChartColor(segment.color, index),
    }))
    const total = Math.max(
        positiveSegments.reduce((sum, segment) => sum + segment.value, 0),
        1
    )
    let cursor = 0

    return positiveSegments.map((segment) => {
        const size = normalizeChartValue(segment.value, total)
        const normalizedSegment = {
            ...segment,
            start: cursor,
            end: cursor + size,
        }
        cursor += size
        return normalizedSegment
    })
}

export function buildConicGradient(
    segments: NormalizedCircularSegment[],
    fallback = "hsl(var(--muted))"
) {
    if (segments.every((segment) => segment.value <= 0)) {
        return fallback
    }

    return `conic-gradient(${segments
        .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
        .join(", ")})`
}

export function buildActiveCircularSegmentGradient(
    segment: NormalizedCircularSegment | undefined,
    color = "hsl(var(--foreground) / 0.3)"
) {
    if (!segment) return undefined

    return `conic-gradient(transparent 0% ${segment.start}%, ${color} ${segment.start}% ${segment.end}%, transparent ${segment.end}% 100%)`
}

export function getCircularSegmentAtPercent(
    segments: NormalizedCircularSegment[],
    percent: number
) {
    return (
        segments.find(
            (segment) => percent >= segment.start && percent <= segment.end
        ) ?? segments[segments.length - 1]
    )
}

export function getCircularPointerPercent(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    return (((angle + 90) % 360) + 360) % 360 / 360 * 100
}

export function getCircularPointerPosition(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
        x: clamp(((event.clientX - rect.left) / rect.width) * 100),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100),
    }
}

export function getCircularPointerDistance(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const radius = rect.width / 2
    const centerX = rect.left + radius
    const centerY = rect.top + radius
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY

    return {
        distance: Math.sqrt(dx * dx + dy * dy),
        radius,
    }
}

export function getCircularSegmentPosition(
    segment: NormalizedCircularSegment | undefined,
    radius = 38
) {
    if (!segment) return { x: 50, y: 18 }
    const percent = (segment.start + segment.end) / 2
    const angle = (percent / 100) * 360 - 90
    const radians = (angle * Math.PI) / 180
    return {
        x: clamp(50 + Math.cos(radians) * radius),
        y: clamp(50 + Math.sin(radians) * radius),
    }
}

export function getCircularSegmentShare(
    segment: NormalizedCircularSegment | undefined
) {
    if (!segment) return undefined
    return Math.max(0, segment.end - segment.start)
}

export function buildLegendItems(
    segments: ChartDataPoint[],
    formatValue: (value: number) => ReactNode = defaultChartValueFormatter,
    totalLabel: ReactNode = "Total"
) {
    const total = Math.max(
        segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0),
        1
    )

    return segments.map((segment, index) => ({
        label: segment.label,
        value: `${defaultChartValueFormatter(
            normalizeChartValue(Math.max(segment.value, 0), total)
        )}%`,
        color: segment.color ?? getChartColor(undefined, index),
        description: [totalLabel, ": ", formatValue(segment.value)],
    }))
}
