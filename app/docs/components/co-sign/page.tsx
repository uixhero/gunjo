"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import {
  Button,
  CoSign,
  CoSignBadge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type CoSignValue,
} from "@gunjo/ui";

const primaryId = "ns-tanaka";

function createSignedValue(): CoSignValue {
  return {
    signerId: "ns-sato",
    attestedAt: "2026-06-30T09:30:00.000Z",
    attestations: ["drug", "patient"],
  };
}

function coSignLabels(locale: "ja" | "en") {
  return locale === "ja"
    ? {
        sign: "2人確認して署名",
        signed: "2人確認 済",
        pending: "2人確認 要",
        signerOf: (id: string) => `確認者: ${id}`,
        signDisabledAttestations: "すべての確認項目を選択してください。",
        signDisabledSigner: "確認者 ID を入力してください。",
        signDisabledReason: "理由を入力してください。",
      }
    : {
        sign: "Sign as second reviewer",
        signed: "Second review complete",
        pending: "Second review required",
        signerOf: (id: string) => `Reviewer: ${id}`,
        signDisabledAttestations: "Check every attestation before signing.",
        signDisabledSigner: "Enter the second reviewer ID before signing.",
        signDisabledReason: "Enter a reason before signing.",
      };
}

function CoSignPreview({
  locale,
  requireReason = false,
  initialValue,
}: {
  locale: "ja" | "en";
  requireReason?: boolean;
  initialValue?: CoSignValue;
}) {
  const [value, setValue] = React.useState<CoSignValue | undefined>(initialValue);
  const labels = coSignLabels(locale);

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">
            {locale === "ja" ? "麻薬: モルヒネ 10mg" : "Controlled drug: Morphine 10mg"}
          </p>
          <p className="text-muted-foreground">
            {locale === "ja" ? "主担当: 田中（ns-tanaka）" : "Primary: Tanaka (ns-tanaka)"}
          </p>
        </div>
        <CoSignBadge
          value={value}
          signedLabel={labels.signed}
          pendingLabel={labels.pending}
        />
      </div>

      <CoSign
        primaryId={primaryId}
        requireReason={requireReason}
        attestations={
          locale === "ja"
            ? [
                { id: "drug", label: "薬剤名・規格・用量を確認した" },
                { id: "patient", label: "患者・指示を確認した" },
              ]
            : [
                { id: "drug", label: "Drug, strength, and dose checked" },
                { id: "patient", label: "Patient and order checked" },
              ]
        }
        signerLabel={locale === "ja" ? "確認者ID（2人目）" : "Second reviewer ID"}
        reasonLabel={locale === "ja" ? "理由" : "Reason"}
        samePersonError={locale === "ja" ? "主担当者と同一人物では確認できません。" : "The second reviewer must be different from the primary."}
        labels={labels}
        value={value}
        onSign={setValue}
      />

      {value ? (
        <button
          type="button"
          className="self-end text-xs text-muted-foreground underline"
          onClick={() => setValue(undefined)}
        >
          {locale === "ja" ? "リセット" : "Reset"}
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">
          {locale === "ja"
            ? "ヒント: 確認者IDに ns-tanaka を入れると同一人物ガードが働きます。"
            : "Tip: enter ns-tanaka to see the same-person guard."}
        </p>
      )}
    </div>
  );
}

function GatedActionPreview({ locale }: { locale: "ja" | "en" }) {
  const [value, setValue] = React.useState<CoSignValue | undefined>(undefined);
  const disabledReason = locale === "ja"
    ? "2人確認が完了するまで実行できません。"
    : "Complete the second review before running this action.";

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
      <CoSign
        primaryId={primaryId}
        signerLabel={locale === "ja" ? "確認者ID（2人目）" : "Second reviewer ID"}
        samePersonError={locale === "ja" ? "主担当者と同一人物では確認できません。" : "The second reviewer must be different from the primary."}
        labels={coSignLabels(locale)}
        attestations={
          locale === "ja"
            ? [{ id: "patient", label: "患者・指示を確認した" }]
            : [{ id: "patient", label: "Patient and order checked" }]
        }
        value={value}
        onSign={setValue}
      />
      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={!value ? "inline-flex cursor-not-allowed" : "inline-flex"}>
              <Button disabled={!value} variant="destructive">
                {locale === "ja" ? "投与を記録" : "Record administration"}
              </Button>
            </span>
          </TooltipTrigger>
          {!value ? <TooltipContent>{disabledReason}</TooltipContent> : null}
        </Tooltip>
      </div>
    </div>
  );
}

export default function CoSignDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/co-sign", locale);
  const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.coSign.title;
  const description = content?.description ?? metadata.coSign.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { CoSign, CoSignBadge, type CoSignValue } from "@gunjo/ui";

export function MedicationDoubleCheck() {
  const [value, setValue] = React.useState<CoSignValue | undefined>();

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">麻薬: モルヒネ 10mg</p>
          <p className="text-muted-foreground">主担当: 田中（ns-tanaka）</p>
        </div>
        <CoSignBadge value={value} signedLabel="2人確認 済" pendingLabel="2人確認 要" />
      </div>

      <CoSign
        primaryId="ns-tanaka"
        attestations={[
          { id: "drug", label: "薬剤名・規格・用量を確認した" },
          { id: "patient", label: "患者・指示を確認した" },
        ]}
        value={value}
        onSign={setValue}
      />

      {value ? (
        <button
          type="button"
          className="self-end text-xs text-muted-foreground underline"
          onClick={() => setValue(undefined)}
        >
          リセット
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">
          ヒント: 確認者IDに ns-tanaka を入れると同一人物ガードが働きます。
        </p>
      )}
    </div>
  );
}`
    : `import * as React from "react";
import { CoSign, CoSignBadge, type CoSignValue } from "@gunjo/ui";

export function MedicationDoubleCheck() {
  const [value, setValue] = React.useState<CoSignValue | undefined>();

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          <p className="font-medium text-foreground">Controlled drug: Morphine 10mg</p>
          <p className="text-muted-foreground">Primary: Tanaka (ns-tanaka)</p>
        </div>
        <CoSignBadge
          value={value}
          signedLabel="Second review complete"
          pendingLabel="Second review required"
        />
      </div>

      <CoSign
        primaryId="ns-tanaka"
        signerLabel="Second reviewer ID"
        reasonLabel="Reason"
        samePersonError="The second reviewer must be different from the primary."
        labels={{
          sign: "Sign as second reviewer",
          signed: "Second review complete",
          pending: "Second review required",
          signerOf: (id) => \`Reviewer: \${id}\`,
          signDisabledAttestations: "Check every attestation before signing.",
          signDisabledSigner: "Enter the second reviewer ID before signing.",
        }}
        attestations={[
          { id: "drug", label: "Drug, strength, and dose checked" },
          { id: "patient", label: "Patient and order checked" },
        ]}
        value={value}
        onSign={setValue}
      />

      {value ? (
        <button
          type="button"
          className="self-end text-xs text-muted-foreground underline"
          onClick={() => setValue(undefined)}
        >
          Reset
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Tip: enter ns-tanaka to see the same-person guard.
        </p>
      )}
    </div>
  );
}`;

  const propsData = [
    {
      name: "primaryId",
      type: "string",
      description: locale === "ja"
        ? "主担当者の ID です。確認者が同一人物にならないように判定します。"
        : "Primary actor id. Used to prevent the second reviewer from being the same person.",
    },
    {
      name: "attestations",
      type: "CoSignAttestation[]",
      description: locale === "ja"
        ? "署名前に確認するチェック項目です。すべて選択されるまで署名できません。"
        : "Checklist items that must all be selected before signing.",
    },
    {
      name: "value",
      type: "CoSignValue | undefined",
      description: locale === "ja"
        ? "署名済みの値です。値がある場合は読み取り専用の署名済み状態になります。"
        : "Signed value. When present, CoSign renders the read-only signed state.",
    },
    {
      name: "onSign",
      type: "(value: CoSignValue) => void",
      description: locale === "ja"
        ? "2人目が署名した時に呼ばれます。"
        : "Called when the second reviewer signs.",
    },
    {
      name: "requireReason",
      type: "boolean",
      default: "false",
      description: locale === "ja"
        ? "署名前に理由入力を必須にします。"
        : "Requires a reason before signing.",
    },
    {
      name: "signerLabel / reasonLabel / samePersonError",
      type: "ReactNode",
      description: locale === "ja"
        ? "確認者 ID、理由、同一人物エラーの文言です。"
        : "Labels for signer id, reason, and same-person error.",
    },
    {
      name: "labels",
      type: "{ sign?, signed?, pending?, signerOf?, signDisabledAttestations?, signDisabledSigner?, signDisabledReason? }",
      description: locale === "ja"
        ? "ボタン、署名済み表示、確認者表示、署名ボタンの無効理由を差し替えます。"
        : "Overrides button, signed-state, pending, signer display, and disabled signing reasons.",
    },
    {
      name: "CoSignBadge",
      type: "{ value?: CoSignValue }",
      description: locale === "ja"
        ? "署名済み/未署名を短いバッジとして表示する補助コンポーネントです。"
        : "Companion badge for signed and pending states.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "CoSign", href: "/docs/components/co-sign" },
        { name: "CoSignBadge", href: "/docs/components/co-sign" },
        { name: "Checkbox", href: "/docs/components/checkbox" },
        { name: "Input", href: "/docs/components/input" },
        { name: "Button", href: "/docs/components/button" },
      ]}
      relatedComponents={[
        { name: "SignedRecord", href: "/docs/components/signed-record" },
        { name: "ApprovalWorkflow", href: "/docs/components/approval-workflow" },
        { name: "SafetyBanner", href: "/docs/components/safety-banner" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto">
        <CoSignPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "pending",
              title: locale === "ja" ? "未署名" : "Pending",
              description: locale === "ja"
                ? "確認項目をすべて選び、主担当者と異なる ID を入力すると署名できます。"
                : "The user must check every attestation and enter a reviewer id different from the primary.",
              preview: <CoSignPreview locale={locale} />,
              code: usageCode,
            },
            {
              key: "require-reason",
              title: locale === "ja" ? "理由必須" : "Reason required",
              description: locale === "ja"
                ? "例外対応やリスクの高い操作では、理由入力を署名前に必須にできます。"
                : "For exceptional or higher-risk actions, require a reason before signing.",
              preview: <CoSignPreview locale={locale} requireReason />,
              code: locale === "ja"
                ? `<CoSign
  primaryId="ns-tanaka"
  requireReason
  signerLabel="確認者ID（2人目）"
  reasonLabel="理由"
  samePersonError="主担当者と同一人物では確認できません。"
  labels={{
    sign: "2人確認して署名",
    signed: "2人確認 済",
    signDisabledAttestations: "すべての確認項目を選択してください。",
    signDisabledSigner: "確認者 ID を入力してください。",
    signDisabledReason: "理由を入力してください。",
  }}
  attestations={[
    { id: "drug", label: "薬剤名・規格・用量を確認した" },
    { id: "patient", label: "患者・指示を確認した" },
  ]}
/>`
                : `<CoSign
  primaryId="ns-tanaka"
  requireReason
  signerLabel="Second reviewer ID"
  reasonLabel="Reason"
  samePersonError="The second reviewer must be different from the primary."
  labels={{
    sign: "Sign as second reviewer",
    signed: "Second review complete",
    signDisabledAttestations: "Check every attestation before signing.",
    signDisabledSigner: "Enter the second reviewer ID before signing.",
    signDisabledReason: "Enter a reason before signing.",
  }}
  attestations={[
    { id: "drug", label: "Drug, strength, and dose checked" },
    { id: "patient", label: "Patient and order checked" },
  ]}
/>`,
            },
            {
              key: "signed",
              title: locale === "ja" ? "署名済み" : "Signed",
              description: locale === "ja"
                ? "value がある場合は、確認者と時刻を持つ読み取り専用状態として表示します。"
                : "When value is present, the component renders a read-only signed state.",
              preview: <CoSignPreview locale={locale} initialValue={createSignedValue()} />,
              code: locale === "ja"
                ? `const signedValue = {
  signerId: "ns-sato",
  attestedAt: "2026-06-30T09:30:00.000Z",
  attestations: ["drug", "patient"],
};

<CoSign
  value={signedValue}
  primaryId="ns-tanaka"
  signerLabel="確認者ID（2人目）"
  labels={{
    signed: "2人確認 済",
    signerOf: (id) => \`確認者: \${id}\`,
  }}
/>`
                : `const signedValue = {
  signerId: "ns-sato",
  attestedAt: "2026-06-30T09:30:00.000Z",
  attestations: ["drug", "patient"],
};

<CoSign
  value={signedValue}
  primaryId="ns-tanaka"
  signerLabel="Second reviewer ID"
  labels={{
    signed: "Second review complete",
    signerOf: (id) => \`Reviewer: \${id}\`,
  }}
/>`,
            },
            {
              key: "gated-action",
              title: locale === "ja" ? "操作のガード" : "Gated action",
              description: locale === "ja"
                ? "後続の実行ボタンは、2人確認が完了するまで無効化し、理由をツールチップで説明します。"
                : "Disable the follow-up action until the second review is complete, with tooltip feedback.",
              preview: <GatedActionPreview locale={locale} />,
              code: locale === "ja"
                ? `import * as React from "react";
import { Button, CoSign, Tooltip, TooltipContent, TooltipTrigger, type CoSignValue } from "@gunjo/ui";

export function GatedMedicationAction() {
  const [value, setValue] = React.useState<CoSignValue | undefined>();

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
      <CoSign
        primaryId="ns-tanaka"
        signerLabel="確認者ID（2人目）"
        samePersonError="主担当者と同一人物では確認できません。"
        labels={{
          sign: "2人確認して署名",
          signed: "2人確認 済",
          signDisabledAttestations: "すべての確認項目を選択してください。",
          signDisabledSigner: "確認者 ID を入力してください。",
        }}
        attestations={[{ id: "patient", label: "患者・指示を確認した" }]}
        value={value}
        onSign={setValue}
      />

      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={!value ? "inline-flex cursor-not-allowed" : "inline-flex"}>
              <Button disabled={!value} variant="destructive">投与を記録</Button>
            </span>
          </TooltipTrigger>
          {!value ? <TooltipContent>2人確認が完了するまで実行できません。</TooltipContent> : null}
        </Tooltip>
      </div>
    </div>
  );
}`
                : `import * as React from "react";
import { Button, CoSign, Tooltip, TooltipContent, TooltipTrigger, type CoSignValue } from "@gunjo/ui";

export function GatedMedicationAction() {
  const [value, setValue] = React.useState<CoSignValue | undefined>();

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
      <CoSign
        primaryId="ns-tanaka"
        signerLabel="Second reviewer ID"
        samePersonError="The second reviewer must be different from the primary."
        labels={{
          sign: "Sign as second reviewer",
          signed: "Second review complete",
          signDisabledAttestations: "Check every attestation before signing.",
          signDisabledSigner: "Enter the second reviewer ID before signing.",
        }}
        attestations={[{ id: "patient", label: "Patient and order checked" }]}
        value={value}
        onSign={setValue}
      />

      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={!value ? "inline-flex cursor-not-allowed" : "inline-flex"}>
              <Button disabled={!value} variant="destructive">Record administration</Button>
            </span>
          </TooltipTrigger>
          {!value ? <TooltipContent>Complete the second review before running this action.</TooltipContent> : null}
        </Tooltip>
      </div>
    </div>
  );
}`,
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
