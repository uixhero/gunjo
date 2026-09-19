"use client";

import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconLayoutDashboard as LayoutDashboard,
    IconSettings as Settings,
    IconUser as User,
} from "@tabler/icons-react";
import { Button, Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DashboardTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconSettings as Settings, IconUser as User } from "@tabler/icons-react";

export function DashboardPage() {
  return (
    <DashboardTemplate
        header={
            <div className="flex h-16 items-center px-6">
                <div className="font-bold">Dashboard</div>
            </div>
        }
        sidebarHeader={<div className="font-semibold">Acme</div>}
        // Pass the rows themselves. The template supplies the provider, the
        // collapsible rail, and the sheet that opens the same rows on phones.
        sidebar={
            <>
                <SidebarItem icon={<LayoutDashboard size={20} />} isActive={true} onClick={() => {}} id="overview" label="Overview" />
                <SidebarItem icon={<User size={20} />} isActive={false} onClick={() => {}} id="customers" label="Customers" />
                <SidebarItem icon={<Settings size={20} />} isActive={false} onClick={() => {}} id="settings" label="Settings" />
            </>
        }
        sidebarFooter={<div className="text-sm text-muted-foreground">hikaby</div>}
    >
        <h2 className="text-3xl font-bold">Overview</h2>
        {/* Dashboard Content */}
    </DashboardTemplate>
  )
}`;

const propsData = [
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the top header section. On small screens the button that opens the navigation sheet sits to its left.",
    },
    {
        name: "sidebar",
        type: "React.ReactNode",
        description: "The navigation rows themselves — normally SidebarItems. The template owns the provider, the collapsible desktop rail, and the small-screen sheet, so pass rows rather than a sidebar of your own.",
    },
    {
        name: "sidebarHeader",
        type: "React.ReactNode",
        description: "Brand or workspace switcher, pinned above the rows.",
    },
    {
        name: "sidebarFooter",
        type: "React.ReactNode",
        description: "Account menu or similar, pinned below the rows.",
    },
    {
        name: "collapsible",
        type: "boolean",
        default: "true",
        description: "Show the collapse control on the desktop rail. Collapsed rows become icon-only with their label in a tooltip.",
    },
    {
        name: "defaultCollapsed",
        type: "boolean",
        description: "Initial collapsed state when uncontrolled.",
    },
    {
        name: "collapsed",
        type: "boolean",
        description: "Controlled collapsed state of the desktop rail.",
    },
    {
        name: "onCollapsedChange",
        type: "(collapsed: boolean) => void",
        description: "Called when the rail is collapsed or expanded.",
    },
    {
        name: "navLabel",
        type: "string",
        description: "Accessible name for the nav region, its open control, and the sheet. Defaults to the active locale's wording.",
    },
    {
        name: "navOpen",
        type: "boolean",
        description: "Controlled open state of the small-screen navigation sheet.",
    },
    {
        name: "onNavOpenChange",
        type: "(open: boolean) => void",
        description: "Called when the navigation sheet opens or closes.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area of the dashboard. It scrolls independently; the shell itself is viewport height.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container. Override the height here when embedding the template in a fixed-size box.",
    }
];

export default function DashboardPage() {
    const { locale } = useLocale();

    const rows = (
        <>
            <SidebarItem id="overview" label={locale === "ja" ? "概要" : "Overview"} icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
            <SidebarItem id="customers" label={locale === "ja" ? "顧客" : "Customers"} icon={<User size={20} />} isActive={false} onClick={() => {}} />
            <SidebarItem id="settings" label={locale === "ja" ? "設定" : "Settings"} icon={<Settings size={20} />} isActive={false} onClick={() => {}} />
        </>
    );

    const dashboardHeader = (
        <div className="flex h-16 w-full items-center px-6 font-semibold">
            {locale === "ja" ? "概要" : "Overview"}
        </div>
    );

    const summary = (
        <div className="grid gap-4 sm:grid-cols-2">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{locale === "ja" ? "今月の売上" : "Revenue this month"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{locale === "ja" ? "452万円" : "$45,231"}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{locale === "ja" ? "契約数" : "Subscriptions"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">2,350</p>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <ComponentLayout
            title={patternsMetadata.dashboardTemplate.title}
            description={patternsMetadata.dashboardTemplate.description}
            usedComponents={[
                { name: "DashboardTemplate", href: "/docs/components/dashboard" },
                { name: "Sidebar", href: "/docs/components/sidebar" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "Sheet", href: "/docs/components/sheet" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Card", href: "/docs/components/card" },
            ]}
            relatedComponents={[
                { name: "SettingsTemplate", href: "/docs/components/settings" },
                { name: "KanbanTemplate", href: "/docs/components/kanban" },
                { name: "AppRail", href: "/docs/components/app-rail" },
                { name: "PageHeader", href: "/docs/components/page-header" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/dashboard" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <DashboardTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "左のレールは collapsible・defaultCollapsed・collapsed の3つで畳み方が決まり、sidebarHeader と sidebarFooter で上下に固定する枠が決まります。行そのものは sidebar に渡します。"
                        : "collapsible, defaultCollapsed, and collapsed decide how the rail folds; sidebarHeader and sidebarFooter pin content above and below the rows. The rows themselves go to sidebar."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "collapsed-rail",
                            title: locale === "ja" ? "畳んだ状態で開く" : "Starts collapsed",
                            description: locale === "ja"
                                ? "defaultCollapsed を渡すと、レールが記号だけの細い形で始まります。文字は指を置いたときに出ます。本文を広く使いたい画面向けです。"
                                : "Pass defaultCollapsed and the rail starts as a narrow icon-only strip, with labels in tooltips. Use it when the body needs the room.",
                            preview: (
                                <DashboardTemplate className="h-auto" defaultCollapsed header={dashboardHeader} sidebar={rows}>
                                    {summary}
                                </DashboardTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconUser as User } from "@tabler/icons-react";

export function CollapsedDashboard() {
  return (
    <DashboardTemplate
      className="h-auto"
      defaultCollapsed
      header={<div className="flex h-16 w-full items-center px-6 font-semibold">概要</div>}
      sidebar={
        <>
          <SidebarItem id="overview" label="概要" icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
          <SidebarItem id="customers" label="顧客" icon={<User size={20} />} isActive={false} onClick={() => {}} />
        </>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">今月の売上</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">452万円</p>
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
}`
                                : `import { Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconUser as User } from "@tabler/icons-react";

export function CollapsedDashboard() {
  return (
    <DashboardTemplate
      className="h-auto"
      defaultCollapsed
      header={<div className="flex h-16 w-full items-center px-6 font-semibold">Overview</div>}
      sidebar={
        <>
          <SidebarItem id="overview" label="Overview" icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
          <SidebarItem id="customers" label="Customers" icon={<User size={20} />} isActive={false} onClick={() => {}} />
        </>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Revenue this month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$45,231</p>
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
}`,
                        },
                        {
                            key: "fixed-rail",
                            title: locale === "ja" ? "畳めないレール" : "A rail that does not fold",
                            description: locale === "ja"
                                ? "collapsible={false} にすると畳む操作が消え、レールは開いたままになります。行き先が少なく、迷わせたくない画面で使います。"
                                : "With collapsible={false} the fold control disappears and the rail stays open. Use it when there are few destinations and no reason to hide them.",
                            preview: (
                                <DashboardTemplate className="h-auto" collapsible={false} header={dashboardHeader} sidebar={rows}>
                                    {summary}
                                </DashboardTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconUser as User } from "@tabler/icons-react";

export function FixedRailDashboard() {
  return (
    <DashboardTemplate
      className="h-auto"
      collapsible={false}
      header={<div className="flex h-16 w-full items-center px-6 font-semibold">概要</div>}
      sidebar={
        <>
          <SidebarItem id="overview" label="概要" icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
          <SidebarItem id="customers" label="顧客" icon={<User size={20} />} isActive={false} onClick={() => {}} />
        </>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">契約数</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">2,350</p>
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
}`
                                : `import { Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconUser as User } from "@tabler/icons-react";

export function FixedRailDashboard() {
  return (
    <DashboardTemplate
      className="h-auto"
      collapsible={false}
      header={<div className="flex h-16 w-full items-center px-6 font-semibold">Overview</div>}
      sidebar={
        <>
          <SidebarItem id="overview" label="Overview" icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
          <SidebarItem id="customers" label="Customers" icon={<User size={20} />} isActive={false} onClick={() => {}} />
        </>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">2,350</p>
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
}`,
                        },
                        {
                            key: "pinned-header-footer",
                            title: locale === "ja" ? "上下に固定する枠" : "Pinned header and footer",
                            description: locale === "ja"
                                ? "sidebarHeader と sidebarFooter は行の上下に貼り付きます。上は所属の切り替え、下は自分のアカウントを置く場所です。"
                                : "sidebarHeader and sidebarFooter stick above and below the rows — a workspace switcher on top, the signed-in account underneath.",
                            preview: (
                                <DashboardTemplate
                                    className="h-auto"
                                    header={dashboardHeader}
                                    sidebarHeader={<span className="font-semibold">Acme</span>}
                                    sidebar={rows}
                                    sidebarFooter={<span className="text-sm text-muted-foreground">hikaby</span>}
                                >
                                    {summary}
                                </DashboardTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconUser as User } from "@tabler/icons-react";

export function PinnedRailDashboard() {
  return (
    <DashboardTemplate
      className="h-auto"
      header={<div className="flex h-16 w-full items-center px-6 font-semibold">概要</div>}
      sidebarHeader={<span className="font-semibold">Acme</span>}
      sidebarFooter={<span className="text-sm text-muted-foreground">hikaby</span>}
      sidebar={
        <>
          <SidebarItem id="overview" label="概要" icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
          <SidebarItem id="customers" label="顧客" icon={<User size={20} />} isActive={false} onClick={() => {}} />
        </>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">今月の売上</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">452万円</p>
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
}`
                                : `import { Card, CardContent, CardHeader, CardTitle, DashboardTemplate, SidebarItem } from "@gunjo/ui";
import { IconLayoutDashboard as LayoutDashboard, IconUser as User } from "@tabler/icons-react";

export function PinnedRailDashboard() {
  return (
    <DashboardTemplate
      className="h-auto"
      header={<div className="flex h-16 w-full items-center px-6 font-semibold">Overview</div>}
      sidebarHeader={<span className="font-semibold">Acme</span>}
      sidebarFooter={<span className="text-sm text-muted-foreground">hikaby</span>}
      sidebar={
        <>
          <SidebarItem id="overview" label="Overview" icon={<LayoutDashboard size={20} />} isActive onClick={() => {}} />
          <SidebarItem id="customers" label="Customers" icon={<User size={20} />} isActive={false} onClick={() => {}} />
        </>
      }
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Revenue this month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$45,231</p>
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent-foreground/20 bg-accent/40 p-5">
                <div className="max-w-md space-y-1">
                    <h3 className="text-base font-semibold">View as a full app</h3>
                    <p className="text-sm text-muted-foreground">
                        <code className="font-mono text-xs">/patterns/dashboard</code> wraps
                        the template in a working multi-page mini-site with mock state.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/patterns/dashboard">
                        Open mini-site
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <CodeBlock code={usageCode} language="tsx" />
            </div>
        </ComponentLayout>
    );
}
