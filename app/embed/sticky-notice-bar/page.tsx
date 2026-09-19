"use client";

import { StickyNoticeBarViewportDemo } from "@/components/demos/StickyNoticeBarDemo";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Embed() {
    const { locale } = useLocale();

    return <StickyNoticeBarViewportDemo locale={locale} />;
}
