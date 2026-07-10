import { navigation } from "./navigation";

/**
 * Component-catalog categories — the same set the Showcase grid renders. The
 * headline component count is derived from the (generated) navigation so the
 * number stays in one place instead of being hardcoded across the homepage,
 * intro, and showcase, where the figures had drifted apart (159 / 153 / 150).
 */
const CATALOG_CATEGORIES = new Set<string>([
    "Inputs",
    "Display",
    "Charts",
    "Feedback",
    "Navigation",
    "Overlay",
    "Layout",
]);

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
export const COMPONENT_COUNT = navigation
    .filter((section) => CATALOG_CATEGORIES.has(section.title))
    .flatMap((section) => section.items)
    .filter(
        (item) =>
            item.href.startsWith("/docs/components/") &&
            // exclude category overview landing pages (mirrors the showcase grid)
            !item.title.endsWith("Overview")
    ).length;
