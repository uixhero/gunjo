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

export default function AppRailDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { AppRail, TooltipButton } from "@gunjo/ui"
import { IconBell as Bell, IconHome as Home, IconSearch as Search, IconSettings as Settings, IconUserCircle as UserRound } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

function RailAction({
  label,
  children,
  active,
  onSelect,
}: {
  label: string
  children: ReactNode
  active?: boolean
  onSelect: () => void
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
      label: "${isJa ? "ホーム" : "Home"}",
      icon: <Home className="h-5 w-5" />,
      title: "${isJa ? "ホーム" : "Home"}",
      description: "${isJa ? "最近の更新、タスク、概要を確認します。" : "Review recent updates, tasks, and overview metrics."}",
    },
    {
      key: "search",
      label: "${isJa ? "検索" : "Search"}",
      icon: <Search className="h-5 w-5" />,
      title: "${isJa ? "検索" : "Search"}",
      description: "${isJa ? "ワークスペース全体からドキュメントや操作を探します。" : "Find documents and actions across the workspace."}",
    },
    {
      key: "notifications",
      label: "${isJa ? "通知" : "Notifications"}",
      icon: <Bell className="h-5 w-5" />,
      title: "${isJa ? "通知" : "Notifications"}",
      description: "${isJa ? "未読通知と重要な更新を確認します。" : "Check unread notifications and important updates."}",
    },
    {
      key: "account",
      label: "${isJa ? "アカウント" : "Account"}",
      icon: <UserRound className="h-5 w-5" />,
      title: "${isJa ? "アカウント" : "Account"}",
      description: "${isJa ? "プロフィール、チーム、請求情報を管理します。" : "Manage profile, team, and billing settings."}",
    },
  ]
  const settingsItem = {
    key: "settings",
    label: "${isJa ? "設定" : "Settings"}",
    icon: <Settings className="h-5 w-5" />,
    title: "${isJa ? "設定" : "Settings"}",
    description: "${isJa ? "表示、通知、権限などの環境設定を変更します。" : "Adjust display, notifications, permissions, and preferences."}",
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
            ${isJa ? "選択中" : "Selected"}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
      </main>
    </div>
    )
}`;

    const compactCode = `import { AppRail, TooltipButton } from "@gunjo/ui"
import { IconHome as Home, IconSearch as Search, IconSettings as Settings } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

function RailAction({
  label,
  children,
  active,
  onSelect,
}: {
  label: string
  children: ReactNode
  active?: boolean
  onSelect: () => void
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
      label: "${isJa ? "ホーム" : "Home"}",
      icon: <Home className="h-5 w-5" />,
      title: "${isJa ? "ホーム" : "Home"}",
      description: "${isJa ? "最近の更新、タスク、概要を確認します。" : "Review recent updates, tasks, and overview metrics."}",
    },
    {
      key: "search",
      label: "${isJa ? "検索" : "Search"}",
      icon: <Search className="h-5 w-5" />,
      title: "${isJa ? "検索" : "Search"}",
      description: "${isJa ? "ワークスペース全体からドキュメントや操作を探します。" : "Find documents and actions across the workspace."}",
    },
  ]
  const settingsItem = {
    key: "settings",
    label: "${isJa ? "設定" : "Settings"}",
    icon: <Settings className="h-5 w-5" />,
    title: "${isJa ? "設定" : "Settings"}",
    description: "${isJa ? "表示、通知、権限などの環境設定を変更します。" : "Adjust display, notifications, permissions, and preferences."}",
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
            ${isJa ? "選択中" : "Selected"}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {activeItem.description}
          </p>
        </div>
      </main>
    </div>
  )
}`;

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
        </ComponentLayout>
    );
}
