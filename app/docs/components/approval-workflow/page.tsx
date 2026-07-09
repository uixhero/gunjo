"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ApprovalWorkflow, Button, Checkbox, type WorkflowStage, type WorkflowValue } from "@gunjo/ui";

type Locale = "ja" | "en";

function workflowStages(locale: Locale): WorkflowStage[] {
  return locale === "ja"
    ? [
        { id: "intake", label: "申請受付" },
        { id: "docs", label: "書類審査" },
        { id: "eligibility", label: "資格判定" },
        { id: "decision", label: "決定" },
        { id: "pay", label: "支給" },
      ]
    : [
        { id: "intake", label: "Intake" },
        { id: "docs", label: "Document review" },
        { id: "eligibility", label: "Eligibility" },
        { id: "decision", label: "Decision" },
        { id: "pay", label: "Payment" },
      ];
}

function workflowLabels(locale: Locale) {
  return locale === "ja"
    ? {
        actor: "審査担当 田中",
        docsChecked: "必要書類をすべて確認した",
        advanceHint: "必要書類のチェックが未完了です",
        reset: "リセット",
      }
    : {
        actor: "Reviewer Tanaka",
        docsChecked: "All required documents checked",
        advanceHint: "Required documents have not been checked.",
        reset: "Reset",
      };
}

function actionLabels(locale: Locale) {
  return locale === "ja"
    ? undefined
    : {
        advance: "Advance",
        finish: "Complete",
        sendBack: "Send back",
        reject: "Reject",
        confirm: "Confirm",
        cancel: "Cancel",
        sendBackTarget: "Return to stage",
        reason: "Reason",
        reasonPlaceholder: "Enter a reason...",
        completed: "Complete",
        rejected: "Rejected",
      };
}

function WorkflowPreview({
  locale,
  initialValue,
  initialDocsChecked = false,
}: {
  locale: Locale;
  initialValue?: WorkflowValue;
  initialDocsChecked?: boolean;
}) {
  const copy = workflowLabels(locale);
  const [value, setValue] = React.useState<WorkflowValue>(
    initialValue ?? { currentStageId: "intake", status: "in-progress", records: {} }
  );
  const [docsChecked, setDocsChecked] = React.useState(initialDocsChecked);
  const canAdvance = value.currentStageId === "docs" ? docsChecked : true;

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-lg border bg-card p-4">
      <ApprovalWorkflow
        stages={workflowStages(locale)}
        value={value}
        onChange={setValue}
        actor={copy.actor}
        canAdvance={canAdvance}
        advanceHint={copy.advanceHint}
        now={() => "2026/06/24 10:30"}
        labels={actionLabels(locale)}
      />

      {value.currentStageId === "docs" && value.status === "in-progress" ? (
        <label className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <Checkbox checked={docsChecked} onCheckedChange={(checked) => setDocsChecked(Boolean(checked))} />
          {copy.docsChecked}
        </label>
      ) : null}

      {value.status !== "in-progress" ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="self-start"
          onClick={() => {
            setValue({ currentStageId: "intake", status: "in-progress", records: {} });
            setDocsChecked(false);
          }}
        >
          {copy.reset}
        </Button>
      ) : null}
    </div>
  );
}

function completedValue(locale: Locale): WorkflowValue {
  const actor = workflowLabels(locale).actor;
  return {
    currentStageId: "pay",
    status: "approved",
    records: {
      intake: { actor, at: "2026/06/24 10:30" },
      docs: { actor, at: "2026/06/24 10:35" },
      eligibility: { actor, at: "2026/06/24 10:40" },
      decision: { actor, at: "2026/06/24 10:45" },
      pay: { actor, at: "2026/06/24 10:50" },
    },
  };
}

export default function ApprovalWorkflowDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/approval-workflow", locale);
  const metadata = displayMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.approvalWorkflow.title;
  const description = content?.description ?? metadata.approvalWorkflow.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { ApprovalWorkflow, Button, Checkbox, type WorkflowStage, type WorkflowValue } from "@gunjo/ui";

const stages: WorkflowStage[] = [
  { id: "intake", label: "申請受付" },
  { id: "docs", label: "書類審査" },
  { id: "eligibility", label: "資格判定" },
  { id: "decision", label: "決定" },
  { id: "pay", label: "支給" },
];

export function ScreeningWorkflow() {
  const [value, setValue] = React.useState<WorkflowValue>({
    currentStageId: "intake",
    status: "in-progress",
    records: {},
  });
  const [docsChecked, setDocsChecked] = React.useState(false);
  const canAdvance = value.currentStageId === "docs" ? docsChecked : true;

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-lg border bg-card p-4">
      <ApprovalWorkflow
        stages={stages}
        value={value}
        onChange={setValue}
        actor="審査担当 田中"
        canAdvance={canAdvance}
        advanceHint="必要書類のチェックが未完了です"
        now={() => "2026/06/24 10:30"}
      />

      {value.currentStageId === "docs" && value.status === "in-progress" ? (
        <label className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <Checkbox checked={docsChecked} onCheckedChange={(checked) => setDocsChecked(Boolean(checked))} />
          必要書類をすべて確認した
        </label>
      ) : null}

      {value.status !== "in-progress" ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="self-start"
          onClick={() => {
            setValue({ currentStageId: "intake", status: "in-progress", records: {} });
            setDocsChecked(false);
          }}
        >
          リセット
        </Button>
      ) : null}
    </div>
  );
}`
    : `import * as React from "react";
import { ApprovalWorkflow, Button, Checkbox, type WorkflowStage, type WorkflowValue } from "@gunjo/ui";

const stages: WorkflowStage[] = [
  { id: "intake", label: "Intake" },
  { id: "docs", label: "Document review" },
  { id: "eligibility", label: "Eligibility" },
  { id: "decision", label: "Decision" },
  { id: "pay", label: "Payment" },
];

export function ScreeningWorkflow() {
  const [value, setValue] = React.useState<WorkflowValue>({
    currentStageId: "intake",
    status: "in-progress",
    records: {},
  });
  const [docsChecked, setDocsChecked] = React.useState(false);
  const canAdvance = value.currentStageId === "docs" ? docsChecked : true;

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-lg border bg-card p-4">
      <ApprovalWorkflow
        stages={stages}
        value={value}
        onChange={setValue}
        actor="Reviewer Tanaka"
        canAdvance={canAdvance}
        advanceHint="Required documents have not been checked."
        now={() => "2026/06/24 10:30"}
        labels={{
          advance: "Advance",
          finish: "Complete",
          sendBack: "Send back",
          reject: "Reject",
          confirm: "Confirm",
          cancel: "Cancel",
          sendBackTarget: "Return to stage",
          reason: "Reason",
          reasonPlaceholder: "Enter a reason...",
          completed: "Complete",
          rejected: "Rejected",
        }}
      />

      {value.currentStageId === "docs" && value.status === "in-progress" ? (
        <label className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <Checkbox checked={docsChecked} onCheckedChange={(checked) => setDocsChecked(Boolean(checked))} />
          All required documents checked
        </label>
      ) : null}

      {value.status !== "in-progress" ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="self-start"
          onClick={() => {
            setValue({ currentStageId: "intake", status: "in-progress", records: {} });
            setDocsChecked(false);
          }}
        >
          Reset
        </Button>
      ) : null}
    </div>
  );
}`;

  const propsData = [
    {
      name: "stages",
      type: "WorkflowStage[]",
      description: locale === "ja"
        ? "承認・審査の段階を順番通りに渡します。"
        : "Ordered stages in the approval or review pipeline.",
    },
    {
      name: "value",
      type: "WorkflowValue",
      description: locale === "ja"
        ? "現在段階、全体ステータス、各段階の記録を持つ controlled state です。"
        : "Controlled state with current stage, overall status, and per-stage records.",
    },
    {
      name: "onChange",
      type: "(next: WorkflowValue) => void",
      description: locale === "ja"
        ? "次へ進める、差戻し、却下、完了の各操作で呼ばれます。"
        : "Called when the user advances, sends back, rejects, or completes the workflow.",
    },
    {
      name: "canAdvance",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "現在段階から次へ進められるかを制御します。false の時は advanceHint を tooltip でも表示します。"
        : "Gates advancing out of the current stage. When false, advanceHint is also shown as a tooltip.",
    },
    {
      name: "advanceHint",
      type: "ReactNode",
      description: locale === "ja"
        ? "次へ進めない理由です。無効ボタンの tooltip と補助テキストに使います。"
        : "Reason why the advance button is disabled, used for tooltip and helper text.",
    },
    {
      name: "allowSendBack / allowReject",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "差戻しと却下の操作を表示するかどうかです。"
        : "Controls whether send-back and reject actions are shown.",
    },
    {
      name: "labels",
      type: "ApprovalWorkflowLabels",
      description: locale === "ja"
        ? "操作ボタン、理由入力、完了/却下表示の文言を差し替えます。"
        : "Overrides action, reason-field, completed, and rejected labels.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "ApprovalWorkflow", href: "/docs/components/approval-workflow" },
        { name: "ApprovalSteps", href: "/docs/components/approval-steps" },
        { name: "Button", href: "/docs/components/button" },
        { name: "Checkbox", href: "/docs/components/checkbox" },
        { name: "Tooltip", href: "/docs/components/tooltip" },
      ]}
      relatedComponents={[
        { name: "CoSign", href: "/docs/components/co-sign" },
        { name: "SignedRecord", href: "/docs/components/signed-record" },
        { name: "Stepper", href: "/docs/components/stepper" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <WorkflowPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "in-progress",
              title: locale === "ja" ? "進行中" : "In progress",
              description: locale === "ja"
                ? "現在段階を進め、必要に応じて差戻しや却下の理由入力へ切り替えます。"
                : "Advance the current stage or switch into send-back and reject reason entry.",
              preview: <WorkflowPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "gated",
              title: locale === "ja" ? "ゲートで停止" : "Gated advance",
              description: locale === "ja"
                ? "要件が未完了の時は次へ進めるボタンを無効化し、理由を hover/focus tooltip で説明します。"
                : "When requirements are incomplete, the advance button is disabled and explains why on hover/focus.",
              preview: (
                <WorkflowPreview
                  locale={locale}
                  initialValue={{ currentStageId: "docs", status: "in-progress", records: { intake: { actor: workflowLabels(locale).actor, at: "2026/06/24 10:30" } } }}
                />
              ),
              code: locale === "ja"
                ? `<ApprovalWorkflow
  stages={stages}
  value={{ currentStageId: "docs", status: "in-progress", records: { intake: { actor: "審査担当 田中", at: "2026/06/24 10:30" } } }}
  onChange={setValue}
  canAdvance={false}
  advanceHint="必要書類のチェックが未完了です"
/>`
                : `<ApprovalWorkflow
  stages={stages}
  value={{ currentStageId: "docs", status: "in-progress", records: { intake: { actor: "Reviewer Tanaka", at: "2026/06/24 10:30" } } }}
  onChange={setValue}
  canAdvance={false}
  advanceHint="Required documents have not been checked."
/>`,
              previewBodyWidth: "lg",
            },
            {
              key: "completed",
              title: locale === "ja" ? "完了済み" : "Completed",
              description: locale === "ja"
                ? "status が approved になると、操作面ではなく完了ステータスとして表示します。"
                : "When status is approved, the workflow renders the terminal completed state.",
              preview: <WorkflowPreview locale={locale} initialValue={completedValue(locale)} initialDocsChecked />,
              code: locale === "ja"
                ? `<ApprovalWorkflow
  stages={stages}
  value={{
    currentStageId: "pay",
    status: "approved",
    records: {
      intake: { actor: "審査担当 田中", at: "2026/06/24 10:30" },
      docs: { actor: "審査担当 田中", at: "2026/06/24 10:35" },
      eligibility: { actor: "審査担当 田中", at: "2026/06/24 10:40" },
      decision: { actor: "審査担当 田中", at: "2026/06/24 10:45" },
      pay: { actor: "審査担当 田中", at: "2026/06/24 10:50" },
    },
  }}
  onChange={setValue}
/>`
                : `<ApprovalWorkflow
  stages={stages}
  value={{
    currentStageId: "pay",
    status: "approved",
    records: {
      intake: { actor: "Reviewer Tanaka", at: "2026/06/24 10:30" },
      docs: { actor: "Reviewer Tanaka", at: "2026/06/24 10:35" },
      eligibility: { actor: "Reviewer Tanaka", at: "2026/06/24 10:40" },
      decision: { actor: "Reviewer Tanaka", at: "2026/06/24 10:45" },
      pay: { actor: "Reviewer Tanaka", at: "2026/06/24 10:50" },
    },
  }}
  onChange={setValue}
  labels={{ completed: "Complete" }}
/>`,
              previewBodyWidth: "lg",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
