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

    const code = isJa
        ? `import { CopyButton } from "@gunjo/ui";

export function SnippetCopyButton() {
  const snippet = "const total = items.length";

  return (
    <CopyButton
      value={snippet}
      copyLabel="コードをコピー"
      copiedLabel="コピーしました"
      copyFailedLabel="コピーに失敗しました"
      variant="label"
    />
  );
}`
        : `import { CopyButton } from "@gunjo/ui";

export function SnippetCopyButton() {
  const snippet = "const total = items.length";

  return (
    <CopyButton
      value={snippet}
      copyLabel="Copy code"
      copiedLabel="Copied"
      copyFailedLabel="Copy failed"
      variant="label"
    />
  );
}`;

    const usageCode = isJa
        ? `import { CopyButton } from "@gunjo/ui";

export function InstallCommandCopyButton() {
  const command = "npm install @gunjo/ui";

  return (
    <CopyButton
      value={command}
      copyLabel="コマンドをコピー"
      copiedLabel="コピーしました"
      copyFailedLabel="コピーに失敗しました"
      variant="label"
    />
  );
}`
        : `import { CopyButton } from "@gunjo/ui";

export function InstallCommandCopyButton() {
  const command = "npm install @gunjo/ui";

  return (
    <CopyButton
      value={command}
      copyLabel="Copy command"
      copiedLabel="Copied"
      copyFailedLabel="Copy failed"
      variant="label"
    />
  );
}`;

    const iconCode = isJa
        ? `import { CopyButton } from "@gunjo/ui";

export function SnippetCopyIconButton() {
  const snippet = "const total = items.length";

  return (
    <CopyButton
      value={snippet}
      copyLabel="コードをコピー"
      copiedLabel="コピーしました"
      copyFailedLabel="コピーに失敗しました"
    />
  );
}`
        : `import { CopyButton } from "@gunjo/ui";

export function SnippetCopyIconButton() {
  const snippet = "const total = items.length";

  return (
    <CopyButton
      value={snippet}
      copyLabel="Copy code"
      copiedLabel="Copied"
      copyFailedLabel="Copy failed"
    />
  );
}`;

    const surfaceCode = isJa
        ? `import { CopyButton } from "@gunjo/ui";

const SURFACES = ["ghost", "outline", "secondary"] as const;

export function CopyButtonSurfaces() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {SURFACES.map((surface) => (
        <div key={surface} className="flex flex-col items-start gap-1">
          <CopyButton
            value="const total = items.length"
            buttonVariant={surface}
            copyLabel="コードをコピー"
            copiedLabel="コピーしました"
            copyFailedLabel="コピーに失敗しました"
            variant="label"
          />
          <span className="font-mono text-xs text-muted-foreground">{surface}</span>
        </div>
      ))}
    </div>
  );
}`
        : `import { CopyButton } from "@gunjo/ui";

const SURFACES = ["ghost", "outline", "secondary"] as const;

export function CopyButtonSurfaces() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {SURFACES.map((surface) => (
        <div key={surface} className="flex flex-col items-start gap-1">
          <CopyButton
            value="const total = items.length"
            buttonVariant={surface}
            copyLabel="Copy code"
            copiedLabel="Copied"
            copyFailedLabel="Copy failed"
            variant="label"
          />
          <span className="font-mono text-xs text-muted-foreground">{surface}</span>
        </div>
      ))}
    </div>
  );
}`;

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
                            code: isJa
                                ? `import { CopyButton } from "@gunjo/ui";

export function CompactCommandCopyButton() {
  return (
    <CopyButton
      value="npm install @gunjo/ui"
      copyLabel="コマンドをコピー"
      copiedLabel="コピーしました"
      copyFailedLabel="コピーに失敗しました"
      copiedDuration={5000}
      variant="label"
      className="h-8 px-2 text-xs"
    />
  );
}`
                                : `import { CopyButton } from "@gunjo/ui";

export function CompactCommandCopyButton() {
  return (
    <CopyButton
      value="npm install @gunjo/ui"
      copyLabel="Copy command"
      copiedLabel="Copied"
      copyFailedLabel="Copy failed"
      copiedDuration={5000}
      variant="label"
      className="h-8 px-2 text-xs"
    />
  );
}`,
                        },
                        {
                            key: "button-surface",
                            title: isJa ? "ボタンの面" : "The button surface",
                            description: isJa
                                ? "buttonVariant で面だけを変えます。既定の ghost はツールバーやコードブロックの隅に、outline や secondary は単体で置くときに使います。"
                                : "buttonVariant changes only the surface. The default ghost suits toolbars and code-block corners; outline and secondary suit a button standing on its own.",
                            preview: (
                                <div className="flex flex-wrap items-center gap-4">
                                    {(["ghost", "outline", "secondary"] as const).map((surface) => (
                                        <div key={surface} className="flex flex-col items-start gap-1">
                                            <CopyButton
                                                value={copyValue}
                                                buttonVariant={surface}
                                                copyLabel={copyLabel}
                                                copiedLabel={copiedLabel}
                                                copyFailedLabel={failedLabel}
                                                variant="label"
                                            />
                                            <span className="font-mono text-xs text-muted-foreground">{surface}</span>
                                        </div>
                                    ))}
                                </div>
                            ),
                            previewHeight: "auto",
                            code: surfaceCode,
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>ラベルを動詞で書き、結果で入れ替える。</strong>資料は「ボタンのラベルは動詞で書く」を挙げています。この部品は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copyLabel</code>・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copiedLabel</code>・<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copyFailedLabel</code> の3つを持ち、押した結果でラベルとアイコンを入れ替えます。既定では5秒（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copiedDuration</code>）でもとに戻ります。
                        </li>
                        <li>
                            <strong>失敗しても黙らない。</strong>クリップボードの API が拒否された場合は、画面外の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">textarea</code> を使う古いやり方に切り替えます。それでも駄目なら「コピーできません」を出します。押したのに何も起きない、という状態を作らないためです。
                        </li>
                        <li>
                            <strong>結果はツールチップではなく <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="status"'}</code> で知らせる。</strong>押した後の吹き出しは読み上げ対象の要素で、そのあいだツールチップは出しません。ツールチップはポインタを乗せている人にしか届かないので、押した結果の知らせには使えないからです。
                            <br />
                            一般のボタンの設計は UIXHERO の「ボタン」にあります。{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/button"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: ボタン（Button）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The label is a verb, and it changes with the outcome.</strong> The article asks for verbs on buttons. This one carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copyLabel</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copiedLabel</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copyFailedLabel</code> and swaps label and icon based on what happened, reverting after <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copiedDuration</code> (5 seconds by default).
                        </li>
                        <li>
                            <strong>Failure is never silent.</strong> If the Clipboard API is denied, the component falls back to an off-screen <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">textarea</code>; if that fails too it says so. Pressing a button and getting nothing at all is not an allowed outcome.
                        </li>
                        <li>
                            <strong>The result is announced through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="status"'}</code>, not a tooltip.</strong> The post-copy bubble is a live region, and the tooltip is suppressed while it is showing. A tooltip only reaches someone hovering with a pointer, so it cannot carry the result of a press.
                            <br />
                            The general design of buttons is covered by UIXHERO&rsquo;s button article.{" "}
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/button"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Button (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
