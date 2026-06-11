"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    NumberInput,
} from "@gunjo/ui";

export function NumberInputDemo() {
    const { locale } = useLocale();
    const [value, setValue] = React.useState<number>(42);

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="quantity">{locale === "ja" ? "数量" : "Quantity"}</FormLabel>
            <FormControl>
                <NumberInput
                    id="quantity"
                    value={value}
                    onValueChange={setValue}
                    min={0}
                    max={100}
                    incrementLabel={locale === "ja" ? "数量を増やす" : "Increase quantity"}
                    decrementLabel={locale === "ja" ? "数量を減らす" : "Decrease quantity"}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? `現在の値: ${value}` : `value = ${value}`}
            </FormDescription>
        </FormGroup>
    );
}
