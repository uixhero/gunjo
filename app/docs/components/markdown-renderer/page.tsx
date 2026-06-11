"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { DocNote, MarkdownRenderer } from "@gunjo/ui";

const markdownByLocale = {
    ja: `# リリースノート

GunjoUI では **docs と pattern** を同じコンポーネントで検証します。

- プレビューで状態を確認する
- 使用例をコピーする
- 関連コンポーネントへ移動する`,
    en: `# Release notes

GunjoUI verifies **docs and patterns** with the same components.

- Review states in previews
- Copy usage examples
- Move to related components`,
} as const;

const tableMarkdownByLocale = {
    ja: `| 項目 | 状態 |
| --- | --- |
| API | 完了 |
| ドキュメント | 確認中 |

- [x] 実装
- [ ] 公開前確認`,
    en: `| Item | Status |
| --- | --- |
| API | Done |
| Docs | Reviewing |

- [x] Implementation
- [ ] Pre-release review`,
} as const;

function markdownRendererCode(content: string, propSuffix = "") {
    return `import { MarkdownRenderer } from "@gunjo/ui";

const content = \`${content}\`;

export function Example() {
  return <MarkdownRenderer content={content}${propSuffix} />;
}`
}

const codeByLocale = {
    ja: markdownRendererCode(markdownByLocale.ja),
    en: markdownRendererCode(markdownByLocale.en),
} as const;

const gfmCodeByLocale = {
    ja: markdownRendererCode(tableMarkdownByLocale.ja),
    en: markdownRendererCode(tableMarkdownByLocale.en),
} as const;

const plainCodeByLocale = {
    ja: markdownRendererCode(tableMarkdownByLocale.ja, " disableGfm"),
    en: markdownRendererCode(tableMarkdownByLocale.en, " disableGfm"),
} as const;

const propsByLocale = {
    ja: [
        { name: "content", type: "string", required: true, description: "描画する Markdown 文字列です。" },
        { name: "disableGfm", type: "boolean", default: "false", description: "表、チェックリスト、取り消し線などの GFM 拡張を無効にします。" },
        { name: "components", type: "ReactMarkdown components map", description: "要素ごとの描画コンポーネントを上書きします。" },
        { name: "className", type: "string", description: "ラッパーに追加するクラスです。" },
    ],
    en: [
        { name: "content", type: "string", required: true, description: "Markdown source text to render." },
        { name: "disableGfm", type: "boolean", default: "false", description: "Disables GFM extensions such as tables, task lists, and strikethrough." },
        { name: "components", type: "ReactMarkdown components map", description: "Overrides renderers for individual markdown elements." },
        { name: "className", type: "string", description: "Class added to the wrapper." },
    ],
} as const;

export default function MarkdownRendererPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/markdown-renderer", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.markdownRenderer.title;
    const description = content?.description ?? meta.markdownRenderer.description;
    const code = codeByLocale[locale];
    const gfmCode = gfmCodeByLocale[locale];
    const plainCode = plainCodeByLocale[locale];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
                { name: "DocNote", href: "/docs/components/doc-note" },
            ]}
            relatedComponents={[
                { name: "CodeBlock", href: "/docs/components/code-block" },
                { name: "List", href: "/docs/components/list" },
                { name: "Table", href: "/docs/components/table" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <div className="w-full rounded-lg border bg-background p-5">
                    <MarkdownRenderer content={markdownByLocale[locale]} />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="gfm-overview" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "GFM とは" : "What GFM Means"}
                </h2>
                <DocNote heading={locale === "ja" ? "GitHub Flavored Markdown の拡張" : "GitHub Flavored Markdown extensions"}>
                    {locale === "ja"
                        ? "GFM は GitHub Flavored Markdown の略で、標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。MarkdownRenderer は標準で GFM を有効にし、disableGfm を指定するとそれらの拡張を通常のテキストや通常のリストとして扱います。"
                        : "GFM stands for GitHub Flavored Markdown. It extends standard Markdown with tables, task lists, strikethrough, and similar syntax. MarkdownRenderer enables GFM by default; disableGfm renders those extensions as plain text or regular lists."}
                </DocNote>
            </div>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "gfm",
                            title: locale === "ja" ? "GFM 拡張" : "GFM extensions",
                            description: locale === "ja"
                                ? "表やチェックリストは標準で有効です。"
                                : "Tables and task lists are enabled by default.",
                            preview: (
                                <div className="w-full max-w-xl rounded-lg border bg-background p-5">
                                    <MarkdownRenderer content={tableMarkdownByLocale[locale]} />
                                </div>
                            ),
                            code: gfmCode,
                        },
                        {
                            key: "plain-markdown",
                            title: locale === "ja" ? "GFM を使わない" : "Without GFM",
                            description: locale === "ja"
                                ? "GFM を無効にすると、表は通常のテキストとして残り、チェックリストは [x] / [ ] を含む通常の箇条書きとして表示されます。"
                                : "When GFM is disabled, tables remain plain text and task lists render as regular list items with [x] / [ ] text.",
                            preview: (
                                <div className="w-full max-w-xl rounded-lg border bg-background p-5">
                                    <MarkdownRenderer content={tableMarkdownByLocale[locale]} disableGfm />
                                </div>
                            ),
                            code: plainCode,
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
