"use client";

import Link from "next/link";
import {
    IconArrowLeft as ArrowLeft,
    IconArrowRight as ArrowRight,
    IconClock as Clock,
    IconNetwork as Network,
    IconSparkles as Sparkles,
    IconTool as Wrench,
} from "@tabler/icons-react";
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
} from "@gunjo/ui";

const TOOLS = [
    {
        name: "list_components",
        params: '{ category?: "inputs" | "display" | "feedback" | "navigation" | "overlay" | "layout" | "patterns" }',
        returns: "Component[] — title, description, category, slug for each",
        example: "Show me all template components",
    },
    {
        name: "get_component_spec",
        params: '{ category: string, name: string }',
        returns: "ComponentSpec — full Markdown + JSON spec for one component",
        example: "Pull the spec for display/data-table",
    },
    {
        name: "get_design_tokens",
        params: '{ group?: "color" | "typography" | "spacing" | "shadow" | "radius" | "animation" }',
        returns: "Token[] — name, value, css-var, theme variants",
        example: "List all color tokens",
    },
    {
        name: "search_components",
        params: '{ query: string, limit?: number }',
        returns: "Component[] — fuzzy-matched against title and description",
        example: "Find components for showing loading state",
    },
];

export default function McpServerPage() {
    return (
        <div className="container py-12">
            <div className="mx-auto max-w-3xl space-y-12">
                <Link
                    href="/docs/ai-handoff"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to AI Handoff
                </Link>

                <header className="space-y-4">
                    {/* Up-front status banner — this page describes a
                       surface that has not been built yet. Make sure
                       readers see that before they start planning around
                       it. */}
                    <div className="flex items-start gap-3 rounded-lg border-l-4 border-warning-border bg-warning-subtle p-4 text-sm">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        <div className="space-y-1">
                            <div className="font-semibold text-foreground">
                                Not built yet — Phase 7, post-1.0
                            </div>
                            <p className="text-muted-foreground">
                                The MCP server below is a design spec, not a
                                shipped product. Implementation lives in a
                                separate repo (
                                <code className="rounded bg-background/60 px-1 py-0.5 text-xs">
                                    gunjo-ui-mcp
                                </code>
                                ) and will land after the 1.0 stable spec
                                freeze. Until then, use the{" "}
                                <Link
                                    href="/docs/ai-handoff"
                                    className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                                >
                                    Copy-spec-for-AI manual workflow
                                </Link>
                                .
                            </p>
                            <p className="pt-1 text-xs text-muted-foreground">
                                Track progress in{" "}
                                <a
                                    href="https://github.com/eemlis7-ke/gunjo/issues/57"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium underline underline-offset-2 hover:text-foreground"
                                >
                                    issue #57
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="gap-1.5">
                        <Network className="h-3 w-3" />
                        Phase 7 · planned
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight">
                        gunjo-ui MCP server
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        A Model Context Protocol server that lets Claude,
                        Cursor, and other MCP-aware clients query the GunjoUI
                        namespace directly — no copy-paste of specs needed.
                    </p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Why MCP
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">
                        MCP turns the Phase 5 spec endpoints into a typed,
                        discoverable namespace. Instead of pasting Markdown,
                        users say "use GunjoUI" and the AI tool calls
                        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                            list_components
                        </code>
                        and
                        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                            get_component_spec
                        </code>{" "}
                        as needed. Closes the loop: AI can ask for what it
                        needs at the moment it needs it.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Planned tool surface
                    </h2>
                    <div className="space-y-4">
                        {TOOLS.map((tool) => (
                            <Card key={tool.name}>
                                <CardHeader>
                                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary-subtle text-primary-subtle-foreground">
                                        <Wrench className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="font-mono text-lg">
                                        {tool.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Params
                                        </div>
                                        <code className="block rounded bg-muted px-2 py-1 text-xs">
                                            {tool.params}
                                        </code>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Returns
                                        </div>
                                        <p>{tool.returns}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Example call
                                        </div>
                                        <p className="italic text-muted-foreground">
                                            &ldquo;{tool.example}&rdquo;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Architecture
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">
                        The MCP server is a thin CLI that proxies to the
                        existing
                        <code className="mx-1 rounded bg-muted px-1 py-0.5 text-sm font-mono">
                            /api/specs
                        </code>
                        endpoints, normalizing responses into MCP tool results.
                        No state of its own — the docs site remains the single
                        source of truth.
                    </p>
                    <pre className="overflow-auto rounded-lg border border-border/40 bg-muted p-4 text-sm">
                        {`# Install (when shipped)
npm install -g gunjo-ui-mcp

# Run as a Claude Desktop / Cursor MCP server
npx gunjo-ui-mcp \\
  --base-url https://gunjo.dev \\
  --transport stdio`}
                    </pre>
                </section>

                <section className="space-y-3 rounded-xl border border-primary-border bg-primary-subtle p-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h2 className="text-xl font-semibold tracking-tight">
                            Until the MCP server lands
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        The Markdown "Copy spec for AI" button on every
                        component page already covers the manual workflow.
                        Drop into v0 or Cursor — same fidelity, just a
                        copy-paste away.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/docs/ai-handoff">
                            Use the manual workflow
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </section>
            </div>
        </div>
    );
}
