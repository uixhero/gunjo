import { ApprovalSteps, type ApprovalStep } from "@gunjo/ui";

const steps: ApprovalStep[] = [
    { label: "申請", state: "approved", actor: "山田 太郎", timestamp: "5/20 10:12" },
    {
        label: "一次承認（上長）",
        state: "rejected",
        actor: "佐藤 部長",
        timestamp: "5/20 14:40",
        comment: "勘定科目が交際費ではなく会議費です。修正のうえ再申請してください。",
    },
    { label: "経理確認", state: "current", actor: "経理部" },
    { label: "支払", state: "pending" },
];

export function ApprovalStepsDemo() {
    return (
        <div className="w-full max-w-md">
            <ApprovalSteps
                steps={steps}
                stateLabels={{
                    approved: "承認",
                    rejected: "差戻し",
                    current: "確認中",
                    pending: "待ち",
                }}
            />
        </div>
    );
}
