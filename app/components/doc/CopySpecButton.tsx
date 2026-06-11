"use client";

import * as React from "react";
import {
    IconCheck as Check,
    IconCopy as Copy,
    IconSparkles as Sparkles,
} from "@tabler/icons-react";
import { TooltipButton, cn, useToast } from "@gunjo/ui";
import { copyTextToClipboard } from "@/components/doc/clipboard";
import { useLocale } from "@/components/providers/LocaleProvider";

interface CopySpecButtonProps {
    /** Pre-built Markdown spec (e.g. via specToMarkdown). */
    markdown: string;
    label?: string;
    copiedLabel?: string;
    copyFailedLabel?: string;
    tooltipLabel?: string;
    className?: string;
}

export function CopySpecButton({
    markdown,
    label = "Copy spec for AI",
    copiedLabel = "Copied",
    copyFailedLabel = "Copy failed",
    tooltipLabel,
    className,
}: CopySpecButtonProps) {
    const [copied, setCopied] = React.useState(false);
    const { locale } = useLocale();
    const { showToast } = useToast();
    const resolvedTooltipLabel =
        tooltipLabel ??
        (locale === "ja"
            ? "このコンポーネントの仕様、Props、使用例を Markdown でコピーします。AI への依頼文に貼り付けて使えます。"
            : "Copies this component's spec, props, and usage as Markdown so you can paste it into an AI prompt.");

    const onClick = React.useCallback(async () => {
        try {
            await copyTextToClipboard(markdown);
            setCopied(true);
            showToast(copiedLabel, "success");
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
            showToast(copyFailedLabel, "error");
        }
    }, [copiedLabel, copyFailedLabel, markdown, showToast]);

    return (
        <TooltipButton
            type="button"
            variant="outline"
            size="sm"
            onClick={onClick}
            tooltip={copied ? copiedLabel : resolvedTooltipLabel}
            tooltipSide="bottom"
            tooltipAlign="end"
            tooltipContentClassName="max-w-[260px] text-left leading-5"
            className={cn("gap-1.5", className)}
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {copiedLabel}
                </>
            ) : (
                <>
                    <Sparkles className="h-3.5 w-3.5" />
                    {label}
                    <Copy className="h-3 w-3 opacity-60" />
                </>
            )}
        </TooltipButton>
    );
}
