"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { PasswordRequirementList } from "@gunjo/ui";

export function PasswordRequirementListDemo() {
    const { locale } = useLocale();

    return (
        <PasswordRequirementList
            className="w-full max-w-sm"
            metLabel={locale === "ja" ? "要件を満たしています" : "Requirement met"}
            unmetLabel={locale === "ja" ? "要件を満たしていません" : "Requirement not met"}
            pendingLabel={locale === "ja" ? "未確認の要件です" : "Requirement pending"}
            requirements={[
                {
                    id: "length",
                    label: locale === "ja" ? "12文字以上" : "At least 12 characters",
                    met: true,
                },
                {
                    id: "number",
                    label: locale === "ja" ? "数字を含む" : "Includes a number",
                    met: true,
                },
                {
                    id: "symbol",
                    label: locale === "ja" ? "記号を含む" : "Includes a symbol",
                    met: false,
                },
            ]}
        />
    );
}
