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
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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
    const code = locale === "ja"
        ? `import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

export function TextareaDemo() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="message">お問い合わせ内容</FormLabel>
      <FormControl>
        <Textarea id="message" placeholder="内容を入力してください。" />
      </FormControl>
      <FormDescription>送信内容はサポートチームに共有されます。</FormDescription>
    </FormGroup>
  );
}`
        : `import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

export function TextareaDemo() {
  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="message">Your message</FormLabel>
      <FormControl>
        <Textarea id="message" placeholder="Type your message here." />
      </FormControl>
      <FormDescription>Your message will be copied to the support team.</FormDescription>
    </FormGroup>
  );
}`;
    const usageCode = locale === "ja"
        ? `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

const LIMIT = 120;

export function MemoField() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="memo">メモ</FormLabel>
      <FormControl>
        <Textarea
          id="memo"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          maxLength={LIMIT}
          rows={4}
        />
      </FormControl>
      <FormDescription>複数行の説明や補足を入力できます。</FormDescription>
    </FormGroup>
  );
}`
        : `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, Textarea } from "@gunjo/ui";

const LIMIT = 120;

export function MemoField() {
  const [value, setValue] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="memo">Notes</FormLabel>
      <FormControl>
        <Textarea
          id="memo"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          maxLength={LIMIT}
          rows={4}
        />
      </FormControl>
      <FormDescription>Use this for multi-line descriptions.</FormDescription>
    </FormGroup>
  );
}`;
    const propsData = [
        { name: "label", type: "ReactNode", description: locale === "ja" ? "コントロール上部に表示し htmlFor で関連付けるラベルです（Select / Checkbox と同様）。" : "Visible label rendered above the control and associated via htmlFor (like Select / Checkbox)." },
        { name: "description", type: "ReactNode", description: locale === "ja" ? "コントロール下の補助テキストです。aria-describedby で関連付きます。" : "Helper text under the control, wired via aria-describedby." },
        { name: "showCount", type: "boolean", default: "false", description: locale === "ja" ? "コントロール下に文字数を表示します。maxLength と併用すると count / max 形式になり、aria-describedby で関連付きます。" : "Show a character-count readout under the control. With maxLength it renders count / max, wired via aria-describedby." },
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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: テキストエリア（Textarea）" : "UIXHERO: Textarea (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/textarea`,
                },
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
                            code: `import * as React from "react";
import { Textarea } from "@gunjo/ui";

export function CountedTextarea() {
  const [value, setValue] = React.useState("");

  return (
    <Textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
      maxLength={120}
      rows={4}
    />
  );
}`,
                        },
                        {
                            key: "show-count",
                            title: locale === "ja" ? "文字数カウント（組み込み）" : "Built-in character count",
                            description: locale === "ja" ? "showCount を付けるだけでカウント表示が出ます。maxLength と併用で count / max 形式に。" : "Add showCount for a built-in readout — pair with maxLength for count / max.",
                            preview: (
                                <div className="w-full max-w-sm">
                                    <Textarea
                                        label={locale === "ja" ? "メモ" : "Notes"}
                                        showCount
                                        maxLength={120}
                                        rows={4}
                                        defaultValue={locale === "ja" ? "次回リリースで確認する内容をまとめます。" : "Summarize what should be reviewed next release."}
                                    />
                                </div>
                            ),
                            previewHeight: 230,
                            code: locale === "ja"
                                ? `import { Textarea } from "@gunjo/ui";

export function NoteTextarea() {
  return (
    <Textarea label="メモ" showCount maxLength={120} rows={4} />
  );
}`
                                : `import { Textarea } from "@gunjo/ui";

export function NoteTextarea() {
  return (
    <Textarea label="Notes" showCount maxLength={120} rows={4} />
  );
}`,
                        },
                        {
                            key: "invalid",
                            title: locale === "ja" ? "バリデーションエラー" : "Validation error",
                            description: locale === "ja" ? "エラー時は aria-invalid と destructive 色の補足文で伝えます。" : "Use aria-invalid and destructive helper text for errors.",
                            preview: <TextareaStatePreview invalid />,
                            previewHeight: 230,
                            code: `import { Textarea } from "@gunjo/ui";

export function InvalidTextarea() {
  return (
    <Textarea aria-invalid rows={4} />
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "編集できない理由はツールチップと補足文で説明します。" : "Explain disabled state with a tooltip and helper text.",
                            preview: <TextareaStatePreview disabled />,
                            previewHeight: 230,
                            code: locale === "ja"
                                ? `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Textarea } from "@gunjo/ui";

export function LockedNoteTextarea() {
  return (
    <DisabledReasonTooltip fullWidth reason="このメモは承認済みのため編集できません。">
      <Textarea disabled rows={4} />
    </DisabledReasonTooltip>
  );
}`
                                : `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Textarea } from "@gunjo/ui";

export function LockedNoteTextarea() {
  return (
    <DisabledReasonTooltip
      fullWidth
      reason="This note is approved and cannot be edited."
    >
      <Textarea disabled rows={4} />
    </DisabledReasonTooltip>
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>高さはクラスで決まっていて、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rows</code> では変わりません。</strong>資料は「<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rows</code> でだいたいこれくらい書いてほしいという期待量を示す」を挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Textarea</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-20</code>（80px）を持つので、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rows</code> を渡しても見た目の高さは変わりません。高さを変えるときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code> で <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-32</code> のように上書きすることになります。ここは資料の勧めをそのまま受け取れない場所です。
                        </li>
                        <li>
                            <strong>縦に伸ばす操作は塞いでいない。</strong>資料は「<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">resize</code> を CSS で殺す」を禁止に挙げています。GUNJO は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">resize</code> に一切触れていないので、ブラウザの既定どおり利用者が自分で広げられます。一方で、入力に合わせて自動で伸びる仕組みも持っていません。
                        </li>
                        <li>
                            <strong>文字数は数えるが、色は変えない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showCount</code> を渡すと右下に数が出て、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">maxLength</code> があれば「いまの数と上限」の形になります。この数は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code> で入力欄に結んであるので、読み上げでも一緒に伝わります。資料が挙げる「残り20から30文字で警告色に変える」は入れていません。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">maxLength</code> を付ければブラウザ側で入力が止まるので、まず止まることを優先しました。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The height comes from a class, so <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rows</code> does nothing.</strong> The article suggests using <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rows</code> to signal roughly how much text is expected. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Textarea</code> carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-20</code> (80px), so passing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rows</code> does not change the rendered height; changing it means overriding with something like <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">h-32</code> in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">className</code>. This is one place where the article advice cannot be taken as written.
                        </li>
                        <li>
                            <strong>Dragging the corner is not blocked.</strong> The article forbids killing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">resize</code> in CSS. GUNJO never touches <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">resize</code>, so the browser default stands and the reader can enlarge the box. Auto-growing with the content is not implemented either.
                        </li>
                        <li>
                            <strong>The characters are counted, but the colour never changes.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">showCount</code> and a readout appears at the bottom right, becoming current-over-limit when <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">maxLength</code> is set. It is tied to the field with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code>, so it reaches screen readers too. The warning colour the article asks for at twenty to thirty characters remaining is not implemented: with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">maxLength</code> the browser stops the input anyway, and stopping was treated as the more important half.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
