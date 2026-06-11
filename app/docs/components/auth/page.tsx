import Link from "next/link";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Button } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { AuthTemplateDemo } from "@/components/demos/TemplateDemos";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { AuthTemplate } from "@gunjo/ui";
import { LoginForm } from "./LoginForm"; // Example component

export function AuthPage() {
  return (
    <AuthTemplate>
        <LoginForm />
    </AuthTemplate>
  )
}`;

const propsData = [
    {
        name: "logo",
        type: "React.ReactNode",
        description: "Custom logo element to display in the header/panel.",
    },
    {
        name: "quote",
        type: "string",
        description: "Testimonial quote text displayed in the side panel.",
    },
    {
        name: "quoteAuthor",
        type: "string",
        description: "Author name for the testimonial quote.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The authentication form content.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function AuthPage() {
    return (
        <ComponentLayout
            title={patternsMetadata.authTemplate.title}
            description={patternsMetadata.authTemplate.description}
        >
            <ComponentPreview embedSrc="/embed/auth" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <AuthTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="rounded-lg border border-accent-foreground/20 bg-accent/40 p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-semibold">View as a full app</h3>
                    <p className="text-sm text-muted-foreground">
                        AuthTemplate is wired into a working multi-page mini-site at <code className="font-mono text-xs">/patterns/auth</code> — login, signup, forgot-password, and a post-login account screen with mock state.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/patterns/auth/login">
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
