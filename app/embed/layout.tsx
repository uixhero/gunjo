import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { TooltipProvider } from "@gunjo/ui";
import { EmbedPreviewFrame } from "./EmbedPreviewFrame";

export default function EmbedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <LocaleProvider>
                <TooltipProvider delayDuration={300}>
                    <div className="min-h-screen bg-background text-foreground">
                        <Suspense fallback={<div className="min-h-screen bg-background" />}>
                            <EmbedPreviewFrame>{children}</EmbedPreviewFrame>
                        </Suspense>
                    </div>
                    {/* Hide the Next.js dev-tools floating widget when this page
                        is rendered for visual previews (showcase / patterns
                        grids). It still appears on the standalone /embed pages
                        if anyone visits them directly — that's fine. */}
                    <style>{`nextjs-portal { display: none !important; }`}</style>
                </TooltipProvider>
            </LocaleProvider>
        </ThemeProvider>
    );
}
