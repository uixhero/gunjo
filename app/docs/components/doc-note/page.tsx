"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { DocNote, TextLink } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { DocNote } from "@gunjo/ui";

export function Example() {
  return (
    <DocNote heading="GitHub Flavored Markdown の拡張">
      GFM は標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。
    </DocNote>
  );
}`,
    en: `import { DocNote } from "@gunjo/ui";

export function Example() {
  return (
    <DocNote heading="GitHub Flavored Markdown extensions">
      GFM extends standard Markdown with tables, task lists, strikethrough, and similar syntax.
    </DocNote>
  );
}`,
} as const;

const referenceCodeByLocale = {
    ja: `import { DocNote, TextLink } from "@gunjo/ui";

export function References() {
  return (
    <DocNote heading="参考文献" variant="reference">
      <TextLink href="https://www.w3.org/WAI/tutorials/images/decorative/" target="_blank" newTabLabel="新しいタブで開きます">
        W3C WAI: Decorative Images
      </TextLink>
    </DocNote>
  );
}`,
    en: `import { DocNote, TextLink } from "@gunjo/ui";

export function References() {
  return (
    <DocNote heading="References" variant="reference">
      <TextLink href="https://www.w3.org/WAI/tutorials/images/decorative/" target="_blank">
        W3C WAI: Decorative Images
      </TextLink>
    </DocNote>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "heading", type: "ReactNode", description: "注釈の短い見出しです。" },
        { name: "variant", type: "\"default\" | \"reference\"", default: "\"default\"", description: "補足説明か参考リンクかに合わせた見た目です。" },
        { name: "children", type: "ReactNode", required: true, description: "注釈本文です。" },
        { name: "className", type: "string", description: "必要に応じて外側に追加するクラスです。" },
    ],
    en: [
        { name: "heading", type: "ReactNode", description: "Short heading for the note." },
        { name: "variant", type: "\"default\" | \"reference\"", default: "\"default\"", description: "Visual style for explanation notes or reference links." },
        { name: "children", type: "ReactNode", required: true, description: "Note body content." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

export default function DocNotePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/doc-note", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];
    const referenceCode = referenceCodeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.docNote.title}
            description={content?.description ?? meta.docNote.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "DocNote", href: "/docs/components/doc-note" },
                { name: "TextLink", href: "/docs/components/text-link" },
            ]}
            relatedComponents={[
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
                { name: "TextLink", href: "/docs/components/text-link" },
                { name: "Alert", href: "/docs/components/alert" },
                { name: "Card", href: "/docs/components/card" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <DocNote heading={locale === "ja" ? "GitHub Flavored Markdown の拡張" : "GitHub Flavored Markdown extensions"} className="w-full">
                    {locale === "ja"
                        ? "GFM は標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。"
                        : "GFM extends standard Markdown with tables, task lists, strikethrough, and similar syntax."}
                </DocNote>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "通常" : "Default",
                            description: locale === "ja"
                                ? "本文の流れを止めずに、補足説明や用語説明を背景色だけで本文から分けます。"
                                : "Separate supplemental explanation from body copy with a quiet background-only treatment.",
                            preview: (
                                <DocNote heading={locale === "ja" ? "GitHub Flavored Markdown の拡張" : "GitHub Flavored Markdown extensions"} className="w-full max-w-xl">
                                    {locale === "ja"
                                        ? "GFM は標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。"
                                        : "GFM extends standard Markdown with tables, task lists, strikethrough, and similar syntax."}
                                </DocNote>
                            ),
                            code,
                        },
                        {
                            key: "reference",
                            title: locale === "ja" ? "参考リンク" : "Reference links",
                            description: locale === "ja"
                                ? "外部資料や判断根拠を本文から少し分けて示します。"
                                : "Separate source links or rationale from the main body copy.",
                            preview: (
                                <DocNote heading={locale === "ja" ? "参考文献" : "References"} variant="reference" className="w-full max-w-xl">
                                    <TextLink
                                        href="https://www.w3.org/WAI/tutorials/images/decorative/"
                                        target="_blank"
                                        newTabLabel={locale === "ja" ? "新しいタブで開きます" : "opens in a new tab"}
                                    >
                                        W3C WAI: Decorative Images
                                    </TextLink>
                                </DocNote>
                            ),
                            code: referenceCode,
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
