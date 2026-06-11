"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import {
    CodeCopyButton,
    ComponentLayout,
    ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Button, StatusScreen } from "@gunjo/ui";
import {
    IconClock as Clock,
    IconLock as Lock,
    IconTool as Wrench,
    IconWifiOff as WifiOff,
} from "@tabler/icons-react";

function ScreenFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-md border bg-background">
            {children}
        </div>
    );
}

export default function StatusScreenPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { Button, StatusScreen } from "@gunjo/ui"

export function NotFound() {
  return (
    <StatusScreen
      variant="not-found"
      title="${isJa ? "ページが見つかりません" : "Page not found"}"
      description="${isJa ? "URLが変更されたか、ページが削除された可能性があります。" : "The page may have moved or been deleted."}"
      action={<Button>${isJa ? "トップへ戻る" : "Back to home"}</Button>}
    />
  )
}`;

    const notFoundCode = code;

    const errorCode = `import { Button, StatusScreen } from "@gunjo/ui"

export function ErrorFallback() {
  return (
    <StatusScreen
      variant="error"
      title="${isJa ? "問題が発生しました" : "Something went wrong"}"
      description="${isJa ? "再読み込みしても解消しない場合は、サポートへ連絡してください。" : "Refresh the page or contact support if the problem continues."}"
      details="req-id 7f3c9a"
      action={<Button>${isJa ? "再試行" : "Try again"}</Button>}
    />
  )
}`;

const offlineCode = `import { Button, StatusScreen } from "@gunjo/ui"
import { IconWifiOff as WifiOff } from "@tabler/icons-react"

export function OfflineFallback() {
  return (
    <StatusScreen
      variant="offline"
      icon={<WifiOff />}
      title="${isJa ? "オフラインです" : "You're offline"}"
      description="${isJa ? "接続を確認してから、もう一度試してください。" : "Check your connection and try again."}"
      action={<Button variant="outline">${isJa ? "再接続する" : "Retry connection"}</Button>}
    />
  )
}`;

const forbiddenCode = `import { StatusScreen } from "@gunjo/ui"
import { IconLock as Lock } from "@tabler/icons-react"

export function ForbiddenFallback() {
  return (
    <StatusScreen
      variant="forbidden"
      icon={<Lock />}
      title="${isJa ? "アクセスできません" : "Access denied"}"
      description="${isJa ? "このページを見る権限がありません。管理者に確認してください。" : "You do not have permission to view this page."}"
    />
  )
}`;

const maintenanceCode = `import { StatusScreen } from "@gunjo/ui"
import { IconTool as Wrench } from "@tabler/icons-react"

export function MaintenanceFallback() {
  return (
    <StatusScreen
      variant="maintenance"
      icon={<Wrench />}
      title="${isJa ? "メンテナンス中です" : "Under maintenance"}"
      description="${isJa ? "作業が完了するまでしばらくお待ちください。" : "We'll be back shortly. Thanks for your patience."}"
    />
  )
}`;

const comingSoonCode = `import { StatusScreen } from "@gunjo/ui"
import { IconClock as Clock } from "@tabler/icons-react"

export function ComingSoonFallback() {
  return (
    <StatusScreen
      variant="coming-soon"
      icon={<Clock />}
      title="${isJa ? "準備中です" : "Coming soon"}"
      description="${isJa ? "このページはまだ公開前です。準備が整い次第表示されます。" : "This page is not available yet. Check back soon."}"
    />
  )
}`;

const usageCode = `import { Button, StatusScreen } from "@gunjo/ui"
import { IconClock as Clock, IconLock as Lock, IconTool as Wrench, IconWifiOff as WifiOff } from "@tabler/icons-react"

<StatusScreen variant="not-found" action={<Button>Back to home</Button>} />
<StatusScreen variant="error" details="req-id 7f3c" action={<Button>Try again</Button>} />
<StatusScreen variant="offline" icon={<WifiOff />} action={<Button>Retry</Button>} />
<StatusScreen variant="forbidden" icon={<Lock />} />
<StatusScreen variant="maintenance" icon={<Wrench />} />
<StatusScreen variant="coming-soon" icon={<Clock />} />`;

    const propsData = [
        {
            name: "variant",
            type: "'not-found' | 'error' | 'offline' | 'forbidden' | 'maintenance' | 'coming-soon'",
            default: "'not-found'",
            description: isJa
                ? "画面の状態に合わせたコード、トーン、既定文言を選びます。"
                : "Selects the default code, tone, and copy for the screen state.",
        },
        {
            name: "code",
            type: "React.ReactNode",
            description: isJa
                ? "大きく表示するステータスコードです。variant の既定値を上書きします。"
                : "Large status code. Overrides the variant default.",
        },
        {
            name: "icon",
            type: "React.ReactNode",
            description: isJa
                ? "コードの代わりに表示するアイコンです。通信状態や準備中などに使います。"
                : "Icon shown instead of the code for icon-led states.",
        },
        {
            name: "title",
            type: "React.ReactNode",
            description: isJa
                ? "見出しです。variant の既定文言を上書きできます。"
                : "Heading text. Can override the variant default.",
        },
        {
            name: "description",
            type: "React.ReactNode",
            description: isJa
                ? "状態の説明です。次に何ができるかまで含めます。"
                : "Explanation of the state, ideally including the next action.",
        },
        {
            name: "action",
            type: "React.ReactNode",
            description: isJa
                ? "戻る、再試行、問い合わせなどの主要操作です。"
                : "Primary action, such as back, retry, or contact support.",
        },
        {
            name: "details",
            type: "React.ReactNode",
            description: isJa
                ? "リクエストIDや診断情報など、補助的な詳細を表示します。"
                : "Optional secondary details, such as request ID or diagnostics.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.statusScreen.title}
            description={feedbackMetadata.statusScreen.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                { name: "Alert", href: "/docs/components/alert" },
                { name: "EmptyState", href: "/docs/components/empty-state" },
                { name: "Toast", href: "/docs/components/toast" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview
                embedSrc="/embed/status-screen"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                fullPagePreview
                previewBodyWidth="full"
                sectionLabels={sectionLabels}
            >
                <ScreenFrame>
                    <StatusScreen
                        variant="not-found"
                        title={isJa ? "ページが見つかりません" : "Page not found"}
                        description={
                            isJa
                                ? "URLが変更されたか、ページが削除された可能性があります。"
                                : "The page may have moved or been deleted."
                        }
                        action={<Button>{isJa ? "トップへ戻る" : "Back to home"}</Button>}
                        className="min-h-[320px]"
                    />
                </ScreenFrame>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "not-found",
                            title: isJa ? "ページが見つからない" : "Not found",
                            description: isJa
                                ? "存在しない URL や削除済みページで使う標準の 404 状態です。"
                                : "Standard 404 state for missing or removed pages.",
                            preview: (
                                <ScreenFrame>
                                    <StatusScreen
                                        variant="not-found"
                                        title={isJa ? "ページが見つかりません" : "Page not found"}
                                        description={isJa ? "URLを確認するか、トップへ戻ってください。" : "Check the URL or return to the home page."}
                                        action={<Button>{isJa ? "トップへ戻る" : "Back to home"}</Button>}
                                        className="min-h-[300px]"
                                    />
                                </ScreenFrame>
                            ),
                            previewBodyWidth: "full",
                            code: notFoundCode,
                        },
                        {
                            key: "error",
                            title: isJa ? "エラー" : "Error",
                            description: isJa
                                ? "復旧操作とリクエストIDなどの補助情報を一緒に表示します。"
                                : "Shows a recovery action with secondary diagnostic details.",
                            preview: (
                                <ScreenFrame>
                                    <StatusScreen
                                        variant="error"
                                        title={isJa ? "問題が発生しました" : "Something went wrong"}
                                        description={isJa ? "再読み込みしても解消しない場合は、サポートへ連絡してください。" : "Refresh the page or contact support if the problem continues."}
                                        details="req-id 7f3c9a"
                                        action={<Button>{isJa ? "再試行" : "Try again"}</Button>}
                                        className="min-h-[320px]"
                                    />
                                </ScreenFrame>
                            ),
                            previewBodyWidth: "full",
                            code: errorCode,
                        },
                        {
                            key: "offline",
                            title: isJa ? "オフライン" : "Offline",
                            description: isJa
                                ? "通信状態の問題はコードではなくアイコンで示します。"
                                : "Connection states are easier to scan with an icon than a numeric code.",
                            preview: (
                                <ScreenFrame>
                                    <StatusScreen
                                        variant="offline"
                                        icon={<WifiOff />}
                                        title={isJa ? "オフラインです" : "You're offline"}
                                        description={isJa ? "接続を確認してから、もう一度試してください。" : "Check your connection and try again."}
                                        action={<Button variant="outline">{isJa ? "再接続する" : "Retry connection"}</Button>}
                                        className="min-h-[300px]"
                                    />
                                </ScreenFrame>
                            ),
                            previewBodyWidth: "full",
                            code: offlineCode,
                        },
                        {
                            key: "forbidden",
                            title: isJa ? "権限なし" : "Forbidden",
                            description: isJa
                                ? "403 や権限不足の画面では、問い合わせ先や次の確認先を明確にします。"
                                : "For 403 states, clarify the next owner or permission path.",
                            preview: (
                                <ScreenFrame>
                                    <StatusScreen
                                        variant="forbidden"
                                        icon={<Lock />}
                                        title={isJa ? "アクセスできません" : "Access denied"}
                                        description={isJa ? "このページを見る権限がありません。管理者に確認してください。" : "You do not have permission to view this page."}
                                        className="min-h-[300px]"
                                    />
                                </ScreenFrame>
                            ),
                            previewBodyWidth: "full",
                            code: forbiddenCode,
                        },
                        {
                            key: "maintenance",
                            title: isJa ? "メンテナンス" : "Maintenance",
                            description: isJa
                                ? "予定停止や短時間の復旧待ちに使います。"
                                : "Use for scheduled downtime or short recovery windows.",
                            preview: (
                                <ScreenFrame>
                                    <StatusScreen
                                        variant="maintenance"
                                        icon={<Wrench />}
                                        title={isJa ? "メンテナンス中です" : "Under maintenance"}
                                        description={isJa ? "作業が完了するまでしばらくお待ちください。" : "We'll be back shortly. Thanks for your patience."}
                                        className="min-h-[300px]"
                                    />
                                </ScreenFrame>
                            ),
                            previewBodyWidth: "full",
                            code: maintenanceCode,
                        },
                        {
                            key: "coming-soon",
                            title: isJa ? "公開前" : "Coming soon",
                            description: isJa
                                ? "未公開ページや段階公開前の入口で使います。"
                                : "Use for unreleased pages or staged rollout entry points.",
                            preview: (
                                <ScreenFrame>
                                    <StatusScreen
                                        variant="coming-soon"
                                        icon={<Clock />}
                                        title={isJa ? "準備中です" : "Coming soon"}
                                        description={isJa ? "このページはまだ公開前です。準備が整い次第表示されます。" : "This page is not available yet. Check back soon."}
                                        className="min-h-[300px]"
                                    />
                                </ScreenFrame>
                            ),
                            previewBodyWidth: "full",
                            code: comingSoonCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "移行メモ" : "Migration note"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "404 と 500 向けの旧テンプレート API は StatusScreen に統合しました。新規実装では variant で状態を選び、必要に応じて title、description、action、details を上書きします。"
                        : "The old 404 and 500 template APIs have been consolidated into StatusScreen. New implementations should choose the state with variant, then override title, description, action, or details when needed."}
                </p>
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
