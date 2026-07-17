// Subpath entry: `@gunjo/ui/markdown` (#492 Phase 1)
//
// Isolates `react-markdown`. Non-breaking: also still exported from the root
// barrel in 0.1.x. Phase 2 (0.2.0) removes it from root and makes
// `react-markdown` an optional peer.
export * from "../components/display/MarkdownRenderer"
