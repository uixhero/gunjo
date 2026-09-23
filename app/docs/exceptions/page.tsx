"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { CANVAS_TEXT_SCALE } from "@/lib/data/token-scales.generated";

// Exceptions: places where GunjoUI allows something its tokens otherwise rule
// out, limited to a named surface. Kept out of the token pages on purpose —
// listing the canvas sizes under Typography read as "the type scale goes down
// to 9.5px" (KeEem, 2026-09-19). One entry per exception; add the next one to
// EXCEPTIONS with the same fields, and give it a machine check the way
// canvas-text has design:verify:scale-tokens.

type Locale = "ja" | "en";

type ExceptionEntry = {
    id: string;
    title: Record<Locale, string>;
    allows: Record<Locale, string>;
    where: Record<Locale, string>;
    why: Record<Locale, string>;
    guard: Record<Locale, string>;
    decided: string;
    sample?: "canvas-text";
};

const EXCEPTIONS: ExceptionEntry[] = [
    {
        id: "canvas-text",
        title: {
            ja: "地図や図の上に重ねる小さな字",
            en: "Small text over a map or drawing",
        },
        allows: {
            ja: "text-canvas-sm / -xs / -2xs（11 / 10 / 9.5px）。",
            en: "text-canvas-sm / -xs / -2xs (11 / 10 / 9.5px).",
        },
        where: {
            ja: "地図・図・画像の上に重ねる字だけ（縮尺バーの「20 km」、失敗を示す「!」など）。",
            en: "Only text laid over a map, a drawing or an image (a scale bar's “20 km”, a failure “!”).",
        },
        why: {
            ja: "字が大きいほど、地図を覆う面が広がるためです。読む文には使わず、数字や短い印に限ります。",
            en: "The larger the text, the more map it covers. Never for reading text; numbers and short marks only.",
        },
        guard: {
            ja: "使ってよいファイルは design/policy/canvas-text-allowlist.json にあります。ほかで使うと自動検査（CI）が失敗します。",
            en: "Allowed files are listed, with reasons, in design/policy/canvas-text-allowlist.json. Use anywhere else fails CI (design:verify:scale-tokens).",
        },
        decided: "2026-09-19",
        sample: "canvas-text",
    },
];

const COPY = {
    en: {
        eyebrow: "Tokens · Exceptions",
        heading: "Exceptions",
        subtitle: "What GunjoUI allows outside its tokens, each limited to one kind of surface.",
        labels: { allows: "Allows", where: "Only where", why: "Why", guard: "How it is held", decided: "Decided" },
        sample: "20 km · 12:00",
    },
    ja: {
        eyebrow: "Tokens · Exceptions",
        heading: "特例",
        subtitle: "場所を限って使ってよい例外の一覧です。",
        labels: { allows: "認めるもの", where: "使ってよい場所", why: "理由", guard: "守り方", decided: "決めた日" },
        sample: "20 km · 12:00",
    },
} as const;

function CanvasTextSample({ sample }: { sample: string }) {
    return (
        <div className="space-y-2 rounded-lg bg-gunjo-deepest p-4 text-gunjo-light">
            {CANVAS_TEXT_SCALE.map((step) => (
                <div key={step.utility} className="flex items-baseline gap-3">
                    <code className="w-28 shrink-0 font-mono text-xs opacity-80">{step.utility}</code>
                    <code className="w-10 shrink-0 font-mono text-xs opacity-80">{step.px}</code>
                    <span className={`${step.utility} min-w-0 font-mono tracking-wide`}>{sample}</span>
                </div>
            ))}
        </div>
    );
}

export default function ExceptionsPage() {
    const { locale } = useLocale();
    const c = COPY[locale];

    return (
        <div className="space-y-12">
            <header className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{c.eyebrow}</p>
                <h1 className="text-4xl font-bold tracking-tight">{c.heading}</h1>
                <p className="text-lg text-muted-foreground">{c.subtitle}</p>
            </header>

            {EXCEPTIONS.map((entry, index) => (
                <section key={entry.id} id={entry.id} className="space-y-4">
                    <h2 className="pb-2 text-2xl font-semibold tracking-tight">
                        {index + 1}. {entry.title[locale]}
                    </h2>
                    <dl className="grid gap-x-6 gap-y-3 text-sm leading-7 sm:grid-cols-[10rem_1fr]">
                        <dt className="font-semibold">{c.labels.allows}</dt>
                        <dd className="text-muted-foreground">{entry.allows[locale]}</dd>
                        <dt className="font-semibold">{c.labels.where}</dt>
                        <dd className="text-muted-foreground">{entry.where[locale]}</dd>
                        <dt className="font-semibold">{c.labels.why}</dt>
                        <dd className="text-muted-foreground">{entry.why[locale]}</dd>
                        <dt className="font-semibold">{c.labels.guard}</dt>
                        <dd className="text-muted-foreground">{entry.guard[locale]}</dd>
                        <dt className="font-semibold">{c.labels.decided}</dt>
                        <dd className="text-muted-foreground tabular-nums">{entry.decided}</dd>
                    </dl>
                    {entry.sample === "canvas-text" ? <CanvasTextSample sample={c.sample} /> : null}
                </section>
            ))}
        </div>
    );
}
