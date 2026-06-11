"use client";

import { SortButton } from "@gunjo/ui";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SortButtonDemo() {
    const { locale } = useLocale();
    const [sort, setSort] = useState<"asc" | "desc" | "none">("none");

    return (
        <div className="flex justify-center">
            <SortButton
                value={sort}
                onSortChange={setSort}
                label={locale === "ja" ? "登録日" : "Date joined"}
                aria-label={locale === "ja" ? "登録日の並び順を切り替え" : "Toggle sort order for date joined"}
                className="flex-row"
            />
        </div>
    );
}
