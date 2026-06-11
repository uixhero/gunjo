"use client"

import { notFound } from "next/navigation";
import {
    EditorTemplate,
    Button,
    Input,
    Label,
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    SpatialCanvas
} from "@gunjo/ui";
import {
    IconBox as Box,
    IconPlayerPlay as Play,
    IconPointer as MousePointer2,
    IconShare2 as Share2,
    IconStack2 as Layers,
} from "@tabler/icons-react";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../_lib/MarqueeChrome";

export default function EditorExample() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <MarqueeChrome
            slug="editor"
            routeBase="/patterns/editor"
            defaultPath="/"
            navigablePaths={["/"]}
            tabTitle="Gunjo Editor"
        >
            {(viewport) => <EditorPattern viewport={viewport} />}
        </MarqueeChrome>
    )
}

function EditorPattern({ viewport }: { viewport: MarqueeViewport }) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <EditorTemplate
            className="h-full w-full"
            style={{ width, height }}
            topBar={
                <div className="w-full flex items-center px-4 justify-between h-14 border-b bg-background">
                    <div className="flex items-center gap-4">
                        <div className="font-bold text-primary mr-2">Gunjo Design</div>
                        <Menubar className="border-none shadow-none h-auto p-0">
                            <MenubarMenu>
                                <MenubarTrigger className="h-8 data-[state=open]:bg-muted">File</MenubarTrigger>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="h-8 data-[state=open]:bg-muted">Edit</MenubarTrigger>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="h-8 data-[state=open]:bg-muted">View</MenubarTrigger>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Untitled Design</div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost"><Play size={16} className="mr-2" /> Preview</Button>
                        <Button size="sm"><Share2 size={16} className="mr-2" /> Share</Button>
                    </div>
                </div>
            }
            leftPanel={
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b">
                        <Input placeholder="Search layers..." className="h-8" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground mb-2">Artboard 1</div>
                        <div className="px-2 py-1.5 text-sm bg-accent rounded cursor-pointer gap-2 flex items-center">
                            <Box size={14} /> Rectangle 1
                        </div>
                        <div className="px-2 py-1.5 text-sm cursor-pointer gap-2 flex items-center hover:bg-muted/50 rounded">
                            <Box size={14} /> Ellipse 2
                        </div>
                        <div className="px-2 py-1.5 text-sm cursor-pointer gap-2 flex items-center hover:bg-muted/50 rounded">
                            <Layers size={14} /> Group 1
                        </div>
                    </div>
                </div>
            }
            rightPanel={
                <div className="h-full p-4 border-l bg-card overflow-y-auto">
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-4 tracking-wider">Layout</div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <Label className="text-xs">X</Label>
                            <Input defaultValue="10" className="h-8" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Y</Label>
                            <Input defaultValue="240" className="h-8" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">W</Label>
                            <Input defaultValue="100" className="h-8" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">H</Label>
                            <Input defaultValue="100" className="h-8" />
                        </div>
                    </div>

                    <div className="text-xs font-bold text-muted-foreground uppercase mb-4 tracking-wider mt-6">Fill</div>
                    <div className="flex items-center gap-2 p-1 border rounded-md">
                        <div className="h-6 w-6 rounded border bg-primary"></div>
                        <span className="text-sm font-mono">primary</span>
                    </div>
                </div>
            }
        >
            <div className="relative h-full w-full bg-muted/50">
                <SpatialCanvas gridSize={20}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-[600px] w-[800px] items-center justify-center rounded-sm bg-background text-muted shadow-2xl">
                            Canvas Content
                        </div>
                    </div>
                </SpatialCanvas>
                {/* Floating Toolbar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground rounded-full shadow-xl border px-2 py-1.5 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary-subtle text-primary-subtle-foreground"><MousePointer2 size={20} /></Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full"><Box size={20} /></Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full"><Layers size={20} /></Button>
                </div>
            </div>
        </EditorTemplate>
    )
}
