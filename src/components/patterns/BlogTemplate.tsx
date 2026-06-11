import * as React from "react"

import { cn } from "../../lib/utils"

export interface BlogTemplateProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    category?: React.ReactNode
    title: React.ReactNode
    /** Author / read time / date row. */
    meta?: React.ReactNode
    hero?: React.ReactNode
}

const BlogTemplate = React.forwardRef<HTMLElement, BlogTemplateProps>(
    (
        { className, category, title, meta, hero, children, ...props },
        ref
    ) => (
        <article
            ref={ref}
            className={cn("mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12", className)}
            {...props}
        >
            {category ? (
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {category}
                </p>
            ) : null}
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
            {meta ? (
                <div className="text-sm text-muted-foreground">{meta}</div>
            ) : null}
            {hero ? (
                <div className="overflow-hidden rounded-lg border border-border">
                    {hero}
                </div>
            ) : null}
            <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground">
                {children}
            </div>
        </article>
    )
)
BlogTemplate.displayName = "BlogTemplate"

export { BlogTemplate }
