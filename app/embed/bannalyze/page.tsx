"use client";

import { BannalyzeTemplateDemo } from "@/components/demos/BannalyzeTemplateDemo";

export default function Embed() {
    // BannalyzeTemplate is an application shell: its header / canvas / inspector
    // divide up a screen that already has a height. Handed no height, every
    // `h-full` inside it falls back to `auto`, the inspector stops scrolling and
    // stretches the whole shell past the preview frame, and the version bar at
    // the bottom of the canvas is cut off. The embed is that screen, so it is
    // the one that supplies the height.
    return (
        <div className="h-screen w-full">
            <BannalyzeTemplateDemo />
        </div>
    );
}
