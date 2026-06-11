"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    FloatingPanel,
    SpatialCanvas,
    ShareModal,
    ToastProvider,
    useToast,
    Button,
    FileUploader,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    InspectorPanel,
    InspectorSection,
    InspectorField,
    Input,
    Select,
    Switch,
    CommandPalette,
    Alert,
    AlertDescription,
    AlertTitle,
    Kbd,
    ToggleGroup,
    ToggleGroupItem,
} from "@gunjo/ui";
import {
    IconBold as Bold,
    IconBox as Box,
    IconCalculator as Calculator,
    IconCalendar as CalendarIcon,
    IconCreditCard as CreditCard,
    IconItalic as Italic,
    IconPointer as MousePointer2,
    IconSettings as Settings,
    IconStack2 as Layers,
    IconTerminal2 as Terminal,
    IconUnderline as Underline,
} from "@tabler/icons-react";

export function FloatingPanelDemo() {
    return (
        <div className="relative h-[400px] w-full bg-muted/50 rounded-xl overflow-hidden p-8 flex items-center justify-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <FloatingPanel title="Tools" className="w-64 h-80 absolute left-8 top-8" variant="glass">
                <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 p-2 hover:bg-muted/70 rounded-md cursor-pointer transition-colors">
                        <MousePointer2 size={16} />
                        <span className="text-sm">Select</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-muted/70 rounded-md cursor-pointer transition-colors">
                        <Box size={16} />
                        <span className="text-sm">Rectangle</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-muted/70 rounded-md cursor-pointer transition-colors">
                        <Layers size={16} />
                        <span className="text-sm">Layers</span>
                    </div>
                </div>
            </FloatingPanel>

            <FloatingPanel title="Properties" className="w-64 h-64 absolute right-8 bottom-8" variant="solid">
                <div className="p-4">
                    <div className="text-sm text-muted-foreground">Selected Item</div>
                    <div className="font-semibold">Rectangle 1</div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="bg-muted/70 p-2 rounded text-xs">X: 240</div>
                        <div className="bg-muted/70 p-2 rounded text-xs">Y: 120</div>
                        <div className="bg-muted/70 p-2 rounded text-xs">W: 300</div>
                        <div className="bg-muted/70 p-2 rounded text-xs">H: 200</div>
                    </div>
                </div>
            </FloatingPanel>
        </div>
    );
}

export function SpatialCanvasDemo() {
    return (
        <div className="h-[400px] border rounded-xl overflow-hidden relative">
            <SpatialCanvas gridSize={40}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-background p-6 rounded-xl shadow-xl border border-border pointer-events-auto">
                        <h3 className="font-bold mb-2">Infinite Canvas</h3>
                        <p className="text-sm text-muted-foreground max-w-[200px]">
                            This component provides a pannable, zoomable-ready background grid optimized for creative tools.
                        </p>
                    </div>
                </div>
            </SpatialCanvas>
        </div>
    );
}

export function ShareModalDemo() {
    const [isOpen, setIsOpen] = useState(false);

    // Mock item data
    const [item, setItem] = useState({
        id: "demo-item-123",
        share: {
            isPublic: true,
            token: "abc-123-xyz",
            accessCount: 42,
        }
    });

    const handleUpdate = (id: string, updates: any) => {
        console.log("Updated", id, updates);
        setItem(prev => ({ ...prev, share: { ...prev.share, ...updates.share } }));
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg border">
            <Button onClick={() => setIsOpen(true)}>
                Open Share Modal
            </Button>

            {/* 
              Note: ShareModal uses React Portal which mounts to document.body.
              In this preview it might appear outside the container, but that's expected behavior for Modals.
              We pass a dummy API endpoint to prevent 404s in demo.
            */}
            <ShareModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                item={item}
                onUpdate={handleUpdate}
                apiEndpoint="/api/mock-share"
            />
        </div>
    );
}

// Inner component to use the hook
const ToastTriggerButton = () => {
    const { showToast } = useToast();
    return (
        <div className="flex gap-4">
            <Button onClick={() => showToast("Success! Item saved.", "success")}>
                Show Success Toast
            </Button>
            <Button variant="destructive" onClick={() => showToast("Error! Something went wrong.", "error")}>
                Show Error Toast
            </Button>
        </div>
    );
};

export function ToastProviderDemo() {
    return (
        <ToastProvider>
            <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg border">
                <ToastTriggerButton />
                <p className="mt-4 text-xs text-muted-foreground">
                    Click buttons to trigger toasts. The provider is wrapping this demo area.
                </p>
            </div>
        </ToastProvider>
    );
}

export function FileUploaderDemo() {
    const { locale } = useLocale();
    const labels = locale === "ja"
        ? {
            browse: "ファイルを選択",
            drop: "またはドラッグ＆ドロップ",
            removeFile: "ファイルを削除",
            fileTooLarge: "ファイルサイズが上限を超えています",
            maxSize: (sizeMb: number) => `最大 ${sizeMb}MB`,
        }
        : undefined;

    return (
        <FormGroup className="w-full max-w-md">
            <FormLabel>{locale === "ja" ? "添付ファイル" : "Attachments"}</FormLabel>
            <FormControl>
                <FileUploader labels={labels} />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "画像や資料を追加できます。" : "Drop files here or browse from your device."}
            </FormDescription>
        </FormGroup>
    );
}

export function InspectorPanelDemo() {
    return (
        <div className="w-[300px] h-[500px] border rounded-xl overflow-hidden shadow-lg bg-background">
            <InspectorPanel
                title="Rectangle 1"
                footer={
                    <div className="flex justify-between w-full">
                        <Button variant="ghost" size="sm">Reset</Button>
                        <Button size="sm">Apply</Button>
                    </div>
                }
            >
                <InspectorSection title="Layout">
                    <div className="grid grid-cols-2 gap-2">
                        <InspectorField label="X">
                            <Input defaultValue="0" className="h-8" />
                        </InspectorField>
                        <InspectorField label="Y">
                            <Input defaultValue="0" className="h-8" />
                        </InspectorField>
                        <InspectorField label="W">
                            <Input defaultValue="240" className="h-8" />
                        </InspectorField>
                        <InspectorField label="H">
                            <Input defaultValue="160" className="h-8" />
                        </InspectorField>
                    </div>
                </InspectorSection>

                <InspectorSection title="Appearance">
                    <InspectorField label="Fill">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded border bg-primary"></div>
                            <Input defaultValue="hsl(var(--primary))" className="flex-1 h-8" />
                        </div>
                    </InspectorField>
                    <InspectorField label="Opacity">
                        <div className="flex items-center gap-2">
                            <Input defaultValue="100%" className="flex-1 h-8" />
                        </div>
                    </InspectorField>
                </InspectorSection>
                <InspectorSection title="Settings">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground">Visible</span>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-foreground">Locked</span>
                        <Switch />
                    </div>
                </InspectorSection>
            </InspectorPanel>
        </div>
    );
}

export function CommandPaletteDemo() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className="w-[600px] flex justify-center p-10 bg-muted/50 rounded-lg">
            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                    Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">⌘</span>K</kbd>
                </p>
                <Button variant="outline" onClick={() => setOpen(true)}>Open Command Palette</Button>
            </div>
            <CommandPalette
                open={open}
                onOpenChange={setOpen}
                groups={[
                    {
                        heading: "Suggestions",
                        items: [
                            { id: "calendar", label: "Calendar", icon: <CalendarIcon />, action: () => console.log("Calendar") },
                            { id: "search-emoji", label: "Search Emoji", icon: <Calculator />, action: () => console.log("Emoji") },
                            { id: "calculator", label: "Calculator", icon: <Calculator />, action: () => console.log("Calc") },
                        ]
                    },
                    {
                        heading: "Settings",
                        items: [
                            { id: "profile", label: "Profile", icon: <CreditCard />, action: () => console.log("Profile") },
                            { id: "billing", label: "Billing", icon: <CreditCard />, action: () => console.log("Billing") },
                            { id: "settings", label: "Settings", icon: <Settings />, shortcut: "⌘S", action: () => console.log("Settings") },
                        ]
                    }
                ]}
            />
        </div>
    )
}

export function AlertDemo() {
    return (
        <div className="w-full max-w-md space-y-4">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can add components to your app using the cli.
                </AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Your session has expired. Please log in again.
                </AlertDescription>
            </Alert>
        </div>
    )
}

export function KbdDemo() {
    return (
        <div className="w-full flex justify-center p-10 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
                Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search
            </div>
        </div>
    )
}

export function ToggleGroupDemo() {
    const { locale } = useLocale();

    return (
        <div className="w-full flex justify-center p-10 bg-muted/50 rounded-lg">
            <ToggleGroup type="multiple" defaultValue={["bold"]}>
                <ToggleGroupItem value="bold" aria-label={locale === "ja" ? "太字" : "Bold"}>
                    <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label={locale === "ja" ? "斜体" : "Italic"}>
                    <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label={locale === "ja" ? "下線" : "Underline"}>
                    <Underline className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}
