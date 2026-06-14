"use client";

import * as React from "react";
import {
    IconCheck as Check,
    IconCopy as Copy,
    IconPalette as Palette,
    IconRotate as RotateCcw,
} from "@tabler/icons-react";
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Slider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import {
    useThemeOverrides,
    type ThemeOverrides,
} from "@/components/providers/ThemeOverridesProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

const HUE_PRESETS: { hue: number; label: string }[] = [
    { hue: 220, label: "Blue" },
    { hue: 217, label: "Blue" },
    { hue: 142, label: "Green" },
    { hue: 24, label: "Orange" },
    { hue: 0, label: "Red" },
    { hue: 280, label: "Purple" },
    { hue: 340, label: "Pink" },
];

const RADIUS_PRESETS: { value: string; label: string }[] = [
    { value: "0rem", label: "0" },
    { value: "0.25rem", label: "Sm" },
    { value: "0.5rem", label: "Md" },
    { value: "0.75rem", label: "Lg" },
    { value: "1rem", label: "Xl" },
];

const FONT_PRESETS: { value: number; label: string }[] = [
    { value: 14, label: "Sm" },
    { value: 16, label: "Base" },
    { value: 18, label: "Lg" },
];

function isOverrideActive(overrides: ThemeOverrides): boolean {
    return (
        overrides.primaryHue !== null ||
        overrides.radius !== null ||
        overrides.fontScale !== null
    );
}

export function ThemeSwitcher() {
    const { overrides, setOverride, reset, cssSnippet } = useThemeOverrides();
    const { tooltip, themeSwitcher: strings } = useLocale();
    const [copied, setCopied] = React.useState(false);
    const active = isOverrideActive(overrides);

    const handleCopy = React.useCallback(async () => {
        try {
            await navigator.clipboard.writeText(cssSnippet);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard write blocked — surface nothing rather than crash.
        }
    }, [cssSnippet]);

    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 px-0 relative"
                            aria-label={tooltip("themeSwitcher")}
                        >
                            <Palette className="h-[1.2rem] w-[1.2rem]" />
                            {active ? (
                                <span
                                    className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span className="sr-only">
                                {tooltip("themeSwitcher")}
                            </span>
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>{tooltip("themeSwitcher")}</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                            {strings.heading}
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={reset}
                            disabled={!active}
                            className="h-7 gap-1 text-xs"
                        >
                            <RotateCcw className="h-3 w-3" />
                            {strings.reset}
                        </Button>
                    </div>

                    {/* Hue */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">
                                {strings.primaryColor}
                            </span>
                            <span className="font-mono text-muted-foreground">
                                {overrides.primaryHue ?? "default"}
                                {overrides.primaryHue !== null ? "°" : ""}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {HUE_PRESETS.map((preset) => {
                                const isActive = overrides.primaryHue === preset.hue;
                                return (
                                    <button
                                        key={preset.hue}
                                        type="button"
                                        onClick={() =>
                                            setOverride("primaryHue", preset.hue)
                                        }
                                        className={`h-7 w-7 rounded-full border-2 transition-all hover:scale-110 ${
                                            isActive
                                                ? "border-foreground"
                                                : "border-transparent"
                                        }`}
                                        style={
                                            {
                                                "--gunjo-swatch-hue": String(preset.hue),
                                                backgroundColor:
                                                    "hsl(var(--gunjo-swatch-hue) 62% 49%)",
                                            } as React.CSSProperties
                                        }
                                        aria-label={preset.label}
                                        title={preset.label}
                                    />
                                );
                            })}
                        </div>
                        <Slider
                            value={overrides.primaryHue ?? 220}
                            onChange={(e) =>
                                setOverride(
                                    "primaryHue",
                                    Number(e.currentTarget.value)
                                )
                            }
                            min={0}
                            max={359}
                            step={1}
                            className="mt-1"
                        />
                    </div>

                    {/* Radius */}
                    <div className="space-y-2">
                        <span className="block text-xs font-medium">
                            {strings.radius}
                        </span>
                        <div className="grid grid-cols-5 gap-1">
                            {RADIUS_PRESETS.map((preset) => {
                                const isActive = overrides.radius === preset.value;
                                return (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() =>
                                            setOverride("radius", preset.value)
                                        }
                                        className={`h-8 border text-[11px] font-medium transition-colors ${
                                            isActive
                                                ? "border-foreground bg-foreground/5"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                        style={{ borderRadius: preset.value }}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Font scale */}
                    <div className="space-y-2">
                        <span className="block text-xs font-medium">
                            {strings.fontScale}
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                            {FONT_PRESETS.map((preset) => {
                                const isActive = overrides.fontScale === preset.value;
                                return (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() =>
                                            setOverride("fontScale", preset.value)
                                        }
                                        className={`h-8 rounded border text-xs font-medium transition-colors ${
                                            isActive
                                                ? "border-foreground bg-foreground/5"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Export CSS */}
                    <div className="space-y-2 border-t border-border/40 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">
                                {strings.exportLabel}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                disabled={!active}
                                className="h-7 gap-1 text-xs"
                            >
                                {copied ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                                {copied
                                    ? strings.copied
                                    : strings.copy}
                            </Button>
                        </div>
                        <pre className="overflow-x-auto rounded border border-border/40 bg-muted/20 p-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                            {cssSnippet}
                        </pre>
                        <p className="text-[10px] text-muted-foreground">
                            {strings.exportHint}
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
