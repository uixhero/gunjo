"use client";

import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger, cn } from "@gunjo/ui";

interface DisabledReasonTooltipProps {
    reason: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    fullWidth?: boolean;
}

export function DisabledReasonTooltip({
    reason,
    children,
    className,
    contentClassName,
    fullWidth = false,
}: DisabledReasonTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(fullWidth ? "flex w-full max-w-full [&>*]:w-full" : "inline-flex max-w-full", className)}
                    tabIndex={0}
                    aria-label={typeof reason === "string" ? reason : undefined}
                >
                    {children}
                </div>
            </TooltipTrigger>
            <TooltipContent className={cn("max-w-64 text-left", contentClassName)}>
                {reason}
            </TooltipContent>
        </Tooltip>
    );
}
