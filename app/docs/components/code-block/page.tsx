"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock as DocCodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { CodeBlock } from "@gunjo/ui";

const TYPESCRIPT_SAMPLE = `type Status = "draft" | "published";

export function formatStatus(status: Status) {
  return status === "published" ? "公開中" : "下書き";
}`;

const HTML_SAMPLE = `<section class="product-card">
  <img src="/images/sample.jpg" alt="Gunjo UI preview" />
  <h2>Gunjo UI</h2>
  <p>Build consistent interfaces with reusable components.</p>
</section>`;

const JSON_SAMPLE = `{
  "component": "CodeBlock",
  "language": "json",
  "copyable": false
}`;

function EditableCodeBlockDemo({
    copyLabel,
    copiedLabel,
}: {
    copyLabel: string;
    copiedLabel: string;
}) {
    const [code, setCode] = React.useState(TYPESCRIPT_SAMPLE);

    return (
        <CodeBlock
            code={code}
            filename="format-status.ts"
            language="ts"
            editable
            highlight
            showLineNumbers
            onCodeChange={setCode}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
        />
    );
}

export default function CodeBlockPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";
    const copyLabel = isJa ? "コードをコピー" : "Copy code";
    const copiedLabel = isJa ? "コピーしました" : "Copied";

    const code = `import { CodeBlock } from "@gunjo/ui"

const source = [
  'type Status = "draft" | "published";',
  "",
  "export function formatStatus(status: Status) {",
  '  return status === "published" ? "公開中" : "下書き";',
  "}",
].join("\\n")

export function CodeBlockDemo() {
  return (
    <CodeBlock
      code={source}
      filename="format-status.ts"
      language="ts"
      highlight
      showLineNumbers
      copyLabel="${copyLabel}"
      copiedLabel="${copiedLabel}"
    />
  )
}`;

    const usageCode = `import { CodeBlock } from "@gunjo/ui"

const source = [
  'type Status = "draft" | "published";',
  "",
  "export function formatStatus(status: Status) {",
  '  return status === "published" ? "公開中" : "下書き";',
  "}",
].join("\\n")

export function ExampleCodeBlock() {
  return (
    <CodeBlock
      code={source}
      filename="example.ts"
      language="ts"
      highlight
      showLineNumbers
    />
  )
}`;

    const propsData = [
        {
            name: "code",
            type: "string",
            description: isJa ? "表示するコード文字列です。" : "Code text to display.",
        },
        {
            name: "filename",
            type: "string",
            description: isJa ? "ヘッダーに表示するファイル名です。" : "Filename shown in the header.",
        },
        {
            name: "language",
            type: "string",
            description: isJa ? "ファイル名の横に表示する言語ラベルです。" : "Language label shown next to the filename.",
        },
        {
            name: "copyable",
            type: "boolean",
            default: "true",
            description: isJa ? "コピー操作のボタンを表示するかどうかです。" : "Shows or hides the copy-to-clipboard button.",
        },
        {
            name: "copyLabel",
            type: "string",
            default: '"Copy code"',
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
            description: isJa ? "コピー後のラベルを表示し続ける時間です。単位はミリ秒です。" : "Duration in milliseconds to keep the copied feedback visible.",
        },
        {
            name: "showLineNumbers",
            type: "boolean",
            default: "false",
            description: isJa ? "各行の左側に行番号を表示します。" : "Shows line numbers next to each line.",
        },
        {
            name: "highlight",
            type: "boolean",
            default: "false",
            description: isJa ? "主要なコード要素に軽量なシンタックスハイライトを適用します。" : "Applies lightweight syntax highlighting to common code tokens.",
        },
        {
            name: "editable",
            type: "boolean",
            default: "false",
            description: isJa ? "コードを直接編集できる入力領域として表示します。" : "Renders the code block as an editable source area.",
        },
        {
            name: "onCodeChange",
            type: "(code: string) => void",
            description: isJa ? "編集可能なコードの変更時に呼び出されます。" : "Called when editable source changes.",
        },
        {
            name: "selectOnDoubleClick",
            type: "boolean",
            default: "true",
            description: isJa ? "コード領域をダブルクリックした時にソース全体を選択します。" : "Selects all source text when the code area is double-clicked.",
        },
        {
            name: "theme",
            type: '"dark" | "light" | "muted"',
            default: '"dark"',
            description: isJa ? "コードブロックの配色を切り替えます。" : "Changes the code block color theme.",
        },
    ];

    return (
        <ComponentLayout
            title={(displayMetadata as Record<string, { title: string }>).codeBlock.title}
            description={(displayMetadata as Record<string, { description: string }>).codeBlock.description}
            usedComponents={[
                { name: "CodeBlock", href: "/docs/components/code-block" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "Code", href: "/docs/components/code" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<DocCodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md">
                <div className="w-full max-w-lg">
                    <CodeBlock
                        code={TYPESCRIPT_SAMPLE}
                        filename="format-status.ts"
                        language="ts"
                        highlight
                        showLineNumbers
                        copyLabel={copyLabel}
                        copiedLabel={copiedLabel}
                    />
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-header",
                            title: isJa ? "ヘッダー付き" : "With header",
                            description: isJa
                                ? "言語、ファイル名、コピー操作をヘッダーにまとめます。言語ラベルは先頭に置き、何のコードかを先に判断できます。"
                                : "Show filename, language, and a copy action in the header.",
                            preview: (
                                <div className="w-full max-w-lg">
                                    <CodeBlock
                                        code={HTML_SAMPLE}
                                        filename="index.html"
                                        language="html"
                                        highlight
                                        copyLabel={copyLabel}
                                        copiedLabel={copiedLabel}
                                    />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import { CodeBlock } from "@gunjo/ui"\n\nconst html = [\n  '<section class="product-card">',\n  '  <img src="/images/sample.jpg" alt="Gunjo UI preview" />',\n  "  <h2>Gunjo UI</h2>",\n  "  <p>Build consistent interfaces with reusable components.</p>",\n  "</section>",\n].join("\\n")\n\nexport function CodeBlockWithHeader() {\n  return (\n    <CodeBlock\n      code={html}\n      filename="index.html"\n      language="html"\n      highlight\n      copyLabel="${copyLabel}"\n      copiedLabel="${copiedLabel}"\n    />\n  )\n}`,
                        },
                        {
                            key: "highlighted",
                            title: isJa ? "ハイライトと行番号" : "Highlight and line numbers",
                            description: isJa
                                ? "長いコードを読む時は、行番号とハイライトを表示して参照しやすくします。ダブルクリックでソース全体を選択できます。"
                                : "Use line numbers and highlighting for readable, referenceable snippets.",
                            preview: (
                                <div className="w-full max-w-lg">
                                    <CodeBlock
                                        code={TYPESCRIPT_SAMPLE}
                                        filename="format-status.ts"
                                        language="ts"
                                        highlight
                                        showLineNumbers
                                        copyLabel={copyLabel}
                                        copiedLabel={copiedLabel}
                                    />
                                </div>
                            ),
                            previewHeight: "auto",
                            code,
                        },
                        {
                            key: "editable",
                            title: isJa ? "編集可能" : "Editable",
                            description: isJa
                                ? "サンプルコードをその場で試す用途では、編集できるコードブロックとして表示できます。コピー操作は現在の入力内容を対象にします。"
                                : "Use an editable source area when examples should be changed in place.",
                            preview: (
                                <div className="w-full max-w-lg">
                                    <EditableCodeBlockDemo copyLabel={copyLabel} copiedLabel={copiedLabel} />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import * as React from "react"\nimport { CodeBlock } from "@gunjo/ui"\n\nconst initialSource = [\n  'type Status = "draft" | "published";',\n  "",\n  "export function formatStatus(status: Status) {",\n  '  return status === "published" ? "公開中" : "下書き";',\n  "}",\n].join("\\n")\n\nexport function EditableCodeBlock() {\n  const [source, setSource] = React.useState(initialSource)\n\n  return (\n    <CodeBlock\n      code={source}\n      filename="format-status.ts"\n      language="ts"\n      editable\n      highlight\n      showLineNumbers\n      onCodeChange={setSource}\n    />\n  )\n}`,
                        },
                        {
                            key: "theme",
                            title: isJa ? "配色の切り替え" : "Color themes",
                            description: isJa
                                ? "周囲の背景や文脈に合わせて、dark / light / muted の配色を選べます。"
                                : "Choose dark, light, or muted color themes to fit surrounding surfaces.",
                            preview: (
                                <div className="grid w-full max-w-lg gap-3">
                                    <CodeBlock code={HTML_SAMPLE} filename="index.html" language="html" theme="dark" highlight showLineNumbers copyable={false} />
                                    <CodeBlock code={TYPESCRIPT_SAMPLE} filename="format-status.ts" language="ts" theme="light" highlight showLineNumbers copyable={false} />
                                    <CodeBlock code={JSON_SAMPLE} filename="component.json" language="json" theme="muted" highlight showLineNumbers copyable={false} />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import { CodeBlock } from "@gunjo/ui"\n\nconst html = [\n  '<section class="product-card">',\n  '  <img src="/images/sample.jpg" alt="Gunjo UI preview" />',\n  "  <h2>Gunjo UI</h2>",\n  "  <p>Build consistent interfaces with reusable components.</p>",\n  "</section>",\n].join("\\n")\n\nconst typescript = [\n  'type Status = "draft" | "published";',\n  "",\n  "export function formatStatus(status: Status) {",\n  '  return status === "published" ? "公開中" : "下書き";',\n  "}",\n].join("\\n")\n\nconst json = JSON.stringify({ component: "CodeBlock", language: "json", copyable: false }, null, 2)\n\nexport function CodeBlockThemes() {\n  return (\n    <div className="grid gap-3">\n      <CodeBlock code={html} filename="index.html" language="html" theme="dark" highlight showLineNumbers copyable={false} />\n      <CodeBlock code={typescript} filename="format-status.ts" language="ts" theme="light" highlight showLineNumbers copyable={false} />\n      <CodeBlock code={json} filename="component.json" language="json" theme="muted" highlight showLineNumbers copyable={false} />\n    </div>\n  )\n}`,
                        },
                        {
                            key: "read-only",
                            title: isJa ? "コピーなし" : "Without copy action",
                            description: isJa
                                ? "短い例やコピー不要の断片では、コピー操作を非表示にできます。"
                                : "Hide the copy action for short or non-copyable snippets.",
                            preview: (
                                <div className="w-full max-w-lg">
                                    <CodeBlock code={JSON_SAMPLE} language="json" copyable={false} />
                                </div>
                            ),
                            previewHeight: "auto",
                            code: `import { CodeBlock } from "@gunjo/ui"\n\nconst json = JSON.stringify({\n  component: "CodeBlock",\n  language: "json",\n  copyable: false,\n}, null, 2)\n\nexport function ReadonlyCodeBlock() {\n  return <CodeBlock code={json} language="json" copyable={false} />\n}`,
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
                <DocCodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
