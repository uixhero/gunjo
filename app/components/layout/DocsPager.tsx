"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { navigation } from "@/lib/navigation"
import { DocumentPager } from "@gunjo/ui"
import { SHOWCASE_THUMB_SLUGS } from "@/lib/thumbnail-manifest"
import { useLocale } from "@/components/providers/LocaleProvider"
import { getDocContent } from "@/lib/docs-content"
import { findSourceCategory } from "@/lib/component-spec-builder"

type DocsNavItem = (typeof navigation)[number]["items"][number]

function pageIdFromHref(href: string): string {
    const parts = href.split("/").filter(Boolean)
    if (parts[0] === "docs" && parts[1] === "components" && parts[2]) {
        return `components/${parts[2]}`
    }
    if (parts[0] === "docs" && parts[1]) {
        return parts[1]
    }
    return href.replace(/^\//, "")
}

function slugFromHref(href: string): string {
    const parts = href.split("/").filter(Boolean)
    return parts.at(-1) ?? "docs"
}

function kebabToCamel(slug: string): string {
    return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

function getPageDescription(href: string, locale: "ja" | "en") {
    const pageId = pageIdFromHref(href)
    const direct = getDocContent(pageId, locale)?.description
    if (direct) return direct

    const parts = href.split("/").filter(Boolean)
    if (parts[0] !== "docs" || parts[1] !== "components" || !parts[2]) {
        return undefined
    }

    const slug = parts[2]
    const sourceCategory = findSourceCategory(kebabToCamel(slug))
    if (!sourceCategory) return undefined
    return getDocContent(`components/${sourceCategory}/${slug}`, locale)?.description
}

function findSectionTitle(item: DocsNavItem | null) {
    if (!item || !("href" in item)) return null
    const section = navigation.find((group) =>
        group.items.some((candidate) => "href" in candidate && candidate.href === item.href)
    )
    return section?.title ?? null
}

function useShowcaseThumbMode() {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    const { resolvedTheme } = useTheme()
    return mounted && resolvedTheme === "light" ? "light" : "dark"
}

export function DocsPager() {
    const pathname = usePathname()
    const { bilingual, locale } = useLocale()
    const thumbMode = useShowcaseThumbMode()

    // Flatten navigation items in the same order the sidebar renders.
    // Each section is in source-defined order (alphabetical for component
    // sections, thematic for Tokens) — flattening in section order keeps
    // prev/next visually aligned with what the user sees in the sidebar.
    const links = navigation.map((section) => section.items).flat()
    const index = links.findIndex((link) => link.href === pathname)

    if (index === -1) {
        return null
    }

    const prev = index > 0 ? links[index - 1] : null
    const next = index < links.length - 1 ? links[index + 1] : null

    return (
        <DocumentPager
            className="pb-10"
            aria-label={locale === "ja" ? "前後のドキュメント" : "Previous and next documentation"}
            linkComponent={Link}
            previous={prev && "href" in prev ? toDocumentPagerItem({
                item: prev,
                direction: "previous",
                locale,
                bilingual,
                thumbMode,
            }) : null}
            next={next && "href" in next ? toDocumentPagerItem({
                item: next,
                direction: "next",
                locale,
                bilingual,
                thumbMode,
            }) : null}
        />
    )
}

function toDocumentPagerItem({
    item,
    direction,
    locale,
    bilingual,
    thumbMode,
}: {
    item: DocsNavItem
    direction: "previous" | "next"
    locale: "ja" | "en"
    bilingual: ReturnType<typeof useLocale>["bilingual"]
    thumbMode: "light" | "dark"
}) {
    if (!("href" in item)) return null

    const title = bilingual(item.title)
    const description = getPageDescription(item.href, locale)
    const slug = slugFromHref(item.href)
    const directionLabel =
        direction === "previous"
            ? locale === "ja" ? "前へ" : "Previous"
            : locale === "ja" ? "次へ" : "Next"
    const sectionTitle = findSectionTitle(item)
    const section = sectionTitle ? bilingual(sectionTitle).primary : null

    // Only point at a thumbnail that actually exists. Token / guideline /
    // intro pages have no showcase thumbnail; requesting one 404s (the pager
    // simply renders no thumbnail box when src is omitted).
    const hasThumb = SHOWCASE_THUMB_SLUGS.has(slug)

    return {
        href: item.href,
        directionLabel,
        title: title.primary,
        subtitle: title.secondary !== title.primary ? title.secondary : undefined,
        description,
        categoryLabel: section,
        thumbnailSrc: hasThumb
            ? `/showcase-thumbs/${slug}.${thumbMode}.png`
            : undefined,
        thumbnailAlt: `${title.primary} preview`,
        thumbnailFallback: locale === "ja" ? "プレビュー" : "Preview",
        ariaLabel: `${directionLabel}: ${title.primary}`,
    }
}
