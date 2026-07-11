"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type LineageNodeTone =
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "muted"

export interface LineageNode {
    id: string
    label: React.ReactNode
    sublabel?: React.ReactNode
    tone?: LineageNodeTone
    /** Plain-text label for the node's composed accessible name. */
    ariaLabel?: string
}

export interface LineageEdge {
    from: string
    to: string
}

export interface LineageGraphProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
    nodes: LineageNode[]
    /** Directed edges (a DAG — `from` is upstream of `to`). Multi-parent / multi-child supported. */
    edges: LineageEdge[]
    /** Flow direction. `"horizontal"` (left→right, default) or `"vertical"` (top→bottom). */
    direction?: "horizontal" | "vertical"
    nodeWidth?: number
    nodeHeight?: number
    /** Gap between layers (depth axis). Default 64. */
    layerGap?: number
    /** Gap between nodes within a layer. Default 16. */
    rowGap?: number
    /**
     * **Function prop — pass only from a Client Component**; from a Server Component it breaks `next build`. Render props return JSX, so there is no serializable alternative — wrap in a thin `"use client"` component to pass it from an RSC. (#338)
     */
    renderNode?: (node: LineageNode) => React.ReactNode
    onSelectNode?: (node: LineageNode) => void
    label?: React.ReactNode
}

const NODE_TONE: Record<LineageNodeTone, string> = {
    default: "bg-card border-border",
    primary: "bg-primary/10 border-primary/40",
    info: "bg-info-subtle border-info-border",
    success: "bg-success-subtle border-success-border",
    warning: "bg-warning-subtle border-warning-border",
    destructive: "bg-destructive-subtle border-destructive-border",
    muted: "bg-muted border-border",
}

function nodeText(n: LineageNode): string {
    return n.ariaLabel ?? (typeof n.label === "string" ? n.label : n.id)
}

// Assign each node a layer = longest path from a root (cycle-guarded).
function computeLayers(nodes: LineageNode[], parentsOf: Map<string, string[]>): Map<string, number> {
    const layer = new Map<string, number>()
    const visiting = new Set<string>()
    const depth = (id: string): number => {
        const cached = layer.get(id)
        if (cached !== undefined) return cached
        if (visiting.has(id)) return 0 // defensive: ignore back-edges
        visiting.add(id)
        const parents = parentsOf.get(id) ?? []
        const d = parents.length === 0 ? 0 : 1 + Math.max(...parents.map(depth))
        visiting.delete(id)
        layer.set(id, d)
        return d
    }
    for (const n of nodes) depth(n.id)
    return layer
}

/**
 * Lineage / dependency graph: a layered, directed-acyclic node-link graph that
 * handles **multi-parent and multi-child** edges (the fan-in / fan-out a tree
 * can't draw). Nodes are auto-assigned to layers by longest-path depth and laid
 * out along a flow axis; edges are drawn as SVG connectors with arrowheads. Nodes
 * are focusable buttons whose accessible name names their upstream/downstream
 * neighbours. For lot genealogy / traceability (recall blast-radius), data
 * lineage, build/dependency graphs, ETL pipelines and approval routing with
 * joins. (#281)
 */
const LineageGraph = React.forwardRef<HTMLDivElement, LineageGraphProps>(
    (
        {
            className,
            nodes,
            edges,
            direction = "horizontal",
            nodeWidth = 160,
            nodeHeight = 56,
            layerGap = 64,
            rowGap = 16,
            renderNode,
            onSelectNode,
            label,
            ...props
        },
        ref
    ) => {
        const horizontal = direction === "horizontal"

        const layout = React.useMemo(() => {
            const parentsOf = new Map<string, string[]>()
            const childrenOf = new Map<string, string[]>()
            for (const n of nodes) {
                parentsOf.set(n.id, [])
                childrenOf.set(n.id, [])
            }
            for (const e of edges) {
                if (parentsOf.has(e.to)) parentsOf.get(e.to)!.push(e.from)
                if (childrenOf.has(e.from)) childrenOf.get(e.from)!.push(e.to)
            }

            const layerOf = computeLayers(nodes, parentsOf)
            // group nodes by layer in input order, assign a row within the layer
            const byLayer = new Map<number, LineageNode[]>()
            for (const n of nodes) {
                const l = layerOf.get(n.id) ?? 0
                const list = byLayer.get(l)
                if (list) list.push(n)
                else byLayer.set(l, [n])
            }
            const maxLayer = Math.max(0, ...[...byLayer.keys()])
            const maxRows = Math.max(1, ...[...byLayer.values()].map((v) => v.length))

            const pos = new Map<string, { x: number; y: number }>()
            for (const [l, list] of byLayer) {
                list.forEach((n, row) => {
                    const along = l * (horizontal ? nodeWidth + layerGap : nodeHeight + layerGap)
                    const across = row * (horizontal ? nodeHeight + rowGap : nodeWidth + rowGap)
                    pos.set(n.id, horizontal ? { x: along, y: across } : { x: across, y: along })
                })
            }

            const width = horizontal
                ? (maxLayer + 1) * (nodeWidth + layerGap) - layerGap
                : maxRows * (nodeWidth + rowGap) - rowGap
            const height = horizontal
                ? maxRows * (nodeHeight + rowGap) - rowGap
                : (maxLayer + 1) * (nodeHeight + layerGap) - layerGap

            return { pos, width: Math.max(nodeWidth, width), height: Math.max(nodeHeight, height), parentsOf, childrenOf }
        }, [nodes, edges, horizontal, nodeWidth, nodeHeight, layerGap, rowGap])

        const nodeById = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

        return (
            <div
                ref={ref}
                role="group"
                aria-label={typeof label === "string" ? label : "系譜グラフ"}
                className={cn("w-full max-w-full overflow-auto p-0 [contain:paint]", className)}
                data-slot="lineage-graph"
                {...props}
            >
                <div className="relative" style={{ width: layout.width, height: layout.height }}>
                    {/* edges */}
                    <svg
                        className="pointer-events-none absolute inset-0"
                        width={layout.width}
                        height={layout.height}
                        aria-hidden="true"
                    >
                        <defs>
                            <marker
                                id="lineage-arrow"
                                viewBox="0 0 8 8"
                                refX="7"
                                refY="4"
                                markerWidth="6"
                                markerHeight="6"
                                orient="auto-start-reverse"
                            >
                                <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground" />
                            </marker>
                        </defs>
                        {edges.map((e, i) => {
                            const a = layout.pos.get(e.from)
                            const b = layout.pos.get(e.to)
                            if (!a || !b) return null
                            const x1 = horizontal ? a.x + nodeWidth : a.x + nodeWidth / 2
                            const y1 = horizontal ? a.y + nodeHeight / 2 : a.y + nodeHeight
                            const x2 = horizontal ? b.x : b.x + nodeWidth / 2
                            const y2 = horizontal ? b.y + nodeHeight / 2 : b.y
                            const d = horizontal
                                ? `M${x1},${y1} C${x1 + layerGap / 2},${y1} ${x2 - layerGap / 2},${y2} ${x2},${y2}`
                                : `M${x1},${y1} C${x1},${y1 + layerGap / 2} ${x2},${y2 - layerGap / 2} ${x2},${y2}`
                            return (
                                <path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    className="stroke-muted-foreground/60"
                                    strokeWidth={1.5}
                                    markerEnd="url(#lineage-arrow)"
                                />
                            )
                        })}
                    </svg>

                    {/* nodes */}
                    {nodes.map((n) => {
                        const p = layout.pos.get(n.id)
                        if (!p) return null
                        const parents = (layout.parentsOf.get(n.id) ?? []).map((id) => nodeById.get(id)).filter(Boolean) as LineageNode[]
                        const children = (layout.childrenOf.get(n.id) ?? []).map((id) => nodeById.get(id)).filter(Boolean) as LineageNode[]
                        const accessibleName = `${nodeText(n)}${
                            parents.length ? `、上流: ${parents.map(nodeText).join("、")}` : ""
                        }${children.length ? `、下流: ${children.map(nodeText).join("、")}` : ""}`
                        const body = renderNode ? (
                            renderNode(n)
                        ) : (
                            <div className="flex h-full flex-col justify-center overflow-hidden">
                                <span className="truncate text-sm font-medium text-foreground">{n.label}</span>
                                {n.sublabel != null ? (
                                    <span className="truncate text-xs text-muted-foreground">{n.sublabel}</span>
                                ) : null}
                            </div>
                        )
                        const cls = cn(
                            "absolute rounded-md border px-2 text-left shadow-sm",
                            NODE_TONE[n.tone ?? "default"],
                            onSelectNode &&
                                "cursor-pointer outline-none transition-[border-color,box-shadow,filter] hover:border-ring/70 hover:shadow-md hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )
                        const style: React.CSSProperties = { left: p.x, top: p.y, width: nodeWidth, height: nodeHeight }
                        return onSelectNode ? (
                            <button key={n.id} type="button" onClick={() => onSelectNode(n)} aria-label={accessibleName} className={cls} style={style}>
                                {body}
                            </button>
                        ) : (
                            <div key={n.id} aria-label={accessibleName} className={cls} style={style}>
                                {body}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
LineageGraph.displayName = "LineageGraph"

export { LineageGraph }
