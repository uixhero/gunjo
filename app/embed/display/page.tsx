"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    AssetCard,
    Avatar,
    AvatarFallback,
    AvatarGroup,
    Badge,
    Card,
    CardContent,
} from "@gunjo/ui";

const asset = {
    id: "display-thumb",
    title: "campaign_visual.png",
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=480&q=80",
    width: 1200,
    height: 900,
    type: "PNG",
    size: "1.2MB",
    createdAt: "2026-05-18",
    isFavorite: true,
    score: "8.4",
};

export default function DisplayEmbedPage() {
    return (
        <div className="grid min-h-screen place-items-center bg-background p-8 text-foreground">
            <Card className="w-[720px] max-w-full">
                <CardContent className="grid gap-5 p-6 md:grid-cols-[220px_minmax(0,1fr)]">
                    <AssetCard asset={asset} selected />
                    <div className="space-y-5">
                        <div className="flex items-center justify-between gap-3">
                            <AvatarGroup max={3}>
                                {["AK", "ST", "YY", "MK"].map((initials) => (
                                    <Avatar key={initials}>
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </AvatarGroup>
                            <div className="flex gap-2">
                                <Badge>Active</Badge>
                                <Badge variant="outline">P2</Badge>
                            </div>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details">
                                <AccordionTrigger>Campaign details</AccordionTrigger>
                                <AccordionContent>
                                    Status, ownership, and metadata can be revealed without overwhelming the first view.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
