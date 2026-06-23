"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { IconBookmark as Bookmark, IconMessageCircle as MessageCircle, IconRepeat as Repeat2 } from "@tabler/icons-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    ImagePreview,
    Skeleton,
} from "@gunjo/ui";

export default function CardPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";

    const code = `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gunjo/ui"

const project = {
  title: "${isJa ? "プロジェクト概要" : "Project overview"}",
  description: "${isJa ? "状態、担当者、次の確認事項をまとめます。" : "Summarize status, owner, and next checks."}",
  summary: "${isJa ? "カードはページ内で情報を区切るためのコンテナです。" : "Use Card to group related content inside a page."}",
}

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {project.summary}
        </p>
      </CardContent>
    </Card>
  )
}`;

    const usageCode = `import { Card, CardContent } from "@gunjo/ui"

const card = {
  body: "${isJa ? "カード本文" : "Card content"}",
}

export function CardUsage() {
  return (
    <Card>
      <CardContent>
        <p>{card.body}</p>
      </CardContent>
    </Card>
  )
}`;

    const articleCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gunjo/ui"

const article = {
  author: "${isJa ? "青井 花" : "Aoi Hana"}",
  fallback: "${isJa ? "青" : "AH"}",
  affiliation: "${isJa ? "デザイン編集部" : "Design editorial"}",
  category: "${isJa ? "記事" : "Article"}",
  title: "${isJa ? "レビューしやすい一覧画面の作り方" : "Designing review-friendly list screens"}",
  description: "${isJa ? "大量の項目を比較しながら確認する画面で、視線を迷わせないための設計メモです。" : "A note on keeping comparison-heavy review screens easy to scan."}",
  readTime: "${isJa ? "読了目安 6分" : "6 min read"}",
}

export function ArticleCard() {
  return (
    <Card className="w-[360px]">
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3">
          <Avatar aria-label={article.author}>
            <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
            <AvatarFallback>{article.fallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{article.author}</p>
            <p className="text-xs text-muted-foreground">{article.affiliation}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">{article.category}</Badge>
        </div>
        <div className="space-y-2">
          <CardTitle>{article.title}</CardTitle>
          <CardDescription>{article.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{article.readTime}</p>
      </CardContent>
    </Card>
  )
}`;

    const timelineCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@gunjo/ui"
import { IconBookmark as Bookmark, IconMessageCircle as MessageCircle, IconRepeat as Repeat2 } from "@tabler/icons-react"

const post = {
  author: "${isJa ? "田中 空" : "Sora Tanaka"}",
  fallback: "${isJa ? "田" : "ST"}",
  handle: "@sora",
  time: "${isJa ? "12分前" : "12 min ago"}",
  body: "${isJa ? "テーブルのキャプションと見出し背景を揃えたら、本文行との役割の違いがかなり読み取りやすくなりました。" : "Matching the table caption and header backgrounds made the role separation much easier to scan."}",
  replies: "${isJa ? "返信 4" : "4 replies"}",
  reposts: "${isJa ? "共有 12" : "12 reposts"}",
  saves: "${isJa ? "保存 28" : "28 saves"}",
}

export function TimelineCard() {
  return (
    <Card className="w-[360px]">
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <Avatar aria-label={post.author} presence="online">
          <AvatarImage src="" alt="" />
          <AvatarFallback>{post.fallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="font-medium">{post.author}</p>
            <p className="text-xs text-muted-foreground">{post.time}</p>
          </div>
          <p className="text-xs text-muted-foreground">{post.handle}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6">{post.body}</p>
      </CardContent>
      <CardFooter className="justify-start gap-5 border-t px-6 py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" />{post.replies}</span>
        <span className="inline-flex items-center gap-1.5"><Repeat2 className="h-3.5 w-3.5" />{post.reposts}</span>
        <span className="inline-flex items-center gap-1.5"><Bookmark className="h-3.5 w-3.5" />{post.saves}</span>
      </CardFooter>
    </Card>
  )
}`;

    const actionCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@gunjo/ui"

const invitation = {
  title: "${isJa ? "招待を送信" : "Send invitation"}",
  description: "${isJa ? "権限と参加先ワークスペースを確認してください。" : "Confirm permissions and the target workspace."}",
  cancelLabel: "${isJa ? "戻る" : "Back"}",
  submitLabel: "${isJa ? "送信" : "Send"}",
}

export function ActionCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{invitation.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {invitation.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">{invitation.cancelLabel}</Button>
        <Button>{invitation.submitLabel}</Button>
      </CardFooter>
    </Card>
  )
}`;

    const statCode = `import { Badge, Card, CardContent, CardDescription, CardHeader } from "@gunjo/ui"

const metric = {
  label: "${isJa ? "月間売上" : "Monthly revenue"}",
  value: "${isJa ? "452万円" : "$45,231"}",
  delta: "+12.4%",
  description: "${isJa ? "前月比 +48万円" : "vs $40,234 last month"}",
}

export function MetricCard() {
  return (
    <Card className="w-[260px]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardDescription>{metric.label}</CardDescription>
        <Badge variant="secondary">{metric.delta}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{metric.value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
      </CardContent>
    </Card>
  )
}`;

    const mediaCode = `import { Badge, Card, CardDescription, CardHeader, CardTitle, ImagePreview } from "@gunjo/ui"

const media = {
  src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80",
  alt: "${isJa ? "山と湖の風景写真" : "Landscape photo with mountains and lake"}",
  previewLabel: "${isJa ? "拡大表示" : "Open preview"}",
  title: "${isJa ? "メディアライブラリ" : "Media library"}",
  badge: "${isJa ? "表示" : "Display"}",
  description: "${isJa ? "キャンペーンで使うメインビジュアル候補です。" : "A hero visual candidate for the campaign."}",
}

export function MediaCard() {
  return (
    <Card className="w-[340px] overflow-hidden">
      <ImagePreview
        src={media.src}
        alt={media.alt}
        aspectRatio="video"
        className="rounded-none border-0 shadow-none"
        previewLabel={media.previewLabel}
      />
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{media.title}</CardTitle>
          <Badge variant="secondary">{media.badge}</Badge>
        </div>
        <CardDescription>{media.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}`;

    const contentCode = `import { Badge, Button, Card, CardDescription, CardFooter, CardHeader, CardTitle, ImagePreview } from "@gunjo/ui"

const product = {
  src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80",
  alt: "${isJa ? "ノートパソコンの商品写真" : "Laptop product photo"}",
  previewLabel: "${isJa ? "拡大表示" : "Open preview"}",
  category: "${isJa ? "商品" : "Product"}",
  status: "${isJa ? "新着" : "New"}",
  name: "${isJa ? "ワークステーション Pro" : "Workstation Pro"}",
  description: "${isJa ? "制作、分析、レビュー作業向けの高性能モデルです。" : "A high-performance model for creative, analytics, and review work."}",
  priceLabel: "${isJa ? "価格" : "Price"}",
  price: "${isJa ? "248,000円" : "$1,699"}",
  actionLabel: "${isJa ? "詳しく見る" : "View details"}",
}

export function ProductCard() {
  return (
    <Card className="w-[320px] overflow-hidden">
      <ImagePreview
        src={product.src}
        alt={product.alt}
        aspectRatio="video"
        className="rounded-none border-0 shadow-none"
        previewLabel={product.previewLabel}
      />
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{product.category}</Badge>
          <Badge variant="secondary">{product.status}</Badge>
        </div>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-stretch gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">{product.priceLabel}</span>
          <span className="text-xl font-semibold">{product.price}</span>
        </div>
        <Button className="w-full">{product.actionLabel}</Button>
      </CardFooter>
    </Card>
  )
}`;

    const loadingCode = `import { Card, CardContent, CardHeader, Skeleton } from "@gunjo/ui"

export function LoadingCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-2">
        <Skeleton shape="text" className="w-1/2" />
        <Skeleton shape="text" className="w-3/4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton shape="text" />
        <Skeleton shape="text" className="w-5/6" />
      </CardContent>
    </Card>
  )
}`;

    const propsData = [
        {
            name: "className",
            type: "string",
            description: isJa ? "カードルートへ追加するクラスです。" : "Additional class names applied to the card root.",
        },
        {
            name: "children",
            type: "ReactNode",
            description: isJa ? "カード内に配置するヘッダー、本文、フッターなどの内容です。" : "Card content such as header, body, and footer slots.",
        },
        {
            name: "CardTitle as",
            type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div"',
            description: isJa
                ? "CardTitle が描画する見出し要素。既定は h3。ページの見出し階層に合わせて as=\"h2\" などに変更し、h1→h3 の飛びを防げます。"
                : "Heading element CardTitle renders. Defaults to h3; set e.g. as=\"h2\" to fit the page heading order and avoid an h1→h3 jump.",
        },
        {
            name: "CardHeader / CardContent / CardFooter",
            type: "React.HTMLAttributes<HTMLDivElement>",
            description: isJa ? "カード内の見出し、本文、フッターを分けるためのスロットです。" : "Slots for separating header, body, and footer content inside a card.",
        },
    ];

    return (
        <ComponentLayout
            title={displayMetadata.card.title}
            description={displayMetadata.card.description}
            usedComponents={[
                { name: "Card", href: "/docs/components/card" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Avatar", href: "/docs/components/avatar" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
                { name: "Skeleton", href: "/docs/components/skeleton" },
            ]}
            relatedComponents={[
                { name: "AssetCard", href: "/docs/components/asset-card" },
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "Alert", href: "/docs/components/alert" },
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "HoverCard", href: "/docs/components/hover-card" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto">
                <Card className="w-[350px] max-w-full">
                    <CardHeader>
                        <CardTitle>{isJa ? "プロジェクト概要" : "Project overview"}</CardTitle>
                        <CardDescription>
                            {isJa ? "状態、担当者、次の確認事項をまとめます。" : "Summarize status, owner, and next checks."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {isJa ? "カードはページ内で情報を区切るためのコンテナです。" : "Use Card to group related content inside a page."}
                        </p>
                    </CardContent>
                </Card>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "stat",
                            title: isJa ? "指標カード" : "Metric card",
                            description: isJa
                                ? "数値、補足、差分を短く見せるカードです。状態の強調には Badge を組み合わせます。"
                                : "Use a compact card for a value, supporting text, and a delta badge.",
                            preview: (
                                <Card className="w-[260px] max-w-full">
                                    <CardHeader className="flex-row items-center justify-between space-y-0">
                                        <CardDescription>{isJa ? "月間売上" : "Monthly revenue"}</CardDescription>
                                        <Badge variant="secondary">+12.4%</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold">{isJa ? "452万円" : "$45,231"}</div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {isJa ? "前月比 +48万円" : "vs $40,234 last month"}
                                        </p>
                                    </CardContent>
                                </Card>
                            ),
                            code: statCode,
                        },
                        {
                            key: "media",
                            title: isJa ? "メディアカード" : "Media card",
                            description: isJa
                                ? "画像、タイトル、説明、分類をまとめるカードです。画像面は ImagePreview を組み合わせます。"
                                : "Compose Card with ImagePreview when the image is part of the content.",
                            preview: (
                                <Card className="w-[340px] max-w-full overflow-hidden">
                                    <ImagePreview
                                        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80"
                                        alt={isJa ? "山と湖の風景写真" : "Landscape photo with mountains and lake"}
                                        aspectRatio="video"
                                        className="rounded-none border-0 shadow-none"
                                        previewLabel={isJa ? "拡大表示" : "Open preview"}
                                    />
                                    <CardHeader>
                                        <div className="flex items-center justify-between gap-3">
                                            <CardTitle>{isJa ? "メディアライブラリ" : "Media library"}</CardTitle>
                                            <Badge variant="secondary">{isJa ? "表示" : "Display"}</Badge>
                                        </div>
                                        <CardDescription>
                                            {isJa ? "キャンペーンで使うメインビジュアル候補です。" : "A hero visual candidate for the campaign."}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ),
                            code: mediaCode,
                        },
                        {
                            key: "content",
                            title: isJa ? "コンテンツカード" : "Content card",
                            description: isJa
                                ? "商品、記事、テンプレートなど、一覧に並ぶ項目の概要と次の操作を表示します。"
                                : "Use for products, articles, templates, or other list items with a short summary and next action.",
                            preview: (
                                <Card className="w-[320px] max-w-full overflow-hidden">
                                    <ImagePreview
                                        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80"
                                        alt={isJa ? "ノートパソコンの商品写真" : "Laptop product photo"}
                                        aspectRatio="video"
                                        className="rounded-none border-0 shadow-none"
                                        previewLabel={isJa ? "拡大表示" : "Open preview"}
                                    />
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{isJa ? "商品" : "Product"}</Badge>
                                            <Badge variant="secondary">{isJa ? "新着" : "New"}</Badge>
                                        </div>
                                        <CardTitle>{isJa ? "ワークステーション Pro" : "Workstation Pro"}</CardTitle>
                                        <CardDescription>
                                            {isJa ? "制作、分析、レビュー作業向けの高性能モデルです。" : "A high-performance model for creative, analytics, and review work."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex-col items-stretch gap-3">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-sm text-muted-foreground">{isJa ? "価格" : "Price"}</span>
                                            <span className="text-xl font-semibold">{isJa ? "248,000円" : "$1,699"}</span>
                                        </div>
                                        <Button className="w-full">{isJa ? "詳しく見る" : "View details"}</Button>
                                    </CardFooter>
                                </Card>
                            ),
                            code: contentCode,
                        },
                        {
                            key: "article-with-avatar",
                            title: isJa ? "アバター付き記事カード" : "Article card with avatar",
                            description: isJa
                                ? "記事やお知らせの一覧では、著者のアバター、所属、分類を添えて発信元を分かりやすくします。"
                                : "Use author identity, affiliation, and category metadata for article or announcement cards.",
                            preview: (
                                <Card className="w-[360px] max-w-full">
                                    <CardHeader className="gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar aria-label={isJa ? "青井 花" : "Aoi Hana"}>
                                                <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                                                <AvatarFallback>{isJa ? "青" : "AH"}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{isJa ? "青井 花" : "Aoi Hana"}</p>
                                                <p className="text-xs text-muted-foreground">{isJa ? "デザイン編集部" : "Design editorial"}</p>
                                            </div>
                                            <Badge variant="secondary" className="ml-auto">{isJa ? "記事" : "Article"}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <CardTitle>{isJa ? "レビューしやすい一覧画面の作り方" : "Designing review-friendly list screens"}</CardTitle>
                                            <CardDescription>
                                                {isJa
                                                    ? "大量の項目を比較しながら確認する画面で、視線を迷わせないための設計メモです。"
                                                    : "A note on keeping comparison-heavy review screens easy to scan."}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{isJa ? "読了目安 6分" : "6 min read"}</p>
                                    </CardContent>
                                </Card>
                            ),
                            code: articleCode,
                        },
                        {
                            key: "timeline",
                            title: isJa ? "SNSタイムラインカード" : "Social timeline card",
                            description: isJa
                                ? "タイムライン上の投稿では、発信者、時刻、本文、反応数をひとまとまりのカードとして扱います。"
                                : "For timeline posts, group the author, timestamp, body, and engagement counts in one card.",
                            preview: (
                                <Card className="w-[360px] max-w-full">
                                    <CardHeader className="flex-row items-start gap-3 space-y-0">
                                        <Avatar aria-label={isJa ? "田中 空" : "Sora Tanaka"} presence="online">
                                            <AvatarImage src="" alt="" />
                                            <AvatarFallback>{isJa ? "田" : "ST"}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                                <p className="font-medium">{isJa ? "田中 空" : "Sora Tanaka"}</p>
                                                <p className="text-xs text-muted-foreground">{isJa ? "12分前" : "12 min ago"}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">@sora</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-6">
                                            {isJa
                                                ? "テーブルのキャプションと見出し背景を揃えたら、本文行との役割の違いがかなり読み取りやすくなりました。"
                                                : "Matching the table caption and header backgrounds made the role separation much easier to scan."}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="justify-start gap-5 border-t px-6 py-3 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            {isJa ? "返信 4" : "4 replies"}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Repeat2 className="h-3.5 w-3.5" />
                                            {isJa ? "共有 12" : "12 reposts"}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Bookmark className="h-3.5 w-3.5" />
                                            {isJa ? "保存 28" : "28 saves"}
                                        </span>
                                    </CardFooter>
                                </Card>
                            ),
                            code: timelineCode,
                        },
                        {
                            key: "with-actions",
                            title: isJa ? "アクション付きカード" : "Card with actions",
                            description: isJa
                                ? "ページ内の情報に対して、補助操作や主要操作を並べるカードです。作業を中断して確認させる場合は Dialog を使います。"
                                : "Use for inline actions on page content. Use Dialog when the action must interrupt the current task.",
                            preview: (
                                <Card className="w-[350px] max-w-full">
                                    <CardHeader>
                                        <CardTitle>{isJa ? "招待を送信" : "Send invitation"}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {isJa ? "権限と参加先ワークスペースを確認してください。" : "Confirm permissions and the target workspace."}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline">{isJa ? "戻る" : "Back"}</Button>
                                        <Button>{isJa ? "送信" : "Send"}</Button>
                                    </CardFooter>
                                </Card>
                            ),
                            code: actionCode,
                        },
                        {
                            key: "loading",
                            title: isJa ? "読み込み中" : "Loading",
                            description: isJa
                                ? "最終表示と同じ高さを保ち、読み込み完了時にレイアウトが動かないようにします。"
                                : "Keep the same footprint as the final card to avoid layout shift.",
                            preview: (
                                <Card className="w-[350px] max-w-full">
                                    <CardHeader className="space-y-2">
                                        <Skeleton shape="text" className="w-1/2" />
                                        <Skeleton shape="text" className="w-3/4" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Skeleton shape="text" />
                                        <Skeleton shape="text" className="w-5/6" />
                                    </CardContent>
                                </Card>
                            ),
                            code: loadingCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="usage">
                    {sectionLabels.usage}
                </h2>
                <CodeCopyButton code={usageCode} />
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
