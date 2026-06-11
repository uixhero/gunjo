"use client";

import { Badge, Separator, Switch, Label } from "@gunjo/ui";
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function BadgeDemo() {
    const { locale } = useLocale();

    return (
        <div className="flex gap-2">
            <Badge>{locale === "ja" ? "公開中" : "Live"}</Badge>
            <Badge variant="secondary">{locale === "ja" ? "下書き" : "Draft"}</Badge>
            <Badge variant="outline">{locale === "ja" ? "審査中" : "Review"}</Badge>
            <Badge variant="destructive">{locale === "ja" ? "要対応" : "Action needed"}</Badge>
        </div>
    );
}

export function SeparatorDemo() {
    return (
        <div>
            <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">Gunjo UI</h4>
                <p className="text-sm text-muted-foreground">
                    An open-source design system.
                </p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
                <div>Blog</div>
                <Separator orientation="vertical" />
                <div>Docs</div>
                <Separator orientation="vertical" />
                <div>Source</div>
            </div>
        </div>
    );
}

export function SwitchDemo() {
    const { locale } = useLocale();
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" checked={checked} onCheckedChange={setChecked} />
            <Label htmlFor="airplane-mode">{locale === "ja" ? "機内モード" : "Airplane mode"}</Label>
        </div>
    )
}
