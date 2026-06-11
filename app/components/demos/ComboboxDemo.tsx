"use client";

import * as React from "react";
import {
    Combobox,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
];

export function ComboboxDemo() {
    const [value, setValue] = React.useState<string>("");
    const { locale } = useLocale();

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="framework">{locale === "ja" ? "フレームワーク" : "Framework"}</FormLabel>
            <FormControl>
                <Combobox
                    id="framework"
                    options={frameworks}
                    value={value}
                    onValueChange={setValue}
                    placeholder={locale === "ja" ? "フレームワークを選択..." : "Select framework..."}
                    searchPlaceholder={locale === "ja" ? "フレームワークを検索..." : "Search framework..."}
                    searchClearLabel={locale === "ja" ? "検索をクリア" : "Clear search"}
                    emptyMessage={locale === "ja" ? "一致するフレームワークがありません。" : "No framework found."}
                    clearLabel={locale === "ja" ? "選択をクリア" : "Clear selection"}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "検索するか、一覧から選択します。" : "Search or choose from the list."}
            </FormDescription>
        </FormGroup>
    );
}
