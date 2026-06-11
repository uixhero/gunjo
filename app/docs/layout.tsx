import Script from "next/script";
import { DocsShell } from "@/components/layout/DocsShell";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {process.env.NODE_ENV === "development" ? (
                <Script
                    src="https://mcp.figma.com/mcp/html-to-design/capture.js"
                    strategy="afterInteractive"
                />
            ) : null}
            <DocsShell>{children}</DocsShell>
        </>
    );
}
