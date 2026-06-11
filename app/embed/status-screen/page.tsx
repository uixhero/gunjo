"use client";

import { Button, StatusScreen } from "@gunjo/ui";

export default function Embed() {
    return (
        <div className="w-full overflow-hidden rounded-md border bg-background">
            <StatusScreen
                variant="not-found"
                title="ページが見つかりません"
                description="URLが変更されたか、ページが削除された可能性があります。"
                action={<Button>トップへ戻る</Button>}
                className="min-h-[320px]"
            />
        </div>
    );
}
