"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScanGate,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type ScanGateContext,
  type ScanGateHandle,
  type ScanGateResult,
  type ScanInputAction,
} from "@gunjo/ui";

type Line = { code: string; name: string; ordered: number; packed: number };
type Carton = { barcode: string };
type ScanStageId = "carton" | "item" | "ship" | "badge";
type ScannerTarget = {
  stage: ScanStageId;
  title: string;
  description: string;
  closeLabel: string;
  codes: { code: string; label: string; meta: string }[];
  action: ScanInputAction;
};

const initialLines: Line[] = [
  { code: "4901111111118", name: "Desk light LED", ordered: 2, packed: 0 },
  { code: "4902222222225", name: "USB-C cable 1m", ordered: 1, packed: 0 },
];

const barcodeBars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 2, 1];
const qrCells = Array.from({ length: 49 }, (_, index) => [0, 1, 2, 6, 7, 8, 12, 14, 18, 20, 21, 24, 28, 30, 32, 35, 36, 40, 42, 45, 48].includes(index));

function localizedItemName(name: string, locale: "ja" | "en") {
  if (locale === "en") return name;
  return name === "Desk light LED" ? "デスクライト LED" : "USB-C ケーブル 1m";
}

function BarcodeVisual({ value }: { value: string }) {
  return (
    <div className="flex h-10 items-end gap-0.5 rounded bg-background px-2 py-1" aria-hidden="true">
      {barcodeBars.map((width, index) => (
        <span
          key={`${value}-${index}`}
          className="block bg-foreground"
          style={{ width: `${width}px`, height: `${18 + ((index + value.length) % 5) * 4}px` }}
        />
      ))}
    </div>
  );
}

function QrVisual({ value }: { value: string }) {
  return (
    <div className="grid h-12 w-12 grid-cols-7 gap-0.5 rounded bg-background p-1" aria-hidden="true">
      {qrCells.map((filled, index) => (
        <span key={`${value}-${index}`} className={filled ? "bg-foreground" : "bg-transparent"} />
      ))}
    </div>
  );
}

function ScannerPanel({
  target,
  onClose,
  portalContainer,
}: {
  target: ScannerTarget;
  onClose: () => void;
  portalContainer: HTMLElement | null;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent portalContainer={portalContainer} closeLabel={target.closeLabel} className="gap-4 p-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{target.title}</DialogTitle>
          <DialogDescription>{target.description}</DialogDescription>
        </DialogHeader>
        <div className="relative overflow-hidden rounded-md border bg-foreground p-4 text-background">
          <div className="pointer-events-none absolute inset-x-4 top-1/2 h-px bg-success shadow-[0_0_16px_hsl(var(--success))]" />
          <div className="grid gap-2">
            {target.codes.map((item) => (
              <button
                key={item.code}
                type="button"
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-background/20 bg-background/10 px-3 py-2 text-left transition-colors hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  target.action.commit(item.code);
                  onClose();
                }}
              >
                <span className="min-w-0">
                  <span className="block font-mono text-sm font-semibold tracking-wide">{item.code}</span>
                  <span className="block truncate text-xs text-background/75">{item.label} / {item.meta}</span>
                </span>
                {target.stage === "item" ? <QrVisual value={item.code} /> : <BarcodeVisual value={item.code} />}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type WorkflowStatus = "done" | "active" | "waiting";

function WorkflowStatusBadge({ status, locale }: { status: WorkflowStatus; locale: "ja" | "en" }) {
  const label = status === "done"
    ? locale === "ja" ? "完了" : "Done"
    : status === "active"
      ? locale === "ja" ? "対応中" : "Active"
      : locale === "ja" ? "待機" : "Waiting";

  const className = status === "done"
    ? "border-success bg-success-subtle/50 text-success-strong"
    : status === "active"
      ? "border-primary-border bg-primary-subtle text-primary-subtle-foreground"
      : "border-border bg-background text-muted-foreground";

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function WorkflowStepCard({
  number,
  title,
  description,
  status,
  locale,
  children,
}: {
  number: number;
  title: string;
  description: string;
  status: WorkflowStatus;
  locale: "ja" | "en";
  children: React.ReactNode;
}) {
  const activeClass = status === "active"
    ? "border-primary-border bg-primary-subtle/30"
    : status === "done"
      ? "border-success bg-success-subtle/20"
      : "border-border bg-card";

  return (
    <li className={`rounded-lg border p-3 ${activeClass}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border bg-background text-xs font-semibold text-foreground">
              {number}
            </span>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <WorkflowStatusBadge status={status} locale={locale} />
      </div>
      {children}
    </li>
  );
}

function ScanGatePackingPreview({
  locale,
  showSteps = false,
}: {
  locale: "ja" | "en";
  showSteps?: boolean;
}) {
  const [lines, setLines] = React.useState<Line[]>(initialLines);
  const [openCarton, setOpenCarton] = React.useState<string | null>(null);
  const [activeStage, setActiveStage] = React.useState<ScanStageId>("carton");
  const [scannerTarget, setScannerTarget] = React.useState<ScannerTarget | null>(null);
  const [shipped, setShipped] = React.useState(false);
  const previewRootRef = React.useRef<HTMLDivElement>(null);
  const gateRef = React.useRef<ScanGateHandle>(null);
  const orderedTotal = lines.reduce((total, line) => total + line.ordered, 0);
  const packedTotal = lines.reduce((total, line) => total + line.packed, 0);
  const remainingTotal = Math.max(0, orderedTotal - packedTotal);
  const activeStageLabel = activeStage === "carton"
    ? locale === "ja" ? "カートン" : "Carton"
    : activeStage === "item"
      ? locale === "ja" ? "商品" : "Item"
      : activeStage === "ship"
        ? locale === "ja" ? "出荷確認" : "Shipment"
        : locale === "ja" ? "社員証" : "Badge";
  const cartonStatus: WorkflowStatus = openCarton ? "done" : activeStage === "carton" ? "active" : "waiting";
  const itemStatus: WorkflowStatus = remainingTotal === 0 && openCarton ? "done" : openCarton ? "active" : "waiting";
  const shipmentStatus: WorkflowStatus = shipped ? "done" : remainingTotal === 0 && openCarton ? "active" : "waiting";

  const startNextCarton = React.useCallback(() => {
    setOpenCarton(null);
    setActiveStage("carton");
    setScannerTarget(null);
    setShipped(false);
    setLines(initialLines);
    gateRef.current?.reset();
  }, []);

  const handleCarton = (code: string): ScanGateResult => {
    if (!["CTN-001", "CTN-002"].includes(code)) {
      return {
        ok: false,
        message: locale === "ja" ? `カートンが見つかりません（${code}）` : `Carton not found (${code})`,
        advance: "stay",
      };
    }
    setOpenCarton(code);
    setShipped(false);
    return {
      ok: true,
      message: locale === "ja" ? `カートン ${code} を開きました` : `Opened carton ${code}`,
      advance: "next",
      value: { barcode: code } satisfies Carton,
    };
  };

  const handleItem = (code: string, ctx: ScanGateContext): ScanGateResult => {
    const carton = (ctx.values.carton as Carton | undefined) ?? (openCarton ? { barcode: openCarton } : undefined);
    if (!carton) {
      return {
        ok: false,
        message: locale === "ja" ? "先にカートンをスキャンしてください" : "Scan a carton first",
        advance: "carton",
      };
    }

    const index = lines.findIndex((line) => line.code === code);
    if (index === -1) {
      return {
        ok: false,
        message: locale === "ja" ? `受注に無い商品です（${code}）` : `Item is not in this order (${code})`,
        advance: "stay",
      };
    }

    const line = lines[index];
    if (line.packed >= line.ordered) {
      return {
        ok: false,
        message: locale === "ja"
          ? `${localizedItemName(line.name, locale)} は梱包済みです`
          : `${line.name} is already packed`,
        advance: "stay",
      };
    }

    const next = line.packed + 1;
    const nextLines = lines.map((item, itemIndex) => itemIndex === index ? { ...item, packed: next } : item);
    const allPacked = nextLines.every((item) => item.packed >= item.ordered);
    setLines(nextLines);
    return {
      ok: true,
      message: locale === "ja"
        ? `${localizedItemName(line.name, locale)} を ${carton?.barcode ?? "carton"} に梱包（${next} / ${line.ordered}）`
        : `Packed ${line.name} into ${carton?.barcode ?? "carton"} (${next} / ${line.ordered})`,
      advance: allPacked ? "ship" : "stay",
    };
  };

  const handleShipment = (code: string, ctx: ScanGateContext): ScanGateResult => {
    const carton = (ctx.values.carton as Carton | undefined) ?? (openCarton ? { barcode: openCarton } : undefined);
    const expected = carton ? `SHIP-${carton.barcode}` : "SHIP-CTN-001";
    if (code !== expected) {
      return {
        ok: false,
        message: locale === "ja" ? `出荷ラベルが一致しません（${code}）` : `Shipment label does not match (${code})`,
        advance: "stay",
      };
    }
    return {
      ok: true,
      message: locale === "ja" ? `${carton?.barcode ?? "カートン"} を出荷待ちにしました` : `${carton?.barcode ?? "Carton"} is ready to ship`,
      advance: "done",
      value: { label: code, shippedAt: "2026-07-01 10:24" },
    };
  };

  return (
    <div ref={previewRootRef} className="relative flex w-full max-w-lg flex-col gap-4">
      <div className="rounded-lg border bg-card p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              {locale === "ja" ? "次に読み取る" : "Next scan"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {activeStageLabel}
              {openCarton ? (
                <span className="ml-2 font-mono text-xs font-medium text-muted-foreground">{openCarton}</span>
              ) : null}
            </p>
          </div>
          <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {locale === "ja" ? `梱包 ${packedTotal} / ${orderedTotal}` : `Packed ${packedTotal} / ${orderedTotal}`}
          </span>
        </div>
        <ScanGate
          ref={gateRef}
          showSteps={showSteps}
          onStageChange={(stageId) => setActiveStage(stageId === "item" || stageId === "ship" ? stageId : "carton")}
          onComplete={() => setShipped(true)}
          stages={[
            {
              id: "carton",
              label: locale === "ja" ? "1. カートンをスキャン" : "1. Scan carton",
              title: locale === "ja" ? "カートン" : "Carton",
              placeholder: "CTN-001 / CTN-002",
              scannerLabel: locale === "ja" ? "カートン用のスキャン画面を開く" : "Open carton scanner",
              onScannerOpen: (action) => setScannerTarget({
                stage: "carton",
                title: locale === "ja" ? "カートンラベルを読み取る" : "Scan a carton label",
                description: locale === "ja" ? "箱に貼られたラベルをスキャンします。読み取ると次の商品ステップへ進みます。" : "Scan the label on the shipping carton. A successful read advances to the item step.",
                closeLabel: locale === "ja" ? "閉じる" : "Close",
                action,
                codes: ["CTN-001", "CTN-002"].map((code) => ({
                  code,
                  label: locale === "ja" ? "出荷カートン" : "Shipping carton",
                  meta: locale === "ja" ? "箱ラベル" : "Carton label",
                })),
              }),
              onScan: handleCarton,
            },
            {
              id: "item",
              label: locale === "ja" ? "2. 商品をスキャン" : "2. Scan item",
              title: locale === "ja" ? "商品" : "Item",
              placeholder: "4901111111118 / 4902222222225",
              inputMode: "numeric",
              scannerLabel: locale === "ja" ? "商品用のスキャン画面を開く" : "Open item scanner",
              onScannerOpen: (action) => setScannerTarget({
                stage: "item",
                title: locale === "ja" ? "商品バーコードを読み取る" : "Scan an item barcode",
                description: locale === "ja" ? "梱包明細の商品バーコードをスキャンします。読み取ると数量が更新されます。" : "Scan the item barcode from the packing line. A successful read updates the packed count.",
                closeLabel: locale === "ja" ? "閉じる" : "Close",
                action,
                codes: lines.map((line) => ({
                  code: line.code,
                  label: localizedItemName(line.name, locale),
                  meta: `${line.packed} / ${line.ordered}`,
                })),
              }),
              onScan: handleItem,
            },
            {
              id: "ship",
              label: locale === "ja" ? "3. 出荷確認" : "3. Confirm shipment",
              title: locale === "ja" ? "出荷" : "Shipment",
              placeholder: openCarton ? "SHIP-" + openCarton : "SHIP-CTN-001",
              scannerLabel: locale === "ja" ? "出荷ラベル用のスキャン画面を開く" : "Open shipment label scanner",
              onScannerOpen: (action, ctx) => {
                const carton = (ctx.values.carton as Carton | undefined) ?? (openCarton ? { barcode: openCarton } : undefined);
                const code = carton ? `SHIP-${carton.barcode}` : "SHIP-CTN-001";
                setScannerTarget({
                  stage: "ship",
                  title: locale === "ja" ? "出荷ラベルを読み取る" : "Scan the shipment label",
                  description: locale === "ja" ? "梱包完了後のカートンに貼る出荷ラベルを読み取ります。完了すると出荷待ち状態になります。" : "Scan the shipment label applied after packing. A successful read marks the carton ready to ship.",
                  closeLabel: locale === "ja" ? "閉じる" : "Close",
                  action,
                  codes: [{
                    code,
                    label: locale === "ja" ? "出荷ラベル" : "Shipment label",
                    meta: carton?.barcode ?? "CTN-001",
                  }],
                });
              },
              onScan: handleShipment,
            },
          ]}
        />
      </div>

      {scannerTarget ? (
        <ScannerPanel
          target={scannerTarget}
          onClose={() => setScannerTarget(null)}
          portalContainer={previewRootRef.current}
        />
      ) : null}

      <ol className="flex flex-col gap-3">
        <WorkflowStepCard
          number={1}
          title={locale === "ja" ? "カートン" : "Carton"}
          description={locale === "ja" ? "箱ラベルを読み取り、以降の商品をこのカートンに紐付けます。" : "Scan the carton label before assigning items to it."}
          status={cartonStatus}
          locale={locale}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {["CTN-001", "CTN-002"].map((code) => {
              const selected = openCarton === code;
              return (
                <div key={code} className={selected ? "rounded-md border border-primary-border bg-background px-3 py-2" : "rounded-md border bg-background px-3 py-2"}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">{code}</p>
                      <p className="text-xs text-muted-foreground">
                        {locale === "ja" ? "出荷カートン" : "Shipping carton"}
                      </p>
                    </div>
                    {selected ? (
                      <span className="rounded-full bg-primary-subtle px-2 py-0.5 text-xs font-medium text-primary-subtle-foreground">
                        {locale === "ja" ? "選択中" : "Selected"}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 max-w-[144px]">
                    <BarcodeVisual value={code} />
                  </div>
                </div>
              );
            })}
          </div>
        </WorkflowStepCard>

        <WorkflowStepCard
          number={2}
          title={locale === "ja" ? "商品" : "Items"}
          description={locale === "ja" ? "複数の商品ラベルを読み取り、明細ごとの梱包数を完了にします。" : "Scan each item label and complete every packing line."}
          status={itemStatus}
          locale={locale}
        >
          <ul className="flex flex-col gap-2 text-sm">
            {lines.map((line) => {
              const done = line.packed >= line.ordered;
              return (
                <li key={line.code} className={done ? "grid gap-1 rounded-md border border-success bg-background px-3 py-2" : "grid gap-1 rounded-md border bg-background px-3 py-2"}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate font-medium text-foreground">{localizedItemName(line.name, locale)}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {line.packed} / {line.ordered}
                      {done ? (
                        <span className="ml-2 text-success-strong">
                          {locale === "ja" ? "完了" : "Done"}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{line.code}</span>
                    <QrVisual value={line.code} />
                  </div>
                </li>
              );
            })}
          </ul>
        </WorkflowStepCard>

        <WorkflowStepCard
          number={3}
          title={locale === "ja" ? "出荷確認" : "Shipment confirmation"}
          description={locale === "ja" ? "出荷ラベルを読み取り、カートンを出荷待ちにしてから次へ進みます。" : "Scan the shipment label, mark the carton ready, then continue to the next carton."}
          status={shipmentStatus}
          locale={locale}
        >
          <div className={shipped ? "rounded-md border border-success bg-background px-3 py-3" : "rounded-md border bg-background px-3 py-3"}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {shipped
                    ? locale === "ja" ? "出荷待ちにしました" : "Ready to ship"
                    : remainingTotal === 0
                      ? locale === "ja" ? "出荷ラベルを読み取って完了します" : "Scan the shipment label to finish"
                      : locale === "ja" ? "商品がすべて完了すると出荷確認できます" : "Shipment confirmation unlocks after all items are packed"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {shipped
                    ? locale === "ja" ? `${openCarton ?? "カートン"} は出荷待ちです。次のカートンへ進めます。` : `${openCarton ?? "Carton"} is ready to ship. Continue with the next carton.`
                    : locale === "ja" ? `梱包 ${packedTotal} / ${orderedTotal}、残り ${remainingTotal} 点。` : `Packed ${packedTotal} / ${orderedTotal}; ${remainingTotal} remaining.`}
                </p>
              </div>
              <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {openCarton ? `SHIP-${openCarton}` : "SHIP-CTN-001"}
              </span>
            </div>
            <div className="mt-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block" tabIndex={shipped ? -1 : 0}>
                    <Button
                      className="h-11 w-full justify-center text-sm font-semibold"
                      variant={shipped ? "primary" : "outline"}
                      disabled={!shipped}
                      onClick={() => {
                        if (!shipped) return;
                        startNextCarton();
                      }}
                    >
                      {locale === "ja" ? "次のカートンを読み取る" : "Scan next carton"}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {shipped
                    ? locale === "ja" ? "現在のカートンを完了し、次のカートン読み取りへ切り替えます。" : "Finish this carton and switch to scanning the next carton."
                    : locale === "ja" ? "出荷ラベルを読み取ると、次のカートン読み取りへ進めます。" : "Scan the shipment label to continue with the next carton."}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </WorkflowStepCard>
      </ol>
    </div>
  );
}

function ScanGateDonePreview({ locale }: { locale: "ja" | "en" }) {
  const [complete, setComplete] = React.useState(false);
  const [scannerTarget, setScannerTarget] = React.useState<ScannerTarget | null>(null);
  const previewRootRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={previewRootRef} className="relative flex w-full max-w-md flex-col gap-3">
      <ScanGate
        autoFocus={false}
        onComplete={() => setComplete(true)}
        stages={[
          {
            id: "badge",
            label: locale === "ja" ? "社員証をスキャン" : "Scan employee badge",
            title: locale === "ja" ? "社員証" : "Badge",
            placeholder: locale === "ja" ? "EMP-104" : "EMP-104",
            scannerLabel: locale === "ja" ? "社員証用のスキャン画面を開く" : "Open employee badge scanner",
            onScannerOpen: (action) => setScannerTarget({
              stage: "badge",
              title: locale === "ja" ? "社員証を読み取る" : "Scan an employee badge",
              description: locale === "ja" ? "作業者の社員証ラベルを読み取ります。EMP-104 が一致すると完了状態で停止します。" : "Scan the operator badge label. EMP-104 completes the verification and holds the final state.",
              closeLabel: locale === "ja" ? "閉じる" : "Close",
              action,
              codes: [{
                code: "EMP-104",
                label: locale === "ja" ? "作業者 ID" : "Operator ID",
                meta: locale === "ja" ? "社員証ラベル" : "Badge label",
              }],
            }),
            onScan: (code) => ({
              ok: code === "EMP-104",
              message: code === "EMP-104"
                ? locale === "ja" ? "担当者を確認しました" : "Operator verified"
                : locale === "ja" ? "担当者が一致しません" : "Operator does not match",
              advance: code === "EMP-104" ? "done" : "stay",
              value: code,
            }),
          },
        ]}
      />
      {scannerTarget ? (
        <ScannerPanel
          target={scannerTarget}
          onClose={() => setScannerTarget(null)}
          portalContainer={previewRootRef.current}
        />
      ) : null}
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {complete
          ? locale === "ja" ? "確認が完了しました。" : "Verification complete."
          : locale === "ja" ? "EMP-104 を入力して確認します。" : "Enter EMP-104 to verify."}
      </p>
    </div>
  );
}

export default function ScanGateDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/scan-gate", locale);
  const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
  const title = content?.title ?? metadata.scanGate.title;
  const description = content?.description ?? metadata.scanGate.description;

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScanGate,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type ScanGateHandle,
  type ScanGateResult,
  type ScanInputAction,
} from "@gunjo/ui";

type ScannerTarget = {
  stage: "carton" | "item" | "ship";
  title: string;
  description: string;
  codes: { code: string; label: string; meta: string }[];
  action: ScanInputAction;
};

function BarcodeVisual({ value }: { value: string }) {
  const bars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 2, 1];
  return (
    <div className="flex h-10 items-end gap-0.5 rounded bg-background px-2 py-1" aria-hidden="true">
      {bars.map((width, index) => (
        <span key={index} className="block bg-foreground" style={{ width, height: 18 + ((index + value.length) % 5) * 4 }} />
      ))}
    </div>
  );
}

function QrVisual({ value }: { value: string }) {
  const cells = Array.from({ length: 49 }, (_, index) => [0, 1, 2, 6, 7, 8, 12, 14, 18, 20, 21, 24, 28, 30, 32, 35, 36, 40, 42, 45, 48].includes(index));
  return (
    <div className="grid h-12 w-12 grid-cols-7 gap-0.5 rounded bg-background p-1" aria-hidden="true">
      {cells.map((filled, index) => <span key={index} className={filled ? "bg-foreground" : "bg-transparent"} />)}
    </div>
  );
}

function ScannerPanel({ target, onClose }: { target: ScannerTarget; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-4 p-4 sm:max-w-md" closeLabel="閉じる">
        <DialogHeader>
          <DialogTitle>{target.title}</DialogTitle>
          <DialogDescription>{target.description}</DialogDescription>
        </DialogHeader>
        <div className="relative overflow-hidden rounded-md border bg-foreground p-4 text-background">
          <div className="pointer-events-none absolute inset-x-4 top-1/2 h-px bg-success" />
          <div className="grid gap-2">
          {target.codes.map((item) => (
            <button
              key={item.code}
              type="button"
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-background/20 bg-background/10 px-3 py-2 text-left hover:bg-background/20"
              onClick={() => {
                target.action.commit(item.code);
                onClose();
              }}
            >
              <span>
                <span className="block font-mono text-sm font-semibold tracking-wide">{item.code}</span>
                <span className="block text-xs text-background/75">{item.label} / {item.meta}</span>
              </span>
              {target.stage === "item" ? <QrVisual value={item.code} /> : <BarcodeVisual value={item.code} />}
            </button>
          ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PackingGate() {
  const [openCarton, setOpenCarton] = React.useState<string | null>(null);
  const [activeStage, setActiveStage] = React.useState<"carton" | "item" | "ship">("carton");
  const [scannerTarget, setScannerTarget] = React.useState<ScannerTarget | null>(null);
  const [shipped, setShipped] = React.useState(false);
  const [lines, setLines] = React.useState([
    { code: "4901111111118", name: "デスクライト LED", ordered: 2, packed: 0 },
    { code: "4902222222225", name: "USB-C ケーブル 1m", ordered: 1, packed: 0 },
  ]);
  const gateRef = React.useRef<ScanGateHandle>(null);

  const handleCarton = (code: string): ScanGateResult => {
    if (!["CTN-001", "CTN-002"].includes(code)) {
      return { ok: false, message: \`カートンが見つかりません（\${code}）\`, advance: "stay" };
    }
    setOpenCarton(code);
    setShipped(false);
    return { ok: true, message: \`カートン \${code} を開きました\`, advance: "next", value: { barcode: code } };
  };

  const handleItem = (code: string, ctx): ScanGateResult => {
    const carton = ctx.values.carton ?? (openCarton ? { barcode: openCarton } : undefined);
    if (!carton) return { ok: false, message: "先にカートンをスキャンしてください", advance: "carton" };

    const index = lines.findIndex((line) => line.code === code);
    if (index === -1) return { ok: false, message: \`受注に無い商品です（\${code}）\`, advance: "stay" };

    const line = lines[index];
    const next = line.packed + 1;
    setLines((current) =>
      current.map((item, itemIndex) => itemIndex === index ? { ...item, packed: next } : item)
    );

    return {
      ok: true,
      message: \`\${line.name} を \${carton.barcode} に梱包（\${next} / \${line.ordered}）\`,
      advance: "ship",
    };
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ScanGate
        ref={gateRef}
        onComplete={() => setShipped(true)}
        onStageChange={(stageId) => setActiveStage(stageId === "item" || stageId === "ship" ? stageId : "carton")}
        stages={[
          {
            id: "carton",
            label: "1. カートンをスキャン",
            title: "カートン",
            placeholder: "CTN-001 / CTN-002",
            scannerLabel: "カートン用のスキャン画面を開く",
            onScannerOpen: (action) => setScannerTarget({
              stage: "carton",
              title: "カートンラベルを読み取る",
              description: "箱に貼られたラベルをスキャンします。",
              action,
              codes: ["CTN-001", "CTN-002"].map((code) => ({ code, label: "出荷カートン", meta: "箱ラベル" })),
            }),
            onScan: handleCarton,
          },
          {
            id: "item",
            label: "2. 商品をスキャン",
            title: "商品",
            placeholder: "4901111111118 / 4902222222225",
            inputMode: "numeric",
            scannerLabel: "商品用のスキャン画面を開く",
            onScannerOpen: (action) => setScannerTarget({
              stage: "item",
              title: "商品バーコードを読み取る",
              description: "梱包明細の商品バーコードをスキャンします。",
              action,
              codes: lines.map((line) => ({ code: line.code, label: line.name, meta: line.packed + " / " + line.ordered })),
            }),
            onScan: handleItem,
          },
          {
            id: "ship",
            label: "3. 出荷確認",
            title: "出荷",
            placeholder: openCarton ? "SHIP-" + openCarton : "SHIP-CTN-001",
            scannerLabel: "出荷ラベル用のスキャン画面を開く",
            onScannerOpen: (action) => setScannerTarget({
              stage: "ship",
              title: "出荷ラベルを読み取る",
              description: "梱包完了後のカートンに貼る出荷ラベルを読み取ります。",
              action,
              codes: [{ code: openCarton ? "SHIP-" + openCarton : "SHIP-CTN-001", label: "出荷ラベル", meta: openCarton ?? "CTN-001" }],
            }),
            onScan: (code, ctx) => {
              const expected = "SHIP-" + (ctx.values.carton?.barcode ?? openCarton ?? "CTN-001");
              return {
                ok: code === expected,
                message: code === expected ? "出荷待ちにしました" : "出荷ラベルが一致しません",
                advance: code === expected ? "done" : "stay",
              };
            },
          },
        ]}
      />

      {scannerTarget ? <ScannerPanel target={scannerTarget} onClose={() => setScannerTarget(null)} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">次に読み取る</p>
          <p className="text-sm font-medium text-foreground">
            {activeStage === "carton" ? "カートン" : activeStage === "item" ? "商品" : "出荷確認"}
          </p>
        </div>
        <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          梱包 {packedTotal} / {orderedTotal}
        </span>
      </div>

      <ol className="flex flex-col gap-3">
        <section className="rounded-lg border bg-muted/20 p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">1. カートン</h3>
          <div className="flex flex-col gap-2">
            {["CTN-001", "CTN-002"].map((code) => (
              <div key={code} className="rounded-md border bg-background px-3 py-2">
                <p className="font-mono text-sm font-semibold text-foreground">{code}</p>
                <p className="text-xs text-muted-foreground">出荷カートン</p>
                <div className="mt-2 max-w-[144px]">
                  <BarcodeVisual value={code} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">2. 商品</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {lines.map((line) => (
              <li key={line.code} className="grid gap-1 rounded-md border bg-background px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-medium text-foreground">{line.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {line.packed} / {line.ordered}
                    {line.packed >= line.ordered ? <span className="ml-2 text-success-strong">完了</span> : null}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{line.code}</span>
                  <QrVisual value={line.code} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">3. 出荷確認</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            {shipped ? "出荷待ちにしました。" : \`梱包 \${packedTotal} / \${orderedTotal}、残り \${orderedTotal - packedTotal} 点。\`}
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block" tabIndex={shipped ? -1 : 0}>
                <Button className="h-11 w-full" disabled={!shipped}>
                  次のカートンを読み取る
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {shipped ? "次のカートン読み取りへ切り替えます。" : "出荷ラベルを読み取ると、次のカートン読み取りへ進めます。"}
            </TooltipContent>
          </Tooltip>
        </section>
      </ol>
    </div>
  );
}`
    : `import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScanGate,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type ScanGateHandle,
  type ScanGateResult,
  type ScanInputAction,
} from "@gunjo/ui";

type ScannerTarget = {
  stage: "carton" | "item" | "ship";
  title: string;
  description: string;
  codes: { code: string; label: string; meta: string }[];
  action: ScanInputAction;
};

function BarcodeVisual({ value }: { value: string }) {
  const bars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 2, 1];
  return (
    <div className="flex h-10 items-end gap-0.5 rounded bg-background px-2 py-1" aria-hidden="true">
      {bars.map((width, index) => (
        <span key={index} className="block bg-foreground" style={{ width, height: 18 + ((index + value.length) % 5) * 4 }} />
      ))}
    </div>
  );
}

function QrVisual({ value }: { value: string }) {
  const cells = Array.from({ length: 49 }, (_, index) => [0, 1, 2, 6, 7, 8, 12, 14, 18, 20, 21, 24, 28, 30, 32, 35, 36, 40, 42, 45, 48].includes(index));
  return (
    <div className="grid h-12 w-12 grid-cols-7 gap-0.5 rounded bg-background p-1" aria-hidden="true">
      {cells.map((filled, index) => <span key={index} className={filled ? "bg-foreground" : "bg-transparent"} />)}
    </div>
  );
}

function ScannerPanel({ target, onClose }: { target: ScannerTarget; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-4 p-4 sm:max-w-md" closeLabel="Close">
        <DialogHeader>
          <DialogTitle>{target.title}</DialogTitle>
          <DialogDescription>{target.description}</DialogDescription>
        </DialogHeader>
        <div className="relative overflow-hidden rounded-md border bg-foreground p-4 text-background">
          <div className="pointer-events-none absolute inset-x-4 top-1/2 h-px bg-success" />
          <div className="grid gap-2">
          {target.codes.map((item) => (
            <button
              key={item.code}
              type="button"
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-background/20 bg-background/10 px-3 py-2 text-left hover:bg-background/20"
              onClick={() => {
                target.action.commit(item.code);
                onClose();
              }}
            >
              <span>
                <span className="block font-mono text-sm font-semibold tracking-wide">{item.code}</span>
                <span className="block text-xs text-background/75">{item.label} / {item.meta}</span>
              </span>
              {target.stage === "item" ? <QrVisual value={item.code} /> : <BarcodeVisual value={item.code} />}
            </button>
          ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PackingGate() {
  const [openCarton, setOpenCarton] = React.useState<string | null>(null);
  const [activeStage, setActiveStage] = React.useState<"carton" | "item" | "ship">("carton");
  const [scannerTarget, setScannerTarget] = React.useState<ScannerTarget | null>(null);
  const [shipped, setShipped] = React.useState(false);
  const [lines, setLines] = React.useState([
    { code: "4901111111118", name: "Desk light LED", ordered: 2, packed: 0 },
    { code: "4902222222225", name: "USB-C cable 1m", ordered: 1, packed: 0 },
  ]);
  const gateRef = React.useRef<ScanGateHandle>(null);

  const handleCarton = (code: string): ScanGateResult => {
    if (!["CTN-001", "CTN-002"].includes(code)) {
      return { ok: false, message: \`Carton not found (\${code})\`, advance: "stay" };
    }
    setOpenCarton(code);
    setShipped(false);
    return { ok: true, message: \`Opened carton \${code}\`, advance: "next", value: { barcode: code } };
  };

  const handleItem = (code: string, ctx): ScanGateResult => {
    const carton = ctx.values.carton ?? (openCarton ? { barcode: openCarton } : undefined);
    if (!carton) return { ok: false, message: "Scan a carton first", advance: "carton" };

    const index = lines.findIndex((line) => line.code === code);
    if (index === -1) return { ok: false, message: \`Item is not in this order (\${code})\`, advance: "stay" };

    const line = lines[index];
    const next = line.packed + 1;
    setLines((current) =>
      current.map((item, itemIndex) => itemIndex === index ? { ...item, packed: next } : item)
    );

    return {
      ok: true,
      message: \`Packed \${line.name} into \${carton.barcode} (\${next} / \${line.ordered})\`,
      advance: "ship",
    };
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ScanGate
        ref={gateRef}
        onComplete={() => setShipped(true)}
        onStageChange={(stageId) => setActiveStage(stageId === "item" || stageId === "ship" ? stageId : "carton")}
        stages={[
          {
            id: "carton",
            label: "1. Scan carton",
            title: "Carton",
            placeholder: "CTN-001 / CTN-002",
            scannerLabel: "Open carton scanner",
            onScannerOpen: (action) => setScannerTarget({
              stage: "carton",
              title: "Scan a carton label",
              description: "Scan the label on the shipping carton.",
              action,
              codes: ["CTN-001", "CTN-002"].map((code) => ({ code, label: "Shipping carton", meta: "Carton label" })),
            }),
            onScan: handleCarton,
          },
          {
            id: "item",
            label: "2. Scan item",
            title: "Item",
            placeholder: "4901111111118 / 4902222222225",
            inputMode: "numeric",
            scannerLabel: "Open item scanner",
            onScannerOpen: (action) => setScannerTarget({
              stage: "item",
              title: "Scan an item barcode",
              description: "Scan the item barcode from the packing line.",
              action,
              codes: lines.map((line) => ({ code: line.code, label: line.name, meta: line.packed + " / " + line.ordered })),
            }),
            onScan: handleItem,
          },
          {
            id: "ship",
            label: "3. Confirm shipment",
            title: "Shipment",
            placeholder: openCarton ? "SHIP-" + openCarton : "SHIP-CTN-001",
            scannerLabel: "Open shipment label scanner",
            onScannerOpen: (action) => setScannerTarget({
              stage: "ship",
              title: "Scan the shipment label",
              description: "Scan the shipment label applied after packing.",
              action,
              codes: [{ code: openCarton ? "SHIP-" + openCarton : "SHIP-CTN-001", label: "Shipment label", meta: openCarton ?? "CTN-001" }],
            }),
            onScan: (code, ctx) => {
              const expected = "SHIP-" + (ctx.values.carton?.barcode ?? openCarton ?? "CTN-001");
              return {
                ok: code === expected,
                message: code === expected ? "Ready to ship" : "Shipment label does not match",
                advance: code === expected ? "done" : "stay",
              };
            },
          },
        ]}
      />

      {scannerTarget ? <ScannerPanel target={scannerTarget} onClose={() => setScannerTarget(null)} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">Next scan</p>
          <p className="text-sm font-medium text-foreground">
            {activeStage === "carton" ? "Carton" : activeStage === "item" ? "Item" : "Shipment"}
          </p>
        </div>
        <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Packed {packedTotal} / {orderedTotal}
        </span>
      </div>

      <ol className="flex flex-col gap-3">
        <section className="rounded-lg border bg-muted/20 p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">1. Carton</h3>
          <div className="flex flex-col gap-2">
            {["CTN-001", "CTN-002"].map((code) => (
              <div key={code} className="rounded-md border bg-background px-3 py-2">
                <p className="font-mono text-sm font-semibold text-foreground">{code}</p>
                <p className="text-xs text-muted-foreground">Shipping carton</p>
                <div className="mt-2 max-w-[144px]">
                  <BarcodeVisual value={code} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">2. Items</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {lines.map((line) => (
              <li key={line.code} className="grid gap-1 rounded-md border bg-background px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-medium text-foreground">{line.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {line.packed} / {line.ordered}
                    {line.packed >= line.ordered ? <span className="ml-2 text-success-strong">Done</span> : null}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{line.code}</span>
                  <QrVisual value={line.code} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">3. Shipment confirmation</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            {shipped ? "Ready to ship." : \`Packed \${packedTotal} / \${orderedTotal}; \${orderedTotal - packedTotal} remaining.\`}
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block" tabIndex={shipped ? -1 : 0}>
                <Button className="h-11 w-full" disabled={!shipped}>
                  Scan next carton
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {shipped ? "Switch to scanning the next carton." : "Scan the shipment label to continue with the next carton."}
            </TooltipContent>
          </Tooltip>
        </section>
      </ol>
    </div>
  );
}`;

  const propsData = [
    {
      name: "stages",
      type: "ScanGateStage[]",
      description: locale === "ja"
        ? "順番に実行するスキャン段階です。各段階は id、label、onScan を持ちます。"
        : "Ordered scan stages. Each stage has an id, label, and onScan resolver.",
    },
    {
      name: "ScanGateResult.advance",
      type: '"next" | "stay" | "reset" | "done" | stageId',
      description: locale === "ja"
        ? "読み取り後にどの段階へ進むかを指定します。done は完了状態として保持し、onComplete を呼びます。"
        : "Controls where the flow moves after a scan. done holds the completed stage and calls onComplete.",
    },
    {
      name: "ScanGateResult.value",
      type: "unknown",
      description: locale === "ja"
        ? "その段階で確認した値です。後続段階は ctx.values[stageId] から参照できます。"
        : "Confirmed value for the stage. Later stages read it from ctx.values[stageId].",
    },
    {
      name: "onStageChange / onComplete",
      type: "(ctx) => void",
      description: locale === "ja"
        ? "段階変更または done 完了時に呼ばれるコールバックです。"
        : "Callbacks for stage changes and done completion.",
    },
    {
      name: "showSteps",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "上部のステップ表示を出すかどうかを指定します。"
        : "Controls whether the step indicator is shown.",
    },
    {
      name: "ScanGateStage.onScannerOpen",
      type: "(action, ctx) => void",
      description: locale === "ja"
        ? "入力欄のバーコードアイコンを押した時に呼ばれます。スキャン画面を開き、action.commit(code) で読み取り結果を確定できます。"
        : "Called when the ScanInput barcode action is activated. Open a scanner UI and call action.commit(code) to commit the read.",
    },
    {
      name: "ScanGateStage.scannerLabel",
      type: "string",
      description: locale === "ja"
        ? "バーコードアイコンボタンの aria-label とツールチップ文言です。"
        : "Accessible label and tooltip text for the barcode action button.",
    },
    {
      name: "autoFocus",
      type: "boolean",
      default: "true",
      description: locale === "ja"
        ? "マウント時と段階変更時にアクティブな入力へフォーカスします。"
        : "Focuses the active input on mount and when the stage changes.",
    },
    {
      name: "clearOnScan",
      type: "boolean",
      description: locale === "ja"
        ? "内部の ScanInput へ渡します。カメラ/スキャン画面で読み取りコードを入力欄に残したい場合は false にします。"
        : "Forwarded to the active ScanInput. Set false when a camera/scanner UI should leave the scanned code in the field.",
    },
    {
      name: "assertive / showFeed / feedLimit / lockMs",
      type: "boolean / boolean / number / number",
      description: locale === "ja"
        ? "内部の ScanInput へ渡す読み取り通知、履歴、重複防止の設定です。"
        : "Forwarded ScanInput settings for announcement, feed history, and duplicate locking.",
    },
    {
      name: "ref",
      type: "ScanGateHandle",
      description: locale === "ja"
        ? "reset、goTo、getValues を持つ命令的ハンドルです。"
        : "Imperative handle with reset, goTo, and getValues.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "ScanGate", href: "/docs/components/scan-gate" },
        { name: "ScanInput", href: "/docs/components/scan-input" },
        { name: "Button", href: "/docs/components/button" },
      ]}
      relatedComponents={[
        { name: "TicketStub", href: "/docs/components/ticket-stub" },
        { name: "ActionQueue", href: "/docs/components/action-queue" },
        { name: "SignedRecord", href: "/docs/components/signed-record" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto">
        <ScanGatePackingPreview locale={locale} showSteps={false} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "single-screen-flow",
              title: locale === "ja" ? "一画面フロー" : "Single-screen flow",
              description: locale === "ja"
                ? "読み取り済みの明細を同じ画面で完了にし、次に読む対象だけを切り替えます。"
                : "Completed lines stay visible while the next scan target changes in the same work surface.",
              preview: <ScanGatePackingPreview locale={locale} showSteps={false} />,
              code: usageCode,
            },
            {
              key: "with-steps",
              title: locale === "ja" ? "ステップ表示あり" : "With steps",
              description: locale === "ja"
                ? "手順を明示したい確認フローでは showSteps を有効にできます。"
                : "Enable showSteps when the process needs an explicit step indicator.",
              preview: <ScanGatePackingPreview locale={locale} showSteps />,
              code: usageCode.replace("        showSteps={false}\n", ""),
            },
            {
              key: "done",
              title: locale === "ja" ? "完了で停止" : "Hold on completion",
              description: locale === "ja"
                ? "advance=\"done\" は最後の段階で保持し、確認済みの context を onComplete に渡します。"
                : "advance=\"done\" holds the final stage and passes the verified context to onComplete.",
              preview: <ScanGateDonePreview locale={locale} />,
              code: locale === "ja"
                ? `const [complete, setComplete] = React.useState(false);
const [scannerTarget, setScannerTarget] = React.useState(null);

<div className="relative flex w-full max-w-md flex-col gap-3">
  <ScanGate
    autoFocus={false}
    onComplete={() => setComplete(true)}
    stages={[
      {
        id: "badge",
        label: "社員証をスキャン",
        title: "社員証",
        placeholder: "EMP-104",
        scannerLabel: "社員証用のスキャン画面を開く",
        onScannerOpen: (action) => setScannerTarget({
          stage: "badge",
          title: "社員証を読み取る",
          description: "作業者の社員証ラベルを読み取ります。",
          action,
          codes: [{ code: "EMP-104", label: "作業者 ID", meta: "社員証ラベル" }],
        }),
        onScan: (code) => ({
          ok: code === "EMP-104",
          message: code === "EMP-104" ? "担当者を確認しました" : "担当者が一致しません",
          advance: code === "EMP-104" ? "done" : "stay",
          value: code,
        }),
      },
    ]}
    clearOnScan={false}
  />
  {scannerTarget ? <ScannerPanel target={scannerTarget} onClose={() => setScannerTarget(null)} /> : null}
  <p className="text-xs text-muted-foreground" aria-live="polite">
    {complete ? "確認が完了しました。" : "EMP-104 を入力して確認します。"}
  </p>
</div>`
                : `const [complete, setComplete] = React.useState(false);
const [scannerTarget, setScannerTarget] = React.useState(null);

<div className="relative flex w-full max-w-md flex-col gap-3">
  <ScanGate
    autoFocus={false}
    onComplete={() => setComplete(true)}
    stages={[
      {
        id: "badge",
        label: "Scan employee badge",
        title: "Badge",
        placeholder: "EMP-104",
        scannerLabel: "Open employee badge scanner",
        onScannerOpen: (action) => setScannerTarget({
          stage: "badge",
          title: "Scan an employee badge",
          description: "Scan the operator badge label.",
          action,
          codes: [{ code: "EMP-104", label: "Operator ID", meta: "Badge label" }],
        }),
        onScan: (code) => ({
          ok: code === "EMP-104",
          message: code === "EMP-104" ? "Operator verified" : "Operator does not match",
          advance: code === "EMP-104" ? "done" : "stay",
          value: code,
        }),
      },
    ]}
    clearOnScan={false}
  />
  {scannerTarget ? <ScannerPanel target={scannerTarget} onClose={() => setScannerTarget(null)} /> : null}
  <p className="text-xs text-muted-foreground" aria-live="polite">
    {complete ? "Verification complete." : "Enter EMP-104 to verify."}
  </p>
</div>`,
            },
            {
              key: "compact",
              title: locale === "ja" ? "省略表示" : "Compact",
              description: locale === "ja"
                ? "周囲に明細や進捗がある場合は、ScanGate 自体は入力だけに寄せます。"
                : "When the surrounding surface carries the status, keep ScanGate focused on the active input.",
              preview: <ScanGatePackingPreview locale={locale} showSteps={false} />,
              code: usageCode,
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
