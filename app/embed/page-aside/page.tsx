"use client";

import { useSearchParams } from "next/navigation";
import { PageAsideDemo, type PageAsideDemoVariant } from "@/components/demos/PageAsideDemo";

function resolveVariant(value: string | null): PageAsideDemoVariant {
    if (value === "status" || value === "links") return value;
    return "default";
}

export default function EmbedPageAsidePage() {
    const searchParams = useSearchParams();
    const variant = resolveVariant(searchParams.get("variant"));

    return (
        <div className="flex min-h-[360px] w-full items-center justify-center p-4">
            <PageAsideDemo variant={variant} />
        </div>
    );
}
