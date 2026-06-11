import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import patternsMetadata from "@design/patterns-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { BlogTemplateDemo } from "@/components/demos/BlogTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";

export default function BlogTemplatePage() {
    const code = `import { BlogTemplate } from "@gunjo/ui";

export function Post() {
    return (
        <BlogTemplate
            category="Engineering"
            title="..."
            meta="By Alice · 5 min read"
            hero={<img src="..." />}
        >
            <p>Article body...</p>
        </BlogTemplate>
    );
}`;

    const usageCode = `import { BlogTemplate } from "@gunjo/ui"

<BlogTemplate title="..." meta="...">{children}</BlogTemplate>`;

    const propsData = [
        { name: "category", type: "ReactNode", description: "Category label above the title (e.g. 'Engineering')." },
        { name: "title", type: "ReactNode", description: "Article title (h1)." },
        { name: "meta", type: "ReactNode", description: "Author / read time / date row." },
        { name: "hero", type: "ReactNode", description: "Optional hero media block (image, video)." },
        { name: "children", type: "ReactNode", description: "Article body. Wrapped in `prose` for typography styling." },
    ];

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).blogTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).blogTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/blog" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <BlogTemplateDemo />
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
