import { navigation } from "./navigation";

/**
 * Component-catalog categories, in the order the Showcase grid renders them.
 * The headline component count is derived from the (generated) navigation so
 * the number stays in one place instead of being hardcoded across the
 * homepage, intro, and showcase, where the figures had drifted apart
 * (159 / 153 / 150).
 */
export const CATALOG_CATEGORIES = [
    "Inputs",
    "Display",
    "Charts",
    "Feedback",
    "Navigation",
    "Overlay",
    "Layout",
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];

export interface CatalogComponent {
    category: CatalogCategory;
    title: string;
    href: string;
}

const CATALOG_CATEGORY_SET = new Set<string>(CATALOG_CATEGORIES);

/**
 * Every documented component in the catalog, in navigation order. The
 * Showcase grid and COMPONENT_COUNT both read this list, so the grid and every
 * exact count on the site come from the same filter.
 *
 * Page templates (the "patterns" bucket of the component manifest) are not
 * counted: /api/specs/manifest lists them too, which is why its `count` is
 * larger than COMPONENT_COUNT.
 */
export const CATALOG_COMPONENTS: readonly CatalogComponent[] = navigation
    .filter((section) => CATALOG_CATEGORY_SET.has(section.title))
    .flatMap((section) =>
        section.items
            .filter(
                (item) =>
                    // Component pages live under /docs/components/<slug>; skip
                    // external pattern-app links (which navigation also includes).
                    item.href.startsWith("/docs/components/") &&
                    // Category overview pages (e.g. "Inputs Overview") are
                    // sidebar landing pages, not individual components.
                    !item.title.endsWith("Overview")
            )
            .map((item) => ({
                category: section.title as CatalogCategory,
                title: item.title,
                href: item.href,
            }))
    );

/**
 * Exact number of documented components shown in the catalog.
 *
 * AUTO-UPDATES: this figure is derived from `navigation`, which is generated
 * by `npm run design:sync` from the .pen metadata. Add a component (and sync)
 * and the homepage stats + showcase reflect it automatically — no edit here.
 *
 * MANUAL: the rounded prose figure "200+" used in marketing copy
 * (app/lib/translations.ts hero/intro/designer strings, app/lib/docs-content/*)
 * is hand-written. Only bump it when COMPONENT_COUNT crosses a round threshold
 * (e.g. past 200). Keep prose ("200+") ≤ the exact figure so they never conflict.
 */
export const COMPONENT_COUNT = CATALOG_COMPONENTS.length;
