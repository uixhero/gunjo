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

export default function AlertPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

const code = `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconTerminal2 as Terminal } from "@tabler/icons-react"

export function InstallAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>${isJa ? "CLIで追加できます" : "Install with the CLI"}</AlertTitle>
      <AlertDescription>
        ${isJa ? "必要なコンポーネントを選んで、プロジェクトへ追加できます。" : "Choose the component you need and add it to your project."}
      </AlertDescription>
    </Alert>
  )
}`;

    const usageCode = code;

const destructiveCode = `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconAlertCircle as AlertCircle } from "@tabler/icons-react"

export function SessionAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>${isJa ? "セッションが切れました" : "Session expired"}</AlertTitle>
      <AlertDescription>
        ${isJa ? "続行するには、もう一度ログインしてください。" : "Sign in again before continuing."}
      </AlertDescription>
    </Alert>
  )
}`;

const successCode = `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconCircleCheck as CheckCircle2 } from "@tabler/icons-react"

export function SavedAlert() {
  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>${isJa ? "保存しました" : "Saved"}</AlertTitle>
      <AlertDescription>
        ${isJa ? "設定は次回のプレビューから反映されます。" : "The settings apply to the next preview."}
      </AlertDescription>
    </Alert>
  )
}`;

const infoCode = `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconInfoCircle as Info } from "@tabler/icons-react"

export function InfoAlert() {
  return (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle>${isJa ? "仕様を確認できます" : "Spec available"}</AlertTitle>
      <AlertDescription>
        ${isJa ? "詳細な仕様は、このページのプロパティ表にまとめています。" : "The full specification is available in the props table on this page."}
      </AlertDescription>
    </Alert>
  )
}`;

const warningCode = `import { Alert, AlertDescription, AlertTitle } from "@gunjo/ui"
import { IconAlertTriangle as TriangleAlert } from "@tabler/icons-react"

export function WarningAlert() {
  return (
    <Alert variant="warning">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>${isJa ? "公開前に確認してください" : "Review before publishing"}</AlertTitle>
      <AlertDescription>
        ${isJa ? "外部に公開される項目が含まれています。" : "This includes items that will be visible externally."}
      </AlertDescription>
    </Alert>
  )
}`;

const titleOnlyCode = `import { Alert, AlertTitle } from "@gunjo/ui"
import { IconTerminal2 as Terminal } from "@tabler/icons-react"

export function TitleOnlyAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>${isJa ? "下書きを保存しました" : "Draft saved"}</AlertTitle>
    </Alert>
  )
}`;

    const propsData = [
        {
            name: "variant",
            type: "'default' | 'info' | 'success' | 'warning' | 'destructive'",
            default: "'default'",
            description: isJa ? "アラートの意味と強さに応じた見た目です。" : "Visual treatment for the alert intent.",
        },
        {
            name: "children",
            type: "React.ReactNode",
            description: isJa ? "アイコン、タイトル、本文を含めたアラートの内容です。" : "Alert content, usually an icon, title, and description.",
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
        </ComponentLayout>
    );
}
