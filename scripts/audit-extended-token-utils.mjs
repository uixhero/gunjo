import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CLASS_PREFIX = String.raw`(?:[a-z0-9_-]+:)*`;

const MOTION_TOKEN_PATTERN = new RegExp(
  String.raw`\b${CLASS_PREFIX}(?:animate-(?:none|spin|ping|pulse|bounce|accordion-down|accordion-up|in|out|fade-in|fade-out|zoom-in|zoom-out|slide-in-from-[\w-]+|slide-out-to-[\w-]+)|transition(?:-(?:none|all|colors|opacity|shadow|transform))?|duration-(?:75|100|150|200|300|500|700|1000)|delay-(?:75|100|150|200|300|500|700|1000)|ease-(?:linear|in|out|in-out))\b`,
  "g"
);
const MOTION_ARBITRARY_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:animate|transition|duration|delay|ease)-\[[^\]]+\]\b/g;
const LAYERING_TOKEN_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:z-(?:0|10|20|30|40|50|auto)|isolate|isolation-auto)\b/g;
const LAYERING_ARBITRARY_PATTERN = /\b(?:[a-z0-9_-]+:)*z-\[[^\]]+\]\b/g;
const OVERLAY_POSITION_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:fixed|absolute|relative|sticky)\b/g;
const OPACITY_TOKEN_PATTERN =
  /\b(?:[a-z0-9_-]+:)*opacity-(?:0|5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100)\b/g;
const OPACITY_ARBITRARY_PATTERN = /\b(?:[a-z0-9_-]+:)*opacity-\[[^\]]+\]\b/g;
const BORDER_WIDTH_TOKEN_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:border(?!-)|border-(?:0|2|4|8)|border-[xytrbl](?:-(?:0|2|4|8))?|divide-[xy](?:-(?:0|2|4|8))?|ring(?!-)|ring-(?:0|1|2|4|8))\b/g;
const BORDER_WIDTH_ARBITRARY_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:border|border-[xytrbl]|divide-[xy]|ring)-\[[^\]]+\]\b/g;
const BREAKPOINT_PATTERN = /\b(?:sm|md|lg|xl|2xl):[^\s"'`<>]+/g;
const CONTAINER_SIZING_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:container|max-w-(?:none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|screen|min|max|fit|prose)|min-w-(?:0|full|min|max|fit)|w-(?:auto|full|screen|min|max|fit)|h-(?:auto|full|screen|min|max|fit|svh|lvh|dvh))\b/g;
const CONTAINER_SIZING_ARBITRARY_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:w|h|min-w|max-w|min-h|max-h)-\[[^\]]+\]\b/g;
const ICON_SIZE_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:h|w|size)-(?:2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16)\b/g;
const DENSITY_TOKEN_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:h|size|min-h)-(?:5|6|7|8|9|10|11|12|14|16)\b|\b(?:[a-z0-9_-]+:)*(?:px|py)-(?:1|1\.5|2|2\.5|3|3\.5|4|5|6)\b/g;
const DENSITY_ARBITRARY_PATTERN =
  /\b(?:[a-z0-9_-]+:)*(?:h|size|min-h|px|py)-\[[^\]]+\]\b/g;

const INLINE_STYLE_BLOCK_PATTERN = /style=\{\{([\s\S]*?)\}\}/g;
const INLINE_MOTION_PATTERN =
  /\b(?:animation|animationDuration|animationTimingFunction|transition|transitionDuration|transitionTimingFunction)\s*:\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[0-9.]+)/g;
const INLINE_LAYERING_PATTERN =
  /\b(?:zIndex|position)\s*:\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[0-9.]+)/g;
const INLINE_OPACITY_PATTERN = /\bopacity\s*:\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[0-9.]+)/g;
const INLINE_BORDER_PATTERN =
  /\b(?:borderWidth|borderTopWidth|borderRightWidth|borderBottomWidth|borderLeftWidth)\s*:\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[0-9.]+)/g;
const INLINE_CONTAINER_PATTERN =
  /\b(?:width|height|minWidth|maxWidth|minHeight|maxHeight)\s*:\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[0-9.]+)/g;

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

export function collectExtendedTokenUsage(source) {
  const inlineStyleBlocks = [...source.matchAll(INLINE_STYLE_BLOCK_PATTERN)]
    .map((match) => match[1])
    .join("\n");

  return {
    motion: unique(source.match(MOTION_TOKEN_PATTERN) ?? []),
    motionArbitrary: unique(source.match(MOTION_ARBITRARY_PATTERN) ?? []),
    layering: unique(source.match(LAYERING_TOKEN_PATTERN) ?? []),
    layeringArbitrary: unique(source.match(LAYERING_ARBITRARY_PATTERN) ?? []),
    overlayPosition: unique(source.match(OVERLAY_POSITION_PATTERN) ?? []),
    opacity: unique(source.match(OPACITY_TOKEN_PATTERN) ?? []),
    opacityArbitrary: unique(source.match(OPACITY_ARBITRARY_PATTERN) ?? []),
    borderWidth: unique(source.match(BORDER_WIDTH_TOKEN_PATTERN) ?? []),
    borderWidthArbitrary: unique(source.match(BORDER_WIDTH_ARBITRARY_PATTERN) ?? []),
    breakpoints: unique(source.match(BREAKPOINT_PATTERN) ?? []),
    containerSizing: unique(source.match(CONTAINER_SIZING_PATTERN) ?? []),
    containerSizingArbitrary: unique(source.match(CONTAINER_SIZING_ARBITRARY_PATTERN) ?? []),
    iconSize: unique(source.match(ICON_SIZE_PATTERN) ?? []),
    density: unique(source.match(DENSITY_TOKEN_PATTERN) ?? []),
    densityArbitrary: unique(source.match(DENSITY_ARBITRARY_PATTERN) ?? []),
    inlineMotion: unique(inlineStyleBlocks.match(INLINE_MOTION_PATTERN) ?? []),
    inlineLayering: unique(inlineStyleBlocks.match(INLINE_LAYERING_PATTERN) ?? []),
    inlineOpacity: unique(inlineStyleBlocks.match(INLINE_OPACITY_PATTERN) ?? []),
    inlineBorderWidth: unique(inlineStyleBlocks.match(INLINE_BORDER_PATTERN) ?? []),
    inlineContainerSizing: unique(inlineStyleBlocks.match(INLINE_CONTAINER_PATTERN) ?? []),
  };
}

export function mergeExtendedTokenUsage(usages) {
  return {
    motion: unique(usages.flatMap((usage) => usage.motion)),
    motionArbitrary: unique(usages.flatMap((usage) => usage.motionArbitrary)),
    layering: unique(usages.flatMap((usage) => usage.layering)),
    layeringArbitrary: unique(usages.flatMap((usage) => usage.layeringArbitrary)),
    overlayPosition: unique(usages.flatMap((usage) => usage.overlayPosition)),
    opacity: unique(usages.flatMap((usage) => usage.opacity)),
    opacityArbitrary: unique(usages.flatMap((usage) => usage.opacityArbitrary)),
    borderWidth: unique(usages.flatMap((usage) => usage.borderWidth)),
    borderWidthArbitrary: unique(usages.flatMap((usage) => usage.borderWidthArbitrary)),
    breakpoints: unique(usages.flatMap((usage) => usage.breakpoints)),
    containerSizing: unique(usages.flatMap((usage) => usage.containerSizing)),
    containerSizingArbitrary: unique(usages.flatMap((usage) => usage.containerSizingArbitrary)),
    iconSize: unique(usages.flatMap((usage) => usage.iconSize)),
    density: unique(usages.flatMap((usage) => usage.density)),
    densityArbitrary: unique(usages.flatMap((usage) => usage.densityArbitrary)),
    inlineMotion: unique(usages.flatMap((usage) => usage.inlineMotion)),
    inlineLayering: unique(usages.flatMap((usage) => usage.inlineLayering)),
    inlineOpacity: unique(usages.flatMap((usage) => usage.inlineOpacity)),
    inlineBorderWidth: unique(usages.flatMap((usage) => usage.inlineBorderWidth)),
    inlineContainerSizing: unique(usages.flatMap((usage) => usage.inlineContainerSizing)),
  };
}

export function needsExtendedTokenReview(item) {
  return (
    item.usage.motionArbitrary.length > 0 ||
    item.usage.layeringArbitrary.length > 0 ||
    item.usage.opacityArbitrary.length > 0 ||
    item.usage.borderWidthArbitrary.length > 0 ||
    item.usage.containerSizingArbitrary.length > 0 ||
    item.usage.densityArbitrary.length > 0 ||
    item.usage.inlineMotion.length > 0 ||
    item.usage.inlineBorderWidth.length > 0
  );
}
