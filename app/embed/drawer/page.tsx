"use client";

import { DrawerAuditDemo } from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

const drawerSides = new Set(["bottom", "right", "left", "top"]);

export default function Embed() {
    const searchParams = useSearchParams();
    const sideParam = searchParams.get("side");
    const side = (drawerSides.has(sideParam ?? "") ? sideParam : "bottom") as "bottom" | "right" | "left" | "top";

    return (
        <div className="flex min-h-[420px] items-center justify-center p-4">
            <DrawerAuditDemo side={side} />
        </div>
    );
}
