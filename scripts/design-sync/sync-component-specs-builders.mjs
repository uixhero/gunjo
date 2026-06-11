import { findNodeById, normalizePadding } from "./shared.mjs";
import { normalizeStroke, normalizeVariantKey } from "./sync-structured-spec-utils.mjs";

function extractTextSpec(node) {
  if (!Array.isArray(node?.children)) return null;
  const textNode = node.children.find((child) => child?.type === "text");
  if (!textNode) return null;
  return {
    id: textNode.id ?? null,
    content: textNode.content ?? "",
    fontSize: textNode.fontSize ?? null,
    fontWeight: textNode.fontWeight ?? null,
    fill: textNode.fill ?? null,
    underline: Boolean(textNode.underline),
  };
}

function extractTextSpecs(node) {
  if (!Array.isArray(node?.children)) return [];
  return node.children
    .filter((child) => child?.type === "text")
    .map((textNode) => ({
      id: textNode.id ?? null,
      content: textNode.content ?? "",
      fontSize: textNode.fontSize ?? null,
      fontWeight: textNode.fontWeight ?? null,
      fill: textNode.fill ?? null,
      underline: Boolean(textNode.underline),
    }));
}

function extractVariants(variantsNode) {
  const children = Array.isArray(variantsNode?.children) ? variantsNode.children : [];
  return children
    .filter((child) => child?.type === "frame" || child?.type === "icon_font")
    .map((child) => ({
      id: child.id ?? null,
      name: child.name ?? null,
      key: normalizeVariantKey(child.name ?? ""),
      type: child.type ?? null,
      width: child.width ?? null,
      height: child.height ?? null,
      padding: normalizePadding(child.padding),
      gap: child.gap ?? null,
      cornerRadius: child.cornerRadius ?? null,
      fill: child.fill ?? null,
      stroke: normalizeStroke(child.stroke),
      iconFontFamily: child.iconFontFamily ?? null,
      iconFontName: child.iconFontName ?? null,
      text: extractTextSpec(child),
      texts: extractTextSpecs(child),
      reusable: Boolean(child.reusable),
    }));
}

export function buildComponentSpec({ root, frameId, titleId, descId, variantsId }) {
  const frame = findNodeById(root, frameId);
  const variantsNode = findNodeById(root, variantsId);

  if (!frame || !variantsNode) {
    return null;
  }

  return {
    frameId: frame.id ?? null,
    title: findNodeById(root, titleId)?.content ?? null,
    description: findNodeById(root, descId)?.content ?? null,
    variants: extractVariants(variantsNode),
  };
}

export function buildTextSampleSpec({ root, frameId, titleId, descId, sampleTextId }) {
  const frame = findNodeById(root, frameId);
  const sampleText = findNodeById(root, sampleTextId);
  if (!frame || !sampleText) {
    return null;
  }

  return {
    frameId: frame.id ?? null,
    title: findNodeById(root, titleId)?.content ?? null,
    description: findNodeById(root, descId)?.content ?? null,
    sampleText: {
      id: sampleText.id ?? null,
      content: sampleText.content ?? "",
      fontSize: sampleText.fontSize ?? null,
      fontWeight: sampleText.fontWeight ?? null,
      fill: sampleText.fill ?? null,
    },
  };
}
