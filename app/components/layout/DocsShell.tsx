"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollapsiblePanelToggle, cn } from "@gunjo/ui";
import { Sidebar, MobileSidebarDrawer } from "@/components/layout/Sidebar";
import { DocsPager } from "@/components/layout/DocsPager";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    DOCS_SIDEBAR_REVEAL_EVENT,
    findDocsNavigationEntry,
    getDocsSectionLandingHref,
    isDocsSectionLandingItem,
} from "@/lib/navigation-utils";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "gunjo-docs-sidebar-collapsed";

export function DocsShell({ children }: { children: React.ReactNode }) {
    const { bilingual, locale } = useLocale();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);
    const currentEntry = findDocsNavigationEntry(pathname);
    const sectionLandingHref = currentEntry
        ? getDocsSectionLandingHref(currentEntry.section)
        : null;
    const isSectionLanding = currentEntry
        ? isDocsSectionLandingItem(currentEntry.section, currentEntry.item)
        : false;
    const revealCurrentPageInSidebar = React.useCallback((block: ScrollLogicalPosition = "start") => {
        if (!currentEntry) return;
        window.dispatchEvent(
            new CustomEvent(DOCS_SIDEBAR_REVEAL_EVENT, {
                detail: { href: currentEntry.item.href, block },
            })
        );
    }, [currentEntry]);
    const preventPointerFocusScroll = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0) return;
        event.preventDefault();
    }, []);
    const preventMouseFocusScroll = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.button !== 0) return;
        event.preventDefault();
    }, []);
    const handleSidebarRevealClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        revealCurrentPageInSidebar("start");
    }, [revealCurrentPageInSidebar]);

    React.useEffect(() => {
        try {
            setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true");
        } catch {
            // ignore
        }
    }, []);

    const toggleCollapsed = React.useCallback(() => {
        setCollapsed((current) => {
            const next = !current;
            try {
                localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
            } catch {
                // ignore
            }
            return next;
        });
    }, []);

    return (
        <div
            className={cn(
                "container flex-1 items-start md:grid md:min-h-[calc(100dvh-3.5rem)] md:transition-[grid-template-columns] md:duration-300 md:ease-out motion-reduce:md:transition-none",
                collapsed
                    ? "md:grid-cols-[0_minmax(0,1fr)] md:gap-x-8"
                    : "md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-x-12"
            )}
        >
            <div
                className={cn(
                    "relative z-40 hidden min-w-0 border-r border-border/60 md:sticky md:top-14 md:block md:h-[calc(100dvh-3.5rem)] md:overflow-visible"
                )}
            >
                <div
                    className={cn(
                        "h-full min-h-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                        collapsed
                            ? "pointer-events-none -translate-x-2 opacity-0"
                            : "translate-x-0 opacity-100"
                    )}
                    aria-hidden={collapsed}
                >
                    <Sidebar />
                </div>
                <CollapsiblePanelToggle
                    side="left"
                    collapsed={collapsed}
                    openLabel={locale === "ja" ? "左パネルを開く" : "Open left panel"}
                    closeLabel={locale === "ja" ? "左パネルを閉じる" : "Close left panel"}
                    onClick={toggleCollapsed}
                    className="absolute right-0 top-10 z-50 hidden translate-x-1/2 md:inline-flex"
                />
            </div>
            <main className="relative min-w-0 py-8 lg:py-10">
                <div className="w-full min-w-0">
                    <div className="mb-6 md:hidden">
                        <MobileSidebarDrawer />
                    </div>
                    {currentEntry ? (
                        <nav
                            aria-label={locale === "ja" ? "現在のドキュメント位置" : "Current documentation location"}
                            className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
                        >
                            <Link
                                href="/docs/introduction"
                                className="rounded-sm px-1 py-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {locale === "ja" ? "ドキュメント" : "Docs"}
                            </Link>
                            <span aria-hidden="true" className="text-muted-foreground/45">/</span>
                            {sectionLandingHref && isSectionLanding ? (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    onPointerDown={preventPointerFocusScroll}
                                    onMouseDown={preventMouseFocusScroll}
                                    onClick={handleSidebarRevealClick}
                                >
                                    <span>{bilingual(currentEntry.section.title).primary}</span>
                                    <span className="text-[10px] font-normal text-muted-foreground">
                                        {bilingual(currentEntry.section.title).secondary}
                                    </span>
                                </button>
                            ) : sectionLandingHref ? (
                                <Link
                                    href={sectionLandingHref}
                                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <span>{bilingual(currentEntry.section.title).primary}</span>
                                    <span className="text-[10px] font-normal text-muted-foreground">
                                        {bilingual(currentEntry.section.title).secondary}
                                    </span>
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-medium text-foreground">
                                    <span>{bilingual(currentEntry.section.title).primary}</span>
                                    <span className="text-[10px] font-normal text-muted-foreground">
                                        {bilingual(currentEntry.section.title).secondary}
                                    </span>
                                </span>
                            )}
                            {!isSectionLanding ? (
                                <>
                                    <span aria-hidden="true" className="text-muted-foreground/45">/</span>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2 py-1 font-medium text-primary-subtle-foreground transition-colors hover:bg-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        onPointerDown={preventPointerFocusScroll}
                                        onMouseDown={preventMouseFocusScroll}
                                        onClick={handleSidebarRevealClick}
                                    >
                                        <span>{bilingual(currentEntry.item.title).primary}</span>
                                        <span className="text-[10px] font-normal text-primary-subtle-foreground">
                                            {bilingual(currentEntry.item.title).secondary}
                                        </span>
                                    </button>
                                </>
                            ) : null}
                        </nav>
                    ) : null}
                    {children}
                    <div className="mt-16 border-t pt-8">
                        <DocsPager />
                    </div>
                    <SiteFooter placement="content" />
                </div>
            </main>
        </div>
    );
}
