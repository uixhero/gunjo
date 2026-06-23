import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import feedbackMetadata from "@design/feedback-metadata.json";

import { SafetyBannerDemo } from "@/components/demos/SafetyBannerDemo";

const meta = feedbackMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { SafetyBanner, Button } from "@gunjo/ui"

// require acknowledgement, then gate the sign-off on the acked state
const [acked, setAcked] = useState(false)

<SafetyBanner
  tone="destructive"
  title="アレルギー警告：ペニシリン"
  requireAck
  acknowledged={acked}
  onAcknowledge={() => setAcked(true)}
>
  処方薬「アモキシシリン」は患者のアレルギーに該当します。投与は禁忌です。
</SafetyBanner>

<Button disabled={!acked}>処方を署名</Button>`;

const propsData = [
  {
    name: "title",
    type: "ReactNode",
    description: "The headline (the critical condition).",
  },
  {
    name: "tone",
    type: '"destructive" | "warning" | "info"',
    default: '"destructive"',
    description:
      "destructive (アレルギー/禁忌/異常) announces assertively (role=alert); warning/info announce politely (role=status).",
  },
  {
    name: "titleAs",
    type: '"h2" | "h3" | "h4" | "p"',
    default: '"h3"',
    description: "Heading level for the title (keep page heading order correct).",
  },
  {
    name: "requireAck",
    type: "boolean",
    description: "Require an explicit acknowledgement — renders the ack control and reflects the acked state.",
  },
  {
    name: "acknowledged / defaultAcknowledged",
    type: "boolean",
    description: "Controlled / initial acknowledged state. Read it to block a sign-off until cleared.",
  },
  {
    name: "onAcknowledge",
    type: "() => void",
    description: "Fired when the user acknowledges.",
  },
  {
    name: "ackLabel / acknowledgedLabel",
    type: "ReactNode",
    description: 'Ack button label (default "確認しました") / acknowledged note (default "確認済み").',
  },
  {
    name: "icon / actions",
    type: "ReactNode",
    description: "Leading icon override (defaults to a tone icon) / trailing actions (報告 / 詳細).",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Details / body.",
  },
];

export default function SafetyBannerDocPage() {
  const title = meta.safetyBanner.title ?? "SafetyBanner";
  const description = meta.safetyBanner.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <SafetyBannerDemo />
      </ComponentPreview>

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
