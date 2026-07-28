import * as React from "react"

import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar"
import { Badge } from "./Badge"
import { Button } from "../inputs/Button"

export interface CommentAuthor {
    name: React.ReactNode
    /**
     * The author's org unit — requesting department, group, role, "site
     * supervisor". A business thread is between two *sides*, so who someone
     * speaks for is part of reading the thread. (#714)
     */
    affiliation?: React.ReactNode
    /** Optional avatar image. Falls back to the first character of `name`. */
    avatarSrc?: string
    /** Alt text for `avatarSrc`. Decorative (empty) when omitted. */
    avatarAlt?: string
}

export interface CommentItem {
    id: string
    author: CommentAuthor
    /** The comment body. Plain text, or rich content. */
    body: React.ReactNode
    /**
     * Display timestamp. Pass a **preformatted string** so server and client
     * render the same thing — this component never formats dates.
     */
    timestamp?: React.ReactNode
    /**
     * Resolution state. **Omit** for a comment that carries no resolution
     * concept (an announcement, a system note) — no badge, no toggle.
     */
    resolved?: boolean
    /** Replies hanging off this comment. One level; replies of replies are flattened by the caller. */
    replies?: CommentItem[]
    /** Trailing slot on the comment header — an extra badge, a link, a menu. */
    trailing?: React.ReactNode
}

export interface CommentThreadLabels {
    /** Badge on a resolved comment. Default "Resolved". */
    resolved: string
    /** Badge on an unresolved comment. Default "Open". */
    unresolved: string
    /** Button that resolves an open comment. Default "Resolve". */
    markResolved: string
    /** Button that reopens a resolved comment. Default "Reopen". */
    markUnresolved: string
    /** Button that starts a reply. Default "Reply". */
    reply: string
    /** Accessible name of the replies list. Default "Replies". */
    replies: string
}

const defaultLabels: CommentThreadLabels = {
    resolved: "Resolved",
    unresolved: "Open",
    markResolved: "Resolve",
    markUnresolved: "Reopen",
    reply: "Reply",
    replies: "Replies",
}

export interface CommentThreadProps extends React.HTMLAttributes<HTMLDivElement> {
    comments: CommentItem[]
    /**
     * Heading level for each comment's author line. Default `4` — a thread
     * normally sits inside a card whose title is an `h3`. Posts get real
     * headings so screen-reader users can move between them, which is the
     * thing a hand-rolled thread always drops. (#714)
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6
    /** Hide the body and replies of resolved comments, leaving the header. Caller-controlled. */
    collapseResolved?: boolean
    /** Called when a comment's resolution is toggled. Omit to hide the toggle. */
    onResolvedChange?: (id: string, resolved: boolean) => void
    /** Called when reply is pressed. Omit to hide the reply button. */
    onReply?: (id: string) => void
    /** Rendered instead of the list when `comments` is empty. */
    emptyState?: React.ReactNode
    /** Accessible name for the thread region. */
    label?: string
    /** Built-in strings. English by default — pass a translated set for other locales. */
    labels?: Partial<CommentThreadLabels>
}

function initialOf(name: React.ReactNode): string {
    return typeof name === "string" && name.length > 0 ? name.slice(0, 1) : ""
}

interface CommentProps {
    comment: CommentItem
    depth: 0 | 1
    headingLevel: 2 | 3 | 4 | 5 | 6
    collapseResolved: boolean
    onResolvedChange?: (id: string, resolved: boolean) => void
    onReply?: (id: string) => void
    labels: CommentThreadLabels
}

function Comment({
    comment,
    depth,
    headingLevel,
    collapseResolved,
    onResolvedChange,
    onReply,
    labels,
}: CommentProps) {
    const Heading = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6"
    const hasResolution = comment.resolved !== undefined
    const isResolved = comment.resolved === true
    const collapsed = collapseResolved && isResolved
    const replies = comment.replies ?? []

    return (
        <li className="min-w-0" data-slot="comment" data-resolved={hasResolution ? isResolved : undefined}>
            <article
                className={cn(
                    "flex min-w-0 gap-3 py-3",
                    isResolved && "opacity-70",
                )}
            >
                <Avatar className={cn("mt-0.5 shrink-0", depth === 1 ? "size-6" : "size-8")}>
                    {comment.author.avatarSrc != null ? (
                        <AvatarImage src={comment.author.avatarSrc} alt={comment.author.avatarAlt ?? ""} />
                    ) : null}
                    <AvatarFallback>{initialOf(comment.author.name)}</AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <Heading className="text-sm font-medium text-foreground">{comment.author.name}</Heading>
                        {comment.author.affiliation != null ? (
                            <span className="truncate text-xs text-muted-foreground">
                                {comment.author.affiliation}
                            </span>
                        ) : null}
                        {comment.timestamp != null ? (
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        ) : null}
                        {hasResolution ? (
                            <Badge variant={isResolved ? "success" : "warning"}>
                                {isResolved ? labels.resolved : labels.unresolved}
                            </Badge>
                        ) : null}
                        {comment.trailing != null ? (
                            <span className="ms-auto shrink-0">{comment.trailing}</span>
                        ) : null}
                    </div>

                    {!collapsed ? (
                        <div className="text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
                            {comment.body}
                        </div>
                    ) : null}

                    {onReply != null || (hasResolution && onResolvedChange != null) ? (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            {onReply != null ? (
                                <Button variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
                                    {labels.reply}
                                </Button>
                            ) : null}
                            {hasResolution && onResolvedChange != null ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-pressed={isResolved}
                                    onClick={() => onResolvedChange(comment.id, !isResolved)}
                                >
                                    {isResolved ? labels.markUnresolved : labels.markResolved}
                                </Button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </article>

            {!collapsed && replies.length > 0 ? (
                <ol
                    role="list"
                    aria-label={labels.replies}
                    className="ms-4 border-s border-border ps-4"
                >
                    {replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            depth={1}
                            headingLevel={headingLevel}
                            collapseResolved={collapseResolved}
                            onResolvedChange={onResolvedChange}
                            onReply={onReply}
                            labels={labels}
                        />
                    ))}
                </ol>
            ) : null}
        </li>
    )
}

/**
 * A business comment thread: chronological posts carrying **who wrote it and
 * which side they speak for**, hanging replies, and a resolved / open state per
 * comment — the discussion surface a back-office screen needs when two parties
 * work a case together.
 *
 * Every post is a real heading (`headingLevel`, default `h4`) so screen-reader
 * users can move between posts; both sides render in one chronological column
 * (no left/right bubbles), since neither party is "the user".
 *
 * For clause comments on a contract under review, a requesting department
 * talking to legal on a matter, a client and a site supervisor, review notes on
 * a submission, and internal notes on a ticket.
 *
 * **Not `ChatMessage` / `ChatPanel`** — those model a conversation with an AI
 * assistant (`assistant | user | system` roles, a right-aligned user bubble,
 * copy/branch/raw/edit actions, a typing indicator) and carry no replies,
 * no resolution and no affiliation. Crystallised after the same thread was
 * hand-rolled in three independent screens: cold-test #178 (owner portal),
 * #179 (contract review) and #180 (legal matters). (#714)
 */
const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(
    (
        {
            className,
            comments,
            headingLevel = 4,
            collapseResolved = false,
            onResolvedChange,
            onReply,
            emptyState,
            label,
            labels: labelsProp,
            ...props
        },
        ref,
    ) => {
        const labels = { ...defaultLabels, ...labelsProp }

        if (comments.length === 0 && emptyState != null) {
            return (
                <div ref={ref} className={cn("w-full", className)} data-slot="comment-thread" {...props}>
                    {emptyState}
                </div>
            )
        }

        return (
            <div ref={ref} className={cn("w-full", className)} data-slot="comment-thread" {...props}>
                <ol role="list" aria-label={label} className="divide-y divide-border">
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            depth={0}
                            headingLevel={headingLevel}
                            collapseResolved={collapseResolved}
                            onResolvedChange={onResolvedChange}
                            onReply={onReply}
                            labels={labels}
                        />
                    ))}
                </ol>
            </div>
        )
    },
)
CommentThread.displayName = "CommentThread"

export { CommentThread }
