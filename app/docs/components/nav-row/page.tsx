"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconCreditCard, IconMail, IconShieldCheck } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, NavRow, SettingGroup, Switch } from "@gunjo/ui";

type Locale = "ja" | "en";

function NavRowPreview({ locale, mode = "grouped" }: { locale: Locale; mode?: "grouped" | "control" | "static" }) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [pushOn, setPushOn] = React.useState(true);
  const [detail, setDetail] = React.useState<"payment" | "invoice" | null>(null);
  const copy = locale === "ja"
    ? {
        billing: "お支払い",
        payment: "お支払い方法",
        paymentValue: "口座振替",
        invoice: "請求書の送付方法",
        invoiceDesc: "毎月の請求書をどう受け取るか",
        invoiceValue: "Web（メール通知）",
        security: "通知・セキュリティ",
        push: "配達前プッシュ通知",
        pushDesc: "お届け予定をプッシュでお知らせ",
        mfa: "二段階認証",
        enabled: "有効",
        close: "閉じる",
        paymentDetail: "登録済みの口座振替を確認し、必要に応じて変更申請へ進みます。",
        invoiceDetail: "毎月の請求書はメール通知つきの Web 配信で送付されます。",
        edit: "変更する",
      }
    : {
        billing: "Billing",
        payment: "Payment method",
        paymentValue: "Bank transfer",
        invoice: "Invoice delivery",
        invoiceDesc: "How monthly invoices are delivered",
        invoiceValue: "Web with email",
        security: "Notifications and security",
        push: "Pre-delivery push",
        pushDesc: "Notify me before delivery",
        mfa: "Two-factor authentication",
        enabled: "Enabled",
        close: "Close",
        paymentDetail: "Review the registered bank transfer method and start a change request when needed.",
        invoiceDetail: "Monthly invoices are delivered on the web with email notifications.",
        edit: "Change",
      };

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  const detailContent = detail === "invoice"
    ? { title: copy.invoice, value: copy.invoiceValue, description: copy.invoiceDetail }
    : { title: copy.payment, value: copy.paymentValue, description: copy.paymentDetail };

  if (mode === "control") {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <SettingGroup label={copy.security}>
          <NavRow
            icon={<IconMail className="size-5" />}
            label={copy.push}
            description={copy.pushDesc}
            trailing={<Switch checked={pushOn} onCheckedChange={setPushOn} aria-label={copy.push} />}
          />
        </SettingGroup>
      </div>
    );
  }

  if (mode === "static") {
    return (
      <div className="w-full max-w-sm">
        <SettingGroup label={copy.security}>
          <NavRow
            icon={<IconShieldCheck className="size-5" />}
            label={copy.mfa}
            description={locale === "ja" ? "アカウント保護の状態" : "Account protection status"}
            value={locale === "ja" ? "必須" : "Required"}
            trailing={<Badge variant="success">{copy.enabled}</Badge>}
          />
        </SettingGroup>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative flex w-full max-w-sm flex-col gap-4">
      <SettingGroup label={copy.billing}>
        <NavRow
          icon={<IconCreditCard className="size-5" />}
          label={copy.payment}
          value={copy.paymentValue}
          opensDialog
          onSelect={() => setDetail("payment")}
        />
        <NavRow
          icon={<IconMail className="size-5" />}
          label={copy.invoice}
          description={copy.invoiceDesc}
          value={copy.invoiceValue}
          opensDialog
          onSelect={() => setDetail("invoice")}
        />
      </SettingGroup>
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)} modal={false}>
        <DialogContent portalContainer={portalContainer} closeLabel={copy.close} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{detailContent.title}</DialogTitle>
            <DialogDescription>{detailContent.description}</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{locale === "ja" ? "現在値" : "Current value"}</span>
            <span className="mt-1 block font-medium text-foreground">{detailContent.value}</span>
          </div>
          <DialogFooter>
            <Button type="button" size="sm">{copy.edit}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NavRowDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/nav-row", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.navRow.title ?? "NavRow";
  const description = content?.description ?? metadata.navRow.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  NavRow,
  SettingGroup,
} from "@gunjo/ui";
import { IconCreditCard, IconMail } from "@tabler/icons-react";

export function BillingRows() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [detail, setDetail] = React.useState<"payment" | "invoice" | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  const detailContent = detail === "invoice"
    ? {
        title: "請求書の送付方法",
        value: "Web（メール通知）",
        description: "毎月の請求書はメール通知つきの Web 配信で送付されます。",
      }
    : {
        title: "お支払い方法",
        value: "口座振替",
        description: "登録済みの口座振替を確認し、必要に応じて変更申請へ進みます。",
      };

  return (
    <div ref={rootRef} className="relative flex w-full max-w-sm flex-col gap-4">
      <SettingGroup label="お支払い">
        <NavRow
          icon={<IconCreditCard className="size-5" />}
          label="お支払い方法"
          value="口座振替"
          opensDialog
          onSelect={() => setDetail("payment")}
        />
        <NavRow
          icon={<IconMail className="size-5" />}
          label="請求書の送付方法"
          description="毎月の請求書をどう受け取るか"
          value="Web（メール通知）"
          opensDialog
          onSelect={() => setDetail("invoice")}
        />
      </SettingGroup>
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)} modal={false}>
        <DialogContent portalContainer={portalContainer} closeLabel="閉じる" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{detailContent.title}</DialogTitle>
            <DialogDescription>{detailContent.description}</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">現在値</span>
            <span className="mt-1 block font-medium text-foreground">{detailContent.value}</span>
          </div>
          <DialogFooter>
            <Button type="button" size="sm">変更する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`
    : `import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  NavRow,
  SettingGroup,
} from "@gunjo/ui";
import { IconCreditCard, IconMail } from "@tabler/icons-react";

export function BillingRows() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [detail, setDetail] = React.useState<"payment" | "invoice" | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  const detailContent = detail === "invoice"
    ? {
        title: "Invoice delivery",
        value: "Web with email",
        description: "Monthly invoices are delivered on the web with email notifications.",
      }
    : {
        title: "Payment method",
        value: "Bank transfer",
        description: "Review the registered bank transfer method and start a change request when needed.",
      };

  return (
    <div ref={rootRef} className="relative flex w-full max-w-sm flex-col gap-4">
      <SettingGroup label="Billing">
        <NavRow
          icon={<IconCreditCard className="size-5" />}
          label="Payment method"
          value="Bank transfer"
          opensDialog
          onSelect={() => setDetail("payment")}
        />
        <NavRow
          icon={<IconMail className="size-5" />}
          label="Invoice delivery"
          description="How monthly invoices are delivered"
          value="Web with email"
          opensDialog
          onSelect={() => setDetail("invoice")}
        />
      </SettingGroup>
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)} modal={false}>
        <DialogContent portalContainer={portalContainer} closeLabel="Close" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{detailContent.title}</DialogTitle>
            <DialogDescription>{detailContent.description}</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Current value</span>
            <span className="mt-1 block font-medium text-foreground">{detailContent.value}</span>
          </div>
          <DialogFooter>
            <Button type="button" size="sm">Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

  const controlStateCode = locale === "ja"
    ? `import * as React from "react";
import { NavRow, SettingGroup, Switch } from "@gunjo/ui";
import { IconMail } from "@tabler/icons-react";

export function NotificationRow() {
  const [pushOn, setPushOn] = React.useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <SettingGroup label="通知・セキュリティ">
        <NavRow
          icon={<IconMail className="size-5" />}
          label="配達前プッシュ通知"
          description="お届け予定をプッシュでお知らせ"
          trailing={<Switch checked={pushOn} onCheckedChange={setPushOn} aria-label="配達前プッシュ通知" />}
        />
      </SettingGroup>
    </div>
  );
}`
    : `import * as React from "react";
import { NavRow, SettingGroup, Switch } from "@gunjo/ui";
import { IconMail } from "@tabler/icons-react";

export function NotificationRow() {
  const [pushOn, setPushOn] = React.useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <SettingGroup label="Notifications and security">
        <NavRow
          icon={<IconMail className="size-5" />}
          label="Pre-delivery push"
          description="Notify me before delivery"
          trailing={<Switch checked={pushOn} onCheckedChange={setPushOn} aria-label="Pre-delivery push" />}
        />
      </SettingGroup>
    </div>
  );
}`;

  const staticStateCode = locale === "ja"
    ? `import { Badge, NavRow, SettingGroup } from "@gunjo/ui";
import { IconShieldCheck } from "@tabler/icons-react";

export function SecurityStatusRow() {
  return (
    <div className="w-full max-w-sm">
      <SettingGroup label="通知・セキュリティ">
        <NavRow
          icon={<IconShieldCheck className="size-5" />}
          label="二段階認証"
          description="アカウント保護の状態"
          value="必須"
          trailing={<Badge variant="success">有効</Badge>}
        />
      </SettingGroup>
    </div>
  );
}`
    : `import { Badge, NavRow, SettingGroup } from "@gunjo/ui";
import { IconShieldCheck } from "@tabler/icons-react";

export function SecurityStatusRow() {
  return (
    <div className="w-full max-w-sm">
      <SettingGroup label="Notifications and security">
        <NavRow
          icon={<IconShieldCheck className="size-5" />}
          label="Two-factor authentication"
          description="Account protection status"
          value="Required"
          trailing={<Badge variant="success">Enabled</Badge>}
        />
      </SettingGroup>
    </div>
  );
}`;

  const propsData = [
    { name: "label", type: "ReactNode", description: locale === "ja" ? "主ラベルです。" : "Primary row label." },
    { name: "icon", type: "ReactNode", description: locale === "ja" ? "先頭に置くアイコンです。" : "Optional leading icon." },
    { name: "description", type: "ReactNode", description: locale === "ja" ? "ラベル下の補足行です。" : "Secondary line under the label." },
    { name: "value", type: "ReactNode", description: locale === "ja" ? "右寄せで表示する現在値です。" : "Right-aligned current value." },
    { name: "trailing", type: "ReactNode", description: locale === "ja" ? "末尾アクセサリです。未指定で onSelect がある場合は chevron を出します。" : "Trailing accessory. Defaults to a chevron when onSelect is provided." },
    { name: "opensDialog", type: "boolean", description: locale === "ja" ? "行が詳細ダイアログやシートを開く場合に aria-haspopup=\"dialog\" を付けます。" : "Adds aria-haspopup=\"dialog\" when the row opens an in-place detail." },
    { name: "onSelect", type: "() => void", description: locale === "ja" ? "行全体をナビゲーション/開示ボタンにします。トグルではないため aria-pressed は使いません。" : "Makes the whole row a navigation or disclosure button, not a pressed toggle." },
    { name: "SettingGroup.label", type: "ReactNode", description: locale === "ja" ? "グループ見出しです。" : "Optional group heading." },
    { name: "SettingGroup.children", type: "ReactNode", description: locale === "ja" ? "丸角コンテナ内に配置する NavRow 群です。" : "Rows rendered inside one rounded, divided container." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "NavRow", href: "/docs/components/nav-row" },
        { name: "SettingGroup", href: "/docs/components/nav-row" },
        { name: "Switch", href: "/docs/components/switch" },
      ]}
      relatedComponents={[
        { name: "ListCard", href: "/docs/components/list-card" },
        { name: "PageHeader", href: "/docs/components/page-header" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <NavRowPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "navigation",
              title: locale === "ja" ? "ナビゲーション行" : "Navigation row",
              description: locale === "ja" ? "onSelect を渡すと行全体が詳細へ進むボタンになり、既定で chevron が付きます。" : "Passing onSelect makes the full row a disclosure button with the default chevron.",
              preview: <NavRowPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "control",
              title: locale === "ja" ? "操作行" : "Control row",
              description: locale === "ja" ? "trailing に Switch などを渡す場合、行自体はボタンにせず操作対象を分けます。" : "When trailing holds a Switch, the row itself stays static and the control owns interaction.",
              preview: <NavRowPreview locale={locale} mode="control" />,
              code: controlStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "static",
              title: locale === "ja" ? "状態表示" : "Static status",
              description: locale === "ja" ? "Badge や値だけを見せる読み取り行にも使えます。" : "Use it as a read-only status row with values or badges.",
              preview: <NavRowPreview locale={locale} mode="static" />,
              code: staticStateCode,
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
