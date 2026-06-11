"use client";

import { Stepper } from "@gunjo/ui";

export function StepperDemo() {
    return (
        <div className="flex flex-col gap-8">
            <Stepper
                orientation="horizontal"
                steps={[
                    { label: "Account", state: "completed" },
                    { label: "Profile", state: "current" },
                    { label: "Confirm", state: "upcoming" },
                ]}
            />
            <Stepper
                orientation="vertical"
                steps={[
                    { label: "Account", state: "completed" },
                    { label: "Profile", state: "current" },
                    { label: "Confirm", state: "upcoming" },
                ]}
            />
        </div>
    );
}
