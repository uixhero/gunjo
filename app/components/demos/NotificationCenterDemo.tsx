"use client";

import { NotificationCenter } from "@gunjo/ui";

export function NotificationCenterDemo() {
    const notifications = [
        {
            id: "1",
            title: "Project Approved",
            description: "Your project 'Gunjo UI' has been approved for release.",
            timestamp: "5 mins ago",
            read: false
        },
        {
            id: "2",
            title: "New Comment",
            description: "Hikaby commented on your pull request.",
            timestamp: "1 hour ago",
            read: false
        },
        {
            id: "3",
            title: "Deployment Successful",
            description: "Production deployment #1234 completed successfully.",
            timestamp: "Yesterday",
            read: true
        }
    ];

    return (
        <div className="flex justify-end p-4">
            <NotificationCenter
                notifications={notifications}
                onMarkAsRead={(id) => console.log("Mark as read", id)}
                onClearAll={() => console.log("Clear all")}
            />
        </div>
    );
}
