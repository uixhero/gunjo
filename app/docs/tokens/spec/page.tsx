import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import {
    IconExternalLink as ExternalLink,
    IconFileText as FileText,
} from "@tabler/icons-react";
import { SpecMarkdown } from "@/components/tokens/SpecMarkdown";

export default function DesignSpecPage() {
    const designPath = join(process.cwd(), "DESIGN.md");
    let body = "";
    try {
        body = readFileSync(designPath, "utf-8");
    } catch {
        body = "_DESIGN.md not found at the project root._";
    }

    return (
        <div className="space-y-8">
            <header className="space-y-4 border-b border-border/40 pb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Tokens · Spec
                </p>
                <h1 className="text-4xl font-bold tracking-tight">DESIGN.md</h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    The canonical design specification for GunjoUI. Authored for
                    AI tools (v0, Cursor, Claude, Figma Make) so the same spec
                    that humans read is the spec AI consumes.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                        href="https://github.com/uixhero/gunjo/blob/main/DESIGN.md"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        <FileText className="h-3.5 w-3.5" />
                        View on GitHub
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            </header>
            <SpecMarkdown content={body} />
        </div>
    );
}
