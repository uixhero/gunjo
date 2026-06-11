"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { Button, CommandPalette, Kbd } from "@gunjo/ui";
import {
    IconCalculator as Calculator,
    IconCalendar as Calendar,
    IconCreditCard as CreditCard,
    IconFileText as FileText,
    IconMoodSmile as Smile,
    IconSearch as Search,
    IconSettings as Settings,
    IconUserCircle as UserRound,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

export default function Embed() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [open, setOpen] = useState(false);
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((current) => !current);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const groups = useMemo(
        () => [
            {
                heading: isJa ? "移動" : "Navigation",
                items: [
                    { id: "search", label: isJa ? "ドキュメントを検索" : "Search docs", icon: <Search />, shortcut: "⌘K", action: () => setOpen(false) },
                    { id: "files", label: isJa ? "最近のファイル" : "Recent files", icon: <FileText />, action: () => setOpen(false) },
                ],
            },
            {
                heading: isJa ? "ツール" : "Tools",
                items: [
                    { id: "calendar", label: isJa ? "カレンダー" : "Calendar", icon: <Calendar />, action: () => setOpen(false) },
                    { id: "emoji", label: isJa ? "絵文字を検索" : "Search emoji", icon: <Smile />, action: () => setOpen(false) },
                    { id: "calculator", label: isJa ? "計算機" : "Calculator", icon: <Calculator />, action: () => setOpen(false) },
                ],
            },
            {
                heading: isJa ? "設定" : "Settings",
                items: [
                    { id: "profile", label: isJa ? "プロフィール" : "Profile", icon: <UserRound />, shortcut: "⌘P", action: () => setOpen(false) },
                    { id: "billing", label: isJa ? "請求" : "Billing", icon: <CreditCard />, shortcut: "⌘B", action: () => setOpen(false) },
                    { id: "settings", label: isJa ? "環境設定" : "Settings", icon: <Settings />, shortcut: "⌘S", action: () => setOpen(false) },
                ],
            },
        ],
        [isJa]
    );

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div
                ref={setPortalContainer}
                className="relative flex min-h-[28rem] w-full max-w-3xl flex-col items-center justify-center gap-3 overflow-hidden rounded-md border bg-background p-8 text-center"
            >
                <p className="text-sm text-muted-foreground">
                    {isJa ? "キーボードから開く場合は" : "Open from the keyboard with"} <Kbd>⌘K</Kbd>
                </p>
                <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                    {isJa ? "コマンドパレットを開く" : "Open command palette"}
                </Button>
                {portalContainer ? (
                    <CommandPalette
                        open={open}
                        onOpenChange={setOpen}
                        dialogTitle={isJa ? "コマンドパレット" : "Command palette"}
                        placeholder={isJa ? "コマンドまたはページを検索..." : "Search commands or pages..."}
                        emptyMessage={isJa ? "一致するコマンドがありません。" : "No commands found."}
                        clearLabel={isJa ? "検索をクリア" : "Clear search"}
                        portalContainer={portalContainer}
                        groups={groups}
                    />
                ) : null}
            </div>
        </div>
    );
}
