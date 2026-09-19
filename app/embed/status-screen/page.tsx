"use client";

import { Button, StatusScreen } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const COPY = {
    ja: {
        title: "ページが見つかりません",
        description: "URLが変更されたか、ページが削除された可能性があります。",
        action: "トップへ戻る",
    },
    en: {
        title: "Page not found",
        description: "The page may have moved or been deleted.",
        action: "Back to home",
    },
};

export default function Embed() {
    const { locale } = useLocale();
    const copy = COPY[locale === "en" ? "en" : "ja"];

    // min-h-0 cancels StatusScreen's own min-h-[60vh]. A real status page keeps
    // that full-page floor; the docs frame follows the composition instead.
    return (
        <div className="w-full overflow-hidden rounded-md border bg-background">
            <StatusScreen
                variant="not-found"
                title={copy.title}
                description={copy.description}
                action={<Button>{copy.action}</Button>}
                className="min-h-0"
            />
        </div>
    );
}
