// Source-tier configs (functional taxonomy). All seven categories
// (Inputs/Display/Feedback/Navigation/Overlay/Layout/Patterns) are both
// the SSOT authoring tier and the user-facing docs taxonomy.
//
// Important: docsDir/hrefPrefix are FLAT — every component renders at
// `/docs/components/<slug>` and embeds at `/embed/<slug>` regardless of its
// source tier.
export const DOCS_COMPONENT_CATEGORY_CONFIGS = [
  {
    category: "patterns",
    sectionTitle: "Patterns",
    metadataPath: "design/patterns-metadata.json",
    specPath: "design/component-specs/patterns-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/patterns-metadata.json",
    metadataVarName: "patternsMetadata",
  },
  {
    category: "feedback",
    sectionTitle: "Feedback",
    metadataPath: "design/feedback-metadata.json",
    specPath: "design/component-specs/feedback-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/feedback-metadata.json",
    metadataVarName: "feedbackMetadata",
  },
  {
    category: "layout",
    sectionTitle: "Layout",
    metadataPath: "design/layout-metadata.json",
    specPath: "design/component-specs/layout-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/layout-metadata.json",
    metadataVarName: "layoutMetadata",
  },
  {
    category: "navigation",
    sectionTitle: "Navigation",
    metadataPath: "design/navigation-metadata.json",
    specPath: "design/component-specs/navigation-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/navigation-metadata.json",
    metadataVarName: "navigationMetadata",
  },
  {
    category: "overlay",
    sectionTitle: "Overlay",
    metadataPath: "design/overlay-metadata.json",
    specPath: "design/component-specs/overlay-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/overlay-metadata.json",
    metadataVarName: "overlayMetadata",
  },
  {
    category: "display",
    sectionTitle: "Display",
    metadataPath: "design/display-metadata.json",
    specPath: "design/component-specs/display-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/display-metadata.json",
    metadataVarName: "displayMetadata",
  },
  {
    category: "inputs",
    sectionTitle: "Inputs",
    metadataPath: "design/inputs-metadata.json",
    specPath: "design/component-specs/inputs-core.json",
    docsDir: "app/docs/components",
    hrefPrefix: "/docs/components",
    metadataImportPath: "@design/inputs-metadata.json",
    metadataVarName: "inputsMetadata",
  },
];

export const DOCS_COMPONENT_TITLE_OVERRIDES = {
  patterns: {
    authTemplate: "Authentication",
    mediaLibraryTemplate: "Media Library",
  },
};

export const DOCS_COMPONENT_COMPOSITES = {};

// Functional categorization — docs-only taxonomy. The order here is the
// order sections render in the sidebar / showcase tabs. Patterns covers
// what was previously the templates tier.
export const FUNCTIONAL_CATEGORY_ORDER = [
  "Inputs",
  "Display",
  "Charts",
  "Feedback",
  "Navigation",
  "Overlay",
  "Layout",
  "Patterns",
];

// Slug → functional category. Slug is the URL slug (kebab-case). Must
// cover every component across all four atomic tiers; the design-verify
// nav-coverage check will fail if a slug shows up in metadata but not
// here. New components: add an entry when authoring.
export const FUNCTIONAL_CATEGORY_OF_SLUG = {
  // Inputs
  button: "Inputs",
  "copy-button": "Inputs",
  "chat-composer": "Inputs",
  "chat-input": "Inputs",
  "tooltip-button": "Inputs",
  input: "Inputs",
  textarea: "Inputs",
  select: "Inputs",
  checkbox: "Inputs",
  "radio-group": "Inputs",
  switch: "Inputs",
  slider: "Inputs",
  "range-slider": "Inputs",
  "search-input": "Inputs",
  "number-input": "Inputs",
  "currency-input": "Inputs",
  "scan-input": "Inputs",
  "scan-gate": "Inputs",
  "password-input": "Inputs",
  "password-group": "Inputs",
  "password-requirement-list": "Inputs",
  "password-strength-meter": "Inputs",
  "phone-input": "Inputs",
  "postal-code-input": "Inputs",
  "input-otp": "Inputs",
  toggle: "Inputs",
  "toggle-group": "Inputs",
  label: "Inputs",
  combobox: "Inputs",
  calendar: "Inputs",
  "date-picker": "Inputs",
  "date-range-picker": "Inputs",
  "time-picker": "Inputs",
  "tag-input": "Inputs",
  form: "Inputs",
  "filter-button": "Inputs",
  "sort-button": "Inputs",
  "editable-field": "Inputs",
  mention: "Inputs",
  "file-uploader": "Inputs",

  // Display
  badge: "Display",
  icon: "Display",
  avatar: "Display",
  "chat-message": "Display",
  tag: "Display",
  code: "Display",
  kbd: "Display",
  img: "Display",
  "image-preview": "Display",
  "color-swatch": "Display",
  separator: "Display",
  spacer: "Display",
  "empty-state": "Display",
  skeleton: "Display",
  "tool-pill": "Display",
  card: "Display",
  "avatar-group": "Display",
  list: "Display",
  table: "Display",
  "data-table": "Display",
  "action-data-table": "Display",
  "editable-data-table": "Display",
  "approval-steps": "Display",
  "reveal-section": "Display",
  delta: "Display",
  meter: "Display",
  "route-stops": "Display",
  "reference-value": "Display",
  statistic: "Display",
  rating: "Display",
  "swatch-group": "Display",
  gallery: "Display",
  timeline: "Display",
  "tree-view": "Display",
  "file-tree": "Display",
  "code-block": "Display",
  "doc-note": "Display",
  "markdown-renderer": "Display",
  carousel: "Display",
  accordion: "Display",
  "accordion-group": "Display",
  "searchable-accordion": "Display",
  "asset-card": "Display",
  "asset-grid": "Display",
  "metadata-list": "Display",
  "tag-editor": "Display",

  // Charts
  "activity-timeline-card": "Charts",
  "analytics-card": "Charts",
  "bar-chart": "Charts",
  "chart-legend": "Charts",
  "choropleth-map": "Charts",
  "concentric-progress-card": "Charts",
  "donut-chart": "Charts",
  "distribution-bar": "Charts",
  "gauge-chart": "Charts",
  "heatmap-chart": "Charts",
  "labeled-donut-card": "Charts",
  "line-chart": "Charts",
  "mini-distribution-bar-card": "Charts",
  "quadrant-matrix": "Charts",
  "pie-chart": "Charts",
  "radial-bar-chart": "Charts",
  "radar-chart": "Charts",
  "retention-cohort-card": "Charts",
  "ribbon-chart": "Charts",
  "segment-timeline-card": "Charts",
  "segmented-gauge-card": "Charts",
  "sparkline-chart": "Charts",
  "stacked-bar-chart": "Charts",

  // Feedback
  alert: "Feedback",
  progress: "Feedback",
  spinner: "Feedback",
  banner: "Feedback",
  "safety-banner": "Feedback",
  toast: "Feedback",
  "toast-provider": "Feedback",
  "notification-center": "Feedback",
  "progress-widget": "Feedback",
  "status-bar": "Feedback",
  "status-screen": "Feedback",
  stepper: "Feedback",

  // Navigation
  "text-link": "Navigation",
  breadcrumb: "Navigation",
  tabs: "Navigation",
  pagination: "Navigation",
  "document-pager": "Navigation",
  "navigation-menu": "Navigation",
  sidebar: "Navigation",
  "sidebar-item": "Navigation",
  menubar: "Navigation",
  command: "Navigation",
  "app-rail": "Navigation",
  "right-rail": "Navigation",
  "page-aside": "Navigation",
  "command-palette": "Navigation",
  header: "Navigation",
  footer: "Navigation",

  // Overlay
  dialog: "Overlay",
  "alert-dialog": "Overlay",
  modal: "Overlay",
  sheet: "Overlay",
  drawer: "Overlay",
  popover: "Overlay",
  tooltip: "Overlay",
  "hover-card": "Overlay",
  "dropdown-menu": "Overlay",
  "context-menu": "Overlay",
  "chat-panel": "Overlay",
  "share-modal": "Overlay",
  "floating-panel": "Overlay",
  "onboarding-flow": "Overlay",
  "media-lightbox": "Overlay",
  "media-picker-dialog": "Overlay",

  // Layout
  container: "Layout",
  grid: "Layout",
  "h-stack": "Layout",
  "v-stack": "Layout",
  cluster: "Layout",
  "aspect-ratio": "Layout",
  "collapsible-panel-toggle": "Layout",
  "scroll-area": "Layout",
  "device-frame": "Layout",
  "marquee-frame": "Layout",
  resizable: "Layout",
  "inspector-panel": "Layout",
  "spatial-canvas": "Layout",
  "asset-inspector-panel": "Layout",

  // Patterns (formerly templates)
  auth: "Patterns",
  bannalyze: "Patterns",
  blog: "Patterns",
  chat: "Patterns",
  dashboard: "Patterns",
  docs: "Patterns",
  editor: "Patterns",
  error: "Patterns",
  kanban: "Patterns",
  landing: "Patterns",
  "media-library": "Patterns",
  "not-found": "Patterns",
  onboarding: "Patterns",
  pricing: "Patterns",
  "responsive-auth-card-pattern": "Patterns",
  settings: "Patterns",
};

export function functionalCategoryFor(slug) {
  return FUNCTIONAL_CATEGORY_OF_SLUG[slug] ?? null;
}

export function toSlug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function metadataKeyToBaseKey(category, metadataKey) {
  if (category === "patterns" && metadataKey.endsWith("Template")) {
    return metadataKey.slice(0, -1 * "Template".length);
  }
  return metadataKey;
}

export function metadataKeyToSlug(category, metadataKey) {
  return toSlug(metadataKeyToBaseKey(category, metadataKey));
}

export function metadataKeyToTitle(category, metadataKey) {
  const override = DOCS_COMPONENT_TITLE_OVERRIDES[category]?.[metadataKey];
  if (override) return override;

  const base = metadataKeyToBaseKey(category, metadataKey);
  return base.charAt(0).toUpperCase() + base.slice(1);
}
