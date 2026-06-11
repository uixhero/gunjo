"use client";

import Link from "next/link";
import { navigation } from "@/lib/navigation";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";

function pageIdFromHref(href: string): string {
    return href.replace(/^\/docs\/?/, "") || "components";
}

export default function ComponentsIndexPage() {
    const { locale, t, sectionLabels } = useLocale();
    const content = getDocContent("components", locale);
    const title = content?.title ?? "Components";
    const description = content?.description ?? "A comprehensive collection of pre-built components designed for building rich, desktop-class web applications. Copy and paste into your project and customize to your needs.";

    const componentSections = navigation.filter(section =>
        ["Inputs", "Display", "Charts", "Feedback", "Navigation", "Overlay", "Layout"].includes(section.title)
    );

    return (
        <div className="space-y-10 pb-10">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
                <p className="text-lg text-muted-foreground w-full max-w-2xl">
                    {description}
                </p>
            </div>

            <div className="space-y-16">
                {componentSections.map((section) => (
                    <section key={section.title} id={section.title.toLowerCase()} className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h2 className="text-2xl font-semibold tracking-tight">{t(section.title)}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item) => {
                                if ("disabled" in item && item.disabled) return null;
                                const pageId = pageIdFromHref(item.href);
                                const docContent = getDocContent(pageId, locale);
                                const itemDescription = docContent?.description ?? "A Gunjo UI component.";

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-border"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="font-semibold leading-none tracking-tight group-hover:text-primary transition-colors">
                                                {t(item.title)}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {itemDescription}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors">
                                            {sectionLabels.viewDocumentation} <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <section className="space-y-4 rounded-lg border bg-muted/20 p-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">{t("Patterns")}</h2>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            {locale === "ja"
                                ? "パターンはコンポーネントの組み合わせ例として、アプリ画面単位で確認します。コンポーネント監査とは分けて、パターン集から実際の画面へ移動して確認してください。"
                                : "Patterns are page-level compositions built from components. They are audited separately from component docs and can be reviewed from the patterns index."}
                        </p>
                    </div>
                    <Link
                        href="/patterns"
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                        {locale === "ja" ? "パターン集を見る" : "View patterns"}
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                </section>
            </div>
        </div>
    );
}
