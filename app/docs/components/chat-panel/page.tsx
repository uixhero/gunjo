"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { ChatPanelAuditDemo } from "@/components/demos/OverlayComponentDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import overlayMetadata from "@design/overlay-metadata.json";
import { ChatPanel, EmptyState, ToastProvider, useToast, type ChatMessageActionKey, type ChatPanelMessage } from "@gunjo/ui";
import { IconChecklist, IconFileText, IconSparkles, IconWand } from "@tabler/icons-react";

const usageCode = `import * as React from "react";
import { ChatPanel, ToastProvider, useToast, type ChatPanelMessage } from "@gunjo/ui";

const actionMessages = {
  copy: "メッセージをコピーしました。",
  branch: "この回答から分岐します。",
  raw: "Raw 表示を開きます。",
  edit: "メッセージを編集します。",
};

function SupportChatPanelBody() {
  const [messages, setMessages] = React.useState<ChatPanelMessage[]>([
    { id: "system", role: "system", content: "会話を開始しました。" },
    {
      id: "assistant",
      role: "assistant",
      userName: "サポート",
      content: "確認したい内容を送ってください。",
      timestamp: "10:01",
    },
  ]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { showToast } = useToast();

  return (
    <ChatPanel
      title="サポートチャット"
      description="会話履歴と入力欄を同じパネルで扱います。"
      messages={messages}
      onSend={(message) => {
        setMessages((current) => [
          ...current,
          { id: \`user-\${Date.now()}\`, role: "user", userName: "あなた", content: message, timestamp: "10:02" },
        ]);
        setIsProcessing(true);
      }}
      onStop={() => setIsProcessing(false)}
      onMessageAction={(_, action) => {
        showToast(actionMessages[action] ?? "操作を実行しました。", "success", 1800);
      }}
      isProcessing={isProcessing}
      placeholder="確認したい内容を入力..."
    />
  );
}

export function SupportChatPanel() {
  return (
    <ToastProvider labels={{ close: "閉じる" }}>
      <SupportChatPanelBody />
    </ToastProvider>
  );
}`;

const emptyCode = `import { ChatPanel, EmptyState } from "@gunjo/ui";

export function EmptySupportChatPanel() {
  return (
    <ChatPanel
      title="サポートチャット"
      description="会話開始前も入力欄は使えます。"
      messages={[]}
      onSend={(message) => console.log(message)}
      placeholder="確認したい内容を入力..."
      emptyState={
        <EmptyState
          title="まだメッセージはありません。"
          description="質問や確認したい内容を入力すると会話を開始できます。"
        />
      }
    />
  );
}`;

const welcomeCode = `import * as React from "react";
import { ChatPanel, type ChatPanelMessage } from "@gunjo/ui";
import { IconChecklist, IconFileText, IconSparkles, IconWand } from "@tabler/icons-react";

const suggestions = [
  { icon: IconWand, label: "ドキュメントを整える" },
  { icon: IconFileText, label: "PDF や画像を分析する" },
  { icon: IconChecklist, label: "タスク一覧を作成する" },
];

export function WelcomeChatPanel() {
  const [messages, setMessages] = React.useState<ChatPanelMessage[]>([]);

  const startConversation = (label: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages([
      {
        id: "user-start",
        role: "user",
        userName: "あなた",
        content: label,
        timestamp,
      },
      {
        id: "assistant-start",
        role: "assistant",
        userName: "アシスタント",
        content: \`「\${label}」から始めます。必要な素材や条件を入力してください。\`,
        timestamp,
      },
    ]);
  };

  return (
    <ChatPanel
      title="新しいチャット"
      messages={messages}
      onSend={startConversation}
      placeholder="何でも聞いてください..."
      welcome={
        <div className="w-full max-w-md space-y-5 px-2 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-sm">
            <IconSparkles className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">どの作業から始めますか？</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              文章作成、整理、分析などをこのチャットから始められます。
            </p>
          </div>
          <div className="space-y-2">
            {suggestions.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                onClick={() => startConversation(label)}
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
}`;

interface ChatPanelWelcomeProps {
    onSelect?: (label: string) => void;
}

function ChatPanelWelcome({ onSelect }: ChatPanelWelcomeProps) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const suggestions = [
        { icon: IconWand, label: isJa ? "ドキュメントを整える" : "Polish documentation" },
        { icon: IconFileText, label: isJa ? "PDF や画像を分析する" : "Analyze PDFs or images" },
        { icon: IconChecklist, label: isJa ? "タスク一覧を作成する" : "Create a task list" },
    ];

    return (
        <div className="w-full max-w-md space-y-5 px-2 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-sm">
                <IconSparkles className="h-6 w-6" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                    {isJa ? "どの作業から始めますか？" : "What would you like to start with?"}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                    {isJa
                        ? "文章作成、整理、分析などをこのチャットから始められます。"
                        : "Start writing, organizing, or analyzing work from this chat."}
                </p>
            </div>
            <div className="space-y-2">
                {suggestions.map(({ icon: Icon, label }) => (
                    <button
                        key={label}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                        onClick={() => onSelect?.(label)}
                    >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function WelcomeChatPanelPreview() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [messages, setMessages] = React.useState<ChatPanelMessage[]>([]);

    const startConversation = (label: string) => {
        const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        setMessages([
            {
                id: "user-start",
                role: "user",
                userName: isJa ? "あなた" : "You",
                content: label,
                timestamp,
            },
            {
                id: "assistant-start",
                role: "assistant",
                userName: isJa ? "アシスタント" : "Assistant",
                content: isJa
                    ? `「${label}」から始めます。必要な素材や条件を入力してください。`
                    : `Starting with "${label}". Add the source material or requirements.`,
                timestamp,
            },
        ]);
    };

    return (
        <ChatPanelWithActionToast
            title={isJa ? "新しいチャット" : "New chat"}
            messages={messages}
            onSend={(message) => startConversation(message)}
            placeholder={isJa ? "何でも聞いてください..." : "Ask anything..."}
            welcome={<ChatPanelWelcome onSelect={startConversation} />}
        />
    );
}

function PreviewToastScope({ children }: { children: React.ReactNode }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    return (
        <div ref={setPortalContainer} className="relative w-full">
            <ToastProvider
                labels={{ close: isJa ? "閉じる" : "Close" }}
                placement="container"
                portalContainer={portalContainer}
            >
                {children}
            </ToastProvider>
        </div>
    );
}

const buildMessageActionToast = (isJa: boolean, action: ChatMessageActionKey) => {
    const messages: Record<string, string> = isJa
        ? {
            copy: "メッセージをコピーしました。",
            branch: "この回答から分岐します。",
            raw: "Raw 表示を開きます。",
            edit: "メッセージを編集します。",
        }
        : {
            copy: "Copied the message.",
            branch: "Branching from this response.",
            raw: "Opening Raw view.",
            edit: "Editing this message.",
        };

    return messages[action] ?? (isJa ? "操作を実行しました。" : "Action triggered.");
};

function ChatPanelWithActionToast(props: React.ComponentProps<typeof ChatPanel>) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const { showToast } = useToast();

    return (
        <ChatPanel
            {...props}
            onMessageAction={(message, action, event) => {
                props.onMessageAction?.(message, action, event);
                if (!event.defaultPrevented) {
                    showToast(buildMessageActionToast(isJa, action), "success", 1800);
                }
            }}
        />
    );
}

export default function ChatPanelDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/chat-panel", locale);
    const title = content?.title ?? overlayMetadata.chatPanel.title;
    const description = content?.description ?? overlayMetadata.chatPanel.description;

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ChatPanel", href: "/docs/components/chat-panel" },
                { name: "ChatMessage", href: "/docs/components/chat-message" },
                { name: "ChatInput", href: "/docs/components/chat-input" },
                { name: "EmptyState", href: "/docs/components/empty-state" },
            ]}
            relatedComponents={[
                { name: "Drawer", href: "/docs/components/drawer" },
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "FloatingPanel", href: "/docs/components/floating-panel" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/chat-panel"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="md"
                previewHeight={760}
            >
                <ChatPanelAuditDemo toastPlacement="container" />
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
                            description: isJa ? "メッセージ履歴、処理中状態、入力欄を 1 つのパネルにまとめます。" : "Combines transcript, processing state, and composer in one panel.",
                            preview: <ChatPanelAuditDemo toastPlacement="container" />,
                            code: usageCode,
                            previewBodyWidth: "md",
                            previewHeight: 760,
                        },
                        {
                            key: "empty",
                            title: isJa ? "空状態" : "Empty",
                            description: isJa ? "会話開始前の簡素な空状態です。emptyState slot で差し替えられます。" : "A simple pre-conversation empty state. Replace it with the emptyState slot.",
                            preview: (
                                <PreviewToastScope>
                                    <ChatPanelWithActionToast
                                        title={isJa ? "サポートチャット" : "Support chat"}
                                        description={isJa ? "会話開始前も入力欄は使えます。" : "The composer remains available before the conversation starts."}
                                        messages={[]}
                                        onSend={() => undefined}
                                        placeholder={isJa ? "確認したい内容を入力..." : "Type what you want to review..."}
                                        emptyState={
                                            <EmptyState
                                                title={isJa ? "まだメッセージはありません。" : "No messages yet."}
                                                description={isJa ? "質問や確認したい内容を入力すると会話を開始できます。" : "Type a question or review request to start."}
                                            />
                                        }
                                    />
                                </PreviewToastScope>
                            ),
                            code: emptyCode,
                            previewBodyWidth: "md",
                            previewHeight: 760,
                        },
                        {
                            key: "welcome",
                            title: isJa ? "初期画面" : "Welcome",
                            description: isJa ? "welcome slot は、初回起動時の案内や開始候補を表示するための領域です。" : "The welcome slot is for first-run guidance and starter suggestions.",
                            preview: (
                                <PreviewToastScope>
                                    <WelcomeChatPanelPreview />
                                </PreviewToastScope>
                            ),
                            code: welcomeCode,
                            previewBodyWidth: "md",
                            previewHeight: 800,
                        },
                        {
                            key: "compact",
                            title: isJa ? "コンパクト" : "Compact",
                            description: isJa ? "狭いパネルでは高さを下げ、同じ構成を保ちます。" : "Keeps the same composition in a shorter panel.",
                            preview: (
                                <PreviewToastScope>
                                    <ChatPanelWithActionToast
                                        className="h-[420px]"
                                        title={isJa ? "サポートチャット" : "Support chat"}
                                        messages={[
                                            { id: "assistant", role: "assistant", userName: isJa ? "サポート" : "Support", content: isJa ? "短い確認に使います。" : "Use this for a compact review.", timestamp: "10:01" },
                                        ]}
                                        onSend={() => undefined}
                                        placeholder={isJa ? "返信を入力..." : "Type a reply..."}
                                    />
                                </PreviewToastScope>
                            ),
                            code: usageCode.replace("description=\"会話履歴と入力欄を同じパネルで扱います。\"", "className=\"h-[420px]\""),
                            previewBodyWidth: "md",
                            previewHeight: 520,
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
                        { name: "messages", type: "ChatPanelMessage[]", description: isJa ? "表示する会話履歴です。" : "Conversation transcript to render." },
                        { name: "onSend", type: "(message: string, files?: File[]) => void", description: isJa ? "入力欄の送信時に呼び出します。" : "Called when the composer sends a message." },
                        { name: "isProcessing", type: "boolean", default: "false", description: isJa ? "応答生成中などの処理中状態です。" : "Processing state, such as while generating a response." },
                        { name: "emptyState", type: "ReactNode", description: isJa ? "メッセージが空で welcome がない場合に表示する空状態です。" : "Empty state shown when there are no messages and no welcome slot." },
                        { name: "welcome", type: "ReactNode", description: isJa ? "メッセージが空の場合に優先表示する初期画面です。" : "Welcome content shown first when there are no messages." },
                        { name: "onMessageAction", type: "(message, actionKey, event) => void", description: isJa ? "パネル内メッセージのコピー、分岐、Raw、編集などの操作を受け取ります。" : "Receives copy, branch, Raw, edit, or custom actions from messages inside the panel." },
                        { name: "onClose", type: "() => void", description: isJa ? "閉じるボタンを表示し、押下時に呼び出します。" : "Shows a close button and calls it when pressed." },
                        { name: "inputLabels", type: "ChatInputLabels", description: isJa ? "入力欄のラベルや無効化理由を指定します。" : "Composer labels and disabled reasons." },
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
