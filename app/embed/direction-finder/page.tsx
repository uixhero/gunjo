"use client";

import { DirectionFinderDemo } from "@/components/demos/DirectionFinderPatternDemo";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Embed() {
    const { locale } = useLocale();
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <DirectionFinderDemo locale={locale === "ja" ? "ja" : "en"} />
        </div>
    );
}
