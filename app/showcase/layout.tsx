export default function ShowcaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="container py-10 md:py-12">{children}</div>;
}
