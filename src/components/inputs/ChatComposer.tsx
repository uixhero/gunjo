"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChatInput, type ChatInputProps } from "./ChatInput";
import { chatComposerDefaultVariantKey } from "./generated/default-variant-keys";
import type { ChatComposerVariantKey } from "./generated/variant-keys";

const chatComposerVariantClassNames: Record<ChatComposerVariantKey, string> = {
    context: "",
    default: "",
    prompt: "",
};

export interface ChatComposerLabels {
    context?: string;
    prompt?: string;
    status?: string;
}

export interface ChatComposerProps extends React.HTMLAttributes<HTMLElement> {
    variant?: ChatComposerVariantKey;
    inputProps: ChatInputProps;
    context?: React.ReactNode;
    prompt?: React.ReactNode;
    status?: React.ReactNode;
    footer?: React.ReactNode;
    accessory?: React.ReactNode;
    labels?: ChatComposerLabels;
}

export function ChatComposer({
    variant = chatComposerDefaultVariantKey,
    inputProps,
    context,
    prompt,
    status,
    footer,
    accessory,
    labels,
    className,
    ...props
}: ChatComposerProps) {
    return (
        <section
            className={cn("inline-flex w-full flex-col items-center gap-3 [&>*]:w-full", chatComposerVariantClassNames[variant], className)}
            {...props}
        >
            {context ? (
                <div aria-label={labels?.context} className="space-y-2">
                    {context}
                </div>
            ) : null}
            {prompt ? (
                <div aria-label={labels?.prompt} className="space-y-2">
                    {prompt}
                </div>
            ) : null}
            {status ? (
                <div aria-label={labels?.status} className="space-y-2">
                    {status}
                </div>
            ) : null}
            <div className={cn("relative", accessory && "pt-6")}>
                {accessory ? (
                    <div className="pointer-events-none absolute right-8 top-0 z-10">
                        {accessory}
                    </div>
                ) : null}
                <ChatInput {...inputProps} />
            </div>
            {footer ? <div>{footer}</div> : null}
        </section>
    );
}
