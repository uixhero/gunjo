"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

const DURATIONS = [
    { name: "duration-75", value: "75ms", className: "duration-75" },
    { name: "duration-100", value: "100ms", className: "duration-100" },
    { name: "duration-150", value: "150ms", className: "duration-150" },
    { name: "duration-200", value: "200ms", className: "duration-200" },
    { name: "duration-300", value: "300ms", className: "duration-300" },
    { name: "duration-500", value: "500ms", className: "duration-500" },
    { name: "duration-700", value: "700ms", className: "duration-700" },
    { name: "duration-1000", value: "1000ms", className: "duration-1000" },
];

const EASINGS_BASE = [
    { name: "ease-linear", value: "linear", className: "ease-linear" },
    { name: "ease-in", value: "cubic-bezier(0.4, 0, 1, 1)", className: "ease-in" },
    { name: "ease-out", value: "cubic-bezier(0, 0, 0.2, 1)", className: "ease-out" },
    { name: "ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)", className: "ease-in-out" },
];

const EASING_DESCRIPTIONS = {
    en: [
        "Constant velocity. Use for spinners, indeterminate progress.",
        "Slow start, fast end. Use when something is leaving the screen.",
        "Fast start, soft landing. Default for entrances.",
        "Soft on both sides. Use for state transitions that stay on screen.",
    ],
    ja: [
        "等速。スピナーや進捗不明のプログレスに。",
        "立ち上がりは遅く、終わりが速い。画面から去る要素に。",
        "立ち上がりは速く、ふわっと着地。エントランスのデフォルト。",
        "両端ソフト。画面に残ったまま遷移する状態変化に。",
    ],
} as const;

const COPY = {
    en: {
        eyebrow: "Tokens · Animation",
        heading: "Animation",
        subtitle: "Eight duration tokens and four easing curves. Click any swatch to see it in motion.",
        sections: { durations: "Durations", easings: "Easings" },
        playLabel: "Click to play",
        playButton: "Play",
        durationGuidance: (
            <>
                Common rules: micro-interactions (hover, focus) →{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-150</code>;
                state transitions (modal, drawer) →{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-200</code>{" "}
                -{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-300</code>;
                storytelling moments (hero ink wash, page enter) →{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-500</code>{" "}
                +.
            </>
        ),
    },
    ja: {
        eyebrow: "Tokens · Animation",
        heading: "Animation",
        subtitle: "8 段階の duration トークンと 4 種類の easing カーブ。スウォッチをクリックすると動きを確認できます。",
        sections: { durations: "Durations", easings: "Easings" },
        playLabel: "クリックで再生",
        playButton: "再生",
        durationGuidance: (
            <>
                目安：マイクロインタラクション（hover / focus）は{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-150</code>。
                状態遷移（modal / drawer）は{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-200</code>{" "}
                〜{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-300</code>。
                演出的な瞬間（ヒーローのインク、ページ遷移）は{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">duration-500</code>{" "}
                以上。
            </>
        ),
    },
} as const;

function DurationDemo({
    name,
    duration,
    playLabel,
}: {
    name: string;
    duration: string;
    playLabel: string;
}) {
    const [active, setActive] = React.useState(false);

    return (
        <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className="group flex w-full cursor-pointer flex-col gap-2 rounded-lg border border-border/40 bg-muted/20 p-4 text-left transition-colors hover:border-primary-border"
        >
            <div className="flex items-baseline justify-between">
                <code className="font-mono text-xs">{name}</code>
                <code className="font-mono text-[10px] text-muted-foreground">
                    {duration}
                </code>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-primary transition-all ease-out ${active ? "w-full" : "w-0"} ${duration === "75ms" ? "duration-75" : duration === "100ms" ? "duration-100" : duration === "150ms" ? "duration-150" : duration === "200ms" ? "duration-200" : duration === "300ms" ? "duration-300" : duration === "500ms" ? "duration-500" : duration === "700ms" ? "duration-700" : "duration-1000"}`}
                />
            </div>
            <span className="text-[10px] text-muted-foreground">{playLabel}</span>
        </button>
    );
}

function EasingDemo({
    name,
    easing,
    description,
    playButton,
}: {
    name: string;
    easing: string;
    description: string;
    playButton: string;
}) {
    const [active, setActive] = React.useState(false);

    return (
        <div className="space-y-3 rounded-lg border border-border/40 bg-muted/20 p-5">
            <div className="flex items-baseline justify-between gap-3">
                <code className="font-mono text-xs">{name}</code>
                <code className="break-all font-mono text-[10px] text-muted-foreground">
                    {easing}
                </code>
            </div>
            <div className="relative h-12 w-full overflow-hidden rounded bg-muted">
                <div
                    className={`absolute inset-y-2 h-8 w-8 rounded-full bg-primary transition-all duration-1000 ${easing === "linear" ? "ease-linear" : easing.includes("0.4, 0, 1, 1") ? "ease-in" : easing.includes("0, 0, 0.2, 1") ? "ease-out" : "ease-in-out"} ${active ? "left-[calc(100%-2.5rem)]" : "left-2"}`}
                />
            </div>
            <button
                type="button"
                onClick={() => setActive((v) => !v)}
                className="cursor-pointer rounded-md border border-border/40 bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
            >
                {playButton}
            </button>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

export default function AnimationPage() {
    const { locale } = useLocale();
    const c = COPY[locale];
    const easings = EASINGS_BASE.map((e, i) => ({
        ...e,
        description: EASING_DESCRIPTIONS[locale][i],
    }));

    return (
        <div className="space-y-12">
            <header className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {c.eyebrow}
                </p>
                <h1 className="text-4xl font-bold tracking-tight">{c.heading}</h1>
                <p className="max-w-2xl text-lg text-muted-foreground">{c.subtitle}</p>
            </header>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.durations}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {DURATIONS.map((d) => (
                        <DurationDemo
                            key={d.name}
                            name={d.name}
                            duration={d.value}
                            playLabel={c.playLabel}
                        />
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">{c.durationGuidance}</p>
            </section>

            <section className="space-y-4">
                <h2 className="border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight">
                    {c.sections.easings}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {easings.map((e) => (
                        <EasingDemo
                            key={e.name}
                            name={e.name}
                            easing={e.value}
                            description={e.description}
                            playButton={c.playButton}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
