"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarBody,
    SidebarItem,
    SearchInput,
    TextLink,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export interface SidebarRound {
    round: number;
    title: string;
    score: string;
    category: string;
}

function scoreNum(score: string): number {
    // Strip leading ~/〜 (e.g. "〜3.5/5") and parse the numeric portion.
    return parseFloat(score.replace(/^[^\d.]+/, "")) || 0;
}

export function RoundsSidebar({
    rounds,
    categories,
    current,
}: {
    rounds: SidebarRound[];
    categories: string[];
    current: number;
}) {
    const router = useRouter();
    const { pages } = useLocale();
    const t = pages.coldTests;

    const currentCat = rounds.find((r) => r.round === current)?.category;

    // Current round's category opens by default; the rest stay collapsed so
    // the long list is scannable.
    const [expanded, setExpanded] = React.useState<Set<string>>(
        () => new Set(currentCat ? [currentCat] : [])
    );
    const [q, setQ] = React.useState("");
    const query = q.trim().toLowerCase();
    const filtering = query !== "";

    const toggle = (c: string) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(c)) next.delete(c);
            else next.add(c);
            return next;
        });

    // Scroll the active round into view on mount / round change so deep links
    // don't drop the reader at the top of the list.
    React.useEffect(() => {
        document
            .getElementById(`coldtest-side-${current}`)
            ?.scrollIntoView({ block: "center" });
    }, [current]);

    const matches = (r: SidebarRound) =>
        !filtering ||
        `#${r.round} ${r.title} ${r.category} ${t.categories[r.category] ?? ""}`
            .toLowerCase()
            .includes(query);

    // Positioning / visibility is owned by ColdTestShell — keep the inner
    // Sidebar free of stickiness or breakpoint hiding so the shell's
    // collapsible grid and md:sticky wrapper are the single source of truth.
    return (
        <SidebarProvider>
            <Sidebar className="h-full w-full">
                <SidebarHeader className="flex-col items-stretch gap-2">
                    <TextLink
                        href="/cold-tests"
                        variant="muted"
                        className="text-sm font-semibold no-underline hover:underline"
                    >
                        {t.label}
                    </TextLink>
                    <SearchInput
                        value={q}
                        onValueChange={setQ}
                        placeholder={t.searchPlaceholder}
                        aria-label={t.searchPlaceholder}
                    />
                </SidebarHeader>
                <SidebarBody>
                    {categories.map((c) => {
                        const items = rounds
                            .filter((r) => r.category === c && matches(r))
                            .sort((a, b) => a.round - b.round);
                        if (filtering && !items.length) return null;
                        const open = filtering || expanded.has(c);
                        return (
                            <div key={c}>
                                <SidebarItem
                                    id={`coldtest-cat-${c}`}
                                    icon={
                                        <span
                                            className="h-2 w-2 rounded-sm bg-current opacity-50"
                                            aria-hidden
                                        />
                                    }
                                    label={t.categories[c] ?? c}
                                    count={items.length}
                                    countLabel={(n) => t.sidebar.categoryCountLabel(n)}
                                    hasChildren
                                    isExpanded={open}
                                    isActive={false}
                                    isCurrentAncestor={!filtering && c === currentCat}
                                    onClick={() => !filtering && toggle(c)}
                                />
                                {open && (
                                    <div className="ml-3 border-l border-border pl-1">
                                        {items.map((r) => (
                                            <div key={r.round} id={`coldtest-side-${r.round}`}>
                                                <SidebarItem
                                                    id={`coldtest-round-${r.round}`}
                                                    icon={
                                                        <span
                                                            className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
                                                            aria-hidden
                                                        />
                                                    }
                                                    label={`#${r.round} ${r.title}`}
                                                    count={scoreNum(r.score)}
                                                    countLabel={(n) => t.sidebar.scoreLabel(n)}
                                                    isActive={r.round === current}
                                                    onClick={() => router.push(`/cold-tests/${r.round}`)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </SidebarBody>
            </Sidebar>
        </SidebarProvider>
    );
}
