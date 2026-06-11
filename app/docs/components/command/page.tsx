"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
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
    IconSearch as Search,
    IconSettings as Settings,
    IconUserCircle as UserRound,
} from "@tabler/icons-react";

function CommandExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
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
    );
}

function EmptyCommandSearch() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [search, setSearch] = React.useState(isJa ? "存在しない項目" : "Missing item");

    React.useEffect(() => {
        setSearch(isJa ? "存在しない項目" : "Missing item");
    }, [isJa]);

    return (
        <Command className="w-full max-w-[720px] rounded-lg border shadow-md">
            <CommandInput
                value={search}
                onValueChange={setSearch}
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
            </CommandList>
        </Command>
    );
}

function DisabledCommandItems() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const disabledReason = isJa
        ? "管理者ロールを付与すると選択できます。ワークスペース管理者に依頼してください。"
        : "Ask a workspace administrator to grant the admin role before using this item.";

    return (
        <Command className="w-full max-w-[720px] rounded-lg border shadow-md">
            <CommandInput
                placeholder={isJa ? "コマンドまたは検索語を入力..." : "Type a command or search..."}
                clearable
                clearLabel={isJa ? "検索をクリア" : "Clear search"}
            />
            <CommandList>
                <CommandGroup heading={isJa ? "ワークスペース" : "Workspace"}>
                    <CommandItem value="search" keywords={isJa ? ["検索", "ワークスペース"] : ["search", "workspace"]}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>{isJa ? "ワークスペースを検索" : "Search workspace"}</span>
                        <CommandShortcut>⌘F</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                        value="settings"
                        disabled
                        disabledReason={disabledReason}
                        disabledReasonLabel={isJa ? "管理設定を選択できない理由" : "Why admin settings are unavailable"}
                        keywords={isJa ? ["管理設定", "権限"] : ["admin settings", "permissions"]}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{isJa ? "管理設定" : "Admin settings"}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                            {isJa ? "権限が必要" : "Requires role"}
                        </span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

export default function CommandPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@gunjo/ui"
import { IconCalculator as Calculator, IconCalendar as Calendar, IconCreditCard as CreditCard, IconMoodSmile as Smile, IconSettings as Settings, IconUserCircle as UserRound } from "@tabler/icons-react"

export function CommandExample() {
  return (
    <Command className="w-full max-w-[720px] rounded-lg border shadow-md">
      <CommandInput
        placeholder="${isJa ? "コマンドまたは検索語を入力..." : "Type a command or search..."}"
        clearable
        clearLabel="${isJa ? "検索をクリア" : "Clear search"}"
      />
      <CommandList>
        <CommandEmpty>${isJa ? "一致する結果がありません。" : "No results found."}</CommandEmpty>
        <CommandGroup heading="${isJa ? "候補" : "Suggestions"}">
          <CommandItem value="calendar" keywords={["${isJa ? "カレンダー" : "calendar"}", "${isJa ? "予定" : "schedule"}"]}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>${isJa ? "カレンダー" : "Calendar"}</span>
          </CommandItem>
          <CommandItem value="emoji" keywords={["${isJa ? "絵文字" : "emoji"}", "${isJa ? "顔文字" : "smile"}"]}>
            <Smile className="mr-2 h-4 w-4" />
            <span>${isJa ? "絵文字を検索" : "Search emoji"}</span>
          </CommandItem>
          <CommandItem value="calculator" keywords={["${isJa ? "計算機" : "calculator"}", "${isJa ? "電卓" : "math"}"]}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>${isJa ? "計算機" : "Calculator"}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="${isJa ? "設定" : "Settings"}">
          <CommandItem value="profile" keywords={["${isJa ? "プロフィール" : "profile"}", "${isJa ? "アカウント" : "account"}"]}>
            <UserRound className="mr-2 h-4 w-4" />
            <span>${isJa ? "プロフィール" : "Profile"}</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="billing" keywords={["${isJa ? "請求" : "billing"}", "${isJa ? "支払い" : "payment"}"]}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>${isJa ? "請求" : "Billing"}</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings" keywords={["${isJa ? "環境設定" : "settings"}", "${isJa ? "設定" : "preferences"}"]}>
            <Settings className="mr-2 h-4 w-4" />
            <span>${isJa ? "環境設定" : "Settings"}</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`;

    const searchCode = `import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@gunjo/ui"
import { IconCalculator as Calculator, IconCalendar as Calendar, IconMoodSmile as Smile } from "@tabler/icons-react"

export function EmptyCommandSearch() {
  const [search, setSearch] = React.useState("${isJa ? "存在しない項目" : "Missing item"}")

  return (
    <Command className="w-full max-w-[720px] rounded-lg border shadow-md">
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="${isJa ? "コマンドまたは検索語を入力..." : "Type a command or search..."}"
        clearable
        clearLabel="${isJa ? "検索をクリア" : "Clear search"}"
      />
      <CommandList>
        <CommandEmpty>${isJa ? "一致する結果がありません。" : "No results found."}</CommandEmpty>
        <CommandGroup heading="${isJa ? "候補" : "Suggestions"}">
          <CommandItem value="calendar" keywords={["${isJa ? "カレンダー" : "calendar"}", "${isJa ? "予定" : "schedule"}"]}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>${isJa ? "カレンダー" : "Calendar"}</span>
          </CommandItem>
          <CommandItem value="emoji" keywords={["${isJa ? "絵文字" : "emoji"}", "${isJa ? "顔文字" : "smile"}"]}>
            <Smile className="mr-2 h-4 w-4" />
            <span>${isJa ? "絵文字を検索" : "Search emoji"}</span>
          </CommandItem>
          <CommandItem value="calculator" keywords={["${isJa ? "計算機" : "calculator"}", "${isJa ? "電卓" : "math"}"]}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>${isJa ? "計算機" : "Calculator"}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`;

    const disabledCode = `import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@gunjo/ui"
import { IconSearch as Search, IconSettings as Settings } from "@tabler/icons-react"

export function DisabledCommandItems() {
  const disabledReason = "${isJa ? "管理者ロールを付与すると選択できます。ワークスペース管理者に依頼してください。" : "Ask a workspace administrator to grant the admin role before using this item."}"

  return (
    <Command className="w-full max-w-[720px] rounded-lg border shadow-md">
      <CommandInput
        placeholder="${isJa ? "コマンドまたは検索語を入力..." : "Type a command or search..."}"
        clearable
        clearLabel="${isJa ? "検索をクリア" : "Clear search"}"
      />
      <CommandList>
        <CommandGroup heading="${isJa ? "ワークスペース" : "Workspace"}">
          <CommandItem value="search" keywords={["${isJa ? "検索" : "search"}", "${isJa ? "ワークスペース" : "workspace"}"]}>
            <Search className="mr-2 h-4 w-4" />
            <span>${isJa ? "ワークスペースを検索" : "Search workspace"}</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="settings"
            disabled
            disabledReason={disabledReason}
            disabledReasonLabel="${isJa ? "管理設定を選択できない理由" : "Why admin settings are unavailable"}"
            keywords={["${isJa ? "管理設定" : "admin settings"}", "${isJa ? "権限" : "permissions"}"]}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>${isJa ? "管理設定" : "Admin settings"}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              ${isJa ? "権限が必要" : "Requires role"}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.command.title}
            description={navigationMetadata.command.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Command", href: "/docs/components/command" },
                { name: "CommandInput", href: "/docs/components/command#command-input" },
                { name: "CommandList", href: "/docs/components/command#command-list" },
                { name: "CommandItem", href: "/docs/components/command#command-item" },
            ]}
            relatedComponents={[
                { name: "Combobox", href: "/docs/components/combobox" },
                { name: "CommandPalette", href: "/docs/components/command-palette" },
                { name: "Popover", href: "/docs/components/popover" },
                { name: "Dialog", href: "/docs/components/dialog" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/command"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="xl"
            >
                <CommandExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "grouped",
                            title: isJa ? "グループとショートカット" : "Groups and shortcuts",
                            description: isJa
                                ? "候補を用途ごとに分け、頻繁に使う操作にはショートカットを併記します。"
                                : "Group commands by purpose and show shortcuts for frequent actions.",
                            preview: <CommandExample />,
                            previewBodyWidth: "xl",
                            code,
                        },
                        {
                            key: "empty",
                            title: isJa ? "検索結果なし" : "No results",
                            description: isJa
                                ? "一致する候補がない場合は CommandEmpty で明確に伝えます。"
                                : "Use CommandEmpty to make no-match states explicit.",
                            preview: <EmptyCommandSearch />,
                            previewBodyWidth: "xl",
                            code: searchCode,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "無効な候補" : "Disabled item",
                            description: isJa
                                ? "選べない候補は無効表示にし、必要な権限や条件を近くに示します。"
                                : "Disabled items should explain the required role or condition nearby.",
                            preview: <DisabledCommandItems />,
                            previewBodyWidth: "xl",
                            code: disabledCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>

                <h3 className="mt-4 text-xl font-semibold" id="command">Command</h3>
                <PropsTable
                    data={[
                        {
                            name: "filter",
                            type: "(value: string, search: string) => number",
                            description: isJa ? "検索結果の一致判定や並びを制御する関数。" : "Custom filter function.",
                        },
                        {
                            name: "value",
                            type: "string",
                            description: isJa ? "選択中アイテムの制御値。" : "Controlled selected item value.",
                        },
                        {
                            name: "onValueChange",
                            type: "(value: string) => void",
                            description: isJa ? "選択値が変わった時に呼ばれるハンドラ。" : "Handler called when the selected value changes.",
                        },
                        {
                            name: "loop",
                            type: "boolean",
                            description: isJa ? "末尾と先頭でキーボード選択を循環させるか。" : "Whether keyboard selection loops at the ends.",
                        },
                    ]}
                />

                <h3 className="mt-4 text-xl font-semibold" id="command-input">CommandInput</h3>
                <PropsTable
                    data={[
                        {
                            name: "placeholder",
                            type: "string",
                            description: isJa ? "検索入力のプレースホルダー。" : "Placeholder text for the search input.",
                        },
                        {
                            name: "value",
                            type: "string",
                            description: isJa ? "検索入力の制御値。" : "Controlled value for the search input.",
                        },
                        {
                            name: "onValueChange",
                            type: "(value: string) => void",
                            description: isJa ? "検索入力が変わった時に呼ばれるハンドラ。" : "Handler called when the search input changes.",
                        },
                        {
                            name: "clearable",
                            type: "boolean",
                            default: "false",
                            description: isJa ? "入力値がある時にクリアボタンを表示するか。" : "Whether to show a clear button when the input has a value.",
                        },
                        {
                            name: "clearLabel",
                            type: "string",
                            default: '"Clear search"',
                            description: isJa ? "クリアボタンの aria-label とツールチップ文言。" : "Accessible label and tooltip text for the clear button.",
                        },
                    ]}
                />

                <h3 className="mt-4 text-xl font-semibold" id="command-item">CommandItem</h3>
                <PropsTable
                    data={[
                        {
                            name: "value",
                            type: "string",
                            description: isJa ? "候補の一意な値。未指定時はテキストから推測されます。" : "Unique item value, inferred from text when omitted.",
                        },
                        {
                            name: "onSelect",
                            type: "(value: string) => void",
                            description: isJa ? "候補を選択した時に呼ばれるハンドラ。" : "Handler called when an item is selected.",
                        },
                        {
                            name: "keywords",
                            type: "string[]",
                            description: isJa ? "表示名とは別に検索へ含めるキーワード。" : "Additional keywords included in search matching.",
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            description: isJa ? "候補を選択不可にするか。" : "Whether the item is disabled.",
                        },
                        {
                            name: "disabledReason",
                            type: "ReactNode",
                            description: isJa ? "無効な候補に表示する理由。ホバーやフォーカスでツールチップに表示します。" : "Reason shown in a tooltip for disabled items.",
                        },
                        {
                            name: "disabledReasonLabel",
                            type: "string",
                            description: isJa ? "無効理由ツールチップのフォーカス対象に付ける aria-label。" : "Accessible label for the disabled reason trigger.",
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={code} />
                </div>
            </div>
        </ComponentLayout>
    );
}
