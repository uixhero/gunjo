"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Button, ToastProvider, useToast } from "@gunjo/ui";

function ProviderTrigger({
    successLabel,
    errorLabel,
    infoLabel,
    messages,
}: {
    successLabel: string;
    errorLabel: string;
    infoLabel: string;
    messages: {
        success: string;
        error: string;
        info: string;
    };
}) {
    const { showToast } = useToast();

    return (
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => showToast(messages.success, "success")}>{successLabel}</Button>
            <Button variant="destructive" onClick={() => showToast(messages.error, "error", 4500)}>
                {errorLabel}
            </Button>
            <Button variant="outline" onClick={() => showToast(messages.info, "info")}>{infoLabel}</Button>
        </div>
    );
}

function SingleProviderTrigger({
    label,
    message,
    type,
    duration,
    variant = "default",
}: {
    label: string;
    message: string;
    type: "success" | "error" | "info";
    duration?: number;
    variant?: "default" | "destructive" | "outline";
}) {
    const { showToast } = useToast();

    return (
        <Button variant={variant} onClick={() => showToast(message, type, duration)}>
            {label}
        </Button>
    );
}

export default function ToastProviderPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";
    const closeLabel = isJa ? "通知を閉じる" : "Close notification";
    const messages = {
        success: isJa ? "設定を保存しました。" : "Settings saved.",
        error: isJa ? "保存できませんでした。接続を確認してください。" : "Could not save. Check your connection.",
        info: isJa ? "同期をバックグラウンドで続行しています。" : "Sync continues in the background.",
    };

    const code = `import { Button, ToastProvider, useToast } from "@gunjo/ui"

function ToastActions() {
  const { showToast } = useToast()

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => showToast("${messages.success}", "success")}>
        ${isJa ? "成功通知" : "Success toast"}
      </Button>
      <Button
        variant="destructive"
        onClick={() => showToast("${messages.error}", "error", 4500)}
      >
        ${isJa ? "失敗通知" : "Error toast"}
      </Button>
      <Button variant="outline" onClick={() => showToast("${messages.info}", "info")}>
        ${isJa ? "情報通知" : "Info toast"}
      </Button>
    </div>
  )
}

export function ToastProviderExample() {
  return (
    <ToastProvider labels={{ close: "${closeLabel}" }}>
      <ToastActions />
    </ToastProvider>
  )
}`;

    const successOnlyCode = `import { Button, ToastProvider, useToast } from "@gunjo/ui"

function SaveAction() {
  const { showToast } = useToast()

  return (
    <Button onClick={() => showToast("${messages.success}", "success")}>
      ${isJa ? "保存する" : "Save"}
    </Button>
  )
}

export function SaveToastProvider() {
  return (
    <ToastProvider labels={{ close: "${closeLabel}" }}>
      <SaveAction />
    </ToastProvider>
  )
}`;

    const durationCode = `import { Button, ToastProvider, useToast } from "@gunjo/ui"

function RetryAction() {
  const { showToast } = useToast()

  return (
    <Button
      variant="destructive"
      onClick={() => showToast("${messages.error}", "error", 4500)}
    >
      ${isJa ? "失敗通知を出す" : "Show failure"}
    </Button>
  )
}

export function ErrorToastProvider() {
  return (
    <ToastProvider labels={{ close: "${closeLabel}" }}>
      <RetryAction />
    </ToastProvider>
  )
}`;

    const localizedCode = `import { Button, ToastProvider, useToast } from "@gunjo/ui"

function LocalizedToastAction() {
  const { showToast } = useToast()

  return (
    <Button onClick={() => showToast("${messages.info}", "info")}>
      ${isJa ? "同期状態を表示" : "Show sync status"}
    </Button>
  )
}

export function LocalizedToastProvider() {
  return (
    <ToastProvider labels={{ close: "${closeLabel}" }}>
      <LocalizedToastAction />
    </ToastProvider>
  )
}`;

    const propsData = [
        {
            name: "children",
            type: "React.ReactNode",
            description: isJa ? "useToast を呼び出すアプリ領域です。" : "Application subtree that can call useToast.",
            required: true,
        },
        {
            name: "labels.close",
            type: "string",
            default: "'Close notification'",
            description: isJa ? "Toast の閉じるボタンに使うラベルとツールチップです。" : "Label and tooltip used by toast close buttons.",
        },
        {
            name: "showToast",
            type: "(message: string, type: ToastType, duration?: number) => void",
            description: isJa ? "useToast から取得する通知表示関数です。duration はミリ秒です。" : "Function returned by useToast. Duration is in milliseconds.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.toastProvider.title}
            description={feedbackMetadata.toastProvider.description}
            usedComponents={[
                { name: "ToastProvider", href: "/docs/components/toast-provider" },
                { name: "Toast", href: "/docs/components/toast" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "NotificationCenter", href: "/docs/components/notification-center" },
                { name: "Banner", href: "/docs/components/banner" },
                { name: "Alert", href: "/docs/components/alert" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="lg" sectionLabels={sectionLabels}>
                <ToastProvider labels={{ close: closeLabel }}>
                    <div className="rounded-lg border bg-muted/40 p-6">
                        <ProviderTrigger
                            successLabel={isJa ? "成功通知" : "Success toast"}
                            errorLabel={isJa ? "失敗通知" : "Error toast"}
                            infoLabel={isJa ? "情報通知" : "Info toast"}
                            messages={messages}
                        />
                    </div>
                </ToastProvider>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "success",
                            title: isJa ? "成功通知をまとめて扱う" : "Success notification",
                            description: isJa ? "保存や更新の完了は Provider 経由で画面右上に集約します。" : "Route save and update confirmations through the provider stack.",
                            preview: (
                                <ToastProvider labels={{ close: closeLabel }}>
                                    <SingleProviderTrigger
                                        label={isJa ? "保存する" : "Save"}
                                        message={messages.success}
                                        type="success"
                                    />
                                </ToastProvider>
                            ),
                            previewBodyWidth: "lg",
                            code: successOnlyCode,
                        },
                        {
                            key: "duration",
                            title: isJa ? "長めに出す失敗通知" : "Longer error duration",
                            description: isJa ? "失敗通知はユーザーが読めるように、成功通知より長めに表示できます。" : "Errors can stay visible longer than success confirmations.",
                            preview: (
                                <ToastProvider labels={{ close: closeLabel }}>
                                    <SingleProviderTrigger
                                        label={isJa ? "失敗通知を出す" : "Show failure"}
                                        message={messages.error}
                                        type="error"
                                        duration={4500}
                                        variant="destructive"
                                    />
                                </ToastProvider>
                            ),
                            previewBodyWidth: "lg",
                            code: durationCode,
                        },
                        {
                            key: "localized",
                            title: isJa ? "ラベルのローカライズ" : "Localized labels",
                            description: isJa ? "閉じるボタンのラベルは Provider に渡して全 Toast に反映します。" : "Pass close labels to the provider so every toast uses localized copy.",
                            preview: (
                                <ToastProvider labels={{ close: closeLabel }}>
                                    <SingleProviderTrigger
                                        label={isJa ? "同期状態を表示" : "Show sync status"}
                                        message={messages.info}
                                        type="info"
                                        variant="outline"
                                    />
                                </ToastProvider>
                            ),
                            previewBodyWidth: "lg",
                            code: localizedCode,
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
