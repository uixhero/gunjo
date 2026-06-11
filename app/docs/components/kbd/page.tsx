"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Kbd } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { Kbd } from "@gunjo/ui";

export function Example() {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      検索を開くには <Kbd>⌘</Kbd><Kbd>K</Kbd> を押します。
    </span>
  );
}`,
    en: `import { Kbd } from "@gunjo/ui";

export function Example() {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to open search.
    </span>
  );
}`,
} as const;

const shortcutCodeByLocale = {
    ja: `import { Kbd } from "@gunjo/ui";

export function ShortcutKeys() {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </span>
  );
}`,
    en: `import { Kbd } from "@gunjo/ui";

export function ShortcutKeys() {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </span>
  );
}`,
} as const;

const inlineCodeByLocale = {
    ja: `import { Kbd } from "@gunjo/ui";

export function InlineKey() {
  return (
    <p className="text-sm">
      選択中の項目を確定するには <Kbd>Enter</Kbd> を押します。
    </p>
  );
}`,
    en: `import { Kbd } from "@gunjo/ui";

export function InlineKey() {
  return (
    <p className="text-sm">
      Use <Kbd>Enter</Kbd> to confirm the selected item.
    </p>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "children", type: "ReactNode", required: true, description: "キー名や記号を表示する内容です。" },
        { name: "className", type: "string", description: "余白や色を局所的に調整するためのクラスです。" },
    ],
    en: [
        { name: "children", type: "ReactNode", required: true, description: "Key label or symbol to display." },
        { name: "className", type: "string", description: "Optional class for local spacing or color adjustments." },
    ],
} as const;

export default function KbdPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/kbd", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const title = content?.title ?? meta.kbd.title;
    const description = content?.description ?? meta.kbd.description;
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "Kbd", href: "/docs/components/kbd" }]}
            relatedComponents={[
                { name: "Command", href: "/docs/components/command" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
                { name: "Code", href: "/docs/components/code" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <span className="inline-flex flex-wrap items-center justify-center gap-1 text-sm text-foreground">
                    {locale === "ja" ? "検索を開くには" : "Press"}
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                    {locale === "ja" ? "を押します。" : "to open search."}
                </span>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "shortcut",
                            title: locale === "ja" ? "ショートカット" : "Shortcut",
                            description: locale === "ja"
                                ? "複数のキーは小さな間隔で横並びにします。"
                                : "Render multiple keys with tight inline spacing.",
                            preview: (
                                <span className="inline-flex flex-wrap items-center justify-center gap-1 text-sm">
                                    <Kbd>⌘</Kbd>
                                    <Kbd>Shift</Kbd>
                                    <Kbd>P</Kbd>
                                </span>
                            ),
                            code: shortcutCodeByLocale[locale],
                        },
                        {
                            key: "inline-help",
                            title: locale === "ja" ? "文章内のキー" : "Inline help",
                            description: locale === "ja"
                                ? "ヘルプ文の中にキーを混ぜても、行高を大きく崩さないサイズです。"
                                : "The compact height keeps inline help text readable.",
                            preview: (
                                <p className="text-sm text-muted-foreground">
                                    {locale === "ja" ? "選択中の項目を確定するには " : "Use "}
                                    <Kbd>{locale === "ja" ? "Enter" : "Enter"}</Kbd>
                                    {locale === "ja" ? " を押します。" : " to confirm the selected item."}
                                </p>
                            ),
                            code: inlineCodeByLocale[locale],
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
