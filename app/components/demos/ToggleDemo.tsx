"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { Toggle } from "@gunjo/ui";

export function ToggleDemo() {
    const { locale } = useLocale();

    return (
        <div className="flex items-center gap-2">
            <Toggle aria-label={locale === "ja" ? "太字を切り替え" : "Toggle bold"}>B</Toggle>
            <Toggle aria-label={locale === "ja" ? "斜体を切り替え" : "Toggle italic"} defaultPressed>
                I
            </Toggle>
            <Toggle aria-label={locale === "ja" ? "下線を切り替え" : "Toggle underline"} variant="outline">
                U
            </Toggle>
        </div>
    );
}
