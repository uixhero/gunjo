"use client";

import { Modal } from "@gunjo/ui";
import { useState } from "react";

export function ModalDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary-strong"
            >
                Open Modal
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Modal">
                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        This is a standardized modal component. It handles backdrop clicks, escape key presses, and animations automatically.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary-strong"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
