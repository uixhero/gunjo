import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

export default function OnboardingFlowDocPage() {
    return (
        <OverlayAuditDocPage
            kind="onboarding-flow"
            title={overlayMetadata.onboardingFlow.title}
            description={overlayMetadata.onboardingFlow.description}
        />
    );
}
