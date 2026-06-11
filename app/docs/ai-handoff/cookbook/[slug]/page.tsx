"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
    IconArrowLeft as ArrowLeft,
    IconBook2 as BookOpen,
    IconCheck as Check,
    IconCopy as Copy,
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
    cn,
} from "@gunjo/ui";
import { getRecipe, TOOL_LABELS } from "@/lib/cookbook/recipes";

export default function RecipeDetailPage() {
    const params = useParams<{ slug: string }>();
    const slug = params?.slug;
    const recipe = slug ? getRecipe(slug) : undefined;
    const [copied, setCopied] = React.useState(false);

    if (!recipe) {
        if (typeof window !== "undefined") notFound();
        return null;
    }

    const onCopy = React.useCallback(async () => {
        try {
            await navigator.clipboard.writeText(recipe.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    }, [recipe.prompt]);

    return (
        <div className="container py-10">
            <div className="mx-auto max-w-3xl space-y-10">
                <Link
                    href="/docs/ai-handoff/cookbook"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to cookbook
                </Link>

                <header className="space-y-4 border-b border-border/40 pb-8">
                    <Badge variant="outline" className="gap-1.5">
                        <BookOpen className="h-3 w-3" />
                        Recipe
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        {recipe.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {recipe.scenario}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            Recommended:
                        </span>
                        {recipe.recommendedTools.map((t) => (
                            <Badge key={t} variant="secondary">
                                {TOOL_LABELS[t]}
                            </Badge>
                        ))}
                    </div>
                </header>

                <section className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Prompt
                        </h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCopy}
                            className="gap-1.5"
                        >
                            {copied ? (
                                <>
                                    <Check className={cn("h-3.5 w-3.5 text-primary")} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Copy prompt
                                    <Copy className="h-3 w-3 opacity-60" />
                                </>
                            )}
                        </Button>
                    </div>
                    <pre className="overflow-auto rounded-lg border border-border/40 bg-muted/30 p-5 text-sm leading-relaxed whitespace-pre-wrap">
                        {recipe.prompt}
                    </pre>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-base">Expected output</CardTitle>
                            <CardDescription>{recipe.expectedOutput}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Components used
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1.5">
                                {recipe.referencedComponents.map((c) => (
                                    <Badge
                                        key={c}
                                        variant="secondary"
                                        className="font-mono text-[10px]"
                                    >
                                        {c}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
