"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Badge } from "../display/Badge"
import { Button } from "./Button"
import { Checkbox } from "./Checkbox"
import { Input } from "./Input"
import { Textarea } from "./Textarea"

export interface CoSignAttestation {
    id: string
    label: React.ReactNode
}

export interface CoSignValue {
    /** The second person's id. */
    signerId: string
    /** Optional reason. */
    reason?: string
    /** ISO timestamp the co-sign was completed (set by the component on sign). */
    attestedAt: string
    /** Ids of the attestations that were ticked. */
    attestations: string[]
}

export interface CoSignProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSign"> {
    /** The primary actor's id — the second signer must differ from this (same-person guard). */
    primaryId: string
    /** Attestation checkboxes — all must be ticked before signing. */
    attestations?: CoSignAttestation[]
    /** Require a reason before signing. Default `false`. */
    requireReason?: boolean
    /** Minimum signer-id length. Default `1`. */
    minSignerLength?: number
    /** Controlled signed value. When set, renders the signed (read-only) state. Omit for pending. */
    value?: CoSignValue
    /** Fired with the `CoSignValue` when the second person signs. */
    onSign?: (value: CoSignValue) => void
    /** Label for the signer-id field. Default `"確認者ID（2人目）"`. */
    signerLabel?: React.ReactNode
    /** Label for the reason field. Default `"理由"`. */
    reasonLabel?: React.ReactNode
    /** Error shown when the signer equals the primary. Default `"主担当者と同一人物では確認できません。"`. */
    samePersonError?: React.ReactNode
    /** Localized strings. */
    labels?: { sign?: string; signed?: string; pending?: string; signerOf?: (id: string) => string }
}

/** A compact "2人確認 済/要" badge driven by a `CoSignValue`. */
export function CoSignBadge({ value, signedLabel = "2人確認 済", pendingLabel = "2人確認 要" }: {
    value?: CoSignValue
    signedLabel?: React.ReactNode
    pendingLabel?: React.ReactNode
}) {
    return value ? (
        <Badge variant="success">{signedLabel}</Badge>
    ) : (
        <Badge variant="warning">{pendingLabel}</Badge>
    )
}

/**
 * Two-person verification (2人確認 / ダブルチェック / co-sign): a second actor
 * enters their id (guarded to differ from the primary), ticks the required
 * attestations, and signs — producing a timestamped `CoSignValue` the consumer
 * reads to gate an action. For medication double-checks, controlled substances,
 * transfusion, surgical time-outs and finance maker-checker approvals. (#239)
 */
const CoSign = React.forwardRef<HTMLDivElement, CoSignProps>(
    (
        {
            className,
            primaryId,
            attestations = [],
            requireReason = false,
            minSignerLength = 1,
            value,
            onSign,
            signerLabel = "確認者ID（2人目）",
            reasonLabel = "理由",
            samePersonError = "主担当者と同一人物では確認できません。",
            labels,
            ...props
        },
        ref
    ) => {
        const reactId = React.useId()
        const errorId = `${reactId}-error`
        const [signerId, setSignerId] = React.useState("")
        const [reason, setReason] = React.useState("")
        const [checked, setChecked] = React.useState<Set<string>>(() => new Set())

        if (value) {
            return (
                <div
                    ref={ref}
                    className={cn(
                        "flex w-full flex-col gap-1 rounded-lg border border-success-border bg-success-subtle px-3 py-2 text-sm",
                        className
                    )}
                    data-slot="co-sign"
                    {...props}
                >
                    <span className="inline-flex items-center gap-1.5 font-medium text-success-subtle-foreground">
                        <IconCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {labels?.signed ?? "2人確認 済"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {labels?.signerOf ? labels.signerOf(value.signerId) : `確認者: ${value.signerId}`}
                        {value.reason ? ` ／ ${value.reason}` : ""}
                    </span>
                </div>
            )
        }

        const trimmed = signerId.trim()
        const samePerson = trimmed.length > 0 && trimmed === primaryId.trim()
        const allAttested = attestations.every((a) => checked.has(a.id))
        const canSign =
            trimmed.length >= minSignerLength && !samePerson && allAttested && (!requireReason || reason.trim().length > 0)

        const toggle = (id: string, on: boolean) => {
            setChecked((prev) => {
                const next = new Set(prev)
                if (on) next.add(id)
                else next.delete(id)
                return next
            })
        }

        const handleSign = () => {
            if (!canSign) return
            onSign?.({
                signerId: trimmed,
                reason: requireReason || reason.trim() ? reason.trim() : undefined,
                attestedAt: new Date().toISOString(),
                attestations: attestations.filter((a) => checked.has(a.id)).map((a) => a.id),
            })
        }

        return (
            <div className={cn("flex w-full flex-col gap-3", className)} data-slot="co-sign" {...props}>
                {attestations.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {attestations.map((a) => (
                            <Checkbox
                                key={a.id}
                                label={a.label}
                                checked={checked.has(a.id)}
                                onCheckedChange={(on) => toggle(a.id, on)}
                            />
                        ))}
                    </div>
                ) : null}

                <div className="flex flex-col gap-1.5">
                    <label htmlFor={`${reactId}-signer`} className="text-sm font-medium leading-none text-foreground">
                        {signerLabel}
                    </label>
                    <Input
                        id={`${reactId}-signer`}
                        value={signerId}
                        onChange={(event) => setSignerId(event.target.value)}
                        aria-invalid={samePerson || undefined}
                        aria-describedby={samePerson ? errorId : undefined}
                        autoComplete="off"
                    />
                    {samePerson ? (
                        <p id={errorId} role="alert" className="text-xs text-destructive">
                            {samePersonError}
                        </p>
                    ) : null}
                </div>

                {requireReason ? (
                    <Textarea
                        label={reasonLabel}
                        rows={2}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                    />
                ) : null}

                <div className="flex justify-end">
                    <Button size="sm" onClick={handleSign} disabled={!canSign}>
                        {labels?.sign ?? "2人確認して署名"}
                    </Button>
                </div>
            </div>
        )
    }
)
CoSign.displayName = "CoSign"

export { CoSign }
