"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, PageAside } from "@gunjo/ui";

const pageLinks = [
    { id: "overview", labelJa: "概要", labelEn: "Overview" },
    { id: "quality", labelJa: "品質指標", labelEn: "Quality metrics" },
    { id: "release", labelJa: "公開前確認", labelEn: "Release checks" },
];

const pageStatuses = [
    { labelJa: "状態", labelEn: "Status", valueJa: "公開前確認", valueEn: "Pre-release", tone: "default" },
    { labelJa: "最終更新", labelEn: "Updated", valueJa: "5分前", valueEn: "5 min ago", tone: "secondary" },
    { labelJa: "レビュー", labelEn: "Review", valueJa: "2件対応待ち", valueEn: "2 pending", tone: "secondary" },
];

const relatedLinks = [
    { labelJa: "公開チェックリスト", labelEn: "Release checklist", href: "#" },
    { labelJa: "変更履歴", labelEn: "Changelog", href: "#" },
    { labelJa: "担当チーム", labelEn: "Owner team", href: "#" },
];

export type PageAsideDemoVariant = "default" | "status" | "links";

export function PageAsideDemo({ variant = "default" }: { variant?: PageAsideDemoVariant }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="w-full overflow-hidden rounded-md border bg-background">
            <PageAside
                title={isJa ? "補助情報" : "Supporting information"}
                asideLabel={isJa ? "ページの補助情報" : "Page supporting information"}
                contentLabel={isJa ? "主コンテンツ" : "Main content"}
                mobileDescription={isJa ? "狭い画面では、右レールの内容を本文内で開閉します。" : "On narrow screens, the right-rail content collapses inside the content area."}
                openLabel={isJa ? "補助情報を開く" : "Open supporting information"}
                closeLabel={isJa ? "補助情報を閉じる" : "Close supporting information"}
                contentClassName="space-y-4 bg-muted/30 p-4"
                renderAside={() => <AsideContent variant={variant} />}
            >
                <div className="inline-flex rounded-sm border bg-background px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {isJa ? "主コンテンツ" : "Main content"}
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-semibold">{isJa ? "分析レポート" : "Analytics report"}</h3>
                    <p className="max-w-xl text-sm text-muted-foreground">
                        {isJa
                            ? "PageAside は、補助情報を広い画面では右側へ、狭い画面では本文内の折りたたみ領域へ配置します。"
                            : "PageAside places supporting information on the right on wide screens and in a collapsible content block on narrow screens."}
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <section id="overview" className="rounded-md border bg-background p-3">
                        <h4 className="text-sm font-semibold">{isJa ? "概要" : "Overview"}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {isJa ? "本文側には主な読み物や作業対象を置きます。" : "The content area keeps the primary reading and work surface."}
                        </p>
                    </section>
                    <section id="quality" className="rounded-md border bg-background p-3">
                        <h4 className="text-sm font-semibold">{isJa ? "品質指標" : "Quality metrics"}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {isJa ? "補助情報は、画面幅に応じて右レールまたは折りたたみ領域へ移ります。" : "Supporting context moves between the right rail and the collapsible area."}
                        </p>
                    </section>
                </div>
            </PageAside>
        </div>
    );
}

function AsideContent({ variant }: { variant: PageAsideDemoVariant }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="space-y-5">
            {variant === "default" ? (
                <>
                    <PageLinks />
                    <PageStatus />
                </>
            ) : null}
            {variant === "status" ? (
                <>
                    <PageStatus />
                    <section className="rounded-md border bg-muted/30 p-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {isJa ? "ページ状態" : "Page status"}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {isJa ? "公開状態やレビュー状況のように、本文を読みながら参照したい情報を置きます。" : "Use this for status that should remain visible while reading."}
                        </p>
                    </section>
                </>
            ) : null}
            {variant === "links" ? (
                <>
                    <RelatedLinks />
                    <PageLinks />
                </>
            ) : null}
        </div>
    );
}

function PageLinks() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">{isJa ? "ページ内" : "On this page"}</h3>
            <nav aria-label={isJa ? "ページ内リンク" : "Page sections"}>
                <ul className="space-y-1">
                    {pageLinks.map((item) => (
                        <li key={item.id}>
                            <a className="block rounded-sm px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href={`#${item.id}`}>
                                {isJa ? item.labelJa : item.labelEn}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </section>
    );
}

function PageStatus() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">{isJa ? "ページステータス" : "Page status"}</h3>
            <dl className="space-y-2">
                {pageStatuses.map((item) => (
                    <div key={item.labelEn} className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2">
                        <dt className="text-xs text-muted-foreground">{isJa ? item.labelJa : item.labelEn}</dt>
                        <dd className="shrink-0 text-xs font-medium">
                            {item.tone === "default" ? (
                                <Badge>{isJa ? item.valueJa : item.valueEn}</Badge>
                            ) : (
                                isJa ? item.valueJa : item.valueEn
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function RelatedLinks() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">{isJa ? "関連リンク" : "Related links"}</h3>
            <ul className="space-y-1">
                {relatedLinks.map((item) => (
                    <li key={item.labelEn}>
                        <a href={item.href} onClick={(event) => event.preventDefault()} className="block rounded-sm px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            {isJa ? item.labelJa : item.labelEn}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
