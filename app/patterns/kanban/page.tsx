"use client"

import { notFound } from "next/navigation";
import {
    KanbanTemplate,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    SidebarItem
} from "@gunjo/ui";
import {
    IconDots as MoreHorizontal,
    IconFilter as Filter,
    IconPlus as Plus,
    IconSearch as Search,
} from "@tabler/icons-react";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../_lib/MarqueeChrome";

export default function KanbanExample() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <MarqueeChrome
            slug="kanban"
            routeBase="/patterns/kanban"
            defaultPath="/"
            navigablePaths={["/"]}
            tabTitle="Gunjo Kanban"
        >
            {(viewport) => <KanbanPattern viewport={viewport} />}
        </MarqueeChrome>
    )
}

function KanbanPattern({ viewport }: { viewport: MarqueeViewport }) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <KanbanTemplate
            className="h-full w-full"
            style={{ width, height }}
            header={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold">Q4 Roadmap</h1>
                        <div className="flex items-center -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted"></div>)}
                            <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">+4</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filter</Button>
                        <Button variant="outline" size="sm"><Search size={16} className="mr-2" /> Search</Button>
                        <Button size="sm"><Plus size={16} className="mr-2" /> New Issue</Button>
                    </div>
                </div>
            }
            sidebar={
                <div className="h-full flex flex-col py-4 gap-2">
                    <div className="px-4 py-2 text-lg font-bold">Project A</div>
                    <div className="px-2">
                        <SidebarItem icon={<div />} isActive={true} onClick={() => { }} id="board" label="Board" />
                        <SidebarItem icon={<div />} isActive={false} onClick={() => { }} id="list" label="List View" />
                        <SidebarItem icon={<div />} isActive={false} onClick={() => { }} id="timeline" label="Timeline" />
                    </div>
                </div>
            }
        >
            {["Backlog", "In Progress", "In Review", "Done"].map((col) => (
                <div key={col} className="flex h-full w-[350px] flex-col rounded-lg bg-muted/50 border">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <h3 className="font-semibold text-sm">{col} <span className="ml-2 text-muted-foreground text-xs font-normal">3</span></h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                            <CardContent className="p-4 space-y-2">
                                <div className="text-sm font-medium leading-none">Implement Authentication</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary-subtle text-primary-subtle-foreground font-medium">Frontend</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                            <CardContent className="p-4 space-y-2">
                                <div className="text-sm font-medium leading-none">Design System Updates</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-medium">Design</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                            <CardContent className="p-4 space-y-2">
                                <div className="text-sm font-medium leading-none">Fix Mobile Layout</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-destructive-subtle text-destructive-subtle-foreground font-medium">Bug</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="p-3 pt-0">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground"><Plus size={16} className="mr-2" /> Add Card</Button>
                    </div>
                </div>
            ))}
        </KanbanTemplate>
    )
}
