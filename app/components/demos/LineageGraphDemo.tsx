"use client";

import * as React from "react";
import { LineageGraph, type LineageNode, type LineageEdge } from "@gunjo/ui";

// Lot genealogy: 2 material lots → 1 product lot → 2 shipments (multi-parent + multi-child).
const NODES: LineageNode[] = [
    { id: "m1", label: "原料ロット RM-01", sublabel: "果汁濃縮", tone: "info" },
    { id: "m2", label: "原料ロット RM-02", sublabel: "砂糖", tone: "info" },
    { id: "p1", label: "製品ロット PL-2405", sublabel: "オレンジジュース", tone: "primary" },
    { id: "s1", label: "出荷 SH-101", sublabel: "東日本DC", tone: "success" },
    { id: "s2", label: "出荷 SH-102", sublabel: "西日本DC（リコール対象）", tone: "destructive" },
];

const EDGES: LineageEdge[] = [
    { from: "m1", to: "p1" },
    { from: "m2", to: "p1" }, // multi-parent into p1
    { from: "p1", to: "s1" },
    { from: "p1", to: "s2" }, // multi-child out of p1
];

export function LineageGraphDemo() {
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <div className="flex w-full flex-col gap-3">
            <LineageGraph
                nodes={NODES}
                edges={EDGES}
                label="ロット系譜"
                onSelectNode={(n) => setPicked(typeof n.label === "string" ? n.label : n.id)}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {picked
                    ? `選択: ${picked}`
                    : "ノードをクリックで選択。RM-01/RM-02 が PL-2405 に合流（多親）し、SH-101/SH-102 に分岐（多子）＝ツリーでは描けない系譜を層化DAGで。"}
            </p>
        </div>
    );
}
