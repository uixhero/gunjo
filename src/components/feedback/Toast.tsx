"use client"
import React, { useEffect, useState } from 'react';
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { cn } from '../../lib/utils'; // Relative path to lib
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../overlay/Tooltip";
import type { ToastVariantKey } from "./generated/variant-keys";
import { toastDefaultVariantKey } from "./generated/default-variant-keys";

type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipContent>;

export type ToastType = ToastVariantKey;

export interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    placement?: "fixed" | "inline";
    closeLabel?: string;
    tooltipPortalContainer?: TooltipContentProps["portalContainer"];
    className?: string;
}

export function Toast({
    message,
    type = toastDefaultVariantKey,
    isVisible,
    onClose,
    duration = 3000,
    placement = "fixed",
    closeLabel = "Close notification",
    tooltipPortalContainer,
    className,
}: ToastProps) {
    const [shouldRender, setShouldRender] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            return;
        }

        if (!shouldRender) return;

        const timer = setTimeout(() => {
            setShouldRender(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [isVisible, shouldRender]);

    if (!shouldRender) return null;

    const icons: Record<ToastVariantKey, React.ReactNode> = {
        success: <IconCircleCheck className="text-success" size={20} stroke={2} />,
        error: <IconAlertTriangle className="text-destructive" size={20} stroke={2} />,
        info: <IconInfoCircle className="text-info" size={20} stroke={2} />
    };

    const bgColors: Record<ToastVariantKey, string> = {
        success: 'bg-success-subtle border-success-border text-success-subtle-foreground',
        error: 'bg-destructive-subtle border-destructive-border text-destructive-subtle-foreground',
        info: 'bg-info-subtle border-info-border text-info-subtle-foreground'
    };

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={cn(
                placement === "fixed" ? "fixed left-4 right-4 top-[72px] z-[9999] sm:left-auto sm:right-6" : "relative",
                bgColors[type],
                "flex w-full max-w-[calc(100vw-2rem)] flex-row items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl duration-300 pointer-events-auto transform-gpu will-change-transform [animation-fill-mode:both] sm:w-[360px] sm:max-w-sm",
                isVisible
                    ? "animate-in slide-in-from-top-5 fade-in-0"
                    : "animate-out slide-out-to-top-5 fade-out-0",
                className
            )}
        >
            {icons[type]}
            <p className="min-w-0 flex-1 break-words text-sm font-medium [overflow-wrap:anywhere]">{message}</p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="ml-auto shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <IconX size={14} stroke={2} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent portalContainer={tooltipPortalContainer}>{closeLabel}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
