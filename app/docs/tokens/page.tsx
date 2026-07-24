"use client";

import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconFileText as FileText,
    IconLink as LinkIcon,
    IconMaximize as Maximize2,
    IconPalette as Palette,
    IconRuler as Ruler,
    IconSquare as Square,
    IconTypography as Type,
    IconWind as Wind,
} from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TOKEN_VALUES } from "@/lib/data/token-values.generated";
import type { TokenGroupKey } from "@/lib/translations";

type FixedAssetKey = "tokensCss" | "patternsCss" | "starterHtml";

const FIXED_ASSETS: { key: FixedAssetKey; href: string; url: string }[] = [
    { key: "tokensCss", href: "/tokens.css", url: "https://www.gunjo.jp/tokens.css" },
    { key: "patternsCss", href: "/patterns.css", url: "https://www.gunjo.jp/patterns.css" },
    { key: "starterHtml", href: "/starter.html", url: "https://www.gunjo.jp/starter.html" },
];

// Static excerpt of the tokens an AI (or a human skimming) most often needs.
// Values come from the generated SSOT map, so the text in the server-rendered
// HTML is always the real, current value. (#687)
const KEY_TOKEN_NAMES = [
    "--background",
    "--foreground",
    "--primary",
    "--primary-foreground",
    "--info",
    "--success",
    "--warning",
    "--destructive",
    "--border",
    "--muted-foreground",
    "--radius",
];

function keyTokenBlock(theme: "light" | "dark"): string {
    // .dark only redefines what changes per theme (e.g. --radius stays put),
    // so emit only the tokens that block actually declares.
    return KEY_TOKEN_NAMES.filter((name) => TOKEN_VALUES[theme][name] !== undefined)
        .map((name) => `  ${name}: ${TOKEN_VALUES[theme][name]};`)
        .join("\n");
}

const KEY_TOKEN_CSS = `:root {\n${keyTokenBlock("light")}\n}\n\n.dark {\n${keyTokenBlock("dark")}\n}`;

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

            <Card>
                <CardHeader>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground">
                        <LinkIcon className="h-4 w-4" />
                    </div>
                    <CardTitle>{t.fixedAssets.title}</CardTitle>
                    <CardDescription>{t.fixedAssets.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                        {FIXED_ASSETS.map((asset) => (
                            <li
                                key={asset.key}
                                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2"
                            >
                                <a
                                    href={asset.href}
                                    className="font-mono font-medium text-primary hover:underline"
                                >
                                    {asset.url}
                                </a>
                                <span className="text-muted-foreground">
                                    {t.fixedAssets.links[asset.key]}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-muted-foreground">
                        {t.fixedAssets.noNpmLead}
                        <Link
                            href="/docs/no-npm"
                            className="font-medium text-primary hover:underline"
                        >
                            {t.fixedAssets.noNpmLinkText}
                        </Link>
                        {t.fixedAssets.noNpmTail}
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {t.fixedAssets.valuesHeading}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t.fixedAssets.valuesHint}
                        </p>
                        <pre className="overflow-x-auto rounded-lg border border-border/40 bg-muted/20 p-3 font-mono text-xs leading-relaxed">
                            {KEY_TOKEN_CSS}
                        </pre>
                    </div>
                </CardContent>
            </Card>

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
