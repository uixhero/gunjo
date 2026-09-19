"use client";

import { ActionProgressDemo, type ActionProgressDemoVariant } from "@/components/demos/ProgressWaitDemos";
import { useSearchParams } from "next/navigation";

const VARIANTS: ActionProgressDemoVariant[] = ["default", "just-after", "form"];

export default function Embed() {
    const searchParams = useSearchParams();
    const requested = searchParams.get("variant") as ActionProgressDemoVariant | null;
    const reduced = searchParams.get("variant") === "reduced-motion";
    const variant = requested && VARIANTS.includes(requested) ? requested : "default";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <ActionProgressDemo variant={variant} motionToggle={reduced} />
        </div>
    );
}
