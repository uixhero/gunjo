import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function ModalDocPage() {
    return (
        <OverlayAuditDocPage
            kind="modal"
            title={overlayMetadata.modal.title}
            description={overlayMetadata.modal.description}
        />
    );
}
