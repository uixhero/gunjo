"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconDownload, IconEye, IconFileTypePdf, IconFileTypeZip } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DocumentRow,
  SectionList,
  Tooltip,
  TooltipContent,
  TooltipButton,
  TooltipTrigger,
  Toast,
  type SectionListSection,
} from "@gunjo/ui";

type Locale = "ja" | "en";

type DemoDocument = {
  id: string;
  group: "current" | "archive";
  title: string;
  description: string;
  meta: string;
  status?: string;
  locked?: boolean;
};

function documentRowCopy(locale: Locale) {
  return locale === "ja"
    ? {
        select: "選択",
        selectAll: "すべて選択",
        clearSelection: "選択を解除",
        downloadSelected: "選択した書類をダウンロード",
        noSelectionReason: "書類を選択すると一括ダウンロードできます。",
        download: "ダウンロード",
        selectionLockedReason: "確定処理中の書類は選択対象にできません。",
        close: "閉じる",
        previewTitle: "書類プレビュー",
        previewDescription: "選択した書類の内容をプレビューします。",
        previewUnavailable: "このプレビューではサンプル本文を表示しています。",
        toastClose: "通知を閉じる",
        lockedReason: "確定処理中のため、ダウンロードはまだ利用できません。",
        emptyStatus: "チェックボックスで対象書類を選択できます。書類名を押すとプレビューを開きます。",
        downloaded: (title: string) => `${title} のダウンロードを開始しました。`,
        downloadedSelected: (count: number) => `選択した${count}件のダウンロードを開始しました。`,
        selected: (count: number) => `${count}件を選択中です。`,
        current: "2026年",
        archive: "2025年",
        currentMeta: "3件",
        archiveMeta: "1件",
        docs: [
          {
            id: "payroll-2026-06",
            group: "current",
            title: "2026年6月分 給与明細",
            description: "人事部・月次発行",
            meta: "PDF・124KB・発行日 2026/06/25",
            status: "新着",
          },
          {
            id: "tax-2026",
            group: "current",
            title: "令和8年 源泉徴収票",
            description: "年末調整・確定版",
            meta: "PDF・88KB・発行日 2026/01/12",
          },
          {
            id: "expense-2026",
            group: "current",
            title: "経費精算 添付書類",
            description: "監査チーム確認中",
            meta: "ZIP・2.4MB・更新日 2026/06/20",
            locked: true,
          },
          {
            id: "payroll-2025-12",
            group: "archive",
            title: "2025年12月分 給与明細",
            description: "アーカイブ",
            meta: "PDF・118KB・発行日 2025/12/25",
          },
        ] satisfies DemoDocument[],
      }
    : {
        select: "Select",
        selectAll: "Select all",
        clearSelection: "Clear selection",
        downloadSelected: "Download selected",
        noSelectionReason: "Select documents to enable batch download.",
        download: "Download",
        selectionLockedReason: "Finalizing documents cannot be selected.",
        close: "Close",
        previewTitle: "Document preview",
        previewDescription: "Preview the selected document content.",
        previewUnavailable: "This preview shows sample document content.",
        toastClose: "Close notification",
        lockedReason: "The file is still being finalized, so download is unavailable.",
        emptyStatus: "Use checkboxes to select documents. Press a document title to open its preview.",
        downloaded: (title: string) => `Started downloading ${title}.`,
        downloadedSelected: (count: number) => `Started downloading ${count} selected documents.`,
        selected: (count: number) => `${count} selected.`,
        current: "2026",
        archive: "2025",
        currentMeta: "3 files",
        archiveMeta: "1 file",
        docs: [
          {
            id: "payroll-2026-06",
            group: "current",
            title: "June 2026 payroll statement",
            description: "HR / monthly issue",
            meta: "PDF / 124KB / issued 2026-06-25",
            status: "New",
          },
          {
            id: "tax-2026",
            group: "current",
            title: "2026 withholding certificate",
            description: "Year-end adjustment / final",
            meta: "PDF / 88KB / issued 2026-01-12",
          },
          {
            id: "expense-2026",
            group: "current",
            title: "Expense report attachments",
            description: "Audit review in progress",
            meta: "ZIP / 2.4MB / updated 2026-06-20",
            locked: true,
          },
          {
            id: "payroll-2025-12",
            group: "archive",
            title: "December 2025 payroll statement",
            description: "Archive",
            meta: "PDF / 118KB / issued 2025-12-25",
          },
        ] satisfies DemoDocument[],
      };
}

function DownloadAction({
  title,
  locked,
  locale,
  onDownload,
  portalContainer,
}: {
  title: string;
  locked?: boolean;
  locale: Locale;
  onDownload: () => void;
  portalContainer?: HTMLElement | null;
}) {
  const copy = documentRowCopy(locale);
  const icon = title.toLowerCase().includes("zip") ? IconFileTypeZip : IconDownload;
  const Icon = icon;

  if (locked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Button size="icon" variant="ghost" disabled aria-label={`${copy.download}: ${title}`}>
              <Icon className="h-4 w-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent portalContainer={portalContainer}>{copy.lockedReason}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <TooltipButton
      size="icon"
      variant="ghost"
      aria-label={`${copy.download}: ${title}`}
      tooltip={`${copy.download}: ${title}`}
      onClick={onDownload}
    >
      <Icon className="h-4 w-4" />
    </TooltipButton>
  );
}

function DocumentRowPreview({ locale, lockedOnly = false }: { locale: Locale; lockedOnly?: boolean }) {
  const copy = documentRowCopy(locale);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [selectedIds, setSelectedIds] = React.useState(() => new Set(["payroll-2026-06"]));
  const [status, setStatus] = React.useState(copy.emptyStatus);
  const [previewDocument, setPreviewDocument] = React.useState<DemoDocument | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const docs = lockedOnly ? copy.docs.filter((doc) => doc.locked) : copy.docs;
  const selectableDocs = docs.filter((doc) => !doc.locked);
  const selectedCount = selectableDocs.filter((doc) => selectedIds.has(doc.id)).length;
  const allSelected = selectableDocs.length > 0 && selectedCount === selectableDocs.length;

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  const toggleSelected = (id: string, checked: boolean) => {
    const doc = copy.docs.find((item) => item.id === id);
    if (doc?.locked) return;
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      setStatus(next.size === 0 ? copy.emptyStatus : copy.selected(next.size));
      return next;
    });
  };

  const toggleAllSelected = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const doc of selectableDocs) {
        if (checked) next.add(doc.id);
        else next.delete(doc.id);
      }
      const nextCount = selectableDocs.filter((doc) => next.has(doc.id)).length;
      setStatus(nextCount === 0 ? copy.emptyStatus : copy.selected(nextCount));
      return next;
    });
  };

  const clearSelection = () => {
    toggleAllSelected(false);
  };

  const downloadSelected = () => {
    if (selectedCount === 0) return;
    setToastMessage(copy.downloadedSelected(selectedCount));
  };

  const renderRows = (group: DemoDocument["group"]) =>
    docs
      .filter((doc) => doc.group === group)
      .map((doc) => (
        <DocumentRow
          key={doc.id}
          icon={doc.id.includes("expense") ? <IconFileTypeZip className="h-5 w-5" /> : <IconFileTypePdf className="h-5 w-5" />}
          title={doc.title}
          description={doc.description}
          meta={doc.meta}
          control={
            doc.locked ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Checkbox
                      checked={false}
                      disabled
                      aria-label={`${copy.select}: ${doc.title}`}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent portalContainer={portalContainer}>{copy.selectionLockedReason}</TooltipContent>
              </Tooltip>
            ) : (
              <Checkbox
                checked={selectedIds.has(doc.id)}
                onCheckedChange={(checked) => toggleSelected(doc.id, checked === true)}
                aria-label={`${copy.select}: ${doc.title}`}
              />
            )
          }
          status={doc.status ? <Badge variant="secondary">{doc.status}</Badge> : undefined}
          onOpen={() => setPreviewDocument(doc)}
          actions={
            <DownloadAction
              title={doc.title}
              locked={doc.locked}
              locale={locale}
              portalContainer={portalContainer}
              onDownload={() => setToastMessage(copy.downloaded(doc.title))}
            />
          }
        />
      ));

  const sections: SectionListSection[] = lockedOnly
    ? [
        {
          key: "locked",
          title: locale === "ja" ? "処理中" : "In progress",
          sublabel: locale === "ja" ? "無効化理由つき" : "With disabled reason",
          meta: locale === "ja" ? "1件" : "1 file",
          content: renderRows("current"),
        },
      ]
    : [
        { key: "current", title: copy.current, meta: copy.currentMeta, content: renderRows("current") },
        { key: "archive", title: copy.archive, meta: copy.archiveMeta, content: renderRows("archive") },
      ];

  return (
    <div ref={rootRef} data-document-row-preview-frame className="flex w-full max-w-2xl flex-col gap-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute bottom-4 right-6 z-[100] w-[min(360px,calc(100%-3rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            onClose={() => setToastMessage(null)}
            placement="inline"
            closeLabel={copy.toastClose}
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        {!lockedOnly ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => toggleAllSelected(checked === true)}
              label={copy.selectAll}
              description={copy.selected(selectedCount)}
            />
            <div className="flex flex-wrap items-center gap-2">
              {selectedCount === 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Button type="button" variant="ghost" size="sm" disabled>
                        {copy.clearSelection}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent portalContainer={portalContainer}>{copy.noSelectionReason}</TooltipContent>
                </Tooltip>
              ) : (
                <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
                  {copy.clearSelection}
                </Button>
              )}
              {selectedCount === 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Button type="button" variant="outline" size="sm" disabled>
                        <IconDownload className="h-4 w-4" />
                        {copy.downloadSelected}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent portalContainer={portalContainer}>{copy.noSelectionReason}</TooltipContent>
                </Tooltip>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={downloadSelected}>
                  <IconDownload className="h-4 w-4" />
                  {copy.downloadSelected}
                </Button>
              )}
            </div>
          </div>
        ) : null}
        <SectionList sections={sections} label={locale === "ja" ? "書類一覧" : "Document list"} />
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
          {status}
        </p>
      </div>
      <Dialog open={previewDocument != null} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent
          portalContainer={portalContainer}
          overlayClassName="rounded-md"
          closeLabel={copy.close}
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>{copy.previewTitle}</DialogTitle>
            <DialogDescription>{copy.previewDescription}</DialogDescription>
          </DialogHeader>
          {previewDocument ? (
            <div className="grid gap-4">
              <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {previewDocument.id.includes("expense") ? <IconFileTypeZip className="h-5 w-5" /> : <IconFileTypePdf className="h-5 w-5" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{previewDocument.title}</p>
                  <p className="text-xs text-muted-foreground">{previewDocument.meta}</p>
                </div>
              </div>
              <div className="rounded-md border bg-muted/30 p-4 text-sm leading-6 text-foreground">
                <p className="font-medium">{previewDocument.description}</p>
                <p className="mt-2 text-muted-foreground">{copy.previewUnavailable}</p>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreviewDocument(null)}>
              {copy.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DocumentRowDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/document-row", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.documentRow.title ?? "DocumentRow";
  const description = content?.description ?? metadata.documentRow.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DocumentRow,
  SectionList,
  Toast,
  Tooltip,
  TooltipButton,
  TooltipContent,
  TooltipTrigger,
  type SectionListSection,
} from "@gunjo/ui";
import { IconDownload, IconFileTypePdf, IconFileTypeZip } from "@tabler/icons-react";

const documents = [
  {
    id: "payroll-2026-06",
    group: "current",
    title: "2026年6月分 給与明細",
    description: "人事部・月次発行",
    meta: "PDF・124KB・発行日 2026/06/25",
    status: "新着",
  },
  {
    id: "tax-2026",
    group: "current",
    title: "令和8年 源泉徴収票",
    description: "年末調整・確定版",
    meta: "PDF・88KB・発行日 2026/01/12",
  },
  {
    id: "expense-2026",
    group: "current",
    title: "経費精算 添付書類",
    description: "監査チーム確認中",
    meta: "ZIP・2.4MB・更新日 2026/06/20",
    locked: true,
  },
];

export function PayrollDocuments() {
  const portalRef = React.useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = React.useState(() => new Set(["payroll-2026-06"]));
  const [status, setStatus] = React.useState("チェックボックスで対象書類を選択できます。書類名を押すとプレビューを開きます。");
  const [previewDocument, setPreviewDocument] = React.useState<(typeof documents)[number] | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const selectableDocs = documents.filter((doc) => !doc.locked);
  const selectedCount = selectableDocs.filter((doc) => selectedIds.has(doc.id)).length;
  const allSelected = selectableDocs.length > 0 && selectedCount === selectableDocs.length;

  const toggleSelected = (id: string, checked: boolean) => {
    const doc = documents.find((item) => item.id === id);
    if (doc?.locked) return;
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      setStatus(next.size === 0 ? "チェックボックスで対象書類を選択できます。書類名を押すとプレビューを開きます。" : \`\${next.size}件を選択中です。\`);
      return next;
    });
  };

  const toggleAllSelected = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const doc of selectableDocs) {
        if (checked) next.add(doc.id);
        else next.delete(doc.id);
      }
      const nextCount = selectableDocs.filter((doc) => next.has(doc.id)).length;
      setStatus(nextCount === 0 ? "チェックボックスで対象書類を選択できます。書類名を押すとプレビューを開きます。" : \`\${nextCount}件を選択中です。\`);
      return next;
    });
  };

  const clearSelection = () => toggleAllSelected(false);
  const downloadSelected = () => {
    if (selectedCount === 0) return;
    setToastMessage(\`選択した\${selectedCount}件のダウンロードを開始しました。\`);
  };

  const rows = documents.map((doc) => (
    <DocumentRow
      key={doc.id}
      icon={doc.id.includes("expense") ? <IconFileTypeZip className="h-5 w-5" /> : <IconFileTypePdf className="h-5 w-5" />}
      title={doc.title}
      description={doc.description}
      meta={doc.meta}
      control={
        doc.locked ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Checkbox checked={false} disabled aria-label={\`選択: \${doc.title}\`} />
              </span>
            </TooltipTrigger>
            <TooltipContent portalContainer={portalRef.current}>
              確定処理中の書類は選択対象にできません。
            </TooltipContent>
          </Tooltip>
        ) : (
          <Checkbox
            checked={selectedIds.has(doc.id)}
            onCheckedChange={(checked) => toggleSelected(doc.id, checked === true)}
            aria-label={\`選択: \${doc.title}\`}
          />
        )
      }
      status={doc.status ? <Badge variant="secondary">{doc.status}</Badge> : undefined}
      onOpen={() => setPreviewDocument(doc)}
      actions={
        <TooltipButton
          size="icon"
          variant="ghost"
          aria-label={\`ダウンロード: \${doc.title}\`}
          tooltip={\`ダウンロード: \${doc.title}\`}
          onClick={() => setToastMessage(\`\${doc.title} のダウンロードを開始しました。\`)}
        >
          <IconDownload className="h-4 w-4" />
        </TooltipButton>
      }
    />
  ));

  const sections: SectionListSection[] = [
    { key: "current", title: "2026年", meta: "3件", content: rows },
  ];

  return (
    <div
      ref={portalRef}
      data-document-row-preview-frame
      className="relative flex w-full max-w-2xl flex-col gap-4"
    >
      {toastMessage ? (
        <div className="pointer-events-none absolute bottom-4 right-6 z-[100] w-[min(360px,calc(100%-3rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            onClose={() => setToastMessage(null)}
            placement="inline"
            closeLabel="通知を閉じる"
            tooltipPortalContainer={portalRef.current}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => toggleAllSelected(checked === true)}
            label="すべて選択"
            description={\`\${selectedCount}件を選択中です。\`}
          />
          <div className="flex flex-wrap items-center gap-2">
            {selectedCount === 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Button type="button" variant="ghost" size="sm" disabled>
                      選択を解除
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent portalContainer={portalRef.current}>
                  書類を選択すると一括ダウンロードできます。
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
                選択を解除
              </Button>
            )}
            {selectedCount === 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Button type="button" variant="outline" size="sm" disabled>
                      <IconDownload className="h-4 w-4" />
                      選択した書類をダウンロード
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent portalContainer={portalRef.current}>
                  書類を選択すると一括ダウンロードできます。
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={downloadSelected}>
                <IconDownload className="h-4 w-4" />
                選択した書類をダウンロード
              </Button>
            )}
          </div>
        </div>
        <SectionList sections={sections} label="書類一覧" />
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
          {status}
        </p>
      </div>
      <Dialog open={previewDocument != null} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent
          portalContainer={portalRef.current}
          overlayClassName="rounded-xl"
          closeLabel="閉じる"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>書類プレビュー</DialogTitle>
            <DialogDescription>選択した書類の内容をプレビューします。</DialogDescription>
          </DialogHeader>
          {previewDocument ? (
            <div className="rounded-md border bg-muted/30 p-4 text-sm leading-6">
              <p className="font-medium">{previewDocument.title}</p>
              <p className="mt-1 text-muted-foreground">{previewDocument.meta}</p>
              <p className="mt-3 text-muted-foreground">このプレビューではサンプル本文を表示しています。</p>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreviewDocument(null)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`
    : `import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DocumentRow,
  SectionList,
  Toast,
  Tooltip,
  TooltipButton,
  TooltipContent,
  TooltipTrigger,
  type SectionListSection,
} from "@gunjo/ui";
import { IconDownload, IconFileTypePdf, IconFileTypeZip } from "@tabler/icons-react";

const documents = [
  {
    id: "payroll-2026-06",
    group: "current",
    title: "June 2026 payroll statement",
    description: "HR / monthly issue",
    meta: "PDF / 124KB / issued 2026-06-25",
    status: "New",
  },
  {
    id: "tax-2026",
    group: "current",
    title: "2026 withholding certificate",
    description: "Year-end adjustment / final",
    meta: "PDF / 88KB / issued 2026-01-12",
  },
  {
    id: "expense-2026",
    group: "current",
    title: "Expense report attachments",
    description: "Audit review in progress",
    meta: "ZIP / 2.4MB / updated 2026-06-20",
    locked: true,
  },
];

export function PayrollDocuments() {
  const portalRef = React.useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = React.useState(() => new Set(["payroll-2026-06"]));
  const [status, setStatus] = React.useState("Use checkboxes to select documents. Press a document title to open its preview.");
  const [previewDocument, setPreviewDocument] = React.useState<(typeof documents)[number] | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const selectableDocs = documents.filter((doc) => !doc.locked);
  const selectedCount = selectableDocs.filter((doc) => selectedIds.has(doc.id)).length;
  const allSelected = selectableDocs.length > 0 && selectedCount === selectableDocs.length;

  const toggleSelected = (id: string, checked: boolean) => {
    const doc = documents.find((item) => item.id === id);
    if (doc?.locked) return;
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      setStatus(next.size === 0 ? "Use checkboxes to select documents. Press a document title to open its preview." : \`\${next.size} selected.\`);
      return next;
    });
  };

  const toggleAllSelected = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const doc of selectableDocs) {
        if (checked) next.add(doc.id);
        else next.delete(doc.id);
      }
      const nextCount = selectableDocs.filter((doc) => next.has(doc.id)).length;
      setStatus(nextCount === 0 ? "Use checkboxes to select documents. Press a document title to open its preview." : \`\${nextCount} selected.\`);
      return next;
    });
  };

  const clearSelection = () => toggleAllSelected(false);
  const downloadSelected = () => {
    if (selectedCount === 0) return;
    setToastMessage(\`Started downloading \${selectedCount} selected documents.\`);
  };

  const rows = documents.map((doc) => (
    <DocumentRow
      key={doc.id}
      icon={doc.id.includes("expense") ? <IconFileTypeZip className="h-5 w-5" /> : <IconFileTypePdf className="h-5 w-5" />}
      title={doc.title}
      description={doc.description}
      meta={doc.meta}
      control={
        doc.locked ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Checkbox checked={false} disabled aria-label={\`Select: \${doc.title}\`} />
              </span>
            </TooltipTrigger>
            <TooltipContent portalContainer={portalRef.current}>
              Finalizing documents cannot be selected.
            </TooltipContent>
          </Tooltip>
        ) : (
          <Checkbox
            checked={selectedIds.has(doc.id)}
            onCheckedChange={(checked) => toggleSelected(doc.id, checked === true)}
            aria-label={\`Select: \${doc.title}\`}
          />
        )
      }
      status={doc.status ? <Badge variant="secondary">{doc.status}</Badge> : undefined}
      onOpen={() => setPreviewDocument(doc)}
      actions={
        <TooltipButton
          size="icon"
          variant="ghost"
          aria-label={\`Download: \${doc.title}\`}
          tooltip={\`Download: \${doc.title}\`}
          onClick={() => setToastMessage(\`Started downloading \${doc.title}.\`)}
        >
          <IconDownload className="h-4 w-4" />
        </TooltipButton>
      }
    />
  ));

  const sections: SectionListSection[] = [
    { key: "current", title: "2026", meta: "3 files", content: rows },
  ];

  return (
    <div
      ref={portalRef}
      data-document-row-preview-frame
      className="relative flex w-full max-w-2xl flex-col gap-4"
    >
      {toastMessage ? (
        <div className="pointer-events-none absolute bottom-4 right-6 z-[100] w-[min(360px,calc(100%-3rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            onClose={() => setToastMessage(null)}
            placement="inline"
            closeLabel="Close notification"
            tooltipPortalContainer={portalRef.current}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => toggleAllSelected(checked === true)}
            label="Select all"
            description={\`\${selectedCount} selected.\`}
          />
          <div className="flex flex-wrap items-center gap-2">
            {selectedCount === 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Button type="button" variant="ghost" size="sm" disabled>
                      Clear selection
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent portalContainer={portalRef.current}>
                  Select documents to enable batch download.
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
                Clear selection
              </Button>
            )}
            {selectedCount === 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Button type="button" variant="outline" size="sm" disabled>
                      <IconDownload className="h-4 w-4" />
                      Download selected
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent portalContainer={portalRef.current}>
                  Select documents to enable batch download.
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={downloadSelected}>
                <IconDownload className="h-4 w-4" />
                Download selected
              </Button>
            )}
          </div>
        </div>
        <SectionList sections={sections} label="Document list" />
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
          {status}
        </p>
      </div>
      <Dialog open={previewDocument != null} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent
          portalContainer={portalRef.current}
          overlayClassName="rounded-xl"
          closeLabel="Close"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Document preview</DialogTitle>
            <DialogDescription>Preview the selected document content.</DialogDescription>
          </DialogHeader>
          {previewDocument ? (
            <div className="rounded-md border bg-muted/30 p-4 text-sm leading-6">
              <p className="font-medium">{previewDocument.title}</p>
              <p className="mt-1 text-muted-foreground">{previewDocument.meta}</p>
              <p className="mt-3 text-muted-foreground">This preview shows sample document content.</p>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreviewDocument(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

  const propsData = [
    {
      name: "title",
      type: "ReactNode",
      description: locale === "ja" ? "書類名です。" : "Document title.",
    },
    {
      name: "description",
      type: "ReactNode",
      description: locale === "ja" ? "タイトル下の補足行です。" : "Secondary line under the title.",
    },
    {
      name: "meta",
      type: "ReactNode",
      description: locale === "ja" ? "形式、サイズ、発行日などのメタ情報です。" : "File format, size, issue date, or similar metadata.",
    },
    {
      name: "icon",
      type: "ReactNode",
      description: locale === "ja" ? "ファイル種別アイコンです。" : "File-type icon.",
    },
    {
      name: "control",
      type: "ReactNode",
      description: locale === "ja" ? "複数選択など、先頭に置く独立した操作です。" : "Independent leading control such as a multi-select checkbox.",
    },
    {
      name: "status",
      type: "ReactNode",
      description: locale === "ja" ? "新着、発行済みなどの状態ピルです。" : "Status pill such as new or issued.",
    },
    {
      name: "actions",
      type: "ReactNode",
      description: locale === "ja" ? "ダウンロードなど、末尾に置く独立した操作です。" : "Independent trailing actions such as download.",
    },
    {
      name: "onOpen",
      type: "() => void",
      description: locale === "ja" ? "ファイル本体部分をプレビューボタンにします。control / actions とは別の操作対象です。" : "Makes the file identity area a preview button, separate from control and actions.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "DocumentRow", href: "/docs/components/document-row" },
        { name: "SectionList", href: "/docs/components/section-list" },
        { name: "Dialog", href: "/docs/components/dialog" },
        { name: "Toast", href: "/docs/components/toast" },
        { name: "Tooltip", href: "/docs/components/tooltip" },
        { name: "TooltipButton", href: "/docs/components/tooltip-button" },
      ]}
      relatedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "NavRow", href: "/docs/components/nav-row" },
        { name: "Table", href: "/docs/components/table" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <DocumentRowPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "independent-actions",
              title: locale === "ja" ? "独立した操作対象" : "Independent targets",
              description: locale === "ja"
                ? "チェックボックス、プレビュー、ダウンロードは互いに入れ子にならない独立操作です。"
                : "Checkbox, preview, and download are separate targets rather than nested buttons.",
              preview: <DocumentRowPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "lg",
            },
            {
              key: "disabled-download",
              title: locale === "ja" ? "無効化された操作" : "Disabled action",
              description: locale === "ja"
                ? "無効なダウンロード操作は、ホバーまたはフォーカスで理由を説明します。"
                : "A disabled download explains why on hover or focus.",
              preview: <DocumentRowPreview locale={locale} lockedOnly />,
              code: locale === "ja"
                ? `<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0} className="inline-flex">
      <Button size="icon" variant="ghost" disabled aria-label="ダウンロード: 経費精算 添付書類">
        <IconDownload className="h-4 w-4" />
      </Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>確定処理中のため、ダウンロードはまだ利用できません。</TooltipContent>
</Tooltip>`
                : `<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0} className="inline-flex">
      <Button size="icon" variant="ghost" disabled aria-label="Download: Expense report attachments">
        <IconDownload className="h-4 w-4" />
      </Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>The file is still being finalized, so download is unavailable.</TooltipContent>
</Tooltip>`,
              previewBodyWidth: "lg",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
