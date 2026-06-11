import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function MediaPickerDialogDocPage() {
    return (
        <OverlayAuditDocPage
            kind="media-picker-dialog"
            title={overlayMetadata.mediaPickerDialog.title}
            description={overlayMetadata.mediaPickerDialog.description}
        />
    );
}
