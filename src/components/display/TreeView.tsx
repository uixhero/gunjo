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
    /** Optional supplemental content shown after the label, such as item count or file size. */
    renderNodeMeta?: (node: TreeNode) => React.ReactNode
    /** Optional actions rendered at the end of each row. */
    renderNodeActions?: (node: TreeNode) => React.ReactNode
    /** Optional props applied to the row wrapper, useful for drag and drop or instrumentation. */
    getNodeRowProps?: (node: TreeNode) => React.HTMLAttributes<HTMLDivElement> | undefined
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
        ref
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

        return (
            <ul
                ref={ref}
                role="tree"
                aria-multiselectable={selectionMode === "multiple" ? true : undefined}
                className={cn("flex flex-col gap-0.5", className)}
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
                <button
                    type="button"
                    onClick={() => {
                        if (hasChildren) onToggle(node.id)
                        onSelect?.(node.id)
                    }}
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-sm py-1.5 pr-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                    {hasChildren ? (
                        isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )
                    ) : (
                        <span className="w-3.5 shrink-0" aria-hidden />
                    )}
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
