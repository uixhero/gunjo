"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconClipboard as Clipboard,
    IconCode as Code,
    IconCpu as Cpu,
    IconDownload as Download,
    IconFileText as FileText,
    IconNetwork as Network,
    IconRoute as Workflow,
    IconSparkles as Sparkles,
} from "@tabler/icons-react";
import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
} from "@gunjo/ui";
import {
    buildComponentSpec,
    specToMarkdown,
} from "@/lib/component-spec-builder";
import { CopySpecButton } from "@/components/doc/CopySpecButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { AiHandoffCapabilityKey, AiHandoffToolKey } from "@/lib/translations";
import { SSOT_CATEGORIES, SSOT_FILES } from "@/lib/ssot-files";

const CAPABILITY_KEYS: {
    key: AiHandoffCapabilityKey;
    href: string;
    Icon: typeof Clipboard;
    iconBg: string;
}[] = [
    { key: "spec", href: "#try-it", Icon: Clipboard, iconBg: "bg-primary-subtle text-primary-subtle-foreground" },
    { key: "endpoints", href: "#endpoints", Icon: Code, iconBg: "bg-primary-subtle text-primary-subtle-foreground" },
    { key: "designMd", href: "/docs/tokens/spec", Icon: FileText, iconBg: "bg-accent text-accent-foreground" },
    { key: "mcp", href: "/docs/ai-handoff/mcp", Icon: Network, iconBg: "bg-accent text-accent-foreground" },
];

const TOOL_KEYS: { key: AiHandoffToolKey; Icon: typeof Code }[] = [
    { key: "v0", Icon: Code },
    { key: "cursor", Icon: Workflow },
    { key: "claude", Icon: Sparkles },
    { key: "figmaMake", Icon: FileText },
];

export default function AiHandoffPage() {
    const sampleSpec = React.useMemo(() => {
        const spec = buildComponentSpec("inputs", "button");
        return spec ? specToMarkdown(spec) : "";
    }, []);
    const { pages } = useLocale();
    const t = pages.aiHandoff;

    return (
        <div className="container py-12">
            <div className="space-y-12">
                {/* Hero */}
                <header className="max-w-3xl space-y-4">
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-accent-foreground/20 bg-accent text-accent-foreground"
                    >
                        <Cpu className="h-3 w-3" />
                        {t.badge}
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {t.heading}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t.subtitle}
                    </p>
                </header>

                {/* Capabilities — each card anchors to its corresponding section */}
                <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    {CAPABILITY_KEYS.map((card) => {
                        const copy = t.capabilities[card.key];
                        return (
                        <Link
                            key={card.key}
                            href={card.href}
                            className="group block focus-visible:outline-none"
                            aria-label={t.capabilityJumpLabel(copy.title)}
                        >
                            <Card className="h-full w-full transition-colors hover:border-primary-border group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
                                <CardHeader>
                                    <div
                                        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}
                                    >
                                        <card.Icon className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="flex items-center justify-between text-base">
                                        {copy.title}
                                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                            {copy.badge}
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        {copy.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        );
                    })}
                </section>

                {/* Try it */}
                <section
                    id="try-it"
                    className="scroll-mt-24 space-y-4 rounded-xl border border-primary-border bg-primary-subtle p-6"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {t.tryIt.heading}
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                {t.tryIt.description}
                            </p>
                        </div>
                        <CopySpecButton markdown={sampleSpec} />
                    </div>
                    <pre className="max-h-80 overflow-auto rounded-lg border border-border/40 bg-background p-4 text-xs leading-relaxed">
                        {sampleSpec}
                    </pre>
                </section>

                {/* Endpoint reference */}
                <section id="endpoints" className="scroll-mt-24 space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {t.endpoints.heading}
                    </h2>
                    <div className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-4 font-mono text-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                                GET
                            </Badge>
                            <code>/api/specs/&lt;category&gt;/&lt;name&gt;</code>
                            <span className="text-xs text-muted-foreground">
                                {t.endpoints.oneComponent}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                                GET
                            </Badge>
                            <code>/api/specs/manifest</code>
                            <span className="text-xs text-muted-foreground">
                                {t.endpoints.allComponents}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href="/api/specs/inputs/button"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t.endpoints.tryButton("/api/specs/inputs/button")}
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href="/api/specs/manifest"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t.endpoints.tryButton("/api/specs/manifest")}
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* SSOT files */}
                <section id="ssot-files" className="scroll-mt-24 space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {t.ssotFiles.heading}
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-3xl">
                            {t.ssotFiles.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/api/ssot/manifest" target="_blank" rel="noreferrer">
                                <Download className="mr-1 h-3 w-3" />
                                {t.ssotFiles.manifestLabel}
                            </Link>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            {t.ssotFiles.manifestHint}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-semibold">
                            {t.ssotFiles.fileLabel}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {t.ssotFiles.fileHint}
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-border/40">
                            <table className="w-full min-w-[38rem] text-sm">
                                <thead className="bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2 text-left">
                                            {t.ssotFiles.columns.category}
                                        </th>
                                        <th className="px-3 py-2 text-left">
                                            {t.ssotFiles.columns.pen}
                                        </th>
                                        <th className="px-3 py-2 text-left">
                                            {t.ssotFiles.columns.metadata}
                                        </th>
                                        <th className="px-3 py-2 text-left">
                                            {t.ssotFiles.columns.core}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {SSOT_CATEGORIES.map((category) => {
                                        const filesForCategory = SSOT_FILES.filter(
                                            (f) => f.category === category
                                        );
                                        const byKind = Object.fromEntries(
                                            filesForCategory.map((f) => [f.kind, f])
                                        );
                                        return (
                                            <tr key={category}>
                                                <td className="px-3 py-2 font-mono text-xs">
                                                    {category}
                                                </td>
                                                {(["pen", "metadata", "core"] as const).map(
                                                    (kind) => (
                                                        <td
                                                            key={kind}
                                                            className="px-3 py-2 font-mono text-xs"
                                                        >
                                                            <Link
                                                                href={byKind[kind].downloadUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-primary hover:underline"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                {byKind[kind].fileName}
                                                            </Link>
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-semibold">
                            {t.ssotFiles.bulkHeading}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {t.ssotFiles.bulkHint}
                        </p>
                        <pre className="overflow-x-auto rounded-lg border border-border/40 bg-muted/20 p-3 font-mono text-xs">
{`mkdir -p ssot && \\
curl -fsSL https://gunjo.dev/api/ssot/manifest \\
  | jq -r '.files[] | "\\(.downloadUrl)\\t\\(.fileName)"' \\
  | while IFS=$'\\t' read -r url name; do
      curl -fsSL "https://gunjo.dev$url" -o "ssot/$name"
    done`}
                        </pre>
                    </div>

                    {/* Usage flows */}
                    <div className="space-y-4 pt-4 border-t border-border/40">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                {t.ssotFiles.usage.heading}
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-3xl">
                                {t.ssotFiles.usage.pencilNote}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {t.ssotFiles.usage.designer.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {t.ssotFiles.usage.designer.intro}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
                                        {t.ssotFiles.usage.designer.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {t.ssotFiles.usage.contributor.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {t.ssotFiles.usage.contributor.intro}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
                                        {t.ssotFiles.usage.contributor.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                    <Button asChild variant="outline" size="sm">
                                        <Link
                                            href={t.ssotFiles.usage.contributor.readmeUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {t.ssotFiles.usage.contributor.readmeCta}
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t.ssotFiles.usage.tooling.title}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {t.ssotFiles.usage.tooling.intro}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid gap-3 sm:grid-cols-3 text-sm">
                                    <div className="space-y-1">
                                        <dt className="font-mono text-xs text-foreground">
                                            {t.ssotFiles.usage.tooling.coreLabel}
                                        </dt>
                                        <dd className="text-xs text-muted-foreground">
                                            {t.ssotFiles.usage.tooling.coreDescription}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="font-mono text-xs text-foreground">
                                            {t.ssotFiles.usage.tooling.metadataLabel}
                                        </dt>
                                        <dd className="text-xs text-muted-foreground">
                                            {t.ssotFiles.usage.tooling.metadataDescription}
                                        </dd>
                                    </div>
                                    <div className="space-y-1">
                                        <dt className="font-mono text-xs text-foreground">
                                            {t.ssotFiles.usage.tooling.penLabel}
                                        </dt>
                                        <dd className="text-xs text-muted-foreground">
                                            {t.ssotFiles.usage.tooling.penDescription}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Tool guide */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {t.perTool.heading}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {TOOL_KEYS.map((tool) => {
                            const copy = t.perTool.tools[tool.key];
                            return (
                                <Card key={tool.key} className="w-full">
                                    <CardHeader>
                                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                                            <tool.Icon className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base">
                                            {copy.name}
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            {copy.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Cookbook callout */}
                <section className="rounded-xl border border-accent-foreground/20 bg-accent/40 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-xl space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {t.cookbook.heading}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {t.cookbook.description}
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/docs/ai-handoff/cookbook">
                                {t.cookbook.cta}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Phase 7 plans */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {t.roadmap.heading}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="group w-full transition-colors hover:border-primary-border">
                            <CardHeader>
                                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                    <Network className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">
                                    {t.roadmap.mcp.title}
                                </CardTitle>
                                <CardDescription>
                                    {t.roadmap.mcp.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    href="/docs/ai-handoff/mcp"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                >
                                    {t.roadmap.mcp.cta}
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </CardContent>
                        </Card>
                        <Card className="group w-full transition-colors hover:border-primary-border">
                            <CardHeader>
                                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">
                                    {t.roadmap.figma.title}
                                </CardTitle>
                                <CardDescription>
                                    {t.roadmap.figma.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    href="/docs/ai-handoff/figma"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                >
                                    {t.roadmap.figma.cta}
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
