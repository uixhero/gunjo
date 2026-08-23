"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconInfoCircle, IconArrowUpRight, IconShieldHalfFilled } from "@tabler/icons-react";
import { Alert, AlertDescription, Badge, Container, cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    DEMO_BASE,
    DEMO_SCREENS,
    FICTIONAL_COMPANY,
    FICTIONAL_COMPANY_EN,
    FICTIONAL_DISCLAIMER_EN,
    FICTIONAL_DISCLAIMER_JA,
} from "./fictional";

// タブの並び＝入口（業務フロー図と画面一覧）＋3画面。
// 準備中の5画面（仮ページ）はタブに並べない＝8タブになると本物の3画面が
// 埋もれるため、入口のフロー図・画面一覧と仮ページの前後ナビからのみ到達。
const NAV_ITEMS = [
    { href: DEMO_BASE, ja: "全体像", en: "Overview" },
    ...DEMO_SCREENS.map((screen) => ({
        href: screen.href,
        ja: screen.navJa,
        en: screen.navEn,
    })),
];

/**
 * 架空の保険会社デモの共有シェル。全画面に共通して:
 * - 架空の宣言（常時表示・折り返し可の Alert）
 * - 社名マストヘッド + 扉ページへの戻り導線
 * - 3画面のタブナビ
 * を与える。ナビはルーティング用のページ固有グルー（リンク3本）で、
 * 状態タブ（Tabs）ではなくリンクなので app-local に留める。
 */
export function DemoShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <Container size="2xl" className="py-6 sm:py-8">
            <Alert variant="info" className="mb-5">
                <IconInfoCircle className="h-4 w-4" aria-hidden />
                <AlertDescription>
                    {isJa ? FICTIONAL_DISCLAIMER_JA : FICTIONAL_DISCLAIMER_EN}
                </AlertDescription>
            </Alert>

            <header className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-2.5">
                    <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                        aria-hidden
                    >
                        <IconShieldHalfFilled className="h-5 w-5" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold tracking-tight text-foreground">
                                {isJa ? FICTIONAL_COMPANY : FICTIONAL_COMPANY_EN}
                            </span>
                            <Badge variant="outline">{isJa ? "架空のデモ" : "Fictional demo"}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isJa
                                ? "社内・代理店向け業務ポータル"
                                : "Portal for staff and agencies"}
                        </p>
                    </div>
                </div>
                <Link
                    href="/cold-tests/categories/insurance"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {isJa ? "保険UIのコールドテストに戻る" : "Back to the insurance cold tests"}
                    <IconArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
            </header>

            <nav
                aria-label={isJa ? "デモ画面の切り替え" : "Demo screens"}
                className="mb-6 overflow-x-auto border-b border-border"
            >
                <ul className="flex min-w-max items-stretch gap-1">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "inline-flex items-center whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        active
                                            ? "border-primary font-semibold text-foreground"
                                            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                                    )}
                                >
                                    {isJa ? item.ja : item.en}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {children}
        </Container>
    );
}
