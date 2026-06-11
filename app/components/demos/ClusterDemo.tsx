"use client";

import { Badge, Cluster } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const tagsByLocale = {
    en: ["Design", "React", "Docs", "Responsive", "Accessibility", "SSOT", "Preview"],
    ja: ["設計", "React", "ドキュメント", "レスポンシブ", "アクセシビリティ", "SSOT", "プレビュー"],
} as const;

export function ClusterDemo() {
    const { locale } = useLocale();

    return (
        <div className="w-full rounded-lg border bg-background p-4">
            <Cluster gap={2}>
                {tagsByLocale[locale].map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                    </Badge>
                ))}
            </Cluster>
        </div>
    );
}
