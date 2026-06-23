"use client";

import * as React from "react";
import { SafetyBanner, Button } from "@gunjo/ui";

export function SafetyBannerDemo() {
    const [allergyAck, setAllergyAck] = React.useState(false);
    const [interactionAck, setInteractionAck] = React.useState(false);
    const canSign = allergyAck && interactionAck;

    return (
        <div className="flex w-full max-w-lg flex-col gap-3">
            <SafetyBanner
                tone="destructive"
                title="アレルギー警告：ペニシリン"
                requireAck
                acknowledged={allergyAck}
                onAcknowledge={() => setAllergyAck(true)}
            >
                処方薬「アモキシシリン」は患者の登録アレルギー（ペニシリン系）に該当します。投与は禁忌です。
            </SafetyBanner>

            <SafetyBanner
                tone="warning"
                title="相互作用：中等度"
                requireAck
                acknowledged={interactionAck}
                onAcknowledge={() => setInteractionAck(true)}
            >
                ワルファリンとの併用で出血リスクが上昇します。INR をモニタリングしてください。
            </SafetyBanner>

            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2">
                <span className="text-sm text-muted-foreground">
                    {canSign ? "全ての警告を確認しました" : "未確認の警告があります"}
                </span>
                <Button variant="success" size="sm" disabled={!canSign}>
                    処方を署名
                </Button>
            </div>
        </div>
    );
}
