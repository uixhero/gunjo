"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@gunjo/ui";
import {
    IconCalculator as Calculator,
    IconCalendar as Calendar,
    IconCreditCard as CreditCard,
    IconMoodSmile as Smile,
    IconSettings as Settings,
    IconUserCircle as UserRound,
} from "@tabler/icons-react";

export default function Embed() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Command className="w-full max-w-[720px] rounded-lg border shadow-md">
                <CommandInput
                    placeholder={isJa ? "コマンドまたは検索語を入力..." : "Type a command or search..."}
                    clearable
                    clearLabel={isJa ? "検索をクリア" : "Clear search"}
                />
                <CommandList>
                    <CommandEmpty>{isJa ? "一致する結果がありません。" : "No results found."}</CommandEmpty>
                    <CommandGroup heading={isJa ? "候補" : "Suggestions"}>
                        <CommandItem value="calendar" keywords={isJa ? ["カレンダー", "予定", "日程"] : ["calendar", "schedule"]}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{isJa ? "カレンダー" : "Calendar"}</span>
                        </CommandItem>
                        <CommandItem value="emoji" keywords={isJa ? ["絵文字", "顔文字"] : ["emoji", "smile"]}>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>{isJa ? "絵文字を検索" : "Search emoji"}</span>
                        </CommandItem>
                        <CommandItem value="calculator" keywords={isJa ? ["計算機", "電卓"] : ["calculator"]}>
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>{isJa ? "計算機" : "Calculator"}</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading={isJa ? "設定" : "Settings"}>
                        <CommandItem value="profile" keywords={isJa ? ["プロフィール", "アカウント"] : ["profile", "account"]}>
                            <UserRound className="mr-2 h-4 w-4" />
                            <span>{isJa ? "プロフィール" : "Profile"}</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem value="billing" keywords={isJa ? ["請求", "支払い"] : ["billing", "payment"]}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>{isJa ? "請求" : "Billing"}</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem value="settings" keywords={isJa ? ["環境設定", "設定"] : ["settings", "preferences"]}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{isJa ? "環境設定" : "Settings"}</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}
