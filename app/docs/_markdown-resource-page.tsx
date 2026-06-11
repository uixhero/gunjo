import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MarkdownRenderer } from "@gunjo/ui";

const internalMarkdownRoutes: Record<string, string> = {
    "adoption.md": "/docs/adoption",
    "adoption-strategy.md": "/docs/adoption-strategy",
    "migration-playbook.md": "/docs/migration-playbook",
    "dependencies.md": "/docs/dependencies",
    "versioning.md": "/docs/versioning",
    "component-addition.md": "/docs/component-addition",
    "CHANGELOG.md": "/docs/changelog",
    "DESIGN.md": "/docs/tokens/spec",
};

function rewriteInternalMarkdownLinks(content: string) {
    return content.replace(/\]\(([^)\s]+)(#[^)]+)?\)/g, (match, href: string, hash = "") => {
        const filename = href.split("/").pop();
        if (!filename) return match;

        const route = internalMarkdownRoutes[filename];
        if (!route) return match;

        return `](${route}${hash})`;
    });
}

function stripTopLevelHeading(content: string) {
    return content.replace(/^# .*(?:\r?\n)+/, "");
}

export interface MarkdownResourcePageProps {
    filePath: string;
    title: string;
    description: string;
}

export function MarkdownResourcePage({
    filePath,
    title,
    description,
}: MarkdownResourcePageProps) {
    const fullPath = join(process.cwd(), filePath);
    let content = "";

    try {
        content = readFileSync(fullPath, "utf8");
    } catch {
        content = "_Document source was not found._";
    }

    const body = rewriteInternalMarkdownLinks(stripTopLevelHeading(content));

    return (
        <article className="space-y-8">
            <header className="space-y-4 border-b border-border/40 pb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Docs resource
                </p>
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </header>
            <MarkdownRenderer
                content={body}
                className="text-base leading-7"
            />
        </article>
    );
}
