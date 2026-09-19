"use client";

import { ProgressDialogDemo, type ProgressDialogDemoVariant } from "@/components/demos/ProgressWaitDemos";
import { useSearchParams } from "next/navigation";

const VARIANTS: ProgressDialogDemoVariant[] = ["default", "aside", "known", "no-cancel"];

export default function Embed() {
    const searchParams = useSearchParams();
    const requested = searchParams.get("variant") as ProgressDialogDemoVariant | null;
    const reduced = searchParams.get("variant") === "reduced-motion";
    const variant = requested && VARIANTS.includes(requested) ? requested : "default";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <ProgressDialogDemo variant={variant} reduced={reduced} />
        </div>
    );
}
