"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Progress } from "../feedback/Progress"
import { useLocale } from "../utility/LocaleProvider"
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./Dialog"
import type { ProgressDialogVariantKey } from "./generated/variant-keys"
import { progressDialogDefaultVariantKey } from "./generated/default-variant-keys"

/** Where the title block sits relative to the media. */
const titleBlockClasses: Record<ProgressDialogVariantKey, string> = {
    default: "",
    overlay:
        "absolute inset-x-0 top-0 bg-gradient-to-b from-background/95 via-background/70 to-transparent px-5 pb-12 pt-5 text-foreground sm:px-6 sm:pb-16 sm:pt-6",
}

export interface ProgressDialogProps {
    /**
     * `"default"` stacks the title under the media. `"overlay"` lays the badge,
     * title and description over the top of the media on a background-colour scrim (falls
     * back to `"default"` when there is no media).
     */
    variant?: ProgressDialogVariantKey
    /** Small label beside the title (e.g. a `Badge` saying what is running). */
    badge?: React.ReactNode
    /** Controlled. The caller closes it when the work succeeds, fails or is cancelled. */
    open: boolean
    title: React.ReactNode
    description?: React.ReactNode
    /**
     * The current state in words (e.g. "Drafting the outline"). Rendered in a
     * polite live region — this, not the media, is what assistive tech hears.
     */
    status: React.ReactNode
    /** Small caption above the status (e.g. "Now"). */
    statusLabel?: React.ReactNode
    /**
     * Any 16:9 visual — an `<img>`, a `<picture>`, an inline SVG, a video.
     * Treated as decoration (`aria-hidden`), so it must never be the only
     * progress cue. An animated SVG loaded through `<img>` may ignore the
     * reader's reduced-motion setting; use `<picture>` with a
     * `(prefers-reduced-motion: reduce)` source to swap in a still frame.
     */
    media?: React.ReactNode
    /**
     * Real completion, when the work reports it. Omit it when you do not know:
     * the bar then sweeps without a number instead of inventing a percentage.
     */
    value?: number
    /** Upper bound for `value`. Default 100. */
    max?: number
    /** Screen-reader text for a known `value` (e.g. "3 of 5 files"). */
    valueText?: string
    /** Optional slot below the status. The dialog renders it as-is. */
    aside?: React.ReactNode
    /** Shows an explicit cancel action. Without it, the dialog cannot be dismissed by the user. */
    onCancel?: () => void
    /** Cancel button label. Defaults to the LocaleProvider `cancel` string. */
    cancelLabel?: React.ReactNode
    /** Short note beside the cancel action (e.g. what is kept after cancelling). */
    cancelNote?: React.ReactNode
    /** Render the dialog inside this element instead of `document.body`. */
    portalContainer?: HTMLElement | null
    className?: string
}

const preventDismiss = (event: Event) => event.preventDefault()

/**
 * A modal wait for long-running work: a 16:9 visual, the current state in
 * words, an optional slot and an optional explicit cancel. It never closes on
 * Escape, outside click or a close button — the caller owns `open` and closes
 * it on success, failure or cancel.
 */
const ProgressDialog = React.forwardRef<HTMLDivElement, ProgressDialogProps>(
    (
        {
            variant = progressDialogDefaultVariantKey,
            badge,
            open,
            title,
            description,
            status,
            statusLabel,
            media,
            value,
            max = 100,
            valueText,
            aside,
            onCancel,
            cancelLabel,
            cancelNote,
            portalContainer,
            className,
        },
        ref
    ) => {
        const { strings } = useLocale()
        const known = typeof value === "number" && Number.isFinite(value)
        const progressName = typeof title === "string" ? title : strings.loading
        const overlaid = variant === "overlay" && Boolean(media)
        const titleBlock = (
            <DialogHeader className={cn("space-y-2 pr-0", titleBlockClasses[overlaid ? "overlay" : "default"])}>
                {badge ? <div className="flex">{badge}</div> : null}
                <DialogTitle className={cn(overlaid && "text-xl sm:text-2xl")}>{title}</DialogTitle>
                {description ? (
                    <DialogDescription className={cn(overlaid && "sr-only text-foreground sm:not-sr-only")}>
                        {description}
                    </DialogDescription>
                ) : null}
            </DialogHeader>
        )

        return (
            // Ignore every dismiss request; only the `open` prop changes the state.
            <Dialog open={open} onOpenChange={() => undefined}>
                <DialogContent
                    ref={ref}
                    portalContainer={portalContainer}
                    showCloseButton={false}
                    onEscapeKeyDown={preventDismiss}
                    onPointerDownOutside={preventDismiss}
                    onInteractOutside={preventDismiss}
                    aria-busy="true"
                    className={cn("gap-0 overflow-hidden p-0 sm:max-w-2xl", className)}
                >
                    <DialogBody>
                        {media ? (
                            <div className="relative">
                                <div
                                    aria-hidden="true"
                                    data-slot="media"
                                    className="relative aspect-video w-full overflow-hidden bg-muted [&>picture]:block [&>picture]:h-full [&>picture]:w-full [&>svg]:h-full [&>svg]:w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
                                >
                                    {media}
                                </div>
                                {overlaid ? titleBlock : null}
                            </div>
                        ) : null}
                        <Progress
                            indeterminate={!known}
                            value={known ? value : undefined}
                            max={max}
                            valueText={valueText}
                            aria-label={progressName}
                            tone="primary"
                            className="h-1 rounded-none bg-primary/10"
                        />
                        <div className="space-y-4 p-4 sm:p-6">
                            {overlaid ? null : titleBlock}
                            <div role="status" aria-live="polite" className="rounded-md bg-muted px-4 py-3">
                                {statusLabel ? (
                                    <p className="text-xs font-medium text-muted-foreground">{statusLabel}</p>
                                ) : null}
                                <p className="text-sm font-semibold text-foreground">{status}</p>
                            </div>
                            {aside ? <div data-slot="aside">{aside}</div> : null}
                        </div>
                    </DialogBody>
                    {onCancel ? (
                        <DialogFooter className="items-center border-t px-4 py-3 sm:px-6 sm:py-4">
                            {cancelNote ? (
                                <p className="mr-auto min-w-0 flex-1 text-xs text-muted-foreground">{cancelNote}</p>
                            ) : null}
                            <Button type="button" variant="outline" onClick={onCancel}>
                                {cancelLabel ?? strings.cancel}
                            </Button>
                        </DialogFooter>
                    ) : null}
                </DialogContent>
            </Dialog>
        )
    }
)
ProgressDialog.displayName = "ProgressDialog"

export { ProgressDialog }
