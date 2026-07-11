"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Banner, Button, DocNote } from "@gunjo/ui";
import {
    IconAlertTriangle as AlertTriangle,
    IconCircleCheck as CheckCircle,
    IconInfoCircle as Info,
    IconShieldExclamation as ShieldAlert,
    IconSpeakerphone as Megaphone,
} from "@tabler/icons-react";

export default function BannerPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

const code = `import { Banner, Button } from "@gunjo/ui"
import { IconSpeakerphone as Megaphone } from "@tabler/icons-react"

export function ReleaseBanner() {
  return (
    <Banner
      variant="info"
      icon={<Megaphone className="h-4 w-4" />}
      action={
        <Button size="sm" variant="secondary" className="h-7 px-2">
          ${isJa ? "変更を見る" : "View changes"}
        </Button>
      }
      dismissLabel="${isJa ? "お知らせを閉じる" : "Dismiss announcement"}"
      onDismiss={() => {}}
    >
      ${isJa ? "新しいリリースを公開しました。主な変更点を確認できます。" : "A new release is available. Review the highlights before updating."}
    </Banner>
  )
}`;

    const usageCode = code;

const infoActionCode = `import { Banner, Button } from "@gunjo/ui"
import { IconInfoCircle as Info } from "@tabler/icons-react"

export function PermissionBanner() {
  return (
    <Banner
      variant="info"
      icon={<Info className="h-4 w-4" />}
      action={
        <Button size="sm" variant="secondary" className="h-7 px-2">
          ${isJa ? "詳細" : "Details"}
        </Button>
      }
      dismissLabel="${isJa ? "お知らせを閉じる" : "Dismiss announcement"}"
      onDismiss={() => {}}
    >
      ${isJa ? "新しい権限設定を利用できます。" : "New permission settings are available."}
    </Banner>
  )
}`;

const warningCode = `import { Banner } from "@gunjo/ui"
import { IconAlertTriangle as AlertTriangle } from "@tabler/icons-react"

export function MaintenanceBanner() {
  return (
    <Banner variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
      ${isJa ? "2026年6月3日 02:00-04:00 JST にメンテナンスを行います。" : "Scheduled maintenance runs on June 3, 2026 from 02:00 to 04:00 JST."}
    </Banner>
  )
}`;

const destructiveCode = `import { Banner, Button } from "@gunjo/ui"
import { IconShieldExclamation as ShieldAlert } from "@tabler/icons-react"

export function IncidentBanner() {
  return (
    <Banner
      variant="destructive"
      icon={<ShieldAlert className="h-4 w-4" />}
      action={
        <Button size="sm" variant="secondary" className="h-7 px-2">
          ${isJa ? "状況を見る" : "View status"}
        </Button>
      }
    >
      ${isJa ? "API の書き込み処理が遅延しています。復旧状況を確認してください。" : "API writes are degraded. Check the status page for recovery updates."}
    </Banner>
  )
}`;

const successCode = `import { Banner } from "@gunjo/ui"
import { IconCircleCheck as CheckCircle } from "@tabler/icons-react"

export function SetupCompleteBanner() {
  return (
    <Banner
      variant="success"
      icon={<CheckCircle className="h-4 w-4" />}
      dismissLabel="${isJa ? "完了メッセージを閉じる" : "Dismiss completion message"}"
      onDismiss={() => {}}
    >
      ${isJa ? "ワークスペースの初期設定が完了しました。" : "Workspace setup is complete."}
    </Banner>
  )
}`;

    const propsData = [
        {
            name: "variant",
            type: "'default' | 'info' | 'success' | 'warning' | 'destructive'",
            default: "'default'",
            description: isJa ? "バナーの意味に応じた見た目です。" : "Visual treatment for the banner intent.",
        },
        {
            name: "icon",
            type: "React.ReactNode",
            description: isJa ? "先頭に表示する補助アイコンです。" : "Optional leading icon.",
        },
        {
            name: "action",
            type: "React.ReactNode",
            description: isJa ? "閉じるボタンの前に表示する補助アクションです。" : "Optional action rendered before the dismiss button.",
        },
        {
            name: "onDismiss",
            type: "() => void",
            description: isJa ? "指定すると閉じるボタンを表示し、押下時に呼び出します。" : "Shows a dismiss button and calls this handler when clicked.",
        },
        {
            name: "dismissLabel",
            type: "string",
            default: "'Dismiss'",
            description: isJa ? "閉じるボタンのアクセシブルラベルです。" : "Accessible label for the dismiss button.",
        },
        {
            name: "children",
            type: "React.ReactNode",
            description: isJa ? "バナーに表示する本文です。長い文は1行で省略されます。" : "Banner message. Long text is truncated on one line.",
        },
    ];

    return (
        <ComponentLayout
            title={(feedbackMetadata as Record<string, { title: string }>).banner.title}
            description={(feedbackMetadata as Record<string, { description: string }>).banner.description}
            usedComponents={[
                { name: "Banner", href: "/docs/components/banner" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "Alert", href: "/docs/components/alert" },
                { name: "NotificationCenter", href: "/docs/components/notification-center" },
                { name: "Toast", href: "/docs/components/toast" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="xl" sectionLabels={sectionLabels}>
                <Banner
                    variant="info"
                    icon={<Megaphone className="h-4 w-4" />}
                    action={
                        <Button size="sm" variant="secondary" className="h-7 px-2">
                            {isJa ? "変更を見る" : "View changes"}
                        </Button>
                    }
                    dismissLabel={isJa ? "お知らせを閉じる" : "Dismiss announcement"}
                    onDismiss={() => {}}
                >
                    {isJa ? "新しいリリースを公開しました。主な変更点を確認できます。" : "A new release is available. Review the highlights before updating."}
                </Banner>
            </ComponentPreview>

            <DocNote variant="note" heading={isJa ? "Banner は1行の帯" : "Banner is a one-line strip"}>
                <p className="text-sm leading-relaxed">
                    {isJa ? (
                        <>
                            <code>Banner</code> は高さ <code>h-10</code> の<strong>1行</strong>の帯で、本文は
                            <strong>省略（truncate）</strong>されます。複数行や折り返す内容は黙って切れます。
                            タイトル＋本文のような<strong>ブロック型・複数行の通知</strong>には{" "}
                            <a href="/docs/components/alert" className="font-medium underline underline-offset-4">Alert</a>{" "}
                            を使ってください（高さ制限なし・<code>AlertTitle</code>／<code>AlertDescription</code>）。
                        </>
                    ) : (
                        <>
                            <code>Banner</code> is a fixed <code>h-10</code> <strong>single-line</strong> strip — its
                            message is <strong>truncated</strong>, so multi-line/wrapping content is silently clipped.
                            For a <strong>multi-line / block callout</strong> (title + body), use{" "}
                            <a href="/docs/components/alert" className="font-medium underline underline-offset-4">Alert</a>{" "}
                            instead (no height cap; <code>AlertTitle</code> / <code>AlertDescription</code>).
                        </>
                    )}
                </p>
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "info-with-action",
                            title: isJa ? "情報とアクション" : "Info with action",
                            description: isJa ? "画面全体に知らせたい更新と、関連する操作を一緒に出します。" : "Pairs a page-wide update with a relevant action.",
                            preview: (
                                <Banner
                                    variant="info"
                                    icon={<Info className="h-4 w-4" />}
                                    action={<Button size="sm" variant="secondary" className="h-7 px-2">{isJa ? "詳細" : "Details"}</Button>}
                                    dismissLabel={isJa ? "お知らせを閉じる" : "Dismiss announcement"}
                                    onDismiss={() => {}}
                                >
                                    {isJa ? "新しい権限設定を利用できます。" : "New permission settings are available."}
                                </Banner>
                            ),
                            previewBodyWidth: "xl",
                            code: infoActionCode,
                        },
                        {
                            key: "warning-maintenance",
                            title: isJa ? "メンテナンス予告" : "Maintenance warning",
                            description: isJa ? "ユーザーが事前に把握すべき予定停止や制限を示します。" : "Shows planned downtime or limitations users should know about.",
                            preview: (
                                <Banner variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
                                    {isJa ? "2026年6月3日 02:00-04:00 JST にメンテナンスを行います。" : "Scheduled maintenance runs on June 3, 2026 from 02:00 to 04:00 JST."}
                                </Banner>
                            ),
                            previewBodyWidth: "xl",
                            code: warningCode,
                        },
                        {
                            key: "destructive-incident",
                            title: isJa ? "障害通知" : "Incident",
                            description: isJa ? "現在起きている障害や強い注意が必要な状態に使います。" : "Use for active incidents or high-attention states.",
                            preview: (
                                <Banner
                                    variant="destructive"
                                    icon={<ShieldAlert className="h-4 w-4" />}
                                    action={<Button size="sm" variant="secondary" className="h-7 px-2">{isJa ? "状況を見る" : "View status"}</Button>}
                                >
                                    {isJa ? "API の書き込み処理が遅延しています。復旧状況を確認してください。" : "API writes are degraded. Check the status page for recovery updates."}
                                </Banner>
                            ),
                            previewBodyWidth: "xl",
                            code: destructiveCode,
                        },
                        {
                            key: "success",
                            title: isJa ? "完了通知" : "Success",
                            description: isJa ? "大きな完了を短く伝え、不要になれば閉じられるようにします。" : "Confirms a completed milestone and can be dismissed when no longer needed.",
                            preview: (
                                <Banner
                                    variant="success"
                                    icon={<CheckCircle className="h-4 w-4" />}
                                    dismissLabel={isJa ? "完了メッセージを閉じる" : "Dismiss completion message"}
                                    onDismiss={() => {}}
                                >
                                    {isJa ? "ワークスペースの初期設定が完了しました。" : "Workspace setup is complete."}
                                </Banner>
                            ),
                            previewBodyWidth: "xl",
                            code: successCode,
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
