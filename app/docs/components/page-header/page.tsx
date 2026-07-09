"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconRefresh, IconSettings, IconX } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import { Badge, PageHeader, Toast, TooltipButton } from "@gunjo/ui";

type Locale = "ja" | "en";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background shadow-sm">
      {children}
    </div>
  );
}

function PageHeaderPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "center" | "leading" }) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const copy = locale === "ja"
    ? {
        title: "手荷物追跡",
        subtitle: "ヤマダ クロウ 様・ABC123",
        back: "戻る",
        refresh: "更新",
        close: "閉じる",
        settings: "設定を開く",
        centeredTitle: "予約の確認",
        centeredSubtitle: "2名 / 7月18日",
        leadingTitle: "公開リンク",
        leadingSubtitle: "チームページに表示中",
        badge: "公開中",
        closeToast: "予約確認を閉じました。",
        refreshToast: "追跡情報を更新しました。",
        backToast: "一覧へ戻りました。",
        settingsToast: "公開リンク設定を開きました。",
        route: "現在地",
        routeValue: "中部国際空港 第1ターミナル",
        status: "配送状態",
        statusValue: "搭載待ち",
        reservation: "予約番号",
        reservationValue: "RK-718-02",
        linkScope: "公開範囲",
        linkScopeValue: "リンクを知っているチームメンバー",
      }
    : {
        title: "Baggage tracking",
        subtitle: "Kuro Yamada / ABC123",
        back: "Back",
        refresh: "Refresh",
        close: "Close",
        settings: "Open settings",
        centeredTitle: "Reservation review",
        centeredSubtitle: "2 guests / Jul 18",
        leadingTitle: "Public link",
        leadingSubtitle: "Visible on team page",
        badge: "Live",
        closeToast: "Closed reservation review.",
        refreshToast: "Tracking information refreshed.",
        backToast: "Returned to the list.",
        settingsToast: "Opened public link settings.",
        route: "Current location",
        routeValue: "Chubu Centrair Terminal 1",
        status: "Delivery status",
        statusValue: "Awaiting loading",
        reservation: "Reservation",
        reservationValue: "RK-718-02",
        linkScope: "Link scope",
        linkScopeValue: "Team members with the link",
      };
  const toast = toastMessage ? (
    <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
      <Toast
        message={toastMessage}
        type="success"
        isVisible
        placement="inline"
        closeLabel={copy.close}
        onClose={() => setToastMessage(null)}
        className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
      />
    </div>
  ) : null;

  if (mode === "center") {
    return (
      <PhoneFrame>
        {toast}
        <PageHeader
          title={copy.centeredTitle}
          subtitle={copy.centeredSubtitle}
          align="center"
          sticky={false}
          backLabel={copy.back}
          onBack={() => setToastMessage(copy.backToast)}
          actions={
            <TooltipButton type="button" variant="ghost" size="icon" aria-label={copy.close} tooltip={copy.close} onClick={() => setToastMessage(copy.closeToast)}>
              <IconX className="size-5" aria-hidden="true" />
            </TooltipButton>
          }
        />
        <div className="space-y-3 p-4">
          <div className="rounded-lg border bg-card p-3 text-sm">
            <span className="text-muted-foreground">{copy.reservation}</span>
            <span className="mt-1 block font-medium text-foreground">{copy.reservationValue}</span>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (mode === "leading") {
    return (
      <PhoneFrame>
        {toast}
        <PageHeader
          title={copy.leadingTitle}
          subtitle={copy.leadingSubtitle}
          sticky={false}
          leading={<Badge variant="success">{copy.badge}</Badge>}
          actions={
            <TooltipButton type="button" variant="ghost" size="icon" aria-label={copy.settings} tooltip={copy.settings} onClick={() => setToastMessage(copy.settingsToast)}>
              <IconSettings className="size-5" aria-hidden="true" />
            </TooltipButton>
          }
        />
        <div className="space-y-3 p-4">
          <div className="rounded-lg border bg-card p-3 text-sm">
            <span className="text-muted-foreground">{copy.linkScope}</span>
            <span className="mt-1 block font-medium text-foreground">{copy.linkScopeValue}</span>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      {toast}
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        backLabel={copy.back}
        onBack={() => setToastMessage(copy.backToast)}
        actions={
          <TooltipButton type="button" variant="ghost" size="icon" aria-label={copy.refresh} tooltip={copy.refresh} onClick={() => setToastMessage(copy.refreshToast)}>
            <IconRefresh className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">{copy.route}</span>
          <span className="mt-1 block font-medium text-foreground">{copy.routeValue}</span>
        </div>
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">{copy.status}</span>
          <span className="mt-1 block font-medium text-foreground">{copy.statusValue}</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default function PageHeaderDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/page-header", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.pageHeader.title ?? "PageHeader";
  const description = content?.description ?? metadata.pageHeader.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { PageHeader, Toast, TooltipButton } from "@gunjo/ui";
import { IconRefresh } from "@tabler/icons-react";

export function BaggageHeader() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="閉じる"
            onClose={() => setToastMessage(null)}
            className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
          />
        </div>
      ) : null}
      <PageHeader
        title="手荷物追跡"
        subtitle="ヤマダ クロウ 様・ABC123"
        backLabel="戻る"
        onBack={() => setToastMessage("一覧へ戻りました。")}
        actions={
          <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            aria-label="更新"
            tooltip="更新"
            onClick={() => setToastMessage("追跡情報を更新しました。")}
          >
            <IconRefresh className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">現在地</span>
          <span className="mt-1 block font-medium text-foreground">中部国際空港 第1ターミナル</span>
        </div>
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">配送状態</span>
          <span className="mt-1 block font-medium text-foreground">搭載待ち</span>
        </div>
      </div>
    </div>
  );
}`
    : `import * as React from "react";
import { PageHeader, Toast, TooltipButton } from "@gunjo/ui";
import { IconRefresh } from "@tabler/icons-react";

export function BaggageHeader() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="Close"
            onClose={() => setToastMessage(null)}
            className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
          />
        </div>
      ) : null}
      <PageHeader
        title="Baggage tracking"
        subtitle="Kuro Yamada / ABC123"
        backLabel="Back"
        onBack={() => setToastMessage("Returned to the list.")}
        actions={
          <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Refresh"
            tooltip="Refresh"
            onClick={() => setToastMessage("Tracking information refreshed.")}
          >
            <IconRefresh className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">Current location</span>
          <span className="mt-1 block font-medium text-foreground">Chubu Centrair Terminal 1</span>
        </div>
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">Delivery status</span>
          <span className="mt-1 block font-medium text-foreground">Awaiting loading</span>
        </div>
      </div>
    </div>
  );
}`;

  const centerStateCode = locale === "ja"
    ? `import * as React from "react";
import { PageHeader, Toast, TooltipButton } from "@gunjo/ui";
import { IconX } from "@tabler/icons-react";

export function ReservationReviewHeader() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="閉じる"
            onClose={() => setToastMessage(null)}
            className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
          />
        </div>
      ) : null}
      <PageHeader
        title="予約の確認"
        subtitle="2名 / 7月18日"
        align="center"
        sticky={false}
        backLabel="戻る"
        onBack={() => setToastMessage("一覧へ戻りました。")}
        actions={
          <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            aria-label="閉じる"
            tooltip="閉じる"
            onClick={() => setToastMessage("予約確認を閉じました。")}
          >
            <IconX className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">予約番号</span>
          <span className="mt-1 block font-medium text-foreground">RK-718-02</span>
        </div>
      </div>
    </div>
  );
}`
    : `import * as React from "react";
import { PageHeader, Toast, TooltipButton } from "@gunjo/ui";
import { IconX } from "@tabler/icons-react";

export function ReservationReviewHeader() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="Close"
            onClose={() => setToastMessage(null)}
            className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
          />
        </div>
      ) : null}
      <PageHeader
        title="Reservation review"
        subtitle="2 guests / Jul 18"
        align="center"
        sticky={false}
        backLabel="Back"
        onBack={() => setToastMessage("Returned to the list.")}
        actions={
          <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close"
            tooltip="Close"
            onClick={() => setToastMessage("Closed reservation review.")}
          >
            <IconX className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">Reservation</span>
          <span className="mt-1 block font-medium text-foreground">RK-718-02</span>
        </div>
      </div>
    </div>
  );
}`;

  const leadingStateCode = locale === "ja"
    ? `import * as React from "react";
import { Badge, PageHeader, Toast, TooltipButton } from "@gunjo/ui";
import { IconSettings } from "@tabler/icons-react";

export function PublicLinkHeader() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="閉じる"
            onClose={() => setToastMessage(null)}
            className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
          />
        </div>
      ) : null}
      <PageHeader
        title="公開リンク"
        subtitle="チームページに表示中"
        sticky={false}
        leading={<Badge variant="success">公開中</Badge>}
        actions={
          <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            aria-label="設定を開く"
            tooltip="設定を開く"
            onClick={() => setToastMessage("公開リンク設定を開きました。")}
          >
            <IconSettings className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">公開範囲</span>
          <span className="mt-1 block font-medium text-foreground">リンクを知っているチームメンバー</span>
        </div>
      </div>
    </div>
  );
}`
    : `import * as React from "react";
import { Badge, PageHeader, Toast, TooltipButton } from "@gunjo/ui";
import { IconSettings } from "@tabler/icons-react";

export function PublicLinkHeader() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-16 z-[100] w-[min(320px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="Close"
            onClose={() => setToastMessage(null)}
            className="!w-full !max-w-full sm:!w-full sm:!max-w-full"
          />
        </div>
      ) : null}
      <PageHeader
        title="Public link"
        subtitle="Visible on team page"
        sticky={false}
        leading={<Badge variant="success">Live</Badge>}
        actions={
          <TooltipButton
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open settings"
            tooltip="Open settings"
            onClick={() => setToastMessage("Opened public link settings.")}
          >
            <IconSettings className="size-5" aria-hidden="true" />
          </TooltipButton>
        }
      />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-muted-foreground">Link scope</span>
          <span className="mt-1 block font-medium text-foreground">Team members with the link</span>
        </div>
      </div>
    </div>
  );
}`;

  const propsData = [
    { name: "title", type: "ReactNode", description: locale === "ja" ? "ページタイトルです。" : "Page title." },
    { name: "subtitle", type: "ReactNode", description: locale === "ja" ? "タイトル下の補足行です。" : "Optional secondary line under the title." },
    { name: "onBack", type: "() => void", description: locale === "ja" ? "戻るボタンを表示するハンドラです。44px以上のタッチ領域を持ちます。" : "Renders the back button with a touch target of at least 44px." },
    { name: "backLabel", type: "string", default: '"戻る"', description: locale === "ja" ? "戻るボタンの aria-label と tooltip 文言です。" : "ARIA label and tooltip copy for the back button." },
    { name: "leading", type: "ReactNode", description: locale === "ja" ? "戻るボタンと同じ先頭スロットに追加で置く要素です。" : "Extra leading content rendered alongside the back button when both are provided." },
    { name: "actions", type: "ReactNode", description: locale === "ja" ? "末尾の操作です。アイコン操作は TooltipButton で説明します。" : "Trailing actions. Icon actions should use TooltipButton." },
    { name: "sticky", type: "boolean", default: "true", description: locale === "ja" ? "スクロールコンテナ上部に固定します。" : "Sticks to the top of the scroll container." },
    { name: "align", type: '"left" | "center"', default: '"left"', description: locale === "ja" ? "タイトルを左寄せまたは中央寄せにします。" : "Aligns the title left or center." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "PageHeader", href: "/docs/components/page-header" }, { name: "TooltipButton", href: "/docs/components/tooltip-button" }]}
      relatedComponents={[{ name: "Header", href: "/docs/components/header" }, { name: "NavRow", href: "/docs/components/nav-row" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <PageHeaderPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "default",
              title: locale === "ja" ? "左寄せヘッダー" : "Left-aligned header",
              description: locale === "ja" ? "既定は左寄せで、戻ると末尾アクションを同じ行に配置します。" : "The default header is left-aligned with back and trailing actions on one row.",
              preview: <PageHeaderPreview locale={locale} />,
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "center",
              title: locale === "ja" ? "中央タイトル" : "Centered title",
              description: locale === "ja" ? "align=\"center\" はモバイル予約確認のような画面で使います。" : "Use align=\"center\" for mobile confirmation-style screens.",
              preview: <PageHeaderPreview locale={locale} mode="center" />,
              code: centerStateCode,
              previewBodyWidth: "md",
            },
            {
              key: "leading",
              title: locale === "ja" ? "先頭スロット" : "Leading slot",
              description: locale === "ja" ? "leading には状態バッジやロゴを置けます。戻ると同時に指定した場合も両方表示します。" : "leading can hold status badges or logos, and it renders alongside the back button when both are provided.",
              preview: <PageHeaderPreview locale={locale} mode="leading" />,
              code: leadingStateCode,
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
