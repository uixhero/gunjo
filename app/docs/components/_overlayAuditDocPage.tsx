"use client";

import * as React from "react";
import { ComponentDemoStates, type DemoState } from "@/components/doc/ComponentDemoStates";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import overlayMetadata from "@design/overlay-metadata.json";

type Locale = "ja" | "en";

type OverlayAuditKind =
    | "media-lightbox"
    | "media-picker-dialog"
    | "modal"
    | "onboarding-flow"
    | "popover"
    | "share-modal"
    | "sheet"
    | "tooltip";

type PropRow = {
    name: string;
    type: string;
    default?: string;
    required?: boolean;
    description: string;
};

type OverlayDocConfig = {
    metadataKey: keyof typeof overlayMetadata;
    embed: string;
    previewHeight: number;
    code: Record<Locale, string>;
    props: Record<Locale, PropRow[]>;
    states: Record<Locale, DemoState[]>;
    usedComponents?: { name: string; href: string }[];
    relatedComponents?: { name: string; href: string }[];
};

const MEDIA_ASSET_DATA = `const assets = [
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
];`;

function overlayState(
    key: string,
    title: string,
    description: string,
    embed: string,
    variant: string,
    code: string,
    previewHeight = 500
): DemoState {
    return {
        key,
        title,
        description,
        embedSrc: `${embed}?variant=${variant}`,
        preview: <div />,
        code,
        previewBodyWidth: "full",
        previewHeight,
        fitEmbedHeightContent: false,
    };
}

const lightboxCode = {
    ja: `import * as React from "react";
import { Button, MediaLightbox } from "@gunjo/ui";

${MEDIA_ASSET_DATA}

export function MediaLightboxExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const asset = assets[index];

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        ライトボックスを開く
      </Button>
      <MediaLightbox
        open={open}
        onOpenChange={setOpen}
        asset={asset}
        hasPrevious={index > 0}
        hasNext={index < assets.length - 1}
        onPrevious={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(assets.length - 1, value + 1))}
        onShare={(nextAsset) => console.log("share", nextAsset.id)}
        onDetails={(nextAsset) => console.log("details", nextAsset.id)}
      />
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, MediaLightbox } from "@gunjo/ui";

${MEDIA_ASSET_DATA}

export function MediaLightboxExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const asset = assets[index];

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open lightbox
      </Button>
      <MediaLightbox
        open={open}
        onOpenChange={setOpen}
        asset={asset}
        hasPrevious={index > 0}
        hasNext={index < assets.length - 1}
        onPrevious={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(assets.length - 1, value + 1))}
        onShare={(nextAsset) => console.log("share", nextAsset.id)}
        onDetails={(nextAsset) => console.log("details", nextAsset.id)}
      />
    </>
  );
}`,
};

const mediaPickerCode = {
    ja: `import * as React from "react";
import { Button, MediaPickerDialog } from "@gunjo/ui";

${MEDIA_ASSET_DATA}

export function MediaPickerDialogExample() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([assets[0]]);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        メディアを選択
      </Button>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        items={assets}
        selectedIds={selected.map((asset) => asset.id)}
        multiSelect
        onConfirm={setSelected}
        labels={{
          title: "メディアを選択",
          description: "ライブラリから使用する素材を選択します。",
          searchPlaceholder: "タイトルや形式で検索",
          cancel: "キャンセル",
          confirm: (count) => \`\${count}件を追加\`,
          emptyTitle: "素材がありません",
          emptyDescription: "検索条件を変えるか、素材をアップロードしてください。",
          close: "閉じる",
        }}
      />
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, MediaPickerDialog } from "@gunjo/ui";

${MEDIA_ASSET_DATA}

export function MediaPickerDialogExample() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([assets[0]]);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Choose media
      </Button>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        items={assets}
        selectedIds={selected.map((asset) => asset.id)}
        multiSelect
        onConfirm={setSelected}
        labels={{
          confirm: (count) => \`\${count} selected\`,
        }}
      />
    </>
  );
}`,
};

const modalCode = {
    ja: `import * as React from "react";
import { Button, Modal } from "@gunjo/ui";

export function ModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        モーダルを開く
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="公開設定を変更"
        closeLabel="閉じる"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              保存
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            変更内容は保存後にチームへ反映されます。
          </p>
        </div>
      </Modal>
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, Modal } from "@gunjo/ui";

export function ModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Change publish settings"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Changes will be visible to the team after saving.
          </p>
        </div>
      </Modal>
    </>
  );
}`,
};

const modalFormCode = {
    ja: `import * as React from "react";
import { Button, FormControl, FormDescription, FormGroup, FormLabel, Input, Modal } from "@gunjo/ui";

export function ModalFormExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        フォームを開く
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="公開設定を変更"
        closeLabel="閉じる"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              保存
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            公開名と説明を編集します。
          </p>
          <FormGroup>
            <FormLabel htmlFor="modal-title">タイトル</FormLabel>
            <FormControl>
              <Input id="modal-title" defaultValue="キャンペーン素材" />
            </FormControl>
            <FormDescription>
              公開ページと共有リンクに表示されます。
            </FormDescription>
          </FormGroup>
        </div>
      </Modal>
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, FormControl, FormDescription, FormGroup, FormLabel, Input, Modal } from "@gunjo/ui";

export function ModalFormExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open form
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Change publish settings"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Edit the public name and description.
          </p>
          <FormGroup>
            <FormLabel htmlFor="modal-title">Title</FormLabel>
            <FormControl>
              <Input id="modal-title" defaultValue="Campaign assets" />
            </FormControl>
            <FormDescription>
              Shown on the public page and shared links.
            </FormDescription>
          </FormGroup>
        </div>
      </Modal>
    </>
  );
}`,
};

const modalDestructiveCode = {
    ja: `import * as React from "react";
import { Button, Modal } from "@gunjo/ui";

export function DestructiveModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        削除を確認
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="素材を削除しますか？"
        closeLabel="閉じる"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
              削除
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          この操作は取り消せません。削除前に対象を確認してください。
        </p>
      </Modal>
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, Modal } from "@gunjo/ui";

export function DestructiveModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        Confirm delete
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete asset?"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Confirm the target before deleting.
        </p>
      </Modal>
    </>
  );
}`,
};

const modalNoFooterCode = {
    ja: `import * as React from "react";
import { Button, Modal } from "@gunjo/ui";

export function NoFooterModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        お知らせを開く
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="公開範囲のお知らせ"
        closeLabel="閉じる"
      >
        <p className="text-sm text-muted-foreground">
          この通知は確認用です。閉じるボタンまたは Esc キーで閉じられます。
        </p>
      </Modal>
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, Modal } from "@gunjo/ui";

export function NoFooterModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open notice
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Visibility notice"
      >
        <p className="text-sm text-muted-foreground">
          This notice is informational. Close it with the close button or Escape.
        </p>
      </Modal>
    </>
  );
}`,
};

const modalTabsCode = {
    ja: `import * as React from "react";
import { Button, Modal, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui";

export function TabsModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        詳細設定を開く
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="プロジェクト詳細"
        closeLabel="閉じる"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              更新
            </Button>
          </>
        }
      >
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="summary">概要</TabsTrigger>
            <TabsTrigger value="members">メンバー</TabsTrigger>
            <TabsTrigger value="history">履歴</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-0 space-y-2 text-sm text-muted-foreground">
            <p>公開中のプロジェクト情報と現在の状態を確認できます。</p>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              ステータス: 公開中
            </div>
          </TabsContent>
          <TabsContent value="members" className="mt-0 space-y-2 text-sm text-muted-foreground">
            <p>編集できるメンバーと権限を確認します。</p>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              3人の編集者
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-0 space-y-2 text-sm text-muted-foreground">
            <p>直近の更新履歴を確認できます。</p>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              最終更新: 2026-05-31
            </div>
          </TabsContent>
        </Tabs>
      </Modal>
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, Modal, Tabs, TabsContent, TabsList, TabsTrigger } from "@gunjo/ui";

export function TabsModalExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Open details
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Project details"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Update
            </Button>
          </>
        }
      >
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-0 space-y-2 text-sm text-muted-foreground">
            <p>Review the published project details and current status.</p>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              Status: Published
            </div>
          </TabsContent>
          <TabsContent value="members" className="mt-0 space-y-2 text-sm text-muted-foreground">
            <p>Review members and permissions.</p>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              3 editors
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-0 space-y-2 text-sm text-muted-foreground">
            <p>Review recent updates.</p>
            <div className="rounded-md border bg-muted/40 p-3 text-foreground">
              Last updated: 2026-05-31
            </div>
          </TabsContent>
        </Tabs>
      </Modal>
    </>
  );
}`,
};

const onboardingCode = {
    ja: `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, Input, OnboardingFlow, Switch } from "@gunjo/ui";

const steps = [
  {
    id: "profile",
    title: "プロフィールを作成",
    description: "表示名と所属を入力します。",
    content: (
      <div className="grid gap-3">
        <FormGroup>
          <FormLabel htmlFor="name">表示名</FormLabel>
          <FormControl>
            <Input id="name" placeholder="青井 花" />
          </FormControl>
          <FormDescription>チーム内で表示される名前です。</FormDescription>
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="team">チーム</FormLabel>
          <FormControl>
            <Input id="team" placeholder="マーケティング" />
          </FormControl>
        </FormGroup>
      </div>
    ),
  },
  {
    id: "workspace",
    title: "ワークスペースを設定",
    description: "通知と公開範囲を決めます。",
    content: (
      <div className="flex items-center justify-between rounded-md border p-3">
        <span>公開リンクを許可</span>
        <Switch defaultChecked />
      </div>
    ),
  },
  {
    id: "done",
    title: "準備完了",
    description: "初期設定が完了しました。",
    content: <p className="text-sm">すぐにプロジェクトを開始できます。</p>,
  },
];

export function OnboardingFlowExample() {
  return (
    <OnboardingFlow
      steps={steps}
      backLabel="戻る"
      nextLabel="続ける"
      completeLabel="完了"
      progressLabel="オンボーディングの進行状況"
      stepLabel={(current, total) => \`\${current} / \${total} ステップ\`}
      backDisabledReason="最初のステップです。"
      bodyMinHeight={250}
      onComplete={() => console.log("completed")}
    />
  );
}`,
    en: `import * as React from "react";
import { FormControl, FormDescription, FormGroup, FormLabel, Input, OnboardingFlow, Switch } from "@gunjo/ui";

const steps = [
  {
    id: "profile",
    title: "Create profile",
    description: "Add a display name and organization.",
    content: (
      <div className="grid gap-3">
        <FormGroup>
          <FormLabel htmlFor="name">Display name</FormLabel>
          <FormControl>
            <Input id="name" placeholder="Aoi Hana" />
          </FormControl>
          <FormDescription>Shown to teammates in the workspace.</FormDescription>
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="team">Team</FormLabel>
          <FormControl>
            <Input id="team" placeholder="Marketing" />
          </FormControl>
        </FormGroup>
      </div>
    ),
  },
  {
    id: "workspace",
    title: "Set up workspace",
    description: "Choose visibility and notifications.",
    content: (
      <div className="flex items-center justify-between rounded-md border p-3">
        <span>Allow public links</span>
        <Switch defaultChecked />
      </div>
    ),
  },
  {
    id: "done",
    title: "Ready",
    description: "Initial setup is complete.",
    content: <p className="text-sm">You can start your project now.</p>,
  },
];

export function OnboardingFlowExample() {
  return (
    <OnboardingFlow
      steps={steps}
      backDisabledReason="This is the first step."
      bodyMinHeight={250}
      onComplete={() => console.log("completed")}
    />
  );
}`,
};

const onboardingControlledCode = {
    ja: `import * as React from "react";
import { Button, OnboardingFlow, type OnboardingStep } from "@gunjo/ui";

const steps: OnboardingStep[] = [
  { id: "profile", title: "プロフィール", description: "基本情報を確認します。", content: <p className="text-sm">表示名とチームを確認済みです。</p> },
  { id: "workspace", title: "ワークスペース", description: "公開範囲を確認します。", content: <p className="text-sm">公開リンクと通知設定を確認します。</p> },
  { id: "done", title: "完了", description: "開始できます。", content: <p className="text-sm">初期設定が完了しました。</p> },
];

export function ControlledOnboardingFlowExample() {
  const [index, setIndex] = React.useState(1);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setIndex(0)}>先頭へ</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setIndex(2)}>完了へ</Button>
      </div>
      <OnboardingFlow
        steps={steps}
        currentIndex={index}
        onCurrentIndexChange={setIndex}
        backLabel="戻る"
        nextLabel="続ける"
        completeLabel="完了"
        progressLabel="オンボーディングの進行状況"
        stepLabel={(current, total) => \`\${current} / \${total} ステップ\`}
        backDisabledReason="最初のステップです。"
        bodyMinHeight={250}
      />
    </div>
  );
}`,
    en: `import * as React from "react";
import { Button, OnboardingFlow, type OnboardingStep } from "@gunjo/ui";

const steps: OnboardingStep[] = [
  { id: "profile", title: "Profile", description: "Review basic details.", content: <p className="text-sm">Display name and team are ready.</p> },
  { id: "workspace", title: "Workspace", description: "Review visibility.", content: <p className="text-sm">Review public links and notifications.</p> },
  { id: "done", title: "Complete", description: "Ready to start.", content: <p className="text-sm">Initial setup is complete.</p> },
];

export function ControlledOnboardingFlowExample() {
  const [index, setIndex] = React.useState(1);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setIndex(0)}>First</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setIndex(2)}>Done</Button>
      </div>
      <OnboardingFlow
        steps={steps}
        currentIndex={index}
        onCurrentIndexChange={setIndex}
        backDisabledReason="This is the first step."
        bodyMinHeight={250}
      />
    </div>
  );
}`,
};

const onboardingCompleteCode = {
    ja: `import * as React from "react";
import { Button } from "@gunjo/ui";

export function OnboardingCompleteExample() {
  return (
    <div className="w-full max-w-lg rounded-lg border bg-card p-6 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">オンボーディングが完了しました。</p>
      <p className="mt-1">入力した内容でワークスペースを開始できます。</p>
      <Button type="button" variant="outline" size="sm" className="mt-3">
        やり直す
      </Button>
    </div>
  );
}`,
    en: `import * as React from "react";
import { Button } from "@gunjo/ui";

export function OnboardingCompleteExample() {
  return (
    <div className="w-full max-w-lg rounded-lg border bg-card p-6 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Onboarding is complete.</p>
      <p className="mt-1">The workspace can start with the details you entered.</p>
      <Button type="button" variant="outline" size="sm" className="mt-3">
        Restart
      </Button>
    </div>
  );
}`,
};

const popoverCode = {
    ja: `import * as React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger, Switch } from "@gunjo/ui";
import { IconAdjustmentsHorizontal as SlidersHorizontal } from "@tabler/icons-react";

export function PopoverExample() {
  const [compact, setCompact] = React.useState(false);
  const [showHelper, setShowHelper] = React.useState(true);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">表示設定</p>
        <p className="text-xs text-muted-foreground">一覧の見え方をその場で調整します。</p>
        <p className="pt-1 text-sm font-medium">
          {compact ? "コンパクト" : "標準"} / {showHelper ? "補足あり" : "補足なし"}
        </p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            変更
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold">表示密度を変更</h4>
              <p className="text-xs text-muted-foreground">
                レビュー一覧の密度と補助情報の表示を変更します。
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span>コンパクト表示</span>
                <Switch checked={compact} onCheckedChange={setCompact} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>補助情報を表示</span>
                <Switch checked={showHelper} onCheckedChange={setShowHelper} />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
    en: `import * as React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger, Switch } from "@gunjo/ui";
import { IconAdjustmentsHorizontal as SlidersHorizontal } from "@tabler/icons-react";

export function PopoverExample() {
  const [compact, setCompact] = React.useState(false);
  const [showHelper, setShowHelper] = React.useState(true);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">Display settings</p>
        <p className="text-xs text-muted-foreground">Adjust how the list is displayed in place.</p>
        <p className="pt-1 text-sm font-medium">
          {compact ? "Compact" : "Default"} / {showHelper ? "Helper on" : "Helper off"}
        </p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Change
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Change display density</h4>
              <p className="text-xs text-muted-foreground">
                Adjust density and helper text for the review list.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span>Compact density</span>
                <Switch checked={compact} onCheckedChange={setCompact} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Show helper text</span>
                <Switch checked={showHelper} onCheckedChange={setShowHelper} />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
};

const popoverFilterCode = {
    ja: `import * as React from "react";
import { Button, FormControl, FormDescription, FormGroup, FormLabel, Input, Popover, PopoverContent, PopoverTrigger } from "@gunjo/ui";
import { IconFilter as Filter } from "@tabler/icons-react";

export function FilterPopoverExample() {
  const [owner, setOwner] = React.useState("");
  const [draftOwner, setDraftOwner] = React.useState("");

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">レビュー担当者</p>
        <p className="text-xs text-muted-foreground">担当者で一覧を絞り込む条件です。</p>
        <p className="pt-1 text-sm font-medium">{owner || "未指定"}</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" />
            {owner ? "変更" : "設定"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">絞り込み条件</h4>
              <p className="text-xs text-muted-foreground">
                一覧に表示するレビューを担当者で絞り込みます。
              </p>
            </div>
            <FormGroup>
              <FormLabel htmlFor="filter-owner">担当者</FormLabel>
              <FormControl>
                <Input
                  id="filter-owner"
                  value={draftOwner}
                  onChange={(event) => setDraftOwner(event.target.value)}
                  placeholder="青井"
                />
              </FormControl>
              <FormDescription>入力した担当者でレビューを絞り込みます。</FormDescription>
            </FormGroup>
            <Button size="sm" className="w-full" onClick={() => setOwner(draftOwner.trim())}>
              適用
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
    en: `import * as React from "react";
import { Button, FormControl, FormDescription, FormGroup, FormLabel, Input, Popover, PopoverContent, PopoverTrigger } from "@gunjo/ui";
import { IconFilter as Filter } from "@tabler/icons-react";

export function FilterPopoverExample() {
  const [owner, setOwner] = React.useState("");
  const [draftOwner, setDraftOwner] = React.useState("");

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">Review owner</p>
        <p className="text-xs text-muted-foreground">Filter condition for the review list.</p>
        <p className="pt-1 text-sm font-medium">{owner || "Not set"}</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" />
            {owner ? "Change" : "Set"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Filter criteria</h4>
              <p className="text-xs text-muted-foreground">
                Filter reviews by owner without leaving the list.
              </p>
            </div>
            <FormGroup>
              <FormLabel htmlFor="filter-owner">Owner</FormLabel>
              <FormControl>
                <Input
                  id="filter-owner"
                  value={draftOwner}
                  onChange={(event) => setDraftOwner(event.target.value)}
                  placeholder="Aoi"
                />
              </FormControl>
              <FormDescription>Filters reviews by the entered owner.</FormDescription>
            </FormGroup>
            <Button size="sm" className="w-full" onClick={() => setOwner(draftOwner.trim())}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
};

const popoverConfirmCode = {
    ja: `import * as React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@gunjo/ui";
import { IconDots as MoreHorizontal } from "@tabler/icons-react";

export function ConfirmPopoverExample() {
  const [published, setPublished] = React.useState(false);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">公開状態</p>
        <p className="text-xs text-muted-foreground">下書きを公開する前に短く確認します。</p>
        <p className="pt-1 text-sm font-medium">{published ? "公開中" : "下書き"}</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MoreHorizontal className="h-4 w-4" />
            {published ? "確認" : "公開"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                {published ? "公開状態を確認" : "下書きを公開しますか？"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {published ? "この項目はすでにチームページへ公開されています。" : "公開状態を下書きから公開中に変更します。"}
              </p>
            </div>
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              公開先: チームページ
            </div>
            {!published ? (
              <Button type="button" size="sm" className="w-full" onClick={() => setPublished(true)}>
                公開
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
    en: `import * as React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@gunjo/ui";
import { IconDots as MoreHorizontal } from "@tabler/icons-react";

export function ConfirmPopoverExample() {
  const [published, setPublished] = React.useState(false);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">Publish status</p>
        <p className="text-xs text-muted-foreground">Light confirmation before publishing the draft.</p>
        <p className="pt-1 text-sm font-medium">{published ? "Published" : "Draft"}</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MoreHorizontal className="h-4 w-4" />
            {published ? "Review" : "Publish"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                {published ? "Review published status" : "Publish this draft?"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {published ? "This item is already published to the team page." : "Changes the status from draft to published."}
              </p>
            </div>
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              Destination: Team page
            </div>
            {!published ? (
              <Button type="button" size="sm" className="w-full" onClick={() => setPublished(true)}>
                Publish
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
};

const popoverStatusCode = {
    ja: `import { Button, Popover, PopoverContent, PopoverTrigger } from "@gunjo/ui";
import { IconInfoCircle as Info } from "@tabler/icons-react";

export function StatusPopoverExample() {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">同期状態</p>
        <p className="text-xs text-muted-foreground">現在の処理状態を短く補足します。</p>
        <p className="pt-1 text-sm font-medium">確認中</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Info className="h-4 w-4" />
            詳細
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72">
          <div className="space-y-3">
            <p className="text-sm font-semibold">同期状態の詳細</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">同期</span>
                <span>完了</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">レビュー</span>
                <span>確認中</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
    en: `import { Button, Popover, PopoverContent, PopoverTrigger } from "@gunjo/ui";
import { IconInfoCircle as Info } from "@tabler/icons-react";

export function StatusPopoverExample() {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
      <div>
        <p className="text-sm font-semibold">Sync status</p>
        <p className="text-xs text-muted-foreground">Short contextual details for the current process.</p>
        <p className="pt-1 text-sm font-medium">In review</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Info className="h-4 w-4" />
            Details
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72">
          <div className="space-y-3">
            <p className="text-sm font-semibold">Sync status details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Sync</span>
                <span>Complete</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Review</span>
                <span>In review</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
};

const shareCode = {
    ja: `import * as React from "react";
import { Button, ShareModal, ToastProvider, useToast } from "@gunjo/ui";

async function writeClipboardText(text: string) {
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

  if (!copied) throw new Error("コピーに失敗しました");
}

export function ShareModalExample() {
  return (
    <ToastProvider labels={{ close: "閉じる" }}>
      <ShareModalExampleContent />
    </ToastProvider>
  );
}

function ShareModalExampleContent() {
  const [open, setOpen] = React.useState(false);
  const { showToast } = useToast();
  const [item, setItem] = React.useState({
    id: "campaign-hero",
    share: {
      isPublic: true,
      token: "gjo_7f42ab91",
      accessCount: 42,
      createdAt: "2026-05-12",
    },
  });

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        共有設定を開く
      </Button>
      <ShareModal
        isOpen={open}
        onClose={() => setOpen(false)}
        item={item}
        onUpdate={(_, updates) => setItem((current) => ({ ...current, ...updates }))}
        onToggleShare={(_, enabled) => ({
          isPublic: enabled,
          token: "gjo_7f42ab91",
          accessCount: item.share.accessCount,
          createdAt: "2026-05-12",
        })}
        onCopyShareUrl={async (url) => {
          try {
            await writeClipboardText(url);
            showToast("URLをコピーしました", "success");
          } catch {
            showToast("コピーに失敗しました", "error");
          }
        }}
        onOpenShareUrl={(url) => {
          showToast(\`遷移せず URL を確認しました: \${url}\`, "info");
        }}
        labels={{
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
        }}
      />
    </>
  );
}`,
    en: `import * as React from "react";
import { Button, ShareModal, ToastProvider, useToast } from "@gunjo/ui";

async function writeClipboardText(text: string) {
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

  if (!copied) throw new Error("Failed to copy");
}

export function ShareModalExample() {
  return (
    <ToastProvider labels={{ close: "Close" }}>
      <ShareModalExampleContent />
    </ToastProvider>
  );
}

function ShareModalExampleContent() {
  const [open, setOpen] = React.useState(false);
  const { showToast } = useToast();
  const [item, setItem] = React.useState({
    id: "campaign-hero",
    share: {
      isPublic: true,
      token: "gjo_7f42ab91",
      accessCount: 42,
      createdAt: "2026-05-12",
    },
  });

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open sharing
      </Button>
      <ShareModal
        isOpen={open}
        onClose={() => setOpen(false)}
        item={item}
        onUpdate={(_, updates) => setItem((current) => ({ ...current, ...updates }))}
        onToggleShare={(_, enabled) => ({
          isPublic: enabled,
          token: "gjo_7f42ab91",
          accessCount: item.share.accessCount,
          createdAt: "2026-05-12",
        })}
        onCopyShareUrl={async (url) => {
          try {
            await writeClipboardText(url);
            showToast("URL copied", "success");
          } catch {
            showToast("Failed to copy", "error");
          }
        }}
        onOpenShareUrl={(url) => {
          showToast(\`Preview checked the URL without navigating: \${url}\`, "info");
        }}
        labels={{
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
        }}
      />
    </>
  );
}`,
};

const sharePrivateCode = {
    ja: shareCode.ja
        .replace("isPublic: true,", "isPublic: false,")
        .replace("accessCount: 42,", "accessCount: 0,"),
    en: shareCode.en
        .replace("isPublic: true,", "isPublic: false,")
        .replace("accessCount: 42,", "accessCount: 0,"),
};

const shareStatsCode = {
    ja: shareCode.ja.replace("accessCount: 42,", "accessCount: 128,"),
    en: shareCode.en.replace("accessCount: 42,", "accessCount: 128,"),
};

const sheetCode = {
    ja: `import * as React from "react";
import { Button, Input, Label, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function SheetExample() {
  const [publicLink, setPublicLink] = React.useState(true);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">シートを開く</Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel="閉じる">
        <SheetHeader>
          <SheetTitle>プロジェクト設定</SheetTitle>
          <SheetDescription>
            現在の画面を離れずに補助的な設定を編集します。
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="sheet-name">プロジェクト名</Label>
            <Input id="sheet-name" defaultValue="春キャンペーン" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="sheet-public" className="flex flex-col gap-0.5">
              <span>公開リンク</span>
              <span className="text-xs font-normal text-muted-foreground">
                リンクを知っている人が閲覧できます。
              </span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id="sheet-public"
                    checked={publicLink}
                    onCheckedChange={setPublicLink}
                    aria-label={publicLink ? "公開リンクを無効にする" : "公開リンクを有効にする"}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {publicLink ? "公開リンクを無効にする" : "公開リンクを有効にする"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">キャンセル</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>保存</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
    en: `import * as React from "react";
import { Button, Input, Label, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function SheetExample() {
  const [publicLink, setPublicLink] = React.useState(true);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel="Close">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Edit supporting settings without leaving the current screen.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="sheet-name">Project name</Label>
            <Input id="sheet-name" defaultValue="Spring campaign" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="sheet-public" className="flex flex-col gap-0.5">
              <span>Public link</span>
              <span className="text-xs font-normal text-muted-foreground">
                Anyone with the link can view.
              </span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id="sheet-public"
                    checked={publicLink}
                    onCheckedChange={setPublicLink}
                    aria-label={publicLink ? "Turn public link off" : "Turn public link on"}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {publicLink ? "Turn public link off" : "Turn public link on"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
};

const sheetLeftCode = {
    ja: `import { Button, Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@gunjo/ui";

export function NavigationSheetExample() {
  const items = ["概要", "素材", "メンバー", "設定"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">ナビゲーションを開く</Button>
      </SheetTrigger>
      <SheetContent side="left" closeLabel="閉じる">
        <SheetHeader>
          <SheetTitle>ナビゲーション</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {items.map((item) => (
            <SheetClose key={item} asChild>
              <Button variant="ghost" className="w-full justify-start">
                {item}
              </Button>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}`,
    en: `import { Button, Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@gunjo/ui";

export function NavigationSheetExample() {
  const items = ["Overview", "Assets", "Members", "Settings"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open navigation</Button>
      </SheetTrigger>
      <SheetContent side="left" closeLabel="Close">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {items.map((item) => (
            <SheetClose key={item} asChild>
              <Button variant="ghost" className="w-full justify-start">
                {item}
              </Button>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}`,
};

const sheetBottomCode = {
    ja: sheetCode.ja.replace('side="right"', 'side="bottom"'),
    en: sheetCode.en.replace('side="right"', 'side="bottom"'),
};

const sheetTopCode = {
    ja: `import { Button, Label, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function NotificationSheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">通知設定を開く</Button>
      </SheetTrigger>
      <SheetContent side="top" closeLabel="閉じる">
        <SheetHeader>
          <SheetTitle>通知設定</SheetTitle>
          <SheetDescription>
            ページ上部から短い補助設定を表示します。
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/40 p-3">
            <Label htmlFor="sheet-email" className="flex flex-col gap-0.5">
              <span>メール通知</span>
              <span className="text-xs font-normal text-muted-foreground">
                重要な更新だけをメールで受け取ります。
              </span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id="sheet-email"
                    defaultChecked
                    aria-label="メール通知を無効にする"
                  />
                </TooltipTrigger>
                <TooltipContent>メール通知を無効にする</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">キャンセル</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>保存</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
    en: `import { Button, Label, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function NotificationSheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open notification settings</Button>
      </SheetTrigger>
      <SheetContent side="top" closeLabel="Close">
        <SheetHeader>
          <SheetTitle>Notification settings</SheetTitle>
          <SheetDescription>
            Shows short supporting settings from the top edge.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/40 p-3">
            <Label htmlFor="sheet-email" className="flex flex-col gap-0.5">
              <span>Email notifications</span>
              <span className="text-xs font-normal text-muted-foreground">
                Receive important updates by email.
              </span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id="sheet-email"
                    defaultChecked
                    aria-label="Turn email notifications off"
                  />
                </TooltipTrigger>
                <TooltipContent>Turn email notifications off</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
};

const tooltipCode = {
    ja: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconDeviceFloppy as Save } from "@tabler/icons-react";

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="保存">
            <Save className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          変更を保存
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
    en: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconDeviceFloppy as Save } from "@tabler/icons-react";

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Save">
            <Save className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Save changes
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
};

const tooltipShortcutCode = {
    ja: `import { Button, Kbd, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconSparkles as Sparkles } from "@tabler/icons-react";

export function TooltipShortcutExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            生成
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="flex items-center gap-2">
            生成を開始
            <Kbd>⌘ Enter</Kbd>
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
    en: `import { Button, Kbd, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconSparkles as Sparkles } from "@tabler/icons-react";

export function TooltipShortcutExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="flex items-center gap-2">
            Start generation
            <Kbd>⌘ Enter</Kbd>
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
};

const tooltipDisabledCode = {
    ja: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function TooltipDisabledExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-flex">
            <Button disabled>公開</Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          レビューが完了するまで公開できません。
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
    en: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function TooltipDisabledExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-flex">
            <Button disabled>Publish</Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          You can publish after review is complete.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
};

const tooltipLongCode = {
    ja: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconHelpCircle as HelpCircle } from "@tabler/icons-react";

export function TooltipLongExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            補足を見る
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-64 text-left">
          操作の結果や注意点を短く補足します。長い説明はポップオーバーやダイアログに分けます。
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
    en: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";
import { IconHelpCircle as HelpCircle } from "@tabler/icons-react";

export function TooltipLongExample() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Show note
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-64 text-left">
          Use concise helper copy. Move long explanations into a popover or dialog.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
};

const tooltipPlacementCode = {
    ja: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function TooltipPlacementExample() {
  const placements = [
    { side: "top", label: "上", tooltip: "上に表示" },
    { side: "right", label: "右", tooltip: "右に表示" },
    { side: "bottom", label: "下", tooltip: "下に表示" },
    { side: "left", label: "左", tooltip: "左に表示" },
  ] as const;

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-3">
        {placements.map((placement) => (
          <Tooltip key={placement.side}>
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
}`,
    en: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gunjo/ui";

export function TooltipPlacementExample() {
  const placements = [
    { side: "top", label: "Top", tooltip: "Shown above" },
    { side: "right", label: "Right", tooltip: "Shown right" },
    { side: "bottom", label: "Bottom", tooltip: "Shown below" },
    { side: "left", label: "Left", tooltip: "Shown left" },
  ] as const;

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-3">
        {placements.map((placement) => (
          <Tooltip key={placement.side}>
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
}`,
};

const commonOverlayProps = {
    ja: [
        { name: "portalContainer", type: "HTMLElement | null", description: "docs preview やアプリ内フレームに overlay を閉じ込めるための任意コンテナです。" },
    ],
    en: [
        { name: "portalContainer", type: "HTMLElement | null", description: "Optional container for keeping the overlay inside a docs preview or application frame." },
    ],
};

const sheetScrollCode = {
    ja: `import { Button, Input, Label, Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@gunjo/ui";

// SheetBody を直下に置くと SheetContent が flex 列になり、
// ヘッダー/フッターは固定・中央だけがスクロールします。
export function LongFormSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">長いフォームを開く</Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel="閉じる">
        <SheetHeader>
          <SheetTitle>プロジェクト設定</SheetTitle>
          <SheetDescription>ヘッダーとフッターは固定され、中央のフォームだけがスクロールします。</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input id={field.id} defaultValue={field.value} />
            </div>
          ))}
        </SheetBody>
        <SheetFooter className="flex-row justify-end gap-2">
          <SheetClose asChild><Button variant="outline">キャンセル</Button></SheetClose>
          <SheetClose asChild><Button>保存</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
    en: `import { Button, Input, Label, Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@gunjo/ui";

// A SheetBody as a direct child turns SheetContent into a flex column, so the
// header and footer stay pinned while only the middle scrolls.
export function LongFormSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open long form</Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel="Close">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>The header and footer stay pinned while only the middle form scrolls.</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input id={field.id} defaultValue={field.value} />
            </div>
          ))}
        </SheetBody>
        <SheetFooter className="flex-row justify-end gap-2">
          <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
          <SheetClose asChild><Button>Save</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}`,
};

const configs: Record<OverlayAuditKind, OverlayDocConfig> = {
    "media-lightbox": {
        metadataKey: "mediaLightbox",
        embed: "/embed/media-lightbox",
        previewHeight: 760,
        code: lightboxCode,
        usedComponents: [
            { name: "AssetCard", href: "/docs/components/asset-card" },
            { name: "Popover", href: "/docs/components/popover" },
            { name: "Tooltip", href: "/docs/components/tooltip" },
        ],
        relatedComponents: [{ name: "MediaPickerDialog", href: "/docs/components/media-picker-dialog" }],
        props: {
            ja: [
                { name: "open", type: "boolean", required: true, description: "ライトボックスの開閉状態です。" },
                { name: "onOpenChange", type: "(open: boolean) => void", required: true, description: "開閉状態の変更を受け取ります。" },
                { name: "asset", type: "AssetCardAsset | null", description: "表示するアセットです。" },
                { name: "variant", type: '"default" | "compact"', default: '"default"', description: "情報量を変える表示バリエーションです。" },
                ...commonOverlayProps.ja,
            ],
            en: [
                { name: "open", type: "boolean", required: true, description: "Controls the lightbox open state." },
                { name: "onOpenChange", type: "(open: boolean) => void", required: true, description: "Receives open state changes." },
                { name: "asset", type: "AssetCardAsset | null", description: "Asset rendered in the lightbox." },
                { name: "variant", type: '"default" | "compact"', default: '"default"', description: "Display density variant." },
                ...commonOverlayProps.en,
            ],
        },
        states: {
            ja: [
                overlayState("standard", "標準表示", "前後移動、共有、詳細操作を含む基本形です。", "/embed/media-lightbox", "default", lightboxCode.ja, 760),
                overlayState("compact", "コンパクト", "情報量を抑えて画像確認を優先します。", "/embed/media-lightbox", "compact", lightboxCode.ja, 720),
                overlayState("metadata", "縦長素材", "縦長画像でもプレビュー内に収めて確認できます。", "/embed/media-lightbox", "metadata", lightboxCode.ja, 760),
            ],
            en: [
                overlayState("standard", "Standard", "Default lightbox with navigation, sharing, and details actions.", "/embed/media-lightbox", "default", lightboxCode.en, 760),
                overlayState("compact", "Compact", "Reduces chrome so the image remains the focus.", "/embed/media-lightbox", "compact", lightboxCode.en, 720),
                overlayState("metadata", "Portrait asset", "Keeps portrait media contained inside the preview frame.", "/embed/media-lightbox", "metadata", lightboxCode.en, 760),
            ],
        },
    },
    "media-picker-dialog": {
        metadataKey: "mediaPickerDialog",
        embed: "/embed/media-picker-dialog",
        previewHeight: 680,
        code: mediaPickerCode,
        usedComponents: [
            { name: "AssetGrid", href: "/docs/components/asset-grid" },
            { name: "Dialog", href: "/docs/components/dialog" },
            { name: "Input", href: "/docs/components/input" },
        ],
        relatedComponents: [{ name: "MediaLightbox", href: "/docs/components/media-lightbox" }],
        props: {
            ja: [
                { name: "open", type: "boolean", required: true, description: "ダイアログの開閉状態です。" },
                { name: "items", type: "AssetCardAsset[]", required: true, description: "選択候補として表示するアセット一覧です。" },
                { name: "selectedIds", type: "string[]", description: "選択済みアセット ID です。" },
                { name: "multiSelect", type: "boolean", description: "複数選択を有効にします。" },
                { name: "onConfirm", type: "(items: AssetCardAsset[]) => void", required: true, description: "確定時に選択アセットを返します。" },
                ...commonOverlayProps.ja,
            ],
            en: [
                { name: "open", type: "boolean", required: true, description: "Controls the dialog open state." },
                { name: "items", type: "AssetCardAsset[]", required: true, description: "Assets shown as selectable candidates." },
                { name: "selectedIds", type: "string[]", description: "Currently selected asset ids." },
                { name: "multiSelect", type: "boolean", description: "Enables multi-select behavior." },
                { name: "onConfirm", type: "(items: AssetCardAsset[]) => void", required: true, description: "Returns selected assets on confirmation." },
                ...commonOverlayProps.en,
            ],
        },
        states: {
            ja: [
                overlayState("multi", "複数選択", "選択数つきの確認ボタンで複数素材を追加します。", "/embed/media-picker-dialog", "default", mediaPickerCode.ja, 680),
                overlayState("single", "単一選択", "1件選ぶとすぐに確定する用途に使います。", "/embed/media-picker-dialog", "single", mediaPickerCode.ja, 680),
                overlayState("compact", "コンパクト", "候補数が少ない選択画面で幅を抑えます。", "/embed/media-picker-dialog", "compact", mediaPickerCode.ja, 620),
                overlayState("empty", "空状態", "候補がない場合の案内文も同じダイアログ内で表示します。", "/embed/media-picker-dialog", "empty", mediaPickerCode.ja, 620),
            ],
            en: [
                overlayState("multi", "Multi-select", "Adds multiple assets with a selected-count confirmation button.", "/embed/media-picker-dialog", "default", mediaPickerCode.en, 680),
                overlayState("single", "Single-select", "Confirms immediately after selecting one asset.", "/embed/media-picker-dialog", "single", mediaPickerCode.en, 680),
                overlayState("compact", "Compact", "Keeps the dialog narrower for small candidate sets.", "/embed/media-picker-dialog", "compact", mediaPickerCode.en, 620),
                overlayState("empty", "Empty state", "Shows empty guidance inside the same dialog surface.", "/embed/media-picker-dialog", "empty", mediaPickerCode.en, 620),
            ],
        },
    },
    modal: {
        metadataKey: "modal",
        embed: "/embed/modal",
        previewHeight: 520,
        code: modalCode,
        relatedComponents: [{ name: "Dialog", href: "/docs/components/dialog" }],
        props: {
            ja: [
                { name: "isOpen", type: "boolean", required: true, description: "モーダルの表示状態です。" },
                { name: "onClose", type: "() => void", required: true, description: "閉じる操作時に呼び出されます。" },
                { name: "title", type: "string", required: true, description: "ヘッダーに表示するタイトルです。" },
                { name: "footer", type: "React.ReactNode", description: "フッターの操作ボタンを渡します。" },
                { name: "closeLabel", type: "string", default: '"Close"', description: "閉じるボタンのアクセシブルラベルです。" },
                ...commonOverlayProps.ja,
            ],
            en: [
                { name: "isOpen", type: "boolean", required: true, description: "Controls modal visibility." },
                { name: "onClose", type: "() => void", required: true, description: "Called when the modal should close." },
                { name: "title", type: "string", required: true, description: "Title shown in the header." },
                { name: "footer", type: "React.ReactNode", description: "Footer action area." },
                { name: "closeLabel", type: "string", default: '"Close"', description: "Accessible label for the close button." },
                ...commonOverlayProps.en,
            ],
        },
        states: {
            ja: [
                overlayState("standard", "通常操作", "保存とキャンセルを持つ基本的なモーダルです。", "/embed/modal", "default", modalCode.ja, 460),
                overlayState("form", "フォーム", "入力項目を含む場合もフッター操作を同じ位置に揃えます。", "/embed/modal", "form", modalFormCode.ja, 460),
                overlayState("destructive", "破壊的操作", "取り消せない操作は destructive ボタンで明示します。", "/embed/modal", "destructive", modalDestructiveCode.ja, 460),
                overlayState("no-footer", "フッターなし", "確認だけで完了する案内はフッター操作を省略できます。", "/embed/modal", "no-footer", modalNoFooterCode.ja, 420),
                overlayState("tabs", "タブ入り", "複数の関連情報を同じモーダル内で切り替えます。", "/embed/modal", "tabs", modalTabsCode.ja, 540),
            ],
            en: [
                overlayState("standard", "Standard action", "Basic modal with Save and Cancel actions.", "/embed/modal", "default", modalCode.en, 460),
                overlayState("form", "Form", "Keeps footer actions aligned when the body contains inputs.", "/embed/modal", "form", modalFormCode.en, 460),
                overlayState("destructive", "Destructive action", "Uses a destructive action for irreversible choices.", "/embed/modal", "destructive", modalDestructiveCode.en, 460),
                overlayState("no-footer", "No footer", "Omits footer actions for informational content.", "/embed/modal", "no-footer", modalNoFooterCode.en, 420),
                overlayState("tabs", "With tabs", "Switches between related panels in the same modal.", "/embed/modal", "tabs", modalTabsCode.en, 540),
            ],
        },
    },
    "onboarding-flow": {
        metadataKey: "onboardingFlow",
        embed: "/embed/onboarding-flow",
        previewHeight: 460,
        code: onboardingCode,
        relatedComponents: [{ name: "Stepper", href: "/docs/components/stepper" }],
        props: {
            ja: [
                { name: "steps", type: "OnboardingStep[]", required: true, description: "各ステップのタイトル、説明、内容です。" },
                { name: "currentIndex", type: "number", description: "外部から現在ステップを制御する場合に使います。" },
                { name: "onCurrentIndexChange", type: "(index: number) => void", description: "制御時のステップ変更通知です。" },
                { name: "onComplete", type: "() => void", description: "最後のステップを完了した時に呼び出されます。" },
                { name: "progressLabel", type: "string", default: '"Onboarding progress"', description: "ステップインジケーターのアクセシブルラベルです。" },
                { name: "stepLabel", type: "(current: number, total: number) => ReactNode", description: "現在ステップの補助テキストを生成します。" },
                { name: "backDisabledReason", type: "string", default: '"This is the first step."', description: "最初のステップで戻れない理由をツールチップに表示します。" },
                { name: "bodyMinHeight", type: "CSSProperties['minHeight']", description: "ステップ見出しと本文領域の最小高さです。ステップ移動時の CTA 位置ずれを防ぎます。" },
            ],
            en: [
                { name: "steps", type: "OnboardingStep[]", required: true, description: "Step title, description, and content." },
                { name: "currentIndex", type: "number", description: "Controls the active step externally." },
                { name: "onCurrentIndexChange", type: "(index: number) => void", description: "Receives step changes in controlled mode." },
                { name: "onComplete", type: "() => void", description: "Called when the final step is completed." },
                { name: "progressLabel", type: "string", default: '"Onboarding progress"', description: "Accessible label for the step indicator." },
                { name: "stepLabel", type: "(current: number, total: number) => ReactNode", description: "Builds the helper text for the active step." },
                { name: "backDisabledReason", type: "string", default: '"This is the first step."', description: "Tooltip reason shown when the back button is unavailable." },
                { name: "bodyMinHeight", type: "CSSProperties['minHeight']", description: "Minimum height for the step heading and content area so CTA actions stay aligned between steps." },
            ],
        },
        states: {
            ja: [
                overlayState("standard", "標準表示", "入力、設定、完了の3ステップを順番に進めます。", "/embed/onboarding-flow", "default", onboardingCode.ja, 460),
                overlayState("compact", "コンパクト", "狭い面でもステップ内容を読みやすく保ちます。", "/embed/onboarding-flow", "compact", onboardingCode.ja, 440),
                overlayState("controlled", "制御状態", "現在ステップを外部 state で管理する構成です。", "/embed/onboarding-flow", "controlled", onboardingControlledCode.ja, 460),
                overlayState("complete", "完了後", "最後のステップ後に表示する完了状態です。", "/embed/onboarding-flow", "complete", onboardingCompleteCode.ja, 460),
            ],
            en: [
                overlayState("standard", "Standard", "Walks through profile, workspace, and completion steps.", "/embed/onboarding-flow", "default", onboardingCode.en, 460),
                overlayState("compact", "Compact", "Keeps step content readable in a narrow surface.", "/embed/onboarding-flow", "compact", onboardingCode.en, 440),
                overlayState("controlled", "Controlled", "Manages the current step from external state.", "/embed/onboarding-flow", "controlled", onboardingControlledCode.en, 460),
                overlayState("complete", "Complete", "Shows the completion state after the final step.", "/embed/onboarding-flow", "complete", onboardingCompleteCode.en, 460),
            ],
        },
    },
    popover: {
        metadataKey: "popover",
        embed: "/embed/popover",
        previewHeight: 460,
        code: popoverCode,
        usedComponents: [{ name: "FormGroup", href: "/docs/components/form" }, { name: "Input", href: "/docs/components/input" }],
        relatedComponents: [{ name: "DropdownMenu", href: "/docs/components/dropdown-menu" }, { name: "Tooltip", href: "/docs/components/tooltip" }],
        props: {
            ja: [
                { name: "open", type: "boolean", description: "開閉状態を制御する場合に使います。" },
                { name: "onOpenChange", type: "(open: boolean) => void", description: "開閉状態の変更を受け取ります。" },
                { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "表示したい方向です。" },
                { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "トリガーに対する揃え位置です。" },
                ...commonOverlayProps.ja,
            ],
            en: [
                { name: "open", type: "boolean", description: "Controls the open state." },
                { name: "onOpenChange", type: "(open: boolean) => void", description: "Receives open state changes." },
                { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side." },
                { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment against the trigger." },
                ...commonOverlayProps.en,
            ],
        },
        states: {
            ja: [
                overlayState("settings", "表示密度の変更", "対象行の表示密度をその場で変更します。", "/embed/popover", "default", popoverCode.ja, 460),
                overlayState("filter", "絞り込み条件", "対象行の条件ボタンからフィルター入力を開きます。", "/embed/popover", "filter", popoverFilterCode.ja, 460),
                overlayState("confirm", "公開前の確認", "公開状態の行から、短い説明と確認操作を表示します。", "/embed/popover", "confirm", popoverConfirmCode.ja, 460),
                overlayState("status", "同期状態の詳細", "同期状態の行から補助情報を表示します。", "/embed/popover", "status", popoverStatusCode.ja, 460),
            ],
            en: [
                overlayState("settings", "Display density", "Changes the display density from the target row.", "/embed/popover", "default", popoverCode.en, 460),
                overlayState("filter", "Filter criteria", "Opens filter input from the criteria row.", "/embed/popover", "filter", popoverFilterCode.en, 460),
                overlayState("confirm", "Publish confirmation", "Shows short explanatory copy and a confirmation action from the publish status row.", "/embed/popover", "confirm", popoverConfirmCode.en, 460),
                overlayState("status", "Sync status details", "Shows supporting status from the sync status row.", "/embed/popover", "status", popoverStatusCode.en, 460),
            ],
        },
    },
    "share-modal": {
        metadataKey: "shareModal",
        embed: "/embed/share-modal",
        previewHeight: 520,
        code: shareCode,
        relatedComponents: [{ name: "Modal", href: "/docs/components/modal" }],
        props: {
            ja: [
                { name: "isOpen", type: "boolean", required: true, description: "共有モーダルの表示状態です。" },
                { name: "item", type: "ShareableItem", required: true, description: "共有状態を持つ対象アイテムです。" },
                { name: "onUpdate", type: "(id, updates) => void", required: true, description: "共有情報が変わった時に親 state を更新します。" },
                { name: "onToggleShare", type: "(id, enable) => ShareData | Promise<ShareData>", description: "共有の有効/無効をアプリ側で処理します。未指定時は apiEndpoint に POST します。" },
                { name: "onCopyShareUrl", type: "(url) => void | Promise<void>", description: "共有 URL のコピー処理を上位で差し替えます。トーストなどのフィードバックをここで出せます。" },
                { name: "onOpenShareUrl", type: "(url) => void | Promise<void>", description: "共有 URL を開く操作を上位で差し替えます。docs プレビューでは遷移せずトーストを出します。" },
                ...commonOverlayProps.ja,
            ],
            en: [
                { name: "isOpen", type: "boolean", required: true, description: "Controls modal visibility." },
                { name: "item", type: "ShareableItem", required: true, description: "Target item with share state." },
                { name: "onUpdate", type: "(id, updates) => void", required: true, description: "Updates parent state after share changes." },
                { name: "onToggleShare", type: "(id, enable) => ShareData | Promise<ShareData>", description: "Handles enabling/disabling sharing in the app. Falls back to POSTing apiEndpoint." },
                { name: "onCopyShareUrl", type: "(url) => void | Promise<void>", description: "Overrides copy behavior so the parent can show feedback such as a toast." },
                { name: "onOpenShareUrl", type: "(url) => void | Promise<void>", description: "Overrides URL opening. Docs previews use this to show feedback without navigating." },
                ...commonOverlayProps.en,
            ],
        },
        states: {
            ja: [
                overlayState("public", "公開リンクあり", "共有URL、コピー、アクセス数を確認できます。", "/embed/share-modal", "default", shareCode.ja, 520),
                overlayState("private", "非公開", "共有が無効な時の見え方です。", "/embed/share-modal", "private", sharePrivateCode.ja, 520),
                overlayState("stats", "アクセス数あり", "利用状況を含めて共有状態を確認します。", "/embed/share-modal", "stats", shareStatsCode.ja, 520),
            ],
            en: [
                overlayState("public", "Public link", "Shows URL, copy, and access count.", "/embed/share-modal", "default", shareCode.en, 520),
                overlayState("private", "Private", "Shows the disabled sharing state.", "/embed/share-modal", "private", sharePrivateCode.en, 520),
                overlayState("stats", "With stats", "Displays sharing state with usage count.", "/embed/share-modal", "stats", shareStatsCode.en, 520),
            ],
        },
    },
    sheet: {
        metadataKey: "sheet",
        embed: "/embed/sheet",
        previewHeight: 520,
        code: sheetCode,
        relatedComponents: [{ name: "Drawer", href: "/docs/components/drawer" }, { name: "Dialog", href: "/docs/components/dialog" }],
        props: {
            ja: [
                { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "シートを表示する画面端です。" },
                { name: "portalContainer", type: "HTMLElement | null", description: "プレビューやアプリ内フレームに閉じ込めるコンテナです。" },
                { name: "overlayClassName", type: "string", description: "オーバーレイに追加するクラスです。" },
                { name: "className", type: "string", description: "シート本体に追加するクラスです。" },
                { name: "closeLabel", type: "string", default: '"Close"', description: "右上の閉じるボタンとツールチップに使うラベルです。" },
                { name: "SheetBody", type: "React.HTMLAttributes<HTMLDivElement>", description: "長いフォーム用のスクロール領域。SheetContent の直下に置くと Content が flex 列になり、ヘッダー/フッター固定・中央スクロールになります（left/right シート）。(#293)" },
            ],
            en: [
                { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "Screen edge where the sheet appears." },
                { name: "portalContainer", type: "HTMLElement | null", description: "Container for keeping the sheet inside a preview or app frame." },
                { name: "overlayClassName", type: "string", description: "Additional class names for the overlay." },
                { name: "className", type: "string", description: "Additional class names for the sheet content." },
                { name: "closeLabel", type: "string", default: '"Close"', description: "Label used by the top-right close button and tooltip." },
                { name: "SheetBody", type: "React.HTMLAttributes<HTMLDivElement>", description: "Scroll region for long forms. As a direct child of SheetContent it makes the content a flex column — header/footer pinned, middle scrolls (left/right sheets). (#293)" },
            ],
        },
        states: {
            ja: [
                overlayState("settings", "右側設定", "詳細設定や補助フォームを右から表示します。", "/embed/sheet", "settings", sheetCode.ja, 520),
                overlayState("left", "左ナビゲーション", "モバイルメニューなどを左から表示します。", "/embed/sheet", "left", sheetLeftCode.ja, 520),
                overlayState("bottom", "下部シート", "狭い画面で補助操作を下から表示します。", "/embed/sheet", "bottom", sheetBottomCode.ja, 520),
                overlayState("top", "上部シート", "短い通知設定や補助操作を上から表示します。", "/embed/sheet", "top", sheetTopCode.ja, 520),
                overlayState("scroll", "長いフォーム（スクロール）", "SheetBody を直下に置くと、ヘッダー/フッターは固定され中央だけがスクロールします。", "/embed/sheet", "scroll", sheetScrollCode.ja, 520),
            ],
            en: [
                overlayState("settings", "Right settings", "Shows detailed settings from the right edge.", "/embed/sheet", "settings", sheetCode.en, 520),
                overlayState("left", "Left navigation", "Shows mobile navigation from the left edge.", "/embed/sheet", "left", sheetLeftCode.en, 520),
                overlayState("bottom", "Bottom sheet", "Shows supporting actions from the bottom on narrow screens.", "/embed/sheet", "bottom", sheetBottomCode.en, 520),
                overlayState("top", "Top sheet", "Shows short notification settings or supporting actions from the top edge.", "/embed/sheet", "top", sheetTopCode.en, 520),
                overlayState("scroll", "Long form (scroll)", "A SheetBody direct child pins the header/footer and scrolls only the middle.", "/embed/sheet", "scroll", sheetScrollCode.en, 520),
            ],
        },
    },
    tooltip: {
        metadataKey: "tooltip",
        embed: "/embed/tooltip",
        previewHeight: 360,
        code: tooltipCode,
        relatedComponents: [{ name: "TooltipButton", href: "/docs/components/tooltip-button" }, { name: "Popover", href: "/docs/components/popover" }],
        props: {
            ja: [
                { name: "delayDuration", type: "number", description: "表示までの待ち時間です。" },
                { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "表示したい方向です。" },
                { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "トリガーに対する揃え位置です。" },
                ...commonOverlayProps.ja,
            ],
            en: [
                { name: "delayDuration", type: "number", description: "Delay before showing the tooltip." },
                { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side." },
                { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment against the trigger." },
                ...commonOverlayProps.en,
            ],
        },
        states: {
            ja: [
                overlayState("icon", "アイコン操作", "アイコンだけのボタンに操作名を補足します。", "/embed/tooltip", "icon", tooltipCode.ja, 360),
                overlayState("shortcut", "ショートカット付き", "操作名とキーボードショートカットを一緒に伝えます。", "/embed/tooltip", "shortcut", tooltipShortcutCode.ja, 360),
                overlayState("disabled", "無効理由", "押せない理由を hover/focus で説明します。", "/embed/tooltip", "disabled", tooltipDisabledCode.ja, 360),
                overlayState("long", "長めの補足", "長すぎる場合は Popover へ分ける判断材料にします。", "/embed/tooltip", "long", tooltipLongCode.ja, 360),
                overlayState("placement", "表示位置", "上下左右の表示位置を指定できます。", "/embed/tooltip", "placement", tooltipPlacementCode.ja, 360),
            ],
            en: [
                overlayState("icon", "Icon action", "Names an icon-only button.", "/embed/tooltip", "icon", tooltipCode.en, 360),
                overlayState("shortcut", "With shortcut", "Pairs the action name with a keyboard shortcut.", "/embed/tooltip", "shortcut", tooltipShortcutCode.en, 360),
                overlayState("disabled", "Disabled reason", "Explains why a control is unavailable on hover/focus.", "/embed/tooltip", "disabled", tooltipDisabledCode.en, 360),
                overlayState("long", "Long helper", "Shows when to move longer copy into a Popover.", "/embed/tooltip", "long", tooltipLongCode.en, 360),
                overlayState("placement", "Placement", "Specifies top, right, bottom, and left placement.", "/embed/tooltip", "placement", tooltipPlacementCode.en, 360),
            ],
        },
    },
};

export function OverlayAuditDocPage({
    kind,
    title,
    description,
}: {
    kind: OverlayAuditKind;
    title?: string;
    description?: string;
}) {
    const { locale, sectionLabels } = useLocale();
    const config = configs[kind];
    const meta = overlayMetadata[config.metadataKey];
    const code = config.code[locale];

    return (
        <ComponentLayout
            title={title ?? meta.title}
            description={description ?? meta.description}
            usedComponents={config.usedComponents}
            relatedComponents={config.relatedComponents}
        >
            <ComponentPreview
                embedSrc={config.embed}
                code={code}
                codeBlock={<CodeBlock code={code} />}
                previewBodyWidth="full"
                previewHeight={config.previewHeight}
                fitEmbedHeightContent={false}
                sectionLabels={sectionLabels}
            >
                <div />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {locale === "ja" ? "状態とバリエーション" : "States and Variations"}
                </h2>
                <ComponentDemoStates states={config.states[locale]} />
            </section>

            <section className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
                    {locale === "ja" ? "プロパティ" : "Props"}
                </h2>
                <PropsTable data={config.props[locale]} />
            </section>
        </ComponentLayout>
    );
}
