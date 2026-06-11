"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
    code: string;
    language?: string;
}

const codeBlockClassName =
    "min-w-0 max-w-full overflow-hidden rounded-md [&>pre]:!m-0 [&>pre]:w-full [&>pre]:max-w-full [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed [&>pre>code]:inline-block [&>pre>code]:min-w-full";

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
    const [html, setHtml] = useState<string>("");

    useEffect(() => {
        codeToHtml(code, {
            lang: language,
            theme: "github-dark",
        }).then(setHtml);
    }, [code, language]);

    if (!html) {
        return <div className={codeBlockClassName}>Loading...</div>;
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} className={codeBlockClassName} />;
}
