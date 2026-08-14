"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { IconX as X } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { TooltipButton } from "../inputs/TooltipButton"
import type { StickyNoticeBarVariantKey } from "./generated/variant-keys"

export type StickyNoticeBarEdge = StickyNoticeBarVariantKey

const stickyNoticeBarEdgeClasses: Record<StickyNoticeBarVariantKey, string> = {
    top: "top-0 border-b pt-[env(safe-area-inset-top)]",
    bottom: "bottom-0 border-t pb-[env(safe-area-inset-bottom)]",
}

const STICKY_NOTICE_BAR_OWNER_KEY = "__gunjoUiStickyNoticeBarOwner__"

export interface StickyNoticeBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Required viewport edge. There is intentionally no default. */
    edge: StickyNoticeBarEdge
    /** Optional leading icon. It is treated as decorative. */
    icon?: React.ReactNode
    /** Optional link or button rendered before the dismiss control. */
    action?: React.ReactNode
    /** When provided, renders a 44px dismiss button and calls this handler. */
    onDismiss?: () => void
    /** Accessible label and tooltip for the dismiss button. */
    dismissLabel?: string
    /**
     * Portal target. Defaults to document.body. Use with placement="container"
     * for a fake browser or contained preview whose root establishes positioning.
     */
    portalContainer?: HTMLElement | null
    /** Viewport uses fixed positioning; container uses absolute positioning. */
    placement?: "viewport" | "container"
}

/**
 * A persistent, scroll-following site announcement with an optional action and
 * dismiss control. Messages wrap instead of truncating so the announcement and
 * action remain understandable on narrow screens.
 *
 * StickyNoticeBar owns one document-level slot. If more than one instance is
 * mounted, the first remains visible, later instances fail closed, leave a
 * hidden suppression marker, and log an error in every build. This prevents
 * simultaneous top and bottom notices while keeping duplicates detectable.
 */
const StickyNoticeBar = React.forwardRef<HTMLDivElement, StickyNoticeBarProps>(
    (
        {
            action,
            children,
            className,
            dismissLabel = "Dismiss announcement",
            edge,
            icon,
            onDismiss,
            placement = "viewport",
            portalContainer,
            role = "status",
            ...props
        },
        ref
    ) => {
        const ownerRef = React.useRef(Symbol("StickyNoticeBar"))
        const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null)
        const [isSuppressed, setIsSuppressed] = React.useState(false)

        React.useEffect(() => {
            setIsSuppressed(false)

            const target = portalContainer ?? (typeof document === "undefined" ? null : document.body)
            if (!target) return

            if (placement === "container" && !portalContainer) {
                console.error(
                    "StickyNoticeBar: placement=\"container\" requires portalContainer."
                )
                return
            }

            const ownerDocument = target.ownerDocument
            const existingOwner = Reflect.get(
                ownerDocument,
                STICKY_NOTICE_BAR_OWNER_KEY
            ) as symbol | undefined

            if (existingOwner && existingOwner !== ownerRef.current) {
                console.error(
                    "StickyNoticeBar: only one instance may be mounted per document. Remove the duplicate top/bottom notice."
                )
                setIsSuppressed(true)
                return
            }

            Reflect.set(ownerDocument, STICKY_NOTICE_BAR_OWNER_KEY, ownerRef.current)
            setPortalTarget(target)

            return () => {
                if (
                    Reflect.get(ownerDocument, STICKY_NOTICE_BAR_OWNER_KEY) ===
                    ownerRef.current
                ) {
                    Reflect.deleteProperty(ownerDocument, STICKY_NOTICE_BAR_OWNER_KEY)
                }
                setPortalTarget(null)
            }
        }, [placement, portalContainer])

        if (isSuppressed) {
            return (
                <span
                    hidden
                    aria-hidden="true"
                    data-sticky-notice-bar-suppressed="true"
                />
            )
        }

        if (!portalTarget) return null

        return createPortal(
            <div
                className={cn(
                    placement === "viewport" ? "fixed" : "absolute",
                    "pointer-events-none inset-x-0 z-40 border-border bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/85",
                    stickyNoticeBarEdgeClasses[edge]
                )}
                data-sticky-notice-bar-slot="true"
            >
                <div
                    ref={ref}
                    role={role}
                    aria-live={role === "status" ? "polite" : undefined}
                    className={cn(
                        "pointer-events-auto flex w-full flex-col gap-3 px-4 py-2 text-foreground sm:flex-row sm:items-center",
                        className
                    )}
                    {...props}
                >
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                        {icon ? (
                            <span className="mt-0.5 flex shrink-0 items-center" aria-hidden="true">
                                {icon}
                            </span>
                        ) : null}
                        <div className="min-w-0 flex-1 break-words text-sm leading-5">
                            {children}
                        </div>
                    </div>
                    {action || onDismiss ? (
                        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                            {action}
                            {onDismiss ? (
                                <TooltipButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-touch"
                                    tooltip={dismissLabel}
                                    tooltipPortalContainer={portalTarget}
                                    onClick={onDismiss}
                                    aria-label={dismissLabel}
                                    className="shrink-0"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </TooltipButton>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>,
            portalTarget
        )
    }
)
StickyNoticeBar.displayName = "StickyNoticeBar"

export { StickyNoticeBar }
