import { navigation } from "@/lib/navigation";

export const DOCS_SIDEBAR_REVEAL_EVENT = "gunjo-docs-sidebar-reveal";

export type DocsNavigationSection = (typeof navigation)[number];
export type DocsNavigationItem = DocsNavigationSection["items"][number];

export function findDocsNavigationEntry(pathname: string | null | undefined) {
    if (!pathname) {
        return null;
    }

    for (const section of navigation) {
        const item = section.items.find((candidate) => candidate.href === pathname);
        if (item) {
            return { section, item };
        }
    }

    return null;
}

export function getDocsSectionLandingHref(section: DocsNavigationSection) {
    const sameTitleItem = section.items.find((item) => item.title === section.title);
    if (sameTitleItem) {
        return sameTitleItem.href;
    }

    const overviewItem = section.items.find(
        (item) => item.title === `${section.title} Overview`
    );
    return overviewItem?.href ?? null;
}

export function isDocsSectionLandingItem(
    section: DocsNavigationSection,
    item: DocsNavigationItem
) {
    return getDocsSectionLandingHref(section) === item.href;
}

export function isDocsNavigationSectionActive(
    section: DocsNavigationSection,
    pathname: string | null | undefined
) {
    if (!pathname) {
        return false;
    }

    return section.items.some((item) => item.href === pathname);
}
