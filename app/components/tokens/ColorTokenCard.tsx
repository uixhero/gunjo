"use client";

import * as React from "react";
import { IconCheck as Check, IconCopy as Copy } from "@tabler/icons-react";
import { cn } from "@gunjo/ui";

export interface ColorTokenCardProps {
    name: string;
    cssVar: string;
    description?: string;
    /**
     * Tailwind background class to render the swatch (e.g. "bg-primary").
     * The card resolves the actual computed HSL/hex from the rendered element
     * at runtime so the displayed values follow the active theme.
     */
    swatchClass: string;
    /** Foreground swatch class for pairing demonstrations. */
    foregroundSwatchClass?: string;
    foregroundLabel?: string;
}

function rgbToHex(rgb: string): string {
    // "rgb(77, 90, 175)" or "rgba(77, 90, 175, 1)"
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

export function ColorTokenCard({
    name,
    cssVar,
    description,
    swatchClass,
    foregroundSwatchClass,
    foregroundLabel,
}: ColorTokenCardProps) {
    const swatchRef = React.useRef<HTMLDivElement>(null);
    const [hex, setHex] = React.useState<string>("");
    const [hsl, setHsl] = React.useState<string>("");
    const [copied, setCopied] = React.useState<"hex" | "hsl" | "var" | null>(null);
    const [failed, setFailed] = React.useState<"hex" | "hsl" | "var" | null>(null);

    React.useEffect(() => {
        const update = () => {
            const el = swatchRef.current;
            if (!el) return;
            const styles = getComputedStyle(el);
            const bg = styles.backgroundColor;
            if (bg) setHex(rgbToHex(bg));
            const cssRoot = getComputedStyle(document.documentElement);
            const raw = cssRoot.getPropertyValue(cssVar).trim();
            if (raw) setHsl(`hsl(${raw})`);
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
    }, [cssVar]);

    const copy = React.useCallback(
        async (value: string, kind: "hex" | "hsl" | "var") => {
            try {
                await writeClipboardText(value);
                setCopied(kind);
                setFailed(null);
                setTimeout(() => setCopied(null), 1500);
            } catch {
                setCopied(null);
                setFailed(kind);
                setTimeout(() => setFailed(null), 1800);
            }
        },
        []
    );

    const chipClasses = (active: boolean, isFailed = false) =>
        cn(
            "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] cursor-pointer transition-colors",
            active
                ? "border-primary-border bg-primary-subtle text-primary-subtle-foreground"
                : isFailed
                    ? "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground"
                : "border-border bg-muted/40 hover:bg-muted"
        );

    return (
        <div className="flex flex-col gap-2">
            <div
                ref={swatchRef}
                className={cn(
                    "relative h-24 w-full overflow-hidden rounded-md border border-border/40 shadow-sm",
                    swatchClass
                )}
            >
                {foregroundSwatchClass && (
                    <div
                        className={cn(
                            "absolute inset-x-3 inset-y-3 flex items-center justify-center rounded text-xs font-medium",
                            foregroundSwatchClass
                        )}
                    >
                        {foregroundLabel ?? "Aa"}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{name}</span>
                    <button
                        onClick={() => copy(cssVar, "var")}
                        className={cn(
                            "rounded px-1 font-mono text-xs cursor-pointer transition-colors",
                            copied === "var"
                                ? "bg-primary-subtle text-primary-subtle-foreground"
                                : failed === "var"
                                    ? "bg-destructive-subtle text-destructive-subtle-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Copy CSS variable"
                        aria-live="polite"
                    >
                        {copied === "var" ? "Copied" : failed === "var" ? "Copy failed" : cssVar}
                    </button>
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {hex && (
                        <button
                            onClick={() => copy(hex, "hex")}
                            className={cn(chipClasses(copied === "hex", failed === "hex"), "uppercase")}
                            title="Copy hex"
                            aria-live="polite"
                        >
                            {copied === "hex" ? (
                                <>
                                    <Check className="h-2.5 w-2.5" />
                                    Copied
                                </>
                            ) : failed === "hex" ? (
                                <>
                                    <Copy className="h-2.5 w-2.5" />
                                    Copy failed
                                </>
                            ) : (
                                <>
                                    <Copy className="h-2.5 w-2.5" />
                                    {hex}
                                </>
                            )}
                        </button>
                    )}
                    {hsl && (
                        <button
                            onClick={() => copy(hsl, "hsl")}
                            className={chipClasses(copied === "hsl", failed === "hsl")}
                            title="Copy HSL"
                            aria-live="polite"
                        >
                            {copied === "hsl" ? (
                                <>
                                    <Check className="h-2.5 w-2.5" />
                                    Copied
                                </>
                            ) : failed === "hsl" ? (
                                <>
                                    <Copy className="h-2.5 w-2.5" />
                                    Copy failed
                                </>
                            ) : (
                                <>
                                    <Copy className="h-2.5 w-2.5" />
                                    {hsl}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
