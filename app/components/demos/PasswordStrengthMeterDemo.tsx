"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { PasswordStrengthMeter } from "@gunjo/ui";

export function PasswordStrengthMeterDemo() {
    const { locale } = useLocale();

    return (
        <PasswordStrengthMeter
            className="w-full max-w-sm"
            score={3}
            label={locale === "ja" ? "パスワード強度" : "Password strength"}
            valueLabel={locale === "ja" ? "強い" : "Strong"}
            description={
                locale === "ja"
                    ? "評価ロジックはアプリ側で計算し、score とラベルを渡します。"
                    : "Calculate strength in your app and pass the score and label."
            }
        />
    );
}
