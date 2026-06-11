import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import patternsMetadata from "@design/patterns-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { OnboardingTemplateDemo } from "@/components/demos/OnboardingTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";

export default function OnboardingTemplatePage() {
    const code = `import { OnboardingFlow, OnboardingTemplate } from "@gunjo/ui";

export function Onboarding() {
    return (
        <OnboardingTemplate hero={<Welcome />}>
            <OnboardingFlow steps={STEPS} onComplete={...} />
        </OnboardingTemplate>
    );
}`;

    const usageCode = `import { OnboardingTemplate } from "@gunjo/ui"

<OnboardingTemplate hero={<HeroPanel />}>
    {/* form / OnboardingFlow */}
</OnboardingTemplate>`;

    const propsData = [
        { name: "hero", type: "ReactNode", description: "Hero side panel content (welcome / branding / illustration)." },
        { name: "children", type: "ReactNode", description: "Right pane content (typically OnboardingFlow or a form)." },
    ];

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).onboardingTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).onboardingTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/onboarding" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <OnboardingTemplateDemo />
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
