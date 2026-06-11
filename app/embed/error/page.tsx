"use client";

import { Button, StatusScreen } from "@gunjo/ui";

export default function Embed() {
    return (
        <div className="w-full overflow-hidden rounded-md border bg-background">
            <StatusScreen
                variant="error"
                title="問題が発生しました"
                description="再読み込みしても解消しない場合は、サポートへ連絡してください。"
                details="req-id 7f3c9a"
                action={<Button>再試行</Button>}
                className="min-h-[320px]"
            />
        </div>
    );
}
