import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function SheetDocPage() {
    return (
        <OverlayAuditDocPage
            kind="sheet"
            title={overlayMetadata.sheet.title}
            description={overlayMetadata.sheet.description}
        />
    );
}
