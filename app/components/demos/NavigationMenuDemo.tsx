"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@gunjo/ui";

const PRODUCTS = [
    { title: "Components", href: "/products/components", desc: "70+ pre-built components" },
    { title: "Tokens", href: "/products/tokens", desc: "Color / spacing / radius design tokens" },
    { title: "Themes", href: "/products/themes", desc: "Light, dark, and custom themes" },
];

const SOLUTIONS = [
    { title: "AI editors", href: "/solutions/ai" },
    { title: "Dashboards", href: "/solutions/dashboards" },
    { title: "Marketing", href: "/solutions/marketing" },
];

export function NavigationMenuDemo() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 p-3">
                            {PRODUCTS.map((p) => (
                                <li key={p.href}>
                                    <NavigationMenuLink
                                        href={p.href}
                                        className="block rounded-md p-2 hover:bg-muted"
                                    >
                                        <div className="text-sm font-medium">{p.title}</div>
                                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-1 p-2">
                            {SOLUTIONS.map((s) => (
                                <li key={s.href}>
                                    <NavigationMenuLink
                                        href={s.href}
                                        className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                                    >
                                        {s.title}
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="/pricing"
                        className={navigationMenuTriggerStyle()}
                    >
                        Pricing
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
