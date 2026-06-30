"use client";

import * as React from "react";
import { CollapsiblePanelToggle, cn } from "@gunjo/ui";
import { RoundsSidebar, type SidebarRound } from "./RoundsSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";

// Mirror of DocsShell's container + collapsible grid so /cold-tests/[round]
// reads at the same width as /docs/components/* etc. Cold-tests has its own
// sidebar (category tree of rounds), but the shell wrapping it should be
// identical so screenshot scale and gutter match the rest of the docs site.
const SIDEBAR_COLLAPSED_STORAGE_KEY = "gunjo-cold-tests-sidebar-collapsed";

export function ColdTestShell({
    rounds,
    categories,
    current,
    children,
}: {
    rounds: SidebarRound[];
    categories: string[];
    current: number;
    children: React.ReactNode;
}) {
    const { locale } = useLocale();
    const [collapsed, setCollapsed] = React.useState(false);

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
            <div className="relative z-40 hidden min-w-0 border-r border-border/60 md:sticky md:top-14 md:block md:h-[calc(100dvh-3.5rem)] md:overflow-visible">
                <div
                    className={cn(
                        "h-full min-h-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                        collapsed
                            ? "pointer-events-none -translate-x-2 opacity-0"
                            : "translate-x-0 opacity-100"
                    )}
                    aria-hidden={collapsed}
                >
                    <RoundsSidebar rounds={rounds} categories={categories} current={current} />
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
                <div className="w-full min-w-0">{children}</div>
            </main>
        </div>
    );
}
