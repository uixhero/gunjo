"use client"

import * as React from "react"
import { IconAlertTriangle, IconCheck, IconInfoCircle } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"

export type SafetyBannerTone = "destructive" | "warning" | "info"

export interface SafetyBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    /** The headline (the critical condition). */
    title: React.ReactNode
    /** Tone. `destructive` (アレルギー/禁忌/異常), `warning` (注意), `info`. Default `"destructive"`. */
    tone?: SafetyBannerTone
    /** Heading level for the title. Default `"h3"`. */
    titleAs?: "h2" | "h3" | "h4" | "p"
    /** Details / body. */
    children?: React.ReactNode
    /** Require an explicit acknowledgement — renders the ack control and reflects the acked state. Default `false`. */
    requireAck?: boolean
    /** Controlled acknowledged state. Omit for uncontrolled. */
    acknowledged?: boolean
    /** Initial acknowledged state (uncontrolled). Default `false`. */
    defaultAcknowledged?: boolean
    /** Fired when the user acknowledges. */
    onAcknowledge?: () => void
    /** Acknowledge button label. Default `"確認しました"`. */
    ackLabel?: React.ReactNode
    /** Text shown once acknowledged. Default `"確認済み"`. */
    acknowledgedLabel?: React.ReactNode
    /** Leading icon override. Defaults to a tone icon. */
    icon?: React.ReactNode
    /** Trailing actions (報告 / 詳細 …). */
    actions?: React.ReactNode
}

const TONE_CONTAINER: Record<SafetyBannerTone, string> = {
    destructive: "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground",
    warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
    info: "border-info-border bg-info-subtle text-info-subtle-foreground",
}

const TONE_ICON: Record<SafetyBannerTone, string> = {
    destructive: "text-destructive",
    warning: "text-warning",
    info: "text-info",
}

const TONE_DEFAULT_ICON: Record<SafetyBannerTone, typeof IconAlertTriangle> = {
    destructive: IconAlertTriangle,
    warning: IconAlertTriangle,
    info: IconInfoCircle,
}

/**
 * Persistent, assertive, acknowledgeable safety alert. A loud banner for a
 * critical condition (allergy, contraindication, panic value, over-dose) that
 * announces assertively, can require an explicit acknowledgement, and exposes
 * the acked state so the consumer can block a sign-off until it's cleared.
 * Stronger than `Alert` (presentational, no acknowledge contract). (#238)
 */
const SafetyBanner = React.forwardRef<HTMLDivElement, SafetyBannerProps>(
    (
        {
            className,
            title,
            tone = "destructive",
            titleAs = "h3",
            children,
            requireAck = false,
            acknowledged,
            defaultAcknowledged = false,
            onAcknowledge,
            ackLabel = "確認しました",
            acknowledgedLabel = "確認済み",
            icon,
            actions,
            ...props
        },
        ref
    ) => {
        const isControlled = acknowledged !== undefined
        const [internalAck, setInternalAck] = React.useState(defaultAcknowledged)
        const acked = isControlled ? acknowledged : internalAck

        const handleAck = () => {
            if (!isControlled) setInternalAck(true)
            onAcknowledge?.()
        }

        const TitleTag = titleAs
        const DefaultIcon = TONE_DEFAULT_ICON[tone]

        return (
            <div
                ref={ref}
                role={tone === "destructive" ? "alert" : "status"}
                aria-live={tone === "destructive" ? "assertive" : "polite"}
                className={cn(
                    "flex w-full flex-col gap-2 rounded-lg border px-4 py-3 text-sm shadow-sm",
                    TONE_CONTAINER[tone],
                    acked && "opacity-90",
                    className
                )}
                {...props}
            >
                <div className="flex items-start gap-3">
                    <span className={cn("mt-0.5 shrink-0", TONE_ICON[tone])} aria-hidden="true">
                        {icon ?? <DefaultIcon className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                        <TitleTag className="font-semibold leading-snug">{title}</TitleTag>
                        {children != null ? <div className="mt-0.5 leading-relaxed">{children}</div> : null}
                    </div>
                    {actions != null ? <div className="shrink-0">{actions}</div> : null}
                </div>

                {requireAck ? (
                    <div className="flex items-center justify-end gap-2">
                        {acked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium">
                                <IconCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {acknowledgedLabel}
                            </span>
                        ) : (
                            <Button
                                size="sm"
                                variant={tone === "destructive" ? "destructive" : "outline"}
                                onClick={handleAck}
                            >
                                {ackLabel}
                            </Button>
                        )}
                    </div>
                ) : null}
            </div>
        )
    }
)
SafetyBanner.displayName = "SafetyBanner"

export { SafetyBanner }
