import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { LandingTemplateDemo } from "@/components/demos/TemplateDemos";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { LandingTemplate, Button } from "@gunjo/ui";

export function LandingPage() {
  return (
    <LandingTemplate
      header={
         <div className="flex items-center justify-between w-full">
            <span className="font-bold">Acme Corp</span>
            <nav className="flex gap-4">
                <a href="#">Features</a>
                <a href="#">Pricing</a>
            </nav>
         </div>
      }
      hero={
        <div className="container flex flex-col items-center gap-4 text-center py-20">
            <h1 className="text-4xl font-bold">Build Faster</h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">The best platform for building amazing things.</p>
            <div className="flex gap-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
            </div>
        </div>
      }
      features={
          <div className="grid gap-8 md:grid-cols-3">
             <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Fast</h3>
                <p className="text-muted-foreground">Blazing fast performance.</p>
             </div>
             {/* ... more features */}
          </div>
      }
      footer={
          <p className="text-sm text-muted-foreground">© 2024 Acme Corp.</p>
      }
    />
  )
}`;

const propsData = [
    {
        name: "header",
        type: "React.ReactNode",
        description: "Content for the sticky header navigation.",
    },
    {
        name: "hero",
        type: "React.ReactNode",
        description: "The main hero section content.",
    },
    {
        name: "features",
        type: "React.ReactNode",
        description: "Section for features or benefits grid.",
    },
    {
        name: "testimonials",
        type: "React.ReactNode",
        description: "Section for social proof and testimonials.",
    },
    {
        name: "pricing",
        type: "React.ReactNode",
        description: "Section for pricing plans.",
    },
    {
        name: "cta",
        type: "React.ReactNode",
        description: "Call to Action section at the bottom.",
    },
    {
        name: "footer",
        type: "React.ReactNode",
        description: "Footer content area.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

export default function LandingPage() {
    return (
        <ComponentLayout
            title={patternsMetadata.landingTemplate.title}
            description={patternsMetadata.landingTemplate.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "StickyHeader", href: "/docs/components/sticky-header" },
                { name: "HeroSection", href: "/docs/components/hero-section" },
                { name: "FeatureGrid", href: "/docs/components/feature-grid" },
                { name: "Footer", href: "/docs/components/footer" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/landing" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <LandingTemplateDemo />
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
