"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../../_lib/MarqueeChrome";

const NAVIGABLE_PATHS = [
    "/login",
    "/signup",
    "/forgot-password",
    "/account",
];

export function AuthMarqueeChrome({
    children,
}: {
    children: (viewport: MarqueeViewport) => React.ReactNode;
}) {
    return (
        <MarqueeChrome
            slug="auth"
            routeBase="/patterns/auth"
            defaultPath="/login"
            navigablePaths={NAVIGABLE_PATHS}
        >
            {children}
        </MarqueeChrome>
    );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
    const { locale } = useLocale();
    const quote =
        locale === "ja"
            ? "GunjoUI に乗り換えてから、フォームの試作にかける時間が劇的に減った。"
            : "Switching to GunjoUI cut our form-prototyping time in half.";
    const quoteAuthor =
        locale === "ja" ? "リード・エンジニア / 架空" : "Lead engineer · imaginary co.";

    return (
        <AuthMarqueeChrome>
            {(viewport) => (
                <FixedAuthLayout quote={quote} quoteAuthor={quoteAuthor} viewport={viewport}>
                    {children}
                </FixedAuthLayout>
            )}
        </AuthMarqueeChrome>
    );
}

interface FixedAuthLayoutProps {
    quote: string;
    quoteAuthor: string;
    viewport: MarqueeViewport;
    children: React.ReactNode;
}

/**
 * Auth layout sized to the active fake browser viewport. Mobile drops the
 * dark branding panel so the form can use the full width — that's what
 * actual auth pages do on phones.
 */
function FixedAuthLayout({
    quote,
    quoteAuthor,
    viewport,
    children,
}: FixedAuthLayoutProps) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];
    const showSidePanel = viewport !== "mobile";

    return (
        <div
            className={
                showSidePanel
                    ? "grid h-full min-h-0 grid-cols-2"
                    : "flex h-full min-h-0 flex-col"
            }
            style={{ width, height }}
        >
            {showSidePanel ? (
                <div className="relative flex h-full flex-col bg-foreground p-10 text-background">
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        GunjoUI
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote}&rdquo;</p>
                            <footer className="text-sm">{quoteAuthor}</footer>
                        </blockquote>
                    </div>
                </div>
            ) : (
                <div className="shrink-0 flex items-center gap-2 border-b border-border/40 px-6 py-4 text-sm font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    GunjoUI
                </div>
            )}
            <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-8">
                <div className="mx-auto my-auto flex w-full max-w-[350px] flex-col justify-center space-y-6 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
