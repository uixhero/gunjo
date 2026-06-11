import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconBook2 as BookOpen,
    IconChefHat as ChefHat,
} from "@tabler/icons-react";
import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@gunjo/ui";
import { recipes, TOOL_LABELS } from "@/lib/cookbook/recipes";

export default function CookbookIndexPage() {
    return (
        <div className="container py-12">
            <div className="space-y-12">
                <header className="max-w-3xl space-y-4">
                    <Badge variant="outline" className="gap-1.5">
                        <ChefHat className="h-3 w-3" />
                        Prompt cookbook
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Recipes for AI builders.
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Pre-written prompts that pair with the GunjoUI spec
                        endpoints. Copy a recipe, paste it into your AI tool of
                        choice, and ship a complete screen in minutes.
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                        <Card
                            key={recipe.slug}
                            className="group flex w-full flex-col transition-colors hover:border-primary-border"
                        >
                            <CardHeader>
                                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-lg leading-snug">
                                    {recipe.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {recipe.scenario}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto flex flex-col gap-3">
                                <div className="flex flex-wrap gap-1">
                                    {recipe.recommendedTools.map((t) => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            {TOOL_LABELS[t]}
                                        </Badge>
                                    ))}
                                </div>
                                <Link
                                    href={`/docs/ai-handoff/cookbook/${recipe.slug}`}
                                    className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:underline"
                                >
                                    Open recipe
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
