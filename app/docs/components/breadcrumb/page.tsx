"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import {
    Button,
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    useToast,
} from "@gunjo/ui";
import { IconHome as Home, IconSlash as Slash } from "@tabler/icons-react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useState } from "react";

function buildNavigationMessage(isJa: boolean, label: string, href: string) {
    return isJa
        ? `${label}（${href}）への遷移をプレビュー内で確認しました。`
        : `Previewed navigation to ${label} (${href}).`;
}

function BreadcrumbExample() {
    const { locale } = useLocale();
    const { showToast } = useToast();
    const isJa = locale === "ja";
    const handleNavigation = (label: string, href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        showToast(buildNavigationMessage(isJa, label, href), "success", 1800);
    };

    return (
        <div className="flex w-full max-w-xl justify-center">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" onClick={handleNavigation(isJa ? "ホーム" : "Home", "/")}>
                            {isJa ? "ホーム" : "Home"}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/docs" onClick={handleNavigation(isJa ? "ドキュメント" : "Docs", "/docs")}>
                            {isJa ? "ドキュメント" : "Docs"}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

function BreadcrumbMetadataPreview() {
    const { locale } = useLocale();
    const { showToast } = useToast();
    const isJa = locale === "ja";
    const [open, setOpen] = useState(false);
    const openPreview = () => setOpen(true);
    const handlePreviewPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        openPreview();
    };
    const handlePreviewOpen = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        openPreview();
    };
    const handlePreviewKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        event.preventDefault();
        openPreview();
    };
    const handlePreviewNavigation = () => {
        showToast(buildNavigationMessage(isJa, isJa ? "ドキュメント" : "Docs", "/docs"), "success", 1800);
        setOpen(false);
    };

    return (
        <div className="flex w-full max-w-xl flex-col items-center gap-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" onClick={(event) => event.preventDefault()}>
                            {isJa ? "ホーム" : "Home"}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <HoverCard open={open} onOpenChange={setOpen} openDelay={150}>
                            <HoverCardTrigger asChild>
                                <span className="inline-flex">
                                    <BreadcrumbLink
                                        href="/docs"
                                        onPointerDown={handlePreviewPointerDown}
                                        onClick={handlePreviewOpen}
                                        onKeyDown={handlePreviewKeyDown}
                                    >
                                        {isJa ? "ドキュメント" : "Docs"}
                                    </BreadcrumbLink>
                                </span>
                            </HoverCardTrigger>
                            <HoverCardContent className="items-start text-left">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">{isJa ? "ドキュメント" : "Docs"}</p>
                                    <p className="text-xs leading-5 text-muted-foreground">
                                        {isJa
                                            ? "GunjoUI のコンポーネント、パターン、設計ガイドを確認できます。"
                                            : "Browse GunjoUI components, patterns, and design guidance."}
                                    </p>
                                </div>
                                <Button type="button" size="sm" variant="secondary" onClick={handlePreviewNavigation}>
                                    {isJa ? "ドキュメントへ移動" : "Go to Docs"}
                                </Button>
                            </HoverCardContent>
                        </HoverCard>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

export default function BreadcrumbDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  useToast,
} from "@gunjo/ui"
import type { MouseEvent } from "react"

function buildNavigationMessage(label: string, href: string) {
  return \`${isJa ? "${label}（${href}）への遷移をプレビュー内で確認しました。" : "Previewed navigation to ${label} (${href})."}\`
}

export function BreadcrumbExample() {
  const { showToast } = useToast()
  const handleNavigation =
    (label: string, href: string) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      showToast(buildNavigationMessage(label, href), "success", 1800)
    }

  return (
    <div className="flex w-full max-w-xl justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={handleNavigation("${isJa ? "ホーム" : "Home"}", "/")}>
              ${isJa ? "ホーム" : "Home"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" onClick={handleNavigation("${isJa ? "ドキュメント" : "Docs"}", "/docs")}>
              ${isJa ? "ドキュメント" : "Docs"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>${isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}`;

    const iconCode = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@gunjo/ui"
import { IconHome as Home } from "@tabler/icons-react"

export function IconBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            aria-label="${isJa ? "ホーム" : "Home"}"
            onClick={(event) => event.preventDefault()}
          >
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs" onClick={(event) => event.preventDefault()}>
            ${isJa ? "ドキュメント" : "Docs"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>${isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`;

    const collapsedCode = `import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@gunjo/ui"

export function CollapsedBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" onClick={(event) => event.preventDefault()}>
            ${isJa ? "ホーム" : "Home"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis label="${isJa ? "省略された階層" : "Collapsed levels"}" />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components" onClick={(event) => event.preventDefault()}>
            ${isJa ? "コンポーネント" : "Components"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>${isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`;

    const slashCode = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@gunjo/ui"
import { IconSlash as Slash } from "@tabler/icons-react"

export function SlashBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" onClick={(event) => event.preventDefault()}>
            ${isJa ? "ホーム" : "Home"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash className="h-3.5 w-3.5" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs" onClick={(event) => event.preventDefault()}>
            ${isJa ? "ドキュメント" : "Docs"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash className="h-3.5 w-3.5" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>${isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`;

    const hoverPreviewCode = `import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  useToast,
} from "@gunjo/ui"
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react"
import { useState } from "react"

function buildNavigationMessage(label: string, href: string) {
  return \`${isJa ? "${label}（${href}）への遷移をプレビュー内で確認しました。" : "Previewed navigation to ${label} (${href})."}\`
}

export function BreadcrumbWithPreview() {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const openPreview = () => setOpen(true)
  const handlePreviewPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    openPreview()
  }
  const handlePreviewOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    openPreview()
  }
  const handlePreviewKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }
    event.preventDefault()
    openPreview()
  }
  const handlePreviewNavigation = () => {
    showToast(buildNavigationMessage("${isJa ? "ドキュメント" : "Docs"}", "/docs"), "success", 1800)
    setOpen(false)
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={(event) => event.preventDefault()}>
              ${isJa ? "ホーム" : "Home"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <HoverCard open={open} onOpenChange={setOpen} openDelay={150}>
              <HoverCardTrigger asChild>
                <span className="inline-flex">
                  <BreadcrumbLink
                    href="/docs"
                    onPointerDown={handlePreviewPointerDown}
                    onClick={handlePreviewOpen}
                    onKeyDown={handlePreviewKeyDown}
                  >
                    ${isJa ? "ドキュメント" : "Docs"}
                  </BreadcrumbLink>
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="items-start text-left">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">${isJa ? "ドキュメント" : "Docs"}</p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    ${isJa ? "GunjoUI のコンポーネント、パターン、設計ガイドを確認できます。" : "Browse GunjoUI components, patterns, and design guidance."}
                  </p>
                </div>
                <Button type="button" size="sm" variant="secondary" onClick={handlePreviewNavigation}>
                  ${isJa ? "ドキュメントへ移動" : "Go to Docs"}
                </Button>
              </HoverCardContent>
            </HoverCard>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>${isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.breadcrumb.title}
            description={navigationMetadata.breadcrumb.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Breadcrumb", href: "/docs/components/breadcrumb" },
                { name: "BreadcrumbLink", href: "/docs/components/breadcrumb#breadcrumb-link" },
                { name: "BreadcrumbPage", href: "/docs/components/breadcrumb#breadcrumb-page" },
                { name: "Button", href: "/docs/components/button" },
                { name: "HoverCard", href: "/docs/components/hover-card" },
                { name: "ToastProvider", href: "/docs/components/toast-provider" },
            ]}
            relatedComponents={[
                { name: "DocumentPager", href: "/docs/components/document-pager" },
                { name: "Pagination", href: "/docs/components/pagination" },
                { name: "NavigationMenu", href: "/docs/components/navigation-menu" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/breadcrumb"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="lg"
            >
                <BreadcrumbExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "home-icon",
                            title: isJa ? "ホームをアイコンにする" : "Home icon",
                            description: isJa
                                ? "先頭の階層をアイコンだけで示す場合は aria-label で意味を補います。"
                                : "When the first crumb is an icon, keep the destination clear with aria-label.",
                            preview: (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="/"
                                                aria-label={isJa ? "ホーム" : "Home"}
                                                onClick={(event) => event.preventDefault()}
                                            >
                                                <Home className="h-4 w-4" />
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/docs" onClick={(event) => event.preventDefault()}>
                                                {isJa ? "ドキュメント" : "Docs"}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            ),
                            code: iconCode,
                        },
                        {
                            key: "collapsed",
                            title: isJa ? "長い階層を省略" : "Collapsed long path",
                            description: isJa
                                ? "階層が長い場合は中間を省略し、先頭・現在地・直近の階層を残します。"
                                : "For long paths, collapse the middle while keeping the first, current, and nearby levels visible.",
                            preview: (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/" onClick={(event) => event.preventDefault()}>
                                                {isJa ? "ホーム" : "Home"}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbEllipsis label={isJa ? "省略された階層" : "Collapsed levels"} />
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/docs/components" onClick={(event) => event.preventDefault()}>
                                                {isJa ? "コンポーネント" : "Components"}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            ),
                            code: collapsedCode,
                        },
                        {
                            key: "custom-separator",
                            title: isJa ? "区切り記号の変更" : "Custom separator",
                            description: isJa
                                ? "BreadcrumbSeparator に任意のノードを渡すと、山括弧以外の区切り記号にできます。"
                                : "Pass a node to BreadcrumbSeparator to use a slash, dot, or icon instead of the default chevron.",
                            preview: (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/" onClick={(event) => event.preventDefault()}>
                                                {isJa ? "ホーム" : "Home"}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <Slash className="h-3.5 w-3.5" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/docs" onClick={(event) => event.preventDefault()}>
                                                {isJa ? "ドキュメント" : "Docs"}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <Slash className="h-3.5 w-3.5" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{isJa ? "パンくず" : "Breadcrumb"}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            ),
                            code: slashCode,
                        },
                        {
                            key: "metadata-preview",
                            title: isJa ? "概要プレビュー付き" : "With metadata preview",
                            description: isJa
                                ? "標準装備ではなく、ページのタイトルや説明を HoverCard で合成するバリエーションです。タップでも概要を開き、カード内のボタンで遷移を確認できます。"
                                : "Compose HoverCard when a crumb needs metadata such as title and description. Tap opens the preview on touch devices and the card includes an explicit navigation action.",
                            preview: <BreadcrumbMetadataPreview />,
                            code: hoverPreviewCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <h3 className="mt-4 text-xl font-semibold" id="breadcrumb-link">BreadcrumbLink</h3>
                <PropsTable
                    data={[
                        {
                            name: "href",
                            type: "string",
                            description: isJa ? "リンク先 URL。" : "Destination URL.",
                        },
                        {
                            name: "asChild",
                            type: "boolean",
                            default: "false",
                            description: isJa ? "子要素をリンクとして描画するか。" : "Render the provided child as the link element.",
                        },
                    ]}
                />
                <h3 className="mt-4 text-xl font-semibold" id="breadcrumb-page">BreadcrumbPage</h3>
                <PropsTable
                    data={[
                        {
                            name: "children",
                            type: "ReactNode",
                            description: isJa ? "現在ページとして表示する内容。" : "Content shown for the current page.",
                        },
                    ]}
                />
                <h3 className="mt-4 text-xl font-semibold" id="breadcrumb-ellipsis">BreadcrumbEllipsis</h3>
                <PropsTable
                    data={[
                        {
                            name: "label",
                            type: "string",
                            default: '"More"',
                            description: isJa ? "スクリーンリーダー向けの省略ラベル。" : "Screen reader label for the collapsed levels.",
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={code} />
                </div>
            </div>
        </ComponentLayout>
    );
}
