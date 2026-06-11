"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChatInput, Switch } from "@gunjo/ui";

export default function Embed() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [model, setModel] = React.useState("auto");
    const [webSearch, setWebSearch] = React.useState(true);
    const [imageContext, setImageContext] = React.useState(false);
    const modelOptions = React.useMemo(
        () => [
            { value: "auto", label: isJa ? "自動" : "Auto", description: isJa ? "内容に合わせて選択" : "Choose for the task" },
            { value: "fast", label: isJa ? "高速" : "Fast", description: isJa ? "短い返答を優先" : "Prioritize short replies" },
            { value: "deep", label: isJa ? "推論" : "Reasoning", description: isJa ? "複雑な確認向け" : "For complex review" },
        ],
        [isJa]
    );

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <ChatInput
                    onSend={() => {
                        setIsProcessing(true);
                        window.setTimeout(() => setIsProcessing(false), 900);
                    }}
                    onStop={() => setIsProcessing(false)}
                    isProcessing={isProcessing}
                    placeholder={isJa ? "確認したい内容を入力..." : "Type what you want to review..."}
                    optionsContent={
                        <div className="space-y-3">
                            <p className="text-sm font-semibold">{isJa ? "入力オプション" : "Input options"}</p>
                            <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                <span>{isJa ? "Web を参照" : "Use web context"}</span>
                                <Switch checked={webSearch} onCheckedChange={setWebSearch} />
                            </label>
                            <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                <span>{isJa ? "画像を参照" : "Use image context"}</span>
                                <Switch checked={imageContext} onCheckedChange={setImageContext} />
                            </label>
                        </div>
                    }
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
                    }}
                />
            </div>
        </div>
    );
}
