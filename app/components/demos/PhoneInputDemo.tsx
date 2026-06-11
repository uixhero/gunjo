"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FormControl, FormDescription, FormGroup, FormLabel, PhoneInput } from "@gunjo/ui";

export function PhoneInputDemo() {
    const { locale } = useLocale();
    const [value, setValue] = React.useState("090-1234-5678");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="phone">{locale === "ja" ? "電話番号" : "Phone number"}</FormLabel>
            <FormControl>
                <PhoneInput
                    id="phone"
                    value={value}
                    onValueChange={setValue}
                    placeholder={locale === "ja" ? "090-1234-5678" : "90-1234-5678"}
                    countryLabel={locale === "ja" ? "日本" : "Japan"}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja"
                    ? "国番号の表示と電話番号の入力補助を組み合わせます。"
                    : "Combines a country calling code with phone-number input assistance."}
            </FormDescription>
        </FormGroup>
    );
}
