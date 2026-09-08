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

    const code = isJa
        ? `import { Code } from "@gunjo/ui";

const command = "npm install @gunjo/ui";
const publishFlag = "--access public";

export function PackageInstallNote() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <p>
        インストールは <Code>{command}</Code> を実行します。
      </p>
      <p>
        公開時は <Code variant="muted">{publishFlag}</Code> フラグを指定します。
      </p>
    </div>
  );
}`
        : `import { Code } from "@gunjo/ui";

const command = "npm install @gunjo/ui";
const publishFlag = "--access public";

export function PackageInstallNote() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <p>
        Run <Code>{command}</Code> to add the package.
      </p>
      <p>
        Use the <Code variant="muted">{publishFlag}</Code> flag when publishing.
      </p>
    </div>
  );
}`;

    const usageCode = `import { Code } from "@gunjo/ui";

const example = "const value = 42";

export function InlineCodeUsage() {
  return <Code>{example}</Code>;
}`;

    const variantsCode = isJa
        ? `import { Code } from "@gunjo/ui";

const commands = [
  { value: "npm run dev" },
  { value: "--watch", variant: "muted" as const },
];

export function DevCommandList() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {commands.map((command) => (
        <Code key={command.value} variant={command.variant}>
          {command.value}
        </Code>
      ))}
    </div>
  );
}`
        : `import { Code } from "@gunjo/ui";

const commands = [
  { value: "npm run dev" },
  { value: "--watch", variant: "muted" as const },
];

export function DevCommandList() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {commands.map((command) => (
        <Code key={command.value} variant={command.variant}>
          {command.value}
        </Code>
      ))}
    </div>
  );
}`;

    const sizesCode = `import { Code } from "@gunjo/ui";

const sizes = [
  { label: 'size="sm"', size: "sm" as const },
  { label: 'size="default"' },
  { label: 'size="lg"', size: "lg" as const },
];

export function InlineCodeSizes() {
  return (
    <div className="flex flex-wrap items-baseline gap-3">
      {sizes.map((item) => (
        <Code key={item.label} size={item.size}>
          {item.label}
        </Code>
      ))}
    </div>
  );
}`;

    const inProseCode = isJa
        ? `import { Code } from "@gunjo/ui";

const command = "npx @gunjo/ui-cli generate --config ./design/tokens.config.json";

export function RegenerateNote() {
  return (
    <p className="max-w-sm text-sm leading-7">
      生成物を作り直すときは <Code>{command}</Code> を実行します。折り返しても本文の行送りは変わりません。
    </p>
  );
}`
        : `import { Code } from "@gunjo/ui";

const command = "npx @gunjo/ui-cli generate --config ./design/tokens.config.json";

export function RegenerateNote() {
  return (
    <p className="max-w-sm text-sm leading-7">
      To rebuild the generated files, run <Code>{command}</Code>. Wrapping does not change the
      leading of the paragraph.
    </p>
  );
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
                            code: variantsCode,
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
                            code: sizesCode,
                        },
                        {
                            key: "in-prose",
                            title: isJa ? "本文にまぎれたとき" : "Sitting inside prose",
                            description: isJa
                                ? "長いコマンドは行の途中で折り返します。背景は行ごとに分かれ、行の高さは本文のままです。"
                                : "A long command wraps mid-sentence: the background splits per line and the line height stays that of the prose.",
                            preview: (
                                <p className="max-w-sm text-sm leading-7">
                                    {isJa ? "生成物を作り直すときは " : "To rebuild the generated files, run "}
                                    <Code>npx @gunjo/ui-cli generate --config ./design/tokens.config.json</Code>
                                    {isJa
                                        ? " を実行します。折り返しても本文の行送りは変わりません。"
                                        : ". Wrapping does not change the leading of the paragraph."}
                                </p>
                            ),
                            previewHeight: "auto",
                            code: inProseCode,
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
