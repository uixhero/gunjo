import { availableBookStores } from "@/lib/book-promo";
import { isBookPromoVisible } from "@/lib/book-promo-copy";
import { BookBannerBody } from "./BookBannerBody";

/**
 * Server half of the book banner: it decides whether the banner may render at
 * all, then hands the stores to the client half.
 *
 * Do NOT add "use client" here. isBookPromoVisible() reads
 * process.env.VERCEL_ENV, which only exists on the server; deciding this in the
 * browser would let placeholder wording reach production.
 *
 * It is built in app/layout.tsx (a server component) and passed into
 * SiteFooter as a prop, because SiteFooter itself is a client component.
 */
export function BookBanner() {
    if (!isBookPromoVisible()) return null;

    const stores = availableBookStores();
    // No store has a URL yet -> render nothing rather than an empty shell.
    if (stores.length === 0) return null;

    return <BookBannerBody stores={stores} />;
}
