"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { Avatar, AvatarFallback, Button, Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarProvider, SidebarToggle, useSidebar } from "@gunjo/ui";
import {
    IconChartBar as BarChart3,
    IconHome as Home,
    IconLayoutKanban as FolderKanban,
    IconSettings as Settings,
} from "@tabler/icons-react";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const NAV_ITEMS = [
    { id: "home", label: { ja: "ホーム", en: "Home" }, icon: Home },
    { id: "projects", label: { ja: "プロジェクト", en: "Projects" }, icon: FolderKanban },
    { id: "reports", label: { ja: "レポート", en: "Reports" }, icon: BarChart3 },
    { id: "settings", label: { ja: "設定", en: "Settings" }, icon: Settings },
] as const;

function SidebarContent({
    initialActive = "projects",
    togglePlacement,
}: {
    initialActive?: string;
    togglePlacement?: "center" | "header" | "footer";
}) {
    const { locale } = useLocale();
    const { collapsed } = useSidebar();
    const [activeId, setActiveId] = React.useState(initialActive);
    const isJa = locale === "ja";

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                    G
                </div>
                {!collapsed ? <span className="truncate text-sm font-semibold">Gunjo UI</span> : null}
            </SidebarHeader>
            <SidebarBody>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <SidebarItem
                            key={item.id}
                            id={item.id}
                            icon={<Icon className="h-4 w-4 shrink-0" />}
                            label={item.label[locale]}
                            isActive={activeId === item.id}
                            onClick={() => setActiveId(item.id)}
                            reserveChevronSpace={false}
                        />
                    );
                })}
            </SidebarBody>
            <SidebarFooter>
                <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback>UI</AvatarFallback>
                </Avatar>
                {!collapsed ? <span className="min-w-0 flex-1 truncate text-sm">{isJa ? "デザインチーム" : "Design team"}</span> : null}
            </SidebarFooter>
            <SidebarToggle
                placement={togglePlacement}
                expandLabel={isJa ? "サイドバーを展開" : "Expand sidebar"}
                collapseLabel={isJa ? "サイドバーを折りたたむ" : "Collapse sidebar"}
            />
        </Sidebar>
    );
}

function SidebarExample({
    defaultCollapsed = false,
    togglePlacement,
}: {
    defaultCollapsed?: boolean;
    togglePlacement?: "center" | "header" | "footer";
}) {
    const { locale } = useLocale();

    return (
        <div className="flex w-full overflow-hidden rounded-md border bg-background">
            <SidebarProvider defaultCollapsed={defaultCollapsed}>
                <SidebarContent
                    initialActive={defaultCollapsed ? "home" : "projects"}
                    togglePlacement={togglePlacement}
                />
            </SidebarProvider>
            <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                {locale === "ja" ? "メインコンテンツ" : "Main content"}
            </main>
        </div>
    );
}

/** 開閉をアプリ側の state で持つ形。サイドバーの外にも開閉の入口が置けます。 */
function ControlledSidebarExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setCollapsed((value) => !value)}>
                    {collapsed
                        ? isJa
                            ? "サイドバーを開く"
                            : "Open the sidebar"
                        : isJa
                          ? "サイドバーを畳む"
                          : "Collapse the sidebar"}
                </Button>
                <span className="text-sm text-muted-foreground">
                    {isJa
                        ? `いまの状態: ${collapsed ? "畳んでいる" : "開いている"}`
                        : `State: ${collapsed ? "collapsed" : "expanded"}`}
                </span>
            </div>
            <div className="flex w-full overflow-hidden rounded-md border bg-background">
                <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
                    <SidebarContent />
                </SidebarProvider>
                <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                    {isJa ? "メインコンテンツ" : "Main content"}
                </main>
            </div>
        </div>
    );
}

const codeByLocale = {
    ja: `import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarToggle,
  useSidebar,
} from "@gunjo/ui"
import {
  IconChartBar as BarChart3,
  IconHome as Home,
  IconLayoutKanban as FolderKanban,
  IconSettings as Settings,
} from "@tabler/icons-react"

const navItems = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "projects", label: "プロジェクト", icon: FolderKanban },
  { id: "reports", label: "レポート", icon: BarChart3 },
  { id: "settings", label: "設定", icon: Settings },
]

function SidebarContent() {
  const { collapsed } = useSidebar()
  const [activeId, setActiveId] = React.useState("projects")

  return (
    <Sidebar className="min-h-[360px]">
      <SidebarHeader>
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">G</div>
        {!collapsed ? <span className="truncate text-sm font-semibold">Gunjo UI</span> : null}
      </SidebarHeader>
      <SidebarBody>
        {/* SidebarItem reads the collapse from the provider: the row goes
            icon-only and its label moves into a tooltip on its own. */}
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <SidebarItem
              key={item.id}
              id={item.id}
              icon={<Icon className="h-4 w-4 shrink-0" />}
              label={item.label}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
              reserveChevronSpace={false}
            />
          )
        })}
      </SidebarBody>
      <SidebarFooter>
        <Avatar className="h-7 w-7 shrink-0"><AvatarFallback>UI</AvatarFallback></Avatar>
        {!collapsed ? <span className="min-w-0 flex-1 truncate text-sm">デザインチーム</span> : null}
      </SidebarFooter>
      <SidebarToggle
        expandLabel="サイドバーを展開"
        collapseLabel="サイドバーを折りたたむ"
      />
    </Sidebar>
  )
}

export function SidebarLayout() {
  return (
    <div className="flex overflow-hidden rounded-md border bg-background">
      <SidebarProvider>
        <SidebarContent />
      </SidebarProvider>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">
        メインコンテンツ
      </main>
    </div>
  )
}`,
    en: `import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarToggle,
  useSidebar,
} from "@gunjo/ui"
import {
  IconChartBar as BarChart3,
  IconHome as Home,
  IconLayoutKanban as FolderKanban,
  IconSettings as Settings,
} from "@tabler/icons-react"

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

function SidebarContent() {
  const { collapsed } = useSidebar()
  const [activeId, setActiveId] = React.useState("projects")

  return (
    <Sidebar className="min-h-[360px]">
      <SidebarHeader>
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">G</div>
        {!collapsed ? <span className="truncate text-sm font-semibold">Gunjo UI</span> : null}
      </SidebarHeader>
      <SidebarBody>
        {/* SidebarItem reads the collapse from the provider: the row goes
            icon-only and its label moves into a tooltip on its own. */}
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <SidebarItem
              key={item.id}
              id={item.id}
              icon={<Icon className="h-4 w-4 shrink-0" />}
              label={item.label}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
              reserveChevronSpace={false}
            />
          )
        })}
      </SidebarBody>
      <SidebarFooter>
        <Avatar className="h-7 w-7 shrink-0"><AvatarFallback>UI</AvatarFallback></Avatar>
        {!collapsed ? <span className="min-w-0 flex-1 truncate text-sm">Design team</span> : null}
      </SidebarFooter>
      <SidebarToggle
        expandLabel="Expand sidebar"
        collapseLabel="Collapse sidebar"
      />
    </Sidebar>
  )
}

export function SidebarLayout() {
  return (
    <div className="flex overflow-hidden rounded-md border bg-background">
      <SidebarProvider>
        <SidebarContent />
      </SidebarProvider>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">
        Main content
      </main>
    </div>
  )
}`,
};

const togglePlacementCodeByLocale = {
    ja: `import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarToggle,
} from "@gunjo/ui"
import { IconHome as Home } from "@tabler/icons-react"

export function SidebarWithHeaderToggle() {
  return (
    <div className="flex overflow-hidden rounded-md border bg-background">
      <SidebarProvider>
        <Sidebar className="min-h-[360px]">
          <SidebarHeader>
            <span className="truncate text-sm font-semibold">Gunjo UI</span>
          </SidebarHeader>
          <SidebarBody>
            <SidebarItem
              id="home"
              icon={<Home className="h-4 w-4 shrink-0" />}
              label="ホーム"
              isActive
              reserveChevronSpace={false}
            />
          </SidebarBody>
          {/* 既定は footer。フッターを置かない画面では header か center に寄せます。 */}
          <SidebarToggle
            placement="header"
            expandLabel="サイドバーを展開"
            collapseLabel="サイドバーを折りたたむ"
          />
        </Sidebar>
      </SidebarProvider>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">
        メインコンテンツ
      </main>
    </div>
  )
}`,
    en: `import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarToggle,
} from "@gunjo/ui"
import { IconHome as Home } from "@tabler/icons-react"

export function SidebarWithHeaderToggle() {
  return (
    <div className="flex overflow-hidden rounded-md border bg-background">
      <SidebarProvider>
        <Sidebar className="min-h-[360px]">
          <SidebarHeader>
            <span className="truncate text-sm font-semibold">Gunjo UI</span>
          </SidebarHeader>
          <SidebarBody>
            <SidebarItem
              id="home"
              icon={<Home className="h-4 w-4 shrink-0" />}
              label="Home"
              isActive
              reserveChevronSpace={false}
            />
          </SidebarBody>
          {/* Defaults to footer; move it to header or center when there is no footer. */}
          <SidebarToggle
            placement="header"
            expandLabel="Expand sidebar"
            collapseLabel="Collapse sidebar"
          />
        </Sidebar>
      </SidebarProvider>
      <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">
        Main content
      </main>
    </div>
  )
}`,
};

const controlledCodeByLocale = {
    ja: `import * as React from "react"
import {
  Button,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
} from "@gunjo/ui"
import { IconHome as Home } from "@tabler/icons-react"

export function ControlledSidebarLayout() {
  // 開閉をアプリ側で持つと、サイドバーの外にも入口が置け、
  // 保存した値や画面幅から初期値を決められます。
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" size="sm" onClick={() => setCollapsed((v) => !v)}>
        {collapsed ? "サイドバーを開く" : "サイドバーを畳む"}
      </Button>
      <div className="flex overflow-hidden rounded-md border bg-background">
        <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
          <Sidebar className="min-h-[360px]">
            <SidebarHeader>
              <span className="truncate text-sm font-semibold">Gunjo UI</span>
            </SidebarHeader>
            <SidebarBody>
              <SidebarItem
                id="home"
                icon={<Home className="h-4 w-4 shrink-0" />}
                label="ホーム"
                isActive
                reserveChevronSpace={false}
              />
            </SidebarBody>
          </Sidebar>
        </SidebarProvider>
        <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">
          メインコンテンツ
        </main>
      </div>
    </div>
  )
}`,
    en: `import * as React from "react"
import {
  Button,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
} from "@gunjo/ui"
import { IconHome as Home } from "@tabler/icons-react"

export function ControlledSidebarLayout() {
  // Owning the state lets you put a second control outside the rail and
  // seed it from a saved preference or the current viewport width.
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" size="sm" onClick={() => setCollapsed((v) => !v)}>
        {collapsed ? "Open the sidebar" : "Collapse the sidebar"}
      </Button>
      <div className="flex overflow-hidden rounded-md border bg-background">
        <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
          <Sidebar className="min-h-[360px]">
            <SidebarHeader>
              <span className="truncate text-sm font-semibold">Gunjo UI</span>
            </SidebarHeader>
            <SidebarBody>
              <SidebarItem
                id="home"
                icon={<Home className="h-4 w-4 shrink-0" />}
                label="Home"
                isActive
                reserveChevronSpace={false}
              />
            </SidebarBody>
          </Sidebar>
        </SidebarProvider>
        <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-sm text-muted-foreground">
          Main content
        </main>
      </div>
    </div>
  )
}`,
};

export default function SidebarPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const usageCode = codeByLocale[locale];
    const collapsedCode = usageCode.replace("<SidebarProvider>", "<SidebarProvider defaultCollapsed>");

    return (
        <ComponentLayout
            title={isJa ? "サイドバー" : navigationMetadata.sidebar.title}
            description={isJa ? "アプリやドキュメントの左側に主要ナビゲーションをまとめ、必要に応じてアイコン幅へ折りたためるサイドナビゲーションです。" : navigationMetadata.sidebar.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "SidebarToggle", href: "/docs/components/sidebar" },
                { name: "Avatar", href: "/docs/components/avatar" },
            ]}
            relatedComponents={[
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "RightRail", href: "/docs/components/right-rail" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: サイドバー（Sidebar）" : "UIXHERO: Sidebar (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/sidebar`,
                },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto">
                <SidebarExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "collapsed",
                            title: isJa ? "折りたたみ初期表示" : "Initially collapsed",
                            description: isJa ? "狭い画面や補助ナビでは、アイコンだけで始めて必要に応じて展開できます。" : "Start collapsed for narrow layouts or supporting navigation, then let users expand it.",
                            preview: <SidebarExample defaultCollapsed />,
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: collapsedCode,
                        },
                        {
                            key: "toggle-placement",
                            title: isJa ? "トグルを置く高さを変える" : "Moving the toggle",
                            description: isJa
                                ? "トグルは境界線の上に浮かせてあり、本文やフッターの幅を取りません。既定はフッターの上端ですが、フッターを置かない画面では header か center に寄せます。"
                                : "The toggle floats on the boundary and takes no layout width. It sits above the footer by default; move it to header or center when the rail has no footer.",
                            preview: <SidebarExample togglePlacement="header" />,
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: togglePlacementCodeByLocale[locale],
                        },
                        {
                            key: "controlled",
                            title: isJa ? "開閉をアプリ側で持つ" : "Owning the collapse in app state",
                            description: isJa
                                ? "collapsed と onCollapsedChange を渡すと、開閉の持ち主がアプリになります。保存した値から復元したい、サイドバーの外にも開閉の入口を置きたい、というときはこちらです。"
                                : "Passing collapsed and onCollapsedChange hands ownership to the app — for restoring a saved preference, or putting a second control outside the rail.",
                            preview: <ControlledSidebarExample />,
                            previewBodyWidth: "full",
                            previewHeight: "auto",
                            code: controlledCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "Sidebar", type: "aside", description: isJa ? "レールそのもの。フレックス／グリッド親の高さいっぱいに自分で伸びます（240px ⇄ 折りたたみ 60px）。ブロック親に置く場合だけ高さを明示してください。" : "The rail itself (240px, 60px collapsed). It stretches to fill a flex or grid parent on its own; give it an explicit height only when the parent is a block container." },
                        { name: "SidebarProvider.defaultCollapsed", type: "boolean", default: "false", description: isJa ? "非制御時の初期折りたたみ状態。" : "Initial collapsed state for uncontrolled sidebars." },
                        { name: "SidebarProvider.collapsed", type: "boolean", description: isJa ? "折りたたみ状態を外部 state で制御します。" : "Controls the collapsed state from app state." },
                        { name: "SidebarProvider.onCollapsedChange", type: "(collapsed: boolean) => void", description: isJa ? "折りたたみ状態が変わった時に呼ばれます。" : "Called when the collapsed state changes." },
                        { name: "useSidebar()", type: "{ collapsed, setCollapsed, toggleCollapsed }", description: isJa ? "子孫コンポーネントからサイドバー状態を読み書きします。プロバイダ外で呼ぶと例外になります。" : "Reads and updates sidebar state from descendants. Throws outside a provider." },
                        { name: "useSidebarCollapsed()", type: "boolean | null", description: isJa ? "最も近い SidebarProvider の折りたたみ状態。プロバイダが無ければ null を返し、例外は投げません。サイドバーの内外どちらでも成立する部品向け。" : "Collapsed state of the nearest provider, or null when there is none. Does not throw, for components that are valid both inside and outside a sidebar." },
                        { name: "SidebarToggle", type: "button", description: isJa ? "サイドバー境界線上に配置する折りたたみトグル。フッターや本文のレイアウト幅を消費しません。" : "Boundary toggle for collapsing the sidebar without consuming footer or body layout space." },
                        { name: "SidebarToggle.expandLabel", type: "ReactNode", default: "\"Expand sidebar\"", description: isJa ? "折りたたみ時に表示するツールチップと aria-label。" : "Tooltip and aria-label shown when the sidebar is collapsed." },
                        { name: "SidebarToggle.collapseLabel", type: "ReactNode", default: "\"Collapse sidebar\"", description: isJa ? "展開時に表示するツールチップと aria-label。" : "Tooltip and aria-label shown when the sidebar is expanded." },
                        { name: "SidebarToggle.placement", type: "\"center\" | \"header\" | \"footer\"", default: "\"footer\"", description: isJa ? "トグルを置く境界線位置。既定ではフッター上端と右境界線の交点に置きます。" : "Boundary position for the toggle. Defaults to the intersection of the footer top edge and right edge." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
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
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>畳んだ幅を60pxに固定した。</strong>資料は「畳んだときはアイコンだけを出し、ホバーで補足を出す。アイコンの無い項目に畳みは使わない」を挙げています。GUNJO は240pxと60pxの2つだけを持ち、その間の幅を作れないようにしました。60pxはアイコン1つと左右の余白でちょうど埋まる幅なので、「ラベルが半分だけ見える」中途半端な状態が作れません。畳んだときの補足は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> が吹き出しで出します。
                        </li>
                        <li>
                            <strong>畳みの状態は文脈で配るが、文脈が無くても壊れない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarProvider</code> が状態を持ち、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarHeader</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarFooter</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> が同じ状態を読んで自分で詰めます。ただし <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">useSidebarCollapsed</code> はプロバイダが無いとき例外を投げずに空を返します。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> はサイドバーの外（設定画面の一覧など）でも使う部品なので、そのために毎回プロバイダで包ませるのを避けました（#692）。
                        </li>
                        <li>
                            <strong>現在地の印は項目の側が持つ。</strong>資料が求める <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-current</code> は、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">isActive</code> を渡した <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> が付けます。開いている親の行は、子の塗りと二重にならないように別の見た目（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">isCurrentAncestor</code>）にしてあります。資料が挙げる「モバイルではサイドバーを Sheet に置き換える」は部品に入っていないので、いまは画面の側で出し分けます。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The collapsed width is pinned at 60px.</strong> The article asks that a collapsed rail show icons only, reveal labels on hover, and never collapse items that have no icon. GUNJO offers exactly two widths, 240px and 60px, with nothing in between. 60px is filled by one icon and its padding, so a half-visible label is not a state you can reach. The hover label comes from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> as a tooltip.
                        </li>
                        <li>
                            <strong>Collapse is shared through context, but the context is optional.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarProvider</code> holds the state and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarHeader</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarFooter</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> read it and tighten themselves. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">useSidebarCollapsed</code> returns empty instead of throwing when there is no provider, because <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> is also used outside a sidebar, for instance in a settings list, and forcing every such caller to wrap it would be the wrong trade (#692).
                        </li>
                        <li>
                            <strong>The current-page marker belongs to the item.</strong> The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-current</code> the article requires is applied by a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SidebarItem</code> given <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">isActive</code>. An expanded parent on the active path uses a different treatment (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">isCurrentAncestor</code>) so two solid fills do not stack. Replacing the sidebar with a Sheet on mobile, which the article recommends, is not built in and is still decided by the screen.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
