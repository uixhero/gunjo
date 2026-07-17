// Subpath entry: `@gunjo/ui/table` (#492 Phase 1)
//
// Groups the components that pull `@tanstack/react-table` so adopters can import
// them narrowly without the root barrel resolving the heavy dep. Non-breaking:
// these are ALSO still exported from the root barrel in 0.1.x. Phase 2 (0.2.0)
// removes them from root and makes `@tanstack/react-table` an optional peer.
export * from "../components/display/DataTable"
export * from "../components/display/ActionDataTable"
export type { ColumnDef } from "@tanstack/react-table"
