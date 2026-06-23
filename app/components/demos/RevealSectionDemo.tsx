"use client";

import * as React from "react";
import { RevealSection, Switch, Input } from "@gunjo/ui";

export function RevealSectionDemo() {
    const [hasSpouse, setHasSpouse] = React.useState(false);

    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">配偶者あり</span>
                <Switch checked={hasSpouse} onCheckedChange={setHasSpouse} aria-label="配偶者あり" />
            </label>

            <RevealSection open={hasSpouse} label="配偶者控除の申告" className="rounded-md border bg-muted/30 p-4">
                <p className="mb-3 text-sm font-medium text-foreground">配偶者控除の申告</p>
                <div className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">配偶者氏名</span>
                        <Input placeholder="山田 花子" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">配偶者の所得見積額</span>
                        <Input inputMode="numeric" placeholder="0" />
                    </label>
                </div>
            </RevealSection>
        </div>
    );
}
