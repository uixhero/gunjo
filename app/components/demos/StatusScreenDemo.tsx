"use client";

import * as React from "react";
import {
    IconClock as Clock,
    IconLock as Lock,
    IconTool as Wrench,
    IconWifiOff as WifiOff,
} from "@tabler/icons-react";
import {
    Button,
    StatusScreen,
    type StatusScreenVariant,
    Tabs,
    TabsList,
    TabsTrigger,
} from "@gunjo/ui";

const VARIANTS: {
    key: StatusScreenVariant;
    label: string;
    icon?: React.ReactNode;
    action: React.ReactNode;
}[] = [
    { key: "not-found", label: "404", action: <Button>Back to home</Button> },
    {
        key: "error",
        label: "500",
        action: <Button>Try again</Button>,
    },
    {
        key: "offline",
        label: "Offline",
        icon: <WifiOff />,
        action: <Button>Retry</Button>,
    },
    {
        key: "forbidden",
        label: "403",
        icon: <Lock />,
        action: <Button variant="outline">Request access</Button>,
    },
    {
        key: "maintenance",
        label: "Maintenance",
        icon: <Wrench />,
        action: <Button variant="outline">Status page</Button>,
    },
    {
        key: "coming-soon",
        label: "Coming soon",
        icon: <Clock />,
        action: <Button>Notify me</Button>,
    },
];

export function StatusScreenDemo() {
    const [variant, setVariant] = React.useState<StatusScreenVariant>(
        "not-found"
    );
    const active = VARIANTS.find((v) => v.key === variant) ?? VARIANTS[0];

    return (
        <div className="w-full space-y-4">
            <Tabs
                value={variant}
                onValueChange={(value) =>
                    setVariant(value as StatusScreenVariant)
                }
            >
                <TabsList className="flex flex-wrap">
                    {VARIANTS.map((v) => (
                        <TabsTrigger key={v.key} value={v.key}>
                            {v.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className="overflow-hidden rounded-lg border bg-background">
                <StatusScreen
                    key={active.key}
                    variant={active.key}
                    icon={active.icon}
                    action={active.action}
                    details={
                        active.key === "error"
                            ? "req-id 7f3c · TypeError"
                            : undefined
                    }
                    className="min-h-[320px]"
                />
            </div>
        </div>
    );
}
