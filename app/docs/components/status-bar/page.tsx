"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { StatusBar } from "@gunjo/ui";

export default function StatusBarDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { StatusBar } from "@gunjo/ui"

export function EditorStatusBar() {
  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
      <div className="border-b bg-muted/40 px-4 py-2 text-sm font-medium">
        ${isJa ? "記事エディタ" : "Article editor"}
      </div>
      <div className="grid min-h-40 grid-cols-1 text-sm sm:grid-cols-[160px_1fr]">
        <aside className="border-r bg-muted/20 p-3 text-muted-foreground">
          ${isJa ? "下書き / 公開設定 / 履歴" : "Drafts / Publish / History"}
        </aside>
        <main className="space-y-3 p-4">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted/70" />
          <div className="h-3 w-5/6 rounded bg-muted/70" />
        </main>
      </div>
      <StatusBar
        fixed={false}
        className="w-full"
        leftNode={<span>${isJa ? "保存済み" : "Saved"}</span>}
        rightNode={<span>UTF-8</span>}
      >
        <span>${isJa ? "バックグラウンド処理なし" : "No background jobs"}</span>
      </StatusBar>
    </div>
  )
}`;

    const workspaceCode = `import { StatusBar } from "@gunjo/ui"

export function WorkspaceStatusBar() {
  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
      <div className="grid min-h-44 grid-cols-1 sm:grid-cols-[180px_1fr]">
        <aside className="border-r bg-muted/30 p-3 text-sm text-muted-foreground">
          ${isJa ? "すべて / 画像 / 動画" : "All / Images / Videos"}
        </aside>
        <main className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          <div className="aspect-video rounded bg-muted" />
          <div className="aspect-video rounded bg-muted" />
          <div className="aspect-video rounded bg-muted" />
        </main>
      </div>
      <StatusBar
        fixed={false}
        className="w-full"
        leftNode={<span>${isJa ? "同期済み" : "Synced"}</span>}
        rightNode={<span>${isJa ? "3 件選択中" : "3 selected"}</span>}
      >
        <span>${isJa ? "アップロード待ちはありません" : "No pending uploads"}</span>
      </StatusBar>
    </div>
  )
}`;

    const editorCode = code;

    const issueCode = `import { StatusBar } from "@gunjo/ui"

export function IssueStatusBar() {
  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
      <div className="min-h-36 space-y-3 p-4 text-sm">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted/70" />
        <div className="h-3 w-3/4 rounded bg-muted/70" />
      </div>
      <StatusBar
        fixed={false}
        className="w-full bg-destructive text-foreground"
        leftNode={<span>${isJa ? "未保存" : "Unsaved"}</span>}
        rightNode={<span>${isJa ? "再接続中" : "Reconnecting"}</span>}
      >
        <span>${isJa ? "接続が不安定です" : "Connection is unstable"}</span>
      </StatusBar>
    </div>
  )
}`;

    const fixedCode = `import { StatusBar } from "@gunjo/ui"

export function AppShellStatusBar() {
  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
      <div className="flex min-h-40 items-center justify-center bg-muted/20 text-sm text-muted-foreground">
        ${isJa ? "アプリケーションの作業領域" : "Application workspace"}
      </div>
      <StatusBar
        fixed={false}
        className="w-full"
        leftNode={<span>${isJa ? "準備完了" : "Ready"}</span>}
        rightNode={<span>v1.4.0</span>}
      >
        <span>${isJa ? "バックグラウンド処理はありません" : "No background jobs"}</span>
      </StatusBar>
    </div>
  )
}`;

    const propsData = [
        {
            name: "fixed",
            type: "boolean",
            default: "true",
            description: isJa ? "true の場合は画面下部に固定します。docs やカード内では false にして領域内に置きます。" : "When true, fixes the bar to the bottom of the viewport. Set false inside docs or framed regions.",
        },
        {
            name: "leftNode",
            type: "React.ReactNode",
            description: isJa ? "左側に表示する状態や補助情報です。" : "Status or supporting information rendered on the left.",
        },
        {
            name: "rightNode",
            type: "React.ReactNode",
            description: isJa ? "右側に表示するバージョン、選択数、入力モードなどです。" : "Version, selection count, input mode, or similar information rendered on the right.",
        },
        {
            name: "children",
            type: "React.ReactNode",
            description: isJa ? "中央に表示する主要な状態文です。" : "Primary status text rendered in the center.",
        },
        {
            name: "className",
            type: "string",
            description: isJa ? "ラッパーに追加するクラスです。プレビュー内では幅や色の調整に使います。" : "Additional class names applied to the wrapper.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.statusBar.title}
            description={feedbackMetadata.statusBar.description}
            usedComponents={[{ name: "StatusBar", href: "/docs/components/status-bar" }]}
            relatedComponents={[
                { name: "Progress", href: "/docs/components/progress" },
                { name: "Banner", href: "/docs/components/banner" },
                { name: "Toast", href: "/docs/components/toast" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="xl" sectionLabels={sectionLabels}>
                <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
                    <div className="border-b bg-muted/40 px-4 py-2 text-sm font-medium">
                        {isJa ? "記事エディタ" : "Article editor"}
                    </div>
                    <div className="grid min-h-40 grid-cols-1 text-sm sm:grid-cols-[160px_1fr]">
                        <aside className="border-r bg-muted/20 p-3 text-muted-foreground">
                            {isJa ? "下書き / 公開設定 / 履歴" : "Drafts / Publish / History"}
                        </aside>
                        <main className="space-y-3 p-4">
                            <div className="h-4 w-2/3 rounded bg-muted" />
                            <div className="h-3 w-full rounded bg-muted/70" />
                            <div className="h-3 w-5/6 rounded bg-muted/70" />
                        </main>
                    </div>
                    <StatusBar
                        fixed={false}
                        className="w-full"
                        leftNode={<span>{isJa ? "保存済み" : "Saved"}</span>}
                        rightNode={<span>UTF-8</span>}
                    >
                        <span>{isJa ? "バックグラウンド処理なし" : "No background jobs"}</span>
                    </StatusBar>
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "workspace",
                            title: isJa ? "ワークスペース状態" : "Workspace status",
                            description: isJa ? "同期状態や選択数など、画面全体に関わる軽い状態をまとめます。" : "Summarizes lightweight app-wide state such as sync and selection count.",
                            preview: (
                                <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
                                    <div className="grid min-h-44 grid-cols-1 sm:grid-cols-[180px_1fr]">
                                        <aside className="border-r bg-muted/30 p-3 text-sm text-muted-foreground">
                                            {isJa ? "すべて / 画像 / 動画" : "All / Images / Videos"}
                                        </aside>
                                        <main className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
                                            <div className="aspect-video rounded bg-muted" />
                                            <div className="aspect-video rounded bg-muted" />
                                            <div className="aspect-video rounded bg-muted" />
                                        </main>
                                    </div>
                                    <StatusBar
                                        fixed={false}
                                        className="w-full"
                                        leftNode={<span>{isJa ? "同期済み" : "Synced"}</span>}
                                        rightNode={<span>{isJa ? "3 件選択中" : "3 selected"}</span>}
                                    >
                                        <span>{isJa ? "アップロード待ちはありません" : "No pending uploads"}</span>
                                    </StatusBar>
                                </div>
                            ),
                            previewBodyWidth: "xl",
                            code: workspaceCode,
                        },
                        {
                            key: "editor",
                            title: isJa ? "エディタ情報" : "Editor information",
                            description: isJa ? "保存状態、文字コード、入力モードなどを短く表示します。" : "Shows save state, encoding, and input mode in a compact line.",
                            preview: (
                                <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
                                    <div className="border-b bg-muted/40 px-4 py-2 text-sm font-medium">
                                        {isJa ? "記事エディタ" : "Article editor"}
                                    </div>
                                    <div className="min-h-36 space-y-3 p-4">
                                        <div className="h-4 w-2/3 rounded bg-muted" />
                                        <div className="h-3 w-full rounded bg-muted/70" />
                                        <div className="h-3 w-5/6 rounded bg-muted/70" />
                                    </div>
                                    <StatusBar
                                        fixed={false}
                                        className="w-full"
                                        leftNode={<span>{isJa ? "保存済み" : "Saved"}</span>}
                                        rightNode={<span>UTF-8</span>}
                                    >
                                        <span>{isJa ? "バックグラウンド処理なし" : "No background jobs"}</span>
                                    </StatusBar>
                                </div>
                            ),
                            previewBodyWidth: "xl",
                            code: editorCode,
                        },
                        {
                            key: "issue",
                            title: isJa ? "注意が必要な状態" : "Attention state",
                            description: isJa ? "切断や未保存など、ユーザーが気づくべき状態は色と文言を変えます。" : "Use stronger treatment for disconnection, unsaved work, or other attention states.",
                            preview: (
                                <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
                                    <div className="min-h-36 space-y-3 p-4 text-sm">
                                        <div className="h-4 w-40 rounded bg-muted" />
                                        <div className="h-3 w-full rounded bg-muted/70" />
                                        <div className="h-3 w-3/4 rounded bg-muted/70" />
                                    </div>
                                    <StatusBar
                                        fixed={false}
                                        className="w-full bg-destructive text-foreground"
                                        leftNode={<span>{isJa ? "未保存" : "Unsaved"}</span>}
                                        rightNode={<span>{isJa ? "再接続中" : "Reconnecting"}</span>}
                                    >
                                        <span>{isJa ? "接続が不安定です" : "Connection is unstable"}</span>
                                    </StatusBar>
                                </div>
                            ),
                            previewBodyWidth: "xl",
                            code: issueCode,
                        },
                        {
                            key: "fixed",
                            title: isJa ? "シェル下部の配置" : "App shell placement",
                            description: isJa ? "docs のような枠内では fixed を false にし、シェルの下部に配置します。実アプリ全体に固定する場合は fixed の既定値を使います。" : "Inside framed regions like docs, set fixed to false and place it at the shell bottom. For app-wide fixed bars, keep the default fixed behavior.",
                            preview: (
                                <div className="w-full max-w-[720px] overflow-hidden rounded-lg border bg-background">
                                    <div className="flex min-h-40 items-center justify-center bg-muted/20 text-sm text-muted-foreground">
                                        {isJa ? "アプリケーションの作業領域" : "Application workspace"}
                                    </div>
                                    <StatusBar
                                        fixed={false}
                                        className="w-full"
                                        leftNode={<span>{isJa ? "準備完了" : "Ready"}</span>}
                                        rightNode={<span>v1.4.0</span>}
                                    >
                                        <span>{isJa ? "バックグラウンド処理はありません" : "No background jobs"}</span>
                                    </StatusBar>
                                </div>
                            ),
                            previewBodyWidth: "xl",
                            code: fixedCode,
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
