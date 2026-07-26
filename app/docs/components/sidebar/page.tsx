"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { Avatar, AvatarFallback, Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarProvider, SidebarToggle, useSidebar } from "@gunjo/ui";
import {
    IconChartBar as BarChart3,
    IconHome as Home,
    IconLayoutKanban as FolderKanban,
    IconSettings as Settings,
} from "@tabler/icons-react";

const NAV_ITEMS = [
    { id: "home", label: { ja: "ホーム", en: "Home" }, icon: Home },
    { id: "projects", label: { ja: "プロジェクト", en: "Projects" }, icon: FolderKanban },
    { id: "reports", label: { ja: "レポート", en: "Reports" }, icon: BarChart3 },
    { id: "settings", label: { ja: "設定", en: "Settings" }, icon: Settings },
] as const;

function SidebarContent({ initialActive = "projects" }: { initialActive?: string }) {
    const { locale } = useLocale();
    const { collapsed } = useSidebar();
    const [activeId, setActiveId] = React.useState(initialActive);
    const isJa = locale === "ja";

    return (
        <Sidebar className="min-h-[360px]">
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
                expandLabel={isJa ? "サイドバーを展開" : "Expand sidebar"}
                collapseLabel={isJa ? "サイドバーを折りたたむ" : "Collapse sidebar"}
            />
        </Sidebar>
    );
}

function SidebarExample({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
    const { locale } = useLocale();

    return (
        <div className="flex w-full overflow-hidden rounded-md border bg-background">
            <SidebarProvider defaultCollapsed={defaultCollapsed}>
                <SidebarContent initialActive={defaultCollapsed ? "home" : "projects"} />
            </SidebarProvider>
            <main className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                {locale === "ja" ? "メインコンテンツ" : "Main content"}
            </main>
        </div>
    );
}

export default function SidebarPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
const code = `import * as React from "react"
import { Avatar, AvatarFallback, Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarProvider, SidebarToggle, useSidebar } from "@gunjo/ui"
import { IconChartBar as BarChart3, IconHome as Home, IconLayoutKanban as FolderKanban, IconSettings as Settings } from "@tabler/icons-react"

const navItems = [
  { id: "home", label: "${isJa ? "ホーム" : "Home"}", icon: Home },
  { id: "projects", label: "${isJa ? "プロジェクト" : "Projects"}", icon: FolderKanban },
  { id: "reports", label: "${isJa ? "レポート" : "Reports"}", icon: BarChart3 },
  { id: "settings", label: "${isJa ? "設定" : "Settings"}", icon: Settings },
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
        {!collapsed ? <span className="min-w-0 flex-1 truncate text-sm">${isJa ? "デザインチーム" : "Design team"}</span> : null}
      </SidebarFooter>
      <SidebarToggle
        expandLabel="${isJa ? "サイドバーを展開" : "Expand sidebar"}"
        collapseLabel="${isJa ? "サイドバーを折りたたむ" : "Collapse sidebar"}"
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
        ${isJa ? "メインコンテンツ" : "Main content"}
      </main>
    </div>
  )
}`;
    const collapsedCode = code.replace("<SidebarProvider>", "<SidebarProvider defaultCollapsed>");

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
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto">
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
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
