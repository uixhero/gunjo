"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { ChatMessage, ToastProvider, useToast, type ChatMessageActionKey } from "@gunjo/ui";

const usageCode = `import { ChatMessage, ToastProvider, useToast } from "@gunjo/ui";

const actionMessages = {
  copy: "メッセージをコピーしました。",
  branch: "この回答から分岐します。",
  raw: "Raw 表示を開きます。",
  edit: "メッセージを編集します。",
};

function ConversationPreviewBody() {
  const { showToast } = useToast();

  const handleMessageAction = (action) => {
    showToast(actionMessages[action] ?? "操作を実行しました。", "success", 1800);
  };

  return (
    <div className="w-full max-w-2xl rounded-lg border bg-background">
      <ChatMessage role="system" content="会話を開始しました。" />
      <ChatMessage
        role="assistant"
        userName="アシスタント"
        content="確認したい内容を送ってください。回答側はカードや進捗を内包しやすいように、本文の背景と枠線を持ちません。"
        copyValue="確認したい内容を送ってください。"
        timestamp="10:01"
        onAction={handleMessageAction}
      />
      <ChatMessage
        role="user"
        userName="あなた"
        content="状態とバリエーションを見直して。"
        timestamp="10:02"
        onAction={handleMessageAction}
      />
      <ChatMessage role="assistant" userName="アシスタント" content="" isTyping />
    </div>
  );
}

export function ConversationPreview() {
  return (
    <ToastProvider labels={{ close: "閉じる" }}>
      <ConversationPreviewBody />
    </ToastProvider>
  );
}`;

const buildActionMessage = (isJa: boolean, action: ChatMessageActionKey) => {
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

function ChatMessageSet() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const { showToast } = useToast();
    const handleAction = (action: ChatMessageActionKey) => {
        showToast(buildActionMessage(isJa, action), "success", 1800);
    };

    return (
        <div className="w-full max-w-2xl rounded-lg border bg-background shadow-sm">
            <ChatMessage role="system" content={isJa ? "会話を開始しました。" : "Conversation started."} />
            <ChatMessage
                role="assistant"
                userName={isJa ? "アシスタント" : "Assistant"}
                content={isJa ? "確認したい内容を送ってください。回答側はカードや進捗を内包しやすいように、本文の背景と枠線を持ちません。" : "Send what you want to review. Assistant messages keep the body unframed so cards or progress can be embedded."}
                copyValue={isJa ? "確認したい内容を送ってください。" : "Send what you want to review."}
                timestamp="10:01"
                onAction={handleAction}
            />
            <ChatMessage
                role="user"
                userName={isJa ? "あなた" : "You"}
                content={isJa ? "状態とバリエーションを見直して。" : "Review states and variants."}
                timestamp="10:02"
                onAction={handleAction}
            />
            <ChatMessage
                role="assistant"
                userName={isJa ? "アシスタント" : "Assistant"}
                content=""
                isTyping
                typingMessages={isJa ? ["内容を作成しています...", "入力中です..."] : ["Writing a response...", "Typing..."]}
            />
        </div>
    );
}

function ChatMessagePreviewWithToast(props: React.ComponentProps<typeof ChatMessage>) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const { showToast } = useToast();

    return (
        <ChatMessage
            {...props}
            onAction={(action, event) => {
                props.onAction?.(action, event);
                if (!event.defaultPrevented) {
                    showToast(buildActionMessage(isJa, action), "success", 1800);
                }
            }}
        />
    );
}

export default function ChatMessageDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/chat-message", locale);
    const title = content?.title ?? displayMetadata.chatMessage.title;
    const description = content?.description ?? displayMetadata.chatMessage.description;

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ChatMessage", href: "/docs/components/chat-message" },
                { name: "Avatar", href: "/docs/components/avatar" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
            relatedComponents={[
                { name: "ChatInput", href: "/docs/components/chat-input" },
                { name: "ChatPanel", href: "/docs/components/chat-panel" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/chat-message"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="lg"
                previewHeight={420}
            >
                <ToastProvider labels={{ close: isJa ? "閉じる" : "Close" }}>
                    <ChatMessageSet />
                </ToastProvider>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ToastProvider labels={{ close: isJa ? "閉じる" : "Close" }}>
                    <ComponentDemoStates
                        states={[
                        {
                            key: "assistant",
                            title: isJa ? "アシスタント" : "Assistant",
                            description: isJa ? "回答側は本文の枠を持たず、コピー・分岐・Raw の操作を下に並べます。" : "Assistant messages keep the body unframed and expose copy, branch, and Raw actions.",
                            preview: <ChatMessagePreviewWithToast role="assistant" userName={isJa ? "アシスタント" : "Assistant"} content={isJa ? "候補を3件見つけました。条件を変える場合は分岐できます。" : "Found three candidates. Branch if you want to change the conditions."} timestamp="10:01" />,
                            code: `<ChatMessage
  role="assistant"
  userName="アシスタント"
  content="候補を3件見つけました。条件を変える場合は分岐できます。"
  timestamp="10:01"
  onAction={(action) => console.log(action)}
/>`,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "user",
                            title: isJa ? "ユーザー" : "User",
                            description: isJa ? "送信者側は右寄せの背景付き吹き出しにし、コピーと編集を操作に出します。" : "User messages are right-aligned with a filled bubble and copy/edit actions.",
                            preview: <ChatMessagePreviewWithToast role="user" userName={isJa ? "あなた" : "You"} content={isJa ? "この内容で進めて。" : "Proceed with this."} timestamp="10:02" />,
                            code: `<ChatMessage
  role="user"
  userName="あなた"
  content="この内容で進めて。"
  timestamp="10:02"
  onAction={(action) => console.log(action)}
/>`,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "assistant-card",
                            title: isJa ? "カードを含む回答" : "Assistant with card",
                            description: isJa ? "通常の文章とカードを同じ回答内に置く場合も、外側のメッセージ枠は増やしません。" : "Plain text and cards can sit inside one assistant message without another outer bubble.",
                            preview: (
                                <ChatMessagePreviewWithToast
                                    role="assistant"
                                    userName={isJa ? "アシスタント" : "Assistant"}
                                    timestamp="10:03"
                                    content={
                                        <div className="space-y-3">
                                            <p>{isJa ? "確認結果をまとめました。必要であれば、この草案を保存してから編集できます。" : "I summarized the review. Save this draft before editing it if needed."}</p>
                                            <div className="rounded-xl border bg-muted/30 p-3 shadow-sm">
                                                <p className="text-sm font-semibold">{isJa ? "成果物ドラフト" : "Draft artifact"}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">drafts/component-audit.md</p>
                                            </div>
                                        </div>
                                    }
                                    copyValue={isJa ? "確認結果をまとめました。成果物ドラフト drafts/component-audit.md" : "I summarized the review. Draft artifact drafts/component-audit.md"}
                                />
                            ),
                            code: `<ChatMessage
  role="assistant"
  userName="アシスタント"
  timestamp="10:03"
  copyValue="確認結果をまとめました。成果物ドラフト drafts/component-audit.md"
  content={
    <div className="space-y-3">
      <p>確認結果をまとめました。必要であれば、この草案を保存してから編集できます。</p>
      <div className="rounded-xl border bg-muted/30 p-3 shadow-sm">
        <p className="text-sm font-semibold">成果物ドラフト</p>
        <p className="mt-1 text-xs text-muted-foreground">drafts/component-audit.md</p>
      </div>
    </div>
  }
/>`,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "system",
                            title: isJa ? "システム" : "System",
                            description: isJa ? "会話の開始や区切りを中央の補助ラベルで示します。" : "Marks session events with a centered helper label.",
                            preview: <ChatMessage role="system" content={isJa ? "会話を開始しました。" : "Conversation started."} />,
                            code: `<ChatMessage role="system" content="会話を開始しました。" />`,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "typing",
                            title: isJa ? "入力中" : "Typing",
                            description: isJa ? "回答を生成中の一時状態です。本文が空の場合は入力中ラベルを表示し、複数文言を渡すとタイプ/削除で切り替わります。" : "Temporary state while a response is being generated. When multiple labels are provided, the text types and deletes between them.",
                            preview: (
                                <ChatMessage
                                    role="assistant"
                                    userName={isJa ? "アシスタント" : "Assistant"}
                                    content=""
                                    isTyping
                                    typingMessages={isJa ? ["内容を作成しています...", "入力中です..."] : ["Writing a response...", "Typing..."]}
                                />
                            ),
                            code: `<ChatMessage
  role="assistant"
  userName="アシスタント"
  content=""
  isTyping
  typingMessages={["内容を作成しています...", "入力中です..."]}
/>`,
                            previewBodyWidth: "lg",
                        },
                    ]}
                    />
                </ToastProvider>
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "role", type: '"assistant" | "user" | "system"', description: isJa ? "メッセージの種類を指定します。" : "Controls the message role." },
                        { name: "content", type: "ReactNode", description: isJa ? "本文です。アシスタント側ではカードや進捗表示も渡せます。" : "Message body. Assistant messages can receive cards or progress content." },
                        { name: "copyValue", type: "string", description: isJa ? "本文が文字列ではない場合にコピーする値です。" : "Value copied when the body is not a plain string." },
                        { name: "userName", type: "string", description: isJa ? "表示名です。" : "Display name." },
                        { name: "timestamp", type: "string", description: isJa ? "時刻や補足メタ情報です。" : "Time or supporting metadata." },
                        { name: "isTyping", type: "boolean", default: "false", description: isJa ? "入力中表示に切り替えます。" : "Shows the typing indicator." },
                        { name: "actions", type: "ChatMessageAction[]", description: isJa ? "既定の操作を差し替える場合に指定します。" : "Overrides the default action footer." },
                        { name: "showActions", type: "boolean", default: "true", description: isJa ? "操作フッターの表示を切り替えます。" : "Toggles the action footer." },
                        { name: "onAction", type: "(actionKey, event) => void", description: isJa ? "コピー、分岐、Raw、編集などの操作を受け取ります。" : "Receives copy, branch, Raw, edit, or custom actions." },
                        { name: "typingMessages", type: "string[]", description: isJa ? "入力中かつ本文が空の場合に、タイプ/削除で切り替える文言です。" : "Typing labels cycled with type/delete animation when the body is empty." },
                        { name: "labels.typing", type: "string", default: '"内容を作成しています..."', description: isJa ? "入力中かつ本文が空の場合に表示する文言です。" : "Text shown for an empty typing message." },
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
