"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Footer, FooterBrand, FooterColumns, FooterCopyright, FooterLink, FooterSection, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import {
    IconBrandGithub as Github,
    IconBrandLinkedin as Linkedin,
    IconBrandYoutube as Youtube,
} from "@tabler/icons-react";

export default function Embed() {
    const searchParams = useSearchParams();
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const compact = searchParams.get("variant") === "compact";
    const legalSocial = searchParams.get("variant") === "legal-social";
    const legalLinks = [
        { label: isJa ? "運営会社" : "Company", href: "#" },
        { label: isJa ? "プライバシーポリシー" : "Privacy Policy", href: "#" },
        { label: isJa ? "利用規約" : "Terms", href: "#" },
        { label: isJa ? "特定商取引法に基づく表記" : "Legal notice", href: "#" },
    ];
    const socialLinks = [
        { label: "GitHub", href: "https://github.com/eemlis7-ke/gunjo", icon: Github },
        { label: "LinkedIn", href: "#", icon: Linkedin },
        { label: "YouTube", href: "#", icon: Youtube },
    ];

    return (
        <div className="w-full overflow-hidden rounded-md border bg-background">
            <Footer className={compact ? "gap-4 px-5 py-6" : undefined}>
                <FooterColumns className={compact ? "grid-cols-1 gap-5 md:grid-cols-3" : undefined}>
                    <FooterBrand>
                        <p className="text-base font-semibold">Gunjo UI</p>
                        <p className="text-xs text-muted-foreground">
                            {isJa ? "プロダクト UI のためのデザインシステム" : "Design system for product UI"}
                        </p>
                    </FooterBrand>
                    <FooterSection title={isJa ? "プロダクト" : "Product"}>
                        <FooterLink href="#" onClick={(event) => event.preventDefault()}>
                            {isJa ? "コンポーネント" : "Components"}
                        </FooterLink>
                        <FooterLink href="#" onClick={(event) => event.preventDefault()}>
                            {isJa ? "テンプレート" : "Templates"}
                        </FooterLink>
                    </FooterSection>
                    <FooterSection title={isJa ? "リソース" : "Resources"}>
                        <FooterLink href="#" onClick={(event) => event.preventDefault()}>
                            {isJa ? "ドキュメント" : "Docs"}
                        </FooterLink>
                        <FooterLink href="#" onClick={(event) => event.preventDefault()}>
                            GitHub
                        </FooterLink>
                    </FooterSection>
                    {!compact ? (
                        <FooterSection title={isJa ? "会社情報" : "Company"}>
                            <FooterLink href="#" onClick={(event) => event.preventDefault()}>
                                {isJa ? "会社概要" : "About"}
                            </FooterLink>
                            <FooterLink href="#" onClick={(event) => event.preventDefault()}>
                                {isJa ? "お問い合わせ" : "Contact"}
                            </FooterLink>
                        </FooterSection>
                    ) : null}
                </FooterColumns>
                {legalSocial ? (
                    <div className="grid gap-4 border-t border-border pt-4 text-xs text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
                        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label={isJa ? "法務リンク" : "Legal links"}>
                            {legalLinks.map((link) => (
                                <FooterLink key={link.label} href={link.href} onClick={(event) => event.preventDefault()} className="text-xs">
                                    {link.label}
                                </FooterLink>
                            ))}
                        </nav>
                        <FooterCopyright className="border-0 p-0">
                            © 2026 Gunjo UI. All rights reserved.
                        </FooterCopyright>
                        <nav className="flex items-center gap-1 lg:justify-end" aria-label={isJa ? "SNSリンク" : "Social links"}>
                            {socialLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <Tooltip key={link.label}>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={link.href}
                                                onClick={(event) => event.preventDefault()}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                aria-label={link.label}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>{link.label}</TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </nav>
                    </div>
                ) : (
                    <FooterCopyright>
                        © 2026 Gunjo UI. All rights reserved.
                    </FooterCopyright>
                )}
            </Footer>
        </div>
    );
}
