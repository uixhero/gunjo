import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import patternsMetadata from "@design/patterns-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { DocsTemplateDemo } from "@/components/demos/DocsTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";

export default function DocsTemplatePage() {
    const code = `import { DocsTemplate } from "@gunjo/ui";

export function DocsLayout({ children }) {
    return (
        <DocsTemplate
            sidebar={<NavLinks />}
            toc={<OnThisPage />}
        >
            {children}
        </DocsTemplate>
    );
}`;

    const usageCode = `import { DocsTemplate } from "@gunjo/ui"

<DocsTemplate sidebar={...} toc={...}>{children}</DocsTemplate>`;

    const propsData = [
        { name: "sidebar", type: "ReactNode", description: "Left navigation sidebar content (required)." },
        { name: "toc", type: "ReactNode", description: "Optional right 'On this page' table of contents." },
        { name: "header", type: "ReactNode", description: "Optional top header (e.g. site Header organism)." },
        { name: "children", type: "ReactNode", description: "Main content area." },
    ];

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).docsTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).docsTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/docs" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <DocsTemplateDemo />
            </ComponentPreview>
            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
                <PropsTable data={propsData} />
            </div>
            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
