"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { ColorSwatch } from "@gunjo/ui";

const TOKEN_SWATCHES = [
    { color: "hsl(var(--background))", label: "background" },
    { color: "hsl(var(--foreground))", label: "foreground" },
    { color: "hsl(var(--primary))", label: "primary" },
    { color: "hsl(var(--muted))", label: "muted" },
    { color: "hsl(var(--destructive))", label: "destructive" },
    { color: "hsl(var(--success))", label: "success" },
];

export default function ColorSwatchPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";
    const copyLabel = isJa ? "カラー値をコピー" : "Copy color value";
    const copiedLabel = isJa ? "コピーしました" : "Copied";

    const code = `import { ColorSwatch } from "@gunjo/ui"

const tokenSwatches = [
  { color: "hsl(var(--background))", label: "background" },
  { color: "hsl(var(--foreground))", label: "foreground" },
  { color: "hsl(var(--primary))", label: "primary" },
  { color: "hsl(var(--muted))", label: "muted" },
  { color: "hsl(var(--destructive))", label: "destructive" },
  { color: "hsl(var(--success))", label: "success" },
]

export function ColorSwatchDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
      {tokenSwatches.map((token) => (
        <ColorSwatch
          key={token.label}
          color={token.color}
          label={token.label}
          copyLabel="${copyLabel}"
          copiedLabel="${copiedLabel}"
        />
      ))}
    </div>
  )
}`;

    const usageCode = `import { ColorSwatch } from "@gunjo/ui"

const token = {
  color: "hsl(var(--primary))",
  label: "primary",
}

export function PrimarySwatch() {
  return <ColorSwatch color={token.color} label={token.label} />
}`;

    const propsData = [
        {
            name: "color",
            type: "string",
            description: isJa ? "表示とコピーに使う CSS カラー値です。" : "CSS color value used for display and copy.",
        },
        {
            name: "label",
            type: "string",
            description: isJa ? "カラー値の横に表示するラベルです。未指定時は color を表示します。" : "Label shown next to the swatch. Defaults to the color value.",
        },
        {
            name: "copyable",
            type: "boolean",
            default: "true",
            description: isJa ? "カラー値をコピーするボタンを表示するかどうかです。" : "Shows or hides the copy button.",
        },
        {
            name: "copyLabel",
            type: "string",
            description: isJa ? "コピー前のボタンラベルとツールチップです。" : "Button label and tooltip before copying.",
        },
        {
            name: "copiedLabel",
            type: "string",
            default: '"Copied"',
            description: isJa ? "コピー後に一時表示するラベルです。" : "Temporary label shown after copying.",
        },
        {
            name: "copiedDuration",
            type: "number",
            default: "5000",
            description: isJa ? "コピー後のチェックアイコンとツールチップを維持する時間です。" : "Duration for the copied check icon and tooltip.",
        },
        {
            name: "size",
            type: '"sm" | "default" | "lg"',
            default: '"default"',
            description: isJa ? "カラーチップの大きさです。" : "Color chip size.",
        },
    ];

    return (
        <ComponentLayout
            title={(displayMetadata as Record<string, { title: string }>).colorSwatch.title}
            description={(displayMetadata as Record<string, { description: string }>).colorSwatch.description}
            usedComponents={[
                { name: "ColorSwatch", href: "/docs/components/color-swatch" },
                { name: "CopyButton", href: "/docs/components/copy-button" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Code", href: "/docs/components/code" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md">
                <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                    {TOKEN_SWATCHES.map((token) => (
                        <ColorSwatch
                            key={token.label}
                            color={token.color}
                            label={token.label}
                            copyLabel={copyLabel}
                            copiedLabel={copiedLabel}
                        />
                    ))}
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "tokens",
                            title: isJa ? "トークン表示" : "Token values",
                            description: isJa
                                ? "デザイントークン名と実際の色を並べ、値をコピーできます。"
                                : "Show token names with their rendered colors and copyable values.",
                            preview: (
                                <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                                    {TOKEN_SWATCHES.slice(0, 4).map((token) => (
                                        <ColorSwatch key={token.label} {...token} copyLabel={copyLabel} copiedLabel={copiedLabel} />
                                    ))}
                                </div>
                            ),
                            previewHeight: "auto",
                            code,
                        },
                        {
                            key: "sizes",
                            title: isJa ? "サイズ" : "Sizes",
                            description: isJa
                                ? "色だけを短く示す場合と、一覧で強調する場合でサイズを切り替えます。"
                                : "Use different chip sizes for compact or emphasized color lists.",
                            preview: (
                                <div className="flex flex-wrap items-center gap-3">
                                    <ColorSwatch color="hsl(var(--primary))" label="primary" size="sm" copyLabel={copyLabel} copiedLabel={copiedLabel} />
                                    <ColorSwatch color="hsl(var(--primary))" label="primary" copyLabel={copyLabel} copiedLabel={copiedLabel} />
                                    <ColorSwatch color="hsl(var(--primary))" label="primary" size="lg" copyLabel={copyLabel} copiedLabel={copiedLabel} />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import { ColorSwatch } from "@gunjo/ui"\n\nconst swatches = [\n  { color: "hsl(var(--primary))", label: "primary", size: "sm" as const },\n  { color: "hsl(var(--primary))", label: "primary" },\n  { color: "hsl(var(--primary))", label: "primary", size: "lg" as const },\n]\n\nexport function ColorSwatchSizes() {\n  return (\n    <div className="flex flex-wrap items-center gap-3">\n      {swatches.map((swatch, index) => (\n        <ColorSwatch key={index} {...swatch} />\n      ))}\n    </div>\n  )\n}`,
                        },
                        {
                            key: "readonly",
                            title: isJa ? "コピーなし" : "Without copy action",
                            description: isJa
                                ? "凡例など、コピー操作が不要な場所ではボタンを非表示にします。"
                                : "Hide the copy action in legends or places where copying is not needed.",
                            preview: <ColorSwatch color="hsl(var(--success))" label={isJa ? "成功" : "Success"} copyable={false} />,
                            previewHeight: "auto",
                            code: `import { ColorSwatch } from "@gunjo/ui"\n\nconst success = {\n  color: "hsl(var(--success))",\n  label: "${isJa ? "成功" : "Success"}",\n}\n\nexport function ReadonlySwatch() {\n  return <ColorSwatch color={success.color} label={success.label} copyable={false} />\n}`,
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
