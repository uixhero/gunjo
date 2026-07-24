"use client";

import * as React from "react";
import Link from "next/link";
import { IconCheck as Check, IconCopy as Copy } from "@tabler/icons-react";
import { cn } from "@gunjo/ui";

import { useLocale } from "@/components/providers/LocaleProvider";
import { TOKEN_VALUES } from "@/lib/data/token-values.generated";

type Locale = "en" | "ja";

type TokenItem = {
    cssVar: string;
    name: Record<Locale, string>;
    description?: Record<Locale, string>;
    foregroundVar?: string;
    valueTemplate?: (cssVar: string) => string;
};

type SemanticColor = {
    key: "primary" | "info" | "success" | "warning" | "destructive";
    name: Record<Locale, string>;
    purpose: Record<Locale, string>;
};

type BrandStory = {
    key: "gunjo" | "kobicha";
    name: Record<Locale, string>;
    subtitle: Record<Locale, string>;
    purpose: Record<Locale, string>;
    usage: Record<Locale, string[]>;
    tokens: TokenItem[];
};

const SEMANTIC_COLORS: SemanticColor[] = [
    {
        key: "primary",
        name: { ja: "プライマリ", en: "Primary" },
        purpose: {
            ja: "主要操作、選択状態、フォーカス、ブランド CTA。",
            en: "Primary actions, selected states, focus, and brand CTAs.",
        },
    },
    {
        key: "info",
        name: { ja: "情報", en: "Info" },
        purpose: {
            ja: "補足情報、詳細確認、リンク先の案内。",
            en: "Information, detail prompts, and supporting guidance.",
        },
    },
    {
        key: "success",
        name: { ja: "成功", en: "Success" },
        purpose: {
            ja: "完了、接続済み、肯定的な状態。",
            en: "Completion, connected states, and positive outcomes.",
        },
    },
    {
        key: "warning",
        name: { ja: "注意", en: "Warning" },
        purpose: {
            ja: "注意、公開前確認、破壊的ではない警告。",
            en: "Caution, pre-publish checks, and non-destructive warnings.",
        },
    },
    {
        key: "destructive",
        name: { ja: "破壊的操作", en: "Destructive" },
        purpose: {
            ja: "削除、失敗、取り消せない操作。",
            en: "Delete, failure, and irreversible actions.",
        },
    },
];

const SURFACE_TOKENS: TokenItem[] = [
    { cssVar: "--background", name: { ja: "背景", en: "Background" }, foregroundVar: "--foreground" },
    { cssVar: "--foreground", name: { ja: "前景", en: "Foreground" } },
    { cssVar: "--card", name: { ja: "カード", en: "Card" }, foregroundVar: "--card-foreground" },
    { cssVar: "--card-foreground", name: { ja: "カード文字", en: "Card foreground" } },
    { cssVar: "--popover", name: { ja: "ポップオーバー", en: "Popover" }, foregroundVar: "--popover-foreground" },
    { cssVar: "--popover-foreground", name: { ja: "ポップオーバー文字", en: "Popover foreground" } },
    { cssVar: "--muted", name: { ja: "控えめな面", en: "Muted" }, foregroundVar: "--muted-foreground" },
    { cssVar: "--muted-foreground", name: { ja: "控えめな文字", en: "Muted foreground" } },
    { cssVar: "--secondary", name: { ja: "セカンダリ", en: "Secondary" }, foregroundVar: "--secondary-foreground" },
    { cssVar: "--secondary-foreground", name: { ja: "セカンダリ文字", en: "Secondary foreground" } },
    { cssVar: "--accent", name: { ja: "アクセント", en: "Accent" }, foregroundVar: "--accent-foreground" },
    { cssVar: "--accent-foreground", name: { ja: "アクセント文字", en: "Accent foreground" } },
    { cssVar: "--border", name: { ja: "枠線", en: "Border" } },
    { cssVar: "--input", name: { ja: "入力欄枠線", en: "Input" } },
    { cssVar: "--ring", name: { ja: "フォーカスリング", en: "Ring" } },
    { cssVar: "--overlay", name: { ja: "オーバーレイ", en: "Overlay" } },
];

const BRAND_TOKENS: TokenItem[] = [
    { cssVar: "--gunjo-deep", name: { ja: "群青 深", en: "Gunjo deep" } },
    { cssVar: "--gunjo-deeper", name: { ja: "群青 より深く", en: "Gunjo deeper" } },
    { cssVar: "--gunjo-deepest", name: { ja: "群青 最深", en: "Gunjo deepest" } },
    { cssVar: "--gunjo-light", name: { ja: "群青 明", en: "Gunjo light" } },
    { cssVar: "--gunjo-mid", name: { ja: "群青 基準", en: "Gunjo mid" } },
    { cssVar: "--gunjo-bright", name: { ja: "群青 明彩", en: "Gunjo bright" } },
    { cssVar: "--gunjo-dark", name: { ja: "群青 暗", en: "Gunjo dark" } },
    { cssVar: "--kobicha-warm", name: { ja: "媚茶 暖", en: "Kobicha warm" } },
    { cssVar: "--kobicha-mid", name: { ja: "媚茶 基準", en: "Kobicha mid" } },
    { cssVar: "--kobicha-bright", name: { ja: "媚茶 明", en: "Kobicha bright" } },
    { cssVar: "--kobicha-deepest", name: { ja: "媚茶 最深", en: "Kobicha deepest" } },
    { cssVar: "--pure-white", name: { ja: "純白", en: "Pure white" } },
    { cssVar: "--pure-black", name: { ja: "純黒", en: "Pure black" } },
    {
        cssVar: "--gunjo-swatch-hue",
        name: { ja: "群青 Hue", en: "Gunjo hue" },
        valueTemplate: (cssVar) => `hsl(var(${cssVar}) 39% 49%)`,
    },
];

const BRAND_STORIES: BrandStory[] = [
    {
        key: "gunjo",
        name: { ja: "群青", en: "Gunjo" },
        subtitle: {
            ja: "基調・信頼・集中をつくるブランド色",
            en: "Brand blues for focus, trust, and structure.",
        },
        purpose: {
            ja: "Gunjo UI の主軸となる色です。主要操作、選択状態、フォーカス、チャートの基準系列など、プロダクト全体の方向を示す場面に使います。",
            en: "The primary color family for Gunjo UI. Use it for primary actions, selected states, focus, and baseline chart series.",
        },
        usage: {
            ja: ["主要 CTA", "選択中の状態", "フォーカスリング", "ブランド背景"],
            en: ["Primary CTAs", "Selected states", "Focus rings", "Brand surfaces"],
        },
        tokens: [
            { cssVar: "--gunjo-deep", name: { ja: "深い群青", en: "Gunjo deep" } },
            { cssVar: "--gunjo-mid", name: { ja: "基準の群青", en: "Gunjo mid" } },
            { cssVar: "--gunjo-bright", name: { ja: "明るい群青", en: "Gunjo bright" } },
        ],
    },
    {
        key: "kobicha",
        name: { ja: "媚茶", en: "Kobicha" },
        subtitle: {
            ja: "温度感・補助・人間味を足すブランド色",
            en: "Warm accents that add support, tactility, and humanity.",
        },
        purpose: {
            ja: "群青だけでは硬く見える場面に、控えめな温度感を足す補助色です。注釈、編集面、空状態、ブランドの物語性を持たせたい背景に使います。",
            en: "A warm supporting family for moments where blue alone feels too rigid. Use it for notes, editorial surfaces, empty states, and brand storytelling.",
        },
        usage: {
            ja: ["補助背景", "注釈や説明", "編集・制作系の面", "ブランドストーリー"],
            en: ["Supporting surfaces", "Notes and explanations", "Editorial surfaces", "Brand storytelling"],
        },
        tokens: [
            { cssVar: "--kobicha-warm", name: { ja: "暖かい媚茶", en: "Kobicha warm" } },
            { cssVar: "--kobicha-mid", name: { ja: "基準の媚茶", en: "Kobicha mid" } },
            { cssVar: "--kobicha-bright", name: { ja: "明るい媚茶", en: "Kobicha bright" } },
        ],
    },
];

const CHART_TOKENS: TokenItem[] = [
    { cssVar: "--primary", name: { ja: "主要系列", en: "Primary series" } },
    { cssVar: "--info", name: { ja: "情報系列", en: "Info series" } },
    { cssVar: "--success", name: { ja: "成功系列", en: "Success series" } },
    { cssVar: "--warning", name: { ja: "注意系列", en: "Warning series" } },
    { cssVar: "--accent", name: { ja: "補助系列", en: "Accent series" } },
    { cssVar: "--destructive", name: { ja: "リスク系列", en: "Risk series" } },
];

const COPY = {
    ja: {
        eyebrow: "Tokens · Colors",
        heading: "カラー",
        subtitle: "用途別パレットと全トークンパレットを確認できます。値は現在のテーマに追従します。",
        usageTitle: "用途別パレット",
        brandStoryTitle: "ブランドパレット",
        brandStoryDescription: "群青と媚茶は、単なる色値ではなく Gunjo UI の印象を決める基準色です。",
        allTitle: "全トークンパレット",
        brand: "ブランド",
        surface: "面とニュートラル",
        semantic: "意味色",
        chart: "チャート",
        subtle: "淡色",
        default: "標準",
        strong: "強調",
        border: "枠線",
        foreground: "文字",
        copied: "コピー済み",
        copyFailed: "コピーできません",
        copyColor: "色をコピー",
        copyVar: "CSS変数をコピー",
        copyHex: "hexをコピー",
        copyHsl: "HSLをコピー",
        fixedUrlLead: "実値は純 CSS の固定 URL（",
        fixedUrlTail: "）でも配信しています。",
        noNpmLead: "npm やビルドツールが使えない環境では「",
        noNpmLinkText: "npm なしで使う",
        noNpmTail: "」を参照してください。",
    },
    en: {
        eyebrow: "Tokens · Colors",
        heading: "Colors",
        subtitle: "Review purpose-based palettes and every color token. Values follow the active theme.",
        usageTitle: "Purpose-based palettes",
        brandStoryTitle: "Brand palette",
        brandStoryDescription: "Gunjo and Kobicha are foundational colors that shape the character of Gunjo UI.",
        allTitle: "All color tokens",
        brand: "Brand",
        surface: "Surface & neutral",
        semantic: "Semantic",
        chart: "Chart",
        subtle: "Subtle",
        default: "Default",
        strong: "Strong",
        border: "Border",
        foreground: "Foreground",
        copied: "Copied",
        copyFailed: "Copy failed",
        copyColor: "Copy color",
        copyVar: "Copy CSS variable",
        copyHex: "Copy hex",
        copyHsl: "Copy HSL",
        fixedUrlLead: "Values are also served as plain CSS at a fixed URL (",
        fixedUrlTail: ").",
        noNpmLead: "Where npm or build tools are unavailable, see ",
        noNpmLinkText: "Without npm",
        noNpmTail: ".",
    },
} as const;

/**
 * Convert an "H S% L%" triplet (the tokens.css value format) to hex, so the
 * server-rendered HTML carries a concrete hex before getComputedStyle runs.
 */
function hslTripletToHex(triplet: string): string {
    const match = triplet.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
    if (!match) return "";
    const h = parseFloat(match[1]) / 360;
    const s = parseFloat(match[2]) / 100;
    const l = parseFloat(match[3]) / 100;
    const channel = (n: number) => {
        const k = (n + h * 12) % 12;
        const a = s * Math.min(l, 1 - l);
        const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(value * 255)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

function rgbToHex(rgb: string): string {
    const match = rgb.match(/(\d+(?:\.\d+)?)/g);
    if (!match || match.length < 3) return rgb;
    const [r, g, b] = match.map((s) => Math.round(parseFloat(s)));
    const toHex = (n: number) =>
        Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

async function writeClipboardText(value: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
        if (!document.execCommand("copy")) {
            throw new Error("copy command failed");
        }
    } finally {
        document.body.removeChild(textarea);
    }
}

function useTokenValue(cssVar: string, valueTemplate?: (cssVar: string) => string) {
    const ref = React.useRef<HTMLElement | null>(null);
    // Static light-theme value from the token SSOT so the value is already in
    // the server-rendered HTML; getComputedStyle takes over on the client and
    // keeps it in sync with the active theme. (#687)
    const staticRaw = TOKEN_VALUES.light[cssVar] ?? "";
    const [raw, setRaw] = React.useState(staticRaw);
    const [hex, setHex] = React.useState(() => hslTripletToHex(staticRaw));
    const setRef = React.useCallback((node: HTMLElement | null) => {
        ref.current = node;
    }, []);

    React.useEffect(() => {
        const update = () => {
            const root = getComputedStyle(document.documentElement);
            const nextRaw = root.getPropertyValue(cssVar).trim();
            setRaw(nextRaw);

            const swatch = ref.current;
            if (swatch) {
                const bg = getComputedStyle(swatch).backgroundColor;
                if (bg) setHex(rgbToHex(bg));
            }
        };

        update();

        const observer = new MutationObserver(() => {
            window.requestAnimationFrame(update);
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style"],
        });

        return () => observer.disconnect();
    }, [cssVar, valueTemplate]);

    return {
        ref: setRef,
        raw,
        hex,
        hsl: raw ? (valueTemplate ? valueTemplate(cssVar) : `hsl(${raw})`) : "",
    };
}

function useCopyFeedback() {
    const [copied, setCopied] = React.useState<string | null>(null);
    const [failed, setFailed] = React.useState<string | null>(null);

    const copy = React.useCallback(async (value: string, key: string) => {
        if (!value) return;
        try {
            await writeClipboardText(value);
            setCopied(key);
            setFailed(null);
            window.setTimeout(() => setCopied(null), 1400);
        } catch {
            setCopied(null);
            setFailed(key);
            window.setTimeout(() => setFailed(null), 1800);
        }
    }, []);

    return { copied, failed, copy };
}

function CopyChip({
    value,
    id,
    label,
    copiedLabel,
    failedLabel,
    copied,
    failed,
    onCopy,
}: {
    value: string;
    id: string;
    label: string;
    copiedLabel: string;
    failedLabel: string;
    copied: string | null;
    failed: string | null;
    onCopy: (value: string, id: string) => void;
}) {
    const active = copied === id;
    const isFailed = failed === id;
    return (
        <button
            type="button"
            onClick={() => onCopy(value, id)}
            className={cn(
                "inline-flex max-w-full items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors",
                active
                    ? "border-primary-border bg-primary-subtle text-primary-subtle-foreground"
                    : isFailed
                        ? "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground"
                    : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={label}
        >
            {active ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
            <span className="min-w-0 truncate">{active ? copiedLabel : isFailed ? failedLabel : value}</span>
        </button>
    );
}

function TokenSwatch({ token, locale }: { token: TokenItem; locale: Locale }) {
    const value = useTokenValue(token.cssVar, token.valueTemplate);
    const { copied, failed, copy } = useCopyFeedback();
    const background = token.valueTemplate?.(token.cssVar) ?? `hsl(var(${token.cssVar}))`;
    const swatchCopyValue = value.hex || value.hsl;
    const swatchCopyId = `${token.cssVar}:color`;
    const swatchCopied = copied === swatchCopyId;
    const swatchFailed = failed === swatchCopyId;

    return (
        <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3">
            <button
                ref={value.ref}
                type="button"
                onClick={() => copy(swatchCopyValue, swatchCopyId)}
                className="group relative h-20 w-full appearance-none rounded-md border border-border/50 shadow-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
                style={{ backgroundColor: background }}
                title={COPY[locale].copyColor}
            >
                <span
                    className={cn(
                        "absolute bottom-2 right-2 rounded bg-background/90 px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                        (swatchCopied || swatchFailed) && "opacity-100",
                        swatchFailed && "bg-destructive-subtle text-destructive-subtle-foreground"
                    )}
                >
                    {swatchCopied ? COPY[locale].copied : swatchFailed ? COPY[locale].copyFailed : COPY[locale].copyColor}
                </span>
            </button>
            <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{token.name[locale]}</p>
                        {token.description ? (
                            <p className="text-xs text-muted-foreground">{token.description[locale]}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={() => copy(token.cssVar, `${token.cssVar}:var`)}
                        className={cn(
                            "shrink-0 rounded px-1 font-mono text-[10px] transition-colors",
                            copied === `${token.cssVar}:var`
                                ? "bg-primary-subtle text-primary-subtle-foreground"
                                : failed === `${token.cssVar}:var`
                                    ? "bg-destructive-subtle text-destructive-subtle-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        title={COPY[locale].copyVar}
                    >
                        {copied === `${token.cssVar}:var` ? COPY[locale].copied : failed === `${token.cssVar}:var` ? COPY[locale].copyFailed : token.cssVar}
                    </button>
                </div>
                <div className="flex min-w-0 flex-wrap gap-1.5 pt-1">
                    <CopyChip value={value.hex} id={`${token.cssVar}:hex`} label={COPY[locale].copyHex} copiedLabel={COPY[locale].copied} failedLabel={COPY[locale].copyFailed} copied={copied} failed={failed} onCopy={copy} />
                    <CopyChip value={value.hsl} id={`${token.cssVar}:hsl`} label={COPY[locale].copyHsl} copiedLabel={COPY[locale].copied} failedLabel={COPY[locale].copyFailed} copied={copied} failed={failed} onCopy={copy} />
                </div>
            </div>
        </div>
    );
}

function PairPreview({
    bgVar,
    fgVar,
    label,
    locale,
}: {
    bgVar: string;
    fgVar: string;
    label: string;
    locale: Locale;
}) {
    const value = useTokenValue(bgVar);
    const { copied, failed, copy } = useCopyFeedback();
    const copyId = `${bgVar}:color`;
    const active = copied === copyId;
    const isFailed = failed === copyId;

    return (
        <button
            ref={value.ref}
            type="button"
            onClick={() => copy(value.hex || value.hsl, copyId)}
            className="group relative flex h-14 min-h-14 w-full appearance-none items-center justify-center rounded-md border border-border/40 px-3 text-sm font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
            style={{
                backgroundColor: `hsl(var(${bgVar}))`,
                color: `hsl(var(${fgVar}))`,
            }}
            title={COPY[locale].copyColor}
        >
            {label}
            <span
                className={cn(
                    "absolute bottom-1 right-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                    (active || isFailed) && "opacity-100",
                    isFailed && "bg-destructive-subtle text-destructive-subtle-foreground"
                )}
            >
                {active ? COPY[locale].copied : isFailed ? COPY[locale].copyFailed : COPY[locale].copyColor}
            </span>
        </button>
    );
}

function ColorBorderPreview({ cssVar, locale }: { cssVar: string; locale: Locale }) {
    const value = useTokenValue(cssVar);
    const { copied, failed, copy } = useCopyFeedback();
    const copyId = `${cssVar}:color`;
    const active = copied === copyId;
    const isFailed = failed === copyId;

    return (
        <button
            type="button"
            onClick={() => copy(value.hex || value.hsl, copyId)}
            className="group relative flex h-14 min-h-14 w-full appearance-none items-center justify-center rounded-md border-4 bg-background text-xs font-medium text-muted-foreground transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
            style={{ borderColor: `hsl(var(${cssVar}))` }}
            title={COPY[locale].copyColor}
        >
            <span
                ref={value.ref}
                className="sr-only"
                style={{ backgroundColor: `hsl(var(${cssVar}))` }}
            />
            {cssVar}
            <span
                className={cn(
                    "absolute bottom-1 right-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                    (active || isFailed) && "opacity-100",
                    isFailed && "bg-destructive-subtle text-destructive-subtle-foreground"
                )}
            >
                {active ? COPY[locale].copied : isFailed ? COPY[locale].copyFailed : COPY[locale].copyColor}
            </span>
        </button>
    );
}

function SemanticScale({ color, locale }: { color: SemanticColor; locale: Locale }) {
    const c = COPY[locale];
    const prefix = `--${color.key}`;

    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold">{color.name[locale]}</h3>
                    <p className="text-sm text-muted-foreground">{color.purpose[locale]}</p>
                </div>
                <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{prefix}</code>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{c.subtle}</p>
                    <PairPreview bgVar={`${prefix}-subtle`} fgVar={`${prefix}-subtle-foreground`} label="Aa" locale={locale} />
                    <p className="font-mono text-[11px] text-muted-foreground">{`${prefix}-subtle`}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{c.default}</p>
                    <PairPreview bgVar={prefix} fgVar={`${prefix}-foreground`} label="Aa" locale={locale} />
                    <p className="font-mono text-[11px] text-muted-foreground">{prefix}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{c.strong}</p>
                    <PairPreview bgVar={`${prefix}-strong`} fgVar={`${prefix}-strong-foreground`} label="Aa" locale={locale} />
                    <p className="font-mono text-[11px] text-muted-foreground">{`${prefix}-strong`}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{c.border}</p>
                    <ColorBorderPreview cssVar={`${prefix}-border`} locale={locale} />
                    <p className="font-mono text-[11px] text-muted-foreground">{`${prefix}-border`}</p>
                </div>
            </div>
        </div>
    );
}

function BrandStoryCard({ story, locale }: { story: BrandStory; locale: Locale }) {
    return (
        <article className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid gap-0 lg:grid-cols-[1fr_18rem]">
                <div className="space-y-4 p-5">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">{story.subtitle[locale]}</p>
                        <h3 className="text-2xl font-semibold tracking-tight">{story.name[locale]}</h3>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{story.purpose[locale]}</p>
                    <div className="flex flex-wrap gap-2">
                        {story.usage[locale].map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="grid min-h-48 grid-cols-3 border-t border-border lg:border-l lg:border-t-0">
                    {story.tokens.map((token) => (
                        <BrandColorTile key={token.cssVar} token={token} locale={locale} />
                    ))}
                </div>
            </div>
        </article>
    );
}

function BrandColorTile({ token, locale }: { token: TokenItem; locale: Locale }) {
    const value = useTokenValue(token.cssVar);
    const { copied, failed, copy } = useCopyFeedback();
    const copyId = `${token.cssVar}:color`;
    const active = copied === copyId;
    const isFailed = failed === copyId;

    return (
        <button
            ref={value.ref}
            type="button"
            onClick={() => copy(value.hex || value.hsl, copyId)}
            className="group relative flex h-full w-full min-w-0 appearance-none flex-col justify-end border-r border-border/40 p-3 text-left transition-transform last:border-r-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:scale-[0.99]"
            style={{ backgroundColor: `hsl(var(${token.cssVar}))` }}
            title={COPY[locale].copyColor}
        >
            <div className="rounded-md bg-background/90 p-2 shadow-sm">
                <p className="truncate text-xs font-medium text-foreground">{token.name[locale]}</p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">{token.cssVar}</p>
            </div>
            <span
                className={cn(
                    "absolute right-2 top-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                    (active || isFailed) && "opacity-100",
                    isFailed && "bg-destructive-subtle text-destructive-subtle-foreground"
                )}
            >
                {active ? COPY[locale].copied : isFailed ? COPY[locale].copyFailed : COPY[locale].copyColor}
            </span>
        </button>
    );
}

function BrandPalette({ locale }: { locale: Locale }) {
    const c = COPY[locale];

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">{c.brandStoryTitle}</h3>
                <p className="text-sm text-muted-foreground">{c.brandStoryDescription}</p>
            </div>
            <div className="grid gap-4">
                {BRAND_STORIES.map((story) => (
                    <BrandStoryCard key={story.key} story={story} locale={locale} />
                ))}
            </div>
        </div>
    );
}

function TokenSection({
    title,
    tokens,
    locale,
}: {
    title: string;
    tokens: TokenItem[];
    locale: Locale;
}) {
    return (
        <section className="space-y-4">
            <h3 className="border-b border-border/60 pb-2 text-xl font-semibold tracking-tight">{title}</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tokens.map((token) => (
                    <TokenSwatch key={token.cssVar} token={token} locale={locale} />
                ))}
            </div>
        </section>
    );
}

function buildSemanticTokens(): TokenItem[] {
    return SEMANTIC_COLORS.flatMap((color) => {
        const prefix = `--${color.key}`;
        return [
            { cssVar: `${prefix}-subtle`, name: { ja: `${color.name.ja} subtle`, en: `${color.name.en} subtle` }, foregroundVar: `${prefix}-subtle-foreground` },
            { cssVar: `${prefix}-subtle-foreground`, name: { ja: `${color.name.ja} subtle foreground`, en: `${color.name.en} subtle foreground` } },
            { cssVar: prefix, name: { ja: `${color.name.ja} default`, en: `${color.name.en} default` }, foregroundVar: `${prefix}-foreground` },
            { cssVar: `${prefix}-foreground`, name: { ja: `${color.name.ja} foreground`, en: `${color.name.en} foreground` } },
            { cssVar: `${prefix}-strong`, name: { ja: `${color.name.ja} strong`, en: `${color.name.en} strong` }, foregroundVar: `${prefix}-strong-foreground` },
            { cssVar: `${prefix}-strong-foreground`, name: { ja: `${color.name.ja} strong foreground`, en: `${color.name.en} strong foreground` } },
            { cssVar: `${prefix}-border`, name: { ja: `${color.name.ja} border`, en: `${color.name.en} border` } },
        ];
    });
}

export default function ColorsPage() {
    const { locale } = useLocale();
    const c = COPY[locale];
    const semanticTokens = React.useMemo(() => buildSemanticTokens(), []);

    return (
        <div className="space-y-12">
            <header className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {c.eyebrow}
                </p>
                <h1 className="text-4xl font-bold tracking-tight">{c.heading}</h1>
                <p className="max-w-3xl text-lg text-muted-foreground">{c.subtitle}</p>
                <p className="max-w-3xl text-sm text-muted-foreground">
                    {c.fixedUrlLead}
                    <a
                        href="/tokens.css"
                        className="font-medium text-primary hover:underline"
                    >
                        https://www.gunjo.jp/tokens.css
                    </a>
                    {c.fixedUrlTail}
                    {c.noNpmLead}
                    <Link
                        href="/docs/no-npm"
                        className="font-medium text-primary hover:underline"
                    >
                        {c.noNpmLinkText}
                    </Link>
                    {c.noNpmTail}
                </p>
            </header>

            <section className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">{c.usageTitle}</h2>
                    <p className="text-sm text-muted-foreground">
                        {locale === "ja"
                            ? "subtle は文字を載せる面、default はアイコン・状態・チャート、strong はボタンや強い CTA に使います。"
                            : "Use subtle for readable surfaces, default for icons/status/charts, and strong for buttons or high-emphasis CTAs."}
                    </p>
                </div>
                <BrandPalette locale={locale} />
                <div className="space-y-4">
                    {SEMANTIC_COLORS.map((color) => (
                        <SemanticScale key={color.key} color={color} locale={locale} />
                    ))}
                </div>
            </section>

            <section className="space-y-8">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">{c.allTitle}</h2>
                    <p className="text-sm text-muted-foreground">
                        {locale === "ja"
                            ? "すべてのカラー CSS 変数を一覧し、hex / HSL / CSS var をコピーできます。"
                            : "Browse every color CSS variable and copy hex, HSL, or CSS variable names."}
                    </p>
                </div>
                <TokenSection title={c.semantic} tokens={semanticTokens} locale={locale} />
                <TokenSection title={c.surface} tokens={SURFACE_TOKENS} locale={locale} />
                <TokenSection title={c.chart} tokens={CHART_TOKENS} locale={locale} />
                <TokenSection title={c.brand} tokens={BRAND_TOKENS} locale={locale} />
            </section>
        </div>
    );
}
