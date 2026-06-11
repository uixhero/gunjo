"use client";

import * as React from "react";
import Link from "next/link";
import { IconAlertTriangle as AlertTriangle } from "@tabler/icons-react";
import { Button, StatusScreen } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    React.useEffect(() => {
        // Surface the error in the console for debugging; production telemetry
        // can hook in here later.
        console.error(error);
    }, [error]);

    return (
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-6 py-24">
            <StatusScreen
                variant="error"
                className="min-h-0"
                icon={<AlertTriangle aria-hidden="true" />}
                title={isJa ? "問題が発生しました" : "Something went wrong"}
                description={
                    isJa
                        ? "一時的な問題の可能性があります。もう一度お試しください。続く場合は時間をおいてアクセスしてください。"
                        : "This may be a temporary problem. Try again — if it keeps happening, please come back in a moment."
                }
                action={
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button onClick={() => reset()}>
                            {isJa ? "もう一度試す" : "Try again"}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/">
                                {isJa ? "トップへ戻る" : "Back to home"}
                            </Link>
                        </Button>
                    </div>
                }
            />
        </main>
    );
}
