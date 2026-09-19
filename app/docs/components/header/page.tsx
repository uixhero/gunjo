"use client";

import * as React from "react";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { GunjoLogo } from "@/components/layout/GunjoLogo";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
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

function HeaderExample({ compact = false, drawerNav = false }: { compact?: boolean; drawerNav?: boolean }) {
    const { locale, setLocale } = useLocale();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const isJa = locale === "ja";
    const isDark = mounted && resolvedTheme === "dark";
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

function HeaderManyLinksExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const navLinks = isJa
        ? ["ダッシュボード", "配車", "車両", "乗務員", "運行実績", "整備", "請求", "設定"]
        : ["Dashboard", "Dispatch", "Vehicles", "Drivers", "Trips", "Maintenance", "Billing", "Settings"];

    return (
        <div className="w-full max-w-md overflow-hidden rounded-md border bg-background">
            <Header>
                <HeaderBrand>
                    <GunjoLogo />
                </HeaderBrand>
                <HeaderNav>
                    {navLinks.map((label, index) => (
                        <HeaderNavLink
                            key={label}
                            href="#"
                            active={index === 0}
                            onClick={(event) => event.preventDefault()}
                        >
                            {label}
                        </HeaderNavLink>
                    ))}
                </HeaderNav>
                <HeaderActions>
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                </HeaderActions>
            </Header>
        </div>
    );
}

const compactCodeByLocale = {
    ja: `import { Button, Header, HeaderActions, HeaderBrand } from "@gunjo/ui"

export function CompactHeader() {
  return (
    <Header className="px-4">
      <HeaderBrand>
        <span
          aria-label="Gunjo UI"
          role="img"
          className="block h-8 w-[3.75rem] bg-primary [mask:url('/gunjo-logo.svg')_center/contain_no-repeat] [-webkit-mask:url('/gunjo-logo.svg')_center/contain_no-repeat]"
        />
      </HeaderBrand>
      <HeaderActions>
        <Button size="sm">ログイン</Button>
      </HeaderActions>
    </Header>
  )
}`,
    en: `import { Button, Header, HeaderActions, HeaderBrand } from "@gunjo/ui"

export function CompactHeader() {
  return (
    <Header className="px-4">
      <HeaderBrand>
        <span
          aria-label="Gunjo UI"
          role="img"
          className="block h-8 w-[3.75rem] bg-primary [mask:url('/gunjo-logo.svg')_center/contain_no-repeat] [-webkit-mask:url('/gunjo-logo.svg')_center/contain_no-repeat]"
        />
      </HeaderBrand>
      <HeaderActions>
        <Button size="sm">Sign in</Button>
      </HeaderActions>
    </Header>
  )
}`,
};

const manyLinksCodeByLocale = {
    ja: `import {
  Avatar,
  AvatarFallback,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderNav,
  HeaderNavLink,
} from "@gunjo/ui";
import { IconUserCircle as UserRound } from "@tabler/icons-react";

const NAV_LINKS = [
  "ダッシュボード",
  "配車",
  "車両",
  "乗務員",
  "運行実績",
  "整備",
  "請求",
  "設定",
];

export function WideNavHeader() {
  return (
    <Header>
      <HeaderBrand>
        <span className="text-base font-semibold">群青交通</span>
      </HeaderBrand>
      <HeaderNav>
        {NAV_LINKS.map((label, index) => (
          <HeaderNavLink key={label} href="#" active={index === 0}>
            {label}
          </HeaderNavLink>
        ))}
      </HeaderNav>
      <HeaderActions>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <UserRound className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </HeaderActions>
    </Header>
  );
}`,
    en: `import {
  Avatar,
  AvatarFallback,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderNav,
  HeaderNavLink,
} from "@gunjo/ui";
import { IconUserCircle as UserRound } from "@tabler/icons-react";

const NAV_LINKS = [
  "Dashboard",
  "Dispatch",
  "Vehicles",
  "Drivers",
  "Trips",
  "Maintenance",
  "Billing",
  "Settings",
];

export function WideNavHeader() {
  return (
    <Header>
      <HeaderBrand>
        <span className="text-base font-semibold">Gunjo Transit</span>
      </HeaderBrand>
      <HeaderNav>
        {NAV_LINKS.map((label, index) => (
          <HeaderNavLink key={label} href="#" active={index === 0}>
            {label}
          </HeaderNavLink>
        ))}
      </HeaderNav>
      <HeaderActions>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <UserRound className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </HeaderActions>
    </Header>
  );
}`,
} as const;

export default function HeaderPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
const usageCode = `import * as React from "react"
import {
  IconLanguage as Languages,
  IconMoon as Moon,
  IconSearch as Search,
  IconSun as Sun,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import {
  Button,
  CommandPalette,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderNav,
  HeaderNavLink,
  TooltipButton,
} from "@gunjo/ui"

type Locale = "ja" | "en"

function getNavLinks(isJa: boolean) {
  return [
    { label: isJa ? "ドキュメント" : "Docs", href: "/docs" },
    { label: isJa ? "コンポーネント" : "Components", href: "/docs/components" },
    { label: isJa ? "料金" : "Pricing", href: "/pricing" },
  ]
}

function BrandLogo() {
  return (
    <span
      aria-label="Gunjo UI"
      role="img"
      className="block h-8 w-[3.75rem] bg-primary [mask:url('/gunjo-logo.svg')_center/contain_no-repeat] [-webkit-mask:url('/gunjo-logo.svg')_center/contain_no-repeat]"
    />
  )
}

export function SiteHeader() {
  const [locale, setLocale] = React.useState<Locale>("ja")
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isJa = locale === "ja"
  const isDark = mounted && resolvedTheme === "dark"
  const navLinks = getNavLinks(isJa)
  const currentPath = "/docs"
  const commandGroups = [
    {
      heading: isJa ? "ページ" : "Pages",
      items: navLinks.map((link) => ({
        id: link.href,
        label: link.label,
        action: () => setCommandOpen(false),
      })),
    },
  ]

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Header>
        <HeaderBrand>
          <BrandLogo />
        </HeaderBrand>
        <HeaderNav>
          {navLinks.map((link) => (
            <HeaderNavLink
              key={link.href}
              href={link.href}
              active={link.href === currentPath}
            >
              {link.label}
            </HeaderNavLink>
          ))}
        </HeaderNav>
        <HeaderActions>
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
          <TooltipButton
            type="button"
            size="icon"
            variant="ghost"
            tooltip={isDark ? "ライトテーマに切り替え" : "ダークテーマに切り替え"}
            aria-label={isDark ? "ライトテーマに切り替え" : "ダークテーマに切り替え"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </TooltipButton>
          <Button size="sm">{isJa ? "ログイン" : "Sign in"}</Button>
        </HeaderActions>
      </Header>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        groups={commandGroups}
        placeholder={isJa ? "ドキュメントを検索" : "Search documentation"}
        emptyMessage={isJa ? "一致する結果がありません。" : "No matching results."}
        dialogTitle={isJa ? "コマンドパレット" : "Command palette"}
        clearLabel={isJa ? "検索をクリア" : "Clear search"}
      />
    </>
  )
}`;
const drawerNavCode = `import * as React from "react"
import {
  IconLanguage as Languages,
  IconMenu2 as Menu,
  IconMoon as Moon,
  IconSearch as Search,
  IconSun as Sun,
  IconUserCircle as UserRound,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import {
  Avatar,
  AvatarFallback,
  Button,
  CommandPalette,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Header,
  HeaderActions,
  HeaderBrand,
  TooltipButton,
} from "@gunjo/ui"

type Locale = "ja" | "en"

function getNavLinks(isJa: boolean) {
  return [
    { label: isJa ? "ドキュメント" : "Docs", href: "/docs" },
    { label: isJa ? "コンポーネント" : "Components", href: "/docs/components" },
    { label: isJa ? "料金" : "Pricing", href: "/pricing" },
  ]
}

function BrandLogo() {
  return (
    <span
      aria-label="Gunjo UI"
      role="img"
      className="block h-8 w-[3.75rem] bg-primary [mask:url('/gunjo-logo.svg')_center/contain_no-repeat] [-webkit-mask:url('/gunjo-logo.svg')_center/contain_no-repeat]"
    />
  )
}

export function DrawerMenuHeader() {
  const [locale, setLocale] = React.useState<Locale>("ja")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isJa = locale === "ja"
  const isDark = mounted && resolvedTheme === "dark"
  const navLinks = getNavLinks(isJa)
  const commandGroups = [
    {
      heading: isJa ? "ページ" : "Pages",
      items: navLinks.map((link) => ({
        id: link.href,
        label: link.label,
        action: () => setCommandOpen(false),
      })),
    },
  ]

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Header>
        <HeaderBrand>
          <BrandLogo />
        </HeaderBrand>
        <HeaderActions>
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
          <TooltipButton
            type="button"
            size="icon"
            variant="ghost"
            tooltip={isDark ? "ライトテーマに切り替え" : "ダークテーマに切り替え"}
            aria-label={isDark ? "ライトテーマに切り替え" : "ダークテーマに切り替え"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </TooltipButton>
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
                <DrawerDescription>{isJa ? "主要なページへ移動します。" : "Navigate to primary pages."}</DrawerDescription>
              </DrawerHeader>
              <nav className="grid gap-1 px-4" aria-label={isJa ? "ヘッダーナビゲーション" : "Header navigation"}>
                {navLinks.map((link) => (
                  <DrawerClose key={link.href} asChild>
                    <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" href={link.href}>
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
          <TooltipButton type="button" size="icon" variant="ghost" tooltip={isJa ? "ログイン" : "Sign in"} aria-label={isJa ? "ログイン" : "Sign in"}>
            <Avatar className="h-7 w-7">
              <AvatarFallback>
                <UserRound className="h-4 w-4" aria-hidden />
              </AvatarFallback>
            </Avatar>
          </TooltipButton>
        </HeaderActions>
      </Header>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        groups={commandGroups}
        placeholder={isJa ? "ドキュメントを検索" : "Search documentation"}
        emptyMessage={isJa ? "一致する結果がありません。" : "No matching results."}
        dialogTitle={isJa ? "コマンドパレット" : "Command palette"}
        clearLabel={isJa ? "検索をクリア" : "Clear search"}
      />
    </>
  )
}`;
    const compactCode = compactCodeByLocale[locale];

    return (
        <ComponentLayout
            title={navigationMetadata.header.title}
            description={navigationMetadata.header.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Header", href: "/docs/components/header" },
                { name: "Avatar", href: "/docs/components/avatar" },
                { name: "CommandPalette", href: "/docs/components/command-palette" },
                { name: "Drawer", href: "/docs/components/drawer" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
            relatedComponents={[
                { name: "NavigationMenu", href: "/docs/components/navigation-menu" },
                { name: "Button", href: "/docs/components/button" },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto" embedSrc="/embed/header">
                <HeaderExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "compact",
                            title: isJa ? "コンパクト" : "Compact",
                            description: isJa ? "狭いヘッダーやアプリ内画面では、主要リンクを別ナビゲーションに逃がしてブランドと操作だけにできます。" : "For narrow app surfaces, keep only brand and actions in the header.",
                            preview: <HeaderExample compact />,
                            previewBodyWidth: "full",
                            embedSrc: "/embed/header?variant=compact",
                            code: compactCode,
                        },
                        {
                            key: "drawer-nav",
                            title: isJa ? "ドロワーにナビゲーションを格納" : "Navigation in drawer",
                            description: isJa
                                ? "タブレットやスマホでは主要リンクをヘッダー上に並べず、右側から開くドロワーにまとめて表示できます。"
                                : "On tablet and phone layouts, primary links can move into a right-side drawer instead of staying visible in the header.",
                            preview: <HeaderExample drawerNav />,
                            previewBodyWidth: "full",
                            embedSrc: "/embed/header?variant=drawer-nav",
                            code: drawerNavCode,
                        },
                        {
                            key: "many-links",
                            title: isJa ? "リンクが多いとき" : "When there are many links",
                            description: isJa
                                ? "HeaderNav は入り切らない分を横スクロールに逃がします。ブランドと操作は押し出されず、狭い画面ではナビが自分の段へ降ります。"
                                : "HeaderNav sends the overflow into a horizontal scroll: the brand and the actions are never pushed out, and on narrow screens the nav drops onto its own row.",
                            preview: <HeaderManyLinksExample />,
                            previewBodyWidth: "lg",
                            code: manyLinksCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "Header", type: "header", description: isJa ? "ブランド、主要ナビゲーション、操作を横並びにするルート。" : "Root header that aligns brand, primary navigation, and actions." },
                        { name: "HeaderBrand", type: "div", description: isJa ? "ロゴやサービス名を入れる左側スロット。" : "Left slot for logo and service name." },
                        { name: "HeaderNavLink.active", type: "boolean", description: isJa ? "現在ページのリンクを強調します。" : "Highlights the current page link." },
                        { name: "HeaderActions", type: "div", description: isJa ? "検索、ログイン、テーマ切替などの操作スロット。" : "Action slot for search, auth, theme toggles, and similar controls." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
