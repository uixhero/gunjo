"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from "react-dom";
import { Toast, ToastType } from './Toast';

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

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
    const [toasts, setToasts] = useState<{ id: number, message: string, type: ToastType, duration: number, isVisible: boolean }[]>([]);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration, isVisible: true }]);
    }, []);

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
