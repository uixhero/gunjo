"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconCheck as Check,
    IconCopy as Copy,
    IconExternalLink as ExternalLink,
    IconPackage as Package,
    IconSparkles as Sparkles,
} from "@tabler/icons-react";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    MarkdownRenderer,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";

const PATHWAY_HREFS = {
    install: "/docs/installation",
    components: "/docs/components/button",
    examples: "/patterns/dashboard",
    adoption: "/docs/adoption",
} as const;

export default function IntroductionPage() {
    const { locale, intro } = useLocale();
    const content = getDocContent("introduction", locale);

    return (
        <div className="space-y-16">
            <section className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        {intro.alphaBadge}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                        <Package className="h-3 w-3" />
                        {intro.componentCountBadge}
                    </Badge>
                </div>
                <div className="space-y-4">
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                        {content?.title ?? "Introduction"}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {content?.description}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                    <Button asChild>
                        <Link href="/docs/installation">
                            {intro.ctaPrimary}
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/docs/components/button">
                            {intro.ctaSecondary}
                        </Link>
                    </Button>
                </div>
            </section>

            <QuickstartHero />

            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {intro.livePreviewLabel}
                </p>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>
                </div>
            </section>

            {content?.body ? (
                <section>
                    <MarkdownRenderer
                        content={content.body}
                        className="text-base leading-7 text-foreground"
                        components={{
                            h3: ({ children }) => (
                                <h3 className="scroll-m-20 mt-8 mb-3 text-xl font-semibold tracking-tight">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="leading-7 [&:not(:first-child)]:mt-5">{children}</p>
                            ),
                            ul: ({ children }) => (
                                <ul className="my-5 ml-6 list-disc [&>li]:mt-2">{children}</ul>
                            ),
                            code: ({ className, children, ...props }) => {
                                const isBlock = className?.includes("language-");
                                if (isBlock) {
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                                return (
                                    <code
                                        className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    />
                </section>
            ) : null}

            <section className="space-y-6">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {intro.pathwaysHeading}
                    </h2>
                    <p className="text-muted-foreground">{intro.pathwaysDescription}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {(Object.keys(intro.pathways) as Array<keyof typeof intro.pathways>).map(
                        (key) => {
                            const pathway = intro.pathways[key];
                            const href = PATHWAY_HREFS[key];
                            const external = href.startsWith("http");
                            return (
                                <Card
                                    key={key}
                                    className="group flex w-full flex-col transition-colors hover:border-primary-border"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">{pathway.title}</CardTitle>
                                        <CardDescription>{pathway.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto">
                                        <Link
                                            href={href}
                                            target={external ? "_blank" : undefined}
                                            rel={external ? "noreferrer" : undefined}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-strong"
                                        >
                                            {pathway.cta}
                                            {external ? (
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                            )}
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        }
                    )}
                </div>
            </section>

            <section className="space-y-6">
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {intro.resourcesHeading}
                    </h2>
                    <p className="text-muted-foreground">{intro.resourcesDescription}</p>
                </div>
                <ul className="divide-y divide-border/40 rounded-lg border border-border/40">
                    {intro.resources.map((resource) => {
                        const external = resource.href.startsWith("http");
                        const Icon = external ? ExternalLink : ArrowRight;

                        return (
                            <li key={resource.href}>
                                <Link
                                    href={resource.href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noreferrer" : undefined}
                                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium">{resource.label}</div>
                                        <div className="truncate text-sm text-muted-foreground">
                                            {resource.description}
                                        </div>
                                    </div>
                                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}

const INSTALL_COMMAND = "npm install @gunjo/ui";
const IMPORT_SNIPPET = `import { Button } from "@gunjo/ui";

export default function Welcome() {
  return <Button>Hello GunjoUI</Button>;
}`;

function QuickstartHero() {
    const { intro } = useLocale();
    const strings = intro.quickstart;

    return (
        <section className="space-y-5 rounded-xl border border-border/60 bg-muted/20 p-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    {strings.heading}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {strings.description}
                </p>
            </div>

            <ol className="space-y-4">
                <QuickstartStep
                    number={1}
                    label={strings.step1Label}
                    snippet={INSTALL_COMMAND}
                    snippetClass="text-sm"
                    copyLabel={strings.copyLabel}
                    copiedLabel={strings.copiedLabel}
                />
                <QuickstartStep
                    number={2}
                    label={strings.step2Label}
                    snippet={IMPORT_SNIPPET}
                    snippetClass="text-xs leading-relaxed"
                    copyLabel={strings.copyLabel}
                    copiedLabel={strings.copiedLabel}
                />
                <li className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold text-primary-subtle-foreground">
                            3
                        </span>
                        <span className="text-sm font-medium">
                            {strings.step3Label}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground sm:flex-1">
                        {strings.step3Description}
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/showcase">
                            {strings.showcaseCta}
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </li>
            </ol>
        </section>
    );
}

interface QuickstartStepProps {
    number: number;
    label: string;
    snippet: string;
    snippetClass?: string;
    copyLabel: string;
    copiedLabel: string;
}

function QuickstartStep({
    number,
    label,
    snippet,
    snippetClass,
    copyLabel,
    copiedLabel,
}: QuickstartStepProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(async () => {
        try {
            await navigator.clipboard.writeText(snippet);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard write blocked — fail silently rather than crash.
        }
    }, [snippet]);

    return (
        <li className="space-y-2">
            <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold text-primary-subtle-foreground">
                    {number}
                </span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="relative">
                <pre
                    className={`overflow-x-auto rounded-md border border-border/60 bg-background px-4 py-3 pr-12 font-mono ${snippetClass ?? ""}`}
                >
                    {snippet}
                </pre>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute right-2 top-2 h-7 w-7"
                    aria-label={copied ? copiedLabel : copyLabel}
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                </Button>
            </div>
        </li>
    );
}
