import type { DocContent, SectionLabels } from "./types";
import { contentEn, sectionLabelsEn } from "./en";
import { contentJa, sectionLabelsJa } from "./ja";
import type { Locale } from "@/lib/translations";

import inputsMetadata from "@design/inputs-metadata.json";
import displayMetadata from "@design/display-metadata.json";
import feedbackMetadata from "@design/feedback-metadata.json";
import navigationMetadata from "@design/navigation-metadata.json";
import overlayMetadata from "@design/overlay-metadata.json";
import layoutMetadata from "@design/layout-metadata.json";
import patternsMetadata from "@design/patterns-metadata.json";

type MetadataDocEntry = {
  title: string;
  description: string;
};

const COMPONENT_PAGE_PATTERN =
  /^(components\/(?:inputs|display|feedback|navigation|overlay|layout|patterns|templates))\/([^/]+)$/;
const COMPOSITE_METADATA_KEYS: Record<string, string[]> = {};

const metadataByCategory = {
  "components/inputs": inputsMetadata as Record<string, MetadataDocEntry>,
  "components/display": displayMetadata as Record<string, MetadataDocEntry>,
  "components/feedback": feedbackMetadata as Record<string, MetadataDocEntry>,
  "components/navigation": navigationMetadata as Record<string, MetadataDocEntry>,
  "components/overlay": overlayMetadata as Record<string, MetadataDocEntry>,
  "components/layout": layoutMetadata as Record<string, MetadataDocEntry>,
  "components/patterns": patternsMetadata as Record<string, MetadataDocEntry>,
  // Legacy "components/templates" path retained for back-compat with any
  // pre-migration page IDs still referenced in transitional content.
  "components/templates": patternsMetadata as Record<string, MetadataDocEntry>,
} as const;

function slugToKey(slug: string): string {
  return slug
    .split("-")
    .map((s, i) => (i === 0 ? s : s[0].toUpperCase() + s.slice(1)))
    .join("");
}

function isComponentPageId(pageId: string): boolean {
  return COMPONENT_PAGE_PATTERN.test(pageId);
}

function resolveMetadataKeys(pageId: string, category: string, slug: string): string[] {
  const compositeKeys = COMPOSITE_METADATA_KEYS[pageId];
  if (compositeKeys) return compositeKeys;

  const baseKey = slugToKey(slug);
  if (category === "components/templates" || category === "components/patterns") {
    return [`${baseKey}Template`];
  }
  return [baseKey];
}

function getFromMetadata(pageId: string): DocContent | undefined {
  const match = pageId.match(COMPONENT_PAGE_PATTERN);
  if (!match) return undefined;
  const [, category, slug] = match;
  const meta = metadataByCategory[category as keyof typeof metadataByCategory];
  if (!meta) return undefined;

  const entries = resolveMetadataKeys(pageId, category, slug)
    .map((key) => meta[key as keyof typeof meta])
    .filter((entry): entry is MetadataDocEntry => Boolean(entry));

  if (entries.length === 0) return undefined;
  if (entries.length === 1) {
    return { title: entries[0].title, description: entries[0].description };
  }

  return {
    title: entries.map((entry) => entry.title).join(" + "),
    description: entries.map((entry) => entry.description).join(" "),
  };
}

const contentByLocale: Record<Locale, Record<string, DocContent>> = {
  en: contentEn,
  ja: contentJa,
};

/**
 * Returns doc content for the given page and locale.
 * For "en", falls back to design metadata (functional categories: inputs/display/feedback/navigation/overlay/layout/patterns) when no entry exists.
 */
export function getDocContent(pageId: string, locale: Locale): DocContent | undefined {
  if (locale === "en" && isComponentPageId(pageId)) {
    const metadataContent = getFromMetadata(pageId);
    if (metadataContent) return metadataContent;
  }

  const direct = contentByLocale[locale][pageId];
  if (direct) return direct;

  if (isComponentPageId(pageId)) {
    return getFromMetadata(pageId);
  }

  if (locale === "en") return getFromMetadata(pageId);
  return undefined;
}

export function getSectionLabels(locale: Locale): SectionLabels {
  return locale === "ja" ? sectionLabelsJa : sectionLabelsEn;
}

export type { DocContent, SectionLabels };
export { contentEn, contentJa, sectionLabelsEn, sectionLabelsJa };
