"use client";

import * as React from "react";
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    SearchInput,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SearchInputDemo() {
    const { locale } = useLocale();
    const [value, setValue] = React.useState("");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="component-search">{locale === "ja" ? "検索" : "Search"}</FormLabel>
            <FormControl>
                <SearchInput
                    id="component-search"
                    value={value}
                    onValueChange={setValue}
                    placeholder={locale === "ja" ? "コンポーネントを検索..." : "Search components..."}
                    clearLabel={locale === "ja" ? "検索語をクリア" : "Clear search"}
                />
            </FormControl>
            <FormDescription>
                {value
                    ? locale === "ja"
                        ? `検索語: "${value}"`
                        : `query: "${value}"`
                    : locale === "ja"
                        ? "入力すると検索語が反映され、クリアボタンで消せます。"
                        : "Type to search; clear with x"}
            </FormDescription>
        </FormGroup>
    );
}
