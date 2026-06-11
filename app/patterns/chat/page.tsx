"use client"

import { notFound } from "next/navigation";
import {
    ChatTemplate,
    Button,
    Input,
    SidebarItem,
    Avatar,
    AvatarFallback,
} from "@gunjo/ui";
import {
    IconHash as Hash,
    IconInfoCircle as Info,
    IconMoodSmile as Smile,
    IconPaperclip as Paperclip,
    IconPhone as Phone,
    IconPlus as Plus,
    IconSend as Send,
    IconVideo as Video,
} from "@tabler/icons-react";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../_lib/MarqueeChrome";

export default function ChatExample() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <MarqueeChrome
            slug="chat"
            routeBase="/patterns/chat"
            defaultPath="/"
            navigablePaths={["/"]}
            tabTitle="Gunjo Chat"
        >
            {(viewport) => <ChatPattern viewport={viewport} />}
        </MarqueeChrome>
    )
}

function ChatPattern({ viewport }: { viewport: MarqueeViewport }) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <ChatTemplate
            className="h-full w-full"
            style={{ width, height }}
            sidebarList={
                <div className="flex flex-col h-full">
                    <div className="h-14 flex items-center px-4 font-bold border-b">
                        Design Team
                    </div>
                    <div className="flex-1 overflow-y-auto py-2 px-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase mb-1 mt-2">Channels</div>
                        <SidebarItem icon={<Hash size={16} />} isActive={true} onClick={() => { }} id="general" label="general" />
                        <SidebarItem icon={<Hash size={16} />} isActive={false} onClick={() => { }} id="design" label="design-system" />
                        <SidebarItem icon={<Hash size={16} />} isActive={false} onClick={() => { }} id="random" label="random" />

                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase mb-1 mt-6">Direct Messages</div>
                        <SidebarItem icon={<div className="h-2 w-2 rounded-full bg-primary" />} isActive={false} onClick={() => { }} id="alice" label="Alice" />
                        <SidebarItem icon={<div className="h-2 w-2 rounded-full bg-muted-foreground" />} isActive={false} onClick={() => { }} id="bob" label="Bob" />
                    </div>
                </div>
            }
            header={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 font-bold p-2">
                        <Hash size={20} className="text-muted-foreground" />
                        general
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Button variant="ghost" size="icon"><Phone size={20} /></Button>
                        <Button variant="ghost" size="icon"><Video size={20} /></Button>
                        <div className="w-px h-6 bg-border mx-1"></div>
                        <Button variant="ghost" size="icon"><Info size={20} /></Button>
                    </div>
                </div>
            }
            composer={
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border">
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Plus size={20} /></Button>
                    <Input className="border-none bg-transparent shadow-none focus-visible:ring-0" placeholder="Message #general" />
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-muted-foreground"><Smile size={20} /></Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground"><Paperclip size={20} /></Button>
                        <Button size="icon"><Send size={18} /></Button>
                    </div>
                </div>
            }
            sidebarDetail={
                <div className="p-6 text-center space-y-4">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted"></div>
                    <div>
                        <h3 className="font-bold text-lg">#general</h3>
                        <p className="text-muted-foreground text-sm">Main team channel for general discussions and announcements.</p>
                    </div>
                    <div className="flex justify-center gap-4 text-sm font-medium">
                        <div className="text-center">
                            <div className="font-bold">24</div>
                            <div className="text-muted-foreground">Members</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">12</div>
                            <div className="text-muted-foreground">Online</div>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 group">
                        <Avatar>
                            <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">User {i}</span>
                                <span className="text-xs text-muted-foreground">10:4{i} AM</span>
                            </div>
                            <p className="text-sm leading-relaxed mt-1">
                                This is a sample message in the chat template. It shows how the layout handles avatars, names, and text content.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ChatTemplate>
    )
}
