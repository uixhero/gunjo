"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconArrowRight as ArrowRight,
    IconBook2 as BookOpen,
    IconBrandGithub as Github,
    IconCode as Code,
    IconCpu as Cpu,
    IconEye as Eye,
    IconFileText as FileText,
    IconLayoutGrid as LayoutGrid,
    IconNetwork as Network,
    IconPackages as Boxes,
    IconPalette as Palette,
    IconSparkles as Sparkles,
} from "@tabler/icons-react";
import {
    Button,
    Badge,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Carousel,
    CarouselContent,
    CarouselItem,
    CopyButton,
    Input,
    Kbd,
    Progress,
    Select,
    Statistic,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    TooltipButton,
} from "@gunjo/ui";
import { useTheme } from "next-themes";
import { HeroBackground } from "@/components/home/HeroBackground";
import { useLocale } from "@/components/providers/LocaleProvider";
import { COMPONENT_COUNT } from "@/lib/component-count";

const designerCardIcons = {
    showcase: LayoutGrid,
    tokens: Palette,
    atlas: Eye,
    patterns: Boxes,
} as const;

const aiCardIcons = {
    spec: FileText,
    schema: Code,
    mcp: Network,
    cookbook: BookOpen,
} as const;

export default function Home() {
    const { home, locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <main className="relative">
            {/* ============== Section 1 — HERO ============== */}
            <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden">
                <HeroBackground />
                <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center gap-8 px-6 py-20 md:gap-12 lg:gap-16">
                    {/* Vertical 群青 — outlined SVG (font-independent), tablet up */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/renew/SVG/title_v_ol.svg"
                        alt={home.hero.kanji}
                        className="hidden h-[320px] w-auto shrink-0 select-none drop-shadow-2xl md:block lg:h-[400px]"
                    />

                    {/* Content */}
                    <div className="on-hero flex max-w-2xl flex-1 flex-col gap-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/renew/SVG/title_h_ol.svg"
                            alt={home.hero.kanji}
                            className="h-[64px] w-auto md:hidden"
                        />
                        <Badge
                            variant="outline"
                            className="on-hero-badge w-fit gap-1.5"
                        >
                            <Sparkles className="h-3 w-3" />
                            Alpha · v0.0.1-alpha.2
                        </Badge>
                        <h1
                            className="text-5xl font-extrabold leading-[1.05] tracking-tight lg:text-7xl"
                            style={{ fontFamily: "var(--font-mincho), serif" }}
                        >
                            {home.hero.taglineMain}
                        </h1>
                        <p className="on-hero-muted max-w-xl text-xl lg:text-2xl">
                            {home.hero.taglineSub}
                        </p>
                        <p className="on-hero-faint max-w-xl text-base">
                            {home.hero.subtitle}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3">
                            <Button asChild size="lg" className="on-hero-cta-primary">
                                <Link href="/docs/introduction">
                                    {home.hero.ctaShowcase}
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="on-hero-cta-outline backdrop-blur"
                            >
                                <Link href="/showcase">{home.hero.ctaAi}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============== Intro — the threshold (dark) ============== */}
            <section className="relative overflow-hidden bg-[hsl(var(--pure-black))] py-48 md:py-64">
                <div
                    className="pointer-events-none absolute inset-0 gunjo-intro-burst"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/2 gunjo-intro-fade-top"
                    aria-hidden
                />
                <div className="on-hero relative z-10 mx-auto max-w-2xl px-6 text-center">
                    <p
                        className="text-3xl font-medium leading-relaxed md:text-4xl"
                        style={{ fontFamily: "var(--font-mincho), serif" }}
                    >
                        まだ、何者でもない。
                        <br />
                        だから、どんな色にもなれる。
                    </p>
                </div>
            </section>

            {/* ============== Section 2 — PRIMARY ENTRY POINTS ============== */}
            <section className="border-t border-border/40 bg-background py-24">
                <div className="mx-auto w-full max-w-6xl px-6">
                    <div className="mb-12 max-w-3xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {home.showcase.label}
                        </p>
                        <p className="text-2xl font-medium tracking-tight text-foreground">
                            {home.showcase.description}
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {(
                            Object.keys(home.designers.cards) as Array<
                                keyof typeof home.designers.cards
                            >
                        ).map((key) => {
                            const card = home.designers.cards[key];
                            const Icon = designerCardIcons[key];
                            return (
                                <Card
                                    key={key}
                                    className="group w-full transition-colors hover:border-primary-border"
                                >
                                    <CardHeader>
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">
                                            {card.title}
                                        </CardTitle>
                                        <CardDescription className="leading-6">
                                            {card.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Link
                                            href={card.href}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                        >
                                            {card.cta}
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============== Section 3 — LIVE COMPONENTS ============== */}
            <LiveComponentWorkbench isJa={isJa} />

            {/* ============== Section 4 — PUBLIC PATTERNS ============== */}
            <PatternBrowserCarousel isJa={isJa} />

            {/* ============== Section 5 — THE 群青 STORY ============== */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto w-full max-w-6xl px-6">
                    <p className="mb-12 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {home.story.label}
                    </p>
                    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                        {/* 群青 */}
                        <div className="flex flex-col gap-6">
                            <div className="gunjo-swatch aspect-[4/3] w-full rounded-2xl shadow-2xl" />
                            <div className="space-y-2">
                                <h3
                                    className="text-3xl font-bold tracking-tight"
                                    style={{ fontFamily: "var(--font-mincho), serif" }}
                                >
                                    {home.story.gunjoTitle}
                                </h3>
                                <p className="text-base leading-relaxed text-muted-foreground">
                                    {home.story.gunjoBody}
                                </p>
                                <code className="inline-block rounded bg-muted px-2 py-1 text-xs font-mono">
                                    #4D5AAF · hsl(232 39% 49%)
                                </code>
                            </div>
                        </div>
                        {/* 媚茶 */}
                        <div className="flex flex-col gap-6">
                            <div className="kobicha-swatch aspect-[4/3] w-full rounded-2xl shadow-xl" />
                            <div className="space-y-2">
                                <h3
                                    className="text-3xl font-bold tracking-tight"
                                    style={{ fontFamily: "var(--font-mincho), serif" }}
                                >
                                    {home.story.kobichaTitle}
                                </h3>
                                <p className="text-base leading-relaxed text-muted-foreground">
                                    {home.story.kobichaBody}
                                </p>
                                <code className="inline-block rounded bg-muted px-2 py-1 text-xs font-mono">
                                    #E8DDD3 / #3A2A25
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============== Section 6 — SSOT AND AI HANDOFF ============== */}
            <section className="border-t border-border/40 bg-gradient-to-b from-background via-accent/20 to-background py-24">
                <div className="mx-auto w-full max-w-6xl px-6">
                    <div className="mb-12 max-w-2xl space-y-3">
                        <Badge
                            variant="outline"
                            className="gap-1.5 border-accent-foreground/20 bg-accent text-accent-foreground"
                        >
                            <Cpu className="h-3 w-3" />
                            AI-native
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {home.ai.heading}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {home.ai.description}
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                            Object.keys(home.ai.cards) as Array<keyof typeof home.ai.cards>
                        ).map((key) => {
                            const card = home.ai.cards[key];
                            const Icon = aiCardIcons[key];
                            return (
                                <Card
                                    key={key}
                                    className="w-full border-border/60 bg-background/60 backdrop-blur"
                                >
                                    <CardHeader>
                                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <CardTitle className="text-base">
                                                {card.title}
                                            </CardTitle>
                                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                                {card.status}
                                            </span>
                                        </div>
                                        <CardDescription className="text-sm leading-relaxed">
                                            {card.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============== Section 7 — FOR ENGINEERS ============== */}
            <section className="border-t border-border/40 bg-background py-20">
                <div className="mx-auto w-full max-w-6xl px-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight">
                                {home.engineers.heading}
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                {home.engineers.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {home.engineers.stack}
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-3 lg:items-end">
                            <code className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-3 font-mono text-sm">
                                <span className="text-muted-foreground">$</span>
                                {home.engineers.install}
                            </code>
                            <Button asChild variant="outline">
                                <Link href="/docs/installation">
                                    {home.engineers.learnMore}
                                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============== Section 8 — ALPHA SCOPE ============== */}
            <section className="border-t border-border/40 bg-muted/20 py-20">
                <div className="mx-auto w-full max-w-3xl px-6 text-center">
                    <Badge variant="outline" className="mb-4 gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Becoming
                    </Badge>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight">
                        {home.becoming.heading}
                    </h2>
                    <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                        {home.becoming.body}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button asChild variant="outline">
                            <a
                                href="/docs/changelog"
                            >
                                {home.becoming.changelogCta}
                            </a>
                        </Button>
                        <Button asChild>
                            <a
                                href="https://github.com/uixhero/gunjo"
                                target="_blank"
                                rel="noreferrer"
                                className="gap-2"
                            >
                                <Github className="h-4 w-4" />
                                {home.becoming.githubCta}
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

        </main>
    );
}

function LiveComponentWorkbench({ isJa }: { isJa: boolean }) {
    const [query, setQuery] = React.useState("");
    const [syncEnabled, setSyncEnabled] = React.useState(true);
    const [progressValue, setProgressValue] = React.useState(58);
    const [category, setCategory] = React.useState("display");
    const [activeTab, setActiveTab] = React.useState("preview");

    const completeCount = Math.round((progressValue / 100) * COMPONENT_COUNT);
    const categoryLabel =
        category === "input"
            ? isJa
                ? "入力"
                : "Input"
            : category === "feedback"
              ? isJa
                  ? "フィードバック"
                  : "Feedback"
              : isJa
                ? "表示"
                : "Display";

    return (
        <section className="border-t border-border/40 bg-background py-24">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="mb-12 max-w-3xl">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Live components
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isJa
                            ? "触って分かる GunjoUI"
                            : "GunjoUI you can touch"}
                    </h2>
                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                        {isJa
                            ? "主要な UI をその場で触れるように並べています。入力、選択、切り替え、進捗、タブ、コピー、ツールチップの挙動を、トップページ上で確認できます。"
                            : "Core UI pieces are arranged as direct, interactive examples: input, selection, toggles, progress, tabs, copy feedback, and tooltips."}
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4 border-b border-border/60 pb-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {isJa ? "入力項目" : "Form inputs"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isJa
                                        ? "Input と Select を、実際のフォームに近い余白と幅で確認できます。"
                                        : "Input and Select are shown with practical form spacing and width."}
                                </p>
                            </div>
                            <Badge variant="outline">Input / Select</Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="home-input-name"
                                    className="text-sm font-medium"
                                >
                                    {isJa ? "表示名" : "Display name"}
                                </label>
                                <Input
                                    id="home-input-name"
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.currentTarget.value)
                                    }
                                    className="w-full"
                                    placeholder={
                                        isJa ? "例: Gunjo UI" : "e.g. Gunjo UI"
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="home-input-category"
                                    className="text-sm font-medium"
                                >
                                    {isJa ? "カテゴリ" : "Category"}
                                </label>
                                <Select
                                    id="home-input-category"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.currentTarget.value)
                                    }
                                    className="w-full"
                                >
                                    <option value="display">
                                        {isJa ? "表示" : "Display"}
                                    </option>
                                    <option value="input">
                                        {isJa ? "入力" : "Input"}
                                    </option>
                                    <option value="feedback">
                                        {isJa ? "フィードバック" : "Feedback"}
                                    </option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-b border-border/60 pb-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {isJa
                                        ? "ボタンと補足説明"
                                        : "Buttons and guidance"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isJa
                                        ? "主要操作、補助操作、危険操作、説明付き操作を横並びで確認できます。"
                                        : "Review primary, secondary, destructive, and explained actions together."}
                                </p>
                            </div>
                            <Badge variant="outline">
                                Button / TooltipButton
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button>{isJa ? "保存" : "Save"}</Button>
                            <Button variant="outline">
                                {isJa ? "下書き" : "Draft"}
                            </Button>
                            <Button variant="destructive">
                                {isJa ? "削除" : "Delete"}
                            </Button>
                            <TooltipButton
                                variant="secondary"
                                tooltip={
                                    isJa
                                        ? "現在の設定をプレビューに反映します"
                                        : "Apply the current settings to the preview"
                                }
                                tooltipOpenOnClick
                            >
                                {isJa ? "反映" : "Apply"}
                            </TooltipButton>
                        </div>
                    </div>

                    <div className="space-y-4 border-b border-border/60 pb-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {isJa ? "状態と進捗" : "State and progress"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isJa
                                        ? "Switch の状態と Progress の値を同じ文脈で確認します。"
                                        : "Switch state and Progress value are shown in one context."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {isJa ? "自動同期" : "Auto sync"}
                                </span>
                                <Switch
                                    checked={syncEnabled}
                                    onCheckedChange={setSyncEnabled}
                                    aria-label={isJa ? "自動同期" : "Auto sync"}
                                />
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span>
                                        {isJa ? "監査進捗" : "Audit progress"}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {completeCount} / {COMPONENT_COUNT}
                                    </span>
                                </div>
                                <Progress
                                    value={progressValue}
                                    className="w-full"
                                    aria-label={isJa ? "監査進捗" : "Audit progress"}
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setProgressValue((value) =>
                                        value >= 92 ? 24 : value + 14
                                    )
                                }
                            >
                                {isJa ? "進める" : "Advance"}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 border-b border-border/60 pb-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {isJa
                                        ? "タブと内容切り替え"
                                        : "Tabs and content"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isJa
                                        ? "プレビュー、コード、確認観点を同じ幅で切り替えます。"
                                        : "Switch preview, code, and review notes in the same surface."}
                                </p>
                            </div>
                            <Badge variant="outline">
                                Tabs / CopyButton / Kbd
                            </Badge>
                        </div>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="preview">
                                    {isJa ? "プレビュー" : "Preview"}
                                </TabsTrigger>
                                <TabsTrigger value="code">
                                    {isJa ? "コード" : "Code"}
                                </TabsTrigger>
                                <TabsTrigger value="review">
                                    {isJa ? "確認" : "Review"}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="preview" className="mt-4">
                                <div className="rounded-lg border border-border bg-muted/30 p-4">
                                    <p className="font-medium">
                                        {isJa
                                            ? categoryLabel + "カテゴリを表示中"
                                            : "Showing " + categoryLabel}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {syncEnabled
                                            ? isJa
                                                ? "同期は有効です。"
                                                : "Sync is enabled."
                                            : isJa
                                              ? "同期は一時停止中です。"
                                              : "Sync is paused."}
                                    </p>
                                </div>
                            </TabsContent>
                            <TabsContent value="code" className="mt-4">
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-3 py-2">
                                    <code className="truncate text-sm">
                                        npm install @gunjo/ui
                                    </code>
                                    <CopyButton
                                        value="npm install @gunjo/ui"
                                        copyLabel={isJa ? "コピー" : "Copy"}
                                        copiedLabel={
                                            isJa ? "コピーしました" : "Copied"
                                        }
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="review" className="mt-4">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <span>
                                        {isJa ? "ショートカット" : "Shortcut"}
                                    </span>
                                    <Kbd>⌘</Kbd>
                                    <Kbd>K</Kbd>
                                    <span>
                                        {isJa
                                            ? "でコンポーネント検索"
                                            : "for component search"}
                                    </span>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {isJa
                                    ? "GunjoUI の現在値"
                                    : "Current GunjoUI scale"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isJa
                                    ? "公開前に確認したコンポーネント、パターン、トークンの規模を表示しています。"
                                    : "A compact view of the component, pattern, and token scale reviewed for the alpha."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <Statistic
                                label={isJa ? "コンポーネント" : "Components"}
                                value={String(COMPONENT_COUNT)}
                                hint={isJa ? "監査済み" : "audited"}
                                className="flex-1"
                            />
                            <Statistic
                                label={isJa ? "公開パターン" : "Public patterns"}
                                value="3"
                                hint="Dashboard / Auth / Media Library"
                                className="flex-1"
                            />
                            <Statistic
                                label={isJa ? "主要トークン" : "Token groups"}
                                value="8+"
                                hint={
                                    isJa
                                        ? "色・余白・文字・影など"
                                        : "color, space, type, shadow"
                                }
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const publicPatternSlides = [
    {
        key: "dashboard",
        titleJa: "ダッシュボード",
        titleEn: "Dashboard",
        path: "/patterns/dashboard/overview",
        href: "/patterns/dashboard/overview",
    },
    {
        key: "auth",
        titleJa: "認証",
        titleEn: "Auth",
        path: "/patterns/auth/account",
        href: "/patterns/auth/account",
    },
    {
        key: "media",
        titleJa: "メディアライブラリ",
        titleEn: "Media Library",
        path: "/patterns/media-library",
        href: "/patterns/media-library",
    },
] as const;

function PatternBrowserCarousel({ isJa }: { isJa: boolean }) {
    return (
        <section className="border-t border-border/40 bg-muted/20 py-24">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            Public patterns
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isJa
                                ? "公開対象のパターンを擬似ブラウザで見る"
                                : "Preview public patterns in a browser frame"}
                        </h2>
                        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                            {isJa
                                ? "公開対象パターンのプレビュー。ダッシュボード、認証、メディアライブラリの仕上がりをトップで確認し、「実ページを開く」で実物を操作できます。"
                                : "Previews of the public patterns — dashboard, auth, and media library. Open any to use the real, interactive page."}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/patterns">
                            {isJa ? "パターン一覧へ" : "Open patterns"}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>

                <Carousel
                    className="w-full"
                    opts={{ loop: true }}
                    controls={{
                        navigation: true,
                        dots: true,
                        previousClassName:
                            "left-3 z-10 bg-background/90 backdrop-blur",
                        nextClassName:
                            "right-3 z-10 bg-background/90 backdrop-blur",
                        labels: {
                            previous: isJa ? "前のパターン" : "Previous pattern",
                            next: isJa ? "次のパターン" : "Next pattern",
                            dots: isJa ? "パターンを選択" : "Select pattern",
                            getDotLabel: (index) =>
                                isJa
                                    ? (publicPatternSlides[index]?.titleJa ??
                                          "パターン") + " を表示"
                                    : "Show " +
                                      (publicPatternSlides[index]?.titleEn ??
                                          "pattern"),
                        },
                    }}
                >
                    <CarouselContent>
                        {publicPatternSlides.map((slide) => (
                            <CarouselItem key={slide.key}>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {isJa
                                                    ? slide.titleJa
                                                    : slide.titleEn}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {slide.path}
                                            </p>
                                        </div>
                                        <Button asChild size="sm">
                                            <Link href={slide.href}>
                                                {isJa
                                                    ? "実ページを開く"
                                                    : "Open page"}
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
                                        <PatternSlideContent
                                            kind={slide.key}
                                            title={isJa ? slide.titleJa : slide.titleEn}
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}

const PATTERN_THUMB_SLUG: Record<
    (typeof publicPatternSlides)[number]["key"],
    string
> = {
    dashboard: "dashboard",
    auth: "auth",
    media: "media-library",
};

// Static preview image (a screenshot of the live /embed/patterns/<slug>
// browser-framed page). The homepage used to mount the three full pattern
// apps live, which dominated the page's JS / Speed Index; a thumbnail keeps
// the look while "Open page" reaches the real, interactive route.
function PatternSlideContent({
    kind,
    title,
}: {
    kind: (typeof publicPatternSlides)[number]["key"];
    title: string;
}) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const { resolvedTheme } = useTheme();
    const mode: "light" | "dark" =
        mounted && resolvedTheme === "light" ? "light" : "dark";
    const slug = PATTERN_THUMB_SLUG[kind];

    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={`/patterns-thumbs/${slug}.${mode}.png`}
            alt={`${title} preview`}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
        />
    );
}
