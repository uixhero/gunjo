"use client";

import { ToastProvider, useToast } from "@gunjo/ui";

const TriggerButtons = () => {
    const { showToast } = useToast();
    return (
        <div className="flex gap-4">
            <button
                onClick={() => showToast("Success!", "success")}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-strong"
            >
                Success Toast
            </button>
            <button
                onClick={() => showToast("Error occurred", "error")}
                className="rounded-md bg-destructive-strong px-4 py-2 text-destructive-strong-foreground hover:bg-destructive-strong"
            >
                Error Toast
            </button>
        </div>
    )
}

export function ToastProviderDemo() {
    return (
        <div className="relative rounded-lg border border-border p-8">
            <ToastProvider>
                {/* Note: In a real app ToastProvider wraps the root layout. 
              Here we wrap the demo area, but toasts use fixed positioning so they might appear at the top of the window, 
              which is fine for the demo. */}
                <TriggerButtons />
            </ToastProvider>
        </div>
    );
}
