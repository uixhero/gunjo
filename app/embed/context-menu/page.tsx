"use client";

import { ContextMenuAuditDemo } from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = searchParams.get("variant");
    const resolvedVariant = variant === "text-only" || variant === "nested-actions"
        ? variant
        : "file-actions";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <ContextMenuAuditDemo variant={resolvedVariant} />
        </div>
    );
}
