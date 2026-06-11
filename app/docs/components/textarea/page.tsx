"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { TextareaDemo } from "@/components/demos/FormDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

const CHAR_LIMIT = 120;

function TextareaStatePreview({
    counter,
    disabled,
    invalid,
}: {
    counter?: boolean;
    disabled?: boolean;
    invalid?: boolean;
}) {
    const { locale } = useLocale();
    const [value, setValue] = React.useState(
        locale === "ja" ? "次回リリースで確認する内容をまとめます。" : "Summarize what should be reviewed in the next release."
    );
    const remaining = CHAR_LIMIT - value.length;
    const textarea = (
        <Textarea
            id={disabled ? "textarea-disabled" : invalid ? "textarea-invalid" : "textarea-state"}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder={locale === "ja" ? "内容を入力してください。" : "Type your message here."}
            rows={4}
            maxLength={counter ? CHAR_LIMIT : undefined}
            aria-invalid={invalid ? true : undefined}
            disabled={disabled}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor={disabled ? "textarea-disabled" : invalid ? "textarea-invalid" : "textarea-state"}>
                {locale === "ja" ? "メモ" : "Notes"}
            </FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "このメモは承認済みのため編集できません。" : "This note is approved and cannot be edited."}>
                        {textarea}
                    </DisabledReasonTooltip>
                ) : (
                    textarea
                )}
            </FormControl>
            <FormDescription className={invalid ? "text-destructive" : undefined}>
                {disabled
                    ? locale === "ja"
                        ? "変更が必要な場合は承認を取り消してください。"
                        : "Reopen the approval before editing."
                    : invalid
                        ? locale === "ja"
                            ? "本文は10文字以上で入力してください。"
                            : "Enter at least 10 characters."
                        : counter
                            ? locale === "ja"
                                ? `残り ${remaining} 文字`
                                : `${remaining} characters left`
                            : locale === "ja"
                                ? "複数行の説明や補足を入力できます。"
                                : "Use this for multi-line descriptions."}
            </FormDescription>
        </FormGroup>
    );
}

export default function TextareaPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

export function TextareaDemo() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="message">${locale === "ja" ? "お問い合わせ内容" : "Your message"}</FormLabel>
      <FormControl>
        <Textarea id="message" placeholder="${locale === "ja" ? "内容を入力してください。" : "Type your message here."}" />
      </FormControl>
      <FormDescription>${locale === "ja" ? "送信内容はサポートチームに共有されます。" : "Your message will be copied to the support team."}</FormDescription>
    </FormGroup>
  );
}`;
    const usageCode = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

const LIMIT = 120;

export function MemoField() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="memo">${locale === "ja" ? "メモ" : "Notes"}</FormLabel>
      <FormControl>
        <Textarea
          id="memo"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          maxLength={LIMIT}
          rows={4}
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "複数行の説明や補足を入力できます。" : "Use this for multi-line descriptions."}</FormDescription>
    </FormGroup>
  );
}`;
    const propsData = [
        { name: "value / defaultValue", type: "string", description: locale === "ja" ? "入力値です。制御・非制御のどちらでも使えます。" : "Textarea value. Use controlled or uncontrolled mode." },
        { name: "onChange", type: "React.ChangeEventHandler<HTMLTextAreaElement>", description: locale === "ja" ? "入力内容が変わった時に呼ばれます。" : "Called when the text changes." },
        { name: "rows", type: "number", description: locale === "ja" ? "表示する行数です。" : "Visible row count." },
        { name: "placeholder", type: "string", description: locale === "ja" ? "未入力時に表示する補助テキストです。" : "Placeholder shown when empty." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "編集できない状態にします。理由はツールチップで補足します。" : "Disables editing. Explain the reason with a tooltip." },
        { name: "aria-invalid", type: "boolean", description: locale === "ja" ? "入力エラー状態を支援技術と視覚表現へ伝えます。" : "Marks the field invalid for assistive tech and styling." },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).textarea.title}
            description={(inputsMetadata as Record<string, { description: string }>).textarea.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
                { name: "FormDescription", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "EditableField", href: "/docs/components/editable-field" },
                { name: "Mention", href: "/docs/components/mention" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/textarea" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <TextareaDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "ラベル付き" : "With label",
                            description: locale === "ja" ? "ラベル、入力欄、補足文を同じ幅で揃えます。" : "Align the label, textarea, and helper text to the same field width.",
                            preview: <TextareaStatePreview />,
                            previewHeight: 230,
                            code,
                        },
                        {
                            key: "counter",
                            title: locale === "ja" ? "文字数カウンター" : "Character counter",
                            description: locale === "ja" ? "残り文字数を表示し、送信前に入力制限を確認できます。" : "Show the remaining character budget before submit.",
                            preview: <TextareaStatePreview counter />,
                            previewHeight: 230,
                            code: `<Textarea value={value} onChange={setValue} maxLength={120} rows={4} />`,
                        },
                        {
                            key: "invalid",
                            title: locale === "ja" ? "バリデーションエラー" : "Validation error",
                            description: locale === "ja" ? "エラー時は aria-invalid と destructive 色の補足文で伝えます。" : "Use aria-invalid and destructive helper text for errors.",
                            preview: <TextareaStatePreview invalid />,
                            previewHeight: 230,
                            code: `<Textarea aria-invalid rows={4} />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "編集できない理由はツールチップと補足文で説明します。" : "Explain disabled state with a tooltip and helper text.",
                            preview: <TextareaStatePreview disabled />,
                            previewHeight: 230,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "このメモは承認済みのため編集できません。" : "This note is approved and cannot be edited."}">
  <Textarea disabled rows={4} />
</DisabledReasonTooltip>`,
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
