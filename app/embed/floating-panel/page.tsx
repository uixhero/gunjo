"use client";

import { FloatingPanelAuditDemo } from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

const variants = new Set(["canvas", "interactive", "toolbar", "status", "solid"]);

export default function Embed() {
    const searchParams = useSearchParams();
    const variantParam = searchParams.get("variant");
    const variant = (variants.has(variantParam ?? "") ? variantParam : "canvas") as
        | "canvas"
        | "interactive"
        | "toolbar"
        | "status"
        | "solid";

    return (
        <FloatingPanelAuditDemo variant={variant} />
    );
}
