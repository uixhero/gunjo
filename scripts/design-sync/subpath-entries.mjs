// SSOT for the heavy-component subpath entries (#492).
//
// Each entry groups the components that pull one heavy runtime dependency.
// From 0.2.0 these components are exported ONLY from their subpath
// (`@gunjo/ui/table` etc.), never from the root barrel, and the dependency is
// an optional peer: an adopter that never imports the subpath never installs
// it, and a root `import { Button } from "@gunjo/ui"` never resolves it.
//
// Read by:
// - sync-public-exports.mjs   — keeps these components out of src/index.ts and
//                                writes src/entries/<name>.ts
// - sync-docs-pages.mjs        — scaffolds docs usage with the subpath import
// - design-verify-subpath-entries.mjs — checks package.json (exports / peers)
//                                and that nothing the root barrel reaches
//                                imports a peer listed here
//
// `components` are paths under src/components without the extension.
export const SUBPATH_ENTRIES = [
  {
    name: "table",
    peerDependencies: ["@tanstack/react-table"],
    components: ["display/DataTable", "display/ActionDataTable"],
    extraExports: ['export type { ColumnDef } from "@tanstack/react-table"'],
  },
  {
    name: "calendar",
    peerDependencies: ["react-day-picker"],
    components: ["inputs/DatePicker", "inputs/DateRangePicker", "inputs/Calendar"],
    extraExports: [],
  },
  {
    name: "drawer",
    peerDependencies: ["vaul"],
    components: ["overlay/Drawer"],
    extraExports: [],
  },
  {
    name: "carousel",
    peerDependencies: ["embla-carousel-react"],
    components: ["display/Carousel"],
    extraExports: [],
  },
  {
    name: "markdown",
    peerDependencies: ["react-markdown"],
    components: ["display/MarkdownRenderer"],
    extraExports: [],
  },
  {
    name: "motion",
    peerDependencies: ["framer-motion"],
    components: ["overlay/FloatingPanel"],
    extraExports: [],
  },
];

const ENTRY_BY_COMPONENT = new Map(
  SUBPATH_ENTRIES.flatMap((entry) => entry.components.map((component) => [component, entry]))
);

/** The subpath entry a component (`<category>/<FileName>`) belongs to, or null for root. */
export function getSubpathEntryForComponent(componentPath) {
  return ENTRY_BY_COMPONENT.get(componentPath) ?? null;
}

/** The package specifier adopters import a component from. */
export function getImportPathForComponent(componentPath) {
  const entry = getSubpathEntryForComponent(componentPath);
  return entry ? `@gunjo/ui/${entry.name}` : "@gunjo/ui";
}

export const OPTIONAL_PEER_DEPENDENCIES = [
  ...new Set(SUBPATH_ENTRIES.flatMap((entry) => entry.peerDependencies)),
];
