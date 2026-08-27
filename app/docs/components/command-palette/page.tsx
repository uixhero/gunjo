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

const codeByLocale = {
    ja: `"use client"

import { Button, CommandPalette, Kbd } from "@gunjo/ui"
import {
  IconCalculator as Calculator,
  IconCalendar as Calendar,
  IconCreditCard as CreditCard,
  IconFileText as FileText,
  IconMoodSmile as Smile,
  IconSearch as Search,
  IconSettings as Settings,
  IconUserCircle as UserRound,
} from "@tabler/icons-react"
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
        heading: "移動",
        items: [
          {
            id: "search",
            label: "ドキュメントを検索",
            icon: <Search />,
            shortcut: "⌘K",
            action: () => setOpen(false),
          },
          {
            id: "files",
            label: "最近のファイル",
            icon: <FileText />,
            action: () => setOpen(false),
          },
        ],
      },
      {
        heading: "ツール",
        items: [
          {
            id: "calendar",
            label: "カレンダー",
            icon: <Calendar />,
            action: () => setOpen(false),
          },
          { id: "emoji", label: "絵文字を検索", icon: <Smile />, action: () => setOpen(false) },
          {
            id: "calculator",
            label: "計算機",
            icon: <Calculator />,
            action: () => setOpen(false),
          },
        ],
      },
      {
        heading: "設定",
        items: [
          {
            id: "profile",
            label: "プロフィール",
            icon: <UserRound />,
            shortcut: "⌘P",
            action: () => setOpen(false),
          },
          {
            id: "billing",
            label: "請求",
            icon: <CreditCard />,
            shortcut: "⌘B",
            action: () => setOpen(false),
          },
          {
            id: "settings",
            label: "環境設定",
            icon: <Settings />,
            shortcut: "⌘S",
            action: () => setOpen(false),
          },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        キーボードから開く場合は <Kbd>⌘K</Kbd>
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        コマンドパレットを開く
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        dialogTitle="コマンドパレット"
        placeholder="コマンドまたはページを検索..."
        emptyMessage="一致するコマンドがありません。"
        clearLabel="検索をクリア"
        groups={groups}
      />
    </div>
  )
}`,
    en: `"use client"

import { Button, CommandPalette, Kbd } from "@gunjo/ui"
import {
  IconCalculator as Calculator,
  IconCalendar as Calendar,
  IconCreditCard as CreditCard,
  IconFileText as FileText,
  IconMoodSmile as Smile,
  IconSearch as Search,
  IconSettings as Settings,
  IconUserCircle as UserRound,
} from "@tabler/icons-react"
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
        heading: "Navigation",
        items: [
          {
            id: "search",
            label: "Search docs",
            icon: <Search />,
            shortcut: "⌘K",
            action: () => setOpen(false),
          },
          {
            id: "files",
            label: "Recent files",
            icon: <FileText />,
            action: () => setOpen(false),
          },
        ],
      },
      {
        heading: "Tools",
        items: [
          {
            id: "calendar",
            label: "Calendar",
            icon: <Calendar />,
            action: () => setOpen(false),
          },
          {
            id: "emoji",
            label: "Search emoji",
            icon: <Smile />,
            action: () => setOpen(false),
          },
          {
            id: "calculator",
            label: "Calculator",
            icon: <Calculator />,
            action: () => setOpen(false),
          },
        ],
      },
      {
        heading: "Settings",
        items: [
          {
            id: "profile",
            label: "Profile",
            icon: <UserRound />,
            shortcut: "⌘P",
            action: () => setOpen(false),
          },
          {
            id: "billing",
            label: "Billing",
            icon: <CreditCard />,
            shortcut: "⌘B",
            action: () => setOpen(false),
          },
          {
            id: "settings",
            label: "Settings",
            icon: <Settings />,
            shortcut: "⌘S",
            action: () => setOpen(false),
          },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Open from the keyboard with <Kbd>⌘K</Kbd>
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        dialogTitle="Command palette"
        placeholder="Search commands or pages..."
        emptyMessage="No commands found."
        clearLabel="Clear search"
        groups={groups}
      />
    </div>
  )
}`,
};

const minimalCodeByLocale = {
    ja: `"use client"

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
        heading: "移動",
        items: [
          {
            id: "search",
            label: "ドキュメントを検索",
            icon: <Search />,
            shortcut: "⌘K",
            action: () => setOpen(false),
          },
          {
            id: "files",
            label: "最近のファイル",
            icon: <FileText />,
            action: () => setOpen(false),
          },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        キーボードから開く場合は <Kbd>⌘K</Kbd>
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        コマンドパレットを開く
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        dialogTitle="コマンドパレット"
        placeholder="コマンドまたはページを検索..."
        emptyMessage="一致するコマンドがありません。"
        clearLabel="検索をクリア"
        groups={groups}
      />
    </div>
  )
}`,
    en: `"use client"

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
        heading: "Navigation",
        items: [
          {
            id: "search",
            label: "Search docs",
            icon: <Search />,
            shortcut: "⌘K",
            action: () => setOpen(false),
          },
          {
            id: "files",
            label: "Recent files",
            icon: <FileText />,
            action: () => setOpen(false),
          },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Open from the keyboard with <Kbd>⌘K</Kbd>
      </p>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        dialogTitle="Command palette"
        placeholder="Search commands or pages..."
        emptyMessage="No commands found."
        clearLabel="Clear search"
        groups={groups}
      />
    </div>
  )
}`,
};

export default function CommandPalettePage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const usageCode = codeByLocale[locale];

    const minimalCode = minimalCodeByLocale[locale];

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
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
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
                            code: usageCode,
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
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>並びは呼ぶ側のデータで決める。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">groups</code> に見出しと項目を渡すと、群ごとに見出しが付き、群と群のあいだに区切りが入ります。資料が言う「最近使ったもの」「移動」「操作」の並べ分けは、この形でそのまま書けます。
                        </li>
                        <li>
                            <strong>打った文字の当たり先を広げる。</strong>項目ごとの <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">keywords</code> に、表示名だけでなくショートカットの文字も入れています。入力欄は開いた時点で焦点が入り、消すボタンには <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">clearLabel</code> で名前を付けます。見つからないときの文言は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LocaleProvider</code> から取るので、日本語の画面では日本語で出ます。
                        </li>
                        <li>
                            <strong>画面の高さを超えない。</strong>中身の高さは画面の高さから余白を引いた値で頭打ちにしてあります。項目が増えても、パレットが画面の外にはみ出して下が押せなくなることがありません。上下キー・Enter・Esc と焦点の閉じ込めは土台の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">CommandDialog</code> が持ちます。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/command-palette"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: コマンドパレット（Command Palette）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The grouping is data, not markup.</strong> Pass headings and items through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">groups</code> and each group gets its heading with a separator drawn between groups. The recent / navigate / act split the article recommends is expressible directly in that shape.
                        </li>
                        <li>
                            <strong>Widen what the typed text can hit.</strong> Each item lists both its label and its shortcut in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">keywords</code>. The input takes focus as the palette opens, the clear control is named through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">clearLabel</code>, and the empty message falls back to the wording on <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">LocaleProvider</code>.
                        </li>
                        <li>
                            <strong>It never grows past the viewport.</strong> The body height is capped against the viewport minus a margin, so a long list cannot push the palette off the bottom of the screen. Arrow keys, Enter, Escape and the focus trap all come from the underlying <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">CommandDialog</code>.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/command-palette"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Command Palette (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
