"use client";

import { FloatingPanel, SpatialCanvas } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Embed() {
    const { locale } = useLocale();

    return (
        <div className="flex w-full justify-center p-4">
            <div className="h-[420px] w-full max-w-4xl overflow-hidden rounded-lg border">
                <SpatialCanvas gridSize={40}>
                    <FloatingPanel title={locale === "ja" ? "ツール" : "Tools"} className="absolute left-4 top-4 w-48">
                        <div className="p-3 text-sm text-muted-foreground">
                            {locale === "ja" ? "選択、描画、確認を行います。" : "Select, draw, and inspect."}
                        </div>
                    </FloatingPanel>
                    <FloatingPanel title={locale === "ja" ? "プロパティ" : "Properties"} className="absolute bottom-4 right-4 w-56">
                        <div className="p-3 text-sm text-muted-foreground">
                            {locale === "ja" ? "選択中ノードの設定です。" : "Selected node settings."}
                        </div>
                    </FloatingPanel>
                </SpatialCanvas>
            </div>
        </div>
    );
}
