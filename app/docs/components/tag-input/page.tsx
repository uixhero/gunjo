"use client";

import * as React from "react";
import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { FormControl, FormDescription, FormGroup, FormLabel, TagInput } from "@gunjo/ui";

function TagInputStatePreview({ disabled, maxTags }: { disabled?: boolean; maxTags?: number }) {
    const { locale } = useLocale();
    const [tags, setTags] = React.useState<string[]>(locale === "ja" ? ["資料", "確認中"] : ["docs", "review"]);
    const input = (
        <TagInput
            id={disabled ? "tag-disabled" : "tag-state"}
            value={tags}
            onValueChange={setTags}
            placeholder={locale === "ja" ? "タグを追加..." : "Add tag..."}
            removeLabel={locale === "ja" ? "タグを削除" : "Remove tag"}
            maxTags={maxTags}
            disabled={disabled}
        />
    );

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor={disabled ? "tag-disabled" : "tag-state"}>
                {locale === "ja" ? "タグ" : "Tags"}
            </FormLabel>
            <FormControl>
                {disabled ? (
                    <DisabledReasonTooltip fullWidth reason={locale === "ja" ? "この素材はアーカイブ済みです。" : "This asset is archived."}>
                        {input}
                    </DisabledReasonTooltip>
                ) : (
                    input
                )}
            </FormControl>
            <FormDescription>
                {disabled
                    ? locale === "ja"
                        ? "アーカイブ済みの素材ではタグを編集できません。"
                        : "Archived assets cannot be edited."
                    : maxTags
                        ? locale === "ja"
                            ? `最大 ${maxTags} 件まで追加できます。`
                            : `Add up to ${maxTags} tags.`
                        : locale === "ja"
                            ? "Enter またはカンマでタグを追加できます。"
                            : "Press Enter or comma to add a tag."}
            </FormDescription>
        </FormGroup>
    );
}

export default function TagInputPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/tag-input", locale);
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, TagInput } from "@gunjo/ui";

export function TagInputDemo() {
  const [tags, setTags] = React.useState<string[]>([${locale === "ja" ? '"資料", "確認中"' : '"docs", "review"'}]);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="tags">${locale === "ja" ? "タグ" : "Tags"}</FormLabel>
      <FormControl>
        <TagInput
          id="tags"
          value={tags}
          onValueChange={setTags}
          placeholder="${locale === "ja" ? "タグを追加..." : "Add tag..."}"
          removeLabel="${locale === "ja" ? "タグを削除" : "Remove tag"}"
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "Enter またはカンマでタグを追加できます。" : "Press Enter or comma to add a tag."}</FormDescription>
    </FormGroup>
  );
}`;

    const usageCode = `import { FormControl, FormGroup, FormLabel, TagInput } from "@gunjo/ui";

<FormGroup className="w-full max-w-sm">
  <FormLabel htmlFor="tags">${locale === "ja" ? "タグ" : "Tags"}</FormLabel>
  <FormControl>
    <TagInput
      id="tags"
      value={tags}
      onValueChange={setTags}
      maxTags={5}
      removeLabel="${locale === "ja" ? "タグを削除" : "Remove tag"}"
    />
  </FormControl>
</FormGroup>`;

    const propsData = [
        { name: "id", type: "string", description: locale === "ja" ? "内部の入力欄に付与する id です。ラベルとの紐づけに使います。" : "Applied to the inner input so the label can target the field." },
        { name: "value", type: "string[]", description: locale === "ja" ? "外部から制御するタグ一覧です。" : "Controlled tag list." },
        { name: "onValueChange", type: "(value: string[]) => void", description: locale === "ja" ? "タグが変わった時に呼ばれます。" : "Called when the tag list changes." },
        { name: "placeholder", type: "string", default: "'Add tag...'", description: locale === "ja" ? "タグがない時に表示する補助テキストです。" : "Placeholder shown when there are no tags." },
        { name: "commitKeys", type: "string[]", default: "['Enter', ',']", description: locale === "ja" ? "入力中の文字列をタグとして確定するキーです。" : "Keys that commit the draft text as a tag." },
        { name: "dedupe", type: "boolean", default: "true", description: locale === "ja" ? "大文字小文字を無視して重複タグを拒否します。" : "Rejects duplicate tags case-insensitively." },
        { name: "maxTags", type: "number", description: locale === "ja" ? "追加できるタグ数の上限です。" : "Maximum number of tags." },
        { name: "removeLabel", type: "string", default: "'Remove tag'", description: locale === "ja" ? "削除ボタンの支援技術向けラベルです。" : "Accessible label for each remove button." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "編集できない状態にします。理由はツールチップで補足します。" : "Disables editing. Explain the reason with a tooltip." },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? metadata.tagInput.title}
            description={content?.description ?? metadata.tagInput.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TagInput", href: "/docs/components/tag-input" },
                { name: "Tag", href: "/docs/components/tag" },
                { name: "FormGroup", href: "/docs/components/form" },
            ]}
            relatedComponents={[
                { name: "Input", href: "/docs/components/input" },
                { name: "SearchInput", href: "/docs/components/search-input" },
                { name: "Mention", href: "/docs/components/mention" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
                <TagInputStatePreview />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "editable",
                            title: locale === "ja" ? "編集可能" : "Editable",
                            description: locale === "ja" ? "Enter またはカンマでタグを追加し、各タグの削除ボタンで取り外します。" : "Add tags with Enter or comma, then remove them with each tag action.",
                            preview: <TagInputStatePreview />,
                            code,
                        },
                        {
                            key: "limited",
                            title: locale === "ja" ? "上限あり" : "With max tags",
                            description: locale === "ja" ? "タグ数に上限がある場合は補足文で条件を伝えます。" : "When tags are limited, explain the limit in helper text.",
                            preview: <TagInputStatePreview maxTags={3} />,
                            code: `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, TagInput } from "@gunjo/ui";

export function LimitedTagInput() {
  const [tags, setTags] = React.useState<string[]>([${locale === "ja" ? '"資料", "確認中"' : '"docs", "review"'}]);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="limited-tags">${locale === "ja" ? "タグ" : "Tags"}</FormLabel>
      <FormControl>
        <TagInput
          id="limited-tags"
          value={tags}
          onValueChange={setTags}
          maxTags={3}
          placeholder="${locale === "ja" ? "タグを追加..." : "Add tag..."}"
          removeLabel="${locale === "ja" ? "タグを削除" : "Remove tag"}"
        />
      </FormControl>
      <FormDescription>${locale === "ja" ? "最大 3 件まで追加できます。" : "Add up to 3 tags."}</FormDescription>
    </FormGroup>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "編集できない理由はツールチップと補足文で伝えます。" : "Explain why editing is disabled with a tooltip and helper text.",
                            preview: <TagInputStatePreview disabled />,
                            code: `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, TagInput, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function DisabledTagInput() {
  const [tags, setTags] = React.useState<string[]>([${locale === "ja" ? '"資料", "確認中"' : '"docs", "review"'}]);

  return (
    <FormGroup className="w-full max-w-sm">
      <FormLabel htmlFor="tag-disabled">${locale === "ja" ? "タグ" : "Tags"}</FormLabel>
      <FormControl>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block w-full" tabIndex={0}>
              <TagInput
                id="tag-disabled"
                value={tags}
                onValueChange={setTags}
                placeholder="${locale === "ja" ? "タグを追加..." : "Add tag..."}"
                removeLabel="${locale === "ja" ? "タグを削除" : "Remove tag"}"
                disabled
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>${locale === "ja" ? "この素材はアーカイブ済みです。" : "This asset is archived."}</TooltipContent>
        </Tooltip>
      </FormControl>
      <FormDescription>${locale === "ja" ? "アーカイブ済みの素材ではタグを編集できません。" : "Archived assets cannot be edited."}</FormDescription>
    </FormGroup>
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
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
