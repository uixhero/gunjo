"use client";

import * as React from "react";
import { ApprovalWorkflow, Checkbox, type WorkflowStage, type WorkflowValue } from "@gunjo/ui";

const STAGES: WorkflowStage[] = [
    { id: "intake", label: "申請受付" },
    { id: "docs", label: "書類審査" },
    { id: "eligibility", label: "資格判定" },
    { id: "decision", label: "決定" },
    { id: "pay", label: "支給" },
];

export function ApprovalWorkflowDemo() {
    const [value, setValue] = React.useState<WorkflowValue>({
        currentStageId: "intake",
        status: "in-progress",
        records: {},
    });
    // 書類審査の段階だけ、必要書類チェックを advance のゲートにする
    const [docsChecked, setDocsChecked] = React.useState(false);
    const canAdvance = value.currentStageId === "docs" ? docsChecked : true;

    const reset = () =>
        setValue({ currentStageId: "intake", status: "in-progress", records: {} });

    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <ApprovalWorkflow
                stages={STAGES}
                value={value}
                onChange={setValue}
                actor="審査担当 田中"
                canAdvance={canAdvance}
                advanceHint="必要書類のチェックが未完了です"
                now={() => "2026/06/24 10:30"}
            />

            {value.currentStageId === "docs" && value.status === "in-progress" ? (
                <label className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
                    <Checkbox checked={docsChecked} onCheckedChange={(c) => setDocsChecked(Boolean(c))} />
                    必要書類をすべて確認した（書類審査の advance ゲート）
                </label>
            ) : null}

            {value.status !== "in-progress" ? (
                <button type="button" onClick={reset} className="self-start text-xs text-muted-foreground underline">
                    リセット
                </button>
            ) : null}
        </div>
    );
}
