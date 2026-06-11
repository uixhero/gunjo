"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import {
    IconCheck as Check,
    IconDeviceLaptop as DeviceLaptop,
    IconFolder as Folder,
    IconGitBranch as GitBranch,
    IconGitPullRequest as GitPullRequest,
} from "@tabler/icons-react";
import {
    Button,
    ChatComposer,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";

function ComposerLabels(isJa: boolean) {
    return {
        attach: isJa ? "ファイルを添付" : "Attach file",
        options: isJa ? "入力オプション" : "Input options",
        model: isJa ? "モデルを選択" : "Choose model",
        voice: isJa ? "音声入力" : "Voice input",
        send: isJa ? "送信" : "Send",
        stop: isJa ? "停止" : "Stop",
        removeAttachment: isJa ? "添付を削除" : "Remove attachment",
        emptyMessage: isJa ? "メッセージを入力すると送信できます。" : "Type a message before sending.",
    };
}

function ComposerInputOptions({ isJa }: { isJa: boolean }) {
    const [webSearch, setWebSearch] = React.useState(true);
    const [imageContext, setImageContext] = React.useState(false);

    return (
        <div className="space-y-3">
            <div>
                <p className="text-sm font-semibold">{isJa ? "入力オプション" : "Input options"}</p>
                <p className="text-xs text-muted-foreground">
                    {isJa ? "送信前に参照方法を切り替えます。" : "Adjust context before sending."}
                </p>
            </div>
            <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                <span>{isJa ? "Web を参照" : "Use web context"}</span>
                <Switch checked={webSearch} onCheckedChange={setWebSearch} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                <span>{isJa ? "画像を参照" : "Use image context"}</span>
                <Switch checked={imageContext} onCheckedChange={setImageContext} />
            </label>
        </div>
    );
}

function ComposerModelOptions(isJa: boolean) {
    return [
        { value: "auto", label: isJa ? "自動" : "Auto", description: isJa ? "内容に合わせて選択" : "Choose for the task" },
        { value: "standard", label: isJa ? "標準モデル" : "Standard model", description: isJa ? "通常の確認向け" : "General review" },
        { value: "large", label: isJa ? "大容量モデル" : "Large-context model", description: isJa ? "長い文脈向け" : "Long-context work" },
        { value: "fast", label: isJa ? "高速モデル" : "Quick model", description: isJa ? "短い確認向け" : "Quick review" },
    ];
}

function UsageStatusButton({ isJa }: { isJa: boolean }) {
    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            aria-label={isJa ? "使用量の詳細を表示" : "Show usage details"}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <span className="relative h-5 w-5" aria-hidden="true">
                                <svg viewBox="0 0 20 20" className="h-5 w-5 -rotate-90">
                                    <circle cx="10" cy="10" r="7" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="7"
                                        fill="none"
                                        stroke="hsl(var(--primary))"
                                        strokeLinecap="round"
                                        strokeWidth="3"
                                        strokeDasharray="44"
                                        strokeDashoffset="37.84"
                                    />
                                </svg>
                            </span>
                        </button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">{isJa ? "使用量 14%" : "Usage 14%"}</TooltipContent>
            </Tooltip>
            <PopoverContent align="end" side="top" className="w-80">
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold">{isJa ? "プランの使用状況" : "Plan usage"}</p>
                        <p className="text-xs text-muted-foreground">
                            {isJa ? "入力に関係する使用量を必要な時だけ確認します。" : "Review usage related to the composer only when needed."}
                        </p>
                    </div>
                    {[
                        [isJa ? "月次メッセージ" : "Monthly messages", "14%", isJa ? "2日後にリセット" : "resets in 2d"],
                        [isJa ? "添付解析" : "Attachment analysis", "32%", isJa ? "12時間後にリセット" : "resets in 12h"],
                    ].map(([label, value, detail]) => (
                        <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span>{label}</span>
                                <span className="text-muted-foreground">{value} · {detail}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted">
                                <div className="h-full rounded-full bg-primary" style={{ width: value }} />
                            </div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function WorkspaceContextControls({ isJa }: { isJa: boolean }) {
    const [environment, setEnvironment] = React.useState(isJa ? "ローカル" : "Local");
    const [workspace, setWorkspace] = React.useState("product-dashboard");
    const [branch, setBranch] = React.useState("feature/insights-panel");
    const [worktree, setWorktree] = React.useState(true);
    const [note, setNote] = React.useState(isJa ? "作業状態を選択できます。" : "Workspace context is selectable.");
    const workspaces = ["product-dashboard", "customer-portal", "design-system"];
    const branches = ["feature/insights-panel", "main", "release/2026-06"];

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <button type="button" className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <DeviceLaptop className="h-4 w-4" />
                            {environment}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-72">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground">{isJa ? "実行環境" : "Runtime"}</p>
                            {[isJa ? "ローカル" : "Local", isJa ? "リモート" : "Remote"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setEnvironment(item);
                                        setNote(isJa ? `${item} で実行します。` : `Using ${item}.`);
                                    }}
                                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                                >
                                    {item}
                                    {environment === item ? <Check className="h-4 w-4" /> : null}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <button type="button" className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <Folder className="h-4 w-4" />
                            {workspace}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">{isJa ? "作業フォルダ" : "Workspace"}</p>
                            {workspaces.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setWorkspace(item);
                                        setNote(isJa ? `${item} を開きました。` : `Opened ${item}.`);
                                    }}
                                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                                >
                                    {item}
                                    {workspace === item ? <Check className="h-4 w-4" /> : null}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setNote(isJa ? "フォルダ選択ダイアログを開きます。" : "Open folder picker.")}
                                className="w-full rounded-md border px-2 py-1.5 text-left text-sm hover:bg-muted"
                            >
                                {isJa ? "フォルダを開く..." : "Open folder..."}
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <button type="button" className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <GitBranch className="h-4 w-4" />
                            {branch}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">{isJa ? "ブランチ" : "Branch"}</p>
                            {branches.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setBranch(item);
                                        setNote(isJa ? `${item} に切り替えました。` : `Switched to ${item}.`);
                                    }}
                                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                                >
                                    <span className="truncate">{item}</span>
                                    {branch === item ? <Check className="h-4 w-4 shrink-0" /> : null}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <button
                    type="button"
                    onClick={() => {
                        setWorktree((current) => !current);
                        setNote(worktree ? (isJa ? "ワークツリーを外しました。" : "Worktree disabled.") : (isJa ? "ワークツリーを有効にしました。" : "Worktree enabled."));
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-sm shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-pressed={worktree}
                >
                    <Check className={`h-4 w-4 ${worktree ? "text-primary" : "text-muted-foreground"}`} />
                    {isJa ? "ワークツリー" : "Worktree"}
                </button>
            </div>
            <div className="rounded-xl border border-primary-border bg-primary-subtle px-3 py-2 text-sm text-primary-subtle-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                        <GitPullRequest className="h-4 w-4" />
                        #24
                    </span>
                    <span>{branch}</span>
                    <span className="ml-auto text-xs">{note}</span>
                </div>
            </div>
        </>
    );
}

function InputMascot() {
    return (
        <div className="relative h-12 w-12">
            <div className="absolute left-1/2 top-0 h-3 w-1 -translate-x-1/2 rounded-full bg-primary" />
            <div className="absolute inset-x-1 bottom-0 flex h-10 items-center justify-center rounded-[1.1rem] border border-primary-border bg-background text-primary shadow-sm">
                <span className="absolute -left-1 top-4 h-3 w-2 rounded-l-md bg-primary-subtle" />
                <span className="absolute -right-1 top-4 h-3 w-2 rounded-r-md bg-primary-subtle" />
                <span className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="absolute bottom-2 h-1 w-4 rounded-full border-b border-primary-border" />
            </div>
            <span className="absolute right-0 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
    );
}

function ChoiceComposerDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [selected, setSelected] = React.useState("hybrid");
    const choices = [
        { id: "hybrid", label: isJa ? "用途とタイプのハイブリッド" : "Hybrid by purpose and type" },
        { id: "file", label: isJa ? "ファイルタイプで分ける" : "Group by file type" },
        { id: "date", label: isJa ? "日付で分ける" : "Group by date" },
        { id: "proposal", label: isJa ? "まず提案だけ見たい" : "Show suggestions first" },
    ];

    return (
        <ChatComposer
            className="max-w-3xl"
            prompt={
                <div className="rounded-2xl border bg-background p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">
                            {isJa ? "どの整理方針で進めますか？" : "How should this be organized?"}
                        </p>
                        <Button variant="ghost" size="sm">
                            {isJa ? "スキップ" : "Skip"}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {choices.map((choice, index) => (
                            <button
                                key={choice.id}
                                type="button"
                                onClick={() => setSelected(choice.id)}
                                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${selected === choice.id ? "border-primary-border bg-primary-subtle text-foreground" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"}`}
                            >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background font-semibold">
                                    {selected === choice.id ? <Check className="h-4 w-4" /> : index + 1}
                                </span>
                                <span>{choice.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            }
            inputProps={{
                onSend: () => undefined,
                placeholder: isJa ? "または直接返信..." : "Or reply directly...",
                modelOptions: ComposerModelOptions(isJa),
                labels: ComposerLabels(isJa),
            }}
        />
    );
}

function WorkspaceComposerDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <ChatComposer
            className="max-w-3xl"
            context={<WorkspaceContextControls isJa={isJa} />}
            inputProps={{
                onSend: () => undefined,
                placeholder: isJa ? "コマンドは / を入力" : "Type / for commands",
                optionsContent: <ComposerInputOptions isJa={isJa} />,
                modelOptions: ComposerModelOptions(isJa),
                toolbarAccessory: <UsageStatusButton isJa={isJa} />,
                labels: ComposerLabels(isJa),
            }}
        />
    );
}

function AccessoryComposerDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <ChatComposer
            className="max-w-2xl"
            accessory={<InputMascot />}
            inputProps={{
                onSend: () => undefined,
                placeholder: isJa ? "補助状態を見ながら入力..." : "Type with helper status...",
                optionsContent: <ComposerInputOptions isJa={isJa} />,
                modelOptions: ComposerModelOptions(isJa),
                labels: ComposerLabels(isJa),
            }}
            footer={
                <p className="text-xs text-muted-foreground">
                    {isJa ? "装飾や補助状態は accessory / footer slot に置きます。" : "Decoration and helper status belong in accessory or footer slots."}
                </p>
            }
        />
    );
}

const usageCode = `import * as React from "react";
import { ChatComposer } from "@gunjo/ui";

export function ComposerWithChoices() {
  const [selected, setSelected] = React.useState("hybrid");
  const choices = [
    { id: "hybrid", label: "用途とタイプのハイブリッド" },
    { id: "file", label: "ファイルタイプで分ける" },
    { id: "date", label: "日付で分ける" },
    { id: "proposal", label: "まず提案だけ見たい" },
  ];

  return (
    <ChatComposer
      prompt={
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">どの整理方針で進めますか？</p>
            <button type="button" className="rounded-md px-2 py-1 text-sm hover:bg-muted">
              スキップ
            </button>
          </div>
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => setSelected(choice.id)}
                className={\`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors \${selected === choice.id ? "border-primary-border bg-primary-subtle text-foreground" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"}\`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background font-semibold">
                  {selected === choice.id ? "✓" : index + 1}
                </span>
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
        </div>
      }
      inputProps={{
        onSend: (message, files) => console.log({ message, files }),
        placeholder: "または直接返信...",
        modelOptions: [
          { value: "auto", label: "自動", description: "内容に合わせて選択" },
          { value: "standard", label: "標準モデル", description: "通常の確認向け" },
          { value: "large", label: "大容量モデル", description: "長い文脈向け" },
          { value: "fast", label: "高速モデル", description: "短い確認向け" },
        ],
      }}
    />
  );
}`;

const workspaceCode = `import * as React from "react";
import { ChatComposer, Popover, PopoverContent, PopoverTrigger, Switch } from "@gunjo/ui";

export function WorkspaceComposer() {
  const [branch, setBranch] = React.useState("feature/insights-panel");
  const [webSearch, setWebSearch] = React.useState(true);

  return (
    <ChatComposer
      context={
        <>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-md border bg-background px-2.5 py-1.5 text-sm">
              ローカル
            </button>
            <button type="button" className="rounded-md border bg-background px-2.5 py-1.5 text-sm">
              product-dashboard
            </button>
            <button
              type="button"
              onClick={() => setBranch(branch === "main" ? "feature/insights-panel" : "main")}
              className="rounded-md border bg-background px-2.5 py-1.5 text-sm"
            >
              {branch}
            </button>
            <button type="button" className="rounded-md border bg-background px-2.5 py-1.5 text-sm">
              ワークツリー
            </button>
          </div>
          <div className="rounded-xl border border-primary-border bg-primary-subtle px-3 py-2 text-sm text-primary-subtle-foreground">
            #24 {branch}
          </div>
        </>
      }
      inputProps={{
        onSend: () => undefined,
        placeholder: "コマンドは / を入力",
        optionsContent: (
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            Web を参照
            <Switch checked={webSearch} onCheckedChange={setWebSearch} />
          </label>
        ),
        modelOptions: [
          { value: "auto", label: "自動" },
          { value: "standard", label: "標準モデル" },
        ],
        toolbarAccessory: (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md" aria-label="使用量の詳細を表示">
                <span className="sr-only">使用量 14%</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="top">
              <p className="text-sm font-semibold">プランの使用状況</p>
              <p className="text-sm text-muted-foreground">月次メッセージ 14% ・ 2日後にリセット</p>
            </PopoverContent>
          </Popover>
        ),
      }}
    />
  );
}`;

const accessoryCode = `import * as React from "react";
import { ChatComposer, Switch } from "@gunjo/ui";

export function AccessoryComposer() {
  const [webSearch, setWebSearch] = React.useState(true);

  return (
    <ChatComposer
      accessory={
        <div className="relative h-12 w-12">
          <div className="absolute inset-x-1 bottom-0 flex h-10 items-center justify-center rounded-2xl border bg-background shadow-sm">
            <span className="flex items-center gap-1.5" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          </div>
        </div>
      }
      footer={
        <p className="text-xs text-muted-foreground">
          装飾や補助状態は accessory / footer slot に置きます。
        </p>
      }
      inputProps={{
        onSend: () => undefined,
        placeholder: "補助状態を見ながら入力...",
        optionsContent: (
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            Web を参照
            <Switch checked={webSearch} onCheckedChange={setWebSearch} />
          </label>
        ),
        modelOptions: [
          { value: "auto", label: "自動" },
          { value: "standard", label: "標準モデル" },
        ],
      }}
    />
  );
}`;

export default function ChatComposerDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/chat-composer", locale);
    const title = content?.title ?? inputsMetadata.chatComposer.title;
    const description = content?.description ?? inputsMetadata.chatComposer.description;

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ChatComposer", href: "/docs/components/chat-composer" },
                { name: "ChatInput", href: "/docs/components/chat-input" },
            ]}
            relatedComponents={[
                { name: "ChatPanel", href: "/docs/components/chat-panel" },
                { name: "ChatMessage", href: "/docs/components/chat-message" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/chat-composer"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="lg"
                previewHeight="auto"
            >
                <ChoiceComposerDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "choices",
                            title: isJa ? "選択肢付き" : "With choices",
                            description: isJa ? "AI やシステムからの選択肢を、入力欄の直前に配置します。" : "Place assistant or system choices directly above the input.",
                            preview: <ChoiceComposerDemo />,
                            code: usageCode,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                        },
                        {
                            key: "workspace",
                            title: isJa ? "作業状態付き" : "With workspace status",
                            description: isJa ? "ブランチ、作業フォルダ、使用量など入力に関係する補助情報を、操作できる状態としてまとめます。" : "Group branch, folder, usage, and other input-related context as interactive controls.",
                            preview: <WorkspaceComposerDemo />,
                            code: workspaceCode,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                        },
                        {
                            key: "accessory",
                            title: isJa ? "アクセサリ付き" : "With accessory",
                            description: isJa ? "入力欄の周辺に装飾や補助状態を重ねます。入力本体の責務には含めません。" : "Overlay decoration or helper status around the input without making it ChatInput's responsibility.",
                            preview: <AccessoryComposerDemo />,
                            code: accessoryCode,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "inputProps", type: "ChatInputProps", description: isJa ? "内側の ChatInput に渡す props です。" : "Props passed to the inner ChatInput." },
                        { name: "context", type: "React.ReactNode", description: isJa ? "作業フォルダ、ブランチ、PR 状態などの入力コンテキストです。" : "Input context such as workspace, branch, or PR state." },
                        { name: "prompt", type: "React.ReactNode", description: isJa ? "AI からの選択肢や、送信前に確認する質問です。" : "Choices or questions shown before the user replies." },
                        { name: "status", type: "React.ReactNode", description: isJa ? "リアルタイム補足状態などを入力欄の上に置くための領域です。" : "Area for realtime status above the input." },
                        { name: "footer", type: "React.ReactNode", description: isJa ? "使用量など、入力欄の下に置く補足表示です。" : "Supplemental content such as usage rendered below the input." },
                        { name: "accessory", type: "React.ReactNode", description: isJa ? "入力欄の周辺に重ねる補助 UI です。" : "Accessory UI layered near the input." },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
