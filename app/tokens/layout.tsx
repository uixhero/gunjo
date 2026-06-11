"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@gunjo/ui";
import { SiteFooter } from "@/components/layout/SiteFooter";

const SECTIONS = [
    { href: "/tokens", label: "Overview" },
    { href: "/tokens/colors", label: "Colors" },
    { href: "/tokens/typography", label: "Typography" },
    { href: "/tokens/spacing", label: "Spacing" },
    { href: "/tokens/shadows", label: "Shadows" },
    { href: "/tokens/radius", label: "Radius" },
    { href: "/tokens/animation", label: "Animation" },
    { href: "/tokens/spec", label: "DESIGN.md" },
];

export default function TokensLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="container flex-1 items-start md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 lg:gap-12">
            <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 border-r border-border/40 py-8 pr-6 md:block">
                <h4 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground/90">
                    Tokens
                </h4>
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {SECTIONS.map((s) => {
                        const exact = pathname === s.href;
                        return (
                            <Link
                                key={s.href}
                                href={s.href}
                                className={cn(
                                    "rounded-md px-2 py-1.5 transition-colors",
                                    exact
                                        ? "bg-muted font-medium text-foreground"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                {s.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <main className="py-8 lg:py-10">
                {children}
                <SiteFooter placement="content" />
            </main>
        </div>
    );
}
