"use client";

import {
    Footer,
    FooterBrand,
    FooterColumns,
    FooterCopyright,
    FooterLink,
    FooterSection,
} from "@gunjo/ui";

export function FooterDemo() {
    return (
        <div className="w-full overflow-hidden rounded-md border">
            <Footer>
                <FooterColumns>
                    <FooterBrand>
                        <p className="text-base font-semibold">GunjoUI</p>
                        <p className="text-xs text-muted-foreground">
                            SSOT-driven design system
                        </p>
                    </FooterBrand>
                    <FooterSection title="Product">
                        <FooterLink href="#">Components</FooterLink>
                        <FooterLink href="#">Templates</FooterLink>
                        <FooterLink href="#">Pricing</FooterLink>
                    </FooterSection>
                    <FooterSection title="Resources">
                        <FooterLink href="#">Docs</FooterLink>
                        <FooterLink href="https://github.com/uixhero/gunjo">GitHub</FooterLink>
                        <FooterLink href="#">Blog</FooterLink>
                    </FooterSection>
                    <FooterSection title="Company">
                        <FooterLink href="#">About</FooterLink>
                        <FooterLink href="#">Contact</FooterLink>
                    </FooterSection>
                </FooterColumns>
                <FooterCopyright>© 2026 GunjoUI. All rights reserved.</FooterCopyright>
            </Footer>
        </div>
    );
}
