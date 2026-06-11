import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function TooltipDocPage() {
    return (
        <OverlayAuditDocPage
            kind="tooltip"
            title={overlayMetadata.tooltip.title}
            description={overlayMetadata.tooltip.description}
        />
    );
}
