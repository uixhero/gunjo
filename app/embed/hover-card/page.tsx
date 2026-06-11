"use client";

import {
    ActionHoverCardDemo,
    HoverCardAuditDemo,
    NotificationHoverCardDemo,
    TabbedHoverCardDemo,
} from "@/components/demos/OverlayComponentDemos";
import { useSearchParams } from "next/navigation";

export default function Embed() {
    const searchParams = useSearchParams();
    const variant = searchParams.get("variant");
    const Demo = variant === "notification"
        ? NotificationHoverCardDemo
        : variant === "actions"
            ? ActionHoverCardDemo
            : variant === "tabs"
                ? TabbedHoverCardDemo
                : HoverCardAuditDemo;

    return (
        <div className="flex min-h-[320px] items-center justify-center overflow-visible p-6">
            <Demo />
        </div>
    );
}
