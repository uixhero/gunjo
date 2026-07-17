"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from "react-dom";
import { Toast, ToastType, ToastAction } from './Toast';

export interface ShowToastOptions {
    message: string;
    type?: ToastType;
    duration?: number;
    /** Secondary line rendered under `message` in a muted tone. */
    description?: React.ReactNode;
    /** A single action button; activating it runs `onClick` and then closes the toast. */
    action?: ToastAction;
}

interface ShowToast {
    (message: string, type?: ToastType, duration?: number): void;
    (options: ShowToastOptions): void;
}

interface ToastContextType {
    showToast: ShowToast;
}

type ToastEntry = ShowToastOptions & { id: number; isVisible: boolean };

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
    children: React.ReactNode;
    labels?: {
        close?: string;
    };
    portalContainer?: HTMLElement | null;
    placement?: "viewport" | "container";
}

export const ToastProvider = ({ children, labels, portalContainer, placement = "viewport" }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastEntry[]>([]);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const showToast = useCallback((
        messageOrOptions: string | ShowToastOptions,
        type?: ToastType,
        // The positional legacy default stays 3000 (SSOT contract). The object
        // form carries its own duration; when omitted, Toast applies the
        // action-aware default (longer for action toasts). (#301)
        duration = 3000,
    ): void => {
        const options: ShowToastOptions =
            typeof messageOrOptions === "string"
                ? { message: messageOrOptions, type, duration: duration as number }
                : messageOrOptions;
        setToasts(prev => [...prev, { ...options, id: Date.now(), isVisible: true }]);
    }, []) as ShowToast;

    const closeToast = useCallback((id: number) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, isVisible: false } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    }, []);

    const target = placement === "container" ? portalContainer : portalContainer ?? (mounted ? document.body : null);
    const toastStack = (
        <div
            className={
                placement === "container"
                    ? "absolute right-3 top-3 z-[100] flex w-[min(360px,calc(100%-1.5rem))] flex-col items-stretch gap-2 pointer-events-none"
                    : "fixed left-4 right-4 top-[72px] z-[100] flex flex-col items-stretch gap-2 pointer-events-none sm:left-auto sm:right-6 sm:w-[360px]"
            }
        >
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    description={toast.description}
                    action={toast.action}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={() => closeToast(toast.id)}
                    duration={toast.duration}
                    placement="inline"
                    closeLabel={labels?.close}
                    tooltipPortalContainer={portalContainer}
                />
            ))}
        </div>
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {target ? createPortal(toastStack, target) : null}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
