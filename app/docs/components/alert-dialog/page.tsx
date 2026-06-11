"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    AlertDialogAuditDemo,
} from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";

const codeByLocale = {
    ja: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  buttonVariants,
  cn,
} from "@gunjo/ui";
import { IconTrash as Trash2 } from "@tabler/icons-react";

export function DeleteProjectDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          プロジェクトを削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>このプロジェクトを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            関連するタスク、ファイル、共有リンクも削除されます。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
    en: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  buttonVariants,
  cn,
} from "@gunjo/ui";
import { IconTrash as Trash2 } from "@tabler/icons-react";

export function DeleteProjectDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            Related tasks, files, and shared links will be removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
} as const;

const leavePageCodeByLocale = {
    ja: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@gunjo/ui";

export function UnsavedChangesGuard() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">ページを離れる</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>未保存の変更があります</AlertDialogTitle>
          <AlertDialogDescription>
            今移動すると下書きは破棄されます。保存してから移動してください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>戻る</AlertDialogCancel>
          <AlertDialogAction>破棄して移動</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
    en: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@gunjo/ui";

export function UnsavedChangesGuard() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Leave page</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            Leaving now will discard your draft. Save first to keep it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction>Discard and leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
} as const;

const accessRequestCodeByLocale = {
    ja: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@gunjo/ui";

export function AccessRequestDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">公開設定を変更</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>管理者の承認が必要です</AlertDialogTitle>
          <AlertDialogDescription>
            この設定を変更するには、ワークスペース管理者への申請が必要です。申請理由を添えて送信します。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction>承認を申請</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
    en: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@gunjo/ui";

export function AccessRequestDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Change visibility</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Admin approval is required</AlertDialogTitle>
          <AlertDialogDescription>
            Changing this setting requires approval from a workspace admin. Send a request with the reason attached.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Request approval</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
} as const;

const targetSummaryCodeByLocale = {
    ja: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  buttonVariants,
  cn,
} from "@gunjo/ui";
import { IconTrash as Trash2 } from "@tabler/icons-react";

export function DeleteFolderDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          フォルダを削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>フォルダを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            このフォルダ内の素材は未分類へ移動します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
          Web サイト素材
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
    en: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  buttonVariants,
  cn,
} from "@gunjo/ui";
import { IconTrash as Trash2 } from "@tabler/icons-react";

export function DeleteFolderDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete folder
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this folder?</AlertDialogTitle>
          <AlertDialogDescription>
            Assets in this folder will be moved to Uncategorized. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium">
          Website assets
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
} as const;

export default function AlertDialogPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = codeByLocale[locale];
    const leavePageCode = leavePageCodeByLocale[locale];
    const accessRequestCode = accessRequestCodeByLocale[locale];
    const targetSummaryCode = targetSummaryCodeByLocale[locale];

    return (
        <ComponentLayout
            title={overlayMetadata.alertDialog.title}
            description={overlayMetadata.alertDialog.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Dialog", href: "/docs/components/dialog" },
            ]}
            relatedComponents={[
                { name: "Dialog", href: "/docs/components/dialog" },
                { name: "Toast", href: "/docs/components/toast" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/alert-dialog"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight={360}
            >
                <AlertDialogAuditDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "destructive",
                            title: isJa ? "破壊的操作の確認" : "Destructive confirmation",
                            description: isJa
                                ? "削除など取り消せない操作は、起点のボタンと確定操作の両方を destructive にします。"
                                : "Use destructive styling for both the trigger and final action when the operation cannot be undone.",
                            preview: <AlertDialogAuditDemo />,
                            code,
                            embedSrc: "/embed/alert-dialog?variant=destructive",
                            previewHeight: 360,
                        },
                        {
                            key: "unsaved-changes",
                            title: isJa ? "未保存変更のガード" : "Unsaved-changes guard",
                            description: isJa
                                ? "ページ遷移や破棄の前に、ユーザーが意図を確認する必要がある場面に使います。"
                                : "Use it before navigation or discard flows where the user must explicitly confirm intent.",
                            preview: <AlertDialogAuditDemo variant="unsaved" />,
                            code: leavePageCode,
                            embedSrc: "/embed/alert-dialog?variant=unsaved",
                            previewHeight: 360,
                        },
                        {
                            key: "access-request",
                            title: isJa ? "権限が必要な操作" : "Permission-gated action",
                            description: isJa
                                ? "実行できない操作は、理由と次の行動を確認ダイアログで明示します。"
                                : "Explain why the action is blocked and what the next step is.",
                            preview: <AlertDialogAuditDemo variant="access-request" />,
                            code: accessRequestCode,
                            embedSrc: "/embed/alert-dialog?variant=access-request",
                            previewHeight: 360,
                        },
                        {
                            key: "target-summary",
                            title: isJa ? "対象情報付きの削除確認" : "Delete confirmation with target summary",
                            description: isJa
                                ? "削除対象を明示し、ユーザーがどのデータに影響するか確認できるようにします。"
                                : "Show the target so the user can verify which data will be affected.",
                            preview: <AlertDialogAuditDemo variant="target-summary" />,
                            code: targetSummaryCode,
                            embedSrc: "/embed/alert-dialog?variant=target-summary",
                            previewHeight: 360,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        {
                            name: "open",
                            type: "boolean",
                            description: isJa ? "開閉状態を外部で制御します。" : "Controlled open state.",
                        },
                        {
                            name: "onOpenChange",
                            type: "(open: boolean) => void",
                            description: isJa ? "開閉状態が変わった時に呼び出されます。" : "Called when the open state changes.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa
                                ? "プレビュー枠や疑似ブラウザ内に閉じ込めたい場合のポータル先です。"
                                : "Portal target for keeping the dialog inside a preview or framed app.",
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </section>
        </ComponentLayout>
    );
}
