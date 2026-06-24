import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import displayMetadata from "@design/display-metadata.json";

import { ApprovalWorkflowDemo } from "@/components/demos/ApprovalWorkflowDemo";

const meta = displayMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import * as React from "react"
import { ApprovalWorkflow, type WorkflowStage, type WorkflowValue } from "@gunjo/ui"

const stages: WorkflowStage[] = [
  { id: "intake", label: "申請受付" },
  { id: "docs", label: "書類審査" },
  { id: "eligibility", label: "資格判定" },
  { id: "decision", label: "決定" },
  { id: "pay", label: "支給" },
]

function Screening() {
  const [value, setValue] = React.useState<WorkflowValue>({ currentStageId: "intake" })
  return (
    <ApprovalWorkflow
      stages={stages}
      value={value}
      onChange={setValue}
      actor="審査担当 田中"
      canAdvance={requirementsMet}          // gate advancing out of the current stage
      advanceHint="必要書類が未チェックです"
    />
  )
}
// advance → records {actor, timestamp} + moves to next (last stage → status "approved")
// send-back → pick a prior stage + reason, rolls back later records
// reject → terminal "rejected" with a reason`;

const propsData = [
  {
    name: "stages",
    type: "WorkflowStage[]",
    description: "Ordered pipeline stages: { id, label, name? }.",
  },
  {
    name: "value",
    type: "WorkflowValue",
    description: "Controlled state: { currentStageId, status?, records? }. status = 'in-progress' | 'approved' | 'rejected'; records keyed by stage id hold { actor, at, comment }.",
  },
  {
    name: "onChange",
    type: "(next: WorkflowValue) => void",
    description: "Called on advance / send-back / reject with the next state.",
  },
  {
    name: "canAdvance",
    type: "boolean",
    default: "true",
    description: "Gate advancing OUT of the current stage (e.g. required docs checked).",
  },
  {
    name: "actor",
    type: "ReactNode",
    description: "Recorded on each transition (who acted).",
  },
  {
    name: "now",
    type: "() => ReactNode",
    default: "new Date().toLocaleString('ja-JP')",
    description: "Timestamp written into records (called only on a user action).",
  },
  {
    name: "allowSendBack / allowReject",
    type: "boolean",
    default: "true",
    description: "Show the 差戻し / 却下 controls.",
  },
  {
    name: "advanceHint",
    type: "ReactNode",
    description: "Shown next to a disabled advance button (why it's blocked).",
  },
  {
    name: "labels / stateLabels / variant",
    type: "object / object / 'default' | 'compact'",
    description: "Action-button labels, ApprovalSteps state labels, and the ApprovalSteps variant.",
  },
];

export default function ApprovalWorkflowDocPage() {
  const title = meta.approvalWorkflow.title ?? "ApprovalWorkflow";
  const description = meta.approvalWorkflow.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "ApprovalSteps", href: "/docs/components/approval-steps" },
        { name: "Button", href: "/docs/components/button" },
        { name: "Select", href: "/docs/components/select" },
        { name: "Textarea", href: "/docs/components/textarea" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ApprovalWorkflowDemo />
      </ComponentPreview>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
        <PropsTable data={propsData} />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
          <CodeBlock code={usageCode} />
        </div>
      </div>
    </ComponentLayout>
  );
}
