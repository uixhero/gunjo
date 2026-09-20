"use client"

import Link from "next/link"
import { IconArrowRight as ArrowRight } from "@tabler/icons-react"

import { useLocale } from "@/components/providers/LocaleProvider"
import { UixheroRationaleLinks } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

const SAMPLE_CODE = {
    ja: `import { Badge, Button, cn } from "@gunjo/ui";

const TONES = {
    info: "border-info-border bg-info-subtle text-info-subtle-foreground",
    success: "border-success-border bg-success-subtle text-success-subtle-foreground",
    warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
};

const NOTICES = [
    {
        id: "n1",
        tone: "info",
        title: "メンテナンスの予定",
        body: "日曜の02:00から04:00まで。",
    },
    {
        id: "n2",
        tone: "success",
        title: "バックアップが終わりました",
        body: "1,204件を書き込みました。",
    },
    {
        id: "n3",
        tone: "warning",
        title: "保存容量が残りわずか",
        body: "契約分の92パーセントを使っています。",
    },
];

const TYPE_SCALE = [
    { id: "s1", className: "text-2xl font-bold", label: "text-2xl / font-bold" },
    { id: "s2", className: "text-base font-medium", label: "text-base / font-medium" },
    { id: "s3", className: "text-sm text-muted-foreground", label: "text-sm / muted" },
];

export function TokenUsage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
                {NOTICES.map((notice) => (
                    <div
                        key={notice.id}
                        className={cn(
                            "rounded-lg border p-4 shadow-sm",
                            "transition-colors duration-200 ease-out",
                            TONES[notice.tone as keyof typeof TONES]
                        )}
                    >
                        <p className="text-sm font-semibold">{notice.title}</p>
                        <p className="text-sm">{notice.body}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-md border bg-card p-4 text-card-foreground">
                {TYPE_SCALE.map((step) => (
                    <p key={step.id} className={step.className}>
                        {step.label}
                    </p>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted p-4">
                <Button>同じ primary トークンを使っています</Button>
                <Badge variant="secondary">secondary</Badge>
                <span
                    className="rounded-md bg-background px-3 py-2 text-sm"
                    style={{ boxShadow: "var(--shadow-md)" }}
                >
                    変数を直接使う場合: var(--shadow-md)
                </span>
            </div>
        </div>
    );
}`,
    en: `import { Badge, Button, cn } from "@gunjo/ui";

const TONES = {
    info: "border-info-border bg-info-subtle text-info-subtle-foreground",
    success: "border-success-border bg-success-subtle text-success-subtle-foreground",
    warning: "border-warning-border bg-warning-subtle text-warning-subtle-foreground",
};

const NOTICES = [
    {
        id: "n1",
        tone: "info",
        title: "Scheduled maintenance",
        body: "Sunday 02:00 to 04:00 JST.",
    },
    {
        id: "n2",
        tone: "success",
        title: "Backup finished",
        body: "1,204 records were written.",
    },
    {
        id: "n3",
        tone: "warning",
        title: "Storage almost full",
        body: "92 percent of the plan is in use.",
    },
];

const TYPE_SCALE = [
    { id: "s1", className: "text-2xl font-bold", label: "text-2xl / font-bold" },
    { id: "s2", className: "text-base font-medium", label: "text-base / font-medium" },
    { id: "s3", className: "text-sm text-muted-foreground", label: "text-sm / muted" },
];

export function TokenUsage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
                {NOTICES.map((notice) => (
                    <div
                        key={notice.id}
                        className={cn(
                            "rounded-lg border p-4 shadow-sm",
                            "transition-colors duration-200 ease-out",
                            TONES[notice.tone as keyof typeof TONES]
                        )}
                    >
                        <p className="text-sm font-semibold">{notice.title}</p>
                        <p className="text-sm">{notice.body}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-md border bg-card p-4 text-card-foreground">
                {TYPE_SCALE.map((step) => (
                    <p key={step.id} className={step.className}>
                        {step.label}
                    </p>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted p-4">
                <Button>Uses the same primary token</Button>
                <Badge variant="secondary">secondary</Badge>
                <span
                    className="rounded-md bg-background px-3 py-2 text-sm"
                    style={{ boxShadow: "var(--shadow-md)" }}
                >
                    Raw variable: var(--shadow-md)
                </span>
            </div>
        </div>
    );
}`,
};

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

            <section className="mt-10 space-y-4" id="sample">
                <div className="space-y-1 border-b pb-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {isJa ? "トークンを使う見本" : "Using the tokens"}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {isJa
                            ? "色・字の大きさ・余白・角丸・影・動きのトークンだけで1画面を組んだ例です。色の名前を差し替えるだけで意味が変わり、値は書き込みません。そのまま貼り付けて動きます。"
                            : "One screen built only from the colour, type, spacing, radius, shadow, and motion tokens. Swapping the token name changes the meaning, and no raw value is written in. Paste it as-is and it runs."}
                    </p>
                </div>
                <CodeBlock code={SAMPLE_CODE[locale]} />
            </section>

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
