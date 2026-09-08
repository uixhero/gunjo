"use client";

import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";

import { ScanInputDemo } from "@/components/demos/ScanInputDemo";

const meta = inputsMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

const ORDER_LINES = [
  { jan: "4901234567894", name: "アスコルビン酸 500mg" },
  { jan: "4901234567900", name: "コットンパッド 80枚" },
];

export function ReceivingScanField() {
  const [counts, setCounts] = React.useState<Record<string, number>>({});

  function handleScan(code: string): ScanResult {
    const line = ORDER_LINES.find((l) => l.jan === code);
    if (!line) {
      return { ok: false, message: "発注に無い商品です（" + code + "）" };
    }
    setCounts((prev) => ({ ...prev, [line.jan]: (prev[line.jan] ?? 0) + 1 }));
    return { ok: true, message: line.name + " を1点 検品" };
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ScanInput
        label="バーコード / JAN をスキャン"
        placeholder="コードを入力して Enter"
        inputMode="numeric"
        onScan={handleScan}
        showFeed
      />
      <p className="text-sm text-muted-foreground">
        検品済み: {Object.values(counts).reduce((a, b) => a + b, 0)} 点
      </p>
    </div>
  );
}`;

const propsData = [
  {
    name: "onScan",
    type: "(code: string) => ScanResult | void",
    description:
      "Fires when a code is committed (scan gun types then Enter, or manual Enter). Return { ok, message } to drive the announcement, tone and feed.",
  },
  {
    name: "label",
    type: "ReactNode",
    description: "Accessible label rendered above the field.",
  },
  {
    name: "description",
    type: "ReactNode",
    description: "Helper text rendered under the field.",
  },
  {
    name: "retainFocus",
    type: "boolean",
    description: "Re-focus the field after each scan so a scan gun fires continuously. Default true.",
  },
  {
    name: "clearOnScan",
    type: "boolean",
    description: "Clear the field after each scan. Default true.",
  },
  {
    name: "onScannerOpen",
    type: "(action: ScanInputAction) => void",
    description: "Turns the leading barcode icon into a scan action. Open a scanner UI and call action.commit(code) to commit the read.",
  },
  {
    name: "scannerLabel",
    type: "string",
    description: "Accessible label and tooltip for the barcode scan action.",
  },
  {
    name: "lockMs",
    type: "number",
    description: "Ignore repeat commits within this many ms (scan guns can double-fire). Default 150.",
  },
  {
    name: "showFeed",
    type: "boolean",
    description: "Render a running feed of recent scans (newest first). Default false.",
  },
  {
    name: "feedLimit",
    type: "number",
    description: "Max feed entries retained. Default 8.",
  },
  {
    name: "icon",
    type: "ReactNode",
    description: "Leading adornment. Defaults to a barcode icon; pass null to hide.",
  },
  {
    name: "assertive",
    type: "boolean",
    description:
      'Announce results assertively (role="alert" + aria-live="assertive") instead of politely — for safety-critical scanning where a mismatch must interrupt. Default false.',
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names on the field wrapper.",
  },
];

const PRESCRIBED_JAN = "4901234567894";

function AssertiveScanPreview({ locale }: { locale: "en" | "ja" }) {
  const [matched, setMatched] = React.useState(0);

  const handleScan = (code: string): ScanResult => {
    if (code !== PRESCRIBED_JAN) {
      return {
        ok: false,
        message: locale === "ja"
          ? `この患者の処方と一致しません（${code}）`
          : `Does not match this patient's prescription (${code})`,
      };
    }
    setMatched((n) => n + 1);
    return {
      ok: true,
      message: locale === "ja" ? "処方と一致しました" : "Matches the prescription",
    };
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ScanInput
        label={locale === "ja" ? "薬剤のバーコードを照合" : "Scan the medication barcode"}
        description={locale === "ja"
          ? `一致する例: ${PRESCRIBED_JAN} / 一致しない例: 0000`
          : `A matching code: ${PRESCRIBED_JAN}. A mismatch: 0000`}
        placeholder={locale === "ja" ? "コードを入力して Enter" : "Type a code, then Enter"}
        inputMode="numeric"
        assertive
        onScan={handleScan}
      />
      <p className="text-sm text-muted-foreground">
        {locale === "ja" ? `照合できた回数: ${matched}` : `Matches so far: ${matched}`}
      </p>
    </div>
  );
}

function CameraScanPreview({ locale }: { locale: "en" | "ja" }) {
  const [reads, setReads] = React.useState<string[]>([]);

  const handleScan = (code: string): ScanResult => {
    setReads((prev) => [code, ...prev].slice(0, 3));
    return {
      ok: true,
      message: locale === "ja" ? `${code} を読み取りました` : `Read ${code}`,
    };
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ScanInput
        label={locale === "ja" ? "配送伝票の番号" : "Tracking number"}
        description={locale === "ja"
          ? "左のアイコンはカメラの代わりです。押すと決め打ちのコードを読んだことにします。"
          : "The icon on the left stands in for a camera: pressing it commits a fixed code."}
        placeholder={locale === "ja" ? "コードを入力して Enter" : "Type a code, then Enter"}
        inputMode="numeric"
        scannerLabel={locale === "ja" ? "カメラで読み取る" : "Scan with the camera"}
        onScannerOpen={(action) => action.commit("1234-5678-9012")}
        onScan={handleScan}
      />
      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {reads.map((code, index) => (
          <li key={`${code}-${index}`} className="font-mono">{code}</li>
        ))}
      </ul>
    </div>
  );
}

const ASSET_TAGS = [
  { tag: "A-1042", ja: "会議室 プロジェクター", en: "Meeting room projector", ownerJa: "総務部", ownerEn: "Facilities" },
  { tag: "A-1187", ja: "検査用ノートPC", en: "Test laptop", ownerJa: "品質保証部", ownerEn: "QA" },
];

function InspectScanPreview({ locale }: { locale: "en" | "ja" }) {
  const [found, setFound] = React.useState<(typeof ASSET_TAGS)[number] | null>(null);

  const handleScan = (code: string): ScanResult => {
    const asset = ASSET_TAGS.find((entry) => entry.tag === code) ?? null;
    setFound(asset);
    if (!asset) {
      return {
        ok: false,
        message: locale === "ja" ? `台帳にない管理番号です（${code}）` : `Not in the register (${code})`,
      };
    }
    return {
      ok: true,
      message: locale === "ja" ? `${asset.ja} を表示しました` : `Showing ${asset.en}`,
    };
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ScanInput
        label={locale === "ja" ? "備品の管理番号" : "Asset tag"}
        description={locale === "ja"
          ? "台帳にある例: A-1042 / A-1187"
          : "Codes in the register: A-1042, A-1187"}
        placeholder={locale === "ja" ? "コードを入力して Enter" : "Type a code, then Enter"}
        clearOnScan={false}
        retainFocus={false}
        onScan={handleScan}
      />
      {found ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md border bg-muted/30 p-3 text-sm">
          <dt className="text-muted-foreground">{locale === "ja" ? "品名" : "Item"}</dt>
          <dd className="text-foreground">{locale === "ja" ? found.ja : found.en}</dd>
          <dt className="text-muted-foreground">{locale === "ja" ? "管理部署" : "Owner"}</dt>
          <dd className="text-foreground">{locale === "ja" ? found.ownerJa : found.ownerEn}</dd>
        </dl>
      ) : null}
    </div>
  );
}

export default function ScanInputDocPage() {
  const { locale } = useLocale();
  const title = meta.scanInput.title ?? "ScanInput";
  const description = meta.scanInput.description ?? "";

  return (
    <ComponentLayout
      title={title}
      description={description}
      usedComponents={[
        { name: "Tooltip", href: "/docs/components/tooltip" },
        { name: "TooltipContent", href: "/docs/components/tooltip" },
        { name: "TooltipTrigger", href: "/docs/components/tooltip" },
      ]}
      relatedComponents={[
        { name: "ScanGate", href: "/docs/components/scan-gate" },
        { name: "Input", href: "/docs/components/input" },
        { name: "SearchInput", href: "/docs/components/search-input" },
        { name: "ActionQueue", href: "/docs/components/action-queue" },
      ]}
    >
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <ScanInputDemo />
      </ComponentPreview>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {locale === "ja"
            ? "読み取りの作法は現場によって変わります。読み上げに割り込ませるか（assertive）、先頭のアイコンをカメラを開くボタンにするか（onScannerOpen）、読んだコードを欄に残すか（clearOnScan と retainFocus）の3つが、その違いを吸収する口です。"
            : "How a scan should behave depends on the floor it happens on. Three props absorb the difference: whether a result interrupts the screen reader (assertive), whether the leading icon opens a scanner (onScannerOpen), and whether the code stays in the field afterwards (clearOnScan with retainFocus)."}
        </p>
        <ComponentDemoStates
          states={[
            {
              key: "assertive",
              title: locale === "ja" ? "取り違えを見逃せない場面" : "When a mismatch must not be missed",
              description: locale === "ja"
                ? "既定では結果を polite に読み上げるので、連続で読ませても互いに割り込みません。投薬や部品の照合のように、一致しないことが事故になる場面では assertive を付け、alert として割り込ませます。"
                : "By default a result is announced politely, so continuous scanning never interrupts itself. Where a mismatch is a safety event, such as medication or part verification, assertive raises it to an alert that cuts in.",
              preview: <AssertiveScanPreview locale={locale} />,
              code: locale === "ja"
                ? `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

const PRESCRIBED_JAN = "4901234567894";

export function MedicationCheckField() {
  const [matched, setMatched] = React.useState(0);

  const handleScan = (code: string): ScanResult => {
    if (code !== PRESCRIBED_JAN) {
      return { ok: false, message: "この患者の処方と一致しません" };
    }
    setMatched((n) => n + 1);
    return { ok: true, message: "処方と一致しました" };
  };

  return (
    <div className="flex flex-col gap-3">
      <ScanInput
        label="薬剤のバーコードを照合"
        placeholder="コードを入力して Enter"
        inputMode="numeric"
        assertive
        onScan={handleScan}
      />
      <p className="text-sm text-muted-foreground">
        照合できた回数: {matched}
      </p>
    </div>
  );
}`
                : `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

const PRESCRIBED_JAN = "4901234567894";

export function MedicationCheckField() {
  const [matched, setMatched] = React.useState(0);

  const handleScan = (code: string): ScanResult => {
    if (code !== PRESCRIBED_JAN) {
      return { ok: false, message: "Does not match this patient's prescription" };
    }
    setMatched((n) => n + 1);
    return { ok: true, message: "Matches the prescription" };
  };

  return (
    <div className="flex flex-col gap-3">
      <ScanInput
        label="Scan the medication barcode"
        placeholder="Type a code, then Enter"
        inputMode="numeric"
        assertive
        onScan={handleScan}
      />
      <p className="text-sm text-muted-foreground">
        Matches so far: {matched}
      </p>
    </div>
  );
}`,
            },
            {
              key: "scanner-action",
              title: locale === "ja" ? "先頭のアイコンをカメラにする" : "Turning the icon into a camera",
              description: locale === "ja"
                ? "onScannerOpen を渡すと、飾りだった先頭のバーコードが押せるボタンになります。カメラの画面を開き、読めたら action.commit(code) を呼ぶと、ハンディスキャナが打ったときと同じ道を通ります。名前は scannerLabel です。この見本ではカメラの代わりに決め打ちのコードを渡しています。"
                : "Passing onScannerOpen turns the decorative barcode into a real button. Open your camera view, and call action.commit(code) when it reads one: the code then travels the same path a scan gun would have used. scannerLabel names that button. This demo commits a fixed code instead of opening a camera.",
              preview: <CameraScanPreview locale={locale} />,
              code: locale === "ja"
                ? `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

export function TrackingNumberField() {
  const [reads, setReads] = React.useState<string[]>([]);

  const handleScan = (code: string): ScanResult => {
    setReads((prev) => [code, ...prev].slice(0, 3));
    return { ok: true, message: code + " を読み取りました" };
  };

  return (
    <div className="flex flex-col gap-3">
      <ScanInput
        label="配送伝票の番号"
        placeholder="コードを入力して Enter"
        inputMode="numeric"
        scannerLabel="カメラで読み取る"
        onScannerOpen={(action) => action.commit("1234-5678-9012")}
        onScan={handleScan}
      />
      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {reads.map((code, index) => (
          <li key={code + index} className="font-mono">{code}</li>
        ))}
      </ul>
    </div>
  );
}`
                : `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

export function TrackingNumberField() {
  const [reads, setReads] = React.useState<string[]>([]);

  const handleScan = (code: string): ScanResult => {
    setReads((prev) => [code, ...prev].slice(0, 3));
    return { ok: true, message: "Read " + code };
  };

  return (
    <div className="flex flex-col gap-3">
      <ScanInput
        label="Tracking number"
        placeholder="Type a code, then Enter"
        inputMode="numeric"
        scannerLabel="Scan with the camera"
        onScannerOpen={(action) => action.commit("1234-5678-9012")}
        onScan={handleScan}
      />
      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {reads.map((code, index) => (
          <li key={code + index} className="font-mono">{code}</li>
        ))}
      </ul>
    </div>
  );
}`,
            },
            {
              key: "keep-code",
              title: locale === "ja" ? "読んだコードを欄に残す" : "Leaving the code in the field",
              description: locale === "ja"
                ? "既定は「読んだら消して、そのまま次を待つ」です。何十点も連続で読む現場ではこれが正しいのですが、1点を引き当てて内容を確かめる画面では逆に困ります。clearOnScan={false} と retainFocus={false} にすると、読んだコードが残り、カーソルも欄に居座りません。"
                : "The default is clear the field and wait for the next one, which is right when someone is scanning dozens of items in a row. It gets in the way on a screen that looks one thing up and then shows it. clearOnScan={false} with retainFocus={false} keeps the code visible and lets focus move on.",
              preview: <InspectScanPreview locale={locale} />,
              code: locale === "ja"
                ? `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

type Asset = { tag: string; name: string; owner: string };

const ASSETS: Asset[] = [
  { tag: "A-1042", name: "会議室 プロジェクター", owner: "総務部" },
  { tag: "A-1187", name: "検査用ノートPC", owner: "品質保証部" },
];

export function AssetLookupField() {
  const [found, setFound] = React.useState<Asset | null>(null);

  const handleScan = (code: string): ScanResult => {
    const asset = ASSETS.find((entry) => entry.tag === code) ?? null;
    setFound(asset);
    if (!asset) {
      return { ok: false, message: "台帳にない管理番号です" };
    }
    return { ok: true, message: asset.name + " を表示しました" };
  };

  return (
    <div className="flex flex-col gap-3">
      <ScanInput
        label="備品の管理番号"
        placeholder="コードを入力して Enter"
        clearOnScan={false}
        retainFocus={false}
        onScan={handleScan}
      />
      {found ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md border p-3 text-sm">
          <dt className="text-muted-foreground">品名</dt>
          <dd>{found.name}</dd>
          <dt className="text-muted-foreground">管理部署</dt>
          <dd>{found.owner}</dd>
        </dl>
      ) : null}
    </div>
  );
}`
                : `import * as React from "react";
import { ScanInput, type ScanResult } from "@gunjo/ui";

type Asset = { tag: string; name: string; owner: string };

const ASSETS: Asset[] = [
  { tag: "A-1042", name: "Meeting room projector", owner: "Facilities" },
  { tag: "A-1187", name: "Test laptop", owner: "QA" },
];

export function AssetLookupField() {
  const [found, setFound] = React.useState<Asset | null>(null);

  const handleScan = (code: string): ScanResult => {
    const asset = ASSETS.find((entry) => entry.tag === code) ?? null;
    setFound(asset);
    if (!asset) {
      return { ok: false, message: "Not in the register" };
    }
    return { ok: true, message: "Showing " + asset.name };
  };

  return (
    <div className="flex flex-col gap-3">
      <ScanInput
        label="Asset tag"
        placeholder="Type a code, then Enter"
        clearOnScan={false}
        retainFocus={false}
        onScan={handleScan}
      />
      {found ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md border p-3 text-sm">
          <dt className="text-muted-foreground">Item</dt>
          <dd>{found.name}</dd>
          <dt className="text-muted-foreground">Owner</dt>
          <dd>{found.owner}</dd>
        </dl>
      ) : null}
    </div>
  );
}`,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
        <PropsTable data={propsData} />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
        <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
          <CodeBlock code={usageCode} />
        </div>
      </div>
    </ComponentLayout>
  );
}
