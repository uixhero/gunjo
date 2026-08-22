"use client";

import * as React from "react";
import { CommentThread, Button, EmptyState, Icon, type CommentItem } from "@gunjo/ui";
import { IconMessageOff } from "@tabler/icons-react";

const JA = {
    resolved: "解決済み",
    unresolved: "未解決",
    markResolved: "解決にする",
    markUnresolved: "未解決に戻す",
    reply: "返信",
    replies: "返信",
};

const INITIAL: CommentItem[] = [
    {
        id: "c1",
        author: { name: "岩井 遼", affiliation: "デジタル推進本部 データ基盤部" },
        timestamp: "7月22日 09:55",
        body: "先方から返ってきた第7条ですが、損害賠償の上限が委託料の12か月分になっています。当社基準は契約金額までなので、このままだと超過します。",
        resolved: false,
        replies: [
            {
                id: "c1r1",
                author: { name: "池田 亮太", affiliation: "法務・コンプライアンス部 法務第一グループ" },
                timestamp: "7月22日 14:10",
                body: "確認しました。上限を契約金額に戻す修正案を先方に返します。あわせて間接損害の除外も入れます。",
            },
        ],
    },
    {
        id: "c2",
        author: { name: "森野 千尋", affiliation: "法務・コンプライアンス部 マネージャー" },
        timestamp: "7月21日 17:30",
        body: "再委託の可否について、事業部としては認めたい方針で相違ないでしょうか。認める場合は事前承諾を条件に付けます。",
        resolved: true,
        replies: [
            {
                id: "c2r1",
                author: { name: "岩井 遼", affiliation: "デジタル推進本部 データ基盤部" },
                timestamp: "7月21日 18:02",
                body: "認める方針で問題ありません。事前承諾の条件もお願いします。",
            },
        ],
    },
    {
        id: "c3",
        author: { name: "システム", affiliation: "自動通知" },
        timestamp: "7月20日 09:00",
        body: "第3版（先方回答）が登録されました。",
    },
];

export function CommentThreadDemo() {
    const [comments, setComments] = React.useState<CommentItem[]>(INITIAL);
    const [collapseResolved, setCollapseResolved] = React.useState(false);

    function toggleResolved(id: string, resolved: boolean) {
        setComments((prev) => prev.map((c) => (c.id === id ? { ...c, resolved } : c)));
    }

    const open = comments.filter((c) => c.resolved === false).length;

    return (
        <div className="flex w-full max-w-2xl flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground" aria-live="polite">
                    未解決 {open} 件
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    aria-pressed={collapseResolved}
                    onClick={() => setCollapseResolved((v) => !v)}
                >
                    {collapseResolved ? "解決済みも開く" : "解決済みを畳む"}
                </Button>
            </div>

            <CommentThread
                comments={comments}
                label="依頼元とのやり取り"
                labels={JA}
                collapseResolved={collapseResolved}
                onResolvedChange={toggleResolved}
                emptyState={
                    <EmptyState
                        icon={<Icon icon={IconMessageOff} size="lg" decorative />}
                        title="まだやり取りはありません"
                        description="この案件について気になる点があれば書き込んでください。"
                        headingLevel={4}
                    />
                }
            />
        </div>
    );
}
