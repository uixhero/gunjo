// Subpath entry: `@gunjo/ui/motion` (#492 Phase 1)
//
// Isolates `framer-motion` (currently FloatingPanel). Non-breaking: also still
// exported from the root barrel in 0.1.x. Phase 2 (0.2.0) removes it from root
// and makes `framer-motion` an optional peer.
export * from "../components/overlay/FloatingPanel"
