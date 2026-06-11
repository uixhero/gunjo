"use client";

import * as React from "react";
import { componentManifest, Select } from "@gunjo/ui";
import { ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Category } from "@/lib/component-spec-builder";

interface ComponentControlsProps {
    /** camelCase component key (e.g. "button"). */
    componentKey: string;
    /** Functional category (e.g. "inputs"). */
    category: Category;
    /** Render the live preview given the currently-selected variant. */
    renderPreview: (variant: string) => React.ReactNode;
    /** Render a code snippet given the currently-selected variant. */
    renderCode: (variant: string) => string;
    /**
     * Override label for the variant axis (e.g. "Sort direction" instead of
     * the default "Variant"). Optional.
     */
    variantLabel?: string;
    /**
     * Hide the controls and render the default-variant preview only. Use
     * when a component has bespoke demos that don't compose cleanly via a
     * single variant prop. Falls back to this automatically when the
     * component has zero or one variant key.
     */
    disabled?: boolean;
}

interface ManifestEntry {
    variantKeys?: readonly string[];
    defaultVariantKey?: string | null;
}

function readManifestEntry(
    category: Category,
    componentKey: string
): ManifestEntry | null {
    const manifest = componentManifest as Record<string, Record<string, ManifestEntry>>;
    const bucket = manifest[category];
    if (!bucket) return null;
    return bucket[componentKey] ?? null;
}

export function ComponentControls({
    componentKey,
    category,
    renderPreview,
    renderCode,
    variantLabel,
    disabled = false,
}: ComponentControlsProps) {
    const entry = readManifestEntry(category, componentKey);
    const variantKeys = entry?.variantKeys ?? [];
    const defaultKey =
        entry?.defaultVariantKey ?? variantKeys[0] ?? "default";

    const [selected, setSelected] = React.useState<string>(defaultKey);
    const { locale } = useLocale();
    const label = variantLabel ?? (locale === "ja" ? "バリアント" : "Variant");

    // Reset selection when the component key changes (rare in static docs but
    // safe under HMR).
    React.useEffect(() => {
        setSelected(defaultKey);
    }, [defaultKey]);

    const showControls = !disabled && variantKeys.length > 1;
    const activeVariant = showControls ? selected : defaultKey;
    const codeText = renderCode(activeVariant);

    return (
        <div className="space-y-3" data-component-controls={componentKey}>
            {showControls ? (
                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">
                            {label}
                        </span>
                        <Select
                            value={selected}
                            onChange={(e) => setSelected(e.currentTarget.value)}
                            className="h-8 w-[180px]"
                        >
                            {variantKeys.map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </Select>
                    </label>
                </div>
            ) : null}
            <ComponentPreview
                code={codeText}
                codeBlock={<CodeBlock code={codeText} />}
            >
                {renderPreview(activeVariant)}
            </ComponentPreview>
        </div>
    );
}
