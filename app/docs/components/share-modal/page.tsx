import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function ShareModalDocPage() {
    return (
        <OverlayAuditDocPage
            kind="share-modal"
            title={overlayMetadata.shareModal.title}
            description={overlayMetadata.shareModal.description}
        />
    );
}
