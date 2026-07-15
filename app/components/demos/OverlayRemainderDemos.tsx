"use client";

import * as React from "react";
import {
    Button,
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    Input,
    Kbd,
    Label,
    MediaLightbox,
    MediaPickerDialog,
    Modal,
    OnboardingFlow,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ShareModal,
    Sheet,
    SheetBody,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    ToastProvider,
    type AssetCardAsset,
    type OnboardingStep,
    type ShareableItem,
    useToast,
} from "@gunjo/ui";
import {
    IconAdjustmentsHorizontal as SlidersHorizontal,
    IconCircleCheck as CheckCircle2,
    IconDeviceFloppy as Save,
    IconDots as MoreHorizontal,
    IconFileTypeJpg as FileImage,
    IconFilter as Filter,
    IconHelpCircle as HelpCircle,
    IconInfoCircle as Info,
    IconSettings as Settings,
    IconShare2 as Share2,
    IconSparkles as Sparkles,
} from "@tabler/icons-react";

type Locale = "ja" | "en";

const mediaAssets: AssetCardAsset[] = [
    {
        id: "hero",
        title: "Campaign_Hero_2026.svg",
        src: "/samples/media-hero.svg",
        type: "SVG",
        size: "1.4MB",
        width: 1920,
        height: 1080,
        createdAt: "2026-05-12",
        rating: 4.5,
        isFavorite: true,
    },
    {
        id: "story",
        title: "Instagram_Story.svg",
        src: "/samples/media-story.svg",
        type: "SVG",
        size: "2.1MB",
        width: 1080,
        height: 1920,
        createdAt: "2026-05-10",
        rating: 3.5,
    },
    {
        id: "product",
        title: "Product_Square.svg",
        src: "/samples/media-square.svg",
        type: "SVG",
        size: "980KB",
        width: 1200,
        height: 1200,
        createdAt: "2026-05-08",
        rating: 4.1,
    },
    {
        id: "lookbook",
        title: "Lookbook_Cover.svg",
        src: "/samples/media-lookbook.svg",
        type: "SVG",
        size: "3.2MB",
        width: 1600,
        height: 1200,
        createdAt: "2026-05-06",
        rating: 4.8,
    },
];

function PreviewViewport({
    children,
    className,
    height = 420,
    fillHeight = false,
}: {
    children: (container: HTMLElement | null) => React.ReactNode;
    className?: string;
    height?: number;
    fillHeight?: boolean;
}) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [container, setContainer] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        setContainer(ref.current);
    }, []);

    return (
        <div
            ref={ref}
            className={[
                "relative w-full overflow-hidden rounded-lg border bg-background shadow-sm",
                className,
            ].filter(Boolean).join(" ")}
            style={fillHeight ? { height: `min(${height}px, calc(100vh - 2rem))` } : { minHeight: height }}
        >
            {children(container)}
        </div>
    );
}

async function writeDemoClipboardText(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error("Failed to copy");
    }
}

export function MediaLightboxAuditDemo({
    locale,
    variant = "default",
}: {
    locale: Locale;
    variant?: "default" | "compact" | "metadata";
}) {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(variant === "metadata" ? 1 : 0);
    const asset = mediaAssets[index];
    const isJa = locale === "ja";

    return (
        <PreviewViewport height={700} fillHeight className="bg-muted/30">
            {(container) => (
                <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-6">
                    <div className="grid w-full max-w-sm gap-3 rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={asset.src} alt="" className="h-full w-full object-contain p-1" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{asset.title}</p>
                                <p className="text-xs text-muted-foreground">{asset.type} / {asset.size}</p>
                            </div>
                        </div>
                        <Button type="button" onClick={() => setOpen(true)} className="gap-2">
                            <FileImage className="h-4 w-4" />
                            {isJa ? "ライトボックスを開く" : "Open lightbox"}
                        </Button>
                    </div>
                    <MediaLightbox
                        open={open}
                        onOpenChange={setOpen}
                        portalContainer={container}
                        asset={asset}
                        variant={variant === "compact" ? "compact" : "default"}
                        hasPrevious={index > 0}
                        hasNext={index < mediaAssets.length - 1}
                        onPrevious={() => setIndex((value) => Math.max(0, value - 1))}
                        onNext={() => setIndex((value) => Math.min(mediaAssets.length - 1, value + 1))}
                        onShare={() => undefined}
                        onFavorite={() => undefined}
                        onDetails={() => undefined}
                        labels={isJa ? {
                            close: "閉じる",
                            previous: "前の素材",
                            next: "次の素材",
                            share: "共有",
                            favorite: "お気に入り",
                            edit: "編集",
                            details: "詳細",
                            metadata: "メタデータ",
                            dimensions: "サイズ",
                            type: "形式",
                            created: "作成日",
                            rating: "評価",
                        } : undefined}
                    />
                </div>
            )}
        </PreviewViewport>
    );
}

export function MediaPickerDialogAuditDemo({
    locale,
    variant = "default",
}: {
    locale: Locale;
    variant?: "default" | "single" | "compact" | "empty";
}) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<AssetCardAsset[]>(variant === "default" ? [mediaAssets[0]] : []);
    const isJa = locale === "ja";
    const items = variant === "empty" ? [] : mediaAssets;
    const multiSelect = variant !== "single";
    return (
        <PreviewViewport height={620} fillHeight className="bg-muted/30">
            {(container) => (
                <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6">
                    <div className="w-full max-w-md rounded-lg border bg-card p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold">{isJa ? "記事に使う素材" : "Media for article"}</p>
                                <p className="text-xs text-muted-foreground">
                                    {selected.length > 0
                                        ? isJa ? `${selected.length}件を選択中` : `${selected.length} selected`
                                        : isJa ? "まだ選択されていません" : "Nothing selected"}
                                </p>
                            </div>
                            <Button type="button" onClick={() => setOpen(true)}>
                                {isJa ? "選択" : "Choose"}
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            {selected.slice(0, 3).map((asset) => (
                                <div key={asset.id} className="h-14 w-14 overflow-hidden rounded-md border bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={asset.src} alt="" className="h-full w-full object-contain p-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <MediaPickerDialog
                        open={open}
                        onOpenChange={setOpen}
                        portalContainer={container}
                        items={items}
                        variant={variant === "compact" ? "compact" : "default"}
                        multiSelect={multiSelect}
                        selectedIds={selected.map((asset) => asset.id)}
                        onConfirm={setSelected}
                        labels={isJa ? {
                            title: "メディアを選択",
                            description: "ライブラリから使用する素材を選択します。",
                            searchPlaceholder: "タイトルや形式で検索",
                            cancel: "キャンセル",
                            confirm: (count) => `${count}件を追加`,
                            emptyTitle: "素材がありません",
                            emptyDescription: "検索条件を変えるか、素材をアップロードしてください。",
                            close: "閉じる",
                        } : undefined}
                    />
                </div>
            )}
        </PreviewViewport>
    );
}

export function ModalAuditDemo({
    locale,
    variant = "default",
}: {
    locale: Locale;
    variant?: "default" | "destructive" | "form" | "no-footer" | "tabs";
}) {
    const [open, setOpen] = React.useState(false);
    const isJa = locale === "ja";
    const isDestructive = variant === "destructive";
    const isNoFooter = variant === "no-footer";
    const isTabs = variant === "tabs";
    const previewHeight = isTabs ? 480 : 380;

    return (
        <PreviewViewport height={previewHeight} fillHeight className="bg-muted/30">
            {(container) => (
                <div className="flex h-full min-h-0 items-center justify-center p-6">
                    <Button type="button" variant={isDestructive ? "destructive" : "outline"} onClick={() => setOpen(true)}>
                        {isDestructive
                            ? (isJa ? "削除を確認" : "Confirm delete")
                            : isNoFooter
                                ? (isJa ? "お知らせを開く" : "Open notice")
                                : isTabs
                                    ? (isJa ? "詳細設定を開く" : "Open details")
                                    : isJa ? "モーダルを開く" : "Open modal"}
                    </Button>
                    <Modal
                        isOpen={open}
                        onClose={() => setOpen(false)}
                        portalContainer={container}
                        title={
                            isDestructive
                                ? isJa ? "素材を削除しますか？" : "Delete asset?"
                                : isNoFooter
                                    ? isJa ? "公開範囲のお知らせ" : "Visibility notice"
                                    : isTabs
                                        ? isJa ? "プロジェクト詳細" : "Project details"
                                        : isJa ? "公開設定を変更" : "Change publish settings"
                        }
                        closeLabel={isJa ? "閉じる" : "Close"}
                        footer={isNoFooter ? undefined : (
                            <>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    {isJa ? "キャンセル" : "Cancel"}
                                </Button>
                                <Button type="button" variant={isDestructive ? "destructive" : "default"} onClick={() => setOpen(false)}>
                                    {isDestructive
                                        ? (isJa ? "削除" : "Delete")
                                        : isTabs
                                            ? (isJa ? "更新" : "Update")
                                            : isJa ? "保存" : "Save"}
                                </Button>
                            </>
                        )}
                    >
                        {isTabs ? (
                            <Tabs defaultValue="summary" className="w-full">
                                <TabsList className="mb-4 w-full justify-start">
                                    <TabsTrigger value="summary">{isJa ? "概要" : "Summary"}</TabsTrigger>
                                    <TabsTrigger value="members">{isJa ? "メンバー" : "Members"}</TabsTrigger>
                                    <TabsTrigger value="history">{isJa ? "履歴" : "History"}</TabsTrigger>
                                </TabsList>
                                <TabsContent value="summary" className="mt-0 space-y-2 text-sm text-muted-foreground">
                                    <p>{isJa ? "公開中のプロジェクト情報と現在の状態を確認できます。" : "Review the published project details and current status."}</p>
                                    <div className="rounded-md border bg-muted/40 p-3 text-foreground">
                                        {isJa ? "ステータス: 公開中" : "Status: Published"}
                                    </div>
                                </TabsContent>
                                <TabsContent value="members" className="mt-0 space-y-2 text-sm text-muted-foreground">
                                    <p>{isJa ? "編集できるメンバーと権限を確認します。" : "Review members and permissions."}</p>
                                    <div className="rounded-md border bg-muted/40 p-3 text-foreground">
                                        {isJa ? "3人の編集者" : "3 editors"}
                                    </div>
                                </TabsContent>
                                <TabsContent value="history" className="mt-0 space-y-2 text-sm text-muted-foreground">
                                    <p>{isJa ? "直近の更新履歴を確認できます。" : "Review recent updates."}</p>
                                    <div className="rounded-md border bg-muted/40 p-3 text-foreground">
                                        {isJa ? "最終更新: 2026-05-31" : "Last updated: 2026-05-31"}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        ) : variant === "form" ? (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    {isJa ? "公開名と説明を編集します。" : "Edit the public name and description."}
                                </p>
                                <FormGroup>
                                    <FormLabel htmlFor="modal-title">{isJa ? "タイトル" : "Title"}</FormLabel>
                                    <FormControl>
                                        <Input id="modal-title" defaultValue={isJa ? "キャンペーン素材" : "Campaign assets"} />
                                    </FormControl>
                                    <FormDescription>
                                        {isJa ? "公開ページと共有リンクに表示されます。" : "Shown on the public page and shared links."}
                                    </FormDescription>
                                </FormGroup>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {isDestructive
                                    ? isJa ? "この操作は取り消せません。削除前に対象を確認してください。" : "This action cannot be undone. Confirm the target before deleting."
                                    : isNoFooter
                                        ? isJa ? "この通知は確認用です。閉じるボタンまたは Esc キーで閉じられます。" : "This notice is informational. Close it with the close button or Escape."
                                    : isJa ? "変更内容は保存後にチームへ反映されます。" : "Changes will be visible to the team after saving."}
                            </p>
                        )}
                    </Modal>
                </div>
            )}
        </PreviewViewport>
    );
}

const onboardingSteps = (locale: Locale): OnboardingStep[] => {
    const isJa = locale === "ja";
    return [
        {
            id: "profile",
            title: isJa ? "プロフィールを作成" : "Create profile",
            description: isJa ? "表示名と所属を入力します。" : "Add a display name and organization.",
            content: (
                <div className="grid gap-3">
                    <FormGroup>
                        <FormLabel htmlFor="ob-name">{isJa ? "表示名" : "Display name"}</FormLabel>
                        <FormControl>
                            <Input id="ob-name" placeholder={isJa ? "青井 花" : "Aoi Hana"} />
                        </FormControl>
                        <FormDescription>
                            {isJa ? "チーム内で表示される名前です。" : "Shown to teammates in the workspace."}
                        </FormDescription>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="ob-team">{isJa ? "チーム" : "Team"}</FormLabel>
                        <FormControl>
                            <Input id="ob-team" placeholder={isJa ? "マーケティング" : "Marketing"} />
                        </FormControl>
                    </FormGroup>
                </div>
            ),
        },
        {
            id: "workspace",
            title: isJa ? "ワークスペースを設定" : "Set up workspace",
            description: isJa ? "通知と公開範囲を決めます。" : "Choose visibility and notifications.",
            content: (
                <div className="space-y-3 rounded-md border bg-muted/40 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                        <span>{isJa ? "公開リンクを許可" : "Allow public links"}</span>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span>{isJa ? "週次レポート" : "Weekly report"}</span>
                        <Switch />
                    </div>
                </div>
            ),
        },
        {
            id: "done",
            title: isJa ? "準備完了" : "Ready",
            description: isJa ? "初期設定が完了しました。" : "Initial setup is complete.",
            content: (
                <div className="flex items-center gap-2 rounded-md border bg-primary-subtle p-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{isJa ? "すぐにプロジェクトを開始できます。" : "You can start your project now."}</span>
                </div>
            ),
        },
    ];
};

export function OnboardingFlowAuditDemo({
    locale,
    variant = "default",
}: {
    locale: Locale;
    variant?: "default" | "compact" | "controlled" | "complete";
}) {
    const [index, setIndex] = React.useState(variant === "controlled" ? 1 : 0);
    const [completed, setCompleted] = React.useState(variant === "complete");
    const isJa = locale === "ja";
    const steps = onboardingSteps(locale);

    if (completed) {
        return (
            <div className="w-full max-w-lg rounded-lg border bg-card p-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{isJa ? "オンボーディングが完了しました。" : "Onboarding is complete."}</p>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => { setCompleted(false); setIndex(0); }}>
                    {isJa ? "やり直す" : "Restart"}
                </Button>
            </div>
        );
    }

    return (
        <div className={variant === "compact" ? "w-full max-w-sm" : "w-full max-w-lg"}>
            <OnboardingFlow
                steps={steps}
                currentIndex={variant === "controlled" ? index : undefined}
                onCurrentIndexChange={variant === "controlled" ? setIndex : undefined}
                onComplete={() => setCompleted(true)}
                backLabel={isJa ? "戻る" : "Back"}
                nextLabel={isJa ? "続ける" : "Continue"}
                completeLabel={isJa ? "完了" : "Finish"}
                progressLabel={isJa ? "オンボーディングの進行状況" : "Onboarding progress"}
                stepLabel={(current, total) => isJa ? `${current} / ${total} ステップ` : `Step ${current} of ${total}`}
                backDisabledReason={isJa ? "最初のステップです。" : "This is the first step."}
                bodyMinHeight={250}
            />
        </div>
    );
}

export function PopoverAuditDemo({
    locale,
    variant = "default",
}: {
    locale: Locale;
    variant?: "default" | "filter" | "confirm" | "status";
}) {
    const isJa = locale === "ja";
    const [compact, setCompact] = React.useState(false);
    const [showHelper, setShowHelper] = React.useState(true);
    const [owner, setOwner] = React.useState("");
    const [draftOwner, setDraftOwner] = React.useState("");
    const [published, setPublished] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const config =
        variant === "filter"
            ? {
                title: isJa ? "レビュー担当者" : "Review owner",
                description: isJa ? "担当者で一覧を絞り込む条件です。" : "Filter condition for the review list.",
                value: owner || (isJa ? "未指定" : "Not set"),
                action: owner ? (isJa ? "変更" : "Change") : (isJa ? "設定" : "Set"),
                icon: <Filter className="h-4 w-4" />,
            }
            : variant === "confirm"
                ? {
                    title: isJa ? "公開状態" : "Publish status",
                    description: isJa ? "下書きを公開する前に短く確認します。" : "Light confirmation before publishing the draft.",
                    value: published ? (isJa ? "公開中" : "Published") : (isJa ? "下書き" : "Draft"),
                    action: published ? (isJa ? "確認" : "Review") : (isJa ? "公開" : "Publish"),
                    icon: <MoreHorizontal className="h-4 w-4" />,
                }
                : variant === "status"
                    ? {
                        title: isJa ? "同期状態" : "Sync status",
                        description: isJa ? "現在の処理状態を短く補足します。" : "Short contextual details for the current process.",
                        value: isJa ? "確認中" : "In review",
                        action: isJa ? "詳細" : "Details",
                        icon: <Info className="h-4 w-4" />,
                    }
                    : {
                        title: isJa ? "表示設定" : "Display settings",
                        description: isJa ? "一覧の見え方をその場で調整します。" : "Adjust how the list is displayed in place.",
                        value: [
                            compact ? (isJa ? "コンパクト" : "Compact") : (isJa ? "標準" : "Default"),
                            showHelper ? (isJa ? "補足あり" : "Helper on") : (isJa ? "補足なし" : "Helper off"),
                        ].join(" / "),
                        action: isJa ? "変更" : "Change",
                        icon: <SlidersHorizontal className="h-4 w-4" />,
                    };

    const triggerButton = (
        <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                {config.icon}
                {config.action}
            </Button>
        </PopoverTrigger>
    );

    const shell = (content: React.ReactNode) => (
        <div className="w-full max-w-md rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-semibold">{config.title}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                    <p className="pt-1 text-sm font-medium text-foreground">{config.value}</p>
                </div>
                {content}
            </div>
        </div>
    );

    if (variant === "confirm") {
        return shell(
            <Popover open={open} onOpenChange={setOpen}>
                {triggerButton}
                <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                                {published ? (isJa ? "公開状態を確認" : "Review published status") : (isJa ? "下書きを公開しますか？" : "Publish this draft?")}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {published
                                    ? isJa ? "この項目はすでにチームページへ公開されています。" : "This item is already published to the team page."
                                    : isJa
                                        ? "公開状態を下書きから公開中に変更します。"
                                        : "Changes the status from draft to published."}
                            </p>
                        </div>
                        <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                            {isJa ? "公開先: チームページ" : "Destination: Team page"}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                                {isJa ? "閉じる" : "Close"}
                            </Button>
                            {!published ? (
                                <Button type="button" size="sm" onClick={() => { setPublished(true); setOpen(false); }}>
                                    {isJa ? "公開" : "Publish"}
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    if (variant === "status") {
        return shell(
            <Popover>
                {triggerButton}
                <PopoverContent align="end" className="w-72">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold">{isJa ? "同期状態の詳細" : "Sync status details"}</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between gap-3">
                                <span className="text-muted-foreground">{isJa ? "同期" : "Sync"}</span>
                                <span>{isJa ? "完了" : "Complete"}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-muted-foreground">{isJa ? "レビュー" : "Review"}</span>
                                <span>{isJa ? "確認中" : "In review"}</span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    return shell(
        <Popover open={open} onOpenChange={setOpen}>
            {triggerButton}
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                            {variant === "filter" ? (isJa ? "絞り込み条件" : "Filter criteria") : isJa ? "表示密度を変更" : "Change display density"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            {variant === "filter"
                                ? isJa ? "一覧に表示するレビューを担当者で絞り込みます。" : "Filter reviews by owner without leaving the list."
                                : isJa ? "レビュー一覧の密度と補助情報の表示を変更します。" : "Adjust density and helper text for the review list."}
                        </p>
                    </div>
                    {variant === "filter" ? (
                        <FormGroup>
                            <FormLabel htmlFor="popover-owner">{isJa ? "担当者" : "Owner"}</FormLabel>
                            <FormControl>
                                <Input
                                    id="popover-owner"
                                    value={draftOwner}
                                    onChange={(event) => setDraftOwner(event.target.value)}
                                    placeholder={isJa ? "青井" : "Aoi"}
                                />
                            </FormControl>
                            <FormDescription>
                                {isJa ? "入力した担当者でレビューを絞り込みます。" : "Filters reviews by the entered owner."}
                            </FormDescription>
                        </FormGroup>
                    ) : (
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <span>{isJa ? "コンパクト表示" : "Compact density"}</span>
                                <Switch checked={compact} onCheckedChange={setCompact} />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>{isJa ? "補助情報を表示" : "Show helper text"}</span>
                                <Switch checked={showHelper} onCheckedChange={setShowHelper} />
                            </div>
                        </div>
                    )}
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                            if (variant === "filter") setOwner(draftOwner.trim());
                            setOpen(false);
                        }}
                    >
                        {isJa ? "適用" : "Apply"}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function ShareModalAuditDemo({
    locale,
    variant = "default",
}: {
    locale: Locale;
    variant?: "default" | "private" | "stats";
}) {
    return (
        <PreviewViewport height={520} fillHeight className="bg-muted/30">
            {(container) => (
                <ToastProvider
                    labels={{ close: locale === "ja" ? "閉じる" : "Close" }}
                    portalContainer={container}
                    placement="container"
                >
                    <ShareModalAuditDemoContent locale={locale} variant={variant} container={container} />
                </ToastProvider>
            )}
        </PreviewViewport>
    );
}

function ShareModalAuditDemoContent({
    locale,
    variant,
    container,
}: {
    locale: Locale;
    variant: "default" | "private" | "stats";
    container: HTMLElement | null;
}) {
    const [open, setOpen] = React.useState(false);
    const [item, setItem] = React.useState<ShareableItem>({
        id: "campaign-hero",
        share: {
            isPublic: variant !== "private",
            token: "gjo_7f42ab91",
            accessCount: variant === "stats" ? 128 : 42,
            createdAt: "2026-05-12",
        },
    });
    const isJa = locale === "ja";
    const { showToast } = useToast();
    const labels = isJa
        ? {
            title: "画像を共有",
            publicLink: "公開リンク",
            publicDescription: "リンクを知っている人がこの画像を閲覧できます。",
            privateDescription: "自分だけがこの画像を閲覧できます。",
            publicUrl: "公開 URL",
            sharingDisabled: "共有は無効です",
            sharingDisabledReason: "公開リンクを有効にすると共有 URL を作成できます。",
            accessCount: "アクセス数",
            token: "トークン",
            copy: "URLをコピー",
            copied: "URLをコピーしました",
            copyFailed: "コピーに失敗しました",
            open: "新しいタブで開く",
            close: "閉じる",
            enablePublicLink: "公開リンクを有効にする",
            disablePublicLink: "公開リンクを無効にする",
        }
        : {
            title: "Share image",
            publicLink: "Public link",
            publicDescription: "Anyone with the link can view this image.",
            privateDescription: "Only you can view this image.",
            publicUrl: "Public URL",
            sharingDisabled: "Sharing is disabled",
            sharingDisabledReason: "Turn on the public link switch to create a share URL.",
            accessCount: "Access Count",
            token: "Token",
            copy: "Copy URL",
            copied: "URL copied",
            copyFailed: "Failed to copy",
            open: "Open in new tab",
            close: "Close",
            enablePublicLink: "Turn public link on",
            disablePublicLink: "Turn public link off",
        };

    return (
        <div className="flex h-full min-h-0 items-center justify-center p-6">
            <Button type="button" className="gap-2" onClick={() => setOpen(true)}>
                <Share2 className="h-4 w-4" />
                {isJa ? "共有設定を開く" : "Open sharing"}
            </Button>
            <ShareModal
                isOpen={open}
                onClose={() => setOpen(false)}
                item={item}
                portalContainer={container}
                apiEndpoint="/api/share-demo"
                onToggleShare={(_, enabled) => ({
                    isPublic: enabled,
                    token: "gjo_7f42ab91",
                    accessCount: variant === "stats" ? 128 : 42,
                    createdAt: "2026-05-12",
                })}
                onUpdate={(_, updates) => setItem((current) => ({ ...current, ...updates }))}
                onCopyShareUrl={async (url) => {
                    try {
                        await writeDemoClipboardText(url);
                        showToast(labels.copied, "success", 2200);
                    } catch {
                        showToast(labels.copyFailed, "error", 2600);
                    }
                }}
                onOpenShareUrl={(url) => {
                    showToast(
                        isJa ? `遷移せず URL を確認しました: ${url}` : `Preview checked the URL without navigating: ${url}`,
                        "info",
                        3000
                    );
                }}
                labels={labels}
            />
        </div>
    );
}

export function SheetAuditDemo({
    locale,
    variant = "settings",
}: {
    locale: Locale;
    variant?: "settings" | "left" | "bottom" | "top" | "scroll";
}) {
    const isJa = locale === "ja";
    const [publicLink, setPublicLink] = React.useState(true);
    const side = variant === "left" ? "left" : variant === "bottom" ? "bottom" : variant === "top" ? "top" : "right";
    const isNavigation = variant === "left";
    const isNotice = variant === "top";

    // Managed-scroll long form: SheetBody flexes and scrolls between a pinned
    // header and footer. (#293)
    if (variant === "scroll") {
        return (
            <PreviewViewport height={520} fillHeight className="bg-muted/30">
                {(container) => (
                    <div className="flex h-full min-h-0 items-center justify-center p-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    {isJa ? "長いフォームを開く" : "Open long form"}
                                </Button>
                            </SheetTrigger>
                            <SheetContent portalContainer={container} side="right" closeLabel={isJa ? "閉じる" : "Close"}>
                                <SheetHeader>
                                    <SheetTitle>{isJa ? "プロジェクト設定" : "Project settings"}</SheetTitle>
                                    <SheetDescription>
                                        {isJa ? "ヘッダーとフッターは固定され、中央のフォームだけがスクロールします。" : "The header and footer stay pinned while only the middle form scrolls."}
                                    </SheetDescription>
                                </SheetHeader>
                                <SheetBody className="space-y-4 py-4">
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <div key={index} className="space-y-1.5">
                                            <Label htmlFor={`sheet-scroll-${index}`}>
                                                {(isJa ? "項目 " : "Field ") + (index + 1)}
                                            </Label>
                                            <Input id={`sheet-scroll-${index}`} defaultValue={isJa ? `値 ${index + 1}` : `Value ${index + 1}`} />
                                        </div>
                                    ))}
                                </SheetBody>
                                <SheetFooter className="flex-row justify-end gap-2">
                                    <SheetClose asChild>
                                        <Button variant="outline">{isJa ? "キャンセル" : "Cancel"}</Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button>{isJa ? "保存" : "Save"}</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
            </PreviewViewport>
        );
    }

    return (
        <PreviewViewport height={520} fillHeight className="bg-muted/30">
            {(container) => (
                <div className="flex h-full min-h-0 items-center justify-center p-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Settings className="h-4 w-4" />
                                {isNavigation
                                    ? isJa ? "ナビゲーションを開く" : "Open navigation"
                                    : isNotice
                                        ? isJa ? "通知設定を開く" : "Open notification settings"
                                        : isJa ? "シートを開く" : "Open sheet"}
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            portalContainer={container}
                            side={side}
                            closeLabel={isJa ? "閉じる" : "Close"}
                            className={variant === "bottom" || variant === "top" ? "max-h-[82%]" : undefined}
                        >
                            <SheetHeader>
                                <SheetTitle>
                                    {isNavigation
                                        ? isJa ? "ナビゲーション" : "Navigation"
                                        : isNotice
                                            ? isJa ? "通知設定" : "Notification settings"
                                            : isJa ? "プロジェクト設定" : "Project settings"}
                                </SheetTitle>
                                {!isNavigation ? (
                                    <SheetDescription>
                                        {isNotice
                                            ? isJa ? "ページ上部から短い補助設定を表示します。" : "Shows short supporting settings from the top edge."
                                            : isJa ? "現在の画面を離れずに補助的な設定を編集します。" : "Edit supporting settings without leaving the current screen."}
                                    </SheetDescription>
                                ) : null}
                            </SheetHeader>
                            {isNavigation ? (
                                <nav className="mt-6 space-y-1">
                                    {[isJa ? "概要" : "Overview", isJa ? "素材" : "Assets", isJa ? "メンバー" : "Members", isJa ? "設定" : "Settings"].map((item) => (
                                        <SheetClose key={item} asChild>
                                            <Button variant="ghost" className="w-full justify-start">
                                                {item}
                                            </Button>
                                        </SheetClose>
                                    ))}
                                </nav>
                            ) : isNotice ? (
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/40 p-3">
                                        <Label htmlFor="sheet-email" className="flex flex-col gap-0.5">
                                            <span>{isJa ? "メール通知" : "Email notifications"}</span>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {isJa ? "重要な更新だけをメールで受け取ります。" : "Receive important updates by email."}
                                            </span>
                                        </Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Switch
                                                        id="sheet-email"
                                                        defaultChecked
                                                        aria-label={isJa ? "メール通知を無効にする" : "Turn email notifications off"}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent portalContainer={container}>
                                                    {isJa ? "メール通知を無効にする" : "Turn email notifications off"}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 py-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="sheet-name">{isJa ? "プロジェクト名" : "Project name"}</Label>
                                        <Input id="sheet-name" defaultValue={isJa ? "春キャンペーン" : "Spring campaign"} />
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <Label htmlFor="sheet-public" className="flex flex-col gap-0.5">
                                            <span>{isJa ? "公開リンク" : "Public link"}</span>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {isJa ? "リンクを知っている人が閲覧できます。" : "Anyone with the link can view."}
                                            </span>
                                        </Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Switch
                                                        id="sheet-public"
                                                        checked={publicLink}
                                                        onCheckedChange={setPublicLink}
                                                        aria-label={
                                                            publicLink
                                                                ? isJa ? "公開リンクを無効にする" : "Turn public link off"
                                                                : isJa ? "公開リンクを有効にする" : "Turn public link on"
                                                        }
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent portalContainer={container}>
                                                    {publicLink
                                                        ? isJa ? "公開リンクを無効にする" : "Turn public link off"
                                                        : isJa ? "公開リンクを有効にする" : "Turn public link on"}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            )}
                            {!isNavigation ? (
                                <SheetFooter className="flex-row justify-end gap-2">
                                    <SheetClose asChild>
                                        <Button variant="outline">{isJa ? "キャンセル" : "Cancel"}</Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button>{isJa ? "保存" : "Save"}</Button>
                                    </SheetClose>
                                </SheetFooter>
                            ) : null}
                        </SheetContent>
                    </Sheet>
                </div>
            )}
        </PreviewViewport>
    );
}

export function TooltipAuditDemo({
    locale,
    variant = "icon",
}: {
    locale: Locale;
    variant?: "icon" | "shortcut" | "disabled" | "long" | "placement";
}) {
    const isJa = locale === "ja";

    if (variant === "placement") {
        const placements = [
            { side: "top" as const, label: isJa ? "上" : "Top", tooltip: isJa ? "上に表示" : "Shown above" },
            { side: "right" as const, label: isJa ? "右" : "Right", tooltip: isJa ? "右に表示" : "Shown right" },
            { side: "bottom" as const, label: isJa ? "下" : "Bottom", tooltip: isJa ? "下に表示" : "Shown below" },
            { side: "left" as const, label: isJa ? "左" : "Left", tooltip: isJa ? "左に表示" : "Shown left" },
        ];

        return (
            <TooltipProvider>
                <div className="grid grid-cols-2 gap-3">
                    {placements.map((placement) => (
                        <Tooltip key={placement.side} delayDuration={120}>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">
                                    {placement.label}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side={placement.side}>
                                {placement.tooltip}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={120}>
                <TooltipTrigger asChild>
                    {variant === "icon" ? (
                        <Button variant="outline" size="icon" aria-label={isJa ? "保存" : "Save"}>
                            <Save className="h-4 w-4" />
                        </Button>
                    ) : variant === "disabled" ? (
                        <span tabIndex={0} className="inline-flex">
                            <Button disabled>{isJa ? "公開" : "Publish"}</Button>
                        </span>
                    ) : (
                        <Button variant="outline" className="gap-2">
                            {variant === "long" ? <HelpCircle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            {variant === "long" ? (isJa ? "補足を見る" : "Show note") : isJa ? "生成" : "Generate"}
                        </Button>
                    )}
                </TooltipTrigger>
                <TooltipContent
                    side={variant === "long" ? "right" : "top"}
                    className={variant === "long" ? "max-w-64 text-left" : undefined}
                >
                    {variant === "shortcut" ? (
                        <span className="flex items-center gap-2">
                            {isJa ? "生成を開始" : "Start generation"}
                            <Kbd>⌘ Enter</Kbd>
                        </span>
                    ) : variant === "disabled" ? (
                        isJa ? "レビューが完了するまで公開できません。" : "You can publish after review is complete."
                    ) : variant === "long" ? (
                        isJa ? "操作の結果や注意点を短く補足します。長い説明はポップオーバーやダイアログに分けます。" : "Use concise helper copy. Move long explanations into a popover or dialog."
                    ) : (
                        isJa ? "変更を保存" : "Save changes"
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
