"use client";

import { MarkdownRenderer } from "@gunjo/ui";

export function SpecMarkdown({ content }: { content: string }) {
    return (
        <MarkdownRenderer
            content={content}
            className="text-base leading-7 text-foreground"
            components={{
                h1: ({ children }) => (
                    <h1 className="scroll-m-20 mt-12 mb-4 text-3xl font-bold tracking-tight first:mt-0">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="scroll-m-20 mt-10 mb-4 border-b border-border/40 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="scroll-m-20 mt-8 mb-3 text-xl font-semibold tracking-tight">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="scroll-m-20 mt-6 mb-2 text-lg font-semibold tracking-tight">
                        {children}
                    </h4>
                ),
                p: ({ children }) => (
                    <p className="leading-7 [&:not(:first-child)]:mt-5">{children}</p>
                ),
                ul: ({ children }) => (
                    <ul className="my-5 ml-6 list-disc [&>li]:mt-2">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="my-5 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="mt-5 border-l-2 border-primary-border pl-4 italic text-muted-foreground">
                        {children}
                    </blockquote>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {children}
                    </a>
                ),
                hr: () => <hr className="my-10 border-border/40" />,
                pre: ({ children }) => (
                    <pre className="my-5 overflow-auto rounded-lg border border-border/40 bg-muted p-4 text-sm">
                        {children}
                    </pre>
                ),
                code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                    return (
                        <code
                            className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                table: ({ children }) => (
                    <div className="my-5 overflow-x-auto">
                        <table className="w-full border-collapse text-sm">{children}</table>
                    </div>
                ),
                th: ({ children }) => (
                    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border border-border px-3 py-2">{children}</td>
                ),
            }}
        />
    );
}
