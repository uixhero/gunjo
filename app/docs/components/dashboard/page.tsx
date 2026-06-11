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
            <div className="h-16 flex items-center px-6 border-b">
                <div className="font-bold">Dashboard</div>
            </div>
        }
        sidebar={
            <div className="h-full py-4 bg-card border-r">
                <SidebarItem icon={<LayoutDashboard size={20} />} isActive={true} onClick={() => {}} id="overview" label="Overview" />
                <SidebarItem icon={<User size={20} />} isActive={false} onClick={() => {}} id="customers" label="Customers" />
                <SidebarItem icon={<Settings size={20} />} isActive={false} onClick={() => {}} id="settings" label="Settings" />
            </div>
        }
    >
        <div className="p-8">
            <h2 className="text-3xl font-bold">Overview</h2>
            {/* Dashboard Content */}
        </div>
    </DashboardTemplate>
  )
}`;

const propsData = [
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the top header section.",
    },
    {
        name: "sidebar",
        type: "React.ReactNode",
        description: "Content for the sidebar navigation.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area of the dashboard.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
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
