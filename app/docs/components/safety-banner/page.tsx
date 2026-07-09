"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
  CodeCopyButton,
  ComponentLayout,
  ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import feedbackMetadata from "@design/feedback-metadata.json";
import { Button, SafetyBanner, Toast, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

type Locale = "ja" | "en";

function SafetyBannerPreview({ locale, mode = "destructive" }: { locale: Locale; mode?: "destructive" | "warning" | "info" | "acked" }) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [acked, setAcked] = React.useState(mode === "acked");
  const [signed, setSigned] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const reason = locale === "ja" ? "安全確認にチェックすると署名できます。" : "Acknowledge the safety notice before signing.";

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  React.useEffect(() => {
    setAcked(mode === "acked");
    setSigned(false);
    setToastMessage(null);
  }, [locale, mode]);

  const tone = mode === "warning" ? "warning" : mode === "info" ? "info" : "destructive";
  const copy = locale === "ja"
    ? {
        title: mode === "warning" ? "投与量を再確認" : mode === "info" ? "情報共有：検査結果待ち" : "アレルギー警告：ペニシリン",
        body: mode === "warning" ? "前回投与からの間隔が短いため、投与量と時間を確認してください。" : mode === "info" ? "最終判断前に検査結果の更新を確認してください。" : "処方薬「アモキシシリン」は患者のアレルギーに該当します。投与は禁忌です。",
        ack: "確認しました",
        acked: "確認済み",
        sign: "処方を署名",
        signed: "署名済み",
        close: "閉じる",
        signedToast: "処方を署名しました。",
        warningAction: "確認記録を残す",
        warningToast: "投与量の確認記録を保存しました。",
        infoAction: "検査結果を開く",
        infoToast: "検査結果の詳細を開きました。",
      }
    : {
        title: mode === "warning" ? "Recheck dosage" : mode === "info" ? "Information: lab result pending" : "Allergy warning: penicillin",
        body: mode === "warning" ? "The interval from the previous dose is short. Confirm dosage and timing." : mode === "info" ? "Check the latest lab result before making a final decision." : "The prescribed amoxicillin matches the patient's allergy record and is contraindicated.",
        ack: "Acknowledge",
        acked: "Acknowledged",
        sign: "Sign prescription",
        signed: "Signed",
        close: "Close",
        signedToast: "Prescription signed.",
        warningAction: "Save review note",
        warningToast: "Saved the dosage review note.",
        infoAction: "Open lab result",
        infoToast: "Opened the lab result detail.",
      };

  const signButton = signed ? (
    <span className="inline-flex min-h-9 w-fit items-center rounded-md border border-success-border bg-success-subtle px-3 text-sm font-medium text-success-subtle-foreground">
      {copy.signed}
    </span>
  ) : (
    <Button disabled={!acked} variant={acked ? "default" : "secondary"} onClick={() => {
      setSigned(true);
      setToastMessage(copy.signedToast);
    }}>
      {copy.sign}
    </Button>
  );

  const quickAction = mode === "warning" || mode === "info" ? (
    <Button
      variant="secondary"
      onClick={() => setToastMessage(mode === "warning" ? copy.warningToast : copy.infoToast)}
    >
      {mode === "warning" ? copy.warningAction : copy.infoAction}
    </Button>
  ) : null;

  return (
    <div ref={rootRef} className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type={mode === "info" ? "info" : "success"}
            isVisible
            placement="inline"
            closeLabel={copy.close}
            onClose={() => setToastMessage(null)}
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <SafetyBanner
        tone={tone}
        title={copy.title}
        requireAck={mode === "destructive" || mode === "acked"}
        acknowledged={acked}
        onAcknowledge={() => setAcked(true)}
        ackLabel={copy.ack}
        acknowledgedLabel={copy.acked}
      >
        {copy.body}
      </SafetyBanner>
      {quickAction ?? (!acked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex w-fit" tabIndex={0} aria-label={reason}>
              {signButton}
            </span>
          </TooltipTrigger>
          <TooltipContent>{reason}</TooltipContent>
        </Tooltip>
      ) : (
        signButton
      ))}
    </div>
  );
}

export default function SafetyBannerDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/safety-banner", locale);
  const metadata = feedbackMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.safetyBanner.title ?? "SafetyBanner";
  const description = content?.description ?? metadata.safetyBanner.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
import { Button, SafetyBanner, Toast, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function PrescriptionGate() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [acked, setAcked] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="閉じる"
            onClose={() => setToastMessage(null)}
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <SafetyBanner tone="destructive" title="アレルギー警告：ペニシリン" requireAck acknowledged={acked} onAcknowledge={() => setAcked(true)}>
        処方薬「アモキシシリン」は患者のアレルギーに該当します。投与は禁忌です。
      </SafetyBanner>
      {!acked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex w-fit" tabIndex={0} aria-label="安全確認にチェックすると署名できます。">
              <Button disabled variant="secondary">処方を署名</Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>安全確認にチェックすると署名できます。</TooltipContent>
        </Tooltip>
      ) : signed ? (
        <span className="inline-flex min-h-9 w-fit items-center rounded-md border border-success-border bg-success-subtle px-3 text-sm font-medium text-success-subtle-foreground">
          署名済み
        </span>
      ) : (
        <Button onClick={() => {
          setSigned(true);
          setToastMessage("処方を署名しました。");
        }}>
          処方を署名
        </Button>
      )}
    </div>
  );
}`
    : `import * as React from "react";
import { Button, SafetyBanner, Toast, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export function PrescriptionGate() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const [acked, setAcked] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPortalContainer(rootRef.current?.closest<HTMLElement>("[data-doc-component-preview-surface]") ?? rootRef.current);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast
            message={toastMessage}
            type="success"
            isVisible
            placement="inline"
            closeLabel="Close"
            onClose={() => setToastMessage(null)}
            tooltipPortalContainer={portalContainer}
          />
        </div>
      ) : null}
      <SafetyBanner tone="destructive" title="Allergy warning: penicillin" requireAck acknowledged={acked} onAcknowledge={() => setAcked(true)} ackLabel="Acknowledge" acknowledgedLabel="Acknowledged">
        The prescribed amoxicillin matches the patient's allergy record and is contraindicated.
      </SafetyBanner>
      {!acked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex w-fit" tabIndex={0} aria-label="Acknowledge the safety notice before signing.">
              <Button disabled variant="secondary">Sign prescription</Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Acknowledge the safety notice before signing.</TooltipContent>
        </Tooltip>
      ) : signed ? (
        <span className="inline-flex min-h-9 w-fit items-center rounded-md border border-success-border bg-success-subtle px-3 text-sm font-medium text-success-subtle-foreground">
          Signed
        </span>
      ) : (
        <Button onClick={() => {
          setSigned(true);
          setToastMessage("Prescription signed.");
        }}>
          Sign prescription
        </Button>
      )}
    </div>
  );
}`;

  const acknowledgedCode = locale === "ja"
    ? usageCode.replace("const [acked, setAcked] = React.useState(false);", "const [acked, setAcked] = React.useState(true);")
    : usageCode.replace("const [acked, setAcked] = React.useState(false);", "const [acked, setAcked] = React.useState(true);");

  const warningCode = locale === "ja"
    ? `import * as React from "react";
import { Button, SafetyBanner, Toast } from "@gunjo/ui";

export function DosageReviewBanner() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast message={toastMessage} type="success" isVisible placement="inline" closeLabel="閉じる" onClose={() => setToastMessage(null)} />
        </div>
      ) : null}
      <SafetyBanner tone="warning" title="投与量を再確認">
        前回投与からの間隔が短いため、投与量と時間を確認してください。
      </SafetyBanner>
      <Button variant="secondary" onClick={() => setToastMessage("投与量の確認記録を保存しました。")}>
        確認記録を残す
      </Button>
    </div>
  );
}`
    : `import * as React from "react";
import { Button, SafetyBanner, Toast } from "@gunjo/ui";

export function DosageReviewBanner() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast message={toastMessage} type="success" isVisible placement="inline" closeLabel="Close" onClose={() => setToastMessage(null)} />
        </div>
      ) : null}
      <SafetyBanner tone="warning" title="Recheck dosage">
        The interval from the previous dose is short. Confirm dosage and timing.
      </SafetyBanner>
      <Button variant="secondary" onClick={() => setToastMessage("Saved the dosage review note.")}>
        Save review note
      </Button>
    </div>
  );
}`;

  const infoCode = locale === "ja"
    ? `import * as React from "react";
import { Button, SafetyBanner, Toast } from "@gunjo/ui";

export function LabResultBanner() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast message={toastMessage} type="info" isVisible placement="inline" closeLabel="閉じる" onClose={() => setToastMessage(null)} />
        </div>
      ) : null}
      <SafetyBanner tone="info" title="情報共有：検査結果待ち">
        最終判断前に検査結果の更新を確認してください。
      </SafetyBanner>
      <Button variant="secondary" onClick={() => setToastMessage("検査結果の詳細を開きました。")}>
        検査結果を開く
      </Button>
    </div>
  );
}`
    : `import * as React from "react";
import { Button, SafetyBanner, Toast } from "@gunjo/ui";

export function LabResultBanner() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  return (
    <div className="relative flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4">
      {toastMessage ? (
        <div className="pointer-events-none absolute right-3 top-3 z-[100] w-[min(340px,calc(100%-1.5rem))]">
          <Toast message={toastMessage} type="info" isVisible placement="inline" closeLabel="Close" onClose={() => setToastMessage(null)} />
        </div>
      ) : null}
      <SafetyBanner tone="info" title="Information: lab result pending">
        Check the latest lab result before making a final decision.
      </SafetyBanner>
      <Button variant="secondary" onClick={() => setToastMessage("Opened the lab result detail.")}>
        Open lab result
      </Button>
    </div>
  );
}`;

  const propsData = [
    { name: "title", type: "ReactNode", description: locale === "ja" ? "警告や確認事項の見出しです。" : "Headline for the safety condition." },
    { name: "tone", type: '"destructive" | "warning" | "info"', default: '"destructive"', description: locale === "ja" ? "重要度です。destructiveはrole=alert、warning/infoはrole=statusです。" : "Severity. destructive uses role=alert; warning/info use role=status." },
    { name: "requireAck", type: "boolean", default: "false", description: locale === "ja" ? "明示的な確認ボタンを表示します。" : "Shows an explicit acknowledgement control." },
    { name: "acknowledged / defaultAcknowledged", type: "boolean", description: locale === "ja" ? "controlled / uncontrolled の確認状態です。" : "Controlled or initial acknowledgement state." },
    { name: "onAcknowledge", type: "() => void", description: locale === "ja" ? "確認ボタン押下時に呼ばれます。" : "Called when the acknowledgement button is pressed." },
    { name: "ackLabel / acknowledgedLabel", type: "ReactNode", description: locale === "ja" ? "確認前後のラベルです。" : "Labels before and after acknowledgement." },
    { name: "actions", type: "ReactNode", description: locale === "ja" ? "右側に置く関連操作です。" : "Optional trailing actions." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "SafetyBanner", href: "/docs/components/safety-banner" }, { name: "Button", href: "/docs/components/button" }, { name: "Tooltip", href: "/docs/components/tooltip" }]}
      relatedComponents={[{ name: "Alert", href: "/docs/components/alert" }, { name: "AlertDialog", href: "/docs/components/alert-dialog" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="lg">
        <SafetyBannerPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "destructive", title: locale === "ja" ? "確認必須" : "Requires acknowledgement", description: locale === "ja" ? "確認前は関連操作を無効にし、理由をツールチップで示します。" : "Related actions stay disabled with an explanatory tooltip until acknowledged.", preview: <SafetyBannerPreview locale={locale} />, code: usageCode, previewBodyWidth: "lg" },
            { key: "acked", title: locale === "ja" ? "確認済み" : "Acknowledged", description: locale === "ja" ? "確認済み状態では後続操作を有効にし、押下後は完了状態とトーストを表示します。" : "Acknowledged state enables the follow-up action; the action then shows a signed state and toast.", preview: <SafetyBannerPreview locale={locale} mode="acked" />, code: acknowledgedCode, previewBodyWidth: "lg" },
            { key: "warning", title: locale === "ja" ? "注意" : "Warning", description: locale === "ja" ? "確認は求めず、注意喚起に関連する記録操作をその場で完了できます。" : "Use warning for cautionary copy with a concrete follow-up action.", preview: <SafetyBannerPreview locale={locale} mode="warning" />, code: warningCode, previewBodyWidth: "lg" },
            { key: "info", title: locale === "ja" ? "情報" : "Information", description: locale === "ja" ? "補足情報はpoliteなstatusとして通知し、関連情報を開く操作を添えます。" : "Informational copy announces politely and can include an action that opens the related detail.", preview: <SafetyBannerPreview locale={locale} mode="info" />, code: infoCode, previewBodyWidth: "lg" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
