"use client";

import * as React from "react";
import { IconExternalLink } from "@tabler/icons-react";
import { sendGTMEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics";
import { Button, Card } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BOOK_COVER, BOOK_ID, BOOK_PROMO_SITE, type BookStoreId } from "@/lib/book-promo";
import { BOOK_PROMO_COPY, BOOK_PROMO_DRAFT } from "@/lib/book-promo-copy";

interface Store {
    id: BookStoreId;
    label: string;
    href: string;
}

/**
 * The rendered half of the book banner. Client-side because the wording is
 * locale-dependent and the locale lives in a client provider; the "may this
 * render at all" decision stays on the server in BookBanner.tsx.
 *
 * The cover's alt is empty on purpose: the title sits right next to it as the
 * heading, so describing the cover would make a screen reader say the same
 * thing twice. It is decorative here.
 */
export function BookBannerBody({ stores }: { stores: Store[] }) {
    const { locale } = useLocale();
    const copy = BOOK_PROMO_COPY[locale];

    return (
        <section
            aria-labelledby="book-promo-title"
            className="container my-10 sm:my-14"
        >
            <Card className="flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7 lg:gap-10">
                {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size static asset; next/image would add a request for no gain */}
                <img
                    src={BOOK_COVER.src}
                    alt=""
                    width={BOOK_COVER.width}
                    height={BOOK_COVER.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-24 shrink-0 self-start rounded-md border border-border/60 shadow-sm sm:w-28"
                />

                <div className="min-w-0 flex-1">
                    {BOOK_PROMO_DRAFT && (
                        <p className="mb-3 rounded border border-dashed border-destructive/50 px-2 py-1 text-xs text-destructive">
                            Placeholder wording. While this strip is visible the banner is not live in production.
                        </p>
                    )}

                    <p className="text-xs font-medium tracking-wide text-muted-foreground">
                        {copy.eyebrow}
                    </p>

                    {/* Mincho for the display line, the way the home page sets its
                        headings (there is no font-mincho utility — gunjo applies
                        the variable inline). */}
                    <h2
                        id="book-promo-title"
                        className="mt-1 text-lg font-bold sm:text-xl"
                        style={{ fontFamily: "var(--font-mincho), serif" }}
                    >
                        {copy.title}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {copy.lead}
                    </p>

                    {copy.note ? (
                        <p className="mt-1 text-xs text-muted-foreground">{copy.note}</p>
                    ) : null}
                </div>

                {/* Stores sit in their own column when there is room, so the reading
                    column and the acting column stay separate. */}
                <div className="shrink-0 lg:w-56">
                    <p className="text-sm font-medium">{copy.cta}</p>
                    <div className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                        {stores.map((store) => (
                            <BookStoreLink key={store.id} {...store} />
                        ))}
                    </div>
                </div>
            </Card>
        </section>
    );
}

/**
 * One store link.
 *
 * GA4 event name is `outbound_click` — the same name uixhero.com already uses
 * for links that leave the site, so the three sites read as one report. The
 * surface is told apart by `placement`, never by inventing a second event name.
 *
 *   destination = zenn | amazon | apple_books | google_play_books
 *   placement   = book_banner
 *   site        = gunjo
 *   book        = gunjo-ai-ui-175
 *
 * Two sinks, matching /pack (app/pack/PackForm.tsx): Vercel Analytics via
 * `track()`, and GA4 via an object-shaped `dataLayer.push` from `sendGTMEvent`.
 * This site loads GA4 through <GoogleTagManager> only — there is no gtag.js on
 * the page, so a `gtag()` call would go nowhere.
 */
function BookStoreLink({ id, label, href }: Store) {
    // The visible text is already the store's name, so the screen-reader hint
    // must not repeat it ("Zenn (opens Zenn in a new tab)"). The title
    // attribute is read on its own, so that one keeps the name.
    const titleNotice = `Opens ${label} in a new tab`;

    return (
        <Button asChild variant="outline" size="sm" className="w-full">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={titleNotice}
                onClick={() => {
                    track("outbound_click", {
                        destination: id,
                        placement: "book_banner",
                        site: BOOK_PROMO_SITE,
                        book: BOOK_ID,
                    });
                    sendGTMEvent({
                        event: "outbound_click",
                        destination: id,
                        placement: "book_banner",
                        site: BOOK_PROMO_SITE,
                        book: BOOK_ID,
                    });
                }}
            >
                {label}
                <IconExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
            </a>
        </Button>
    );
}
