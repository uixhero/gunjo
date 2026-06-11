"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChatComposer, Button } from "@gunjo/ui";

export default function ChatComposerEmbed() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [selected, setSelected] = React.useState("hybrid");

    const choices = [
        { id: "hybrid", label: isJa ? "用途とタイプのハイブリッド" : "Hybrid by purpose and type" },
        { id: "file", label: isJa ? "ファイルタイプで分ける" : "Group by file type" },
        { id: "date", label: isJa ? "日付で分ける" : "Group by date" },
    ];

    return (
        <div className="w-full max-w-3xl">
            <ChatComposer
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
                                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm ${selected === choice.id ? "border-primary-border bg-primary-subtle" : "border-border bg-muted/20"}`}
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background font-semibold">
                                        {index + 1}
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
                    modelOptions: [
                        { value: "auto", label: isJa ? "自動" : "Auto" },
                        { value: "fast", label: isJa ? "高速" : "Fast" },
                    ],
                    labels: {
                        attach: isJa ? "ファイルを添付" : "Attach file",
                        options: isJa ? "入力オプション" : "Input options",
                        model: isJa ? "モデルを選択" : "Choose model",
                        voice: isJa ? "音声入力" : "Voice input",
                        send: isJa ? "送信" : "Send",
                    },
                }}
            />
        </div>
    );
}
