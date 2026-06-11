"use client";

import React, { useState } from "react";
import { Toast, Modal, SidebarItem, Button, Input } from "@gunjo/ui";
import { IconFileTypeJpg as FileImage, IconFolder as Folder } from "@tabler/icons-react";

export function ToastDemo() {
    const [isVisible, setIsVisible] = useState(false);
    const [type, setType] = useState<"success" | "error" | "info">("success");

    const showToast = (t: "success" | "error" | "info") => {
        setType(t);
        setIsVisible(true);
    };

    return (
        <div className="flex flex-col gap-4 items-start">
            <div className="flex gap-2">
                <Button onClick={() => showToast("success")}>Success Toast</Button>
                <Button variant="destructive" onClick={() => showToast("error")}>Error Toast</Button>
                <Button variant="outline" onClick={() => showToast("info")}>Info Toast</Button>
            </div>

            {/* Positioned relatively for demo purposes, usually fixed */}
            <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/50">
                <div className="absolute top-4">
                    <Toast
                        message={`This is a ${type} message!`}
                        type={type}
                        isVisible={isVisible}
                        onClose={() => setIsVisible(false)}
                    />
                </div>
            </div>
        </div>
    );
}

export function ModalDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Example Modal"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This is a modal dialog. It overlays the page content.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Input Field</label>
                        <Input placeholder="Type something..." />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export function SidebarItemDemo() {
    const [activeId, setActiveId] = useState("item-1");

    return (
        <div className="w-64 space-y-1 rounded-lg border bg-background p-2">
            <SidebarItem
                id="item-1"
                icon={<Folder size={16} />}
                label="Projects"
                isActive={activeId === "item-1"}
                onClick={() => setActiveId("item-1")}
                hasChildren
                isExpanded={true}
            />
            <SidebarItem
                id="item-2"
                icon={<FileImage size={16} />}
                label="Images"
                isActive={activeId === "item-2"}
                onClick={() => setActiveId("item-2")}
                level={1}
                count={24}
            />
            <SidebarItem
                id="item-3"
                icon={<FileImage size={16} />}
                label="Documents"
                isActive={activeId === "item-3"}
                onClick={() => setActiveId("item-3")}
                level={1}
                count={5}
            />
            <SidebarItem
                id="item-4"
                icon={<FileImage size={16} />}
                label="Flat navigation"
                isActive={activeId === "item-4"}
                onClick={() => setActiveId("item-4")}
                reserveChevronSpace={false}
            />
        </div>
    );
}
