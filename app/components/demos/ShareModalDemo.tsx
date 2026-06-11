"use client";

import { ShareModal, ShareableItem, Button } from "@gunjo/ui";
import { useState } from "react";

export function ShareModalDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [item, setItem] = useState<ShareableItem>({
        id: "demo-item-1",
        share: {
            isPublic: true,
            token: "abcdef123456",
            accessCount: 42,
            createdAt: new Date().toISOString()
        }
    });

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                Share this Item
            </Button>

            <ShareModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                item={item}
                onUpdate={(id, updates) => {
                    setItem(prev => ({ ...prev, ...updates }));
                }}
            // In a real app this points to your API.
            // For demo, the component will try to fetch but fail or we can intercept if we could.
            // The component is designed to fetch /api/share.
            // We will accept that it spins or fails gracefully in demo unless we mock fetch.
            />
        </>
    );
}
