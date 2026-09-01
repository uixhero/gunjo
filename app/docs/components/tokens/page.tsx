"use client"

import Link from "next/link"
import { IconArrowRight as ArrowRight } from "@tabler/icons-react"

import { useLocale } from "@/components/providers/LocaleProvider"
import { UixheroRationaleLinks } from "@/components/doc/ComponentHelpers";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

export default function TokensIndexPage() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    const tokens = [
        {
            title: "Colors",
            description: "Semantic color system.",
            href: "/docs/components/tokens/colors",
        },
        {
            title: "Typography",
            description: "Font scales and weights.",
            href: "/docs/components/tokens/typography",
        },
        {
            title: "Radius",
            description: "Border radius tokens.",
            href: "/docs/components/tokens/radius",
        },
    ];

    return (
        <div className="py-10">
            <div className="mb-10">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Design Tokens</h1>
                <p className="text-xl text-muted-foreground">
                    The fundamental visual tokens of the Gunjo design system.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokens.map((token) => (
                    <Link
                        key={token.href}
                        href={token.href}
                        className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-border"
                    >
                        <div>
                            <h3 className="font-semibold leading-none tracking-tight mb-2 group-hover:text-primary transition-colors">
                                {token.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {token.description}
                            </p>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            View Token <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                    </Link>
                ))}
            </div>

            <section className="mt-10 space-y-3" id="design-decisions">
                <div className="border-b pb-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {isJa
                        ? "トークンは1つの画面のために選ぶ値ではなく、繰り返し使うために先に決めておく値です。何をトークンにして、何を画面ごとの判断に残すかの考え方は、UIXHERO の「ルール化して再利用する (Design System Thinking)」にまとめています。"
                        : "A token is a value settled up front for repeated use, not one tuned for a single screen. How to decide what becomes a token and what stays a per-screen judgement is covered in the Design System Thinking article on UIXHERO."}
                </p>
            </section>

            <div className="mt-10">
                <UixheroRationaleLinks
                    locale={locale}
                    uixheroLinks={[
                        {
                            label: isJa
                                ? "UIXHERO: ルール化して再利用する (Design System Thinking)"
                                : "UIXHERO: Design System Thinking (in Japanese)",
                            href: `${UIXHERO_BASE_URL}/resources/ui-design/design-system-thinking`,
                        },
                    ]}
                />
            </div>
        </div>
    )
}
