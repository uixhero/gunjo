"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { CopyButton } from "@gunjo/ui";

export default function CopyButtonPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";
    const copyLabel = isJa ? "コードをコピー" : "Copy code";
    const commandCopyLabel = isJa ? "コマンドをコピー" : "Copy command";
    const copiedLabel = isJa ? "コピーしました" : "Copied";
    const failedLabel = isJa ? "コピーに失敗しました" : "Copy failed";
    const copyValue = "const total = items.length";

    const code = `import { CopyButton } from "@gunjo/ui"

export function CopyButtonDemo() {
  return (
    <CopyButton
      value="${copyValue}"
      copyLabel="${copyLabel}"
      copiedLabel="${copiedLabel}"
      copyFailedLabel="${failedLabel}"
      variant="label"
    />
  )
}`;

    const usageCode = `import { CopyButton } from "@gunjo/ui"

<CopyButton
  value="${copyValue}"
  copyLabel="${copyLabel}"
  copiedLabel="${copiedLabel}"
  copyFailedLabel="${failedLabel}"
  variant="label"
/>`;

    const iconCode = `import { CopyButton } from "@gunjo/ui"

<CopyButton
  value="${copyValue}"
  copyLabel="${copyLabel}"
  copiedLabel="${copiedLabel}"
  copyFailedLabel="${failedLabel}"
/>`;

    const propsData = [
        {
            name: "value",
            type: "string",
            description: isJa ? "クリップボードへコピーする文字列です。" : "Text copied to the clipboard.",
        },
        {
            name: "copyLabel",
            type: "string",
            default: '"Copy"',
            description: isJa ? "コピー前の aria-label とツールチップです。" : "Accessible label and tooltip before copying.",
        },
        {
            name: "copiedLabel",
            type: "string",
            default: '"Copied"',
            description: isJa ? "コピー後に表示する aria-label とツールチップです。" : "Accessible label and tooltip after copying.",
        },
        {
            name: "copyFailedLabel",
            type: "string",
            default: '"Copy failed"',
            description: isJa ? "コピー失敗時に表示する aria-label とツールチップです。" : "Accessible label and tooltip when copying fails.",
        },
        {
            name: "copiedDuration",
            type: "number",
            default: "5000",
            description: isJa ? "コピー済みの吹き出し表示を維持する時間です。単位はミリ秒です。" : "Duration in milliseconds to keep copied feedback visible.",
        },
        {
            name: "variant",
            type: '"default" | "label"',
            default: '"default"',
            description: isJa ? "狭い場所ではアイコンのみ、広い場所ではコピー済みラベルも表示します。" : "Use icon-only feedback for compact controls or show the copied label.",
        },
        {
            name: "buttonVariant",
            type: 'TooltipButtonProps["variant"]',
            default: '"ghost"',
            description: isJa ? "ボタン表面の見た目を指定します。" : "Controls the button surface variant.",
        },
    ];

    return (
        <ComponentLayout
            title={(inputsMetadata as Record<string, { title: string }>).copyButton.title}
            description={(inputsMetadata as Record<string, { description: string }>).copyButton.description}
            usedComponents={[
                { name: "CopyButton", href: "/docs/components/copy-button" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "ColorSwatch", href: "/docs/components/color-swatch" },
                { name: "CodeBlock", href: "/docs/components/code-block" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="sm">
                <CopyButton value={copyValue} copyLabel={copyLabel} copiedLabel={copiedLabel} copyFailedLabel={failedLabel} variant="label" />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "icon",
                            title: isJa ? "アイコンだけのコピー" : "Icon-only copy",
                            description: isJa
                                ? "スウォッチやツールバーなど狭い場所では、コピー後にチェックアイコンへ切り替え、コピー完了の吹き出しを一時表示します。"
                                : "Compact areas switch from copy to check icon and show temporary copied feedback.",
                            preview: (
                                <CopyButton
                                    value={copyValue}
                                    copyLabel={copyLabel}
                                    copiedLabel={copiedLabel}
                                    copyFailedLabel={failedLabel}
                                />
                            ),
                            previewHeight: "auto",
                            code: iconCode,
                        },
                        {
                            key: "label",
                            title: isJa ? "ラベル付きフィードバック" : "Label feedback",
                            description: isJa
                                ? "コードブロックのように余白がある場所では、押す前から操作名を表示し、コピー後に完了ラベルへ切り替えます。"
                                : "Roomier controls can show the action label first, then switch to copied feedback.",
                            preview: (
                                <CopyButton
                                    value="npm install @gunjo/ui"
                                    copyLabel={commandCopyLabel}
                                    copiedLabel={copiedLabel}
                                    copyFailedLabel={failedLabel}
                                    copiedDuration={5000}
                                    variant="label"
                                    className="h-8 px-2 text-xs"
                                />
                            ),
                            previewHeight: "auto",
                            code: `import { CopyButton } from "@gunjo/ui"

<CopyButton
  value="npm install @gunjo/ui"
  copyLabel="${commandCopyLabel}"
  copiedLabel="${copiedLabel}"
  copyFailedLabel="${failedLabel}"
  copiedDuration={5000}
  variant="label"
  className="h-8 px-2 text-xs"
/>`,
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
