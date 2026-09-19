// The spacing / typography scale GunjoUI publishes in the standalone sheet.
//
// Why this file exists at all: GunjoUI does not override Tailwind's spacing or
// type scale — `tailwind-theme-extend.cjs` extends colors, radius, shadow and
// motion only. So the numbers below are *Tailwind's*, and until now they were
// written down nowhere in this repo except two hand-typed arrays in the docs
// pages. Adopters who can't run npm (Claude Artifacts, single-file HTML) had to
// copy those numbers by hand, and the copy left the SSOT the moment it was made.
// This module is the one place the scale is declared; everything else derives
// from it and `design-verify-scale-tokens.mjs` checks it against the installed
// Tailwind theme, so an upstream scale change fails CI instead of drifting. (#969)
//
// ⚠️ These names are NOT emitted into `src/globals.css`, and must not be.
// `--text-*`, `--leading-*`, `--font-weight-*`, `--font-sans` and `--font-mono`
// are Tailwind v4 theme namespaces, and its utilities read them
// (`.text-base { font-size: var(--text-base) }`). `src/globals.css` lands in
// the `base` layer, which outranks Tailwind's `theme` layer, so defining them
// there would silently re-point every utility in every consumer. Measured
// 2026-09-12 with `html{font-size:20px}`: `.text-sm` computes to 17.5px today,
// and to a frozen 14px once `--text-sm: 14px` is added to globals.css — the
// user's browser font-size setting stops working (WCAG 1.4.4). The standalone
// sheet is a separate artifact for non-Tailwind pages, so the block is added
// there only.
//
// Values are rem, matching Tailwind exactly. Two reasons: a page built on the
// standalone sheet keeps following the reader's font-size setting, and if the
// sheet is ever loaded next to Tailwind the identical values make the name
// collision a no-op instead of a silent override.

/** Tailwind's spacing base — `p-4` compiles to `calc(var(--spacing) * 4)`. */
export const SPACING_BASE_REM = 0.25;

/**
 * Spacing steps, named after the Tailwind step (`--space-2` is 8px, the same
 * 8px `gap-2` gives) rather than after the measurement. The docs speak in step
 * names throughout (`h-9`, `gap-2`, `p-4`, `space-y-6`), so a `--space-2` that
 * meant 2px would put two different lengths behind one name.
 *
 * Fractional steps are spelled with a hyphen (`--space-0-5`): a bare `.` is not
 * valid in a custom property name without escaping, and `var(--space-0\.5)` is
 * a trap to type.
 */
export const SPACING_STEPS = [
    { step: "0", name: "--space-0", multiplier: 0 },
    { step: "px", name: "--space-px", literal: "1px" },
    { step: "0.5", name: "--space-0-5", multiplier: 0.5 },
    { step: "1", name: "--space-1", multiplier: 1 },
    { step: "1.5", name: "--space-1-5", multiplier: 1.5 },
    { step: "2", name: "--space-2", multiplier: 2 },
    { step: "2.5", name: "--space-2-5", multiplier: 2.5 },
    { step: "3", name: "--space-3", multiplier: 3 },
    { step: "3.5", name: "--space-3-5", multiplier: 3.5 },
    { step: "4", name: "--space-4", multiplier: 4 },
    { step: "5", name: "--space-5", multiplier: 5 },
    { step: "6", name: "--space-6", multiplier: 6 },
    { step: "7", name: "--space-7", multiplier: 7 },
    { step: "8", name: "--space-8", multiplier: 8 },
    { step: "9", name: "--space-9", multiplier: 9 },
    { step: "10", name: "--space-10", multiplier: 10 },
    { step: "12", name: "--space-12", multiplier: 12 },
    { step: "14", name: "--space-14", multiplier: 14 },
    { step: "16", name: "--space-16", multiplier: 16 },
    { step: "20", name: "--space-20", multiplier: 20 },
    { step: "24", name: "--space-24", multiplier: 24 },
    { step: "28", name: "--space-28", multiplier: 28 },
    { step: "32", name: "--space-32", multiplier: 32 },
    { step: "36", name: "--space-36", multiplier: 36 },
    { step: "40", name: "--space-40", multiplier: 40 },
    { step: "48", name: "--space-48", multiplier: 48 },
    { step: "56", name: "--space-56", multiplier: 56 },
    { step: "64", name: "--space-64", multiplier: 64 },
];

/** Font sizes. `utility` is the Tailwind class, and also its theme variable. */
export const TEXT_STEPS = [
    { utility: "text-xs", name: "--text-xs", rem: 0.75 },
    { utility: "text-sm", name: "--text-sm", rem: 0.875 },
    { utility: "text-base", name: "--text-base", rem: 1 },
    { utility: "text-lg", name: "--text-lg", rem: 1.125 },
    { utility: "text-xl", name: "--text-xl", rem: 1.25 },
    { utility: "text-2xl", name: "--text-2xl", rem: 1.5 },
    { utility: "text-3xl", name: "--text-3xl", rem: 1.875 },
    { utility: "text-4xl", name: "--text-4xl", rem: 2.25 },
    { utility: "text-5xl", name: "--text-5xl", rem: 3 },
    { utility: "text-6xl", name: "--text-6xl", rem: 3.75 },
    { utility: "text-7xl", name: "--text-7xl", rem: 4.5 },
];

export const LEADING_STEPS = [
    { utility: "leading-tight", name: "--leading-tight", value: "1.25" },
    { utility: "leading-snug", name: "--leading-snug", value: "1.375" },
    { utility: "leading-normal", name: "--leading-normal", value: "1.5" },
    { utility: "leading-relaxed", name: "--leading-relaxed", value: "1.625" },
];

export const WEIGHT_STEPS = [
    { utility: "font-normal", name: "--font-weight-normal", value: "400" },
    { utility: "font-medium", name: "--font-weight-medium", value: "500" },
    { utility: "font-semibold", name: "--font-weight-semibold", value: "600" },
    { utility: "font-bold", name: "--font-weight-bold", value: "700" },
    { utility: "font-extrabold", name: "--font-weight-extrabold", value: "800" },
];

/**
 * Font stacks. `--font-sans` / `--font-mono` mirror Tailwind's defaults (the
 * verifier holds them to it). `--font-mincho` is GunjoUI's own brand serif and
 * has no Tailwind counterpart; the standalone sheet cannot ship the webfont, so
 * the stack degrades to the platform serif when Shippori Mincho is absent.
 */
export const FONT_STACKS = [
    {
        name: "--font-sans",
        tailwind: "--font-sans",
        value:
            'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    {
        name: "--font-mono",
        tailwind: "--font-mono",
        value:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    {
        name: "--font-mincho",
        tailwind: null,
        value: '"Shippori Mincho", "Yu Mincho", YuMincho, serif',
    },
];

/**
 * The density rules from /docs/typography, as variables rather than prose.
 * These are GunjoUI's decisions (not Tailwind's), which is why they are plain
 * aliases: a standalone page changes the system's density by re-pointing one
 * of these instead of hunting every declaration.
 */
export const DENSITY_TOKENS = [
    {
        name: "--control-h",
        value: "2.25rem",
        px: 36,
        // Buttons / inputs / selects are h-9 across the system.
        tailwindSpacingMultiplier: 9,
        note: "h-9",
    },
    { name: "--text-ui", value: "var(--text-sm)", note: "UI の既定" },
    { name: "--text-prose", value: "var(--text-base)", note: "長文の既定" },
];

/** rem -> px at the 16px root default, for the trailing comments. */
export function remToPx(rem) {
    return Math.round(rem * 16 * 1000) / 1000;
}

function spacingRem(entry) {
    return Math.round(entry.multiplier * SPACING_BASE_REM * 1e6) / 1e6;
}

/** The resolved value each spacing step ships, e.g. `--space-4` -> `1rem`. */
export function spacingValue(entry) {
    if (entry.literal) return entry.literal;
    const rem = spacingRem(entry);
    return rem === 0 ? "0px" : `${rem}rem`;
}

/** What a spacing step measures at the 16px root default, e.g. `16px`. */
export function spacingPx(entry) {
    if (entry.literal) return entry.literal;
    return `${remToPx(spacingRem(entry))}px`;
}

export function textValue(entry) {
    return `${entry.rem}rem`;
}

export function textPx(entry) {
    return `${remToPx(entry.rem)}px`;
}

function pad(name, width) {
    return name.length >= width ? name : name + " ".repeat(width - name.length);
}

function declaration(name, value, comment) {
    const body = `    ${name}: ${value};`;
    // A px note that just repeats the value (--space-px: 1px) says nothing.
    if (!comment || comment === value) return body;
    return `${pad(body, 44)} /* ${comment} */`;
}

/**
 * The block appended to public/tokens.css. Returned without the wrapping
 * `:root { }` so the caller keeps control of the sheet's shape.
 */
export function buildScaleDeclarations() {
    const lines = [];

    lines.push("    /* 余白 — 段階名は Tailwind と同じ（--space-2 は gap-2 と同じ 8px）。");
    lines.push("       小数の段は \"-\" で書く（--space-0-5 = 0.5 段 = 2px）。 */");
    for (const entry of SPACING_STEPS) {
        lines.push(declaration(entry.name, spacingValue(entry), spacingPx(entry)));
    }

    lines.push("");
    lines.push("    /* 字の大きさ — rem なので利用者の文字サイズ設定に追従する */");
    for (const entry of TEXT_STEPS) {
        lines.push(declaration(entry.name, textValue(entry), textPx(entry)));
    }

    lines.push("");
    lines.push("    /* 行間 */");
    for (const entry of LEADING_STEPS) {
        lines.push(declaration(entry.name, entry.value));
    }

    lines.push("");
    lines.push("    /* 太さ */");
    for (const entry of WEIGHT_STEPS) {
        lines.push(declaration(entry.name, entry.value));
    }

    lines.push("");
    lines.push("    /* 文字種 — 採用先で上書きしてよい。Mincho の webfont は同梱しない */");
    for (const entry of FONT_STACKS) {
        lines.push(declaration(entry.name, entry.value));
    }

    lines.push("");
    lines.push("    /* 密度の決まり（/docs/typography の「密度のルール」） */");
    for (const entry of DENSITY_TOKENS) {
        const comment = entry.px ? `${entry.px}px ${entry.note}` : entry.note;
        lines.push(declaration(entry.name, entry.value, comment));
    }

    return lines;
}

/** Every custom property name this module publishes. */
export function scaleTokenNames() {
    return [
        ...SPACING_STEPS,
        ...TEXT_STEPS,
        ...LEADING_STEPS,
        ...WEIGHT_STEPS,
        ...FONT_STACKS,
        ...DENSITY_TOKENS,
    ].map((entry) => entry.name);
}
