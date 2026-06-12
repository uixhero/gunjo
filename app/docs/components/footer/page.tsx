"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import { Footer, FooterBrand, FooterColumns, FooterCopyright, FooterLink, FooterSection, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import {
    IconBrandGithub as Github,
    IconBrandLinkedin as Linkedin,
    IconBrandYoutube as Youtube,
} from "@tabler/icons-react";

function FooterExample({ compact = false, legalSocial = false }: { compact?: boolean; legalSocial?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const legalLinks = [
        { label: isJa ? "運営会社" : "Company", href: "#" },
        { label: isJa ? "プライバシーポリシー" : "Privacy Policy", href: "#" },
        { label: isJa ? "利用規約" : "Terms", href: "#" },
        { label: isJa ? "特定商取引法に基づく表記" : "Legal notice", href: "#" },
    ];
    const socialLinks = [
        { label: "GitHub", href: "https://github.com/uixhero/gunjo", icon: Github },
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

export default function FooterPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = `import { Footer, FooterBrand, FooterColumns, FooterCopyright, FooterLink, FooterSection } from "@gunjo/ui"

export function SiteFooter() {
  return (
    <Footer>
      <FooterColumns>
        <FooterBrand>
          <p className="text-base font-semibold">Gunjo UI</p>
          <p className="text-xs text-muted-foreground">
            ${isJa ? "プロダクト UI のためのデザインシステム" : "Design system for product UI"}
          </p>
        </FooterBrand>
        <FooterSection title="${isJa ? "プロダクト" : "Product"}">
          <FooterLink href="/docs/components">${isJa ? "コンポーネント" : "Components"}</FooterLink>
          <FooterLink href="/patterns">${isJa ? "テンプレート" : "Templates"}</FooterLink>
        </FooterSection>
        <FooterSection title="${isJa ? "リソース" : "Resources"}">
          <FooterLink href="/docs">${isJa ? "ドキュメント" : "Docs"}</FooterLink>
          <FooterLink href="https://github.com/uixhero/gunjo">GitHub</FooterLink>
        </FooterSection>
        <FooterSection title="${isJa ? "会社情報" : "Company"}">
          <FooterLink href="/about">${isJa ? "会社概要" : "About"}</FooterLink>
          <FooterLink href="/contact">${isJa ? "お問い合わせ" : "Contact"}</FooterLink>
        </FooterSection>
      </FooterColumns>
      <FooterCopyright>© 2026 Gunjo UI. All rights reserved.</FooterCopyright>
    </Footer>
  )
}`;
    const compactCode = `import { Footer, FooterBrand, FooterColumns, FooterCopyright, FooterLink, FooterSection } from "@gunjo/ui"

export function CompactFooter() {
  return (
    <Footer className="gap-4 px-5 py-6">
      <FooterColumns className="grid-cols-1 gap-5 md:grid-cols-3">
        <FooterBrand>
          <p className="text-base font-semibold">Gunjo UI</p>
          <p className="text-xs text-muted-foreground">
            ${isJa ? "プロダクト UI のためのデザインシステム" : "Design system for product UI"}
          </p>
        </FooterBrand>
        <FooterSection title="${isJa ? "プロダクト" : "Product"}">
          <FooterLink href="/docs/components">${isJa ? "コンポーネント" : "Components"}</FooterLink>
          <FooterLink href="/patterns">${isJa ? "テンプレート" : "Templates"}</FooterLink>
        </FooterSection>
        <FooterSection title="${isJa ? "リソース" : "Resources"}">
          <FooterLink href="/docs">${isJa ? "ドキュメント" : "Docs"}</FooterLink>
          <FooterLink href="https://github.com/uixhero/gunjo">GitHub</FooterLink>
        </FooterSection>
      </FooterColumns>
      <FooterCopyright>© 2026 Gunjo UI. All rights reserved.</FooterCopyright>
    </Footer>
  )
}`;
const legalSocialCode = `import { Footer, FooterBrand, FooterColumns, FooterCopyright, FooterLink, FooterSection, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui"
import { IconBrandGithub as Github, IconBrandLinkedin as Linkedin, IconBrandYoutube as Youtube } from "@tabler/icons-react"

const legalLinks = [
  { label: "${isJa ? "運営会社" : "Company"}", href: "/company" },
  { label: "${isJa ? "プライバシーポリシー" : "Privacy Policy"}", href: "/privacy" },
  { label: "${isJa ? "利用規約" : "Terms"}", href: "/terms" },
  { label: "${isJa ? "特定商取引法に基づく表記" : "Legal notice"}", href: "/legal" },
]

const socialLinks = [
  { label: "GitHub", href: "https://github.com/uixhero/gunjo", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/", icon: Youtube },
]

export function FooterWithLegalAndSocial() {
  return (
    <Footer>
      <FooterColumns>
        <FooterBrand>
          <p className="text-base font-semibold">Gunjo UI</p>
          <p className="text-xs text-muted-foreground">
            ${isJa ? "プロダクト UI のためのデザインシステム" : "Design system for product UI"}
          </p>
        </FooterBrand>
        <FooterSection title="${isJa ? "プロダクト" : "Product"}">
          <FooterLink href="/docs/components">${isJa ? "コンポーネント" : "Components"}</FooterLink>
          <FooterLink href="/patterns">${isJa ? "テンプレート" : "Templates"}</FooterLink>
        </FooterSection>
        <FooterSection title="${isJa ? "リソース" : "Resources"}">
          <FooterLink href="/docs">${isJa ? "ドキュメント" : "Docs"}</FooterLink>
          <FooterLink href="https://github.com/uixhero/gunjo">GitHub</FooterLink>
        </FooterSection>
      </FooterColumns>
      <div className="grid gap-4 border-t border-border pt-4 text-xs text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="${isJa ? "法務リンク" : "Legal links"}">
          {legalLinks.map((link) => (
            <FooterLink key={link.label} href={link.href} className="text-xs">
              {link.label}
            </FooterLink>
          ))}
        </nav>
        <FooterCopyright className="border-0 p-0">© 2026 Gunjo UI. All rights reserved.</FooterCopyright>
        <nav className="flex items-center gap-1 lg:justify-end" aria-label="${isJa ? "SNSリンク" : "Social links"}">
          {socialLinks.map((link) => {
            const Icon = link.icon

            return (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>
                  <a
                    href={link.href}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{link.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </div>
    </Footer>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.footer.title}
            description={navigationMetadata.footer.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Footer", href: "/docs/components/footer" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Header", href: "/docs/components/header" },
                { name: "TextLink", href: "/docs/components/text-link" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="full" previewHeight="auto" embedSrc="/embed/footer">
                <FooterExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "compact",
                            title: isJa ? "少ないリンク" : "Compact links",
                            description: isJa ? "リンク群が少ない場合は列数を減らし、ブランドと補助リンクを近くにまとめます。" : "Use fewer columns when the footer only has a small set of supporting links.",
                            preview: <FooterExample compact />,
                            previewBodyWidth: "full",
                            embedSrc: "/embed/footer?variant=compact",
                            code: compactCode,
                        },
                        {
                            key: "legal-social",
                            title: isJa ? "法務リンクとSNS" : "Legal links and social links",
                            description: isJa ? "運営会社、プライバシーポリシー、利用規約などの必須リンクと、SNS へのアイコンリンクをフッター末尾にまとめます。" : "Collect required legal links and social icon links at the end of the footer.",
                            preview: <FooterExample legalSocial />,
                            previewBodyWidth: "full",
                            embedSrc: "/embed/footer?variant=legal-social",
                            code: legalSocialCode,
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
                        { name: "Footer", type: "footer", description: isJa ? "ページ下部の情報群をまとめるルート要素。" : "Root footer landmark for supporting page links." },
                        { name: "FooterColumns", type: "div", description: isJa ? "ブランドやリンクグループをレスポンシブな列で並べます。" : "Responsive column layout for brand and link groups." },
                        { name: "FooterSection.title", type: "ReactNode", description: isJa ? "リンクグループの見出し。" : "Heading for a link group." },
                        { name: "FooterLink", type: "a", description: isJa ? "フッター内で使う控えめなリンク。" : "Muted link styling for footer navigation." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
