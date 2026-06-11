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
    IconSparkles as Sparkles,
} from "@tabler/icons-react";
import {
    ChatComposer,
    ChatInput,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";

function ChatInputExample({ processing = false, disabled = false }: { processing?: boolean; disabled?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [isProcessing, setIsProcessing] = React.useState(processing);
    const [model, setModel] = React.useState("auto");

    const modelOptions = React.useMemo(
        () => [
            { value: "auto", label: isJa ? "自動" : "Auto", description: isJa ? "内容に合わせて選択" : "Choose for the task" },
            { value: "fast", label: isJa ? "高速" : "Fast", description: isJa ? "短い返答を優先" : "Prioritize short replies" },
            { value: "deep", label: isJa ? "推論" : "Reasoning", description: isJa ? "複雑な確認向け" : "For complex review" },
        ],
        [isJa]
    );

    React.useEffect(() => {
        setIsProcessing(processing);
    }, [processing]);

    return (
        <div className="w-full max-w-2xl">
            <ChatInput
                onSend={() => {
                    setIsProcessing(true);
                    window.setTimeout(() => setIsProcessing(false), 900);
                }}
                onStop={() => setIsProcessing(false)}
                isProcessing={isProcessing}
                disabled={disabled}
                placeholder={isJa ? "確認したい内容を入力..." : "Type what you want to review..."}
                optionsContent={<DemoInputOptions isJa={isJa} />}
                modelOptions={modelOptions}
                modelValue={model}
                onModelValueChange={setModel}
                labels={{
                    attach: isJa ? "ファイルを添付" : "Attach file",
                    options: isJa ? "入力オプション" : "Input options",
                    model: isJa ? "モデルを選択" : "Choose model",
                    voice: isJa ? "音声入力" : "Voice input",
                    voiceActive: isJa ? "録音を停止" : "Stop recording",
                    send: isJa ? "送信" : "Send",
                    stop: isJa ? "停止" : "Stop",
                    removeAttachment: isJa ? "添付を削除" : "Remove attachment",
                    emptyMessage: isJa ? "メッセージを入力すると送信できます。" : "Type a message before sending.",
                    disabled: isJa ? "権限がないため送信できません。" : "You do not have permission to send.",
                }}
            />
        </div>
    );
}

function ChatInputModelOptions(isJa: boolean) {
    return [
        { value: "auto", label: isJa ? "自動" : "Auto", description: isJa ? "内容に合わせて選択" : "Choose for the task" },
        { value: "fast", label: isJa ? "高速" : "Fast", description: isJa ? "短い返答を優先" : "Prioritize short replies" },
        { value: "deep", label: isJa ? "推論" : "Reasoning", description: isJa ? "複雑な確認向け" : "For complex review" },
    ];
}

function chatInputLabels(isJa: boolean) {
    return {
        attach: isJa ? "ファイルを添付" : "Attach file",
        options: isJa ? "入力オプション" : "Input options",
        model: isJa ? "モデルを選択" : "Choose model",
        voice: isJa ? "音声入力" : "Voice input",
        voiceActive: isJa ? "録音を停止" : "Stop recording",
        send: isJa ? "送信" : "Send",
        stop: isJa ? "停止" : "Stop",
        removeAttachment: isJa ? "添付を削除" : "Remove attachment",
        emptyMessage: isJa ? "メッセージを入力すると送信できます。" : "Type a message before sending.",
    };
}

function DemoInputOptions({ isJa }: { isJa: boolean }) {
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
                <span>
                    <span className="block font-medium">{isJa ? "Web を参照" : "Use web context"}</span>
                    <span className="block text-xs text-muted-foreground">
                        {isJa ? "公開情報も含めて確認します。" : "Include public information."}
                    </span>
                </span>
                <Switch checked={webSearch} onCheckedChange={setWebSearch} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                <span>
                    <span className="block font-medium">{isJa ? "画像を参照" : "Use image context"}</span>
                    <span className="block text-xs text-muted-foreground">
                        {isJa ? "添付画像を回答に使います。" : "Use attached images in the reply."}
                    </span>
                </span>
                <Switch checked={imageContext} onCheckedChange={setImageContext} />
            </label>
        </div>
    );
}

function UsageStatusButton({ isJa }: { isJa: boolean }) {
    const usageRows = [
        [isJa ? "月次メッセージ" : "Monthly messages", "14%", isJa ? "2日後にリセット" : "resets in 2d"],
        [isJa ? "添付解析" : "Attachment analysis", "32%", isJa ? "12時間後にリセット" : "resets in 12h"],
        [isJa ? "高速応答" : "Fast replies", "0%", isJa ? "未使用" : "unused"],
    ];

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
                    {usageRows.map(([label, value, detail]) => (
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

function ChoicePromptExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [selected, setSelected] = React.useState("hybrid");
    const choices = [
        { id: "hybrid", label: isJa ? "用途とタイプのハイブリッド" : "Hybrid by purpose and type" },
        { id: "file", label: isJa ? "ファイルタイプで分ける" : "Group by file type" },
        { id: "date", label: isJa ? "日付で分ける" : "Group by date" },
        { id: "proposal", label: isJa ? "まず提案だけ見たい" : "Show suggestions first" },
    ];

    const prompt = (
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">
                    {isJa ? "どの整理方針で進めますか？" : "How should this be organized?"}
                </p>
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
                        <span className="min-w-0 flex-1">{choice.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <ChatComposer
            className="max-w-3xl"
            prompt={prompt}
            inputProps={{
                onSend: () => undefined,
                placeholder: isJa ? "または直接返信..." : "Or reply directly...",
                modelOptions: ChatInputModelOptions(isJa),
                labels: chatInputLabels(isJa),
            }}
        />
    );
}

function WorkspaceContextExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <ChatComposer
            className="max-w-3xl"
            context={<WorkspaceContextControls isJa={isJa} />}
            inputProps={{
                onSend: () => undefined,
                placeholder: isJa ? "コマンドは / を入力" : "Type / for commands",
                modelOptions: ChatInputModelOptions(isJa),
                labels: chatInputLabels(isJa),
            }}
        />
    );
}

function TokenStatusExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [model, setModel] = React.useState("standard");
    const modelOptions = [
        { value: "standard", label: isJa ? "標準モデル" : "Standard model", description: isJa ? "通常の確認向け" : "General review" },
        { value: "large", label: isJa ? "大容量モデル" : "Large-context model", description: isJa ? "長い文脈向け" : "Long-context work" },
        { value: "quick", label: isJa ? "高速モデル" : "Quick model", description: isJa ? "短い確認向け" : "Fast review" },
    ];

    return (
        <ChatComposer
            className="max-w-3xl"
            inputProps={{
                onSend: () => undefined,
                placeholder: isJa ? "制限を考慮して依頼..." : "Ask with usage in mind...",
                optionsContent: <DemoInputOptions isJa={isJa} />,
                modelOptions,
                modelValue: model,
                onModelValueChange: setModel,
                toolbarAccessory: <UsageStatusButton isJa={isJa} />,
                labels: chatInputLabels(isJa),
            }}
        />
    );
}

function InputPetExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="w-full max-w-2xl">
            <ChatComposer
                accessory={<InputMascot />}
                inputProps={{
                    onSend: () => undefined,
                    placeholder: isJa ? "補助キャラクターが入力状態を見守ります..." : "A helper mascot watches composer status...",
                    optionsContent: <DemoInputOptions isJa={isJa} />,
                    modelOptions: ChatInputModelOptions(isJa),
                    labels: chatInputLabels(isJa),
                }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
                {isJa ? "補助キャラクターは装飾・状態通知なので、ChatComposer の accessory として配置します。" : "The helper mascot is decoration/status, so place it in ChatComposer's accessory slot."}
            </p>
        </div>
    );
}

const usageCode = `import * as React from "react";
import { ChatInput, Switch } from "@gunjo/ui";

export function SupportComposer() {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [model, setModel] = React.useState("auto");
  const [webSearch, setWebSearch] = React.useState(true);
  const [imageContext, setImageContext] = React.useState(false);

  const modelOptions = [
    { value: "auto", label: "自動", description: "内容に合わせて選択" },
    { value: "fast", label: "高速", description: "短い返答を優先" },
    { value: "deep", label: "推論", description: "複雑な確認向け" },
  ];

  return (
    <ChatInput
      onSend={(message, files) => {
        setIsProcessing(true);
        console.log({ message, files });
      }}
      onStop={() => setIsProcessing(false)}
      isProcessing={isProcessing}
      placeholder="確認したい内容を入力..."
      optionsContent={
        <div className="space-y-3">
          <p className="text-sm font-semibold">入力オプション</p>
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            <span>Web を参照</span>
            <Switch checked={webSearch} onCheckedChange={setWebSearch} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            <span>画像を参照</span>
            <Switch checked={imageContext} onCheckedChange={setImageContext} />
          </label>
        </div>
      }
      modelOptions={modelOptions}
      modelValue={model}
      onModelValueChange={setModel}
      labels={{
        attach: "ファイルを添付",
        options: "入力オプション",
        model: "モデルを選択",
        voice: "音声入力",
        voiceActive: "録音を停止",
        send: "送信",
        stop: "停止",
        removeAttachment: "添付を削除",
        emptyMessage: "メッセージを入力すると送信できます。",
      }}
    />
  );
}`;

const choicePromptCode = `import * as React from "react";
import { ChatComposer } from "@gunjo/ui";

export function ChoicePromptComposer() {
  const [selected, setSelected] = React.useState("hybrid");
  const choices = [
    { id: "hybrid", label: "用途とタイプのハイブリッド" },
    { id: "file", label: "ファイルタイプで分ける" },
    { id: "date", label: "日付で分ける" },
  ];

  return (
    <ChatComposer
      prompt={
        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-3 text-sm font-semibold">どの整理方針で進めますか？</p>
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => setSelected(choice.id)}
              className="flex w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
            >
              {choice.label}
            </button>
          ))}
        </div>
      }
      inputProps={{
        onSend: () => undefined,
        placeholder: "または直接返信...",
      }}
    />
  );
}`;

const workspaceContextCode = `import * as React from "react";
import { ChatComposer } from "@gunjo/ui";

export function WorkspaceComposer() {
  const [branch, setBranch] = React.useState("feature/insights-panel");

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
          </div>
          <div className="rounded-xl border border-primary-border bg-primary-subtle px-3 py-2 text-sm text-primary-subtle-foreground">
            #24 {branch}
          </div>
        </>
      }
      inputProps={{
        onSend: () => undefined,
        placeholder: "コマンドは / を入力",
      }}
    />
  );
}`;

const tokenStatusCode = `import * as React from "react";
import { ChatComposer, Popover, PopoverContent, PopoverTrigger, Switch } from "@gunjo/ui";

export function TokenStatusComposer() {
  const [model, setModel] = React.useState("standard");
  const [webSearch, setWebSearch] = React.useState(true);

  return (
    <ChatComposer
      inputProps={{
        onSend: () => undefined,
        placeholder: "制限を考慮して依頼...",
        optionsContent: (
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            <span>Web を参照</span>
            <Switch checked={webSearch} onCheckedChange={setWebSearch} />
          </label>
        ),
        modelOptions: [
          { value: "standard", label: "標準モデル", description: "通常の確認向け" },
          { value: "large", label: "大容量モデル", description: "長い文脈向け" },
        ],
        modelValue: model,
        onModelValueChange: setModel,
        toolbarAccessory: (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md" aria-label="使用量の詳細を表示">
                <span className="sr-only">使用量 14%</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="top">
              <p className="text-sm font-semibold">プランの使用状況</p>
              <p className="text-sm text-muted-foreground">月次メッセージ 14% · 2日後にリセット</p>
            </PopoverContent>
          </Popover>
        ),
      }}
    />
  );
}`;

const inputPetCode = `import * as React from "react";
import { ChatComposer, Switch } from "@gunjo/ui";

export function InputPetComposer() {
  const [webSearch, setWebSearch] = React.useState(true);

  return (
    <ChatComposer
      accessory={
        <div className="rounded-2xl border bg-background px-3 py-2 shadow-sm">
          <span aria-hidden>● ●</span>
        </div>
      }
      inputProps={{
        onSend: () => undefined,
        placeholder: "補助キャラクターが入力状態を見守ります...",
        optionsContent: (
          <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            <span>Web を参照</span>
            <Switch checked={webSearch} onCheckedChange={setWebSearch} />
          </label>
        ),
      }}
    />
  );
}`;

export default function ChatInputDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/chat-input", locale);
    const title = content?.title ?? inputsMetadata.chatInput.title;
    const description = content?.description ?? inputsMetadata.chatInput.description;

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ChatInput", href: "/docs/components/chat-input" },
                { name: "Textarea", href: "/docs/components/textarea" },
                { name: "Button", href: "/docs/components/button" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "VoiceInputButton", href: "/docs/components/chat-input" },
            ]}
            relatedComponents={[
                { name: "ChatComposer", href: "/docs/components/chat-composer" },
                { name: "ChatMessage", href: "/docs/components/chat-message" },
                { name: "ChatPanel", href: "/docs/components/chat-panel" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/chat-input"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="lg"
                previewHeight={340}
            >
                <ChatInputExample />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: isJa ? "標準表示" : "Default",
                            description: isJa ? "1つの入力エリア内に、添付プレビュー、枠なしの複数行入力、下段ツールバーをまとめます。" : "Combines attachment previews, a borderless multiline textarea, and a bottom toolbar in one composer surface.",
                            preview: <ChatInputExample />,
                            code: usageCode,
                            previewBodyWidth: "lg",
                            previewHeight: 340,
                        },
                        {
                            key: "processing",
                            title: isJa ? "処理中" : "Processing",
                            description: isJa ? "送信中は停止ボタンに切り替え、入力を一時停止します。" : "Swaps the send button for a stop action while a response is in progress.",
                            preview: <ChatInputExample processing />,
                            code: usageCode.replace("isProcessing={isProcessing}", "isProcessing={true}"),
                            previewBodyWidth: "lg",
                            previewHeight: 340,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "無効化理由" : "Disabled reason",
                            description: isJa ? "送信できない理由はボタンのツールチップで伝えます。" : "Explains why sending is unavailable from the visible control.",
                            preview: <ChatInputExample disabled />,
                            code: usageCode.replace("placeholder=\"確認したい内容を入力...\"", "disabled\\n      placeholder=\"確認したい内容を入力...\""),
                            previewBodyWidth: "lg",
                            previewHeight: 340,
                        },
                        {
                            key: "assistant-choices",
                            title: isJa ? "AI からの選択肢" : "Assistant choices",
                            description: isJa ? "AI から提示された選択肢は ChatInput ではなく、ChatComposer の prompt として扱います。" : "Assistant-provided choices belong in ChatComposer's prompt slot rather than ChatInput itself.",
                            preview: <ChoicePromptExample />,
                            code: choicePromptCode,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                        },
                        {
                            key: "workspace-context",
                            title: isJa ? "作業コンテキスト付き" : "Workspace context",
                            description: isJa ? "現在のブランチ、作業フォルダ、ワークツリー状態などは ChatComposer の context としてまとめます。" : "Branch, folder, and worktree status are grouped in ChatComposer's context slot.",
                            preview: <WorkspaceContextExample />,
                            code: workspaceContextCode,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                        },
                        {
                            key: "token-status",
                            title: isJa ? "使用量とモデル状態" : "Usage and model status",
                            description: isJa ? "使用量は ChatComposer の footer で独立して表示し、モデル選択は ChatInput 側に残します。" : "Usage is rendered independently in ChatComposer's footer while model selection stays inside ChatInput.",
                            preview: <TokenStatusExample />,
                            code: tokenStatusCode,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                        },
                        {
                            key: "input-pet",
                            title: isJa ? "入力ペット付き" : "Input pet",
                            description: isJa ? "補助キャラクターは装飾・状態通知なので、ChatInput の外側に重ねて配置します。" : "A helper mascot is decorative/status UI composed outside ChatInput.",
                            preview: <InputPetExample />,
                            code: inputPetCode,
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
                        { name: "onSend", type: "(message: string, files?: File[]) => void", description: isJa ? "送信時に呼び出されるコールバックです。" : "Callback fired when a message is sent." },
                        { name: "onStop", type: "() => void", description: isJa ? "処理中の停止操作で呼び出します。" : "Called from the stop action while processing." },
                        { name: "isProcessing", type: "boolean", default: "false", description: isJa ? "送信中・生成中の状態を表します。" : "Indicates a running send or generation process." },
                        { name: "enableAttachments", type: "boolean", default: "true", description: isJa ? "添付ボタンを表示するかを指定します。" : "Controls whether the attachment action is shown." },
                        { name: "modelLabel", type: "React.ReactNode", default: '"自動"', description: isJa ? "下段右側のモデル表示です。" : "Model label shown on the right side of the toolbar." },
                        { name: "optionsContent", type: "React.ReactNode", description: isJa ? "入力オプションボタンから開くポップオーバー内容です。" : "Popover content opened from the options action." },
                        { name: "modelOptions", type: "ChatInputModelOption[]", description: isJa ? "モデルボタンから選択できる候補です。" : "Choices shown from the model action." },
                        { name: "toolbarAccessory", type: "React.ReactNode", description: isJa ? "モデル選択の右横に置く補助操作です。使用量など、モデルとは別の状態をアイコンで表示できます。" : "Accessory rendered next to the model selector for separate status actions such as usage." },
                        { name: "voiceActive", type: "boolean", default: "false", description: isJa ? "音声認識の録音中状態を外部から制御する場合に指定します。" : "Controls the speech recognition listening state from outside." },
                        { name: "showOptionsButton / showModelSelector / showVoiceButton", type: "boolean", default: "true", description: isJa ? "下段ツールバーの補助操作を表示するかを指定します。入力オプションは optionsContent または onOptionsClick がある場合だけ表示されます。" : "Controls optional toolbar actions. The options action is shown only when optionsContent or onOptionsClick is provided." },
                        { name: "labels", type: "ChatInputLabels", description: isJa ? "ツールチップと無効化理由の文言を指定します。" : "Labels for tooltips and disabled reasons." },
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
