"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    ScrollArea,
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Button,
    Input,
    Label,
    Separator
} from "@gunjo/ui";
import { IconCalendarEvent as CalendarDays } from "@tabler/icons-react";

export function AvatarDemo() {
    return (
        <div className="flex gap-4">
            <Avatar aria-label="Aoi Hana" tooltip="Aoi Hana" presence="online" presenceLabel="Online">
                <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                <AvatarFallback>AH</AvatarFallback>
            </Avatar>
            <Avatar aria-label="Jun Doi" tooltip="Jun Doi">
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        </div>
    )
}

export function HoverCardDemo() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link">@nextjs</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@nextjs</h4>
                        <p className="text-sm">
                            The React Framework – created and maintained by @vercel.
                        </p>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                                Joined December 2021
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export function ResizableDemo() {
    return (
        <ResizablePanelGroup direction="horizontal" defaultLayout={{ one: 50, nested: 50 }} className="max-w-md rounded-lg border h-[200px]">
            <ResizablePanel id="one" defaultSize="50%">
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="nested" defaultSize="50%">
                <ResizablePanelGroup direction="vertical" defaultLayout={{ two: 25, three: 75 }}>
                    <ResizablePanel id="two" defaultSize="25%">
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Two</span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel id="three" defaultSize="75%">
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Three</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export function ScrollAreaDemo() {
    return (
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
            <div className="mb-4 text-sm font-medium leading-none">Tags</div>
            {Array.from({ length: 50 }).map((_, i, a) => (
                <div key={i}>
                    <div className="text-sm">
                        v1.2.0-beta.{a.length - i}
                    </div>
                    <Separator className="my-2" />
                </div>
            ))}
        </ScrollArea>
    )
}

export function SheetDemo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" defaultValue="@peduarte" className="col-span-3" />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
