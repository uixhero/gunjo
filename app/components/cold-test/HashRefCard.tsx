"use client";

import * as React from "react";
import Link from "next/link";
import { IconArrowUpRight, IconExternalLink } from "@tabler/icons-react";
import {
    Badge,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@gunjo/ui";

import { useLocale } from "@/components/providers/LocaleProvider";

// A `#NNN` inside a cold-test article now says what it points at before you
// commit to the click. The interaction copies the glossary popover on
// uixhero.com, including the two things that only show up on a real phone:
//
//   1. `isTouch` starts *true*. Starting false renders the HoverCard until the
//      effect has run, and a tap on a HoverCard trigger does nothing at all —
//      so the first tap on a phone is silently swallowed.
//   2. On touch, the trigger is a `span` with `role="button"`, not a `Link`.
//      A Link with `preventDefault` stops Radix from opening the popover, so
//      the tap navigates instead of previewing.
//
// (2) costs nothing in crawlable internal links: every round is already linked
// from the rounds sidebar that renders on every cold-test page.

const TRIGGER_CLASS =
    "cursor-help rounded-sm border-b-2 border-dotted border-primary-border font-medium text-primary transition-colors hover:border-primary hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function useIsTouch(): boolean {
    const [isTouch, setIsTouch] = React.useState(true);

    React.useEffect(() => {
        const query = window.matchMedia("(hover: none)");
        setIsTouch(query.matches);
        const onChange = (event: MediaQueryListEvent) => setIsTouch(event.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    return isTouch;
}

const CTA_CLASS =
    "inline-flex items-center gap-1 self-start text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function HashRef({
    href,
    linkLabel,
    previewLabel,
    ctaLabel,
    card,
    external,
    hrefLang,
    children,
}: {
    href: string;
    /** Accessible name for the pointer/keyboard link. */
    linkLabel: string;
    /** Accessible name for the touch trigger, which previews rather than navigates. */
    previewLabel: string;
    /** Text of the link at the foot of the card. */
    ctaLabel: string;
    card: React.ReactNode;
    external?: boolean;
    hrefLang?: string;
    children: React.ReactNode;
}) {
    const isTouch = useIsTouch();

    // The card always ends in a real link. On touch it is the *only* way
    // through — the trigger there opens the preview instead of navigating.
    const cta = external ? (
        <a href={href} target="_blank" rel="noreferrer" className={CTA_CLASS}>
            {ctaLabel}
            <IconExternalLink className="h-3 w-3" aria-hidden />
        </a>
    ) : (
        <Link href={href} hrefLang={hrefLang} className={CTA_CLASS}>
            {ctaLabel}
            <IconArrowUpRight className="h-3 w-3" aria-hidden />
        </Link>
    );

    if (isTouch) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <span
                        role="button"
                        tabIndex={0}
                        aria-label={previewLabel}
                        className={TRIGGER_CLASS}
                        onKeyDown={(event) => {
                            if (event.key !== "Enter" && event.key !== " ") return;
                            event.preventDefault();
                            (event.target as HTMLElement).click();
                        }}
                    >
                        {children}
                    </span>
                </PopoverTrigger>
                <PopoverContent className="gap-2">
                    {card}
                    {cta}
                </PopoverContent>
            </Popover>
        );
    }

    const trigger = external ? (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={linkLabel}
            className={TRIGGER_CLASS}
        >
            {children}
        </a>
    ) : (
        <Link href={href} hrefLang={hrefLang} aria-label={linkLabel} className={TRIGGER_CLASS}>
            {children}
        </Link>
    );

    return (
        <HoverCard openDelay={120}>
            <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
            <HoverCardContent className="w-[288px] gap-2">
                {card}
                {cta}
            </HoverCardContent>
        </HoverCard>
    );
}

export interface RoundRefCardData {
    round: number;
    title: string;
    /** As stored — "4.5/5". */
    score: string;
    /** The raw Japanese category key; translated through the locale strings. */
    category: string;
    thumbnailSrc?: string;
}

export function RoundRef({
    data,
    href,
    hrefLang,
    children,
}: {
    data: RoundRefCardData;
    href: string;
    hrefLang?: string;
    children: React.ReactNode;
}) {
    const { pages } = useLocale();
    const t = pages.coldTests;
    const h = t.detail.hashRef;

    const card = (
        <>
            {data.thumbnailSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element -- cold-test captures, not the optimized image pipeline */
                <img
                    src={data.thumbnailSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-full rounded-md border border-border/60 bg-muted/40 object-cover object-top"
                />
            ) : null}
            <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                    {h.roundBadge(data.round)}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                    {/* The stored score already carries its own "/5". */}
                    {t.scoreLabel(data.score)}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                    {t.categories[data.category] ?? data.category}
                </Badge>
            </div>
            <p className="line-clamp-3 text-sm font-medium leading-snug text-foreground">
                {data.title}
            </p>
        </>
    );

    return (
        <HashRef
            href={href}
            hrefLang={hrefLang}
            linkLabel={t.openDetailLabel(data.round)}
            previewLabel={h.roundPreview(data.round)}
            ctaLabel={h.openRound}
            card={card}
        >
            {children}
        </HashRef>
    );
}

export interface IssueRefCardData {
    number: number;
    title: string;
    state: "open" | "closed";
    /** First lines of the issue body, already trimmed by the fetch script. */
    excerpt: string;
    url: string;
}

export function IssueRef({
    data,
    children,
}: {
    data: IssueRefCardData;
    children: React.ReactNode;
}) {
    const h = useLocale().pages.coldTests.detail.hashRef;

    const card = (
        <>
            <div className="flex flex-wrap items-center gap-1.5">
                {/* OPEN / CLOSED stays in English in both locales: it is the
                    word GitHub itself puts on the issue. */}
                <Badge
                    variant={data.state === "open" ? "secondary" : "outline"}
                    className="text-[10px] uppercase tracking-wider"
                >
                    {data.state === "open" ? "OPEN" : "CLOSED"}
                </Badge>
                <span className="font-mono text-[10px] text-muted-foreground">
                    #{data.number}
                </span>
            </div>
            <p className="line-clamp-3 text-sm font-medium leading-snug text-foreground">
                {data.title}
            </p>
            {data.excerpt ? (
                <p className="line-clamp-4 text-xs leading-5 text-muted-foreground">
                    {data.excerpt}
                </p>
            ) : null}
        </>
    );

    return (
        <HashRef
            href={data.url}
            external
            linkLabel={h.issueLink(data.number)}
            previewLabel={h.issuePreview(data.number)}
            ctaLabel={h.openIssue}
            card={card}
        >
            {children}
        </HashRef>
    );
}
