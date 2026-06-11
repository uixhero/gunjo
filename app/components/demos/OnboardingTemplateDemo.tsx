"use client";

import * as React from "react";
import {
    Input,
    Label,
    OnboardingFlow,
    OnboardingTemplate,
    type OnboardingStep,
} from "@gunjo/ui";

const STEPS: OnboardingStep[] = [
    {
        id: "profile",
        title: "Create your profile",
        description: "Tell us a bit about yourself.",
        content: (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ot-name">Display name</Label>
                    <Input id="ot-name" placeholder="alice" />
                </div>
            </div>
        ),
    },
    {
        id: "workspace",
        title: "Set up your workspace",
        description: "Configure team preferences.",
        content: (
            <p className="text-sm text-muted-foreground">
                You can invite teammates after setup.
            </p>
        ),
    },
];

export function OnboardingTemplateDemo() {
    const [done, setDone] = React.useState(false);

    return (
        <div className="overflow-hidden rounded-md border">
            <div className="h-[440px] overflow-hidden">
                <OnboardingTemplate
                    hero={
                        <>
                            <p className="text-2xl font-bold tracking-tight">
                                Welcome 👋
                            </p>
                            <p className="text-sm text-background/70">
                                Let&apos;s get you set up in just a couple of steps.
                            </p>
                        </>
                    }
                >
                    {done ? (
                        <p className="text-sm text-muted-foreground">
                            All set! 🎉{" "}
                            <button
                                type="button"
                                onClick={() => setDone(false)}
                                className="underline"
                            >
                                Restart
                            </button>
                        </p>
                    ) : (
                        <OnboardingFlow steps={STEPS} onComplete={() => setDone(true)} />
                    )}
                </OnboardingTemplate>
            </div>
        </div>
    );
}
