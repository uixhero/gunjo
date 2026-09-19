"use client";

import { ForecastDayGridDemo } from "@/components/demos/ForecastDayGridPatternDemo";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Embed() {
    const { locale } = useLocale();
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <ForecastDayGridDemo locale={locale === "ja" ? "ja" : "en"} />
        </div>
    );
}
