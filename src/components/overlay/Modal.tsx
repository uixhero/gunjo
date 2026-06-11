"use client"
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconX as X } from "@tabler/icons-react";
import { cn } from '../../lib/utils';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    portalContainer?: HTMLElement | null;
    closeLabel?: string;
    overlayClassName?: string;
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    portalContainer,
    closeLabel = "Close",
    overlayClassName,
    className,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen && !portalContainer) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            if (!portalContainer) {
                document.body.style.overflow = 'unset';
            }
        };
    }, [isOpen, onClose, portalContainer]);

    if (!isOpen) return null;

    const content = (
        <div
            data-prevent-deselect="true"
            className={cn(
                "fixed inset-0 z-[9999] flex items-center justify-center bg-overlay/60 backdrop-blur-sm animate-in fade-in duration-200",
                portalContainer && "absolute",
                overlayClassName
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "mx-4 flex w-[448px] max-w-md max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl animate-in zoom-in-95 duration-200",
                    className
                )}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="min-w-0 pr-3 font-semibold text-foreground">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label={closeLabel}
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
                {footer && (
                    <div className="px-4 py-3 bg-muted/50 border-t border-border flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(content, portalContainer ?? document.body);
    }
    return content;
}
