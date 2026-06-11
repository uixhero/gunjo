"use client";

import * as React from "react";
import {
    IconCopy as Copy,
    IconCode as Code,
    IconGitBranch as GitBranch,
    IconPencil as Pencil,
    IconSparkles as Sparkles,
    IconUser as User,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { TooltipButton } from "../inputs/TooltipButton";
import { chatMessageDefaultVariantKey } from "./generated/default-variant-keys";
import type { ChatMessageVariantKey } from "./generated/variant-keys";

export type ChatMessageRole = "assistant" | "user" | "system";
export type ChatMessageActionKey = "copy" | "branch" | "raw" | "edit" | (string & {});

const chatMessageVariantClassNames: Record<ChatMessageVariantKey, string> = {
    assistant: "",
    system: "justify-center",
    typing: "",
    user: "flex-row-reverse",
};

export interface ChatMessageAction {
    key: ChatMessageActionKey;
    label: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ChatMessageLabels {
    copy?: string;
    branch?: string;
    raw?: string;
    edit?: string;
    typing?: string;
    positiveFeedback?: string;
    negativeFeedback?: string;
}

export interface ChatMessageProps {
    variant?: ChatMessageVariantKey;
    role: ChatMessageRole;
    content: React.ReactNode;
    copyValue?: string;
    typingMessages?: string[];
    avatarSrc?: string;
    userName?: string;
    timestamp?: string;
    isTyping?: boolean;
    actions?: ChatMessageAction[];
    showActions?: boolean;
    onAction?: (actionKey: ChatMessageActionKey, event: React.MouseEvent<HTMLButtonElement>) => void;
    labels?: ChatMessageLabels;
    className?: string;
}

export interface ChatMessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    actions: ChatMessageAction[];
    align?: "start" | "end";
    onAction?: (actionKey: ChatMessageActionKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ChatMessageActions({
    actions,
    align = "start",
    onAction,
    className,
    ...props
}: ChatMessageActionsProps) {
    if (actions.length === 0) return null;

    return (
        <div
            className={cn(
                "mt-2 flex flex-wrap items-center gap-1",
                align === "end" ? "justify-end" : "justify-start",
                className
            )}
            {...props}
        >
            {actions.map((action) => (
                <TooltipButton
                    key={action.key}
                    type="button"
                    tooltip={action.label}
                    aria-label={typeof action.label === "string" ? action.label : undefined}
                    aria-disabled={action.disabled}
                    variant="ghost"
                    size="xs"
                    className={cn(
                        "h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground",
                        action.disabled && "opacity-50 hover:bg-transparent hover:text-muted-foreground"
                    )}
                    onClick={(event) => {
                        if (action.disabled) {
                            event.preventDefault();
                            return;
                        }
                        action.onClick?.(event);
                        if (!event.defaultPrevented) {
                            onAction?.(action.key, event);
                        }
                    }}
                >
                    {action.icon ? <span className="flex h-3.5 w-3.5 items-center justify-center">{action.icon}</span> : null}
                    <span>{action.label}</span>
                </TooltipButton>
            ))}
        </div>
    );
}

function useTypingMessage(messages: string[], enabled: boolean) {
    const messageKey = messages.join("\u0000");
    const [text, setText] = React.useState(messages[0] ?? "");
    const [caretVisible, setCaretVisible] = React.useState(true);

    React.useEffect(() => {
        const sequence = messageKey.split("\u0000").filter(Boolean);
        const firstMessage = sequence[0] ?? "";

        if (!enabled || sequence.length === 0) {
            setText(firstMessage);
            setCaretVisible(true);
            return;
        }

        const reduceMotion = typeof window !== "undefined"
            && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion || sequence.length === 1) {
            setText(firstMessage);
            setCaretVisible(true);
            return;
        }

        let cancelled = false;
        let timer: number | undefined;
        let messageIndex = 0;
        let charIndex = firstMessage.length;
        let phase: "hold" | "delete" | "type" = "hold";
        let holdToggleCount = 0;
        const getHoldToggleLimit = () => {
            const isLastMessage = messageIndex === sequence.length - 1;
            return isLastMessage ? 8 : 2;
        };

        setText(firstMessage);
        setCaretVisible(true);

        const schedule = (delay: number) => {
            timer = window.setTimeout(tick, delay);
        };

        const tick = () => {
            if (cancelled) return;

            const currentMessage = sequence[messageIndex] ?? "";

            if (phase === "hold") {
                if (holdToggleCount < getHoldToggleLimit()) {
                    holdToggleCount += 1;
                    setCaretVisible((current) => !current);
                    schedule(700);
                    return;
                }

                holdToggleCount = 0;
                setCaretVisible(true);
                phase = "delete";
                schedule(240);
                return;
            }

            if (phase === "delete") {
                setCaretVisible(true);
                if (charIndex > 0) {
                    charIndex -= 1;
                    setText(currentMessage.slice(0, charIndex));
                    schedule(56);
                    return;
                }

                messageIndex = (messageIndex + 1) % sequence.length;
                phase = "type";
                schedule(180);
                return;
            }

            const nextMessage = sequence[messageIndex] ?? "";
            if (charIndex < nextMessage.length) {
                setCaretVisible(true);
                charIndex += 1;
                setText(nextMessage.slice(0, charIndex));
                schedule(58);
                return;
            }

            phase = "hold";
            holdToggleCount = 0;
            setCaretVisible(true);
            schedule(700);
        };

        schedule(700);

        return () => {
            cancelled = true;
            if (timer !== undefined) {
                window.clearTimeout(timer);
            }
        };
    }, [enabled, messageKey]);

    return { text, caretVisible };
}

export function ChatMessage({
    variant,
    role,
    content,
    copyValue,
    typingMessages,
    avatarSrc,
    userName = role === "user" ? "You" : "Assistant",
    timestamp,
    isTyping = false,
    actions,
    showActions = true,
    onAction,
    labels,
    className,
}: ChatMessageProps) {
    const typingFallback = labels?.typing ?? "内容を作成しています...";
    const hasContent = content !== null && content !== undefined && content !== "";
    const isEmptyTyping = isTyping && !hasContent;
    const resolvedVariant = variant ?? (isTyping ? "typing" : role) ?? chatMessageDefaultVariantKey;
    const { text: animatedTypingText, caretVisible } = useTypingMessage(
        typingMessages && typingMessages.length > 0 ? typingMessages : [typingFallback],
        isEmptyTyping
    );

    if (role === "system") {
        return (
            <div className={cn("my-4 inline-flex", chatMessageVariantClassNames[resolvedVariant], className)}>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {content}
                </span>
            </div>
        );
    }

    const isUser = role === "user";
    const actionLabels = {
        copy: labels?.copy ?? "コピー",
        branch: labels?.branch ?? "分岐",
        raw: labels?.raw ?? "Raw",
        edit: labels?.edit ?? "編集",
    };
    const resolvedContent = isEmptyTyping ? animatedTypingText : content;
    const resolvedCopyValue = copyValue ?? (typeof resolvedContent === "string" ? resolvedContent : undefined);
    const defaultActions: ChatMessageAction[] = isUser
        ? [
            {
                key: "copy",
                label: actionLabels.copy,
                icon: <Copy className="h-3.5 w-3.5" />,
            },
            {
                key: "edit",
                label: actionLabels.edit,
                icon: <Pencil className="h-3.5 w-3.5" />,
            },
        ]
        : [
            {
                key: "copy",
                label: actionLabels.copy,
                icon: <Copy className="h-3.5 w-3.5" />,
            },
            {
                key: "branch",
                label: actionLabels.branch,
                icon: <GitBranch className="h-3.5 w-3.5" />,
            },
            {
                key: "raw",
                label: actionLabels.raw,
                icon: <Code className="h-3.5 w-3.5" />,
            },
        ];
    const resolvedActions = actions ?? defaultActions;

    const handleAction = React.useCallback(
        (actionKey: ChatMessageActionKey, event: React.MouseEvent<HTMLButtonElement>) => {
            if (actionKey === "copy" && resolvedCopyValue && navigator.clipboard) {
                void navigator.clipboard.writeText(resolvedCopyValue).catch(() => undefined);
            }
            onAction?.(actionKey, event);
        },
        [onAction, resolvedCopyValue]
    );

    return (
        <div
            className={cn(
                "inline-flex w-full max-w-full gap-4 p-4",
                chatMessageVariantClassNames[resolvedVariant],
                className
            )}
        >
            <div className={cn("shrink-0", isUser ? "mt-1" : "mt-0.5")}>
                <Avatar
                    className={cn(
                        "h-8 w-8",
                        isUser
                            ? "ring-2 ring-primary-border"
                            : "bg-primary text-primary-foreground"
                    )}
                >
                    {avatarSrc ? (
                        <AvatarImage src={avatarSrc} alt={userName} />
                    ) : (
                        <AvatarFallback
                            className={cn(
                                isUser
                                    ? "bg-background text-muted-foreground"
                                    : "bg-transparent text-primary-foreground"
                            )}
                        >
                            {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        </AvatarFallback>
                    )}
                </Avatar>
            </div>

            <div className={cn("flex min-w-0 flex-col", isUser ? "max-w-[82%] items-end" : "max-w-[min(100%,42rem)] flex-1 items-start")}>
                <div className="mb-1 flex max-w-full items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{userName}</span>
                    {timestamp ? (
                        <span className="shrink-0 text-xs text-muted-foreground">{timestamp}</span>
                    ) : null}
                </div>

                <div
                    className={cn(
                        "min-w-0 text-sm leading-relaxed",
                        typeof resolvedContent === "string" && "whitespace-pre-wrap",
                        isUser
                            ? "rounded-2xl rounded-tr-sm border border-border/70 bg-accent/60 px-4 py-3 text-foreground shadow-sm"
                            : "w-full text-foreground"
                    )}
                >
                    {resolvedContent}
                    {isTyping ? (
                        <span
                            aria-hidden="true"
                            className={cn(
                                "ml-1 inline-block h-4 w-1.5 bg-current align-middle",
                                isEmptyTyping && !caretVisible && "opacity-0"
                            )}
                        />
                    ) : null}
                </div>

                {showActions && !isTyping ? (
                    <ChatMessageActions
                        actions={resolvedActions}
                        align={isUser ? "end" : "start"}
                        onAction={handleAction}
                    />
                ) : null}
            </div>
        </div>
    );
}
