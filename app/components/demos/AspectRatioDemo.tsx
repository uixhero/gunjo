"use client";

import { AspectRatio } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const assetsByLocale = {
    en: [
        { label: "Hero video", ratio: 16 / 9, tone: "bg-primary-subtle" },
        { label: "Article image", ratio: 4 / 3, tone: "bg-success-subtle" },
        { label: "Avatar crop", ratio: 1, tone: "bg-warning-subtle" },
    ],
    ja: [
        { label: "ヒーロー動画", ratio: 16 / 9, tone: "bg-primary-subtle" },
        { label: "記事画像", ratio: 4 / 3, tone: "bg-success-subtle" },
        { label: "アバター切り抜き", ratio: 1, tone: "bg-warning-subtle" },
    ],
} as const;

export function AspectRatioDemo() {
    const { locale } = useLocale();
    const assets = assetsByLocale[locale];

    return (
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            {assets.map((asset) => (
                <div key={asset.label} className="min-w-0 space-y-2">
                    <AspectRatio
                        ratio={asset.ratio}
                        className={`grid place-items-center rounded-md border ${asset.tone}`}
                    >
                        <span className="px-2 text-center text-sm font-medium">{asset.label}</span>
                    </AspectRatio>
                </div>
            ))}
        </div>
    );
}
