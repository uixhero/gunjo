"use client"

import * as React from "react"
import ReactMarkdown, { type Options as ReactMarkdownOptions } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "../../lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table"
import { TextLink } from "../navigation/TextLink"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface MarkdownRendererProps {
    /** Markdown source text. */
    content: string
    /** Wrapper class. */
    className?: string
    /** Disable GFM (tables, task lists, strikethrough). Default false (GFM enabled). */
    disableGfm?: boolean
    /** Override or extend react-markdown components. */
    components?: ReactMarkdownOptions["components"]
}

const defaultMarkdownComponents: NonNullable<ReactMarkdownOptions["components"]> = {
    h1: ({ className, ...props }) => (
        <h1 className={cn("mb-4 mt-0 text-2xl font-bold tracking-tight text-foreground", className)} {...props} />
    ),
    h2: ({ className, ...props }) => (
        <h2 className={cn("mb-3 mt-6 border-b border-border/60 pb-2 text-xl font-semibold tracking-tight text-foreground", className)} {...props} />
    ),
    h3: ({ className, ...props }) => (
        <h3 className={cn("mb-2 mt-5 text-lg font-semibold tracking-tight text-foreground", className)} {...props} />
    ),
    p: ({ className, ...props }) => (
        <p className={cn("my-3 leading-7 text-foreground first:mt-0 last:mb-0", className)} {...props} />
    ),
    a: ({ className, ...props }) => (
        <TextLink className={className} {...props} />
    ),
    ul: ({ className, ...props }) => {
        const isTaskList = String(className ?? "").includes("contains-task-list")

        return (
            <ul
                className={cn(
                    "my-4 ml-5 list-disc space-y-1.5 text-foreground",
                    isTaskList && "ml-0 list-none space-y-2",
                    className
                )}
                {...props}
            />
        )
    },
    ol: ({ className, ...props }) => (
        <ol className={cn("my-4 ml-5 list-decimal space-y-1.5 text-foreground", className)} {...props} />
    ),
    li: ({ className, ...props }) => {
        const isTaskItem = String(className ?? "").includes("task-list-item")

        return (
            <li
                className={cn(
                    "pl-1 leading-7 text-foreground marker:text-muted-foreground",
                    isTaskItem && "list-none pl-0",
                    className
                )}
                {...props}
            />
        )
    },
    blockquote: ({ className, ...props }) => (
        <blockquote className={cn("my-4 border-l-2 border-primary-border pl-4 text-muted-foreground", className)} {...props} />
    ),
    hr: ({ className, ...props }) => (
        <hr className={cn("my-6 border-border/70", className)} {...props} />
    ),
    pre: ({ className, ...props }) => (
        <pre className={cn("my-4 overflow-auto rounded-md border border-border/70 bg-muted p-4 text-sm text-foreground", className)} {...props} />
    ),
    code: ({ className, ...props }) => (
        <code className={cn("rounded bg-muted px-1 py-0.5 font-mono text-sm text-foreground", className)} {...props} />
    ),
    table: ({ className, ...props }) => (
        <div className="my-4">
            <Table className={cn("min-w-[360px]", className)} {...props} />
        </div>
    ),
    thead: ({ className, ...props }) => (
        <TableHeader className={className} {...props} />
    ),
    tbody: ({ className, ...props }) => (
        <TableBody className={className} {...props} />
    ),
    tr: ({ className, ...props }) => (
        <TableRow className={className} {...props} />
    ),
    th: ({ className, ...props }) => (
        <TableHead className={cn("bg-muted/50", className)} {...props} />
    ),
    td: ({ className, ...props }) => (
        <TableCell className={className} {...props} />
    ),
    input: ({ className, checked, type, ...props }) => {
        if (type !== "checkbox") {
            return <input className={className} type={type} {...props} />
        }

        const tooltip = checked ? "Read-only completed task" : "Read-only pending task"

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="mr-2 inline-flex translate-y-0.5 cursor-default items-center justify-center" tabIndex={0}>
                        <input
                            aria-label={tooltip}
                            checked={Boolean(checked)}
                            className={cn("h-4 w-4 rounded border-border accent-foreground disabled:cursor-default disabled:opacity-100", className)}
                            disabled
                            readOnly
                            type="checkbox"
                            {...props}
                        />
                    </span>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
        )
    },
}

const MarkdownRenderer = React.forwardRef<HTMLDivElement, MarkdownRendererProps>(
    ({ content, className, disableGfm = false, components }, ref) => (
        <div
            ref={ref}
            className={cn(
                "max-w-none text-sm text-foreground",
                className
            )}
        >
            <ReactMarkdown
                remarkPlugins={disableGfm ? [] : [remarkGfm]}
                components={{ ...defaultMarkdownComponents, ...components }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
)
MarkdownRenderer.displayName = "MarkdownRenderer"

export { MarkdownRenderer }
