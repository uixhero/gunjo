"use client";

import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconFileText as FileText,
    IconMaximize as Maximize2,
    IconPalette as Palette,
    IconRuler as Ruler,
    IconSquare as Square,
    IconTypography as Type,
    IconWind as Wind,
} from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { TokenGroupKey } from "@/lib/translations";

const TOKEN_GROUPS: { key: TokenGroupKey; href: string; Icon: typeof Palette }[] = [
    { key: "colors", href: "/docs/colors", Icon: Palette },
    { key: "typography", href: "/docs/typography", Icon: Type },
    { key: "spacing", href: "/docs/spacing", Icon: Ruler },
    { key: "shadows", href: "/docs/shadows", Icon: Square },
    { key: "radius", href: "/docs/radius", Icon: Maximize2 },
    { key: "animation", href: "/docs/animation", Icon: Wind },
];

export default function DocsTokensOverviewPage() {
    const { pages } = useLocale();
    const t = pages.tokens;

    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {t.label}
                </p>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {t.heading}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    {t.descriptionLead}{" "}
                    <Link
                        href="/docs/tokens/spec"
                        className="font-medium text-primary hover:underline"
                    >
                        {t.designMdLinkText}
                    </Link>
                    {t.descriptionTail}
                </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TOKEN_GROUPS.map((group) => {
                    const copy = t.groups[group.key];
                    return (
                        <Card
                            key={group.href}
                            className="group w-full transition-colors hover:border-primary-border"
                        >
                            <CardHeader>
                                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground">
                                    <group.Icon className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-lg">{copy.title}</CardTitle>
                                <CardDescription>{copy.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    href={group.href}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                >
                                    {t.exploreCta}
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border-primary-border bg-primary-subtle">
                <CardHeader>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileText className="h-4 w-4" />
                    </div>
                    <CardTitle>{t.designMd.title}</CardTitle>
                    <CardDescription>{t.designMd.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link
                        href="/docs/tokens/spec"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                        {t.designMd.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
