"use client";

import React, { useState } from "react";
import { ChatPanel } from "@gunjo/ui";

interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
}

export function AIChatDemo() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "Session started at 10:00 AM",
            timestamp: "10:00 AM"
        },
        {
            id: "2",
            role: "assistant",
            content: "こんにちは！何かお手伝いできることはありますか？",
            timestamp: "10:00 AM"
        }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSend = async (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setIsProcessing(true);

        // Simulate AI response
        setTimeout(() => {
            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `「${text}」についてですね。承知いたしました。\nこれはAIによる自動応答のデモです。実際の実装ではAPIを呼び出して回答を生成します。`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, responseMessage]);
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <ChatPanel
            title="サポートチャット"
            description="Powered by Gunjo UI"
            messages={messages}
            onSend={handleSend}
            isProcessing={isProcessing}
            placeholder="質問を入力..."
        />
    );
}
