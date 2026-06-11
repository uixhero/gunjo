"use client";

import {
    Button,
    Header,
    HeaderActions,
    HeaderBrand,
    HeaderNav,
    HeaderNavLink,
    Kbd,
} from "@gunjo/ui";

export function HeaderDemo() {
    return (
        <div className="w-full overflow-hidden rounded-md border">
            <Header>
                <HeaderBrand>
                    <div className="h-8 w-8 rounded-md bg-foreground" aria-hidden />
                    <span className="text-base font-semibold">GunjoUI</span>
                </HeaderBrand>
                <HeaderNav>
                    <HeaderNavLink href="#" active>
                        Docs
                    </HeaderNavLink>
                    <HeaderNavLink href="#">Components</HeaderNavLink>
                    <HeaderNavLink href="#">Pricing</HeaderNavLink>
                </HeaderNav>
                <HeaderActions>
                    <Kbd>⌘K</Kbd>
                    <Button size="sm">Sign in</Button>
                </HeaderActions>
            </Header>
        </div>
    );
}
