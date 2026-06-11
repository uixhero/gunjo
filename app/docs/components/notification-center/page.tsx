"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { NotificationCenter, type Notification, type NotificationCenterLabels } from "@gunjo/ui";
import { useState } from "react";

const jaLabels: NotificationCenterLabels = {
    toggle: "通知を開く",
    title: "通知",
    clearAll: "すべて既読",
    emptyTitle: "通知はありません",
    markAsRead: "既読にする",
    viewHistory: "通知履歴をすべて見る",
};

const enLabels: NotificationCenterLabels = {
    toggle: "Open notifications",
    title: "Notifications",
    clearAll: "Clear all",
    emptyTitle: "No notifications",
    markAsRead: "Mark as read",
    viewHistory: "View all notification history",
};

const jaNotifications: Notification[] = [
    {
        id: "project-approved",
        title: "レビューが承認されました",
        description: "デザインシステムの更新レビューが承認されました。",
        timestamp: "5分前",
        read: false,
    },
    {
        id: "comment",
        title: "新しいコメント",
        description: "Hikaby がプルリクエストにコメントしました。",
        timestamp: "1時間前",
        read: false,
    },
    {
        id: "deploy",
        title: "デプロイ完了",
        description: "本番デプロイ #1234 が完了しました。",
        timestamp: "昨日",
        read: true,
    },
];

const enNotifications: Notification[] = [
    {
        id: "project-approved",
        title: "Review approved",
        description: "The design-system update review was approved.",
        timestamp: "5 mins ago",
        read: false,
    },
    {
        id: "comment",
        title: "New comment",
        description: "Hikaby commented on your pull request.",
        timestamp: "1 hour ago",
        read: false,
    },
    {
        id: "deploy",
        title: "Deployment complete",
        description: "Production deployment #1234 completed successfully.",
        timestamp: "Yesterday",
        read: true,
    },
];

function NotificationCenterPreview({
    initialNotifications,
    labels,
}: {
    initialNotifications: Notification[];
    labels: NotificationCenterLabels;
}) {
    const [notifications, setNotifications] = useState(initialNotifications);

    return (
        <NotificationCenter
            notifications={notifications}
            labels={labels}
            onMarkAsRead={(id) =>
                setNotifications((current) =>
                    current.map((notification) =>
                        notification.id === id ? { ...notification, read: true } : notification
                    )
                )
            }
            onClearAll={() =>
                setNotifications((current) =>
                    current.map((notification) => ({ ...notification, read: true }))
                )
            }
        />
    );
}

export default function NotificationCenterDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const labels = isJa ? jaLabels : enLabels;
    const notifications = isJa ? jaNotifications : enNotifications;
    const allReadNotifications = notifications.map((notification) => ({ ...notification, read: true }));
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = `import { NotificationCenter, type Notification, type NotificationCenterLabels } from "@gunjo/ui"
import { useState } from "react"

const labels: NotificationCenterLabels = {
  toggle: "${isJa ? "通知を開く" : "Open notifications"}",
  title: "${isJa ? "通知" : "Notifications"}",
  clearAll: "${isJa ? "すべて既読" : "Clear all"}",
  emptyTitle: "${isJa ? "通知はありません" : "No notifications"}",
  markAsRead: "${isJa ? "既読にする" : "Mark as read"}",
  viewHistory: "${isJa ? "通知履歴をすべて見る" : "View all notification history"}",
}

const initialNotifications: Notification[] = [
  {
    id: "project-approved",
    title: "${isJa ? "レビューが承認されました" : "Review approved"}",
    description: "${isJa ? "デザインシステムの更新レビューが承認されました。" : "The design-system update review was approved."}",
    timestamp: "${isJa ? "5分前" : "5 mins ago"}",
    read: false,
  },
  {
    id: "comment",
    title: "${isJa ? "新しいコメント" : "New comment"}",
    description: "${isJa ? "Hikaby がプルリクエストにコメントしました。" : "Hikaby commented on your pull request."}",
    timestamp: "${isJa ? "1時間前" : "1 hour ago"}",
    read: false,
  },
  {
    id: "deploy",
    title: "${isJa ? "デプロイ完了" : "Deployment complete"}",
    description: "${isJa ? "本番デプロイ #1234 が完了しました。" : "Production deployment #1234 completed successfully."}",
    timestamp: "${isJa ? "昨日" : "Yesterday"}",
    read: true,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)

  return (
    <NotificationCenter
      notifications={notifications}
      labels={labels}
      onMarkAsRead={(id) =>
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        )
      }
      onClearAll={() =>
        setNotifications((current) =>
          current.map((notification) => ({ ...notification, read: true }))
        )
      }
    />
  )
}`;

    const emptyCode = code.replace(/const initialNotifications: Notification\[] = \[[\s\S]*?\]\n\nexport function Notifications/, "const initialNotifications: Notification[] = []\n\nexport function Notifications");
    const allReadCode = code.replace(/read: false/g, "read: true");
    const usageCode = code;

    const propsData = [
        {
            name: "notifications",
            type: "Notification[]",
            description: isJa ? "表示する通知データです。" : "Notification items to render.",
            required: true,
        },
        {
            name: "labels",
            type: "NotificationCenterLabels",
            description: isJa ? "トリガー、見出し、空状態、操作名の文言を差し替えます。" : "Overrides trigger, heading, empty-state, and action labels.",
        },
        {
            name: "onMarkAsRead",
            type: "(id: string) => void",
            description: isJa ? "未読通知を既読にする操作で呼び出します。" : "Called when the user marks an unread notification as read.",
        },
        {
            name: "onLinkClick",
            type: "(id: string) => void",
            description: isJa ? "通知行をクリックしたときに呼び出します。" : "Called when a notification row is clicked.",
        },
        {
            name: "onClearAll",
            type: "() => void",
            description: isJa ? "未読通知をまとめて既読にする操作で呼び出します。" : "Called when the user clears all unread notifications.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.notificationCenter.title}
            description={feedbackMetadata.notificationCenter.description}
            usedComponents={[
                { name: "NotificationCenter", href: "/docs/components/notification-center" },
                { name: "Popover", href: "/docs/components/popover" },
                { name: "Button", href: "/docs/components/button" },
                { name: "ScrollArea", href: "/docs/components/scroll-area" },
            ]}
            relatedComponents={[
                { name: "Banner", href: "/docs/components/banner" },
                { name: "Toast", href: "/docs/components/toast" },
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto" previewBodyWidth="md" sectionLabels={sectionLabels}>
                <NotificationCenterPreview initialNotifications={notifications} labels={labels} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "unread",
                            title: isJa ? "未読あり" : "With unread items",
                            description: isJa ? "未読がある場合はトリガーにバッジを出し、行を強調します。" : "Unread notifications show a trigger dot and highlighted rows.",
                            preview: <NotificationCenterPreview initialNotifications={notifications} labels={labels} />,
                            previewBodyWidth: "md",
                            code,
                        },
                        {
                            key: "all-read",
                            title: isJa ? "すべて既読" : "All read",
                            description: isJa ? "未読がない場合はトリガーのバッジと一括既読操作を出しません。" : "When everything is read, the unread dot and clear action are hidden.",
                            preview: <NotificationCenter notifications={allReadNotifications} labels={labels} />,
                            previewBodyWidth: "md",
                            code: allReadCode,
                        },
                        {
                            key: "empty",
                            title: isJa ? "空状態" : "Empty state",
                            description: isJa ? "通知がない場合も、空であることをポップオーバー内で伝えます。" : "The popover still explains that there are no notifications.",
                            preview: <NotificationCenter notifications={[]} labels={labels} />,
                            previewBodyWidth: "md",
                            code: emptyCode,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props ?? "Props"}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage ?? "Usage"}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </section>
        </ComponentLayout>
    );
}
