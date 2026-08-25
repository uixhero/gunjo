import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import patternsMetadata from "@design/patterns-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { DocsTemplateDemo } from "@/components/demos/DocsTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";

export default function DocsTemplatePage() {
    const code = `import { DocsTemplate } from "@gunjo/ui";

const navItems = [
    { href: "/docs/getting-started", label: "Getting started" },
    { href: "/docs/components/button", label: "Button" },
];

const tocItems = [
    { href: "#overview", label: "Overview" },
    { href: "#props", label: "Props" },
];

export function DocsLayoutExample() {
    return (
        <DocsTemplate
            sidebar={
                <nav className="grid gap-1 text-sm">
                    {navItems.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>
            }
            toc={
                <nav className="grid gap-1 text-sm">
                    {tocItems.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>
            }
        >
            <article className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight">Button</h1>
                <p className="text-muted-foreground">
                    Buttons trigger an action in the current view.
                </p>
            </article>
        </DocsTemplate>
    );
}`;

    const usageCode = code;

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
