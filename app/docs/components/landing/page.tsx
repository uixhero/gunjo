"use client";

import { Button, LandingTemplate } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { LandingTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
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
    const { locale } = useLocale();

    const hero = (
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <h1 className="text-3xl font-bold">{locale === "ja" ? "作る速さを変える" : "Build faster"}</h1>
            <p className="max-w-xl text-muted-foreground">
                {locale === "ja" ? "画面の土台がそろっているので、作りはじめから形になります。" : "A shared foundation for screens, so you start from something that already works."}
            </p>
            <div className="flex gap-3">
                <Button>{locale === "ja" ? "はじめる" : "Get started"}</Button>
                <Button variant="outline">{locale === "ja" ? "詳しく見る" : "Learn more"}</Button>
            </div>
        </div>
    );

    const cta = (
        <div className="flex flex-col items-center gap-3 border-t px-6 py-12 text-center">
            <h2 className="text-2xl font-semibold">{locale === "ja" ? "今日から試せます" : "Start today"}</h2>
            <Button>{locale === "ja" ? "無料で試す" : "Try it free"}</Button>
        </div>
    );

    const header = (
        <div className="flex w-full items-center justify-between">
            <span className="font-bold">Acme</span>
            <nav className="flex gap-4 text-sm text-muted-foreground">
                <span>{locale === "ja" ? "機能" : "Features"}</span>
                <span>{locale === "ja" ? "料金" : "Pricing"}</span>
            </nav>
        </div>
    );

    const features = (
        <div className="grid gap-6 md:grid-cols-3">
            {(locale === "ja"
                ? [
                    { title: "速い", text: "待ち時間を作りません。" },
                    { title: "そろう", text: "画面ごとの差が出ません。" },
                    { title: "続く", text: "変更に強い土台です。" },
                ]
                : [
                    { title: "Fast", text: "No waiting around." },
                    { title: "Consistent", text: "Screens stop drifting apart." },
                    { title: "Durable", text: "A base that survives change." },
                ]
            ).map((feature) => (
                <div key={feature.title} className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.text}</p>
                </div>
            ))}
        </div>
    );

    const footer = <p className="text-sm text-muted-foreground">© 2026 Acme</p>;

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
            relatedComponents={[
                { name: "PricingTemplate", href: "/docs/components/pricing" },
                { name: "BlogTemplate", href: "/docs/components/blog" },
                { name: "Container", href: "/docs/components/container" },
                { name: "Footer", href: "/docs/components/footer" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/landing" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <LandingTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "hero だけが必須で、header・features・testimonials・pricing・cta・footer は渡した節だけが並びます。節の順番は固定です。"
                        : "Only hero is required. header, features, testimonials, pricing, cta, and footer each appear only when passed, and their order is fixed."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "hero-and-cta",
                            title: locale === "ja" ? "hero と cta だけ" : "Hero and call to action",
                            description: locale === "ja"
                                ? "最小の形です。1つのことだけを伝える短い頁は、節を足さないほうが速く決まります。"
                                : "The smallest form. A page with one thing to say converts faster without extra sections.",
                            preview: (
                                <LandingTemplate className="min-h-0" hero={hero} cta={cta} />
                            ),
                            code: locale === "ja"
                                ? `import { Button, LandingTemplate } from "@gunjo/ui";

export function ShortLanding() {
  return (
    <LandingTemplate
      className="min-h-0"
      hero={
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">作る速さを変える</h1>
          <Button>はじめる</Button>
        </div>
      }
      cta={
        <div className="flex flex-col items-center gap-3 border-t px-6 py-12 text-center">
          <h2 className="text-2xl font-semibold">今日から試せます</h2>
          <Button>無料で試す</Button>
        </div>
      }
    />
  );
}`
                                : `import { Button, LandingTemplate } from "@gunjo/ui";

export function ShortLanding() {
  return (
    <LandingTemplate
      className="min-h-0"
      hero={
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">Build faster</h1>
          <Button>Get started</Button>
        </div>
      }
      cta={
        <div className="flex flex-col items-center gap-3 border-t px-6 py-12 text-center">
          <h2 className="text-2xl font-semibold">Start today</h2>
          <Button>Try it free</Button>
        </div>
      }
    />
  );
}`,
                        },
                        {
                            key: "with-features",
                            title: locale === "ja" ? "案内と機能と footer を足す" : "With header, features, and footer",
                            description: locale === "ja"
                                ? "header は上に貼り付いたまま残ります。features は Container に包まれるので、左右の余白は自分で付けなくてかまいません。"
                                : "The header stays stuck to the top as you scroll. features is wrapped in a Container, so you do not add the side gutters yourself.",
                            preview: (
                                <LandingTemplate
                                    className="min-h-0"
                                    header={header}
                                    hero={hero}
                                    features={features}
                                    cta={cta}
                                    footer={footer}
                                />
                            ),
                            code: locale === "ja"
                                ? `import { Button, LandingTemplate } from "@gunjo/ui";

const FEATURES = [
  { title: "速い", text: "待ち時間を作りません。" },
  { title: "そろう", text: "画面ごとの差が出ません。" },
  { title: "続く", text: "変更に強い土台です。" },
];

export function LandingWithFeatures() {
  return (
    <LandingTemplate
      className="min-h-0"
      header={<span className="font-bold">Acme</span>}
      hero={
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">作る速さを変える</h1>
          <Button>はじめる</Button>
        </div>
      }
      features={
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      }
      footer={<p className="text-sm text-muted-foreground">© 2026 Acme</p>}
    />
  );
}`
                                : `import { Button, LandingTemplate } from "@gunjo/ui";

const FEATURES = [
  { title: "Fast", text: "No waiting around." },
  { title: "Consistent", text: "Screens stop drifting apart." },
  { title: "Durable", text: "A base that survives change." },
];

export function LandingWithFeatures() {
  return (
    <LandingTemplate
      className="min-h-0"
      header={<span className="font-bold">Acme</span>}
      hero={
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">Build faster</h1>
          <Button>Get started</Button>
        </div>
      }
      features={
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      }
      footer={<p className="text-sm text-muted-foreground">© 2026 Acme</p>}
    />
  );
}`,
                        },
                        {
                            key: "with-proof-and-pricing",
                            title: locale === "ja" ? "声と料金の節を挟む" : "With testimonials and pricing",
                            description: locale === "ja"
                                ? "testimonials だけは背景が薄く塗られるので、節の切れ目が目で分かります。pricing はその次に固定で入ります。"
                                : "Only testimonials gets a tinted background, which marks the seam between sections. pricing always follows it.",
                            preview: (
                                <LandingTemplate
                                    className="min-h-0"
                                    header={header}
                                    hero={hero}
                                    features={features}
                                    testimonials={
                                        <blockquote className="mx-auto max-w-xl text-center text-lg">
                                            {locale === "ja"
                                                ? "「画面の作り直しが1日で終わるようになりました。」"
                                                : "“Rebuilding a screen now takes a day instead of a sprint.”"}
                                        </blockquote>
                                    }
                                    pricing={
                                        <div className="text-center">
                                            <p className="text-2xl font-semibold">{locale === "ja" ? "月額 2,900円から" : "From $29 a month"}</p>
                                        </div>
                                    }
                                    cta={cta}
                                    footer={footer}
                                />
                            ),
                            code: locale === "ja"
                                ? `import { Button, LandingTemplate } from "@gunjo/ui";

const QUOTE = "「画面の作り直しが1日で終わるようになりました。」";

export function FullLanding() {
  return (
    <LandingTemplate
      className="min-h-0"
      header={<span className="font-bold">Acme</span>}
      hero={
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">作る速さを変える</h1>
          <Button>はじめる</Button>
        </div>
      }
      testimonials={
        <blockquote className="mx-auto max-w-xl text-center text-lg">{QUOTE}</blockquote>
      }
      pricing={
        <div className="text-center">
          <p className="text-2xl font-semibold">月額 2,900円から</p>
        </div>
      }
      footer={<p className="text-sm text-muted-foreground">© 2026 Acme</p>}
    />
  );
}`
                                : `import { Button, LandingTemplate } from "@gunjo/ui";

const QUOTE = "Rebuilding a screen now takes a day instead of a sprint.";

export function FullLanding() {
  return (
    <LandingTemplate
      className="min-h-0"
      header={<span className="font-bold">Acme</span>}
      hero={
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">Build faster</h1>
          <Button>Get started</Button>
        </div>
      }
      testimonials={
        <blockquote className="mx-auto max-w-xl text-center text-lg">{QUOTE}</blockquote>
      }
      pricing={
        <div className="text-center">
          <p className="text-2xl font-semibold">From $29 a month</p>
        </div>
      }
      footer={<p className="text-sm text-muted-foreground">© 2026 Acme</p>}
    />
  );
}`,
                        },
                    ]}
                />
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
