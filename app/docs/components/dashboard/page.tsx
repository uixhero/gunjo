import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { DashboardTemplateDemo } from "@/components/demos/TemplateDemos";
import { Button } from "@gunjo/ui";
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
    return (
        <ComponentLayout
            title={patternsMetadata.dashboardTemplate.title}
            description={patternsMetadata.dashboardTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/dashboard" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <DashboardTemplateDemo />
                </div>
            </ComponentPreview>

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
