"use client";

import { useSearchParams } from "next/navigation";
import { RightRailDemo, type RightRailDemoVariant } from "@/components/demos/RightRailDemo";

function resolveVariant(value: string | null): RightRailDemoVariant {
    if (value === "status" || value === "links") return value;
    return "page-support";
}

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = resolveVariant(searchParams.get("variant"));

    return (
        <div className="flex min-h-[360px] w-full items-center justify-center p-4">
            <RightRailDemo variant={variant} />
        </div>
    );
}
