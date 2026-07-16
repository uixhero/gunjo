"use client"

import * as React from "react"
import { IconCheck, IconClock, IconLock, IconPlus } from "@tabler/icons-react"

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

export interface SignedRecordSigner {
    /** Matches `signerId` / `SignedRecordSignature.signerId`. */
    id: string
    /** Display name for this party. Falls back to `id`. */
    label?: React.ReactNode
}

export interface SignedRecordSignature {
    signerId: string
    /** ISO timestamp. */
    at: string
}

export interface SignedRecordValue {
    /** `"draft"` is editable; `"signed"` is locked read-only (addendum-only). */
    status: "draft" | "signed"
    /** Recorded on sign. Single-signatory mode only. */
    signedBy?: string
    /** ISO timestamp recorded on sign. */
    signedAt?: string
    /**
     * Collected signatures — multi-signatory mode only (`requiredSigners` set).
     * The record locks once every required party appears here. (#259)
     */
    signatures?: SignedRecordSignature[]
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
    /** Multi-signatory: shown next to a party who has not signed yet. Default `"未署名"`. (#259) */
    pendingSignature?: string
    /** Multi-signatory: sign-progress readout. Default `署名 {signed}/{total}`. (#259) */
    signatureProgress?: (signed: number, total: number) => React.ReactNode
    /** Multi-signatory: tooltip when the current user is not a required party. Default `"署名の当事者ではありません。"`. (#259) */
    notASigner?: string
    /** Multi-signatory: tooltip when the current user has already signed. Default `"すでに署名済みです。"`. (#259) */
    alreadySigned?: string
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
    /**
     * Opt into **multi-signatory** mode: the parties who must all sign before the
     * record locks. Until every one of them appears in `value.signatures`, the
     * record stays a `"draft"` (still editable); the last signature flips it to
     * `"signed"`. `signerId` signs as the current user and may only sign once, and
     * only if they are one of these parties.
     *
     * Omit for the single-signatory behaviour (one signature locks immediately). (#259)
     */
    requiredSigners?: SignedRecordSigner[]
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
            requiredSigners,
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

        // Multi-signatory mode (#259): opt-in via `requiredSigners`. The record only
        // locks once every required party has signed; until then it stays a draft.
        const multi = requiredSigners !== undefined && requiredSigners.length > 0
        const signatures = value.signatures ?? []
        const hasSigned = (id: string) => signatures.some((s) => s.signerId === id)
        const signedCount = multi ? requiredSigners.filter((s) => hasSigned(s.id)).length : 0
        const isRequiredParty = multi && requiredSigners.some((s) => s.id === signerId)
        const alreadySignedByMe = multi && hasSigned(signerId)
        // In multi mode the button is only actionable for a required party who
        // hasn't signed yet — on top of the caller's own `canSign` gate.
        const signAllowed = multi ? canSign && isRequiredParty && !alreadySignedByMe : canSign
        // Addenda display the party's label when it is a plain string; otherwise the
        // raw id (which is what single-signatory mode has always shown).
        const authorName = (id: string): string => {
            const label = requiredSigners?.find((s) => s.id === id)?.label
            return typeof label === "string" ? label : id
        }

        const sign = () => {
            if (readOnly || !signAllowed) return
            const at = new Date().toISOString()
            if (!multi) {
                onChange({ ...value, status: "signed", signedBy: signerId, signedAt: at })
                return
            }
            const nextSignatures = [...signatures, { signerId, at }]
            const allSigned = requiredSigners.every((s) =>
                nextSignatures.some((x) => x.signerId === s.id)
            )
            onChange({
                ...value,
                signatures: nextSignatures,
                // The last required signature locks the record.
                ...(allSigned ? { status: "signed" as const, signedAt: at } : {}),
            })
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
        const progressText =
            labels?.signatureProgress ?? ((signed: number, total: number) => `署名 ${signed}/${total}`)
        // In multi mode the button reports progress so the user can see how many
        // parties are still outstanding.
        const signButton = readOnly ? null : (
            <Button size="sm" onClick={sign} disabled={!signAllowed}>
                {labels?.sign ?? "署名・確定"}
                {multi ? ` (${signedCount}/${requiredSigners.length})` : null}
            </Button>
        )
        // Why the button is unavailable — the caller's reason first, then the
        // multi-signatory rules.
        const signBlockedReason: React.ReactNode = !canSign
            ? cannotSignReason
            : multi && !isRequiredParty
              ? (labels?.notASigner ?? "署名の当事者ではありません。")
              : multi && alreadySignedByMe
                ? (labels?.alreadySigned ?? "すでに署名済みです。")
                : undefined

        return (
            <div ref={ref} className={cn("flex w-full flex-col gap-3", className)} data-slot="signed-record" {...props}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        {readOnly ? (
                            <Badge variant="success">{labels?.signed ?? "署名・確定済"}</Badge>
                        ) : (
                            <Badge variant="info">{labels?.draft ?? "下書き"}</Badge>
                        )}
                        {multi ? (
                            <span className="text-xs text-muted-foreground">
                                {progressText(signedCount, requiredSigners.length)}
                            </span>
                        ) : readOnly && value.signedBy ? (
                            <span className="text-muted-foreground">
                                {labels?.signedByLabel ?? "署名"}: {authorAt(value.signedBy, value.signedAt ? formatTime(value.signedAt) : "")}
                            </span>
                        ) : null}
                    </div>
                    {readOnly ? null : signBlockedReason != null ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="inline-flex"
                                    tabIndex={0}
                                    aria-label={cannotSignReasonLabel ?? (typeof signBlockedReason === "string" ? signBlockedReason : undefined)}
                                >
                                    {signButton}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>{signBlockedReason}</TooltipContent>
                        </Tooltip>
                    ) : (
                        signButton
                    )}
                </div>

                {multi ? (
                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {requiredSigners.map((s) => {
                            const sig = signatures.find((x) => x.signerId === s.id)
                            return (
                                <li key={s.id} className="flex items-center gap-1.5">
                                    {sig ? (
                                        <IconCheck className="h-3.5 w-3.5 shrink-0 text-success-strong" aria-hidden="true" />
                                    ) : (
                                        <IconClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                    )}
                                    <span className={cn(sig && "font-medium text-foreground")}>{s.label ?? s.id}</span>
                                    <span>{sig ? formatTime(sig.at) : (labels?.pendingSignature ?? "未署名")}</span>
                                </li>
                            )
                        })}
                    </ul>
                ) : null}

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
                                            <span className="font-medium text-foreground">{authorAt(authorName(a.author), formatTime(a.at))}</span>
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
