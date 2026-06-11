"use client"
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconX as X, IconCopy as Copy, IconGlobe as Globe, IconLock as Lock, IconCheck as Check, IconExternalLink as ExternalLink } from "@tabler/icons-react";
import { cn } from '../../lib/utils';
import { Button } from '../inputs/Button';
import { Switch } from '../inputs/Switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

export interface ShareData {
    isPublic: boolean;
    token?: string;
    accessCount?: number;
    createdAt?: string;
}

export interface ShareableItem {
    id: string;
    share?: ShareData;
    [key: string]: any;
}

export interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ShareableItem;
    onUpdate: (id: string, updates: Partial<ShareableItem>) => void;
    apiEndpoint?: string; // Allow customizing API endpoint
    onToggleShare?: (id: string, enable: boolean) => ShareData | Promise<ShareData>;
    onCopyShareUrl?: (url: string) => void | Promise<void>;
    onOpenShareUrl?: (url: string) => void | Promise<void>;
    portalContainer?: HTMLElement | null;
    labels?: {
        title?: string;
        publicLink?: string;
        publicDescription?: string;
        privateDescription?: string;
        publicUrl?: string;
        sharingDisabled?: string;
        accessCount?: string;
        token?: string;
        copy?: string;
        copied?: string;
        copyFailed?: string;
        open?: string;
        openPreview?: string;
        close?: string;
        enablePublicLink?: string;
        disablePublicLink?: string;
        sharingDisabledReason?: string;
    };
}

async function writeClipboardText(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error("Failed to copy share URL");
    }
}

export const ShareModal = ({
    isOpen,
    onClose,
    item,
    onUpdate,
    apiEndpoint = '/api/share',
    onToggleShare,
    onCopyShareUrl,
    onOpenShareUrl,
    portalContainer,
    labels,
}: ShareModalProps) => {
    const titleId = React.useId();
    const [isPublic, setIsPublic] = useState(item.share?.isPublic || false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareData, setShareData] = useState<ShareData | undefined>(item.share);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setIsPublic(item.share?.isPublic || false);
        setShareData(item.share);
    }, [item.id, item.share]);

    if (!isOpen || !mounted) return null;

    const handleToggleShare = async () => {
        setIsLoading(true);
        try {
            const nextIsPublic = !isPublic;
            const nextShare = onToggleShare
                ? await onToggleShare(item.id, nextIsPublic)
                : (await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: item.id,
                        enable: nextIsPublic
                    })
                }).then((res) => res.ok ? res.json() : Promise.reject(new Error("Failed to toggle share")))).share;

            setIsPublic(nextIsPublic);
            setShareData(nextShare);
            onUpdate(item.id, { share: nextShare });
        } catch (error) {
            console.error('Failed to toggle share', error);
        } finally {
            setIsLoading(false);
        }
    };

    const shareUrl = shareData?.token
        ? `${window.location.origin}/share/${shareData.token}`
        : '';

    const handleCopy = async () => {
        if (!shareUrl) return;

        try {
            if (onCopyShareUrl) {
                await onCopyShareUrl(shareUrl);
            } else {
                await writeClipboardText(shareUrl);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy share URL', error);
        }
    };

    const handleOpen = async () => {
        if (!shareUrl) return;

        if (onOpenShareUrl) {
            await onOpenShareUrl(shareUrl);
            return;
        }

        window.open(shareUrl, "_blank", "noopener,noreferrer");
    };

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 backdrop-blur-sm animate-in fade-in duration-200",
                portalContainer && "absolute"
            )}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <div
                className="mx-4 w-[448px] max-w-md max-w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                    <h3 id={titleId} className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Globe size={16} className="text-primary" />
                        {labels?.title ?? "Share Image"}
                    </h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="h-8 w-8 text-muted-foreground"
                                    aria-label={labels?.close ?? "Close"}
                                >
                                    <X size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent portalContainer={portalContainer}>
                                {labels?.close ?? "Close"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">{labels?.publicLink ?? "Public Link"}</div>
                            <div className="text-xs text-muted-foreground">
                                {isPublic
                                    ? labels?.publicDescription ?? "Anyone with the link can view this image."
                                    : labels?.privateDescription ?? "Only you can view this image."}
                            </div>
                        </div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Switch
                                        checked={isPublic}
                                        onCheckedChange={handleToggleShare}
                                        disabled={isLoading}
                                        aria-label={
                                            isPublic
                                                ? labels?.disablePublicLink ?? "Turn public link off"
                                                : labels?.enablePublicLink ?? "Turn public link on"
                                        }
                                    />
                                </TooltipTrigger>
                                <TooltipContent portalContainer={portalContainer}>
                                    {isPublic
                                        ? labels?.disablePublicLink ?? "Turn public link off"
                                        : labels?.enablePublicLink ?? "Turn public link on"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* URL Display */}
                    {isPublic && shareData && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <label className="text-xs font-medium text-muted-foreground">{labels?.publicUrl ?? "Public URL"}</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-xs text-muted-foreground font-mono truncate select-all">
                                    {shareUrl}
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                onClick={handleCopy}
                                                className="h-9 w-9 shrink-0 text-muted-foreground"
                                                aria-label={labels?.copy ?? "Copy to clipboard"}
                                            >
                                                {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent portalContainer={portalContainer}>
                                            {copied ? labels?.copied ?? "Copied" : labels?.copy ?? "Copy to clipboard"}
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                onClick={handleOpen}
                                                className="h-9 w-9 shrink-0 text-muted-foreground"
                                                aria-label={labels?.open ?? "Open in new tab"}
                                            >
                                                <ExternalLink size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent portalContainer={portalContainer}>
                                            {labels?.openPreview ?? labels?.open ?? "Open in new tab"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Globe size={12} />
                                    <span>{labels?.accessCount ?? "Access Count"}: <span className="text-foreground font-mono">{shareData.accessCount || 0}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Lock size={12} />
                                    <span>{labels?.token ?? "Token"}: <span className="text-foreground font-mono">{shareData.token?.slice(0, 8)}...</span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isPublic && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="flex cursor-help flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-border bg-muted/50 py-4 text-muted-foreground"
                                        tabIndex={0}
                                    >
                                        <Lock size={24} />
                                        <span className="text-xs">{labels?.sharingDisabled ?? "Sharing is disabled"}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent portalContainer={portalContainer}>
                                    {labels?.sharingDisabledReason ?? "Turn on the public link switch to create a share URL."}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                </div>
            </div>
        </div>,
        portalContainer ?? document.body
    );
};
