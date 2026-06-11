"use client"

import * as React from "react"
import { IconCheck as Check, IconCopy as Copy } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Icon } from "../display/Icon"
import type { IconVariantKey } from "../display/generated/variant-keys"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Button } from "./Button"
import { copyButtonDefaultVariantKey } from "./generated/default-variant-keys"
import type { CopyButtonVariantKey } from "./generated/variant-keys"
import type { TooltipButtonProps } from "./TooltipButton"

export interface CopyButtonProps
    extends Omit<TooltipButtonProps, "children" | "tooltip" | "onClick" | "variant"> {
    /** Text copied to the clipboard. */
    value: string
    /** Visual feedback style for the copy action. */
    variant?: CopyButtonVariantKey
    /** Button surface variant forwarded to TooltipButton. Default ghost. */
    buttonVariant?: TooltipButtonProps["variant"]
    /** Accessible label and tooltip before copying. */
    copyLabel?: string
    /** Accessible label and tooltip after copying. */
    copiedLabel?: string
    /** Accessible label and tooltip when copying fails. */
    copyFailedLabel?: string
    /** Duration in milliseconds to keep copied feedback visible. Default 5000. */
    copiedDuration?: number
    iconSize?: IconVariantKey
    onCopied?: () => void
    onCopyError?: (error: unknown) => void
}

const copyButtonFeedbackByVariant: Record<CopyButtonVariantKey, "icon" | "label"> = {
    default: "icon",
    label: "label",
}

async function copyTextToClipboard(value: string) {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(value)
            return
        } catch {
            // Browser previews can deny Clipboard API access; keep the UI usable with the legacy fallback.
        }
    }

    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.setAttribute("readonly", "")
    textarea.className = "sr-only"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
    (
        {
            value,
            copyLabel = "Copy",
            copiedLabel = "Copied",
            copyFailedLabel = "Copy failed",
            copiedDuration = 5000,
            variant = copyButtonDefaultVariantKey,
            buttonVariant = "ghost",
            iconSize = "xs",
            onCopied,
            onCopyError,
            className,
            size,
            type = "button",
            tooltipSide,
            tooltipAlign,
            tooltipSideOffset,
            tooltipContentClassName,
            ...props
        },
        ref
    ) => {
        const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle")
        const [feedbackOpen, setFeedbackOpen] = React.useState(false)
        const timeoutRef = React.useRef<number | null>(null)

        React.useEffect(
            () => () => {
                if (timeoutRef.current) {
                    window.clearTimeout(timeoutRef.current)
                }
            },
            []
        )

        const showCopied = state === "copied"
        const showFailed = state === "failed"
        const resolvedFeedback = copyButtonFeedbackByVariant[variant]
        const feedbackLabel = showCopied ? copiedLabel : showFailed ? copyFailedLabel : copyLabel

        const handleCopy = async () => {
            try {
                await copyTextToClipboard(value)
                setState("copied")
                setFeedbackOpen(true)
                onCopied?.()
            } catch (error) {
                setState("failed")
                setFeedbackOpen(true)
                onCopyError?.(error)
            }

            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = window.setTimeout(() => {
                setState("idle")
                setFeedbackOpen(false)
            }, copiedDuration)
        }

        return (
            <Tooltip>
                <span className="relative inline-flex">
                    <TooltipTrigger asChild>
                        <Button
                            ref={ref}
                            type={type}
                            variant={buttonVariant}
                            size={size ?? (resolvedFeedback === "label" ? "sm" : "icon")}
                            onClick={handleCopy}
                            aria-label={copyLabel}
                            className={cn(
                                resolvedFeedback === "label" ? "w-auto gap-1.5" : null,
                                className
                            )}
                            {...props}
                        >
                            <span className="relative inline-grid shrink-0 place-items-center">
                                <Icon
                                    icon={Copy}
                                    size={iconSize}
                                    className={cn(
                                        "transition-all duration-200 ease-out motion-reduce:transition-none",
                                        showCopied ? "scale-75 rotate-6 opacity-0" : "scale-100 rotate-0 opacity-100"
                                    )}
                                />
                                <Icon
                                    icon={Check}
                                    size={iconSize}
                                    className={cn(
                                        "absolute transition-all duration-200 ease-out motion-reduce:transition-none",
                                        showCopied ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-6 opacity-0"
                                    )}
                                />
                            </span>
                            {resolvedFeedback === "label" ? <span>{feedbackLabel}</span> : null}
                        </Button>
                    </TooltipTrigger>
                    {feedbackOpen ? (
                        <span
                            className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-2 w-max max-w-xs -translate-x-1/2 rounded-md border bg-popover px-3 py-1.5 text-center text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none"
                            role="status"
                        >
                            {feedbackLabel}
                        </span>
                    ) : null}
                </span>
                {!feedbackOpen ? (
                    <TooltipContent
                        side={tooltipSide}
                        align={tooltipAlign}
                        sideOffset={tooltipSideOffset}
                        className={tooltipContentClassName}
                    >
                        {copyLabel}
                    </TooltipContent>
                ) : null}
            </Tooltip>
        )
    }
)
CopyButton.displayName = "CopyButton"

export { CopyButton }
