"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    type ChatMessageActionKey,
    ChatPanel,
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
    FloatingPanel,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Input,
    Label,
    Textarea,
    ToastProvider,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    useToast,
    cn,
    buttonVariants,
} from "@gunjo/ui";
import {
    IconBell as Bell,
    IconBox as Box,
    IconCalendarEvent as CalendarDays,
    IconChevronDown as ChevronDown,
    IconCopy as Copy,
    IconFileText as FileText,
    IconLogout as LogOut,
    IconPointer as MousePointer2,
    IconSettings as Settings,
    IconStack2 as Layers,
    IconTrash as Trash2,
    IconUser as User,
} from "@tabler/icons-react";

interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
}

const getChatActionMessage = (isJa: boolean, action: ChatMessageActionKey) => {
    const messages: Record<string, string> = isJa
        ? {
            copy: "メッセージをコピーしました。",
            branch: "この回答から分岐します。",
            raw: "Raw 表示を開きます。",
            edit: "メッセージを編集します。",
        }
        : {
            copy: "Copied the message.",
            branch: "Branching from this response.",
            raw: "Opening Raw view.",
            edit: "Editing this message.",
        };

    return messages[action] ?? (isJa ? "操作を実行しました。" : "Action triggered.");
};

function ChatPanelAuditDemoContent() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const { showToast } = useToast();
    const [messages, setMessages] = React.useState<ChatMessage[]>([
        {
            id: "system",
            role: "system",
            content: isJa ? "会話を開始しました。" : "Conversation started.",
            timestamp: "10:00",
        },
        {
            id: "assistant",
            role: "assistant",
            content: isJa
                ? "ドキュメントの改善点を確認できます。質問を入力してください。"
                : "I can help review documentation improvements. Type a question.",
            timestamp: "10:01",
        },
    ]);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleSend = (text: string) => {
        const value = text.trim();
        if (!value) return;
        const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        setMessages((current) => [
            ...current,
            { id: `user-${Date.now()}`, role: "user", content: value, timestamp },
        ]);
        setIsProcessing(true);

        window.setTimeout(() => {
            setMessages((current) => [
                ...current,
                {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    content: isJa
                        ? `「${value}」について確認しました。実装例では API 応答をここに追加します。`
                        : `Reviewed "${value}". In production, append the API response here.`,
                    timestamp,
                },
            ]);
            setIsProcessing(false);
        }, 800);
    };

    return (
        <ChatPanel
            title={isJa ? "サポートチャット" : "Support chat"}
            description={isJa ? "メッセージ、入力欄、処理中状態をまとめて確認します。" : "Messages, composer, and processing state in one surface."}
            messages={messages}
            onSend={handleSend}
            onMessageAction={(_, action) => {
                showToast(getChatActionMessage(isJa, action), "success", 1800);
            }}
            isProcessing={isProcessing}
            placeholder={isJa ? "確認したいことを入力..." : "Ask a question..."}
            inputLabels={{
                attach: isJa ? "ファイルを添付" : "Attach file",
                send: isJa ? "送信" : "Send",
                stop: isJa ? "停止" : "Stop",
                emptyMessage: isJa ? "メッセージを入力すると送信できます。" : "Type a message before sending.",
            }}
        />
    );
}

export interface ChatPanelAuditDemoProps {
    toastPlacement?: "viewport" | "container";
}

export function ChatPanelAuditDemo({ toastPlacement = "viewport" }: ChatPanelAuditDemoProps) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    return (
        <div ref={setPortalContainer} className="relative w-full">
            <ToastProvider
                labels={{ close: isJa ? "閉じる" : "Close" }}
                placement={toastPlacement}
                portalContainer={toastPlacement === "container" ? portalContainer : undefined}
            >
                <ChatPanelAuditDemoContent />
            </ToastProvider>
        </div>
    );
}

export type AlertDialogAuditDemoVariant = "destructive" | "unsaved" | "access-request" | "target-summary";

export interface AlertDialogAuditDemoProps {
    variant?: AlertDialogAuditDemoVariant;
}

export function AlertDialogAuditDemo({ variant = "destructive" }: AlertDialogAuditDemoProps) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    if (variant === "unsaved") {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">{isJa ? "ページを離れる" : "Leave page"}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isJa ? "未保存の変更があります" : "You have unsaved changes"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isJa
                                ? "今移動すると下書きは破棄されます。保存してから移動してください。"
                                : "Leaving now will discard your draft. Save first to keep it."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{isJa ? "戻る" : "Stay"}</AlertDialogCancel>
                        <AlertDialogAction>{isJa ? "破棄して移動" : "Discard and leave"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    if (variant === "access-request") {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">{isJa ? "公開設定を変更" : "Change visibility"}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isJa ? "管理者の承認が必要です" : "Admin approval is required"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isJa
                                ? "この設定を変更するには、ワークスペース管理者への申請が必要です。申請理由を添えて送信します。"
                                : "Changing this setting requires approval from a workspace admin. Send a request with the reason attached."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{isJa ? "キャンセル" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction>{isJa ? "承認を申請" : "Request approval"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    if (variant === "target-summary") {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        {isJa ? "フォルダを削除" : "Delete folder"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isJa ? "フォルダを削除しますか？" : "Delete this folder?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isJa
                                ? "このフォルダ内の素材は未分類へ移動します。この操作は取り消せません。"
                                : "Assets in this folder will be moved to Uncategorized. This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
                        {isJa ? "Web サイト素材" : "Website assets"}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{isJa ? "キャンセル" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
                            {isJa ? "削除" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    {isJa ? "プロジェクトを削除" : "Delete project"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isJa ? "このプロジェクトを削除しますか？" : "Delete this project?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isJa
                            ? "関連するタスク、ファイル、共有リンクも削除されます。この操作は取り消せません。"
                            : "Related tasks, files, and shared links will be removed. This action cannot be undone."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{isJa ? "キャンセル" : "Cancel"}</AlertDialogCancel>
                    <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
                        {isJa ? "削除" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export type DialogAuditDemoVariant = "form" | "confirmation" | "summary";

export interface DialogAuditDemoProps {
    variant?: DialogAuditDemoVariant;
}

export function DialogAuditDemo({ variant = "form" }: DialogAuditDemoProps) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
    const previewSurfaceClassName = "relative flex min-h-[560px] w-full items-center justify-center";

    if (variant === "confirmation") {
        return (
            <div ref={setPortalContainer} className={previewSurfaceClassName}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>{isJa ? "公開する" : "Publish"}</Button>
                    </DialogTrigger>
                    <DialogContent portalContainer={portalContainer} className="sm:max-w-[440px]">
                        <DialogHeader>
                            <DialogTitle>{isJa ? "プロジェクトを公開しますか？" : "Publish project?"}</DialogTitle>
                            <DialogDescription>
                                {isJa
                                    ? "最新の変更を本番環境へ反映します。公開後もロールバックできます。"
                                    : "This deploys the latest changes to production. You can roll back after publishing."}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">{isJa ? "キャンセル" : "Cancel"}</Button>
                            </DialogClose>
                            <Button>{isJa ? "公開" : "Publish"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    if (variant === "summary") {
        return (
            <div ref={setPortalContainer} className={previewSurfaceClassName}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">{isJa ? "変更内容を確認" : "Review changes"}</Button>
                    </DialogTrigger>
                    <DialogContent portalContainer={portalContainer} className="sm:max-w-[520px]">
                        <DialogHeader>
                            <DialogTitle>{isJa ? "公開前の確認" : "Pre-publish review"}</DialogTitle>
                            <DialogDescription>
                                {isJa
                                    ? "今回の公開に含まれる変更と影響範囲を要約して確認します。"
                                    : "Review a summary of included changes and impact before publishing."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 rounded-md border bg-muted/30 p-3 text-sm sm:grid-cols-2">
                            <div>
                                <p className="font-medium">{isJa ? "含まれる変更" : "Included changes"}</p>
                                <p className="mt-1 text-muted-foreground">
                                    {isJa ? "プロフィール、招待メール、通知設定" : "Profile, invitation email, notification defaults"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">{isJa ? "影響範囲" : "Impact"}</p>
                                <p className="mt-1 text-muted-foreground">
                                    {isJa ? "ワークスペース全体" : "Entire workspace"}
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">{isJa ? "戻る" : "Back"}</Button>
                            </DialogClose>
                            <Button>{isJa ? "確認しました" : "Confirm"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div ref={setPortalContainer} className={previewSurfaceClassName}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{isJa ? "プロフィールを編集" : "Edit profile"}</Button>
                </DialogTrigger>
                <DialogContent
                    portalContainer={portalContainer}
                    className="sm:max-w-[440px]"
                    onOpenAutoFocus={(event) => event.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>{isJa ? "プロフィールを編集" : "Edit profile"}</DialogTitle>
                        <DialogDescription>
                            {isJa
                                ? "表示名とハンドル名を更新します。保存するまで変更は反映されません。"
                                : "Update the display name and handle. Changes are not applied until saved."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
                            <Label htmlFor="overlay-display-name" className="sm:text-right">
                                {isJa ? "表示名" : "Display name"}
                            </Label>
                            <Input id="overlay-display-name" className="w-full" defaultValue={isJa ? "青井 はな" : "Aoi Hana"} />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
                            <Label htmlFor="overlay-handle" className="sm:text-right">
                                {isJa ? "ハンドル" : "Handle"}
                            </Label>
                            <Input id="overlay-handle" className="w-full" defaultValue="@aoi" />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)]">
                            <Label htmlFor="overlay-bio" className="pt-2 sm:text-right">
                                {isJa ? "メモ" : "Note"}
                            </Label>
                            <Textarea id="overlay-bio" className="w-full" defaultValue={isJa ? "デザインシステムを管理しています。" : "Maintains the design system."} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{isJa ? "キャンセル" : "Cancel"}</Button>
                        </DialogClose>
                        <Button>{isJa ? "保存" : "Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function DrawerAuditDemo({ side = "bottom" }: { side?: "bottom" | "right" | "left" | "top" }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);

    return (
        <div ref={setPortalContainer} className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-md">
            <Drawer direction={side} shouldScaleBackground={false} container={portalContainer}>
                <DrawerTrigger asChild>
                    <Button variant="outline">{isJa ? "詳細を開く" : "Open details"}</Button>
                </DrawerTrigger>
                {/* side is derived from the Root `direction` — single source of truth (#335) */}
                <DrawerContent portalContainer={portalContainer}>
                    <DrawerHeader>
                        <DrawerTitle>{isJa ? "配信設定" : "Delivery settings"}</DrawerTitle>
                        <DrawerDescription>
                            {isJa
                                ? "画面を離れずに補助的な設定を確認・変更します。"
                                : "Review and change supporting settings without leaving the page."}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-3 px-4 pb-4">
                        <Label htmlFor="drawer-title">{isJa ? "タイトル" : "Title"}</Label>
                        <Input id="drawer-title" className="w-full" defaultValue={isJa ? "週次レポート" : "Weekly report"} />
                        <Label htmlFor="drawer-note">{isJa ? "補足" : "Note"}</Label>
                        <Textarea id="drawer-note" className="w-full" defaultValue={isJa ? "公開前にレビューが必要です。" : "Review is required before publishing."} />
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">{isJa ? "キャンセル" : "Cancel"}</Button>
                        </DrawerClose>
                        <Button>{isJa ? "保存" : "Save"}</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export function DropdownMenuAuditDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [showStatus, setShowStatus] = React.useState(true);
    const [showActivity, setShowActivity] = React.useState(false);
    const [density, setDensity] = React.useState("comfortable");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{isJa ? "表示設定" : "View settings"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>{isJa ? "表示" : "View"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
                    {isJa ? "ステータスバー" : "Status bar"}
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
                    {isJa ? "アクティビティバー" : "Activity bar"}
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{isJa ? "密度" : "Density"}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                    <DropdownMenuRadioItem value="compact">{isJa ? "コンパクト" : "Compact"}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="comfortable">{isJa ? "標準" : "Comfortable"}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="spacious">{isJa ? "ゆったり" : "Spacious"}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function SplitDropdownMenuAuditDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <DropdownMenu>
            <div className="inline-flex overflow-hidden rounded-md border bg-background shadow-sm">
                <Button variant="ghost" className="h-9 rounded-none border-0 px-3">
                    {isJa ? "公開" : "Publish"}
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none border-0 border-l"
                                aria-label={isJa ? "公開オプションを開く" : "Open publish options"}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>{isJa ? "公開オプションを開く" : "Open publish options"}</TooltipContent>
                </Tooltip>
            </div>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{isJa ? "公開オプション" : "Publish options"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{isJa ? "今すぐ公開" : "Publish now"}</DropdownMenuItem>
                <DropdownMenuItem>{isJa ? "予約公開" : "Schedule publish"}</DropdownMenuItem>
                <DropdownMenuItem>{isJa ? "下書きとして保存" : "Save as draft"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{isJa ? "プレビューを共有" : "Share preview"}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export type ContextMenuAuditDemoVariant = "file-actions" | "text-only" | "nested-actions";

export interface ContextMenuAuditDemoProps {
    variant?: ContextMenuAuditDemoVariant;
}

export function ContextMenuAuditDemo({ variant = "file-actions" }: ContextMenuAuditDemoProps) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    if (variant === "text-only") {
        return (
            <ContextMenu>
                <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
                    {isJa ? "テキストのみのメニューを右クリックで開く" : "Right-click to open a text-only menu"}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56">
                    <ContextMenuLabel>{isJa ? "表示" : "View"}</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem>{isJa ? "プレビューを開く" : "Open preview"}</ContextMenuItem>
                    <ContextMenuItem>{isJa ? "名前を変更" : "Rename"}</ContextMenuItem>
                    <ContextMenuItem>{isJa ? "複製" : "Duplicate"}</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        disabled
                        disabledReason={isJa ? "固定フォルダー内の項目は移動できません。" : "Items in a locked folder cannot be moved."}
                    >
                        {isJa ? "移動" : "Move"}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    if (variant === "nested-actions") {
        return (
            <ContextMenu>
                <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
                    {isJa ? "サブメニューを含む操作を右クリックで開く" : "Right-click to open nested actions"}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuLabel>{isJa ? "素材操作" : "Asset actions"}</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {isJa ? "詳細を表示" : "View details"}
                    </ContextMenuItem>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
                            {isJa ? "変換" : "Convert"}
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                            <ContextMenuItem>{isJa ? "Web 用に圧縮" : "Compress for web"}</ContextMenuItem>
                            <ContextMenuItem>{isJa ? "サムネイルを作成" : "Create thumbnail"}</ContextMenuItem>
                            <ContextMenuItem>{isJa ? "メタデータを削除" : "Remove metadata"}</ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuItem>
                        <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {isJa ? "リンクをコピー" : "Copy link"}
                        <ContextMenuShortcut>⌘L</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        inset
                        disabled
                        disabledReason={isJa ? "非公開プロジェクトでは共有リンクを作成できません。" : "Private projects cannot create share links."}
                    >
                        {isJa ? "共有" : "Share"}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center text-sm text-muted-foreground">
                {isJa ? "ここを右クリックして行アクションを開く" : "Right-click here to open row actions"}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuLabel>{isJa ? "ファイル操作" : "File actions"}</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem>
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {isJa ? "詳細を表示" : "View details"}
                </ContextMenuItem>
                <ContextMenuItem>
                    <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {isJa ? "パスをコピー" : "Copy path"}
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem
                    inset
                    disabled
                    disabledReason={isJa ? "権限を変更するには管理者ロールが必要です。" : "You need the administrator role to change permissions."}
                >
                    {isJa ? "権限を変更" : "Change permissions"}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>{isJa ? "お気に入り" : "Favorite"}</ContextMenuCheckboxItem>
                <ContextMenuRadioGroup value="viewer">
                    <ContextMenuLabel inset>{isJa ? "権限" : "Role"}</ContextMenuLabel>
                    <ContextMenuRadioItem value="viewer">{isJa ? "閲覧者" : "Viewer"}</ContextMenuRadioItem>
                    <ContextMenuRadioItem value="editor">{isJa ? "編集者" : "Editor"}</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
            </ContextMenuContent>
        </ContextMenu>
    );
}

type FloatingPanelAuditDemoVariant = "canvas" | "interactive" | "toolbar" | "status" | "solid";

export function FloatingPanelAuditDemo({ variant = "canvas" }: { variant?: FloatingPanelAuditDemoVariant }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const dottedCanvasStyle = {
        backgroundImage: "radial-gradient(hsl(var(--muted-foreground) / 0.22) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
    };

    if (variant === "interactive") {
        return (
            <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4 sm:p-6">
                <div
                    className="grid h-full min-h-[380px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
                    style={dottedCanvasStyle}
                >
                    {isJa ? "作業面" : "Workspace"}
                </div>
                <FloatingPanel
                    title={isJa ? "作業メモ" : "Working note"}
                    variant="glass"
                    dragEnabled
                    resizable
                    minWidth={240}
                    minHeight={180}
                    className="absolute left-8 top-8 h-56 w-80 sm:left-10 sm:top-10"
                    contentClassName="p-4"
                >
                    <div className="space-y-3 text-sm">
                        <p className="font-medium">{isJa ? "公開前チェック" : "Pre-publish checks"}</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                {isJa ? "メタ情報を確認" : "Review metadata"}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                                {isJa ? "権限設定を確認" : "Check permissions"}
                            </li>
                        </ul>
                    </div>
                </FloatingPanel>
            </div>
        );
    }

    if (variant === "toolbar") {
        return (
            <div className="relative min-h-[260px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
                <div
                    className="grid h-full min-h-[220px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
                    style={dottedCanvasStyle}
                >
                    {isJa ? "編集対象" : "Editable surface"}
                </div>
                <FloatingPanel
                    variant="glass"
                    className="absolute left-8 top-8 w-auto"
                    contentClassName="flex items-center gap-1 p-1"
                >
                    <TooltipProvider>
                        {[
                            [MousePointer2, isJa ? "選択" : "Select"],
                            [Box, isJa ? "追加" : "Insert"],
                            [Layers, isJa ? "重なり順" : "Layers"],
                            [Settings, isJa ? "設定" : "Settings"],
                        ].map(([Icon, label]) => (
                            <Tooltip key={label as string}>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label={label as string}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        {React.createElement(Icon as typeof MousePointer2, { className: "h-4 w-4" })}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>{label as string}</TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </FloatingPanel>
            </div>
        );
    }

    if (variant === "status") {
        return (
            <div className="relative min-h-[300px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
                <div
                    className="grid h-full min-h-[260px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
                    style={dottedCanvasStyle}
                >
                    {isJa ? "レビュー画面" : "Review surface"}
                </div>
                <FloatingPanel
                    title={isJa ? "通知" : "Notifications"}
                    variant="solid"
                    className="absolute bottom-8 left-8 w-80"
                    contentClassName="p-3"
                >
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <Bell className="mt-0.5 h-4 w-4 text-primary" />
                            <div className="min-w-0">
                                <p className="font-medium">{isJa ? "レビューが完了しました" : "Review complete"}</p>
                                <p className="text-muted-foreground">
                                    {isJa ? "2件のコメントを反映できます。" : "Two comments are ready to apply."}
                                </p>
                            </div>
                        </div>
                        <button type="button" className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                            {isJa ? "変更を確認" : "Review changes"}
                        </button>
                    </div>
                </FloatingPanel>
            </div>
        );
    }

    if (variant === "solid") {
        return (
            <FloatingPanel title={isJa ? "情報" : "Info"} variant="solid" className="w-72">
                <div className="space-y-2 p-4 text-sm">
                    <p className="font-medium">{isJa ? "選択中の要素" : "Selected element"}</p>
                    <p className="text-muted-foreground">Rectangle 1</p>
                </div>
            </FloatingPanel>
        );
    }

    return (
        <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30 p-4 sm:p-6">
            <div
                className="grid h-full min-h-[380px] place-items-center rounded-md border border-dashed bg-background/70 text-sm text-muted-foreground"
                style={dottedCanvasStyle}
            >
                {isJa ? "キャンバス領域" : "Canvas area"}
            </div>
            <FloatingPanel
                title={isJa ? "ツール" : "Tools"}
                variant="glass"
                dragEnabled
                resizable
                minWidth={180}
                minHeight={180}
                className="absolute left-8 top-8 h-72 w-56 sm:left-10 sm:top-10"
            >
                <div className="space-y-1 p-3">
                    {[
                        [MousePointer2, isJa ? "選択" : "Select"],
                        [Box, isJa ? "四角形" : "Rectangle"],
                        [Layers, isJa ? "レイヤー" : "Layers"],
                    ].map(([Icon, label]) => (
                        <button
                            key={label as string}
                            type="button"
                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                        >
                            {React.createElement(Icon as typeof MousePointer2, { className: "h-4 w-4" })}
                            <span>{label as string}</span>
                        </button>
                    ))}
                </div>
            </FloatingPanel>
            <FloatingPanel
                title={isJa ? "プロパティ" : "Properties"}
                variant="solid"
                dragEnabled
                resizable
                minWidth={220}
                minHeight={180}
                className="absolute left-[calc(100%-18rem)] top-[calc(100%-13.25rem)] h-[11.25rem] w-64 sm:left-[calc(100%-18.5rem)] sm:top-[calc(100%-13.75rem)]"
            >
                <dl className="grid grid-cols-2 gap-2 p-3 text-xs">
                    <div className="rounded-md bg-muted p-2">
                        <dt className="text-muted-foreground">X</dt>
                        <dd className="font-semibold">240</dd>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                        <dt className="text-muted-foreground">Y</dt>
                        <dd className="font-semibold">120</dd>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                        <dt className="text-muted-foreground">W</dt>
                        <dd className="font-semibold">300</dd>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                        <dt className="text-muted-foreground">H</dt>
                        <dd className="font-semibold">200</dd>
                    </div>
                </dl>
            </FloatingPanel>
        </div>
    );
}

type HoverCardDemoProps = {
    portalContainer?: HTMLElement | null;
};

export function HoverCardAuditDemo({ portalContainer }: HoverCardDemoProps = {}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
                <Button variant="link" className="px-0">
                    {isJa ? "@gunjo_design" : "@gunjo_design"}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent portalContainer={portalContainer} sideOffset={8} className="w-80 items-start text-left">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                        <AvatarFallback>GU</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold">Gunjo Design</p>
                        <p className="text-sm text-muted-foreground">
                            {isJa
                                ? "Gunjo UI のコンポーネント、トークン、パターンを管理するチームです。"
                                : "Team maintaining Gunjo UI components, tokens, and patterns."}
                        </p>
                        <p className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {isJa ? "2026年5月に更新" : "Updated May 2026"}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export function NotificationHoverCardDemo({ portalContainer }: HoverCardDemoProps = {}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Bell className="h-4 w-4" />
                    {isJa ? "通知" : "Notifications"}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent portalContainer={portalContainer} sideOffset={8} className="w-72 items-start text-left">
                <p className="text-sm font-semibold">{isJa ? "未読 3 件" : "3 unread"}</p>
                <p className="text-sm text-muted-foreground">
                    {isJa
                        ? "ホバーカードは、遷移前に少量の補足情報を確認する用途に向いています。"
                        : "HoverCard works well for lightweight context before navigation."}
                </p>
            </HoverCardContent>
        </HoverCard>
    );
}

export function ActionHoverCardDemo({ portalContainer }: HoverCardDemoProps = {}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {isJa ? "担当者" : "Owner"}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent portalContainer={portalContainer} sideOffset={8} className="w-80">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                        <AvatarFallback>AO</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold">{isJa ? "青井 ひかり" : "Hikari Aoi"}</p>
                        <p className="text-sm text-muted-foreground">
                            {isJa ? "プロダクトデザインとドキュメント整備を担当しています。" : "Owns product design and documentation quality."}
                        </p>
                    </div>
                </div>
                <div className="flex w-full gap-2 pt-2">
                    <Button size="sm" className="flex-1">{isJa ? "フォロー" : "Follow"}</Button>
                    <Button size="sm" variant="outline" className="flex-1">{isJa ? "連絡" : "Message"}</Button>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export function TabbedHoverCardDemo({ portalContainer }: HoverCardDemoProps = {}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    {isJa ? "リリース概要" : "Release brief"}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent portalContainer={portalContainer} sideOffset={8} className="w-[min(24rem,calc(100vw-2rem))] p-3">
                <Tabs defaultValue="summary" className="w-full border-0">
                    <TabsList className="min-h-10 w-full justify-start p-1">
                        <TabsTrigger value="summary" className="h-8 px-3 text-xs">
                            {isJa ? "概要" : "Summary"}
                        </TabsTrigger>
                        <TabsTrigger value="changes" className="h-8 px-3 text-xs">
                            {isJa ? "変更" : "Changes"}
                        </TabsTrigger>
                        <TabsTrigger value="risk" className="h-8 px-3 text-xs">
                            {isJa ? "注意" : "Risk"}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="mt-2 p-1 text-sm text-muted-foreground">
                        {isJa ? "入力、表示、チャート、フィードバックの監査済み内容をまとめたリリースです。" : "Release summary for audited input, display, chart, and feedback components."}
                    </TabsContent>
                    <TabsContent value="changes" className="mt-2 space-y-1 p-1 text-sm text-muted-foreground">
                        <p>{isJa ? "・docs プレビューの横幅と高さを整理" : "- Adjusted docs preview sizing"}</p>
                        <p>{isJa ? "・コード例をコピー可能な内容へ更新" : "- Updated code examples for copy-ready use"}</p>
                    </TabsContent>
                    <TabsContent value="risk" className="mt-2 p-1 text-sm text-muted-foreground">
                        {isJa ? "カラー見直しは別タスクで全体確認します。" : "Semantic color review remains a separate follow-up."}
                    </TabsContent>
                </Tabs>
            </HoverCardContent>
        </HoverCard>
    );
}

export function UserMenuAuditDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{isJa ? "アカウント" : "Account"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{isJa ? "アカウント" : "Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {isJa ? "プロフィール" : "Profile"}
                    <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {isJa ? "設定" : "Settings"}
                    <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isJa ? "アカウントを削除" : "Delete account"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isJa ? "ログアウト" : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
