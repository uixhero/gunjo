"use client";

import { ScrollArea, Separator } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

const releases = Array.from({ length: 18 }, (_, index) => `v2.${Math.floor((18 - index) / 3)}.${18 - index}`);

export default function Embed() {
    const { locale } = useLocale();

    return (
        <div className="flex w-full justify-center p-4">
            <ScrollArea className="h-56 w-full max-w-sm rounded-md border bg-background p-4">
                <div className="mb-3 text-sm font-medium">{locale === "ja" ? "リリース" : "Releases"}</div>
                {releases.map((release) => (
                    <div key={release}>
                        <div className="text-sm">{release}</div>
                        <Separator className="my-2" />
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
}
