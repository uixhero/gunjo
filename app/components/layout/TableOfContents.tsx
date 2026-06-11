"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TocItem {
    title: string;
    url: string;
    level: 2 | 3;
}

/**
 * Inline page-section nav, rendered below the page description.
 *
 * Replaces the old right-rail "On This Page" TOC. Most docs pages have a
 * predictable handful of sections (Props, Usage), which doesn't justify a
 * dedicated 220px column. Scans visible h2/h3 elements just like the old
 * rail did, so behavior on prose-heavy pages (Theming, Installation) is
 * identical — just inline instead of off to the side.
 *
 * Hidden on small screens. The right-rail version was already hidden
 * below xl, and small viewports get no benefit from a section index for
 * a page they're already scrolling.
 */
export function LocalNav() {
    const pathname = usePathname();
    const { locale } = useLocale();
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const items: TocItem[] = [];
        const existingIds = new Set<string>();
        let unnamedCount = 0;

        // Scope to the docs main column so the sidebar nav (h4 group titles
        // etc.) and other peripheral headings don't pollute the local nav.
        const scope = document.querySelector("main") ?? document.body;

        scope.querySelectorAll("h2, h3").forEach((elem) => {
            // Skip hidden headings (e.g. mobile-only sections on desktop).
            if ((elem as HTMLElement).offsetParent === null) return;

            if (!elem.id) {
                // Slug from text content — but the previous regex stripped
                // every non-Latin char, which collapsed all Japanese
                // headings to id="" and deduped them down to one entry.
                // Lowercase and replace runs of whitespace with hyphens; if
                // nothing readable is left (CJK-only headings), fall back
                // to a counter so each heading gets a distinct id.
                const slug = (elem.textContent ?? "")
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\p{L}\p{N}\-_]+/gu, "");
                elem.id = slug || `heading-${++unnamedCount}`;
            }

            const url = `#${elem.id}`;
            if (existingIds.has(url)) return;
            existingIds.add(url);
            items.push({
                title: elem.textContent || "",
                url,
                level: elem.tagName.toLowerCase() === "h3" ? 3 : 2,
            });
        });

        setHeadings(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        scope.querySelectorAll("h2, h3").forEach((elem) => {
            if ((elem as HTMLElement).offsetParent !== null) observer.observe(elem);
        });

        return () => observer.disconnect();
    }, [pathname, locale]);

    if (headings.length === 0) return null;

    return (
        <nav
            aria-label="On this page"
            className="rounded-md border border-border/70 bg-muted/20 p-2"
        >
            <div className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
                {locale === "ja" ? "ページ内" : "On this page"}
            </div>
            <div className="-mx-2 flex gap-1.5 overflow-x-auto px-2 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                {headings.map((item) => {
                    const active = item.url === `#${activeId}`;
                    return (
                        <a
                            key={item.url}
                            href={item.url}
                            aria-current={active ? "location" : undefined}
                            className={cn(
                                "inline-flex max-w-[70vw] shrink-0 items-center rounded-sm px-1.5 transition-colors underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:max-w-full md:shrink",
                                item.level === 2
                                    ? "min-h-8 px-2.5 text-sm font-medium"
                                    : "min-h-7 gap-1.5 px-2 text-xs text-muted-foreground",
                                active
                                    ? "font-semibold text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.level === 3 ? (
                                <span
                                    className={cn(
                                        "h-1.5 w-1.5 shrink-0 rounded-full",
                                        active ? "bg-foreground" : "bg-muted-foreground/40"
                                    )}
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span className="truncate">{item.title}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}

// Keep the old export name working for any consumer importing it. Both names
// point at the inline component now — the right-rail variant is gone.
export const TableOfContents = LocalNav;
