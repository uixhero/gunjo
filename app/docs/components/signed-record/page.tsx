"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
  CodeCopyButton,
  ComponentLayout,
  ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
  SignedRecord,
  Textarea,
  type SignedRecordLabels,
  type SignedRecordValue,
} from "@gunjo/ui";

type Locale = "ja" | "en";

function labels(locale: Locale): SignedRecordLabels {
  return locale === "ja"
    ? {
        draft: "下書き",
        signed: "署名・確定済",
        sign: "署名・確定",
        locked: "確定済みの記録は変更できません。修正は追記で行います。",
        addendaTitle: "追記",
        addendum: "追記する",
        addendumBody: "追記内容",
        addendumReason: "理由",
        addendumSubmit: "追記する",
        cancel: "キャンセル",
        signedByLabel: "署名",
        authorAt: (author, at) => `${author}・${at}`,
      }
    : {
        draft: "Draft",
        signed: "Signed",
        sign: "Sign and lock",
        locked: "Signed records are locked. Changes must be appended as addenda.",
        addendaTitle: "Addenda",
        addendum: "Add addendum",
        addendumBody: "Addendum body",
        addendumReason: "Reason",
        addendumSubmit: "Append",
        cancel: "Cancel",
        signedByLabel: "Signed",
        authorAt: (author, at) => `${author} at ${at}`,
      };
}

function initialValue(locale: Locale, status: "draft" | "signed" = "draft"): SignedRecordValue {
  return status === "draft"
    ? { status: "draft", addenda: [] }
    : {
        status: "signed",
        signedBy: locale === "ja" ? "医師 山田" : "Dr. Yamada",
        signedAt: "2026-07-02T10:30:00.000Z",
        addenda: [
          {
            id: "addendum-1",
            author: locale === "ja" ? "医師 山田" : "Dr. Yamada",
            at: "2026-07-02T11:15:00.000Z",
            reason: locale === "ja" ? "電話確認" : "Phone confirmation",
            body: locale === "ja" ? "本人確認済み。退院後の連絡先を追記しました。" : "Identity confirmed. Added the post-discharge contact.",
          },
        ],
      };
}

function SignedRecordPreview({ locale, mode = "draft" }: { locale: Locale; mode?: "draft" | "signed" | "blocked" }) {
  const [record, setRecord] = React.useState<SignedRecordValue>(() => initialValue(locale, mode === "signed" ? "signed" : "draft"));
  const [body, setBody] = React.useState(
    mode === "blocked"
      ? ""
      : locale === "ja"
        ? "退院時説明を実施。次回外来は7月10日。"
        : "Discharge instructions completed. Follow-up is scheduled for July 10."
  );

  React.useEffect(() => {
    setRecord(initialValue(locale, mode === "signed" ? "signed" : "draft"));
    setBody(
      mode === "blocked"
        ? ""
        : locale === "ja"
          ? "退院時説明を実施。次回外来は7月10日。"
          : "Discharge instructions completed. Follow-up is scheduled for July 10."
    );
  }, [locale, mode]);

  const canSign = body.trim().length > 0;
  const reason = locale === "ja" ? "記録本文を入力すると署名できます。" : "Enter the record body before signing.";

  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={record}
        onChange={setRecord}
        signerId={locale === "ja" ? "医師 山田" : "Dr. Yamada"}
        canSign={canSign}
        cannotSignReason={reason}
        labels={labels(locale)}
        formatTime={(iso) => iso.slice(0, 16).replace("T", " ")}
      >
        {({ readOnly }) =>
          readOnly ? (
            <p className="whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-foreground">{body}</p>
          ) : (
            <Textarea
              rows={3}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={locale === "ja" ? "記録本文を入力" : "Enter record body"}
              aria-label={locale === "ja" ? "記録本文" : "Record body"}
            />
          )
        }
      </SignedRecord>
    </div>
  );
}

export default function SignedRecordDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/signed-record", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.signedRecord.title ?? "SignedRecord";
  const description = content?.description ?? metadata.signedRecord.description ?? "";

  const usageCode =
    locale === "ja"
      ? `import * as React from "react";
import { SignedRecord, Textarea, type SignedRecordValue } from "@gunjo/ui";

export function DischargeRecord() {
  const [record, setRecord] = React.useState<SignedRecordValue>({ status: "draft", addenda: [] });
  const [body, setBody] = React.useState("退院時説明を実施。次回外来は7月10日。");
  const canSign = body.trim().length > 0;

  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={record}
        onChange={setRecord}
        signerId="医師 山田"
        canSign={canSign}
        cannotSignReason="記録本文を入力すると署名できます。"
        formatTime={(iso) => iso.slice(0, 16).replace("T", " ")}
      >
        {({ readOnly }) =>
          readOnly ? (
            <p className="whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-foreground">
              {body}
            </p>
          ) : (
            <Textarea
              rows={3}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="記録本文を入力"
              aria-label="記録本文"
            />
          )
        }
      </SignedRecord>
    </div>
  );
}`
      : `import * as React from "react";
import { SignedRecord, Textarea, type SignedRecordValue } from "@gunjo/ui";

export function DischargeRecord() {
  const [record, setRecord] = React.useState<SignedRecordValue>({ status: "draft", addenda: [] });
  const [body, setBody] = React.useState("Discharge instructions completed. Follow-up is scheduled for July 10.");
  const canSign = body.trim().length > 0;

  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={record}
        onChange={setRecord}
        signerId="Dr. Yamada"
        canSign={canSign}
        cannotSignReason="Enter the record body before signing."
        formatTime={(iso) => iso.slice(0, 16).replace("T", " ")}
      >
        {({ readOnly }) =>
          readOnly ? (
            <p className="whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-foreground">
              {body}
            </p>
          ) : (
            <Textarea
              rows={3}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Enter record body"
              aria-label="Record body"
            />
          )
        }
      </SignedRecord>
    </div>
  );
}`;

  const signedStateCode =
    locale === "ja"
      ? `import { SignedRecord, type SignedRecordValue } from "@gunjo/ui";

const signedRecord: SignedRecordValue = {
  status: "signed",
  signedBy: "医師 山田",
  signedAt: "2026-07-02T10:30:00.000Z",
  addenda: [
    {
      id: "addendum-1",
      author: "医師 山田",
      at: "2026-07-02T11:15:00.000Z",
      reason: "電話確認",
      body: "本人確認済み。退院後の連絡先を追記しました。",
    },
  ],
};

export function SignedDischargeRecord() {
  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={signedRecord}
        onChange={() => undefined}
        signerId="医師 山田"
        formatTime={(iso) => iso.slice(0, 16).replace("T", " ")}
      >
        {() => (
          <p className="whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-foreground">
            退院時説明を実施。次回外来は7月10日。
          </p>
        )}
      </SignedRecord>
    </div>
  );
}`
      : `import { SignedRecord, type SignedRecordValue } from "@gunjo/ui";

const signedRecord: SignedRecordValue = {
  status: "signed",
  signedBy: "Dr. Yamada",
  signedAt: "2026-07-02T10:30:00.000Z",
  addenda: [
    {
      id: "addendum-1",
      author: "Dr. Yamada",
      at: "2026-07-02T11:15:00.000Z",
      reason: "Phone confirmation",
      body: "Identity confirmed. Added the post-discharge contact.",
    },
  ],
};

export function SignedDischargeRecord() {
  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={signedRecord}
        onChange={() => undefined}
        signerId="Dr. Yamada"
        formatTime={(iso) => iso.slice(0, 16).replace("T", " ")}
      >
        {() => (
          <p className="whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-foreground">
            Discharge instructions completed. Follow-up is scheduled for July 10.
          </p>
        )}
      </SignedRecord>
    </div>
  );
}`;

  const blockedStateCode =
    locale === "ja"
      ? `import * as React from "react";
import { SignedRecord, Textarea, type SignedRecordValue } from "@gunjo/ui";

export function MissingBodyDischargeRecord() {
  const [record, setRecord] = React.useState<SignedRecordValue>({ status: "draft", addenda: [] });
  const [body, setBody] = React.useState("");
  const canSign = body.trim().length > 0;

  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={record}
        onChange={setRecord}
        signerId="医師 山田"
        canSign={canSign}
        cannotSignReason="記録本文を入力すると署名できます。"
      >
        {() => (
          <Textarea
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="記録本文を入力"
            aria-label="記録本文"
          />
        )}
      </SignedRecord>
    </div>
  );
}`
      : `import * as React from "react";
import { SignedRecord, Textarea, type SignedRecordValue } from "@gunjo/ui";

export function MissingBodyDischargeRecord() {
  const [record, setRecord] = React.useState<SignedRecordValue>({ status: "draft", addenda: [] });
  const [body, setBody] = React.useState("");
  const canSign = body.trim().length > 0;

  return (
    <div className="w-full max-w-xl rounded-lg border bg-card p-4">
      <SignedRecord
        value={record}
        onChange={setRecord}
        signerId="Dr. Yamada"
        canSign={canSign}
        cannotSignReason="Enter the record body before signing."
      >
        {() => (
          <Textarea
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Enter record body"
            aria-label="Record body"
          />
        )}
      </SignedRecord>
    </div>
  );
}`;

  const propsData = [
    { name: "value", type: "SignedRecordValue", description: locale === "ja" ? "status / signedBy / signedAt / addenda を含む controlled state です。" : "Controlled state with status, signedBy, signedAt, and addenda." },
    { name: "onChange", type: "(value: SignedRecordValue) => void", description: locale === "ja" ? "署名または追記時に呼ばれます。" : "Called when the record is signed or an addendum is appended." },
    { name: "children", type: "({ readOnly }) => ReactNode", description: locale === "ja" ? "本文の render prop です。確定後は readOnly が true になります。" : "Render prop for the body. readOnly becomes true after signing." },
    { name: "signerId", type: "string", description: locale === "ja" ? "署名者と追記者として記録されるIDです。" : "Identifier recorded as signer and addendum author." },
    { name: "canSign", type: "boolean", default: "true", description: locale === "ja" ? "署名できる状態かどうかを渡します。" : "Controls whether the record can be signed." },
    { name: "cannotSignReason", type: "ReactNode", description: locale === "ja" ? "署名ボタンが無効な理由と復帰条件をツールチップで表示します。" : "Tooltip content explaining why signing is disabled and how to recover." },
    { name: "requireAddendumReason", type: "boolean", default: "true", description: locale === "ja" ? "追記時の理由入力を必須にします。" : "Requires a reason for each addendum." },
    { name: "formatTime", type: "(iso: string) => ReactNode", description: locale === "ja" ? "ISO タイムスタンプの表示を整形します。関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には timeFormat を使う。" : "Formats the display of ISO timestamps. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use timeFormat for RSC-safe formatting." },
    { name: "timeFormat", type: "Intl.DateTimeFormatOptions", description: locale === "ja" ? "シリアライズ可能な時刻フォーマット＝formatTime の RSC 安全な代替（例: { dateStyle: \"short\", timeStyle: \"short\" }）。new Date(iso) に en-US ロケール固定で適用。formatTime 指定時は無視。(#338)" : "Serializable time format — RSC-safe alternative to formatTime (e.g. { dateStyle: \"short\", timeStyle: \"short\" }). Applied to new Date(iso) with a fixed en-US locale. Ignored when formatTime is set. (#338)" },
    { name: "labels", type: "SignedRecordLabels", description: locale === "ja" ? "バッジ、ボタン、追記フォームの文言を差し替えます。" : "Localizes badges, buttons, and addendum form copy." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "SignedRecord", href: "/docs/components/signed-record" },
        { name: "Textarea", href: "/docs/components/textarea" },
      ]}
      relatedComponents={[{ name: "CoSign", href: "/docs/components/co-sign" }, { name: "EditableField", href: "/docs/components/editable-field" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <SignedRecordPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "draft", title: locale === "ja" ? "下書き" : "Draft", description: locale === "ja" ? "本文を編集し、本文が入力されている間は署名できます。" : "The body remains editable, and signing is available while the body has content.", preview: <SignedRecordPreview locale={locale} />, code: usageCode, previewBodyWidth: "lg" },
            { key: "signed", title: locale === "ja" ? "署名済み" : "Signed", description: locale === "ja" ? "署名後は本文がロックされ、修正は追記で残します。" : "After signing, the body is locked and changes are appended.", preview: <SignedRecordPreview locale={locale} mode="signed" />, code: signedStateCode, previewBodyWidth: "lg" },
            { key: "blocked", title: locale === "ja" ? "署名不可" : "Cannot sign", description: locale === "ja" ? "本文が空の間だけ署名ボタンを無効化し、ボタンのツールチップで復帰条件を示します。" : "The sign button is disabled only while the body is empty, and its tooltip explains how to recover.", preview: <SignedRecordPreview locale={locale} mode="blocked" />, code: blockedStateCode, previewBodyWidth: "lg" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
