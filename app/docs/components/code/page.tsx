"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { Code } from "@gunjo/ui";

export default function CodePage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";

    const code = `import { Code } from "@gunjo/ui"

const command = "npm install @gunjo/ui"
const publishFlag = "--access public"

export function CodeDemo() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <p>
        ${isJa ? "インストールは" : "Run"} <Code>{command}</Code>
        ${isJa ? "を実行します。" : " to add the package."}
      </p>
      <p>
        ${isJa ? "公開時は" : "Use the"} <Code variant="muted">{publishFlag}</Code>
        ${isJa ? "フラグを指定します。" : " flag when publishing."}
      </p>
    </div>
  )
}`;

    const usageCode = `import { Code } from "@gunjo/ui"

const example = "const value = 42"

export function CodeUsage() {
  return <Code>{example}</Code>
}`;

    const propsData = [
        {
            name: "variant",
            type: '"default" | "muted"',
            default: '"default"',
            description: isJa ? "インラインコードの背景と境界線の強さを切り替えます。" : "Controls the inline code background and border emphasis.",
        },
        {
            name: "size",
            type: '"sm" | "default" | "lg"',
            default: '"default"',
            description: isJa ? "本文内で使うコード文字のサイズです。" : "Inline code text size.",
        },
        {
            name: "children",
            type: "ReactNode",
            description: isJa ? "表示するコード文字列です。" : "Inline code content.",
        },
    ];

    return (
        <ComponentLayout
            title={(displayMetadata as Record<string, { title: string }>).code.title}
            description={(displayMetadata as Record<string, { description: string }>).code.description}
            usedComponents={[{ name: "Code", href: "/docs/components/code" }]}
            relatedComponents={[
                { name: "CodeBlock", href: "/docs/components/code-block" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto">
                <div className="flex flex-col items-start gap-3 text-sm">
                    <p>
                        {isJa ? "インストールは" : "Run"} <Code>npm install @gunjo/ui</Code>
                        {isJa ? "を実行します。" : " to add the package."}
                    </p>
                    <p>
                        {isJa ? "公開時は" : "Use the"} <Code variant="muted">--access public</Code>
                        {isJa ? "フラグを指定します。" : " flag when publishing."}
                    </p>
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "variants",
                            title: isJa ? "表示の強さ" : "Visual emphasis",
                            description: isJa
                                ? "本文中の短いコードやコマンドを、周囲の文章から読み分けやすくします。"
                                : "Separate short code or commands from surrounding prose.",
                            preview: (
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <Code>npm run dev</Code>
                                    <Code variant="muted">--watch</Code>
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import { Code } from "@gunjo/ui"\n\nconst commands = [\n  { value: "npm run dev" },\n  { value: "--watch", variant: "muted" as const },\n]\n\nexport function CodeVariants() {\n  return (\n    <div className="flex flex-wrap items-center gap-3 text-sm">\n      {commands.map((command) => (\n        <Code key={command.value} variant={command.variant}>{command.value}</Code>\n      ))}\n    </div>\n  )\n}`,
                        },
                        {
                            key: "sizes",
                            title: isJa ? "サイズ" : "Sizes",
                            description: isJa
                                ? "本文の文字サイズに合わせて、コードの大きさを調整します。"
                                : "Match code size to the surrounding body text.",
                            preview: (
                                <div className="flex flex-wrap items-baseline gap-3">
                                    <Code size="sm">size=&quot;sm&quot;</Code>
                                    <Code>size=&quot;default&quot;</Code>
                                    <Code size="lg">size=&quot;lg&quot;</Code>
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import { Code } from "@gunjo/ui"\n\nconst sizes = [\n  { label: "size=\\\"sm\\\"", size: "sm" as const },\n  { label: "size=\\\"default\\\"" },\n  { label: "size=\\\"lg\\\"", size: "lg" as const },\n]\n\nexport function CodeSizes() {\n  return (\n    <div className="flex flex-wrap items-baseline gap-3">\n      {sizes.map((item) => (\n        <Code key={item.label} size={item.size}>{item.label}</Code>\n      ))}\n    </div>\n  )\n}`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="usage">
                    {sectionLabels.usage}
                </h2>
                <CodeCopyButton code={usageCode} />
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
