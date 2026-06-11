"use client";

import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps, useDragControls } from 'framer-motion';

interface FloatingPanelProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: 'glass' | 'solid' | 'ghost';
    title?: string;
    contentClassName?: string;
    dragEnabled?: boolean;
    resizable?: boolean;
    minWidth?: number;
    minHeight?: number;
    dragHandleClassName?: string;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
    children,
    className,
    variant = 'glass',
    title,
    contentClassName,
    dragEnabled = false,
    resizable = false,
    minWidth = 220,
    minHeight = 140,
    dragHandleClassName,
    drag,
    dragListener,
    dragMomentum,
    style,
    ...props
}) => {
    const dragControls = useDragControls();
    const hasHeaderDragHandle = dragEnabled && Boolean(title);
    const resolvedDrag = drag ?? (dragEnabled ? true : false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag={resolvedDrag}
            dragControls={hasHeaderDragHandle ? dragControls : undefined}
            dragListener={hasHeaderDragHandle ? false : dragListener}
            dragMomentum={dragMomentum ?? false}
            style={{
                minWidth: resizable ? minWidth : undefined,
                minHeight: resizable ? minHeight : undefined,
                ...style,
            }}
            className={cn(
                "relative w-[360px] rounded-2xl border flex flex-col overflow-hidden transition-[box-shadow,border-color,background-color] duration-200 hover:shadow-lg", // Avoid transitioning transform so drag follows the pointer.
                variant === 'glass' && "bg-background/80 backdrop-blur-md border-border/70",
                variant === 'solid' && "bg-background border-border",
                variant === 'ghost' && "bg-transparent border-transparent shadow-none hover:shadow-none",
                dragEnabled && !hasHeaderDragHandle && "cursor-grab active:cursor-grabbing",
                resizable && "resize",
                className
            )}
            {...props}
        >
            {title && (
                <div
                    className={cn(
                        "px-4 py-3 border-b border-border/60 flex items-center justify-between shrink-0",
                        hasHeaderDragHandle && "cursor-grab touch-none select-none active:cursor-grabbing",
                        dragHandleClassName
                    )}
                    onPointerDown={hasHeaderDragHandle ? (event) => dragControls.start(event) : undefined}
                >
                    <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                </div>
            )}
            <div className={cn("flex-1 overflow-auto", contentClassName)}>
                {children}
            </div>
            {resizable && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-1 right-1 h-3 w-3 rounded-br-[10px] border-b border-r border-muted-foreground/40"
                />
            )}
        </motion.div>
    );
};
