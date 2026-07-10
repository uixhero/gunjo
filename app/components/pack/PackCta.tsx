"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { IconArrowRight } from "@tabler/icons-react";
import { Banner, Button } from "@gunjo/ui";

interface PackCtaProps {
    /** Where this CTA sits — recorded on click so we can see which spot converts. */
    placement: string;
    /** Optional short message. Banner is single-line, so keep it brief. */
    message?: string;
    className?: string;
}

/**
 * Subtle, single-line CTA strip pointing at the /pack pre-registration form.
 * Rendered near the cold-test surfaces and the homepage SSOT section. Built on
 * the @gunjo/ui Banner + Button (dogfooding). (#555, TASK-7)
 */
export function PackCta({
    placement,
    message = "業界別「AI指示書パック」、先行登録を受付中です。",
    className,
}: PackCtaProps) {
    const pathname = usePathname();
    // Carry the origin page so the completion screen can send the visitor back
    // to where the CTA sat, instead of dropping them on the cold-test index.
    const href = pathname
        ? `/pack?from=${encodeURIComponent(pathname)}`
        : "/pack";
    return (
        <Banner
            variant="info"
            className={className}
            action={
                <Button asChild size="sm" variant="info">
                    <Link
                        href={href}
                        onClick={() => track("pack_cta_click", { placement })}
                    >
                        先行登録
                        <IconArrowRight className="size-4" aria-hidden />
                    </Link>
                </Button>
            }
        >
            {message}
        </Banner>
    );
}
