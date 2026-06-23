"use client";

import * as React from "react";
import { CoSign, CoSignBadge, type CoSignValue } from "@gunjo/ui";

const PRIMARY = "ns-tanaka";

export function CoSignDemo() {
    const [value, setValue] = React.useState<CoSignValue | undefined>(undefined);

    return (
        <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                    <p className="font-medium text-foreground">麻薬：モルヒネ 10mg</p>
                    <p className="text-muted-foreground">主担当: 田中（ns-tanaka）</p>
                </div>
                <CoSignBadge value={value} />
            </div>

            <CoSign
                primaryId={PRIMARY}
                requireReason={false}
                attestations={[
                    { id: "drug", label: "薬剤名・規格・用量を確認した" },
                    { id: "patient", label: "患者・指示を確認した" },
                ]}
                signerLabel="確認者ID（2人目）"
                value={value}
                onSign={setValue}
            />

            {value ? (
                <button
                    type="button"
                    className="self-end text-xs text-muted-foreground underline"
                    onClick={() => setValue(undefined)}
                >
                    リセット
                </button>
            ) : (
                <p className="text-xs text-muted-foreground">
                    ヒント: 確認者IDに「ns-tanaka」を入れると同一人物ガードが働きます。別IDで署名できます。
                </p>
            )}
        </div>
    );
}
