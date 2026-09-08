"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui";
import {
    IconAlertCircle as AlertCircle,
    IconAlertTriangle as TriangleAlert,
    IconCircleCheck as CheckCircle2,
    IconInfoCircle as Info,
    IconTerminal2 as Terminal,
} from "@tabler/icons-react";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const codeByLocale = {
    ja: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconTerminal2 as Terminal } from "@tabler/icons-react"

export function InstallAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>CLIで追加できます</AlertTitle>
      <AlertDescription>
        必要なコンポーネントを選んで、プロジェクトへ追加できます。
      </AlertDescription>
    </Alert>
  )
}`,
    en: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconTerminal2 as Terminal } from "@tabler/icons-react"

export function InstallAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Install with the CLI</AlertTitle>
      <AlertDescription>
        Choose the component you need and add it to your project.
      </AlertDescription>
    </Alert>
  )
}`,
};

const destructiveCodeByLocale = {
    ja: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconAlertCircle as AlertCircle } from "@tabler/icons-react"

export function SessionAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>セッションが切れました</AlertTitle>
      <AlertDescription>
        続行するには、もう一度ログインしてください。
      </AlertDescription>
    </Alert>
  )
}`,
    en: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconAlertCircle as AlertCircle } from "@tabler/icons-react"

export function SessionAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Session expired</AlertTitle>
      <AlertDescription>
        Sign in again before continuing.
      </AlertDescription>
    </Alert>
  )
}`,
};

const successCodeByLocale = {
    ja: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconCircleCheck as CheckCircle2 } from "@tabler/icons-react"

export function SavedAlert() {
  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>保存しました</AlertTitle>
      <AlertDescription>
        設定は次回のプレビューから反映されます。
      </AlertDescription>
    </Alert>
  )
}`,
    en: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconCircleCheck as CheckCircle2 } from "@tabler/icons-react"

export function SavedAlert() {
  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Saved</AlertTitle>
      <AlertDescription>
        The settings apply to the next preview.
      </AlertDescription>
    </Alert>
  )
}`,
};

const infoCodeByLocale = {
    ja: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconInfoCircle as Info } from "@tabler/icons-react"

export function InfoAlert() {
  return (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle>仕様を確認できます</AlertTitle>
      <AlertDescription>
        詳細な仕様は、このページのプロパティ表にまとめています。
      </AlertDescription>
    </Alert>
  )
}`,
    en: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconInfoCircle as Info } from "@tabler/icons-react"

export function InfoAlert() {
  return (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle>Spec available</AlertTitle>
      <AlertDescription>
        The full specification is available in the props table on this page.
      </AlertDescription>
    </Alert>
  )
}`,
};

const warningCodeByLocale = {
    ja: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconAlertTriangle as TriangleAlert } from "@tabler/icons-react"

export function WarningAlert() {
  return (
    <Alert variant="warning">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>公開前に確認してください</AlertTitle>
      <AlertDescription>
        外部に公開される項目が含まれています。
      </AlertDescription>
    </Alert>
  )
}`,
    en: `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconAlertTriangle as TriangleAlert } from "@tabler/icons-react"

export function WarningAlert() {
  return (
    <Alert variant="warning">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Review before publishing</AlertTitle>
      <AlertDescription>
        This includes items that will be visible externally.
      </AlertDescription>
    </Alert>
  )
}`,
};

const titleOnlyCodeByLocale = {
    ja: `import { Alert, AlertTitle } from "@gunjo/ui"
import { IconTerminal2 as Terminal } from "@tabler/icons-react"

export function TitleOnlyAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>下書きを保存しました</AlertTitle>
    </Alert>
  )
}`,
    en: `import { Alert, AlertTitle } from "@gunjo/ui"
import { IconTerminal2 as Terminal } from "@tabler/icons-react"

export function TitleOnlyAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Draft saved</AlertTitle>
    </Alert>
  )
}`,
};

export default function AlertPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = codeByLocale[locale];

    const usageCode = code;

    const destructiveCode = destructiveCodeByLocale[locale];

    const successCode = successCodeByLocale[locale];

    const infoCode = infoCodeByLocale[locale];

    const warningCode = warningCodeByLocale[locale];

    const titleOnlyCode = titleOnlyCodeByLocale[locale];

    const propsData = [
        {
            name: "variant",
            type: "'default' | 'info' | 'success' | 'warning' | 'destructive'",
            default: "'default'",
            description: isJa ? "アラートの意味と強さに応じた見た目です。" : "Visual treatment for the alert intent.",
        },
        {
            name: "icon",
            type: "React.ReactNode",
            description: isJa
                ? "先頭のアイコン（Tabler 等の svg）。位置付き のアイコンスロットに描画されます（compound API で先頭の <svg> 子要素が入る場所と同じ）。装飾扱い。"
                : "Leading glyph (a Tabler/svg node), rendered into the positioned icon slot (the same one the compound API fills with a bare <svg> first child). Decorative.",
        },
        {
            name: "title",
            type: "React.ReactNode",
            description: isJa
                ? "簡易タイトル。<AlertTitle>（既定 p・見出し順に入らない）の子要素と同等です。セクション見出しにしたい場合は compound の <AlertTitle as=…> を使います。(#251)"
                : "Convenience title — equivalent to an <AlertTitle> child (defaults to p, out of the heading order). For a section heading, use <AlertTitle as=…>. (#251)",
        },
        {
            name: "description",
            type: "React.ReactNode",
            description: isJa ? "簡易本文。<AlertDescription> の子要素と同等です。" : "Convenience description — equivalent to an <AlertDescription> child.",
        },
        {
            name: "children",
            type: "React.ReactNode",
            description: isJa ? "compound での内容（アイコン、AlertTitle、AlertDescription）。icon/title/description の props と併用も可能です。" : "Compound content (icon, AlertTitle, AlertDescription). Can be combined with the icon/title/description props.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "アラートのラッパーに追加するクラスです。" : "Additional class names applied to the alert wrapper.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.alert.title}
            description={feedbackMetadata.alert.description}
            usedComponents={[
                { name: "Alert", href: "/docs/components/alert" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "Banner", href: "/docs/components/banner" },
                { name: "DocNote", href: "/docs/components/doc-note" },
                { name: "Toast", href: "/docs/components/toast" },
            ]}
            sectionLabels={sectionLabels}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: アラート（Alert）" : "UIXHERO: Alert (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/alert`,
                },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{isJa ? "CLIで追加できます" : "Install with the CLI"}</AlertTitle>
                    <AlertDescription>
                        {isJa ? "必要なコンポーネントを選んで、プロジェクトへ追加できます。" : "Choose the component you need and add it to your project."}
                    </AlertDescription>
                </Alert>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: isJa ? "標準表示" : "Default",
                            description: isJa ? "補足や注意を本文から分離して示します。" : "Separates a supporting note from the surrounding content.",
                            preview: (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>{isJa ? "CLIで追加できます" : "Install with the CLI"}</AlertTitle>
                                    <AlertDescription>
                                        {isJa ? "必要なコンポーネントを選んで、プロジェクトへ追加できます。" : "Choose the component you need and add it to your project."}
                                    </AlertDescription>
                                </Alert>
                            ),
                            previewBodyWidth: "md",
                            code,
                        },
                        {
                            key: "props-api",
                            title: isJa ? "props で書く" : "Props API",
                            description: isJa
                                ? "icon / title / description の props で、compound を組まずに同じアラートを書けます。"
                                : "The icon / title / description props express the same alert without composing the parts.",
                            preview: (
                                <Alert
                                    variant="success"
                                    icon={<CheckCircle2 className="h-4 w-4" />}
                                    title={isJa ? "交付完了" : "Issued"}
                                    description={isJa ? "書類の交付が完了しました。" : "The document has been issued."}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: isJa
                                ? `import { Alert } from "@gunjo/ui";
import { IconCircleCheck as CheckCircle2 } from "@tabler/icons-react";

<Alert
  variant="success"
  icon={<CheckCircle2 className="h-4 w-4" />}
  title="交付完了"
  description="書類の交付が完了しました。"
/>`
                                : `import { Alert } from "@gunjo/ui";
import { IconCircleCheck as CheckCircle2 } from "@tabler/icons-react";

<Alert
  variant="success"
  icon={<CheckCircle2 className="h-4 w-4" />}
  title="Issued"
  description="The document has been issued."
/>`,
                        },
                        {
                            key: "info",
                            title: isJa ? "情報" : "Info",
                            description: isJa ? "補足情報や参照先を本文から分けて伝えます。" : "Separates supporting information or references from body text.",
                            preview: (
                                <Alert variant="info">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>{isJa ? "仕様を確認できます" : "Spec available"}</AlertTitle>
                                    <AlertDescription>
                                        {isJa ? "詳細な仕様は、このページのプロパティ表にまとめています。" : "The full specification is available in the props table on this page."}
                                    </AlertDescription>
                                </Alert>
                            ),
                            previewBodyWidth: "md",
                            code: infoCode,
                        },
                        {
                            key: "success",
                            title: isJa ? "完了" : "Success",
                            description: isJa ? "完了や保存済みなど、肯定的な結果を伝えます。" : "Use for completion, saved, or other positive outcomes.",
                            preview: (
                                <Alert variant="success">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertTitle>{isJa ? "保存しました" : "Saved"}</AlertTitle>
                                    <AlertDescription>
                                        {isJa ? "設定は次回のプレビューから反映されます。" : "The settings apply to the next preview."}
                                    </AlertDescription>
                                </Alert>
                            ),
                            previewBodyWidth: "md",
                            code: successCode,
                        },
                        {
                            key: "warning",
                            title: isJa ? "注意" : "Warning",
                            description: isJa ? "破壊的ではないが、確認してから進める状態に使います。" : "Use for cautionary states that require review before continuing.",
                            preview: (
                                <Alert variant="warning">
                                    <TriangleAlert className="h-4 w-4" />
                                    <AlertTitle>{isJa ? "公開前に確認してください" : "Review before publishing"}</AlertTitle>
                                    <AlertDescription>
                                        {isJa ? "外部に公開される項目が含まれています。" : "This includes items that will be visible externally."}
                                    </AlertDescription>
                                </Alert>
                            ),
                            previewBodyWidth: "md",
                            code: warningCode,
                        },
                        {
                            key: "destructive",
                            title: isJa ? "エラー" : "Error",
                            description: isJa ? "操作を止める必要があるエラーや危険な状態に使います。" : "Use for blocking errors or destructive states.",
                            preview: (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{isJa ? "セッションが切れました" : "Session expired"}</AlertTitle>
                                    <AlertDescription>
                                        {isJa ? "続行するには、もう一度ログインしてください。" : "Sign in again before continuing."}
                                    </AlertDescription>
                                </Alert>
                            ),
                            previewBodyWidth: "md",
                            code: destructiveCode,
                        },
                        {
                            key: "title-only",
                            title: isJa ? "タイトルのみ" : "Title only",
                            description: isJa ? "短い完了通知や一文で足りる注意では、説明文を省略できます。" : "For short confirmations or one-line notices, the description can be omitted.",
                            preview: (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>{isJa ? "下書きを保存しました" : "Draft saved"}</AlertTitle>
                                </Alert>
                            ),
                            previewBodyWidth: "md",
                            code: titleOnlyCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props ?? "Props"}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage ?? "Usage"}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </section>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>バナーの題は既定で見出しにしない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AlertTitle</code> は既定で <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">p</code> を描きます。通知バナーの題は文書の見出しの並びに属さないので、そこに見出しを置くと階層が飛びます。節の見出しを本当に持つときだけ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'as="h2"'}</code> のように渡します。見た目はどちらでも同じです（#251）。
                        </li>
                        <li>
                            <strong>種類を色だけに乗せない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> を変えると、枠線・淡い背景・文字色・アイコンの色が同時に変わります。アイコンは飾りとして扱い、意味は題と説明の文が持ちます（#303）。
                        </li>
                        <li>
                            <strong>資料と食い違っているところ。</strong>GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Alert</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> によらず常に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="alert"'}</code> を付けます。資料は「<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="alert"'}</code> は読み上げに割り込むので誤りのときだけに使い、他は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'aria-live="polite"'}</code> にする」としています。ここは実装のほうを直す向きで、#936 で追っています。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>A banner title is not a heading by default.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AlertTitle</code> renders <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">p</code> by default. A status banner title does not belong to the document outline, so putting a heading there skips a level. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'as="h2"'}</code> only when the alert genuinely owns a section heading. The visual style is the same either way (#251).
                        </li>
                        <li>
                            <strong>Never let colour alone carry the kind.</strong> Changing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code> moves the border, the subtle background, the text colour and the icon colour together. The icon is decorative; the title and description carry the meaning (#303).
                        </li>
                        <li>
                            <strong>Where this diverges from the article.</strong> GUNJO always sets <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="alert"'}</code>, whatever the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">variant</code>. The article asks for <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="alert"'}</code> on errors only, with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'aria-live="polite"'}</code> elsewhere, because an assertive region interrupts a screen reader mid-sentence. The implementation is the side that should change; tracked in #936.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
