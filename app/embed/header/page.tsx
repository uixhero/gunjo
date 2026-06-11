"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { GunjoLogo } from "@/components/layout/GunjoLogo";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar, AvatarFallback, Button, CommandPalette, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, Header, HeaderActions, HeaderBrand, HeaderNav, HeaderNavLink, TooltipButton } from "@gunjo/ui";
import {
    IconLanguage as Languages,
    IconMenu2 as Menu,
    IconMoon as Moon,
    IconSearch as Search,
    IconSun as Sun,
    IconUserCircle as UserRound,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";

export default function Embed() {
    const searchParams = useSearchParams();
    const { locale, setLocale } = useLocale();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const isJa = locale === "ja";
    const isDark = mounted && resolvedTheme === "dark";
    const compact = searchParams.get("variant") === "compact";
    const drawerNav = searchParams.get("variant") === "drawer-nav";
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [commandOpen, setCommandOpen] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);
    const navLinks = [
        { label: isJa ? "ドキュメント" : "Docs", href: "/docs" },
        { label: isJa ? "コンポーネント" : "Components", href: "/docs/components" },
        { label: isJa ? "料金" : "Pricing", href: "/pricing" },
    ];
    const commandGroups = [
        {
            heading: isJa ? "ページ" : "Pages",
            items: navLinks.map((link) => ({
                id: link.href,
                label: link.label,
                action: () => setCommandOpen(false),
            })),
        },
    ];

    return (
        <div className={`w-full overflow-hidden rounded-md border bg-background ${drawerNav ? "!min-h-[560px]" : ""}`}>
            <Header className={compact ? "px-4" : undefined}>
                <HeaderBrand>
                    <GunjoLogo />
                </HeaderBrand>
                {!compact && !drawerNav ? (
                    <HeaderNav>
                        {navLinks.map((link, index) => (
                            <HeaderNavLink key={link.href} href={link.href} active={index === 0} onClick={(event) => event.preventDefault()}>
                                {link.label}
                            </HeaderNavLink>
                        ))}
                    </HeaderNav>
                ) : null}
                <HeaderActions>
                    {!compact ? (
                        <TooltipButton
                            type="button"
                            size="icon"
                            variant="ghost"
                            tooltip={isJa ? "コマンドパレットを開く" : "Open command palette"}
                            aria-label={isJa ? "コマンドパレットを開く" : "Open command palette"}
                            onClick={() => setCommandOpen(true)}
                        >
                            <Search className="h-4 w-4" aria-hidden />
                        </TooltipButton>
                    ) : null}
                    {!compact ? (
                        <TooltipButton
                            type="button"
                            size="icon"
                            variant="ghost"
                            tooltip={isJa ? "英語に切り替え" : "日本語に切り替え"}
                            aria-label={isJa ? "英語に切り替え" : "日本語に切り替え"}
                            onClick={() => setLocale(isJa ? "en" : "ja")}
                        >
                            <Languages className="h-4 w-4" aria-hidden />
                        </TooltipButton>
                    ) : null}
                    {!compact ? (
                        <TooltipButton
                            type="button"
                            size="icon"
                            variant="ghost"
                            tooltip={isDark ? (isJa ? "ライトテーマに切り替え" : "Switch to light theme") : isJa ? "ダークテーマに切り替え" : "Switch to dark theme"}
                            aria-label={isDark ? (isJa ? "ライトテーマに切り替え" : "Switch to light theme") : isJa ? "ダークテーマに切り替え" : "Switch to dark theme"}
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                        >
                            {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                        </TooltipButton>
                    ) : null}
                    {drawerNav ? (
                        <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button size="sm" variant="outline" className="h-9 w-9 gap-1.5 p-0 sm:h-8 sm:w-auto sm:px-3" aria-label={isJa ? "メニューを開く" : "Open menu"}>
                                    <Menu className="h-4 w-4" aria-hidden />
                                    <span className="hidden sm:inline">{isJa ? "メニュー" : "Menu"}</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent side="right">
                                <DrawerHeader className="text-left">
                                    <DrawerTitle>{isJa ? "メニュー" : "Menu"}</DrawerTitle>
                                    <DrawerDescription>
                                        {isJa ? "主要なページへ移動します。" : "Navigate to primary pages."}
                                    </DrawerDescription>
                                </DrawerHeader>
                                <nav className="grid gap-1 px-4" aria-label={isJa ? "ヘッダーナビゲーション" : "Header navigation"}>
                                    {navLinks.map((link, index) => (
                                        <DrawerClose key={link.href} asChild>
                                            <a
                                                href={link.href}
                                                aria-current={index === 0 ? "page" : undefined}
                                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
                                                onClick={(event) => event.preventDefault()}
                                            >
                                                {link.label}
                                            </a>
                                        </DrawerClose>
                                    ))}
                                </nav>
                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button variant="outline">{isJa ? "閉じる" : "Close"}</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    ) : null}
                    {drawerNav ? (
                        <TooltipButton type="button" size="icon" variant="ghost" tooltip={isJa ? "ログイン" : "Sign in"} aria-label={isJa ? "ログイン" : "Sign in"}>
                            <Avatar className="h-7 w-7">
                                <AvatarFallback>
                                    <UserRound className="h-4 w-4" aria-hidden />
                                </AvatarFallback>
                            </Avatar>
                        </TooltipButton>
                    ) : (
                        <Button size="sm">{isJa ? "ログイン" : "Sign in"}</Button>
                    )}
                </HeaderActions>
            </Header>
            {!compact ? (
                <CommandPalette
                    open={commandOpen}
                    onOpenChange={setCommandOpen}
                    groups={commandGroups}
                    placeholder={isJa ? "ドキュメントを検索" : "Search documentation"}
                    emptyMessage={isJa ? "一致する結果がありません。" : "No matching results."}
                    dialogTitle={isJa ? "コマンドパレット" : "Command palette"}
                    clearLabel={isJa ? "検索をクリア" : "Clear search"}
                />
            ) : null}
        </div>
    );
}
