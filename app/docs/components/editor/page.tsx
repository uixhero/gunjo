import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { EditorTemplateDemo } from "@/components/demos/TemplateDemos";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { EditorTemplate } from "@gunjo/ui";

export function EditorPage() {
  return (
    <EditorTemplate
        topBar={<div className="h-14 border-b flex items-center px-4">Toolbar</div>}
        leftPanel={<div className="w-64 border-r h-full p-4">Layers</div>}
        rightPanel={<div className="w-72 border-l h-full p-4">Properties</div>}
    >
        <div className="flex-1 bg-muted/50 flex items-center justify-center">
            Canvas Area
        </div>
    </EditorTemplate>
  )
}`;

const propsData = [
    {
        name: "topBar",
        type: "React.ReactNode",
        description: "Content for the top toolbar area (fixed height).",
    },
    {
        name: "leftPanel",
        type: "React.ReactNode",
        description: "Content for the left sidebar (collapsible/responsive logic handled internally if needed).",
    },
    {
        name: "rightPanel",
        type: "React.ReactNode",
        description: "Content for the right sidebar (typically for properties/inspectors).",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The central canvas area content.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function EditorPage() {
    return (
        <ComponentLayout
            title={patternsMetadata.editorTemplate.title}
            description={patternsMetadata.editorTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/editor" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <EditorTemplateDemo />
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
