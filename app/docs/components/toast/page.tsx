"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { getCategoryVariantUnionType } from "@/lib/docs-spec";
import { Button, Toast, type ToastAction, type ToastType } from "@gunjo/ui";

function ToastTriggerPreview({
    type,
    label,
    message,
    closeLabel,
    description,
    action,
    duration = 2500,
}: {
    type: ToastType;
    label: string;
    message: string;
    closeLabel: string;
    description?: React.ReactNode;
    action?: ToastAction;
    duration?: number;
}) {
    const [visible, setVisible] = React.useState(false);

    return (
        <div className="flex min-h-24 w-full flex-col items-start gap-4">
            <Button variant="outline" onClick={() => setVisible(true)}>
                {label}
            </Button>
            <Toast
                message={message}
                description={description}
                action={action}
                type={type}
                isVisible={visible}
                onClose={() => setVisible(false)}
                duration={duration}
                placement="inline"
                closeLabel={closeLabel}
            />
        </div>
    );
}

export default function ToastPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";
    const closeLabel = isJa ? "通知を閉じる" : "Close notification";

    const code = `import { Toast } from "@gunjo/ui"

export function SavedToast() {
  return (
    <Toast
      message="${isJa ? "プロジェクトを保存しました。" : "Project saved."}"
      type="success"
      isVisible={true}
      onClose={() => {}}
      placement="inline"
      closeLabel="${closeLabel}"
    />
  )
}`;

    const successCode = `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function SaveToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        ${isJa ? "保存する" : "Save"}
      </Button>
      <Toast
        message="${isJa ? "プロジェクトを保存しました。" : "Project saved."}"
        type="success"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={2500}
        placement="inline"
        closeLabel="${closeLabel}"
      />
    </div>
  )
}`;

    const errorCode = `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function ErrorToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        ${isJa ? "エラーを表示" : "Show error"}
      </Button>
      <Toast
        message="${isJa ? "接続が切れたため保存できませんでした。" : "Could not save because the connection was lost."}"
        type="error"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={4000}
        placement="inline"
        closeLabel="${closeLabel}"
      />
    </div>
  )
}`;

    const infoCode = `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function InfoToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        ${isJa ? "お知らせを表示" : "Show info"}
      </Button>
      <Toast
        message="${isJa ? "新しいダッシュボードを有効にしました。" : "The new dashboard has been enabled."}"
        type="info"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={3000}
        placement="inline"
        closeLabel="${closeLabel}"
      />
    </div>
  )
}`;

    const fixedCode = `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function FloatingToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setVisible(true)}>
        ${isJa ? "通知を出す" : "Show toast"}
      </Button>
      <Toast
        message="${isJa ? "処理が完了しました。" : "The task is complete."}"
        type="success"
        isVisible={visible}
        onClose={() => setVisible(false)}
        placement="inline"
        closeLabel="${closeLabel}"
      />
    </div>
  )
}`;

    const toastVariantType = getCategoryVariantUnionType("feedback", "toast");
    const propsData = [
        {
            name: "message",
            type: "string",
            description: isJa ? "通知に表示する短い本文です。" : "Short message shown inside the toast.",
            required: true,
        },
        {
            name: "type",
            type: toastVariantType,
            default: "'success'",
            description: isJa ? "通知の意味を示す見た目です。" : "Visual intent for the toast.",
        },
        {
            name: "isVisible",
            type: "boolean",
            description: isJa ? "表示状態です。false の時は描画しません。" : "Controls whether the toast is rendered.",
            required: true,
        },
        {
            name: "onClose",
            type: "() => void",
            description: isJa ? "自動クローズまたは閉じるボタンで呼び出します。" : "Called when auto-dismiss or the close button closes the toast.",
            required: true,
        },
        {
            name: "description",
            type: "ReactNode",
            description: isJa ? "message の下に muted 色で表示する2行目の補足です。" : "Secondary line rendered under message in a muted tone.",
        },
        {
            name: "action",
            type: "{ label: string; onClick: () => void; altText?: string }",
            description: isJa ? "閉じるボタンの手前に置く操作ボタンを1つ。押すと onClick を実行してからトーストを閉じます。" : "A single action button before the close button. Activating it runs onClick and then closes the toast.",
        },
        {
            name: "duration",
            type: "number",
            default: isJa ? "3000（action ありは 6000）" : "3000 (6000 with action)",
            description: isJa ? "自動で閉じるまでの時間（ミリ秒）。action があり未指定なら、押す前に消えないよう既定を長くします。" : "Auto-dismiss duration in ms. When action is set and duration is omitted, the default is longer so it isn't dismissed before it can be used.",
        },
        {
            name: "placement",
            type: "'fixed' | 'inline'",
            default: "'fixed'",
            description: isJa ? "実アプリでは fixed、docs やカード内プレビューでは inline を使います。" : "Use fixed in apps and inline inside docs or framed previews.",
        },
        {
            name: "closeLabel",
            type: "string",
            default: "'Close notification'",
            description: isJa ? "閉じるボタンのアクセシブルラベルとツールチップです。" : "Accessible label and tooltip for the close button.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.toast.title}
            description={feedbackMetadata.toast.description}
            usedComponents={[
                { name: "Toast", href: "/docs/components/toast" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "ToastProvider", href: "/docs/components/toast-provider" },
                { name: "Banner", href: "/docs/components/banner" },
                { name: "Alert", href: "/docs/components/alert" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <Toast
                    message={isJa ? "プロジェクトを保存しました。" : "Project saved."}
                    type="success"
                    isVisible
                    onClose={() => {}}
                    placement="inline"
                    closeLabel={closeLabel}
                />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "success",
                            title: isJa ? "成功通知" : "Success",
                            description: isJa ? "保存や更新が完了したことを短く伝えます。" : "Confirms that a save or update completed.",
                            preview: (
                                <ToastTriggerPreview
                                    type="success"
                                    label={isJa ? "保存する" : "Save"}
                                    message={isJa ? "プロジェクトを保存しました。" : "Project saved."}
                                    closeLabel={closeLabel}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: successCode,
                        },
                        {
                            key: "error",
                            title: isJa ? "失敗通知" : "Error",
                            description: isJa ? "復旧できる失敗を短く示し、必要なら近くの操作で再試行させます。" : "Shows a recoverable failure and leaves retry handling to the surrounding UI.",
                            preview: (
                                <ToastTriggerPreview
                                    type="error"
                                    label={isJa ? "エラーを表示" : "Show error"}
                                    message={isJa ? "接続が切れたため保存できませんでした。" : "Could not save because the connection was lost."}
                                    closeLabel={closeLabel}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: errorCode,
                        },
                        {
                            key: "info",
                            title: isJa ? "情報通知" : "Info",
                            description: isJa ? "ユーザーの操作を止めない軽い更新に使います。" : "Use for low-stakes updates that should not block the user.",
                            preview: (
                                <ToastTriggerPreview
                                    type="info"
                                    label={isJa ? "お知らせを表示" : "Show info"}
                                    message={isJa ? "新しいダッシュボードを有効にしました。" : "The new dashboard has been enabled."}
                                    closeLabel={closeLabel}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: infoCode,
                        },
                        {
                            key: "inline",
                            title: isJa ? "枠内で確認する" : "Inline preview",
                            description: isJa ? "docs やカード内で確認する場合は inline を指定します。実アプリで単体 Toast を画面上に浮かせる場合は既定の fixed を使います。" : "Use inline inside docs or cards. In apps, keep the default fixed placement when rendering a standalone Toast.",
                            preview: (
                                <Toast
                                    message={isJa ? "処理が完了しました。" : "The task is complete."}
                                    type="success"
                                    isVisible
                                    onClose={() => {}}
                                    placement="inline"
                                    closeLabel={closeLabel}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: fixedCode,
                        },
                        {
                            key: "rich",
                            title: isJa ? "補足＋操作つき" : "Description + action",
                            description: isJa ? "description で2行目を、action で操作ボタンを1つ足せます。action を押すと onClick 実行後にトーストが閉じます。action があり duration 未指定なら、押す前に消えないよう既定を長めにします。" : "Add a second line via description and one action button via action. Activating action runs onClick and then closes the toast. With an action and no explicit duration, it auto-dismisses slower.",
                            preview: (
                                <ToastTriggerPreview
                                    type="info"
                                    label={isJa ? "削除する" : "Delete"}
                                    message={isJa ? "プロジェクトを削除しました。" : "Project deleted."}
                                    description={isJa ? "元に戻すには数秒以内に操作してください。" : "Undo within a few seconds to restore it."}
                                    action={{ label: isJa ? "元に戻す" : "Undo", onClick: () => {} }}
                                    closeLabel={closeLabel}
                                />
                            ),
                            previewBodyWidth: "md",
                            code: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function DeleteToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        ${isJa ? "削除する" : "Delete"}
      </Button>
      <Toast
        message="${isJa ? "プロジェクトを削除しました。" : "Project deleted."}"
        description="${isJa ? "元に戻すには数秒以内に操作してください。" : "Undo within a few seconds to restore it."}"
        type="info"
        action={{ label: "${isJa ? "元に戻す" : "Undo"}", onClick: handleUndo }}
        isVisible={visible}
        onClose={() => setVisible(false)}
        placement="inline"
      />
    </div>
  )
}`,
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
                    <CodeCopyButton code={successCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={successCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
