import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import inputsMetadata from "@design/inputs-metadata.json";

import { CoSignDemo } from "@/components/demos/CoSignDemo";

const meta = inputsMetadata as Record<string, { title?: string; description?: string }>;

const usageCode = `import { CoSign, CoSignBadge, type CoSignValue } from "@gunjo/ui"

const [value, setValue] = useState<CoSignValue>()

<CoSign
  primaryId="ns-tanaka"                      // the 2nd signer must differ from this
  attestations={[
    { id: "drug", label: "薬剤名・規格・用量を確認した" },
    { id: "patient", label: "患者・指示を確認した" },
  ]}
  value={value}            // set ⇒ signed (read-only); undefined ⇒ pending
  onSign={setValue}        // CoSignValue { signerId, reason?, attestedAt, attestations }
/>

<Button disabled={!value}>麻薬を投与</Button>   // gate the action on the co-sign`;

const propsData = [
  {
    name: "primaryId",
    type: "string",
    description: "The primary actor's id — the second signer must differ from this (same-person guard).",
  },
  {
    name: "attestations",
    type: "{ id: string; label: ReactNode }[]",
    description: "Attestation checkboxes — all must be ticked before signing.",
  },
  {
    name: "value",
    type: "CoSignValue",
    description: "Controlled signed value (undefined = pending). When set, renders the signed read-only state.",
  },
  {
    name: "onSign",
    type: "(value: CoSignValue) => void",
    description: "Fired when the second person signs. CoSignValue = { signerId, reason?, attestedAt, attestations }.",
  },
  {
    name: "requireReason",
    type: "boolean",
    description: "Require a reason before signing. Default false.",
  },
  {
    name: "minSignerLength",
    type: "number",
    default: "1",
    description: "Minimum signer-id length.",
  },
  {
    name: "signerLabel / reasonLabel / samePersonError",
    type: "ReactNode",
    description: "Field labels and the same-person error message.",
  },
  {
    name: "CoSignBadge",
    type: "{ value?: CoSignValue }",
    description: 'Companion badge — renders "2人確認 済" (success) when signed, "2人確認 要" (warning) when pending.',
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class names.",
  },
];

export default function CoSignDocPage() {
  const title = meta.coSign.title ?? "CoSign";
  const description = meta.coSign.description ?? "";

  return (
    <ComponentLayout title={title} description={description}>
      <ComponentPreview codeBlock={<CodeBlock code={usageCode} />}>
        <CoSignDemo />
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
