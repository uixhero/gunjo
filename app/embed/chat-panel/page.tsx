"use client";

import { ChatPanelAuditDemo } from "@/components/demos/OverlayComponentDemos";

export default function Embed() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <ChatPanelAuditDemo toastPlacement="container" />
        </div>
    );
}
