"use client"

import React, { memo } from 'react';
import { IconTrash as Trash2, IconChevronRight as ChevronRight } from "@tabler/icons-react";
import { cn } from '../../lib/utils';
import type { SidebarItemVariantKey } from './generated/variant-keys';
import { sidebarItemDefaultVariantKey } from "./generated/default-variant-keys";
import { TooltipButton } from "../inputs/TooltipButton";

export interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
    /**
     * Maps `count` to its accessible meaning so a screen reader hears
     * "Inbox, 4 unread" instead of a detached "4". Defaults to the bare number;
     * pass e.g. `(n) => \`${n} unread\`` for an unread/notification count.
     */
    countLabel?: (count: number) => string;
    isActive: boolean;
    onClick: () => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    dragOverId?: string | null;
    dragAction?: 'nest' | 'reorder-above' | 'reorder-below' | null;
    id: string;
    level?: number;
    hasChildren?: boolean;
    isExpanded?: boolean;
    reserveChevronSpace?: boolean;
    onToggleExpand?: (e: React.MouseEvent) => void;
    onDelete?: (e: React.MouseEvent) => void;
    deleteLabel?: React.ReactNode;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
    className?: string;
}

export const SidebarItem = memo(({
    icon,
    label,
    count,
    countLabel,
    isActive,
    onClick,
    onDrop,
    onDragOver,
    dragOverId,
    dragAction,
    id,
    level = 0,
    hasChildren = false,
    isExpanded = false,
    reserveChevronSpace = true,
    onToggleExpand,
    onDelete,
    deleteLabel = "Delete",
    draggable,
    onDragStart,
    onDragEnd,
    className
}: SidebarItemProps) => {
    const baseVariant: SidebarItemVariantKey = isActive ? "active" : sidebarItemDefaultVariantKey;
    const variantClasses: Record<SidebarItemVariantKey, string> = {
        active: "bg-secondary text-foreground",
        default: "text-muted-foreground hover:bg-muted hover:text-foreground",
    };

    const dragNestClass =
        dragOverId === id && dragAction === "nest"
            ? "bg-primary-subtle text-primary-subtle-foreground ring-2 ring-primary-border shadow-lg shadow-primary-border scale-[1.02] z-10"
            : null;
    const showChevronSlot = hasChildren || reserveChevronSpace;
    const deleteAriaLabel = typeof deleteLabel === "string" ? deleteLabel : undefined;
    // Associate the count with the item in the button's accessible name so it
    // isn't read as a detached number. (#134)
    const resolvedCount =
        count !== undefined ? (countLabel ? countLabel(count) : String(count)) : undefined;
    const buttonAriaLabel = resolvedCount !== undefined ? `${label}, ${resolvedCount}` : undefined;

    return (
        <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={cn(
                "group relative flex h-9 w-full flex-row items-center justify-between rounded-md text-sm cursor-pointer transition-colors",
                dragNestClass ?? variantClasses[baseVariant],
                className
            )}
        >
            {dragOverId === id && dragAction === 'reorder-above' && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none" />
            )}
            {dragOverId === id && dragAction === 'reorder-below' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none" />
            )}
            <button
                type="button"
                onClick={(e) => {
                    onClick();
                    if (hasChildren && onToggleExpand) {
                        onToggleExpand(e);
                    }
                }}
                data-sidebar-item-button
                className="flex h-full min-w-0 flex-1 items-center gap-2 overflow-hidden py-1.5 pr-0 text-left"
                style={{ "--sidebar-item-indent": `calc(0.5rem + ${level}rem)` } as React.CSSProperties}
                aria-current={isActive ? "page" : undefined}
                aria-label={buttonAriaLabel}
            >
                {showChevronSlot ? (
                    <div
                        onClick={(e) => {
                            if (hasChildren && onToggleExpand) {
                                e.stopPropagation();
                                onToggleExpand(e);
                            }
                        }}
                        className={cn(
                            "w-5 h-5 flex items-center justify-center cursor-pointer transition-colors",
                            hasChildren ? "" : "pointer-events-none"
                        )}
                    >
                        {hasChildren && (
                            <ChevronRight size={12} className={cn("transition-transform", isExpanded ? "rotate-90" : "")} />
                        )}
                    </div>
                ) : null}

                <div className={cn("flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
                    {icon}
                </div>
                <span className="truncate" title={label}>{label}</span>
            </button>

            {/* Right Side: Delete + Count */}
            <div className="grid w-14 shrink-0 grid-cols-[1.5rem_1.5rem] items-center justify-end">
                {onDelete ? (
                    <TooltipButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "w-6 h-6 transition-opacity",
                            isActive
                                ? "text-destructive"
                                : "text-muted-foreground/50 hover:text-destructive opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        )}
                        tooltip={deleteLabel}
                        tooltipSide="right"
                        aria-label={deleteAriaLabel}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(e);
                        }}
                    >
                        <Trash2 size={12} />
                    </TooltipButton>
                ) : (
                    <div className="h-6 w-6" aria-hidden />
                )}

                {count !== undefined && (
                    <span aria-hidden="true" className="text-xs opacity-60 w-6 text-center tabular-nums text-muted-foreground translate-y-[0.5px]">{count}</span>
                )}
            </div>
        </div>
    );
});
