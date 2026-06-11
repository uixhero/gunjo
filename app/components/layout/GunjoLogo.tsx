"use client";

import * as React from "react";
import { cn } from "@gunjo/ui";

type GunjoLogoProps = React.HTMLAttributes<HTMLSpanElement> & {
    label?: string;
};

export function GunjoLogo({ className, label = "Gunjo UI", ...props }: GunjoLogoProps) {
    return (
        <span className="inline-flex items-center" aria-label={label} role="img">
            <span
                aria-hidden
                className={cn(
                    "block h-8 w-[3.75rem] bg-primary [mask:url('/gunjo-logo.svg')_center/contain_no-repeat] [-webkit-mask:url('/gunjo-logo.svg')_center/contain_no-repeat]",
                    className
                )}
                {...props}
            />
        </span>
    );
}
