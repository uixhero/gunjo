"use client";

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
import displayMetadata from "@design/display-metadata.json";
import { Badge, TicketStub } from "@gunjo/ui";

type Locale = "ja" | "en";

function codeLabels(locale: Locale) {
  return locale === "ja" ? undefined : { barcode: "Barcode", qr: "QR code" };
}

function TicketStubPreview({ locale, mode = "coupon" }: { locale: Locale; mode?: "coupon" | "boarding" | "plain" }) {
  if (mode === "boarding") {
    return (
      <div className="w-full max-w-sm">
        <TicketStub value="NH106-X7K2QM-18K" format="qr" codeLabel="X7K2QM" codeKindLabels={codeLabels(locale)}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{locale === "ja" ? "搭乗券" : "Boarding pass"}</p>
                <p className="text-2xl font-bold tracking-tight">{"HND -> LAX"}</p>
              </div>
              <Badge variant="secondary">18K</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>{locale === "ja" ? "便名 NH106" : "Flight NH106"}</span>
              <span>{locale === "ja" ? "搭乗口 112" : "Gate 112"}</span>
              <span>{locale === "ja" ? "搭乗 21:40" : "Board 21:40"}</span>
            </div>
          </div>
        </TicketStub>
      </div>
    );
  }

  if (mode === "plain") {
    return (
      <div className="w-full max-w-sm">
        <TicketStub
          value="MEMBER-GUNJO-4488"
          codeLabel="4488"
          perforation={false}
          codeKindLabels={codeLabels(locale)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{locale === "ja" ? "会員証" : "Member card"}</p>
                <p className="text-2xl font-bold tracking-tight">Gunjo Pass</p>
              </div>
              <Badge variant="secondary">Silver</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === "ja" ? "受付で券面と会員番号を確認します。" : "Show this pass and member number at the counter."}
            </p>
          </div>
        </TicketStub>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <TicketStub
        value="CPN-GUNJO-KIOSK-3X-887412"
        codeLabel="887412"
        codeKindLabels={codeLabels(locale)}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">{locale === "ja" ? "Gunjo Kiosk ポイント3倍" : "Gunjo Kiosk triple points"}</span>
          <Badge variant="warning">{locale === "ja" ? "期間限定" : "Limited"}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {locale === "ja" ? "対象：駅ナカ Gunjo Kiosk 全店・2026/06/30まで" : "Valid at station Gunjo Kiosk stores through Jun 30, 2026"}
        </p>
      </TicketStub>
    </div>
  );
}

export default function TicketStubDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/ticket-stub", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.ticketStub.title ?? "TicketStub";
  const description = content?.description ?? metadata.ticketStub.description ?? "";

  const couponCode =
    locale === "ja"
      ? `import { Badge, TicketStub } from "@gunjo/ui";

export function CouponTicket() {
  return (
    <div className="w-full max-w-sm">
      <TicketStub value="CPN-GUNJO-KIOSK-3X-887412" codeLabel="887412">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">Gunjo Kiosk ポイント3倍</span>
          <Badge variant="warning">期間限定</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          対象：駅ナカ Gunjo Kiosk 全店・2026/06/30まで
        </p>
      </TicketStub>
    </div>
  );
}`
      : `import { Badge, TicketStub } from "@gunjo/ui";

export function CouponTicket() {
  return (
    <div className="w-full max-w-sm">
      <TicketStub
        value="CPN-GUNJO-KIOSK-3X-887412"
        codeLabel="887412"
        codeKindLabels={{ barcode: "Barcode", qr: "QR code" }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">Gunjo Kiosk triple points</span>
          <Badge variant="warning">Limited</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Valid at station Gunjo Kiosk stores through Jun 30, 2026
        </p>
      </TicketStub>
    </div>
  );
}`;

  const boardingCode =
    locale === "ja"
      ? `import { Badge, TicketStub } from "@gunjo/ui";

export function BoardingPass() {
  return (
    <div className="w-full max-w-sm">
      <TicketStub
        value="NH106-X7K2QM-18K"
        format="qr"
        codeLabel="X7K2QM"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">搭乗券</p>
              <p className="text-2xl font-bold tracking-tight">HND -&gt; LAX</p>
            </div>
            <Badge variant="secondary">18K</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <span>便名 NH106</span>
            <span>搭乗口 112</span>
            <span>搭乗 21:40</span>
          </div>
        </div>
      </TicketStub>
    </div>
  );
}`
      : `import { Badge, TicketStub } from "@gunjo/ui";

export function BoardingPass() {
  return (
    <div className="w-full max-w-sm">
      <TicketStub
        value="NH106-X7K2QM-18K"
        format="qr"
        codeLabel="X7K2QM"
        codeKindLabels={{ barcode: "Barcode", qr: "QR code" }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Boarding pass</p>
              <p className="text-2xl font-bold tracking-tight">HND -&gt; LAX</p>
            </div>
            <Badge variant="secondary">18K</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <span>Flight NH106</span>
            <span>Gate 112</span>
            <span>Board 21:40</span>
          </div>
        </div>
      </TicketStub>
    </div>
  );
}`;

  const plainCode =
    locale === "ja"
      ? `import { Badge, TicketStub } from "@gunjo/ui";

export function MemberPass() {
  return (
    <div className="w-full max-w-sm">
      <TicketStub
        value="MEMBER-GUNJO-4488"
        codeLabel="4488"
        perforation={false}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">会員証</p>
              <p className="text-2xl font-bold tracking-tight">Gunjo Pass</p>
            </div>
            <Badge variant="secondary">Silver</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            受付で券面と会員番号を確認します。
          </p>
        </div>
      </TicketStub>
    </div>
  );
}`
      : `import { Badge, TicketStub } from "@gunjo/ui";

export function MemberPass() {
  return (
    <div className="w-full max-w-sm">
      <TicketStub
        value="MEMBER-GUNJO-4488"
        codeLabel="4488"
        perforation={false}
        codeKindLabels={{ barcode: "Barcode", qr: "QR code" }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Member card</p>
              <p className="text-2xl font-bold tracking-tight">Gunjo Pass</p>
            </div>
            <Badge variant="secondary">Silver</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Show this pass and member number at the counter.
          </p>
        </div>
      </TicketStub>
    </div>
  );
}`;

  const usageCode = couponCode;

  const propsData = [
    { name: "value", type: "string", description: locale === "ja" ? "コードに埋め込む値です。" : "Encoded barcode or QR value." },
    { name: "format", type: '"code128" | "qr"', default: '"code128"', description: locale === "ja" ? "1次元バーコードまたはQRを選びます。" : "Chooses a one-dimensional barcode or QR matrix." },
    { name: "codeLabel", type: "ReactNode", description: locale === "ja" ? "コード下の可読ラベルです。既定は value です。" : "Human-readable label below the code. Defaults to value." },
    { name: "codeAlt", type: "string", description: locale === "ja" ? "コード画像のアクセシブル名です。" : "Accessible name for the rendered code image." },
    { name: "codeKindLabels", type: "{ barcode?: string; qr?: string }", description: locale === "ja" ? "codeAlt未指定時のコード種別名をローカライズします。" : "Localizes the code kind used to derive codeAlt." },
    { name: "formatCodeAlt", type: "(parts: { kindLabel: string; value: string; format }) => string", description: locale === "ja" ? "codeAlt未指定時にコード画像のアクセシブル名を組み立てます。既定は `${kindLabel}：${value}` です。codeAlt（全体上書き）が優先されます。" : "Composes the code image accessible name when codeAlt is omitted. Defaults to `${kindLabel}：${value}`. A full codeAlt still wins." },
    { name: "perforation", type: "boolean", default: "true", description: locale === "ja" ? "ミシン目のノッチと破線を表示します。" : "Shows the notch and dashed perforation divider." },
    { name: "code", type: "ReactNode", description: locale === "ja" ? "実スキャン可能なコードレンダリングで差し替えます。" : "Overrides the visual code with a production-scannable renderer." },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "TicketStub", href: "/docs/components/ticket-stub" }, { name: "Badge", href: "/docs/components/badge" }]}
      relatedComponents={[{ name: "ScanGate", href: "/docs/components/scan-gate" }, { name: "Img", href: "/docs/components/img" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <TicketStubPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            { key: "barcode", title: locale === "ja" ? "クーポンバーコード" : "Barcode coupon", description: locale === "ja" ? "既定ではcode128風の視覚バーコードを表示します。" : "The default renderer displays a deterministic barcode-like visual.", preview: <TicketStubPreview locale={locale} />, code: couponCode, previewBodyWidth: "md" },
            { key: "qr", title: locale === "ja" ? "QR搭乗券" : "QR boarding pass", description: locale === "ja" ? "format=\"qr\" でQR形状に切り替えます。" : "Use format=\"qr\" for a QR-shaped pass.", preview: <TicketStubPreview locale={locale} mode="boarding" />, code: boardingCode, previewBodyWidth: "md" },
            { key: "plain", title: locale === "ja" ? "ミシン目なし" : "No perforation", description: locale === "ja" ? "カードや会員証では perforation=false にします。" : "Set perforation=false for cards or memberships.", preview: <TicketStubPreview locale={locale} mode="plain" />, code: plainCode, previewBodyWidth: "md" },
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
