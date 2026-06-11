"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { Alert, AlertDescription, AlertTitle, DocumentPager, type DocumentPagerItem, type DocumentPagerLinkProps } from "@gunjo/ui";
import type { MouseEvent } from "react";
import { useState } from "react";

function withoutThumbnail(item: DocumentPagerItem): DocumentPagerItem {
    const next = { ...item };
    delete next.thumbnailSrc;
    delete next.thumbnailAlt;
    delete next.thumbnailFallback;
    return next;
}

function buildNavigationMessage(isJa: boolean, label: string, href: string) {
    return isJa
        ? `${label}（${href}）への遷移をプレビュー内で確認しました。`
        : `Previewed navigation to ${label} (${href}).`;
}

function buildPagerItems(isJa: boolean): { previous: DocumentPagerItem; next: DocumentPagerItem } {
    return {
        previous: {
            href: "/docs/components/command-palette",
            directionLabel: isJa ? "前へ" : "Previous",
            title: isJa ? "コマンドパレット" : "CommandPalette",
            subtitle: "CommandPalette",
            description: isJa
                ? "ナビゲーションやアクション用のグローバルコマンドパレットです。"
                : "A global command palette for navigation and actions.",
            categoryLabel: isJa ? "ナビゲーション" : "Navigation",
            thumbnailSrc: "/showcase-thumbs/command-palette.light.png",
            thumbnailAlt: isJa ? "コマンドパレットのプレビュー" : "CommandPalette preview",
            thumbnailFallback: isJa ? "プレビュー" : "Preview",
        },
        next: {
            href: "/docs/components/footer",
            directionLabel: isJa ? "次へ" : "Next",
            title: isJa ? "フッター" : "Footer",
            subtitle: "Footer",
            description: isJa
                ? "ページ下部にリンク群や補足情報をまとめて表示します。"
                : "Groups supporting links and information at the bottom of a page.",
            categoryLabel: isJa ? "ナビゲーション" : "Navigation",
            thumbnailSrc: "/showcase-thumbs/footer.light.png",
            thumbnailAlt: isJa ? "フッターのプレビュー" : "Footer preview",
            thumbnailFallback: isJa ? "プレビュー" : "Preview",
        },
    };
}

function DocumentPagerPreview({
    previous,
    next,
    ariaLabel,
}: {
    previous?: DocumentPagerItem | null;
    next?: DocumentPagerItem | null;
    ariaLabel?: string;
}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [message, setMessage] = useState<string | null>(null);
    const PreviewLink = ({ href, children, ...props }: DocumentPagerLinkProps) => {
        const label = typeof props["aria-label"] === "string" ? props["aria-label"] : href;
        const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            setMessage(buildNavigationMessage(isJa, label, href));
        };

        return (
            <a href={href} onClick={handleClick} {...props}>
                {children}
            </a>
        );
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <DocumentPager
                aria-label={ariaLabel}
                previous={previous}
                next={next}
                linkComponent={PreviewLink}
            />
            {message ? (
                <Alert>
                    <AlertTitle>{isJa ? "遷移を確認しました" : "Navigation previewed"}</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            ) : null}
        </div>
    );
}

function DocumentPagerExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const items = buildPagerItems(isJa);

    return (
        <DocumentPagerPreview
            ariaLabel={isJa ? "前後のドキュメント" : "Previous and next documentation"}
            previous={items.previous}
            next={items.next}
        />
    );
}

export default function DocumentPagerDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";
    const items = buildPagerItems(isJa);

    const code = `import { DocumentPager } from "@gunjo/ui"

export function ArticlePager() {
  return (
    <DocumentPager
      aria-label="${isJa ? "前後のドキュメント" : "Previous and next documentation"}"
      previous={{
        href: "/docs/components/command-palette",
        directionLabel: "${isJa ? "前へ" : "Previous"}",
        title: "${isJa ? "コマンドパレット" : "CommandPalette"}",
        subtitle: "CommandPalette",
        description: "${isJa ? "ナビゲーションやアクション用のグローバルコマンドパレットです。" : "A global command palette for navigation and actions."}",
        categoryLabel: "${isJa ? "ナビゲーション" : "Navigation"}",
        thumbnailSrc: "/showcase-thumbs/command-palette.light.png",
        thumbnailAlt: "${isJa ? "コマンドパレットのプレビュー" : "CommandPalette preview"}",
        thumbnailFallback: "${isJa ? "プレビュー" : "Preview"}",
      }}
      next={{
        href: "/docs/components/footer",
        directionLabel: "${isJa ? "次へ" : "Next"}",
        title: "${isJa ? "フッター" : "Footer"}",
        subtitle: "Footer",
        description: "${isJa ? "ページ下部にリンク群や補足情報をまとめて表示します。" : "Groups supporting links and information at the bottom of a page."}",
        categoryLabel: "${isJa ? "ナビゲーション" : "Navigation"}",
        thumbnailSrc: "/showcase-thumbs/footer.light.png",
        thumbnailAlt: "${isJa ? "フッターのプレビュー" : "Footer preview"}",
        thumbnailFallback: "${isJa ? "プレビュー" : "Preview"}",
      }}
    />
  )
}`;

    const firstPageCode = `import { DocumentPager } from "@gunjo/ui"

export function FirstPagePager() {
  return (
    <DocumentPager
      aria-label="${isJa ? "次のドキュメント" : "Next documentation"}"
      previous={null}
      next={{
        href: "/docs/components/footer",
        directionLabel: "${isJa ? "次へ" : "Next"}",
        title: "${isJa ? "フッター" : "Footer"}",
        subtitle: "Footer",
        description: "${isJa ? "ページ下部にリンク群や補足情報をまとめて表示します。" : "Groups supporting links and information at the bottom of a page."}",
        categoryLabel: "${isJa ? "ナビゲーション" : "Navigation"}",
      }}
    />
  )
}`;

    const lastPageCode = `import { DocumentPager } from "@gunjo/ui"

export function LastPagePager() {
  return (
    <DocumentPager
      aria-label="${isJa ? "前のドキュメント" : "Previous documentation"}"
      previous={{
        href: "/docs/components/command-palette",
        directionLabel: "${isJa ? "前へ" : "Previous"}",
        title: "${isJa ? "コマンドパレット" : "CommandPalette"}",
        subtitle: "CommandPalette",
        description: "${isJa ? "ナビゲーションやアクション用のグローバルコマンドパレットです。" : "A global command palette for navigation and actions."}",
        categoryLabel: "${isJa ? "ナビゲーション" : "Navigation"}",
      }}
      next={null}
    />
  )
}`;

    const noThumbCode = `import { DocumentPager } from "@gunjo/ui"

export function TextOnlyPager() {
  return (
    <DocumentPager
      previous={{
        href: "/docs/components/command-palette",
        directionLabel: "${isJa ? "前へ" : "Previous"}",
        title: "${isJa ? "コマンドパレット" : "CommandPalette"}",
        description: "${isJa ? "サムネイル画像を省略して、テキストだけで前後のページを示します。" : "Omit thumbnail images and show the neighboring pages with text only."}",
        categoryLabel: "${isJa ? "ナビゲーション" : "Navigation"}",
      }}
      next={{
        href: "/docs/components/footer",
        directionLabel: "${isJa ? "次へ" : "Next"}",
        title: "${isJa ? "フッター" : "Footer"}",
        description: "${isJa ? "必要な情報だけで軽量に表示することもできます。" : "You can keep the card lightweight with only the required text."}",
        categoryLabel: "${isJa ? "ナビゲーション" : "Navigation"}",
      }}
    />
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.documentPager.title}
            description={navigationMetadata.documentPager.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "DocumentPager", href: "/docs/components/document-pager" },
            ]}
            relatedComponents={[
                { name: "Pagination", href: "/docs/components/pagination" },
                { name: "Breadcrumb", href: "/docs/components/breadcrumb" },
                { name: "NavigationMenu", href: "/docs/components/navigation-menu" },
            ]}
        >
            <ComponentPreview
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth="full"
                previewHeight="auto"
            >
                <DocumentPagerExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "both",
                            title: isJa ? "前後リンク" : "Previous and next",
                            description: isJa
                                ? "章やコンポーネントの前後を、概要とサムネイル付きで移動できます。"
                                : "Show both neighboring pages with summaries and thumbnails.",
                            preview: (
                                <DocumentPagerPreview
                                    ariaLabel={isJa ? "前後のドキュメント" : "Previous and next documentation"}
                                    previous={items.previous}
                                    next={items.next}
                                />
                            ),
                            previewBodyWidth: "full",
                            code,
                        },
                        {
                            key: "first-page",
                            title: isJa ? "先頭ページ" : "First page",
                            description: isJa
                                ? "前のページがない場合は previous に null を渡し、次のリンクだけを表示します。"
                                : "Pass null to previous when there is no previous page.",
                            preview: (
                                <DocumentPagerPreview
                                    ariaLabel={isJa ? "次のドキュメント" : "Next documentation"}
                                    previous={null}
                                    next={withoutThumbnail(items.next)}
                                />
                            ),
                            previewBodyWidth: "full",
                            code: firstPageCode,
                        },
                        {
                            key: "last-page",
                            title: isJa ? "末尾ページ" : "Last page",
                            description: isJa
                                ? "次のページがない場合は next に null を渡します。"
                                : "Pass null to next when there is no next page.",
                            preview: (
                                <DocumentPagerPreview
                                    ariaLabel={isJa ? "前のドキュメント" : "Previous documentation"}
                                    previous={withoutThumbnail(items.previous)}
                                    next={null}
                                />
                            ),
                            previewBodyWidth: "full",
                            code: lastPageCode,
                        },
                        {
                            key: "fallback",
                            title: isJa ? "サムネイルなし" : "No thumbnails",
                            description: isJa
                                ? "サムネイル画像は任意です。指定しない場合は画像枠ごと表示しません。"
                                : "Thumbnail images are optional. Omit them to remove the image area entirely.",
                            preview: (
                                <DocumentPagerPreview
                                    previous={{
                                        ...withoutThumbnail(items.previous),
                                        description: isJa
                                            ? "サムネイル画像を省略して、テキストだけで前後のページを示します。"
                                            : "Omit thumbnail images and show the neighboring pages with text only.",
                                    }}
                                    next={{
                                        ...withoutThumbnail(items.next),
                                        description: isJa
                                            ? "必要な情報だけで軽量に表示することもできます。"
                                            : "You can keep the card lightweight with only the required text.",
                                    }}
                                />
                            ),
                            previewBodyWidth: "full",
                            code: noThumbCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        {
                            name: "previous",
                            type: "DocumentPagerItem | null",
                            description: isJa ? "前のドキュメント。null の場合は前リンクを表示しません。" : "Previous document link. Pass null to hide it.",
                        },
                        {
                            name: "next",
                            type: "DocumentPagerItem | null",
                            description: isJa ? "次のドキュメント。null の場合は次リンクを表示しません。" : "Next document link. Pass null to hide it.",
                        },
                        {
                            name: "linkComponent",
                            type: "React.ElementType",
                            description: isJa ? "Next.js Link など任意のリンクコンポーネント。" : "Optional link renderer such as Next.js Link.",
                        },
                        {
                            name: "className",
                            type: "string",
                            description: isJa ? "ナビゲーション本体に追加するクラス名。" : "Additional class names for the pager.",
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
