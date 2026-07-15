"use client";

import { DialogAuditDemo } from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = searchParams.get("variant");
    const resolvedVariant = variant === "confirmation" || variant === "summary" || variant === "scroll"
        ? variant
        : "form";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <DialogAuditDemo variant={resolvedVariant} />
        </div>
    );
}
