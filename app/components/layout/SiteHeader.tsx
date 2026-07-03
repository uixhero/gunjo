"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBrandGithub as Github, IconMenu2 as Menu } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { GunjoLogo } from "@/components/layout/GunjoLogo";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    Header,
    HeaderActions,
    HeaderBrand,
    HeaderNav,
    Button,
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    cn,
} from "@gunjo/ui";

export function SiteHeader() {
    const { header, tooltip } = useLocale();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [isInIframe, setIsInIframe] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    // Transparent over the homepage hero, solid once scrolled past it.
    // Starts true on the homepage so the first paint blends into the hero.
    const [overHero, setOverHero] = React.useState(isHome);

    React.useEffect(() => {
        try {
            setIsInIframe(window.self !== window.top);
        } catch {
            setIsInIframe(true);
        }
    }, []);

    // Close the drawer whenever the route changes — Next's Link won't
    // unmount this component on navigation.
    React.useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    // Flip the header to solid only once the LAST dark overlay zone scrolls
    // past the header line. The homepage marks both the hero and the dark
    // threshold section below it with [data-header-overlay], so the header
    // stays transparent over the whole dawn run and never flashes solid white
    // while a dark section is still on screen. Off the homepage there are no
    // zones, so it stays solid.
    React.useEffect(() => {
        const zones =
            isHome && typeof document !== "undefined"
                ? document.querySelectorAll("[data-header-overlay]")
                : [];
        const zone = zones.length ? zones[zones.length - 1] : null;
        if (!zone) {
            setOverHero(false);
            return;
        }
        const HEADER_H = 56; // h-14
        let raf = 0;
        const update = () => {
            raf = 0;
            setOverHero(zone.getBoundingClientRect().bottom > HEADER_H);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [isHome, pathname]);

    if (pathname?.startsWith("/embed")) return null;
    if (isInIframe) return null;

    const navItems = [
        {
            href: "/docs/introduction",
            label: header("docs"),
            match: (p: string) => p.startsWith("/docs"),
        },
        {
            href: "/showcase",
            label: header("showcase"),
            match: (p: string) => p.startsWith("/showcase"),
        },
        {
            href: "/patterns",
            label: header("patterns"),
            match: (p: string) => p.startsWith("/patterns"),
        },
        {
            href: "/cold-tests",
            label: header("coldTests"),
            match: (p: string) => p.startsWith("/cold-tests"),
        },
    ];

    return (
        <Header
            className={cn(
                "sticky top-0 z-50 h-14 px-0 py-0 transition-colors duration-300 sm:px-0",
                overHero
                    ? "gunjo-header-overlay"
                    : "border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            )}
        >
            <div className="mx-auto flex h-full w-full max-w-[1400px] items-center gap-3 px-4">
                {/* Brand — always visible at the left edge. */}
                <HeaderBrand>
                    <Link href="/" className="flex items-center gap-2">
                        <GunjoLogo className="h-[2.6rem] w-[4.9rem]" label={header("siteName")} />
                    </Link>
                </HeaderBrand>

                {/* Inline horizontal nav — only at lg and up */}
                <HeaderNav className="ml-6 hidden gap-6 text-sm font-medium lg:flex">
                    {navItems.map((item) => {
                        const active = item.match(pathname);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm transition-colors hover:text-foreground",
                                    active
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </HeaderNav>

                {/* Actions — Search takes available space until md, fixed width above */}
                <div className="flex flex-1 items-center justify-end gap-2">
                    <div className="w-full max-w-xs md:w-72">
                        <CommandMenu overlay={overHero} />
                    </div>
                    <HeaderActions className="hidden sm:flex">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href="https://github.com/uixhero/gunjo"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={tooltip("github")}
                                    >
                                        <Github className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip("github")}</TooltipContent>
                        </Tooltip>
                        <LanguageToggle />
                        <ThemeSwitcher />
                            <ThemeToggle />
                    </HeaderActions>
                </div>

                {/* Mobile / tablet drawer trigger — right edge of the header,
                    below lg. Logo stays at the left, menu opens from the right. */}
                <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden"
                                    aria-label={tooltip("openMenu")}
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip("openMenu")}</TooltipContent>
                    </Tooltip>
                    <SheetContent side="right" className="w-72 p-0">
                        <SheetTitle className="sr-only">
                            {tooltip("openMenu")}
                        </SheetTitle>
                        <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2"
                                onClick={() => setDrawerOpen(false)}
                            >
                                <GunjoLogo className="h-[2.6rem] w-[4.9rem]" label={header("siteName")} />
                            </Link>
                        </div>
                        <nav className="flex flex-col gap-1 px-3 py-4">
                            {navItems.map((item) => {
                                const active = item.match(pathname);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setDrawerOpen(false)}
                                        className={cn(
                                            "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                            active
                                                ? "bg-muted font-medium text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="mt-auto flex items-center gap-1 border-t border-border/40 px-3 py-3">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link
                                            href="https://github.com/uixhero/gunjo"
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={tooltip("github")}
                                        >
                                            <Github className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{tooltip("github")}</TooltipContent>
                            </Tooltip>
                            <LanguageToggle />
                            <ThemeSwitcher />
                            <ThemeToggle />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </Header>
    );
}
