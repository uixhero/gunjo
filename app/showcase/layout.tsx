import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = pageMetadata("/showcase");

export default function ShowcaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container py-10 md:py-12">
            <StructuredData path="/showcase" />
            {children}
        </div>
    );
}
