"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Embed() {
    const { locale } = useLocale();

    return (
        <div className="flex w-full justify-center p-4">
            <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
                <ResizablePanelGroup direction="horizontal" defaultLayout={{ sidebar: 32, canvas: 68 }} className="h-full w-full">
                    <ResizablePanel id="sidebar" defaultSize="32%" minSize="20%">
                        <div className="flex h-full items-center justify-center p-4 text-sm font-medium text-muted-foreground">
                            {locale === "ja" ? "サイドバー" : "Sidebar"}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel id="canvas" defaultSize="68%" minSize="40%">
                        <div className="flex h-full items-center justify-center p-4 text-sm font-medium text-muted-foreground">
                            {locale === "ja" ? "キャンバス" : "Canvas"}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
