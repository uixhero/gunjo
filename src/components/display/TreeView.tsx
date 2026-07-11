"use client"

import * as React from "react"
import { IconChevronDown as ChevronDown, IconChevronRight as ChevronRight } from "@tabler/icons-react";

import { cn } from "../../lib/utils"

export interface TreeNode {
    id: string
    label: React.ReactNode
    icon?: React.ReactNode
    children?: TreeNode[]
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {
    nodes: TreeNode[]
    /** Controlled set of expanded ids. */
    expanded?: Set<string>
    onExpandedChange?: (expanded: Set<string>) => void
    /** Default-expanded ids when uncontrolled. */
    defaultExpanded?: string[]
    /** Selected id. */
    selectedId?: string
    /** Selected ids for controlled multi-selection display. */
    selectedIds?: Iterable<string>
    /** Selection semantics used for aria state and selected row styling. */
    selectionMode?: "single" | "multiple" | "none"
    onSelectedIdChange?: (id: string) => void
    /**
     * Optional supplemental content shown after the label, such as item count or file size.
     *
     * **Function prop — pass only from a Client Component**; from a Server Component it breaks `next build`. Render props return JSX, so there is no serializable alternative — wrap in a thin `"use client"` component to pass it from an RSC. (#338)
     */
    renderNodeMeta?: (node: TreeNode) => React.ReactNode
    /**
     * Optional actions rendered at the end of each row.
     *
     * **Function prop — pass only from a Client Component**; from a Server Component it breaks `next build`. Render props return JSX, so there is no serializable alternative — wrap in a thin `"use client"` component to pass it from an RSC. (#338)
     */
    renderNodeActions?: (node: TreeNode) => React.ReactNode
    /** Optional props applied to the row wrapper, useful for drag and drop or instrumentation. */
    getNodeRowProps?: (node: TreeNode) => React.HTMLAttributes<HTMLDivElement> | undefined
}

interface VisibleNode {
    id: string
    hasChildren: boolean
    expanded: boolean
    parentId: string | null
}

function flattenVisible(
    nodes: TreeNode[],
    expanded: Set<string>,
    parentId: string | null = null,
    out: VisibleNode[] = []
): VisibleNode[] {
    for (const node of nodes) {
        const hasChildren = !!node.children && node.children.length > 0
        out.push({ id: node.id, hasChildren, expanded: expanded.has(node.id), parentId })
        if (hasChildren && expanded.has(node.id)) {
            flattenVisible(node.children!, expanded, node.id, out)
        }
    }
    return out
}

const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
    (
        {
            className,
            nodes,
            expanded: controlledExpanded,
            onExpandedChange,
            defaultExpanded,
            selectedId,
            selectedIds,
            selectionMode = "single",
            onSelectedIdChange,
            renderNodeMeta,
            renderNodeActions,
            getNodeRowProps,
            ...props
        },
        forwardedRef
    ) => {
        const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(
            () => new Set(defaultExpanded ?? [])
        )
        const isControlled = controlledExpanded !== undefined
        const expanded = isControlled ? controlledExpanded : internalExpanded
        const selectedSet = React.useMemo(
            () => (selectedIds ? new Set(selectedIds) : undefined),
            [selectedIds]
        )

        const treeRef = React.useRef<HTMLUListElement>(null)
        React.useImperativeHandle(forwardedRef, () => treeRef.current as HTMLUListElement)

        const [focusedId, setFocusedId] = React.useState<string | undefined>(
            () => selectedId ?? nodes[0]?.id
        )

        const setExpanded = (next: Set<string>) => {
            if (!isControlled) setInternalExpanded(next)
            onExpandedChange?.(next)
        }

        const toggle = (id: string) => {
            const next = new Set(expanded)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            setExpanded(next)
        }

        // Roving tabindex anchor: the focused node if it is currently visible,
        // otherwise the first visible node, so the tree always has one Tab stop.
        const visible = flattenVisible(nodes, expanded)
        const tabbableId =
            focusedId && visible.some((v) => v.id === focusedId)
                ? focusedId
                : visible[0]?.id

        const focusNode = (id: string) => {
            setFocusedId(id)
            treeRef.current
                ?.querySelector<HTMLButtonElement>(`[data-tree-node="${CSS.escape(id)}"]`)
                ?.focus()
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
            if (
                !["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(
                    event.key
                )
            )
                return
            const rows = flattenVisible(nodes, expanded)
            if (rows.length === 0) return
            const activeId =
                (document.activeElement as HTMLElement | null)?.getAttribute?.("data-tree-node") ??
                focusedId
            const idx = rows.findIndex((v) => v.id === activeId)
            const curIdx = idx >= 0 ? idx : 0
            const cur = rows[curIdx]

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault()
                    focusNode(rows[Math.min(curIdx + 1, rows.length - 1)].id)
                    break
                case "ArrowUp":
                    event.preventDefault()
                    focusNode(rows[Math.max(curIdx - 1, 0)].id)
                    break
                case "Home":
                    event.preventDefault()
                    focusNode(rows[0].id)
                    break
                case "End":
                    event.preventDefault()
                    focusNode(rows[rows.length - 1].id)
                    break
                case "ArrowRight":
                    if (cur.hasChildren && !cur.expanded) {
                        event.preventDefault()
                        toggle(cur.id)
                    } else if (cur.hasChildren && cur.expanded && rows[curIdx + 1]) {
                        event.preventDefault()
                        focusNode(rows[curIdx + 1].id)
                    }
                    break
                case "ArrowLeft":
                    if (cur.hasChildren && cur.expanded) {
                        event.preventDefault()
                        toggle(cur.id)
                    } else if (cur.parentId) {
                        event.preventDefault()
                        focusNode(cur.parentId)
                    }
                    break
            }
        }

        return (
            <ul
                ref={treeRef}
                role="tree"
                aria-multiselectable={selectionMode === "multiple" ? true : undefined}
                className={cn("flex flex-col gap-0.5", className)}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {nodes.map((node) => (
                    <TreeViewItem
                        key={node.id}
                        node={node}
                        depth={0}
                        expanded={expanded}
                        onToggle={toggle}
                        selectedId={selectedId}
                        selectedIds={selectedSet}
                        selectionMode={selectionMode}
                        onSelect={onSelectedIdChange}
                        tabbableId={tabbableId}
                        onFocusItem={setFocusedId}
                        renderNodeMeta={renderNodeMeta}
                        renderNodeActions={renderNodeActions}
                        getNodeRowProps={getNodeRowProps}
                    />
                ))}
            </ul>
        )
    }
)
TreeView.displayName = "TreeView"

interface TreeViewItemProps {
    node: TreeNode
    depth: number
    expanded: Set<string>
    onToggle: (id: string) => void
    selectedId?: string
    selectedIds?: Set<string>
    selectionMode: "single" | "multiple" | "none"
    onSelect?: (id: string) => void
    tabbableId?: string
    onFocusItem?: (id: string) => void
    renderNodeMeta?: (node: TreeNode) => React.ReactNode
    renderNodeActions?: (node: TreeNode) => React.ReactNode
    getNodeRowProps?: (node: TreeNode) => React.HTMLAttributes<HTMLDivElement> | undefined
}

function TreeViewItem({
    node,
    depth,
    expanded,
    onToggle,
    selectedId,
    selectedIds,
    selectionMode,
    onSelect,
    tabbableId,
    onFocusItem,
    renderNodeMeta,
    renderNodeActions,
    getNodeRowProps,
}: TreeViewItemProps) {
    const hasChildren = !!node.children && node.children.length > 0
    const isOpen = expanded.has(node.id)
    const isSelected = selectionMode !== "none" && (selectedIds ? selectedIds.has(node.id) : selectedId === node.id)
    const meta = renderNodeMeta?.(node)
    const actions = renderNodeActions?.(node)
    const rowProps = getNodeRowProps?.(node)
    const {
        className: rowClassName,
        style: rowStyle,
        ...rowPropsRest
    } = rowProps ?? {}
    const rowStyleWithIndent = {
        ...rowStyle,
        "--tree-view-indent": `calc(0.5rem + ${depth}rem)`,
    } as React.CSSProperties

    return (
        <li
            role="treeitem"
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={selectionMode !== "none" ? isSelected : undefined}
        >
            <div
                {...rowPropsRest}
                data-tree-view-row
                className={cn(
                    "group flex w-full items-center rounded-md text-sm hover:bg-muted",
                    isSelected && "bg-muted font-medium",
                    rowClassName
                )}
                style={rowStyleWithIndent}
            >
                {/*
                 * The disclosure chevron is its own hit-target so a folder can be
                 * expanded/collapsed WITHOUT selecting/navigating it (it stops
                 * propagation + toggles only). The row button still toggles+selects
                 * as before. Keyboard expand/collapse stays on Left/Right arrows, so
                 * the chevron is mouse-only (tabIndex -1) and not an extra tab stop. (#147)
                 */}
                {hasChildren ? (
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label={isOpen ? "Collapse" : "Expand"}
                        onClick={(event) => {
                            event.stopPropagation()
                            onToggle(node.id)
                        }}
                        className="flex w-4 shrink-0 items-center justify-center self-stretch rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                        )}
                    </button>
                ) : (
                    <span className="w-4 shrink-0" aria-hidden />
                )}
                <button
                    type="button"
                    data-tree-node={node.id}
                    tabIndex={node.id === tabbableId ? 0 : -1}
                    onFocus={() => onFocusItem?.(node.id)}
                    onClick={() => {
                        if (hasChildren) onToggle(node.id)
                        onSelect?.(node.id)
                    }}
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-sm py-1.5 pl-1 pr-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                    {node.icon ? (
                        <span className="flex shrink-0 items-center" aria-hidden>
                            {node.icon}
                        </span>
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{node.label}</span>
                    {meta !== null && meta !== undefined ? (
                        <span className="shrink-0 text-xs font-normal tabular-nums text-muted-foreground">
                            {meta}
                        </span>
                    ) : null}
                </button>
                {actions !== null && actions !== undefined ? (
                    <div className="flex shrink-0 items-center gap-1 pr-1">
                        {actions}
                    </div>
                ) : null}
            </div>
            {hasChildren && isOpen ? (
                <ul role="group" className="flex flex-col gap-0.5">
                    {node.children!.map((child) => (
                        <TreeViewItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expanded={expanded}
                            onToggle={onToggle}
                            selectedId={selectedId}
                            selectedIds={selectedIds}
                            selectionMode={selectionMode}
                            onSelect={onSelect}
                            tabbableId={tabbableId}
                            onFocusItem={onFocusItem}
                            renderNodeMeta={renderNodeMeta}
                            renderNodeActions={renderNodeActions}
                            getNodeRowProps={getNodeRowProps}
                        />
                    ))}
                </ul>
            ) : null}
        </li>
    )
}

export { TreeView }
