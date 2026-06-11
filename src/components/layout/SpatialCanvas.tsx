import React from 'react';
import { cn } from '../../lib/utils';

interface SpatialCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gridSize?: number;
}

export const SpatialCanvas = React.forwardRef<HTMLDivElement, SpatialCanvasProps>(({
    children,
    className,
    gridSize = 20,
    style,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "relative flex h-full min-h-0 w-full min-w-0 select-none flex-col overflow-hidden bg-muted/50",
                className
            )}
            style={{
                ...style,
                backgroundImage: `radial-gradient(circle, hsl(var(--foreground) / 0.08) 1px, transparent 1px)`,
                backgroundSize: `${gridSize}px ${gridSize}px`
            }}
            {...props}
        >
            <div className="absolute inset-0 pointer-events-none dark:opacity-20 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(to right, hsl(var(--foreground) / 0.07) 1px, transparent 1px),
                                    linear-gradient(to bottom, hsl(var(--foreground) / 0.07) 1px, transparent 1px)`,
                    backgroundSize: `${gridSize * 5}px ${gridSize * 5}px`
                }}
            />
            {children}
        </div>
    );
});
SpatialCanvas.displayName = 'SpatialCanvas';
