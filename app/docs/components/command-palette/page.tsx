"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
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

function CommandPaletteExample({ minimal = false, defaultOpen = false }: { minimal?: boolean; defaultOpen?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [open, setOpen] = useState(defaultOpen);
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
            ...(minimal
                ? []
                : [
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
                  ]),
        ],
        [isJa, minimal]
    );

    return (
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
    );
}

export default function CommandPalettePage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `"use client"

import { Button, CommandPalette, Kbd } from "@gunjo/ui"
import { IconCalculator as Calculator, IconCalendar as Calendar, IconCreditCard as CreditCard, IconFileText as FileText, IconMoodSmile as Smile, IconSearch as Search, IconSettings as Settings, IconUserCircle as UserRound } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"

export function CommandPaletteExample() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const groups = useMemo(
    () => [
      {
        heading: "${isJa ? "移動" : "Navigation"}",
        items: [
          { id: "search", label: "${isJa ? "ドキュメントを検索" : "Search docs"}", icon: <Search />, shortcut: "⌘K", action: () => setOpen(false) },
          { id: "files", label: "${isJa ? "最近のファイル" : "Recent files"}", icon: <FileText />, action: () => setOpen(false) },
        ],
      },
      {
        heading: "${isJa ? "ツール" : "Tools"}",
        items: [
          { id: "calendar", label: "${isJa ? "カレンダー" : "Calendar"}", icon: <Calendar />, action: () => setOpen(false) },
          { id: "emoji", label: "${isJa ? "絵文字を検索" : "Search emoji"}", icon: <Smile />, action: () => setOpen(false) },
          { id: "calculator", label: "${isJa ? "計算機" : "Calculator"}", icon: <Calculator />, action: () => setOpen(false) },
        ],
      },
      {
        heading: "${isJa ? "設定" : "Settings"}",
        items: [
          { id: "profile", label: "${isJa ? "プロフィール" : "Profile"}", icon: <UserRound />, shortcut: "⌘P", action: () => setOpen(false) },
          { id: "billing", label: "${isJa ? "請求" : "Billing"}", icon: <CreditCard />, shortcut: "⌘B", action: () => setOpen(false) },
          { id: "settings", label: "${isJa ? "環境設定" : "Settings"}", icon: <Settings />, shortcut: "⌘S", action: () => setOpen(false) },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        ${isJa ? "キーボードから開く場合は" : "Open from the keyboard with"} <Kbd>⌘K</Kbd>
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        ${isJa ? "コマンドパレットを開く" : "Open command palette"}
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        dialogTitle="${isJa ? "コマンドパレット" : "Command palette"}"
        placeholder="${isJa ? "コマンドまたはページを検索..." : "Search commands or pages..."}"
        emptyMessage="${isJa ? "一致するコマンドがありません。" : "No commands found."}"
        clearLabel="${isJa ? "検索をクリア" : "Clear search"}"
        groups={groups}
      />
    </div>
  )
}`;

    const minimalCode = `"use client"

import { Button, CommandPalette, Kbd } from "@gunjo/ui"
import { IconFileText as FileText, IconSearch as Search } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"

export function SmallCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const groups = useMemo(
    () => [
      {
        heading: "${isJa ? "移動" : "Navigation"}",
        items: [
          { id: "search", label: "${isJa ? "ドキュメントを検索" : "Search docs"}", icon: <Search />, shortcut: "⌘K", action: () => setOpen(false) },
          { id: "files", label: "${isJa ? "最近のファイル" : "Recent files"}", icon: <FileText />, action: () => setOpen(false) },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        ${isJa ? "キーボードから開く場合は" : "Open from the keyboard with"} <Kbd>⌘K</Kbd>
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        ${isJa ? "コマンドパレットを開く" : "Open command palette"}
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        dialogTitle="${isJa ? "コマンドパレット" : "Command palette"}"
        placeholder="${isJa ? "コマンドまたはページを検索..." : "Search commands or pages..."}"
        emptyMessage="${isJa ? "一致するコマンドがありません。" : "No commands found."}"
        clearLabel="${isJa ? "検索をクリア" : "Clear search"}"
        groups={groups}
      />
    </div>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.commandPalette.title}
            description={navigationMetadata.commandPalette.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "CommandPalette", href: "/docs/components/command-palette" },
                { name: "Command", href: "/docs/components/command" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Kbd", href: "/docs/components/kbd" },
            ]}
            relatedComponents={[
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "Combobox", href: "/docs/components/combobox" },
                { name: "SearchInput", href: "/docs/components/search-input" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/command-palette"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="xl"
            >
                <CommandPaletteExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "standard",
                            title: isJa ? "標準表示" : "Standard",
                            description: isJa
                                ? "グローバルな移動先とアクションをまとめ、キーボードショートカットでも開けるようにします。"
                                : "Combine global destinations and actions, and expose a keyboard shortcut to open it.",
                            preview: <CommandPaletteExample />,
                            previewBodyWidth: "xl",
                            code,
                        },
                        {
                            key: "small-set",
                            title: isJa ? "少数コマンド" : "Small command set",
                            description: isJa
                                ? "小さなアプリではグループを絞り、空状態や検索文言だけを用途に合わせます。"
                                : "For smaller apps, keep the groups focused and tune empty/search copy to the use case.",
                            preview: <CommandPaletteExample minimal />,
                            previewBodyWidth: "xl",
                            code: minimalCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        {
                            name: "open",
                            type: "boolean",
                            description: isJa ? "パレットの開閉状態。" : "Controlled open state.",
                        },
                        {
                            name: "onOpenChange",
                            type: "(open: boolean) => void",
                            description: isJa ? "開閉状態が変わった時に呼ばれるハンドラ。" : "Handler called when the open state changes.",
                        },
                        {
                            name: "groups",
                            type: "CommandPaletteGroup[]",
                            description: isJa ? "見出しとコマンド項目の配列。" : "Groups of command items with headings.",
                            default: "[]",
                        },
                        {
                            name: "placeholder",
                            type: "string",
                            default: '"Type a command or search..."',
                            description: isJa ? "検索入力のプレースホルダー。" : "Placeholder text for the search input.",
                        },
                        {
                            name: "emptyMessage",
                            type: "ReactNode",
                            default: '"No results found."',
                            description: isJa ? "検索結果がない時に表示する文言。" : "Message shown when no command matches.",
                        },
                        {
                            name: "dialogTitle",
                            type: "ReactNode",
                            default: '"Command Menu"',
                            description: isJa ? "ダイアログのアクセシブルタイトル。" : "Accessible dialog title.",
                        },
                        {
                            name: "clearLabel",
                            type: "string",
                            default: '"Clear search"',
                            description: isJa ? "検索クリアボタンの aria-label とツールチップ文言。" : "Accessible label and tooltip text for the clear button.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa ? "docs プレビューや擬似ブラウザ内にパレットを閉じ込めたい時のポータル先。" : "Optional portal target for keeping the palette inside a docs preview or framed viewport.",
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
