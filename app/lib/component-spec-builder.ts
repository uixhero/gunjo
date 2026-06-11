import { componentManifest, componentStyleHints } from "@gunjo/ui";

export type Category =
    | "inputs"
    | "display"
    | "feedback"
    | "navigation"
    | "overlay"
    | "layout"
    | "patterns";

const ALL_CATEGORIES: Category[] = [
    "inputs",
    "display",
    "feedback",
    "navigation",
    "overlay",
    "layout",
    "patterns",
];

export interface ComponentSpec {
    category: Category;
    name: string;
    title: string;
    description: string | null;
    variants: {
        keys: string[];
        default: string | null;
    };
    styling: {
        baseClasses: string | null;
        baseColorHint: string | null;
        perVariant: Array<{
            key: string;
            classes: string | null;
            colorHint: string | null;
        }>;
    };
    slots: string[];
    sourceFile: string;
    specSource: string;
    docsUrl: string;
}

export type StabilityLevel = "stable" | "beta" | "experimental";

type ManifestBucket = Record<
    string,
    {
        title: string | null;
        description: string | null;
        variantKeys: readonly string[];
        defaultVariantKey: string | null;
        sourceFile: string;
        stability?: StabilityLevel;
        specSource: string;
    }
>;

type StyleBucket = Record<
    string,
    {
        baseClasses: string | null;
        baseColorHint: string | null;
        slotIds: readonly string[];
        variantClasses: Record<string, string>;
        variantColorHints: Record<string, string>;
    }
>;

const manifestByCategory = componentManifest as Record<Category, ManifestBucket>;
const stylesByCategory = componentStyleHints as Record<Category, StyleBucket>;

export function buildComponentSpec(
    category: Category,
    name: string,
    docsBaseUrl = "https://gunjo.dev"
): ComponentSpec | null {
    const meta = manifestByCategory[category]?.[name];
    if (!meta) return null;
    const style = stylesByCategory[category]?.[name];
    return {
        category,
        name,
        title: meta.title ?? name,
        description: meta.description,
        variants: {
            keys: [...meta.variantKeys],
            default: meta.defaultVariantKey,
        },
        styling: {
            baseClasses: style?.baseClasses ?? null,
            baseColorHint: style?.baseColorHint ?? null,
            perVariant: meta.variantKeys.map((key) => ({
                key,
                classes: style?.variantClasses?.[key] ?? null,
                colorHint: style?.variantColorHints?.[key] ?? null,
            })),
        },
        slots: style?.slotIds ? [...style.slotIds] : [],
        sourceFile: meta.sourceFile,
        specSource: meta.specSource,
        docsUrl: `${docsBaseUrl}/docs/components/${camelToKebab(name)}`,
    };
}

export function buildAllSpecs(docsBaseUrl?: string): ComponentSpec[] {
    const out: ComponentSpec[] = [];
    for (const category of ALL_CATEGORIES) {
        const bucket = manifestByCategory[category];
        if (!bucket) continue;
        for (const name of Object.keys(bucket)) {
            const spec = buildComponentSpec(category, name, docsBaseUrl);
            if (spec) out.push(spec);
        }
    }
    return out;
}

/**
 * Locate which functional source tier owns a given camelCase component name.
 * Returns null if no tier has a matching manifest entry. Used by the docs
 * URL pipeline (flat at /docs/components/<slug>) to recover the source tier
 * needed to look up the spec.
 */
/**
 * Look up a component's stability level from the manifest. Falls back to
 * "experimental" for entries missing the field — the SSOT default for any
 * component not explicitly classified in design/stability.json.
 */
export function findStability(name: string): StabilityLevel {
    for (const category of ALL_CATEGORIES) {
        const entry = manifestByCategory[category]?.[name];
        if (entry) return entry.stability ?? "experimental";
    }
    return "experimental";
}

export function findSourceCategory(name: string): Category | null {
    for (const category of ALL_CATEGORIES) {
        if (manifestByCategory[category]?.[name]) return category;
    }
    return null;
}

export function specToMarkdown(spec: ComponentSpec): string {
    const lines: string[] = [];
    lines.push(`# ${spec.title}`);
    lines.push("");
    lines.push(`**Package**: \`@gunjo/ui\``);
    lines.push(`**Category**: ${spec.category}`);
    if (spec.description) {
        lines.push("");
        lines.push("## Description");
        lines.push(spec.description);
    }
    if (spec.variants.keys.length > 0) {
        lines.push("");
        lines.push("## Variants");
        lines.push(
            `Default: \`${spec.variants.default ?? spec.variants.keys[0]}\``
        );
        for (const v of spec.styling.perVariant) {
            lines.push("");
            lines.push(`### \`${v.key}\``);
            if (v.classes) lines.push(`Classes: \`${v.classes}\``);
            if (v.colorHint) lines.push(`Colors: ${v.colorHint}`);
        }
    }
    if (spec.slots.length > 0) {
        lines.push("");
        lines.push("## Slots");
        for (const s of spec.slots) lines.push(`- \`${s}\``);
    }
    lines.push("");
    lines.push("## How to use with AI");
    lines.push(
        `Paste this entire spec into v0, Cursor, or Claude and ask: "Use the GunjoUI ${spec.title} component to build [your screen]." The spec gives the AI exact variant keys and Tailwind class signatures to compose against.`
    );
    lines.push("");
    lines.push("## Source");
    lines.push(`- Component: \`${spec.sourceFile}\``);
    lines.push(`- Design spec: \`${spec.specSource}\``);
    lines.push(`- Docs: ${spec.docsUrl}`);
    return lines.join("\n");
}

export function camelToKebab(input: string): string {
    return input.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
