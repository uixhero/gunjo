"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutSidebarLeftExpand as PanelLeftOpen } from "@tabler/icons-react";
import { navigation } from "@/lib/navigation";
import {
    DOCS_SIDEBAR_REVEAL_EVENT,
    getDocsSectionLandingHref,
    isDocsNavigationSectionActive,
    isDocsSectionLandingItem,
} from "@/lib/navigation-utils";
import {
    cn,
    Button,
    Sidebar as UISidebar,
    SidebarBody,
    SidebarProvider,
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const SCROLL_STORAGE_KEY = "gunjo-docs-sidebar-scroll";

/**
 * Renders the docs navigation tree. Used both in the sticky desktop
 * sidebar and inside the mobile drawer — single source of truth so the
 * two stay in sync.
 */
function NavTree({
    pathname,
    onNavigate,
}: {
    pathname: string | null;
    onNavigate?: () => void;
}) {
    const { bilingual, locale } = useLocale();
    return (
        <>
            {navigation.map((section, index) => {
                const sectionLabel = bilingual(section.title);
                const sectionActive = isDocsNavigationSectionActive(section, pathname);
                const sectionLandingHref = getDocsSectionLandingHref(section);
                const sectionHeaderContent = (
                    <>
                        <span>{sectionLabel.primary}</span>
                        <span
                            className={cn(
                                "text-[9px] font-normal normal-case tracking-normal",
                                "text-muted-foreground"
                            )}
                        >
                            {sectionLabel.secondary}
                        </span>
                    </>
                );
                return (
                    <div
                        key={index}
                        className={cn(
                            "relative py-4",
                            index > 0 && "border-t border-border/40"
                        )}
                    >
                        {sectionActive ? (
                            <div
                                aria-hidden="true"
                                className="absolute inset-y-4 -left-3 w-0.5 rounded-full bg-primary"
                            />
                        ) : null}
                        <h4 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.08em]">
                            {sectionLandingHref ? (
                                <Link
                                    href={sectionLandingHref}
                                    onClick={onNavigate}
                                    className={cn(
                                        "inline-flex items-baseline gap-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        sectionActive ? "text-foreground" : "text-foreground/95 hover:text-foreground"
                                    )}
                                >
                                    {sectionHeaderContent}
                                </Link>
                            ) : (
                                <span
                                    className={cn(
                                        "inline-flex items-baseline gap-1.5",
                                        sectionActive ? "text-foreground" : "text-foreground/95"
                                    )}
                                >
                                    {sectionHeaderContent}
                                </span>
                            )}
                        </h4>
                        {section.items?.length ? (
                            <div className="grid grid-flow-row auto-rows-max text-sm">
                                {section.items.map((item, i) => {
                                    const isSectionLanding = isDocsSectionLandingItem(section, item);
                                    const rawItemLabel = bilingual(item.title);
                                    const itemLabel =
                                        isSectionLanding && item.title.endsWith(" Overview")
                                            ? {
                                                primary: locale === "ja" ? "概要" : "Overview",
                                                secondary: locale === "ja" ? "Overview" : "概要",
                                            }
                                            : rawItemLabel;
                                    const active = pathname === item.href;
                                    return (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            onClick={onNavigate}
                                            aria-current={active ? "page" : undefined}
                                            className={cn(
                                                "group relative flex w-full flex-col gap-0 rounded-md px-2 py-1.5 leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                active
                                                    ? "bg-primary-subtle text-primary-subtle-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary-border))]"
                                                    : "text-foreground/90 hover:bg-muted/55 hover:text-foreground"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    active ? "font-semibold" : ""
                                                )}
                                            >
                                                {itemLabel.primary}
                                            </span>
                                            {itemLabel.secondary !== itemLabel.primary && (
                                                <span
                                                    className={cn(
                                                        "text-[9px]",
                                                        active ? "text-primary-strong" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {itemLabel.secondary}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const bodyRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;
        try {
            const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
            if (stored) el.scrollTop = parseInt(stored, 10) || 0;
        } catch {
            // ignore
        }
    }, []);

    React.useEffect(() => {
        const el = bodyRef.current;
        if (!el || !pathname) return;
        revealSidebarLink(el, pathname, "start", true);
    }, [pathname]);

    React.useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;

        const handleReveal = (event: Event) => {
            const detail = (event as CustomEvent<{ href?: string; block?: ScrollLogicalPosition }>).detail;
            const href = detail?.href;
            if (!href) return;
            revealSidebarLink(el, href, detail?.block ?? "start", true);
        };

        window.addEventListener(DOCS_SIDEBAR_REVEAL_EVENT, handleReveal);
        return () => window.removeEventListener(DOCS_SIDEBAR_REVEAL_EVENT, handleReveal);
    }, []);

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            try {
                sessionStorage.setItem(
                    SCROLL_STORAGE_KEY,
                    String(e.currentTarget.scrollTop)
                );
            } catch {
                // ignore
            }
        },
        []
    );

    return (
        <SidebarProvider>
            <UISidebar
                className={cn(
                    "hidden h-full w-full shrink-0 border-r-0 border-border/40 bg-transparent md:flex"
                )}
            >
                <SidebarBody
                    ref={bodyRef}
                    onScroll={handleScroll}
                    className="min-h-0 gap-0 px-0 py-4 pr-6"
                >
                    <NavTree pathname={pathname} />
                </SidebarBody>
            </UISidebar>
        </SidebarProvider>
    );
}

function revealSidebarLink(
    root: HTMLElement,
    href: string,
    block: ScrollLogicalPosition = "start",
    force = false
) {
    const target = root.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
    if (!target) return;

    const sidebarRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const isFullyVisible =
        targetRect.top >= sidebarRect.top &&
        targetRect.bottom <= sidebarRect.bottom;

    if (force || !isFullyVisible) {
        const targetOffset = block === "start"
            ? root.scrollTop + targetRect.top - sidebarRect.top - 16
            : root.scrollTop + targetRect.top - sidebarRect.top - root.clientHeight / 2 + targetRect.height / 2;
        root.scrollTo({
            top: Math.max(0, targetOffset),
            behavior: force ? "smooth" : "auto",
        });
    }
}

/**
 * Mobile-only drawer trigger + drawer that exposes the same docs nav
 * the desktop sidebar shows. Render this somewhere visible above the
 * fold on docs pages (e.g. inside the docs layout, above the heading).
 */
export function MobileSidebarDrawer() {
    const pathname = usePathname();
    const { locale } = useLocale();
    const [open, setOpen] = React.useState(false);
    const navLabel = locale === "ja" ? "コンポーネント一覧" : "Component list";
    const navAriaLabel =
        locale === "ja" ? "コンポーネント一覧を開く" : "Open component list";

    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="md:hidden gap-2"
                            aria-label={navAriaLabel}
                        >
                            <PanelLeftOpen className="h-4 w-4" />
                            {navLabel}
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>{navAriaLabel}</TooltipContent>
            </Tooltip>
            <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="border-b border-border/40 px-6 py-4 text-sm font-semibold tracking-tight">
                    {navLabel}
                </SheetTitle>
                <div className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-2">
                    <NavTree pathname={pathname} onNavigate={() => setOpen(false)} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
