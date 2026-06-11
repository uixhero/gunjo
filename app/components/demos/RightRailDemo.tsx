"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge, RightRail } from "@gunjo/ui";

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

export type RightRailDemoVariant = "page-support" | "status" | "links";

export function RightRailDemo({ variant = "page-support" }: { variant?: RightRailDemoVariant }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className="w-full overflow-x-auto rounded-md border bg-background">
            <div className="flex min-h-[360px] min-w-[680px]">
                <main className="min-w-0 flex-1 space-y-4 bg-muted/30 p-4" aria-label={isJa ? "主コンテンツ" : "Main content"}>
                    <div className="inline-flex rounded-sm border bg-background px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {isJa ? "主コンテンツ" : "Main content"}
                    </div>
                    <p className="max-w-xl text-sm text-muted-foreground">
                        {isJa
                            ? "主コンテンツの右側に、参照用の補助情報を固定幅で並べます。"
                            : "Supporting information sits beside the main content in a fixed-width rail."}
                    </p>
                </main>
                <RightRail
                    width="w-72"
                    className="bg-background"
                    aria-label={isJa ? "右レールの補助情報" : "Right rail supporting information"}
                >
                    <RailContent variant={variant} />
                </RightRail>
            </div>
        </div>
    );
}

function RailContent({ variant, compact = false }: { variant: RightRailDemoVariant; compact?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <div className={compact ? "space-y-4" : "space-y-5 p-4"}>
            {variant === "page-support" ? (
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
                            {isJa ? "公開状態やレビュー状況のように、本文の横で常に参照したい情報を置きます。" : "Use this for status that should remain visible beside the content."}
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
