"use client";

import * as React from "react";
import { KanbanBoard, Badge, type KanbanColumn } from "@gunjo/ui";

interface Task {
    id: string;
    title: string;
    assignee: string;
    status: string;
    priority?: "high" | "normal";
}

const COLUMNS: KanbanColumn[] = [
    { id: "todo", title: "未着手", tone: "muted" },
    { id: "doing", title: "進行中", tone: "info" },
    { id: "review", title: "レビュー", tone: "warning" },
    { id: "done", title: "完了", tone: "success" },
];

const INITIAL: Task[] = [
    { id: "t1", title: "記事: 群青UI 入門", assignee: "佐藤", status: "todo", priority: "high" },
    { id: "t2", title: "デザインレビュー", assignee: "鈴木", status: "todo" },
    { id: "t3", title: "API 実装", assignee: "田中", status: "doing" },
    { id: "t4", title: "校正: 連載#12", assignee: "高橋", status: "doing" },
    { id: "t5", title: "画像差し替え", assignee: "伊藤", status: "review", priority: "high" },
    { id: "t6", title: "公開準備", assignee: "渡辺", status: "done" },
];

export function KanbanBoardDemo() {
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <div className="flex w-full flex-col gap-3">
            <KanbanBoard<Task>
                columns={COLUMNS}
                items={INITIAL}
                getItemId={(t) => t.id}
                getColumnId={(t) => t.status}
                onCardSelect={(t) => setPicked(t.title)}
                renderCard={(t) => (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium leading-tight">{t.title}</span>
                            {t.priority === "high" ? <Badge variant="destructive">優先</Badge> : null}
                        </div>
                        <span className="text-xs text-muted-foreground">{t.assignee}</span>
                    </div>
                )}
            />
            <p className="text-xs text-muted-foreground" aria-live="polite">
                {picked ? `選択: ${picked}` : "カードをクリック/Enterで選択。列見出しに件数バッジ。横スクロールはページを押し出さない。"}
            </p>
        </div>
    );
}
