"use client";

import { useState } from "react";
import { Toast, Button } from "@gunjo/ui"; // Wait, button not yet exported or created?
// I will use a standard HTML button style for the demo if Button is not ready, or create a quick wrapper.
// Actually Button was in Atoms plan but not implemented in package index? Re-check index.ts.
// It is NOT in index.ts. I will implement a local button for now.

export function ToastDemo() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={() => setIsVisible(true)}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary-strong"
            >
                Show Toast
            </button>

            <div className="relative h-12 w-full flex justify-center">
                <Toast
                    isVisible={isVisible}
                    message="Operation successful!"
                    type="success"
                    onClose={() => setIsVisible(false)}
                />
            </div>
            {/* Note: In real usage, Toast is usually fixed. Here it might be absolute within the preview container if we change CSS, 
           but the extracted Toast component has had 'fixed' removed, so it will render in flow! 
           This is perfect for the preview. */}
        </div>
    );
}
