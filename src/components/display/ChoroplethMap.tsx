"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { ChartColor, NumberFormatSpec } from "./chart-utils"
import {
    chartLabelToString,
    clamp,
    getChartColor,
    normalizeChartValue,
    resolveValueFormatter,
} from "./chart-utils"
import { ChartTooltip } from "./chart-tooltip"
import type { ChoroplethMapVariantKey } from "./generated/variant-keys"
import { choroplethMapDefaultVariantKey } from "./generated/default-variant-keys"

export interface ChoroplethMapRegion {
    id?: string
    label: string
    value: number
    geometry: ChoroplethMapGeometry
    color?: ChartColor
    description?: React.ReactNode
}

export interface ChoroplethMapMarker {
    id?: string
    label: string
    regionId?: string
    coordinate?: ChoroplethMapCoordinate
    x?: number
    y?: number
    value?: number
    color?: ChartColor
}

export type ChoroplethMapCoordinate = [number, number]

export type ChoroplethMapGeometry =
    | {
          type: "Polygon"
          coordinates: ChoroplethMapCoordinate[][]
      }
    | {
          type: "MultiPolygon"
          coordinates: ChoroplethMapCoordinate[][][]
      }

export interface ChoroplethMapProps extends React.HTMLAttributes<HTMLDivElement> {
    regions: ChoroplethMapRegion[]
    markers?: ChoroplethMapMarker[]
    variant?: ChoroplethMapVariantKey
    max?: number
    color?: ChartColor
    selectedId?: string
    showRanking?: boolean
    rankingLimit?: number
    showSelectedRegion?: boolean
    preserveAspectRatio?: boolean
    /**
     * Format each value. **Function prop — pass only from a Client Component**;
     * from a Server Component it breaks `next build`. For RSC-safe numeric
     * formatting use the serializable {@link ChoroplethMapProps.valueFormat}. (#338)
     */
    formatValue?: (value: number) => React.ReactNode
    /**
     * Serializable numeric format — the RSC-safe alternative to `formatValue`
     * (`"number" | "compact" | "integer"` preset or `Intl.NumberFormatOptions`).
     * Ignored when `formatValue` is set. Formats with a fixed `en-US` locale. (#338)
     */
    valueFormat?: NumberFormatSpec
    selectedLabel?: React.ReactNode
    rankLabel?: React.ReactNode
    onRegionSelect?: (region: ChoroplethMapRegion, id: string) => void
    onMarkerSelect?: (marker: ChoroplethMapMarker, id: string) => void
}

const choroplethMapVariantClasses: Record<ChoroplethMapVariantKey, string> = {
    compact: "w-full p-0",
    default: "w-full p-0",
}

const choroplethMapPanelClasses: Record<ChoroplethMapVariantKey, string> = {
    compact: "min-h-56",
    default: "min-h-72",
}

const CHOROPLETH_MAP_SPLIT_LAYOUT_MIN_WIDTH = 640

function regionKey(region: ChoroplethMapRegion, index: number) {
    return region.id ?? `${region.label}-${index}`
}

function markerKey(marker: ChoroplethMapMarker, index: number) {
    return marker.id ?? `${marker.label}-${index}`
}

function mapPieceOutlineColor(isSelected: boolean) {
    return isSelected ? "hsl(var(--foreground) / 0.8)" : "hsl(var(--foreground) / 0.28)"
}

interface GeometryBounds {
    minX: number
    maxX: number
    minY: number
    maxY: number
    width: number
    height: number
    aspectRatio: number
}

interface RegionPiece {
    left: number
    top: number
    width: number
    height: number
    clipPath: string
}

const fallbackBounds: GeometryBounds = {
    minX: 0,
    maxX: 100,
    minY: 0,
    maxY: 100,
    width: 100,
    height: 100,
    aspectRatio: 1,
}

function getExteriorRings(geometry: ChoroplethMapGeometry) {
    if (geometry.type === "Polygon") {
        return geometry.coordinates[0] ? [geometry.coordinates[0]] : []
    }

    return geometry.coordinates
        .map((polygon) => polygon[0])
        .filter((ring): ring is ChoroplethMapCoordinate[] => Boolean(ring))
}

function computeBounds(regions: ChoroplethMapRegion[], markers: ChoroplethMapMarker[]) {
    const coordinates: ChoroplethMapCoordinate[] = []

    regions.forEach((region) => {
        getExteriorRings(region.geometry).forEach((ring) => coordinates.push(...ring))
    })
    markers.forEach((marker) => {
        if (marker.coordinate) coordinates.push(marker.coordinate)
    })

    if (coordinates.length === 0) return fallbackBounds

    const xs = coordinates.map((coordinate) => coordinate[0])
    const ys = coordinates.map((coordinate) => coordinate[1])
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const width = Math.max(maxX - minX, Number.EPSILON)
    const height = Math.max(maxY - minY, Number.EPSILON)

    return {
        minX,
        maxX,
        minY,
        maxY,
        width,
        height,
        aspectRatio: clamp(width / height, 0.5, 2),
    }
}

function projectCoordinate(coordinate: ChoroplethMapCoordinate, bounds: GeometryBounds) {
    return {
        x: clamp(((coordinate[0] - bounds.minX) / bounds.width) * 100),
        y: clamp(((bounds.maxY - coordinate[1]) / bounds.height) * 100),
    }
}

function getRegionPieces(region: ChoroplethMapRegion, bounds: GeometryBounds) {
    return getExteriorRings(region.geometry)
        .map((ring) => {
            const points = ring.map((coordinate) => projectCoordinate(coordinate, bounds))

            if (points.length < 3) return null

            const xs = points.map((point) => point.x)
            const ys = points.map((point) => point.y)
            const left = Math.min(...xs)
            const right = Math.max(...xs)
            const top = Math.min(...ys)
            const bottom = Math.max(...ys)
            const width = Math.max(right - left, 0.1)
            const height = Math.max(bottom - top, 0.1)
            const clipPath = `polygon(${points
                .map(
                    (point) =>
                        `${((point.x - left) / width) * 100}% ${((point.y - top) / height) * 100}%`
                )
                .join(", ")})`

            return {
                left,
                top,
                width,
                height,
                clipPath,
            }
        })
        .filter((piece): piece is RegionPiece => Boolean(piece))
}

function getMarkerPosition(marker: ChoroplethMapMarker, bounds: GeometryBounds) {
    if (marker.coordinate) return projectCoordinate(marker.coordinate, bounds)

    return {
        x: clamp(marker.x ?? 0),
        y: clamp(marker.y ?? 0),
    }
}

const ChoroplethMap = React.forwardRef<HTMLDivElement, ChoroplethMapProps>(
    (
        {
            className,
            regions,
            markers = [],
            variant = choroplethMapDefaultVariantKey,
            max,
            color = "destructive",
            selectedId,
            showRanking = true,
            rankingLimit = 6,
            showSelectedRegion = true,
            preserveAspectRatio = true,
            formatValue: formatValueProp,
            valueFormat,
            selectedLabel = "Selected",
            rankLabel = "Rank",
            onRegionSelect,
            onMarkerSelect,
            ...props
        },
        ref
    ) => {
        const formatValue = resolveValueFormatter(formatValueProp, valueFormat)
        const rootRef = React.useRef<HTMLDivElement | null>(null)
        const [useSplitRankingLayout, setUseSplitRankingLayout] = React.useState(false)
        const values = regions.map((region) => region.value)
        const maxValue = Math.max(max ?? 0, ...values, 1)
        const geometryBounds = computeBounds(regions, markers)
        const regionEntries = regions.map((region, index) => ({
            region,
            index,
            id: regionKey(region, index),
        }))
        const selectedRegionEntry = selectedId
            ? regionEntries.find((entry) => entry.id === selectedId)
            : undefined
        const rankedRegionEntries = [...regionEntries]
            .sort((a, b) => b.region.value - a.region.value)
        const displayedRegionEntries = rankedRegionEntries.slice(0, rankingLimit)
        const canSelectRegions = typeof onRegionSelect === "function"
        const canSelectMarkers = typeof onMarkerSelect === "function"
        const setRootRef = React.useCallback(
            (node: HTMLDivElement | null) => {
                rootRef.current = node
                if (typeof ref === "function") {
                    ref(node)
                    return
                }
                if (ref) {
                    const mutableRef = ref as React.MutableRefObject<HTMLDivElement | null>
                    mutableRef.current = node
                }
            },
            [ref]
        )

        React.useEffect(() => {
            const element = rootRef.current
            if (!element) return

            const updateLayout = () => {
                const next = element.getBoundingClientRect().width >= CHOROPLETH_MAP_SPLIT_LAYOUT_MIN_WIDTH
                setUseSplitRankingLayout((current) => (current === next ? current : next))
            }

            updateLayout()

            if (typeof ResizeObserver === "undefined") {
                window.addEventListener("resize", updateLayout)
                return () => window.removeEventListener("resize", updateLayout)
            }

            const observer = new ResizeObserver(updateLayout)
            observer.observe(element)
            return () => observer.disconnect()
        }, [])

        return (
            <div
                ref={setRootRef}
                className={cn(choroplethMapVariantClasses[variant], "min-w-0", className)}
                {...props}
            >
                <div
                    className={cn(
                        "grid min-w-0 gap-4",
                        showRanking && "items-start"
                    )}
                    style={
                        showRanking && useSplitRankingLayout
                            ? {
                                  gridTemplateColumns:
                                      "minmax(0, 1.35fr) minmax(min(42%, 18rem), 0.85fr)",
                              }
                            : undefined
                    }
                >
                    <div className="grid min-w-0 gap-3">
                        <div
                            className={cn(
                                "relative min-w-0 overflow-hidden rounded-md border bg-muted/20",
                                choroplethMapPanelClasses[variant]
                            )}
                        >
                            <div className="absolute inset-3 flex items-center justify-center sm:inset-4">
                                <div
                                    className={cn(
                                        "relative max-h-full max-w-full",
                                        preserveAspectRatio ? "h-full" : "h-full w-full"
                                    )}
                                    style={
                                        preserveAspectRatio
                                            ? { aspectRatio: geometryBounds.aspectRatio }
                                            : undefined
                                    }
                                >
                                    <span
                                        className="absolute inset-x-0 top-1/4 border-t border-dashed border-border/60"
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="absolute inset-x-2 top-2/3 border-t border-dashed border-border/50"
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="absolute inset-y-2 left-1/3 border-l border-dashed border-border/50"
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="absolute inset-y-0 left-2/3 border-l border-dashed border-border/60"
                                        aria-hidden="true"
                                    />
                                    {regions.map((region, index) => {
                                        const id = regionKey(region, index)
                                        const percent = normalizeChartValue(region.value, maxValue)
                                        const activeColor = getChartColor(region.color ?? color, index)
                                        const isSelected = selectedId === id
                                        const pieces = getRegionPieces(region, geometryBounds)

                                        return (
                                            <React.Fragment key={id}>
                                                {pieces.map((piece, pieceIndex) => {
                                                    const fillStrength = isSelected
                                                        ? 96
                                                        : 18 + (clamp(percent, 0, 100) / 100) * 72
                                                    const mapPieceStyle = {
                                                        left: `${piece.left}%`,
                                                        top: `${piece.top}%`,
                                                        width: `${piece.width}%`,
                                                        height: `${piece.height}%`,
                                                        clipPath: piece.clipPath,
                                                        backgroundColor:
                                                            mapPieceOutlineColor(isSelected),
                                                    }
                                                    const mapPieceFill = (
                                                        <span
                                                            className="pointer-events-none absolute inset-0 block"
                                                            style={{
                                                                clipPath: piece.clipPath,
                                                                backgroundColor: `color-mix(in srgb, ${activeColor} ${fillStrength}%, transparent)`,
                                                                transform: isSelected
                                                                    ? "scale(0.965)"
                                                                    : "scale(0.985)",
                                                                transformOrigin: "center",
                                                            }}
                                                            aria-hidden="true"
                                                        />
                                                    )
                                                    const mapPieceClassName = cn(
                                                        "absolute overflow-hidden transition-[opacity,box-shadow]",
                                                        canSelectRegions &&
                                                            "cursor-pointer hover:opacity-90 focus-visible:z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                        isSelected && "z-20"
                                                    )

                                                    return (
                                                        <ChartTooltip
                                                            key={`${id}-${pieceIndex}`}
                                                            label={region.label}
                                                            value={formatValue(region.value)}
                                                            description={region.description}
                                                        >
                                                            {canSelectRegions ? (
                                                                <button
                                                                    type="button"
                                                                    className={mapPieceClassName}
                                                                    style={mapPieceStyle}
                                                                    aria-label={`${chartLabelToString(region.label)}: ${formatValue(region.value)}`}
                                                                    aria-current={
                                                                        isSelected
                                                                            ? "true"
                                                                            : undefined
                                                                    }
                                                                    onClick={() =>
                                                                        onRegionSelect?.(
                                                                            region,
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    {mapPieceFill}
                                                                </button>
                                                            ) : (
                                                                <span
                                                                    className={mapPieceClassName}
                                                                    style={mapPieceStyle}
                                                                    tabIndex={0}
                                                                    aria-label={`${chartLabelToString(region.label)}: ${formatValue(region.value)}`}
                                                                    aria-current={
                                                                        isSelected
                                                                            ? "true"
                                                                            : undefined
                                                                    }
                                                                >
                                                                    {mapPieceFill}
                                                                </span>
                                                            )}
                                                        </ChartTooltip>
                                                    )
                                                })}
                                            </React.Fragment>
                                        )
                                    })}
                                    {markers.map((marker, index) => {
                                        const id = markerKey(marker, index)
                                        const position = getMarkerPosition(marker, geometryBounds)
                                        const size =
                                            marker.value === undefined
                                                ? 0.9
                                                : 0.8 +
                                                  (normalizeChartValue(marker.value, maxValue) /
                                                      100) *
                                                      1.1
                                        const activeColor = getChartColor(marker.color ?? "muted", index)

                                        const markerStyle = {
                                            left: `${position.x}%`,
                                            top: `${position.y}%`,
                                            width: `${size}rem`,
                                            height: `${size}rem`,
                                        }
                                        const markerLabel =
                                            marker.value === undefined
                                                ? marker.label
                                                : `${marker.label}: ${formatValue(marker.value)}`
                                        const markerClassName = cn(
                                            "absolute z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/40 bg-background shadow-sm transition-[filter,transform]",
                                            canSelectMarkers &&
                                                "cursor-pointer hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        )
                                        const markerDot = (
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ backgroundColor: activeColor }}
                                                aria-hidden="true"
                                            />
                                        )

                                        return (
                                            <ChartTooltip
                                                key={id}
                                                label={marker.label}
                                                value={
                                                    marker.value === undefined
                                                        ? undefined
                                                        : formatValue(marker.value)
                                                }
                                            >
                                                {canSelectMarkers ? (
                                                    <button
                                                        type="button"
                                                        className={markerClassName}
                                                        style={markerStyle}
                                                        aria-label={markerLabel}
                                                        onClick={() =>
                                                            onMarkerSelect?.(marker, id)
                                                        }
                                                    >
                                                        {markerDot}
                                                    </button>
                                                ) : (
                                                    <span
                                                        className={markerClassName}
                                                        style={markerStyle}
                                                        tabIndex={0}
                                                        aria-label={markerLabel}
                                                    >
                                                        {markerDot}
                                                    </span>
                                                )}
                                            </ChartTooltip>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        {showSelectedRegion && selectedRegionEntry ? (
                            <div className="grid min-w-0 gap-1 rounded-md border bg-card p-3">
                                <div className="flex min-w-0 items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-xs font-medium text-muted-foreground">
                                            {selectedLabel}
                                        </div>
                                        <div className="truncate text-sm font-semibold">
                                            {selectedRegionEntry.region.label}
                                        </div>
                                        {selectedRegionEntry.region.description ? (
                                            <div className="truncate text-xs text-muted-foreground">
                                                {selectedRegionEntry.region.description}
                                            </div>
                                        ) : null}
                                    </div>
                                    <span className="shrink-0 text-lg font-semibold tabular-nums">
                                        {formatValue(selectedRegionEntry.region.value)}
                                    </span>
                                </div>
                                <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                                    <span
                                        className="absolute inset-y-0 left-0 rounded-full"
                                        style={{
                                            width: `${normalizeChartValue(selectedRegionEntry.region.value, maxValue)}%`,
                                            backgroundColor: getChartColor(
                                                selectedRegionEntry.region.color ?? color,
                                                selectedRegionEntry.index
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                    {showRanking ? (
                        <ol className="grid min-w-0 content-start gap-2">
                            {displayedRegionEntries.map(({ region, id }, index) => {
                                const percent = normalizeChartValue(region.value, maxValue)
                                const activeColor = getChartColor(region.color ?? color, index)
                                const isSelected = selectedId === id

                                return (
                                    <li
                                        key={id}
                                        aria-current={isSelected ? "true" : undefined}
                                    >
                                        <button
                                            type="button"
                                            className={cn(
                                                "grid w-full min-w-0 gap-2 rounded-md border bg-card p-2 text-left transition-colors",
                                                canSelectRegions &&
                                                    "cursor-pointer hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                !canSelectRegions && "cursor-default",
                                                isSelected && "ring-1 ring-foreground"
                                            )}
                                            disabled={!canSelectRegions}
                                            onClick={() => onRegionSelect?.(region, id)}
                                        >
                                            <span className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3">
                                                <span
                                                    className={cn(
                                                        "flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-semibold tabular-nums text-muted-foreground",
                                                        index < 3 &&
                                                            "bg-primary-subtle text-primary-subtle-foreground"
                                                    )}
                                                    aria-label={`${chartLabelToString(rankLabel, "Rank")} ${index + 1}`}
                                                >
                                                    {index + 1}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium">
                                                        {region.label}
                                                    </span>
                                                    {region.description ? (
                                                        <span className="block truncate text-xs text-muted-foreground">
                                                            {region.description}
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <span className="shrink-0 text-sm font-semibold tabular-nums">
                                                    {formatValue(region.value)}
                                                </span>
                                            </span>
                                            <span className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                                                <span
                                                    className="absolute inset-y-0 left-0 rounded-full"
                                                    style={{
                                                        width: `${percent}%`,
                                                        backgroundColor: activeColor,
                                                    }}
                                                />
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ol>
                    ) : null}
                </div>
            </div>
        )
    }
)
ChoroplethMap.displayName = "ChoroplethMap"

export { ChoroplethMap }
