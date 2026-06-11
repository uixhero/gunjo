import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import patternsMetadata from "@design/patterns-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { PricingTemplateDemo } from "@/components/demos/PricingTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";

export default function PricingTemplatePage() {
    const code = `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const plans: PricingPlan[] = [
    { id: "free", name: "Free", price: "$0", period: "/mo", features: [...], cta: <Button variant="outline">Get started</Button> },
    { id: "pro", name: "Pro", price: "$29", period: "/mo", features: [...], cta: <Button>Start trial</Button>, featured: true },
];

export function Pricing() {
    return <PricingTemplate plans={plans} />;
}`;

    const usageCode = `import { PricingTemplate } from "@gunjo/ui"

<PricingTemplate plans={plans} title="Pricing" subtitle="..." />`;

    const propsData = [
        { name: "title", type: "ReactNode", default: "'Pricing'", description: "Page heading." },
        { name: "subtitle", type: "ReactNode", description: "Subtitle line." },
        { name: "plans", type: "PricingPlan[]", description: "Plan cards: { id, name, price, period?, description?, features, cta, featured? }[]." },
    ];

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).pricingTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).pricingTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/pricing" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <PricingTemplateDemo />
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
