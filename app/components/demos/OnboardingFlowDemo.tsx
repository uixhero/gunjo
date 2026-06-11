"use client";

import * as React from "react";
import {
    Input,
    Label,
    OnboardingFlow,
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
                    <Label htmlFor="ob-name">Display name</Label>
                    <Input id="ob-name" placeholder="alice" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ob-org">Organization</Label>
                    <Input id="ob-org" placeholder="Acme Inc." />
                </div>
            </div>
        ),
    },
    {
        id: "workspace",
        title: "Set up your workspace",
        description: "Configure team preferences and invite members.",
        content: (
            <p className="text-sm text-muted-foreground">
                You can invite teammates after setup. Default permissions are read-only.
            </p>
        ),
    },
    {
        id: "done",
        title: "You're all set!",
        description: "Start exploring the dashboard.",
        content: (
            <p className="text-sm text-muted-foreground">
                We&apos;ve prepared a starter project. Click Finish to enter your workspace.
            </p>
        ),
    },
];

export function OnboardingFlowDemo() {
    const [completed, setCompleted] = React.useState(false);

    if (completed) {
        return (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                Onboarding complete. 🎉
                <button
                    type="button"
                    onClick={() => setCompleted(false)}
                    className="ml-3 text-xs underline"
                >
                    Restart
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg">
            <OnboardingFlow steps={STEPS} onComplete={() => setCompleted(true)} />
        </div>
    );
}
