"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormControl, FormDescription, FormGroup, FormLabel, PostalCodeInput } from "@gunjo/ui";

export function PostalCodeInputDemo() {
    const { locale } = useLocale();
    const [value, setValue] = React.useState("150-0001");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="postal-code">{locale === "ja" ? "郵便番号" : "Postal code"}</FormLabel>
            <FormControl>
                <PostalCodeInput
                    id="postal-code"
                    value={value}
                    onValueChange={setValue}
                    placeholder="150-0001"
                />
            </FormControl>
            <FormDescription>
                {locale === "ja"
                    ? "住所補完は上位で接続し、入力欄は値の整形に責務を絞ります。"
                    : "Connect address lookup above this input; the field focuses on formatting."}
            </FormDescription>
        </FormGroup>
    );
}
