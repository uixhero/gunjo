"use client"

import * as React from "react"
import { IconPhoto as ImageIcon } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { AssetCard, type AssetCardAsset, type AssetCardProps } from "./AssetCard"
import { EmptyState } from "./EmptyState"
import { assetGridDefaultVariantKey } from "./generated/default-variant-keys"
import type { AssetGridVariantKey } from "./generated/variant-keys"

export interface AssetGridGroup<TAsset extends AssetCardAsset = AssetCardAsset> {
    id: string
    label: React.ReactNode
    items: TAsset[]
    description?: React.ReactNode
}

export interface AssetGridProps<TAsset extends AssetCardAsset = AssetCardAsset>
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
    items?: TAsset[]
    groups?: AssetGridGroup<TAsset>[]
    selectedIds?: Iterable<string>
    variant?: AssetGridVariantKey
    layout?: "fill" | "content"
    minColumnWidth?: number
    gap?: number
    selectionMode?: AssetCardProps["selectionMode"]
    portalContainer?: HTMLElement | null
    emptyTitle?: React.ReactNode
    emptyDescription?: React.ReactNode
    onSelect?: (asset: TAsset) => void
    onPreview?: (asset: TAsset) => void
    onFavorite?: (asset: TAsset) => void
    renderMeta?: (asset: TAsset) => React.ReactNode
    renderItem?: (asset: TAsset, state: { selected: boolean }) => React.ReactNode
}

const variantDefaults: Record<AssetGridVariantKey, { minColumnWidth: number; gap: number; cardVariant: AssetCardProps["variant"] }> = {
    default: { minColumnWidth: 180, gap: 24, cardVariant: "default" },
    compact: { minColumnWidth: 140, gap: 16, cardVariant: "compact" },
}

function normalizeGroups<TAsset extends AssetCardAsset>(
    items: TAsset[] | undefined,
    groups: AssetGridGroup<TAsset>[] | undefined
) {
    if (groups) return groups
    return [{ id: "all", label: null, items: items ?? [] }]
}

const AssetGrid = React.forwardRef<HTMLDivElement, AssetGridProps>(
    (
        {
            items,
            groups,
            selectedIds,
            variant = assetGridDefaultVariantKey,
            layout = "fill",
            minColumnWidth,
            gap,
            selectionMode = "single",
            portalContainer,
            emptyTitle = "No assets",
            emptyDescription = "Assets added to this library will appear here.",
            onSelect,
            onPreview,
            onFavorite,
            renderMeta,
            renderItem,
            className,
            style,
            ...props
        },
        ref
    ) => {
        const defaults = variantDefaults[variant]
        const resolvedGroups = normalizeGroups(items, groups)
        const selectedSet = React.useMemo(() => new Set(selectedIds ?? []), [selectedIds])
        const hasAssets = resolvedGroups.some((group) => group.items.length > 0)
        const columnWidth = minColumnWidth ?? defaults.minColumnWidth
        const gridGap = gap ?? defaults.gap
        const stretchColumns = layout === "fill"

        if (!hasAssets) {
            return (
                <div ref={ref} className={cn("flex min-h-64 w-full items-center justify-center p-0", className)} {...props}>
                    <EmptyState
                        icon={<ImageIcon className="h-8 w-8" aria-hidden="true" />}
                        title={emptyTitle}
                        description={emptyDescription}
                    />
                </div>
            )
        }

        return (
            <div ref={ref} className={cn("w-full space-y-8 p-0", className)} style={style} {...props}>
                {resolvedGroups.map((group) => {
                    const contentMaxWidth =
                        group.items.length > 0
                            ? group.items.length * columnWidth + Math.max(0, group.items.length - 1) * gridGap
                            : undefined

                    return (
                        <section
                            key={group.id}
                            className={cn("space-y-3", layout === "content" && "mx-auto w-full")}
                            style={layout === "content" && contentMaxWidth ? { maxWidth: `${contentMaxWidth}px` } : undefined}
                        >
                            {group.label ? (
                                <div className="flex min-w-0 items-end justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold text-foreground">{group.label}</h3>
                                        {group.description ? (
                                            <p className="mt-1 truncate text-xs text-muted-foreground">{group.description}</p>
                                        ) : null}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{group.items.length}</span>
                                </div>
                            ) : null}
                            <div
                                className="grid"
                                style={{
                                    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${columnWidth}px), ${stretchColumns ? "1fr" : `${columnWidth}px`}))`,
                                    gap: `${gridGap}px`,
                                    justifyContent: layout === "content" ? "center" : undefined,
                                }}
                            >
                                {group.items.map((asset) => {
                                    const selected = selectedSet.has(asset.id)
                                    if (renderItem) {
                                        return (
                                            <React.Fragment key={asset.id}>
                                                {renderItem(asset, { selected })}
                                            </React.Fragment>
                                        )
                                    }
                                    return (
                                        <AssetCard
                                            key={asset.id}
                                            asset={asset}
                                            selected={selected}
                                            variant={defaults.cardVariant}
                                            selectionMode={selectionMode}
                                            portalContainer={portalContainer}
                                            onSelect={onSelect as ((asset: AssetCardAsset) => void) | undefined}
                                            onPreview={onPreview as ((asset: AssetCardAsset) => void) | undefined}
                                            onFavorite={onFavorite as ((asset: AssetCardAsset) => void) | undefined}
                                            renderMeta={renderMeta as ((asset: AssetCardAsset) => React.ReactNode) | undefined}
                                        />
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}
            </div>
        )
    }
)
AssetGrid.displayName = "AssetGrid"

export { AssetGrid }
