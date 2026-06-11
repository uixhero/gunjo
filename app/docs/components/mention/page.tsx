"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { PropsTable } from "@/components/doc/PropsTable";
import { MentionDemo } from "@/components/demos/MentionDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, Mention } from "@gunjo/ui";
import * as React from "react";

const PEOPLE_EN = [
    { id: "alice", label: "alice", hint: "Alice Chen" },
    { id: "alex", label: "alex", hint: "Alex Park" },
    { id: "bob", label: "bob", hint: "Bob Tanaka" },
    { id: "carol", label: "carol", hint: "Carol Lee" },
    { id: "dan", label: "dan", hint: "Dan Park" },
    { id: "erin", label: "erin", hint: "Erin Liu" },
];

const PEOPLE_JA = [
    { id: "tanaka", label: "田中", hint: "デザイナー" },
    { id: "sato", label: "佐藤", hint: "エンジニア" },
    { id: "suzuki", label: "鈴木", hint: "PM" },
    { id: "ito", label: "伊藤", hint: "QA" },
    { id: "yamada", label: "山田", hint: "サポート" },
    { id: "takahashi", label: "高橋", hint: "営業" },
];

const TAGS_EN = [
    { id: "urgent", label: "urgent", hint: "Needs response" },
    { id: "review", label: "review", hint: "Needs review" },
    { id: "blocked", label: "blocked", hint: "Blocked task" },
];

const TAGS_JA = [
    { id: "urgent", label: "緊急", hint: "優先対応" },
    { id: "review", label: "レビュー", hint: "確認待ち" },
    { id: "blocked", label: "ブロック", hint: "進行不可" },
];

function MentionStatePreview({
    initialValue,
    trigger = "@",
    placeholder,
    disabled,
}: {
    initialValue: string;
    trigger?: string;
    placeholder: string;
    disabled?: boolean;
}) {
    const { locale } = useLocale();
    const [value, setValue] = React.useState(initialValue);
    const options = trigger === "#"
        ? locale === "ja" ? TAGS_JA : TAGS_EN
        : locale === "ja" ? PEOPLE_JA : PEOPLE_EN;

    const field = (
        <Mention
            id="mention-state"
            value={value}
            onValueChange={setValue}
            options={options}
            trigger={trigger}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="mention-state">
                {trigger === "#"
                    ? locale === "ja"
                        ? "タグ付きメモ"
                        : "Tagged note"
                    : locale === "ja"
                    ? "メッセージ"
                    : "Message"}
            </FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "このスレッドはアーカイブ済みのため編集できません。" : "This thread is archived and cannot be edited."}>
                        {field}
                    </DisabledReasonTooltip>
                ) : (
                    field
                )}
            </FormControl>
        </FormGroup>
    );
}

export default function MentionPage() {
    const { locale, sectionLabels } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { Code, FormControl, FormDescription, FormGroup, FormLabel, Mention } from "@gunjo/ui";

const PEOPLE = [
  ${locale === "ja"
      ? `{ id: "tanaka", label: "田中", hint: "デザイナー" },
  { id: "sato", label: "佐藤", hint: "エンジニア" },
  { id: "suzuki", label: "鈴木", hint: "PM" },`
      : `{ id: "alice", label: "alice", hint: "Alice Chen" },
  { id: "alex", label: "alex", hint: "Alex Park" },
  { id: "bob", label: "bob", hint: "Bob Tanaka" },`}
];

export function MentionDemo() {
  const [value, setValue] = React.useState("${locale === "ja" ? "担当は @田" : "Hi @al"}");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="mention-message">${locale === "ja" ? "メッセージ" : "Message"}</FormLabel>
      <FormControl>
        <Mention
          id="mention-message"
          value={value}
          onValueChange={setValue}
          options={PEOPLE}
          placeholder="${locale === "ja" ? "@ を入力してメンションを追加" : "Type @ to mention..."}"
          rows={3}
        />
      </FormControl>
      <FormDescription>
        ${locale === "ja" ? "候補を表示するには" : "Type"} <Code>@</Code>${locale === "ja" ? " を入力します。" : " to trigger suggestions."}
      </FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, Mention } from "@gunjo/ui";

export function MessageField() {
  const [text, setText] = React.useState("");

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="message">${locale === "ja" ? "メッセージ" : "Message"}</FormLabel>
      <FormControl>
        <Mention
          id="message"
          options={teamMembers}
          value={text}
          onValueChange={setText}
          trigger="@"
          placeholder="${locale === "ja" ? "@ を入力して担当者をメンション" : "Type @ to mention a teammate"}"
        />
      </FormControl>
    </FormGroup>
  );
}`;

    const propsData = [
        {
            name: "value",
            type: "string",
            description: locale === "ja" ? "テキストエリアに表示する現在の入力内容です。" : "Controlled textarea value.",
        },
        {
            name: "onValueChange",
            type: "(value: string) => void",
            description:
                locale === "ja"
                    ? "入力、または候補の挿入で値が変わった時に呼ばれます。"
                    : "Called when typing or mention insertion changes the value.",
        },
        {
            name: "trigger",
            type: "string",
            default: "'@'",
            description:
                locale === "ja"
                    ? "候補リストを開くための文字です。"
                    : "Character that opens the suggestion list.",
        },
        {
            name: "options",
            type: "MentionOption[]",
            description:
                locale === "ja"
                    ? "候補として表示する項目です。`id`、`label`、任意の `hint` を渡します。"
                    : "Suggestion items with `id`, `label`, and optional `hint`.",
        },
        {
            name: "maxSuggestions",
            type: "number",
            default: "6",
            description:
                locale === "ja"
                    ? "一度に表示する候補数の上限です。"
                    : "Maximum number of suggestions shown at once.",
        },
        {
            name: "placeholder / disabled / rows",
            type: "TextareaHTMLAttributes",
            description:
                locale === "ja"
                    ? "テキストエリアに渡せる標準属性を指定できます。"
                    : "Standard textarea props.",
        },
    ];

    return (
        <ComponentLayout
            title={metadata.mention.title}
            description={metadata.mention.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Mention", href: "/docs/components/mention" },
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "FormGroup", href: "/docs/components/form" },
                { name: "FormLabel", href: "/docs/components/form" },
                { name: "FormControl", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Command", href: "/docs/components/command" },
                { name: "Combobox", href: "/docs/components/combobox" },
                { name: "TagInput", href: "/docs/components/tag-input" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/mention" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="md">
                <MentionDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "mention-trigger",
                            title: locale === "ja" ? "メンション候補" : "Mention suggestions",
                            description:
                                locale === "ja"
                                    ? "`@` 以降の入力に一致する候補を表示し、Enter キーまたはクリックで挿入します。"
                                    : "Filters suggestions after `@` and inserts the selected item with Enter or click.",
                            preview: (
                                <MentionStatePreview
                                    initialValue={locale === "ja" ? "担当は @田" : "Owner: @al"}
                                    placeholder={locale === "ja" ? "@ を入力" : "Type @"}
                                />
                            ),
                            previewHeight: 360,
                            code: usageCode,
                        },
                        {
                            key: "custom-trigger",
                            title: locale === "ja" ? "トリガー文字の変更" : "Custom trigger",
                            description:
                                locale === "ja"
                                    ? "メンション以外の用途では、`#` のような別のトリガー文字も使えます。"
                                    : "Use a different trigger such as `#` when the picker represents tags instead of people.",
                            preview: (
                                <MentionStatePreview
                                    initialValue={locale === "ja" ? "#緊" : "#ur"}
                                    trigger="#"
                                    placeholder={locale === "ja" ? "# を入力してタグを追加" : "Type # to tag"}
                                />
                            ),
                            previewHeight: 360,
                            code: `import { Mention } from "@gunjo/ui";

<Mention
  trigger="#"
  options={tags}
  value={value}
  onValueChange={setValue}
  placeholder="${locale === "ja" ? "# を入力してタグを追加" : "Type # to tag"}"
/>`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "編集できない理由はツールチップと補足文で伝えます。"
                                    : "Explain why editing is unavailable with a Tooltip and supporting text.",
                            preview: (
                                <MentionStatePreview
                                    initialValue={locale === "ja" ? "アーカイブ済みのメッセージです。" : "Archived message."}
                                    placeholder={locale === "ja" ? "編集できません" : "Locked"}
                                    disabled
                                />
                            ),
                            previewHeight: 210,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Mention } from "@gunjo/ui";

<DisabledReasonTooltip fullWidth reason="${locale === "ja" ? "このスレッドはアーカイブ済みのため編集できません。" : "This thread is archived and cannot be edited."}">
  <Mention disabled value={value} options={people} />
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
