"use client"

import * as React from "react"
import { IconLock, IconPlus } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Input } from "../inputs/Input"
import { Textarea } from "../inputs/Textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { Badge } from "./Badge"

export interface SignedRecordAddendum {
    /** Stable key. */
    id: string
    /** Who appended it. */
    author: string
    /** ISO timestamp. */
    at: string
    /** Reason for the addendum. */
    reason?: string
    /** The addendum text. */
    body: React.ReactNode
}

export interface SignedRecordValue {
    /** `"draft"` is editable; `"signed"` is locked read-only (addendum-only). */
    status: "draft" | "signed"
    /** Recorded on sign. */
    signedBy?: string
    /** ISO timestamp recorded on sign. */
    signedAt?: string
    /** The append-only addendum chain. */
    addenda: SignedRecordAddendum[]
}

export interface SignedRecordLabels {
    draft?: string
    signed?: string
    sign?: string
    locked?: string
    addendaTitle?: string
    addendum?: string
    addendumBody?: string
    addendumReason?: string
    addendumSubmit?: string
    cancel?: string
    signedByLabel?: string
    authorAt?: (author: string, at: React.ReactNode) => React.ReactNode
}

export interface SignedRecordProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    /** Controlled record state (status / signer / addenda). */
    value: SignedRecordValue
    /** Notified when the record changes (signed, addendum appended). */
    onChange: (value: SignedRecordValue) => void
    /** The document body — a render prop receiving `{ readOnly }` (true once signed). */
    children: (state: { readOnly: boolean }) => React.ReactNode
    /** The signing user's id — recorded as `signedBy` and each addendum's `author`. */
    signerId: string
    /** Whether the record can be signed now (required sections filled). Default `true`. */
    canSign?: boolean
    /** Reason shown in a tooltip when signing is disabled. */
    cannotSignReason?: React.ReactNode
    /** Accessible label for the disabled sign wrapper. Defaults to the reason when it is a string. */
    cannotSignReasonLabel?: string
    /** Require a reason on each addendum. Default `true`. */
    requireAddendumReason?: boolean
    /**
     * Format an ISO timestamp for display. Default a deterministic `YYYY/MM/DD HH:mm`.
     * **Function prop — pass only from a Client Component** (SignedRecord is
     * `"use client"`); from a Server Component it breaks `next build`. For RSC-safe
     * formatting use the serializable {@link SignedRecordProps.timeFormat}. (#338)
     */
    formatTime?: (iso: string) => React.ReactNode
    /**
     * Serializable time format — the RSC-safe alternative to `formatTime`
     * (`Intl.DateTimeFormatOptions`, e.g. `{ dateStyle: "short", timeStyle: "short" }`).
     * Applied to `new Date(iso)` with a fixed `en-US` locale. Ignored when
     * `formatTime` is set. (#338)
     */
    timeFormat?: Intl.DateTimeFormatOptions
    /** Localized strings. */
    labels?: SignedRecordLabels
}

function defaultFormatTime(iso: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso)
    return m ? `${m[1]}/${m[2]}/${m[3]} ${m[4]}:${m[5]}` : iso
}

/**
 * Append-only signed legal record. A draft body that, once signed, locks
 * read-only (recording signer + timestamp) and can only be amended by a
 * timestamped, authored addendum — never edited. Renders the draft/signed
 * badge, the locked affordance, the signer audit line, and an addendum composer
 * + chain. For clinical notes, discharge summaries, operative records and any
 * signed/audited document. (#246)
 */
const SignedRecord = React.forwardRef<HTMLDivElement, SignedRecordProps>(
    (
        {
            className,
            value,
            onChange,
            children,
            signerId,
            canSign = true,
            cannotSignReason,
            cannotSignReasonLabel,
            requireAddendumReason = true,
            formatTime: formatTimeProp,
            timeFormat,
            labels,
            ...props
        },
        ref
    ) => {
        const formatTime =
            formatTimeProp ??
            (timeFormat
                ? (iso: string) => new Intl.DateTimeFormat("en-US", timeFormat).format(new Date(iso))
                : defaultFormatTime)
        const readOnly = value.status === "signed"
        const [composing, setComposing] = React.useState(false)
        const [addBody, setAddBody] = React.useState("")
        const [addReason, setAddReason] = React.useState("")
        const seq = React.useRef(0)

        const sign = () => {
            if (readOnly || !canSign) return
            onChange({ ...value, status: "signed", signedBy: signerId, signedAt: new Date().toISOString() })
        }

        const submitAddendum = () => {
            if (!addBody.trim() || (requireAddendumReason && !addReason.trim())) return
            const addendum: SignedRecordAddendum = {
                id: `addendum-${seq.current++}`,
                author: signerId,
                at: new Date().toISOString(),
                reason: addReason.trim() || undefined,
                body: addBody.trim(),
            }
            onChange({ ...value, addenda: [...value.addenda, addendum] })
            setAddBody("")
            setAddReason("")
            setComposing(false)
        }

        const authorAt = labels?.authorAt ?? ((author: string, at: React.ReactNode) => `${author}・${at}`)
        const signButton = readOnly ? null : (
            <Button size="sm" onClick={sign} disabled={!canSign}>
                {labels?.sign ?? "署名・確定"}
            </Button>
        )

        return (
            <div ref={ref} className={cn("flex w-full flex-col gap-3", className)} data-slot="signed-record" {...props}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {readOnly ? (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant="success">{labels?.signed ?? "署名・確定済"}</Badge>
                            {value.signedBy ? (
                                <span className="text-muted-foreground">
                                    {labels?.signedByLabel ?? "署名"}: {authorAt(value.signedBy, value.signedAt ? formatTime(value.signedAt) : "")}
                                </span>
                            ) : null}
                        </div>
                    ) : (
                        <Badge variant="info">{labels?.draft ?? "下書き"}</Badge>
                    )}
                    {readOnly ? null : !canSign && cannotSignReason != null ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="inline-flex"
                                    tabIndex={0}
                                    aria-label={cannotSignReasonLabel ?? (typeof cannotSignReason === "string" ? cannotSignReason : undefined)}
                                >
                                    {signButton}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>{cannotSignReason}</TooltipContent>
                        </Tooltip>
                    ) : (
                        signButton
                    )}
                </div>

                {readOnly ? (
                    <p className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                        <IconLock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {labels?.locked ?? "確定済みの記録は変更できません。修正は追記で行います。"}
                    </p>
                ) : null}

                <div aria-readonly={readOnly || undefined}>{children({ readOnly })}</div>

                {readOnly || value.addenda.length > 0 ? (
                    <div className="flex flex-col gap-2 border-t pt-3">
                        <p className="text-sm font-medium text-foreground">{labels?.addendaTitle ?? "追記"}</p>
                        {value.addenda.length > 0 ? (
                            <ol className="flex flex-col gap-2">
                                {value.addenda.map((a) => (
                                    <li key={a.id} className="rounded-md border border-border bg-card p-3 text-sm">
                                        <div className="mb-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">{authorAt(a.author, formatTime(a.at))}</span>
                                            {a.reason ? <span>／ {a.reason}</span> : null}
                                        </div>
                                        <div className="leading-relaxed text-foreground">{a.body}</div>
                                    </li>
                                ))}
                            </ol>
                        ) : null}

                        {readOnly ? (
                            composing ? (
                                <div className="flex flex-col gap-2 rounded-md border border-border p-3">
                                    <Textarea
                                        label={labels?.addendumBody ?? "追記内容"}
                                        rows={2}
                                        value={addBody}
                                        onChange={(e) => setAddBody(e.target.value)}
                                    />
                                    {requireAddendumReason ? (
                                        <Input
                                            label={labels?.addendumReason ?? "理由"}
                                            value={addReason}
                                            onChange={(e) => setAddReason(e.target.value)}
                                        />
                                    ) : null}
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => setComposing(false)}>
                                            {labels?.cancel ?? "キャンセル"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={submitAddendum}
                                            disabled={!addBody.trim() || (requireAddendumReason && !addReason.trim())}
                                        >
                                            {labels?.addendumSubmit ?? "追記する"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="self-start"
                                    onClick={() => setComposing(true)}
                                >
                                    <IconPlus className="h-3.5 w-3.5" aria-hidden="true" />
                                    {labels?.addendum ?? "追記する"}
                                </Button>
                            )
                        ) : null}
                    </div>
                ) : null}
            </div>
        )
    }
)
SignedRecord.displayName = "SignedRecord"

export { SignedRecord }
