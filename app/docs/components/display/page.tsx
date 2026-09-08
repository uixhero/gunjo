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
import { UixheroRationaleLinks } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const SAMPLE_CODE = {
    ja: `import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    MetadataList,
    PersonCell,
    Separator,
    StatGroup,
    StatusLevel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tag,
    Timeline,
} from "@gunjo/ui";

const REVIEW_LEVELS = [
    { value: "draft", label: "下書き" },
    { value: "review", label: "レビュー中" },
    { value: "approved", label: "承認済み" },
];

const METRICS = [
    { label: "未処理の素材", value: "12" },
    { label: "今週の承認", value: "5" },
    { label: "法務の確認待ち", value: "2" },
];

const ASSETS = [
    {
        id: "AS-1042",
        title: "春キャンペーンのメインビジュアル",
        tag: "デザイン",
        level: "review",
    },
    { id: "AS-1043", title: "製品ツアーのナレーション", tag: "コピー", level: "draft" },
    { id: "AS-1044", title: "料金ページのヒーロー", tag: "デザイン", level: "approved" },
];

const FACTS = [
    { label: "担当", value: "ブランド制作" },
    { label: "期日", value: "2026-06-12" },
    { label: "配信先", value: "サイトとメール" },
];

const HISTORY = [
    {
        time: "09:20",
        title: "下書きを提出",
        description: "3点がレビューに入りました。",
    },
    {
        time: "11:05",
        title: "法務からの指摘",
        description: "料金の書き方を1箇所直します。",
    },
    { time: "14:40", title: "メインビジュアルを承認", description: "配信の予約に進めます。" },
];

export function AssetReviewBoard() {
    return (
        <Card>
            <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>春キャンペーンのレビュー</CardTitle>
                        <CardDescription>
                            承認する前にレビュー担当が見るものを1画面にまとめています。
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">レビュー中</Badge>
                </div>
                <PersonCell
                    name="近藤 彩"
                    secondary="ブランド制作"
                    tertiary="この一括レビューの担当"
                />
            </CardHeader>
            <CardContent className="space-y-6">
                <StatGroup items={METRICS} cols={{ base: 1, sm: 3 }} />
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>素材</TableHead>
                            <TableHead>種別</TableHead>
                            <TableHead>状態</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ASSETS.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell>
                                    <span className="font-medium">{asset.title}</span>
                                    <span className="block text-xs text-muted-foreground">
                                        {asset.id}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Tag>{asset.tag}</Tag>
                                </TableCell>
                                <TableCell>
                                    <StatusLevel levels={REVIEW_LEVELS} value={asset.level} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="grid gap-6 md:grid-cols-2">
                    <MetadataList items={FACTS} />
                    <Timeline items={HISTORY} />
                </div>
            </CardContent>
        </Card>
    );
}`,
    en: `import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    MetadataList,
    PersonCell,
    Separator,
    StatGroup,
    StatusLevel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tag,
    Timeline,
} from "@gunjo/ui";

const REVIEW_LEVELS = [
    { value: "draft", label: "Draft" },
    { value: "review", label: "In review" },
    { value: "approved", label: "Approved" },
];

const METRICS = [
    { label: "Open assets", value: "12" },
    { label: "Approved this week", value: "5" },
    { label: "Waiting on legal", value: "2" },
];

const ASSETS = [
    {
        id: "AS-1042",
        title: "Spring campaign key visual",
        tag: "Design",
        level: "review",
    },
    { id: "AS-1043", title: "Product tour narration", tag: "Copy", level: "draft" },
    { id: "AS-1044", title: "Pricing page hero", tag: "Design", level: "approved" },
];

const FACTS = [
    { label: "Owner", value: "Brand studio" },
    { label: "Due", value: "2026-06-12" },
    { label: "Channel", value: "Web and email" },
];

const HISTORY = [
    {
        time: "09:20",
        title: "Draft submitted",
        description: "Three assets entered review.",
    },
    {
        time: "11:05",
        title: "Legal comment",
        description: "Pricing wording needs one change.",
    },
    { time: "14:40", title: "Key visual approved", description: "Ready for scheduling." },
];

export function AssetReviewBoard() {
    return (
        <Card>
            <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>Spring campaign review</CardTitle>
                        <CardDescription>
                            Everything the reviewer needs before approving the batch.
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">In review</Badge>
                </div>
                <PersonCell
                    name="Aya Kondo"
                    secondary="Brand studio"
                    tertiary="Reviewer for this batch"
                />
            </CardHeader>
            <CardContent className="space-y-6">
                <StatGroup items={METRICS} cols={{ base: 1, sm: 3 }} />
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ASSETS.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell>
                                    <span className="font-medium">{asset.title}</span>
                                    <span className="block text-xs text-muted-foreground">
                                        {asset.id}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Tag>{asset.tag}</Tag>
                                </TableCell>
                                <TableCell>
                                    <StatusLevel levels={REVIEW_LEVELS} value={asset.level} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="grid gap-6 md:grid-cols-2">
                    <MetadataList items={FACTS} />
                    <Timeline items={HISTORY} />
                </div>
            </CardContent>
        </Card>
    );
}`,
};

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
                    <p className="text-lg leading-relaxed text-muted-foreground">
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

            <section className="space-y-4" id="sample">
                <div className="space-y-1 border-b pb-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "まとめて使う見本" : "Using them together"}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {isJa
                            ? "この分類のコンポーネントをまとめて、素材レビューの1画面を組んだ例です。そのまま貼り付けて動きます。"
                            : "One asset review screen assembled from this category. Paste it as-is and it runs."}
                    </p>
                </div>
                <CodeBlock code={SAMPLE_CODE[locale]} />
            </section>

            <section className="space-y-3" id="design-decisions">
                <div className="border-b pb-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {isJa
                        ? "この分類のコンポーネントをいつ使い、いつ使わないかは、UIXHERO の「UIコンポーネント完全ガイド」にある「カテゴリ 03｜リスト・データ表示」の節にまとめています。まとめて見せる情報の単位と、その場で操作させるかどうかで、選ぶコンポーネントが変わります。"
                        : "When to reach for each display component, and when to leave it alone, is covered in the category 03 section, lists and data display, of the UI component guide on UIXHERO. The choice turns on the unit of information you show together, and whether people act on it in place."}
                </p>
            </section>

            <UixheroRationaleLinks
                locale={locale}
                uixheroLinks={[
                    {
                        label: isJa
                            ? "UIXHERO: UIコンポーネント完全ガイド（カテゴリ 03｜リスト・データ表示）"
                            : "UIXHERO: UI component guide, category 03 lists and data display (in Japanese)",
                        href: `${UIXHERO_BASE_URL}/blog/ui-components-complete-guide#カテゴリ-03リストデータ表示`,
                    },
                ]}
            />
        </div>
    );
}
