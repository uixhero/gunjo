"use client";

import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "/mo",
        description: "For personal projects.",
        features: ["Up to 5 users", "Community support", "Open-source components"],
        cta: <Button variant="outline" className="w-full">Get started</Button>,
    },
    {
        id: "pro",
        name: "Pro",
        price: "$29",
        period: "/mo",
        description: "For growing teams.",
        features: [
            "Unlimited users",
            "Priority support",
            "Advanced templates",
            "SSO & SAML",
        ],
        cta: <Button variant="secondary" className="w-full">Start trial</Button>,
        featured: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        description: "For larger organizations.",
        features: ["SLA + audit logs", "Dedicated success manager", "Custom integrations"],
        cta: <Button variant="outline" className="w-full">Contact sales</Button>,
    },
];

export function PricingTemplateDemo() {
    return (
        <div className="overflow-hidden rounded-md border bg-background">
            <PricingTemplate plans={PLANS} />
        </div>
    );
}
