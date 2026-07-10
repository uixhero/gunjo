"use client";

import * as React from "react";
import { Banner } from "@gunjo/ui";
import { IconSpeakerphone as Megaphone } from "@tabler/icons-react";

export function BannerDemo() {
    const [show, setShow] = React.useState(true);

    return (
        <div className="flex flex-col gap-3 w-full">
            {show ? (
                <Banner
                    icon={<Megaphone className="h-4 w-4" />}
                    onDismiss={() => setShow(false)}
                >
                    New: alpha.3 release available — see changelog
                </Banner>
            ) : (
                <button
                    type="button"
                    onClick={() => setShow(true)}
                    className="text-sm text-muted-foreground underline"
                >
                    Show banner again
                </button>
            )}
            <Banner variant="info">Info: scheduled maintenance at 02:00 UTC.</Banner>
            <Banner variant="success">All systems operational.</Banner>
            <Banner variant="warning">Warning: API quota at 85%.</Banner>
            <Banner variant="destructive">Critical: payment failed.</Banner>
        </div>
    );
}
