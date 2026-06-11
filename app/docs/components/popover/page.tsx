import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function PopoverDocPage() {
    return (
        <OverlayAuditDocPage
            kind="popover"
            title={overlayMetadata.popover.title}
            description={overlayMetadata.popover.description}
        />
    );
}
