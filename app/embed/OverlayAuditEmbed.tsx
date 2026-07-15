"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    MediaLightboxAuditDemo,
    MediaPickerDialogAuditDemo,
    ModalAuditDemo,
    OnboardingFlowAuditDemo,
    PopoverAuditDemo,
    ShareModalAuditDemo,
    SheetAuditDemo,
    TooltipAuditDemo,
} from "@/components/demos/OverlayRemainderDemos";

type OverlayAuditKind =
    | "media-lightbox"
    | "media-picker-dialog"
    | "modal"
    | "onboarding-flow"
    | "popover"
    | "share-modal"
    | "sheet"
    | "tooltip";

export function OverlayAuditEmbed({ kind }: { kind: OverlayAuditKind }) {
    const { locale } = useLocale();
    const params = useSearchParams();
    const variant = params.get("variant") ?? "default";
    const tooltipVariant = variant === "default" ? "icon" : variant;

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            {kind === "media-lightbox" ? (
                <MediaLightboxAuditDemo locale={locale} variant={variant as "default" | "compact" | "metadata"} />
            ) : kind === "media-picker-dialog" ? (
                <MediaPickerDialogAuditDemo locale={locale} variant={variant as "default" | "single" | "compact" | "empty"} />
            ) : kind === "modal" ? (
                <ModalAuditDemo locale={locale} variant={variant as "default" | "destructive" | "form" | "no-footer" | "tabs"} />
            ) : kind === "onboarding-flow" ? (
                <OnboardingFlowAuditDemo locale={locale} variant={variant as "default" | "compact" | "controlled" | "complete"} />
            ) : kind === "popover" ? (
                <PopoverAuditDemo locale={locale} variant={variant as "default" | "filter" | "confirm" | "status"} />
            ) : kind === "share-modal" ? (
                <ShareModalAuditDemo locale={locale} variant={variant as "default" | "private" | "stats"} />
            ) : kind === "sheet" ? (
                <SheetAuditDemo locale={locale} variant={variant as "settings" | "left" | "bottom" | "top" | "scroll"} />
            ) : (
                <TooltipAuditDemo locale={locale} variant={tooltipVariant as "icon" | "shortcut" | "disabled" | "long" | "placement"} />
            )}
        </div>
    );
}
