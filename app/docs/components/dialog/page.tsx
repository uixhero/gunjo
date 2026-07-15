"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DialogAuditDemo } from "@/components/demos/OverlayComponentDemos";
import overlayMetadata from "@design/overlay-metadata.json";

const codeByLocale = {
    ja: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from "@gunjo/ui";

export function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">プロフィールを編集</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[440px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
          <DialogDescription>
            表示名とハンドル名を更新します。保存するまで変更は反映されません。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
            <Label htmlFor="display-name" className="sm:text-right">表示名</Label>
            <Input id="display-name" className="w-full" defaultValue="青井 はな" />
          </div>
          <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
            <Label htmlFor="handle" className="sm:text-right">ハンドル</Label>
            <Input id="handle" className="w-full" defaultValue="@aoi" />
          </div>
          <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)]">
            <Label htmlFor="bio" className="pt-2 sm:text-right">メモ</Label>
            <Textarea id="bio" className="w-full" defaultValue="デザインシステムを管理しています。" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
    en: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from "@gunjo/ui";

export function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[440px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update the display name and handle. Changes are not applied until saved.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
            <Label htmlFor="display-name" className="sm:text-right">Display name</Label>
            <Input id="display-name" className="w-full" defaultValue="Aoi Hana" />
          </div>
          <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
            <Label htmlFor="handle" className="sm:text-right">Handle</Label>
            <Input id="handle" className="w-full" defaultValue="@aoi" />
          </div>
          <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)]">
            <Label htmlFor="bio" className="pt-2 sm:text-right">Note</Label>
            <Textarea id="bio" className="w-full" defaultValue="Maintains the design system." />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
} as const;

const confirmationCodeByLocale = {
    ja: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gunjo/ui";

export function PublishDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>公開する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロジェクトを公開しますか？</DialogTitle>
          <DialogDescription>
            最新の変更を本番環境へ反映します。公開後もロールバックできます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button>公開</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
    en: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gunjo/ui";

export function PublishDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish project?</DialogTitle>
          <DialogDescription>
            This deploys the latest changes to production. You can roll back after publishing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
} as const;

const summaryCodeByLocale = {
    ja: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gunjo/ui";

export function ReviewChangesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">変更内容を確認</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>公開前の確認</DialogTitle>
          <DialogDescription>
            今回の公開に含まれる変更と影響範囲を要約して確認します。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 rounded-md border bg-muted/30 p-3 text-sm sm:grid-cols-2">
          <div>
            <p className="font-medium">含まれる変更</p>
            <p className="mt-1 text-muted-foreground">
              プロフィール、招待メール、通知設定
            </p>
          </div>
          <div>
            <p className="font-medium">影響範囲</p>
            <p className="mt-1 text-muted-foreground">
              ワークスペース全体
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">戻る</Button>
          </DialogClose>
          <Button>確認しました</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
    en: `import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@gunjo/ui";

export function ReviewChangesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Review changes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Pre-publish review</DialogTitle>
          <DialogDescription>
            Review a summary of included changes and impact before publishing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 rounded-md border bg-muted/30 p-3 text-sm sm:grid-cols-2">
          <div>
            <p className="font-medium">Included changes</p>
            <p className="mt-1 text-muted-foreground">
              Profile, invitation email, notification defaults
            </p>
          </div>
          <div>
            <p className="font-medium">Impact</p>
            <p className="mt-1 text-muted-foreground">
              Entire workspace
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Back</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
} as const;

const scrollCodeByLocale = {
    ja: `import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@gunjo/ui";

// DialogBody を直下に置くと DialogContent が高さ制限つきの flex 列になり、
// ヘッダー/フッターは固定・中央だけがスクロールします。
export function LongFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">長いフォームを開く</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
          <DialogDescription>ヘッダーとフッターは固定され、中央のフォームだけがスクロールします。</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input id={field.id} defaultValue={field.value} />
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
    en: `import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@gunjo/ui";

// A DialogBody as a direct child makes DialogContent a bounded flex column, so
// the header and footer stay pinned while only the middle scrolls.
export function LongFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open long form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>The header and footer stay pinned while only the middle form scrolls.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input id={field.id} defaultValue={field.value} />
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
} as const;

export default function DialogPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = codeByLocale[locale];
    const confirmationCode = confirmationCodeByLocale[locale];
    const summaryCode = summaryCodeByLocale[locale];
    const scrollCode = scrollCodeByLocale[locale];

    return (
        <ComponentLayout
            title={overlayMetadata.dialog.title}
            description={overlayMetadata.dialog.description}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Textarea", href: "/docs/components/textarea" },
            ]}
            relatedComponents={[
                { name: "AlertDialog", href: "/docs/components/alert-dialog" },
                { name: "Drawer", href: "/docs/components/drawer" },
            ]}
        >
            <ComponentPreview
                embedSrc="/embed/dialog"
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewHeight={600}
                previewBodyWidth="lg"
            >
                <DialogAuditDemo />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {isJa ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "form",
                            title: isJa ? "フォームを含む" : "With form",
                            description: isJa
                                ? "画面遷移せずに短い編集を完了するための標準的な構成です。"
                                : "A standard composition for quick edits without leaving the current page.",
                            preview: <DialogAuditDemo />,
                            code,
                            embedSrc: "/embed/dialog?variant=form",
                            previewHeight: 600,
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "confirmation",
                            title: isJa ? "通常操作の確認" : "Action confirmation",
                            description: isJa
                                ? "取り消せる操作や軽い確認は Dialog、取り消せない操作は AlertDialog を使います。"
                                : "Use Dialog for reversible confirmations; use AlertDialog for irreversible actions.",
                            preview: <DialogAuditDemo variant="confirmation" />,
                            code: confirmationCode,
                            previewHeight: 600,
                            embedSrc: "/embed/dialog?variant=confirmation",
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "summary",
                            title: isJa ? "要約付きの確認" : "With summary",
                            description: isJa
                                ? "長い本文をそのまま入れず、要点を短くまとめて確認しやすくします。"
                                : "Summarize long content so the dialog stays quick to review.",
                            preview: <DialogAuditDemo variant="summary" />,
                            code: summaryCode,
                            previewHeight: 600,
                            embedSrc: "/embed/dialog?variant=summary",
                            previewBodyWidth: "lg",
                        },
                        {
                            key: "scroll",
                            title: isJa ? "長いフォーム（スクロール）" : "Long form (scroll)",
                            description: isJa
                                ? "DialogBody を直下に置くと、ダイアログが高さ制限され、ヘッダー/フッター固定・中央スクロールになります。"
                                : "A DialogBody direct child bounds the dialog height — the header/footer stay pinned and only the middle scrolls.",
                            preview: <DialogAuditDemo variant="scroll" />,
                            code: scrollCode,
                            previewHeight: 600,
                            embedSrc: "/embed/dialog?variant=scroll",
                            previewBodyWidth: "lg",
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
                            description: isJa ? "開閉状態が変わった時に呼び出されます。" : "Called when open state changes.",
                        },
                        {
                            name: "showCloseButton",
                            type: "boolean",
                            default: "true",
                            description: isJa ? "右上の閉じるボタンを表示するかを制御します。" : "Controls whether the default close button is rendered.",
                        },
                        {
                            name: "portalContainer",
                            type: "HTMLElement | null",
                            description: isJa ? "プレビュー枠や疑似ブラウザ内に閉じ込めたい場合のポータル先です。" : "Portal target for framed previews or contained app surfaces.",
                        },
                        {
                            name: "DialogBody",
                            type: "React.HTMLAttributes<HTMLDivElement>",
                            description: isJa
                                ? "長いフォーム用のスクロール領域。DialogContent の直下に置くと Content が高さ制限つき flex 列になり、ヘッダー/フッター固定・中央スクロールになります。(#293)"
                                : "Scroll region for long forms. As a direct child of DialogContent it makes the content a bounded flex column — header/footer pinned, middle scrolls. (#293)",
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
