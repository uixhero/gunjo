"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Button, Spinner, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function SpinnerPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { Spinner } from "@gunjo/ui"

export function LoadingSpinner() {
  return <Spinner size="lg" aria-label="${isJa ? "読み込み中" : "Loading"}" />
}`;

    const sizesCode = `import { Spinner } from "@gunjo/ui"

export function SpinnerSizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="sm" aria-label="${isJa ? "小さい読み込み表示" : "Small loading indicator"}" />
      <Spinner aria-label="${isJa ? "読み込み中" : "Loading"}" />
      <Spinner size="lg" aria-label="${isJa ? "大きい読み込み表示" : "Large loading indicator"}" />
    </div>
  )
}`;

    const buttonCode = `import { Button, Spinner, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"

export function SavingButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          <Button disabled className="gap-2">
            <Spinner size="sm" aria-hidden />
            ${isJa ? "保存中" : "Saving"}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>${isJa ? "保存処理が完了するまで操作できません。" : "This action is unavailable until saving finishes."}</TooltipContent>
    </Tooltip>
  )
}`;

    const blockingCode = `import { Spinner } from "@gunjo/ui"

export function BlockingLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40"
    >
      <Spinner size="lg" aria-hidden />
      <span className="text-sm text-muted-foreground">
        ${isJa ? "データを読み込んでいます。" : "Loading data."}
      </span>
    </div>
  )
}`;

    const inlineCode = `import { Spinner } from "@gunjo/ui"

export function InlineRefreshing() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" aria-hidden />
      ${isJa ? "最新状態に更新しています。" : "Refreshing the latest state."}
    </span>
  )
}`;

    const propsData = [
        {
            name: "size",
            type: "'default' | 'sm' | 'lg' | 'icon'",
            default: "'default'",
            description: isJa ? "スピナーの大きさです。ボタン内では sm、単独表示では default または lg を使います。" : "Spinner size. Use sm inside buttons, and default or lg for standalone loading states.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "SVG に追加するクラスです。" : "Additional class names applied to the SVG element.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.spinner.title}
            description={feedbackMetadata.spinner.description}
            usedComponents={[{ name: "Spinner", href: "/docs/components/spinner" }]}
            relatedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Skeleton", href: "/docs/components/skeleton" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <Spinner size="lg" aria-label={isJa ? "読み込み中" : "Loading"} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sizes",
                            title: isJa ? "サイズ" : "Sizes",
                            description: isJa ? "ボタン内、インライン、単独ローダーで使い分けます。" : "Choose a size for buttons, inline status, or standalone loaders.",
                            preview: (
                                <div className="flex items-center gap-4">
                                    <Spinner size="sm" aria-label={isJa ? "小さい読み込み表示" : "Small loading indicator"} />
                                    <Spinner aria-label={isJa ? "読み込み中" : "Loading"} />
                                    <Spinner size="lg" aria-label={isJa ? "大きい読み込み表示" : "Large loading indicator"} />
                                </div>
                            ),
                            code: sizesCode,
                        },
                        {
                            key: "button",
                            title: isJa ? "ボタン内の処理中" : "Inside a button",
                            description: isJa ? "送信や保存中はボタンを無効化し、表示ラベルと一緒に出します。" : "Disable the action and pair the spinner with visible text while a request is running.",
                            preview: (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex" tabIndex={0}>
                                            <Button disabled className="gap-2">
                                                <Spinner size="sm" aria-hidden />
                                                {isJa ? "保存中" : "Saving"}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isJa ? "保存処理が完了するまで操作できません。" : "This action is unavailable until saving finishes."}
                                    </TooltipContent>
                                </Tooltip>
                            ),
                            code: buttonCode,
                        },
                        {
                            key: "blocking",
                            title: isJa ? "領域全体の読み込み" : "Blocking loader",
                            description: isJa ? "操作を待たせる場合は、状態文と一緒に role=status の領域で伝えます。" : "For blocking states, announce the status text with role=status.",
                            preview: (
                                <div role="status" aria-live="polite" className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40">
                                    <Spinner size="lg" aria-hidden />
                                    <span className="text-sm text-muted-foreground">{isJa ? "データを読み込んでいます。" : "Loading data."}</span>
                                </div>
                            ),
                            previewBodyWidth: "lg",
                            code: blockingCode,
                        },
                        {
                            key: "inline",
                            title: isJa ? "テキスト横の状態表示" : "Inline status",
                            description: isJa ? "小さい更新状態は、スピナーだけにせず短い状態文を添えます。" : "Pair compact loading indicators with short status text.",
                            preview: (
                                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                    <Spinner size="sm" aria-hidden />
                                    {isJa ? "最新状態に更新しています。" : "Refreshing the latest state."}
                                </span>
                            ),
                            code: inlineCode,
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
                <div className="flex items-center gap-3">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={code} />
                </div>
            </section>
        </ComponentLayout>
    );
}
