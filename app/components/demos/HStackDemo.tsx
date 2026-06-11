"use client";

import { Button, HStack } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function HStackDemo() {
    const { locale } = useLocale();

    return (
        <HStack gap={2} align="center" wrap>
            <Button size="sm">{locale === "ja" ? "保存" : "Save"}</Button>
            <Button size="sm" variant="outline">{locale === "ja" ? "プレビュー" : "Preview"}</Button>
            <Button size="sm" variant="ghost">{locale === "ja" ? "キャンセル" : "Cancel"}</Button>
        </HStack>
    );
}
