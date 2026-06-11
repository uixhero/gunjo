"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { PasswordGroup } from "@gunjo/ui";

function getScore(value: string) {
    let score = 0;
    if (value.length >= 12) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return score;
}

export function PasswordGroupDemo() {
    const { locale } = useLocale();
    const [value, setValue] = React.useState("GunjoUI2026");
    const score = getScore(value);

    return (
        <PasswordGroup
            className="w-full max-w-sm"
            value={value}
            onValueChange={setValue}
            label={locale === "ja" ? "新しいパスワード" : "New password"}
            description={
                locale === "ja"
                    ? "要件、強度、エラーを1つの入力グループとして表示します。"
                    : "Show requirements, strength, and errors as one field group."
            }
            passwordInputProps={{
                placeholder: locale === "ja" ? "パスワードを入力" : "Enter password",
                showLabel: locale === "ja" ? "パスワードを表示" : "Show password",
                hideLabel: locale === "ja" ? "パスワードを隠す" : "Hide password",
            }}
            strengthScore={score}
            strengthLabel={locale === "ja" ? "パスワード強度" : "Password strength"}
            strengthValueLabel={
                score >= 3
                    ? locale === "ja"
                        ? "強い"
                        : "Strong"
                    : locale === "ja"
                      ? "改善が必要"
                      : "Needs work"
            }
            requirements={[
                {
                    id: "length",
                    label: locale === "ja" ? "12文字以上" : "At least 12 characters",
                    met: value.length >= 12,
                },
                {
                    id: "uppercase",
                    label: locale === "ja" ? "大文字を含む" : "Includes an uppercase letter",
                    met: /[A-Z]/.test(value),
                },
                {
                    id: "number",
                    label: locale === "ja" ? "数字を含む" : "Includes a number",
                    met: /\d/.test(value),
                },
            ]}
        />
    );
}
