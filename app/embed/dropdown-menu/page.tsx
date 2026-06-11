"use client";

import {
    DropdownMenuAuditDemo,
    SplitDropdownMenuAuditDemo,
    UserMenuAuditDemo,
} from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = searchParams.get("variant");
    const Demo = variant === "account"
        ? UserMenuAuditDemo
        : variant === "split-button"
          ? SplitDropdownMenuAuditDemo
          : DropdownMenuAuditDemo;

    return (
        <div className="flex min-h-[360px] items-start justify-center p-4 pt-12">
            <Demo />
        </div>
    );
}
