"use client"

import * as React from "react"
import {
    IconFile as FileIcon,
    IconFolder as FolderIcon,
} from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { TreeView, type TreeNode, type TreeViewProps } from "./TreeView"
import { fileTreeDefaultVariantKey } from "./generated/default-variant-keys"
import type { FileTreeVariantKey } from "./generated/variant-keys"

const fileTreeVariantClasses: Record<FileTreeVariantKey, string> = {
    single: "p-0",
    multiple: "p-0",
    actions: "p-0",
}

const fileTreeVariantSelectionModes: Record<FileTreeVariantKey, "single" | "multiple" | "none"> = {
    single: "single",
    multiple: "multiple",
    actions: "single",
}

export interface FileTreeNode {
    id: string
    label: React.ReactNode
    type?: "file" | "folder"
    icon?: React.ReactNode
    children?: FileTreeNode[]
    /** Supplemental row metadata, such as a file size, item count, or sync state. */
    meta?: React.ReactNode
    /** Convenience value for file size metadata. Used when meta is not provided. */
    size?: React.ReactNode
    /** Convenience value for folder count metadata. Used when meta and size are not provided. */
    count?: React.ReactNode
}

export interface FileTreeProps
    extends Omit<
        TreeViewProps,
        | "nodes"
        | "selectedId"
        | "selectedIds"
        | "selectionMode"
        | "onSelectedIdChange"
        | "renderNodeMeta"
        | "renderNodeActions"
        | "getNodeRowProps"
    > {
    nodes: FileTreeNode[]
    variant?: FileTreeVariantKey
    selectionMode?: "single" | "multiple" | "none"
    selectedIds?: Iterable<string>
    defaultSelectedIds?: string[]
    onSelectedIdsChange?: (ids: string[], node: FileTreeNode) => void
    onNodeSelect?: (node: FileTreeNode) => void
    renderNodeMeta?: (node: FileTreeNode) => React.ReactNode
    renderNodeActions?: (node: FileTreeNode) => React.ReactNode
    getNodeRowProps?: (node: FileTreeNode) => React.HTMLAttributes<HTMLDivElement> | undefined
}

function isFolderNode(node: FileTreeNode) {
    return node.type === "folder" || Boolean(node.children?.length)
}

function defaultIconForNode(node: FileTreeNode) {
    return isFolderNode(node) ? (
        <FolderIcon className="h-4 w-4" aria-hidden="true" />
    ) : (
        <FileIcon className="h-4 w-4" aria-hidden="true" />
    )
}

function toTreeNode(node: FileTreeNode): TreeNode {
    return {
        id: node.id,
        label: node.label,
        icon: node.icon ?? defaultIconForNode(node),
        children: node.children?.map(toTreeNode),
    }
}

function collectNodeMap(nodes: FileTreeNode[], map = new Map<string, FileTreeNode>()) {
    for (const node of nodes) {
        map.set(node.id, node)
        if (node.children) collectNodeMap(node.children, map)
    }
    return map
}

function defaultMetaForNode(node: FileTreeNode) {
    if (node.meta !== undefined && node.meta !== null) return node.meta
    if (node.size !== undefined && node.size !== null) return node.size
    if (node.count !== undefined && node.count !== null) return node.count
    return null
}

const FileTree = React.forwardRef<HTMLUListElement, FileTreeProps>(
    (
        {
            nodes,
            variant = fileTreeDefaultVariantKey,
            selectionMode,
            selectedIds,
            defaultSelectedIds,
            onSelectedIdsChange,
            onNodeSelect,
            renderNodeMeta,
            renderNodeActions,
            getNodeRowProps,
            className,
            ...props
        },
        ref
    ) => {
        const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>(
            () => defaultSelectedIds ?? []
        )
        const resolvedSelectionMode = selectionMode ?? fileTreeVariantSelectionModes[variant]
        const isControlled = selectedIds !== undefined
        const selectedList = React.useMemo(
            () => (selectedIds ? Array.from(selectedIds) : internalSelectedIds),
            [internalSelectedIds, selectedIds]
        )
        const selectedSet = React.useMemo(() => new Set(selectedList), [selectedList])
        const treeNodes = React.useMemo(() => nodes.map(toTreeNode), [nodes])
        const nodeMap = React.useMemo(() => collectNodeMap(nodes), [nodes])

        const updateSelection = (node: FileTreeNode) => {
            if (resolvedSelectionMode === "none") {
                onNodeSelect?.(node)
                return
            }

            const nextIds =
                resolvedSelectionMode === "multiple"
                    ? selectedSet.has(node.id)
                        ? selectedList.filter((id) => id !== node.id)
                        : [...selectedList, node.id]
                    : [node.id]

            if (!isControlled) setInternalSelectedIds(nextIds)
            onSelectedIdsChange?.(nextIds, node)
            onNodeSelect?.(node)
        }

        return (
            <TreeView
                ref={ref}
                className={cn("w-full p-0", fileTreeVariantClasses[variant], className)}
                nodes={treeNodes}
                selectedIds={resolvedSelectionMode === "none" ? undefined : selectedSet}
                selectionMode={resolvedSelectionMode}
                onSelectedIdChange={(id) => {
                    const node = nodeMap.get(id)
                    if (node) updateSelection(node)
                }}
                renderNodeMeta={(treeNode) => {
                    const node = nodeMap.get(treeNode.id)
                    if (!node) return null
                    return renderNodeMeta ? renderNodeMeta(node) : defaultMetaForNode(node)
                }}
                renderNodeActions={(treeNode) => {
                    const node = nodeMap.get(treeNode.id)
                    return node && renderNodeActions ? renderNodeActions(node) : null
                }}
                getNodeRowProps={(treeNode) => {
                    const node = nodeMap.get(treeNode.id)
                    return node && getNodeRowProps ? getNodeRowProps(node) : undefined
                }}
                {...props}
            />
        )
    }
)
FileTree.displayName = "FileTree"

export { FileTree }
