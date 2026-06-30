// Pass-through layout — each child route picks its own width treatment:
// - /cold-tests (list) uses `container py-10 md:py-12` inside its page
// - /cold-tests/[round] (detail) is full-bleed flex so the sidebar can
//   span the full viewport height (matches gunjo-test/app/gallery).
export default function ColdTestsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
