"use client";

import { AlertDialogAuditDemo } from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = searchParams.get("variant");
    const resolvedVariant = variant === "unsaved" || variant === "access-request" || variant === "target-summary"
        ? variant
        : "destructive";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <AlertDialogAuditDemo variant={resolvedVariant} />
        </div>
    );
}
