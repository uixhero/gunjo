"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { AppRail, DocNote, TooltipButton } from "@gunjo/ui";
import {
    IconBell as Bell,
    IconHome as Home,
    IconSearch as Search,
    IconSettings as Settings,
    IconUserCircle as UserRound,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";

function RailAction({
    label,
    icon,
    active,
    onSelect,
}: {
    label: string;
    icon: ReactNode;
    active?: boolean;
    onSelect: () => void;
}) {
    return (
        <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            tooltip={label}
            tooltipSide="right"
            tooltipOpenOnClick
            aria-label={label}
            aria-pressed={active}
            onClick={onSelect}
            className={[
                "h-10 w-10 text-muted transition-colors hover:bg-background/10 hover:text-background",
                active ? "bg-background/20 text-background ring-1 ring-background/25" : "",
            ].join(" ")}
        >
            {icon}
        </TooltipButton>
    );
}

function AppRailExample({ compact = false }: { compact?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const items = [
        {
            key: "home",
            label: isJa ? "ホーム" : "Home",
            icon: <Home className="h-5 w-5" />,
            title: isJa ? "ホーム" : "Home",
            description: isJa ? "最近の更新、タスク、概要を確認します。" : "Review recent updates, tasks, and overview metrics.",
        },
        {
            key: "search",
            label: isJa ? "検索" : "Search",
            icon: <Search className="h-5 w-5" />,
            title: isJa ? "検索" : "Search",
            description: isJa ? "ワークスペース全体からドキュメントや操作を探します。" : "Find documents and actions across the workspace.",
        },
        ...(compact
            ? []
            : [
                  {
                      key: "notifications",
                      label: isJa ? "通知" : "Notifications",
                      icon: <Bell className="h-5 w-5" />,
                      title: isJa ? "通知" : "Notifications",
                      description: isJa ? "未読通知と重要な更新を確認します。" : "Check unread notifications and important updates.",
                  },
                  {
                      key: "account",
                      label: isJa ? "アカウント" : "Account",
                      icon: <UserRound className="h-5 w-5" />,
                      title: isJa ? "アカウント" : "Account",
                      description: isJa ? "プロフィール、チーム、請求情報を管理します。" : "Manage profile, team, and billing settings.",
                  },
              ]),
    ];
    const settingsItem = {
        key: "settings",
        label: isJa ? "設定" : "Settings",
        icon: <Settings className="h-5 w-5" />,
        title: isJa ? "設定" : "Settings",
        description: isJa ? "表示、通知、権限などの環境設定を変更します。" : "Adjust display, notifications, permissions, and preferences.",
    };
    const allItems = [...items, settingsItem];
    const [activeKey, setActiveKey] = useState(allItems[0]?.key ?? "home");
    const activeItem = allItems.find((item) => item.key === activeKey) ?? allItems[0];

    return (
        <div className="flex h-[340px] w-full max-w-3xl overflow-hidden rounded-md border bg-background">
            <AppRail>
                {items.map((item) => (
                    <RailAction
                        key={item.key}
                        label={item.label}
                        icon={item.icon}
                        active={activeItem.key === item.key}
                        onSelect={() => setActiveKey(item.key)}
                    />
                ))}
                <div className="mt-auto">
                    <RailAction
                        label={settingsItem.label}
                        icon={settingsItem.icon}
                        active={activeItem.key === settingsItem.key}
                        onSelect={() => setActiveKey(settingsItem.key)}
                    />
                </div>
            </AppRail>
            <div className="flex min-w-0 flex-1 items-center justify-center bg-secondary/50 p-6">
                <div className="max-w-sm space-y-2 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isJa ? "選択中" : "Selected"}
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{activeItem.description}</p>
                </div>
            </div>
        </div>
    );
}

const codeByLocale = {
    ja: `import { AppRail, TooltipButton } from "@gunjo/ui"
import {
  IconBell as Bell,
  IconHome as Home,
  IconSearch as Search,
  IconSettings as Settings,
  IconUserCircle as UserRound,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

function RailAction(props: {
  label: string
  children: ReactNode
  active?: boolean
  onSelect: () => void
}) {
  const { label, children, active, onSelect } = props

  return (
    <TooltipButton
      type="button"
      variant="ghost"
      size="icon"
      tooltip={label}
      tooltipSide="right"
      tooltipOpenOnClick
      aria-label={label}
      aria-pressed={active}
      onClick={onSelect}
      className={[
        "h-10 w-10 text-muted hover:bg-background/10 hover:text-background",
        active ? "bg-background/20 text-background ring-1 ring-background/25" : "",
      ].join(" ")}
    >
      {children}
    </TooltipButton>
  )
}

export function AppRailExample() {
  const items = [
    {
      key: "home",
      label: "ホーム",
      icon: <Home className="h-5 w-5" />,
      title: "ホーム",
      description: "最近の更新、タスク、概要を確認します。",
    },
    {
      key: "search",
      label: "検索",
      icon: <Search className="h-5 w-5" />,
      title: "検索",
      description: "ワークスペース全体からドキュメントや操作を探します。",
    },
    {
      key: "notifications",
      label: "通知",
      icon: <Bell className="h-5 w-5" />,
      title: "通知",
      description: "未読通知と重要な更新を確認します。",
    },
    {
      key: "account",
      label: "アカウント",
      icon: <UserRound className="h-5 w-5" />,
      title: "アカウント",
      description: "プロフィール、チーム、請求情報を管理します。",
    },
  ]
  const settingsItem = {
    key: "settings",
    label: "設定",
    icon: <Settings className="h-5 w-5" />,
    title: "設定",
    description: "表示、通知、権限などの環境設定を変更します。",
  }
  const allItems = [...items, settingsItem]
  const [activeKey, setActiveKey] = useState(allItems[0].key)
  const activeItem = allItems.find((item) => item.key === activeKey) ?? allItems[0]

  return (
    <div className="flex h-[340px] w-full max-w-3xl overflow-hidden rounded-md border bg-background">
      <AppRail>
        {items.map((item) => (
          <RailAction
            key={item.key}
            label={item.label}
            active={activeItem.key === item.key}
            onSelect={() => setActiveKey(item.key)}
          >
            {item.icon}
          </RailAction>
        ))}
        <div className="mt-auto">
          <RailAction
            label={settingsItem.label}
            active={activeItem.key === settingsItem.key}
            onSelect={() => setActiveKey(settingsItem.key)}
          >
            {settingsItem.icon}
          </RailAction>
        </div>
      </AppRail>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-secondary/50 p-6">
        <div className="max-w-sm space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            選択中
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
      </main>
    </div>
    )
}`,
    en: `import { AppRail, TooltipButton } from "@gunjo/ui"
import {
  IconBell as Bell,
  IconHome as Home,
  IconSearch as Search,
  IconSettings as Settings,
  IconUserCircle as UserRound,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

function RailAction(props: {
  label: string
  children: ReactNode
  active?: boolean
  onSelect: () => void
}) {
  const { label, children, active, onSelect } = props

  return (
    <TooltipButton
      type="button"
      variant="ghost"
      size="icon"
      tooltip={label}
      tooltipSide="right"
      tooltipOpenOnClick
      aria-label={label}
      aria-pressed={active}
      onClick={onSelect}
      className={[
        "h-10 w-10 text-muted hover:bg-background/10 hover:text-background",
        active ? "bg-background/20 text-background ring-1 ring-background/25" : "",
      ].join(" ")}
    >
      {children}
    </TooltipButton>
  )
}

export function AppRailExample() {
  const items = [
    {
      key: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      title: "Home",
      description: "Review recent updates, tasks, and overview metrics.",
    },
    {
      key: "search",
      label: "Search",
      icon: <Search className="h-5 w-5" />,
      title: "Search",
      description: "Find documents and actions across the workspace.",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      title: "Notifications",
      description: "Check unread notifications and important updates.",
    },
    {
      key: "account",
      label: "Account",
      icon: <UserRound className="h-5 w-5" />,
      title: "Account",
      description: "Manage profile, team, and billing settings.",
    },
  ]
  const settingsItem = {
    key: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Settings",
    description: "Adjust display, notifications, permissions, and preferences.",
  }
  const allItems = [...items, settingsItem]
  const [activeKey, setActiveKey] = useState(allItems[0].key)
  const activeItem = allItems.find((item) => item.key === activeKey) ?? allItems[0]

  return (
    <div className="flex h-[340px] w-full max-w-3xl overflow-hidden rounded-md border bg-background">
      <AppRail>
        {items.map((item) => (
          <RailAction
            key={item.key}
            label={item.label}
            active={activeItem.key === item.key}
            onSelect={() => setActiveKey(item.key)}
          >
            {item.icon}
          </RailAction>
        ))}
        <div className="mt-auto">
          <RailAction
            label={settingsItem.label}
            active={activeItem.key === settingsItem.key}
            onSelect={() => setActiveKey(settingsItem.key)}
          >
            {settingsItem.icon}
          </RailAction>
        </div>
      </AppRail>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-secondary/50 p-6">
        <div className="max-w-sm space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Selected
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
      </main>
    </div>
    )
}`,
};

const compactCodeByLocale = {
    ja: `import { AppRail, TooltipButton } from "@gunjo/ui"
import {
  IconHome as Home,
  IconSearch as Search,
  IconSettings as Settings,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

function RailAction(props: {
  label: string
  children: ReactNode
  active?: boolean
  onSelect: () => void
}) {
  const { label, children, active, onSelect } = props

  return (
    <TooltipButton
      type="button"
      variant="ghost"
      size="icon"
      tooltip={label}
      tooltipSide="right"
      tooltipOpenOnClick
      aria-label={label}
      aria-pressed={active}
      onClick={onSelect}
      className={[
        "h-10 w-10 text-muted hover:bg-background/10 hover:text-background",
        active ? "bg-background/20 text-background ring-1 ring-background/25" : "",
      ].join(" ")}
    >
      {children}
    </TooltipButton>
  )
}

export function CompactAppRailExample() {
  const items = [
    {
      key: "home",
      label: "ホーム",
      icon: <Home className="h-5 w-5" />,
      title: "ホーム",
      description: "最近の更新、タスク、概要を確認します。",
    },
    {
      key: "search",
      label: "検索",
      icon: <Search className="h-5 w-5" />,
      title: "検索",
      description: "ワークスペース全体からドキュメントや操作を探します。",
    },
  ]
  const settingsItem = {
    key: "settings",
    label: "設定",
    icon: <Settings className="h-5 w-5" />,
    title: "設定",
    description: "表示、通知、権限などの環境設定を変更します。",
  }
  const allItems = [...items, settingsItem]
  const [activeKey, setActiveKey] = useState(allItems[0].key)
  const activeItem = allItems.find((item) => item.key === activeKey) ?? allItems[0]

  return (
    <div className="flex h-[340px] w-full max-w-3xl overflow-hidden rounded-md border bg-background">
      <AppRail>
        {items.map((item) => (
          <RailAction
            key={item.key}
            label={item.label}
            active={activeItem.key === item.key}
            onSelect={() => setActiveKey(item.key)}
          >
            {item.icon}
          </RailAction>
        ))}
        <div className="mt-auto">
          <RailAction
            label={settingsItem.label}
            active={activeItem.key === settingsItem.key}
            onSelect={() => setActiveKey(settingsItem.key)}
          >
            {settingsItem.icon}
          </RailAction>
        </div>
      </AppRail>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-secondary/50 p-6">
        <div className="max-w-sm space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            選択中
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
      </main>
    </div>
  )
}`,
    en: `import { AppRail, TooltipButton } from "@gunjo/ui"
import {
  IconHome as Home,
  IconSearch as Search,
  IconSettings as Settings,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

function RailAction(props: {
  label: string
  children: ReactNode
  active?: boolean
  onSelect: () => void
}) {
  const { label, children, active, onSelect } = props

  return (
    <TooltipButton
      type="button"
      variant="ghost"
      size="icon"
      tooltip={label}
      tooltipSide="right"
      tooltipOpenOnClick
      aria-label={label}
      aria-pressed={active}
      onClick={onSelect}
      className={[
        "h-10 w-10 text-muted hover:bg-background/10 hover:text-background",
        active ? "bg-background/20 text-background ring-1 ring-background/25" : "",
      ].join(" ")}
    >
      {children}
    </TooltipButton>
  )
}

export function CompactAppRailExample() {
  const items = [
    {
      key: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      title: "Home",
      description: "Review recent updates, tasks, and overview metrics.",
    },
    {
      key: "search",
      label: "Search",
      icon: <Search className="h-5 w-5" />,
      title: "Search",
      description: "Find documents and actions across the workspace.",
    },
  ]
  const settingsItem = {
    key: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Settings",
    description: "Adjust display, notifications, permissions, and preferences.",
  }
  const allItems = [...items, settingsItem]
  const [activeKey, setActiveKey] = useState(allItems[0].key)
  const activeItem = allItems.find((item) => item.key === activeKey) ?? allItems[0]

  return (
    <div className="flex h-[340px] w-full max-w-3xl overflow-hidden rounded-md border bg-background">
      <AppRail>
        {items.map((item) => (
          <RailAction
            key={item.key}
            label={item.label}
            active={activeItem.key === item.key}
            onSelect={() => setActiveKey(item.key)}
          >
            {item.icon}
          </RailAction>
        ))}
        <div className="mt-auto">
          <RailAction
            label={settingsItem.label}
            active={activeItem.key === settingsItem.key}
            onSelect={() => setActiveKey(settingsItem.key)}
          >
            {settingsItem.icon}
          </RailAction>
        </div>
      </AppRail>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-secondary/50 p-6">
        <div className="max-w-sm space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Selected
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
      </main>
    </div>
  )
}`,
};

export default function AppRailDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = codeByLocale[locale];

    const compactCode = compactCodeByLocale[locale];

    return (
        <ComponentLayout
            title={navigationMetadata.appRail.title}
            description={navigationMetadata.appRail.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "AppRail", href: "/docs/components/app-rail" },
                { name: "DocNote", href: "/docs/components/doc-note" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "Header", href: "/docs/components/header" },
                { name: "NavigationMenu", href: "/docs/components/navigation-menu" },
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "RightRail", href: "/docs/components/right-rail" },
                { name: "Tabs", href: "/docs/components/tabs" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="xl"
                previewHeight="auto"
            >
                <AppRailExample />
            </ComponentPreview>

            <DocNote heading={isJa ? "向きの責務" : "Orientation responsibility"}>
                {isJa
                    ? "AppRail はアプリ左端に固定する縦方向のプライマリナビゲーションです。横方向のナビゲーションが必要な場合は Header、NavigationMenu、Tabs などを使います。"
                    : "AppRail is the vertical primary navigation rail for the left edge of an app. Use Header, NavigationMenu, or Tabs for horizontal navigation."}
            </DocNote>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "primary-actions",
                            title: isJa ? "主要ナビゲーション" : "Primary navigation",
                            description: isJa
                                ? "アプリ全体の移動先をアイコンボタンで縦に並べます。アイコンのみのため、ツールチップと aria-label を必ず合わせます。"
                                : "Use icon buttons for app-level destinations. Because labels are hidden, pair every icon with a tooltip and aria-label.",
                            preview: <AppRailExample />,
                            previewBodyWidth: "xl",
                            code,
                        },
                        {
                            key: "compact",
                            title: isJa ? "少数アクション" : "Compact actions",
                            description: isJa
                                ? "アクションが少ない場合も、設定などの補助操作は下端に寄せて役割を分けます。"
                                : "When there are only a few actions, keep secondary actions pinned to the bottom.",
                            preview: <AppRailExample compact />,
                            previewBodyWidth: "lg",
                            code: compactCode,
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
                            name: "className",
                            type: "string",
                            description: isJa ? "レール本体に追加するクラス名。" : "Additional class names for the rail.",
                        },
                        {
                            name: "children",
                            type: "React.ReactNode",
                            description: isJa ? "レール内に配置するナビゲーションや操作。" : "Navigation actions rendered inside the rail.",
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>器と中身を分ける。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AppRail</code> が持つのは幅64px・地色・縦並びだけです。項目は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">TooltipButton</code> を並べて作ります。項目の見た目や当たり判定を器の側で決め打ちしないので、通知の点を足すのも、下端に別の一群を置くのも呼ぶ側でできます。
                        </li>
                        <li>
                            <strong>アイコンだけの並びに、必ず名前を付ける。</strong>見本では項目ごとに <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> と、右側に出るツールチップを付けています。この並びではアイコンは飾りではなく唯一のラベルなので、名前が無いと読み上げでも触っただけでも何の項目か分かりません。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipOpenOnClick</code> を付けているのは、触る画面でも名前を出せるようにするためです。
                        </li>
                        <li>
                            <strong>いまいる場所を、色以外でも出す。</strong>選択中の項目には <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> を付け、見た目は背景の明るさと細い輪郭の2つで示します。地色が暗いので、明るさの差だけに頼らない形にしています。幅で切り替える3段の考え方（狭い画面は下の並び、広い画面は横の並び）は資料に書いてあります。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/app-rail"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: アプリレール（App Rail）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Keep the shell and the items apart.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AppRail</code> owns only the 64px width, the dark ground, and the vertical stack. Items are composed from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">TooltipButton</code>. Because the shell does not dictate item shape or hit area, callers can add an unread dot or park a second group at the bottom without fighting it.
                        </li>
                        <li>
                            <strong>An icon-only column still needs names.</strong> Every item in the demo carries an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> and a tooltip on the right. Here the icon is not decoration, it is the only label, so without a name neither a screen reader nor a touch user can tell what the item does. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltipOpenOnClick</code> is set so the name is reachable on touch as well.
                        </li>
                        <li>
                            <strong>Show the current place with more than colour.</strong> The selected item gets <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code>, and visually it is marked by both a lighter background and a thin ring. The ground is dark, so brightness alone is not enough. The three-step responsive strategy (bottom bar, rail, sidebar) is covered in the article.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/app-rail"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: App Rail (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
