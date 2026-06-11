"use client";

import { BannalyzeTemplateDemo } from "@/components/demos/BannalyzeTemplateDemo";
import { notFound } from "next/navigation";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../_lib/MarqueeChrome";

export default function BannalyzeExamplePage() {
    if (process.env.NODE_ENV === "production") notFound();

    return (
        <MarqueeChrome
            slug="bannalyze"
            routeBase="/patterns/bannalyze"
            defaultPath="/"
            navigablePaths={["/"]}
            tabTitle="Bannalyze"
        >
            {(viewport) => <BannalyzePattern viewport={viewport} />}
        </MarqueeChrome>
    );
}

function BannalyzePattern({ viewport }: { viewport: MarqueeViewport }) {
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];

    return (
        <div className="bg-background" style={{ width, height }}>
            <BannalyzeTemplateDemo className="h-full w-full" />
        </div>
    );
}
