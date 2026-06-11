import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const TYPOGRAPHY_CLASS_PATTERN =
  /\b(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-(?:sans|serif|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|leading-(?:none|tight|snug|normal|relaxed|loose|[3-9]|10)|tracking-(?:tighter|tight|normal|wide|wider|widest))\b/g;
const TYPOGRAPHY_ARBITRARY_PATTERN = /\b(?:text|font|leading|tracking)-\[[^\]]+\]\b/g;
const SPACING_CLASS_PATTERN =
  /\b(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|size|w|h|min-w|max-w|min-h|max-h)-(?:auto|px|0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|full|screen|min|max|fit|svh|lvh|dvh|vw|vh|[1-9]\/(?:2|3|4|5|6|12))\b/g;
const SPACING_ARBITRARY_PATTERN =
  /\b(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|size|w|h|min-w|max-w|min-h|max-h)-\[[^\]]+\]\b/g;
const RADIUS_CLASS_PATTERN =
  /\brounded(?:-(?:none|sm|md|lg|xl|2xl|3xl|full|t|r|b|l|tl|tr|br|bl|s|e|ss|se|ee|es))?(?:-(?:none|sm|md|lg|xl|2xl|3xl|full))?\b/g;
const RADIUS_ARBITRARY_PATTERN =
  /\brounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|ee|es))?-\[[^\]]+\]\b/g;
const SHADOW_CLASS_PATTERN =
  /\b(?:shadow(?:-(?:sm|md|lg|xl|2xl|inner|none))?|drop-shadow(?:-(?:sm|md|lg|xl|2xl|none))?)\b/g;
const SHADOW_ARBITRARY_PATTERN = /\b(?:shadow|drop-shadow)-\[[^\]]+\]\b/g;
const INLINE_FOUNDATION_LITERAL_PATTERN =
  /\b(?:fontSize|fontWeight|lineHeight|letterSpacing|padding|padding(?:Top|Right|Bottom|Left)|margin|margin(?:Top|Right|Bottom|Left)|gap|rowGap|columnGap|borderRadius|boxShadow|width|height|minWidth|maxWidth|minHeight|maxHeight)\s*:\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[0-9.]+)/g;
const INLINE_STYLE_BLOCK_PATTERN = /style=\{\{([\s\S]*?)\}\}/g;
const INTRINSIC_GEOMETRY_STYLE_PATTERN =
  /^(?:width|height|minWidth|maxWidth|minHeight|maxHeight|gap|rowGap|columnGap)\s*:/;

export function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function escapeCell(value) {
  const text = Array.isArray(value) ? value.join("<br>") : `${value}`;
  if (!text) return "-";
  return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

export function listSourceFiles(rootDir) {
  if (!existsSync(rootDir)) return [];

  const files = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "generated") continue;
      const absolutePath = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }
      if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) files.push(absolutePath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

export function collectFoundationUsage(source) {
  const inlineStyleBlocks = [...source.matchAll(INLINE_STYLE_BLOCK_PATTERN)]
    .map((match) => match[1])
    .join("\n");
  const inlineFoundation = unique(inlineStyleBlocks.match(INLINE_FOUNDATION_LITERAL_PATTERN) ?? []);
  const inlineGeometry = inlineFoundation.filter((fragment) =>
    INTRINSIC_GEOMETRY_STYLE_PATTERN.test(fragment)
  );
  const inlineReview = inlineFoundation.filter(
    (fragment) => !INTRINSIC_GEOMETRY_STYLE_PATTERN.test(fragment)
  );

  return {
    typography: unique(source.match(TYPOGRAPHY_CLASS_PATTERN) ?? []),
    typographyArbitrary: unique(source.match(TYPOGRAPHY_ARBITRARY_PATTERN) ?? []),
    spacing: unique(source.match(SPACING_CLASS_PATTERN) ?? []),
    spacingArbitrary: unique(source.match(SPACING_ARBITRARY_PATTERN) ?? []),
    radius: unique(source.match(RADIUS_CLASS_PATTERN) ?? []),
    radiusArbitrary: unique(source.match(RADIUS_ARBITRARY_PATTERN) ?? []),
    shadow: unique(source.match(SHADOW_CLASS_PATTERN) ?? []),
    shadowArbitrary: unique(source.match(SHADOW_ARBITRARY_PATTERN) ?? []),
    inlineGeometry: unique(inlineGeometry),
    inlineReview: unique(inlineReview),
  };
}

export function mergeFoundationUsage(usages) {
  return {
    typography: unique(usages.flatMap((usage) => usage.typography)),
    typographyArbitrary: unique(usages.flatMap((usage) => usage.typographyArbitrary)),
    spacing: unique(usages.flatMap((usage) => usage.spacing)),
    spacingArbitrary: unique(usages.flatMap((usage) => usage.spacingArbitrary)),
    radius: unique(usages.flatMap((usage) => usage.radius)),
    radiusArbitrary: unique(usages.flatMap((usage) => usage.radiusArbitrary)),
    shadow: unique(usages.flatMap((usage) => usage.shadow)),
    shadowArbitrary: unique(usages.flatMap((usage) => usage.shadowArbitrary)),
    inlineGeometry: unique(usages.flatMap((usage) => usage.inlineGeometry)),
    inlineReview: unique(usages.flatMap((usage) => usage.inlineReview)),
  };
}

export function needsFoundationReview(item) {
  return (
    item.usage.typographyArbitrary.length > 0 ||
    item.usage.spacingArbitrary.length > 0 ||
    item.usage.radiusArbitrary.length > 0 ||
    item.usage.shadowArbitrary.length > 0 ||
    item.usage.inlineReview.length > 0
  );
}
