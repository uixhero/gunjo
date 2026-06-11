"use client";

import * as React from "react";
import { IconX as X } from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { ChatMessage, type ChatMessageActionKey, type ChatMessageProps } from "../display/ChatMessage";
import { EmptyState } from "../display/EmptyState";
import { ChatInput, type ChatInputLabels, type ChatInputProps } from "../inputs/ChatInput";
import { TooltipButton } from "../inputs/TooltipButton";
import { chatPanelDefaultVariantKey } from "./generated/default-variant-keys";
import type { ChatPanelVariantKey } from "./generated/variant-keys";

const chatPanelVariantClassNames: Record<ChatPanelVariantKey, string> = {
    compact: "h-[420px]",
    default: "h-[560px]",
};

export interface ChatPanelMessage extends Omit<ChatMessageProps, "className"> {
    id: string;
}

export interface ChatPanelLabels {
    close?: string;
    empty?: string;
}

export interface ChatPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    variant?: ChatPanelVariantKey;
    title?: React.ReactNode;
    description?: React.ReactNode;
    messages: ChatPanelMessage[];
    onSend: ChatInputProps["onSend"];
    onStop?: ChatInputProps["onStop"];
    isProcessing?: boolean;
    placeholder?: string;
    enableAttachments?: boolean;
    emptyState?: React.ReactNode;
    welcome?: React.ReactNode;
    onMessageAction?: (
        message: ChatPanelMessage,
        actionKey: ChatMessageActionKey,
        event: React.MouseEvent<HTMLButtonElement>
    ) => void;
    onClose?: () => void;
    labels?: ChatPanelLabels;
    inputLabels?: ChatInputLabels;
}

export function ChatPanel({
    variant = chatPanelDefaultVariantKey,
    title = "Assistant",
    description,
    messages,
    onSend,
    onStop,
    isProcessing = false,
    placeholder,
    enableAttachments = true,
    emptyState,
    welcome,
    onMessageAction,
    onClose,
    labels,
    inputLabels,
    className,
    ...props
}: ChatPanelProps) {
    const messageScrollRef = React.useRef<HTMLDivElement | null>(null);
    const resolvedLabels = {
        close: labels?.close ?? "閉じる",
        empty: labels?.empty ?? "まだメッセージはありません。",
    };

    React.useEffect(() => {
        if (messages.length === 0 && !isProcessing) return;

        const frame = window.requestAnimationFrame(() => {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const scrollElement = messageScrollRef.current;

            if (!scrollElement) return;

            scrollElement.scrollTo({
                top: scrollElement.scrollHeight,
                behavior: reduceMotion ? "auto" : "smooth",
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [isProcessing, messages]);

    return (
        <section
            className={cn(
                "flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border bg-background p-0 shadow-xl",
                chatPanelVariantClassNames[variant],
                className
            )}
            {...props}
        >
            <header className="flex items-start gap-3 border-b bg-muted/50 px-4 py-3">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">{title}</h3>
                    {description ? (
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    ) : null}
                </div>
                {onClose ? (
                    <TooltipButton
                        type="button"
                        tooltip={resolvedLabels.close}
                        aria-label={resolvedLabels.close}
                        variant="ghost"
                        size="icon"
                        className="-mr-2 -mt-1 h-8 w-8 shrink-0"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </TooltipButton>
                ) : null}
            </header>
            <div
                ref={messageScrollRef}
                className={cn(
                    "flex-1 bg-muted/30 p-4",
                    messages.length > 0 || isProcessing ? "overflow-y-auto" : "overflow-hidden"
                )}
            >
                {messages.length > 0 ? (
                    <div className="space-y-3">
                        {messages.map((message) => {
                            const { onAction, ...messageProps } = message;

                            return (
                                <ChatMessage
                                    key={message.id}
                                    {...messageProps}
                                    onAction={(actionKey, event) => {
                                        onAction?.(actionKey, event);
                                        if (!event.defaultPrevented) {
                                            onMessageAction?.(message, actionKey, event);
                                        }
                                    }}
                                />
                            );
                        })}
                        {isProcessing ? (
                            <ChatMessage role="assistant" content="" isTyping />
                        ) : null}
                    </div>
                ) : welcome ? (
                    <div className="flex min-h-full items-end justify-center">
                        {welcome}
                    </div>
                ) : emptyState ? (
                    <div className="flex min-h-full items-center justify-center">
                        {emptyState}
                    </div>
                ) : (
                    <EmptyState
                        className="min-h-full border-dashed bg-background/70"
                        title={resolvedLabels.empty}
                    />
                )}
            </div>
            <div className="bg-muted/30 p-3 sm:p-4">
                <ChatInput
                    onSend={onSend}
                    onStop={onStop}
                    isProcessing={isProcessing}
                    placeholder={placeholder}
                    enableAttachments={enableAttachments}
                    labels={inputLabels}
                />
            </div>
        </section>
    );
}
