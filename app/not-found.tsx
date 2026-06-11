"use client";

import Link from "next/link";
import { Button, StatusScreen } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function NotFound() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-6 py-24">
            <StatusScreen
                variant="not-found"
                className="min-h-0"
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
        </main>
    );
}
