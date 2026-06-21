const TAILWIND_SPACE_BY_PX = new Map([
  [0, "0"],
  [2, "0.5"],
  [4, "1"],
  [6, "1.5"],
  [8, "2"],
  [10, "2.5"],
  [12, "3"],
  [14, "3.5"],
  [16, "4"],
  [20, "5"],
  [24, "6"],
  [28, "7"],
  [32, "8"],
  [36, "9"],
  [40, "10"],
  [44, "11"],
  [48, "12"],
  [56, "14"],
  [64, "16"],
  [72, "18"],
  [80, "20"],
  [96, "24"],
]);

const TAILWIND_RADIUS_BY_PX = new Map([
  [0, "rounded-none"],
  [2, "rounded-sm"],
  [4, "rounded"],
  [6, "rounded-md"],
  [8, "rounded-lg"],
  [12, "rounded-xl"],
  [16, "rounded-2xl"],
  [24, "rounded-3xl"],
  [9999, "rounded-full"],
]);

const TAILWIND_TEXT_SIZE_BY_PX = new Map([
  [12, "text-xs"],
  [14, "text-sm"],
  [16, "text-base"],
  [18, "text-lg"],
  [20, "text-xl"],
  [24, "text-2xl"],
  [30, "text-3xl"],
  [36, "text-4xl"],
  [48, "text-5xl"],
]);

const TAILWIND_FONT_WEIGHT_BY_VALUE = new Map([
  ["100", "font-thin"],
  ["200", "font-extralight"],
  ["300", "font-light"],
  ["400", "font-normal"],
  ["500", "font-medium"],
  ["600", "font-semibold"],
  ["700", "font-bold"],
  ["800", "font-extrabold"],
  ["900", "font-black"],
  ["normal", "font-normal"],
  ["bold", "font-bold"],
]);

function uniqueValues(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))];
}

function toTailwindSpaceToken(px) {
  if (typeof px !== "number" || !Number.isFinite(px)) return null;
  if (TAILWIND_SPACE_BY_PX.has(px)) return TAILWIND_SPACE_BY_PX.get(px);
  if (px < 0) return null;
  return `[${px}px]`;
}

function toSpacingClass(prefix, px) {
  const token = toTailwindSpaceToken(px);
  if (!token) return null;
  return `${prefix}-${token}`;
}

function toSizeClass(prefix, value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const token = toTailwindSpaceToken(value);
    if (!token) return null;
    return `${prefix}-${token}`;
  }

  if (typeof value === "string") {
    if (value.startsWith("fit_content")) return `${prefix}-fit`;
    if (value.startsWith("fill_container")) return `${prefix}-full`;
  }

  return null;
}

function buildPaddingClasses(padding) {
  if (!Array.isArray(padding) || padding.length !== 4) return [];
  const [top, right, bottom, left] = padding;
  if ([top, right, bottom, left].some((value) => typeof value !== "number")) return [];

  if (top === right && right === bottom && bottom === left) {
    const allClass = toSpacingClass("p", top);
    return allClass ? [allClass] : [];
  }

  const classes = [];
  if (top === bottom) {
    const pyClass = toSpacingClass("py", top);
    if (pyClass) classes.push(pyClass);
  } else {
    const ptClass = toSpacingClass("pt", top);
    const pbClass = toSpacingClass("pb", bottom);
    if (ptClass) classes.push(ptClass);
    if (pbClass) classes.push(pbClass);
  }

  if (right === left) {
    const pxClass = toSpacingClass("px", right);
    if (pxClass) classes.push(pxClass);
  } else {
    const prClass = toSpacingClass("pr", right);
    const plClass = toSpacingClass("pl", left);
    if (prClass) classes.push(prClass);
    if (plClass) classes.push(plClass);
  }

  return classes;
}

function toRadiusClass(cornerRadius) {
  if (typeof cornerRadius !== "number" || !Number.isFinite(cornerRadius)) return null;
  if (TAILWIND_RADIUS_BY_PX.has(cornerRadius)) return TAILWIND_RADIUS_BY_PX.get(cornerRadius);
  if (cornerRadius < 0) return null;
  return `rounded-[${cornerRadius}px]`;
}

function toBorderClass(thickness) {
  if (typeof thickness !== "number" || !Number.isFinite(thickness) || thickness <= 0) return null;
  if (thickness === 1) return "border";
  return `border-[${thickness}px]`;
}

function toTextSizeClass(fontSize) {
  if (typeof fontSize !== "number" || !Number.isFinite(fontSize)) return null;
  if (TAILWIND_TEXT_SIZE_BY_PX.has(fontSize)) return TAILWIND_TEXT_SIZE_BY_PX.get(fontSize);
  if (fontSize <= 0) return null;
  return `text-[${fontSize}px]`;
}

function toFontWeightClass(fontWeight) {
  if (fontWeight == null) return null;
  const normalized = String(fontWeight).trim().toLowerCase();
  if (normalized.length === 0) return null;
  return TAILWIND_FONT_WEIGHT_BY_VALUE.get(normalized) ?? null;
}

function buildLayoutClasses(variantSpec) {
  if (!variantSpec || typeof variantSpec !== "object") return [];

  const classes = [];
  const hasChildren = Array.isArray(variantSpec.children) && variantSpec.children.length > 0;
  const hasText = Boolean(variantSpec.text);
  const hasGap = typeof variantSpec.gap === "number" && Number.isFinite(variantSpec.gap) && variantSpec.gap > 0;

  if (hasChildren) {
    const layout =
      variantSpec.layout ??
      (variantSpec.alignItems || variantSpec.justifyContent ? "horizontal" : null);
    if (layout === "vertical") {
      classes.push("flex", "flex-col");
    } else if (layout === "horizontal") {
      classes.push("flex", "flex-row");
    } else {
      classes.push("flex");
    }
  } else if (hasGap || hasText) {
    classes.push("inline-flex");
  }

  if (hasGap || hasText) {
    classes.push("items-center");
  }

  return classes;
}

export function buildColorHint(variantSpec) {
  if (!variantSpec || typeof variantSpec !== "object") return "";

  const hints = [];
  if (typeof variantSpec.fill === "string" && variantSpec.fill.length > 0) {
    hints.push(`fill=${variantSpec.fill}`);
  }
  if (typeof variantSpec?.stroke?.fill === "string" && variantSpec.stroke.fill.length > 0) {
    const thickness =
      typeof variantSpec.stroke.thickness === "number" ? `@${variantSpec.stroke.thickness}px` : "";
    hints.push(`stroke=${variantSpec.stroke.fill}${thickness}`);
  }
  if (typeof variantSpec?.text?.fill === "string" && variantSpec.text.fill.length > 0) {
    hints.push(`text=${variantSpec.text.fill}`);
  }

  return hints.join(" | ");
}

export function extractSlotIds(variantSpec) {
  if (!Array.isArray(variantSpec?.children)) return [];
  return uniqueValues(
    variantSpec.children.filter((value) => typeof value === "string" && value.length > 0)
  );
}

export function buildVariantClasses(variantSpec) {
  if (!variantSpec || typeof variantSpec !== "object") return "";

  const classes = [...buildLayoutClasses(variantSpec)];
  const widthClass = toSizeClass("w", variantSpec.width);
  const heightClass = toSizeClass("h", variantSpec.height);
  if (widthClass) classes.push(widthClass);
  if (heightClass) classes.push(heightClass);

  classes.push(...buildPaddingClasses(variantSpec.padding));

  const gapClass = toSpacingClass("gap", variantSpec.gap);
  if (gapClass) classes.push(gapClass);

  const radiusClass = toRadiusClass(variantSpec.cornerRadius);
  if (radiusClass) classes.push(radiusClass);

  const borderClass = toBorderClass(variantSpec?.stroke?.thickness);
  if (borderClass) classes.push(borderClass);

  if (variantSpec.fill === "transparent") {
    classes.push("bg-transparent");
  }

  const textSizeClass = toTextSizeClass(variantSpec?.text?.fontSize);
  const fontWeightClass = toFontWeightClass(variantSpec?.text?.fontWeight);
  if (textSizeClass) classes.push(textSizeClass);
  if (fontWeightClass) classes.push(fontWeightClass);
  if (variantSpec?.text?.underline) {
    classes.push("underline");
  }

  return uniqueValues(classes).join(" ");
}
