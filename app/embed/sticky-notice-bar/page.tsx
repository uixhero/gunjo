"use client";

import { StickyNoticeBarTimedDemo, StickyNoticeBarViewportDemo } from "@/components/demos/StickyNoticeBarDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const { locale } = useLocale();
    const searchParams = useSearchParams();

    if (searchParams.get("variant") === "timed") return <StickyNoticeBarTimedDemo locale={locale} />;
    return <StickyNoticeBarViewportDemo locale={locale} />;
}
