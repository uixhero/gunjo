"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { GunjoLogo } from "@/components/layout/GunjoLogo";
import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterLink,
} from "@gunjo/ui";

type SiteFooterPlacement = "global" | "content";

export function SiteFooter({
    placement = "global",
}: {
    placement?: SiteFooterPlacement;
}) {
    const pathname = usePathname();
    const { header, t } = useLocale();
    const [isInIframe, setIsInIframe] = React.useState(false);
    const isContentFooter = placement === "content";

    React.useEffect(() => {
        try {
            setIsInIframe(window.self !== window.top);
        } catch {
            setIsInIframe(true);
        }
    }, []);

    if (pathname?.startsWith("/embed")) return null;
    if (
        !isContentFooter &&
        (pathname?.startsWith("/docs") || pathname?.startsWith("/docs/tokens"))
    ) return null;
    if (isInIframe) return null;

    return (
        <Footer
            data-site-footer
            className={
                isContentFooter
                    ? "mt-10 border-border/40 px-0 py-8"
                    : "border-border/40 px-0 py-8"
            }
        >
            <div
                className={
                    isContentFooter
                        ? "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                        : "container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                }
            >
                <FooterBrand className="gap-2">
                    <GunjoLogo className="h-7 w-[3.3rem]" label={header("siteName")} />
                    <FooterCopyright className="border-0 p-0">
                        © 2026 4px LLC. Becoming blue.
                    </FooterCopyright>
                </FooterBrand>

                <nav
                    className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
                    aria-label="Footer"
                >
                    <FooterLink href="/showcase">{header("showcase")}</FooterLink>
                    <FooterLink href="/patterns">{header("patterns")}</FooterLink>
                    <FooterLink href="/docs/introduction">{header("docs")}</FooterLink>
                    <FooterLink href="/docs/comparison">{t("Comparison")}</FooterLink>
                    <FooterLink href="/docs/tokens">{t("Tokens")}</FooterLink>
                    <FooterLink href="/docs/ai-handoff">{t("AI handoff")}</FooterLink>
                </nav>
            </div>
        </Footer>
    );
}
