"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, LoyaltySummaryCard } from "@gunjo/ui";

type Locale = "ja" | "en";

function LoyaltyPreview({ locale, tone = "brand", noAlert = false }: { locale: Locale; tone?: "brand" | "default"; noAlert?: boolean }) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [barcodeOpen, setBarcodeOpen] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="flex w-full max-w-md flex-col gap-4">
      <LoyaltySummaryCard
        tone={tone}
        meta={locale === "ja" ? "ハッピーズドラッグ メンバーズ" : "Happy's Drug Members"}
        tier={
          <Badge
            variant={tone === "brand" ? "outline" : "secondary"}
            className={tone === "brand" ? "border-primary-strong-foreground/45 text-primary-strong-foreground" : undefined}
          >
            {locale === "ja" ? "ゴールド会員" : "Gold member"}
          </Badge>
        }
        balanceLabel={locale === "ja" ? "ポイント残高" : "Point balance"}
        balance="3,480"
        unit="P"
        secondary={[
          { label: locale === "ja" ? "当年購入額" : "Annual spend", value: "¥86,200" },
          { label: locale === "ja" ? "クーポン" : "Coupons", value: locale === "ja" ? "3枚" : "3" },
        ]}
        progress={{
          value: 86200,
          max: 100000,
          label: locale === "ja" ? "プラチナ会員まで あと ¥13,800" : "JPY 13,800 to Platinum",
          caption: "¥86,200 / ¥100,000",
        }}
        alert={noAlert ? undefined : (locale === "ja" ? "200 P が 2026/06/30 に失効予定です" : "200 P expire on 2026-06-30")}
        action={
          <Button
            size="lg"
            variant={tone === "brand" ? "secondary" : "default"}
            className="w-full"
            onClick={() => setBarcodeOpen(true)}
          >
            {locale === "ja" ? "会員バーコードを表示" : "Show member barcode"}
          </Button>
        }
      />
      <Dialog open={barcodeOpen} onOpenChange={setBarcodeOpen} modal={false}>
        <DialogContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel={locale === "ja" ? "閉じる" : "Close"} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{locale === "ja" ? "会員バーコード" : "Member barcode"}</DialogTitle>
            <DialogDescription>{locale === "ja" ? "レジでこのコードを提示します。" : "Present this code at checkout."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 rounded-lg border bg-card p-4 text-center">
            <p className="text-sm font-medium text-foreground">{locale === "ja" ? "ハッピーズドラッグ メンバーズ" : "Happy's Drug Members"}</p>
            <div
              aria-label={locale === "ja" ? "会員番号 3480 0626 2026 のバーコード" : "Barcode for member number 3480 0626 2026"}
              className="mx-auto h-24 w-full max-w-[260px] rounded bg-[repeating-linear-gradient(90deg,#111_0_2px,transparent_2px_4px,#111_4px_7px,transparent_7px_10px,#111_10px_11px,transparent_11px_14px)] dark:bg-[repeating-linear-gradient(90deg,#f8fafc_0_2px,transparent_2px_4px,#f8fafc_4px_7px,transparent_7px_10px,#f8fafc_10px_11px,transparent_11px_14px)]"
            />
            <p className="font-mono text-sm tracking-widest text-foreground">3480 0626 2026</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBarcodeOpen(false)}>
              {locale === "ja" ? "閉じる" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LoyaltySummaryCardDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/loyalty-summary-card", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.loyaltySummaryCard.title ?? "LoyaltySummaryCard";
  const description = content?.description ?? metadata.loyaltySummaryCard.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LoyaltySummaryCard,
} from "@gunjo/ui";

export function MemberSummary() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [barcodeOpen, setBarcodeOpen] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="flex w-full max-w-md flex-col gap-4">
      <LoyaltySummaryCard
        tone="brand"
        meta="ハッピーズドラッグ メンバーズ"
        tier={<Badge variant="outline" className="border-primary-strong-foreground/45 text-primary-strong-foreground">ゴールド会員</Badge>}
        balanceLabel="ポイント残高"
        balance="3,480"
        unit="P"
        secondary={[{ label: "当年購入額", value: "¥86,200" }, { label: "クーポン", value: "3枚" }]}
        progress={{ value: 86200, max: 100000, label: "プラチナ会員まで あと ¥13,800", caption: "¥86,200 / ¥100,000" }}
        alert="200 P が 2026/06/30 に失効予定です"
        action={<Button size="lg" variant="secondary" className="w-full" onClick={() => setBarcodeOpen(true)}>会員バーコードを表示</Button>}
      />
      <Dialog open={barcodeOpen} onOpenChange={setBarcodeOpen} modal={false}>
        <DialogContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel="閉じる" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>会員バーコード</DialogTitle>
            <DialogDescription>レジでこのコードを提示します。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 rounded-lg border bg-card p-4 text-center">
            <p className="text-sm font-medium text-foreground">ハッピーズドラッグ メンバーズ</p>
            <div className="mx-auto h-24 w-full max-w-[260px] rounded bg-[repeating-linear-gradient(90deg,#111_0_2px,transparent_2px_4px,#111_4px_7px,transparent_7px_10px,#111_10px_11px,transparent_11px_14px)]" />
            <p className="font-mono text-sm tracking-widest text-foreground">3480 0626 2026</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBarcodeOpen(false)}>閉じる</Button>
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LoyaltySummaryCard,
} from "@gunjo/ui";

export function MemberSummary() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [barcodeOpen, setBarcodeOpen] = React.useState(false);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="flex w-full max-w-md flex-col gap-4">
      <LoyaltySummaryCard
        tone="brand"
        meta="Happy's Drug Members"
        tier={<Badge variant="outline" className="border-primary-strong-foreground/45 text-primary-strong-foreground">Gold member</Badge>}
        balanceLabel="Point balance"
        balance="3,480"
        unit="P"
        secondary={[{ label: "Annual spend", value: "¥86,200" }, { label: "Coupons", value: "3" }]}
        progress={{ value: 86200, max: 100000, label: "JPY 13,800 to Platinum", caption: "¥86,200 / ¥100,000" }}
        alert="200 P expire on 2026-06-30"
        action={<Button size="lg" variant="secondary" className="w-full" onClick={() => setBarcodeOpen(true)}>Show member barcode</Button>}
      />
      <Dialog open={barcodeOpen} onOpenChange={setBarcodeOpen} modal={false}>
        <DialogContent portalContainer={portalContainer} overlayClassName="rounded-md" closeLabel="Close" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Member barcode</DialogTitle>
            <DialogDescription>Present this code at checkout.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 rounded-lg border bg-card p-4 text-center">
            <p className="text-sm font-medium text-foreground">Happy's Drug Members</p>
            <div className="mx-auto h-24 w-full max-w-[260px] rounded bg-[repeating-linear-gradient(90deg,#111_0_2px,transparent_2px_4px,#111_4px_7px,transparent_7px_10px,#111_10px_11px,transparent_11px_14px)]" />
            <p className="font-mono text-sm tracking-widest text-foreground">3480 0626 2026</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBarcodeOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

  const defaultToneCode = usageCode
    .replace('tone="brand"', 'tone="default"')
    .replace('tier={<Badge variant="outline" className="border-primary-strong-foreground/45 text-primary-strong-foreground">', 'tier={<Badge variant="secondary">')
    .replace('action={<Button size="lg" variant="secondary"', 'action={<Button size="lg" variant="default"');
  const withoutAlertCode = usageCode.replace(/\n        alert="[^"]+"/, "");

  const propsData = [
    { name: "balance", type: "ReactNode", description: locale === "ja" ? "大きく表示する残高です。" : "Hero balance value." },
    { name: "balanceLabel", type: "ReactNode", description: locale === "ja" ? "残高の上の小ラベルです。" : "Small label above the balance." },
    { name: "unit", type: "ReactNode", description: locale === "ja" ? "P、マイル、円などの単位です。" : "Unit such as P, miles, or yen." },
    { name: "meta", type: "ReactNode", description: locale === "ja" ? "プログラム名、会員名、番号などです。" : "Program name, member name, or number." },
    { name: "tier", type: "ReactNode", description: locale === "ja" ? "会員ランク Badge などです。" : "Tier badge or rank node." },
    { name: "secondary", type: "{ label, value }[]", description: locale === "ja" ? "残高下に並べる副次値です。" : "Secondary values under the hero balance." },
    { name: "progress", type: "{ value, max, label?, caption? }", description: locale === "ja" ? "次ランクまでの進捗です。高いほど良い値として扱います。" : "Progress to the next tier. Higher is better." },
    { name: "alert", type: "ReactNode", description: locale === "ja" ? "失効予定などの注意行です。" : "Alert line such as expiring points." },
    { name: "action", type: "ReactNode", description: locale === "ja" ? "会員バーコード表示などの主操作です。" : "Primary action such as showing a member barcode." },
    { name: "tone", type: '"brand" | "default"', default: '"brand"', description: locale === "ja" ? "brand は塗りつぶしヒーロー、default は通常カードです。" : "brand is a filled hero; default is a plain card." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "LoyaltySummaryCard", href: "/docs/components/loyalty-summary-card" },
        { name: "Button", href: "/docs/components/button" },
        { name: "Badge", href: "/docs/components/badge" },
      ]}
      relatedComponents={[
        { name: "StatGroup", href: "/docs/components/stat-group" },
        { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <LoyaltyPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "brand",
              title: locale === "ja" ? "ブランド面" : "Brand surface",
              description: locale === "ja" ? "既定の brand は塗りつぶしの会員カードです。" : "The default brand tone renders a filled member-card hero.",
              preview: <LoyaltyPreview locale={locale} tone="brand" />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "default",
              title: locale === "ja" ? "通常カード" : "Default card",
              description: locale === "ja" ? "周囲が強い画面では tone=\"default\" を使います。" : "Use tone=\"default\" when the surrounding surface is already visually strong.",
              preview: <LoyaltyPreview locale={locale} tone="default" />,
              code: defaultToneCode,
              previewBodyWidth: "md",
            },
            {
              key: "without-alert",
              title: locale === "ja" ? "警告なし" : "Without alert",
              description: locale === "ja" ? "失効予定がない場合は alert を省略します。" : "Omit alert when nothing requires attention.",
              preview: <LoyaltyPreview locale={locale} noAlert />,
              code: withoutAlertCode,
              previewBodyWidth: "md",
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
