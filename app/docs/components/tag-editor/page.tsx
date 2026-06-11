"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { TagEditor } from "@gunjo/ui";

const codeByLocale = {
    ja: `import * as React from "react";
import { TagEditor } from "@gunjo/ui";

export function Example() {
  const [tags, setTags] = React.useState(["ヒーロー", "Web"]);

  return (
    <TagEditor
      label="タグ"
      value={tags}
      onValueChange={setTags}
      suggestions={["キャンペーン", "SNS", "商品", "セール"]}
      placeholder="タグを追加..."
      removeLabel="タグを削除"
      maxTagsReachedLabel="タグは6件まで追加できます。不要なタグを削除してから追加してください。"
      maxTags={6}
    />
  );
}`,
    en: `import * as React from "react";
import { TagEditor } from "@gunjo/ui";

export function Example() {
  const [tags, setTags] = React.useState(["Hero", "Website"]);

  return (
    <TagEditor
      label="Tags"
      value={tags}
      onValueChange={setTags}
      suggestions={["Campaign", "SNS", "Product", "Sale"]}
      placeholder="Add tag..."
      removeLabel="Remove tag"
      maxTagsReachedLabel="You can add up to 6 tags. Remove a tag before adding another."
      maxTags={6}
    />
  );
}`,
} as const;

const compactCodeByLocale = {
    ja: `import * as React from "react";
import { TagEditor } from "@gunjo/ui";

export function CompactTagEditor() {
  const [tags, setTags] = React.useState(["SNS", "短尺"]);

  return (
    <TagEditor
      variant="compact"
      label="配信タグ"
      value={tags}
      onValueChange={setTags}
      suggestions={["広告", "縦型", "検証中"]}
      removeLabel="タグを削除"
    />
  );
}`,
    en: `import * as React from "react";
import { TagEditor } from "@gunjo/ui";

export function CompactTagEditor() {
  const [tags, setTags] = React.useState(["SNS", "Short form"]);

  return (
    <TagEditor
      variant="compact"
      label="Delivery tags"
      value={tags}
      onValueChange={setTags}
      suggestions={["Ad", "Vertical", "Testing"]}
      removeLabel="Remove tag"
    />
  );
}`,
} as const;

const limitedCodeByLocale = {
    ja: `import * as React from "react";
import { TagEditor } from "@gunjo/ui";

export function LimitedTagEditor() {
  const [tags, setTags] = React.useState(["Web", "広告", "公開前"]);

  return (
    <TagEditor
      label="最大3件"
      value={tags}
      onValueChange={setTags}
      suggestions={["SNS", "商品"]}
      removeLabel="タグを削除"
      maxTagsReachedLabel="タグは3件まで追加できます。不要なタグを削除してから追加してください。"
      maxTags={3}
    />
  );
}`,
    en: `import * as React from "react";
import { TagEditor } from "@gunjo/ui";

export function LimitedTagEditor() {
  const [tags, setTags] = React.useState(["Web", "Ad", "Pre-publish"]);

  return (
    <TagEditor
      label="Maximum 3"
      value={tags}
      onValueChange={setTags}
      suggestions={["SNS", "Product"]}
      removeLabel="Remove tag"
      maxTagsReachedLabel="You can add up to 3 tags. Remove a tag before adding another."
      maxTags={3}
    />
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "value", type: "string[]", required: true, description: "現在のタグです。" },
        { name: "onValueChange", type: "(value: string[]) => void", description: "タグの追加・削除時に呼び出されます。" },
        { name: "suggestions", type: "string[]", description: "入力欄の下に表示する候補タグです。既に選ばれたタグは除外されます。" },
        { name: "label", type: "ReactNode", default: "\"Tags\"", description: "タグ欄のラベルです。不要な場合は空にできます。" },
        { name: "placeholder", type: "string", default: "\"Add tag...\"", description: "入力欄のプレースホルダーです。" },
        { name: "removeLabel", type: "string", default: "\"Remove tag\"", description: "タグ削除ボタンのアクセシブル名とツールチップ文言です。" },
        { name: "maxTagsReachedLabel", type: "string", default: "\"Maximum number of tags reached\"", description: "最大数に達して候補を追加できないときに表示するツールチップ文言です。" },
        { name: "disabledLabel", type: "string", default: "\"Tag editing is disabled\"", description: "無効化された候補操作に表示する理由です。" },
        { name: "maxTags", type: "number", description: "追加できる最大タグ数です。" },
        { name: "variant", type: "\"default\" | \"compact\"", default: "\"default\"", description: "余白と入力密度を切り替えます。" },
        { name: "disabled", type: "boolean", default: "false", description: "入力と候補操作を無効化します。" },
    ],
    en: [
        { name: "value", type: "string[]", required: true, description: "Current tags." },
        { name: "onValueChange", type: "(value: string[]) => void", description: "Called when tags are added or removed." },
        { name: "suggestions", type: "string[]", description: "Suggested tags shown below the field. Already selected tags are filtered out." },
        { name: "label", type: "ReactNode", default: "\"Tags\"", description: "Label for the tag field. It can be omitted when another label is provided nearby." },
        { name: "placeholder", type: "string", default: "\"Add tag...\"", description: "Placeholder text for the input." },
        { name: "removeLabel", type: "string", default: "\"Remove tag\"", description: "Accessible name and tooltip copy for tag remove buttons." },
        { name: "maxTagsReachedLabel", type: "string", default: "\"Maximum number of tags reached\"", description: "Tooltip copy shown when suggestions cannot be added because the maximum was reached." },
        { name: "disabledLabel", type: "string", default: "\"Tag editing is disabled\"", description: "Reason shown for disabled suggestion actions." },
        { name: "maxTags", type: "number", description: "Maximum number of tags allowed." },
        { name: "variant", type: "\"default\" | \"compact\"", default: "\"default\"", description: "Switches spacing and input density." },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the input and suggestion actions." },
    ],
} as const;

function ControlledTagEditor({
    initialValue,
    suggestions,
    label,
    placeholder,
    maxTags,
    variant,
    removeLabel,
    maxTagsReachedLabel,
}: {
    initialValue: string[];
    suggestions: string[];
    label: string;
    placeholder?: string;
    maxTags?: number;
    variant?: "default" | "compact";
    removeLabel: string;
    maxTagsReachedLabel?: string;
}) {
    const [tags, setTags] = React.useState(initialValue);

    React.useEffect(() => {
        setTags(initialValue);
    }, [initialValue]);

    return (
        <TagEditor
            label={label}
            value={tags}
            onValueChange={setTags}
            suggestions={suggestions}
            placeholder={placeholder}
            removeLabel={removeLabel}
            maxTagsReachedLabel={maxTagsReachedLabel}
            maxTags={maxTags}
            variant={variant}
        />
    );
}

export default function TagEditorDocPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/tag-editor", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];
    const baseTags = React.useMemo(() => (locale === "ja" ? ["ヒーロー", "Web"] : ["Hero", "Website"]), [locale]);
    const suggestions = React.useMemo(
        () => (locale === "ja" ? ["キャンペーン", "SNS", "商品", "セール"] : ["Campaign", "SNS", "Product", "Sale"]),
        [locale]
    );

    return (
        <ComponentLayout
            title={content?.title ?? meta.tagEditor.title}
            description={content?.description ?? meta.tagEditor.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TagEditor", href: "/docs/components/tag-editor" },
                { name: "TagInput", href: "/docs/components/tag-input" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "Tag", href: "/docs/components/tag" },
                { name: "TagInput", href: "/docs/components/tag-input" },
                { name: "MetadataList", href: "/docs/components/metadata-list" },
                { name: "ToolPill", href: "/docs/components/tool-pill" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <ControlledTagEditor
                    initialValue={baseTags}
                    suggestions={suggestions}
                    maxTags={6}
                    label={locale === "ja" ? "タグ" : "Tags"}
                    placeholder={locale === "ja" ? "タグを追加..." : "Add tag..."}
                    removeLabel={locale === "ja" ? "タグを削除" : "Remove tag"}
                    maxTagsReachedLabel={locale === "ja" ? "タグは6件まで追加できます。不要なタグを削除してから追加してください。" : "You can add up to 6 tags. Remove a tag before adding another."}
                />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "suggestions",
                            title: locale === "ja" ? "候補付き" : "With suggestions",
                            description: locale === "ja"
                                ? "よく使うタグを候補として置き、クリックで追加できるようにします。"
                                : "Expose common tags as quick actions so they can be added with one click.",
                            preview: (
                                <ControlledTagEditor
                                    initialValue={baseTags}
                                    suggestions={suggestions}
                                    maxTags={6}
                                    label={locale === "ja" ? "タグ" : "Tags"}
                                    placeholder={locale === "ja" ? "タグを追加..." : "Add tag..."}
                                    removeLabel={locale === "ja" ? "タグを削除" : "Remove tag"}
                                    maxTagsReachedLabel={locale === "ja" ? "タグは6件まで追加できます。不要なタグを削除してから追加してください。" : "You can add up to 6 tags. Remove a tag before adding another."}
                                />
                            ),
                            code,
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "インスペクターやサイドバーなど、幅の狭い領域では密度を上げます。"
                                : "Use the compact variant in narrow inspectors and sidebars.",
                            preview: (
                                <ControlledTagEditor
                                    initialValue={locale === "ja" ? ["SNS", "短尺"] : ["SNS", "Short form"]}
                                    suggestions={locale === "ja" ? ["広告", "縦型", "検証中"] : ["Ad", "Vertical", "Testing"]}
                                    label={locale === "ja" ? "配信タグ" : "Delivery tags"}
                                    variant="compact"
                                    removeLabel={locale === "ja" ? "タグを削除" : "Remove tag"}
                                />
                            ),
                            code: compactCodeByLocale[locale],
                        },
                        {
                            key: "max-tags",
                            title: locale === "ja" ? "最大数" : "Maximum tags",
                            description: locale === "ja"
                                ? "タグ数の上限がある場合はカウンターを表示し、追加できない状態を明確にします。"
                                : "When a tag limit exists, show the counter so the limit is visible.",
                            preview: (
                                <ControlledTagEditor
                                    initialValue={locale === "ja" ? ["Web", "広告", "公開前"] : ["Web", "Ad", "Pre-publish"]}
                                    suggestions={locale === "ja" ? ["SNS", "商品"] : ["SNS", "Product"]}
                                    label={locale === "ja" ? "最大3件" : "Maximum 3"}
                                    maxTags={3}
                                    removeLabel={locale === "ja" ? "タグを削除" : "Remove tag"}
                                    maxTagsReachedLabel={locale === "ja" ? "タグは3件まで追加できます。不要なタグを削除してから追加してください。" : "You can add up to 3 tags. Remove a tag before adding another."}
                                />
                            ),
                            code: limitedCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
