"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@gunjo/ui";

function NavigationMenuExample({ directOnly = false }: { directOnly?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const products = [
        { title: isJa ? "コンポーネント" : "Components", href: "/docs/components", desc: isJa ? "再利用できる UI 部品" : "Reusable UI parts" },
        { title: isJa ? "トークン" : "Tokens", href: "/docs/tokens", desc: isJa ? "色、余白、角丸の設計値" : "Color, spacing, and radius values" },
        { title: isJa ? "テンプレート" : "Templates", href: "/patterns", desc: isJa ? "画面単位の組み合わせ例" : "Page-level compositions" },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {!directOnly ? (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>{isJa ? "プロダクト" : "Product"}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[min(400px,calc(100vw-3rem))] gap-2 p-3">
                                {products.map((item) => (
                                    <li key={item.title}>
                                        <NavigationMenuLink href={item.href} onClick={(event) => event.preventDefault()} className="block rounded-md p-2 hover:bg-muted">
                                            <div className="text-sm font-medium">{item.title}</div>
                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ) : null}
                <NavigationMenuItem>
                    <NavigationMenuLink href="/pricing" onClick={(event) => event.preventDefault()} className={navigationMenuTriggerStyle()}>
                        {isJa ? "料金" : "Pricing"}
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/docs" onClick={(event) => event.preventDefault()} className={navigationMenuTriggerStyle()}>
                        {isJa ? "ドキュメント" : "Docs"}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default function Embed() {
    const searchParams = useSearchParams();
    const directOnly = searchParams.get("variant") === "direct-links";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <NavigationMenuExample directOnly={directOnly} />
        </div>
    );
}
