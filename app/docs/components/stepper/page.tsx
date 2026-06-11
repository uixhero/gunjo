"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Stepper } from "@gunjo/ui";

const metadata = feedbackMetadata as Record<string, { title: string; description: string }>;

export default function StepperPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { Stepper } from "@gunjo/ui"

export function CheckoutStepper() {
  return (
    <Stepper
      aria-label="${isJa ? "購入手続きの進行状況" : "Checkout progress"}"
      steps={[
        { label: "${isJa ? "カート" : "Cart"}", state: "completed" },
        { label: "${isJa ? "配送先" : "Shipping"}", state: "current" },
        { label: "${isJa ? "確認" : "Review"}", state: "upcoming" },
      ]}
    />
  )
}`;

    const verticalCode = `import { Stepper } from "@gunjo/ui"

export function ImportStepper() {
  return (
    <Stepper
      orientation="vertical"
      aria-label="${isJa ? "インポート処理の進行状況" : "Import progress"}"
      steps={[
        { label: "${isJa ? "アップロード" : "Upload"}", state: "completed" },
        { label: "${isJa ? "検証" : "Validate"}", state: "current" },
        { label: "${isJa ? "反映" : "Apply"}", state: "upcoming" },
      ]}
    />
  )
}`;

    const completeCode = `import { Stepper } from "@gunjo/ui"

export function CompleteStepper() {
  return (
    <Stepper
      aria-label="${isJa ? "セットアップ完了" : "Setup complete"}"
      steps={[
        { label: "${isJa ? "作成" : "Create"}", state: "completed" },
        { label: "${isJa ? "確認" : "Confirm"}", state: "completed" },
        { label: "${isJa ? "公開" : "Publish"}", state: "completed" },
      ]}
    />
  )
}`;

    const longCode = `import { Stepper } from "@gunjo/ui"

export function ReviewStepper() {
  return (
    <Stepper
      aria-label="${isJa ? "レビュー依頼の進行状況" : "Review request progress"}"
      orientation="vertical"
      steps={[
        { label: "${isJa ? "受付" : "Received"}", state: "completed" },
        { label: "${isJa ? "担当者確認" : "Owner review"}", state: "current" },
        { label: "${isJa ? "公開前チェック" : "Pre-publish check"}", state: "upcoming" },
        { label: "${isJa ? "公開" : "Publish"}", state: "upcoming" },
      ]}
    />
  )
}`;

    const propsData = [
        {
            name: "steps",
            type: "Array<{ label: string; state: 'completed' | 'current' | 'upcoming' }>",
            description: isJa ? "表示するステップです。現在地には state: 'current' を指定します。" : "Step entries. Use state: 'current' for the active step.",
            required: true,
        },
        {
            name: "orientation",
            type: "'horizontal' | 'vertical'",
            default: "'horizontal'",
            description: isJa ? "横並びか縦並びかを指定します。" : "Controls whether steps flow horizontally or vertically.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "ラッパーに追加するクラスです。狭い横並びでは横スクロールを付ける場合があります。" : "Additional class names applied to the wrapper. Horizontal flows may add overflow handling in narrow regions.",
        },
    ];

    return (
        <ComponentLayout
            title={metadata.stepper.title}
            description={metadata.stepper.description}
            usedComponents={[{ name: "Stepper", href: "/docs/components/stepper" }]}
            relatedComponents={[
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Timeline", href: "/docs/components/timeline" },
                { name: "StatusBar", href: "/docs/components/status-bar" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="lg" sectionLabels={sectionLabels}>
                <Stepper
                    aria-label={isJa ? "購入手続きの進行状況" : "Checkout progress"}
                    steps={[
                        { label: isJa ? "カート" : "Cart", state: "completed" },
                        { label: isJa ? "配送先" : "Shipping", state: "current" },
                        { label: isJa ? "確認" : "Review", state: "upcoming" },
                    ]}
                />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "horizontal",
                            title: isJa ? "横並び" : "Horizontal",
                            description: isJa ? "短い手順や購入フローの現在地を示します。" : "Shows the current position in short flows such as checkout.",
                            preview: (
                                <Stepper
                                    aria-label={isJa ? "購入手続きの進行状況" : "Checkout progress"}
                                    steps={[
                                        { label: isJa ? "カート" : "Cart", state: "completed" },
                                        { label: isJa ? "配送先" : "Shipping", state: "current" },
                                        { label: isJa ? "確認" : "Review", state: "upcoming" },
                                    ]}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code,
                        },
                        {
                            key: "vertical",
                            title: isJa ? "縦並び" : "Vertical",
                            description: isJa ? "説明文が増える処理や、狭い領域で流れを縦に見せたい時に使います。" : "Use vertical layout when labels are longer or space is narrow.",
                            preview: (
                                <Stepper
                                    orientation="vertical"
                                    aria-label={isJa ? "インポート処理の進行状況" : "Import progress"}
                                    steps={[
                                        { label: isJa ? "アップロード" : "Upload", state: "completed" },
                                        { label: isJa ? "検証" : "Validate", state: "current" },
                                        { label: isJa ? "反映" : "Apply", state: "upcoming" },
                                    ]}
                                />
                            ),
                            code: verticalCode,
                        },
                        {
                            key: "complete",
                            title: isJa ? "全て完了" : "All complete",
                            description: isJa ? "処理が完了した後の確認画面で使います。" : "Use after the process has finished.",
                            preview: (
                                <Stepper
                                    aria-label={isJa ? "セットアップ完了" : "Setup complete"}
                                    steps={[
                                        { label: isJa ? "作成" : "Create", state: "completed" },
                                        { label: isJa ? "確認" : "Confirm", state: "completed" },
                                        { label: isJa ? "公開" : "Publish", state: "completed" },
                                    ]}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: completeCode,
                        },
                        {
                            key: "long",
                            title: isJa ? "長いラベル" : "Long labels",
                            description: isJa ? "長いラベルやスマホ幅では、横並びで詰め込まず縦並びに切り替えます。" : "For long labels or mobile width, switch to vertical layout instead of forcing a cramped horizontal flow.",
                            preview: (
                                <Stepper
                                    aria-label={isJa ? "レビュー依頼の進行状況" : "Review request progress"}
                                    orientation="vertical"
                                    steps={[
                                        { label: isJa ? "受付" : "Received", state: "completed" },
                                        { label: isJa ? "担当者確認" : "Owner review", state: "current" },
                                        { label: isJa ? "公開前チェック" : "Pre-publish check", state: "upcoming" },
                                        { label: isJa ? "公開" : "Publish", state: "upcoming" },
                                    ]}
                                />
                            ),
                            previewBodyWidth: "lg",
                            code: longCode,
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
