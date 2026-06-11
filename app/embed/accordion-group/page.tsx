"use client";

import {
    AccordionContent,
    AccordionGroup,
    AccordionItem,
    AccordionTrigger,
} from "@gunjo/ui";

export default function Embed() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <AccordionGroup
                values={["billing", "team", "security"]}
                defaultValue={["billing"]}
                label="Settings"
                description="Open what you need, or expand the full group."
                className="w-full max-w-md"
            >
                <AccordionItem value="billing">
                    <AccordionTrigger>Billing settings</AccordionTrigger>
                    <AccordionContent>
                        Review payment methods, invoices, and renewal dates.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="team">
                    <AccordionTrigger>Team settings</AccordionTrigger>
                    <AccordionContent>
                        Manage invitations, permissions, and roles.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="security">
                    <AccordionTrigger>Security</AccordionTrigger>
                    <AccordionContent>
                        Review two-factor authentication, audit logs, and sessions.
                    </AccordionContent>
                </AccordionItem>
            </AccordionGroup>
        </div>
    );
}
