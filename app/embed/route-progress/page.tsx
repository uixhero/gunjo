"use client";

import { RouteProgressDemo, type RouteProgressDemoVariant } from "@/components/demos/ProgressWaitDemos";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const searchParams = useSearchParams();
    const reduced = searchParams.get("variant") === "reduced-motion";
    const requested = searchParams.get("variant");
    const variant: RouteProgressDemoVariant =
        requested === "container" || requested === "boundary" ? requested : "viewport";

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <RouteProgressDemo variant={variant} motionToggle={reduced} />
        </div>
    );
}
