"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Select } from "../inputs/Select"
import { Textarea } from "../inputs/Textarea"
import { ApprovalSteps, type ApprovalStepState, type ApprovalStepsProps } from "./ApprovalSteps"

export interface WorkflowStage {
    id: string
    label: React.ReactNode
    /** Plain-text label for option lists / aria when `label` is a node. */
    name?: string
}

export interface WorkflowStageRecord {
    /** Who acted on the stage. */
    actor?: React.ReactNode
    /** When (a caller-formatted timestamp). */
    at?: React.ReactNode
    /** Comment — e.g. a 差戻し / 却下 reason. */
    comment?: React.ReactNode
}

export type WorkflowStatus = "in-progress" | "approved" | "rejected"

export interface WorkflowValue {
    /** The stage currently under review. */
    currentStageId: string
    /** Overall status. Default `"in-progress"`. */
    status?: WorkflowStatus
    /** Per-stage records (actor / timestamp / comment), keyed by stage id. */
    records?: Record<string, WorkflowStageRecord>
}

export interface ApprovalWorkflowLabels {
    advance?: string
    finish?: string
    sendBack?: string
    reject?: string
    confirm?: string
    cancel?: string
    sendBackTarget?: string
    reason?: string
    reasonPlaceholder?: string
    completed?: string
    rejected?: string
}

const DEFAULT_LABELS: Required<ApprovalWorkflowLabels> = {
    advance: "次へ進める",
    finish: "完了にする",
    sendBack: "差戻し",
    reject: "却下",
    confirm: "確定",
    cancel: "キャンセル",
    sendBackTarget: "戻し先の段階",
    reason: "理由",
    reasonPlaceholder: "理由を入力…",
    completed: "完了",
    rejected: "却下されました",
}

function stageName(stage: WorkflowStage): string {
    return stage.name ?? (typeof stage.label === "string" ? stage.label : stage.id)
}

/**
 * Interactive approval / review workflow. Drives an ordered pipeline of `stages`
 * through **advance → next**, **send-back** (to a prior stage, with a reason,
 * rolling back later records) and **reject** (terminal) — recording an actor +
 * timestamp on each transition — and renders the result with `ApprovalSteps`
 * (state never colour-only). Controlled via `value` + `onChange`; advancing out
 * of the current stage is gated by `canAdvance`. For case management, benefit /
 * application screening, ringi / expense approval, onboarding and any staged
 * back-office review. (#267)
 */
const ApprovalWorkflow = React.forwardRef<HTMLDivElement, {
    stages: WorkflowStage[]
    value: WorkflowValue
    onChange: (next: WorkflowValue) => void
    /** Gate advancing OUT of the current stage (requirements met?). Default `true`. */
    canAdvance?: boolean
    /** Actor recorded on advance / send-back / reject. */
    actor?: React.ReactNode
    /** Returns the timestamp written into records (only called on a user action). Default `new Date().toLocaleString("ja-JP")`. */
    now?: () => React.ReactNode
    /** Show the send-back control. Default `true`. */
    allowSendBack?: boolean
    /** Show the reject control. Default `true`. */
    allowReject?: boolean
    /** Hint shown next to a disabled advance button (e.g. "必要書類が未チェックです"). */
    advanceHint?: React.ReactNode
    labels?: ApprovalWorkflowLabels
    stateLabels?: ApprovalStepsProps["stateLabels"]
    variant?: ApprovalStepsProps["variant"]
    className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">>(
    (
        {
            stages,
            value,
            onChange,
            canAdvance = true,
            actor,
            now = () => new Date().toLocaleString("ja-JP"),
            allowSendBack = true,
            allowReject = true,
            advanceHint,
            labels,
            stateLabels,
            variant,
            className,
            ...props
        },
        ref
    ) => {
        const l = { ...DEFAULT_LABELS, ...labels }
        const status = value.status ?? "in-progress"
        const records = value.records ?? {}
        const currentIndex = Math.max(
            0,
            stages.findIndex((s) => s.id === value.currentStageId)
        )
        const isLast = currentIndex === stages.length - 1
        const terminal = status !== "in-progress"

        const [mode, setMode] = React.useState<"none" | "sendback" | "reject">("none")
        const [reason, setReason] = React.useState("")
        const [target, setTarget] = React.useState("")

        const priorStages = stages.slice(0, currentIndex)

        const stateFor = (index: number): ApprovalStepState => {
            if (status === "approved") return "approved"
            if (status === "rejected") {
                if (index < currentIndex) return "approved"
                if (index === currentIndex) return "rejected"
                return "pending"
            }
            if (index < currentIndex) return "approved"
            if (index === currentIndex) return "current"
            return "pending"
        }

        const steps = stages.map((stage, index) => {
            const record = records[stage.id]
            return {
                label: stage.label,
                state: stateFor(index),
                actor: record?.actor,
                timestamp: record?.at,
                comment: record?.comment,
            }
        })

        const resetComposer = () => {
            setMode("none")
            setReason("")
            setTarget("")
        }

        const advance = () => {
            const stamped: Record<string, WorkflowStageRecord> = {
                ...records,
                [value.currentStageId]: { ...records[value.currentStageId], actor, at: now() },
            }
            if (isLast) {
                onChange({ currentStageId: value.currentStageId, status: "approved", records: stamped })
            } else {
                onChange({ currentStageId: stages[currentIndex + 1].id, status: "in-progress", records: stamped })
            }
        }

        const confirmSendBack = () => {
            const targetId = target || priorStages[priorStages.length - 1]?.id
            if (!targetId) return
            const targetIndex = stages.findIndex((s) => s.id === targetId)
            // roll back records for the target stage and everything after it
            const rolled: Record<string, WorkflowStageRecord> = {}
            for (const [id, rec] of Object.entries(records)) {
                if (stages.findIndex((s) => s.id === id) < targetIndex) rolled[id] = rec
            }
            rolled[targetId] = { actor, at: now(), comment: reason || undefined }
            onChange({ currentStageId: targetId, status: "in-progress", records: rolled })
            resetComposer()
        }

        const confirmReject = () => {
            onChange({
                currentStageId: value.currentStageId,
                status: "rejected",
                records: {
                    ...records,
                    [value.currentStageId]: { ...records[value.currentStageId], actor, at: now(), comment: reason || undefined },
                },
            })
            resetComposer()
        }

        return (
            <div ref={ref} className={cn("flex w-full flex-col gap-4", className)} data-slot="approval-workflow" {...props}>
                <ApprovalSteps steps={steps} stateLabels={stateLabels} variant={variant} />

                {terminal ? (
                    <p
                        className={cn(
                            "rounded-md border px-3 py-2 text-sm font-medium",
                            status === "approved"
                                ? "border-success-border bg-success-subtle text-success-subtle-foreground"
                                : "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground"
                        )}
                        role="status"
                    >
                        {status === "approved" ? l.completed : l.rejected}
                    </p>
                ) : mode === "sendback" ? (
                    <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
                        {priorStages.length > 0 ? (
                            <Select
                                label={l.sendBackTarget}
                                value={target || priorStages[priorStages.length - 1].id}
                                onChange={(event) => setTarget(event.target.value)}
                            >
                                {priorStages.map((stage) => (
                                    <option key={stage.id} value={stage.id}>
                                        {stageName(stage)}
                                    </option>
                                ))}
                            </Select>
                        ) : null}
                        <Textarea
                            label={l.reason}
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder={l.reasonPlaceholder}
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={confirmSendBack}>{l.confirm}</Button>
                            <Button size="sm" variant="ghost" onClick={resetComposer}>{l.cancel}</Button>
                        </div>
                    </div>
                ) : mode === "reject" ? (
                    <div className="flex flex-col gap-2 rounded-md border border-destructive-border bg-destructive-subtle/40 p-3">
                        <Textarea
                            label={l.reason}
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder={l.reasonPlaceholder}
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={confirmReject}>{l.reject}</Button>
                            <Button size="sm" variant="ghost" onClick={resetComposer}>{l.cancel}</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" onClick={advance} disabled={!canAdvance}>
                            {isLast ? l.finish : l.advance}
                        </Button>
                        {allowSendBack && priorStages.length > 0 ? (
                            <Button size="sm" variant="outline" onClick={() => setMode("sendback")}>
                                {l.sendBack}
                            </Button>
                        ) : null}
                        {allowReject ? (
                            <Button size="sm" variant="outline" onClick={() => setMode("reject")}>
                                {l.reject}
                            </Button>
                        ) : null}
                        {!canAdvance && advanceHint ? (
                            <span className="text-xs text-muted-foreground">{advanceHint}</span>
                        ) : null}
                    </div>
                )}
            </div>
        )
    }
)
ApprovalWorkflow.displayName = "ApprovalWorkflow"

export { ApprovalWorkflow }
