import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function MediaLightboxDocPage() {
    return (
        <OverlayAuditDocPage
            kind="media-lightbox"
            title={overlayMetadata.mediaLightbox.title}
            description={overlayMetadata.mediaLightbox.description}
        />
    );
}
