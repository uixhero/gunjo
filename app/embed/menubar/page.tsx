"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@gunjo/ui";

function MenubarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "ファイル" : "File"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>{isJa ? "新しいタブ" : "New tab"} <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "新しいウィンドウ" : "New window"} <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "書き出し設定を開く" : "Open export settings"}</MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>{isJa ? "共有" : "Share"}</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>{isJa ? "リンクをコピー" : "Copy link"}</MenubarItem>
                            <MenubarItem>{isJa ? "メールで送信" : "Send email"}</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "編集" : "Edit"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>{isJa ? "取り消し" : "Undo"} <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "やり直し" : "Redo"} <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>{isJa ? "切り取り" : "Cut"} <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "コピー" : "Copy"} <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "貼り付け" : "Paste"} <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "表示" : "View"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>{isJa ? "再読み込み" : "Reload"} <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
                    <MenubarItem>{isJa ? "全画面表示" : "Fullscreen"}</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

function ViewSettingsMenubarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{isJa ? "表示" : "View"}</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem checked>{isJa ? "サイドバーを表示" : "Show sidebar"}</MenubarCheckboxItem>
                    <MenubarCheckboxItem>{isJa ? "ステータスバーを表示" : "Show status bar"}</MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarRadioGroup value="comfortable">
                        <MenubarRadioItem value="compact">{isJa ? "コンパクト" : "Compact"}</MenubarRadioItem>
                        <MenubarRadioItem value="comfortable">{isJa ? "標準" : "Comfortable"}</MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

function AppWindowMenubarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="w-full max-w-2xl overflow-hidden rounded-md border bg-background shadow-sm">
            <div className="flex h-10 items-center justify-between border-b bg-muted/40 px-3">
                <div className="flex items-center gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">{isJa ? "キャンバス編集" : "Canvas editor"}</p>
                <div className="w-12" />
            </div>
            <Menubar className="h-9 rounded-none border-x-0 border-t-0 bg-background">
                <MenubarMenu>
                    <MenubarTrigger>{isJa ? "ファイル" : "File"}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>{isJa ? "保存" : "Save"} <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                        <MenubarItem>{isJa ? "別名で保存" : "Save as"} <MenubarShortcut>⇧⌘S</MenubarShortcut></MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{isJa ? "編集" : "Edit"}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>{isJa ? "取り消し" : "Undo"} <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                        <MenubarItem>{isJa ? "やり直し" : "Redo"} <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>{isJa ? "複製" : "Duplicate"} <MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{isJa ? "表示" : "View"}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem checked>{isJa ? "グリッドを表示" : "Show grid"}</MenubarCheckboxItem>
                        <MenubarCheckboxItem>{isJa ? "ガイドを表示" : "Show guides"}</MenubarCheckboxItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className="grid min-h-36 place-items-center bg-muted/20 p-6 text-sm text-muted-foreground">
                {isJa ? "作業領域" : "Workspace"}
            </div>
        </div>
    );
}

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = searchParams.get("variant");

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            {variant === "app-window" ? <AppWindowMenubarExample /> : variant === "checks" ? <ViewSettingsMenubarExample /> : <MenubarExample />}
        </div>
    );
}
