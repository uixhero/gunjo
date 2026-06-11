"use client";

import Link from "next/link";
import { Button, StatusScreen } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../_lib/MarqueeChrome";

// Pattern preview for the 404 / not-found screen. Dogfoods @gunjo/ui's
// StatusScreen (variant="not-found") — the same primitive that backs the
// site's real app/not-found.tsx handler.
export default function NotFoundPattern() {
    return (
        <MarqueeChrome
            slug="not-found"
            routeBase="/patterns/not-found"
            defaultPath="/missing-page"
            navigablePaths={["/missing-page"]}
            tabTitle="Gunjo UI"
        >
            {(viewport) => <NotFoundPatternContent viewport={viewport} />}
        </MarqueeChrome>
    );
}

function NotFoundPatternContent({ viewport }: { viewport: MarqueeViewport }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <div
            className="flex items-center justify-center bg-background p-6"
            style={{ width, height }}
        >
            <StatusScreen
                variant="not-found"
                code="404"
                title={isJa ? "ページが見つかりません" : "Page not found"}
                description={
                    isJa
                        ? "お探しのページは存在しないか、移動した可能性があります。URL を確認するか、トップからもう一度お探しください。"
                        : "The page you're looking for doesn't exist or may have moved. Check the URL, or head back to the homepage."
                }
                action={
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button asChild>
                            <Link href="/">
                                {isJa ? "トップへ戻る" : "Back to home"}
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/docs/introduction">
                                {isJa ? "ドキュメントを見る" : "Browse the docs"}
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
