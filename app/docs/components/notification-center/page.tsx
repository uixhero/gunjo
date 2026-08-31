"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import feedbackMetadata from "@design/feedback-metadata.json";
import { NotificationCenter, type Notification, type NotificationCenterLabels } from "@gunjo/ui";
import { useState } from "react";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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

const codeByLocale = {
    ja: `import { NotificationCenter, type Notification, type NotificationCenterLabels } from "@gunjo/ui"
import { useState } from "react"

const labels: NotificationCenterLabels = {
  toggle: "通知を開く",
  title: "通知",
  clearAll: "すべて既読",
  emptyTitle: "通知はありません",
  markAsRead: "既読にする",
  viewHistory: "通知履歴をすべて見る",
}

const initialNotifications: Notification[] = [
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
}`,
    en: `import { NotificationCenter, type Notification, type NotificationCenterLabels } from "@gunjo/ui"
import { useState } from "react"

const labels: NotificationCenterLabels = {
  toggle: "Open notifications",
  title: "Notifications",
  clearAll: "Clear all",
  emptyTitle: "No notifications",
  markAsRead: "Mark as read",
  viewHistory: "View all notification history",
}

const initialNotifications: Notification[] = [
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
}`,
};

export default function NotificationCenterDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const labels = isJa ? jaLabels : enLabels;
    const notifications = isJa ? jaNotifications : enNotifications;
    const allReadNotifications = notifications.map((notification) => ({ ...notification, read: true }));
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const code = codeByLocale[locale];

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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: 通知センター（Notification Center）" : "UIXHERO: Notification Center (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/notification-center`,
                },
            ]}
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>未読は数ではなく点で出す。</strong>資料は「未読バッジは 9+ や 99+ で上限を設ける」を挙げています。GUNJO は数を出すのをやめ、ベルの右上に小さな点を1つ置くだけにしました。上限をいくつにするかを部品が決めずに済み、1件でも100件でも「まだ見ていないものがある」という同じ意味だけを伝えます。件数を見せたい画面は、渡した <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">notifications</code> を呼ぶ側で数えます。
                        </li>
                        <li>
                            <strong>通知が無いときの画面を部品が持つ。</strong>0件のとき、薄いベルのアイコンと <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">emptyTitle</code> の一文が出ます。空のときの表示を呼ぶ側が書き忘れて、開いたら真っ白、が起きません。
                        </li>
                        <li>
                            <strong>一括既読と設定への導線は、口だけ用意した。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onClearAll</code> を渡したときだけ、しかも未読があるときだけ「すべて既読」が出ます。押した先で何が起きるかは呼ぶ側が決めます。資料が挙げる時系列のグループ化（今日・今週・それ以前）は、GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">NotificationCenter</code> にはまだありません。並び順は渡した配列のままです。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Unread is a dot, not a number.</strong> The article asks for an unread badge capped at 9+ or 99+. GUNJO drops the number entirely and places a single small dot on the bell. No cap has to be chosen by the component, and one unread item and a hundred unread items say the same thing: there is something you have not seen. A screen that wants the count can derive it from the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">notifications</code> it already passes in.
                        </li>
                        <li>
                            <strong>The empty screen belongs to the component.</strong> With zero notifications it renders a faded bell and the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">emptyTitle</code> line, so a caller cannot forget the empty case and leave the panel blank.
                        </li>
                        <li>
                            <strong>Mark-all-read and the settings link are slots, not behaviour.</strong> Clear all appears only when <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onClearAll</code> is supplied and only while something is unread. What it does is decided by the caller. Note that the time grouping the article recommends (today, this week, earlier) is not in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">NotificationCenter</code> yet: the order is exactly the array you pass.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
