"use client";

import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionGroup,
    AccordionItem,
    AccordionTrigger,
    AssetCard,
    AssetGrid,
    Avatar,
    AvatarFallback,
    AvatarGroup,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ImagePreview,
    Icon as GunjoIcon,
    Separator,
    SearchableAccordion,
} from "@gunjo/ui";
import {
    IconArrowRight,
    IconCards,
    IconChevronRight,
    IconCircleCheck,
    IconInfoCircle,
    IconLayoutGrid,
    IconPhoto,
    IconUsers,
} from "@tabler/icons-react";

import { useLocale } from "@/components/providers/LocaleProvider";

const asset = {
    id: "display-overview-asset",
    title: "campaign_visual.png",
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=640&q=80",
    width: 1200,
    height: 900,
    type: "PNG",
    size: "1.2MB",
    createdAt: "2026-05-18",
    isFavorite: true,
    rating: 4.5,
};

const assetItems = [
    asset,
    {
        ...asset,
        id: "display-overview-square",
        title: "product_square.png",
        src: "https://images.unsplash.com/photo-1481437642641-2f0ae875f836?auto=format&fit=crop&w=480&q=80",
        rating: 3.5,
    },
    {
        ...asset,
        id: "display-overview-story",
        title: "story_mock.png",
        src: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=480&q=80",
        rating: undefined,
    },
];

const groups = [
    {
        title: { ja: "構造を見せる", en: "Structure" },
        description: {
            ja: "情報を折りたたむ、カード化する、一覧として並べるための表示コンポーネントです。",
            en: "Display components for folding, carding, and listing information.",
        },
        icon: IconLayoutGrid,
        items: [
            {
                name: "Accordion",
                href: "/docs/components/accordion",
                purpose: { ja: "縦積みの開閉セクション", en: "Expandable vertical sections" },
                useWhen: { ja: "FAQ、設定項目、長い説明を段階的に見せたい時。", en: "FAQ, settings, and progressive disclosure." },
                preview: "accordion",
            },
            {
                name: "AccordionGroup",
                href: "/docs/components/accordion-group",
                purpose: { ja: "全展開操作付きの開閉グループ", en: "Accordion group with expand controls" },
                useWhen: { ja: "設定項目やFAQをまとめ、すべて展開・すべて閉じる操作を付けたい時。", en: "Settings and FAQ groups that need expand-all and collapse-all actions." },
                preview: "accordionGroup",
            },
            {
                name: "SearchableAccordion",
                href: "/docs/components/searchable-accordion",
                purpose: { ja: "検索とカテゴリ付きの開閉リスト", en: "Searchable accordion list" },
                useWhen: { ja: "FAQ やヘルプ項目を検索・カテゴリで絞り込みたい時。", en: "FAQ and help lists that need search and categories." },
                preview: "searchableAccordion",
            },
            {
                name: "AssetCard",
                href: "/docs/components/asset-card",
                purpose: { ja: "メディアや制作物の単体カード", en: "Single media or creative asset card" },
                useWhen: { ja: "選択、お気に入り、評価、プレビュー操作を持つ素材カード。", en: "Asset cards with selection, favorite, rating, and preview actions." },
                preview: "assetCard",
            },
            {
                name: "AssetGrid",
                href: "/docs/components/asset-grid",
                purpose: { ja: "アセットカードのレスポンシブ一覧", en: "Responsive asset card grid" },
                useWhen: { ja: "メディアライブラリや制作物一覧をグリッドで確認する時。", en: "Media libraries and creative result grids." },
                preview: "assetGrid",
            },
            {
                name: "ImagePreview",
                href: "/docs/components/image-preview",
                purpose: { ja: "枠付きの画像プレビュー面", en: "Framed image preview surface" },
                useWhen: { ja: "アセットカードや選択ダイアログで画像面だけを再利用したい時。", en: "Reusable image surfaces inside asset cards and picker dialogs." },
                preview: "imagePreview",
            },
        ],
    },
    {
        title: { ja: "人物や状態を見せる", en: "People and status" },
        description: {
            ja: "ユーザー、参加者、分類、状態を短く伝えるためのコンポーネントです。",
            en: "Components for compactly showing people, participants, categories, and status.",
        },
        icon: IconUsers,
        items: [
            {
                name: "Avatar",
                href: "/docs/components/avatar",
                purpose: { ja: "ユーザー画像とフォールバック", en: "User image with fallback" },
                useWhen: { ja: "プロフィール、担当者、コメント投稿者を表す時。", en: "Profiles, assignees, and comment authors." },
                preview: "avatar",
            },
            {
                name: "AvatarGroup",
                href: "/docs/components/avatar-group",
                purpose: { ja: "複数ユーザーの重なり表示", en: "Stacked multiple users" },
                useWhen: { ja: "参加者、共同編集者、担当チームを省スペースで示す時。", en: "Participants, collaborators, and teams in tight space." },
                preview: "avatarGroup",
            },
            {
                name: "Badge",
                href: "/docs/components/badge",
                purpose: { ja: "状態、分類、タグの短いラベル", en: "Short status, category, or tag label" },
                useWhen: { ja: "状態、重要度、カテゴリ、フィルター条件を小さく表示する時。", en: "Status, priority, category, and filter chips." },
                preview: "badge",
            },
            {
                name: "Icon",
                href: "/docs/components/icon",
                purpose: { ja: "アイコンのサイズと線幅の統一", en: "Unified icon size and stroke" },
                useWhen: { ja: "アイコンを GunjoUI の共通ルールで表示する時。", en: "Rendering icons with GunjoUI rules." },
                preview: "icon",
            },
        ],
    },
] as const;

function Preview({ type, isJa }: { type: string; isJa: boolean }) {
    if (type === "accordion") {
        return (
            <Accordion type="single" collapsible className="w-full max-w-xs">
                <AccordionItem value="overview">
                    <AccordionTrigger>{isJa ? "詳細" : "Details"}</AccordionTrigger>
                    <AccordionContent>
                        {isJa ? "必要な情報だけを先に見せます。" : "Display only what is needed first."}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    }

    if (type === "accordionGroup") {
        return (
            <AccordionGroup
                values={["overview", "details"]}
                label={isJa ? "設定" : "Settings"}
                expandLabel={isJa ? "すべて展開" : "Expand all"}
                collapseLabel={isJa ? "すべて閉じる" : "Collapse all"}
                className="w-full max-w-xs"
            >
                <AccordionItem value="overview">
                    <AccordionTrigger>{isJa ? "概要" : "Overview"}</AccordionTrigger>
                    <AccordionContent>
                        {isJa ? "基本情報を確認します。" : "Review the basics."}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="details">
                    <AccordionTrigger>{isJa ? "詳細" : "Details"}</AccordionTrigger>
                    <AccordionContent>
                        {isJa ? "詳細設定を確認します。" : "Review detailed settings."}
                    </AccordionContent>
                </AccordionItem>
            </AccordionGroup>
        );
    }

    if (type === "searchableAccordion") {
        return (
            <SearchableAccordion
                className="w-full max-w-sm"
                items={[
                    {
                        id: "account",
                        title: isJa ? "アカウント設定" : "Account settings",
                        body: isJa ? "プロフィールと請求情報を確認します。" : "Review profile and billing settings.",
                        category: "settings",
                    },
                    {
                        id: "security",
                        title: isJa ? "セキュリティ" : "Security",
                        body: isJa ? "認証と権限を確認します。" : "Review authentication and permissions.",
                        category: "settings",
                    },
                ]}
                showCategoryTabs={false}
                labels={{
                    searchPlaceholder: isJa ? "項目を検索..." : "Search items...",
                    clearSearchLabel: isJa ? "検索語を消去" : "Clear search",
                    resultCountLabel: (visible, total) =>
                        isJa ? `${visible} / ${total} 件を表示` : `Showing ${visible} of ${total}`,
                    expandLabel: isJa ? "表示中の項目をすべて開く" : "Open visible items",
                    collapseLabel: isJa ? "表示中の項目をすべて閉じる" : "Close visible items",
                }}
            />
        );
    }

    if (type === "assetCard") {
        return <AssetCard asset={asset} selected className="w-36" />;
    }

    if (type === "assetGrid") {
        return <AssetGrid items={assetItems} selectedIds={["display-overview-asset"]} minColumnWidth={82} gap={8} className="max-w-sm" />;
    }

    if (type === "imagePreview") {
        return <ImagePreview src={asset.src} alt={asset.title} className="w-36 rounded-lg" />;
    }

    if (type === "avatar") {
        return (
            <Avatar>
                <AvatarFallback>GU</AvatarFallback>
            </Avatar>
        );
    }

    if (type === "avatarGroup") {
        return (
            <AvatarGroup max={3}>
                {["AK", "ST", "YY", "MK"].map((initials) => (
                    <Avatar key={initials}>
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                ))}
            </AvatarGroup>
        );
    }

    if (type === "icon") {
        return (
            <div className="flex items-center gap-3 text-muted-foreground">
                <GunjoIcon icon={IconChevronRight} size="sm" />
                <GunjoIcon icon={IconCircleCheck} size="md" className="text-success" />
                <GunjoIcon icon={IconInfoCircle} size="lg" className="text-info" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            <Badge>{isJa ? "有効" : "Active"}</Badge>
            <Badge variant="secondary">{isJa ? "デザイン" : "Design"}</Badge>
            <Badge variant="outline">P2</Badge>
        </div>
    );
}

export default function DisplayOverviewPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="space-y-10" data-doc-category-overview="true">
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <IconCards className="h-5 w-5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {isJa ? "表示" : "Display"}
                    </span>
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {isJa ? "表示の概要" : "Display Overview"}
                    </h1>
                    <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                        {isJa
                            ? "表示系コンポーネントは、情報の構造、人物、状態、メディアを読み取りやすく整理するための部品です。まず用途を俯瞰し、必要な個別コンポーネントへ移動できます。"
                            : "Display components organize structure, people, status, and media so information remains easy to scan. Start here to choose the component that fits the job."}
                    </p>
                </div>
            </header>

            <section className="space-y-6">
                {groups.map((group) => {
                    const Icon = group.icon;
                    return (
                        <div key={group.title.en} className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-subtle text-primary-subtle-foreground">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        {isJa ? group.title.ja : group.title.en}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {isJa ? group.description.ja : group.description.en}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {group.items.map((item) => (
                                    <Card key={item.name} className="overflow-hidden">
                                        <CardContent className="grid gap-4 p-4 md:grid-cols-[15rem_minmax(0,1fr)_auto] md:items-center">
                                            <div className="flex min-h-28 items-center justify-center rounded-md bg-muted/35 p-4">
                                                <Preview type={item.preview} isJa={isJa} />
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-baseline gap-2">
                                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                                    <span className="text-xs text-muted-foreground">
                                                        {isJa ? item.purpose.ja : item.purpose.en}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed text-muted-foreground">
                                                    {isJa ? item.useWhen.ja : item.useWhen.en}
                                                </p>
                                            </div>
                                            <Button asChild variant="outline" className="justify-self-start md:justify-self-end">
                                                <Link href={item.href}>
                                                    {isJa ? "詳細を見る" : "Open docs"}
                                                    <IconArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{isJa ? "表示系の共通ルール" : "Shared display rules"}</CardTitle>
                        <CardDescription>
                            {isJa
                                ? "意味がある情報はテキストでも伝え、装飾だけに頼らない。表示密度は用途に合わせて揃えます。"
                                : "Meaningful information must remain available in text. Match density to the surrounding workflow."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex gap-2">
                            <IconChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p>{isJa ? "状態色だけで意味を伝えず、ラベルや補助テキストを併用します。" : "Do not communicate status through color alone. Pair color with labels or helper text."}</p>
                        </div>
                        <div className="flex gap-2">
                            <IconChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p>{isJa ? "カードやグリッドは、タイトル、メタ情報、操作の位置を揃えます。" : "Cards and grids should align title, metadata, and action placement."}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{isJa ? "迷いやすい使い分け" : "Decision points"}</CardTitle>
                        <CardDescription>
                            {isJa
                                ? "似ている表示コンポーネントは、情報の単位と操作の有無で選びます。"
                                : "Choose similar display components by information unit and action needs."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex gap-2">
                            <IconPhoto className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p>{isJa ? "メディア単体は AssetCard、複数一覧は AssetGrid を使います。" : "Use AssetCard for one media item and AssetGrid for browsable collections."}</p>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <IconUsers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p>{isJa ? "人物単体は Avatar、参加者のまとまりは AvatarGroup を使います。" : "Use Avatar for one person and AvatarGroup for compact participant sets."}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
