"use client";

import * as React from "react";
import {
    IconAdjustmentsHorizontal as Adjustments,
    IconPlus as Plus,
    IconSend as Send,
    IconSquare as Square,
    IconX as X,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "../overlay/DropdownMenu";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip";
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import { TooltipButton } from "./TooltipButton";
import { VoiceInputButton } from "./VoiceInputButton";
import { buttonDefaultVariantKey, chatInputDefaultVariantKey } from "./generated/default-variant-keys";
import type { ChatInputVariantKey } from "./generated/variant-keys";

const chatInputVariantClassNames: Record<ChatInputVariantKey, string> = {
    default: "",
    processing: "border-primary-border bg-primary-subtle",
};

export interface ChatInputLabels {
    attach?: string;
    options?: string;
    model?: string;
    voice?: string;
    send?: string;
    stop?: string;
    removeAttachment?: string;
    emptyMessage?: string;
    disabled?: string;
    voiceActive?: string;
    voiceRequesting?: string;
    voiceUnsupported?: string;
    voicePermissionDenied?: string;
    voiceError?: string;
}

export interface ChatInputModelOption {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
}

export interface ChatInputProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit"> {
    variant?: ChatInputVariantKey;
    onSend: (message: string, files?: File[]) => void;
    onStop?: () => void;
    isProcessing?: boolean;
    enableAttachments?: boolean;
    showOptionsButton?: boolean;
    showModelSelector?: boolean;
    showVoiceButton?: boolean;
    toolbarAccessory?: React.ReactNode;
    modelLabel?: React.ReactNode;
    onOptionsClick?: () => void;
    onModelClick?: () => void;
    onVoiceClick?: () => void;
    optionsContent?: React.ReactNode;
    optionsOpen?: boolean;
    defaultOptionsOpen?: boolean;
    onOptionsOpenChange?: (open: boolean) => void;
    modelOptions?: ChatInputModelOption[];
    modelValue?: string;
    defaultModelValue?: string;
    onModelValueChange?: (value: string) => void;
    voiceActive?: boolean;
    defaultVoiceActive?: boolean;
    onVoiceActiveChange?: (active: boolean) => void;
    labels?: ChatInputLabels;
}

export function ChatInput({
    variant,
    onSend,
    onStop,
    isProcessing = false,
    placeholder = "メッセージを入力...",
    enableAttachments = true,
    showOptionsButton = true,
    showModelSelector = true,
    showVoiceButton = true,
    toolbarAccessory,
    modelLabel,
    onOptionsClick,
    onModelClick,
    onVoiceClick,
    optionsContent,
    optionsOpen,
    defaultOptionsOpen = false,
    onOptionsOpenChange,
    modelOptions = [],
    modelValue,
    defaultModelValue,
    onModelValueChange,
    voiceActive,
    defaultVoiceActive = false,
    onVoiceActiveChange,
    labels,
    className,
    disabled,
    ...props
}: ChatInputProps) {
    const [message, setMessage] = React.useState("");
    const [files, setFiles] = React.useState<File[]>([]);
    const [uncontrolledOptionsOpen, setUncontrolledOptionsOpen] = React.useState(defaultOptionsOpen);
    const [uncontrolledModelValue, setUncontrolledModelValue] = React.useState(
        defaultModelValue ?? modelOptions[0]?.value ?? ""
    );
    const [uncontrolledVoiceActive, setUncontrolledVoiceActive] = React.useState(defaultVoiceActive);
    const [optionTooltipOpen, setOptionTooltipOpen] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const isComposingRef = React.useRef(false);
    const resolvedVariant = variant ?? (isProcessing ? "processing" : chatInputDefaultVariantKey);

    const resolvedLabels = {
        attach: labels?.attach ?? "ファイルを添付",
        options: labels?.options ?? "入力オプション",
        model: labels?.model ?? "モデルを選択",
        voice: labels?.voice ?? "音声入力",
        send: labels?.send ?? "送信",
        stop: labels?.stop ?? "生成を停止",
        removeAttachment: labels?.removeAttachment ?? "添付を削除",
        emptyMessage: labels?.emptyMessage ?? "メッセージを入力すると送信できます。",
        disabled: labels?.disabled ?? "現在は入力できません。",
        voiceActive: labels?.voiceActive ?? "録音を停止",
        voiceRequesting: labels?.voiceRequesting ?? "マイクのアクセス権を確認しています。",
        voiceUnsupported: labels?.voiceUnsupported ?? "このブラウザは音声入力に対応していません。",
        voicePermissionDenied: labels?.voicePermissionDenied ?? "マイクのアクセス権が許可されていません。",
        voiceError: labels?.voiceError ?? "音声入力を開始できませんでした。",
    };

    const filePreviews = React.useMemo(
        () =>
            files.map((file) => ({
                file,
                url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
            })),
        [files]
    );

    React.useEffect(() => {
        return () => {
            for (const preview of filePreviews) {
                if (preview.url) URL.revokeObjectURL(preview.url);
            }
        };
    }, [filePreviews]);

    const adjustHeight = React.useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }, []);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
        adjustHeight();
        props.onChange?.(event);
    };

    const appendTranscript = React.useCallback(
        (transcript: string) => {
            const normalizedTranscript = transcript.trim();
            if (!normalizedTranscript) return;
            setMessage((currentMessage) => {
                if (!currentMessage.trim()) return normalizedTranscript;
                return `${currentMessage.trimEnd()} ${normalizedTranscript}`;
            });
            window.requestAnimationFrame(adjustHeight);
        },
        [adjustHeight]
    );

    const handleCompositionStart = (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        isComposingRef.current = true;
        props.onCompositionStart?.(event);
    };

    const handleCompositionEnd = (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        isComposingRef.current = false;
        props.onCompositionEnd?.(event);
    };

    const resetMessage = React.useCallback(() => {
        setMessage("");
        setFiles([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, []);

    const handleSend = React.useCallback(() => {
        const value = message.trim();
        if ((!value && files.length === 0) || isProcessing || disabled) return;
        onSend(value, files.length > 0 ? files : undefined);
        resetMessage();
    }, [disabled, files, isProcessing, message, onSend, resetMessage]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const nativeEvent = event.nativeEvent as KeyboardEvent & { isComposing?: boolean };
        const isComposing = isComposingRef.current || nativeEvent.isComposing || nativeEvent.keyCode === 229;
        if (event.key === "Enter" && !event.shiftKey && !isComposing) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
        if (selectedFiles.length === 0) return;
        setFiles((current) => [...current, ...selectedFiles]);
        event.target.value = "";
    };

    const isDisabled = Boolean(disabled);
    const isOptionsOpenControlled = optionsOpen !== undefined;
    const currentOptionsOpen = isOptionsOpenControlled ? optionsOpen : uncontrolledOptionsOpen;
    const isModelControlled = modelValue !== undefined;
    const currentModelValue = isModelControlled ? modelValue : uncontrolledModelValue;
    const selectedModel = modelOptions.find((option) => option.value === currentModelValue);
    const displayedModelLabel = modelLabel ?? selectedModel?.label ?? modelOptions[0]?.label ?? "自動";
    const isVoiceControlled = voiceActive !== undefined;
    const currentVoiceActive = isVoiceControlled ? voiceActive : uncontrolledVoiceActive;
    const canSend = (message.trim().length > 0 || files.length > 0) && !isProcessing && !isDisabled;
    const shouldShowOptionsButton = showOptionsButton && (Boolean(optionsContent) || Boolean(onOptionsClick));
    const sendDisabledReason = isDisabled
        ? resolvedLabels.disabled
        : resolvedLabels.emptyMessage;

    const handleOptionsOpenChange = (open: boolean) => {
        if (!isOptionsOpenControlled) setUncontrolledOptionsOpen(open);
        if (open) setOptionTooltipOpen(false);
        onOptionsOpenChange?.(open);
    };

    const handleOptionsClick = () => {
        onOptionsClick?.();
    };

    const handleModelValueChange = (value: string) => {
        if (!isModelControlled) setUncontrolledModelValue(value);
        onModelValueChange?.(value);
        onModelClick?.();
    };

    const handleVoiceListeningChange = (active: boolean) => {
        if (!isVoiceControlled) setUncontrolledVoiceActive(active);
        onVoiceActiveChange?.(active);
    };

    const optionButton = (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                "h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground",
                currentOptionsOpen && "bg-accent text-foreground"
            )}
            onClick={handleOptionsClick}
            disabled={isDisabled || isProcessing}
            aria-label={resolvedLabels.options}
            aria-pressed={optionsContent ? currentOptionsOpen : undefined}
        >
            <Adjustments className="h-5 w-5" />
        </Button>
    );

    const modelButton = (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 shrink-0 px-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            onClick={modelOptions.length > 0 ? undefined : onModelClick}
            disabled={isDisabled || isProcessing}
            aria-label={resolvedLabels.model}
        >
            {displayedModelLabel}
        </Button>
    );

    return (
        <div
            className={cn(
                "w-full max-w-full rounded-2xl border border-input bg-background p-3 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
                chatInputVariantClassNames[resolvedVariant],
                isDisabled && "bg-muted/40 opacity-70",
                className
            )}
            onClick={() => textareaRef.current?.focus()}
        >
            {files.length > 0 ? (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1" onClick={(event) => event.stopPropagation()}>
                    {filePreviews.map(({ file, url }, index) => (
                        <div
                            key={`${file.name}-${file.size}-${index}`}
                            className="group relative flex h-16 min-w-16 max-w-44 items-center gap-2 overflow-hidden rounded-lg border bg-muted/50 p-2"
                        >
                            {url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={url}
                                    alt={file.name}
                                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-background text-xs font-medium text-muted-foreground">
                                    {file.name.split(".").pop()?.slice(0, 4).toUpperCase() ?? "FILE"}
                                </div>
                            )}
                            <span className="min-w-0 truncate text-xs font-medium text-foreground">
                                {file.name}
                            </span>
                            <TooltipButton
                                type="button"
                                tooltip={resolvedLabels.removeAttachment}
                                aria-label={resolvedLabels.removeAttachment}
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6 bg-background/80 opacity-0 shadow-sm group-hover:opacity-100 group-focus-within:opacity-100"
                                onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                            >
                                <X className="h-3.5 w-3.5" />
                            </TooltipButton>
                        </div>
                    ))}
                </div>
            ) : null}

            <Textarea
                {...props}
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder={placeholder}
                disabled={isDisabled || isProcessing}
                className="max-h-[15rem] min-h-[3.5rem] w-full resize-none overflow-y-auto rounded-none border-0 bg-transparent px-1 py-2 text-base shadow-none focus-visible:ring-0 disabled:bg-transparent sm:text-sm"
                rows={2}
                onClick={(event) => event.stopPropagation()}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-1" onClick={(event) => event.stopPropagation()}>
                    {enableAttachments ? (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <TooltipButton
                                type="button"
                                tooltip={resolvedLabels.attach}
                                aria-label={resolvedLabels.attach}
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                                onClick={handleUploadClick}
                                disabled={isDisabled || isProcessing}
                            >
                                <Plus className="h-5 w-5" />
                            </TooltipButton>
                        </>
                    ) : null}

                    {shouldShowOptionsButton ? (
                        optionsContent ? (
                            <Popover open={currentOptionsOpen} onOpenChange={handleOptionsOpenChange}>
                                <Tooltip
                                    open={currentOptionsOpen ? false : optionTooltipOpen}
                                    onOpenChange={setOptionTooltipOpen}
                                >
                                    <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>{optionButton}</PopoverTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>{resolvedLabels.options}</TooltipContent>
                                </Tooltip>
                                <PopoverContent align="start" side="top" className="w-72">
                                    {optionsContent}
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <TooltipButton
                                type="button"
                                tooltip={resolvedLabels.options}
                                aria-label={resolvedLabels.options}
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                                onClick={handleOptionsClick}
                                disabled={isDisabled || isProcessing}
                            >
                                <Adjustments className="h-5 w-5" />
                            </TooltipButton>
                        )
                    ) : null}
                </div>

                <div className="flex min-w-0 items-center gap-1" onClick={(event) => event.stopPropagation()}>
                    {showModelSelector ? (
                        modelOptions.length > 0 ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>{modelButton}</DropdownMenuTrigger>
                                <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                                    <DropdownMenuRadioGroup value={currentModelValue} onValueChange={handleModelValueChange}>
                                        {modelOptions.map((option) => (
                                            <DropdownMenuRadioItem key={option.value} value={option.value} className="items-start gap-2">
                                                <span className="min-w-0">
                                                    <span className="block truncate font-medium">{option.label}</span>
                                                    {option.description ? (
                                                        <span className="block truncate text-xs text-muted-foreground">
                                                            {option.description}
                                                        </span>
                                                    ) : null}
                                                </span>
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <TooltipButton
                                type="button"
                                tooltip={resolvedLabels.model}
                                aria-label={resolvedLabels.model}
                                variant="ghost"
                                size="sm"
                                className="h-9 shrink-0 px-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                                onClick={onModelClick}
                                disabled={isDisabled || isProcessing}
                            >
                                {displayedModelLabel}
                            </TooltipButton>
                        )
                    ) : null}

                    {toolbarAccessory ? (
                        <div className="flex shrink-0 items-center">
                            {toolbarAccessory}
                        </div>
                    ) : null}

                    {showVoiceButton ? (
                        <VoiceInputButton
                            onTranscript={appendTranscript}
                            listening={currentVoiceActive}
                            onListeningChange={handleVoiceListeningChange}
                            onToggle={onVoiceClick}
                            disabled={isDisabled || isProcessing}
                            labels={{
                                start: resolvedLabels.voice,
                                stop: resolvedLabels.voiceActive,
                                requesting: resolvedLabels.voiceRequesting,
                                unsupported: resolvedLabels.voiceUnsupported,
                                permissionDenied: resolvedLabels.voicePermissionDenied,
                                error: resolvedLabels.voiceError,
                            }}
                        />
                    ) : null}

                    {isProcessing ? (
                        <TooltipButton
                            type="button"
                            tooltip={resolvedLabels.stop}
                            aria-label={resolvedLabels.stop}
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-full"
                            onClick={onStop}
                        >
                            <Square className="h-4 w-4 fill-current" />
                        </TooltipButton>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="inline-flex shrink-0 rounded-full"
                                    tabIndex={canSend ? -1 : 0}
                                    aria-label={canSend ? resolvedLabels.send : sendDisabledReason}
                                >
                                    <Button
                                        type="button"
                                        variant={buttonDefaultVariantKey}
                                        size="icon"
                                        className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary-strong"
                                        onClick={handleSend}
                                        disabled={!canSend}
                                        aria-label={resolvedLabels.send}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>{canSend ? resolvedLabels.send : sendDisabledReason}</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
}
