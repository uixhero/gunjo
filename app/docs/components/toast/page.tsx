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

const codeByLocale = {
    ja: `import { Toast } from "@gunjo/ui"

export function SavedToast() {
  return (
    <Toast
      message="プロジェクトを保存しました。"
      type="success"
      isVisible={true}
      onClose={() => {}}
      placement="inline"
      closeLabel="通知を閉じる"
    />
  )
}`,
    en: `import { Toast } from "@gunjo/ui"

export function SavedToast() {
  return (
    <Toast
      message="Project saved."
      type="success"
      isVisible={true}
      onClose={() => {}}
      placement="inline"
      closeLabel="Close notification"
    />
  )
}`,
};

const successCodeByLocale = {
    ja: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function SaveToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        保存する
      </Button>
      <Toast
        message="プロジェクトを保存しました。"
        type="success"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={2500}
        placement="inline"
        closeLabel="通知を閉じる"
      />
    </div>
  )
}`,
    en: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function SaveToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        Save
      </Button>
      <Toast
        message="Project saved."
        type="success"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={2500}
        placement="inline"
        closeLabel="Close notification"
      />
    </div>
  )
}`,
};

const errorCodeByLocale = {
    ja: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function ErrorToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        エラーを表示
      </Button>
      <Toast
        message="接続が切れたため保存できませんでした。"
        type="error"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={4000}
        placement="inline"
        closeLabel="通知を閉じる"
      />
    </div>
  )
}`,
    en: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function ErrorToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        Show error
      </Button>
      <Toast
        message="Could not save because the connection was lost."
        type="error"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={4000}
        placement="inline"
        closeLabel="Close notification"
      />
    </div>
  )
}`,
};

const infoCodeByLocale = {
    ja: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function InfoToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        お知らせを表示
      </Button>
      <Toast
        message="新しいダッシュボードを有効にしました。"
        type="info"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={3000}
        placement="inline"
        closeLabel="通知を閉じる"
      />
    </div>
  )
}`,
    en: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function InfoToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        Show info
      </Button>
      <Toast
        message="The new dashboard has been enabled."
        type="info"
        isVisible={visible}
        onClose={() => setVisible(false)}
        duration={3000}
        placement="inline"
        closeLabel="Close notification"
      />
    </div>
  )
}`,
};

const fixedCodeByLocale = {
    ja: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function FloatingToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setVisible(true)}>
        通知を出す
      </Button>
      <Toast
        message="処理が完了しました。"
        type="success"
        isVisible={visible}
        onClose={() => setVisible(false)}
        placement="inline"
        closeLabel="通知を閉じる"
      />
    </div>
  )
}`,
    en: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function FloatingToastExample() {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setVisible(true)}>
        Show toast
      </Button>
      <Toast
        message="The task is complete."
        type="success"
        isVisible={visible}
        onClose={() => setVisible(false)}
        placement="inline"
        closeLabel="Close notification"
      />
    </div>
  )
}`,
};

const deleteCodeByLocale = {
    ja: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function DeleteToastExample() {
  const [visible, setVisible] = React.useState(false)
  const handleUndo = () => setVisible(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        削除する
      </Button>
      <Toast
        message="プロジェクトを削除しました。"
        description="元に戻すには数秒以内に操作してください。"
        type="info"
        action={{ label: "元に戻す", onClick: handleUndo }}
        isVisible={visible}
        onClose={() => setVisible(false)}
        placement="inline"
      />
    </div>
  )
}`,
    en: `import * as React from "react"
import { Button, Toast } from "@gunjo/ui"

export function DeleteToastExample() {
  const [visible, setVisible] = React.useState(false)
  const handleUndo = () => setVisible(false)

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setVisible(true)}>
        Delete
      </Button>
      <Toast
        message="Project deleted."
        description="Undo within a few seconds to restore it."
        type="info"
        action={{ label: "Undo", onClick: handleUndo }}
        isVisible={visible}
        onClose={() => setVisible(false)}
        placement="inline"
      />
    </div>
  )
}`,
};

export default function ToastPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";
    const closeLabel = isJa ? "通知を閉じる" : "Close notification";

    const usageCode = codeByLocale[locale];

    const successCode = successCodeByLocale[locale];

    const errorCode = errorCodeByLocale[locale];

    const infoCode = infoCodeByLocale[locale];

    const fixedCode = fixedCodeByLocale[locale];

    const deleteCode = deleteCodeByLocale[locale];

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
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
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
                            code: deleteCode,
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
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
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
                            <strong>操作の付いた通知だけ、長く出す。</strong>資料は「気づかない」「読む前に消える」を核の危険として挙げています。GUNJO は消えるまでの既定を3秒にし、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">action</code>（元に戻す、などのボタン）が付いているときだけ6秒にしました（#301）。押させるつもりのものを、読む時間だけで消してはいけないからです。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">duration</code> を渡せばどちらも上書きできます。
                        </li>
                        <li>
                            <strong>失敗のときだけ、読み上げの割り込み方を変える。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">type</code> が失敗のときは割り込む役割を、それ以外は割り込まない役割を付けます。ただし資料は「決済の失敗のような絶対に見逃せないエラーをトーストで出す」ことを崩れた形に挙げています。GUNJO に失敗の型があるのは、やり直しの効く失敗（保存できなかった、など）のためで、後戻りできない失敗は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Alert</code> や <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AlertDialog</code> の仕事です。
                        </li>
                        <li>
                            <strong>積み上がる場所は Provider が持つ。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ToastProvider</code> が縦並びの箱を作り、間を空けて重ねます。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">placement</code> に容器を指定すると、画面全体ではなく渡した枠の中に出ます。docs の埋め込みプレビューのように、ページ全体を覆っては困る場所のためです。消えるときは表示を止めてから300ms後に取り除くので、出ていく動きが最後まで見えます。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/toast"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: トースト（Toast）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Only toasts with an action stay longer.</strong> The article names the two core risks: not being noticed, and disappearing before it is read. GUNJO defaults to three seconds and stretches to six only when an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">action</code> button (undo and the like) is present (#301), because something meant to be pressed must not vanish in the time it takes to read it. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">duration</code> overrides either.
                        </li>
                        <li>
                            <strong>Only the error type changes how it interrupts.</strong> An error toast takes the interrupting role and everything else takes the quiet one. The article, though, lists putting a truly unmissable error such as a failed payment into a toast as a broken pattern. The error type exists in GUNJO for recoverable failures such as a save that did not go through; an irreversible one belongs to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Alert</code> or <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AlertDialog</code>.
                        </li>
                        <li>
                            <strong>The stack belongs to the provider.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ToastProvider</code> owns the column and spaces the toasts apart. Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">placement</code> to the container form and they render inside the element you pass rather than over the whole viewport, which is what the embedded previews in these docs need. On dismissal the toast is hidden first and removed 300ms later, so the exit animation is seen through to the end.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/toast"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Toast (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
