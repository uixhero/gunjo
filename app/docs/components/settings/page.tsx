import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { SettingsTemplateDemo } from "@/components/demos/TemplateDemos";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { SettingsTemplate, Button } from "@gunjo/ui";

export function SettingsPage() {
  return (
    <SettingsTemplate
        title="Settings"
        navigation={
            <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start">Profile</Button>
                <Button variant="ghost" className="justify-start">Account</Button>
            </nav>
        }
    >
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Profile</h3>
            {/* Form Content */}
        </div>
    </SettingsTemplate>
  )
}`;

const propsData = [
    {
        name: "title",
        type: "string",
        description: "The main title displayed at the top of the settings page.",
        default: '"Settings"',
    },
    {
        name: "description",
        type: "string",
        description: "A short description displayed below the title.",
        default: '"Manage your account settings and preferences."',
    },
    {
        name: "navigation",
        type: "React.ReactNode",
        description: "Navigation items displayed in the sidebar.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main settings form content.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function SettingsPage() {
    return (
        <ComponentLayout
            title={patternsMetadata.settingsTemplate.title}
            description={patternsMetadata.settingsTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/settings" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <SettingsTemplateDemo />
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
