"use client";

import {
    Button,
    Checkbox,
    Input,
    Label,
    RangeSlider,
    SearchInput,
    Select,
    Switch,
    Textarea,
} from "@gunjo/ui";

export default function EmbedInputs() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="grid w-full max-w-3xl gap-4 rounded-xl border bg-card p-5 shadow-sm sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="embed-input-name">名前</Label>
                    <Input id="embed-input-name" defaultValue="Gunjo UI" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="embed-input-search">検索</Label>
                    <SearchInput id="embed-input-search" defaultValue="コンポーネント" />
                </div>
                <div className="space-y-2">
                    <Label>種別</Label>
                    <Select defaultValue="docs">
                        <option value="docs">ドキュメント</option>
                        <option value="pattern">パターン</option>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>範囲</Label>
                    <RangeSlider defaultValue={[24, 72]} />
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox id="embed-input-confirm" defaultChecked />
                    <Label htmlFor="embed-input-confirm">確認済み</Label>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="embed-input-notify">通知</Label>
                    <Switch id="embed-input-notify" defaultChecked />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="embed-input-note">メモ</Label>
                    <Textarea id="embed-input-note" defaultValue="入力系コンポーネントをまとめて確認します。" />
                </div>
                <div className="sm:col-span-2">
                    <Button>保存</Button>
                </div>
            </div>
        </div>
    );
}
