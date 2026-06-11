import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { BannalyzeTemplateDemo } from "@/components/demos/BannalyzeTemplateDemo";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { BannalyzeTemplate } from "@gunjo/ui";

export function AnalysisPage() {
  return (
    <BannalyzeTemplate
      header={<div>Header Content</div>}
      sidebar={<div>Sidebar List</div>}
      inspector={<div>Analysis Data</div>}
    >
      <div className="flex items-center justify-center h-full">
         <img src="/banner.jpg" alt="Banner" />
      </div>
    </BannalyzeTemplate>
  )
}`;

const propsData = [
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the top navigation bar.",
    },
    {
        name: "sidebar",
        type: "React.ReactNode",
        description: "Content for the left sidebar (navigation, history).",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area (canvas, center stage).",
    },
    {
        name: "inspector",
        type: "React.ReactNode",
        description: "Content for the right sidebar (analysis results, details).",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function BannalyzePage() {
    return (
        <ComponentLayout
            title={patternsMetadata.bannalyzeTemplate.title}
            description={patternsMetadata.bannalyzeTemplate.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "SidebarItem", href: "/docs/components/sidebar-item" },
                { name: "Input", href: "/docs/components/input" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/bannalyze" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <BannalyzeTemplateDemo className="min-h-[800px]" />
                </div>
            </ComponentPreview>

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
