import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { KanbanTemplateDemo } from "@/components/demos/TemplateDemos";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { KanbanTemplate, Card, CardHeader, CardTitle } from "@gunjo/ui";

export function KanbanPage() {
  return (
    <KanbanTemplate
        header={<div>My Board</div>}
        sidebar={<div>Sidebar</div>}
    >
        {/* Column 1 */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            <h3>To Do</h3>
            <Card>
                <CardHeader><CardTitle>Task 1</CardTitle></CardHeader>
            </Card>
        </div>
        {/* Column 2 */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            <h3>In Progress</h3>
             <Card>
                <CardHeader><CardTitle>Task 2</CardTitle></CardHeader>
            </Card>
        </div>
    </KanbanTemplate>
  )
}`;

const propsData = [
    {
        name: "sidebar",
        type: "React.ReactNode",
        description: "Content for the sidebar panel.",
    },
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the top header bar.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main content area, typically horizontally scrolling columns.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function KanbanPage() {
    return (
        <ComponentLayout
            title={patternsMetadata.kanbanTemplate.title}
            description={patternsMetadata.kanbanTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/kanban" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <KanbanTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-3 rounded-lg border bg-muted/30 p-5">
                <h2 className="text-lg font-semibold tracking-tight">Layout scope</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    KanbanTemplate provides the responsive shell for sidebar, header, and horizontally
                    scrolling columns. It does not own card state, column data, or drag-and-drop behavior.
                    Wire those pieces in the consuming app.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    For a production board, pair this shell with <code className="font-mono text-xs">dnd-kit</code>
                    and keep stable item ids, keyboard sensors, and SSR-safe aria ids in the board implementation.
                </p>
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
