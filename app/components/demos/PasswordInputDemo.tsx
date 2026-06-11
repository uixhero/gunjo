"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    PasswordInput,
} from "@gunjo/ui";

export function PasswordInputDemo() {
    const { locale } = useLocale();
    const [value, setValue] = React.useState(locale === "ja" ? "sample-password" : "super-secret");

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="password">{locale === "ja" ? "パスワード" : "Password"}</FormLabel>
            <FormControl>
                <PasswordInput
                    id="password"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={locale === "ja" ? "パスワードを入力" : "Enter password..."}
                    showLabel={locale === "ja" ? "パスワードを表示" : "Show password"}
                    hideLabel={locale === "ja" ? "パスワードを隠す" : "Hide password"}
                />
            </FormControl>
            <FormDescription>
                {locale === "ja"
                    ? "右端のボタンで入力内容の表示・非表示を切り替えます。"
                    : "Use the visibility button to inspect the value."}
            </FormDescription>
        </FormGroup>
    );
}
