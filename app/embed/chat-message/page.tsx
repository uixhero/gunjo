"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { ChatMessage, ToastProvider, useToast, type ChatMessageActionKey } from "@gunjo/ui";

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

function ChatMessageEmbedPreview() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const { showToast } = useToast();
    const handleAction = (action: ChatMessageActionKey) => {
        showToast(buildActionMessage(isJa, action), "success", 1800);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
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
        </div>
    );
}

export default function Embed() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <ToastProvider labels={{ close: isJa ? "閉じる" : "Close" }}>
            <ChatMessageEmbedPreview />
        </ToastProvider>
    );
}
