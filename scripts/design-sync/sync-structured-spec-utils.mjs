import { findNodeById, normalizePadding } from "./shared.mjs";

export function normalizeVariantKey(name) {
  if (!name || typeof name !== "string") return "unknown";
  const variant = name.includes("/") ? name.split("/").pop() : name;
  return variant.trim().toLowerCase().replace(/\s+/g, "-");
}

function normalizeStrokeThickness(strokeWidth) {
  if (typeof strokeWidth === "number") return strokeWidth;
  if (!strokeWidth || typeof strokeWidth !== "object") return null;

  const widths = [strokeWidth.top, strokeWidth.right, strokeWidth.bottom, strokeWidth.left]
    .filter((value) => typeof value === "number");
  if (widths.length === 0) return null;
  return widths.every((value) => value === widths[0]) ? widths[0] : null;
}

function normalizeStrokeAlignment(strokeAlignment) {
  if (strokeAlignment === "inner") return "inside";
  if (strokeAlignment === "center") return "center";
  if (strokeAlignment === "outer") return "outside";
  return strokeAlignment ?? null;
}

export function normalizeStroke(stroke, node = {}) {
  if (typeof stroke === "string" && stroke.length > 0) {
    return {
      align: normalizeStrokeAlignment(node.strokeAlignment),
      fill: stroke,
      thickness: normalizeStrokeThickness(node.strokeWidth),
    };
  }

  if (!stroke || typeof stroke !== "object") return null;

  if (stroke.type === "color") {
    return {
      align: normalizeStrokeAlignment(node.strokeAlignment),
      fill: stroke.color ?? null,
      thickness: normalizeStrokeThickness(node.strokeWidth),
    };
  }

  return {
    align: stroke.align ?? null,
    fill: stroke.fill ?? null,
    thickness: stroke.thickness ?? null,
  };
}

export function normalizeNodeType(type) {
  return type === "icon" ? "icon_font" : type ?? null;
}

export function normalizeIconFontFamily(node) {
  return node?.iconFontFamily ?? node?.library ?? null;
}

export function normalizeIconFontName(node) {
  return node?.iconFontName ?? node?.icon ?? null;
}

export function extractNodeSnapshot(node, { includeIconFontFields = false } = {}) {
  if (!node || typeof node !== "object") return null;

  const children = Array.isArray(node.children) ? node.children : [];

  const base = {
    id: node.id ?? null,
    type: normalizeNodeType(node.type),
    name: node.name ?? null,
    width: node.width ?? null,
    height: node.height ?? null,
    padding: normalizePadding(node.padding),
    gap: node.gap ?? null,
    cornerRadius: node.cornerRadius ?? null,
    fill: node.fill ?? null,
    stroke: normalizeStroke(node.stroke, node),
    justifyContent: node.justifyContent ?? null,
    alignItems: node.alignItems ?? null,
    fontSize: node.fontSize ?? null,
    fontWeight: node.fontWeight ?? null,
    content: node.content ?? null,
  };

  if (!includeIconFontFields) {
    return {
      ...base,
      textGrowth: node.textGrowth ?? null,
      children: children.map((child) => child?.id).filter(Boolean),
    };
  }

  return {
    ...base,
    iconFontFamily: normalizeIconFontFamily(node),
    iconFontName: normalizeIconFontName(node),
    textGrowth: node.textGrowth ?? null,
    children: children.map((child) => child?.id).filter(Boolean),
  };
}

export function extractVariants(
  variantsNode,
  { variantNodeTypes = ["frame", "icon_font", "icon"] } = {}
) {
  const children = Array.isArray(variantsNode?.children) ? variantsNode.children : [];
  const allowedTypes = new Set(variantNodeTypes);

  return children
    .filter((child) => allowedTypes.has(child?.type))
    .map((child) => ({
      id: child.id ?? null,
      name: child.name ?? null,
      key: normalizeVariantKey(child.name ?? ""),
      type: normalizeNodeType(child.type),
      width: child.width ?? null,
      height: child.height ?? null,
      padding: normalizePadding(child.padding),
      gap: child.gap ?? null,
      cornerRadius: child.cornerRadius ?? null,
      fill: child.fill ?? null,
      stroke: normalizeStroke(child.stroke, child),
      reusable: Boolean(child.reusable),
      children: Array.isArray(child.children)
        ? child.children.map((grandChild) => grandChild?.id).filter(Boolean)
        : [],
    }));
}

export function collectNodes(
  root,
  nodeIds = {},
  { includeIconFontFields = false } = {}
) {
  return Object.fromEntries(
    Object.entries(nodeIds ?? {}).map(([key, id]) => [
      key,
      extractNodeSnapshot(findNodeById(root, id), { includeIconFontFields }),
    ])
  );
}

function collectVariantChildIds(variants) {
  const values = [];
  for (const variant of variants) {
    if (!Array.isArray(variant?.children)) continue;
    for (const childId of variant.children) {
      if (typeof childId !== "string" || childId.length === 0) continue;
      if (!values.includes(childId)) {
        values.push(childId);
      }
    }
  }
  return values;
}

function collectNodeIdSet(nodesByKey) {
  return new Set(
    Object.values(nodesByKey)
      .filter((node) => node && typeof node === "object")
      .map((node) => node.id)
      .filter((id) => typeof id === "string" && id.length > 0)
  );
}

export function buildStructuredSpec({
  root,
  frameId,
  titleId,
  descId,
  variantsId,
  nodeIds,
  variantNodeTypes = ["frame", "icon_font", "icon"],
  includeIconFontFields = false,
  autoIncludeVariantChildrenNodes = false,
}) {
  const frame = findNodeById(root, frameId);
  const variantsNode = findNodeById(root, variantsId);

  if (!frame || !variantsNode) {
    return null;
  }

  const variants = extractVariants(variantsNode, { variantNodeTypes });
  const nodes = collectNodes(root, nodeIds, { includeIconFontFields });

  if (autoIncludeVariantChildrenNodes) {
    const existingNodeIds = collectNodeIdSet(nodes);
    for (const childId of collectVariantChildIds(variants)) {
      if (existingNodeIds.has(childId)) continue;
      const childSnapshot = extractNodeSnapshot(findNodeById(root, childId), {
        includeIconFontFields,
      });
      if (!childSnapshot) continue;
      nodes[childId] = childSnapshot;
      existingNodeIds.add(childId);
    }
  }

  return {
    frameId: frame.id ?? null,
    title: findNodeById(root, titleId)?.content ?? null,
    description: findNodeById(root, descId)?.content ?? null,
    variants,
    nodes,
  };
}
