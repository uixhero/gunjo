"use client";

import React from 'react';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../overlay/Tooltip';
import type { ToolPillVariantKey } from "./generated/variant-keys";
import { toolPillDefaultVariantKey } from "./generated/default-variant-keys";

type ToolPillIcon = React.ComponentType<{
    className?: string;
    size?: string | number;
    strokeWidth?: string | number;
}>;

type ToolPillTooltipSide = "top" | "right" | "bottom" | "left";

interface ToolPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ToolPillIcon;
    label?: string;
    isActive?: boolean;
    variant?: ToolPillVariantKey;
    size?: 'sm' | 'md' | 'lg';
    tooltipSide?: ToolPillTooltipSide;
}

export const ToolPill: React.FC<ToolPillProps> = ({
    icon: Icon,
    label,
    isActive,
    variant = toolPillDefaultVariantKey,
    size = 'md',
    tooltipSide = 'top',
    className,
    ...props
}) => {
    const { disabled, "aria-label": ariaLabel } = props;
    const sizeClasses = {
        sm: 'h-8 w-8 rounded-lg p-1.5',
        md: 'h-10 w-10 rounded-xl p-2.5',
        lg: 'h-12 w-12 rounded-xl p-3.5',
    };

    const iconSizes = {
        sm: 14,
        md: 18,
        lg: 22,
    };

    const variantClasses: Record<ToolPillVariantKey, { inactive: string; active: string }> = {
        primary: {
            inactive: "bg-primary-subtle text-primary-subtle-foreground hover:bg-primary-subtle hover:shadow-md hover:-translate-y-0.5",
            active: "bg-primary text-primary-foreground shadow-lg shadow-primary-border ring-2 ring-primary-border",
        },
        secondary: {
            inactive: "bg-background/70 text-muted-foreground hover:bg-background hover:shadow-md hover:-translate-y-0.5",
            active: "bg-secondary text-secondary-foreground shadow-lg shadow-foreground/10 ring-2 ring-border",
        },
        danger: {
            inactive: "bg-destructive-subtle text-destructive-subtle-foreground hover:bg-destructive-subtle hover:shadow-md hover:-translate-y-0.5",
            active: "bg-destructive-strong text-destructive-strong-foreground shadow-lg shadow-destructive-border ring-2 ring-destructive-border",
        },
    };

    const button = (
        <button
            type="button"
            className={cn(
                "group relative flex items-center justify-center transition-all duration-200",
                isActive ? variantClasses[variant].active : variantClasses[variant].inactive,

                sizeClasses[size],
                className
            )}
            {...props}
            aria-label={ariaLabel ?? label}
        >
            <Icon size={iconSizes[size]} strokeWidth={isActive ? 2.5 : 2} />

            {label && (
                <span className="sr-only">{label}</span>
            )}
        </button>
    );

    if (!label) return button;

    const trigger = disabled ? (
        <span className="inline-flex" tabIndex={0} aria-label={label}>
            {button}
        </span>
    ) : button;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side={tooltipSide} className="text-xs">
                {label}
            </TooltipContent>
        </Tooltip>
    );
};
