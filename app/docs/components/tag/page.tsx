"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Tag } from "@gunjo/ui";

const codeByLocale = {
    ja: `import * as React from "react";
import { Tag } from "@gunjo/ui";

export function Example() {
  const [tags, setTags] = React.useState(["React", "TypeScript", "UI"]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          removeLabel={\`\${tag} を削除\`}
          onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}`,
    en: `import * as React from "react";
import { Tag } from "@gunjo/ui";

export function Example() {
  const [tags, setTags] = React.useState(["React", "TypeScript", "UI"]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          removeLabel={\`Remove \${tag}\`}
          onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}`,
} as const;

const variantsCodeByLocale = {
    ja: `import { Tag } from "@gunjo/ui";

export function TagVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag>標準</Tag>
      <Tag variant="secondary">選択中</Tag>
      <Tag variant="outline">下書き</Tag>
      <Tag variant="destructive">要確認</Tag>
    </div>
  );
}`,
    en: `import { Tag } from "@gunjo/ui";

export function TagVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag>Default</Tag>
      <Tag variant="secondary">Selected</Tag>
      <Tag variant="outline">Draft</Tag>
      <Tag variant="destructive">Needs review</Tag>
    </div>
  );
}`,
} as const;

const sizesCodeByLocale = {
    ja: `import { Tag } from "@gunjo/ui";

export function TagSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">小</Tag>
      <Tag>標準</Tag>
      <Tag size="lg">大</Tag>
    </div>
  );
}`,
    en: `import { Tag } from "@gunjo/ui";

export function TagSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">Small</Tag>
      <Tag>Default</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "variant", type: "\"default\" | \"secondary\" | \"outline\" | \"destructive\"", default: "\"default\"", description: "用途や状態に合わせた見た目です。" },
        { name: "size", type: "\"sm\" | \"default\" | \"lg\"", default: "\"default\"", description: "タグの高さと文字サイズです。" },
        { name: "onRemove", type: "() => void", description: "指定すると末尾に削除ボタンを表示し、クリック時に呼び出されます。" },
        { name: "removeLabel", type: "string", default: "\"Remove\"", description: "削除ボタンのアクセシブル名とツールチップ文言です。" },
        { name: "children", type: "ReactNode", required: true, description: "タグに表示する短いラベルです。" },
        { name: "className", type: "string", description: "必要に応じて外側に追加するクラスです。" },
    ],
    en: [
        { name: "variant", type: "\"default\" | \"secondary\" | \"outline\" | \"destructive\"", default: "\"default\"", description: "Visual treatment for the tag's purpose or state." },
        { name: "size", type: "\"sm\" | \"default\" | \"lg\"", default: "\"default\"", description: "Controls tag height and text size." },
        { name: "onRemove", type: "() => void", description: "Shows a trailing remove button and calls this handler when clicked." },
        { name: "removeLabel", type: "string", default: "\"Remove\"", description: "Accessible name and tooltip copy for the remove button." },
        { name: "children", type: "ReactNode", required: true, description: "Short label rendered inside the tag." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

export default function TagPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/tag", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const initialTags = React.useMemo(() => ["React", "TypeScript", locale === "ja" ? "設計" : "Design"], [locale]);
    const [tags, setTags] = React.useState(initialTags);
    const code = codeByLocale[locale];

    React.useEffect(() => {
        setTags(initialTags);
    }, [initialTags]);

    return (
        <ComponentLayout
            title={content?.title ?? meta.tag.title}
            description={content?.description ?? meta.tag.description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "Tag", href: "/docs/components/tag" }]}
            relatedComponents={[
                { name: "TagEditor", href: "/docs/components/tag-editor" },
                { name: "TagInput", href: "/docs/components/tag-input" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "ToolPill", href: "/docs/components/tool-pill" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Tag
                            key={tag}
                            removeLabel={locale === "ja" ? `${tag} を削除` : `Remove ${tag}`}
                            onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "variants",
                            title: locale === "ja" ? "用途別の見た目" : "Purpose variants",
                            description: locale === "ja"
                                ? "分類、選択状態、下書き、注意が必要な状態などを短いラベルで示します。"
                                : "Use short labels to mark categories, selected state, drafts, and attention states.",
                            preview: (
                                <div className="flex flex-wrap gap-2">
                                    <Tag>{locale === "ja" ? "標準" : "Default"}</Tag>
                                    <Tag variant="secondary">{locale === "ja" ? "選択中" : "Selected"}</Tag>
                                    <Tag variant="outline">{locale === "ja" ? "下書き" : "Draft"}</Tag>
                                    <Tag variant="destructive">{locale === "ja" ? "要確認" : "Needs review"}</Tag>
                                </div>
                            ),
                            code: variantsCodeByLocale[locale],
                        },
                        {
                            key: "sizes",
                            title: locale === "ja" ? "サイズ" : "Sizes",
                            description: locale === "ja"
                                ? "密度の高いリストでは小さく、カードや詳細欄では標準または大きめにします。"
                                : "Use smaller tags in dense lists and larger tags in cards or detail panels.",
                            preview: (
                                <div className="flex flex-wrap items-center gap-2">
                                    <Tag size="sm">{locale === "ja" ? "小" : "Small"}</Tag>
                                    <Tag>{locale === "ja" ? "標準" : "Default"}</Tag>
                                    <Tag size="lg">{locale === "ja" ? "大" : "Large"}</Tag>
                                </div>
                            ),
                            code: sizesCodeByLocale[locale],
                        },
                        {
                            key: "removable",
                            title: locale === "ja" ? "削除できるタグ" : "Removable tags",
                            description: locale === "ja"
                                ? "編集画面では削除ボタンに対象がわかるラベルを渡します。"
                                : "In editing surfaces, pass a remove label that names the target tag.",
                            preview: (
                                <div className="flex flex-wrap gap-2">
                                    {["React", "TypeScript", locale === "ja" ? "設計" : "Design"].map((tag) => (
                                        <Tag key={tag} removeLabel={locale === "ja" ? `${tag} を削除` : `Remove ${tag}`} onRemove={() => undefined}>
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                            ),
                            code,
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
